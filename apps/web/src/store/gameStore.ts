import { create } from "zustand";
import type { ScenarioConfig, CarState, Objective } from "@roadready/shared";

export type ScenarioPhase = "idle" | "running" | "passed" | "failed";
export type DriveMode = "manual" | "auto";

/** How the user launched the scenario. Practice teaches; Test scores. */
export type AttemptMode = "practice" | "test";

/** Result of the currently shown MCQ. `null` = no MCQ active. */
export type McqResult = "pending" | "correct" | "wrong" | null;

export interface McqOption {
  id: string;
  text: string;
}

/**
 * A single MCQ shown in the test-mode popup. `correctOptionId` + `explanation`
 * come from the auth-guarded answers endpoint and power client-side scoring of
 * the per-scenario test (the graded Full Test scores server-side instead).
 */
export interface McqQuestion {
  id: string;
  questionText: string;
  /** DB question order — used to filter which questions a decision point asks. */
  order: number;
  options: McqOption[];
  correctOptionId?: string;
  explanation?: string;
}

/** A teaching panel shown at a decision point in PRACTICE mode. */
export interface ActiveTeaching {
  id: string; // matches the decision/objective id
  prompt: string; // the situation
  teaching: string; // the rule explanation
}

/** One answered MCQ, recorded for the per-scenario test recap. */
export interface McqAnswerRecord {
  questionId: string;
  questionText: string;
  selectedOptionId: string;
  selectedOptionText: string;
  correctOptionId?: string;
  correctOptionText?: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface ActiveChallenge {
  id: string;
  prompt: string;
  instruction: string;
  correctKey: string; // e.g. 'Space', 'ArrowLeft'
  correctKeyLabel: string; // e.g. 'SPACE', '← LEFT'
  result: "pending" | "correct" | "wrong";
  wrongKeyLabel?: string;
}

interface GameStore {
  // ── Scenario ──────────────────────────────────────────────────────────────
  activeScenario: ScenarioConfig | null;
  scenarioPhase: ScenarioPhase;
  objectives: Objective[];
  elapsedSeconds: number;
  /** Bumped on each (re)start so the car resets to spawn and decisions re-arm. */
  runId: number;
  // ── Car ───────────────────────────────────────────────────────────────────
  carState: CarState | null;
  isPaused: boolean;
  driveMode: DriveMode;
  // ── Attempt mode (practice teaches; test scores) ───────────────────────────
  attemptMode: AttemptMode;
  // ── Challenges (key-press, legacy) ─────────────────────────────────────────
  activeChallenge: ActiveChallenge | null;
  resolvedChallengeIds: Record<string, boolean>;
  // ── Teaching panel (practice mode) ─────────────────────────────────────────
  activeTeaching: ActiveTeaching | null;
  // ── MCQ sequence (test mode) ───────────────────────────────────────────────
  mcqQueue: McqQuestion[]; // questions still to ask for the current decision
  activeMcq: McqQuestion | null; // currently shown question
  mcqResult: McqResult;
  mcqSelectedOptionId: string | null;
  mcqDecisionId: string | null; // objective the running MCQ sequence completes
  mcqAsked: number; // running per-scenario score (accumulates across decisions)
  mcqCorrect: number;
  mcqAnswers: McqAnswerRecord[]; // recap for the per-scenario test results
  // ── Full Test (graded, server-scored TestSession) ──────────────────────────
  ftSessionId: string | null; // active TestSession id; non-null ⇒ full-test run
  ftSubmitting: boolean; // an answer POST is in flight
  // ── Actions ───────────────────────────────────────────────────────────────
  startScenario: (scenario: ScenarioConfig) => void;
  setScenarioPhase: (phase: ScenarioPhase) => void;
  completeObjective: (id: string) => void;
  setCarState: (state: CarState) => void;
  setPaused: (paused: boolean) => void;
  setElapsed: (seconds: number) => void;
  resetScenario: () => void;
  setDriveMode: (mode: DriveMode) => void;
  setAttemptMode: (mode: AttemptMode) => void;
  triggerChallenge: (c: Omit<ActiveChallenge, "result">) => void;
  resolveChallenge: (
    result: "correct" | "wrong",
    wrongKeyLabel?: string,
  ) => void;
  clearChallenge: () => void;
  // Teaching (practice mode)
  triggerTeaching: (t: ActiveTeaching) => void;
  resolveTeaching: () => void;
  // MCQ actions (test mode)
  startMcqSequence: (decisionId: string, questions: McqQuestion[]) => void;
  selectMcqOption: (id: string) => void;
  submitMcq: () => void;
  advanceMcq: () => void;
  finishMcq: () => void;
  resetMcq: () => void;
  // Full Test (server-scored)
  setFtSession: (id: string | null) => void;
  setFtSubmitting: (submitting: boolean) => void;
  submitMcqServer: (isCorrect: boolean, explanation?: string) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  activeScenario: null,
  scenarioPhase: "idle",
  objectives: [],
  elapsedSeconds: 0,
  runId: 0,
  carState: null,
  isPaused: false,
  driveMode: "manual",
  attemptMode: "practice",
  activeChallenge: null,
  resolvedChallengeIds: {},
  activeTeaching: null,
  mcqQueue: [],
  activeMcq: null,
  mcqResult: null,
  mcqSelectedOptionId: null,
  mcqDecisionId: null,
  mcqAsked: 0,
  mcqCorrect: 0,
  mcqAnswers: [],
  ftSessionId: null,
  ftSubmitting: false,

