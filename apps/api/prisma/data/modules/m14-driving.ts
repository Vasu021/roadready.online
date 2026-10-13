import type { SeedModule } from "../types";

export const module14: SeedModule = {
  slug: "de-m14-driving-the-car",
  order: 14,
  officialTitle:
    "Fahren mit Solokraftfahrzeugen und Zügen — umweltbewusster Umgang mit Kraftfahrzeugen",
  title: "Driving the car itself",
  summary:
    "Controls, instruments, warning lights, starting and stopping, assistance in practice, and environmental care.",
  intro:
    "The second class-B lesson, and the most practical. It covers the machine under your hands: what the warning lights mean, how to set the car up before you move, and how to drive it without wasting fuel or wearing it out.",
  estimatedMinutes: 20,
  isZusatzstoff: true,
  lessons: [
    {
      slug: "de-m14-l1-setup",
      title: "Setting up before you drive",
      body: "The order matters, and it is quick: **seat, backrest, head restraint, mirrors, belt**.\n\nSeat close enough that the clutch can be fully pressed with a slightly bent knee; backrest upright enough that your wrist rests on the wheel top with shoulders against the seat; head restraint level with the top of your head to prevent whiplash; mirrors set so your own car is just visible at the inner edge; belt flat across hip and collarbone, never under the arm.",
      keyPoints: [
        "Seat, backrest, head restraint, mirrors, belt — in that order",
        "Head restraint level with the top of the head, not the neck",
        "The belt goes across the hip bones, never under the arm",
      ],
    },
    {
      slug: "de-m14-l2-warning-lights",
      title: "Warning lights",
      body: "Colour tells you how urgent it is. **Red** means stop as soon as safely possible: oil pressure, brake system, engine temperature, battery charge. **Yellow** means a fault needing attention soon: engine management, ABS, ESP, tyre pressure.\n\nRed oil pressure or coolant temperature means stopping the engine quickly — continuing destroys it. A yellow ABS light means the brakes still work but without ABS, so leave more distance.",
      keyPoints: [
        "Red: stop as soon as safely possible",
        "Yellow: a fault to address soon, keep driving carefully",
        "Red oil or temperature light: stop the engine quickly",
      ],
    },
    {
      slug: "de-m14-l3-controls",
      title: "Using the controls",
      body: "Clutch, gears and brakes reward smoothness. Pull away with light throttle and a progressive clutch; change up early; brake early and gently rather than late and hard.\n\nOn a long descent use **engine braking** in a lower gear instead of riding the brake pedal, which overheats the brakes and can cause fade. The handbrake secures a parked car; the footbrake stops it.",
      keyPoints: [
        "Change up early; brake early and gently",
        "Long descents: engine braking in a low gear, not constant brake",
        "Overheated brakes fade and stop working properly",
      ],
      signIds: ["de-danger-steep-descent"],
    },
    {
      slug: "de-m14-l4-assistance",
      title: "Assistance in practice",
      body: "ABS lets you steer while braking hard — press the pedal firmly and hold it; the pulsing is normal and you should not release it. ESP intervenes in a skid by braking individual wheels.\n\nAdaptive cruise control holds a distance but may not react to a stationary obstacle. Lane assist nudges the wheel but fails on worn markings. Parking sensors do not see small children. Use them, but verify with your own eyes.",
      keyPoints: [
        "In an ABS stop press hard and hold — the pulsing is normal",
        "Adaptive cruise may miss a stationary obstacle",
        "Sensors and cameras miss small children — look yourself",
      ],
    },
    {
      slug: "de-m14-l5-environment",
      title: "Driving with less impact",
      body: "Fuel use, emissions and noise all come from the same habits. Smooth beats fast: look far ahead, let the car roll, change up early, and keep speed down — consumption rises steeply above about 100 km/h.\n\nCold starts pollute most, so short trips are disproportionately bad. Remove roof boxes when not needed, keep tyres correctly inflated, and switch off at longer stops. Idling to warm the engine is both pointless and an offence.",
      keyPoints: [
        "Consumption rises steeply above about 100 km/h",
        "Short cold trips pollute disproportionately",
        "Idling to warm the engine is pointless and prohibited",
      ],
    },
    {
      slug: "de-m14-l6-breakdown-care",
      title: "Looking after the car",
      body: "Check regularly: oil level on flat ground with a cold engine, coolant between the marks, washer fluid topped with antifreeze in winter, tyre pressures monthly, and all lights with someone watching.\n\nUnfamiliar noises, a pulling steering wheel, a spongy brake pedal or a new vibration all mean a garage visit before the next long trip. Keep the service book current — it is also what the car is worth when you sell it.",
      keyPoints: [
        "Oil on level ground with a cold engine",
        "A spongy brake pedal or pulling steering means the garage, now",
        "Washer fluid needs antifreeze before winter",
      ],
    },
  ],
  questions: [
    {
      questionText:
        "What is the correct order when setting up the driving position?",
      explanation:
        "Seat, backrest, head restraint, mirrors, belt. Mirrors come after the seat, because moving the seat changes what they show.",
      errorPoints: 3,
      options: [
        {
          text: "Seat, backrest, head restraint, mirrors, belt",
          isCorrect: true,
        },
        { text: "Mirrors, seat, belt", isCorrect: false },
        { text: "Belt, seat, mirrors", isCorrect: false },
        { text: "The order makes no difference", isCorrect: false },
      ],
    },
    {
      questionText: "Where should the head restraint sit?",
      explanation:
        "Level with the top of your head. Set too low it acts as a pivot and makes whiplash worse.",
      errorPoints: 4,
      options: [
        { text: "Level with the top of your head", isCorrect: true },
        { text: "Level with your neck", isCorrect: false },
        { text: "As low as possible for visibility", isCorrect: false },
        { text: "It does not matter", isCorrect: false },
      ],
    },
    {
      questionText:
        "A red oil-pressure light comes on while driving. What do you do?",
      explanation:
        "Stop as soon as safely possible and switch off. Driving on without oil pressure destroys the engine within minutes.",
      errorPoints: 5,
      options: [
        {
          text: "Stop as soon as it is safe and switch the engine off",
          isCorrect: true,
        },
        { text: "Continue to the next garage", isCorrect: false },
        {
          text: "Top up the oil at the next opportunity and carry on",
          isCorrect: false,
        },
        { text: "Ignore it if the engine sounds normal", isCorrect: false },
      ],
    },
    {
      questionText: "What does a yellow warning light generally mean?",
      explanation:
        "A fault that needs attention soon. You may usually continue carefully; red means stop as soon as safely possible.",
      errorPoints: 3,
      options: [
        {
          text: "A fault to address soon — continue carefully",
          isCorrect: true,
        },
        { text: "Stop immediately in all cases", isCorrect: false },
        { text: "A routine service reminder only", isCorrect: false },
        { text: "The same urgency as a red light", isCorrect: false },
      ],
    },
    {
      questionText: "How should you brake in an emergency in a car with ABS?",
      explanation:
        "Press hard and hold. The pedal pulses — that is the system working, and releasing the pedal interrupts it.",
      errorPoints: 5,
      options: [
        { text: "Press hard and hold, despite the pulsing", isCorrect: true },
        { text: "Pump the pedal repeatedly", isCorrect: false },
        { text: "Press gently to avoid locking", isCorrect: false },
        { text: "Use the handbrake instead", isCorrect: false },
      ],
    },
    {
      questionText: "You are descending a long hill. How do you control speed?",
      explanation:
        "Engine braking in a lower gear. Riding the footbrake overheats it and causes brake fade.",
      errorPoints: 4,
      options: [
        { text: "Select a lower gear and use engine braking", isCorrect: true },
        { text: "Hold the brake pedal down continuously", isCorrect: false },
        { text: "Coast in neutral", isCorrect: false },
        { text: "Use the handbrake gently", isCorrect: false },
      ],
    },
    {
      questionText: "Why is coasting in neutral downhill dangerous?",
      explanation:
        "You lose engine braking and some control, and must rely entirely on the brakes, which then overheat.",
      errorPoints: 4,
      options: [
        { text: "You lose engine braking and control", isCorrect: true },
        { text: "It uses more fuel", isCorrect: false },
        { text: "It damages the gearbox", isCorrect: false },
        { text: "It is not dangerous", isCorrect: false },
      ],
    },
    {
      questionText: "Where does consumption rise most steeply?",
      explanation:
        "Above about 100 km/h, because air resistance grows with the square of speed.",
      errorPoints: 2,
      options: [
        { text: "Above about 100 km/h", isCorrect: true },
        { text: "Below 30 km/h", isCorrect: false },
        { text: "It is constant at all speeds", isCorrect: false },
        { text: "Only when accelerating", isCorrect: false },
      ],
    },
    {
      questionText: "May you let the engine idle to warm it up before driving?",
      explanation:
        "No. It is pointless on a modern engine, wastes fuel and is an offence because of noise and emissions. Drive off gently instead.",
      errorPoints: 3,
      options: [
        { text: "No — drive off gently instead", isCorrect: true },
        { text: "Yes, for five minutes in winter", isCorrect: false },
        { text: "Yes, whenever it is below freezing", isCorrect: false },
        { text: "Yes, it protects the engine", isCorrect: false },
      ],
    },
    {
      questionText: "How should the seat belt lie?",
      explanation:
        "Flat across the hip bones and the collarbone, with no twist, and never routed under the arm.",
      errorPoints: 4,
      options: [
        {
          text: "Flat across hips and collarbone, never under the arm",
          isCorrect: true,
        },
        { text: "Under the arm for comfort", isCorrect: false },
        { text: "Loose across the stomach", isCorrect: false },
        { text: "Anywhere, as long as it clicks", isCorrect: false },
      ],
    },
    {
      questionText: "When should engine oil be checked?",
      explanation:
        "On level ground with a cold engine, or several minutes after switching off, so the oil has drained back to the sump.",
      errorPoints: 2,
      options: [
        { text: "On level ground with a cold engine", isCorrect: true },
        { text: "Immediately after a long drive", isCorrect: false },
        { text: "On a slope so it pools", isCorrect: false },
        { text: "Only at the service", isCorrect: false },
      ],
    },
    {
      questionText:
        "Adaptive cruise control is active and traffic ahead has stopped completely. What should you expect?",
      explanation:
        "Some systems do not reliably detect a stationary obstacle. Stay ready to brake yourself at all times.",
      errorPoints: 5,
      options: [
        {
          text: "It may not detect a stationary vehicle — be ready to brake",
          isCorrect: true,
        },
        { text: "It will always stop the car safely", isCorrect: false },
        { text: "It switches off automatically in traffic", isCorrect: false },
        { text: "It takes over steering as well", isCorrect: false },
      ],
    },
  ],
};
