import type { SeedModule } from "../types";

export const module11: SeedModule = {
  slug: "de-m11-special-situations",
  order: 11,
  officialTitle:
    "Verhalten in besonderen Situationen, Folgen von Verstößen gegen Verkehrsvorschriften",
  title: "Emergencies and consequences",
  summary:
    "Breakdowns, accidents, first aid, the Rettungsgasse, emergency vehicles, weather, night driving and penalties.",
  intro:
    "This module covers the moments where doing the wrong thing costs lives, and the penalties that follow breaking the rules. The sequences here are worth memorising, because you will not have time to reason them out.",
  estimatedMinutes: 26,
  lessons: [
    {
      slug: "de-m11-l1-breakdown",
      title: "Breakdown",
      body: "The sequence, in order: **hazard lights on → high-visibility vest on, before leaving the car → warning triangle out → wait behind the crash barrier**.\n\nThe triangle goes about 100 m back outside built-up areas and on the Autobahn, 50 m inside them, and beyond any bend or crest. Never stand between the car and oncoming traffic, and never wait inside the car on a motorway shoulder.",
      keyPoints: [
        "Hazard lights, vest, triangle, then get behind the barrier",
        "100 m outside built-up areas, 50 m inside",
        "Never wait inside a car stopped on the hard shoulder",
      ],
    },
    {
      slug: "de-m11-l2-accident",
      title: "At an accident",
      body: "Secure, call, help — in that order. Securing the scene first prevents a second collision while you are treating someone.\n\n1. Hazard lights, vest, warning triangle\n2. Call **112**\n3. Give first aid: talk to casualties, stop bleeding, keep them warm\n\nOnly move someone if they are in immediate danger. Leaving the scene of an accident you were involved in is a criminal offence (Unfallflucht), even with only parked-car damage.",
      keyPoints: [
        "Secure the scene, call 112, then give first aid",
        "112 is free everywhere in the EU; 110 is the police",
        "Leaving an accident scene is a criminal offence",
      ],
    },
    {
      slug: "de-m11-l3-first-aid",
      title: "First aid duties",
      body: "Giving first aid is a legal duty, and failing to help is punishable. You cannot be prosecuted for making a situation worse while genuinely trying to help.\n\nBasics worth remembering: a casualty who is breathing but unconscious goes into the **recovery position**; someone not breathing needs chest compressions at about 100 to 120 a minute; always keep casualties warm and talk to them.\n\nThe kit in your car must be within its expiry date.",
      keyPoints: [
        "Failing to give first aid is itself an offence",
        "Unconscious but breathing: recovery position",
        "Not breathing: compressions at 100 to 120 per minute",
      ],
    },
    {
      slug: "de-m11-l4-rettungsgasse",
      title: "The Rettungsgasse",
      body: "Form the emergency corridor **as soon as traffic slows to a crawl**, not when you hear a siren.\n\n- Two lanes: left lane far left, right lane far right\n- Three or more: the leftmost lane goes left, all others go right\n\nThe corridor runs between the leftmost lane and the rest. The hard shoulder is not the corridor. Blocking it or driving in it carries heavy fines, points and a ban.",
      keyPoints: [
        "Form it when traffic slows, not when the siren arrives",
        "Leftmost lane left, everyone else right",
        "The hard shoulder is not the Rettungsgasse",
      ],
    },
    {
      slug: "de-m11-l5-emergency-vehicles",
      title: "Emergency vehicles",
      body: "**Blue light with siren** demands immediate free passage: pull aside, make room, and if necessary move carefully into the junction or onto the kerb — without endangering anyone.\n\n**Blue light alone** is a warning that a vehicle is responding; it grants no right of way, but you should still make space.\n\nOrange flashing lights mark working or wide vehicles. They demand care, not priority.",
      keyPoints: [
        "Blue light plus siren: clear the way at once",
        "Blue light alone warns but grants no priority",
        "Orange lights mean caution, not priority",
      ],
    },
    {
      slug: "de-m11-l6-weather",
      title: "Weather",
      body: "**Rain**: braking distances lengthen and aquaplaning starts where water stands — ease off, do not brake hard or steer sharply.\n\n**Ice and snow**: winter tyres are compulsory in wintry conditions (the situational rule), brake gently and in a straight line, and clear all windows and the roof before driving.\n\n**Crosswind** on bridges and open stretches: hold the wheel firmly and expect a push when you leave shelter. **Low sun** dazzles — clean the windscreen inside and out.",
      keyPoints: [
        "Aquaplaning: ease off, do not brake or steer sharply",
        "Winter tyres are required whenever conditions are wintry",
        "Clear snow from the roof too, not just the windows",
      ],
      signIds: ["de-danger-crosswind", "de-danger-slippery-road"],
    },
    {
      slug: "de-m11-l7-night",
      title: "Driving at night",
      body: "You may drive no faster than your headlights let you stop. On dipped beam that is often well under 100 km/h, which is why the Richtgeschwindigkeit assumes good conditions.\n\nUse full beam where no one is dazzled, and dip early for oncoming traffic and when following. If you are dazzled, look to the right-hand edge of your lane and slow down — never into the oncoming lights.",
      keyPoints: [
        "Drive no faster than your lights let you stop",
        "Dip early for oncoming and following traffic",
        "Dazzled: look to the right edge and slow down",
      ],
    },
    {
      slug: "de-m11-l8-penalties",
      title: "Penalties",
      body: "Consequences scale with danger: a fine (Verwarnungsgeld) for minor matters, a formal Bußgeld with points for serious ones, a driving ban of one to three months, and criminal prosecution for drink driving, Unfallflucht or endangering others.\n\nTypical: phone in hand — fine plus 1 point; red light — 2 points, fine and usually a month's ban; 0.5 ‰ alcohol — 2 points, a heavy fine and a ban; over 1.1 ‰ — criminal, with the licence withdrawn.",
      keyPoints: [
        "Points, fines and bans scale with the danger created",
        "Red light: 2 points, a fine and usually a one-month ban",
        "Over 1.1 ‰ is a criminal offence, not an administrative one",
      ],
    },
  ],
  questions: [
    {
      questionText:
        "Your car breaks down on the Autobahn. What is the correct sequence?",
      explanation:
        "Hazard lights, high-vis vest before leaving the car, warning triangle about 100 m back, then wait behind the crash barrier.",
      errorPoints: 5,
      options: [
        {
          text: "Hazard lights, vest, triangle 100 m back, wait behind the barrier",
          isCorrect: true,
        },
        { text: "Stand beside the car and wave at traffic", isCorrect: false },
        {
          text: "Leave the car unlit and walk to the next exit",
          isCorrect: false,
        },
        {
          text: "Triangle 10 m behind and wait inside the car",
          isCorrect: false,
        },
      ],
    },
    {
      questionText:
        "How far behind the vehicle does the warning triangle go inside a built-up area?",
      explanation:
        "About 50 m inside built-up areas, 100 m outside them and on the Autobahn, always beyond a bend or crest.",
      errorPoints: 3,
      options: [
        { text: "About 50 metres", isCorrect: true },
        { text: "Directly behind the bumper", isCorrect: false },
        { text: "About 200 metres", isCorrect: false },
        { text: "On the roof of the car", isCorrect: false },
      ],
    },
    {
      questionText:
        "You are first at an accident with injuries. What comes first?",
      explanation:
        "Secure the scene — hazard lights, vest, triangle — so you are not hit while helping. Then call 112, then give first aid.",
      errorPoints: 5,
      options: [
        {
          text: "Secure the scene, then call 112, then give first aid",
          isCorrect: true,
        },
        {
          text: "Give first aid, then drive casualties to hospital",
          isCorrect: false,
        },
        { text: "Photograph the scene for insurance", isCorrect: false },
        { text: "Wait in your car for the police", isCorrect: false },
      ],
    },
    {
      questionText: "Which number reaches the ambulance service?",
      explanation: "112, free from any phone across the EU. 110 is the police.",
      errorPoints: 3,
      options: [
        { text: "112", isCorrect: true },
        { text: "110", isCorrect: false },
        { text: "911", isCorrect: false },
        { text: "999", isCorrect: false },
      ],
    },
    {
      questionText: "When must you form the Rettungsgasse?",
      explanation:
        "As soon as traffic slows to walking pace or stops — not when an emergency vehicle appears.",
      errorPoints: 5,
      options: [
        { text: "As soon as traffic slows or stops", isCorrect: true },
        { text: "Only when you hear a siren", isCorrect: false },
        { text: "Only when the police instruct it", isCorrect: false },
        { text: "Only on three-lane motorways", isCorrect: false },
      ],
    },
    {
      questionText:
        "On a three-lane carriageway, where does the emergency corridor run?",
      explanation:
        "Between the leftmost lane and the others: the left lane moves left, the middle and right lanes move right.",
      errorPoints: 5,
      options: [
        { text: "Between the leftmost lane and the rest", isCorrect: true },
        { text: "Along the hard shoulder", isCorrect: false },
        { text: "Between the middle and right lanes", isCorrect: false },
        { text: "Wherever space happens to be", isCorrect: false },
      ],
    },
    {
      questionText:
        "An emergency vehicle shows blue lights but no siren. What does that mean?",
      explanation:
        "It warns of a hazard or a vehicle on its way; it does not demand right of way. Stay alert and let it through where you reasonably can.",
      errorPoints: 3,
      options: [
        {
          text: "A warning only — it does not demand right of way",
          isCorrect: true,
        },
        { text: "You must stop immediately", isCorrect: false },
        { text: "The same as blue light with siren", isCorrect: false },
        { text: "You may follow it through red lights", isCorrect: false },
      ],
    },
    {
      questionText:
        "You hit a parked car and the owner is nowhere to be found. What must you do?",
      explanation:
        "Wait a reasonable time, then report it to the police. A note on the windscreen is not enough and leaving is Unfallflucht.",
      errorPoints: 5,
      options: [
        {
          text: "Wait a reasonable time, then report it to the police",
          isCorrect: true,
        },
        {
          text: "Leave a note with your number and drive off",
          isCorrect: false,
        },
        { text: "Drive off if the damage is only cosmetic", isCorrect: false },
        {
          text: "Tell your insurer within a month and nothing more",
          isCorrect: false,
        },
      ],
    },
    {
      questionText: "What should you do if you start to aquaplane?",
      explanation:
        "Ease off the accelerator and hold the wheel straight. Braking or steering sharply removes what little grip remains.",
      errorPoints: 5,
      options: [
        { text: "Ease off and hold the wheel straight", isCorrect: true },
        { text: "Brake hard immediately", isCorrect: false },
        { text: "Steer sharply towards the verge", isCorrect: false },
        { text: "Accelerate to regain grip", isCorrect: false },
      ],
    },
    {
      questionText: "When are winter tyres required in Germany?",
      explanation:
        "Whenever conditions are wintry — ice, snow, slush or frost. It is a situational rule, not a fixed date.",
      errorPoints: 4,
      options: [
        { text: "Whenever conditions are actually wintry", isCorrect: true },
        { text: "From 1 November to 31 March, always", isCorrect: false },
        { text: "Only above 1,000 metres altitude", isCorrect: false },
        { text: "They are never compulsory", isCorrect: false },
      ],
    },
    {
      questionText: "Snow is lying on the roof of your car. May you drive off?",
      explanation:
        "No. Snow must be cleared from the roof as well as the windows, because it slides onto your windscreen or into the car behind.",
      errorPoints: 4,
      options: [
        { text: "No — the roof must be cleared too", isCorrect: true },
        { text: "Yes, only the windows matter", isCorrect: false },
        { text: "Yes, if you drive slowly", isCorrect: false },
        { text: "Yes, if it is not snowing any more", isCorrect: false },
      ],
    },
    {
      questionText: "Oncoming headlights dazzle you. What do you do?",
      explanation:
        "Look towards the right edge of your lane and slow down. Looking into the lights blinds you for several seconds.",
      errorPoints: 4,
      options: [
        {
          text: "Look to the right edge of your lane and slow down",
          isCorrect: true,
        },
        { text: "Flash your full beam back", isCorrect: false },
        { text: "Close one eye and continue", isCorrect: false },
        { text: "Brake hard immediately", isCorrect: false },
      ],
    },
    {
      questionText: "How fast may you drive at night?",
      explanation:
        "No faster than you can stop within the distance your headlights illuminate — often well below the signed limit on dipped beam.",
      errorPoints: 4,
      options: [
        {
          text: "No faster than you can stop within your headlight range",
          isCorrect: true,
        },
        { text: "Always the signed limit", isCorrect: false },
        { text: "20 km/h below the limit", isCorrect: false },
        { text: "As fast as in daylight with modern lights", isCorrect: false },
      ],
    },
    {
      questionText: "Is giving first aid at an accident optional?",
      explanation:
        "No. Failing to help is a punishable offence, and you cannot be prosecuted for honest attempts that go wrong.",
      errorPoints: 4,
      options: [
        { text: "No — failing to help is itself an offence", isCorrect: true },
        { text: "Yes, unless you are a doctor", isCorrect: false },
        { text: "Yes, if you might make things worse", isCorrect: false },
        { text: "Only compulsory for professional drivers", isCorrect: false },
      ],
    },
    {
      questionText: "A casualty is unconscious but breathing. What do you do?",
      explanation:
        "Put them in the recovery position so the airway stays clear, keep them warm, and monitor breathing until help arrives.",
      errorPoints: 4,
      options: [
        {
          text: "Place them in the recovery position and keep them warm",
          isCorrect: true,
        },
        { text: "Sit them upright against the car", isCorrect: false },
        { text: "Give them water", isCorrect: false },
        { text: "Start chest compressions", isCorrect: false },
      ],
    },
    {
      questionText: "What penalty follows running a red light?",
      explanation:
        "Two points, a fine and usually a one-month driving ban. In the probation period it also triggers an Aufbauseminar.",
      errorPoints: 4,
      options: [
        {
          text: "2 points, a fine and usually a one-month ban",
          isCorrect: true,
        },
        { text: "A warning only", isCorrect: false },
        { text: "Immediate withdrawal of the licence", isCorrect: false },
        { text: "Nothing if no one was endangered", isCorrect: false },
      ],
    },
  ],
};
