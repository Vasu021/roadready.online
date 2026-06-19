import { makeScenario } from "./makeScenario";

// Mirror–Signal–Maneuver (Spiegel–Blinker–Schulterblick) before turning left.
// A cyclist riding straight on the bike lane makes the shoulder check matter.
const mirrorSignalManeuver = makeScenario({
  slug: "mirror-signal-maneuver",
  name: "Mirror, Signal, Maneuver",
  description:
    "Practise Spiegel–Blinker–Schulterblick before turning or changing lane.",
  difficulty: "beginner",
  decisions: [
    {
      id: "mirror-signal",
      triggerZ: 8,
      prompt: "You're approaching the junction and need to turn left.",
      teaching:
        "Use Spiegel–Blinker–Schulterblick: check your mirror, signal in good time, then do a shoulder check (Schulterblick) for cyclists and traffic in your blind spot before you turn.",
    },
  ],
  objectiveText: {
    "mirror-signal": "Mirror, signal, shoulder-check before turning",
  },
  npcs: [
    {
      id: "msm-cyclist",
      variant: "cyclist",
      behavior: "free",
      loop: true,
      speed: 5,
      path: [
        { x: -2.85, z: 30, speed: 5 },
        { x: -2.85, z: -9, speed: 5 },
      ],
    },
  ],
});

export default mirrorSignalManeuver;
