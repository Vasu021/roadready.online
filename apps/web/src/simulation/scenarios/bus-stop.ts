import { makeScenario, yieldingVehicle } from "./makeScenario";

// A town bus indicating to leave its stop has priority — let it pull out.
const busStop = makeScenario({
  slug: "bus-stop",
  name: "Bus Stop",
  description:
    "Let a town bus pull out of its stop, and pass a stopped bus carefully.",
  difficulty: "medium",
  decisions: [
    {
      id: "let-bus-out",
      triggerX: -16,
      prompt: "A bus at the stop ahead is indicating to pull out.",
      teaching:
        "In town, a bus signalling to leave a stop has priority — slow down and let it pull out. When passing a stopped bus with its hazard lights on, go by at walking pace in case passengers step into the road.",
    },
  ],
  objectiveText: { "let-bus-out": "Let the bus pull out" },
  // Bus waits at the stop until the player yields, then pulls away west.
  npcs: [
    yieldingVehicle({
      id: "bus-vehicle",
      variant: "bus",
      goWhenResolvedId: "let-bus-out",
      speed: 6,
      path: [
        { x: -32, z: -3.25, speed: 6 },
        { x: -58, z: -3.25, speed: 6 },
      ],
    }),
  ],
});

export default busStop;
