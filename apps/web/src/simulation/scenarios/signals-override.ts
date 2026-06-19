import { makeScenario, approachSign } from "./makeScenario";

// The priority order when instructions conflict: officer > lights > signs > markings.
const signalsOverride = makeScenario({
  slug: "signals-override",
  name: "Signal Priority Order",
  description:
    "Know which instruction wins when a police officer, lights and signs disagree.",
  difficulty: "medium",
  signs: [approachSign("priority-road", 12)],
  decisions: [
    {
      id: "signal-priority",
      triggerZ: 8,
      prompt:
        "A police officer is directing traffic while the lights and signs say something different.",
      teaching:
        "When instructions conflict, follow this order: a police officer's signals override traffic lights, lights override signs, and signs override road markings. Always obey the highest-ranking instruction.",
    },
  ],
  objectiveText: { "signal-priority": "Follow the correct signal priority" },
  // A self-cycling light at the junction, deliberately at odds with the officer.
  lights: [
    {
      position: [5, 0, -5],
      autoCycle: true,
      cycle: { red: 5, green: 5, yellow: 2 },
      startPhase: "green",
    },
  ],
});

export default signalsOverride;