  startScenario: (scenario) =>
    set((s) => ({
      activeScenario: scenario,
      scenarioPhase: "running",
      objectives: scenario.objectives.map((o) => ({ ...o, completed: false })),
      elapsedSeconds: 0,
      runId: s.runId + 1,
      activeChallenge: null,
      resolvedChallengeIds: {},
      activeTeaching: null,
      // Reset the MCQ run, but NOT attemptMode — Simulation.tsx sets that from
      // the route query string, and the two calls must be order-independent.
      mcqQueue: [],
      activeMcq: null,
      mcqResult: null,
      mcqSelectedOptionId: null,
      mcqDecisionId: null,
      mcqAsked: 0,
      mcqCorrect: 0,
      mcqAnswers: [],
      ftSessionId: null,
      ftSubmitting: false,
    })),

  setScenarioPhase: (scenarioPhase) => set({ scenarioPhase }),

  completeObjective: (id) =>
    set((s) => ({
      objectives: s.objectives.map((o) =>
        o.id === id ? { ...o, completed: true } : o,
      ),
    })),

  setCarState: (carState) => set({ carState }),
  setPaused: (isPaused) => set({ isPaused }),
  setElapsed: (elapsedSeconds) => set({ elapsedSeconds }),
  setDriveMode: (driveMode) => set({ driveMode }),
  setAttemptMode: (attemptMode) => set({ attemptMode }),

  triggerChallenge: (c) =>
    set({ activeChallenge: { ...c, result: "pending" } }),

  resolveChallenge: (result, wrongKeyLabel) =>
    set((s) => ({
      activeChallenge: s.activeChallenge
        ? { ...s.activeChallenge, result, wrongKeyLabel }
        : null,
      resolvedChallengeIds:
        result === "correct" && s.activeChallenge
          ? { ...s.resolvedChallengeIds, [s.activeChallenge.id]: true }
          : s.resolvedChallengeIds,
      // Also mark the matching objective as completed so ResultsScreen shows it
      objectives:
        result === "correct" && s.activeChallenge
          ? s.objectives.map((o) =>
              o.id === s.activeChallenge!.id ? { ...o, completed: true } : o,
            )
          : s.objectives,
    })),

  clearChallenge: () => set({ activeChallenge: null }),

  // ── Teaching (practice mode) ─────────────────────────────────────────────────
  triggerTeaching: (activeTeaching) => set({ activeTeaching }),

  // Continue from a teaching panel: complete its objective and let the car resume.
  resolveTeaching: () =>
    set((s) => {
      const id = s.activeTeaching?.id;
      return {
        activeTeaching: null,
        resolvedChallengeIds: id
          ? { ...s.resolvedChallengeIds, [id]: true }
          : s.resolvedChallengeIds,
        objectives: id
          ? s.objectives.map((o) =>
              o.id === id ? { ...o, completed: true } : o,
            )
          : s.objectives,
      };
    }),

  // ── MCQ sequence (test mode) ─────────────────────────────────────────────────
  // Counters/recap accumulate across decisions and reset only on (re)start.
  startMcqSequence: (decisionId, questions) =>
    set(() => {
      const [first, ...rest] = questions;
      return {
        mcqDecisionId: decisionId,
        activeMcq: first ?? null,
        mcqQueue: rest,
        mcqResult: first ? "pending" : null,
        mcqSelectedOptionId: null,
      };
    }),

  selectMcqOption: (id) =>
    set((s) => (s.mcqResult === "pending" ? { mcqSelectedOptionId: id } : {})),

