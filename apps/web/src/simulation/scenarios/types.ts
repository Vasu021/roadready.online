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

/** A point along the autopilot path. Speed is m/s. */
export interface Waypoint {
  x: number
  z: number
  speed: number
}

/**
 * A moment in the autopilot path where the car pauses and the user
 * must press the correct key to demonstrate a traffic rule.
 */
export interface ChallengePoint {
  id: string
  /** Fire when car.z <= this value (for roads running north-south). */
  triggerZ?: number
  /** Fire when car.x <= this value (for roads running east-west, going west). */
  triggerX?: number
  /** Short situation description shown in the overlay. */
  prompt: string
  /** "Press SPACE to brake" etc. */
  instruction: string
  /** e.g. 'Space', 'ArrowLeft', 'KeyW' — matches KeyboardEvent.code */
  correctKey: string
  /** Human-readable label shown on the key badge. */
  correctKeyLabel: string
}

/** Full scenario definition — config + runtime logic. */
export interface ScenarioDef {
  config: ScenarioConfig
  check: ScenarioChecker
  /** World-space AABB of the stop zone, if the scenario has one. */
  stopZone?: { cx: number; cz: number; hw: number; hd: number }
  /** When set to 'auto', the car drives itself and waits for challenges. */
  driveMode?: 'manual' | 'auto'
  /** Autopilot path — used when driveMode === 'auto'. */
  waypoints?: Waypoint[]
  /** Key-press challenges along the path. */
  challenges?: ChallengePoint[]
}
