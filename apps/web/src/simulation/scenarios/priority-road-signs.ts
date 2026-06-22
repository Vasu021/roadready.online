import { makeScenario, approachSign, yieldingVehicle } from "./makeScenario";

// Vorfahrtstraße (yellow diamond): you have priority over side-road traffic.
// A side-road car waits and only pulls away once you've asserted your priority.
const priorityRoadSigns = makeScenario({
  slug: "priority-road-signs",
  name: "Priority Road Signs (Vorfahrtstraße)",
  description:
    "On a priority road (yellow diamond) you have right of way over side-road traffic.",
  difficulty: "easy",
  signs: [approachSign("priority-road", 12)],
  decisions: [
    {
      id: "priority-road",
      triggerZ: 8,
      prompt:
        "You're on the priority road; a car is waiting to pull out from the side.",
      teaching:
        "The yellow diamond (Zeichen 306, Vorfahrtstraße) means you have priority — side-road traffic must give way to you, overriding Rechts vor Links. Carry on, but stay alert in case someone doesn't yield.",
    },
  ],
  objectiveText: { "priority-road": "Use your priority correctly" },
  // A side-road car waiting on the south side; it holds until the player asserts
  // priority, then pulls out into the eastbound (south) lane — clear of the
  // player's west-bound lane.
  npcs: [
    yieldingVehicle({
      id: "prs-side",
      goWhenResolvedId: "priority-road",
      path: [
        { x: -16, z: -2.8, speed: 6 },
        { x: 26, z: -3.25, speed: 6 },
      ],
    }),
  ],
});

export default priorityRoadSigns;
