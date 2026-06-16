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

// ─── NPC traffic (Step 5) ───────────────────────────────────────────────────
// Declarative, procedural traffic the <TrafficManager/> renders. The motion
// reuses the player's waypoint convention (yaw = atan2(-dx, -dz), local -Z is
// the NPC's front) but runs kinematically — no Rapier — so NPCs never fight the
// player car's physics.

/** Procedural NPC vehicle meshes the traffic system can render. */
export type NpcVehicleVariant = "car" | "bus" | "ambulance" | "cyclist";

/** Everything a scenario can spawn — the vehicles plus the walking pedestrian. */
export type NpcVariant = NpcVehicleVariant | "pedestrian";

/**
 * How the TrafficManager coordinates a spawn:
 *  - 'free'         drive the path, never hold.
 *  - 'stop-at-red'  hold while the junction light is red — or, if
 *                   `goWhenResolvedId` is set, until that challenge resolves.
 *  - 'yield'        hold while the manager lists this spawn's id in `heldIds`
 *                   (give-way / rechts-vor-links choreography in Step 6).
 *  - 'emergency'    sirens on; drives through and does not yield (the player is
 *                   expected to pull over).
 */
export type NpcBehavior = "free" | "stop-at-red" | "yield" | "emergency";

/**
 * A declarative NPC spawn. Step 6 lets a `ScenarioDef` carry `npcs: NpcSpawn[]`,
 * which `SimulationScene` feeds to `<TrafficManager/>`.
 */
export interface NpcSpawn {
  id: string;
  variant: NpcVariant;
  /** Kinematic path (same Waypoint shape as the player autopilot). */
  path: Waypoint[];
  /** Fallback speed (m/s) when a waypoint doesn't carry its own. */
  speed?: number;
  /** Loop back to the path start once the end is reached. */
  loop?: boolean;
  /** Seconds the NPC waits at the path start before setting off. */
  startDelay?: number;
  /** Coordinated behaviour; defaults to 'free'. */
  behavior?: NpcBehavior;
  /** 'stop-at-red': the `resolvedChallengeId` that, once true, releases the NPC. */
  goWhenResolvedId?: string;
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
