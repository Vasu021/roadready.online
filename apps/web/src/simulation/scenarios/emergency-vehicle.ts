import type {
  ScenarioDef,
  ScenarioChecker,
  Waypoint,
  ChallengePoint,
} from "./types";

// ─── Autopilot path ────────────────────────────────────────────────────────────
// Car drives south on Road 1; an ambulance closes from behind, so the car pulls
// to the right kerb to let it pass, then continues and turns west.
export const WAYPOINTS: Waypoint[] = [
  { x: 0, z: 32, speed: 7 },
  { x: 0, z: 20, speed: 5 }, // decision fires here
  { x: -2.5, z: 8, speed: 4 }, // pull over to the right kerb
  { x: -2.5, z: -1, speed: 3 },
  { x: -9, z: -5, speed: 4 }, // left-turn arc
  { x: -30, z: -5, speed: 7 },
  { x: -44, z: -5, speed: 2 },
];

// ─── Decision point ───────────────────────────────────────────────────────────
export const CHALLENGES: ChallengePoint[] = [
  {
    id: "make-way",
    triggerZ: 22,
    prompt: "An ambulance with blue lights and siren is coming up behind you.",
    teaching:
      "Blue lights plus a siren means you must give way at once (§38 StVO). On a single-lane road move as far right as you safely can and stop if needed; on multi-lane roads form a Rettungsgasse between the far-left lane and the rest.",
  },
];

const check: ScenarioChecker = (_carState, completed) => ({
  newlyCompleted: [],
  passed: completed["make-way"] === true,
  failed: false,
});

const emergencyVehicle: ScenarioDef = {
  config: {
    id: "emergency-vehicle",
    name: "Emergency Vehicle & Rettungsgasse",
    city: "Aachen",
    country: "Germany",
    difficulty: "beginner",
    description:
      "Make way for an emergency vehicle and understand the Rettungsgasse (rescue lane).",
    timeLimit: 160,
    objectives: [
      {
        id: "make-way",
        description: "Make way for the ambulance",
        completed: false,
      },
    ],
  },
  check,
  driveMode: "auto",
  waypoints: WAYPOINTS,
  challenges: CHALLENGES,
  // Ambulance approaching from behind (north), passing on the left, then west.
  npcs: [
    {
      id: "amb-vehicle",
      variant: "ambulance",
      behavior: "emergency",
      startDelay: 1.5,
      path: [
        { x: 1.2, z: 60, speed: 16 },
        { x: 1.2, z: 2, speed: 15 },
        { x: -9, z: -5, speed: 9 },
        { x: -44, z: -5, speed: 14 },
      ],
    },
  ],
};

export default emergencyVehicle;
