import { create } from 'zustand'
import type { ScenarioConfig, CarState, Objective } from '@roadready/shared'

export type ScenarioPhase = 'idle' | 'running' | 'passed' | 'failed'
export type DriveMode = 'manual' | 'auto'

export interface ActiveChallenge {
  id: string
  prompt: string
  instruction: string
  correctKey: string       // e.g. 'Space', 'ArrowLeft'
  correctKeyLabel: string  // e.g. 'SPACE', '← LEFT'
  result: 'pending' | 'correct' | 'wrong'
  wrongKeyLabel?: string
}

interface GameStore {
  // ── Scenario ──────────────────────────────────────────────────────────────
  activeScenario: ScenarioConfig | null
  scenarioPhase: ScenarioPhase
  objectives: Objective[]
  elapsedSeconds: number
  // ── Car ───────────────────────────────────────────────────────────────────
  carState: CarState | null
  isPaused: boolean
  driveMode: DriveMode
  // ── Challenges ────────────────────────────────────────────────────────────
  activeChallenge: ActiveChallenge | null
  resolvedChallengeIds: Record<string, boolean>
  // ── Actions ───────────────────────────────────────────────────────────────
  startScenario: (scenario: ScenarioConfig) => void
  setScenarioPhase: (phase: ScenarioPhase) => void
  completeObjective: (id: string) => void
  setCarState: (state: CarState) => void
  setPaused: (paused: boolean) => void
  setElapsed: (seconds: number) => void
  resetScenario: () => void
  setDriveMode: (mode: DriveMode) => void
  triggerChallenge: (c: Omit<ActiveChallenge, 'result'>) => void
  resolveChallenge: (result: 'correct' | 'wrong', wrongKeyLabel?: string) => void
  clearChallenge: () => void
}

export const useGameStore = create<GameStore>((set) => ({
  activeScenario: null,
  scenarioPhase: 'idle',
  objectives: [],
  elapsedSeconds: 0,
  carState: null,
  isPaused: false,
  driveMode: 'manual',
  activeChallenge: null,
  resolvedChallengeIds: {},

  startScenario: (scenario) =>
    set({
      activeScenario: scenario,
      scenarioPhase: 'running',
      objectives: scenario.objectives.map((o) => ({ ...o, completed: false })),
      elapsedSeconds: 0,
      activeChallenge: null,
      resolvedChallengeIds: {},
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

  triggerChallenge: (c) =>
    set({ activeChallenge: { ...c, result: 'pending' } }),

  resolveChallenge: (result, wrongKeyLabel) =>
    set((s) => ({
      activeChallenge: s.activeChallenge
        ? { ...s.activeChallenge, result, wrongKeyLabel }
        : null,
      resolvedChallengeIds:
        result === 'correct' && s.activeChallenge
          ? { ...s.resolvedChallengeIds, [s.activeChallenge.id]: true }
          : s.resolvedChallengeIds,
      // Also mark the matching objective as completed so ResultsScreen shows it
      objectives:
        result === 'correct' && s.activeChallenge
          ? s.objectives.map((o) =>
              o.id === s.activeChallenge!.id ? { ...o, completed: true } : o,
            )
          : s.objectives,
    })),

  clearChallenge: () => set({ activeChallenge: null }),

  resetScenario: () =>
    set((s) => ({
      scenarioPhase: 'running',
      elapsedSeconds: 0,
      activeChallenge: null,
      resolvedChallengeIds: {},
      objectives: s.activeScenario?.objectives.map((o) => ({
        ...o,
        completed: false,
      })) ?? [],
    })),
}))
