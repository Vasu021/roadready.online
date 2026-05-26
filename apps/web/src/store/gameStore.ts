import { create } from 'zustand'
import type { ScenarioConfig, CarState, Objective } from '@roadready/shared'

export type ScenarioPhase = 'idle' | 'running' | 'passed' | 'failed'

interface GameStore {
  // ── Scenario ──────────────────────────────────────────────────────────────
  activeScenario: ScenarioConfig | null
  scenarioPhase: ScenarioPhase
  objectives: Objective[]             // live copies with completed flags
  elapsedSeconds: number
  // ── Car ───────────────────────────────────────────────────────────────────
  carState: CarState | null
  isPaused: boolean
  // ── Actions ───────────────────────────────────────────────────────────────
  startScenario: (scenario: ScenarioConfig) => void
  setScenarioPhase: (phase: ScenarioPhase) => void
  completeObjective: (id: string) => void
  setCarState: (state: CarState) => void
  setPaused: (paused: boolean) => void
  setElapsed: (seconds: number) => void
  resetScenario: () => void
}

export const useGameStore = create<GameStore>((set) => ({
  activeScenario: null,
  scenarioPhase: 'idle',
  objectives: [],
  elapsedSeconds: 0,
  carState: null,
  isPaused: false,

  startScenario: (scenario) =>
    set({
      activeScenario: scenario,
      scenarioPhase: 'running',
      objectives: scenario.objectives.map((o) => ({ ...o, completed: false })),
      elapsedSeconds: 0,
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

  resetScenario: () =>
    set((s) => ({
      scenarioPhase: 'running',
      elapsedSeconds: 0,
      objectives: s.activeScenario?.objectives.map((o) => ({
        ...o,
        completed: false,
      })) ?? [],
    })),
}))
