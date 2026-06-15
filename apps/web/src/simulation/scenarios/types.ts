import type { CarState, ScenarioConfig } from "@roadready/shared";

/** Per-frame evaluation function each scenario must export. */
export type ScenarioChecker = (
  carState: CarState,
  completed: Record<string, boolean>,
  elapsedSeconds: number,
) => {
  newlyCompleted: string[];
  passed: boolean;
  failed: boolean;
};

/** A point along the autopilot path. Speed is m/s. */
export interface Waypoint {
  x: number;
  z: number;
  speed: number;
}

/**
 * A decision point along the autopilot path: the car pauses and either teaches
 * the rule (practice) or asks its MCQ(s) (test). `id` MUST equal the matching
 * objective id, or pass/fail breaks silently.
 */
export interface ChallengePoint {
  id: string;
  /** Fire when car.z <= this value (for roads running north-south). */
  triggerZ?: number;
  /** Fire when car.x <= this value (for roads running east-west, going west). */
  triggerX?: number;
  /** Short situation description shown in the overlay (the "what's happening"). */
  prompt: string;
  /** PRACTICE-mode teaching: the rule explanation shown before the car proceeds. */
  teaching: string;
  /**
   * Which DB question `order`s to ask in TEST mode at this decision point.
   * Omit to ask every question seeded for the scenario.
   */
  questionOrders?: number[];
  // ── Legacy key-press fields (optional — kept so old scenarios type-check) ──
  /** "Press SPACE to brake" etc. */
  instruction?: string;
  /** e.g. 'Space', 'ArrowLeft', 'KeyW' — matches KeyboardEvent.code */
  correctKey?: string;
  /** Human-readable label shown on the key badge. */
  correctKeyLabel?: string;
}

/** Full scenario definition — config + runtime logic. */
export interface ScenarioDef {
  config: ScenarioConfig;
  check: ScenarioChecker;
  /** World-space AABB of the stop zone, if the scenario has one. */
  stopZone?: { cx: number; cz: number; hw: number; hd: number };
  /** When set to 'auto', the car drives itself and waits for challenges. */
  driveMode?: "manual" | "auto";
  /** Autopilot path — used when driveMode === 'auto'. */
  waypoints?: Waypoint[];
  /** Key-press challenges along the path. */
  challenges?: ChallengePoint[];
}
