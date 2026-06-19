import type {
  ScenarioDef,
  ScenarioChecker,
  Waypoint,
  ChallengePoint,
} from "./types";

// ─── Autopilot path ────────────────────────────────────────────────────────────
// Car drives south on Road 1, gives way at the junction (Road 2 is the priority
// road), then turns left and continues west.
export const WAYPOINTS: Waypoint[] = [
  { x: 0, z: 30, speed: 7 }, // accelerate from spawn
  { x: 0, z: 5, speed: 3.5 }, // slow at the give-way sign
  { x: 0, z: -1, speed: 2 }, // junction mouth
  { x: -10, z: -5, speed: 4 }, // left-turn arc onto Road 2
  { x: -30, z: -5, speed: 7 }, // cruise west
  { x: -44, z: -5, speed: 2 }, // settle
];

// ─── Decision point ───────────────────────────────────────────────────────────
export const CHALLENGES: ChallengePoint[] = [
  {
    id: "give-way",
    triggerZ: 6, // fires just before the junction
    prompt: "Give-way sign ahead — a car is crossing on the priority road.",
    teaching:
      "The upside-down red-and-white triangle is 'Vorfahrt gewähren' (give way). Road 2 is the priority road, so let the crossing traffic pass; you don't have to stop if it's clear, but you must yield and only go when you won't obstruct anyone.",
    // No questionOrders → ask all of this scenario's seeded MCQs in test mode.
  },
];

const check: ScenarioChecker = (_carState, completed) => ({
  newlyCompleted: [],
  passed: completed["give-way"] === true,
  failed: false,
});

const giveWaySign: ScenarioDef = {
  config: {
    id: "give-way-sign",
    name: "Give Way / Yield",
    city: "Aachen",
    country: "Germany",
    difficulty: "beginner",
    description:
      "React to the give-way sign (Vorfahrt gewähren) — yield to traffic on the priority road.",
    timeLimit: 150,
    objectives: [
      {
        id: "give-way",
        description: "Give way to the priority road",
        completed: false,
      },
    ],
  },
  check,
  driveMode: "auto",
  waypoints: WAYPOINTS,
  challenges: CHALLENGES,
  // Give-way sign on the right kerb, facing the southbound car.
  signs: [{ kind: "give-way", position: [-4, 0, 4], rotationY: 0 }],
  // A priority-road car crossing the junction from the left (west), looping so
  // there is always traffic to yield to whenever the user pauses to decide.
  npcs: [
    {
      id: "gws-cross",
      variant: "car",
      behavior: "free",
      loop: true,
      speed: 8,
      path: [
        { x: -56, z: -3.25, speed: 8 },
        { x: 12, z: -3.25, speed: 8 },
      ],
    },
  ],
};

export default giveWaySign;
