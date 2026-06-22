import type { CarState, Difficulty } from "@roadready/shared";
import type {
  ScenarioDef,
  ScenarioChecker,
  Waypoint,
  ChallengePoint,
  SceneSign,
  SceneLight,
  NpcSpawn,
} from "./types";

/**
 * Standard scenario builder used by the batch of Germany scenarios (PROMPT Step 7).
 *
 * It keeps every module short and consistent, and — crucially — wires each
 * decision into BOTH places the challenge system needs it:
 *   • `config.objectives` (so completion + pass/fail logic works), and
 *   • `challenges` (so SimulationScene mounts <TriggerWatcher/>, which opens the
 *     teaching panel in practice mode or the MCQ sequence in test mode).
 * The objective id is taken straight from the decision id, preserving the
 * "challenge id === objective id" invariant the whole system depends on.
 */
export interface MakeScenarioInput {
  /** Must equal the DB slug so the scenario is playable from Home. */
  slug: string;
  name: string;
  description: string;
  difficulty?: Difficulty;
  /** Seconds before the run auto-fails; generous so test-mode MCQs aren't rushed. */
  timeLimit?: number;
  city?: string;
  country?: string;
  /** Autopilot path. Defaults to the shared L-route (south → left turn → west). */
  waypoints?: Waypoint[];
  /** Decision points; each id becomes an objective id (they must match). */
  decisions: ChallengePoint[];
  /** Optional objective label per decision id (defaults to a generic one). */
  objectiveText?: Record<string, string>;
  signs?: SceneSign[];
  npcs?: NpcSpawn[];
  lights?: SceneLight[];
  stopZone?: { cx: number; cz: number; hw: number; hd: number };
}

// Lane convention on Road 2 (E-W, z∈[-8.5,-1.5], centre z=-5):
//   • the player drives WEST in the right-hand (north) lane  → z ≈ -6.4
//   • oncoming / cross traffic drives EAST in the south lane → z ≈ -3.25
// Keeping the two apart (≈3 m) means NPCs no longer share the player's lane,
// which is what made earlier builds look like cars driving head-on through you.
export const ROAD2_DRIVE_Z = -6.4; // player's lane going west
export const ROAD2_ONCOMING_Z = -3.25; // eastbound traffic's lane

/** The canonical L-route: accelerate south, slow at the junction, turn left into the right-hand lane, cruise west, settle. */
export const L_ROUTE: Waypoint[] = [
  { x: 0, z: 30, speed: 7 },
  { x: 0, z: 6, speed: 3.5 },
  { x: 0, z: -1, speed: 2 },
  { x: -11, z: -6.2, speed: 4 }, // ease into the right-hand lane through the turn
  { x: -30, z: ROAD2_DRIVE_Z, speed: 7 },
  { x: -44, z: ROAD2_DRIVE_Z, speed: 2 },
];

export function makeScenario(input: MakeScenarioInput): ScenarioDef {
  const {
    slug,
    name,
    description,
    difficulty = "beginner",
    timeLimit = 300,
    city = "Aachen",
    country = "Germany",
    waypoints = L_ROUTE,
    decisions,
    objectiveText = {},
    signs,
    npcs,
    lights,
    stopZone,
  } = input;

  const objectives = decisions.map((d) => ({
    id: d.id,
    description: objectiveText[d.id] ?? "Make the correct decision",
    completed: false,
  }));

  const decisionIds = decisions.map((d) => d.id);
  const check: ScenarioChecker = (_carState: CarState, completed) => ({
    newlyCompleted: [],
    passed: decisionIds.every((id) => completed[id] === true),
    failed: false,
  });

  return {
    config: {
      id: slug,
      name,
      city,
      country,
      difficulty,
      description,
      objectives,
      timeLimit,
    },
    check,
    driveMode: "auto",
    waypoints,
    challenges: decisions,
    signs,
    npcs,
    lights,
    stopZone,
  };
}

// ─── Declarative prop helpers ─────────────────────────────────────────────────
// Placement follows the established scene convention (see GermanCityRoad.tsx):
// Road-1 signs sit on the −X kerb facing the southbound car; Road-2 signs sit on
// the north kerb (z=−9) facing the westbound car. All are clear of the junction
// turn arc (x∈[0,−14], z∈[−2,−6]).

/** A sign on the Road-1 approach (−X kerb), facing the southbound car. */
export function approachSign(kind: string, z: number, num?: number): SceneSign {
  return { kind, position: [-4, 0, z], rotationY: 0, number: num };
}

/** A sign on the Road-2 north kerb, facing the westbound car. */
export function road2Sign(kind: string, x: number, num?: number): SceneSign {
  return { kind, position: [x, 0, -9], rotationY: Math.PI / 2, number: num };
}

// ─── NPC helpers ──────────────────────────────────────────────────────────────

/**
 * Cross traffic on Road 2 (west → east through the junction) in its own
 * (south) lane, looping — used where the player must yield to traffic that
 * always has someone coming. The path starts/ends well off-screen so the loop's
 * respawn is never visible, and the lane is clear of the player's west-bound lane.
 */
export function crossingCar(id: string, speed = 6): NpcSpawn {
  return {
    id,
    variant: "car",
    behavior: "free",
    loop: true,
    speed,
    path: [
      { x: -84, z: ROAD2_ONCOMING_Z, speed },
      { x: 24, z: ROAD2_ONCOMING_Z, speed },
    ],
  };
}

/**
 * A slower car ahead on the player's L-route (non-looping), driving off west in
 * the player's lane — used for following-distance / overtaking situations.
 */
export function leadCar(id: string, speed = 5): NpcSpawn {
  return {
    id,
    variant: "car",
    behavior: "free",
    speed,
    path: [
      { x: 0, z: 18, speed },
      { x: 0, z: -1, speed: 3 },
      { x: -11, z: -6.2, speed: 4 },
      { x: -70, z: ROAD2_DRIVE_Z, speed: speed + 1 },
    ],
  };
}

/**
 * A vehicle that waits at its start position until `goWhenResolvedId` resolves
 * (i.e. the player makes the decision), then drives its path — used for traffic
 * that yields to the player (priority road, bus pulling out, …).
 */
export function yieldingVehicle(opts: {
  id: string;
  goWhenResolvedId: string;
  path: Waypoint[];
  variant?: NpcSpawn["variant"];
  speed?: number;
}): NpcSpawn {
  return {
    id: opts.id,
    variant: opts.variant ?? "car",
    behavior: "stop-at-red",
    goWhenResolvedId: opts.goWhenResolvedId,
    speed: opts.speed ?? 6,
    path: opts.path,
  };
}
