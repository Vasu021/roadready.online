import type { SeedScenario } from "./types";

// Driving-situation questions for Germany. Each scenario is one illustrated
// situation with a single MCQ testing practical judgement rather than recall.
export const GERMANY_SCENARIOS: SeedScenario[] = [
  {
    slug: "de-sc-yield-t-junction",
    name: "Yield at a T-junction",
    description: "The road ahead ends and a give-way sign faces you.",
    order: 1,
    imagePrompt:
      "Driver's perspective approaching a T-junction in a German town. The road ahead ends at a wall of hedges. An inverted red-and-white triangle give-way sign stands on the right verge. A silver estate car is crossing from left to right along the priority road.",
    questionText: "What must you do at this junction?",
    explanation:
      "The give-way sign (Vorfahrt gewähren) means you must let all traffic on the priority road pass before you move off. You need not stop if the road is clear, but you must never force crossing traffic to brake.",
    options: [
      {
        text: "Yield to the crossing car, then pull out when clear",
        isCorrect: true,
      },
      {
        text: "You have priority — proceed into the junction",
        isCorrect: false,
      },
      {
        text: "Stop completely behind the line in every case",
        isCorrect: false,
      },
      { text: "Flash your headlights and pull out", isCorrect: false },
    ],
  },
  {
    slug: "de-sc-rechts-vor-links",
    name: "Unmarked crossroads",
    description: "A residential crossroads with no signs and no markings.",
    order: 2,
    imagePrompt:
      "Driver's perspective at a quiet residential crossroads in Aachen. No traffic signs and no road markings are visible on any approach. A red hatchback is approaching from the right-hand side road at a similar speed to yours.",
    questionText: "Who has the right of way here?",
    explanation:
      "With no signs, lights or markings, 'rechts vor links' applies: the vehicle from the right goes first. The red hatchback on your right has priority, so slow down and let it through.",
    options: [
      { text: "The red hatchback coming from the right", isCorrect: true },
      { text: "You, because you are going straight ahead", isCorrect: false },
      {
        text: "Whoever reaches the middle of the junction first",
        isCorrect: false,
      },
      { text: "You, because the side road is narrower", isCorrect: false },
    ],
  },
  {
    slug: "de-sc-roundabout-entry",
    name: "Entering a roundabout",
    description: "A roundabout sign with a give-way sign beneath it.",
    order: 3,
    imagePrompt:
      "Driver's perspective approaching a single-lane roundabout. The blue circular sign with three white arrows sits above an inverted give-way triangle. A dark blue van is already circulating, approaching your entry point from the left.",
    questionText: "How do you enter this roundabout correctly?",
    explanation:
      "Traffic already circulating has priority. You do not signal when entering a roundabout, but you must signal right shortly before the exit you intend to take.",
    options: [
      {
        text: "Give way to the van, enter without signalling, signal right before your exit",
        isCorrect: true,
      },
      { text: "Signal left on entry and right on exit", isCorrect: false },
      { text: "Enter first — the van must give way to you", isCorrect: false },
      {
        text: "Stop completely at the give-way line, then enter",
        isCorrect: false,
      },
    ],
  },
  {
    slug: "de-sc-zebra-pedestrian",
    name: "Pedestrian at a zebra crossing",
    description: "Someone is waiting at the kerb of a marked crossing.",
    order: 4,
    imagePrompt:
      "Driver's perspective on a 50 km/h city street. A zebra crossing with broad white stripes spans the road about 30 metres ahead. An elderly woman with a shopping bag stands at the kerb, clearly facing the crossing and about to step on.",
    questionText: "What is the correct action?",
    explanation:
      "At a Fußgängerüberweg you must give priority to pedestrians who clearly intend to cross. Slow down early, stop if needed, and do not overtake another vehicle at the crossing.",
    options: [
      { text: "Slow down and stop to let her cross", isCorrect: true },
      {
        text: "Continue — she has not stepped onto the road yet",
        isCorrect: false,
      },
      { text: "Sound the horn so she waits for you", isCorrect: false },
      { text: "Swerve around the crossing and continue", isCorrect: false },
    ],
  },
  {
    slug: "de-sc-autobahn-recommended-speed",
    name: "Autobahn with no speed limit",
    description: "An unrestricted motorway section in good conditions.",
    order: 5,
    imagePrompt:
      "Driver's perspective on a three-lane German Autobahn in dry daylight. A round white sign with grey diagonal stripes marks the end of all restrictions. The speedometer shows 150 km/h and the lanes ahead are clear.",
    questionText: "What does German law say about your speed here?",
    explanation:
      "Where no limit is signed there is no maximum speed, but the Richtgeschwindigkeit of 130 km/h is recommended. Above it you can be held partly liable for damages in an accident even if you broke no limit.",
    options: [
      {
        text: "It is legal, but above the 130 km/h recommendation you may share liability in a crash",
        isCorrect: true,
      },
      { text: "It is an offence — 130 km/h is a hard limit", isCorrect: false },
      {
        text: "150 km/h is the legal maximum on all Autobahnen",
        isCorrect: false,
      },
      {
        text: "There is no limit and no consequence of any kind",
        isCorrect: false,
      },
    ],
  },
  {
    slug: "de-sc-tram-crossing",
    name: "Tram approaching a junction",
    description: "A tram comes from the left at an unregulated crossing.",
    order: 6,
    imagePrompt:
      "Driver's perspective at a city intersection with tram rails embedded in the asphalt. No priority signs are visible. A yellow tram is approaching from the left on its own track, about 40 metres away.",
    questionText: "Who goes first?",
    explanation:
      "Rail vehicles running on their own track have priority over road traffic at crossings, so right-before-left does not apply in your favour. Let the tram pass.",
    options: [
      {
        text: "The tram — rail vehicles have priority on their track",
        isCorrect: true,
      },
      { text: "You, because the tram comes from the left", isCorrect: false },
      { text: "The tram must stop for road traffic", isCorrect: false },
      { text: "Whoever is closer to the crossing", isCorrect: false },
    ],
  },
  {
    slug: "de-sc-bus-hazard-lights",
    name: "Bus at a stop with hazard lights",
    description: "A city bus stands at a stop, hazard lights flashing.",
    order: 7,
    imagePrompt:
      "Driver's perspective behind a city bus halted at a bus stop on a 50 km/h street. Its hazard warning lights are flashing and several passengers are stepping down onto the pavement.",
    questionText: "How may you pass the bus?",
    explanation:
      "Hazard lights at a stop mean passengers are boarding or alighting. You may only pass at walking pace, keeping enough clearance, and you must stop if anyone crosses in front of the bus.",
    options: [
      {
        text: "Only at walking pace, and stop if passengers cross the road",
        isCorrect: true,
      },
      { text: "At the normal 50 km/h limit", isCorrect: false },
      { text: "At up to 30 km/h without stopping", isCorrect: false },
      { text: "You may not pass until the bus drives away", isCorrect: false },
    ],
  },
  {
    slug: "de-sc-emergency-vehicle-behind",
    name: "Ambulance approaching from behind",
    description: "Blue lights and siren in your mirror, traffic all around.",
    order: 8,
    imagePrompt:
      "Driver's interior view with the rear-view mirror filled by an ambulance showing blue flashing lights, siren audible. You are in the left of two lanes in moderate city traffic, approaching a red light.",
    questionText: "What must you do?",
    explanation:
      "Blue light plus siren demands immediate free passage. Pull to the side and make room — if necessary you may even move carefully into the junction — but you must not endanger anyone to do it.",
    options: [
      {
        text: "Move aside and clear a path as soon as it is safe, even if you must edge forward",
        isCorrect: true,
      },
      { text: "Brake hard and stop exactly where you are", isCorrect: false },
      {
        text: "Keep your position — the ambulance will find a way around",
        isCorrect: false,
      },
      {
        text: "Run the red light immediately to clear the lane",
        isCorrect: false,
      },
    ],
  },
  {
    slug: "de-sc-rettungsgasse",
    name: "Traffic jam on the Autobahn",
    description: "Two lanes at a standstill and sirens in the distance.",
    order: 9,
    imagePrompt:
      "Driver's perspective in a complete standstill on a two-lane German Autobahn. Cars are stationary in both lanes and the hard shoulder is clear. Blue lights flicker far behind in the mirror.",
    questionText: "What must you do with the lanes here?",
    explanation:
      "On a two-lane carriageway the left lane moves as far left as possible and the right lane as far right as possible, forming a Rettungsgasse. It must be formed as soon as traffic slows — not when sirens arrive.",
    options: [
      {
        text: "Form an emergency corridor now: left lane to the far left, right lane to the far right",
        isCorrect: true,
      },
      { text: "Everyone pulls onto the hard shoulder", isCorrect: false },
      {
        text: "Wait until the emergency vehicle is visible, then move",
        isCorrect: false,
      },
      {
        text: "Stay centred in your lane and let them use the shoulder",
        isCorrect: false,
      },
    ],
  },
  {
    slug: "de-sc-priority-road-bend",
    name: "Priority road that bends",
    description: "The yellow diamond road turns left at the junction.",
    order: 10,
    imagePrompt:
      "Driver's perspective at a four-way junction with a yellow diamond priority sign and a supplementary plate showing the priority road bending to the left. A car waits at the side road to your right.",
    questionText:
      "You want to follow the priority road to the left. What applies?",
    explanation:
      "Priority follows the course of the priority road, so you keep it through the bend. You must still signal left, because you are changing direction and others need to read your intention.",
    options: [
      { text: "You keep priority, but must signal left", isCorrect: true },
      { text: "You lose priority because you are turning", isCorrect: false },
      { text: "You keep priority and need not signal", isCorrect: false },
      {
        text: "Right-before-left applies to the waiting car",
        isCorrect: false,
      },
    ],
  },
  {
    slug: "de-sc-stop-sign-empty",
    name: "STOP sign on an empty road",
    description: "An octagonal STOP sign, no other traffic in sight.",
    order: 11,
    imagePrompt:
      "Driver's perspective at a red octagonal STOP sign beside a white stop line painted across the lane. The crossing road is completely empty in both directions, early morning light, no other vehicles.",
    questionText: "What are you required to do?",
    explanation:
      "A STOP sign always requires a complete standstill at the stop line, whatever the traffic. Rolling through — the so-called 'California stop' — is an offence that costs a fine and penalty points.",
    options: [
      {
        text: "Come to a complete standstill at the line, then proceed",
        isCorrect: true,
      },
      { text: "Roll through slowly since the road is clear", isCorrect: false },
      {
        text: "Treat it as a give-way sign when no traffic is visible",
        isCorrect: false,
      },
      {
        text: "Stop only if you cannot see far enough along the road",
        isCorrect: false,
      },
    ],
  },
  {
    slug: "de-sc-cyclist-overtake",
    name: "Overtaking a cyclist in town",
    description: "A narrow street, a cyclist ahead, oncoming traffic.",
    order: 12,
    imagePrompt:
      "Driver's perspective on a narrow 50 km/h city street. A cyclist in a yellow jacket rides ahead on the right. A delivery van is approaching in the opposite direction, leaving little room to pass.",
    questionText: "May you overtake the cyclist now?",
    explanation:
      "Inside built-up areas you must leave at least 1.5 m when overtaking a cyclist (2 m outside). If the oncoming van makes that impossible, you must stay behind and wait.",
    options: [
      {
        text: "No — wait until you can leave at least 1.5 m of clearance",
        isCorrect: true,
      },
      { text: "Yes, if you pass slowly and closely", isCorrect: false },
      {
        text: "Yes, cyclists must move onto the pavement for you",
        isCorrect: false,
      },
      { text: "Yes, as long as you sound the horn first", isCorrect: false },
    ],
  },
  {
    slug: "de-sc-green-arrow-red-light",
    name: "Green arrow plate at a red light",
    description: "A red light with a small green arrow plate beside it.",
    order: 13,
    imagePrompt:
      "Driver's perspective at a red traffic light at a city junction. A small square green arrow plate pointing right is fixed to the right of the light head. Pedestrians have a green signal and are crossing the road to the right.",
    questionText: "What may you do?",
    explanation:
      "The Grünpfeil permits a right turn on red, but only after a complete stop and only if you endanger nobody. The crossing pedestrians have priority, so you must wait for them first.",
    options: [
      {
        text: "Stop completely, then turn right only once the pedestrians have crossed",
        isCorrect: true,
      },
      { text: "Turn right immediately without stopping", isCorrect: false },
      {
        text: "Go straight ahead because the arrow cancels the red",
        isCorrect: false,
      },
      {
        text: "Wait for a green light — the plate changes nothing",
        isCorrect: false,
      },
    ],
  },
  {
    slug: "de-sc-school-children",
    name: "Children near a school",
    description: "The children danger sign and a group on the pavement.",
    order: 14,
    imagePrompt:
      "Driver's perspective on a residential street with the triangular 'children' danger sign on the right. A group of schoolchildren with backpacks is walking along the pavement, one standing at the kerb looking across the road.",
    questionText: "How should you drive here?",
    explanation:
      "The children sign warns of unpredictable behaviour. Reduce speed well below the limit if needed, cover the brake and watch each child — a child at the kerb may step out without looking.",
    options: [
      {
        text: "Reduce speed, cover the brake and be ready for a child stepping out",
        isCorrect: true,
      },
      {
        text: "Keep to the 50 km/h limit — it is legally sufficient",
        isCorrect: false,
      },
      { text: "Sound the horn continuously to warn them", isCorrect: false },
      {
        text: "Nothing special — children must wait on the pavement",
        isCorrect: false,
      },
    ],
  },
  {
    slug: "de-sc-narrow-road-priority",
    name: "Narrow passage with priority signs",
    description: "A parked-up street where only one car fits through.",
    order: 15,
    imagePrompt:
      "Driver's perspective at a narrow passage between parked cars and a building site barrier. A square sign shows a broad black upward arrow and a narrow red downward arrow. An oncoming car waits on the far side of the gap.",
    questionText: "What does the sign tell you to do?",
    explanation:
      "The broad black arrow in your direction with the narrow red arrow against it means you have priority through the narrow section. Drive through, but stay ready to react if the oncoming driver misreads it.",
    options: [
      { text: "You have priority — proceed through the gap", isCorrect: true },
      { text: "You must wait for the oncoming car", isCorrect: false },
      {
        text: "Both of you must stop and negotiate by hand signals",
        isCorrect: false,
      },
      { text: "The gap is closed to all traffic", isCorrect: false },
    ],
  },
  {
    slug: "de-sc-parking-corner",
    name: "Parking near a junction",
    description: "The last free space is right on a junction corner.",
    order: 16,
    imagePrompt:
      "Driver's perspective looking for parking on a city street. The only gap is about three metres from a junction corner, between a parked van and the start of the kerb's curve into the side road.",
    questionText: "May you park in this gap?",
    explanation:
      "Parking is prohibited within 5 m of an intersection or junction, measured from the start of the kerb curve. A gap of three metres is illegal and obstructs the view for crossing traffic.",
    options: [
      {
        text: "No — you must keep at least 5 m clear of the junction",
        isCorrect: true,
      },
      { text: "Yes, if you leave the hazard lights on", isCorrect: false },
      { text: "Yes, 3 m is the legal minimum", isCorrect: false },
      { text: "Yes, but only for up to three minutes", isCorrect: false },
    ],
  },
  {
    slug: "de-sc-fog-visibility",
    name: "Dense fog on a country road",
    description: "Visibility collapses to roughly 40 metres.",
    order: 17,
    imagePrompt:
      "Driver's perspective on a country road swallowed by dense grey fog. Only the nearest roadside reflector posts are visible, perhaps forty metres ahead. Faint red tail lights glow somewhere in front.",
    questionText: "What speed and lights are correct?",
    explanation:
      "When visibility falls below 50 m the maximum speed is 50 km/h everywhere, and you must use dipped headlights — plus rear fog lights only if visibility is genuinely under 50 m. Full beam would reflect back and blind you.",
    options: [
      {
        text: "No more than 50 km/h with dipped headlights on",
        isCorrect: true,
      },
      { text: "100 km/h with full beam headlights", isCorrect: false },
      { text: "80 km/h with sidelights only", isCorrect: false },
      { text: "Any speed, as long as fog lights are on", isCorrect: false },
    ],
  },
  {
    slug: "de-sc-turning-left-oncoming",
    name: "Turning left across oncoming traffic",
    description: "You wait to turn left as an oncoming car signals right.",
    order: 18,
    imagePrompt:
      "Driver's perspective waiting in the middle of a junction to turn left, indicator clicking. An oncoming silver car has its right indicator on and is slowing to take the same side road from the other direction.",
    questionText: "Who goes first?",
    explanation:
      "A left-turning driver must give way to all oncoming traffic, including vehicles turning right. The oncoming car crosses no opposing stream, so it completes its turn first.",
    options: [
      { text: "The oncoming car turning right goes first", isCorrect: true },
      {
        text: "You go first because you were waiting longer",
        isCorrect: false,
      },
      { text: "Right-before-left decides who goes", isCorrect: false },
      {
        text: "Both may turn at the same time without yielding",
        isCorrect: false,
      },
    ],
  },
];
