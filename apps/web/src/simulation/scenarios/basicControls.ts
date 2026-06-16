import type {
  ScenarioDef,
  ScenarioChecker,
  Waypoint,
  ChallengePoint,
} from "./types";

// ─── Autopilot path ────────────────────────────────────────────────────────────
// Car spawns at (0, y, 40) facing −Z (south). It drives to the junction at z≈−2,
// turns left (west, toward −X), then continues down the second street and stops.
export const WAYPOINTS: Waypoint[] = [
  { x: 0, z: 22, speed: 7.5 }, // accelerate from spawn
  { x: 0, z: 4, speed: 5.0 }, // slow as junction approaches
  { x: 0, z: -1, speed: 2.5 }, // crawl at junction mouth
  { x: -10, z: -5, speed: 4.0 }, // pivot west (left turn arc)
  { x: -26, z: -5, speed: 7.5 }, // cruise on second street
  { x: -43, z: -5, speed: 1.5 }, // decelerate toward stop line
];

// ─── Decision points ──────────────────────────────────────────────────────────
// Practice → teaching panel; Test → the mapped MCQs (by DB question order).
export const CHALLENGES: ChallengePoint[] = [
  {
    id: "turn-left",
    triggerZ: 5, // fires when car.z <= 5, while still on first road
    prompt: "Junction ahead — turn LEFT here!",
    teaching:
      "You're approaching the junction and need to turn left. Signal left in good time, check your mirrors and your left blind spot (Schulterblick), then make the turn once the way is clear.",
    questionOrders: [1, 2],
  },
  {
    id: "stop-at-sign",
    triggerX: -37, // fires when car.x <= −37, approaching stop line at x≈−45
    prompt: "Stop line ahead — you must stop the car!",
    teaching:
      "There's a stop line ahead. Come to a complete stop behind the line, check that the way is clear, and only then move off — always stop fully, even if the road looks empty.",
    questionOrders: [3],
  },
];

// ─── Objective checker ────────────────────────────────────────────────────────
// Challenges mark their matching objectives via resolvedChallengeIds in the store,
// which ScenarioRunner merges into the `completed` map below.
const check: ScenarioChecker = (_carState, completed) => ({
  newlyCompleted: [],
  passed: completed["turn-left"] === true && completed["stop-at-sign"] === true,
  failed: false,
});

// ─── Stop zone visual (world-space AABB) ─────────────────────────────────────
export const STOP_ZONE = { cx: -45, cz: -5, hw: 5, hd: 4 };

// ─── Scenario definition ──────────────────────────────────────────────────────
const basicControls: ScenarioDef = {
  config: {
    id: "basic-controls",
    name: "Basic Controls",
    city: "Aachen",
    country: "Germany",
    difficulty: "beginner",
    description:
      "The car drives itself. Press the right key at each prompt to show you know the rules.",
    timeLimit: 180,
    objectives: [
      {
        id: "turn-left",
        description: "Turn left at the junction",
        completed: false,
      },
      {
        id: "stop-at-sign",
        description: "Stop at the stop line",
        completed: false,
      },
    ],
  },
  check,
  driveMode: "auto",
  waypoints: WAYPOINTS,
  challenges: CHALLENGES,
  stopZone: STOP_ZONE,
  // Stop sign on the north kerb, facing the westbound car at the stop line.
  signs: [{ kind: "stop", position: [-44, 0, -9], rotationY: Math.PI / 2 }],
};

export default basicControls;
