import type { SeedModule } from "../types";

export const module09: SeedModule = {
  slug: "de-m09-manoeuvres",
  order: 9,
  officialTitle: "Verkehrsverhalten bei Fahrmanövern, Verkehrsbeobachtung",
  title: "Manoeuvres and observation",
  summary:
    "Moving off, lane changes, overtaking, turning, reversing, the blind spot and the Schulterblick.",
  intro:
    "Every manoeuvre in Germany follows the same sequence: mirror, signal, shoulder check, act. Learn the sequence once and it applies to moving off, changing lane, overtaking and turning alike.",
  estimatedMinutes: 24,
  lessons: [
    {
      slug: "de-m09-l1-sequence",
      title: "Mirror, signal, shoulder check",
      body: "The order matters and the exam tests it: **Spiegel, Blinker, Schulterblick** — mirror, indicator, shoulder check, then move.\n\nThe mirror tells you what is behind, the indicator tells others what you intend, and the shoulder check covers the blind spot the mirrors cannot show. Skipping the shoulder check is the single most common cause of lane-change collisions.",
      keyPoints: [
        "Mirror, then indicator, then shoulder check, then move",
        "Mirrors always leave a blind spot alongside and behind",
        "Indicate early enough to be understood, but not so early it misleads",
      ],
    },
    {
      slug: "de-m09-l2-moving-off",
      title: "Moving off",
      body: "Moving off from the kerb means joining traffic, so everyone already on the road has priority. Mirror, indicate, shoulder check, and pull out only when you force nobody to brake.\n\nWatch for cyclists passing on your nearside and pedestrians stepping off the kerb. The same applies when leaving a property entrance, a car park or a field track.",
      keyPoints: [
        "Traffic already on the road always has priority over you",
        "Shoulder check specifically for cyclists on the nearside",
        "Leaving a driveway or car park follows the same rule",
      ],
    },
    {
      slug: "de-m09-l3-lane-change",
      title: "Changing lane",
      body: "Same sequence, plus patience: a lane change must not force anyone to brake or swerve. On the Autobahn, check twice — a closing car at 180 km/h covers far more ground than it appears to.\n\nNever change two lanes in one movement. In congested traffic use the zip merge (Reißverschluss): merge alternately at the point where the lane ends, not 500 m early.",
      keyPoints: [
        "A lane change may not force anyone to brake",
        "One lane at a time, with a shoulder check each time",
        "Zip merge at the point the lane ends, alternately",
      ],
    },
    {
      slug: "de-m09-l4-overtaking",
      title: "Overtaking",
      body: "Overtake on the **left**, except past slow or stationary columns and inside built-up areas with several marked lanes.\n\nIt is forbidden where you cannot see far enough, at and before pedestrian crossings, where a no-overtaking sign or solid line applies, and at level crossings. You must return to the right as soon as it is safe, without cutting in.",
      keyPoints: [
        "Overtake on the left; the right only past slow columns",
        "Forbidden at crossings, on solid lines and where sight is limited",
        "Return right promptly, without cutting in",
      ],
      signIds: ["de-prohibition-no-overtaking", "de-marking-solid-line"],
    },
    {
      slug: "de-m09-l5-turning",
      title: "Turning",
      body: "Position early: right turns close to the kerb, left turns towards the centre line. Indicate in good time, check the shoulder, and keep the speed low enough to stop.\n\nTurning right: give way to cyclists and pedestrians going straight. Turning left: give way to all oncoming traffic, then to pedestrians crossing the road you enter.",
      keyPoints: [
        "Position early and indicate in good time",
        "Right turn: cyclists and pedestrians first",
        "Left turn: all oncoming traffic, then pedestrians",
      ],
    },
    {
      slug: "de-m09-l6-reversing",
      title: "Reversing and turning round",
      body: "Reversing is a manoeuvre where you have no priority at all: everyone else does. Look over your shoulder through the rear window; cameras and sensors assist but do not replace that.\n\nReversing is prohibited on the Autobahn and Kraftfahrstraße, and in one-way streets against the arrow. If you cannot see, get out and look, or have someone guide you.",
      keyPoints: [
        "When reversing you have no priority over anyone",
        "Never reverse on the Autobahn or against a one-way arrow",
        "If you cannot see, get out and look",
      ],
    },
    {
      slug: "de-m09-l7-blind-spot",
      title: "The blind spot",
      body: "Even well-adjusted mirrors leave an area alongside and just behind the car where a whole vehicle disappears. A car, a cyclist and a motorcycle can all hide there.\n\nAdjust mirrors so the side of your own car is just visible at the inner edge — that minimises the gap. Then the shoulder check closes what remains. On lorries the blind spots are far larger, which is why you must not sit beside them.",
      keyPoints: [
        "Mirrors always leave a blind spot the shoulder check must cover",
        "Adjust mirrors so your own car is just visible at the inner edge",
        "Lorry blind spots are much larger — do not linger alongside",
      ],
    },
    {
      slug: "de-m09-l8-observation",
      title: "Systematic observation",
      body: "Good observation is a rhythm, not an effort: far ahead for developing situations, near for what is immediate, mirrors every five to eight seconds, and the edges for what might emerge.\n\nBefore every manoeuvre the rhythm tightens into the mirror–signal–shoulder sequence. In towns, watch gaps between parked cars; on country roads, field exits and verges; on the Autobahn, the lane two ahead.",
      keyPoints: [
        "Check mirrors every five to eight seconds as a habit",
        "Watch gaps between parked cars in towns",
        "On the Autobahn watch the lane two cars ahead, not just the one in front",
      ],
    },
  ],
  questions: [
    {
      questionText: "What is the correct order before changing lane?",
      explanation:
        "Mirror, indicator, shoulder check, then move. The shoulder check comes last because it covers the blind spot at the moment you act.",
      errorPoints: 5,
      options: [
        { text: "Mirror, indicator, shoulder check, move", isCorrect: true },
        { text: "Indicator, mirror, move", isCorrect: false },
        { text: "Shoulder check, mirror, indicator, move", isCorrect: false },
        { text: "Mirror, move, indicator", isCorrect: false },
      ],
    },
    {
      questionText: "You are moving off from the kerb. Who has priority?",
      explanation:
        "All traffic already on the road, including cyclists passing on your nearside.",
      errorPoints: 4,
      options: [
        { text: "Traffic already on the road", isCorrect: true },
        { text: "You, once you indicate", isCorrect: false },
        { text: "Right before left applies", isCorrect: false },
        { text: "Whoever is faster", isCorrect: false },
      ],
    },
    {
      questionText:
        "Why is the shoulder check necessary when the mirrors are correctly adjusted?",
      explanation:
        "Mirrors always leave a blind spot where a whole vehicle can hide. Only a direct look covers it.",
      errorPoints: 5,
      options: [
        {
          text: "A blind spot remains that mirrors cannot show",
          isCorrect: true,
        },
        { text: "Mirrors distort distances", isCorrect: false },
        { text: "It is only required in the driving test", isCorrect: false },
        { text: "It is not necessary with modern mirrors", isCorrect: false },
      ],
    },
    {
      questionText: "Where does the zip merge (Reißverschluss) take place?",
      explanation:
        "At the point where the lane actually ends, merging alternately. Merging early wastes road and causes longer jams.",
      errorPoints: 4,
      options: [
        { text: "At the point the lane ends, alternately", isCorrect: true },
        { text: "As early as possible", isCorrect: false },
        { text: "500 metres before the obstruction", isCorrect: false },
        { text: "Wherever a gap appears first", isCorrect: false },
      ],
    },
    {
      questionText: "On which side do you overtake outside built-up areas?",
      explanation:
        "On the left. Passing on the right is only allowed past slow-moving or stationary columns, and then carefully.",
      errorPoints: 4,
      options: [
        { text: "On the left", isCorrect: true },
        { text: "On the right", isCorrect: false },
        { text: "Either side", isCorrect: false },
        { text: "On the right above 100 km/h", isCorrect: false },
      ],
    },
    {
      questionText: "Where is overtaking always prohibited?",
      explanation:
        "At and immediately before pedestrian crossings, at level crossings, and wherever a sign or solid line forbids it.",
      errorPoints: 4,
      options: [
        { text: "At and before pedestrian crossings", isCorrect: true },
        { text: "On any two-lane road", isCorrect: false },
        { text: "Only at night", isCorrect: false },
        { text: "Only on the Autobahn", isCorrect: false },
      ],
    },
    {
      questionText: "You have just overtaken. What must you do next?",
      explanation:
        "Return to the right as soon as it is safe, without cutting in on the vehicle you passed.",
      errorPoints: 3,
      options: [
        {
          text: "Return right as soon as it is safe, without cutting in",
          isCorrect: true,
        },
        { text: "Stay in the left lane for a kilometre", isCorrect: false },
        { text: "Stay left until the next junction", isCorrect: false },
        { text: "Brake to show you have finished", isCorrect: false },
      ],
    },
    {
      questionText: "Where is reversing prohibited?",
      explanation:
        "On the Autobahn and Kraftfahrstraße, and against the arrow in a one-way street.",
      errorPoints: 4,
      options: [
        {
          text: "On the Autobahn and against a one-way arrow",
          isCorrect: true,
        },
        { text: "In any built-up area", isCorrect: false },
        { text: "Only on hills", isCorrect: false },
        { text: "Nowhere — it is always allowed", isCorrect: false },
      ],
    },
    {
      questionText: "When reversing, what priority do you have?",
      explanation:
        "None. Everyone else has priority, and if you cannot see you must get out and look or be guided.",
      errorPoints: 4,
      options: [
        { text: "None — everyone else has priority", isCorrect: true },
        { text: "The same as when driving forward", isCorrect: false },
        { text: "Priority over pedestrians", isCorrect: false },
        { text: "Priority if you use hazard lights", isCorrect: false },
      ],
    },
    {
      questionText: "How should side mirrors be adjusted?",
      explanation:
        "So the side of your own car is just visible at the inner edge. That gives the widest view and the smallest blind spot.",
      errorPoints: 3,
      options: [
        {
          text: "So your own car is just visible at the inner edge",
          isCorrect: true,
        },
        { text: "So you can see only your own car", isCorrect: false },
        { text: "Pointing at the kerb", isCorrect: false },
        { text: "Pointing at the sky to avoid dazzle", isCorrect: false },
      ],
    },
    {
      questionText:
        "How often should you check your mirrors while driving normally?",
      explanation:
        "Roughly every five to eight seconds, as a rhythm, so you always know what is behind before you need to act.",
      errorPoints: 2,
      options: [
        { text: "Every five to eight seconds", isCorrect: true },
        { text: "Only before braking", isCorrect: false },
        { text: "Once a minute", isCorrect: false },
        { text: "Only before overtaking", isCorrect: false },
      ],
    },
    {
      questionText:
        "You want to turn left at a junction. Where do you position the car?",
      explanation:
        "Towards the centre line, indicating early, so following traffic can pass on your right where the road allows.",
      errorPoints: 3,
      options: [
        { text: "Towards the centre line, indicating early", isCorrect: true },
        { text: "Close to the right kerb", isCorrect: false },
        { text: "In the middle of your lane throughout", isCorrect: false },
        { text: "In the oncoming lane", isCorrect: false },
      ],
    },
    {
      questionText: "May you change two lanes in one movement on the Autobahn?",
      explanation:
        "No. Change one lane at a time with a shoulder check each time, so drivers in the far lane are not surprised.",
      errorPoints: 4,
      options: [
        { text: "No — one lane at a time", isCorrect: true },
        { text: "Yes, if you indicate", isCorrect: false },
        { text: "Yes, if the road is empty", isCorrect: false },
        { text: "Yes, below 100 km/h", isCorrect: false },
      ],
    },
    {
      questionText: "What should you watch for between parked cars in a town?",
      explanation:
        "Pedestrians, especially children, stepping out where you cannot see them. Reduce speed and cover the brake.",
      errorPoints: 4,
      options: [
        { text: "Pedestrians stepping out unseen", isCorrect: true },
        { text: "Nothing — they are parked", isCorrect: false },
        { text: "Only opening doors", isCorrect: false },
        { text: "Only other cars pulling out", isCorrect: false },
      ],
    },
    {
      questionText:
        "When may you pass a queue of slow-moving traffic on the right?",
      explanation:
        "Only when the column is slow-moving or stationary, and then only with a slightly higher speed and great care.",
      errorPoints: 4,
      options: [
        {
          text: "When the column is slow or stationary, and only carefully",
          isCorrect: true,
        },
        { text: "Whenever the right lane is free", isCorrect: false },
        { text: "Never under any circumstances", isCorrect: false },
        { text: "Only on the Autobahn above 120 km/h", isCorrect: false },
      ],
    },
    {
      questionText:
        "A lane change forces a following car to brake. What does that mean?",
      explanation:
        "The manoeuvre was not permissible: a lane change must never force anyone to brake or swerve.",
      errorPoints: 4,
      options: [
        { text: "The lane change should not have been made", isCorrect: true },
        { text: "It is acceptable if you indicated", isCorrect: false },
        { text: "The following driver was too close", isCorrect: false },
        { text: "It is acceptable on the Autobahn", isCorrect: false },
      ],
    },
  ],
};
