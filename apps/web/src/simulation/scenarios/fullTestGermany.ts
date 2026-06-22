import { makeScenario, L_ROUTE, crossingCar } from "./makeScenario";
import type { ScenarioDef, SceneSign, NpcSpawn } from "./types";

// ── The scene-based graded Full Test ──────────────────────────────────────────
//
// The whole product concept is "a specific scene appears and you make a decision
// by looking at the road" — so the Full Test is NOT a random question bank. It is
// a guided drive past distinct, recognizable scenes (a speed sign, a give-way
// junction with crossing traffic, a stop sign, a priority road, a pedestrian on
// the zebra). At each scene the learner sees the relevant sign / traffic and
// answers THAT scene's question, drawn from the matching scenario's bank and
// scored server-side via a TestSession.
//
// `FT_SCENE_SLUGS` is the single source of truth for the scene → question
// mapping: Simulation.tsx fetches one question per slug, in this exact order,
// and TriggerWatcher maps scene index → question. Keep it in sync with
// `decisions` below (same length, same order).

export const FT_SCENE_SLUGS = [
  "speed-limit-tempo30",
  "give-way-sign",
  "stop-sign",
  "priority-road-signs",
  "pedestrian-crossing",
] as const;

// Signs are placed a few metres AHEAD of each decision trigger so the learner
// sees them on the approach. Road 1 signs sit on the −X kerb facing the
// southbound car; Road 2 signs sit on the north kerb (z=−9) facing west.
const signs: SceneSign[] = [
  { kind: "speed-limit", number: 50, position: [-4, 0, 24], rotationY: 0 },
  { kind: "give-way", position: [-4, 0, 2], rotationY: 0 },
  { kind: "stop", position: [-20, 0, -9], rotationY: Math.PI / 2 },
  { kind: "priority-road", position: [-32, 0, -9], rotationY: Math.PI / 2 },
  {
    kind: "pedestrian-crossing",
    position: [-46, 0, -9],
    rotationY: Math.PI / 2,
  },
];

const npcs: NpcSpawn[] = [
  // Priority-road traffic crossing the give-way junction (scene 2).
  crossingCar("ft-cross", 6),
  // Pedestrian pacing the zebra at x≈-46.5 (scene 5) so someone is always crossing.
  {
    id: "ft-ped",
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
];

const fullTestGermany: ScenarioDef = {
  ...makeScenario({
    slug: "full-test-germany",
    name: "Full Test — Germany",
    description:
      "The graded driving-theory test — drive the route and react to each real scene as it appears.",
    difficulty: "medium",
    timeLimit: 900,
    waypoints: L_ROUTE,
    signs,
    npcs,
    // One decision per scene, in the SAME order as FT_SCENE_SLUGS. The prompt /
    // teaching are only a fallback (shown if a scene's question fails to load);
    // normally the learner answers the matching scenario's MCQ here.
    decisions: [
      {
        id: "ft-speed",
        triggerZ: 28,
        prompt: "A speed-limit sign is posted on the approach.",
        teaching: "Obey the posted speed limit for this stretch of road.",
      },
      {
        id: "ft-giveway",
        triggerZ: 6,
        prompt: "A give-way sign — a car is crossing on the priority road.",
        teaching: "Yield to traffic on the priority road before you proceed.",
      },
      {
        id: "ft-stop",
        triggerX: -16,
        prompt: "A stop sign is ahead on the road.",
        teaching:
          "Come to a full stop at the line, even if the way looks clear.",
      },
      {
        id: "ft-priority",
        triggerX: -28,
        prompt: "A priority-road sign marks this street.",
        teaching: "You have priority here until the priority road ends.",
      },
      {
        id: "ft-pedestrian",
        triggerX: -38,
        prompt: "A pedestrian is crossing at the Zebrastreifen ahead.",
        teaching: "Stop and let the pedestrian cross at the zebra crossing.",
      },
    ],
    objectiveText: {
      "ft-speed": "React to the speed limit",
      "ft-giveway": "Give way at the junction",
      "ft-stop": "Stop at the stop sign",
      "ft-priority": "Recognize the priority road",
      "ft-pedestrian": "Stop for the pedestrian",
    },
  }),
  fullTest: true,
};

export default fullTestGermany;
