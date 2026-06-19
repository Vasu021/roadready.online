import { makeScenario } from "./makeScenario";

// Railway crossing (Bahnübergang) — SIMPLIFIED for now: a stop zone on Road 2 and
// the teaching/MCQs carry the rule. (Deepen later: a dedicated level-crossing prop
// with Andreaskreuz, barriers and tracks — see TASKS.md.)
const railwayCrossing = makeScenario({
  slug: "railway-crossing",
  name: "Railway Crossing",
  description:
    "Trains have absolute priority at a level crossing — stop when warned and never cross blind.",
  difficulty: "medium",
  stopZone: { cx: -38, cz: -5, hw: 5, hd: 4 },
  decisions: [
    {
      id: "railway-stop",
      triggerX: -32,
      prompt: "You're approaching a railway level crossing.",
      teaching:
        "At a Bahnübergang the St Andrew's cross gives trains absolute priority. Approach slowly, stop if the lights flash red or the barriers are down, and never cross until it's completely clear — never weave around closing barriers.",
    },
  ],
  objectiveText: { "railway-stop": "Stop for the railway crossing" },
});

export default railwayCrossing;
