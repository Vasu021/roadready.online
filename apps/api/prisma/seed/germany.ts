import type { CountrySeed } from "./types";

/**
 * Germany — 9 topics, 45 scenario questions.
 * Rule references are to the StVO (Straßenverkehrs-Ordnung).
 */
export const germany: CountrySeed = {
  code: "DE",
  name: "Germany",
  flagEmoji: "🇩🇪",
  order: 1,
  examQuestionCount: 20,
  examPassPercent: 75,
  facts: `<p>German driving licences are among the most expensive in Europe — typically <strong>€2,500–€4,500</strong> including theory, practical lessons and test fees.</p>
<p>The theory test is <strong>30 questions</strong> with a maximum of 10 error points allowed. Two questions worth 5 points each are already a fail.</p>
<p>Key rules you will be tested on: <strong>Rechts vor Links</strong> at unmarked junctions, the <strong>Rettungsgasse</strong> (rescue lane) on motorways, a blood-alcohol limit of <strong>0.5 ‰</strong> (0.0 ‰ for drivers under 21 or in their first two years), and the <strong>Richtgeschwindigkeit</strong> of 130 km/h on unrestricted Autobahn sections.</p>`,

  categories: [
    {
      slug: "basics",
      name: "Basic Skills",
      description: "Vehicle handling, moving off, parking and manoeuvring.",
    },
    {
      slug: "rules",
      name: "Traffic Rules",
      description: "Right of way, junctions, lights and lane discipline.",
    },
    {
      slug: "signs",
      name: "Road Signs",
      description: "Priority, warning and regulatory signs.",
    },
    {
      slug: "hazards",
      name: "Hazard Awareness",
      description: "Emergencies, poor conditions and vulnerable road users.",
    },
  ],

  topics: [
    // ── 1 ────────────────────────────────────────────────────────────────
    {
      slug: "de-vehicle-basics",
      name: "Vehicle Basics & Moving Off",
      description:
        "Warning lights, pulling out safely, narrow streets and parking manoeuvres.",
      iconEmoji: "🚙",
      category: "basics",
      questions: [
        {
          prompt:
            "A red warning light comes on in the instrument cluster while you are driving. What should you do?",
          image: "dashboard-controls",
          imageAlt:
            "Car instrument cluster showing a speedometer, rev counter and three warning lights",
          difficulty: "EASY",
          explanation:
            "Colour tells you the urgency. A red light signals a fault that can damage the vehicle or make it unsafe — oil pressure, brakes, coolant temperature, charging. Stop as soon as you safely can and check before driving on. Yellow or amber lights mean 'have it looked at soon', and green or blue lights are purely informational.",
          options: [
            {
              text: "Stop as soon as it is safe to do so and investigate before driving on",
              correct: true,
            },
            {
              text: "Carry on to your destination — red lights are informational only",
            },
            {
              text: "Drive faster so you reach a garage before the fault develops",
            },
            { text: "Switch the ignition off and on again while driving" },
          ],
        },
        {
          prompt:
            "You are parked at the kerb and want to pull out. A cyclist is coming up behind you. What is correct?",
          image: "blind-spot-moving-off",
          imageAlt:
            "Top-down view of a blue car parked at the kerb with a cyclist approaching from behind",
          explanation:
            "§10 StVO is unambiguous: anyone joining the flow of traffic from a parking space must do so in a way that endangers no one — if necessary, with the help of a second person. You have no priority whatsoever. Mirrors, indicator, shoulder check, then move only when the gap is genuinely safe.",
          options: [
            {
              text: "Check the mirrors, signal, check your blind spot over your shoulder, and let the cyclist pass first",
              correct: true,
            },
            {
              text: "Signal and pull straight out — traffic behind must give way to you",
            },
            {
              text: "Pull out without signalling because the road ahead is clear",
            },
            { text: "Sound the horn and move off immediately" },
          ],
        },
        {
          prompt:
            "Parked cars block your side of a narrow street and a car is approaching from the opposite direction. Who goes first?",
          image: "narrow-street-parked-cars",
          imageAlt:
            "Narrow street with parked cars on one side, a blue car and an oncoming red car",
          explanation:
            "§6 StVO: the driver whose own lane is obstructed must wait. The parked cars are on your side, so the obstruction is yours to deal with — you let oncoming traffic through and only pass the obstruction when the road is clear.",
          options: [
            {
              text: "The oncoming car — the obstruction is on your side, so you must wait",
              correct: true,
            },
            { text: "You, because you reached the narrow section first" },
            { text: "The larger of the two vehicles" },
            { text: "Whoever flashes their headlights first" },
          ],
        },
        {
          prompt:
            "You are reversing into a parking space between two cars. What does the law require of you?",
          image: "parking-space-kerb",
          imageAlt:
            "Top-down view of a car reversing into a kerbside parking space between two parked cars",
          difficulty: "HARD",
          explanation:
            "§9 (5) StVO holds the reversing driver to the strictest standard on the road: endangering other road users must be excluded. In practice that means you must be able to stop instantly, and where you cannot see well enough — a van blocking the view, children about — you get out and look or use someone to guide you.",
          options: [
            {
              text: "Endangering others must be excluded — be ready to stop instantly and use a guide if you cannot see clearly",
              correct: true,
            },
            { text: "A glance in the rear-view mirror is legally sufficient" },
            {
              text: "Switching on the hazard lights removes the need for further observation",
            },
            { text: "Other road users must give way while you are reversing" },
          ],
        },
        {
          prompt:
            "You see this sign at the entrance to a street. What does it tell you?",
          image: "sign-one-way",
          imageAlt: "Blue rectangular sign with a white arrow pointing right",
          difficulty: "EASY",
          explanation:
            "Zeichen 220 marks a one-way street (Einbahnstraße). Traffic may travel only in the direction of the arrow. Because there is no oncoming traffic, parking is normally allowed on both sides unless signed otherwise — but cyclists may be permitted to ride against the flow where an additional plate says so.",
          options: [
            {
              text: "It is a one-way street — traffic may travel only in the direction of the arrow",
              correct: true,
            },
            { text: "It is a dead-end street" },
            { text: "It marks the start of a priority road" },
            { text: "Parking is only allowed on the side the arrow points to" },
          ],
        },
      ],
    },

    // ── 2 ────────────────────────────────────────────────────────────────
    {
      slug: "de-rechts-vor-links",
      name: "Rechts vor Links",
      description:
        "Germany's default right-of-way rule at unmarked junctions — and the cases where it does not apply.",
      iconEmoji: "↗️",
      category: "rules",
      questions: [
        {
          prompt:
            "There are no signs and no markings at this crossroads. A car is approaching from your right. Who has priority?",
          image: "unmarked-crossroads",
          imageAlt:
            "Top-down unmarked crossroads with a blue car approaching from the south and a red car from the east",
          difficulty: "EASY",
          explanation:
            "§8 (1) StVO: where priority is not regulated by signs, signals or markings, traffic coming from the right has priority — Rechts vor Links. Arriving first, being on the wider road, or driving the bigger vehicle changes nothing.",
          options: [
            {
              text: "The car from the right — Rechts vor Links applies",
              correct: true,
            },
            { text: "You, because you are travelling straight ahead" },
            { text: "Whichever driver arrived at the junction first" },
            { text: "The vehicle on the wider of the two roads" },
          ],
        },
        {
          prompt:
            "You are going straight ahead. The red car on your right and the yellow car on your left arrive at the same moment, both also going straight. In what order do the three vehicles proceed?",
          image: "unmarked-crossroads-three-cars",
          imageAlt:
            "Unmarked crossroads with a blue car from the south, a red car from the east and a yellow car from the west",
          difficulty: "HARD",
          explanation:
            "Apply Rechts vor Links to each pair. The red car is to your right, so it goes before you. You are to the yellow car's right, so you go before it. That gives a clean chain: red, then you, then yellow — no deadlock, because each vehicle only has to yield to one other.",
          options: [
            { text: "Red first, then you, then yellow", correct: true },
            { text: "You first, then red, then yellow" },
            { text: "Yellow first, then red, then you" },
            {
              text: "Nobody has priority, so the drivers must agree among themselves",
            },
          ],
        },
        {
          prompt:
            "Your road ends at this T-junction and there are no signs at all. Must you give way to the traffic on the through road?",
          image: "t-junction-from-right",
          imageAlt:
            "T-junction with a blue car on the ending side road and a red car approaching on the through road from the right",
          difficulty: "HARD",
          explanation:
            "This trips up drivers from many other countries. In Germany, a road that ends at a T-junction does not automatically lose priority. Without signs, §8 StVO still governs: only traffic from your right has priority. It is different when you emerge from a property entrance, a field track or a pedestrian zone — §10 StVO then requires you to give way to everyone.",
          options: [
            {
              text: "No — Rechts vor Links still applies, so only traffic coming from your right has priority",
              correct: true,
            },
            {
              text: "Yes — a road that ends at a junction always loses priority",
            },
            { text: "Yes — the wider road always has priority in Germany" },
            {
              text: "No — a vehicle joining a through road always has priority",
            },
          ],
        },
        {
          prompt:
            "You are turning left at a junction. A vehicle is coming towards you and going straight ahead. Who goes first?",
          image: "turning-left-oncoming",
          imageAlt:
            "Crossroads with a blue car turning left and a red car approaching from the opposite direction",
          explanation:
            "§9 (3) StVO: a driver turning left must let oncoming traffic pass. This holds even if you have priority over the side roads, and it holds at a green light — a plain green disc permits the turn but never grants priority over oncoming traffic.",
          options: [
            {
              text: "The oncoming vehicle — a driver turning left must let oncoming traffic pass",
              correct: true,
            },
            { text: "You, because you signalled your intention first" },
            { text: "You, because a left turn is the shorter manoeuvre" },
            {
              text: "The oncoming vehicle only if it is also indicating to turn",
            },
          ],
        },
        {
          prompt:
            "You approach a junction and see this sign. What must you do?",
          image: "sign-yield",
          imageAlt:
            "Downward-pointing triangular sign with a red border and white centre",
          difficulty: "EASY",
          explanation:
            "Zeichen 205 — Vorfahrt gewähren. You must give way to traffic on the road you are joining, and be ready to stop, but a full stop is only required when traffic actually makes it necessary. That is the difference from Zeichen 206 (STOP), where stopping completely is mandatory every time.",
          options: [
            {
              text: "Give way to traffic on the road you are joining — stopping only if necessary",
              correct: true,
            },
            {
              text: "Come to a complete stop every time, even if the road is clear",
            },
            { text: "You have priority over traffic on the other road" },
            { text: "A speed limit of 50 km/h begins here" },
          ],
        },
      ],
    },

    // ── 3 ────────────────────────────────────────────────────────────────
    {
      slug: "de-roundabouts",
      name: "Roundabouts",
      description:
        "Entering, circulating, signalling and the roundabout that does not give you priority.",
      iconEmoji: "🔄",
      category: "rules",
      questions: [
        {
          prompt:
            "This blue sign stands at a roundabout entry together with a give-way sign. What does that combination mean?",
          image: "sign-roundabout",
          imageAlt:
            "Blue circular sign with three white arrows forming a clockwise circle",
          difficulty: "EASY",
          explanation:
            "Zeichen 215 marks a roundabout (Kreisverkehr). Combined with Zeichen 205 it means traffic already circulating has priority, and you must give way on entry. Standing inside the roundabout, you no longer have to worry about vehicles waiting to come in.",
          options: [
            {
              text: "Traffic already in the roundabout has priority — you must give way when entering",
              correct: true,
            },
            { text: "You have priority over traffic already circulating" },
            { text: "You must stop completely before entering, every time" },
            {
              text: "The roundabout may only be used by vehicles turning right",
            },
          ],
        },
        {
          prompt:
            "You are about to enter a roundabout and a car is already circulating. What do you do?",
          image: "roundabout-approach",
          imageAlt:
            "Roundabout with a blue car approaching the entry and a red car already circulating",
          explanation:
            "Give way and wait for a safe gap. You do not need to stop if the roundabout is clear as you arrive — the give-way sign requires you to yield, not to halt. Never force your way in and never assume a circulating driver will let you out of courtesy.",
          options: [
            {
              text: "Give way and enter only when there is a safe gap",
              correct: true,
            },
            {
              text: "Enter anyway — circulating traffic is obliged to make room for you",
            },
            {
              text: "Come to a full stop at the line even when the roundabout is empty",
            },
            { text: "Flash your headlights to claim your place in the flow" },
          ],
        },
        {
          prompt:
            "You are taking the third exit from a roundabout. How do you use your indicators?",
          image: "roundabout-third-exit",
          imageAlt:
            "Roundabout diagram with the first, second and third exits labelled and an arrow showing the third exit",
          explanation:
            "Do not indicate on entry to a signed roundabout — §9 StVO explicitly does not require it, and a left indicator misleads drivers waiting at the other entries. Indicate right only once you have passed the exit before the one you want, then leave.",
          options: [
            {
              text: "No indicator on entry; signal right only after passing the exit before yours",
              correct: true,
            },
            { text: "Signal left on entry and right on the way out" },
            {
              text: "Signal right for the whole time you are in the roundabout",
            },
            { text: "No indicator at all — neither entering nor leaving" },
          ],
        },
        {
          prompt:
            "You are circulating in a single-lane roundabout and a driver is waiting to enter. May you stop to let them in?",
          image: "roundabout-approach",
          imageAlt:
            "Roundabout with a blue car approaching the entry and a red car already circulating",
          explanation:
            "No. Stopping inside a roundabout without cause is prohibited and genuinely dangerous — the driver behind you does not expect it, and a courtesy wave-in shifts responsibility onto someone who cannot see what you can. Keep the circle moving; the waiting driver will get a gap.",
          options: [
            {
              text: "No — you must not stop in a roundabout except in an emergency",
              correct: true,
            },
            { text: "Yes, provided you switch on your hazard lights first" },
            { text: "Yes — waiting traffic has priority after 10 seconds" },
            { text: "Only if you are driving a bus or a lorry" },
          ],
        },
        {
          prompt:
            "A roundabout is marked with the blue roundabout sign but there is no give-way sign at the entry. Who has priority?",
          image: "unmarked-crossroads",
          imageAlt:
            "Top-down unmarked junction with a blue car approaching from the south and a red car from the east",
          difficulty: "HARD",
          explanation:
            "The blue Zeichen 215 on its own does not grant priority to circulating traffic — only the combination with Zeichen 205 does. Without the give-way sign, §8 StVO takes over and Rechts vor Links applies, meaning traffic entering from your right has priority over you while you are in the circle. These are rare, but they exist.",
          options: [
            {
              text: "Rechts vor Links applies — traffic entering from your right has priority",
              correct: true,
            },
            { text: "Circulating traffic always has priority in a roundabout" },
            {
              text: "The blue sign alone always gives circulating traffic priority",
            },
            { text: "Priority is undefined, so every driver must stop" },
          ],
        },
      ],
    },

    // ── 4 ────────────────────────────────────────────────────────────────
    {
      slug: "de-traffic-lights",
      name: "Traffic Lights",
      description:
        "The full German signal sequence, green arrows, blocked junctions and red-light penalties.",
      iconEmoji: "🚦",
      category: "rules",
      questions: [
        {
          prompt:
            "The light turns amber as you approach the junction. What does the law require?",
          image: "traffic-light-amber",
          imageAlt:
            "Traffic light showing amber, with a blue car approaching the stop line",
          difficulty: "EASY",
          explanation:
            "§37 StVO: amber means 'wait before the junction'. You must stop — the single exception is when you are already so close that stopping would require braking hard enough to endanger the traffic behind you. Accelerating to beat the light is an offence, not a judgement call.",
          options: [
            {
              text: "Stop — unless you are already so close that stopping would mean dangerous braking",
              correct: true,
            },
            { text: "Accelerate to clear the junction before red" },
            { text: "Continue at the same speed; amber has no legal meaning" },
            { text: "Stop only if pedestrians are waiting to cross" },
          ],
        },
        {
          prompt:
            "The red and amber lights are lit together. What does this phase mean?",
          image: "traffic-light-red-amber",
          imageAlt: "Traffic light showing red and amber lit at the same time",
          explanation:
            "Red-and-amber is the 'get ready' phase that precedes green in Germany — engage gear, release the handbrake, but do not move. It is still a red signal in law, so crossing the stop line during it is a red-light offence.",
          options: [
            {
              text: "Get ready — green is coming, but you must not move off yet",
              correct: true,
            },
            { text: "You may move off immediately with extra caution" },
            { text: "The signal is faulty; treat the junction as unmarked" },
            { text: "Traffic from the opposite direction now has priority" },
          ],
        },
        {
          prompt:
            "The signal is red and a green arrow plate is fixed to the right of it. May you turn right?",
          image: "traffic-light-green-arrow",
          imageAlt:
            "Traffic light showing red with a green arrow pointing right mounted beside it",
          difficulty: "HARD",
          explanation:
            "The Grünpfeil (Zeichen 720) permits a right turn on red, but only after coming to a complete stop at the line — a rolling turn is an offence — and only when you endanger or obstruct nobody. Crossing pedestrians and cyclists on green keep their priority, as does traffic on the road you are joining.",
          options: [
            {
              text: "Yes — but only after stopping completely and giving way to all crossing traffic and pedestrians",
              correct: true,
            },
            { text: "Yes, and without stopping, as if the light were green" },
            { text: "No — a red signal always prohibits every movement" },
            { text: "Only between 22:00 and 06:00" },
          ],
        },
        {
          prompt:
            "Your light is green, but the traffic beyond the junction is standing still. What should you do?",
          image: "traffic-light-green",
          imageAlt:
            "Traffic light showing green with a blue car approaching the junction",
          explanation:
            "§11 (1) StVO: you must not enter a junction if it is foreseeable that you will have to stop inside it and block the cross traffic. Green permits you to proceed — it does not oblige you to. Wait behind the line until there is room on the other side.",
          options: [
            {
              text: "Wait before the junction — you must not enter if you would end up blocking it",
              correct: true,
            },
            {
              text: "Drive on — a green light always gives you the right to proceed",
            },
            { text: "Drive on and stop in the middle of the junction" },
            { text: "Sound the horn to make the traffic ahead move on" },
          ],
        },
        {
          prompt:
            "From what point does crossing a red light count as a 'qualifizierter Rotlichtverstoß' — the serious version of the offence?",
          image: "traffic-light-red",
          imageAlt:
            "Traffic light showing red with a blue car at the stop line",
          difficulty: "HARD",
          explanation:
            "If the light had already been red for more than one second when you crossed the line, it is a qualified offence: a fine of €200, two points in Flensburg and a one-month driving ban. Under one second it is the 'simple' version — €90 and one point. Either way it is one of the most heavily penalised everyday offences in Germany.",
          options: [
            {
              text: "When the light had already been red for more than one second",
              correct: true,
            },
            { text: "After more than three seconds of red" },
            { text: "After more than five seconds of red" },
            { text: "Only if an accident results from it" },
          ],
        },
      ],
    },

    // ── 5 ────────────────────────────────────────────────────────────────
    {
      slug: "de-priority-signs",
      name: "Priority Signs",
      description:
        "Reading the yellow diamond, the STOP octagon and the signs that hand priority back and forth.",
      iconEmoji: "🔶",
      category: "signs",
      questions: [
        {
          prompt: "What does this yellow diamond sign tell you?",
          image: "sign-priority-road",
          imageAlt: "Yellow diamond sign with a white and black border",
          difficulty: "EASY",
          explanation:
            "Zeichen 306 — Vorfahrtstraße. You are on a priority road and keep priority through every junction until the sign is cancelled. Watch for the small arrow plates underneath: on a bending priority road they show which way the priority actually runs, which is not always straight on.",
          options: [
            {
              text: "You are on a priority road and keep right of way over traffic joining from side roads",
              correct: true,
            },
            { text: "You must give way at every junction ahead" },
            { text: "A reduced speed zone starts here" },
            { text: "A motorway service area is coming up" },
          ],
        },
        {
          prompt:
            "What does the same yellow diamond with a black bar through it mean?",
          image: "sign-priority-road-end",
          imageAlt: "Yellow diamond sign crossed out by a diagonal black bar",
          explanation:
            "Zeichen 307 ends the priority road. From the next junction onwards priority is no longer yours by default — unless another sign regulates it, §8 StVO and Rechts vor Links take over. It is the sign drivers most often overlook, precisely because it looks like the one that gave them priority.",
          options: [
            {
              text: "The priority road ends — from the next junction, Rechts vor Links applies unless signed otherwise",
              correct: true,
            },
            { text: "The priority road continues for another 500 metres" },
            { text: "All overtaking is prohibited from here" },
            { text: "You must stop at the next junction" },
          ],
        },
        {
          prompt: "What does this white triangle with a black cross mean?",
          image: "sign-priority-next-junction",
          imageAlt:
            "Triangular sign with a black border and a black cross shape with a thick vertical bar",
          difficulty: "HARD",
          explanation:
            "Zeichen 301 gives you priority at the next junction only — the thick bar shows the road that has priority. Unlike the yellow diamond it is a one-off: after that junction, priority is regulated afresh. It is typically used where a priority road would be overkill.",
          options: [
            {
              text: "You have priority at the next junction only",
              correct: true,
            },
            { text: "You have priority on this road until further notice" },
            { text: "You must give way at the next junction" },
            { text: "A level crossing is ahead" },
          ],
        },
        {
          prompt:
            "You reach this sign and the road you are joining is completely clear. What must you do?",
          image: "sign-stop",
          imageAlt: "Red octagonal STOP sign",
          difficulty: "EASY",
          explanation:
            "Zeichen 206 requires a complete stop at the stop line — wheels stationary — every single time, regardless of how clear the road looks. Where there is no line, you stop where you can actually see. Rolling through is an offence even when nothing is coming.",
          options: [
            {
              text: "Stop completely at the line, then give way before pulling out",
              correct: true,
            },
            { text: "Slow down and continue if the road is clear" },
            { text: "Stop only if another vehicle is approaching" },
            { text: "Give way but never stop, to keep traffic flowing" },
          ],
        },
        {
          prompt:
            "You approach a narrow section and see this sign. What does it require?",
          image: "sign-priority-oncoming",
          imageAlt:
            "Round sign with a red border showing a red upward arrow and a black downward arrow",
          explanation:
            "Zeichen 208 — you must give way to oncoming traffic at the narrow point. The red arrow represents your direction, which is the one that is restricted. Its mirror image, Zeichen 308, shows a black upward arrow and gives you priority instead — the two are easy to confuse at speed.",
          options: [
            {
              text: "Give way to oncoming traffic — wait until the narrow section is clear",
              correct: true,
            },
            { text: "You have priority over oncoming traffic here" },
            { text: "Overtaking is permitted for the next 100 metres" },
            { text: "The road becomes one-way from here" },
          ],
        },
      ],
    },

    // ── 6 ────────────────────────────────────────────────────────────────
    {
      slug: "de-speed-limits",
      name: "Speed Limits",
      description:
        "Default limits, Tempo-30 zones, derestriction and the speed the weather sets for you.",
      iconEmoji: "🎯",
      category: "rules",
      questions: [
        {
          prompt:
            "You are inside a built-up area and there are no speed limit signs. What is the general limit for a car?",
          image: "sign-speed-50",
          imageAlt: "Round sign with a red border showing the number 50",
          difficulty: "EASY",
          explanation:
            "50 km/h applies inside built-up areas by default — the yellow town-name sign (Zeichen 310) is what sets it, not a speed sign. It applies to all vehicles, and many towns then post 30 km/h zones inside it.",
          options: [
            { text: "50 km/h", correct: true },
            { text: "30 km/h" },
            { text: "60 km/h" },
            { text: "There is no general limit; drive to the conditions" },
          ],
        },
        {
          prompt:
            "You enter a Tempo-30 zone. What else changes besides the speed?",
          image: "residential-30-zone",
          imageAlt:
            "Residential street with a 30 km/h sign at the kerb and a blue car entering",
          difficulty: "HARD",
          explanation:
            "A Zone 30 is more than a speed limit. Inside it, junctions are normally left unsigned on purpose, so Rechts vor Links governs every one of them, and the 30 km/h limit runs across the whole zone until the end sign — it is not cancelled by a junction the way an ordinary limit sign can be.",
          options: [
            {
              text: "Junctions inside the zone are normally unsigned, so Rechts vor Links applies, and 30 km/h holds until the end sign",
              correct: true,
            },
            { text: "The limit ends at the first junction you cross" },
            { text: "Pedestrians gain priority everywhere in the zone" },
            { text: "Overtaking becomes prohibited throughout the zone" },
          ],
        },
        {
          prompt: "You pass this sign on a country road. What does it mean?",
          image: "sign-derestriction",
          imageAlt:
            "White circular sign with diagonal black stripes through it",
          explanation:
            "Zeichen 282 lifts all previously signed restrictions at once — speed limits, overtaking bans and so on. It does not mean 'no limit': the general limits take over again, which on a country road is 100 km/h for cars, and §3 StVO still requires you to drive at a speed you can control.",
          options: [
            {
              text: "All previously signed restrictions end — the general limits apply again",
              correct: true,
            },
            { text: "You may now drive at any speed you choose" },
            { text: "The road is closed to motor vehicles" },
            { text: "A motorway begins here" },
          ],
        },
        {
          prompt:
            "Fog reduces visibility to less than 50 metres. What is the maximum speed you may drive?",
          image: "fog-poor-visibility",
          imageAlt: "Road in dense fog with a car ahead barely visible",
          explanation:
            "§3 (1) StVO caps you at 50 km/h when visibility drops below 50 metres, and that ceiling applies everywhere — including the Autobahn. Use dipped headlights (daytime running lights alone are not enough) and rear fog lights only while visibility is genuinely under 50 metres.",
          options: [
            { text: "50 km/h", correct: true },
            { text: "80 km/h" },
            { text: "100 km/h" },
            { text: "The normal limit for the road still applies" },
          ],
        },
        {
          prompt:
            "You are driving a car on a country road outside a built-up area with no signs. What limit applies?",
          image: "sign-speed-100",
          imageAlt: "Round sign with a red border showing the number 100",
          difficulty: "EASY",
          explanation:
            "100 km/h is the general limit for cars and motorcycles outside built-up areas. Cars towing a trailer, buses and lorries over 3.5 t are capped at 80 km/h. On roads with separate carriageways or at least two lanes each way, cars may go faster where signed.",
          options: [
            { text: "100 km/h", correct: true },
            { text: "80 km/h" },
            { text: "130 km/h" },
            { text: "120 km/h" },
          ],
        },
      ],
    },

    // ── 7 ────────────────────────────────────────────────────────────────
    {
      slug: "de-pedestrians-and-cyclists",
      name: "Pedestrians & Cyclists",
      description:
        "Zebra crossings, school zones, buses at stops and the space cyclists are owed.",
      iconEmoji: "🚸",
      category: "hazards",
      questions: [
        {
          prompt:
            "A pedestrian is waiting at the kerb of a zebra crossing and is clearly intending to cross. What must you do?",
          image: "zebra-pedestrian-waiting",
          imageAlt:
            "Zebra crossing with a pedestrian waiting at the kerb and a car approaching",
          difficulty: "EASY",
          explanation:
            "§26 StVO gives pedestrians who visibly want to use a Fußgängerüberweg priority over vehicles. You must approach at moderate speed and stop if necessary — you do not wait for them to step into the road first. The same applies to wheelchair users and people with prams.",
          options: [
            {
              text: "Approach slowly and stop to let them cross — they have priority",
              correct: true,
            },
            {
              text: "Carry on — priority begins only once they have stepped onto the road",
            },
            { text: "Sound the horn to warn them and continue" },
            { text: "Stop only if there is a school or a kindergarten nearby" },
          ],
        },
        {
          prompt:
            "A vehicle ahead of you has stopped at a zebra crossing. May you overtake it?",
          image: "zebra-pedestrian-crossing",
          imageAlt:
            "Zebra crossing with a pedestrian on it and a car approaching from the left",
          explanation:
            "No — overtaking is prohibited both at a zebra crossing and on the approach to one. The stopped vehicle hides whoever is stepping out from behind it, which is exactly how pedestrians get hit at crossings. Wait behind it until it moves off.",
          options: [
            {
              text: "No — overtaking is prohibited at a zebra crossing and on the approach to one",
              correct: true,
            },
            { text: "Yes, if you keep below 30 km/h while passing" },
            { text: "Yes, if no pedestrian is currently on the crossing" },
            { text: "Yes, provided you sound the horn first" },
          ],
        },
        {
          prompt:
            "You are driving past a school and children are near the kerb. What is the correct behaviour?",
          image: "school-children-crossing",
          imageAlt:
            "Street outside a school with a crossing and two children near the kerb",
          difficulty: "EASY",
          explanation:
            "§3 (2a) StVO obliges drivers to behave towards children, the elderly and people with disabilities in a way that rules out any danger — if necessary by slowing to walking pace and being ready to stop. Children misjudge speed and distance and can step out without warning.",
          options: [
            {
              text: "Reduce speed, keep extra distance and be ready to stop at any moment",
              correct: true,
            },
            { text: "Maintain your speed but sound the horn as a warning" },
            { text: "Nothing special — the speed limit already covers it" },
            { text: "Flash your headlights so the children see you" },
          ],
        },
        {
          prompt:
            "A bus at a stop switches on its left indicator to pull out. What must you do?",
          image: "bus-stop-pedestrians",
          imageAlt:
            "A bus at a bus stop with pedestrians nearby and a car approaching",
          explanation:
            "§20 (5) StVO: buses signalling to leave a stop must be allowed to pull out — you have to wait, and brake if necessary. Related, and just as heavily tested: when a bus with hazard lights on is standing at a stop, you may only pass at walking pace and without endangering anyone.",
          options: [
            {
              text: "Let the bus pull out — you must wait, braking if necessary",
              correct: true,
            },
            { text: "Carry on — through traffic keeps priority" },
            { text: "Speed up to pass it before it moves off" },
            { text: "Wait only if passengers are still boarding" },
          ],
        },
        {
          prompt:
            "What minimum lateral distance must you keep when overtaking a cyclist inside a built-up area?",
          image: "blind-spot-moving-off",
          imageAlt:
            "Top-down view of a street with a parked car, a blue car and a cyclist",
          explanation:
            "Since the 2020 StVO reform the distance is fixed rather than left to judgement: at least 1.5 metres inside built-up areas and at least 2 metres outside. If the road is too narrow to give that space, you may not overtake at all — you stay behind until it opens up.",
          options: [
            { text: "1.5 metres", correct: true },
            { text: "0.5 metres" },
            { text: "1 metre" },
            { text: "3 metres" },
          ],
        },
      ],
    },

    // ── 8 ────────────────────────────────────────────────────────────────
    {
      slug: "de-autobahn",
      name: "Autobahn Rules",
      description:
        "Lane discipline, the advisory speed, zip merging and forming a rescue lane.",
      iconEmoji: "🛣️",
      category: "rules",
      questions: [
        {
          prompt: "You pass this sign. What rules begin to apply?",
          image: "sign-motorway",
          imageAlt:
            "Blue rectangular sign showing a white stylised motorway symbol",
          explanation:
            "Zeichen 330.1 starts the Autobahn. Only vehicles capable of more than 60 km/h by design may use it; stopping, reversing, turning and pedestrians are all prohibited, and the hard shoulder is for emergencies only — running out of fuel counts as avoidable and is fined.",
          options: [
            {
              text: "Motorway rules: only vehicles able to exceed 60 km/h, no stopping, no reversing, no pedestrians",
              correct: true,
            },
            { text: "A speed limit of 130 km/h now applies as law" },
            {
              text: "A dual carriageway begins but motorway rules do not apply",
            },
            { text: "Overtaking is prohibited from this point" },
          ],
        },
        {
          prompt: "You see this sign on an Autobahn. What is its legal status?",
          image: "sign-advisory-130",
          imageAlt: "Blue square sign with the number 130 in black on white",
          difficulty: "HARD",
          explanation:
            "130 km/h is the Richtgeschwindigkeit — a recommendation, not a limit, so exceeding it is not itself an offence. It still matters: if you are involved in a crash above 130, you can be held partly liable even when the collision was not otherwise your fault.",
          options: [
            {
              text: "A recommended speed — not enforceable, but exceeding it can increase your share of liability in a crash",
              correct: true,
            },
            { text: "A binding speed limit enforced by camera" },
            { text: "A minimum speed you must maintain" },
            { text: "A limit that applies only to lorries and buses" },
          ],
        },
        {
          prompt:
            "Traffic is flowing freely on a three-lane Autobahn. Which lane should you be in?",
          image: "motorway-three-lanes",
          imageAlt: "Three-lane motorway with cars in different lanes",
          difficulty: "EASY",
          explanation:
            "The Rechtsfahrgebot in §2 StVO requires you to drive as far right as reasonably possible. The middle and left lanes are for overtaking, and returning to the right lane after each overtake is not optional — sitting in the middle lane on a clear road is an offence, not a style choice.",
          options: [
            {
              text: "The rightmost free lane — the left lanes are for overtaking",
              correct: true,
            },
            { text: "The middle lane, to stay clear of joining traffic" },
            { text: "Any lane, as long as you keep to the speed limit" },
            { text: "The left lane, so slower traffic can undertake safely" },
          ],
        },
        {
          prompt:
            "Traffic on the Autobahn comes to a standstill. When and where do you form the rescue lane?",
          image: "motorway-rescue-lane",
          imageAlt:
            "Motorway with stationary traffic and a gap forming between the lanes",
          explanation:
            "The Rettungsgasse is formed as soon as traffic slows to a crawl — not when you first hear a siren, by which time nobody can move. It always runs between the leftmost lane and the one next to it, whatever the number of lanes. Failing to form one costs up to €320 and a one-month ban.",
          options: [
            {
              text: "Immediately as traffic slows, between the leftmost lane and the lane beside it",
              correct: true,
            },
            {
              text: "Only once you can hear or see an emergency vehicle approaching",
            },
            { text: "On the hard shoulder, keeping the running lanes clear" },
            {
              text: "In the middle of the carriageway, whatever the lane count",
            },
          ],
        },
        {
          prompt:
            "Your lane ends because of roadworks ahead. How should you merge?",
          image: "motorway-merge-zipper",
          imageAlt: "Motorway where one lane ends and a car needs to merge",
          explanation:
            "The Reißverschlussverfahren (§7 (4) StVO): drive on to the point where your lane actually ends, then merge alternately, one car from each lane. Merging early wastes half the available road and is the main cause of the tailbacks people blame on late mergers.",
          options: [
            {
              text: "Drive up to where the lane actually ends, then merge alternately — one car from each lane",
              correct: true,
            },
            { text: "Merge as early as possible, well before the lane ends" },
            {
              text: "Force your way in wherever a gap appears, at any point along the closure",
            },
            {
              text: "Stop at the end of your lane and wait for a gap to be offered",
            },
          ],
        },
      ],
    },

    // ── 9 ────────────────────────────────────────────────────────────────
    {
      slug: "de-hazards-and-emergencies",
      name: "Hazards & Emergencies",
      description:
        "Emergency vehicles, level crossings, roadworks and judging an overtake.",
      iconEmoji: "🚨",
      category: "hazards",
      questions: [
        {
          prompt:
            "An emergency vehicle comes up behind you with blue lights and siren. What is the correct response?",
          image: "emergency-vehicle-behind",
          imageAlt:
            "Ambulance with blue lights behind a blue car on a two-lane road",
          difficulty: "EASY",
          explanation:
            "§38 StVO requires you to make way immediately — pull to the right, slow down, and stop if that is what it takes. What you must not do is accelerate to stay ahead of it: you become a moving obstacle, and at the next queue you are in its way again.",
          options: [
            {
              text: "Move over to the right, slow down and stop if necessary to let it pass",
              correct: true,
            },
            { text: "Speed up so you are out of its way sooner" },
            { text: "Brake hard and stop immediately, wherever you are" },
            {
              text: "Keep your position — the emergency vehicle will find a way past",
            },
          ],
        },
        {
          prompt:
            "The red light at a level crossing starts flashing as you approach. What must you do?",
          image: "level-crossing",
          imageAlt:
            "Level crossing with a red signal light and a car approaching",
          explanation:
            "A flashing red at a level crossing means stop before the crossing and wait — the barriers may not even have started to move. Never drive on to a crossing unless the far side is clear enough for you to leave it immediately; being trapped on the rails is what turns a delay into a fatality.",
          options: [
            {
              text: "Stop before the crossing and wait until the signal goes out and the barriers are up",
              correct: true,
            },
            { text: "Cross quickly before the barriers come down" },
            { text: "Continue if you cannot see or hear a train" },
            { text: "Stop only once the barriers actually begin to lower" },
          ],
        },
        {
          prompt:
            "You reach roadworks where the lane is closed and workers are on the carriageway. What applies?",
          image: "roadworks-lane-closed",
          imageAlt: "Road with cones closing a lane and a car approaching",
          explanation:
            "Temporary signs at roadworks override the permanent ones — the yellow markings take precedence over the white ones, and a temporary limit replaces whatever was posted before. Slow down early, leave extra lateral space to people working, and expect narrower lanes than usual.",
          options: [
            {
              text: "Temporary signs and yellow markings override the permanent ones — slow down and leave extra space",
              correct: true,
            },
            {
              text: "Permanent signs always take precedence over temporary ones",
            },
            { text: "Roadworks limits are advisory and not enforceable" },
            { text: "Yellow markings apply only to lorries" },
          ],
        },
        {
          prompt: "You see this sign. What exactly does it prohibit?",
          image: "sign-no-overtaking",
          imageAlt:
            "Round sign with a red border showing a black car and a red car side by side",
          difficulty: "HARD",
          explanation:
            "Zeichen 276 bans overtaking multi-track motor vehicles — cars, vans, lorries. Passing single-track vehicles such as bicycles and mopeds is still permitted, with the usual lateral distance. The version with a lorry symbol (Zeichen 277) restricts the ban to vehicles over 3.5 t.",
          options: [
            {
              text: "Overtaking multi-track motor vehicles — you may still pass bicycles and mopeds",
              correct: true,
            },
            { text: "Overtaking anything at all, including cyclists" },
            { text: "Overtaking only for vehicles over 3.5 tonnes" },
            { text: "Driving alongside another vehicle in any lane" },
          ],
        },
        {
          prompt:
            "A slow vehicle is ahead of you on a country road and you can see oncoming traffic in the distance. When may you overtake?",
          image: "country-road-overtake",
          imageAlt:
            "Country road with a blue car behind a slow yellow vehicle and an oncoming red car",
          explanation:
            "§5 StVO permits an overtake only when you can rule out endangering oncoming traffic — you must be able to see the whole manoeuvre through and complete it without anyone having to brake or swerve. Any doubt about the distance means the answer is no: stay behind and wait for a clear stretch.",
          options: [
            {
              text: "Only when you can see the whole manoeuvre through and no one will have to brake or swerve",
              correct: true,
            },
            {
              text: "Whenever the oncoming vehicle is still more than 100 metres away",
            },
            {
              text: "Whenever the vehicle ahead is driving below the speed limit",
            },
            { text: "After flashing your headlights to warn oncoming traffic" },
          ],
        },
      ],
    },
  ],
};
