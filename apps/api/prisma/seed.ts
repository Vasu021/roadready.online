import { PrismaClient, ScenarioType } from "@prisma/client";

const prisma = new PrismaClient();

const DE_FACTS =
  "<p>Germany is home to the famous <strong>Autobahn</strong> — sections with no speed limit, though 130 km/h is recommended. The <strong>Rechts vor Links</strong> rule gives priority to traffic from the right at unmarked intersections. Driving licenses are among the most expensive in Europe, averaging <strong>€2,000–€4,000</strong>. The blood alcohol limit is <strong>0.5 g/L</strong> (0.0 for new drivers). Emergency vehicles require a <strong>Rettungsgasse</strong> (rescue lane) on motorways.</p>";

const FR_FACTS =
  "<p>France drives on the <strong>right side</strong> of the road. The <strong>Priorité à droite</strong> rule gives priority to vehicles coming from the right at unmarked intersections — the opposite of what many expect. Speed limits are strictly enforced via radar cameras (radars automatiques). The BAC limit is <strong>0.5 g/L</strong> (lower than many countries). Wearing a seatbelt is mandatory for all passengers.</p>";

async function main() {
  console.log("Seeding database...");

  // ── Countries ─────────────────────────────────────────────────────────────
  const germany = await prisma.country.upsert({
    where: { code: "DE" },
    update: { facts: DE_FACTS },
    create: {
      code: "DE",
      name: "Germany",
      flagEmoji: "🇩🇪",
      isActive: true,
      facts: DE_FACTS,
    },
  });
  console.log(`Country: ${germany.name}`);

  const france = await prisma.country.upsert({
    where: { code: "FR" },
    update: { facts: FR_FACTS },
    create: {
      code: "FR",
      name: "France",
      flagEmoji: "🇫🇷",
      isActive: true,
      facts: FR_FACTS,
    },
  });
  console.log(`Country: ${france.name}`);

  // ── Germany Categories (6) ────────────────────────────────────────────────
  const [basicSkillsDe, priorityDe, signalsDe, roadSignsDe, vruDe, specialDe] =
    await Promise.all([
      prisma.scenarioCategory.upsert({
        where: { id: "cat-de-basic" },
        update: { countryId: germany.id, name: "Basic Skills", order: 1 },
        create: {
          id: "cat-de-basic",
          countryId: germany.id,
          name: "Basic Skills",
          order: 1,
        },
      }),
      prisma.scenarioCategory.upsert({
        where: { id: "cat-de-priority" },
        update: {
          countryId: germany.id,
          name: "Right of Way & Priority",
          order: 2,
        },
        create: {
          id: "cat-de-priority",
          countryId: germany.id,
          name: "Right of Way & Priority",
          order: 2,
        },
      }),
      prisma.scenarioCategory.upsert({
        where: { id: "cat-de-signals" },
        update: {
          countryId: germany.id,
          name: "Traffic Lights & Signals",
          order: 3,
        },
        create: {
          id: "cat-de-signals",
          countryId: germany.id,
          name: "Traffic Lights & Signals",
          order: 3,
        },
      }),
      prisma.scenarioCategory.upsert({
        where: { id: "cat-de-signs" },
        update: { countryId: germany.id, name: "Road Signs", order: 4 },
        create: {
          id: "cat-de-signs",
          countryId: germany.id,
          name: "Road Signs",
          order: 4,
        },
      }),
      prisma.scenarioCategory.upsert({
        where: { id: "cat-de-vru" },
        update: {
          countryId: germany.id,
          name: "Vulnerable Road Users",
          order: 5,
        },
        create: {
          id: "cat-de-vru",
          countryId: germany.id,
          name: "Vulnerable Road Users",
          order: 5,
        },
      }),
      prisma.scenarioCategory.upsert({
        where: { id: "cat-de-special" },
        update: {
          countryId: germany.id,
          name: "Special Situations & Highway",
          order: 6,
        },
        create: {
          id: "cat-de-special",
          countryId: germany.id,
          name: "Special Situations & Highway",
          order: 6,
        },
      }),
    ]);
  console.log(
    "Germany categories: Basic Skills, Right of Way & Priority, Traffic Lights & Signals, Road Signs, Vulnerable Road Users, Special Situations & Highway",
  );

  // ── France Categories ─────────────────────────────────────────────────────
  const [basicSkillsFr, trafficRulesFr, roadSignsFr] = await Promise.all([
    prisma.scenarioCategory.upsert({
      where: { id: "cat-fr-basic" },
      update: {},
      create: {
        id: "cat-fr-basic",
        countryId: france.id,
        name: "Basic Skills",
        order: 1,
      },
    }),
    prisma.scenarioCategory.upsert({
      where: { id: "cat-fr-traffic" },
      update: {},
      create: {
        id: "cat-fr-traffic",
        countryId: france.id,
        name: "Traffic Rules",
        order: 2,
      },
    }),
    prisma.scenarioCategory.upsert({
      where: { id: "cat-fr-signs" },
      update: {},
      create: {
        id: "cat-fr-signs",
        countryId: france.id,
        name: "Road Signs",
        order: 3,
      },
    }),
  ]);
  console.log("France categories: Basic Skills, Traffic Rules, Road Signs");

  // ── Scenario seed type (supports MANY questions per scenario) ──────────────
  type ScenarioSeed = {
    id: string;
    slug: string;
    name: string;
    description: string;
    order: number;
    type: ScenarioType;
    categoryId: string;
    countryId: string;
    questions: {
      text: string;
      explanation: string;
      options: { text: string; correct: boolean }[];
    }[];
  };

  // ── Germany Scenarios ─────────────────────────────────────────────────────
  const deScenarios: ScenarioSeed[] = [
    // ===== Basic Skills =====
    {
      id: "scen-de-basic-controls",
      slug: "basic-controls",
      name: "Basic Controls",
      description:
        "Learn the fundamental controls of the vehicle: accelerating, braking, and steering safely on an open road.",
      order: 1,
      type: ScenarioType.PRACTICE,
      categoryId: basicSkillsDe.id,
      countryId: germany.id,
      questions: [
        {
          text: "What is the correct procedure before moving off from a parked position?",
          explanation:
            "Before moving off you must signal your intention, check all mirrors for approaching traffic, then perform a blind-spot shoulder check before pulling away. Sounding the horn is not a substitute for observation.",
          options: [
            {
              text: "Signal, check mirrors, blind-spot shoulder check, then move",
              correct: true,
            },
            {
              text: "Accelerate directly into traffic and let others react",
              correct: false,
            },
            {
              text: "Only check the centre rearview mirror before moving",
              correct: false,
            },
            {
              text: "Sound the horn to warn other drivers, then move",
              correct: false,
            },
          ],
        },
        {
          text: "In a car with manual transmission, what is the clutch pedal used for?",
          explanation:
            "The clutch temporarily disconnects the engine from the gearbox so you can change gear smoothly or stop without stalling. It is the left-most pedal, operated by the left foot.",
          options: [
            {
              text: "To disengage the engine from the gearbox when changing gear or stopping",
              correct: true,
            },
            { text: "To brake harder in an emergency", correct: false },
            {
              text: "To increase the flow of fuel to the engine",
              correct: false,
            },
            { text: "To sound the horn", correct: false },
          ],
        },
        {
          text: "What should you adjust BEFORE starting to drive?",
          explanation:
            "Set up the car while stationary: adjust the seat and head restraint, set all mirrors, and fasten your seatbelt. Adjusting these while moving is dangerous and illegal for the seatbelt.",
          options: [
            {
              text: "Seat and head restraint, mirrors, and seatbelt",
              correct: true,
            },
            { text: "Only the radio and the air conditioning", correct: false },
            {
              text: "Nothing — adjust everything while driving",
              correct: false,
            },
            {
              text: "Only the steering wheel, after you start moving",
              correct: false,
            },
          ],
        },
      ],
    },
    {
      id: "scen-de-mirror-signal-maneuver",
      slug: "mirror-signal-maneuver",
      name: "Mirror, Signal, Maneuver",
      description:
        "Practise the Spiegel–Blinker–Schulterblick routine — mirror, signal, and blind-spot check before every maneuver.",
      order: 2,
      type: ScenarioType.PRACTICE,
      categoryId: basicSkillsDe.id,
      countryId: germany.id,
      questions: [
        {
          text: "What is the correct sequence before changing lanes or turning (Spiegel–Blinker–Schulterblick)?",
          explanation:
            "The German routine is Spiegel–Blinker–Schulterblick: first check the mirror, then signal your intention, then do a shoulder check of the blind spot, and only then perform the maneuver.",
          options: [
            {
              text: "Mirror, signal, shoulder-check the blind spot, then move",
              correct: true,
            },
            { text: "Signal only, then move immediately", correct: false },
            {
              text: "Move first, then signal once you are in the new lane",
              correct: false,
            },
            {
              text: "Shoulder check only — mirrors are not needed",
              correct: false,
            },
          ],
        },
        {
          text: "Why is the shoulder check (Schulterblick) necessary even after looking in the mirrors?",
          explanation:
            "Mirrors leave a blind spot beside and behind the car that can completely hide a cyclist, motorcycle or car. The shoulder check is the only way to see into that blind spot before moving sideways.",
          options: [
            {
              text: "It covers the blind spot that the mirrors cannot show",
              correct: true,
            },
            {
              text: "It is only a formality required for the driving exam",
              correct: false,
            },
            {
              text: "It helps you stretch your neck on long drives",
              correct: false,
            },
            {
              text: "Mirrors are unreliable only at night, so you check by day",
              correct: false,
            },
          ],
        },
        {
          text: "When must you use your indicator (Fahrtrichtungsanzeiger)?",
          explanation:
            "You must signal clearly and in good time whenever you turn, change lanes, pull out from the kerb, or leave a roundabout — so other road users can anticipate your move.",
          options: [
            {
              text: "When turning, changing lanes, pulling out, or leaving a roundabout",
              correct: true,
            },
            {
              text: "Only when you can already see other cars nearby",
              correct: false,
            },
            { text: "Only on the Autobahn", correct: false },
            { text: "Never inside a 30 km/h zone", correct: false },
          ],
        },
        {
          text: "Changing lanes at speed on the Autobahn, the shoulder check is...",
          explanation:
            "Closing speeds on the Autobahn are very high, so a fast vehicle can be hidden in your blind spot in seconds. The shoulder check is essential, not optional, before pulling out.",
          options: [
            {
              text: "Essential, because fast traffic can hide in the blind spot",
              correct: true,
            },
            {
              text: "Unnecessary, because high speed clears the lane",
              correct: false,
            },
            { text: "Replaced by sounding the horn", correct: false },
            {
              text: "Only needed when staying in the right-hand lane",
              correct: false,
            },
          ],
        },
      ],
    },
    {
      id: "scen-de-speed-stopping-distance",
      slug: "speed-stopping-distance",
      name: "Speed & Stopping Distance",
      description:
        "Understand reaction distance, braking distance, and how to keep a safe following gap at different speeds.",
      order: 3,
      type: ScenarioType.PRACTICE,
      categoryId: basicSkillsDe.id,
      countryId: germany.id,
      questions: [
        {
          text: "Outside built-up areas, what is a good rule of thumb for a safe following distance?",
          explanation:
            "A common guideline is to keep a gap in metres equal to half your speedometer reading (e.g. 100 km/h → about 50 m), which is roughly a two-second gap to the car in front.",
          options: [
            {
              text: "About half the speed reading in metres (~2 second gap)",
              correct: true,
            },
            { text: "One car length, whatever your speed", correct: false },
            { text: "A fixed 5 metres at any speed", correct: false },
            {
              text: "As close as possible to save fuel by drafting",
              correct: false,
            },
          ],
        },
        {
          text: "Total stopping distance is made up of which two parts?",
          explanation:
            "Stopping distance = reaction distance (while you perceive and react) + braking distance (while the brakes slow the car). Both grow with speed.",
          options: [
            { text: "Reaction distance plus braking distance", correct: true },
            { text: "Braking distance only", correct: false },
            { text: "Steering distance plus braking distance", correct: false },
            { text: "Engine distance plus tyre distance", correct: false },
          ],
        },
        {
          text: "If you double your speed, the braking distance roughly...",
          explanation:
            "Braking distance increases with the square of speed, so doubling your speed makes the braking distance about four times longer — a key reason to slow down.",
          options: [
            { text: "Quadruples (about four times longer)", correct: true },
            { text: "Stays exactly the same", correct: false },
            { text: "Only doubles", correct: false },
            { text: "Is halved", correct: false },
          ],
        },
        {
          text: "On a wet road, your braking distance compared with a dry road is...",
          explanation:
            "Wet roads reduce tyre grip, so the braking distance is considerably longer. You should slow down and increase your following distance in the rain.",
          options: [
            {
              text: "Considerably longer, so keep more distance",
              correct: true,
            },
            { text: "Shorter, because water cools the brakes", correct: false },
            { text: "Exactly the same as on a dry road", correct: false },
            { text: "Zero, because ABS removes all skidding", correct: false },
          ],
        },
      ],
    },
    {
      id: "scen-de-parking-rules-de",
      slug: "parking-rules-de",
      name: "Parking & Stopping",
      description:
        "Learn the difference between Halten and Parken and where stopping or parking is prohibited in Germany.",
      order: 4,
      type: ScenarioType.PRACTICE,
      categoryId: basicSkillsDe.id,
      countryId: germany.id,
      questions: [
        {
          text: "How close to an intersection may you legally park in Germany?",
          explanation:
            "You may not park within 5 metres of an intersection or junction (measured from the edge of the intersecting carriageway), so that sightlines stay clear for everyone.",
          options: [
            {
              text: "No closer than 5 metres from the junction",
              correct: true,
            },
            { text: "Parking right on the corner is allowed", correct: false },
            { text: "Within 1 metre of the junction is fine", correct: false },
            { text: "There is no restriction inside towns", correct: false },
          ],
        },
        {
          text: "What is the difference between 'Halten' (stopping) and 'Parken' (parking)?",
          explanation:
            "Halten is a short, intentional stop. Parken means leaving your vehicle, or any stop longer than three minutes. Different rules and prohibitions apply to each.",
          options: [
            {
              text: "Parken = leaving the car or stopping over 3 minutes; Halten = a brief stop",
              correct: true,
            },
            { text: "They mean exactly the same thing", correct: false },
            { text: "Halten only applies to buses and taxis", correct: false },
            { text: "Parken is only allowed overnight", correct: false },
          ],
        },
        {
          text: "Where is stopping (Halten) generally prohibited?",
          explanation:
            "Stopping is forbidden where it would be dangerous or block traffic — for example on the carriageway of an Autobahn, on level crossings, in narrow or unclear spots, and where a no-stopping sign applies.",
          options: [
            {
              text: "On the Autobahn carriageway and on railway level crossings",
              correct: true,
            },
            { text: "In any marked parking bay", correct: false },
            { text: "On quiet residential streets after dark", correct: false },
            { text: "Anywhere next to a public park", correct: false },
          ],
        },
        {
          text: "At night on a poorly lit street, a parked car must...",
          explanation:
            "On unlit streets a parked vehicle must be made visible to others, for example by leaving the parking light on or relying on the vehicle's reflectors, depending on the vehicle and location.",
          options: [
            {
              text: "Be made clearly visible (parking light or reflectors)",
              correct: true,
            },
            {
              text: "Switch on full-beam headlights all night",
              correct: false,
            },
            {
              text: "Keep the hazard lights flashing until morning",
              correct: false,
            },
            {
              text: "Do nothing — visibility is never required",
              correct: false,
            },
          ],
        },
      ],
    },

    // ===== Right of Way & Priority =====
    {
      id: "scen-de-rechts-vor-links",
      slug: "rechts-vor-links",
      name: "Rechts vor Links — Right before Left",
      description:
        "Practice the core German right-of-way rule at unmarked intersections: traffic from the right has priority.",
      order: 5,
      type: ScenarioType.PRACTICE,
      categoryId: priorityDe.id,
      countryId: germany.id,
      questions: [
        {
          text: "At an unmarked intersection with no signs or signals, which rule applies in Germany?",
          explanation:
            "§8 StVO (Straßenverkehrs-Ordnung) states 'Rechts vor Links' — vehicles approaching from the right have priority at unmarked intersections. This rule applies unless otherwise indicated by signs, signals, or road markings.",
          options: [
            {
              text: "Rechts vor Links — the vehicle from the right always has priority",
              correct: true,
            },
            {
              text: "The vehicle that arrives at the intersection first has priority",
              correct: false,
            },
            {
              text: "Larger or heavier vehicles always have right of way",
              correct: false,
            },
            {
              text: "Drivers must negotiate among themselves who proceeds first",
              correct: false,
            },
          ],
        },
        {
          text: "Does 'Rechts vor Links' apply when you exit a car park or driveway onto the road?",
          explanation:
            "No. When you join the flowing road from a property, driveway, car park or footpath, you must give way to ALL road traffic — Rechts vor Links does not give you priority.",
          options: [
            {
              text: "No — you must yield to all road traffic when leaving a property",
              correct: true,
            },
            {
              text: "Yes — the driver leaving the property always wins",
              correct: false,
            },
            { text: "Only when the road surface is unpaved", correct: false },
            { text: "Only at night", correct: false },
          ],
        },
        {
          text: "Inside a Tempo-30 zone with no priority signs at the junctions, which rule normally applies?",
          explanation:
            "Tempo-30 zones usually have no priority signs, so the default 'Rechts vor Links' rule applies at the junctions inside them — you give way to traffic coming from your right.",
          options: [
            { text: "Rechts vor Links", correct: true },
            { text: "The wider street always has priority", correct: false },
            { text: "The faster vehicle has priority", correct: false },
            { text: "Every junction is light-controlled", correct: false },
          ],
        },
      ],
    },
    {
      id: "scen-de-give-way-sign",
      slug: "give-way-sign",
      name: "Give Way / Yield",
      description:
        "React to the 'Vorfahrt gewähren' yield sign (Zeichen 205) — give way to traffic on the priority road.",
      order: 6,
      type: ScenarioType.PRACTICE,
      categoryId: priorityDe.id,
      countryId: germany.id,
      questions: [
        {
          text: "What does the upside-down red-and-white triangle (Zeichen 205, 'Vorfahrt gewähren') require?",
          explanation:
            "The yield sign means you must give way to traffic on the priority road. You do not have to stop if the way is clear, but you must be ready to, and you may only proceed when you will not obstruct anyone.",
          options: [
            {
              text: "Give way to priority-road traffic; stop only if necessary",
              correct: true,
            },
            {
              text: "Always come to a complete stop at the line",
              correct: false,
            },
            {
              text: "You have priority — proceed without slowing",
              correct: false,
            },
            { text: "It warns of a dead-end street", correct: false },
          ],
        },
        {
          text: "How does the give-way sign (Zeichen 205) differ from the STOP sign (Zeichen 206)?",
          explanation:
            "A give-way sign requires you to yield but not necessarily to stop. A STOP sign always requires a complete halt at the line, even when the road is clear.",
          options: [
            {
              text: "Give way = yield without a mandatory stop; STOP = full stop required",
              correct: true,
            },
            { text: "They are identical", correct: false },
            {
              text: "The give-way sign also requires a full stop",
              correct: false,
            },
            { text: "The STOP sign only applies to trucks", correct: false },
          ],
        },
        {
          text: "You reach a give-way sign and a car is crossing on the priority road. You should...",
          explanation:
            "Let the crossing traffic on the priority road pass first, then proceed when there is a safe gap. Forcing your way through would breach their right of way.",
          options: [
            {
              text: "Let the crossing traffic pass, then proceed when clear",
              correct: true,
            },
            {
              text: "Force your way through before they arrive",
              correct: false,
            },
            { text: "Reverse away from the junction", correct: false },
            { text: "Sound the horn and drive across", correct: false },
          ],
        },
        {
          text: "At a give-way sign with no traffic coming, you may...",
          explanation:
            "If the priority road is clearly free, a give-way sign lets you proceed without stopping — unlike a STOP sign, where you must always halt first.",
          options: [
            {
              text: "Proceed without stopping, after checking it is clear",
              correct: true,
            },
            {
              text: "Must still stop completely for three seconds",
              correct: false,
            },
            { text: "Must wait for a green light", correct: false },
            { text: "May never proceed", correct: false },
          ],
        },
      ],
    },
    {
      id: "scen-de-stop-sign",
      slug: "stop-sign",
      name: "Stop Sign",
      description:
        "Apply the STOP sign (Zeichen 206) correctly — a full stop at the line, then give way.",
      order: 7,
      type: ScenarioType.PRACTICE,
      categoryId: priorityDe.id,
      countryId: germany.id,
      questions: [
        {
          text: "At a STOP sign (Zeichen 206, 'Halt. Vorfahrt gewähren'), what must you always do?",
          explanation:
            "A STOP sign requires you to come to a complete stop at the line (or before the junction if there is no line) even if the road is clear, and then give way to traffic on the priority road.",
          options: [
            {
              text: "Come to a complete stop at the line, then give way",
              correct: true,
            },
            {
              text: "Slow down only if other traffic is coming",
              correct: false,
            },
            {
              text: "Stop only when you can see another vehicle",
              correct: false,
            },
            { text: "Treat it the same as a give-way sign", correct: false },
          ],
        },
        {
          text: "Where exactly must you stop at a STOP sign that has a stop line?",
          explanation:
            "You stop at the stop line. If there is no line, you stop where you first have a clear view into the crossing road, so you can give way safely.",
          options: [
            {
              text: "At the stop line (or where you can see the crossing road)",
              correct: true,
            },
            { text: "In the middle of the junction", correct: false },
            { text: "Twenty metres before the sign", correct: false },
            { text: "Anywhere that is convenient", correct: false },
          ],
        },
        {
          text: "If you only roll slowly through a STOP sign without fully stopping, you have...",
          explanation:
            "A STOP sign legally requires the wheels to stop turning. Merely rolling through ('California stop') is a traffic offence even if the junction looked safe.",
          options: [
            {
              text: "Committed a traffic offence, even if it looked safe",
              correct: true,
            },
            {
              text: "Done nothing wrong as long as it was clear",
              correct: false,
            },
            {
              text: "Only risked a warning in other countries",
              correct: false,
            },
            { text: "Followed the rule correctly", correct: false },
          ],
        },
      ],
    },
    {
      id: "scen-de-priority-road-signs",
      slug: "priority-road-signs",
      name: "Priority Road Signs (Vorfahrtstraße)",
      description:
        "Recognise and respond to German priority signs: the yellow diamond (Vorfahrtstraße) and its cancellation.",
      order: 8,
      type: ScenarioType.PRACTICE,
      categoryId: priorityDe.id,
      countryId: germany.id,
      questions: [
        {
          text: "What does the yellow diamond sign (Zeichen 306 — Vorfahrtstraße) indicate?",
          explanation:
            "The yellow diamond (Zeichen 306) indicates you are travelling on a priority road. Your traffic has right of way over all traffic joining from side roads, until cancelled by the black-crossed yellow diamond (Zeichen 307).",
          options: [
            {
              text: "You are on a priority road with right of way over side-road traffic",
              correct: true,
            },
            {
              text: "You must yield to all other traffic at the next junction",
              correct: false,
            },
            { text: "A reduced speed zone begins ahead", correct: false },
            { text: "A motorway toll booth is located ahead", correct: false },
          ],
        },
        {
          text: "While on a priority road, a car is waiting at a side road to your right. Who has priority?",
          explanation:
            "Being on a priority road (Vorfahrtstraße) overrides the normal 'Rechts vor Links' rule, so YOU keep priority over the car waiting at the side road on your right.",
          options: [
            {
              text: "You do — the priority road overrides Rechts vor Links",
              correct: true,
            },
            {
              text: "The car on the right, by Rechts vor Links",
              correct: false,
            },
            { text: "You must still yield to the right", correct: false },
            { text: "Neither — you negotiate it", correct: false },
          ],
        },
        {
          text: "What does the yellow diamond with a grey diagonal bar through it (Zeichen 307) mean?",
          explanation:
            "Zeichen 307 (the cancelled yellow diamond) marks the END of the priority road. From here the standard 'Rechts vor Links' rule applies again unless new priority signs are posted.",
          options: [
            { text: "The priority road ends here", correct: true },
            { text: "The priority road begins here", correct: false },
            {
              text: "Priority for oncoming traffic at a narrow point",
              correct: false,
            },
            { text: "A motorway begins", correct: false },
          ],
        },
        {
          text: "A small black arrow panel (Zusatzzeichen) beneath a priority sign shows...",
          explanation:
            "The supplementary arrow panel shows the COURSE of the priority road through the junction, so you know which direction keeps priority and which side roads must yield.",
          options: [
            {
              text: "The course of the priority road through the junction",
              correct: true,
            },
            { text: "The current speed limit", correct: false },
            { text: "The distance to the next town", correct: false },
            { text: "A recommended detour", correct: false },
          ],
        },
      ],
    },
    {
      id: "scen-de-vorfahrt-intersection",
      slug: "vorfahrt-priority-intersection",
      name: "Vorfahrt — Priority at Next Intersection",
      description:
        "React to the 'right of way at next intersection' sign (Zeichen 301) and know how it differs from a priority road.",
      order: 9,
      type: ScenarioType.PRACTICE,
      categoryId: priorityDe.id,
      countryId: germany.id,
      questions: [
        {
          text: "What does Zeichen 301 (a yellow-bordered upward triangle with a thick vertical bar, 'Vorfahrt') tell you?",
          explanation:
            "Zeichen 301 grants you priority at the NEXT intersection only. It is a one-off priority, unlike the yellow diamond (Zeichen 306) which marks a continuing priority road.",
          options: [
            {
              text: "You have priority at the next intersection only",
              correct: true,
            },
            {
              text: "You have priority along the whole road continuously",
              correct: false,
            },
            { text: "You must yield at the next intersection", correct: false },
            { text: "You must stop at the next intersection", correct: false },
          ],
        },
        {
          text: "How does Zeichen 301 (Vorfahrt) differ from Zeichen 306 (Vorfahrtstraße)?",
          explanation:
            "Zeichen 301 gives priority at the single next intersection; Zeichen 306 (the yellow diamond) marks a road on which you keep priority continuously until it is cancelled.",
          options: [
            {
              text: "301 = priority at the next junction only; 306 = continuous priority road",
              correct: true,
            },
            { text: "They are exactly the same sign", correct: false },
            { text: "301 means you must yield", correct: false },
            { text: "306 means you must stop", correct: false },
          ],
        },
        {
          text: "Seeing the 'Vorfahrt' sign (Zeichen 301), a car waiting on the side road must...",
          explanation:
            "The matching sign on the side road is a yield or stop sign, so that driver must give way to you at the upcoming intersection.",
          options: [
            { text: "Give way to you at that intersection", correct: true },
            { text: "Take priority over you", correct: false },
            { text: "Ignore you completely", correct: false },
            { text: "Stop only if a light turns red", correct: false },
          ],
        },
        {
          text: "The 'Vorfahrt' sign is useful to a driver mainly because it...",
          explanation:
            "It confirms that you hold priority at the upcoming junction, so you can proceed without yielding there — while still driving with care.",
          options: [
            {
              text: "Confirms your priority at the upcoming junction",
              correct: true,
            },
            { text: "Orders you to stop", correct: false },
            { text: "Marks a pedestrian zone", correct: false },
            { text: "Shows the speed limit", correct: false },
          ],
        },
      ],
    },
    {
      id: "scen-de-turning-left-oncoming",
      slug: "turning-left-oncoming",
      name: "Turning Left with Oncoming Traffic",
      description:
        "Master left turns — yield to oncoming traffic and to pedestrians and cyclists on the road you turn into.",
      order: 10,
      type: ScenarioType.PRACTICE,
      categoryId: priorityDe.id,
      countryId: germany.id,
      questions: [
        {
          text: "You want to turn left while a car approaches from the opposite direction going straight on. Who has priority?",
          explanation:
            "Oncoming traffic going straight (or turning right) has priority over a vehicle turning left. You must wait and complete your turn behind the oncoming vehicle.",
          options: [
            { text: "The oncoming vehicle going straight on", correct: true },
            { text: "You, because you signalled first", correct: false },
            { text: "Whichever vehicle is larger", correct: false },
            {
              text: "You, because left turns always have priority",
              correct: false,
            },
          ],
        },
        {
          text: "Two cars face each other and both want to turn left. How do they normally pass?",
          explanation:
            "By default they pass left-side to left-side (in front of each other / front-to-front), turning ahead of one another — unless road markings, signs or a police officer direct otherwise.",
          options: [
            {
              text: "In front of each other (left-to-left), unless directed otherwise",
              correct: true,
            },
            { text: "Both stop and wait indefinitely", correct: false },
            {
              text: "The car on the wider road always goes first",
              correct: false,
            },
            { text: "Always passing right-side to right-side", correct: false },
          ],
        },
        {
          text: "When turning left you must also watch out for...",
          explanation:
            "Besides oncoming traffic, you must give way to pedestrians and cyclists crossing the road you are turning INTO — they have priority over the turning vehicle.",
          options: [
            {
              text: "Pedestrians and cyclists on the road you turn into",
              correct: true,
            },
            { text: "Only other cars", correct: false },
            {
              text: "Nothing, once oncoming traffic has cleared",
              correct: false,
            },
            { text: "Only motorcycles", correct: false },
          ],
        },
        {
          text: "While waiting in the junction to turn left, you should keep your front wheels...",
          explanation:
            "Keep the front wheels pointing straight ahead while waiting. If you are hit from behind, you won't be pushed into oncoming traffic.",
          options: [
            { text: "Pointing straight ahead", correct: true },
            { text: "Turned left, ready to go", correct: false },
            { text: "Turned fully to the right", correct: false },
            { text: "It makes no difference", correct: false },
          ],
        },
      ],
    },
    {
      id: "scen-de-roundabout",
      slug: "roundabout",
      name: "Roundabout (Kreisverkehr)",
      description:
        "Master roundabout entry, circulation, and exit. Yield to traffic already in the circle and signal only on exit.",
      order: 11,
      type: ScenarioType.PRACTICE,
      categoryId: priorityDe.id,
      countryId: germany.id,
      questions: [
        {
          text: "When approaching a German roundabout marked with a 'Vorfahrt gewähren' (yield) sign, what must you do?",
          explanation:
            "In Germany roundabouts are governed by a yield sign for entering traffic. Vehicles already circulating have absolute priority. You give way and only enter when there is a safe gap.",
          options: [
            {
              text: "Yield to all vehicles already circulating inside the roundabout",
              correct: true,
            },
            {
              text: "You have priority over roundabout traffic and may enter freely",
              correct: false,
            },
            {
              text: "Stop completely regardless of whether traffic is present",
              correct: false,
            },
            {
              text: "Flash your headlights to signal your intention to enter",
              correct: false,
            },
          ],
        },
        {
          text: "Do you indicate when ENTERING a German roundabout?",
          explanation:
            "No — you do not signal when entering a roundabout. You only signal RIGHT just before the exit you intend to take.",
          options: [
            { text: "No — you only signal right when leaving", correct: true },
            { text: "Yes — signal left as you enter", correct: false },
            { text: "Yes — signal right as you enter", correct: false },
            { text: "Yes — switch on hazard lights to enter", correct: false },
          ],
        },
        {
          text: "Inside a single-lane roundabout, may you overtake a cyclist?",
          explanation:
            "Overtaking inside a single-lane roundabout is not permitted. You stay behind and follow the cyclist around until they leave.",
          options: [
            {
              text: "No — overtaking inside a single-lane roundabout is not allowed",
              correct: true,
            },
            { text: "Yes, always", correct: false },
            { text: "Only buses may overtake", correct: false },
            { text: "Only if you signal first", correct: false },
          ],
        },
        {
          text: "When exiting the roundabout you must...",
          explanation:
            "Signal right just before your exit and watch for pedestrians and cyclists at the exit, giving way to them as you leave.",
          options: [
            {
              text: "Signal right just before the exit and watch for pedestrians/cyclists",
              correct: true,
            },
            { text: "Signal left before the exit", correct: false },
            { text: "Never signal at all", correct: false },
            { text: "Stop on the circle before exiting", correct: false },
          ],
        },
      ],
    },

    // ===== Traffic Lights & Signals =====
    {
      id: "scen-de-traffic-lights",
      slug: "traffic-lights",
      name: "Traffic Lights",
      description:
        "Understand the full sequence of German traffic light phases including the red-yellow combination before green.",
      order: 12,
      type: ScenarioType.PRACTICE,
      categoryId: signalsDe.id,
      countryId: germany.id,
      questions: [
        {
          text: "What does a solid yellow traffic light mean in Germany?",
          explanation:
            "A yellow light means the signal is about to turn red. You must prepare to stop unless stopping safely is no longer possible. Accelerating to beat a yellow light is illegal and dangerous.",
          options: [
            {
              text: "Prepare to stop — the light is about to turn red",
              correct: true,
            },
            {
              text: "Accelerate to clear the intersection before it turns red",
              correct: false,
            },
            {
              text: "Proceed freely if the intersection appears clear",
              correct: false,
            },
            {
              text: "Only cyclists and pedestrians must stop at yellow",
              correct: false,
            },
          ],
        },
        {
          text: "What does the red-and-yellow combination shown together mean?",
          explanation:
            "Red and yellow together means 'get ready — green is coming'. You prepare to move off, but you must not start driving until the light is actually green.",
          options: [
            {
              text: "Prepare to move off; green is about to appear",
              correct: true,
            },
            { text: "Stop even more firmly than on red alone", correct: false },
            { text: "The signal is broken", correct: false },
            { text: "Pedestrians may now cross", correct: false },
          ],
        },
        {
          text: "A green light lets you proceed, but you must still...",
          explanation:
            "Green is not unconditional priority. You must still give way to pedestrians and cyclists crossing your path, and to oncoming traffic when you are turning left.",
          options: [
            {
              text: "Give way to crossing pedestrians and to oncoming traffic when turning",
              correct: true,
            },
            { text: "Drive through without looking", correct: false },
            {
              text: "Assume you have absolute priority over everyone",
              correct: false,
            },
            { text: "Stop again before entering the junction", correct: false },
          ],
        },
        {
          text: "If a traffic light is completely out of order (dark), the junction is governed by...",
          explanation:
            "When the lights are dark, you follow any priority signs that are present; if there are none, the default 'Rechts vor Links' rule applies.",
          options: [
            {
              text: "Any signs present, otherwise Rechts vor Links",
              correct: true,
            },
            {
              text: "Always Rechts vor Links, ignoring any signs",
              correct: false,
            },
            { text: "You always have priority", correct: false },
            {
              text: "You must call the police before crossing",
              correct: false,
            },
          ],
        },
      ],
    },
    {
      id: "scen-de-green-arrow",
      slug: "green-arrow",
      name: "Green Arrow — Right Turn on Red",
      description:
        "Use the Grünpfeil (green-arrow sign) correctly — stop fully on red, then turn right when safe.",
      order: 13,
      type: ScenarioType.PRACTICE,
      categoryId: signalsDe.id,
      countryId: germany.id,
      questions: [
        {
          text: "A separate green-arrow SIGN (Grünpfeil) is fixed to the right of a red light. What may you do?",
          explanation:
            "The green-arrow sign lets you turn right on red — but only after coming to a complete stop and making sure you obstruct no crossing traffic or pedestrians.",
          options: [
            {
              text: "Stop completely, then turn right if it is clear",
              correct: true,
            },
            { text: "Turn right without stopping", correct: false },
            { text: "Drive straight on through the red light", correct: false },
            { text: "Ignore the red light entirely", correct: false },
          ],
        },
        {
          text: "Before turning right under a green-arrow sign on red, you must...",
          explanation:
            "You must come to a full stop first and give way to all crossing traffic and to pedestrians who have a green light — only then may you turn.",
          options: [
            {
              text: "Come to a full stop and yield to crossing traffic and pedestrians",
              correct: true,
            },
            { text: "Only slow down a little", correct: false },
            { text: "Accelerate hard to merge", correct: false },
            { text: "Sound the horn and go", correct: false },
          ],
        },
        {
          text: "How does a lit green ARROW signal on the traffic light differ from the green-arrow SIGN (Grünpfeil)?",
          explanation:
            "A lit green arrow on the light gives you right of way for that direction with no need to stop. The separate green-arrow sign on red requires a full stop first before turning right.",
          options: [
            {
              text: "The lit arrow gives priority (no stop); the sign requires a full stop on red first",
              correct: true,
            },
            { text: "They mean exactly the same thing", correct: false },
            { text: "Both require you to stop first", correct: false },
            { text: "Both may be ignored", correct: false },
          ],
        },
        {
          text: "If turning right on a green-arrow sign would endanger crossing pedestrians, you must...",
          explanation:
            "Pedestrians crossing with their own green keep priority. If your turn would endanger them you must wait until the way is clear.",
          options: [
            { text: "Wait — the pedestrians have priority", correct: true },
            { text: "Proceed, because you have priority", correct: false },
            { text: "Sound the horn and turn anyway", correct: false },
            { text: "Reverse back from the line", correct: false },
          ],
        },
      ],
    },
    {
      id: "scen-de-signals-override",
      slug: "signals-override",
      name: "Signal Priority Order",
      description:
        "Know what wins when signals conflict: police officers, traffic lights, signs, and road markings.",
      order: 14,
      type: ScenarioType.PRACTICE,
      categoryId: signalsDe.id,
      countryId: germany.id,
      questions: [
        {
          text: "A police officer is directing traffic at a junction that also has working traffic lights. Whom do you obey?",
          explanation:
            "Instructions from a police officer override the traffic lights. The officer sits at the top of the precedence order, so you follow their hand signals even on a green light.",
          options: [
            {
              text: "The police officer — their signals override the lights",
              correct: true,
            },
            { text: "The traffic lights", correct: false },
            { text: "Whichever you prefer", correct: false },
            { text: "The road markings only", correct: false },
          ],
        },
        {
          text: "What is the correct order of precedence in German traffic?",
          explanation:
            "The order is: police officers, then light signals, then signs, then road markings, and finally the general right-of-way rules (such as Rechts vor Links).",
          options: [
            {
              text: "Police > traffic lights > signs > road markings > general rules",
              correct: true,
            },
            {
              text: "Signs > police > traffic lights > everything",
              correct: false,
            },
            { text: "Road markings always come first", correct: false },
            { text: "General rules override everything else", correct: false },
          ],
        },
        {
          text: "Temporary signs at roadworks contradict the permanent signs they stand next to. Which apply?",
          explanation:
            "Temporary signs (e.g. yellow roadworks signs) take precedence over the permanent signs they contradict, because they reflect the current situation.",
          options: [
            { text: "The temporary signs take precedence", correct: true },
            { text: "The permanent signs win", correct: false },
            { text: "You may choose either", correct: false },
            { text: "Both are ignored", correct: false },
          ],
        },
        {
          text: "A traffic light shows green but a police officer signals you to stop. You...",
          explanation:
            "Because the officer outranks the light, you stop — even though the signal is green.",
          options: [
            {
              text: "Stop, because the officer overrides the green light",
              correct: true,
            },
            { text: "Drive on, because green means go", correct: false },
            { text: "Slow down but keep moving", correct: false },
            { text: "Flash your lights and continue", correct: false },
          ],
        },
      ],
    },

    // ===== Road Signs =====
    {
      id: "scen-de-prohibition-signs",
      slug: "prohibition-signs",
      name: "Prohibition Signs",
      description:
        "Recognise round red-bordered prohibition signs: no entry, no overtaking, and no stopping.",
      order: 15,
      type: ScenarioType.PRACTICE,
      categoryId: roadSignsDe.id,
      countryId: germany.id,
      questions: [
        {
          text: "A round sign, red with a white horizontal bar (Zeichen 267, 'Verbot der Einfahrt'), means...",
          explanation:
            "This is the 'no entry' sign. You must not drive into the street beyond it — it usually marks the wrong way into a one-way street.",
          options: [
            { text: "No entry — do not drive in", correct: true },
            { text: "No parking only", correct: false },
            { text: "You are on a priority road", correct: false },
            { text: "End of all restrictions", correct: false },
          ],
        },
        {
          text: "A round, red-bordered sign showing one black car and one red car (Zeichen 276) means...",
          explanation:
            "This is the 'no overtaking' sign for motor vehicles. You may not overtake other motor vehicles until the prohibition ends.",
          options: [
            {
              text: "Overtaking of motor vehicles is prohibited",
              correct: true,
            },
            { text: "Two-way traffic ahead", correct: false },
            { text: "A car-pool lane", correct: false },
            { text: "Overtaking is encouraged here", correct: false },
          ],
        },
        {
          text: "A round blue sign with a single red diagonal cross (Zeichen 283) at the kerb means...",
          explanation:
            "This is the 'no stopping' sign (absolutes Haltverbot). You may neither stop nor park along the stretch it covers.",
          options: [
            { text: "No stopping (and no parking)", correct: true },
            { text: "Free parking allowed", correct: false },
            { text: "Bus lane", correct: false },
            { text: "No entry", correct: false },
          ],
        },
        {
          text: "How can you tell a prohibition sign from a mandatory sign at a glance?",
          explanation:
            "Prohibition signs are round with a red border and tell you what you must NOT do. Mandatory signs are solid blue circles telling you what you MUST do.",
          options: [
            {
              text: "Prohibition signs are red-bordered circles; mandatory signs are solid blue circles",
              correct: true,
            },
            { text: "They look identical", correct: false },
            { text: "Prohibition signs are blue", correct: false },
            { text: "Mandatory signs are triangles", correct: false },
          ],
        },
      ],
    },
    {
      id: "scen-de-mandatory-signs",
      slug: "mandatory-signs",
      name: "Mandatory Direction Signs",
      description:
        "Read blue round mandatory signs that tell you which way you must go or which lane to use.",
      order: 16,
      type: ScenarioType.PRACTICE,
      categoryId: roadSignsDe.id,
      countryId: germany.id,
      questions: [
        {
          text: "A blue round sign with a white upward arrow means...",
          explanation:
            "Blue round signs are mandatory. A single upward arrow means you must continue straight ahead in the prescribed direction.",
          options: [
            { text: "You must drive straight ahead", correct: true },
            { text: "No entry", correct: false },
            { text: "One-way street to the left", correct: false },
            { text: "Parking is available ahead", correct: false },
          ],
        },
        {
          text: "A blue round sign showing three white arrows in a circle (Zeichen 215) means...",
          explanation:
            "This is the mandatory roundabout sign. You must drive around the central island in the direction of the arrows (clockwise in Germany).",
          options: [
            { text: "Roundabout — you must drive around it", correct: true },
            { text: "No through road", correct: false },
            { text: "Make a U-turn here", correct: false },
            { text: "Car wash ahead", correct: false },
          ],
        },
        {
          text: "A blue round sign with a white bicycle (Zeichen 237) means...",
          explanation:
            "This marks a mandatory cycle path. Cyclists must use it, and motor vehicles must not drive or park on it.",
          options: [
            { text: "A mandatory cycle path", correct: true },
            { text: "Bicycles are prohibited", correct: false },
            { text: "A shared bus lane", correct: false },
            { text: "Bicycle parking", correct: false },
          ],
        },
        {
          text: "Mandatory (blue round) signs differ from prohibition signs because they...",
          explanation:
            "Mandatory signs command an action you MUST take (e.g. drive in this direction). Prohibition signs forbid an action. They are not merely advisory.",
          options: [
            {
              text: "Command an action you must take, rather than forbid one",
              correct: true,
            },
            { text: "Forbid an action", correct: false },
            { text: "Are only advisory suggestions", correct: false },
            { text: "Apply only to trucks", correct: false },
          ],
        },
      ],
    },
    {
      id: "scen-de-speed-limit-tempo30",
      slug: "speed-limit-tempo30",
      name: "Speed Limits & Tempo-30 Zone",
      description:
        "Know the default German speed limits and how a Tempo-30 zone works from entry to exit.",
      order: 17,
      type: ScenarioType.PRACTICE,
      categoryId: roadSignsDe.id,
      countryId: germany.id,
      questions: [
        {
          text: "What is the default speed limit in German built-up areas (inside the town sign) unless otherwise posted?",
          explanation:
            "Inside built-up areas the general limit is 50 km/h unless signs say otherwise. The yellow town-entry sign (Ortstafel) marks where this limit begins.",
          options: [
            { text: "50 km/h", correct: true },
            { text: "30 km/h", correct: false },
            { text: "60 km/h", correct: false },
            { text: "70 km/h", correct: false },
          ],
        },
        {
          text: "You pass a 'Zone 30' (Tempo-30-Zone) sign. What applies?",
          explanation:
            "A Zone 30 sign sets a 30 km/h limit for the WHOLE zone until you pass the 'Zone 30 ends' sign. Junctions inside the zone are usually governed by Rechts vor Links.",
          options: [
            {
              text: "Maximum 30 km/h throughout the whole zone",
              correct: true,
            },
            { text: "30 km/h for the next 100 metres only", correct: false },
            { text: "An advisory 30 km/h you may exceed", correct: false },
            { text: "30 km/h only when passing a school", correct: false },
          ],
        },
        {
          text: "A round red-bordered '50' speed-limit sign is cancelled by...",
          explanation:
            "A speed limit ends at an end-of-limit sign (a grey sign with diagonal bars), at a new limit sign, or at the town-exit sign — not just by driving a certain distance.",
          options: [
            {
              text: "An end-of-limit sign, a new limit, or the town-exit sign",
              correct: true,
            },
            { text: "The next roundabout automatically", correct: false },
            { text: "Driving for exactly one kilometre", correct: false },
            { text: "Nothing — it never ends", correct: false },
          ],
        },
        {
          text: "Outside towns on a normal country road (car, dry conditions), the default limit unless posted is...",
          explanation:
            "On ordinary roads outside built-up areas the default limit for cars is 100 km/h, unless a sign sets a different limit.",
          options: [
            { text: "100 km/h", correct: true },
            { text: "80 km/h", correct: false },
            { text: "120 km/h", correct: false },
            { text: "No limit at all", correct: false },
          ],
        },
      ],
    },
    {
      id: "scen-de-warning-signs",
      slug: "warning-signs",
      name: "Warning Signs",
      description:
        "Identify triangular red-bordered danger signs (Gefahrzeichen) and respond to the hazard ahead.",
      order: 18,
      type: ScenarioType.PRACTICE,
      categoryId: roadSignsDe.id,
      countryId: germany.id,
      questions: [
        {
          text: "What shape and colour are German warning / danger signs (Gefahrzeichen)?",
          explanation:
            "Warning signs are triangular with a red border on a white background, point up. They alert you to a hazard ahead so you can slow down and prepare.",
          options: [
            {
              text: "A red-bordered triangle, point up, on white",
              correct: true,
            },
            { text: "A solid blue circle", correct: false },
            { text: "A yellow diamond", correct: false },
            { text: "A red octagon", correct: false },
          ],
        },
        {
          text: "A warning triangle showing two children (Zeichen 136) means...",
          explanation:
            "This sign warns of children near the road (e.g. by a school or playground). Slow down and be ready to brake for children who may step out unexpectedly.",
          options: [
            {
              text: "Children may be near the road — slow down and be ready to brake",
              correct: true,
            },
            { text: "A school is closed", correct: false },
            { text: "Playground parking", correct: false },
            { text: "No children allowed", correct: false },
          ],
        },
        {
          text: "A red-bordered triangle with an exclamation mark (Zeichen 101) means...",
          explanation:
            "This is the general danger sign. A supplementary panel below it usually explains the specific hazard. Reduce speed and stay alert.",
          options: [
            { text: "A general danger point is ahead", correct: true },
            { text: "End of all speed limits", correct: false },
            { text: "Priority road", correct: false },
            { text: "Pedestrian zone", correct: false },
          ],
        },
        {
          text: "How should you generally react to a warning sign?",
          explanation:
            "Warning signs ask you to reduce speed and be ready to react to the hazard they indicate — not to ignore them or to stop every time.",
          options: [
            {
              text: "Reduce speed and be ready to react to the hazard",
              correct: true,
            },
            { text: "Speed up to pass the hazard quickly", correct: false },
            { text: "Ignore it if you already know the road", correct: false },
            { text: "Come to a complete stop every time", correct: false },
          ],
        },
      ],
    },

    // ===== Vulnerable Road Users =====
    {
      id: "scen-de-pedestrian-crossing",
      slug: "pedestrian-crossing",
      name: "Pedestrian Crossing (Zebrastreifen)",
      description:
        "Identify marked zebra crossings (Zebrastreifen) and apply the correct right-of-way rules for pedestrians.",
      order: 19,
      type: ScenarioType.PRACTICE,
      categoryId: vruDe.id,
      countryId: germany.id,
      questions: [
        {
          text: "A pedestrian is standing at a marked zebra crossing (Fußgängerüberweg) clearly intending to cross. What must you do?",
          explanation:
            "§26 StVO grants pedestrians absolute priority at marked crossings once they show their intention to cross. Drivers must stop and wait until the pedestrian has safely crossed.",
          options: [
            {
              text: "Stop and wait — pedestrians have priority at zebra crossings",
              correct: true,
            },
            {
              text: "Proceed if the pedestrian has not yet stepped onto the road",
              correct: false,
            },
            {
              text: "Sound the horn to warn the pedestrian you are approaching",
              correct: false,
            },
            {
              text: "Slow to 10 km/h and proceed if the pedestrian notices you",
              correct: false,
            },
          ],
        },
        {
          text: "As you approach a zebra crossing, overtaking another vehicle is...",
          explanation:
            "You must not overtake on the approach to a zebra crossing. Overtaking could hide a pedestrian from the other driver and cause a collision.",
          options: [
            {
              text: "Prohibited on the approach to the crossing",
              correct: true,
            },
            { text: "Allowed if you signal", correct: false },
            { text: "Allowed for motorcycles only", correct: false },
            {
              text: "Encouraged, to clear the crossing faster",
              correct: false,
            },
          ],
        },
        {
          text: "Must you give way to pedestrians at a zebra crossing on the road you are turning into?",
          explanation:
            "Yes. When you turn into a side road, pedestrians crossing that road (including at a zebra crossing there) have priority and you must let them cross.",
          options: [
            {
              text: "Yes — yield to pedestrians on the road you turn into",
              correct: true,
            },
            {
              text: "No — turning vehicles always have priority",
              correct: false,
            },
            { text: "Only if the pedestrians are elderly", correct: false },
            { text: "Only at night", correct: false },
          ],
        },
      ],
    },
    {
      id: "scen-de-cyclist-blind-spot",
      slug: "cyclist-blind-spot",
      name: "Cyclists & Blind Spot",
      description:
        "Turn safely across cycle lanes — the Toter Winkel, shoulder checks, and the minimum overtaking distance.",
      order: 20,
      type: ScenarioType.PRACTICE,
      categoryId: vruDe.id,
      countryId: germany.id,
      questions: [
        {
          text: "You are turning right and a cyclist is going straight on in the cycle lane to your right. Who has priority?",
          explanation:
            "A cyclist continuing straight on in the cycle lane has priority over a vehicle turning right across their path. You must let the cyclist pass before turning.",
          options: [
            { text: "The cyclist going straight on", correct: true },
            { text: "You, because you are a car", correct: false },
            { text: "Whoever is travelling faster", correct: false },
            { text: "Neither — just go", correct: false },
          ],
        },
        {
          text: "Before turning right across a cycle lane, the most important check is...",
          explanation:
            "A shoulder check (Schulterblick) to the right is essential, because a cyclist can be in the blind spot (Toter Winkel) that your mirrors don't show.",
          options: [
            {
              text: "A shoulder check to the right for cyclists",
              correct: true,
            },
            { text: "Only the left mirror", correct: false },
            { text: "Only the centre rearview mirror", correct: false },
            { text: "No check is needed", correct: false },
          ],
        },
        {
          text: "What is the minimum overtaking distance to a cyclist within built-up areas in Germany?",
          explanation:
            "Since 2020 the law requires at least 1.5 metres of lateral clearance when overtaking a cyclist inside towns (and 2.0 metres outside built-up areas).",
          options: [
            { text: "1.5 metres", correct: true },
            { text: "0.5 metres", correct: false },
            { text: "5 metres", correct: false },
            { text: "There is no minimum", correct: false },
          ],
        },
        {
          text: "Why are large trucks especially dangerous to cyclists at junctions?",
          explanation:
            "Trucks have a large blind spot on the right when turning, so a cyclist alongside can be invisible to the driver. Cyclists should never position themselves on the inside of a turning truck.",
          options: [
            {
              text: "They have a big blind spot when turning right",
              correct: true,
            },
            { text: "They are too quiet to hear", correct: false },
            { text: "Cyclists are always at fault", correct: false },
            { text: "Trucks cannot brake at all", correct: false },
          ],
        },
      ],
    },
    {
      id: "scen-de-tram-priority",
      slug: "tram-priority",
      name: "Tram Priority",
      description:
        "Share the road with trams (Straßenbahn) — priority at junctions and passing a tram at a stop.",
      order: 21,
      type: ScenarioType.PRACTICE,
      categoryId: vruDe.id,
      countryId: germany.id,
      questions: [
        {
          text: "At junctions, a tram (Straßenbahn) generally has...",
          explanation:
            "Trams generally have priority, even over the normal Rechts vor Links rule, unless signs or signals say otherwise. They are heavy and cannot stop or swerve quickly.",
          options: [
            {
              text: "Priority, even over the normal road rules",
              correct: true,
            },
            { text: "No priority at all", correct: false },
            { text: "Priority only at night", correct: false },
            { text: "The same priority as a bicycle", correct: false },
          ],
        },
        {
          text: "A tram has stopped at a stop with no raised platform and passengers are boarding. You must...",
          explanation:
            "Where passengers must step into the road to reach the tram, you may only pass at walking pace, or stop, so they can cross safely.",
          options: [
            {
              text: "Pass only at walking pace, or stop for the passengers",
              correct: true,
            },
            { text: "Overtake the tram quickly", correct: false },
            { text: "Sound the horn and pass at normal speed", correct: false },
            { text: "Reverse away from the stop", correct: false },
          ],
        },
        {
          text: "May you drive on tram tracks that are embedded in the road?",
          explanation:
            "You may use embedded tram tracks only where permitted and only if you do not obstruct the tram. The tram must always be able to pass freely.",
          options: [
            {
              text: "Only where permitted and without obstructing the tram",
              correct: true,
            },
            { text: "Never, under any circumstances", correct: false },
            { text: "Always, completely freely", correct: false },
            { text: "Only buses may use them", correct: false },
          ],
        },
        {
          text: "A tram approaches the junction from your right while you come from a side road. Usually you...",
          explanation:
            "Because trams generally have priority, you yield to the approaching tram even though it is on your right and you are joining the junction.",
          options: [
            { text: "Yield to the tram", correct: true },
            { text: "The tram yields to you", correct: false },
            {
              text: "Drive on, because you reached the line first",
              correct: false,
            },
            { text: "Race the tram across", correct: false },
          ],
        },
      ],
    },
    {
      id: "scen-de-school-zone",
      slug: "school-zone",
      name: "School Zone & Children",
      description:
        "Drive safely near schools and buses — reduced speed, unpredictable children, and passing a halted bus.",
      order: 22,
      type: ScenarioType.PRACTICE,
      categoryId: vruDe.id,
      countryId: germany.id,
      questions: [
        {
          text: "A bus at a stop has its hazard warning lights flashing and you want to pass it. You must...",
          explanation:
            "A bus showing hazard lights at a stop may have passengers stepping out. You may only pass at walking pace (Schrittgeschwindigkeit) and be ready to stop.",
          options: [
            { text: "Pass only at walking pace, ready to stop", correct: true },
            { text: "Pass at the normal speed limit", correct: false },
            { text: "Overtake quickly to clear the bus", correct: false },
            { text: "Sound the horn and pass", correct: false },
          ],
        },
        {
          text: "Near a school or playground with children about, you should...",
          explanation:
            "Children can behave unpredictably and may run into the road. Reduce your speed and be prepared to brake for sudden movements.",
          options: [
            {
              text: "Slow down and expect sudden, unpredictable movements",
              correct: true,
            },
            { text: "Maintain your speed", correct: false },
            { text: "Only watch out in summer", correct: false },
            { text: "Speed up to leave the zone faster", correct: false },
          ],
        },
        {
          text: "A service bus indicates and is about to leave a stop in a built-up area. You must...",
          explanation:
            "In built-up areas a bus leaving a stop has priority once it signals. You must slow or wait to let it pull out — though the bus driver must also take care.",
          options: [
            { text: "Let the bus pull out", correct: true },
            { text: "Block it to keep your speed", correct: false },
            { text: "Overtake immediately", correct: false },
            { text: "Flash your lights to make it wait", correct: false },
          ],
        },
        {
          text: "A child is standing alone at the kerb. The safest assumption is that they...",
          explanation:
            "Treat a child at the kerb as unpredictable — they might step or run out without warning. Cover the brake and slow down.",
          options: [
            {
              text: "Might step out suddenly, so slow down and cover the brake",
              correct: true,
            },
            { text: "Will certainly wait for you to pass", correct: false },
            { text: "Will move if you sound the horn", correct: false },
            { text: "Can be ignored", correct: false },
          ],
        },
      ],
    },

    // ===== Special Situations & Highway =====
    {
      id: "scen-de-emergency-vehicle",
      slug: "emergency-vehicle",
      name: "Emergency Vehicle & Rettungsgasse",
      description:
        "Respond to emergency vehicles with blue lights and form a rescue lane (Rettungsgasse) when traffic slows.",
      order: 23,
      type: ScenarioType.PRACTICE,
      categoryId: specialDe.id,
      countryId: germany.id,
      questions: [
        {
          text: "What must you do when an emergency vehicle with blue lights AND siren approaches?",
          explanation:
            "§38 StVO requires you to give way immediately. On multi-lane roads form a rescue lane (Rettungsgasse); on single-lane roads move as far right as safely possible and stop if needed.",
          options: [
            {
              text: "Move to the right and stop if necessary to clear a path",
              correct: true,
            },
            {
              text: "Accelerate to reach the next side street and turn off",
              correct: false,
            },
            {
              text: "Continue at normal speed and let it overtake",
              correct: false,
            },
            {
              text: "Stop instantly in your lane regardless of traffic behind",
              correct: false,
            },
          ],
        },
        {
          text: "On a multi-lane road or Autobahn in a jam, where is the Rettungsgasse formed?",
          explanation:
            "The rescue lane runs between the far-left lane and the lane(s) to its right: vehicles in the left lane move left, all others move right, opening a gap down the middle.",
          options: [
            {
              text: "Between the far-left lane and the lanes to its right",
              correct: true,
            },
            { text: "Always on the hard shoulder only", correct: false },
            { text: "In the middle of the right-hand lane", correct: false },
            { text: "No lane is needed", correct: false },
          ],
        },
        {
          text: "When must you form the Rettungsgasse?",
          explanation:
            "You form the rescue lane as soon as traffic slows or stops on a multi-lane road — not only once you can already hear a siren. Forming it early keeps the path clear.",
          options: [
            {
              text: "As soon as traffic stalls, before any siren arrives",
              correct: true,
            },
            {
              text: "Only after the ambulance has already passed",
              correct: false,
            },
            { text: "Only if the police order it", correct: false },
            { text: "Never on the Autobahn", correct: false },
          ],
        },
        {
          text: "An emergency vehicle shows blue flashing lights but NO siren. This means...",
          explanation:
            "Blue lights without a siren warn of a hazard or a vehicle securing a scene. You have no duty to clear the way, but you must pass with care. Blue light plus siren means you must give way.",
          options: [
            {
              text: "A hazard warning — pass carefully, no duty to clear the way",
              correct: true,
            },
            { text: "You must immediately form a rescue lane", correct: false },
            { text: "You may ignore it completely", correct: false },
            { text: "It is a police speed camera", correct: false },
          ],
        },
      ],
    },
    {
      id: "scen-de-bus-stop",
      slug: "bus-stop",
      name: "Bus Stop",
      description:
        "Give way to buses leaving a stop and pass a halted bus safely with pedestrians around.",
      order: 24,
      type: ScenarioType.PRACTICE,
      categoryId: specialDe.id,
      countryId: germany.id,
      questions: [
        {
          text: "A service bus at a stop signals to pull out into traffic in a built-up area. You must...",
          explanation:
            "In built-up areas a bus leaving a stop has priority once it indicates. You must reduce speed and let it pull out, braking if necessary.",
          options: [
            { text: "Reduce speed and let the bus pull out", correct: true },
            { text: "Keep your priority and pass it", correct: false },
            { text: "Overtake before it can move off", correct: false },
            { text: "Stop and deliberately block it", correct: false },
          ],
        },
        {
          text: "A bus is standing at a stop with hazard warning lights on while passengers cross. You may pass only...",
          explanation:
            "When a bus shows hazard lights at a stop, you may pass only at walking pace and only if you do not endanger passengers; stop if necessary.",
          options: [
            { text: "At walking pace, and ready to stop", correct: true },
            { text: "At the normal speed limit", correct: false },
            { text: "By overtaking quickly", correct: false },
            { text: "By driving onto the pavement", correct: false },
          ],
        },
        {
          text: "Does the bus driver leaving a stop have completely unconditional priority?",
          explanation:
            "No. The bus has priority once it signals, but the driver must indicate and pull out with due care — responsibility is shared with surrounding traffic.",
          options: [
            {
              text: "No — the bus must signal and pull out with care too",
              correct: true,
            },
            { text: "Yes — totally unconditional", correct: false },
            { text: "Only at night", correct: false },
            { text: "Only for double-decker buses", correct: false },
          ],
        },
        {
          text: "When passing a bus halted at a stop, you should watch especially for...",
          explanation:
            "Pedestrians may step into the road in front of or behind a stopped bus where you cannot see them, so pass slowly and stay alert.",
          options: [
            {
              text: "Pedestrians stepping out in front of or behind the bus",
              correct: true,
            },
            { text: "Nothing — the bus blocks all hazards", correct: false },
            { text: "Only other buses", correct: false },
            { text: "Low-flying birds", correct: false },
          ],
        },
      ],
    },
    {
      id: "scen-de-autobahn-rules",
      slug: "autobahn-rules",
      name: "Autobahn Rules",
      description:
        "Understand Autobahn-specific rules: advisory speed, lane discipline, overtaking, and joining safely.",
      order: 25,
      type: ScenarioType.PRACTICE,
      categoryId: specialDe.id,
      countryId: germany.id,
      questions: [
        {
          text: "On an unrestricted section of German Autobahn (no limit posted), what is the official guidance?",
          explanation:
            "There is no general limit on unrestricted Autobahn sections, but the advisory speed (Richtgeschwindigkeit) is 130 km/h. Exceeding it is legal but reduces liability protection in a crash.",
          options: [
            {
              text: "130 km/h is advised; there is no legally enforced maximum",
              correct: true,
            },
            {
              text: "120 km/h is the enforced maximum everywhere",
              correct: false,
            },
            { text: "150 km/h is the legal maximum", correct: false },
            { text: "There is no recommendation at all", correct: false },
          ],
        },
        {
          text: "On the Autobahn, overtaking is permitted...",
          explanation:
            "You overtake on the LEFT only. Undertaking (passing on the right) is generally prohibited, except in slow, queued traffic where lanes move at similar speeds.",
          options: [
            { text: "On the left only", correct: true },
            { text: "On either side, freely", correct: false },
            { text: "On the right only", correct: false },
            { text: "Never", correct: false },
          ],
        },
        {
          text: "Which of these may NOT use the Autobahn?",
          explanation:
            "The Autobahn is only for motor vehicles that can (by design) exceed 60 km/h. Pedestrians, cyclists, mopeds and slow vehicles are not allowed.",
          options: [
            {
              text: "Vehicles that cannot exceed 60 km/h, plus pedestrians and cyclists",
              correct: true,
            },
            { text: "Only trucks", correct: false },
            { text: "Only foreign-registered cars", correct: false },
            { text: "None — every road user is allowed", correct: false },
          ],
        },
        {
          text: "Before joining the Autobahn from the acceleration lane (Beschleunigungsstreifen), you should...",
          explanation:
            "Use the acceleration lane to match the speed of through traffic, then merge into a safe gap. Through traffic has priority; you should not stop at the end of the ramp unless forced to.",
          options: [
            {
              text: "Accelerate to match traffic speed and merge into a gap",
              correct: true,
            },
            { text: "Stop at the end of the ramp and wait", correct: false },
            { text: "Merge at 40 km/h", correct: false },
            { text: "Expect through traffic to brake for you", correct: false },
          ],
        },
      ],
    },
    {
      id: "scen-de-zipper-merge",
      slug: "zipper-merge",
      name: "Zipper Merge",
      description:
        "Use the Reißverschlussverfahren — merge alternately at the point a lane ends to keep traffic flowing.",
      order: 26,
      type: ScenarioType.PRACTICE,
      categoryId: specialDe.id,
      countryId: germany.id,
      questions: [
        {
          text: "When a lane ends (e.g. at roadworks), the Reißverschlussverfahren (zipper merge) says you should...",
          explanation:
            "Use both lanes right up to the merge point, then merge alternately, one vehicle from each lane in turn — like the teeth of a zip. This keeps traffic moving.",
          options: [
            {
              text: "Use both lanes up to the merge point, then merge alternately",
              correct: true,
            },
            {
              text: "Merge as early as possible and queue in one lane",
              correct: false,
            },
            { text: "Race to the front and force your way in", correct: false },
            { text: "Stop and wait to be waved in", correct: false },
          ],
        },
        {
          text: "Merging early and leaving the closing lane empty is...",
          explanation:
            "Merging too early wastes road capacity and lengthens the queue. The zipper merge deliberately uses both lanes fully before joining at the end.",
          options: [
            {
              text: "Inefficient — both lanes should be used to the merge point",
              correct: true,
            },
            { text: "The legally required method", correct: false },
            { text: "Always safer", correct: false },
            { text: "What the zipper rule recommends", correct: false },
          ],
        },
        {
          text: "At the actual merge point, drivers in the continuing lane should...",
          explanation:
            "The continuing lane lets one vehicle from the ending lane merge in, alternating fairly. Blocking the gap defeats the purpose and causes friction.",
          options: [
            {
              text: "Let one vehicle from the ending lane in, alternating",
              correct: true,
            },
            { text: "Close the gap to block merging", correct: false },
            { text: "Speed up to prevent anyone merging", correct: false },
            { text: "Stop completely", correct: false },
          ],
        },
      ],
    },
    {
      id: "scen-de-railway-crossing",
      slug: "railway-crossing",
      name: "Railway Crossing (Bahnübergang)",
      description:
        "Cross railways safely — the Andreaskreuz, red lights and barriers, and never stopping on the tracks.",
      order: 27,
      type: ScenarioType.PRACTICE,
      categoryId: specialDe.id,
      countryId: germany.id,
      questions: [
        {
          text: "The St Andrew's cross sign (Andreaskreuz) at a railway crossing means...",
          explanation:
            "The Andreaskreuz tells you that rail traffic has absolute priority. You must always give way to trains at the crossing.",
          options: [
            {
              text: "Trains have absolute priority — give way to rail traffic",
              correct: true,
            },
            { text: "You have priority over trains", correct: false },
            { text: "No trains run on this line", correct: false },
            { text: "Parking is allowed here", correct: false },
          ],
        },
        {
          text: "A red flashing light (or steady red) at a level crossing means...",
          explanation:
            "A red light at a level crossing means stop and wait — a train is coming. You must not cross until the light goes out and any barriers are raised.",
          options: [
            { text: "Stop and wait — do not cross", correct: true },
            { text: "Proceed quickly before the train", correct: false },
            { text: "Slow down only", correct: false },
            { text: "The crossing is open", correct: false },
          ],
        },
        {
          text: "May you stop or queue ON a railway crossing?",
          explanation:
            "Never stop on the tracks. Only start to cross when you are sure you can clear the crossing completely without having to stop on it.",
          options: [
            {
              text: "No — never stop on the tracks; only cross if you can clear them",
              correct: true,
            },
            { text: "Yes, if only briefly", correct: false },
            { text: "Yes, to let other cars pass", correct: false },
            { text: "Only at night", correct: false },
          ],
        },
        {
          text: "The countdown marker boards (Baken) before a level crossing tell you...",
          explanation:
            "The diagonal-striped marker boards warn how far it is to the crossing (roughly 240, 160 and 80 metres), giving you time to slow down.",
          options: [
            { text: "The distance remaining to the crossing", correct: true },
            { text: "The speed of the approaching train", correct: false },
            { text: "Where you may park", correct: false },
            { text: "The current speed limit", correct: false },
          ],
        },
      ],
    },
    {
      id: "scen-de-adverse-conditions",
      slug: "adverse-conditions",
      name: "Fog, Rain & Night Driving",
      description:
        "Adapt to poor conditions — speed in fog, the rear fog light, rain, and dipping your headlights at night.",
      order: 28,
      type: ScenarioType.PRACTICE,
      categoryId: specialDe.id,
      countryId: germany.id,
      questions: [
        {
          text: "In thick fog with visibility below 50 metres, the maximum speed you may drive is...",
          explanation:
            "When fog cuts visibility below 50 metres you may drive no faster than 50 km/h — and even slower if conditions require it.",
          options: [
            { text: "50 km/h", correct: true },
            { text: "80 km/h", correct: false },
            { text: "100 km/h", correct: false },
            { text: "No limit applies", correct: false },
          ],
        },
        {
          text: "When may you use the rear fog light (Nebelschlussleuchte)?",
          explanation:
            "The rear fog light may be used only when fog reduces visibility below 50 metres. Using it otherwise dazzles drivers behind and is an offence.",
          options: [
            {
              text: "Only when fog reduces visibility below 50 metres",
              correct: true,
            },
            { text: "Whenever it rains", correct: false },
            { text: "Always at night on the Autobahn", correct: false },
            { text: "To make the car look sporty", correct: false },
          ],
        },
        {
          text: "In heavy rain you should...",
          explanation:
            "Slow down, increase your following distance, and switch on dipped headlights so you can see and be seen. Reduced grip means longer braking distances.",
          options: [
            {
              text: "Slow down, keep more distance, and use dipped headlights",
              correct: true,
            },
            { text: "Use full beam to see through the rain", correct: false },
            { text: "Drive faster to get out of the rain", correct: false },
            { text: "Turn off all your lights", correct: false },
          ],
        },
        {
          text: "At night, when must you dip your headlights (avoid full beam)?",
          explanation:
            "Switch from full beam to dipped headlights when a vehicle approaches from the opposite direction or when you are following closely behind another vehicle, to avoid dazzling them.",
          options: [
            {
              text: "For oncoming vehicles and when following another car closely",
              correct: true,
            },
            { text: "Never — keep full beam on at all times", correct: false },
            { text: "Only inside towns", correct: false },
            { text: "Only when you feel tired", correct: false },
          ],
        },
      ],
    },

    // ===== Test =====
    {
      id: "scen-de-full-test",
      slug: "full-test-germany",
      name: "Full Test — Germany",
      description:
        "Complete theory test covering all German traffic rules, signs, and driving laws. Questions are drawn from every scenario and graded at the end.",
      order: 29,
      type: ScenarioType.TEST,
      categoryId: specialDe.id,
      countryId: germany.id,
      questions: [],
    },
  ];

  // ── France Scenarios ──────────────────────────────────────────────────────
  const frScenarios: ScenarioSeed[] = [
    {
      id: "scen-fr-basic-controls",
      slug: "fr-basic-controls",
      name: "Basic Controls",
      description:
        "Learn the fundamental controls of the vehicle and the required documents every French driver must carry.",
      order: 1,
      type: ScenarioType.PRACTICE,
      categoryId: basicSkillsFr.id,
      countryId: france.id,
      questions: [
        {
          text: "Which documents must a driver carry at all times when driving in France?",
          explanation:
            "French law requires drivers to carry their driving licence (permis de conduire), vehicle registration document (carte grise / certificat d'immatriculation), proof of insurance (attestation d'assurance), and a valid ID. Failure to produce these on demand is an offence.",
          options: [
            {
              text: "Driving licence, vehicle registration, proof of insurance, and ID",
              correct: true,
            },
            {
              text: "Only a driving licence is legally required",
              correct: false,
            },
            {
              text: "Insurance documents are optional if the vehicle has a vignette",
              correct: false,
            },
            {
              text: "A passport is the only accepted form of identification",
              correct: false,
            },
          ],
        },
      ],
    },
    {
      id: "scen-fr-priorite-a-droite",
      slug: "fr-priorite-a-droite",
      name: "Priorité à droite",
      description:
        "Understand the French right-of-way rule at unmarked intersections — vehicles from the right have priority.",
      order: 2,
      type: ScenarioType.PRACTICE,
      categoryId: trafficRulesFr.id,
      countryId: france.id,
      questions: [
        {
          text: "At an unmarked intersection with no signs or signals in France, which rule applies?",
          explanation:
            "France applies the 'Priorité à droite' (priority to the right) rule at unmarked intersections. Any vehicle approaching from your right has absolute priority, even on smaller roads. This rule is cancelled by signs such as 'Passage protégé' (yellow diamond) or yield triangles.",
          options: [
            {
              text: "Priorité à droite — the vehicle from the right always has priority",
              correct: true,
            },
            {
              text: "The vehicle on the wider road always has priority",
              correct: false,
            },
            {
              text: "The vehicle travelling at higher speed has priority",
              correct: false,
            },
            {
              text: "All vehicles must stop and negotiate at unmarked crossings",
              correct: false,
            },
          ],
        },
      ],
    },
    {
      id: "scen-fr-roundabout",
      slug: "fr-roundabout",
      name: "Roundabout — French Style",
      description:
        "Learn the modern French roundabout rule — entering traffic yields to vehicles already circulating inside.",
      order: 3,
      type: ScenarioType.PRACTICE,
      categoryId: trafficRulesFr.id,
      countryId: france.id,
      questions: [
        {
          text: "At a modern French roundabout (marked with yield signs at the entry), who has priority?",
          explanation:
            "Since 1984 French roundabouts use the 'Cédez le passage' (yield) sign at every entry point. Vehicles already circulating inside the roundabout have priority over entering vehicles. This replaced the old rule where entering traffic had priority, which caused many accidents.",
          options: [
            {
              text: "Vehicles already inside the roundabout — entering drivers must yield",
              correct: true,
            },
            {
              text: "Entering vehicles always have priority under Priorité à droite",
              correct: false,
            },
            {
              text: "The vehicle with the highest speed inside the roundabout",
              correct: false,
            },
            {
              text: "Vehicles entering from the right of the roundabout entry point",
              correct: false,
            },
          ],
        },
      ],
    },
    {
      id: "scen-fr-speed-limits",
      slug: "fr-speed-limits",
      name: "Speed Limits",
      description:
        "Master the French speed limit system across different road types and weather conditions.",
      order: 4,
      type: ScenarioType.PRACTICE,
      categoryId: trafficRulesFr.id,
      countryId: france.id,
      questions: [
        {
          text: "What is the default speed limit on French undivided rural roads (routes nationales / départementales) in dry conditions?",
          explanation:
            "France reduced the default speed limit on undivided rural roads from 90 km/h to 80 km/h in 2018. The limits are: 50 km/h in built-up areas, 80 km/h on undivided rural roads, 110 km/h on dual carriageways, 130 km/h on motorways. In rain, limits drop by 10–20 km/h.",
          options: [
            { text: "80 km/h", correct: true },
            { text: "90 km/h", correct: false },
            { text: "100 km/h", correct: false },
            { text: "70 km/h", correct: false },
          ],
        },
      ],
    },
    {
      id: "scen-fr-radar-cameras",
      slug: "fr-radar-cameras",
      name: "Radar Cameras",
      description:
        "Understand how French fixed and mobile radar cameras work and how to respond to warning signs.",
      order: 5,
      type: ScenarioType.PRACTICE,
      categoryId: trafficRulesFr.id,
      countryId: france.id,
      questions: [
        {
          text: "You see a sign warning of a radar camera (radar de contrôle) ahead. What is the correct response?",
          explanation:
            "The correct response to a radar warning sign is to check your speed and ensure you are within the posted limit. France operates thousands of fixed radars (radars fixes) and mobile radars. Fines are automatic and point deductions are applied to your licence. The radar detects your speed at the point it is passed, not just before it.",
          options: [
            {
              text: "Check and adjust your speed to comply with the posted speed limit",
              correct: true,
            },
            {
              text: "Brake sharply just before the camera and accelerate immediately after",
              correct: false,
            },
            {
              text: "Speed limits are advisory — radar fines can be contested",
              correct: false,
            },
            {
              text: "Only slow down if you are more than 20 km/h over the limit",
              correct: false,
            },
          ],
        },
      ],
    },
    {
      id: "scen-fr-motorway-rules",
      slug: "fr-motorway-rules",
      name: "Motorway Rules",
      description:
        "Learn French motorway (autoroute) rules including speed limits, lane discipline, and toll behaviour.",
      order: 6,
      type: ScenarioType.PRACTICE,
      categoryId: trafficRulesFr.id,
      countryId: france.id,
      questions: [
        {
          text: "What is the speed limit on French motorways (autoroutes) in dry conditions for a standard car?",
          explanation:
            "The speed limit on French motorways is 130 km/h in dry conditions. In rain it drops to 110 km/h. In fog with visibility below 50 metres, the limit drops to 50 km/h. New licence holders (within 2 years) are limited to 110 km/h on motorways regardless of weather.",
          options: [
            { text: "130 km/h", correct: true },
            { text: "120 km/h", correct: false },
            { text: "110 km/h", correct: false },
            { text: "150 km/h", correct: false },
          ],
        },
      ],
    },
    {
      id: "scen-fr-pedestrian-crossing",
      slug: "fr-pedestrian-crossing",
      name: "Pedestrian Crossing",
      description:
        "Apply the correct rules at French pedestrian crossings (passages piétons) and school zones.",
      order: 7,
      type: ScenarioType.PRACTICE,
      categoryId: trafficRulesFr.id,
      countryId: france.id,
      questions: [
        {
          text: "A pedestrian is waiting at a marked pedestrian crossing (passage piéton) in France. What must you do?",
          explanation:
            "Since 2010, French law (Code de la route Article R415-11) requires drivers to yield to pedestrians who are on or clearly about to step onto a pedestrian crossing. Failure to yield carries a fine and licence points. You must stop and wait until the pedestrian has completely crossed.",
          options: [
            {
              text: "Stop and yield — pedestrians have absolute priority at marked crossings",
              correct: true,
            },
            {
              text: "Proceed if no pedestrian has yet stepped onto the crossing",
              correct: false,
            },
            {
              text: "Flash your headlights to warn the pedestrian you are passing",
              correct: false,
            },
            {
              text: "Slow to 20 km/h and pass in front of the pedestrian",
              correct: false,
            },
          ],
        },
      ],
    },
    {
      id: "scen-fr-traffic-lights",
      slug: "fr-traffic-lights",
      name: "Traffic Lights",
      description:
        "Master French traffic light sequences including the flashing amber phase and tram signals.",
      order: 8,
      type: ScenarioType.PRACTICE,
      categoryId: trafficRulesFr.id,
      countryId: france.id,
      questions: [
        {
          text: "What does a flashing amber light at a French traffic signal mean?",
          explanation:
            "A flashing amber light in France means you may proceed but must do so with extreme caution, giving way to pedestrians and other vehicles. It is commonly used at night or when the full signal sequence is suspended. Unlike a steady amber, it does not mean stop.",
          options: [
            {
              text: "Proceed with caution, giving way to all other road users",
              correct: true,
            },
            {
              text: "Stop immediately as if it were a red light",
              correct: false,
            },
            {
              text: "You have right of way and may proceed at normal speed",
              correct: false,
            },
            {
              text: "The signal is broken — treat the junction as uncontrolled",
              correct: false,
            },
          ],
        },
      ],
    },
    {
      id: "scen-fr-parking-rules",
      slug: "fr-parking-rules",
      name: "Parking Rules",
      description:
        "Understand alternating parking (stationnement alterné) and French urban parking regulations.",
      order: 9,
      type: ScenarioType.PRACTICE,
      categoryId: basicSkillsFr.id,
      countryId: france.id,
      questions: [
        {
          text: "In a French town with alternating parking (stationnement alterné semi-mensuel), where must you park from the 1st to the 15th of the month?",
          explanation:
            "Alternating parking (stationnement alterné semi-mensuel) is used in many French towns. From the 1st to the 15th you park on the odd-numbered side of the street. From the 16th to the end of the month you park on the even-numbered side. Between midnight and 12:30 you may park on either side to allow the change.",
          options: [
            {
              text: "On the odd-numbered (impair) side of the street",
              correct: true,
            },
            {
              text: "On the even-numbered (pair) side of the street",
              correct: false,
            },
            {
              text: "On whichever side has the most available space",
              correct: false,
            },
            {
              text: "Parking is prohibited on both sides during changeover days",
              correct: false,
            },
          ],
        },
      ],
    },
    {
      id: "scen-fr-full-test",
      slug: "full-test-france",
      name: "Full Test — France",
      description:
        "Complete theory test covering all French traffic rules, signs, and driving laws. All scenarios tested back-to-back, graded at the end.",
      order: 10,
      type: ScenarioType.TEST,
      categoryId: trafficRulesFr.id,
      countryId: france.id,
      questions: [
        {
          text: "What is the legal blood alcohol concentration (BAC) limit for fully licensed drivers in France?",
          explanation:
            "The BAC limit for fully licensed drivers in France is 0.5 g/L (grams per litre of blood), equivalent to 0.25 mg/L in breath. For new drivers (within the first 3 years of holding a licence) and professional drivers, the limit is 0.2 g/L. Exceeding 0.8 g/L is a criminal offence.",
          options: [
            { text: "0.5 g/L for fully licensed drivers", correct: true },
            { text: "0.8 g/L — the same as the old UK limit", correct: false },
            {
              text: "0.0 g/L — zero tolerance for all drivers",
              correct: false,
            },
            { text: "0.3 g/L", correct: false },
          ],
        },
      ],
    },
  ];

  // ── Upsert all scenarios (authoritative; supports many questions) ──────────
  for (const s of [...deScenarios, ...frScenarios]) {
    const scenario = await prisma.scenario.upsert({
      where: { slug: s.slug },
      update: {
        countryId: s.countryId,
        categoryId: s.categoryId,
        name: s.name,
        description: s.description,
        order: s.order,
        isActive: true,
        isPremium: false,
        type: s.type,
      },
      create: {
        id: s.id,
        countryId: s.countryId,
        categoryId: s.categoryId,
        slug: s.slug,
        name: s.name,
        description: s.description,
        order: s.order,
        isActive: true,
        isPremium: false,
        type: s.type,
      },
    });

    // Replace this scenario's questions wholesale so the seed stays authoritative
    // when question content or counts change (also clears the old single-question rows).
    await prisma.question.deleteMany({ where: { scenarioId: scenario.id } });

    for (let qIdx = 0; qIdx < s.questions.length; qIdx++) {
      const q = s.questions[qIdx];
      const question = await prisma.question.create({
        data: {
          id: `q-${s.id}-${qIdx}`,
          scenarioId: scenario.id,
          questionText: q.text,
          order: qIdx + 1,
          explanation: q.explanation,
        },
      });

      for (let i = 0; i < q.options.length; i++) {
        const opt = q.options[i];
        await prisma.option.create({
          data: {
            id: `opt-${s.id}-${qIdx}-${i}`,
            questionId: question.id,
            optionText: opt.text,
            isCorrect: opt.correct,
            order: i + 1,
          },
        });
      }
    }

    console.log(
      `  Scenario: ${s.name} (${s.slug}) — ${s.questions.length} question(s)`,
    );
  }

  // ── Cleanup: remove the old Germany "Traffic Rules" category ───────────────
  // It was replaced by the six new categories; scenarios have been re-pointed above.
  await prisma.scenarioCategory.deleteMany({ where: { id: "cat-de-traffic" } });

  console.log("\nSeed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
