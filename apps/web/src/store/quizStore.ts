import { create } from "zustand";
import type { QuizDetail, QuizQuestion } from "@roadready/shared";
import { api } from "../utils/api";

/**
 * Drives one run through a quiz.
 *
 * The server owns scoring and answer reveal; this store only tracks where the
 * user is and what the server has told us so far. `selectedOptionId` is the
 * pending choice for the current question — it becomes an answer only once
 * `submitAnswer` succeeds.
 */

export type QuestionPhase = "answering" | "revealed";

interface QuizStore {
  quiz: QuizDetail | null;
  index: number;
  /** Pending selection per question id, before it is submitted. */
  selections: Record<string, string>;
  submitting: boolean;
  error: string | null;

  load: (quiz: QuizDetail) => void;
  clear: () => void;
  select: (questionId: string, optionId: string) => void;
  goTo: (index: number) => void;
  next: () => void;
  previous: () => void;
  setError: (error: string | null) => void;
  submitAnswer: () => Promise<void>;
  toggleBookmark: (questionId: string) => Promise<void>;
}

function replaceQuestion(
  quiz: QuizDetail,
  questionId: string,
  patch: Partial<QuizQuestion>,
): QuizDetail {
  return {
    ...quiz,
    questions: quiz.questions.map((q) =>
      q.id === questionId ? { ...q, ...patch } : q,
    ),
  };
}

export const useQuizStore = create<QuizStore>((set, get) => ({
  quiz: null,
  index: 0,
  selections: {},
  submitting: false,
  error: null,

  load: (quiz) => {
    // Resuming an in-progress quiz should drop the user on the first unanswered
    // question rather than back at the start.
    const firstUnanswered = quiz.questions.findIndex(
      (q) => q.selectedOptionId === null,
    );
    const selections: Record<string, string> = {};
    for (const q of quiz.questions) {
      if (q.selectedOptionId) selections[q.id] = q.selectedOptionId;
    }
    set({
      quiz,
      index: firstUnanswered === -1 ? 0 : firstUnanswered,
      selections,
      error: null,
      submitting: false,
    });
  },

  clear: () => set({ quiz: null, index: 0, selections: {}, error: null }),

  select: (questionId, optionId) =>
    set((s) => {
      const question = s.quiz?.questions.find((q) => q.id === questionId);
      // Once an answer is revealed the choice is final — ignore further clicks.
      if (!question || question.correctOptionId !== null) return s;
      return {
        selections: { ...s.selections, [questionId]: optionId },
        error: null,
      };
    }),

  goTo: (index) =>
    set((s) => {
      if (!s.quiz) return s;
      const clamped = Math.max(0, Math.min(index, s.quiz.questions.length - 1));
      return { index: clamped, error: null };
    }),

  next: () => get().goTo(get().index + 1),
  previous: () => get().goTo(get().index - 1),
  setError: (error) => set({ error }),

  submitAnswer: async () => {
    const { quiz, index, selections } = get();
    if (!quiz) return;

    const question = quiz.questions[index];
    const optionId = selections[question.id];
    if (!optionId || get().submitting) return;

    set({ submitting: true, error: null });
    try {
      const result = await api.quizzes.answer(quiz.id, {
        questionId: question.id,
        optionId,
      });
      set((s) => ({
        quiz: s.quiz
          ? replaceQuestion(s.quiz, question.id, {
              selectedOptionId: optionId,
              isCorrect: result.isCorrect,
              correctOptionId: result.correctOptionId,
              explanation: result.explanation,
            })
          : s.quiz,
        submitting: false,
      }));
    } catch (err) {
      set({
        submitting: false,
        error:
          err instanceof Error ? err.message : "Could not save your answer",
      });
      throw err;
    }
  },

  toggleBookmark: async (questionId) => {
    const { quiz } = get();
    if (!quiz) return;

    // Optimistic — a failed bookmark is not worth blocking the quiz for, so it
    // is rolled back quietly if the request fails.
    const current =
      quiz.questions.find((q) => q.id === questionId)?.isBookmarked ?? false;
    set({
      quiz: replaceQuestion(quiz, questionId, { isBookmarked: !current }),
    });

    try {
      const result = await api.questions.toggleBookmark(questionId);
      set((s) => ({
        quiz: s.quiz
          ? replaceQuestion(s.quiz, questionId, {
              isBookmarked: result.isBookmarked,
            })
          : s.quiz,
      }));
    } catch {
      set((s) => ({
        quiz: s.quiz
          ? replaceQuestion(s.quiz, questionId, { isBookmarked: current })
          : s.quiz,
      }));
    }
  },
}));

/** Whether the current question's answer has been revealed by the server. */
export function phaseOf(question: QuizQuestion): QuestionPhase {
  return question.correctOptionId !== null ? "revealed" : "answering";
}
