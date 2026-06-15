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
  // ── Car ───────────────────────────────────────────────────────────────────
  carState: CarState | null;
  isPaused: boolean;
  driveMode: DriveMode;
  // ── Attempt mode (practice teaches; test scores) ───────────────────────────
  attemptMode: AttemptMode;
  // ── Challenges (key-press, legacy) ─────────────────────────────────────────
  activeChallenge: ActiveChallenge | null;
  resolvedChallengeIds: Record<string, boolean>;
  // ── MCQ sequence (test mode) ───────────────────────────────────────────────
  mcqQueue: McqQuestion[]; // questions still to ask in this run
  activeMcq: McqQuestion | null; // currently shown question
  mcqResult: McqResult;
  mcqSelectedOptionId: string | null;
  mcqAsked: number; // running per-scenario score
  mcqCorrect: number;
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
  // MCQ actions
  startMcqSequence: (questions: McqQuestion[]) => void;
  selectMcqOption: (id: string) => void;
  submitMcq: () => void;
  advanceMcq: () => void;
  resetMcq: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  activeScenario: null,
  scenarioPhase: "idle",
  objectives: [],
  elapsedSeconds: 0,
  carState: null,
  isPaused: false,
  driveMode: "manual",
  attemptMode: "practice",
  activeChallenge: null,
  resolvedChallengeIds: {},
  mcqQueue: [],
  activeMcq: null,
  mcqResult: null,
  mcqSelectedOptionId: null,
  mcqAsked: 0,
  mcqCorrect: 0,

  startScenario: (scenario) =>
    set({
      activeScenario: scenario,
      scenarioPhase: "running",
      objectives: scenario.objectives.map((o) => ({ ...o, completed: false })),
      elapsedSeconds: 0,
      activeChallenge: null,
      resolvedChallengeIds: {},
      // Reset the MCQ run, but NOT attemptMode — Simulation.tsx sets that from
      // the route query string, and the two calls must be order-independent.
      mcqQueue: [],
      activeMcq: null,
      mcqResult: null,
      mcqSelectedOptionId: null,
      mcqAsked: 0,
      mcqCorrect: 0,
    }),

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

  // ── MCQ sequence ────────────────────────────────────────────────────────────
  startMcqSequence: (questions) =>
    set(() => {
      const [first, ...rest] = questions;
      return {
        activeMcq: first ?? null,
        mcqQueue: rest,
        mcqResult: first ? "pending" : null,
        mcqSelectedOptionId: null,
        mcqAsked: 0,
        mcqCorrect: 0,
      };
    }),

  selectMcqOption: (id) =>
    set((s) => (s.mcqResult === "pending" ? { mcqSelectedOptionId: id } : {})),

  submitMcq: () =>
    set((s) => {
      if (!s.activeMcq || s.mcqResult !== "pending" || !s.mcqSelectedOptionId) {
        return {};
      }
      const isCorrect = s.mcqSelectedOptionId === s.activeMcq.correctOptionId;
      return {
        mcqResult: isCorrect ? "correct" : "wrong",
        mcqAsked: s.mcqAsked + 1,
        mcqCorrect: s.mcqCorrect + (isCorrect ? 1 : 0),
      };
    }),

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

  resetMcq: () =>
    set({
      mcqQueue: [],
      activeMcq: null,
      mcqResult: null,
      mcqSelectedOptionId: null,
      mcqAsked: 0,
      mcqCorrect: 0,
    }),

  resetScenario: () =>
    set((s) => ({
      scenarioPhase: "running",
      elapsedSeconds: 0,
      activeChallenge: null,
      resolvedChallengeIds: {},
      mcqQueue: [],
      activeMcq: null,
      mcqResult: null,
      mcqSelectedOptionId: null,
      mcqAsked: 0,
      mcqCorrect: 0,
      objectives:
        s.activeScenario?.objectives.map((o) => ({
          ...o,
          completed: false,
        })) ?? [],
    })),
}));
