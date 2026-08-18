import type { CountrySeed } from "./types";

/**
 * France — 9 topics, 45 scenario questions.
 * Rule references are to the Code de la route.
 */
export const france: CountrySeed = {
  code: "FR",
  name: "France",
  flagEmoji: "🇫🇷",
  order: 2,
  examQuestionCount: 20,
  examPassPercent: 75,
  facts: `<p>The French theory test (<strong>l'ETG</strong>, "le code") is 40 questions, and you must get at least <strong>35 correct</strong> to pass.</p>
<p>France uses a <strong>12-point licence</strong> where points are deducted for offences, not accumulated — new drivers start with 6 points and build up to 12 over three years.</p>
<p>Distinctive rules: <strong>priorité à droite</strong> still applies at unmarked junctions, motorway limits <strong>drop from 130 to 110 km/h in the rain</strong>, and a high-visibility vest plus warning triangle are compulsory equipment in every car.</p>`,

  categories: [
    {
      slug: "basics",
      name: "Basic Skills",
      description: "Equipment, moving off, parking and manoeuvring.",
    },
    {
      slug: "rules",
      name: "Traffic Rules",
      description: "Priority, junctions, lights and lane discipline.",
    },
    {
      slug: "signs",
      name: "Road Signs",
      description: "Priority, warning and regulatory signs.",
    },
    {
      slug: "hazards",
      name: "Hazard Awareness",
      description: "Enforcement, emergencies and vulnerable road users.",
    },
  ],

  topics: [
    // ── 1 ────────────────────────────────────────────────────────────────
    {
      slug: "fr-vehicle-basics",
      name: "Vehicle Basics & Equipment",
      description:
        "Compulsory equipment, pulling out, narrow streets and parking rules.",
      iconEmoji: "🚙",
      category: "basics",
      questions: [
        {
          prompt:
            "Which equipment must be carried in every car driven in France?",
          image: "dashboard-controls",
          imageAlt:
            "Car instrument cluster showing a speedometer, rev counter and warning lights",
          difficulty: "EASY",
          explanation:
            "A high-visibility vest (gilet de haute visibilité) and a pre-signalling triangle are compulsory, and the vest must be reachable from the driver's seat — not in the boot, since you are required to put it on before you get out. Not carrying them is a fourth-class fine.",
          options: [
            {
              text: "A high-visibility vest, stored within reach of the driver's seat, and a warning triangle",
              correct: true,
            },
            { text: "A fire extinguisher and a spare set of bulbs" },
            { text: "A first-aid kit and snow chains, all year round" },
            { text: "Nothing is compulsory in a private car" },
          ],
        },
        {
          prompt:
            "You are parked at the kerb and want to rejoin the traffic. A cyclist is approaching from behind. What is correct?",
          image: "blind-spot-moving-off",
          imageAlt:
            "Top-down view of a blue car parked at the kerb with a cyclist approaching from behind",
          explanation:
            "A driver rejoining the flow of traffic must give way to everyone already on the road, cyclists included. Mirrors, indicator, and a shoulder check into the blind spot — a bicycle disappears completely from a door mirror at exactly the moment it matters.",
          options: [
            {
              text: "Check mirrors, signal, check the blind spot, and let the cyclist go past first",
              correct: true,
            },
            { text: "Pull out at once — traffic behind must adapt to you" },
            {
              text: "Move off without indicating since the road ahead is empty",
            },
            { text: "Sound the horn and pull out immediately" },
          ],
        },
        {
          prompt:
            "Parked cars block your side of a narrow street and a car is coming the other way. Who goes first?",
          image: "narrow-street-parked-cars",
          imageAlt:
            "Narrow street with parked cars on one side, a blue car and an oncoming red car",
          explanation:
            "The driver whose own lane is obstructed gives way. The parked cars are on your side, so you wait and let the oncoming car through before you pass the obstruction — the same principle applies to a narrowing signed with the priority-to-oncoming sign.",
          options: [
            {
              text: "The oncoming car — the obstruction is on your side, so you wait",
              correct: true,
            },
            { text: "You, because you reached the gap first" },
            { text: "The heavier vehicle" },
            { text: "Whoever flashes their headlights first" },
          ],
        },
        {
          prompt:
            "Your car is parked with two wheels on the pavement outside a shop. How is this treated?",
          image: "parking-space-kerb",
          imageAlt:
            "Top-down view of a kerbside parking area with cars in marked bays",
          explanation:
            "Parking on a pavement is 'stationnement gênant' — a €135 fine and, since it obstructs pedestrians and wheelchair users, one the police enforce readily. Blocking a bus stop, a crossing, a cycle lane or a fire hydrant falls under the same category, and the car can be towed.",
          options: [
            {
              text: "Stationnement gênant — a €135 fine, and the vehicle may be towed",
              correct: true,
            },
            {
              text: "Permitted as long as a pedestrian can still squeeze past",
            },
            { text: "Permitted for up to 30 minutes" },
            { text: "Permitted if the hazard lights are switched on" },
          ],
        },
        {
          prompt:
            "You see this sign at the entrance to a street. What does it mean?",
          image: "sign-one-way",
          imageAlt: "Blue rectangular sign with a white arrow pointing right",
          difficulty: "EASY",
          explanation:
            "It marks a one-way street (sens unique) — traffic may travel only in the direction of the arrow. Approached from the other end you would meet the round red 'sens interdit' sign instead. Watch for the 'sauf cyclistes' plate, which lets bicycles ride against the flow.",
          options: [
            {
              text: "A one-way street — traffic may travel only in the arrow's direction",
              correct: true,
            },
            { text: "A dead end" },
            { text: "A priority road begins" },
            { text: "Parking is allowed only on the arrow side" },
          ],
        },
      ],
    },

    // ── 2 ────────────────────────────────────────────────────────────────
    {
      slug: "fr-priorite-a-droite",
      name: "Priorité à Droite",
      description:
        "France's default priority rule, and the junctions where signs override it.",
      iconEmoji: "↗️",
      category: "rules",
      questions: [
        {
          prompt:
            "There are no signs or markings at this junction and a car is approaching from your right. Who has priority?",
          image: "unmarked-crossroads",
          imageAlt:
            "Top-down unmarked crossroads with a blue car from the south and a red car from the east",
          difficulty: "EASY",
          explanation:
            "Priorité à droite is the default across France wherever nothing else regulates the junction. It surprises visitors constantly, particularly in towns where an apparently minor side street still gives its traffic the right to pull out in front of you.",
          options: [
            {
              text: "The car from the right — priorité à droite applies",
              correct: true,
            },
            { text: "You, because you are going straight on" },
            { text: "Whoever arrived at the junction first" },
            { text: "The vehicle on the wider road" },
          ],
        },
        {
          prompt:
            "You are going straight on. The red car is on your right and the yellow car on your left, both also going straight. In what order do you proceed?",
          image: "unmarked-crossroads-three-cars",
          imageAlt:
            "Unmarked crossroads with a blue car from the south, a red car from the east and a yellow car from the west",
          difficulty: "HARD",
          explanation:
            "Take the vehicles pair by pair. Red is to your right, so red goes before you; you are to yellow's right, so you go before yellow. Red, you, yellow — a chain rather than a deadlock, because nobody has to yield to more than one vehicle.",
          options: [
            { text: "Red first, then you, then yellow", correct: true },
            { text: "You first, then red, then yellow" },
            { text: "Yellow first, then red, then you" },
            { text: "There is no rule; the drivers must signal to each other" },
          ],
        },
        {
          prompt:
            "You are on a road marked as a priority road (route prioritaire) and a car waits to emerge from a side road on your right. Who has priority?",
          image: "t-junction-from-right",
          imageAlt:
            "T-junction with a blue car on the side road and a red car on the through road",
          explanation:
            "Priorité à droite is the fallback, not an absolute. A priority-road sign, a give-way sign or a stop sign on the side road all override it, and here the side-road driver must wait for you. Only when nothing regulates the junction does the right-hand rule come back into force.",
          options: [
            {
              text: "You — the priority-road sign overrides priorité à droite",
              correct: true,
            },
            {
              text: "The car on the right, because priorité à droite always wins",
            },
            { text: "Whoever reaches the junction first" },
            { text: "Neither; both must stop before proceeding" },
          ],
        },
        {
          prompt:
            "You are turning left at a junction and a vehicle is coming towards you, going straight ahead. Who goes first?",
          image: "turning-left-oncoming",
          imageAlt:
            "Crossroads with a blue car turning left and a red car approaching head-on",
          explanation:
            "A driver turning left always yields to oncoming traffic going straight or turning right. Having a green light does not change this — a green disc allows the turn but never grants priority over the vehicles coming towards you.",
          options: [
            {
              text: "The oncoming vehicle — a left-turning driver must let it pass",
              correct: true,
            },
            { text: "You, because you indicated first" },
            { text: "You, if your light is green" },
            {
              text: "The oncoming vehicle only if it is a heavy goods vehicle",
            },
          ],
        },
        {
          prompt:
            "You approach a junction and see this sign. What must you do?",
          image: "sign-yield",
          imageAlt:
            "Downward-pointing triangle with a red border and white centre",
          difficulty: "EASY",
          explanation:
            "Cédez le passage — give way to traffic on the road you are joining, slowing enough to stop if you have to, but a full halt is only required when traffic makes it necessary. The octagonal STOP sign is the stricter one: there, stopping is mandatory every time.",
          options: [
            {
              text: "Give way to traffic on the road you are joining, stopping only if necessary",
              correct: true,
            },
            { text: "Stop completely every time, even on an empty road" },
            { text: "You have priority at this junction" },
            { text: "A 50 km/h limit starts here" },
          ],
        },
      ],
    },

    // ── 3 ────────────────────────────────────────────────────────────────
    {
      slug: "fr-roundabouts",
      name: "Roundabouts",
      description:
        "The giratoire where you give way, and the old rond-point where you do not.",
      iconEmoji: "🔄",
      category: "rules",
      questions: [
        {
          prompt:
            "You reach a roundabout signed 'Vous n'avez pas la priorité' with a give-way sign. What applies?",
          image: "sign-roundabout",
          imageAlt:
            "Blue circular sign with three white arrows forming a circle",
          difficulty: "EASY",
          explanation:
            "This is a carrefour à sens giratoire — the standard modern French roundabout. Traffic already circulating has priority and you give way on entry. The great majority of French roundabouts work this way.",
          options: [
            {
              text: "Traffic already circulating has priority — you give way on entry",
              correct: true,
            },
            {
              text: "You have priority over traffic already in the roundabout",
            },
            { text: "You must stop completely before entering" },
            {
              text: "Priority alternates between entering and circulating traffic",
            },
          ],
        },
        {
          prompt:
            "A roundabout has no give-way sign at the entries — an old-style 'rond-point'. Who has priority?",
          image: "unmarked-crossroads",
          imageAlt:
            "Top-down unmarked junction with cars approaching from two directions",
          difficulty: "HARD",
          explanation:
            "Without the give-way signs, priorité à droite applies — so traffic entering has priority over traffic already going round, and you must yield from inside the circle. Rare now, but the Place de l'Étoile in Paris is the famous example, and insurers treat collisions there as a category of their own.",
          options: [
            {
              text: "Priorité à droite — entering traffic has priority over traffic already circulating",
              correct: true,
            },
            {
              text: "Circulating traffic always has priority in any roundabout",
            },
            { text: "The first vehicle to arrive has priority" },
            { text: "Priority is undefined, so everyone must stop" },
          ],
        },
        {
          prompt:
            "You are taking the third exit from a roundabout. How should you signal?",
          image: "roundabout-third-exit",
          imageAlt:
            "Roundabout diagram with exits labelled and an arrow indicating the third exit",
          explanation:
            "Keep to the outside or inside lane as marked, and indicate right only after passing the exit before yours. Signalling left on entry is not required and misleads drivers waiting at the other entries about where you intend to leave.",
          options: [
            {
              text: "Signal right only after passing the exit before the one you want",
              correct: true,
            },
            { text: "Signal left on entry and right on exit, every time" },
            { text: "Keep the right indicator on for the whole circuit" },
            { text: "No indicator is needed at any point" },
          ],
        },
        {
          prompt:
            "A car is already circulating as you arrive at a standard giratoire. What do you do?",
          image: "roundabout-approach",
          imageAlt:
            "Roundabout with a blue car at the entry and a red car already circulating",
          explanation:
            "Give way and wait for a genuine gap. You need not stop if the roundabout is clear when you get there — 'cédez le passage' asks you to yield, not to halt — but you may never enter in a way that forces a circulating driver to brake.",
          options: [
            {
              text: "Give way and enter only when there is a safe gap",
              correct: true,
            },
            { text: "Enter — circulating traffic must make room for you" },
            { text: "Stop completely even if the roundabout is empty" },
            { text: "Flash your lights and enter" },
          ],
        },
        {
          prompt:
            "How do you tell a give-way roundabout from an old priorité-à-droite one before you commit?",
          image: "sign-yield",
          imageAlt:
            "Downward-pointing triangle with a red border and white centre",
          explanation:
            "Look at the entry, not the layout. A give-way triangle or the 'Vous n'avez pas la priorité' panel means circulating traffic has priority; if the entries carry only the blue roundabout sign and no give-way marking, priorité à droite still governs. Read the signs on approach, every time.",
          options: [
            {
              text: "By the signs at the entry — a give-way triangle or 'Vous n'avez pas la priorité' panel means circulating traffic has priority",
              correct: true,
            },
            {
              text: "By the size — large roundabouts always give way to circulating traffic",
            },
            { text: "By the number of lanes in the circle" },
            { text: "By whether the centre island is raised or painted" },
          ],
        },
      ],
    },

    // ── 4 ────────────────────────────────────────────────────────────────
    {
      slug: "fr-traffic-lights",
      name: "Traffic Lights",
      description:
        "The French signal sequence, flashing amber, filter arrows and blocked junctions.",
      iconEmoji: "🚦",
      category: "rules",
      questions: [
        {
          prompt:
            "The light turns amber as you approach. What does the Code de la route require?",
          image: "traffic-light-amber",
          imageAlt:
            "Traffic light showing amber with a car approaching the stop line",
          difficulty: "EASY",
          explanation:
            "Amber means stop, unless you are so close that stopping could not be done safely. Crossing on amber when you could have stopped is treated as a red-light offence: €135 and four points off your licence.",
          options: [
            {
              text: "Stop, unless you are so close that stopping cannot be done safely",
              correct: true,
            },
            { text: "Accelerate to clear the junction" },
            { text: "Continue as normal — amber carries no obligation" },
            { text: "Stop only if pedestrians are waiting" },
          ],
        },
        {
          prompt:
            "Does the French traffic-light sequence include a red-and-amber phase before green?",
          image: "traffic-light-red-amber",
          imageAlt: "Traffic light showing red and amber lit at the same time",
          difficulty: "HARD",
          explanation:
            "No — French lights go straight from red to green, with no preparatory phase. Drivers used to Germany or the UK sometimes expect a warning that never comes, which is exactly why the light in front of them turns green while they are still looking down.",
          options: [
            {
              text: "No — French lights go directly from red to green with no preparatory phase",
              correct: true,
            },
            { text: "Yes, it lasts two seconds before green" },
            { text: "Yes, but only at junctions outside built-up areas" },
            { text: "Yes, but only at pedestrian crossings" },
          ],
        },
        {
          prompt:
            "A light shows a lit amber arrow beside a red signal. What may you do?",
          image: "traffic-light-green-arrow",
          imageAlt:
            "Traffic light showing red with a lit arrow pointing right beside it",
          explanation:
            "A lit filter arrow lets you move in the arrow's direction while the main signal is red — but it gives you no priority. You must give way to any traffic already moving on green and to pedestrians crossing in the direction you are turning.",
          options: [
            {
              text: "Move in the arrow's direction while giving way to all other traffic and pedestrians",
              correct: true,
            },
            {
              text: "Proceed with full priority as if the main light were green",
            },
            { text: "Nothing — the red light overrides any arrow" },
            { text: "Turn only if no vehicle is waiting behind you" },
          ],
        },
        {
          prompt:
            "A traffic light shows a flashing amber. How should you treat the junction?",
          image: "traffic-light-amber",
          imageAlt:
            "Traffic light showing amber with a car approaching the junction",
          explanation:
            "Flashing amber means the signals are not controlling the junction — proceed with caution and apply the priority rules that would otherwise govern it, whether that is priorité à droite or a priority-road sign. It is a warning, not permission.",
          options: [
            {
              text: "Proceed with caution and apply the normal priority rules for the junction",
              correct: true,
            },
            { text: "Treat it as a green light and continue at normal speed" },
            { text: "Treat it as a stop sign and halt every time" },
            { text: "The junction is closed to traffic" },
          ],
        },
        {
          prompt:
            "Your light is green but traffic beyond the junction has stopped. What do you do?",
          image: "traffic-light-green",
          imageAlt:
            "Traffic light showing green with a car approaching the junction",
          explanation:
            "Stay behind the line. Entering a junction you cannot clear blocks the crossing traffic and is an offence in its own right. Green permits movement; it never obliges you to move into a space that is not there.",
          options: [
            {
              text: "Wait before the junction — you must not enter if you would block it",
              correct: true,
            },
            { text: "Drive on; the green light entitles you to enter" },
            { text: "Drive into the junction and wait there" },
            { text: "Sound the horn to clear the way ahead" },
          ],
        },
      ],
    },

    // ── 5 ────────────────────────────────────────────────────────────────
    {
      slug: "fr-priority-signs",
      name: "Priority Signs",
      description:
        "The yellow diamond, STOP, and the signs that decide who yields at a narrowing.",
      iconEmoji: "🔶",
      category: "signs",
      questions: [
        {
          prompt: "What does this yellow diamond sign mean?",
          image: "sign-priority-road",
          imageAlt: "Yellow diamond sign with white and black borders",
          difficulty: "EASY",
          explanation:
            "Route à caractère prioritaire — you are on a priority road and keep right of way at every junction along it, so priorité à droite is suspended. It stays in force until the crossed-out version cancels it.",
          options: [
            {
              text: "You are on a priority road — priorité à droite is suspended along it",
              correct: true,
            },
            { text: "You must give way at every junction ahead" },
            { text: "A reduced speed zone begins" },
            { text: "A parking area is ahead" },
          ],
        },
        {
          prompt:
            "What does the same diamond with a black bar through it mean?",
          image: "sign-priority-road-end",
          imageAlt: "Yellow diamond sign crossed out by a diagonal black bar",
          explanation:
            "The priority road ends here. From the next junction, priority is regulated by whatever signs are there — and where there are none, priorité à droite comes back into force. This is the sign that catches drivers who assumed their priority ran to the edge of town.",
          options: [
            {
              text: "The priority road ends — priorité à droite applies again unless signed otherwise",
              correct: true,
            },
            { text: "The priority road continues for another kilometre" },
            { text: "Overtaking is now prohibited" },
            { text: "You must stop at the next junction" },
          ],
        },
        {
          prompt:
            "You reach this sign and the road you are joining is completely clear. What must you do?",
          image: "sign-stop",
          imageAlt: "Red octagonal STOP sign",
          difficulty: "EASY",
          explanation:
            "A complete stop at the line is mandatory every time, clear road or not — wheels stationary. Rolling through costs €135 and four points, and it is one of the offences most often picked up at junctions with a camera.",
          options: [
            {
              text: "Stop completely at the line, then give way before pulling out",
              correct: true,
            },
            { text: "Slow down and continue if nothing is coming" },
            { text: "Stop only when another vehicle is approaching" },
            { text: "Treat it the same as a give-way sign" },
          ],
        },
        {
          prompt:
            "You approach a narrowing and see this sign. What does it require?",
          image: "sign-priority-oncoming",
          imageAlt:
            "Round sign with a red border, a red upward arrow and a black downward arrow",
          explanation:
            "You must give way to oncoming traffic through the narrow section — the red arrow marks your direction as the restricted one. Its counterpart, a square blue sign with the arrows reversed, gives you priority instead; check the shape and colour before committing.",
          options: [
            {
              text: "Give way to oncoming traffic through the narrow section",
              correct: true,
            },
            { text: "You have priority over oncoming traffic here" },
            { text: "Overtaking is allowed for the next 100 metres" },
            { text: "The road becomes one-way" },
          ],
        },
        {
          prompt: "What does this triangular sign with children on it mean?",
          image: "sign-children",
          imageAlt:
            "Triangular warning sign with a red border showing two children",
          difficulty: "EASY",
          explanation:
            "A warning of a place frequented by children — a school, a playground, a bus drop-off. It imposes no numeric limit by itself, but §R413-17 requires you to reduce speed whenever circumstances demand it, and children near a kerb is the textbook case.",
          options: [
            {
              text: "Warning: children are likely nearby — reduce speed and be ready to stop",
              correct: true,
            },
            {
              text: "A school bus stop where overtaking is banned at all times",
            },
            { text: "A pedestrian-only zone begins" },
            { text: "A 30 km/h limit begins immediately" },
          ],
        },
      ],
    },

    // ── 6 ────────────────────────────────────────────────────────────────
    {
      slug: "fr-speed-limits",
      name: "Speed Limits",
      description:
        "Town, country and motorway limits — and how rain and fog change all of them.",
      iconEmoji: "🎯",
      category: "rules",
      questions: [
        {
          prompt:
            "You are in a built-up area with no speed limit signs. What limit applies?",
          image: "sign-speed-50",
          imageAlt: "Round sign with a red border showing the number 50",
          difficulty: "EASY",
          explanation:
            "50 km/h applies from the town-name sign to the crossed-out one at the far end. Many communes now sign 30 km/h across the whole centre — where they do, the 'Ville 30' panel at the boundary sets it for every street inside.",
          options: [
            { text: "50 km/h", correct: true },
            { text: "30 km/h" },
            { text: "60 km/h" },
            { text: "70 km/h" },
          ],
        },
        {
          prompt:
            "What is the limit on a two-way road without a central divider, outside built-up areas?",
          image: "sign-speed-100",
          imageAlt: "Round sign with a red border showing the number 100",
          difficulty: "HARD",
          explanation:
            "80 km/h has been the national default on undivided two-way roads since 2018, though around half the départements have since restored 90 km/h on parts of their network. Because it varies locally, the posted sign is what you follow — do not assume either figure.",
          options: [
            {
              text: "80 km/h by default, though some départements have restored 90 km/h — follow the posted signs",
              correct: true,
            },
            { text: "110 km/h everywhere" },
            { text: "100 km/h everywhere" },
            { text: "130 km/h everywhere" },
          ],
        },
        {
          prompt: "It is raining on the motorway. What is the maximum speed?",
          image: "fog-poor-visibility",
          imageAlt: "Road in poor visibility with a vehicle ahead",
          explanation:
            "Wet-weather limits are automatic and apply without any sign: 110 km/h on motorways instead of 130, 100 instead of 110 on dual carriageways, and 80 instead of 90. Drivers in their first three years are held to the wet-weather figures at all times.",
          options: [
            { text: "110 km/h", correct: true },
            { text: "130 km/h — the limit does not change" },
            { text: "90 km/h" },
            { text: "100 km/h" },
          ],
        },
        {
          prompt:
            "Fog reduces visibility to less than 50 metres. What is the maximum speed on any road?",
          image: "fog-poor-visibility",
          imageAlt: "Road in dense fog with a vehicle barely visible ahead",
          explanation:
            "50 km/h, on every road including the motorway. Use dipped headlights and front fog lights; rear fog lights are permitted only while visibility is genuinely this poor, because in clear conditions they dazzle the driver behind.",
          options: [
            { text: "50 km/h", correct: true },
            { text: "70 km/h" },
            { text: "80 km/h" },
            { text: "The normal limit for that road still applies" },
          ],
        },
        {
          prompt: "You enter a zone signed 30. What does that tell you?",
          image: "residential-30-zone",
          imageAlt:
            "Residential street with a 30 km/h sign at the kerb and a car entering",
          explanation:
            "A zone 30 sets 30 km/h across every street inside it until the end sign, and it is designed for shared use — pedestrians are given more room, cycle contraflows are common, and junctions are usually left unsigned, so priorité à droite governs them.",
          options: [
            {
              text: "30 km/h applies across the whole zone until the end sign, with priorité à droite at its junctions",
              correct: true,
            },
            { text: "The limit ends at the first junction" },
            { text: "The zone is closed to through traffic" },
            { text: "Only heavy goods vehicles are limited to 30 km/h" },
          ],
        },
      ],
    },

    // ── 7 ────────────────────────────────────────────────────────────────
    {
      slug: "fr-pedestrians-and-cyclists",
      name: "Pedestrians & Cyclists",
      description:
        "Crossings, school zones, buses and the space you owe a cyclist.",
      iconEmoji: "🚸",
      category: "hazards",
      questions: [
        {
          prompt:
            "A pedestrian is waiting at a crossing and clearly intends to cross. What must you do?",
          image: "zebra-pedestrian-waiting",
          imageAlt: "Zebra crossing with a pedestrian waiting at the kerb",
          difficulty: "EASY",
          explanation:
            "Since 2018 the rule is explicit: you must stop for any pedestrian engaged in crossing or manifestly intending to cross. Waiting for them to step into the road first is not enough — failing to yield costs €135 and six points, the heaviest points penalty in the everyday list.",
          options: [
            {
              text: "Stop and let them cross — a pedestrian showing the intention to cross has priority",
              correct: true,
            },
            {
              text: "Continue — priority applies only once they are on the road",
            },
            { text: "Sound the horn and continue" },
            { text: "Stop only if they are a child or an elderly person" },
          ],
        },
        {
          prompt:
            "A vehicle ahead has stopped at a pedestrian crossing. May you overtake it?",
          image: "zebra-pedestrian-crossing",
          imageAlt:
            "Zebra crossing with a pedestrian on it and a car approaching",
          explanation:
            "No. Overtaking at a crossing or on the approach to it is prohibited, because the stopped vehicle hides whoever is walking out from behind it. Wait until it moves off.",
          options: [
            {
              text: "No — overtaking is prohibited at a crossing and on the approach to one",
              correct: true,
            },
            { text: "Yes, if you pass slowly" },
            { text: "Yes, if no pedestrian is currently on the crossing" },
            { text: "Yes, after sounding the horn" },
          ],
        },
        {
          prompt:
            "What minimum lateral distance must you leave when overtaking a cyclist inside a built-up area?",
          image: "blind-spot-moving-off",
          imageAlt: "Street with a parked car, a moving car and a cyclist",
          explanation:
            "One metre inside built-up areas and 1.5 metres outside them. Crossing a solid centre line to give that space is tolerated where it is safe — the space matters more than the line. If the road is too narrow to leave it, do not overtake.",
          options: [
            { text: "1 metre", correct: true },
            { text: "0.5 metres" },
            { text: "1.5 metres" },
            { text: "2 metres" },
          ],
        },
        {
          prompt:
            "You are driving past a school and children are near the kerb. What is expected of you?",
          image: "school-children-crossing",
          imageAlt:
            "Street outside a school with a crossing and children near the kerb",
          difficulty: "EASY",
          explanation:
            "Reduce speed and be ready to stop. Article R413-17 requires a driver to slow whenever conditions demand it — near schools, in crowds, at crossings — regardless of what the posted limit says. Children step out without checking, and they are hidden by parked cars until the last moment.",
          options: [
            {
              text: "Slow down, leave extra room and be ready to stop at any moment",
              correct: true,
            },
            { text: "Maintain speed but sound the horn" },
            { text: "Nothing beyond obeying the posted limit" },
            { text: "Flash your headlights so the children notice you" },
          ],
        },
        {
          prompt:
            "A bus at a stop in a built-up area signals to pull out. What must you do?",
          image: "bus-stop-pedestrians",
          imageAlt:
            "A bus at a bus stop with pedestrians nearby and a car approaching",
          explanation:
            "Inside built-up areas you must let a bus rejoin the traffic when it signals, slowing or stopping if necessary. Outside built-up areas the obligation does not apply — but giving way anyway costs nothing and is what a competent driver does.",
          options: [
            {
              text: "Give way and let it pull out — this is compulsory inside built-up areas",
              correct: true,
            },
            { text: "Carry on — through traffic always keeps priority" },
            { text: "Accelerate past before it moves" },
            { text: "Wait only while passengers are boarding" },
          ],
        },
      ],
    },

    // ── 8 ────────────────────────────────────────────────────────────────
    {
      slug: "fr-motorway",
      name: "Motorway Driving",
      description: "Lane discipline, merging, tolls and the hard shoulder.",
      iconEmoji: "🛣️",
      category: "rules",
      questions: [
        {
          prompt: "You pass this sign. What rules now apply?",
          image: "sign-motorway",
          imageAlt: "Blue rectangular sign showing a white motorway symbol",
          explanation:
            "The autoroute begins: 130 km/h in the dry and 110 in the rain, no stopping except in an emergency, no reversing or U-turns, and no pedestrians, cyclists or vehicles unable to reach 80 km/h on the flat.",
          options: [
            {
              text: "Motorway rules: 130 km/h dry, no stopping, no reversing, and slow vehicles are excluded",
              correct: true,
            },
            { text: "A dual carriageway begins, without motorway rules" },
            { text: "A 110 km/h limit applies in all conditions" },
            { text: "Overtaking is prohibited from this point" },
          ],
        },
        {
          prompt:
            "Traffic is flowing freely on a three-lane autoroute. Which lane should you use?",
          image: "motorway-three-lanes",
          imageAlt: "Three-lane motorway with cars in different lanes",
          difficulty: "EASY",
          explanation:
            "Keep to the right-hand lane and use the others only to overtake, returning right afterwards. Sitting in the middle lane on a clear road is an offence in its own right, and undertaking on the right is prohibited even when the lane beside you is moving faster.",
          options: [
            {
              text: "The right-hand lane — the others are for overtaking, and you return right afterwards",
              correct: true,
            },
            { text: "The middle lane, to avoid joining traffic" },
            { text: "Any lane, as long as you keep to the limit" },
            { text: "The left lane, so slower traffic can pass on the right" },
          ],
        },
        {
          prompt:
            "You are joining the autoroute from a slip road. Who has priority?",
          image: "motorway-merge-zipper",
          imageAlt: "Motorway with a slip road merging and a car about to join",
          explanation:
            "Traffic already on the motorway has priority. Use the acceleration lane to match the speed of the flow, then merge into a gap — you must never force your way in or stop at the end of the slip road, since stopping leaves you with no way to get up to speed.",
          options: [
            {
              text: "Traffic already on the motorway — use the acceleration lane to match its speed, then merge into a gap",
              correct: true,
            },
            { text: "You do — joining traffic has priority in France" },
            { text: "Whoever is travelling faster" },
            { text: "Stop at the end of the slip road and wait to be let in" },
          ],
        },
        {
          prompt:
            "When may you use the hard shoulder (bande d'arrêt d'urgence)?",
          image: "motorway-rescue-lane",
          imageAlt:
            "Motorway with stationary traffic and a clear strip alongside",
          explanation:
            "Only in a genuine emergency. If you have to stop, put the vest on before leaving the car, get everyone out on the right-hand side and behind the barrier, and place the triangle — but only if you can do it without walking into traffic. Using the shoulder to overtake or to skip a queue is a €135 fine and three points.",
          options: [
            {
              text: "Only in a genuine emergency — then put on the vest, get everyone behind the barrier and call for help",
              correct: true,
            },
            { text: "To overtake queuing traffic when the lanes are blocked" },
            { text: "To take a rest break on a long journey" },
            { text: "To let a faster vehicle pass you" },
          ],
        },
        {
          prompt:
            "You are approaching a toll plaza. What should you be looking for as you slow down?",
          image: "toll-plaza",
          imageAlt:
            "Toll plaza with booths and barriers across the carriageway",
          explanation:
            "Pick your lane from the overhead signs before you get there: the orange 't' lane is Télépéage for subscribers only, a card symbol means card payment, and green arrows mean the lane is open. Choosing late and swerving across lanes at a plaza is a common cause of low-speed collisions.",
          options: [
            {
              text: "The lane symbols overhead — 't' is for Télépéage subscribers, and a green arrow means the lane is open",
              correct: true,
            },
            {
              text: "The shortest queue, since all lanes accept all payment types",
            },
            { text: "The leftmost lane, which is always for cars" },
            { text: "Nothing — barriers open automatically for every vehicle" },
          ],
        },
      ],
    },

    // ── 9 ────────────────────────────────────────────────────────────────
    {
      slug: "fr-enforcement-and-hazards",
      name: "Enforcement & Hazards",
      description:
        "Radars, the points system, emergency vehicles and judging an overtake.",
      iconEmoji: "🚨",
      category: "hazards",
      questions: [
        {
          prompt: "How does the French driving licence points system work?",
          image: "radar-speed-camera",
          imageAlt: "Roadside speed camera beside a road with a car passing",
          difficulty: "HARD",
          explanation:
            "You start with a full 12 points and lose them for offences — the opposite of systems that add penalty points. New drivers begin on 6 and gain one a year, reaching 12 after three years of clean driving. Reach zero and the licence is invalidated; points come back after a clear period or through an awareness course.",
          options: [
            {
              text: "You start with 12 points and lose them for offences; reaching zero invalidates the licence",
              correct: true,
            },
            { text: "You start at zero and accumulate points for offences" },
            { text: "Points are only deducted after a court appearance" },
            { text: "Points expire automatically every twelve months" },
          ],
        },
        {
          prompt:
            "You pass a fixed radar and see the flash. What determines the penalty?",
          image: "radar-speed-camera",
          imageAlt: "Fixed speed camera on a post beside the carriageway",
          explanation:
            "The recorded speed is reduced by a tolerance before the penalty is set — 5 km/h below 100 km/h, and 5% above it — and the penalty then scales with the excess. Under 20 km/h over the limit inside a built-up area is €135 and one point; 50 km/h over is a criminal-level offence with vehicle seizure.",
          options: [
            {
              text: "The excess over the limit after a tolerance is deducted — 5 km/h under 100 km/h, 5% above it",
              correct: true,
            },
            { text: "A flat fine, the same for every speed" },
            { text: "Only the time of day the offence happened" },
            { text: "Nothing — fixed radars issue warnings only" },
          ],
        },
        {
          prompt:
            "An emergency vehicle approaches from behind with lights and siren. What do you do?",
          image: "emergency-vehicle-behind",
          imageAlt: "Ambulance with blue lights behind a car",
          difficulty: "EASY",
          explanation:
            "Make way immediately: move right, slow down, stop if that is what it takes. Do not accelerate to stay ahead of it — you become a moving obstruction, and you will still be in its way at the next queue. Related and often tested: the 'corridor de sécurité' requires you to slow and move over for any vehicle stopped with flashing lights.",
          options: [
            {
              text: "Move right, slow down and stop if necessary to let it pass",
              correct: true,
            },
            { text: "Accelerate so you are out of its way sooner" },
            { text: "Brake hard and stop instantly wherever you are" },
            { text: "Hold your position and let it find a way past" },
          ],
        },
        {
          prompt:
            "You reach roadworks with a lane closed and workers on the carriageway. What applies?",
          image: "roadworks-lane-closed",
          imageAlt: "Road with cones closing a lane and a car approaching",
          explanation:
            "Temporary signs and yellow markings override the permanent ones for the length of the works. Slow down early, leave extra lateral space, and expect narrowed lanes — speeding fines in roadworks are enforced at the temporary limit, not the usual one.",
          options: [
            {
              text: "Temporary signs and yellow markings take precedence — slow down and leave extra space",
              correct: true,
            },
            { text: "Permanent signs always override temporary ones" },
            { text: "Roadworks limits are advisory only" },
            { text: "Yellow markings apply only to heavy goods vehicles" },
          ],
        },
        {
          prompt:
            "A slow vehicle is ahead and there is oncoming traffic in the distance. When may you overtake?",
          image: "country-road-overtake",
          imageAlt:
            "Country road with a car behind a slow vehicle and an oncoming car in the distance",
          explanation:
            "Only when you can see the whole manoeuvre through and complete it without forcing anyone to brake or swerve. Any doubt about the closing distance settles it: stay behind. Overtaking is also prohibited at crossings, on the approach to a blind crest or bend, and wherever a solid line separates the lanes.",
          options: [
            {
              text: "Only when you can complete it without forcing anyone to brake or swerve",
              correct: true,
            },
            {
              text: "Whenever the oncoming vehicle is more than 100 metres away",
            },
            { text: "Whenever the vehicle ahead is below the speed limit" },
            { text: "After flashing your headlights at the oncoming traffic" },
          ],
        },
      ],
    },
  ],
};
