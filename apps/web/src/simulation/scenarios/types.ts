import type { CarState, ScenarioConfig } from '@roadready/shared'

/** Per-frame evaluation function each scenario must export. */
export type ScenarioChecker = (
  carState: CarState,
  completed: Record<string, boolean>,
  elapsedSeconds: number,
) => {
  newlyCompleted: string[]
  passed: boolean
  failed: boolean
}

/** Full scenario definition — config + runtime logic. */
export interface ScenarioDef {
  config: ScenarioConfig
  check: ScenarioChecker
  /** World-space AABB of the stop zone, if the scenario has one. */
  stopZone?: { cx: number; cz: number; hw: number; hd: number }
}
