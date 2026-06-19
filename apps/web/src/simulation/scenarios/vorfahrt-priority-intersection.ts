import { makeScenario, approachSign } from "./makeScenario";

// Zeichen 301 ("Vorfahrt"): priority at the NEXT intersection only — unlike the
// continuous Vorfahrtstraße. (Uses the closest existing sign face for now.)
const vorfahrtPriorityIntersection = makeScenario({
  slug: "vorfahrt-priority-intersection",
  name: "Vorfahrt — Priority at Next Intersection",
  description:
    "The Vorfahrt sign grants priority at the next junction only, not continuously.",
  difficulty: "easy",
  signs: [approachSign("priority-road", 12)],
  decisions: [
    {
      id: "vorfahrt-next",
      triggerZ: 8,
      prompt:
        "A sign tells you that you have priority at the next intersection.",
      teaching:
        "Zeichen 301 ('Vorfahrt') gives you priority at the next junction only — unlike the Vorfahrtstraße diamond, which is continuous. Side-road traffic must let you go, but be ready in case your priority ends after the junction.",
    },
  ],
  objectiveText: { "vorfahrt-next": "Take priority at the next junction" },
});

export default vorfahrtPriorityIntersection;
