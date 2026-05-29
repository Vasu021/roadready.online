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

  // ── Germany Categories ────────────────────────────────────────────────────
  const [basicSkillsDe, trafficRulesDe, roadSignsDe] = await Promise.all([
    prisma.scenarioCategory.upsert({
      where: { id: "cat-de-basic" },
      update: {},
      create: { id: "cat-de-basic", countryId: germany.id, name: "Basic Skills", order: 1 },
    }),
    prisma.scenarioCategory.upsert({
      where: { id: "cat-de-traffic" },
      update: {},
      create: { id: "cat-de-traffic", countryId: germany.id, name: "Traffic Rules", order: 2 },
    }),
    prisma.scenarioCategory.upsert({
      where: { id: "cat-de-signs" },
      update: {},
      create: { id: "cat-de-signs", countryId: germany.id, name: "Road Signs", order: 3 },
    }),
  ]);
  console.log("Germany categories: Basic Skills, Traffic Rules, Road Signs");

  // ── France Categories ─────────────────────────────────────────────────────
  const [basicSkillsFr, trafficRulesFr, roadSignsFr] = await Promise.all([
    prisma.scenarioCategory.upsert({
      where: { id: "cat-fr-basic" },
      update: {},
      create: { id: "cat-fr-basic", countryId: france.id, name: "Basic Skills", order: 1 },
    }),
    prisma.scenarioCategory.upsert({
      where: { id: "cat-fr-traffic" },
      update: {},
      create: { id: "cat-fr-traffic", countryId: france.id, name: "Traffic Rules", order: 2 },
    }),
    prisma.scenarioCategory.upsert({
      where: { id: "cat-fr-signs" },
      update: {},
      create: { id: "cat-fr-signs", countryId: france.id, name: "Road Signs", order: 3 },
    }),
  ]);
  console.log("France categories: Basic Skills, Traffic Rules, Road Signs");

  // ── Scenario seed type ────────────────────────────────────────────────────
  type ScenarioSeed = {
    id: string;
    slug: string;
    name: string;
    description: string;
    order: number;
    type: ScenarioType;
    categoryId: string;
    countryId: string;
    question: {
      text: string;
      explanation: string;
      options: { text: string; correct: boolean }[];
    };
  };

  // ── Germany Scenarios ─────────────────────────────────────────────────────
  const deScenarios: ScenarioSeed[] = [
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
      question: {
        text: "What is the correct procedure before moving off from a parked position?",
        explanation:
          "Before moving off you must signal your intention, check all mirrors for approaching traffic, then perform a blind-spot shoulder check before pulling away. Sounding the horn is not a substitute for observation.",
        options: [
          { text: "Signal, check mirrors, blind-spot shoulder check, then move", correct: true },
          { text: "Accelerate directly into traffic and let others react", correct: false },
          { text: "Only check the centre rearview mirror before moving", correct: false },
          { text: "Sound the horn to warn other drivers, then move", correct: false },
        ],
      },
    },
    {
      id: "scen-de-rechts-vor-links",
      slug: "rechts-vor-links",
      name: "Rechts vor Links — Right before Left",
      description:
        "Practice the core German right-of-way rule at unmarked intersections: traffic from the right has priority.",
      order: 2,
      type: ScenarioType.PRACTICE,
      categoryId: trafficRulesDe.id,
      countryId: germany.id,
      question: {
        text: "At an unmarked intersection with no signs or signals, which rule applies in Germany?",
        explanation:
          "§8 StVO (Straßenverkehrs-Ordnung) states 'Rechts vor Links' — vehicles approaching from the right have priority at unmarked intersections. This rule applies unless otherwise indicated by signs, signals, or road markings.",
        options: [
          {
            text: "Rechts vor Links — the vehicle from the right always has priority",
            correct: true,
          },
          { text: "The vehicle that arrives at the intersection first has priority", correct: false },
          { text: "Larger or heavier vehicles always have right of way", correct: false },
          { text: "Drivers must negotiate among themselves who proceeds first", correct: false },
        ],
      },
    },
    {
      id: "scen-de-roundabout",
      slug: "roundabout",
      name: "Roundabout",
      description:
        "Master roundabout entry, circulation, and exit. Yield to traffic already in the circle and signal correctly when leaving.",
      order: 3,
      type: ScenarioType.PRACTICE,
      categoryId: trafficRulesDe.id,
      countryId: germany.id,
      question: {
        text: "When approaching a German roundabout marked with a 'Vorfahrt gewähren' (yield) sign, what must you do?",
        explanation:
          "In Germany, roundabouts are governed by a mandatory yield sign for entering traffic. Vehicles already circulating inside the roundabout have absolute priority. You must give way and only enter when there is a safe gap.",
        options: [
          {
            text: "Yield to all vehicles already circulating inside the roundabout",
            correct: true,
          },
          { text: "You have priority over roundabout traffic and may enter freely", correct: false },
          { text: "Stop completely regardless of whether traffic is present", correct: false },
          { text: "Flash your headlights to signal your intention to enter", correct: false },
        ],
      },
    },
    {
      id: "scen-de-traffic-lights",
      slug: "traffic-lights",
      name: "Traffic Lights",
      description:
        "Understand the full sequence of German traffic light phases including the red-yellow combination before green.",
      order: 4,
      type: ScenarioType.PRACTICE,
      categoryId: trafficRulesDe.id,
      countryId: germany.id,
      question: {
        text: "What does a solid yellow traffic light mean in Germany?",
        explanation:
          "A yellow light means the signal is about to turn red. You must prepare to stop unless stopping safely is no longer possible. Accelerating to beat a yellow light is illegal and dangerous.",
        options: [
          { text: "Prepare to stop — the light is about to turn red", correct: true },
          {
            text: "Accelerate to clear the intersection before the light turns red",
            correct: false,
          },
          {
            text: "Proceed freely if the intersection appears clear of other vehicles",
            correct: false,
          },
          { text: "Only cyclists and pedestrians must stop at a yellow light", correct: false },
        ],
      },
    },
    {
      id: "scen-de-priority-road-signs",
      slug: "priority-road-signs",
      name: "Priority Road Signs",
      description:
        "Recognise and respond correctly to German priority signs: the yellow diamond (Vorfahrtstraße) and the yield triangle.",
      order: 5,
      type: ScenarioType.PRACTICE,
      categoryId: roadSignsDe.id,
      countryId: germany.id,
      question: {
        text: "What does the yellow diamond sign (Zeichen 306 — Vorfahrtstraße) indicate?",
        explanation:
          "The yellow diamond sign (Zeichen 306) indicates you are travelling on a priority road. Traffic on your road has right of way over all traffic joining from side roads, until the sign is cancelled by the black-crossed yellow diamond (Zeichen 307).",
        options: [
          {
            text: "You are on a priority road with right of way over all side-road traffic",
            correct: true,
          },
          { text: "You must yield to all other traffic at the next junction", correct: false },
          { text: "A reduced speed zone begins ahead", correct: false },
          { text: "A motorway toll booth is located ahead", correct: false },
        ],
      },
    },
    {
      id: "scen-de-vorfahrt-intersection",
      slug: "vorfahrt-priority-intersection",
      name: "Vorfahrt — Priority at Next Intersection",
      description:
        "React to the 'right of way at next intersection' sign (Zeichen 301) and understand when priority ends.",
      order: 6,
      type: ScenarioType.PRACTICE,
      categoryId: roadSignsDe.id,
      countryId: germany.id,
      question: {
        text: "What does the yellow diamond sign with a white border and a black diagonal bar through it (Zeichen 307) mean?",
        explanation:
          "Zeichen 307 (the cancelled yellow diamond) marks the end of the priority road. From this point, the standard 'Rechts vor Links' rule applies at junctions unless new priority signs are posted.",
        options: [
          {
            text: "The priority road ends here — you no longer have right of way",
            correct: true,
          },
          {
            text: "You now have increased priority over motorway on-ramp traffic",
            correct: false,
          },
          {
            text: "You must come to a complete stop at the very next intersection",
            correct: false,
          },
          { text: "A traffic-light controlled junction is ahead", correct: false },
        ],
      },
    },
    {
      id: "scen-de-emergency-vehicle",
      slug: "emergency-vehicle",
      name: "Emergency Vehicle",
      description:
        "Learn how to respond when emergency vehicles with blue lights and sirens approach from any direction.",
      order: 7,
      type: ScenarioType.PRACTICE,
      categoryId: trafficRulesDe.id,
      countryId: germany.id,
      question: {
        text: "What must you do when an emergency vehicle with activated blue lights and siren approaches?",
        explanation:
          "§38 StVO requires all drivers to immediately give way to emergency vehicles. On multi-lane roads you must form a rescue lane (Rettungsgasse) between the leftmost lane and the lanes to its right. On single-lane roads, move as far right as safely possible.",
        options: [
          {
            text: "Move to the right edge of the road and stop if necessary to clear a path",
            correct: true,
          },
          {
            text: "Accelerate to reach the next side street quickly and turn off",
            correct: false,
          },
          {
            text: "Continue at normal speed and allow the emergency vehicle to overtake",
            correct: false,
          },
          {
            text: "Stop immediately in the current lane regardless of traffic behind you",
            correct: false,
          },
        ],
      },
    },
    {
      id: "scen-de-pedestrian-crossing",
      slug: "pedestrian-crossing",
      name: "Pedestrian Crossing",
      description:
        "Identify marked zebra crossings (Zebrastreifen) and apply the correct right-of-way rules for pedestrians.",
      order: 8,
      type: ScenarioType.PRACTICE,
      categoryId: trafficRulesDe.id,
      countryId: germany.id,
      question: {
        text: "A pedestrian is standing at a marked zebra crossing (Fußgängerüberweg) and clearly intending to cross. What must you do?",
        explanation:
          "§26 StVO grants pedestrians absolute priority at marked crossings once they have indicated their intention to cross (standing at or stepping towards the crossing). Drivers must stop and wait until the pedestrian has safely crossed.",
        options: [
          {
            text: "Stop and wait — pedestrians have absolute priority at zebra crossings",
            correct: true,
          },
          {
            text: "Proceed if the pedestrian has not yet stepped onto the road surface",
            correct: false,
          },
          {
            text: "Sound the horn to warn the pedestrian you are approaching at speed",
            correct: false,
          },
          {
            text: "Slow to 10 km/h and proceed if the pedestrian appears to notice you",
            correct: false,
          },
        ],
      },
    },
    {
      id: "scen-de-autobahn-rules",
      slug: "autobahn-rules",
      name: "Autobahn Rules",
      description:
        "Understand Autobahn-specific rules: minimum speed, lane discipline, overtaking, and the Rettungsgasse.",
      order: 9,
      type: ScenarioType.PRACTICE,
      categoryId: trafficRulesDe.id,
      countryId: germany.id,
      question: {
        text: "On an unrestricted section of German Autobahn (no speed limit signs posted), what is the official guidance?",
        explanation:
          "Germany has no general speed limit on unrestricted Autobahn sections. The 'Richtgeschwindigkeit' (advisory speed) is 130 km/h. Exceeding it is legal but reduces liability protection in accidents. Some sections have permanent or variable limits — always obey posted signs.",
        options: [
          {
            text: "130 km/h is the recommended advisory speed; there is no legally enforced maximum",
            correct: true,
          },
          { text: "120 km/h is the legally enforced maximum on all Autobahn", correct: false },
          {
            text: "150 km/h is the maximum permitted by law on unrestricted sections",
            correct: false,
          },
          {
            text: "There is no recommendation whatsoever — any speed is fully permitted",
            correct: false,
          },
        ],
      },
    },
    {
      id: "scen-de-full-test",
      slug: "full-test-germany",
      name: "Full Test — Germany",
      description:
        "Complete theory test covering all German traffic rules, signs, and driving laws. All scenarios tested back-to-back, graded at the end.",
      order: 10,
      type: ScenarioType.TEST,
      categoryId: trafficRulesDe.id,
      countryId: germany.id,
      question: {
        text: "What is the legal blood alcohol concentration (BAC) limit for fully licensed drivers in Germany?",
        explanation:
          "§24a StVG sets the BAC limit at 0.5 per mille (0.05%) for fully licensed drivers. A limit of 0.0 per mille applies to drivers under 21 or within the first two years of holding a licence (Fahranfänger). Driving above the limit is an administrative offence; above 1.6 per mille it becomes a criminal offence.",
        options: [
          { text: "0.5 per mille (0.05%) for fully licensed drivers", correct: true },
          { text: "0.8 per mille (0.08%) — the same as the UK limit", correct: false },
          { text: "0.0 per mille — zero tolerance applies to all drivers", correct: false },
          { text: "0.3 per mille (0.03%)", correct: false },
        ],
      },
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
      question: {
        text: "Which documents must a driver carry at all times when driving in France?",
        explanation:
          "French law requires drivers to carry their driving licence (permis de conduire), vehicle registration document (carte grise / certificat d'immatriculation), proof of insurance (attestation d'assurance), and a valid ID. Failure to produce these on demand is an offence.",
        options: [
          {
            text: "Driving licence, vehicle registration, proof of insurance, and ID",
            correct: true,
          },
          { text: "Only a driving licence is legally required", correct: false },
          { text: "Insurance documents are optional if the vehicle has a vignette", correct: false },
          { text: "A passport is the only accepted form of identification", correct: false },
        ],
      },
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
      question: {
        text: "At an unmarked intersection with no signs or signals in France, which rule applies?",
        explanation:
          "France applies the 'Priorité à droite' (priority to the right) rule at unmarked intersections. Any vehicle approaching from your right has absolute priority, even on smaller roads. This rule is cancelled by signs such as 'Passage protégé' (yellow diamond) or yield triangles.",
        options: [
          {
            text: "Priorité à droite — the vehicle from the right always has priority",
            correct: true,
          },
          { text: "The vehicle on the wider road always has priority", correct: false },
          { text: "The vehicle travelling at higher speed has priority", correct: false },
          { text: "All vehicles must stop and negotiate at unmarked crossings", correct: false },
        ],
      },
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
      question: {
        text: "At a modern French roundabout (marked with yield signs at the entry), who has priority?",
        explanation:
          "Since 1984 French roundabouts use the 'Cédez le passage' (yield) sign at every entry point. Vehicles already circulating inside the roundabout have priority over entering vehicles. This replaced the old rule where entering traffic had priority, which caused many accidents.",
        options: [
          {
            text: "Vehicles already inside the roundabout — entering drivers must yield",
            correct: true,
          },
          { text: "Entering vehicles always have priority under Priorité à droite", correct: false },
          { text: "The vehicle with the highest speed inside the roundabout", correct: false },
          { text: "Vehicles entering from the right of the roundabout entry point", correct: false },
        ],
      },
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
      question: {
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
      question: {
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
          { text: "Speed limits are advisory — radar fines can be contested", correct: false },
          { text: "Only slow down if you are more than 20 km/h over the limit", correct: false },
        ],
      },
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
      question: {
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
      question: {
        text: "A pedestrian is waiting at a marked pedestrian crossing (passage piéton) in France. What must you do?",
        explanation:
          "Since 2010, French law (Code de la route Article R415-11) requires drivers to yield to pedestrians who are on or clearly about to step onto a pedestrian crossing. Failure to yield carries a fine and licence points. You must stop and wait until the pedestrian has completely crossed.",
        options: [
          {
            text: "Stop and yield — pedestrians have absolute priority at marked crossings",
            correct: true,
          },
          { text: "Proceed if no pedestrian has yet stepped onto the crossing", correct: false },
          { text: "Flash your headlights to warn the pedestrian you are passing", correct: false },
          { text: "Slow to 20 km/h and pass in front of the pedestrian", correct: false },
        ],
      },
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
      question: {
        text: "What does a flashing amber light at a French traffic signal mean?",
        explanation:
          "A flashing amber light in France means you may proceed but must do so with extreme caution, giving way to pedestrians and other vehicles. It is commonly used at night or when the full signal sequence is suspended. Unlike a steady amber, it does not mean stop.",
        options: [
          { text: "Proceed with caution, giving way to all other road users", correct: true },
          { text: "Stop immediately as if it were a red light", correct: false },
          { text: "You have right of way and may proceed at normal speed", correct: false },
          { text: "The signal is broken — treat the junction as uncontrolled", correct: false },
        ],
      },
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
      question: {
        text: "In a French town with alternating parking (stationnement alterné semi-mensuel), where must you park from the 1st to the 15th of the month?",
        explanation:
          "Alternating parking (stationnement alterné semi-mensuel) is used in many French towns. From the 1st to the 15th you park on the odd-numbered side of the street. From the 16th to the end of the month you park on the even-numbered side. Between midnight and 12:30 you may park on either side to allow the change.",
        options: [
          { text: "On the odd-numbered (impair) side of the street", correct: true },
          { text: "On the even-numbered (pair) side of the street", correct: false },
          { text: "On whichever side has the most available space", correct: false },
          { text: "Parking is prohibited on both sides during changeover days", correct: false },
        ],
      },
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
      question: {
        text: "What is the legal blood alcohol concentration (BAC) limit for fully licensed drivers in France?",
        explanation:
          "The BAC limit for fully licensed drivers in France is 0.5 g/L (grams per litre of blood), equivalent to 0.25 mg/L in breath. For new drivers (within the first 3 years of holding a licence) and professional drivers, the limit is 0.2 g/L. Exceeding 0.8 g/L is a criminal offence.",
        options: [
          { text: "0.5 g/L for fully licensed drivers", correct: true },
          { text: "0.8 g/L — the same as the old UK limit", correct: false },
          { text: "0.0 g/L — zero tolerance for all drivers", correct: false },
          { text: "0.3 g/L", correct: false },
        ],
      },
    },
  ];

  // ── Upsert all scenarios ───────────────────────────────────────────────────
  for (const s of [...deScenarios, ...frScenarios]) {
    const scenario = await prisma.scenario.upsert({
      where: { slug: s.slug },
      update: {},
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

    const question = await prisma.question.upsert({
      where: { id: `q-${s.id}` },
      update: {},
      create: {
        id: `q-${s.id}`,
        scenarioId: scenario.id,
        questionText: s.question.text,
        order: 1,
        explanation: s.question.explanation,
      },
    });

    for (let i = 0; i < s.question.options.length; i++) {
      const opt = s.question.options[i];
      await prisma.option.upsert({
        where: { id: `opt-${s.id}-${i}` },
        update: {},
        create: {
          id: `opt-${s.id}-${i}`,
          questionId: question.id,
          optionText: opt.text,
          isCorrect: opt.correct,
          order: i + 1,
        },
      });
    }

    console.log(`  Scenario: ${s.name} (${s.slug})`);
  }

  console.log("\nSeed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
