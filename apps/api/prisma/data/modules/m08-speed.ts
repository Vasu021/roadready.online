import type { SeedModule } from "../types";

export const module08: SeedModule = {
  slug: "de-m08-speed-and-distance",
  order: 8,
  officialTitle: "Geschwindigkeit, Abstand und umweltschonende Fahrweise",
  title: "Speed, distance and economy",
  summary:
    "Limits by road and vehicle, following distance, braking in poor conditions, and driving economically.",
  intro:
    "Speed decides whether a mistake is a near miss or a funeral, and distance decides whether you get the chance to react at all. This module also covers the economy side the curriculum requires: the same smooth driving that is safest is also cheapest.",
  estimatedMinutes: 22,
  lessons: [
    {
      slug: "de-m08-l1-limits",
      title: "The general limits",
      body: "Unless a sign says otherwise:\n\n- **50 km/h** inside built-up areas\n- **100 km/h** outside them for cars and motorcycles\n- **No general limit** on the Autobahn, with 130 km/h recommended\n- **80 km/h** for cars with a trailer, including on the Autobahn\n\nA signed limit always beats the general one, and the limit applies from the sign itself.",
      keyPoints: [
        "50 in town, 100 outside, unlimited on much of the Autobahn",
        "Trailers are capped at 80 km/h everywhere outside built-up areas",
        "The general limit returns when a signed one ends",
      ],
      signIds: ["de-prohibition-speed-50", "de-prohibition-speed-100"],
    },
    {
      slug: "de-m08-l2-richtgeschwindigkeit",
      title: "The recommended speed",
      body: "On unrestricted Autobahn sections, 130 km/h is the **Richtgeschwindigkeit** — a recommendation, not a limit. Driving faster is not an offence.\n\nBut it changes liability: if you are involved in a crash above 130 km/h, you can be held partly responsible even if you broke no rule and the other driver caused it. Insurers apply this routinely.",
      keyPoints: [
        "130 km/h is recommended, not enforced",
        "Above it you can share liability for a crash you did not cause",
        "It applies only where no limit is signed",
      ],
    },
    {
      slug: "de-m08-l3-distance",
      title: "Following distance",
      body: "Outside built-up areas keep at least **half the speedometer reading in metres**: 100 km/h means 50 m. The practical check is the two-second rule — pick a fixed point, count two seconds after the car ahead passes it.\n\nIn rain, fog or at night, double it. Lorries over 3.5 t must keep 50 m above 50 km/h on the Autobahn. Tailgating is heavily fined and costs points.",
      keyPoints: [
        "Half the speedometer in metres, outside built-up areas",
        "Two-second rule as the practical check; double it in poor conditions",
        "Tailgating costs a fine, points and possibly a ban",
      ],
    },
    {
      slug: "de-m08-l4-conditions",
      title: "Speed in poor conditions",
      body: "When visibility falls below **50 m** — fog, snow, heavy rain — the maximum is **50 km/h everywhere**, including the Autobahn, and you must use dipped headlights.\n\nFog lights are only allowed when visibility is genuinely impaired; rear fog lights only below 50 m visibility, because they dazzle. Full beam in fog reflects back and makes things worse. On ice, brake gently and in a straight line.",
      keyPoints: [
        "Visibility under 50 m: maximum 50 km/h everywhere",
        "Rear fog lights only below 50 m visibility",
        "Full beam in fog reflects back — use dipped headlights",
      ],
      signIds: ["de-danger-slippery-road"],
    },
    {
      slug: "de-m08-l5-appropriate",
      title: "Choosing an appropriate speed",
      body: "The signed limit is a maximum, not a target. Section 3 StVO requires a speed at which you can stop **within the distance you can see to be clear**.\n\nThat means slowing below the limit for: wet or icy roads, fog, darkness, heavy load, poor tyres, narrow streets with parked cars, children, road works, and any bend where you cannot see the exit.",
      keyPoints: [
        "You must be able to stop within the distance you can see is clear",
        "The limit is a ceiling, not a recommendation",
        "Blind bends, parked cars and children all require less than the limit",
      ],
    },
    {
      slug: "de-m08-l6-economy",
      title: "Driving economically",
      body: "Fuel use and wear come mostly from acceleration and braking, so the smoothest driving is the cheapest.\n\n- Change up early, around 2,000 rpm, and drive in the highest suitable gear\n- Look far ahead and roll off the accelerator instead of braking\n- Switch the engine off at stops longer than about 20 seconds\n- Check tyre pressures monthly: low pressure raises consumption and wear\n- Remove roof boxes and unnecessary load — drag costs most at speed",
      keyPoints: [
        "Shift up early, around 2,000 rpm, and look far ahead",
        "Switch off at stops longer than about 20 seconds",
        "Correct tyre pressure and no roof box when not needed",
      ],
    },
  ],
  questions: [
    {
      questionText:
        "What is the general limit for cars outside built-up areas?",
      explanation:
        "100 km/h unless a sign says otherwise. With a trailer it is 80 km/h.",
      errorPoints: 3,
      options: [
        { text: "100 km/h", isCorrect: true },
        { text: "80 km/h", isCorrect: false },
        { text: "120 km/h", isCorrect: false },
        { text: "130 km/h", isCorrect: false },
      ],
    },
    {
      questionText:
        "You tow a trailer on the Autobahn. Which limit applies by default?",
      explanation:
        "80 km/h. Only a special Tempo-100 authorisation for that combination raises it.",
      errorPoints: 4,
      options: [
        { text: "80 km/h", isCorrect: true },
        { text: "100 km/h", isCorrect: false },
        { text: "130 km/h", isCorrect: false },
        { text: "No limit, as for cars", isCorrect: false },
      ],
    },
    {
      questionText: "What does the 130 km/h Richtgeschwindigkeit mean?",
      explanation:
        "A recommendation. Exceeding it is legal, but it can make you partly liable in a crash.",
      errorPoints: 4,
      options: [
        {
          text: "A recommendation that affects liability in a crash",
          isCorrect: true,
        },
        { text: "A hard limit enforced by cameras", isCorrect: false },
        { text: "A minimum speed", isCorrect: false },
        { text: "A limit for lorries only", isCorrect: false },
      ],
    },
    {
      questionText:
        "What following distance should you keep at 100 km/h outside built-up areas?",
      explanation:
        "Half the speedometer in metres: at least 50 m, and more in rain, fog or darkness.",
      errorPoints: 4,
      options: [
        { text: "At least 50 metres", isCorrect: true },
        { text: "At least 10 metres", isCorrect: false },
        { text: "At least 25 metres", isCorrect: false },
        { text: "Two car lengths", isCorrect: false },
      ],
    },
    {
      questionText:
        "Fog reduces visibility to about 40 m. What is the maximum speed?",
      explanation:
        "50 km/h everywhere, including the Autobahn, with dipped headlights on.",
      errorPoints: 5,
      options: [
        { text: "50 km/h", isCorrect: true },
        { text: "80 km/h", isCorrect: false },
        { text: "100 km/h", isCorrect: false },
        { text: "Whatever is signed", isCorrect: false },
      ],
    },
    {
      questionText: "When may you use rear fog lights?",
      explanation:
        "Only when visibility is genuinely below 50 m. They are very bright and dazzle following drivers otherwise.",
      errorPoints: 4,
      options: [
        { text: "Only when visibility is below 50 metres", isCorrect: true },
        { text: "Whenever it rains", isCorrect: false },
        { text: "At night on unlit roads", isCorrect: false },
        { text: "Whenever you like", isCorrect: false },
      ],
    },
    {
      questionText: "Why should you not use full beam in fog?",
      explanation:
        "The light reflects back off the droplets and reduces what you can see. Dipped headlights work better.",
      errorPoints: 3,
      options: [
        {
          text: "It reflects back and makes visibility worse",
          isCorrect: true,
        },
        { text: "It is only banned at night", isCorrect: false },
        { text: "It drains the battery", isCorrect: false },
        { text: "It is allowed and recommended", isCorrect: false },
      ],
    },
    {
      questionText: "What does section 3 StVO require about speed?",
      explanation:
        "You must be able to stop within the distance you can see to be clear — which is often well below the signed limit.",
      errorPoints: 4,
      options: [
        {
          text: "You must be able to stop within your range of vision",
          isCorrect: true,
        },
        { text: "You must always drive at the signed limit", isCorrect: false },
        { text: "You must never drive below the limit", isCorrect: false },
        { text: "Speed is only regulated by signs", isCorrect: false },
      ],
    },
    {
      questionText:
        "At what engine speed should you change up for economical driving?",
      explanation:
        "Around 2,000 rpm. Driving in the highest suitable gear cuts both fuel use and noise.",
      errorPoints: 2,
      options: [
        { text: "About 2,000 rpm", isCorrect: true },
        { text: "About 4,000 rpm", isCorrect: false },
        { text: "Just below the red line", isCorrect: false },
        { text: "It makes no difference", isCorrect: false },
      ],
    },
    {
      questionText:
        "How long a stop makes switching off the engine worthwhile?",
      explanation:
        "From roughly 20 seconds. Modern start-stop systems do this automatically.",
      errorPoints: 2,
      options: [
        { text: "About 20 seconds", isCorrect: true },
        { text: "About five minutes", isCorrect: false },
        { text: "Never — restarting uses more fuel", isCorrect: false },
        { text: "Only when parked", isCorrect: false },
      ],
    },
    {
      questionText: "How does under-inflated tyre pressure affect driving?",
      explanation:
        "It raises fuel consumption and wear, lengthens braking and worsens handling. Check monthly.",
      errorPoints: 3,
      options: [
        { text: "More fuel, more wear and worse braking", isCorrect: true },
        { text: "Better grip in the wet", isCorrect: false },
        { text: "No measurable effect", isCorrect: false },
        { text: "Lower fuel consumption", isCorrect: false },
      ],
    },
    {
      questionText: "What is the two-second rule?",
      explanation:
        "A practical check of following distance: after the car ahead passes a fixed point, at least two seconds should elapse before you do. Double it in poor conditions.",
      errorPoints: 3,
      options: [
        {
          text: "A practical check that your following distance is enough",
          isCorrect: true,
        },
        { text: "The time you may hold a phone", isCorrect: false },
        { text: "How long an indicator must run", isCorrect: false },
        { text: "The time allowed to stop at a STOP sign", isCorrect: false },
      ],
    },
  ],
};
