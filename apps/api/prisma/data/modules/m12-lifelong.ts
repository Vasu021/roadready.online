import type { SeedModule } from "../types";

export const module12: SeedModule = {
  slug: "de-m12-lifelong-learning",
  order: 12,
  officialTitle: "Lebenslanges Lernen",
  title: "Staying a good driver",
  summary:
    "Keeping skills current, assistance systems, driving abroad and recognising your own decline.",
  intro:
    "The licence is permanent; your competence is not. The curriculum closes with this because the highest-risk groups are the newest drivers and, decades later, the same people again.",
  estimatedMinutes: 12,
  lessons: [
    {
      slug: "de-m12-l1-skills",
      title: "Skills fade and rules change",
      body: "Driving skill decays without practice, and the rules themselves move: the StVO has changed repeatedly in recent years, including the cyclist overtaking distances and the Rettungsgasse rules.\n\nRefresher courses exist for returning drivers, and ADAC and driving schools run safety training on skid pads. A driver who has not read a rule change is driving on out-of-date information.",
      keyPoints: [
        "Skills decay without practice; rules change without notice",
        "Overtaking distances and Rettungsgasse rules changed recently",
        "Refresher and safety training exist for returning drivers",
      ],
    },
    {
      slug: "de-m12-l2-assistance",
      title: "Assistance systems",
      body: "ABS prevents the wheels locking so you can still steer while braking hard. ESP corrects a skid. Lane-keeping, emergency braking and adaptive cruise control all help, within limits.\n\nThey do not shorten the physics. ABS does not reduce braking distance on every surface, emergency braking can miss cyclists and children, and lane assist fails on worn markings. The driver remains responsible for everything the system does or fails to do.",
      keyPoints: [
        "ABS keeps you steering; it does not always shorten the distance",
        "Emergency braking systems miss things, especially small road users",
        "Legal responsibility stays with the driver at all times",
      ],
    },
    {
      slug: "de-m12-l3-abroad",
      title: "Driving abroad",
      body: "A German licence is valid throughout the EU, but local rules differ sharply: France and Italy have lower limits in rain, many countries require headlights by day, Austria and Switzerland need a motorway vignette, and alcohol limits vary down to 0.0 ‰.\n\nSome countries require a warning triangle per vehicle, vests for all occupants, or a breathalyser. Check before you travel; ignorance is not a defence anywhere.",
      keyPoints: [
        "The licence is EU-valid, but the rules are not the same",
        "Vignettes, daytime headlights and extra kit are common requirements",
        "Alcohol limits are often lower than in Germany",
      ],
    },
    {
      slug: "de-m12-l4-ageing",
      title: "Ageing and self-assessment",
      body: "Night vision, reaction time, neck mobility and the ability to filter distractions all decline gradually, and the driver is usually the last to notice.\n\nHonest signals: more near misses, relatives offering to drive, avoiding motorways or darkness, confusion at complex junctions. Germany has no mandatory age testing for private licences, so the responsibility is yours — voluntary check-ups and feedback drives exist.",
      keyPoints: [
        "Night vision and reaction time decline gradually and unnoticed",
        "Near misses and relatives' concern are reliable warning signs",
        "No mandatory retesting in Germany — self-assessment is the control",
      ],
    },
  ],
  questions: [
    {
      questionText: "What does ABS actually do?",
      explanation:
        "It stops the wheels locking so you keep steering control while braking hard. It does not guarantee a shorter braking distance on every surface.",
      errorPoints: 3,
      options: [
        {
          text: "Prevents wheel lock so you can still steer while braking",
          isCorrect: true,
        },
        { text: "Always shortens the braking distance", isCorrect: false },
        { text: "Replaces the need to keep a distance", isCorrect: false },
        { text: "Brakes automatically for you", isCorrect: false },
      ],
    },
    {
      questionText:
        "Who is responsible when an assistance system fails to prevent a collision?",
      explanation:
        "The driver. Assistance systems support; they never transfer legal responsibility.",
      errorPoints: 4,
      options: [
        { text: "The driver", isCorrect: true },
        { text: "The manufacturer in all cases", isCorrect: false },
        { text: "Nobody, if the system was active", isCorrect: false },
        { text: "The insurer alone", isCorrect: false },
      ],
    },
    {
      questionText: "Your German licence in another EU country — what applies?",
      explanation:
        "It is valid, but the local rules are not German rules: limits, equipment and alcohol limits differ, and ignorance is not a defence.",
      errorPoints: 3,
      options: [
        { text: "Valid, but you must follow the local rules", isCorrect: true },
        { text: "Valid, and German rules apply to you", isCorrect: false },
        { text: "Invalid without an international permit", isCorrect: false },
        { text: "Valid for 30 days only", isCorrect: false },
      ],
    },
    {
      questionText:
        "Which signs suggest an older driver should reassess their fitness?",
      explanation:
        "More near misses, relatives offering to drive, avoiding night or motorway driving, and difficulty at complex junctions.",
      errorPoints: 3,
      options: [
        {
          text: "Near misses, avoiding night driving, relatives' concern",
          isCorrect: true,
        },
        { text: "Only a failed eyesight test", isCorrect: false },
        { text: "Reaching the age of 70 exactly", isCorrect: false },
        { text: "Nothing — the licence has no expiry", isCorrect: false },
      ],
    },
    {
      questionText:
        "Does Germany require periodic retesting of private drivers by age?",
      explanation:
        "No. There is no mandatory age testing for private licences, which puts the responsibility on self-assessment and voluntary check-ups.",
      errorPoints: 2,
      options: [
        {
          text: "No — self-assessment carries the responsibility",
          isCorrect: true,
        },
        { text: "Yes, every five years after 65", isCorrect: false },
        { text: "Yes, at 75 and then annually", isCorrect: false },
        { text: "Yes, but only for motorcyclists", isCorrect: false },
      ],
    },
    {
      questionText: "Lane-keeping assistance is active. When can it fail?",
      explanation:
        "On worn or missing markings, at road works with conflicting lines, in snow and heavy rain. Treat it as support, not a substitute for steering.",
      errorPoints: 3,
      options: [
        {
          text: "On worn markings, at road works, in snow or heavy rain",
          isCorrect: true,
        },
        { text: "Only above 150 km/h", isCorrect: false },
        { text: "It never fails once calibrated", isCorrect: false },
        { text: "Only when the indicator is on", isCorrect: false },
      ],
    },
    {
      questionText:
        "Why does a returning driver after years off the road pose a raised risk?",
      explanation:
        "Skills decay without practice and the rules have moved on. Refresher training exists precisely for this.",
      errorPoints: 3,
      options: [
        {
          text: "Skills fade and the rules have changed meanwhile",
          isCorrect: true,
        },
        { text: "Their licence has silently expired", isCorrect: false },
        { text: "Insurance will not cover them", isCorrect: false },
        { text: "They pose no raised risk", isCorrect: false },
      ],
    },
    {
      questionText: "Which recent StVO change affected overtaking cyclists?",
      explanation:
        "The minimum lateral distance was fixed at 1.5 m inside built-up areas and 2 m outside — a change many experienced drivers never learned.",
      errorPoints: 4,
      options: [
        {
          text: "Minimum clearance set at 1.5 m in town, 2 m outside",
          isCorrect: true,
        },
        { text: "Overtaking cyclists was banned entirely", isCorrect: false },
        { text: "Cyclists lost priority at junctions", isCorrect: false },
        { text: "Nothing has changed since 2000", isCorrect: false },
      ],
    },
  ],
};
