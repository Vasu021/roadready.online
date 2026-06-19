import { makeScenario, approachSign } from "./makeScenario";

// Trams (Straßenbahn) generally have priority; pass a stopped tram carefully.
const tramPriority = makeScenario({
  slug: "tram-priority",
  name: "Tram Priority",
  description:
    "Give way to trams and pass a stopped tram letting passengers on or off carefully.",
  difficulty: "medium",
  signs: [approachSign("tram", 12)],
  decisions: [
    {
      id: "tram-priority",
      triggerZ: 8,
      prompt: "A tram is approaching the junction.",
      teaching:
        "Trams (Straßenbahn) generally have priority — give way to them and never overtake on the wrong side. If a stopped tram is letting passengers on or off where there's no island, pass at walking pace or wait.",
    },
  ],
  objectiveText: { "tram-priority": "Give priority to the tram" },
});

export default tramPriority;
