import { create } from "zustand";
import type { QuizQuestion, QuizAnswer, QuizMode } from "@roadready/shared";

/** Lifecycle of a quiz run. */
export type QuizPhase = "idle" | "running" | "completed";

export interface ActiveQuiz {
  slug: string;
  name: string;
}

interface GameStore {
  // ── Quiz lifecycle ────────────────────────────────────────────────────────
  quizPhase: QuizPhase;
  quizMode: QuizMode | null;
  activeQuiz: ActiveQuiz | null;

  // ── Questions ─────────────────────────────────────────────────────────────
  questions: QuizQuestion[];
  currentQuestion: QuizQuestion | null;
  questionIndex: number;
  totalQuestions: number;

  // ── Answers ───────────────────────────────────────────────────────────────
  answers: QuizAnswer[];
  quizScore: number;
  startedAt: number | null;

  // ── Actions ───────────────────────────────────────────────────────────────
  startQuiz: (
    mode: QuizMode,
    questions: QuizQuestion[],
    quiz: ActiveQuiz,
  ) => void;
  answerQuestion: (optionId: string, isCorrect: boolean) => void;
  nextQuestion: () => void;
  goToQuestion: (index: number) => void;
  finishQuiz: () => void;
  resetQuiz: () => void;
}

const EMPTY = {
  quizPhase: "idle" as QuizPhase,
  quizMode: null,
  activeQuiz: null,
  questions: [],
  currentQuestion: null,
  questionIndex: 0,
  totalQuestions: 0,
  answers: [],
  quizScore: 0,
  startedAt: null,
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...EMPTY,

  startQuiz: (mode, questions, quiz) =>
    set({
      quizPhase: "running",
      quizMode: mode,
      activeQuiz: quiz,
      questions,
      currentQuestion: questions[0] ?? null,
      questionIndex: 0,
      totalQuestions: questions.length,
      answers: [],
      quizScore: 0,
      startedAt: Date.now(),
    }),

  answerQuestion: (optionId, isCorrect) => {
    const { currentQuestion, answers } = get();
    if (!currentQuestion) return;

    // Re-answering the same question replaces the earlier answer.
    const without = answers.filter((a) => a.questionId !== currentQuestion.id);
    const next: QuizAnswer[] = [
      ...without,
      { questionId: currentQuestion.id, selectedOptionId: optionId, isCorrect },
    ];

    set({ answers: next, quizScore: next.filter((a) => a.isCorrect).length });
  },

  nextQuestion: () => {
    const { questionIndex, questions } = get();
    const nextIndex = questionIndex + 1;

    if (nextIndex >= questions.length) {
      set({ quizPhase: "completed", currentQuestion: null });
      return;
    }

    set({
      questionIndex: nextIndex,
      currentQuestion: questions[nextIndex] ?? null,
    });
  },

  goToQuestion: (index) => {
    const { questions } = get();
    if (index < 0 || index >= questions.length) return;
    set({ questionIndex: index, currentQuestion: questions[index] ?? null });
  },

  finishQuiz: () => set({ quizPhase: "completed", currentQuestion: null }),

  resetQuiz: () => set({ ...EMPTY }),
}));
