import type {
  ScenarioDef,
  ScenarioChecker,
  Waypoint,
  ChallengePoint,
} from "./types";

// ── Autopilot path ────────────────────────────────────────────────────────────
// Car spawns at z=40, drives toward -Z.
// Traffic light is placed at z=-5.
// Challenge fires at z=-12.
// After correct answer, car continues through to z=-60.
export const WAYPOINTS: Waypoint[] = [
  { x: 0, z: 10, speed: 8 }, // accelerate from spawn
  { x: 0, z: -8, speed: 5 }, // slow as approaching light
  { x: 0, z: -60, speed: 8 }, // drive on after light turns green
];

// ── Decision points ───────────────────────────────────────────────────────────
// Practice → teaching panel; Test → all of this scenario's seeded MCQs.
export const CHALLENGES: ChallengePoint[] = [
  {
    id: "red-light-stop",
    triggerZ: -12,
    prompt: "The traffic light is RED!",
    teaching:
      "The traffic light is red. Stop at the stop line and wait — do not enter the junction. When it turns green, check that pedestrians and cyclists are clear before you move off.",
    // No questionOrders → ask every question seeded for traffic-lights.
  },
];

// ── Objective checker (runs every frame) ──────────────────────────────────────
const check: ScenarioChecker = (_carState, completed, _elapsed) => {
  return {
    newlyCompleted: [],
    passed: completed["red-light-stop"] === true,
    failed: false,
  };
};

// ── Scenario definition ───────────────────────────────────────────────────────
const trafficLights: ScenarioDef = {
  config: {
    id: "traffic-lights",
    name: "Traffic Lights",
    city: "Aachen",
    country: "Germany",
    difficulty: "beginner",
    description: "Approach a red traffic light and stop at the correct moment.",
    timeLimit: 120,
    objectives: [
      {
        id: "red-light-stop",
        description: "Stop at the red traffic light",
        completed: false,
      },
    ],
  },
  check,
  driveMode: "auto",
  waypoints: WAYPOINTS,
  challenges: CHALLENGES,
  // Two lights flanking the junction; both go green once the stop is resolved.
  lights: [
    { position: [5, 0, -5], goWhenResolvedId: "red-light-stop" },
    { position: [-5, 0, -5], goWhenResolvedId: "red-light-stop" },
  ],
};

export default trafficLights;
