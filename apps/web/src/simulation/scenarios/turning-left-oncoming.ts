import { makeScenario } from "./makeScenario";

// Turning left across oncoming traffic that is going straight on — they have
// priority. A car comes up the opposite lane as the player reaches the junction.
const turningLeftOncoming = makeScenario({
  slug: "turning-left-oncoming",
  name: "Turning Left with Oncoming Traffic",
  description:
    "When turning left, give way to oncoming traffic going straight ahead.",
  difficulty: "medium",
  decisions: [
    {
      id: "yield-oncoming",
      triggerZ: 8,
      prompt:
        "You're turning left and a car is coming straight towards you from the opposite direction.",
      teaching:
        "When turning left you must give way to oncoming traffic going straight ahead — they have priority. Wait for a safe gap, watch for pedestrians and cyclists on the road you turn into, and keep your wheels straight while you wait.",
    },
  ],
  objectiveText: { "yield-oncoming": "Give way to oncoming traffic" },
  // Oncoming car in the opposite lane, heading north through the junction.
  npcs: [
    {
      id: "tlo-oncoming",
      variant: "car",
      behavior: "free",
      loop: true,
      speed: 6,
      path: [
        { x: 1.5, z: -10, speed: 6 },
        { x: 1.5, z: 46, speed: 6 },
      ],
    },
  ],
});

export default turningLeftOncoming;
