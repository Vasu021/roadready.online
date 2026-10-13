import type { SeedModule } from "../types";

export const module01: SeedModule = {
  slug: "de-m01-personal-requirements",
  order: 1,
  officialTitle: "Persönliche Voraussetzungen",
  title: "Are you fit to drive?",
  summary:
    "Eyesight, alcohol, drugs, medication and tiredness — the conditions you must meet before you turn the key.",
  intro:
    "Every rule in this course assumes one thing: that the person driving is fit to drive. German law is strict here, and the penalties are the heaviest in the whole catalogue. This module covers what the law demands of you personally, before any question of signs or priority comes up.",
  estimatedMinutes: 18,
  lessons: [
    {
      slug: "de-m01-l1-eyesight",
      title: "Eyesight and health",
      body: "You must be able to see well enough to drive safely, and you must prove it. An eyesight test (Sehtest) is compulsory before you get a class-B licence, and you need at least **70 per cent vision** in the better eye, with glasses or lenses if you use them.\n\nIf your licence says you need glasses, driving without them is an offence and your insurance can refuse to pay. Keep a spare pair in the car.\n\nHealth problems that affect driving — epilepsy, severe diabetes, heart conditions, sleep apnoea — must be assessed. You are legally responsible for knowing whether you are fit on any given day.",
      keyPoints: [
        "Sehtest before the licence: at least 70 per cent vision in the better eye",
        "Glasses noted on the licence must actually be worn — keep a spare pair",
        "You, not your doctor, are responsible for judging fitness each day",
      ],
    },
    {
      slug: "de-m01-l2-alcohol",
      title: "Alcohol limits",
      body: "Germany has three thresholds, and which one applies depends on who you are.\n\n- **0.0 ‰** — novice drivers in the probation period and everyone under 21. No alcohol at all.\n- **0.5 ‰** — the general limit. Driving at or above it is an administrative offence: fine, points and a one-month ban.\n- **0.3 ‰** — enough to be prosecuted if you are involved in an accident or drive noticeably badly (relative Fahruntüchtigkeit).\n- **1.1 ‰** — absolute unfitness. A criminal offence regardless of how you drove.\n\nAlcohol leaves the body at roughly 0.1 to 0.15 ‰ per hour. Nothing speeds that up — not coffee, not a shower, not a walk. After a heavy evening you can still be over the limit the next morning.",
      keyPoints: [
        "0.0 ‰ in the probation period and under 21 — no exceptions",
        "0.5 ‰ general limit; 0.3 ‰ is already punishable if you drive badly",
        "Only time reduces alcohol: about 0.1 ‰ an hour",
      ],
    },
    {
      slug: "de-m01-l3-drugs-medication",
      title: "Drugs and medication",
      body: "For illegal drugs the limit is effectively zero. Any detectable amount of cannabis, cocaine, amphetamines or opiates means a fine, points and a ban, and your licence can be withdrawn until you prove continued abstinence.\n\nPrescribed medicine is not automatically safe either. Painkillers, antihistamines, antidepressants, sleeping tablets and cough syrup can all impair reaction time. The package insert tells you; so does the pharmacist. If it says it may affect your ability to operate machinery, that includes a car.\n\nThe legal test is the same in every case: if your driving is impaired, you are liable, whatever the substance and whoever prescribed it.",
      keyPoints: [
        "Illegal drugs: effectively a zero limit, with the licence at risk",
        "Prescribed medicine can impair you just as much — read the insert",
        "Impairment is what matters legally, not whether the drug was legal",
      ],
    },
    {
      slug: "de-m01-l4-tiredness",
      title: "Tiredness and attention",
      body: "Fatigue causes a large share of serious motorway crashes, and it builds without you noticing. Microsleeps of two or three seconds are enough to cross a full lane at 100 km/h.\n\nThe warning signs are reliable: heavy eyelids, drifting within the lane, missing a sign, not remembering the last few kilometres, fidgeting to stay awake. Once you notice them you are already impaired.\n\nThe only effective response is to stop. Park somewhere safe, sleep 15 to 20 minutes, and ideally drink a coffee before the nap so the caffeine arrives as you wake. Open windows and loud music do nothing.",
      keyPoints: [
        "A three-second microsleep at 100 km/h covers over 80 metres blind",
        "Drifting, missing signs and memory gaps mean you are already too tired",
        "The only fix is a short sleep — fresh air and music do not work",
      ],
    },
    {
      slug: "de-m01-l5-responsibility",
      title: "Your responsibility behind the wheel",
      body: "German traffic law rests on two general duties that come before every specific rule.\n\n**Section 1 StVO** requires constant care and mutual consideration: you must behave so that nobody else is harmed, endangered, obstructed or unreasonably inconvenienced. It applies even where no specific rule covers the situation.\n\nAlongside it sits **Vertrauensgrundsatz**, the principle of trust: you may assume others will obey the rules — but not when you can see that someone will not, and not around children, elderly or confused people, where you must expect mistakes.\n\nThat pairing explains most of the answers in this course. You drive to the rules, and you drive expecting other people's errors.",
      keyPoints: [
        "Section 1 StVO: constant care and mutual consideration, always",
        "You may trust others to follow the rules — unless you can see otherwise",
        "Around children and the elderly, expect mistakes and slow down",
      ],
    },
  ],
  questions: [
    {
      questionText:
        "You are in the two-year probation period. How much alcohol may you have in your blood when driving?",
      explanation:
        "The probation period and anyone under 21 carry a 0.0 ‰ limit. There is no allowance for a single beer.",
      errorPoints: 5,
      options: [
        { text: "None at all — the limit is 0.0 ‰", isCorrect: true },
        { text: "Up to 0.3 ‰", isCorrect: false },
        { text: "Up to 0.5 ‰", isCorrect: false },
        { text: "Up to 0.8 ‰", isCorrect: false },
      ],
    },
    {
      questionText:
        "What is the general blood alcohol limit for experienced drivers in Germany?",
      explanation:
        "0.5 ‰ is the general limit. From 0.3 ‰ you can already be prosecuted if you cause an accident or drive conspicuously.",
      errorPoints: 4,
      options: [
        { text: "0.5 ‰", isCorrect: true },
        { text: "0.8 ‰", isCorrect: false },
        { text: "0.3 ‰", isCorrect: false },
        { text: "1.1 ‰", isCorrect: false },
      ],
    },
    {
      questionText: "How quickly does the body break down alcohol?",
      explanation:
        "Roughly 0.1 to 0.15 ‰ an hour, and nothing accelerates it. After a late night you may still be over the limit in the morning.",
      errorPoints: 4,
      options: [
        {
          text: "About 0.1 ‰ per hour, and nothing speeds it up",
          isCorrect: true,
        },
        { text: "About 0.5 ‰ per hour", isCorrect: false },
        {
          text: "Faster if you drink coffee and take a cold shower",
          isCorrect: false,
        },
        { text: "Faster if you eat a large meal", isCorrect: false },
      ],
    },
    {
      questionText:
        "Your licence records that you need glasses. You drive without them. What applies?",
      explanation:
        "The requirement is part of the licence. Driving without the glasses is an offence and your insurer can reduce or refuse payment after a crash.",
      errorPoints: 4,
      options: [
        {
          text: "It is an offence and can affect your insurance cover",
          isCorrect: true,
        },
        { text: "It is allowed on short journeys", isCorrect: false },
        { text: "It is allowed in daylight", isCorrect: false },
        {
          text: "It is only a problem if you cause an accident",
          isCorrect: false,
        },
      ],
    },
    {
      questionText:
        "You notice you are drifting in your lane and cannot recall the last few kilometres. What do you do?",
      explanation:
        "Those are classic fatigue signs and you are already impaired. Stop somewhere safe and sleep 15 to 20 minutes; fresh air and music do not restore attention.",
      errorPoints: 5,
      options: [
        {
          text: "Stop at the next safe place and sleep briefly",
          isCorrect: true,
        },
        { text: "Open the window and turn up the radio", isCorrect: false },
        { text: "Drive faster to arrive sooner", isCorrect: false },
        {
          text: "Carry on but increase your following distance",
          isCorrect: false,
        },
      ],
    },
    {
      questionText: "What minimum eyesight is required for a class-B licence?",
      explanation:
        "The Sehtest requires at least 70 per cent vision in the better eye, corrected if necessary. Failing it means a full examination by an eye specialist.",
      errorPoints: 2,
      options: [
        {
          text: "70 per cent in the better eye, corrected if needed",
          isCorrect: true,
        },
        { text: "100 per cent in both eyes, uncorrected", isCorrect: false },
        { text: "50 per cent in either eye", isCorrect: false },
        { text: "No minimum is defined", isCorrect: false },
      ],
    },
    {
      questionText:
        "Your doctor prescribes a medicine whose insert warns it may affect your reactions. What follows?",
      explanation:
        "A prescription is not a defence. If the medicine impairs you, driving is an offence and you are liable for any damage.",
      errorPoints: 4,
      options: [
        {
          text: "You must not drive while it impairs you, prescription or not",
          isCorrect: true,
        },
        {
          text: "You may drive because a doctor prescribed it",
          isCorrect: false,
        },
        { text: "You may drive at reduced speed", isCorrect: false },
        { text: "You may drive if you feel fine", isCorrect: false },
      ],
    },
    {
      questionText:
        "What does the Vertrauensgrundsatz (principle of trust) allow you to assume?",
      explanation:
        "You may assume others follow the rules — but not when their behaviour shows otherwise, and not around children, the elderly or confused people.",
      errorPoints: 3,
      options: [
        {
          text: "That others obey the rules, unless you can see that they will not",
          isCorrect: true,
        },
        { text: "That others will always give way to you", isCorrect: false },
        {
          text: "That children behave like adults in traffic",
          isCorrect: false,
        },
        { text: "That you need not watch other road users", isCorrect: false },
      ],
    },
    {
      questionText:
        "What does section 1 of the StVO require of every road user?",
      explanation:
        "Constant care and mutual consideration: nobody may be harmed, endangered, obstructed or unreasonably inconvenienced. It applies even where no specific rule exists.",
      errorPoints: 3,
      options: [
        { text: "Constant care and mutual consideration", isCorrect: true },
        { text: "Driving as fast as the limit allows", isCorrect: false },
        { text: "Priority for larger vehicles", isCorrect: false },
        { text: "Obedience only to posted signs", isCorrect: false },
      ],
    },
    {
      questionText:
        "A three-second microsleep at 100 km/h. How far do you travel blind?",
      explanation:
        "100 km/h is about 28 metres a second, so three seconds is over 80 metres — far enough to leave the road or cross into oncoming traffic.",
      errorPoints: 4,
      options: [
        { text: "More than 80 metres", isCorrect: true },
        { text: "About 10 metres", isCorrect: false },
        { text: "About 30 metres", isCorrect: false },
        { text: "About 50 metres", isCorrect: false },
      ],
    },
  ],
};
