import { makeScenario } from "./makeScenario";

// Grünpfeil — turning right on red is allowed ONLY with the green-arrow sign,
// after a full stop and giving way. The junction light goes green once resolved.
const greenArrow = makeScenario({
  slug: "green-arrow",
  name: "Green Arrow — Right Turn on Red",
  description:
    "The Grünpfeil lets you turn right on red — but only after a full stop and giving way.",
  difficulty: "medium",
  // Approach the light and stop short of it; resolve, then drive on.
  waypoints: [
    { x: 0, z: 16, speed: 6 },
    { x: 0, z: 4, speed: 3 },
    { x: 0, z: -50, speed: 7 },
  ],
  decisions: [
    {
      id: "green-arrow",
      triggerZ: 6,
      prompt:
        "The light is red, and there's a green arrow (Grünpfeil) for turning right.",
      teaching:
        "A separate green-arrow sign (Grünpfeil) lets you turn right on red — but only after a full stop and giving way to all crossing pedestrians and traffic. Without that sign, red always means stop.",
    },
  ],
  objectiveText: {
    "green-arrow": "Stop fully, then turn right on the green arrow",
  },
  lights: [
    { position: [5, 0, -5], goWhenResolvedId: "green-arrow" },
    { position: [-5, 0, -5], goWhenResolvedId: "green-arrow" },
  ],
});

export default greenArrow;
