import type {
  ScenarioDef,
  ScenarioChecker,
  Waypoint,
  ChallengePoint,
} from "./types";

// ─── Autopilot path ────────────────────────────────────────────────────────────
// Unmarked junction: the car drives south, yields to traffic from the RIGHT
// (rechts vor links), then turns left and continues west.
export const WAYPOINTS: Waypoint[] = [
  { x: 0, z: 30, speed: 7 },
  { x: 0, z: 5, speed: 3.5 }, // slow on the approach
  { x: 0, z: -1, speed: 2 }, // junction mouth
  { x: -11, z: -6.2, speed: 4 }, // left turn into the right-hand lane
  { x: -30, z: -6.4, speed: 7 },
  { x: -44, z: -6.4, speed: 2 },
];

// ─── Decision point ───────────────────────────────────────────────────────────
export const CHALLENGES: ChallengePoint[] = [
  {
    id: "yield-right",
    triggerZ: 6,
    prompt: "Unmarked junction — a car is approaching from your right.",
    teaching:
      "There are no signs or signals here, so 'Rechts vor Links' applies (§8 StVO): traffic coming from the right has priority. Let the car from the right go first, then proceed when the way is clear.",
  },
];

const check: ScenarioChecker = (_carState, completed) => ({
  newlyCompleted: [],
  passed: completed["yield-right"] === true,
  failed: false,
});

const rechtsVorLinks: ScenarioDef = {
  config: {
    id: "rechts-vor-links",
    name: "Rechts vor Links — Right before Left",
    city: "Aachen",
    country: "Germany",
    difficulty: "beginner",
    description:
      "The core German right-of-way rule at unmarked junctions: traffic from the right has priority.",
    timeLimit: 150,
    objectives: [
      {
        id: "yield-right",
        description: "Yield to traffic from the right",
        completed: false,
      },
    ],
  },
  check,
  driveMode: "auto",
  waypoints: WAYPOINTS,
  challenges: CHALLENGES,
  // No signs — this is an unmarked junction.
  // A car approaching the junction from the player's right (west → east) in its
  // own lane, looping. Starts/ends off-screen so the loop never "pops".
  npcs: [
    {
      id: "rvl-cross",
      variant: "car",
      behavior: "free",
      loop: true,
      speed: 6,
      path: [
        { x: -84, z: -3.25, speed: 6 },
        { x: 24, z: -3.25, speed: 6 },
      ],
    },
  ],
};

export default rechtsVorLinks;
