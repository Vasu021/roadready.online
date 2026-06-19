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

// ─── Declarative scene props (Step 6) ───────────────────────────────────────
// A scenario declares the signs / lights / NPCs it needs; SimulationScene renders
// them generically (no per-scenario special-casing in the scene).

/** A German road sign placed by a scenario. `kind` is a RoadSign `SignKind`. */
export interface SceneSign {
  kind: string;
  position: [number, number, number];
  /** Yaw so the face points at oncoming traffic. */
  rotationY?: number;
  /** Number for speed-limit (and similar) signs. */
  number?: number;
  label?: string;
}

/** A traffic light placed by a scenario. */
export interface SceneLight {
  position: [number, number, number];
  /**
   * Challenge-driven light: phase is 'green' once this resolvedChallengeId is
   * true, otherwise 'red' (the traffic-lights scenario uses this).
   */
  goWhenResolvedId?: string;
  /** Otherwise self-cycle red → green → yellow → red. */
  autoCycle?: boolean;
  cycle?: { red: number; green: number; yellow: number };
  startPhase?: "red" | "yellow" | "green";
}

/** Full scenario definition — config + runtime logic + declarative scene data. */
export interface ScenarioDef {
  config: ScenarioConfig;
  check: ScenarioChecker;
  /** World-space AABB of the stop zone, if the scenario has one. */
  stopZone?: { cx: number; cz: number; hw: number; hd: number };
  /** When set to 'auto', the car drives itself and waits for challenges. */
  driveMode?: "manual" | "auto";
  /** Autopilot path — used when driveMode === 'auto'. */
  waypoints?: Waypoint[];
  /** Decision points (teaching/MCQ) along the path. */
  challenges?: ChallengePoint[];
  /** Road signs to render for this scenario. */
  signs?: SceneSign[];
  /** Moving NPC traffic for this scenario (rendered via TrafficManager). */
  npcs?: NpcSpawn[];
  /** Traffic lights for this scenario. */
  lights?: SceneLight[];
  /**
   * Marks the aggregate graded Full Test. Its decision zones present questions
   * sampled across scenarios and scored server-side via a TestSession (rather
   * than the per-scenario client-side scoring). Simulation.tsx branches on this.
   */
  fullTest?: boolean;
}
