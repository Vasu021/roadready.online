import type { SeedModule } from "../types";

export const module03: SeedModule = {
  slug: "de-m03-legal-framework",
  order: 3,
  officialTitle: "Rechtliche Rahmenbedingungen",
  title: "The legal framework",
  summary:
    "StVO, StVZO and FeV, licence classes, the probation period, points in Flensburg, insurance and liability.",
  intro:
    "Three regulations govern driving in Germany, and a points system in Flensburg keeps score. Knowing which rule book covers what makes the rest of the course easier to place — and the probation period affects you personally for your first two years.",
  estimatedMinutes: 20,
  lessons: [
    {
      slug: "de-m03-l1-rulebooks",
      title: "Which rule book covers what",
      body: "Three regulations, three jobs:\n\n- **StVO** (Straßenverkehrs-Ordnung) — how you behave in traffic: priority, speed, signs, parking. Nearly every rule in this course.\n- **StVZO** (Straßenverkehrs-Zulassungs-Ordnung) — the vehicle: lights, tyres, brakes, the TÜV inspection, what makes a car roadworthy.\n- **FeV** (Fahrerlaubnis-Verordnung) — the driver: licence classes, medical fitness, the probation period, how a licence is withdrawn.\n\nA worn tyre is a StVZO matter. Running a red light is StVO. Losing your licence for repeated offences is FeV.",
      keyPoints: [
        "StVO = behaviour in traffic, StVZO = the vehicle, FeV = the driver",
        "Most of this course is StVO",
        "Vehicle defects and driver fitness are separate legal tracks",
      ],
    },
    {
      slug: "de-m03-l2-classes",
      title: "Licence classes and what B allows",
      body: "Class **B** covers vehicles up to 3,500 kg total permitted weight with up to eight passenger seats, plus a trailer up to 750 kg — or a heavier trailer provided the combination stays within 3,500 kg.\n\nRelated extensions:\n\n- **B96** — a short course, not a test; combination up to 4,250 kg\n- **BE** — a separate test; trailer up to 3,500 kg\n- **B197** — automatic training with a manual test, so the licence is not restricted to automatics\n\nClass B also covers mopeds up to 45 km/h (AM) and tractors up to 40 km/h (L).",
      keyPoints: [
        "Class B: up to 3,500 kg, up to 8 passenger seats, trailer to 750 kg",
        "B96 extends the combination to 4,250 kg without a further test",
        "B197 avoids an automatic-only restriction after automatic training",
      ],
    },
    {
      slug: "de-m03-l3-probation",
      title: "The probation period",
      body: "Every new licence starts with **two years on probation** (Probezeit), whatever your age.\n\nOffences are sorted into A (serious — red light, speeding over 21 km/h, phone, alcohol) and B (less serious — worn tyres, expired inspection).\n\nOne A offence or two B offences bring: the probation period extended to **four years**, a compulsory **Aufbauseminar**, and the costs on you. Repeat it and you face a traffic-psychology assessment and ultimately withdrawal of the licence.\n\nThe 0.0 ‰ alcohol limit applies throughout.",
      keyPoints: [
        "Two years on probation, extended to four after one A offence",
        "A offences: red light, 21+ km/h over, phone, any alcohol",
        "An Aufbauseminar is compulsory and paid for by you",
      ],
    },
    {
      slug: "de-m03-l4-points",
      title: "Points in Flensburg",
      body: "The Fahreignungsregister records serious offences:\n\n- **1 point** — ordinary offences such as speeding over 21 km/h\n- **2 points** — offences causing danger, such as running a red light\n- **3 points** — criminal offences, including drink driving\n\nAt **4 to 5** points you get a warning. At **6 to 7**, a formal caution and the offer of a seminar. At **8 points** the licence is withdrawn, with a minimum six-month wait before reapplying.\n\nPoints expire on their own schedule: 2.5 years for one-point offences, 5 years for two, 10 for three.",
      keyPoints: [
        "8 points means the licence is gone, with at least six months' wait",
        "Red light = 2 points; drink driving = 3",
        "Points expire individually, not as a block",
      ],
    },
    {
      slug: "de-m03-l5-insurance",
      title: "Insurance and liability",
      body: "**Kfz-Haftpflicht** (third-party liability) is compulsory — no insurance, no registration. It pays other people's damage, not yours.\n\n**Teilkasko** covers theft, glass, fire, storm and animal collisions. **Vollkasko** adds your own damage and vandalism.\n\nTwo things matter after a crash. Germany uses **Gefährdungshaftung**: the keeper of a vehicle is liable for damage it causes even without fault, which is why liability is often shared rather than assigned entirely to one driver. And gross negligence — drink driving, running a red light — lets your insurer reclaim money from you.",
      keyPoints: [
        "Third-party liability is compulsory; it covers others, not you",
        "Liability is often shared because of strict operating liability",
        "Gross negligence lets the insurer recover its payout from you",
      ],
    },
    {
      slug: "de-m03-l6-documents",
      title: "Documents and duties",
      body: "You must carry your **driving licence** and the **vehicle registration part I** (Zulassungsbescheinigung Teil I) whenever you drive, and show them on request. Part II, the ownership document, stays at home.\n\nThe car must carry a **warning triangle**, a **first-aid kit** within its expiry date, and a **high-visibility vest** — at least one, reachable from the driver's seat rather than in the boot.\n\nEvery car needs a valid **Hauptuntersuchung** (TÜV), shown by the sticker on the rear plate: new cars after three years, then every two.",
      keyPoints: [
        "Carry the licence and registration part I; part II stays at home",
        "Warning triangle, in-date first-aid kit and a reachable high-vis vest",
        "TÜV: first after three years, then every two",
      ],
    },
  ],
  questions: [
    {
      questionText: "Which regulation governs how you must behave in traffic?",
      explanation:
        "The StVO covers behaviour: priority, speed, signs, parking. The StVZO covers the vehicle and the FeV the driver.",
      errorPoints: 2,
      options: [
        { text: "The StVO", isCorrect: true },
        { text: "The StVZO", isCorrect: false },
        { text: "The FeV", isCorrect: false },
        { text: "The BGB", isCorrect: false },
      ],
    },
    {
      questionText: "How long is the probation period for a new licence?",
      explanation:
        "Two years, extended to four after one serious (A) offence or two lesser (B) offences.",
      errorPoints: 3,
      options: [
        {
          text: "Two years, extended to four after a serious offence",
          isCorrect: true,
        },
        { text: "One year for everyone", isCorrect: false },
        { text: "Three years, but only if you are under 21", isCorrect: false },
        { text: "Five years", isCorrect: false },
      ],
    },
    {
      questionText:
        "At how many points in Flensburg is the driving licence withdrawn?",
      explanation:
        "Eight. At 4 to 5 you get a warning, at 6 to 7 a formal caution, and at 8 the licence goes for at least six months.",
      errorPoints: 3,
      options: [
        { text: "8 points", isCorrect: true },
        { text: "3 points", isCorrect: false },
        { text: "12 points", isCorrect: false },
        { text: "18 points", isCorrect: false },
      ],
    },
    {
      questionText: "What total weight may a class-B vehicle have?",
      explanation:
        "Up to 3,500 kg permitted total weight with no more than eight passenger seats, plus a trailer up to 750 kg.",
      errorPoints: 3,
      options: [
        { text: "3,500 kg", isCorrect: true },
        { text: "2,800 kg", isCorrect: false },
        { text: "4,250 kg", isCorrect: false },
        { text: "7,500 kg", isCorrect: false },
      ],
    },
    {
      questionText: "Which documents must you carry while driving?",
      explanation:
        "Your driving licence and vehicle registration part I. Part II proves ownership and should stay somewhere safe at home.",
      errorPoints: 2,
      options: [
        { text: "Driving licence and registration part I", isCorrect: true },
        { text: "Driving licence and registration part II", isCorrect: false },
        { text: "Only the driving licence", isCorrect: false },
        {
          text: "Licence, both registration parts and the insurance policy",
          isCorrect: false,
        },
      ],
    },
    {
      questionText: "Which insurance is legally compulsory in Germany?",
      explanation:
        "Third-party liability (Kfz-Haftpflicht). Without it a vehicle cannot be registered. Teilkasko and Vollkasko are voluntary.",
      errorPoints: 3,
      options: [
        { text: "Third-party liability (Kfz-Haftpflicht)", isCorrect: true },
        { text: "Teilkasko", isCorrect: false },
        { text: "Vollkasko", isCorrect: false },
        { text: "None — insurance is voluntary", isCorrect: false },
      ],
    },
    {
      questionText: "How often must a car undergo the Hauptuntersuchung (TÜV)?",
      explanation:
        "A new car first after three years, then every two years. The sticker on the rear plate shows the month and year due.",
      errorPoints: 2,
      options: [
        { text: "First after three years, then every two", isCorrect: true },
        { text: "Every year without exception", isCorrect: false },
        { text: "Every four years", isCorrect: false },
        { text: "Only when the car is sold", isCorrect: false },
      ],
    },
    {
      questionText: "You run a red light. How many points does that carry?",
      explanation:
        "Two points, because it endangers others — plus a fine and usually a one-month driving ban.",
      errorPoints: 4,
      options: [
        { text: "2 points", isCorrect: true },
        { text: "1 point", isCorrect: false },
        { text: "3 points", isCorrect: false },
        { text: "None, if nothing happened", isCorrect: false },
      ],
    },
    {
      questionText: "What safety equipment must be in the car?",
      explanation:
        "A warning triangle, an in-date first-aid kit and at least one high-visibility vest, reachable from the driver's seat.",
      errorPoints: 3,
      options: [
        {
          text: "Warning triangle, first-aid kit and high-visibility vest",
          isCorrect: true,
        },
        { text: "Only a first-aid kit", isCorrect: false },
        { text: "Fire extinguisher and spare bulbs", isCorrect: false },
        { text: "Nothing is legally required", isCorrect: false },
      ],
    },
    {
      questionText: "What does B96 give you?",
      explanation:
        "A short course with no test, allowing a car and trailer combination up to 4,250 kg. BE is a separate test for heavier trailers.",
      errorPoints: 2,
      options: [
        {
          text: "Combinations up to 4,250 kg after a course, with no test",
          isCorrect: true,
        },
        { text: "The right to drive lorries up to 7,500 kg", isCorrect: false },
        { text: "A licence valid for 96 months", isCorrect: false },
        { text: "Permission to carry nine passengers", isCorrect: false },
      ],
    },
    {
      questionText:
        "You commit one serious (A) offence during the probation period. What follows?",
      explanation:
        "The period extends to four years and an Aufbauseminar becomes compulsory, at your expense.",
      errorPoints: 3,
      options: [
        {
          text: "Probation extends to four years plus a compulsory seminar",
          isCorrect: true,
        },
        { text: "A warning letter only", isCorrect: false },
        { text: "Immediate withdrawal of the licence", isCorrect: false },
        { text: "Nothing, as long as nobody was hurt", isCorrect: false },
      ],
    },
    {
      questionText:
        "Why is liability after a crash often shared between both drivers in Germany?",
      explanation:
        "Operating a motor vehicle carries strict liability (Gefährdungshaftung): the keeper answers for damage the vehicle causes even without fault, so the shares are weighed rather than assigned to one side.",
      errorPoints: 3,
      options: [
        {
          text: "Operating a vehicle carries liability even without fault",
          isCorrect: true,
        },
        {
          text: "Insurers always split costs equally by law",
          isCorrect: false,
        },
        { text: "Because fault can never be proven", isCorrect: false },
        { text: "Because both drivers pay their own damage", isCorrect: false },
      ],
    },
  ],
};
