import { Router } from "express";
import type {
  AnswerQuestionResponse,
  QuizMode,
  QuizResult,
  QuizSource,
} from "@roadready/shared";
import { Prisma } from "@prisma/client";
import prisma from "../lib/prisma";
import {
  badRequest,
  conflict,
  notFound,
  oneOf,
  optionalInt,
  optionalStr,
  route,
  str,
} from "../lib/http";
import { requireAuth, type AuthRequest } from "../middleware/auth";
import { toQuizDetail, toQuizQuestion, toQuizSummary } from "../lib/serialize";
import { gradeFor, selectQuestions } from "../lib/quiz";

const router = Router();

const MODES: readonly QuizMode[] = ["PRACTICE", "EXAM"];
const SOURCES: readonly QuizSource[] = [
  "TOPIC",
  "EXAM",
  "MISTAKES",
  "BOOKMARKS",
];

const quizInclude = {
  country: true,
  topic: true,
  items: {
    orderBy: { order: "asc" },
    include: {
      question: { include: { options: true, topic: true } },
    },
  },
} as const;

type LoadedQuiz = Prisma.QuizGetPayload<{ include: typeof quizInclude }>;

async function loadQuiz(id: string, userId: string): Promise<LoadedQuiz> {
  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: quizInclude,
  });
  // A quiz belonging to someone else is reported as missing rather than
  // forbidden, so ids cannot be probed for existence.
  if (!quiz || quiz.userId !== userId) throw notFound("Quiz not found");
  return quiz;
}

async function bookmarkedIds(
  userId: string,
  questionIds: string[],
): Promise<Set<string>> {
  if (questionIds.length === 0) return new Set();
  const rows = await prisma.questionStat.findMany({
    where: { userId, isBookmarked: true, questionId: { in: questionIds } },
    select: { questionId: true },
  });
  return new Set(rows.map((r) => r.questionId));
}

/**
 * Feedback is revealed once the quiz is finished, or immediately after
 * answering in practice mode. In exam mode nothing is revealed until the quiz
 * completes — that is what keeps the exam an exam.
 */
function revealFor(
  quiz: { status: string; mode: QuizMode },
  answered: boolean,
) {
  return quiz.status === "COMPLETED" || (quiz.mode === "PRACTICE" && answered);
}

function serializeQuiz(quiz: LoadedQuiz, bookmarks: Set<string>) {
  return toQuizDetail(
    quiz,
    quiz.items.map((item) =>
      toQuizQuestion(item, item.question, {
        reveal: revealFor(quiz, item.answeredAt !== null),
        isBookmarked: bookmarks.has(item.questionId),
      }),
    ),
  );
}

// POST /api/quizzes — create a quiz and freeze its question set
router.post(
  "/",
  requireAuth,
  route(async (req: AuthRequest, res) => {
    const countryCode = str(req.body, "countryCode").toUpperCase();
    const mode = oneOf(req.body, "mode", MODES);
    const source = oneOf(req.body, "source", SOURCES);
    const topicSlug = optionalStr(req.body, "topicSlug");
    const limit = optionalInt(req.body, "limit");

    if (limit !== undefined && limit < 1)
      throw badRequest('"limit" must be at least 1');

    const [country, user] = await Promise.all([
      prisma.country.findUnique({ where: { code: countryCode } }),
      prisma.user.findUnique({ where: { id: req.userId! } }),
    ]);

    if (!country || !country.isActive) throw notFound("Country not found");
    if (!user) throw notFound("User not found");

    const { questionIds, topicId } = await selectQuestions({
      userId: user.id,
      userIsPremium: user.isPremium,
      countryId: country.id,
      source,
      topicSlug,
      limit,
      examQuestionCount: country.examQuestionCount,
    });

    if (questionIds.length === 0) {
      throw badRequest(
        source === "MISTAKES"
          ? "You have no questions to review yet — answer some questions first"
          : source === "BOOKMARKS"
            ? "You have not bookmarked any questions yet"
            : "No questions are available for that selection",
      );
    }

    const quiz = await prisma.quiz.create({
      data: {
        userId: user.id,
        countryId: country.id,
        topicId,
        mode,
        source,
        totalQuestions: questionIds.length,
        items: {
          create: questionIds.map((questionId, i) => ({
            questionId,
            order: i + 1,
          })),
        },
      },
      include: quizInclude,
    });

    res
      .status(201)
      .json(serializeQuiz(quiz, await bookmarkedIds(user.id, questionIds)));
  }),
);

// GET /api/quizzes — history, newest first
router.get(
  "/",
  requireAuth,
  route(async (req: AuthRequest, res) => {
    const quizzes = await prisma.quiz.findMany({
      where: { userId: req.userId! },
      orderBy: { startedAt: "desc" },
      take: 25,
      include: {
        country: true,
        topic: true,
        items: { select: { answeredAt: true } },
      },
    });
    res.json(quizzes.map(toQuizSummary));
  }),
);

// GET /api/quizzes/:id
router.get(
  "/:id",
  requireAuth,
  route(async (req: AuthRequest, res) => {
    const quiz = await loadQuiz(req.params.id, req.userId!);
    const bookmarks = await bookmarkedIds(
      req.userId!,
      quiz.items.map((i) => i.questionId),
    );
    res.json(serializeQuiz(quiz, bookmarks));
  }),
);

