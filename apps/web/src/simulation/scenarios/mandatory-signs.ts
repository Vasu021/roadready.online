import { makeScenario, approachSign } from "./makeScenario";

// Mandatory signs (blue, round): they tell you what you MUST do. (Uses the blue
// roundabout sign as the representative mandatory face for now — see TASKS.md.)
const mandatorySigns = makeScenario({
  slug: "mandatory-signs",
  name: "Mandatory Direction Signs",
  description:
    "Blue round signs are mandatory — they tell you which way you must go.",
  difficulty: "easy",
  signs: [approachSign("roundabout", 12)],
  decisions: [
    {
      id: "obey-mandatory",
      triggerZ: 8,
      prompt: "A blue sign tells you which way you must go.",
      teaching:
        "Blue round signs are mandatory: they tell you what you must do — follow the arrow's direction, use the prescribed lane, or take the roundabout. You have to obey them, not just treat them as advice.",
    },
  ],
  objectiveText: { "obey-mandatory": "Follow the mandatory direction" },
});

export default mandatorySigns;
