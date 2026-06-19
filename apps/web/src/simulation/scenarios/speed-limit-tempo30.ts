import { makeScenario, approachSign } from "./makeScenario";

// Speed limits and the Tempo-30 zone.
const speedLimitTempo30 = makeScenario({
  slug: "speed-limit-tempo30",
  name: "Speed Limits & Tempo-30 Zone",
  description: "Keep to posted limits and slow to 30 km/h in a Tempo-30 zone.",
  difficulty: "beginner",
  signs: [approachSign("speed-limit", 16, 30)],
  decisions: [
    {
      id: "tempo30",
      triggerZ: 12,
      prompt: "You're entering a 30 km/h zone.",
      teaching:
        "A red ring with '30' (or a Tempo-30-Zone sign) means a 30 km/h limit. Slow down before the sign, keep to the limit throughout the zone, and expect Rechts vor Links at the junctions inside it.",
    },
  ],
  objectiveText: { tempo30: "Keep to the 30 km/h limit" },
});

export default speedLimitTempo30;
