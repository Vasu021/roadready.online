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

// ── Challenge points ──────────────────────────────────────────────────────────
export const CHALLENGES: ChallengePoint[] = [
  {
    id: "red-light-stop",
    triggerZ: -12,
    prompt: "The traffic light is RED!",
    instruction: "Press SPACE to brake and stop at the line",
    correctKey: "Space",
    correctKeyLabel: "SPACE",
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
};

export default trafficLights;
