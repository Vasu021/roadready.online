import type { SeedModule } from "../types";

export const module13: SeedModule = {
  slug: "de-m13-vehicle-and-loads",
  order: 13,
  officialTitle: "Technische Bedingungen, Personen- und Güterbeförderung",
  title: "The vehicle, loads and passengers",
  summary:
    "Roadworthiness, tyres, lights, securing loads, roof boxes, child seats, trailers and documents.",
  intro:
    "The first of the two class-B lessons. A car that is not roadworthy makes every other rule irrelevant, and an unsecured load becomes a projectile in the first emergency stop.",
  estimatedMinutes: 24,
  isZusatzstoff: true,
  lessons: [
    {
      slug: "de-m13-l1-roadworthy",
      title: "Roadworthiness",
      body: "The driver is responsible for the vehicle's condition on every journey — not the garage, not the owner. Before driving, lights, tyres, brakes, mirrors, windscreen and fluid levels should all be in order.\n\nThe **Hauptuntersuchung** (TÜV) is due first after three years, then every two, and the sticker on the rear plate shows when. Driving with an expired inspection is fined and, after long overdue, draws points.",
      keyPoints: [
        "The driver answers for the vehicle's condition, every trip",
        "TÜV after three years, then every two",
        "An expired inspection is a fineable offence",
      ],
    },
    {
      slug: "de-m13-l2-tyres",
      title: "Tyres",
      body: "The legal minimum tread is **1.6 mm**, but braking on wet roads deteriorates badly below about 3 mm — treat 3 mm as the practical limit, and 4 mm on winter tyres.\n\nWinter tyres (M+S with the snowflake symbol) are required in wintry conditions. Pressures should be checked monthly when cold; under-inflation raises consumption, wear and braking distance. Tyres must match in size and type across an axle.",
      keyPoints: [
        "1.6 mm is the legal minimum; change at 3 mm in practice",
        "Winter tyres are required whenever conditions are wintry",
        "Check pressures monthly, cold",
      ],
    },
    {
      slug: "de-m13-l3-lights",
      title: "Lights and visibility",
      body: "All lights must work; a failed bulb is an offence and a frequent cause of night collisions. Carry spares or have them replaced promptly.\n\nDipped headlights are required in darkness, fog, rain and snowfall. Daytime running lights do not light the rear of the car, so they are not enough in poor visibility. Windows and mirrors must be clear of ice, snow and dirt before you move off — a scraped porthole is not enough.",
      keyPoints: [
        "Every light must work; a failed bulb is an offence",
        "Daytime running lights do not illuminate the rear",
        "Clear all windows fully, not just a porthole",
      ],
    },
    {
      slug: "de-m13-l4-loads",
      title: "Securing a load",
      body: "A load must be secured so it cannot slip, fall, roll or make noise even under emergency braking. In a 50 km/h emergency stop an unsecured object weighs roughly **50 times** its mass.\n\nUse straps, non-slip mats and a load-securing net; place heavy items low and against the back seat; never above the seat-back height in an estate without a net. The driver is responsible, even if someone else loaded the car.",
      keyPoints: [
        "An unsecured 10 kg object hits like half a tonne at 50 km/h",
        "Heavy items low, forward and strapped down",
        "The driver is responsible even if someone else loaded it",
      ],
    },
    {
      slug: "de-m13-l5-dimensions",
      title: "Projecting loads and roof boxes",
      body: "A load may project up to **1 m beyond the rear** without marking; beyond that it needs a red flag, board or light, visible to 1.5 m above the road. Forward projection is far more restricted.\n\nRoof loads raise the centre of gravity and change handling badly — reduce speed and avoid sudden steering. Observe the roof load limit in the manual, and remember the total weight must stay within the permitted limit.",
      keyPoints: [
        "Over 1 m beyond the rear must be marked in red",
        "Roof loads change handling — slow down and steer gently",
        "Never exceed the roof load limit or total permitted weight",
      ],
    },
    {
      slug: "de-m13-l6-passengers",
      title: "Passengers and child seats",
      body: "Seat belts are compulsory in every seat, and the driver is responsible for children under 12.\n\nChildren under 12 **and** under 150 cm need an approved child restraint. A rear-facing seat may never be used on a front seat with an active airbag — the airbag can be fatal. Only as many passengers as there are seat belts, and never more than the registration permits.",
      keyPoints: [
        "Child seat required under 12 years and under 150 cm",
        "Never a rear-facing seat in front of an active airbag",
        "One passenger per belt, never more than registered",
      ],
    },
    {
      slug: "de-m13-l7-trailers",
      title: "Trailers and towing",
      body: "Class B allows a trailer up to 750 kg, or heavier if the combination stays within 3,500 kg. Outside built-up areas the limit is **80 km/h**, including on the Autobahn, unless the combination carries a Tempo-100 authorisation.\n\nLoad trailers nose-heavy within the permitted nose weight, keep the load low, and expect snaking at speed: ease off, do not brake hard or steer sharply. Breakdown towing requires hazard lights on both vehicles.",
      keyPoints: [
        "Trailer combinations: 80 km/h outside built-up areas",
        "Load nose-heavy and low to avoid snaking",
        "If it snakes, ease off — do not brake hard or steer",
      ],
    },
  ],
  questions: [
    {
      questionText: "What is the legal minimum tyre tread depth in Germany?",
      explanation:
        "1.6 mm. In practice wet braking is already poor below 3 mm, so most advice is to change earlier.",
      errorPoints: 4,
      options: [
        { text: "1.6 mm", isCorrect: true },
        { text: "3 mm", isCorrect: false },
        { text: "0.8 mm", isCorrect: false },
        { text: "There is no legal minimum", isCorrect: false },
      ],
    },
    {
      questionText:
        "How heavy does an unsecured 10 kg object become in a 50 km/h emergency stop?",
      explanation:
        "Roughly 50 times its mass — about half a tonne of force. That is why loose loads kill.",
      errorPoints: 5,
      options: [
        { text: "About 500 kg of force", isCorrect: true },
        { text: "About 20 kg", isCorrect: false },
        { text: "About 100 kg", isCorrect: false },
        { text: "It stays 10 kg", isCorrect: false },
      ],
    },
    {
      questionText:
        "Until what age or height must a child use a child restraint?",
      explanation:
        "Under 12 years and under 150 cm. Once either condition is passed — 12 years or 150 cm — the normal belt may be used.",
      errorPoints: 5,
      options: [
        { text: "Under 12 years and under 150 cm", isCorrect: true },
        { text: "Under 8 years only", isCorrect: false },
        { text: "Under 16 years regardless of height", isCorrect: false },
        { text: "Only under 3 years", isCorrect: false },
      ],
    },
    {
      questionText:
        "May a rear-facing child seat be used on the front passenger seat?",
      explanation:
        "Only with the airbag deactivated. With an active airbag it is forbidden and potentially fatal.",
      errorPoints: 5,
      options: [
        { text: "Only if the airbag is deactivated", isCorrect: true },
        { text: "Yes, always", isCorrect: false },
        { text: "Yes, for short journeys", isCorrect: false },
        { text: "Yes, if the seat is belted tightly", isCorrect: false },
      ],
    },
    {
      questionText:
        "How far may a load project beyond the rear before it must be marked?",
      explanation:
        "Up to 1 m unmarked; beyond that a red flag, board or light is required, visible to 1.5 m above the road.",
      errorPoints: 3,
      options: [
        { text: "1 metre", isCorrect: true },
        { text: "3 metres", isCorrect: false },
        { text: "50 centimetres", isCorrect: false },
        { text: "No marking is ever required", isCorrect: false },
      ],
    },
    {
      questionText:
        "What speed limit applies to a car with a trailer outside built-up areas?",
      explanation:
        "80 km/h including on the Autobahn, unless the combination has a Tempo-100 authorisation.",
      errorPoints: 4,
      options: [
        { text: "80 km/h", isCorrect: true },
        { text: "100 km/h", isCorrect: false },
        { text: "120 km/h", isCorrect: false },
        { text: "The same as without a trailer", isCorrect: false },
      ],
    },
    {
      questionText: "Your trailer starts to snake at speed. What do you do?",
      explanation:
        "Ease off the accelerator and hold the wheel straight. Braking hard or steering sharply makes the oscillation worse.",
      errorPoints: 5,
      options: [
        {
          text: "Ease off gently and keep the wheel straight",
          isCorrect: true,
        },
        { text: "Brake hard immediately", isCorrect: false },
        { text: "Accelerate to pull it straight", isCorrect: false },
        { text: "Steer sharply the other way", isCorrect: false },
      ],
    },
    {
      questionText: "Who is responsible if a load is badly secured?",
      explanation:
        "The driver, even if someone else loaded the vehicle. Check before driving off.",
      errorPoints: 4,
      options: [
        { text: "The driver", isCorrect: true },
        { text: "Whoever loaded the vehicle", isCorrect: false },
        { text: "The vehicle owner", isCorrect: false },
        { text: "Nobody, unless something falls off", isCorrect: false },
      ],
    },
    {
      questionText: "Are daytime running lights sufficient in fog?",
      explanation:
        "No. They light only the front and leave the rear dark. Dipped headlights are required in fog, rain and snowfall.",
      errorPoints: 4,
      options: [
        { text: "No — they do not light the rear of the car", isCorrect: true },
        { text: "Yes, they are designed for it", isCorrect: false },
        { text: "Yes, if the fog is light", isCorrect: false },
        { text: "Yes, during the day", isCorrect: false },
      ],
    },
    {
      questionText:
        "Snow covers your windscreen except a small scraped patch. May you drive?",
      explanation:
        "No. All windows must be fully clear, along with mirrors, lights and the roof, before you move off.",
      errorPoints: 4,
      options: [
        { text: "No — all windows must be completely clear", isCorrect: true },
        { text: "Yes, if you can see the road ahead", isCorrect: false },
        { text: "Yes, for a short distance", isCorrect: false },
        { text: "Yes, if you drive slowly", isCorrect: false },
      ],
    },
    {
      questionText: "How does a roof box change the car's behaviour?",
      explanation:
        "It raises the centre of gravity, worsening cornering and crosswind stability, and raises consumption. Reduce speed and steer gently.",
      errorPoints: 3,
      options: [
        {
          text: "Higher centre of gravity, worse handling and more fuel",
          isCorrect: true,
        },
        { text: "No measurable effect", isCorrect: false },
        { text: "Better stability through extra weight", isCorrect: false },
        { text: "Only affects the top speed", isCorrect: false },
      ],
    },
    {
      questionText: "How many passengers may you carry?",
      explanation:
        "One per fitted seat belt, and never more than the registration document permits.",
      errorPoints: 3,
      options: [
        {
          text: "One per seat belt, up to the registered number",
          isCorrect: true,
        },
        { text: "As many as fit", isCorrect: false },
        { text: "Five in any car", isCorrect: false },
        { text: "Any number if all are adults", isCorrect: false },
      ],
    },
    {
      questionText: "When is the first Hauptuntersuchung due for a new car?",
      explanation:
        "After three years, then every two years. The sticker on the rear plate shows the month and year.",
      errorPoints: 2,
      options: [
        { text: "After three years, then every two", isCorrect: true },
        { text: "After one year, then annually", isCorrect: false },
        { text: "After five years", isCorrect: false },
        { text: "Only when sold", isCorrect: false },
      ],
    },
    {
      questionText: "Where should heavy items be placed when loading a car?",
      explanation:
        "Low down and as far forward as possible, against the back of the rear seats, and strapped so they cannot move.",
      errorPoints: 3,
      options: [
        {
          text: "Low and forward, secured against the rear seats",
          isCorrect: true,
        },
        { text: "High up so they do not shift", isCorrect: false },
        { text: "On the rear parcel shelf", isCorrect: false },
        { text: "Anywhere, if the boot is closed", isCorrect: false },
      ],
    },
  ],
};
