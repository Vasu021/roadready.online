import { makeScenario, road2Sign } from "./makeScenario";

// School zone — children may step out; slow right down and be ready to stop.
const schoolZone = makeScenario({
  slug: "school-zone",
  name: "School Zone & Children",
  description:
    "Expect children near schools — slow down and be ready to stop suddenly.",
  difficulty: "medium",
  signs: [road2Sign("children", -38)],
  stopZone: { cx: -45, cz: -5, hw: 6, hd: 4 },
  decisions: [
    {
      id: "school-zone",
      triggerX: -34,
      prompt: "You're passing a school and children are near the crossing.",
      teaching:
        "Near schools and playgrounds, expect children who may step out unexpectedly. Slow right down, be ready to stop, and watch the kerb and crossing closely — children are unpredictable in traffic.",
    },
  ],
  objectiveText: { "school-zone": "Slow down for children" },
  // A child pacing across the crossing ahead.
  npcs: [
    {
      id: "sz-child",
      variant: "pedestrian",
      behavior: "free",
      loop: true,
      speed: 1.1,
      path: [
        { x: -46.5, z: -9.5, speed: 1.1 },
        { x: -46.5, z: 0, speed: 1.1 },
        { x: -46.5, z: -9.5, speed: 1.1 },
      ],
    },
  ],
});

export default schoolZone;