// POST /api/quizzes/:id/answer
router.post(
  "/:id/answer",
  requireAuth,
  route(async (req: AuthRequest, res) => {
    const questionId = str(req.body, "questionId");
    const optionId = str(req.body, "optionId");

    const quiz = await loadQuiz(req.params.id, req.userId!);
    if (quiz.status !== "IN_PROGRESS")
      throw conflict("This quiz is already finished");

    const item = quiz.items.find((i) => i.questionId === questionId);
    if (!item) throw notFound("That question is not part of this quiz");

    // Practice mode shows the answer as soon as you commit, so letting the same
    // question be re-answered would let a user farm a perfect score.
    if (quiz.mode === "PRACTICE" && item.answeredAt !== null) {
      throw conflict("You have already answered this question");
    }

    const option = item.question.options.find((o) => o.id === optionId);
    if (!option)
      throw badRequest("That option does not belong to this question");

    await prisma.quizItem.update({
      where: { id: item.id },
      data: {
        selectedOptionId: option.id,
        isCorrect: option.isCorrect,
        answeredAt: new Date(),
      },
    });

    const answeredCount = await prisma.quizItem.count({
      where: { quizId: quiz.id, answeredAt: { not: null } },
    });

    const reveal = quiz.mode === "PRACTICE";
    const payload: AnswerQuestionResponse = {
      recorded: true,
      answeredCount,
      isCorrect: reveal ? option.isCorrect : null,
      correctOptionId: reveal
        ? (item.question.options.find((o) => o.isCorrect)?.id ?? null)
        : null,
      explanation: reveal ? item.question.explanation : null,
    };

    res.json(payload);
  }),
);

// POST /api/quizzes/:id/complete — grade the quiz and fold it into progress
router.post(
  "/:id/complete",
  requireAuth,
  route(async (req: AuthRequest, res) => {
    const userId = req.userId!;
    const quiz = await loadQuiz(req.params.id, userId);

    // Completing twice (a refresh, a double click) returns the same result
    // rather than failing — the second call is not a mistake worth surfacing.
    if (quiz.status === "COMPLETED") {
      const bookmarks = await bookmarkedIds(
        userId,
        quiz.items.map((i) => i.questionId),
      );
      const detail = serializeQuiz(quiz, bookmarks);
      const result: QuizResult = {
        ...detail,
        wrongQuestionIds: quiz.items
          .filter((i) => i.isCorrect === false)
          .map((i) => i.questionId),
      };
      res.json(result);
      return;
    }

    const correctCount = quiz.items.filter((i) => i.isCorrect === true).length;
    const scorePercent =
      quiz.totalQuestions === 0
        ? 0
        : Math.round((correctCount / quiz.totalQuestions) * 100);
    const passed = scorePercent >= quiz.country.examPassPercent;
    const completedAt = new Date();

    await prisma.$transaction(async (tx) => {
      await tx.quiz.update({
        where: { id: quiz.id },
        data: {
          status: "COMPLETED",
          correctCount,
          scorePercent,
          passed,
          grade: gradeFor(scorePercent),
          completedAt,
        },
      });

      // Per-question history is written here rather than on each answer, so an
      // abandoned quiz never pollutes the user's mistake list.
      for (const item of quiz.items) {
        if (item.answeredAt === null) continue;
        const wasCorrect = item.isCorrect === true;
        await tx.questionStat.upsert({
          where: {
            userId_questionId: { userId, questionId: item.questionId },
          },
          create: {
            userId,
            questionId: item.questionId,
            timesSeen: 1,
            timesCorrect: wasCorrect ? 1 : 0,
            timesWrong: wasCorrect ? 0 : 1,
            lastSeenAt: completedAt,
          },
          update: {
            timesSeen: { increment: 1 },
            ...(wasCorrect
              ? { timesCorrect: { increment: 1 } }
              : { timesWrong: { increment: 1 } }),
            lastSeenAt: completedAt,
          },
        });
      }

      if (quiz.topicId) {
        const existing = await tx.topicProgress.findUnique({
          where: {
            userId_topicId: { userId, topicId: quiz.topicId },
          },
        });

        // A topic once passed stays COMPLETED — a later practice run that goes
        // badly should not take a completion badge away.
        const status =
          passed || existing?.status === "COMPLETED"
            ? "COMPLETED"
            : "IN_PROGRESS";

        await tx.topicProgress.upsert({
          where: { userId_topicId: { userId, topicId: quiz.topicId } },
          create: {
            userId,
            topicId: quiz.topicId,
            status,
            bestScorePercent: scorePercent,
            attemptCount: 1,
            passCount: passed ? 1 : 0,
            lastAttemptAt: completedAt,
          },
          update: {
            status,
            bestScorePercent: Math.max(
              existing?.bestScorePercent ?? 0,
              scorePercent,
            ),
            attemptCount: { increment: 1 },
            ...(passed && { passCount: { increment: 1 } }),
            lastAttemptAt: completedAt,
          },
        });
      }
    });

    const finished = await loadQuiz(quiz.id, userId);
    const bookmarks = await bookmarkedIds(
      userId,
      finished.items.map((i) => i.questionId),
    );
    const result: QuizResult = {
      ...serializeQuiz(finished, bookmarks),
      wrongQuestionIds: finished.items
        .filter((i) => i.isCorrect === false)
        .map((i) => i.questionId),
    };

    res.json(result);
  }),
);

export default router;
