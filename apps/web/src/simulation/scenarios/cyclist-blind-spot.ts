import type {
  ScenarioDef,
  ScenarioChecker,
  Waypoint,
  ChallengePoint,
} from "./types";

// ─── Autopilot path ────────────────────────────────────────────────────────────
// Car drives south on Road 1 and turns left at the junction. A cyclist on the
// red bike lane to the right is continuing straight on — in the blind spot.
export const WAYPOINTS: Waypoint[] = [
  { x: 0, z: 30, speed: 7 },
  { x: 0, z: 6, speed: 4 }, // slow before the turn
  { x: 0, z: -1, speed: 2 }, // junction mouth
  { x: -10, z: -5, speed: 3.5 }, // left-turn arc across the bike lane
  { x: -30, z: -5, speed: 7 },
  { x: -44, z: -5, speed: 2 },
];

// ─── Decision point ───────────────────────────────────────────────────────────
export const CHALLENGES: ChallengePoint[] = [
  {
    id: "shoulder-check",
    triggerZ: 8,
    prompt:
      "You're about to turn, and a cyclist is in the bike lane on your right.",
    teaching:
      "Before turning across a bike lane, do a shoulder check (Schulterblick) to the right — a cyclist continuing straight on can hide in your blind spot (toter Winkel). They have priority, so let them pass before you turn.",
  },
];

const check: ScenarioChecker = (_carState, completed) => ({
  newlyCompleted: [],
  passed: completed["shoulder-check"] === true,
  failed: false,
});

const cyclistBlindSpot: ScenarioDef = {
  config: {
    id: "cyclist-blind-spot",
    name: "Cyclists & Blind Spot",
    city: "Aachen",
    country: "Germany",
    difficulty: "beginner",
    description:
      "Shoulder-check for cyclists in the blind spot (toter Winkel) before turning across a bike lane.",
    timeLimit: 160,
    objectives: [
      {
        id: "shoulder-check",
        description: "Check for the cyclist before turning",
        completed: false,
      },
    ],
  },
  check,
  driveMode: "auto",
  waypoints: WAYPOINTS,
  // Cyclist on the red bike lane (x≈-2.85), continuing straight south through
  // the junction — alongside / just ahead of the turning car. Loops.
  npcs: [
    {
      id: "cyc-rider",
      variant: "cyclist",
      behavior: "free",
      loop: true,
      speed: 5,
      path: [
        { x: -2.85, z: 30, speed: 5 },
        { x: -2.85, z: -9, speed: 5 },
      ],
    },
  ],
};

export default cyclistBlindSpot;
