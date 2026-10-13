import type { SeedModule } from "../types";

export const module04: SeedModule = {
  slug: "de-m04-road-system",
  order: 4,
  officialTitle: "Straßenverkehrssystem und seine Nutzung",
  title: "The road system",
  summary:
    "Road types, lanes, built-up areas, Autobahn and Kraftfahrstraße, and the special zones in between.",
  intro:
    "Which rules apply depends on which kind of road you are on. The same speed, the same manoeuvre and the same sign can mean different things on a city street and on a motorway, so this module sorts German roads into their legal types.",
  estimatedMinutes: 16,
  lessons: [
    {
      slug: "de-m04-l1-road-types",
      title: "Types of road",
      body: "Germany sorts roads by who maintains them and how they are used:\n\n- **Autobahn (A)** — blue signs, motorway rules, minimum design speed above 60 km/h\n- **Kraftfahrstraße** — the blue car sign; motor vehicles only, but not always divided\n- **Bundesstraße (B)** — yellow plates, the main through routes\n- **Landes-, Kreis- and Gemeindestraßen** — regional and local roads\n\nThe legal distinction that matters most is **innerorts versus außerorts** — inside or outside a built-up area — because it sets the default speed and much else.",
      keyPoints: [
        "Blue motorway sign starts Autobahn rules; the car sign starts Kraftfahrstraße",
        "Yellow plates mark Bundesstraßen",
        "Inside or outside a built-up area decides the default rules",
      ],
      signIds: [
        "de-information-autobahn",
        "de-information-expressway",
        "de-information-bundesstrasse",
      ],
    },
    {
      slug: "de-m04-l2-built-up",
      title: "Built-up areas",
      body: "The yellow **Ortstafel** marks the start of a built-up area. From that sign:\n\n- the limit becomes **50 km/h** unless signed otherwise\n- right-before-left becomes common again on side streets\n- parking and stopping rules tighten\n\nThe crossed-out version on the far side ends it, and the out-of-town limit of 100 km/h applies again. Brake **before** the entry sign, not after it: the limit applies from the sign itself.",
      keyPoints: [
        "The yellow town sign starts the 50 km/h limit at the sign, not after it",
        "The crossed-out sign ends the built-up area",
        "Expect right-before-left on side streets inside towns",
      ],
      signIds: ["de-information-town-entry", "de-information-town-exit"],
    },
    {
      slug: "de-m04-l3-lanes",
      title: "Lanes and lane discipline",
      body: "Germany drives on the right and the **Rechtsfahrgebot** applies: keep as far right as practicable, and use the left lane only to overtake.\n\nInside built-up areas with two or more lanes in your direction, you may choose a lane freely and may pass on the right. Outside them, passing on the right is forbidden except past slow or stationary columns.\n\nLane arrows painted on the road are binding like signs. Once in a lane marked only for turning, you must turn.",
      keyPoints: [
        "Keep right outside built-up areas; the left lane is for overtaking",
        "Inside towns with several lanes you may choose your lane freely",
        "Painted lane arrows are as binding as a sign",
      ],
      signIds: ["de-marking-direction-arrows"],
    },
    {
      slug: "de-m04-l4-special-zones",
      title: "Special zones",
      body: "Four zones change the rules entirely:\n\n- **Zone 30** — 30 km/h across a whole area, usually with right-before-left inside it\n- **Verkehrsberuhigter Bereich** (Spielstraße) — walking pace, pedestrians may use the full width, children may play, parking only in marked spaces\n- **Fußgängerzone** — pedestrians only; you enter only if a plate permits it, then at walking pace\n- **Umweltzone** — a green sticker is required to enter at all\n\nLeaving a traffic-calmed zone counts as joining from a property: you must give way to the road you enter.",
      keyPoints: [
        "Traffic-calmed zone: walking pace, pedestrians have the whole street",
        "Leaving such a zone means giving way to all traffic on the road",
        "An Umweltzone needs the green sticker regardless of your vehicle",
      ],
      signIds: [
        "de-prohibition-zone-30",
        "de-information-residential-zone",
        "de-information-pedestrian-zone",
      ],
    },
    {
      slug: "de-m04-l5-motorway-access",
      title: "Autobahn and Kraftfahrstraße",
      body: "Both are reserved for motor vehicles capable of more than **60 km/h** by design. Bicycles, mopeds, pedestrians and slow agricultural machines are banned.\n\nOn both: no stopping except in an emergency, no reversing, no turning round, and no overtaking on the right.\n\nThe difference is the speed default. The Autobahn has no general limit, with 130 km/h recommended. A Kraftfahrstraße is limited to 100 km/h unless signed otherwise, and may have junctions and oncoming traffic.",
      keyPoints: [
        "Both need a design speed above 60 km/h",
        "Autobahn: no general limit, 130 km/h recommended",
        "Kraftfahrstraße: 100 km/h applies unless signed otherwise",
      ],
      signIds: ["de-information-autobahn", "de-information-expressway"],
    },
  ],
  questions: [
    {
      questionText:
        "From which point does the 50 km/h limit apply when you reach a town?",
      explanation:
        "From the yellow Ortstafel itself, so you must already be at 50 km/h as you pass it.",
      errorPoints: 4,
      options: [
        { text: "From the yellow town-entry sign itself", isCorrect: true },
        { text: "From the first building", isCorrect: false },
        { text: "From 100 metres after the sign", isCorrect: false },
        { text: "From the first junction inside the town", isCorrect: false },
      ],
    },
    {
      questionText: "Which vehicles may use the Autobahn?",
      explanation:
        "Only motor vehicles whose design speed exceeds 60 km/h. Bicycles, mopeds and pedestrians are prohibited.",
      errorPoints: 3,
      options: [
        {
          text: "Motor vehicles capable of more than 60 km/h",
          isCorrect: true,
        },
        { text: "Any motor vehicle", isCorrect: false },
        { text: "Any vehicle capable of more than 40 km/h", isCorrect: false },
        { text: "All vehicles except bicycles", isCorrect: false },
      ],
    },
    {
      questionText: "What speed applies in a verkehrsberuhigter Bereich?",
      explanation:
        "Walking pace, roughly 4 to 7 km/h. Pedestrians including playing children may use the entire width of the street.",
      errorPoints: 4,
      options: [
        { text: "Walking pace", isCorrect: true },
        { text: "30 km/h", isCorrect: false },
        { text: "20 km/h", isCorrect: false },
        { text: "50 km/h as elsewhere in town", isCorrect: false },
      ],
    },
    {
      questionText:
        "You are leaving a traffic-calmed zone onto a normal road. Who has priority?",
      explanation:
        "Traffic on the road you join. Leaving such a zone is treated like emerging from a property entrance.",
      errorPoints: 4,
      options: [
        { text: "Traffic on the road you are joining", isCorrect: true },
        { text: "You, because you were there first", isCorrect: false },
        { text: "Right before left applies", isCorrect: false },
        { text: "Whoever is faster", isCorrect: false },
      ],
    },
    {
      questionText: "What does the Rechtsfahrgebot require?",
      explanation:
        "Keep as far right as practicable. The left lane is for overtaking, not for cruising, outside built-up areas.",
      errorPoints: 3,
      options: [
        { text: "Keep as far right as is practicable", isCorrect: true },
        { text: "Always drive in the middle lane", isCorrect: false },
        { text: "Keep right only on the Autobahn", isCorrect: false },
        { text: "Overtake only on the right", isCorrect: false },
      ],
    },
    {
      questionText:
        "What speed limit applies on a Kraftfahrstraße with no signs?",
      explanation:
        "100 km/h. The 'no general limit' rule belongs to the Autobahn alone, and the two signs are easily confused.",
      errorPoints: 4,
      options: [
        { text: "100 km/h", isCorrect: true },
        { text: "No limit, as on the Autobahn", isCorrect: false },
        { text: "80 km/h", isCorrect: false },
        { text: "130 km/h", isCorrect: false },
      ],
    },
    {
      questionText:
        "Inside a built-up area on a road with two lanes in your direction, may you pass on the right?",
      explanation:
        "Yes. Inside built-up areas with several marked lanes you may choose your lane freely and pass on the right.",
      errorPoints: 3,
      options: [
        { text: "Yes, inside built-up areas this is allowed", isCorrect: true },
        { text: "No, never in Germany", isCorrect: false },
        { text: "Only above 50 km/h", isCorrect: false },
        { text: "Only if the left lane is stationary", isCorrect: false },
      ],
    },
    {
      questionText:
        "What does a yellow rectangular plate with a number such as B 264 tell you?",
      explanation:
        "It identifies a Bundesstraße, a federal road, for navigation. The usual out-of-town rules apply.",
      errorPoints: 2,
      options: [
        { text: "You are on a federal road with that number", isCorrect: true },
        { text: "The distance to the next town", isCorrect: false },
        { text: "A speed limit of 264 metres ahead", isCorrect: false },
        { text: "A motorway exit number", isCorrect: false },
      ],
    },
    {
      questionText: "What do you need to drive into an Umweltzone?",
      explanation:
        "The green emissions sticker on the windscreen. Without it, entry is prohibited and fined, whatever the vehicle.",
      errorPoints: 2,
      options: [
        { text: "A valid green emissions sticker", isCorrect: true },
        { text: "Nothing special for private cars", isCorrect: false },
        { text: "A toll ticket", isCorrect: false },
        { text: "A diesel particulate filter only", isCorrect: false },
      ],
    },
    {
      questionText:
        "Painted arrows in your lane point only right, but you want to go straight on. What applies?",
      explanation:
        "Lane arrows are binding like a sign. From that lane you must turn right; going straight on is an offence.",
      errorPoints: 4,
      options: [
        {
          text: "You must turn right — the arrows are binding",
          isCorrect: true,
        },
        { text: "Arrows are only a recommendation", isCorrect: false },
        {
          text: "You may go straight if no one is behind you",
          isCorrect: false,
        },
        { text: "You may go straight if you signal", isCorrect: false },
      ],
    },
  ],
};
