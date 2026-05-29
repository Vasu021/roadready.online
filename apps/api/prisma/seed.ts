import { PrismaClient, ScenarioType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ── Country ──────────────────────────────────────────────────────────────
  const germany = await prisma.country.upsert({
    where: { code: "DE" },
    update: {},
    create: {
      code: "DE",
      name: "Germany",
      flagEmoji: "🇩🇪",
      isActive: true,
    },
  });
  console.log(`Country: ${germany.name}`);

  // ── Categories ────────────────────────────────────────────────────────────
  const [basicSkills, trafficRules, roadSigns] = await Promise.all([
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
  console.log("Categories: Basic Skills, Traffic Rules, Road Signs");

  // ── Scenarios ─────────────────────────────────────────────────────────────
  type ScenarioSeed = {
    id: string;
    slug: string;
    name: string;
    description: string;
    order: number;
    type: ScenarioType;
    categoryId: string;
    question: {
      text: string;
      explanation: string;
      options: { text: string; correct: boolean }[];
    };
  };

  const scenarios: ScenarioSeed[] = [
    {
      id: "scen-de-basic-controls",
      slug: "basic-controls",
      name: "Basic Controls",
      description:
        "Learn the fundamental controls of the vehicle: accelerating, braking, and steering safely on an open road.",
      order: 1,
      type: ScenarioType.PRACTICE,
      categoryId: basicSkills.id,
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
      categoryId: trafficRules.id,
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
      categoryId: trafficRules.id,
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
    },
    {
      id: "scen-de-traffic-lights",
      slug: "traffic-lights",
      name: "Traffic Lights",
      description:
        "Understand the full sequence of German traffic light phases including the red-yellow combination before green.",
      order: 4,
      type: ScenarioType.PRACTICE,
      categoryId: trafficRules.id,
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
      categoryId: roadSigns.id,
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
      categoryId: roadSigns.id,
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
      categoryId: trafficRules.id,
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
      categoryId: trafficRules.id,
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
      categoryId: trafficRules.id,
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
      categoryId: trafficRules.id,
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

  for (const s of scenarios) {
    const scenario = await prisma.scenario.upsert({
      where: { slug: s.slug },
      update: {},
      create: {
        id: s.id,
        countryId: germany.id,
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

    console.log(`  Scenario: ${s.name}`);
  }

  console.log("\nSeed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
