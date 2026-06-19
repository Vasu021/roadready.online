import { makeScenario, road2Sign } from "./makeScenario";

// Full stop at the line at a STOP sign (Zeichen 206), even when the road is clear.
const stopSign = makeScenario({
  slug: "stop-sign",
  name: "Stop Sign",
  description:
    "Come to a complete stop at the line at a STOP sign, then give way.",
  difficulty: "beginner",
  signs: [road2Sign("stop", -44)],
  stopZone: { cx: -45, cz: -5, hw: 5, hd: 4 },
  decisions: [
    {
      id: "full-stop",
      triggerX: -38,
      prompt: "There's a STOP sign at the line ahead.",
      teaching:
        "A STOP sign (Zeichen 206) requires a complete stop at the line every time — even if the road looks clear — and only then may you give way and move off.",
    },
  ],
  objectiveText: { "full-stop": "Come to a full stop at the line" },
});

export default stopSign;
