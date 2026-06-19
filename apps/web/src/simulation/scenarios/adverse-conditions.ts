import { makeScenario } from "./makeScenario";

// Fog, rain and night driving — SIMPLIFIED for now: the teaching/MCQs carry the
// rule. (Deepen later: actual reduced-visibility / day-night scene effects — see
// TASKS.md.)
const adverseConditions = makeScenario({
  slug: "adverse-conditions",
  name: "Fog, Rain & Night Driving",
  description:
    "Adapt your speed, distance and lights to fog, rain and darkness.",
  difficulty: "medium",
  decisions: [
    {
      id: "adapt-conditions",
      triggerZ: 16,
      prompt: "Fog and rain are reducing your visibility.",
      teaching:
        "In fog, rain or darkness, slow down and increase your following distance. Use dipped headlights (rear fog lights only below 50 m visibility), and never use full beam in fog as it dazzles you. Drive to the distance you can actually see.",
    },
  ],
  objectiveText: { "adapt-conditions": "Adapt to the conditions" },
});

export default adverseConditions;
