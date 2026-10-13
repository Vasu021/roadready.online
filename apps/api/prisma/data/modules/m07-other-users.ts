import type { SeedModule } from "../types";

export const module07: SeedModule = {
  slug: "de-m07-other-road-users",
  order: 7,
  officialTitle: "Andere Teilnehmer im Straßenverkehr",
  title: "Sharing the road",
  summary:
    "Pedestrians, children, cyclists, e-scooters, motorcyclists, lorries and blind spots, trams, buses and animals.",
  intro:
    "The people most likely to be killed in traffic are the ones not inside a car. German law puts the heavier duty on the stronger road user, and this module is where that principle becomes specific rules.",
  estimatedMinutes: 26,
  lessons: [
    {
      slug: "de-m07-l1-pedestrians",
      title: "Pedestrians and crossings",
      body: "At a **Fußgängerüberweg** (zebra crossing) you must let anyone who clearly wants to cross go first, including wheelchair and mobility-scooter users. Approach at a speed from which you can stop.\n\nOvertaking at or immediately before a crossing is prohibited, and you may not stop within 5 m before it. Where there is no crossing, pedestrians still have priority over any vehicle turning into the road they are crossing.",
      keyPoints: [
        "Let anyone clearly intending to cross a zebra go first",
        "No overtaking at or before a crossing, no stopping within 5 m",
        "Turning into a road means giving way to pedestrians crossing it",
      ],
      signIds: ["de-information-pedestrian-crossing", "de-marking-crosswalk"],
    },
    {
      slug: "de-m07-l2-children",
      title: "Children",
      body: "Children misjudge speed and distance, are hidden by parked cars, and act on impulse. The law expects you to anticipate that: near children you must drive at a speed and with a readiness to brake that allows for their mistakes.\n\nTriggers to slow down: a ball in the road, a school or kindergarten, a bus at a stop, children on the pavement, an ice-cream van. Under eight they must cycle on the pavement; up to ten they may.",
      keyPoints: [
        "Expect sudden, unpredictable movement and reduce speed in advance",
        "A ball means a child is about to follow it",
        "Children under eight cycle on the pavement, up to ten they may",
      ],
      signIds: ["de-danger-children"],
    },
    {
      slug: "de-m07-l3-cyclists",
      title: "Cyclists",
      body: "Overtaking a cyclist requires at least **1.5 m** inside built-up areas and **2 m** outside. If you cannot leave that space, you may not overtake.\n\nCyclists going straight on have priority over your turn. Check mirror and blind spot before every right turn. Before opening a door, look over your shoulder — a dooring collision is the door-opener's fault. Expect contraflow cyclists in one-way streets where a plate allows it.",
      keyPoints: [
        "1.5 m clearance in town, 2 m outside — otherwise do not overtake",
        "A cyclist going straight beats your turn",
        "Look over your shoulder before opening a door",
      ],
      signIds: [
        "de-mandatory-cycle-path",
        "de-danger-cyclists",
        "de-additional-except-cyclists",
      ],
    },
    {
      slug: "de-m07-l4-escooters",
      title: "E-scooters and small vehicles",
      body: "E-scooters (Elektrokleinstfahrzeuge) are limited to 20 km/h, need insurance plates, and must use cycle paths where present, otherwise the carriageway. Pavements are prohibited. One rider only, and the alcohol limits are the same as for cars.\n\nTreat them as cyclists when overtaking: the same 1.5 m applies, and they are less stable than a bicycle.",
      keyPoints: [
        "E-scooters belong on cycle paths or the road, never the pavement",
        "Same alcohol limits as a car, and an insurance plate is required",
        "Overtake with the same clearance as a cyclist",
      ],
    },
    {
      slug: "de-m07-l5-motorcyclists",
      title: "Motorcyclists",
      body: "Motorcycles are narrow and hard to judge: they look further away and slower than they are, which is why left-turning cars so often pull across them. Look twice before turning across an oncoming motorcycle.\n\nThey are also easily hidden in a blind spot and destabilised by gusts, oil, gravel and tram rails. Leave them the full width of the lane when overtaking.",
      keyPoints: [
        "A motorcycle appears further away and slower than it is",
        "Look twice before turning left across one",
        "They are destabilised by gravel, oil and crosswinds",
      ],
    },
    {
      slug: "de-m07-l6-trucks",
      title: "Lorries and blind spots",
      body: "A lorry's blind spots cover the whole nearside, a long stretch directly behind, and an area in front of the cab. If you cannot see the mirrors, the driver cannot see you.\n\nTurning lorries swing wide and cut in: never move up the inside of one that is indicating. They also need far longer to stop, so never pull in sharply in front of one and leave extra space in a queue.",
      keyPoints: [
        "If you cannot see the lorry's mirrors, the driver cannot see you",
        "Never move up the inside of a lorry that is turning",
        "Lorries need much longer to stop — do not cut in",
      ],
    },
    {
      slug: "de-m07-l7-buses-trams",
      title: "Buses and trams",
      body: "A bus signalling to leave a stop must be let out; you may not overtake it then. A bus at a stop with **hazard lights on** may be passed only at walking pace, and you must stop if anyone crosses.\n\nA school bus with hazard lights gets the same treatment in both directions on an undivided road. Trams are normally passed on the right, keep priority on their own track, and need a wide berth because they cannot steer.",
      keyPoints: [
        "Hazard lights at a stop mean walking pace, and stop if people cross",
        "A bus indicating to leave the stop must be allowed out",
        "Pass trams on the right; they cannot steer around you",
      ],
      signIds: ["de-information-bus-stop"],
    },
    {
      slug: "de-m07-l8-animals",
      title: "Animals and horse riders",
      body: "Wild animals cross most at dawn and dusk. If one appears: brake in a straight line, dip the headlights, sound the horn — do not swerve into oncoming traffic. Where one animal crossed, expect more.\n\nHorses are easily startled: pass slowly, widely and without revving or sounding the horn. Herded livestock on the road has priority and must be passed at walking pace.",
      keyPoints: [
        "Brake straight, never swerve, and expect a second animal",
        "Pass horses slowly, widely and quietly",
        "A collision with game must be reported for the insurance claim",
      ],
      signIds: ["de-danger-animals"],
    },
  ],
  questions: [
    {
      questionText:
        "What lateral distance must you leave when overtaking a cyclist in a built-up area?",
      explanation:
        "At least 1.5 m inside built-up areas and 2 m outside. If that is impossible, you must not overtake.",
      errorPoints: 5,
      options: [
        { text: "At least 1.5 metres", isCorrect: true },
        { text: "At least 0.5 metres", isCorrect: false },
        { text: "At least 1 metre", isCorrect: false },
        { text: "No fixed distance applies", isCorrect: false },
      ],
    },
    {
      questionText:
        "An oncoming van makes a 1.5 m gap impossible. May you overtake the cyclist?",
      explanation:
        "No. If the required clearance is not available you must stay behind and wait.",
      errorPoints: 5,
      options: [
        {
          text: "No — wait until you can leave the full clearance",
          isCorrect: true,
        },
        { text: "Yes, if you pass slowly", isCorrect: false },
        { text: "Yes, if you sound the horn first", isCorrect: false },
        { text: "Yes, the cyclist must move over", isCorrect: false },
      ],
    },
    {
      questionText:
        "A pedestrian is waiting at the kerb of a zebra crossing. What must you do?",
      explanation:
        "Let them cross. You must slow down early enough to stop, and may not overtake at the crossing.",
      errorPoints: 5,
      options: [
        { text: "Slow down and let them cross", isCorrect: true },
        { text: "Continue — they have not stepped out yet", isCorrect: false },
        { text: "Sound the horn to warn them", isCorrect: false },
        { text: "Stop only if they are already on the road", isCorrect: false },
      ],
    },
    {
      questionText: "Where must children under eight ride their bicycles?",
      explanation:
        "On the pavement. Up to their tenth birthday they may choose pavement or cycle path, so expect them in both.",
      errorPoints: 3,
      options: [
        { text: "On the pavement", isCorrect: true },
        { text: "On the road with other cyclists", isCorrect: false },
        { text: "Only on marked cycle paths", isCorrect: false },
        { text: "They may not cycle at all", isCorrect: false },
      ],
    },
    {
      questionText:
        "You are about to open your door after parking beside a cycle lane. What must you do?",
      explanation:
        "Check the mirror and look over your shoulder. A dooring collision is the fault of whoever opened the door.",
      errorPoints: 4,
      options: [
        {
          text: "Check mirrors and look over your shoulder first",
          isCorrect: true,
        },
        { text: "Open it quickly so cyclists notice early", isCorrect: false },
        { text: "Nothing — cyclists must avoid parked cars", isCorrect: false },
        { text: "Sound the horn before opening", isCorrect: false },
      ],
    },
    {
      questionText: "Where may an e-scooter be ridden?",
      explanation:
        "On cycle paths where they exist, otherwise the carriageway. Pavements are prohibited, and only one person may ride.",
      errorPoints: 3,
      options: [
        {
          text: "On cycle paths, or the road where there is none",
          isCorrect: true,
        },
        { text: "On the pavement", isCorrect: false },
        { text: "Anywhere pedestrians may walk", isCorrect: false },
        { text: "Only in pedestrian zones", isCorrect: false },
      ],
    },
    {
      questionText: "Why do drivers so often pull out in front of motorcycles?",
      explanation:
        "A narrow vehicle appears further away and slower than it is, so the gap looks bigger than it is. Look twice.",
      errorPoints: 4,
      options: [
        {
          text: "Narrow vehicles look further away and slower than they are",
          isCorrect: true,
        },
        { text: "Motorcycles are usually speeding", isCorrect: false },
        { text: "Motorcycles have no right of way", isCorrect: false },
        { text: "Their headlights are too dim to see", isCorrect: false },
      ],
    },
    {
      questionText:
        "A lorry ahead is indicating right at a junction. What must you not do?",
      explanation:
        "Never move up its inside. A turning lorry swings wide then cuts in, and you would be in its blind spot.",
      errorPoints: 5,
      options: [
        { text: "Move up the inside of it", isCorrect: true },
        { text: "Hold back and wait", isCorrect: false },
        { text: "Stay where the driver can see you", isCorrect: false },
        { text: "Leave extra space behind it", isCorrect: false },
      ],
    },
    {
      questionText: "How do you know you are in a lorry's blind spot?",
      explanation:
        "If you cannot see the lorry's mirrors, the driver cannot see you. Move out of that position.",
      errorPoints: 4,
      options: [
        { text: "You cannot see the lorry's mirrors", isCorrect: true },
        { text: "The lorry sounds its horn", isCorrect: false },
        { text: "You are directly behind it", isCorrect: false },
        { text: "Lorries have no blind spots", isCorrect: false },
      ],
    },
    {
      questionText:
        "A bus at a stop has its hazard lights on. How may you pass?",
      explanation:
        "Only at walking pace, and you must stop if anyone crosses in front of the bus.",
      errorPoints: 5,
      options: [
        { text: "At walking pace, stopping if people cross", isCorrect: true },
        { text: "At the normal limit", isCorrect: false },
        { text: "At up to 30 km/h", isCorrect: false },
        { text: "Not at all until it leaves", isCorrect: false },
      ],
    },
    {
      questionText: "A bus signals to pull out of a stop. What applies?",
      explanation:
        "You must let it out, and may not overtake it at that moment. Brake if necessary.",
      errorPoints: 4,
      options: [
        { text: "You must let it out", isCorrect: true },
        { text: "You have priority on the through road", isCorrect: false },
        {
          text: "You may overtake if you are already alongside",
          isCorrect: false,
        },
        { text: "The bus must wait for a gap", isCorrect: false },
      ],
    },
    {
      questionText:
        "On which side do you normally pass a tram running in the carriageway?",
      explanation:
        "On the right. Passing on the left is only allowed where there is no room on the right, for instance in a one-way street.",
      errorPoints: 3,
      options: [
        { text: "On the right", isCorrect: true },
        { text: "On the left", isCorrect: false },
        { text: "Either side freely", isCorrect: false },
        { text: "You may never pass a tram", isCorrect: false },
      ],
    },
    {
      questionText:
        "A deer runs onto the road ahead. What is the correct reaction?",
      explanation:
        "Brake in a straight line, dip the lights and sound the horn. Swerving into oncoming traffic turns an animal collision into a head-on one.",
      errorPoints: 5,
      options: [
        { text: "Brake straight ahead and do not swerve", isCorrect: true },
        { text: "Swerve into the opposite lane", isCorrect: false },
        { text: "Accelerate past it", isCorrect: false },
        { text: "Flash full beam and continue", isCorrect: false },
      ],
    },
    {
      questionText:
        "You pass one deer crossing safely. What should you expect?",
      explanation:
        "More animals. Deer move in groups, so slow down and stay ready after the first one has crossed.",
      errorPoints: 4,
      options: [
        { text: "Further animals following it", isCorrect: true },
        { text: "That the road is now clear", isCorrect: false },
        { text: "That it will come back the same way", isCorrect: false },
        { text: "Nothing in particular", isCorrect: false },
      ],
    },
    {
      questionText: "How do you pass a horse and rider?",
      explanation:
        "Slowly, widely and quietly. Revving or sounding the horn can startle the horse into the road.",
      errorPoints: 4,
      options: [
        {
          text: "Slowly, with a wide gap, without revving or horn",
          isCorrect: true,
        },
        { text: "Quickly, to spend less time alongside", isCorrect: false },
        { text: "Sounding the horn so the rider knows", isCorrect: false },
        { text: "Close, so you can pass within the lane", isCorrect: false },
      ],
    },
    {
      questionText:
        "You want to turn right. A cyclist on the cycle lane is going straight on. Who goes first?",
      explanation:
        "The cyclist. Mirror and shoulder check before every right turn; this is one of the most common serious collisions in cities.",
      errorPoints: 5,
      options: [
        { text: "The cyclist", isCorrect: true },
        { text: "You, if you indicate", isCorrect: false },
        { text: "Whoever is in front", isCorrect: false },
        { text: "You, because a car is larger", isCorrect: false },
      ],
    },
  ],
};
