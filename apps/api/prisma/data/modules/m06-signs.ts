import type { SeedModule } from "../types";

export const module06: SeedModule = {
  slug: "de-m06-signs-and-markings",
  order: 6,
  officialTitle:
    "Verkehrszeichen und Verkehrseinrichtungen sowie Bahnübergänge",
  title: "Signs, markings and level crossings",
  summary:
    "Every sign family, what the shapes and colours mean, road markings, barriers and railway crossings.",
  intro:
    "German signs are a system, not a list. Shape and colour tell you what kind of instruction you are getting before you read the symbol — and that is what lets you react at speed. This module teaches the system, then the exceptions.",
  estimatedMinutes: 30,
  lessons: [
    {
      slug: "de-m06-l1-system",
      title: "Reading the system",
      body: "Shape and colour carry the meaning:\n\n- **Red triangle** — danger. A warning, never an order.\n- **Red circle** — prohibition. Something is forbidden.\n- **Blue circle** — mandatory. Something is required.\n- **Blue rectangle** — information.\n- **Yellow diamond** — priority road.\n\nOnce you know the family you know what kind of reaction is needed, even before the symbol registers.",
      keyPoints: [
        "Triangle warns, red circle forbids, blue circle orders, rectangle informs",
        "Yellow diamond is always the priority road",
        "Read shape and colour first, symbol second",
      ],
      signIds: [
        "de-danger-general",
        "de-prohibition-no-entry",
        "de-mandatory-straight",
        "de-priority-road",
      ],
    },
    {
      slug: "de-m06-l2-danger",
      title: "Danger signs",
      body: "Red triangles warn of a hazard ahead. Outside built-up areas they stand roughly 150 to 250 m before it; inside, much closer, so you have less warning.\n\nThey give nobody priority and forbid nothing. The required response is always the same: reduce speed, increase distance, and be ready to brake.",
      keyPoints: [
        "150 to 250 m warning outside towns, much shorter inside",
        "A danger sign never grants or removes priority",
        "Response: slower, more distance, cover the brake",
      ],
      signIds: [
        "de-danger-children",
        "de-danger-slippery-road",
        "de-danger-road-narrows",
        "de-danger-animals",
      ],
    },
    {
      slug: "de-m06-l3-prohibition",
      title: "Prohibition signs",
      body: "Round, red-bordered, white field. They forbid: entry, overtaking, parking, stopping, or exceeding a speed.\n\nA restriction runs until it is cancelled — by an end sign, by a different limit, by the end of all restrictions sign, or by entering or leaving a built-up area. **Ende aller Streckenverbote** cancels every signed restriction on that stretch at once, but not zone signs such as Zone 30.",
      keyPoints: [
        "A limit runs until cancelled, not for a fixed distance",
        "Entering a town replaces an earlier limit with 50 km/h",
        "End-of-all-restrictions does not end a Zone 30",
      ],
      signIds: [
        "de-prohibition-speed-50",
        "de-prohibition-no-overtaking",
        "de-prohibition-no-stopping",
        "de-prohibition-all-end",
      ],
    },
    {
      slug: "de-m06-l4-mandatory",
      title: "Mandatory signs",
      body: "Round and blue. They prescribe rather than forbid: a direction you must take, a path you must use, a minimum speed you must keep.\n\nA prescribed direction allows only that manoeuvre. Blue path signs also create duties for others: cars may not drive or park on a compulsory cycle path, and must give way to it when turning across.",
      keyPoints: [
        "Blue circle orders; a prescribed direction allows nothing else",
        "A blue number is a minimum speed, not a maximum",
        "Cars may never drive or stop on a compulsory cycle path",
      ],
      signIds: [
        "de-mandatory-turn-right",
        "de-mandatory-roundabout",
        "de-mandatory-cycle-path",
        "de-mandatory-minimum-speed",
      ],
    },
    {
      slug: "de-m06-l5-information",
      title: "Information signs",
      body: "Mostly rectangles. They inform and sometimes start a legal regime: the Autobahn sign starts motorway rules, the one-way sign forbids driving against the arrow, a traffic-calmed zone sign imposes walking pace.\n\nSo an information sign is not always merely informative. Read what regime it begins.",
      keyPoints: [
        "The Autobahn sign starts motorway rules, not just a road name",
        "One-way means no entry against the arrow and no reversing against it",
        "Zone signs start a regime that runs until the end sign",
      ],
      signIds: [
        "de-information-autobahn",
        "de-information-one-way",
        "de-information-residential-zone",
        "de-information-dead-end",
      ],
    },
    {
      slug: "de-m06-l6-zusatzzeichen",
      title: "Supplementary plates",
      body: "Small white plates under a sign narrow or extend it, and they are legally binding. They can restrict it to a vehicle type, to wet conditions, to certain hours, to a distance or a length of road, or exempt residents, cyclists or deliveries.\n\nAlways read the plate before obeying or ignoring the sign above it. A no-entry sign with a lorry plate does not apply to your car.",
      keyPoints: [
        "The plate changes the sign above it and is equally binding",
        "bei Nässe applies only while the road is visibly wet",
        "Anlieger frei permits only people with business on that road",
      ],
      signIds: [
        "de-additional-when-wet",
        "de-additional-residents-excepted",
        "de-additional-trucks-only",
        "de-additional-time-restriction",
      ],
    },
    {
      slug: "de-m06-l7-combinations",
      title: "Combinations you meet in reality",
      body: "On a real post a sign rarely stands alone, and the combination is what the exam tests.\n\n- 30 with **bei Nässe** — the limit applies only on a wet road\n- No parking with **Anlieger frei** — residents may park, you may not\n- Priority road with a **course plate** — priority may leave your path\n- Red light with a **green arrow** — right turn after a full stop\n\nRead the whole post, from the top down, before deciding.",
      keyPoints: [
        "Read the entire post before acting on the top sign",
        "A plate can remove the restriction for you entirely",
        "The priority-course plate is the most misread combination",
      ],
      signIds: [
        "de-combo-speed30-when-wet",
        "de-combo-no-parking-residents",
        "de-combo-priority-road-course",
        "de-combo-red-light-green-arrow",
      ],
    },
    {
      slug: "de-m06-l8-markings",
      title: "Road markings",
      body: "Paint carries the same legal force as a sign on a post.\n\n- **Broken line** — may be crossed when safe\n- **Solid line** — may not be crossed or straddled\n- **Solid beside broken** — only the side with the broken line may cross\n- **Stop line** — stop here at a red light or STOP sign\n- **Wartelinie** (broken transverse) — where to wait when giving way; you may roll on if clear\n- **Hatched area** — treat as a wall\n\nYellow temporary markings override white ones at road works.",
      keyPoints: [
        "Markings bind exactly like signs",
        "With a solid line on your side you may not cross; the broken side may",
        "Yellow road-works markings override the white lines",
      ],
      signIds: [
        "de-marking-solid-line",
        "de-marking-solid-and-broken",
        "de-marking-stop-line",
        "de-marking-hatched-area",
      ],
    },
    {
      slug: "de-m06-l9-einrichtungen",
      title: "Traffic installations",
      body: "Verkehrseinrichtungen are the physical equipment: beacons, barriers, cones, guide posts and directional boards at road works.\n\nRed and white striped boards point the way round an obstruction — the stripes slope **down towards the side you must pass**. Barriers and beacons may never be driven round, moved or ignored, and at road works temporary arrangements replace the permanent ones entirely.",
      keyPoints: [
        "Striped boards slope down towards the side you pass on",
        "Never drive around or move a barrier",
        "At road works the temporary arrangement replaces the permanent one",
      ],
    },
    {
      slug: "de-m06-l10-level-crossings",
      title: "Level crossings",
      body: "The **Andreaskreuz** marks the crossing itself, and rail traffic always has priority.\n\nApproach at a speed from which you can stop. Never drive onto the crossing unless you can clear it completely, and never queue onto the tracks. Approaching barriers, a red light or a bell means stop before the cross.\n\nIf your vehicle stops on the tracks: get everyone out immediately, then call the emergency number shown at the crossing.",
      keyPoints: [
        "Rail always has priority; the St Andrew's cross marks the crossing",
        "Cross only if you can clear the tracks completely",
        "Stuck on the tracks: people out first, then call for help",
      ],
      signIds: [
        "de-danger-andreaskreuz",
        "de-danger-railway-barrier",
        "de-danger-railway-no-barrier",
      ],
    },
  ],
  questions: [
    {
      questionText: "What does a red-bordered triangle always tell you?",
      explanation:
        "It warns of a hazard ahead. It never orders or forbids anything and never changes priority.",
      errorPoints: 3,
      options: [
        {
          text: "A hazard is coming — slow down and be ready",
          isCorrect: true,
        },
        { text: "Something is forbidden", isCorrect: false },
        { text: "You have priority ahead", isCorrect: false },
        { text: "A direction you must follow", isCorrect: false },
      ],
    },
    {
      questionText:
        "How far before the hazard does a danger sign stand outside built-up areas?",
      explanation:
        "Roughly 150 to 250 m. Inside built-up areas it stands much closer, so you have far less warning.",
      errorPoints: 2,
      options: [
        { text: "About 150 to 250 metres", isCorrect: true },
        { text: "About 10 to 20 metres", isCorrect: false },
        { text: "Exactly one kilometre", isCorrect: false },
        { text: "At the hazard itself", isCorrect: false },
      ],
    },
    {
      questionText:
        "A round blue sign shows the number 30. What does it require?",
      explanation:
        "A blue circle prescribes. It is a minimum speed: you may not drive slower than 30 km/h unless conditions force you to.",
      errorPoints: 4,
      options: [
        { text: "You must not drive slower than 30 km/h", isCorrect: true },
        { text: "You must not drive faster than 30 km/h", isCorrect: false },
        { text: "30 km/h is recommended", isCorrect: false },
        { text: "A 30-zone begins", isCorrect: false },
      ],
    },
    {
      questionText:
        "You pass a 70 limit, then the yellow town-entry sign. Which limit applies?",
      explanation:
        "The town sign starts the built-up area and with it the general 50 km/h limit, replacing the earlier 70.",
      errorPoints: 4,
      options: [
        { text: "50 km/h", isCorrect: true },
        { text: "70 km/h until an end sign", isCorrect: false },
        { text: "30 km/h", isCorrect: false },
        { text: "100 km/h", isCorrect: false },
      ],
    },
    {
      questionText:
        "A 30 sign carries a plate reading 'bei Nässe'. When does the limit apply?",
      explanation:
        "Only while the carriageway is visibly wet. On a dry road the general limit applies.",
      errorPoints: 3,
      options: [
        { text: "Only while the road surface is wet", isCorrect: true },
        { text: "Always, the plate is informational", isCorrect: false },
        { text: "Only when it is actually raining", isCorrect: false },
        { text: "Only in winter", isCorrect: false },
      ],
    },
    {
      questionText:
        "A no-entry sign carries a plate showing a lorry. You drive a car. What applies?",
      explanation:
        "The plate narrows the prohibition to the vehicles shown. Cars may enter.",
      errorPoints: 3,
      options: [
        {
          text: "You may drive in — the ban applies to lorries only",
          isCorrect: true,
        },
        { text: "Nobody may enter", isCorrect: false },
        { text: "You may enter only at walking pace", isCorrect: false },
        { text: "You may enter only if you live there", isCorrect: false },
      ],
    },
    {
      questionText:
        "There is a solid line on your side and a broken line on the other. May you overtake?",
      explanation:
        "No. The line on your side governs your behaviour; the oncoming side may cross, you may not.",
      errorPoints: 4,
      options: [
        { text: "No — the solid line is on your side", isCorrect: true },
        { text: "Yes, because one line is broken", isCorrect: false },
        { text: "Yes, if the road is clear", isCorrect: false },
        { text: "Yes, but only motorcycles", isCorrect: false },
      ],
    },
    {
      questionText: "What must you do at a hatched area (Sperrfläche)?",
      explanation:
        "Treat it as a wall: you may not drive on it or stop in it. It usually protects a merge, a turning lane or a refuge.",
      errorPoints: 3,
      options: [
        { text: "Keep off it entirely", isCorrect: true },
        { text: "Drive across it if the road is clear", isCorrect: false },
        { text: "Use it to overtake", isCorrect: false },
        { text: "Park on it briefly", isCorrect: false },
      ],
    },
    {
      questionText:
        "Yellow markings and white markings disagree at road works. Which do you follow?",
      explanation:
        "Yellow temporary markings override the white permanent ones for the duration of the works.",
      errorPoints: 4,
      options: [
        { text: "The yellow ones", isCorrect: true },
        { text: "The white ones", isCorrect: false },
        { text: "Whichever is clearer", isCorrect: false },
        { text: "Neither — follow the car in front", isCorrect: false },
      ],
    },
    {
      questionText: "What does 'Ende aller Streckenverbote' cancel?",
      explanation:
        "Every signed restriction on that stretch at once — limits, overtaking bans and similar. It does not end a zone such as Zone 30.",
      errorPoints: 3,
      options: [
        {
          text: "All signed restrictions on that stretch, but not zone signs",
          isCorrect: true,
        },
        { text: "Only the speed limit", isCorrect: false },
        { text: "Everything including Zone 30", isCorrect: false },
        { text: "Nothing — it is only a warning", isCorrect: false },
      ],
    },
    {
      questionText:
        "What is the difference between one diagonal stripe and two crossed stripes on a blue round sign?",
      explanation:
        "One stripe forbids parking but allows brief stops; two crossed stripes forbid stopping at all.",
      errorPoints: 4,
      options: [
        {
          text: "One forbids parking, two forbid stopping altogether",
          isCorrect: true,
        },
        { text: "One applies to cars, two to lorries", isCorrect: false },
        { text: "They mean the same", isCorrect: false },
        { text: "One applies at night only", isCorrect: false },
      ],
    },
    {
      questionText: "What does the St Andrew's cross mark?",
      explanation:
        "The level crossing itself, where rail traffic always has priority.",
      errorPoints: 3,
      options: [
        { text: "A level crossing where rail has priority", isCorrect: true },
        { text: "A crossroads with right before left", isCorrect: false },
        { text: "A closed road", isCorrect: false },
        { text: "A tram stop", isCorrect: false },
      ],
    },
    {
      questionText:
        "Traffic is queuing beyond a level crossing. What do you do?",
      explanation:
        "Wait before the crossing. Never drive onto the tracks unless you can clear them completely.",
      errorPoints: 5,
      options: [
        {
          text: "Wait before the crossing until you can clear it fully",
          isCorrect: true,
        },
        { text: "Cross and wait on the tracks", isCorrect: false },
        { text: "Cross quickly before the barrier falls", isCorrect: false },
        { text: "Sound the horn and continue", isCorrect: false },
      ],
    },
    {
      questionText:
        "Your car stalls on a level crossing and will not restart. What first?",
      explanation:
        "Get everyone out and away from the tracks immediately, then call the emergency number displayed at the crossing.",
      errorPoints: 5,
      options: [
        {
          text: "Get everyone out, then call the number at the crossing",
          isCorrect: true,
        },
        { text: "Keep trying to start the engine", isCorrect: false },
        {
          text: "Stay inside and switch on the hazard lights",
          isCorrect: false,
        },
        { text: "Push the car forward alone", isCorrect: false },
      ],
    },
    {
      questionText:
        "Red and white striped boards stand at road works. What do the stripes tell you?",
      explanation: "They slope down towards the side you must pass on.",
      errorPoints: 3,
      options: [
        { text: "Which side to pass on", isCorrect: true },
        { text: "The distance to the works", isCorrect: false },
        { text: "The speed limit through the works", isCorrect: false },
        { text: "That the road is closed", isCorrect: false },
      ],
    },
    {
      questionText:
        "What does a blue square with a single white arrow pointing up mean?",
      explanation:
        "A one-way street: traffic flows only in the arrow's direction, and reversing against it is prohibited.",
      errorPoints: 3,
      options: [
        { text: "A one-way street", isCorrect: true },
        { text: "You must drive straight on", isCorrect: false },
        { text: "A priority road begins", isCorrect: false },
        { text: "A dead end", isCorrect: false },
      ],
    },
    {
      questionText:
        "You see a no-parking sign with 'Anlieger frei'. You are visiting a friend who lives there. What applies?",
      explanation:
        "Anlieger frei covers people with genuine business on that road, including visitors. Using it as a shortcut is not allowed.",
      errorPoints: 3,
      options: [
        {
          text: "You may park — you have business on that road",
          isCorrect: true,
        },
        { text: "Only residents themselves may park", isCorrect: false },
        { text: "Nobody may park", isCorrect: false },
        { text: "You may park for three minutes only", isCorrect: false },
      ],
    },
    {
      questionText: "What does a Wartelinie (broken transverse line) require?",
      explanation:
        "It marks where to wait when you must give way, but it is not a stop line: you may roll on if the road is clear.",
      errorPoints: 3,
      options: [
        {
          text: "Wait there if necessary, but you need not stop if clear",
          isCorrect: true,
        },
        { text: "Stop completely, like a STOP sign", isCorrect: false },
        { text: "It marks a pedestrian crossing", isCorrect: false },
        { text: "It marks the edge of a cycle lane", isCorrect: false },
      ],
    },
    {
      questionText:
        "A compulsory cycle path runs beside the road. What does that mean for you as a driver?",
      explanation:
        "You may not drive, stop or park on it, and when turning across it you must give way to cyclists going straight on.",
      errorPoints: 4,
      options: [
        {
          text: "Keep off it entirely and give way when turning across",
          isCorrect: true,
        },
        { text: "You may use it when the road is congested", isCorrect: false },
        { text: "You may stop on it briefly", isCorrect: false },
        { text: "Cyclists must give way to you", isCorrect: false },
      ],
    },
    {
      questionText: "Which shape and colour always indicates a priority road?",
      explanation:
        "The yellow diamond. It is unique in the catalogue and worth recognising instantly.",
      errorPoints: 2,
      options: [
        { text: "A yellow diamond", isCorrect: true },
        { text: "A blue circle", isCorrect: false },
        { text: "A red triangle", isCorrect: false },
        { text: "A white octagon", isCorrect: false },
      ],
    },
  ],
};
