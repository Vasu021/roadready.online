import type { SeedModule } from "../types";

export const module02: SeedModule = {
  slug: "de-m02-human-risk",
  order: 2,
  officialTitle: "Risikofaktor Mensch",
  title: "The human risk factor",
  summary:
    "Reaction time, stopping distances, distraction and the way emotion changes how you drive.",
  intro:
    "Vehicles rarely fail. People do. This module covers the arithmetic of stopping a car and the psychology that makes drivers misjudge it — the two things that decide whether a situation becomes an accident.",
  estimatedMinutes: 22,
  lessons: [
    {
      slug: "de-m02-l1-reaction",
      title: "Reaction time",
      body: "Between seeing a hazard and touching the brake, about **one second** passes for an alert driver. Tired, distracted or after alcohol it is noticeably longer.\n\nIn that second the car keeps going at full speed. The rule of thumb: reaction distance in metres = speed ÷ 10 × 3.\n\nAt 50 km/h that is 15 metres before the brakes even bite. At 100 km/h it is 30 metres.",
      keyPoints: [
        "Reaction distance = speed ÷ 10 × 3, in metres",
        "50 km/h → 15 m, 100 km/h → 30 m before braking starts",
        "Tiredness, alcohol and phones all stretch that second",
      ],
    },
    {
      slug: "de-m02-l2-braking",
      title: "Braking distance and the full stop",
      body: "Braking distance grows with the **square** of speed. Double the speed and you need four times the distance.\n\n- Braking distance = (speed ÷ 10)²\n- Emergency braking = half of that\n- Stopping distance = reaction distance + braking distance\n\nAt 50 km/h: 15 + 25 = **40 metres**. At 100 km/h: 30 + 100 = **130 metres**. On a wet road, add roughly half again.\n\nThis is why a 20 km/h difference matters so much near a school.",
      keyPoints: [
        "Braking distance = (speed ÷ 10)², so it quadruples when speed doubles",
        "Stopping distance at 50 km/h is about 40 m; at 100 km/h about 130 m",
        "Emergency braking halves the braking distance, not the reaction distance",
      ],
    },
    {
      slug: "de-m02-l3-distraction",
      title: "Distraction",
      body: "Using a phone in your hand while driving costs a fine, a point in Flensburg, and in the probation period an extension and a seminar. The rule covers holding it at all — at a red light with the engine running too.\n\nBut the legal part is the smaller problem. Reading a message takes your eyes off the road for about three seconds. At 50 km/h that is 40 metres driven blind.\n\nSatnavs, food, drinks, passengers and loud arguments all do the same thing. The brain does not multitask; it switches, and each switch costs time.",
      keyPoints: [
        "Holding a phone while driving is an offence, including at a red light",
        "Three seconds reading a message at 50 km/h is 40 blind metres",
        "The brain switches between tasks rather than doing both",
      ],
    },
    {
      slug: "de-m02-l4-emotion",
      title: "Emotion, stress and risk",
      body: "Anger, time pressure and distress measurably worsen driving: shorter following distances, later braking, more overtaking. Most drivers believe the opposite about themselves.\n\n**Risk compensation** is the trap behind modern cars. ABS, ESP, lane assist and good tyres make a car safer, and drivers respond by going faster and following closer, spending the safety margin they were given.\n\nPeer pressure works the same way, which is why novice drivers crash more with friends in the car than alone.",
      keyPoints: [
        "Anger and time pressure shorten distances and delay braking",
        "Safety systems get spent on speed unless you decide otherwise",
        "Novice drivers are at highest risk with passengers of their own age",
      ],
    },
    {
      slug: "de-m02-l5-perception",
      title: "What you actually see",
      body: "Sharp vision covers a very narrow cone — roughly the width of your thumb at arm's length. Everything else is peripheral: good at movement, poor at detail and almost blind to colour.\n\nThat is why scanning matters. Eyes should move constantly between the far distance, the near road, the mirrors and the edges, rather than fixing on the car ahead.\n\nAt speed the cone of attention narrows further (tunnel vision), which is exactly when hazards appear from the sides.",
      keyPoints: [
        "Sharp vision is a narrow cone; the rest detects movement only",
        "Scan far, near, mirrors and edges — do not fixate on the car ahead",
        "Higher speed narrows attention just as side hazards matter more",
      ],
    },
    {
      slug: "de-m02-l6-hazard",
      title: "Reading a situation early",
      body: "Experienced drivers are not faster at reacting; they react **sooner**, because they recognise the pattern before it develops.\n\nPractical habits that buy time:\n\n- Look through the car in front, not at it\n- Watch wheels, not bodywork — wheels show intention first\n- Treat a ball, a parked ice-cream van or a bus at a stop as a child warning\n- Cover the brake wherever your view is blocked\n\nThe aim is to arrive at the hazard already slow, instead of braking hard once it appears.",
      keyPoints: [
        "Wheels reveal another driver's intention before the body of the car does",
        "A ball or a stopped bus is a children warning",
        "Cover the brake wherever the view is restricted",
      ],
    },
  ],
  questions: [
    {
      questionText:
        "What is your reaction distance at 100 km/h under normal conditions?",
      explanation:
        "Reaction distance = speed ÷ 10 × 3 = 10 × 3 = 30 metres, before braking even begins.",
      errorPoints: 4,
      options: [
        { text: "About 30 metres", isCorrect: true },
        { text: "About 10 metres", isCorrect: false },
        { text: "About 100 metres", isCorrect: false },
        { text: "About 15 metres", isCorrect: false },
      ],
    },
    {
      questionText:
        "You double your speed from 50 to 100 km/h. What happens to the braking distance?",
      explanation:
        "Braking distance grows with the square of speed: (5)² = 25 m becomes (10)² = 100 m. Four times as far.",
      errorPoints: 5,
      options: [
        { text: "It becomes four times as long", isCorrect: true },
        { text: "It doubles", isCorrect: false },
        { text: "It becomes three times as long", isCorrect: false },
        {
          text: "It stays roughly the same with modern brakes",
          isCorrect: false,
        },
      ],
    },
    {
      questionText: "What is the normal stopping distance at 50 km/h?",
      explanation:
        "Reaction 15 m plus braking 25 m = about 40 metres. On a wet road, considerably more.",
      errorPoints: 4,
      options: [
        { text: "About 40 metres", isCorrect: true },
        { text: "About 25 metres", isCorrect: false },
        { text: "About 15 metres", isCorrect: false },
        { text: "About 60 metres", isCorrect: false },
      ],
    },
    {
      questionText:
        "May you hold your mobile phone while stopped at a red light with the engine running?",
      explanation:
        "No. The ban covers holding the device whenever the engine is running. Only with the engine switched off, or in a stationary parked car, is it allowed.",
      errorPoints: 4,
      options: [
        {
          text: "No — the ban applies while the engine is running",
          isCorrect: true,
        },
        { text: "Yes, because the car is not moving", isCorrect: false },
        { text: "Yes, for calls but not for messages", isCorrect: false },
        { text: "Yes, if you use it for under five seconds", isCorrect: false },
      ],
    },
    {
      questionText: "What is risk compensation?",
      explanation:
        "Drivers respond to safer cars by driving faster and closer, spending the safety margin the technology provided.",
      errorPoints: 3,
      options: [
        {
          text: "Driving faster or closer because the car feels safer",
          isCorrect: true,
        },
        { text: "Insurance paying for damage you cause", isCorrect: false },
        { text: "Braking earlier in bad weather", isCorrect: false },
        { text: "Compensating other drivers after a crash", isCorrect: false },
      ],
    },
    {
      questionText:
        "A ball rolls into the road ahead of you. What must you expect?",
      explanation:
        "A child running after it, usually without looking. Brake immediately and be ready to stop — do not merely steer around the ball.",
      errorPoints: 5,
      options: [
        { text: "A child following it, without looking", isCorrect: true },
        { text: "Nothing in particular — steer around it", isCorrect: false },
        { text: "That the ball will roll back by itself", isCorrect: false },
        { text: "That another driver will stop first", isCorrect: false },
      ],
    },
    {
      questionText: "How does emergency braking change the distances?",
      explanation:
        "It roughly halves the braking distance. The reaction distance is unaffected, because it happens before you touch the pedal.",
      errorPoints: 3,
      options: [
        {
          text: "It halves the braking distance; reaction distance is unchanged",
          isCorrect: true,
        },
        { text: "It halves the total stopping distance", isCorrect: false },
        { text: "It halves the reaction distance", isCorrect: false },
        {
          text: "It makes no measurable difference with ABS",
          isCorrect: false,
        },
      ],
    },
    {
      questionText:
        "Why is it dangerous to stare at the vehicle directly ahead?",
      explanation:
        "You lose the wider picture. Scan through and around it so developing hazards reach you early, not at the moment they become urgent.",
      errorPoints: 3,
      options: [
        {
          text: "You stop noticing the wider situation developing ahead",
          isCorrect: true,
        },
        { text: "Your eyes tire more quickly", isCorrect: false },
        { text: "The car in front is the only real hazard", isCorrect: false },
        { text: "It is illegal to look at other vehicles", isCorrect: false },
      ],
    },
    {
      questionText:
        "You are running late and feel irritated. How does that affect your driving?",
      explanation:
        "Measurably for the worse: shorter gaps, later braking, riskier overtaking — while your own judgement of your driving stays unchanged.",
      errorPoints: 3,
      options: [
        {
          text: "Distances shorten and braking comes later, without you noticing",
          isCorrect: true,
        },
        { text: "It improves concentration", isCorrect: false },
        { text: "It has no measurable effect", isCorrect: false },
        { text: "It only matters on the Autobahn", isCorrect: false },
      ],
    },
    {
      questionText:
        "How long do you take your eyes off the road to read a short message?",
      explanation:
        "About three seconds — roughly 40 metres at 50 km/h, driven completely blind.",
      errorPoints: 4,
      options: [
        {
          text: "About three seconds, which is 40 m at 50 km/h",
          isCorrect: true,
        },
        { text: "Under half a second", isCorrect: false },
        { text: "About one second", isCorrect: false },
        { text: "It does not matter if traffic is light", isCorrect: false },
      ],
    },
    {
      questionText: "Where is your vision sharp enough to read detail?",
      explanation:
        "Only in a narrow cone, about the width of a thumb at arm's length. The rest of the visual field detects movement but little detail.",
      errorPoints: 2,
      options: [
        {
          text: "In a narrow cone — roughly a thumb's width at arm's length",
          isCorrect: true,
        },
        { text: "Across the whole windscreen", isCorrect: false },
        { text: "Everywhere except directly ahead", isCorrect: false },
        { text: "Only in bright daylight", isCorrect: false },
      ],
    },
    {
      questionText:
        "Why do novice drivers crash more often with friends in the car?",
      explanation:
        "Peer presence raises risk-taking and splits attention. It is one of the strongest statistical risk factors for new drivers.",
      errorPoints: 3,
      options: [
        {
          text: "Peer pressure raises risk-taking and divides attention",
          isCorrect: true,
        },
        {
          text: "Extra weight makes the car harder to brake",
          isCorrect: false,
        },
        { text: "Passengers block the mirrors", isCorrect: false },
        {
          text: "They do not — driving with friends is safer",
          isCorrect: false,
        },
      ],
    },
  ],
};
