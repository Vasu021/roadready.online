import { makeScenario, approachSign } from "./makeScenario";

// Warning signs (red triangle): danger ahead — slow down and be ready to react.
const warningSigns = makeScenario({
  slug: "warning-signs",
  name: "Warning Signs",
  description:
    "Red triangular signs warn of a hazard ahead — junctions, crossings, children.",
  difficulty: "easy",
  signs: [approachSign("children", 20), approachSign("crossing", 12)],
  decisions: [
    {
      id: "heed-warning",
      triggerZ: 8,
      prompt: "A red triangular sign warns of a hazard ahead.",
      teaching:
        "Red-bordered triangles warn of danger ahead — a junction, a crossing, children, and so on. They don't change priority by themselves; slow down and be ready to react to what they warn about.",
    },
  ],
  objectiveText: { "heed-warning": "React to the warning sign" },
});

export default warningSigns;
