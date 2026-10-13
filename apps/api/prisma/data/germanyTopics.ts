import type { SeedTopic } from "./types";

// Topic-wise practice tests for Germany.
// Every answer and explanation follows the German StVO (Straßenverkehrs-Ordnung).
export const GERMANY_TOPICS: SeedTopic[] = [
  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "de-danger-signs",
    name: "Gefahrzeichen",
    nameEN: "Danger Signs",
    description:
      "Red triangles that warn you about a hazard ahead. Learn to recognise each one and react in time.",
    order: 1,
    isSignTopic: true,
    questions: [
      {
        questionText:
          "What is the general shape and colour of a German danger sign (Gefahrzeichen)?",
        explanation:
          "Danger signs are upward-pointing triangles with a red border, a white field and a black symbol. They warn of a hazard — they never give an order.",
        options: [
          {
            text: "An upward-pointing triangle with a red border and black symbol",
            isCorrect: true,
          },
          { text: "A round sign with a blue field", isCorrect: false },
          { text: "A yellow diamond", isCorrect: false },
          {
            text: "A downward-pointing triangle with a red border",
            isCorrect: false,
          },
        ],
      },
      {
        questionText:
          "Outside built-up areas, how far in advance is a danger sign normally placed before the hazard?",
        explanation:
          "Outside built-up areas danger signs stand roughly 150–250 m before the hazard. Inside built-up areas they are placed shortly before it, so you have much less warning.",
        options: [
          { text: "About 150 to 250 metres", isCorrect: true },
          { text: "About 10 to 20 metres", isCorrect: false },
          { text: "Exactly 1 kilometre", isCorrect: false },
          { text: "Directly at the hazard itself", isCorrect: false },
        ],
      },
      {
        questionText:
          "You see the danger sign showing two children running. How must you behave?",
        explanation:
          "The 'Kinder' sign warns of children near the road — typically by a school or playground. Reduce speed, cover the brake and expect sudden, unpredictable movements.",
        options: [
          {
            text: "Reduce speed and be ready to brake — children may step onto the road suddenly",
            isCorrect: true,
          },
          {
            text: "Keep your speed; children must give way to vehicles",
            isCorrect: false,
          },
          { text: "Sound the horn continuously", isCorrect: false },
          {
            text: "Nothing in particular — the sign only applies to school buses",
            isCorrect: false,
          },
        ],
      },
      {
        questionText:
          "A triangular sign shows a black cross (X) on a white field. What does it warn of?",
        explanation:
          "The cross symbol is the 'Kreuzung' sign: a crossroads ahead where right-before-left (rechts vor links) applies, because neither road is marked as the priority road.",
        options: [
          {
            text: "A crossroads ahead where right-before-left applies",
            isCorrect: true,
          },
          { text: "A railway crossing with barriers", isCorrect: false },
          { text: "A dead-end street", isCorrect: false },
          { text: "A level crossing for trams only", isCorrect: false },
        ],
      },
      {
        questionText:
          "What does a danger sign showing a fence-like gate symbol mean?",
        explanation:
          "A gate symbol means a railway level crossing WITH barriers (Bahnübergang mit Schranke). Approach slowly and be prepared to stop; never drive around closed or closing barriers.",
        options: [
          { text: "A railway crossing with barriers ahead", isCorrect: true },
          { text: "A toll station ahead", isCorrect: false },
          { text: "A ferry terminal ahead", isCorrect: false },
          { text: "A border crossing ahead", isCorrect: false },
        ],
      },
      {
        questionText:
          "A triangular sign shows a car with wavy lines under its wheels. What should you do?",
        explanation:
          "This is 'Schleuder- oder Rutschgefahr' — risk of skidding, often when wet or icy. Reduce speed well in advance and avoid sudden steering, braking or acceleration.",
        options: [
          {
            text: "Slow down and avoid abrupt steering or braking — the road may be slippery",
            isCorrect: true,
          },
          {
            text: "Accelerate to get past the section quickly",
            isCorrect: false,
          },
          { text: "Switch on your hazard warning lights", isCorrect: false },
          { text: "Stop and wait for a gritting vehicle", isCorrect: false },
        ],
      },
      {
        questionText:
          "A triangular sign shows two arrows pointing at each other with the road narrowing. What does it mean?",
        explanation:
          "'Fahrbahnverengung' warns that the carriageway narrows. Nobody automatically gets priority from the sign itself — adjust speed, watch oncoming traffic and be ready to give way.",
        options: [
          {
            text: "The road narrows ahead — adjust your speed and be ready to give way",
            isCorrect: true,
          },
          {
            text: "You always have priority through the narrow section",
            isCorrect: false,
          },
          { text: "Overtaking is compulsory here", isCorrect: false },
          { text: "The road ahead is closed", isCorrect: false },
        ],
      },
      {
        questionText:
          "You see a triangular danger sign showing a traffic light. What does it tell you?",
        explanation:
          "The 'Lichtzeichenanlage' sign warns of traffic lights ahead that are hard to see in time. Slow down and be ready to stop — the lights may already be red.",
        options: [
          {
            text: "Traffic lights ahead — be prepared to stop",
            isCorrect: true,
          },
          {
            text: "The traffic lights ahead are out of order",
            isCorrect: false,
          },
          {
            text: "You may ignore the lights outside rush hour",
            isCorrect: false,
          },
          { text: "A pedestrian-only crossing ahead", isCorrect: false },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "de-priority-signs",
    name: "Vorfahrtszeichen",
    nameEN: "Priority Signs",
    description:
      "Yield, stop, priority road and their counterparts — the signs that decide who goes first.",
    order: 2,
    isSignTopic: true,
    questions: [
      {
        questionText:
          "What must you do at a downward-pointing triangle with a red border (Vorfahrt gewähren)?",
        explanation:
          "'Vorfahrt gewähren' means give way. You do not have to stop if the road is clear, but you must let all traffic on the priority road pass without forcing them to brake or swerve.",
        options: [
          {
            text: "Give way to traffic on the priority road — stopping only if necessary",
            isCorrect: true,
          },
          {
            text: "Always stop completely, even if the road is empty",
            isCorrect: false,
          },
          {
            text: "You have priority over the crossing road",
            isCorrect: false,
          },
          { text: "Right-before-left applies", isCorrect: false },
        ],
      },
      {
        questionText:
          "What is the difference between the STOP sign and the give-way triangle?",
        explanation:
          "The octagonal STOP sign requires a complete standstill at the stop line (or where you can see) every time, even on an empty road. The give-way triangle only requires you to yield.",
        options: [
          {
            text: "STOP requires a complete standstill every time; give way only requires yielding",
            isCorrect: true,
          },
          {
            text: "They mean exactly the same thing in Germany",
            isCorrect: false,
          },
          {
            text: "STOP applies only to trucks, give way only to cars",
            isCorrect: false,
          },
          {
            text: "STOP applies only when other traffic is visible",
            isCorrect: false,
          },
        ],
      },
      {
        questionText:
          "What does the yellow diamond sign (Vorfahrtstraße) mean?",
        explanation:
          "The yellow diamond marks a priority road. You have priority at the following intersections — but you must still drive defensively and obey lights and other signs.",
        options: [
          {
            text: "You are on the priority road and have right of way at the next intersections",
            isCorrect: true,
          },
          {
            text: "You must give way at the next intersection",
            isCorrect: false,
          },
          { text: "Parking is permitted along this road", isCorrect: false },
          { text: "The road becomes a one-way street", isCorrect: false },
        ],
      },
      {
        questionText:
          "A yellow diamond with a broad black diagonal stripe through it means what?",
        explanation:
          "This is 'Ende der Vorfahrtstraße' — end of the priority road. From the next intersection you no longer have priority; right-before-left or new signs apply.",
        options: [
          {
            text: "The priority road ends — you no longer have automatic right of way",
            isCorrect: true,
          },
          { text: "The priority road continues for 100 m", isCorrect: false },
          { text: "A one-way street begins", isCorrect: false },
          { text: "All speed limits end", isCorrect: false },
        ],
      },
      {
        questionText:
          "You approach a STOP sign on a completely empty road at night. What must you do?",
        explanation:
          "A STOP sign always requires the vehicle to come to a complete standstill at the stop line, regardless of traffic or time of day. Rolling through is an offence.",
        options: [
          {
            text: "Come to a complete standstill at the stop line, then proceed if clear",
            isCorrect: true,
          },
          {
            text: "Slow down and roll through if nothing is coming",
            isCorrect: false,
          },
          { text: "Flash your headlights and continue", isCorrect: false },
          { text: "Treat it as a give-way sign at night", isCorrect: false },
        ],
      },
      {
        questionText:
          "A square white sign shows a narrow red arrow and a broad black arrow. What does it mean?",
        explanation:
          "A red arrow pointing against your direction and a broad black arrow with you means you have priority over oncoming traffic through the narrow section (Vorrang vor dem Gegenverkehr).",
        options: [
          {
            text: "You have priority over oncoming traffic in the narrow section",
            isCorrect: true,
          },
          {
            text: "You must wait for oncoming traffic to pass first",
            isCorrect: false,
          },
          { text: "The road ahead is one-way", isCorrect: false },
          { text: "Overtaking is permitted here", isCorrect: false },
        ],
      },
      {
        questionText:
          "A round blue sign shows a red arrow pointing up and a white arrow pointing down. What must you do?",
        explanation:
          "This is 'Vorrang des Gegenverkehrs' — oncoming traffic has priority. You must wait before the narrow section and let oncoming vehicles through.",
        options: [
          {
            text: "Wait before the narrowing and let oncoming traffic pass",
            isCorrect: true,
          },
          { text: "Drive on — you have priority", isCorrect: false },
          { text: "Overtake the vehicle in front quickly", isCorrect: false },
          {
            text: "Stop completely for at least three seconds",
            isCorrect: false,
          },
        ],
      },
      {
        questionText:
          "A triangular danger sign shows a thick vertical line crossed by a thin horizontal one. What does it mean?",
        explanation:
          "This 'Vorfahrt' sign announces that you have priority at the next intersection. The thick line is your road. You still may not force your way through recklessly.",
        options: [
          {
            text: "You have priority at the intersection ahead",
            isCorrect: true,
          },
          { text: "You must stop at the intersection ahead", isCorrect: false },
          { text: "A railway crossing follows", isCorrect: false },
          { text: "Right-before-left applies ahead", isCorrect: false },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "de-prohibition-signs",
    name: "Verbotszeichen",
    nameEN: "Prohibition Signs",
    description:
      "Round signs with a red border that forbid something: entry, overtaking, parking or exceeding a speed.",
    order: 3,
    isSignTopic: true,
    questions: [
      {
        questionText:
          "What does a round red sign with a single horizontal white bar mean?",
        explanation:
          "That is 'Einfahrt verboten' — no entry. Traffic from the other direction is allowed, so this usually marks the exit of a one-way street. Never drive past it.",
        options: [
          { text: "No entry for vehicles in this direction", isCorrect: true },
          { text: "No stopping on either side", isCorrect: false },
          {
            text: "Road closed to all traffic including pedestrians",
            isCorrect: false,
          },
          { text: "End of all restrictions", isCorrect: false },
        ],
      },
      {
        questionText:
          "A round white sign with a red border shows the number 30. What does it mean?",
        explanation:
          "It sets the maximum permitted speed at 30 km/h. It applies from the sign until it is cancelled, by an end-of-limit sign, another limit or a change of built-up area.",
        options: [
          { text: "Maximum permitted speed of 30 km/h", isCorrect: true },
          { text: "Recommended speed of 30 km/h", isCorrect: false },
          { text: "Minimum speed of 30 km/h", isCorrect: false },
          { text: "A 30-tonne weight limit", isCorrect: false },
        ],
      },
      {
        questionText:
          "A round sign shows a black car and a red car side by side. What is forbidden?",
        explanation:
          "'Überholverbot' — overtaking motor vehicles is prohibited. The red car marks the vehicle you may not pass. It applies until the corresponding end sign.",
        options: [
          { text: "Overtaking other motor vehicles", isCorrect: true },
          { text: "Driving with two cars abreast in a lane", isCorrect: false },
          { text: "Towing another vehicle", isCorrect: false },
          { text: "Carrying passengers in the front seat", isCorrect: false },
        ],
      },
      {
        questionText:
          "What is the difference between 'Halteverbot' (one diagonal stripe) and 'absolutes Halteverbot' (two crossed stripes)?",
        explanation:
          "One stripe forbids parking but allows a short stop to load or let passengers in and out. Two crossed stripes forbid stopping altogether, except where traffic forces you to.",
        options: [
          {
            text: "One stripe forbids parking but allows brief stops; two stripes forbid stopping entirely",
            isCorrect: true,
          },
          {
            text: "One stripe applies to cars, two stripes apply to trucks",
            isCorrect: false,
          },
          { text: "They mean the same thing", isCorrect: false },
          {
            text: "One stripe applies at night, two stripes during the day",
            isCorrect: false,
          },
        ],
      },
      {
        questionText:
          "A round white sign is crossed out by several grey diagonal stripes. What does it mean?",
        explanation:
          "'Ende aller Streckenverbote' cancels every previously signed restriction on that stretch — speed limits, overtaking bans and similar — at once.",
        options: [
          {
            text: "All previously signed restrictions on this stretch end",
            isCorrect: true,
          },
          { text: "The road ends ahead", isCorrect: false },
          { text: "A new speed limit of 50 km/h begins", isCorrect: false },
          { text: "Only the overtaking ban ends", isCorrect: false },
        ],
      },
      {
        questionText:
          "A round sign with a red border shows a black motorcycle and a black car. Who may not pass?",
        explanation:
          "This is 'Verbot für Kraftfahrzeuge' — no motor vehicles of any kind. Bicycles, pedestrians and horse-drawn vehicles are unaffected.",
        options: [
          {
            text: "All motor vehicles, but cyclists may still pass",
            isCorrect: true,
          },
          { text: "Only motorcycles", isCorrect: false },
          { text: "Everyone including pedestrians", isCorrect: false },
          { text: "Only vehicles over 3.5 tonnes", isCorrect: false },
        ],
      },
      {
        questionText:
          "A round sign with a red border shows a black lorry. What does it prohibit?",
        explanation:
          "It bans goods vehicles above the weight shown (3.5 t if no plate states otherwise), including any trailer. Cars and vans below that limit may pass.",
        options: [
          {
            text: "Goods vehicles over the stated weight may not pass",
            isCorrect: true,
          },
          { text: "All commercial traffic including taxis", isCorrect: false },
          {
            text: "Lorries may pass but only at walking pace",
            isCorrect: false,
          },
          {
            text: "Lorries may not park here but may drive through",
            isCorrect: false,
          },
        ],
      },
      {
        questionText:
          "You pass a speed-limit sign of 70 and later reach the town-entry sign (yellow 'Ortstafel'). Which limit now applies?",
        explanation:
          "The yellow town-entry sign starts the built-up area and with it the general 50 km/h limit, which replaces the earlier 70 limit automatically.",
        options: [
          { text: "50 km/h — the built-up area limit", isCorrect: true },
          {
            text: "70 km/h until an end-of-limit sign appears",
            isCorrect: false,
          },
          { text: "30 km/h in all German towns", isCorrect: false },
          {
            text: "100 km/h because the limit was cancelled",
            isCorrect: false,
          },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "de-mandatory-signs",
    name: "Gebotszeichen",
    nameEN: "Mandatory Signs",
    description:
      "Round blue signs with white symbols. They do not forbid — they order you to do something.",
    order: 4,
    isSignTopic: true,
    questions: [
      {
        questionText:
          "What do round blue signs with white arrows (Gebotszeichen) tell you?",
        explanation:
          "Blue round signs are prescriptive: they order the direction you must take or the path you must use. They are orders, not warnings or prohibitions.",
        options: [
          {
            text: "They prescribe the direction or lane you must follow",
            isCorrect: true,
          },
          { text: "They only recommend a direction", isCorrect: false },
          { text: "They mark the end of a restriction", isCorrect: false },
          { text: "They warn of a hazard ahead", isCorrect: false },
        ],
      },
      {
        questionText:
          "A round blue sign shows three white arrows in a circle. What must you do?",
        explanation:
          "The 'Kreisverkehr' sign marks a roundabout: you must drive around it to the right and you must give way to traffic already circulating.",
        options: [
          {
            text: "Enter the roundabout to the right and give way to traffic already in it",
            isCorrect: true,
          },
          {
            text: "You have priority when entering the roundabout",
            isCorrect: false,
          },
          { text: "Stop before entering, in all cases", isCorrect: false },
          { text: "Drive around the roundabout to the left", isCorrect: false },
        ],
      },
      {
        questionText:
          "A round blue sign shows a white bicycle. What does it mean for cyclists and for you as a driver?",
        explanation:
          "The blue bicycle sign marks a compulsory cycle path (Radweg): cyclists must use it, and motor vehicles may not drive or park on it.",
        options: [
          {
            text: "Cyclists must use this path, and cars may not drive or park on it",
            isCorrect: true,
          },
          { text: "Cyclists are forbidden from this path", isCorrect: false },
          {
            text: "Cars may use it when the road is congested",
            isCorrect: false,
          },
          {
            text: "It is a shared path for cars and bicycles",
            isCorrect: false,
          },
        ],
      },
      {
        questionText:
          "A round blue sign shows the number 30 in white. What does it require?",
        explanation:
          "A blue circle with a number is the minimum speed (Mindestgeschwindigkeit). You may not drive slower than 30 km/h unless road or traffic conditions force you to.",
        options: [
          { text: "You must not drive slower than 30 km/h", isCorrect: true },
          { text: "You must not drive faster than 30 km/h", isCorrect: false },
          { text: "30 km/h is only a recommendation", isCorrect: false },
          {
            text: "It marks a 30-zone for residential streets",
            isCorrect: false,
          },
        ],
      },
      {
        questionText:
          "A round blue sign shows a white arrow curving to the right, placed at an intersection. What must you do?",
        explanation:
          "A prescribed-direction sign ('Rechts abbiegen') allows only one manoeuvre: you must turn right. Going straight on or turning left is prohibited.",
        options: [
          { text: "You must turn right", isCorrect: true },
          { text: "You may turn right if convenient", isCorrect: false },
          { text: "Right turns are forbidden", isCorrect: false },
          { text: "You must give way to the right", isCorrect: false },
        ],
      },
      {
        questionText:
          "A round blue sign shows a white arrow pointing up and another pointing right. What does it allow?",
        explanation:
          "Combined prescribed directions mean you may go straight on OR turn right. Any other manoeuvre — a left turn or U-turn — is not allowed.",
        options: [
          {
            text: "Straight ahead or a right turn — nothing else",
            isCorrect: true,
          },
          { text: "Any direction you like", isCorrect: false },
          { text: "Only straight ahead", isCorrect: false },
          { text: "Straight ahead or a U-turn", isCorrect: false },
        ],
      },
      {
        questionText:
          "A round blue sign shows a white arrow pointing diagonally left past an obstacle. What does it mean?",
        explanation:
          "'Links vorbei' prescribes which side of an obstruction — an island, a works area — you must pass on. Follow the arrow exactly.",
        options: [
          {
            text: "You must pass the obstacle on its left side",
            isCorrect: true,
          },
          { text: "You must turn left at the next junction", isCorrect: false },
          { text: "Overtaking on the left is forbidden", isCorrect: false },
          { text: "A left-hand bend follows", isCorrect: false },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "de-information-signs",
    name: "Richtzeichen",
    nameEN: "Information Signs",
    description:
      "Mostly rectangular signs that give information: motorways, one-way streets, zones and services.",
    order: 5,
    isSignTopic: true,
    questions: [
      {
        questionText:
          "A blue rectangular sign shows a white symbol of a bridge over a dual carriageway. What does it mark?",
        explanation:
          "That symbol marks the start of the Autobahn. From here the motorway rules apply: no general speed limit, minimum vehicle capability of over 60 km/h, no pedestrians or cyclists.",
        options: [
          {
            text: "The start of the Autobahn and its special rules",
            isCorrect: true,
          },
          { text: "A bridge with a weight restriction", isCorrect: false },
          { text: "A tunnel entrance", isCorrect: false },
          { text: "A Bundesstraße (federal road)", isCorrect: false },
        ],
      },
      {
        questionText:
          "A blue square shows a white arrow pointing straight ahead. What does it mean?",
        explanation:
          "A blue square with a single white arrow is 'Einbahnstraße' — a one-way street. You may only drive in the direction of the arrow, and you may not reverse against it.",
        options: [
          {
            text: "A one-way street — traffic flows only in the arrow's direction",
            isCorrect: true,
          },
          { text: "You must drive straight on", isCorrect: false },
          { text: "A priority road begins", isCorrect: false },
          { text: "A dead end follows", isCorrect: false },
        ],
      },
      {
        questionText:
          "A blue sign shows a white road that ends in a T with a red bar. What does it tell you?",
        explanation:
          "That is 'Sackgasse' — a dead end. There is no through route, so you will have to turn around. Variants show when cyclists or pedestrians can still pass through.",
        options: [
          { text: "A dead-end road with no through route", isCorrect: true },
          { text: "A T-junction where you must stop", isCorrect: false },
          { text: "A road closed only to trucks", isCorrect: false },
          { text: "A pedestrian zone begins", isCorrect: false },
        ],
      },
      {
        questionText:
          "A blue sign shows a house, an adult and a child playing with a ball. Which rules apply in this zone?",
        explanation:
          "This marks a 'verkehrsberuhigter Bereich' (Spielstraße). Drive at walking pace, pedestrians — including playing children — may use the whole road, and parking is only allowed in marked spaces.",
        options: [
          {
            text: "Drive at walking pace; pedestrians and children may use the whole street",
            isCorrect: true,
          },
          { text: "The speed limit is 30 km/h", isCorrect: false },
          { text: "Children must walk on the pavement only", isCorrect: false },
          { text: "Cars are banned completely", isCorrect: false },
        ],
      },
      {
        questionText:
          "What does a yellow rectangular sign with a number such as 'B 264' indicate?",
        explanation:
          "Yellow route plates mark Bundesstraßen — federal highways. They identify the road number for navigation; the usual out-of-town rules and limits apply.",
        options: [
          {
            text: "The number of a federal road (Bundesstraße)",
            isCorrect: true,
          },
          {
            text: "The distance to the next town in kilometres",
            isCorrect: false,
          },
          { text: "A motorway exit number", isCorrect: false },
          { text: "The maximum permitted speed", isCorrect: false },
        ],
      },
      {
        questionText:
          "A blue sign shows a white 'P'. Where exactly may you park?",
        explanation:
          "The 'P' sign permits parking. Any supplementary plate below it — a time limit, a disc requirement, 'residents only' — is binding, so always read it before you leave the car.",
        options: [
          {
            text: "In the signed area, subject to any supplementary plate below the sign",
            isCorrect: true,
          },
          { text: "Anywhere within the next kilometre", isCorrect: false },
          { text: "Only for a maximum of three minutes", isCorrect: false },
          { text: "Only on Sundays and public holidays", isCorrect: false },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "de-right-of-way",
    name: "Vorfahrtsregeln",
    nameEN: "Right of Way Rules",
    description:
      "Rechts vor Links, priority roads, roundabouts, turning and tram traffic — the heart of the theory test.",
    order: 6,
    isSignTopic: false,
    questions: [
      {
        questionText:
          "At an intersection with no signs and no traffic lights, who has right of way?",
        explanation:
          "Where nothing regulates the junction, 'rechts vor links' applies: the vehicle coming from your right goes first. The rule is the default in Germany.",
        options: [
          { text: "The vehicle coming from the right", isCorrect: true },
          { text: "The vehicle coming from the left", isCorrect: false },
          { text: "Whoever arrives at the junction first", isCorrect: false },
          { text: "The larger vehicle", isCorrect: false },
        ],
      },
      {
        questionText:
          "You want to turn left. An oncoming car wants to turn right. Who goes first?",
        explanation:
          "A left-turning driver must let oncoming traffic pass, including vehicles turning right. The right-turning car crosses no opposing stream, so it goes first.",
        options: [
          {
            text: "The oncoming car turning right goes first",
            isCorrect: true,
          },
          {
            text: "You go first because you signalled earlier",
            isCorrect: false,
          },
          { text: "Right-before-left decides it", isCorrect: false },
          { text: "Whoever flashes their headlights first", isCorrect: false },
        ],
      },
      {
        questionText:
          "You are about to enter a roundabout marked with the roundabout sign and a give-way sign. What applies?",
        explanation:
          "With the give-way sign you must yield to traffic already circulating. You do not signal on entry, but you must signal right before leaving the roundabout.",
        options: [
          {
            text: "Give way to traffic already in the roundabout; signal only when exiting",
            isCorrect: true,
          },
          {
            text: "You have priority because you are entering from the right",
            isCorrect: false,
          },
          { text: "Signal left on entry and right on exit", isCorrect: false },
          {
            text: "Stop completely before entering, in all cases",
            isCorrect: false,
          },
        ],
      },
      {
        questionText:
          "You are driving on a priority road (yellow diamond) that bends to the left at a junction. What must you do?",
        explanation:
          "Priority follows the course of the priority road, not your steering. Keep your priority through the bend, but signal your change of direction so others can read your intention.",
        options: [
          {
            text: "Keep priority along the course of the priority road, and signal the change of direction",
            isCorrect: true,
          },
          { text: "Lose priority because you are turning", isCorrect: false },
          { text: "Give way to all traffic from the right", isCorrect: false },
          { text: "Stop and wait before following the bend", isCorrect: false },
        ],
      },
      {
        questionText:
          "You are leaving a property exit, a car park or a field track onto a public road. Who has priority?",
        explanation:
          "Traffic on the public road always has priority over a vehicle entering from a property exit, car park or unpaved track. You must also not endanger pedestrians on the pavement.",
        options: [
          { text: "Traffic already on the public road", isCorrect: true },
          { text: "You, because right-before-left applies", isCorrect: false },
          { text: "Whoever is faster", isCorrect: false },
          { text: "Priority alternates between vehicles", isCorrect: false },
        ],
      },
      {
        questionText:
          "A tram is approaching the intersection on rails from your left and no signs regulate priority. What applies?",
        explanation:
          "Rail vehicles on their own track have priority over road traffic at crossings, so right-before-left does not help you here — let the tram through.",
        options: [
          { text: "The tram has priority over road traffic", isCorrect: true },
          {
            text: "You have priority because the tram comes from the left",
            isCorrect: false,
          },
          { text: "The tram must always stop first", isCorrect: false },
          { text: "Trams have priority only at red lights", isCorrect: false },
        ],
      },
      {
        questionText:
          "A police officer is directing traffic at an intersection where the lights are also working. Which do you obey?",
        explanation:
          "Instructions from a police officer override traffic lights, which in turn override signs, which override the general rules. The officer's signal always comes first.",
        options: [
          { text: "The police officer's instructions", isCorrect: true },
          { text: "The traffic lights", isCorrect: false },
          { text: "The priority signs at the junction", isCorrect: false },
          { text: "Right-before-left", isCorrect: false },
        ],
      },
      {
        questionText:
          "Two vehicles meet at an unmarked crossroads and both want to turn left. How do they pass each other?",
        explanation:
          "When two oncoming vehicles both turn left, they pass each other in front of one another (ahead of each other) unless road markings or the layout require otherwise.",
        options: [
          { text: "They pass in front of each other", isCorrect: true },
          { text: "They must pass behind each other", isCorrect: false },
          { text: "The left-hand vehicle always waits", isCorrect: false },
          { text: "Both must stop until one reverses", isCorrect: false },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "de-speed-limits",
    name: "Geschwindigkeit und Abstand",
    nameEN: "Speed Limits & Distances",
    description:
      "General limits inside and outside towns, trailer limits and how much space to keep.",
    order: 7,
    isSignTopic: false,
    questions: [
      {
        questionText:
          "What is the general speed limit for cars inside built-up areas in Germany?",
        explanation:
          "Inside built-up areas — from the yellow town sign to the crossed-out one — the limit is 50 km/h unless signs say otherwise.",
        options: [
          { text: "50 km/h", isCorrect: true },
          { text: "30 km/h", isCorrect: false },
          { text: "60 km/h", isCorrect: false },
          { text: "70 km/h", isCorrect: false },
        ],
      },
      {
        questionText:
          "What is the general speed limit for cars on country roads outside built-up areas?",
        explanation:
          "Outside built-up areas cars and motorcycles may drive up to 100 km/h unless a sign sets a lower limit. Cars with trailers are limited to 80 km/h.",
        options: [
          { text: "100 km/h", isCorrect: true },
          { text: "80 km/h", isCorrect: false },
          { text: "120 km/h", isCorrect: false },
          { text: "There is no limit", isCorrect: false },
        ],
      },
      {
        questionText:
          "What does the 'Richtgeschwindigkeit' of 130 km/h on the Autobahn mean?",
        explanation:
          "130 km/h is a recommended speed, not a limit. You may legally drive faster where no limit is signed, but in an accident above 130 km/h you can be held partly liable.",
        options: [
          {
            text: "A recommended speed — exceeding it can increase your liability in an accident",
            isCorrect: true,
          },
          { text: "A hard limit enforced by cameras", isCorrect: false },
          { text: "A minimum speed you must maintain", isCorrect: false },
          { text: "A limit that applies only to trucks", isCorrect: false },
        ],
      },
      {
        questionText:
          "Outside built-up areas, what is the rule of thumb for a safe following distance?",
        explanation:
          "The 'halber Tacho' rule: keep at least half your speedometer reading in metres — 100 km/h means at least 50 m. In poor visibility or wet roads, double it.",
        options: [
          {
            text: "At least half your speed in metres (100 km/h → 50 m)",
            isCorrect: true,
          },
          { text: "At least 10 metres at any speed", isCorrect: false },
          { text: "Two car lengths regardless of speed", isCorrect: false },
          { text: "The same number of metres as your speed", isCorrect: false },
        ],
      },
      {
        questionText:
          "You are towing a trailer with your car outside a built-up area. Which limit applies by default?",
        explanation:
          "Cars with a trailer are limited to 80 km/h outside built-up areas, including on the Autobahn — 100 km/h only with a special 'Tempo-100' authorisation for the combination.",
        options: [
          { text: "80 km/h", isCorrect: true },
          { text: "100 km/h", isCorrect: false },
          { text: "120 km/h", isCorrect: false },
          { text: "The same limit as without a trailer", isCorrect: false },
        ],
      },
      {
        questionText:
          "Visibility drops below 50 metres because of fog. What is the maximum speed you may drive?",
        explanation:
          "When visibility is under 50 m you may not exceed 50 km/h anywhere — including on the Autobahn — and you must use dipped headlights, plus fog lights if fitted.",
        options: [
          { text: "50 km/h", isCorrect: true },
          { text: "80 km/h", isCorrect: false },
          { text: "100 km/h", isCorrect: false },
          { text: "Whatever the signed limit allows", isCorrect: false },
        ],
      },
      {
        questionText:
          "What speed is meant by 'Schrittgeschwindigkeit' (walking pace)?",
        explanation:
          "Walking pace means roughly 4–7 km/h — the speed of a pedestrian. It applies in traffic-calmed zones and when passing a bus that has its hazard lights on at a stop.",
        options: [
          { text: "Roughly 4 to 7 km/h", isCorrect: true },
          { text: "Exactly 20 km/h", isCorrect: false },
          { text: "Up to 30 km/h", isCorrect: false },
          { text: "Any speed below the signed limit", isCorrect: false },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "de-traffic-lights",
    name: "Lichtzeichen und Signale",
    nameEN: "Traffic Lights & Signals",
    description:
      "Light phases, the green arrow, arrow signals and what to do when the lights fail.",
    order: 8,
    isSignTopic: false,
    questions: [
      {
        questionText:
          "The light turns yellow as you approach and you can still stop safely. What must you do?",
        explanation:
          "Yellow means 'wait for the next signal'. If you can stop safely you must stop. Only when braking would be dangerous — you are already too close — may you continue.",
        options: [
          { text: "Stop before the line", isCorrect: true },
          { text: "Accelerate to clear the junction", isCorrect: false },
          { text: "Continue at the same speed", isCorrect: false },
          { text: "Sound the horn and continue", isCorrect: false },
        ],
      },
      {
        questionText:
          "What does the red-and-yellow phase shown together mean in Germany?",
        explanation:
          "Red with yellow means the next phase is green: get ready to move off, but do not enter the intersection yet. Red still applies until green appears.",
        options: [
          { text: "Prepare to move off — but wait for green", isCorrect: true },
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
          "A small green arrow plate pointing right is fixed beside a red light. What may you do?",
        explanation:
          "The Grünpfeil lets you turn right on red — but only after a complete stop and only if you endanger nobody, especially pedestrians and cyclists with green.",
        options: [
          {
            text: "Turn right after stopping completely, giving way to pedestrians and cyclists",
            isCorrect: true,
          },
          { text: "Turn right without stopping", isCorrect: false },
          { text: "Go straight ahead on red", isCorrect: false },
          {
            text: "Nothing — the plate is only informational",
            isCorrect: false,
          },
        ],
      },
      {
        questionText:
          "The traffic lights at a junction are completely dark because of a power failure. What applies?",
        explanation:
          "When lights fail, the signs at the junction apply. If there are none, right-before-left applies. Approach carefully and make eye contact with other drivers.",
        options: [
          {
            text: "The priority signs apply; with no signs, right-before-left",
            isCorrect: true,
          },
          { text: "The junction is closed to all traffic", isCorrect: false },
          {
            text: "You always have priority if you are going straight",
            isCorrect: false,
          },
          {
            text: "Treat every approach as a STOP sign for 30 seconds",
            isCorrect: false,
          },
        ],
      },
      {
        questionText:
          "A flashing yellow light is shown at a pedestrian crossing. What does it mean?",
        explanation:
          "A flashing yellow light is a warning: proceed with caution and give way to pedestrians. It is not a green signal and gives you no priority.",
        options: [
          {
            text: "Proceed with caution and give way to pedestrians",
            isCorrect: true,
          },
          { text: "You have priority over pedestrians", isCorrect: false },
          { text: "Stop and wait for a green light", isCorrect: false },
          { text: "The crossing is closed", isCorrect: false },
        ],
      },
      {
        questionText:
          "You have a green light but the junction beyond is blocked by stationary traffic. What must you do?",
        explanation:
          "A green light does not oblige you to drive on. You may not enter a junction you cannot clear — blocking it would obstruct the crossing traffic when their light turns green.",
        options: [
          {
            text: "Wait before the junction until you can clear it",
            isCorrect: true,
          },
          {
            text: "Drive in — green always gives you the right",
            isCorrect: false,
          },
          { text: "Sound the horn until space appears", isCorrect: false },
          { text: "Reverse out of the lane", isCorrect: false },
        ],
      },
      {
        questionText:
          "A green arrow signal pointing left is lit in the light head. What does it tell you?",
        explanation:
          "A lit green arrow in the signal head gives you a protected turn: oncoming traffic is held at red, so you may turn without waiting for a gap.",
        options: [
          {
            text: "You may turn left — conflicting traffic is being held at red",
            isCorrect: true,
          },
          {
            text: "You may turn left but must give way to oncoming traffic",
            isCorrect: false,
          },
          {
            text: "You must turn left whether you want to or not",
            isCorrect: false,
          },
          {
            text: "The signal applies only to buses and taxis",
            isCorrect: false,
          },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "de-autobahn-rules",
    name: "Autobahnregeln",
    nameEN: "Motorway (Autobahn) Rules",
    description:
      "Who may use the Autobahn, lane discipline, joining and leaving, and what to do in a jam.",
    order: 9,
    isSignTopic: false,
    questions: [
      {
        questionText: "Which vehicles are allowed to use the Autobahn?",
        explanation:
          "Only motor vehicles whose design speed exceeds 60 km/h may use the Autobahn. Bicycles, mopeds, pedestrians and slow agricultural vehicles are prohibited.",
        options: [
          {
            text: "Only motor vehicles capable of more than 60 km/h",
            isCorrect: true,
          },
          { text: "Any vehicle including bicycles", isCorrect: false },
          {
            text: "Only cars and lorries, never motorcycles",
            isCorrect: false,
          },
          {
            text: "Any vehicle capable of more than 40 km/h",
            isCorrect: false,
          },
        ],
      },
      {
        questionText: "Is overtaking on the right permitted on the Autobahn?",
        explanation:
          "Overtaking on the right is forbidden. The only exceptions are columns of slow-moving or stationary traffic, where you may pass on the right at a slightly higher speed with great care.",
        options: [
          {
            text: "No — except past slow or stationary columns of traffic, and then only carefully",
            isCorrect: true,
          },
          { text: "Yes, whenever the right lane is clear", isCorrect: false },
          { text: "Yes, above 120 km/h", isCorrect: false },
          { text: "Yes, if the left lane is occupied", isCorrect: false },
        ],
      },
      {
        questionText:
          "How should you join the Autobahn from the acceleration lane?",
        explanation:
          "Use the full acceleration lane to match the speed of traffic, then merge into a gap. Traffic already on the motorway has priority — you must fit in, not force in.",
        options: [
          {
            text: "Accelerate to match the flow and merge into a gap — through traffic has priority",
            isCorrect: true,
          },
          {
            text: "Stop at the end of the slip road and wait for a long gap",
            isCorrect: false,
          },
          {
            text: "Merge immediately at whatever speed you have",
            isCorrect: false,
          },
          {
            text: "Force your way in — joining traffic has priority",
            isCorrect: false,
          },
        ],
      },
      {
        questionText:
          "Traffic has come to a standstill on a two-lane Autobahn. How do you form the Rettungsgasse (emergency corridor)?",
        explanation:
          "On a two-lane carriageway, vehicles in the left lane move as far left as possible and those in the right lane as far right as possible, leaving a free corridor between them.",
        options: [
          {
            text: "Left lane moves to the far left, right lane to the far right",
            isCorrect: true,
          },
          {
            text: "Everyone moves to the right onto the hard shoulder",
            isCorrect: false,
          },
          {
            text: "Everyone stops in the middle of their lane",
            isCorrect: false,
          },
          { text: "Only once you hear a siren", isCorrect: false },
        ],
      },
      {
        questionText: "When may you use the hard shoulder (Seitenstreifen)?",
        explanation:
          "The hard shoulder is only for breakdowns and emergencies — or when a sign or overhead gantry explicitly opens it as a running lane. It is never an overtaking or queue-jumping lane.",
        options: [
          {
            text: "Only in a breakdown or emergency, or when a sign opens it as a lane",
            isCorrect: true,
          },
          { text: "To overtake slow traffic", isCorrect: false },
          { text: "To take a phone call", isCorrect: false },
          { text: "Whenever the motorway is congested", isCorrect: false },
        ],
      },
      {
        questionText:
          "You have missed your exit on the Autobahn. What must you do?",
        explanation:
          "Reversing, turning round and driving against the flow are strictly forbidden on the Autobahn. Carry on to the next exit and turn around there.",
        options: [
          { text: "Continue to the next exit", isCorrect: true },
          { text: "Reverse carefully on the hard shoulder", isCorrect: false },
          { text: "Make a U-turn through the central gap", isCorrect: false },
          { text: "Stop and wait for a gap to turn around", isCorrect: false },
        ],
      },
      {
        questionText:
          "Your car breaks down on the Autobahn. What is the correct sequence of actions?",
        explanation:
          "Switch on the hazard lights, put on a high-visibility vest before leaving the car, place the warning triangle about 100 m behind the vehicle, and wait behind the crash barrier.",
        options: [
          {
            text: "Hazard lights, high-vis vest, warning triangle ~100 m back, wait behind the barrier",
            isCorrect: true,
          },
          {
            text: "Stand next to the car in the lane and wave at traffic",
            isCorrect: false,
          },
          {
            text: "Leave the car unlit and walk to the next exit",
            isCorrect: false,
          },
          {
            text: "Place the triangle 10 m behind the car and sit inside",
            isCorrect: false,
          },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "de-pedestrians-cyclists",
    name: "Fußgänger und Radfahrer",
    nameEN: "Pedestrians & Cyclists",
    description:
      "Zebra crossings, passing distances, buses at stops and the special care vulnerable road users require.",
    order: 10,
    isSignTopic: false,
    questions: [
      {
        questionText:
          "A pedestrian is clearly waiting at a zebra crossing (Zebrastreifen). What must you do?",
        explanation:
          "At a Fußgängerüberweg you must let pedestrians and wheelchair or scooter users who clearly want to cross go first — which means slowing down early and stopping if needed.",
        options: [
          { text: "Slow down and let them cross", isCorrect: true },
          { text: "Continue — vehicles have priority", isCorrect: false },
          { text: "Sound the horn to warn them", isCorrect: false },
          {
            text: "Stop only if they have already stepped onto the road",
            isCorrect: false,
          },
        ],
      },
      {
        questionText:
          "What lateral distance must you leave when overtaking a cyclist inside a built-up area?",
        explanation:
          "Since the 2020 StVO reform you must leave at least 1.5 m inside built-up areas and at least 2 m outside them. If you cannot, you must not overtake.",
        options: [
          { text: "At least 1.5 metres", isCorrect: true },
          { text: "At least 0.5 metres", isCorrect: false },
          { text: "At least 1 metre", isCorrect: false },
          { text: "No fixed distance is prescribed", isCorrect: false },
        ],
      },
      {
        questionText:
          "A bus is standing at a stop with its hazard warning lights on. How may you pass it?",
        explanation:
          "Hazard lights at a stop mean passengers are getting on or off. You may only pass at walking pace and with enough distance — and you must stop if anyone is crossing.",
        options: [
          {
            text: "Only at walking pace, stopping if passengers cross the road",
            isCorrect: true,
          },
          { text: "At the normal speed limit", isCorrect: false },
          { text: "You may not pass it at all", isCorrect: false },
          { text: "At up to 30 km/h", isCorrect: false },
        ],
      },
      {
        questionText:
          "You are turning right and a cyclist is going straight on in the cycle lane beside you. Who goes first?",
        explanation:
          "The cyclist going straight on has priority over your turn. You must let them pass, check your mirror and blind spot, and never cut across the cycle lane.",
        options: [
          { text: "The cyclist going straight on", isCorrect: true },
          { text: "You, because you signalled", isCorrect: false },
          { text: "Whoever reaches the corner first", isCorrect: false },
          { text: "You, because a car is wider", isCorrect: false },
        ],
      },
      {
        questionText:
          "Is overtaking permitted immediately before and on a pedestrian crossing?",
        explanation:
          "Overtaking is prohibited at and immediately before a Fußgängerüberweg — the overtaken vehicle would hide pedestrians from you and you from them.",
        options: [
          { text: "No, overtaking is prohibited there", isCorrect: true },
          { text: "Yes, if no pedestrian is visible", isCorrect: false },
          { text: "Yes, at up to 30 km/h", isCorrect: false },
          { text: "Yes, but only motorcycles", isCorrect: false },
        ],
      },
      {
        questionText:
          "Children aged under eight are riding bicycles. Where must they ride?",
        explanation:
          "Children under eight must use the pavement; up to their tenth birthday they may choose pavement or cycle path. An accompanying adult may ride on the pavement with a child under eight.",
        options: [
          { text: "On the pavement", isCorrect: true },
          { text: "On the road, like all cyclists", isCorrect: false },
          { text: "Only on marked cycle paths", isCorrect: false },
          { text: "They may not cycle in traffic at all", isCorrect: false },
        ],
      },
      {
        questionText:
          "You want to open your door after parking next to a cycle lane. What must you do?",
        explanation:
          "Anyone opening a door must ensure nobody is endangered — check mirrors and look over your shoulder for cyclists. A 'dooring' collision is the driver's fault.",
        options: [
          {
            text: "Check mirrors and look over your shoulder for cyclists before opening",
            isCorrect: true,
          },
          {
            text: "Open the door quickly so cyclists see it early",
            isCorrect: false,
          },
          {
            text: "Nothing — cyclists must keep clear of parked cars",
            isCorrect: false,
          },
          { text: "Sound the horn before opening", isCorrect: false },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "de-emergency-situations",
    name: "Notfälle und besondere Situationen",
    nameEN: "Emergency & Special Situations",
    description:
      "Emergency vehicles, accident scenes, first aid duties and what the law requires you to carry.",
    order: 11,
    isSignTopic: false,
    questions: [
      {
        questionText:
          "An emergency vehicle approaches with blue flashing lights AND siren. What must you do?",
        explanation:
          "Blue light together with the siren demands immediate free passage: pull over, make room, and if necessary enter the junction carefully or mount the kerb — without endangering anyone.",
        options: [
          {
            text: "Make way immediately — pull over and clear the path",
            isCorrect: true,
          },
          { text: "Keep driving at the same speed", isCorrect: false },
          {
            text: "Brake hard and stop exactly where you are",
            isCorrect: false,
          },
          { text: "Only react if it is a fire engine", isCorrect: false },
        ],
      },
      {
        questionText:
          "An emergency vehicle shows blue flashing lights but NO siren. What does that mean?",
        explanation:
          "Blue light alone warns of a hazard or a vehicle on the way to a scene; it does not demand right of way. Stay alert and let it through where you reasonably can.",
        options: [
          {
            text: "It is a warning only — it does not demand right of way",
            isCorrect: true,
          },
          { text: "You must stop immediately", isCorrect: false },
          {
            text: "It has the same force as blue light with siren",
            isCorrect: false,
          },
          { text: "You may follow it through red lights", isCorrect: false },
        ],
      },
      {
        questionText:
          "You are the first to arrive at an accident with injured people. What is the correct order of action?",
        explanation:
          "Secure the scene first (hazard lights, vest, warning triangle), then call 112, then give first aid. Securing the scene prevents a second collision while you help.",
        options: [
          {
            text: "Secure the scene, call 112, then give first aid",
            isCorrect: true,
          },
          {
            text: "Give first aid, then drive to the nearest hospital",
            isCorrect: false,
          },
          { text: "Take photos first for the insurance", isCorrect: false },
          {
            text: "Wait in your car until the police arrive",
            isCorrect: false,
          },
        ],
      },
      {
        questionText:
          "Which emergency number do you call for an ambulance in Germany?",
        explanation:
          "112 reaches the fire brigade and ambulance service across the whole EU and is free from any phone. 110 is the police number.",
        options: [
          { text: "112", isCorrect: true },
          { text: "110", isCorrect: false },
          { text: "911", isCorrect: false },
          { text: "999", isCorrect: false },
        ],
      },
      {
        questionText:
          "Which safety equipment must you carry in a car registered in Germany?",
        explanation:
          "A first-aid kit, a warning triangle and at least one high-visibility vest are compulsory. Missing equipment is a fineable offence at a roadside check.",
        options: [
          {
            text: "A first-aid kit, a warning triangle and a high-visibility vest",
            isCorrect: true,
          },
          { text: "Only a first-aid kit", isCorrect: false },
          { text: "A fire extinguisher and spare bulbs", isCorrect: false },
          { text: "Nothing is legally required", isCorrect: false },
        ],
      },
      {
        questionText:
          "You must stop because of a breakdown inside a built-up area. Where do you place the warning triangle?",
        explanation:
          "Inside built-up areas the triangle goes about 50 m behind the vehicle, outside them about 100 m, and on the Autobahn roughly 100 m — always beyond a bend or crest if there is one.",
        options: [
          { text: "About 50 metres behind the vehicle", isCorrect: true },
          { text: "Directly behind the bumper", isCorrect: false },
          { text: "About 200 metres behind the vehicle", isCorrect: false },
          { text: "On the roof of the vehicle", isCorrect: false },
        ],
      },
      {
        questionText:
          "You are involved in a minor collision with a parked car and the owner is nowhere to be found. What must you do?",
        explanation:
          "Leaving a note is not enough. You must wait a reasonable time and then report the damage to the police — driving off is 'Unfallflucht', a criminal offence.",
        options: [
          {
            text: "Wait a reasonable time, then report the damage to the police",
            isCorrect: true,
          },
          {
            text: "Leave a note with your number and drive away",
            isCorrect: false,
          },
          {
            text: "Drive away if the damage is only cosmetic",
            isCorrect: false,
          },
          {
            text: "Report it to your insurer within a month, nothing more",
            isCorrect: false,
          },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "de-parking-rules",
    name: "Parken und Halten",
    nameEN: "Parking & Stopping Rules",
    description:
      "The difference between stopping and parking, the forbidden places, and how to park legally.",
    order: 12,
    isSignTopic: false,
    questions: [
      {
        questionText:
          "In German traffic law, what is the difference between 'Halten' and 'Parken'?",
        explanation:
          "Any voluntary stop counts as parking if it lasts longer than three minutes or if you leave the vehicle. Shorter voluntary stops where you stay with the car are 'Halten'.",
        options: [
          {
            text: "You are parking if you leave the vehicle or stop for more than three minutes",
            isCorrect: true,
          },
          {
            text: "Parking means stopping for more than 15 minutes",
            isCorrect: false,
          },
          { text: "They are legally identical", isCorrect: false },
          { text: "Halten is only allowed in marked bays", isCorrect: false },
        ],
      },
      {
        questionText:
          "How close to an intersection or junction corner may you park?",
        explanation:
          "Parking is forbidden within 5 m of an intersection or junction — measured from the start of the curve — because it hides crossing traffic and blocks turning vehicles.",
        options: [
          { text: "No closer than 5 metres", isCorrect: true },
          { text: "No closer than 1 metre", isCorrect: false },
          { text: "No closer than 15 metres", isCorrect: false },
          { text: "Parking at corners is always allowed", isCorrect: false },
        ],
      },
      {
        questionText: "Where is stopping always prohibited?",
        explanation:
          "Stopping is prohibited on the Autobahn and on Kraftfahrstraßen (except in emergencies), on narrow or blind sections, at level crossings, and at taxi ranks.",
        options: [
          {
            text: "On the Autobahn, at level crossings and on narrow or blind sections",
            isCorrect: true,
          },
          { text: "In every residential street", isCorrect: false },
          { text: "Everywhere outside built-up areas", isCorrect: false },
          {
            text: "Only in front of fire-brigade access routes",
            isCorrect: false,
          },
        ],
      },
      {
        questionText:
          "How much free carriageway must remain when you park on a narrow street?",
        explanation:
          "Enough space must remain for other traffic to pass — in practice a free lane width of about 3 m. Parking that blocks emergency vehicles or dustcarts is an offence.",
        options: [
          { text: "About 3 metres of free lane width", isCorrect: true },
          { text: "About 1 metre", isCorrect: false },
          { text: "About 6 metres", isCorrect: false },
          { text: "No minimum is prescribed", isCorrect: false },
        ],
      },
      {
        questionText:
          "On which side of a two-way road inside a built-up area should you normally park?",
        explanation:
          "You must park on the right in the direction of travel. Parking on the left is only allowed in one-way streets or where the right side is occupied by tram tracks.",
        options: [
          { text: "On the right in the direction of travel", isCorrect: true },
          { text: "On either side as you prefer", isCorrect: false },
          {
            text: "On the left, so you can see oncoming traffic",
            isCorrect: false,
          },
          { text: "Facing against the traffic flow", isCorrect: false },
        ],
      },
      {
        questionText:
          "A blue 'P' sign has a supplementary plate showing a parking disc. What must you do?",
        explanation:
          "A parking-disc plate means you must set your arrival time on a Parkscheibe and display it visibly, respecting the maximum duration shown.",
        options: [
          {
            text: "Display a parking disc set to your arrival time and respect the maximum duration",
            isCorrect: true,
          },
          { text: "Pay at a ticket machine instead", isCorrect: false },
          { text: "Park free of charge with no time limit", isCorrect: false },
          { text: "Park only if you are a resident", isCorrect: false },
        ],
      },
      {
        questionText:
          "May you park in front of a lowered kerb (abgesenkter Bordstein) or a dropped crossing?",
        explanation:
          "No. Lowered kerbs serve pedestrians, wheelchair users and property access, so parking there is prohibited and regularly leads to being towed.",
        options: [
          {
            text: "No — parking in front of a lowered kerb is prohibited",
            isCorrect: true,
          },
          { text: "Yes, for up to three minutes", isCorrect: false },
          { text: "Yes, if you stay in the vehicle", isCorrect: false },
          { text: "Yes, outside business hours", isCorrect: false },
        ],
      },
    ],
  },
];
