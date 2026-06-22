import type {
  ScenarioDef,
  ScenarioChecker,
  Waypoint,
  ChallengePoint,
} from "./types";

// ─── Autopilot path ────────────────────────────────────────────────────────────
// Car turns onto Road 2 and approaches the zebra crossing at x≈-46.5, where a
// pedestrian is crossing.
export const WAYPOINTS: Waypoint[] = [
  { x: 0, z: 30, speed: 7 },
  { x: 0, z: 4, speed: 4 },
  { x: 0, z: -1, speed: 2 }, // junction mouth
  { x: -11, z: -6.2, speed: 4 }, // left turn into the right-hand lane
  { x: -30, z: -6.4, speed: 7 }, // cruise toward the crossing
  { x: -42, z: -6.4, speed: 2 }, // brake for the zebra
  { x: -44, z: -6.4, speed: 1 },
];

// ─── Decision point ───────────────────────────────────────────────────────────
export const CHALLENGES: ChallengePoint[] = [
  {
    id: "stop-for-pedestrian",
    triggerX: -40, // fires as the car nears the zebra (travelling west)
    prompt: "A pedestrian is crossing at the Zebrastreifen ahead.",
    teaching:
      "At a marked zebra crossing (Zebrastreifen, §26 StVO) pedestrians have priority once they show they want to cross. You must stop and wait until they have safely crossed — and never overtake on the approach to a crossing.",
  },
];

const check: ScenarioChecker = (_carState, completed) => ({
  newlyCompleted: [],
  passed: completed["stop-for-pedestrian"] === true,
  failed: false,
});

const pedestrianCrossing: ScenarioDef = {
  config: {
    id: "pedestrian-crossing",
    name: "Pedestrian Crossing (Zebrastreifen)",
    city: "Aachen",
    country: "Germany",
    difficulty: "beginner",
    description:
      "Stop for pedestrians at a marked zebra crossing (Zebrastreifen).",
    timeLimit: 180,
    objectives: [
      {
        id: "stop-for-pedestrian",
        description: "Stop for the pedestrian",
        completed: false,
      },
    ],
  },
  check,
  driveMode: "auto",
  waypoints: WAYPOINTS,
  challenges: CHALLENGES,
  stopZone: { cx: -45, cz: -5, hw: 5, hd: 4 },
  // Pedestrian-crossing sign just before the zebra, facing the westbound car.
  signs: [
    {
      kind: "pedestrian-crossing",
      position: [-43, 0, -9],
      rotationY: Math.PI / 2,
    },
  ],
  // Pedestrian pacing across the zebra (north ↔ south) so someone is always
  // crossing whenever the user reaches the decision.
  npcs: [
    {
      id: "ped-walker",
      variant: "pedestrian",
      behavior: "free",
      loop: true,
      speed: 1.2,
      path: [
        { x: -46.5, z: -9.5, speed: 1.2 },
        { x: -46.5, z: 0, speed: 1.2 },
        { x: -46.5, z: -9.5, speed: 1.2 },
      ],
    },
  ],
};

export default pedestrianCrossing;
