import type { Grade, QuizSource } from "@roadready/shared";
import prisma from "./prisma";
import { badRequest, forbidden, notFound } from "./http";

/** Topics with order 1–3 are free; anything beyond needs Premium. */
export const FREE_TOPIC_LIMIT = 3;

export const MAX_QUIZ_QUESTIONS = 60;

export function isTopicUnlocked(
  topic: { order: number; isPremium: boolean },
  userIsPremium: boolean,
): boolean {
  return userIsPremium || (!topic.isPremium && topic.order <= FREE_TOPIC_LIMIT);
}

export function gradeFor(scorePercent: number): Grade {
  if (scorePercent >= 90) return "A";
  if (scorePercent >= 80) return "B";
  if (scorePercent >= 70) return "C";
  if (scorePercent >= 60) return "D";
  return "F";
}

/** Fisher–Yates. `Math.random` is fine here — nothing security-sensitive. */
export function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

interface SelectionArgs {
  userId: string;
  userIsPremium: boolean;
  countryId: string;
  source: QuizSource;
  topicSlug?: string;
  limit?: number;
  examQuestionCount: number;
}

export interface Selection {
  questionIds: string[];
  topicId: string | null;
}

/**
 * Chooses the questions for a new quiz.
 *
 * Access is enforced here rather than in the route, so no source can be used as
 * a side door onto premium content: MISTAKES and BOOKMARKS are filtered down to
 * unlocked topics too, and a free user's mock exam is drawn from the free
 * topics rather than being refused outright.
 */
export async function selectQuestions(args: SelectionArgs): Promise<Selection> {
  const {
    userId,
    userIsPremium,
    countryId,
    source,
    topicSlug,
    limit,
    examQuestionCount,
  } = args;

  const cap = Math.min(limit ?? MAX_QUIZ_QUESTIONS, MAX_QUIZ_QUESTIONS);

  if (source === "TOPIC") {
    if (!topicSlug)
      throw badRequest('"topicSlug" is required when source is TOPIC');

    const topic = await prisma.topic.findUnique({ where: { slug: topicSlug } });
    if (!topic || !topic.isActive) throw notFound("Topic not found");
    if (topic.countryId !== countryId) {
      throw badRequest("That topic belongs to a different country");
    }
    if (!isTopicUnlocked(topic, userIsPremium)) {
      throw forbidden("This topic requires Premium");
    }

    const questions = await prisma.question.findMany({
      where: { topicId: topic.id, isActive: true },
      orderBy: { order: "asc" },
      select: { id: true },
      take: cap,
    });

    return { questionIds: questions.map((q) => q.id), topicId: topic.id };
  }

  const unlockedTopics = await prisma.topic.findMany({
    where: { countryId, isActive: true },
    select: { id: true, order: true, isPremium: true },
  });
  const unlockedTopicIds = unlockedTopics
    .filter((t) => isTopicUnlocked(t, userIsPremium))
    .map((t) => t.id);

  if (unlockedTopicIds.length === 0) {
    throw forbidden("No topics are available to you in this country");
  }

  if (source === "EXAM") {
    const pool = await prisma.question.findMany({
      where: { topicId: { in: unlockedTopicIds }, isActive: true },
      select: { id: true },
    });
    const size = Math.min(
      limit ?? examQuestionCount,
      pool.length,
      MAX_QUIZ_QUESTIONS,
    );
    return {
      questionIds: shuffle(pool.map((q) => q.id)).slice(0, size),
      topicId: null,
    };
  }

  if (source === "MISTAKES") {
    const stats = await prisma.questionStat.findMany({
      where: {
        userId,
        timesWrong: { gt: 0 },
        question: { isActive: true, topicId: { in: unlockedTopicIds } },
      },
      orderBy: [{ timesWrong: "desc" }, { lastSeenAt: "asc" }],
      select: { questionId: true },
      take: cap,
    });
    return { questionIds: stats.map((s) => s.questionId), topicId: null };
  }

  // BOOKMARKS
  const stats = await prisma.questionStat.findMany({
    where: {
      userId,
      isBookmarked: true,
      question: { isActive: true, topicId: { in: unlockedTopicIds } },
    },
    orderBy: { lastSeenAt: "desc" },
    select: { questionId: true },
    take: cap,
  });
  return { questionIds: stats.map((s) => s.questionId), topicId: null };
}