  submitMcq: () =>
    set((s) => {
      const q = s.activeMcq;
      if (!q || s.mcqResult !== "pending" || !s.mcqSelectedOptionId) {
        return {};
      }
      const selected = q.options.find((o) => o.id === s.mcqSelectedOptionId);
      const correct = q.options.find((o) => o.id === q.correctOptionId);
      const isCorrect = s.mcqSelectedOptionId === q.correctOptionId;
      const record: McqAnswerRecord = {
        questionId: q.id,
        questionText: q.questionText,
        selectedOptionId: s.mcqSelectedOptionId,
        selectedOptionText: selected?.text ?? "",
        correctOptionId: q.correctOptionId,
        correctOptionText: correct?.text,
        isCorrect,
        explanation: q.explanation,
      };
      return {
        mcqResult: isCorrect ? "correct" : "wrong",
        mcqAsked: s.mcqAsked + 1,
        mcqCorrect: s.mcqCorrect + (isCorrect ? 1 : 0),
        mcqAnswers: [...s.mcqAnswers, record],
      };
    }),

  // Advance to the next question in the current decision's queue.
  advanceMcq: () =>
    set((s) => {
      const [next, ...rest] = s.mcqQueue;
      return next
        ? {
            activeMcq: next,
            mcqQueue: rest,
            mcqResult: "pending" as const,
            mcqSelectedOptionId: null,
          }
        : {
            activeMcq: null,
            mcqQueue: [],
            mcqResult: null,
            mcqSelectedOptionId: null,
          };
    }),

  // Finish the current decision's MCQ run: complete its objective and let the
  // car resume. Keeps mcqAsked/mcqCorrect/mcqAnswers for the results recap.
  finishMcq: () =>
    set((s) => {
      const id = s.mcqDecisionId;
      return {
        activeMcq: null,
        mcqQueue: [],
        mcqResult: null,
        mcqSelectedOptionId: null,
        mcqDecisionId: null,
        resolvedChallengeIds: id
          ? { ...s.resolvedChallengeIds, [id]: true }
          : s.resolvedChallengeIds,
        objectives: id
          ? s.objectives.map((o) =>
              o.id === id ? { ...o, completed: true } : o,
            )
          : s.objectives,
      };
    }),

  resetMcq: () =>
    set({
      mcqQueue: [],
      activeMcq: null,
      mcqResult: null,
      mcqSelectedOptionId: null,
      mcqDecisionId: null,
      mcqAsked: 0,
      mcqCorrect: 0,
      mcqAnswers: [],
    }),

  // ── Full Test (server-scored) ────────────────────────────────────────────────
  setFtSession: (ftSessionId) => set({ ftSessionId }),
  setFtSubmitting: (ftSubmitting) => set({ ftSubmitting }),

  // Like submitMcq, but the verdict + explanation come from the server (the Full
  // Test uses the isCorrect-hidden bank). Injects the explanation into activeMcq
  // so the overlay can show it, and accumulates the running score + recap.
  submitMcqServer: (isCorrect, explanation) =>
    set((s) => {
      const q = s.activeMcq;
      if (!q || s.mcqResult !== "pending" || !s.mcqSelectedOptionId) {
        return {};
      }
      const selected = q.options.find((o) => o.id === s.mcqSelectedOptionId);
      const record: McqAnswerRecord = {
        questionId: q.id,
        questionText: q.questionText,
        selectedOptionId: s.mcqSelectedOptionId,
        selectedOptionText: selected?.text ?? "",
        isCorrect,
        explanation,
      };
      return {
        activeMcq: { ...q, explanation },
        mcqResult: isCorrect ? "correct" : "wrong",
        mcqAsked: s.mcqAsked + 1,
        mcqCorrect: s.mcqCorrect + (isCorrect ? 1 : 0),
        mcqAnswers: [...s.mcqAnswers, record],
      };
    }),

  resetScenario: () =>
    set((s) => ({
      scenarioPhase: "running",
      elapsedSeconds: 0,
      runId: s.runId + 1,
      activeChallenge: null,
      resolvedChallengeIds: {},
      activeTeaching: null,
      mcqQueue: [],
      activeMcq: null,
      mcqResult: null,
      mcqSelectedOptionId: null,
      mcqDecisionId: null,
      mcqAsked: 0,
      mcqCorrect: 0,
      mcqAnswers: [],
      ftSessionId: null,
      ftSubmitting: false,
      objectives:
        s.activeScenario?.objectives.map((o) => ({
          ...o,
          completed: false,
        })) ?? [],
    })),
}));
