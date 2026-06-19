import { makeScenario } from "./makeScenario";

// Halten vs Parken and where stopping/parking is forbidden. Decision on Road 2,
// alongside the parking-bay markings drawn on its south kerb.
const parkingRulesDe = makeScenario({
  slug: "parking-rules-de",
  name: "Parking & Stopping",
  description:
    "Know the difference between Halten and Parken and where stopping is forbidden.",
  difficulty: "easy",
  decisions: [
    {
      id: "park-legally",
      triggerX: -24,
      prompt: "You're looking for somewhere to stop along this street.",
      teaching:
        "Don't park within 5 m of a junction, on or near crossings, or where you'd obstruct others. 'Halten' is a short stop; 'Parken' means leaving the car or stopping for over three minutes — and at night make sure the car stays visible.",
    },
  ],
  objectiveText: { "park-legally": "Stop and park legally" },
});

export default parkingRulesDe;
