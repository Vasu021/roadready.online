import { makeScenario, approachSign, leadCar } from "./makeScenario";

// Autobahn rules — SIMPLIFIED for now: a faster straight section on Road 1 with an
// autobahn sign and a slower car to overtake. (Deepen later: a dedicated long
// multi-lane Autobahn — see TASKS.md.)
const autobahnRules = makeScenario({
  slug: "autobahn-rules",
  name: "Autobahn Rules",
  description:
    "Keep right, overtake only on the left, and respect the recommended speed.",
  difficulty: "medium",
  waypoints: [
    { x: 0, z: 30, speed: 13 },
    { x: 0, z: 6, speed: 5 },
    { x: 0, z: -1, speed: 2.5 },
    { x: -10, z: -5, speed: 4 },
    { x: -30, z: -5, speed: 10 },
    { x: -44, z: -5, speed: 2 },
  ],
  signs: [approachSign("autobahn", 33)],
  decisions: [
    {
      id: "autobahn-keep-right",
      triggerZ: 24,
      prompt: "You're on the Autobahn and a slower vehicle is in your lane.",
      teaching:
        "On the Autobahn keep right and overtake only on the left, never on the right. Where there's no limit the recommended speed is 130 km/h, and the hard shoulder is for emergencies only — not for driving or undertaking.",
    },
  ],
  objectiveText: {
    "autobahn-keep-right": "Keep right and overtake on the left",
  },
  npcs: [leadCar("ab-lead", 6)],
});

export default autobahnRules;
