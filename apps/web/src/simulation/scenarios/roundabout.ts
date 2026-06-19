import { makeScenario, approachSign, crossingCar } from "./makeScenario";

// Roundabout (Kreisverkehr) — SIMPLIFIED for now: the shared L-junction stands in
// for the ring, with a roundabout + give-way sign on approach and circulating
// traffic to yield to. (Deepen later: a true circular road mesh — see TASKS.md.)
const roundabout = makeScenario({
  slug: "roundabout",
  name: "Roundabout (Kreisverkehr)",
  description:
    "Give way to traffic already in the roundabout; signal out, not in.",
  difficulty: "medium",
  signs: [approachSign("roundabout", 14), approachSign("give-way", 8)],
  decisions: [
    {
      id: "roundabout-yield",
      triggerZ: 6,
      prompt: "You're approaching a roundabout with a give-way sign.",
      teaching:
        "At a German roundabout, give way to vehicles already circulating — don't indicate on entry, and signal right just before you leave. In a single-lane roundabout, don't overtake cyclists.",
    },
  ],
  objectiveText: { "roundabout-yield": "Yield to traffic in the roundabout" },
  npcs: [crossingCar("rab-circulating", 7)],
});

export default roundabout;
