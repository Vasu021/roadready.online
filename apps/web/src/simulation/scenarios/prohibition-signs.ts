import { makeScenario, approachSign } from "./makeScenario";

// Prohibition signs (round, red border): no entry and no overtaking.
const prohibitionSigns = makeScenario({
  slug: "prohibition-signs",
  name: "Prohibition Signs",
  description:
    "Red-bordered round signs forbid something — for example no entry or no overtaking.",
  difficulty: "easy",
  signs: [approachSign("no-overtaking", 20), approachSign("no-entry", 10)],
  decisions: [
    {
      id: "obey-prohibition",
      triggerZ: 8,
      prompt: "A no-entry sign blocks the road ahead.",
      teaching:
        "Round red-bordered signs forbid something: a solid red circle with a white bar is 'no entry' (do not drive in), and the two-car symbol means 'no overtaking'. Obey them until a sign cancels the restriction.",
    },
  ],
  objectiveText: { "obey-prohibition": "Obey the prohibition signs" },
});

export default prohibitionSigns;
