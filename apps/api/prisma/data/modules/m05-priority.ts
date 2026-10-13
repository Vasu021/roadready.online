import type { SeedModule } from "../types";

export const module05: SeedModule = {
  slug: "de-m05-right-of-way",
  order: 5,
  officialTitle: "Vorfahrt und Verkehrsregelungen",
  title: "Priority and who goes first",
  summary:
    "Rechts vor Links, priority roads, roundabouts, light signals, police officers and the order they override each other in.",
  intro:
    "More exam questions come from this module than any other, and more collisions too. Priority in Germany is a ladder: whoever is higher up decides, and everything below is ignored. Learn the ladder and most junctions answer themselves.",
  estimatedMinutes: 26,
  lessons: [
    {
      slug: "de-m05-l1-ladder",
      title: "The priority ladder",
      body: "When two rules seem to conflict, the higher one wins. From the top:\n\n1. **A police officer** directing traffic\n2. **Light signals** (traffic lights)\n3. **Signs** (give way, stop, priority road)\n4. **General rules** — right before left\n\nA police officer overrides a green light. A green light overrides a give-way sign. A give-way sign overrides right-before-left.\n\nThis single list answers a surprising number of exam questions, including the common trap: lights out of order means the signs apply; no signs means right before left.",
      keyPoints: [
        "Officer beats lights, lights beat signs, signs beat right-before-left",
        "Failed lights fall back to the signs, then to right before left",
        "Never two rules at once — only the highest applies",
      ],
      scene: {
        road: "crossroads",
        view: "top",
        actors: [{ kind: "car", at: "south", you: true, heading: "north" }],
        annotations: [
          {
            kind: "note",
            at: "centre",
            text: "Officer > lights > signs > rechts vor links",
          },
        ],
        caption: "The priority ladder at a crossroads",
      },
    },
    {
      slug: "de-m05-l2-rechts-vor-links",
      title: "Rechts vor Links",
      body: "Where nothing regulates a junction — no officer, no lights, no signs — the vehicle coming from your **right** goes first.\n\nIt applies far more often than learners expect: residential streets, Zone 30 areas, car parks with road-like lanes, and any junction where the signs have been removed.\n\nTwo traps. First, a road that merely looks more important has no priority: width and surface mean nothing. Second, right-before-left applies even when you are going straight on and the other vehicle is turning.",
      keyPoints: [
        "No signs, no lights: the vehicle from the right goes first",
        "A wider or smoother road has no priority of its own",
        "Common inside Zone 30 areas and residential districts",
      ],
      signIds: ["de-danger-crossroads"],
      scene: {
        road: "crossroads",
        view: "top",
        actors: [
          { kind: "car", at: "south", you: true, heading: "north" },
          { kind: "car", at: "east", heading: "west", tone: "accent" },
        ],
        annotations: [{ kind: "order", at: "east", text: "goes first" }],
        caption: "Unmarked crossroads: the car from the right goes first",
      },
    },
    {
      slug: "de-m05-l3-priority-signs",
      title: "Priority roads, give way and stop",
      body: "Four signs do most of the work:\n\n- **Vorfahrtstraße** (yellow diamond) — you have priority on this road until the end sign\n- **Vorfahrt** (triangle, thick bar) — you have priority at the next junction only\n- **Vorfahrt gewähren** (inverted triangle) — give way; stop only if needed\n- **Stop** (octagon) — a full standstill at the line, every time\n\nThe difference between give way and stop is the one examiners test most: a rolling stop at a STOP sign is an offence even on an empty road.",
      keyPoints: [
        "Yellow diamond: priority along the whole road until the end sign",
        "Give way means yield; STOP means a complete standstill, always",
        "The triangle with the thick bar grants priority at one junction only",
      ],
      signIds: [
        "de-priority-road",
        "de-priority-next-intersection",
        "de-priority-give-way",
        "de-priority-stop",
      ],
    },
    {
      slug: "de-m05-l4-priority-course",
      title: "When the priority road bends",
      body: "A yellow diamond with a small black plate below it shows the **course of the priority road** through the next junction. The bold line is the priority road.\n\nIf the bold line turns off and you follow it, you keep priority — but you must signal, because you are changing direction.\n\nIf the bold line turns off and you go straight on, you **lose priority** and must give way. This is the single most misread sign pairing in German traffic, and it appears in the exam regularly.",
      keyPoints: [
        "The bold line on the plate is the priority road, not your intended path",
        "Following the bend keeps priority, but you must still signal",
        "Leaving the bold line means giving way, even going straight on",
      ],
      signIds: [
        "de-combo-priority-road-course",
        "de-additional-priority-course",
      ],
    },
    {
      slug: "de-m05-l5-turning",
      title: "Turning and oncoming traffic",
      body: "Turning does not create priority; it only adds obligations.\n\n- Turning **left**: give way to all oncoming traffic, including vehicles turning right\n- Turning **right**: give way to cyclists and pedestrians going straight on beside you\n- Turning into any road: give way to pedestrians crossing that road\n\nWhen two oncoming vehicles both turn left, they pass **in front of** each other unless markings or the junction layout require otherwise.",
      keyPoints: [
        "Left turn gives way to everything oncoming, including right-turners",
        "Right turn gives way to cyclists and pedestrians going straight",
        "Two opposing left-turners pass in front of each other",
      ],
      scene: {
        road: "crossroads",
        view: "top",
        actors: [
          { kind: "car", at: "south", you: true, heading: "north" },
          { kind: "car", at: "north", heading: "south", tone: "accent" },
        ],
        annotations: [
          { kind: "arrow", from: "south", to: "west" },
          { kind: "order", at: "north", text: "oncoming goes first" },
        ],
        caption: "Turning left means waiting for oncoming traffic",
      },
    },
    {
      slug: "de-m05-l6-roundabouts",
      title: "Roundabouts",
      body: "A roundabout sign on its own means right-before-left applies at entry, which is rare. Almost always it carries a **give-way sign** beneath it, and then traffic already circulating has priority.\n\nThe signalling rule catches people out:\n\n- **Do not signal on entry**\n- **Signal right** shortly before the exit you take\n\nInside the roundabout you may not overtake, and you must not stop on it. Trams running through the middle keep their own priority.",
      keyPoints: [
        "Give way to traffic already on the roundabout",
        "No indicator on entry; right indicator before your exit",
        "No overtaking and no stopping inside a roundabout",
      ],
      signIds: ["de-mandatory-roundabout", "de-priority-give-way"],
      scene: {
        road: "roundabout",
        view: "top",
        actors: [
          { kind: "car", at: "south", you: true, heading: "north" },
          { kind: "car", at: "west", heading: "east", tone: "accent" },
        ],
        signs: [{ id: "de-mandatory-roundabout", at: "right-verge" }],
        caption: "Entering a roundabout: circulating traffic has priority",
      },
    },
    {
      slug: "de-m05-l7-lights",
      title: "Light signals",
      body: "The phases: **red** stop · **red and amber** get ready, still stop · **green** go if clear · **amber** stop unless braking would be dangerous.\n\nA lit **green arrow** in the signal head is a protected turn: conflicting traffic is held. A separate green **arrow plate** beside a red light (Grünpfeil) is different — it allows a right turn on red only **after a complete stop**, and only if you endanger nobody.\n\nFlashing amber warns, grants nothing, and usually means give way to pedestrians.",
      keyPoints: [
        "Red and amber together means prepare — it is still red",
        "Green arrow in the head is protected; the green arrow plate is not",
        "At the Grünpfeil you must stop completely first",
      ],
      signIds: [
        "de-signal-red",
        "de-signal-green",
        "de-combo-red-light-green-arrow",
      ],
    },
    {
      slug: "de-m05-l8-special-priority",
      title: "Trams, buses and emergencies",
      body: "**Rail vehicles** on their own track have priority at crossings, so right-before-left does not help you against a tram. Where a tram runs in the carriageway you normally pass it on the right.\n\nA **bus** signalling to leave a stop must be let out — you may not overtake it then. A bus at a stop with **hazard lights on** may be passed only at walking pace, and not at all while people cross in front of it.\n\n**Blue light with siren** means clear the way immediately, even into a junction if that is the safe option.",
      keyPoints: [
        "Trams have priority over road traffic at crossings",
        "A bus indicating to leave a stop must be allowed out",
        "Blue light plus siren: make room at once; blue light alone is a warning",
      ],
      signIds: ["de-information-bus-stop", "de-signal-tram"],
    },
  ],
  questions: [
    {
      questionText:
        "A police officer waves you through while your light is red. What do you do?",
      explanation:
        "Instructions from an officer stand above light signals, which stand above signs, which stand above the general rules.",
      errorPoints: 5,
      options: [
        {
          text: "Follow the officer — their signals override the lights",
          isCorrect: true,
        },
        { text: "Wait for green; the lights always decide", isCorrect: false },
        {
          text: "Stop and ask the officer for clarification",
          isCorrect: false,
        },
        {
          text: "Follow the officer only if the lights are faulty",
          isCorrect: false,
        },
      ],
    },
    {
      questionText: "The traffic lights at a junction are dark. What applies?",
      explanation:
        "Fall one step down the ladder: the signs at the junction apply, and with no signs, right before left.",
      errorPoints: 4,
      options: [
        {
          text: "The signs apply; with no signs, right before left",
          isCorrect: true,
        },
        { text: "The junction is closed to traffic", isCorrect: false },
        {
          text: "Traffic going straight on always has priority",
          isCorrect: false,
        },
        { text: "Everyone must stop for 30 seconds", isCorrect: false },
      ],
    },
    {
      questionText:
        "A narrow side street joins the wide road you are on. There are no signs. Who has priority?",
      explanation:
        "Width, surface and importance mean nothing. With no signs it is right before left, so a vehicle from the right has priority even from a narrow street.",
      errorPoints: 5,
      options: [
        {
          text: "Whoever comes from the right, regardless of road width",
          isCorrect: true,
        },
        { text: "You, because your road is wider", isCorrect: false },
        { text: "You, because you are on the through road", isCorrect: false },
        { text: "Whoever arrives first", isCorrect: false },
      ],
    },
    {
      questionText:
        "The priority-road plate shows the road bending left. You are going straight on. What applies?",
      explanation:
        "Priority follows the bold line. Leaving it means you give way, even though you are going straight on.",
      errorPoints: 5,
      options: [
        { text: "You lose priority and must give way", isCorrect: true },
        {
          text: "You keep priority because you are going straight",
          isCorrect: false,
        },
        { text: "Right before left applies instead", isCorrect: false },
        { text: "You keep priority but must signal", isCorrect: false },
      ],
    },
    {
      questionText:
        "What must you do at a STOP sign when the crossing road is completely empty?",
      explanation:
        "Come to a complete standstill at the line every time. Rolling through is an offence regardless of traffic.",
      errorPoints: 4,
      options: [
        { text: "Stop completely at the line, then proceed", isCorrect: true },
        { text: "Roll through slowly", isCorrect: false },
        { text: "Treat it as a give-way sign", isCorrect: false },
        { text: "Stop only if you cannot see far enough", isCorrect: false },
      ],
    },
    {
      questionText: "How do you signal at a roundabout?",
      explanation:
        "No indicator when entering; signal right shortly before leaving. Signalling left on entry misleads everyone waiting.",
      errorPoints: 3,
      options: [
        {
          text: "No signal on entry, right signal before the exit",
          isCorrect: true,
        },
        { text: "Left on entry, right on exit", isCorrect: false },
        { text: "Right on entry and on exit", isCorrect: false },
        { text: "No signal at all", isCorrect: false },
      ],
    },
    {
      questionText:
        "You want to turn left; an oncoming car wants to turn right into the same road. Who goes first?",
      explanation:
        "The left-turner gives way to all oncoming traffic, including vehicles turning right.",
      errorPoints: 4,
      options: [
        { text: "The oncoming car turning right", isCorrect: true },
        { text: "You, because you signalled first", isCorrect: false },
        { text: "Right before left decides", isCorrect: false },
        { text: "Both may turn simultaneously", isCorrect: false },
      ],
    },
    {
      questionText:
        "You are turning right. A cyclist beside you is going straight on. Who goes first?",
      explanation:
        "The cyclist. Check the mirror and the blind spot before every right turn — this is a frequent and serious collision type.",
      errorPoints: 5,
      options: [
        { text: "The cyclist going straight on", isCorrect: true },
        { text: "You, because you are ahead", isCorrect: false },
        { text: "Whoever reaches the corner first", isCorrect: false },
        { text: "You, if you signal clearly", isCorrect: false },
      ],
    },
    {
      questionText: "What does red and amber shown together mean?",
      explanation:
        "Prepare to move off, but red still applies. Entering the junction on red and amber is running a red light.",
      errorPoints: 3,
      options: [
        { text: "Get ready — but it is still red", isCorrect: true },
        { text: "You may drive on carefully", isCorrect: false },
        { text: "The lights are faulty", isCorrect: false },
        {
          text: "Stop immediately and switch off the engine",
          isCorrect: false,
        },
      ],
    },
    {
      questionText:
        "A green arrow plate is fixed beside the red light. What are you allowed to do?",
      explanation:
        "Turn right after a complete stop, only when you endanger nobody. Pedestrians and cyclists with green go first.",
      errorPoints: 4,
      options: [
        {
          text: "Turn right after stopping completely, if nobody is endangered",
          isCorrect: true,
        },
        { text: "Turn right without stopping", isCorrect: false },
        { text: "Go straight on", isCorrect: false },
        { text: "Nothing — it is only informational", isCorrect: false },
      ],
    },
    {
      questionText:
        "A tram approaches from your left at an unregulated junction. Who goes first?",
      explanation:
        "Rail vehicles on their own track have priority over road traffic, so right-before-left does not help you here.",
      errorPoints: 4,
      options: [
        { text: "The tram", isCorrect: true },
        { text: "You, because it comes from the left", isCorrect: false },
        { text: "The tram must stop for road traffic", isCorrect: false },
        { text: "Whoever is closer to the junction", isCorrect: false },
      ],
    },
    {
      questionText:
        "A bus at a stop has its hazard warning lights on. How may you pass?",
      explanation:
        "Only at walking pace and with enough clearance, and you must stop if anyone crosses in front of the bus.",
      errorPoints: 5,
      options: [
        {
          text: "At walking pace, stopping if passengers cross",
          isCorrect: true,
        },
        { text: "At the normal speed limit", isCorrect: false },
        { text: "At up to 30 km/h", isCorrect: false },
        { text: "You may not pass until it moves off", isCorrect: false },
      ],
    },
    {
      questionText:
        "You have green, but the junction beyond is blocked by stationary traffic. What do you do?",
      explanation:
        "Green permits, it does not oblige. Entering a junction you cannot clear blocks the crossing traffic when their light turns green.",
      errorPoints: 4,
      options: [
        {
          text: "Wait before the junction until you can clear it",
          isCorrect: true,
        },
        { text: "Drive in — green gives you the right", isCorrect: false },
        { text: "Sound the horn until space appears", isCorrect: false },
        { text: "Move into the junction and wait there", isCorrect: false },
      ],
    },
    {
      questionText:
        "What does a flashing amber light at a pedestrian crossing mean?",
      explanation:
        "It warns only: proceed with caution and give way to pedestrians. It grants no priority to anyone.",
      errorPoints: 3,
      options: [
        {
          text: "Proceed carefully and give way to pedestrians",
          isCorrect: true,
        },
        { text: "You have priority over pedestrians", isCorrect: false },
        { text: "Stop and wait for green", isCorrect: false },
        { text: "The crossing is out of use", isCorrect: false },
      ],
    },
    {
      questionText:
        "An ambulance behind you shows blue lights and sounds its siren. What must you do?",
      explanation:
        "Blue light with siren demands immediate free passage: pull aside and make room, even moving carefully into a junction if that is safest.",
      errorPoints: 5,
      options: [
        {
          text: "Make room immediately, as safely as you can",
          isCorrect: true,
        },
        { text: "Brake hard and stop exactly where you are", isCorrect: false },
        {
          text: "Hold your position and let it find a way around",
          isCorrect: false,
        },
        { text: "Accelerate to clear the road ahead", isCorrect: false },
      ],
    },
    {
      questionText:
        "What does the yellow diamond with a broad black diagonal stripe mean?",
      explanation:
        "End of the priority road. From the next junction right before left or new signs apply.",
      errorPoints: 3,
      options: [
        { text: "The priority road ends here", isCorrect: true },
        { text: "The priority road continues", isCorrect: false },
        { text: "Parking is now permitted", isCorrect: false },
        { text: "A one-way street begins", isCorrect: false },
      ],
    },
  ],
};
