import { makeScenario, approachSign, leadCar } from "./makeScenario";

// Following distance + stopping distance, with a slower car ahead and a 50 sign.
const speedStoppingDistance = makeScenario({
  slug: "speed-stopping-distance",
  name: "Speed & Stopping Distance",
  description:
    "Keep a safe following distance and understand how stopping distance grows with speed.",
  difficulty: "easy",
  signs: [approachSign("speed-limit", 30, 50)],
  decisions: [
    {
      id: "safe-distance",
      triggerZ: 22,
      prompt: "There's a slower car ahead and you're catching up to it.",
      teaching:
        "Keep a safe following distance — outside built-up areas, roughly half your speedometer reading in metres (about a two-second gap). Stopping distance is reaction distance plus braking distance, and braking distance rises with the square of your speed.",
    },
  ],
  objectiveText: { "safe-distance": "Keep a safe following distance" },
  npcs: [leadCar("ssd-lead")],
});

export default speedStoppingDistance;
