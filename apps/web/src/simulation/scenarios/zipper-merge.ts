import { makeScenario } from "./makeScenario";

// Zipper merge (Reißverschlussverfahren): merge alternately where a lane ends.
const zipperMerge = makeScenario({
  slug: "zipper-merge",
  name: "Zipper Merge",
  description:
    "Merge alternately at the point a lane ends — the Reißverschlussverfahren.",
  difficulty: "medium",
  decisions: [
    {
      id: "zipper-merge",
      triggerZ: 18,
      prompt: "Your lane is ending ahead and traffic must merge.",
      teaching:
        "Use the zipper merge (Reißverschlussverfahren): stay in your lane until it actually ends, then merge alternately — one car from each lane in turn. Merging too early wastes road and causes jams.",
    },
  ],
  objectiveText: { "zipper-merge": "Merge using the zipper system" },
  // A car in the adjacent lane that converges toward the player's lane.
  npcs: [
    {
      id: "zm-merger",
      variant: "car",
      behavior: "free",
      speed: 6,
      path: [
        { x: 2.4, z: 28, speed: 6 },
        { x: 0.9, z: 4, speed: 4 },
        { x: -10, z: -5, speed: 4 },
        { x: -52, z: -5, speed: 6 },
      ],
    },
  ],
});

export default zipperMerge;
