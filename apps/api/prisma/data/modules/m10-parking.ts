import type { SeedModule } from "../types";

export const module10: SeedModule = {
  slug: "de-m10-parking",
  order: 10,
  officialTitle: "Ruhender Verkehr",
  title: "Stopping and parking",
  summary:
    "The difference between Halten and Parken, where each is banned, and how to park legally.",
  intro:
    "Most drivers meet this module through a fine. German parking rules are precise about distances, and the difference between stopping and parking changes what is allowed.",
  estimatedMinutes: 16,
  lessons: [
    {
      slug: "de-m10-l1-halten-parken",
      title: "Halten versus Parken",
      body: "**Halten** is a voluntary stop where you stay with the vehicle and move on within three minutes. **Parken** is anything longer, or any stop where you leave the vehicle.\n\nSo stepping out to post a letter is parking, even for 30 seconds. A stop forced by traffic — a queue, a red light — is neither, and is always allowed.",
      keyPoints: [
        "Leaving the vehicle makes it parking, however brief",
        "Over three minutes is parking",
        "A stop forced by traffic is neither and is always permitted",
      ],
    },
    {
      slug: "de-m10-l2-where-banned",
      title: "Where stopping is forbidden",
      body: "Stopping — and therefore parking too — is prohibited:\n\n- on the Autobahn and Kraftfahrstraße, except in an emergency\n- at narrow or blind sections of road\n- at level crossings\n- in front of and on pedestrian crossings\n- at taxi ranks and bus stops where marked\n- where a two-stripe no-stopping sign applies",
      keyPoints: [
        "Never stop on the Autobahn except in a genuine emergency",
        "No stopping at crossings, narrow sections or level crossings",
        "The two-stripe sign forbids stopping, not just parking",
      ],
      signIds: ["de-prohibition-no-stopping", "de-prohibition-no-parking"],
    },
    {
      slug: "de-m10-l3-distances",
      title: "The distances",
      body: "The numbers that produce most fines:\n\n- **5 m** from an intersection or junction, measured from the start of the kerb curve\n- **5 m** before a pedestrian crossing, and no parking on it\n- **10 m** before a traffic light, STOP or priority sign if you would hide it\n- **15 m** either side of a bus-stop sign\n- always clear of lowered kerbs, driveways and fire-service access",
      keyPoints: [
        "5 m from junctions, 15 m from a bus stop",
        "10 m before a light or sign if parking would hide it",
        "Never block a lowered kerb or a driveway",
      ],
    },
    {
      slug: "de-m10-l4-how",
      title: "Parking correctly",
      body: "Park on the **right** in the direction of travel. Parking on the left is only allowed in one-way streets, or where tram tracks occupy the right side.\n\nLeave enough road for others to pass — about 3 m of free lane. On a hill, turn the wheels: towards the kerb when facing downhill, away when facing uphill, and always apply the handbrake and engage a gear.",
      keyPoints: [
        "Park on the right, except in one-way streets",
        "Leave about 3 m of free carriageway",
        "On hills turn the wheels and leave it in gear",
      ],
    },
    {
      slug: "de-m10-l5-permits",
      title: "Discs, meters and lights",
      body: "A blue P sign permits parking; the plate underneath sets the conditions — a **Parkscheibe** set to your arrival time rounded up to the next half hour, a ticket machine, residents only, or a time window.\n\nOn unlit roads outside built-up areas, parking lights or side lights must be shown so the car is visible. Inside built-up areas it is normally unnecessary where street lighting makes the car visible.",
      keyPoints: [
        "Set the parking disc to arrival time, rounded up to the half hour",
        "Always read the plate under the P sign",
        "On unlit roads show parking lights so the car can be seen",
      ],
      signIds: ["de-information-parking", "de-additional-parking-disc"],
    },
  ],
  questions: [
    {
      questionText: "When does stopping become parking?",
      explanation:
        "If you leave the vehicle, or stop voluntarily for more than three minutes.",
      errorPoints: 3,
      options: [
        {
          text: "If you leave the vehicle or stop over three minutes",
          isCorrect: true,
        },
        { text: "Only after 15 minutes", isCorrect: false },
        { text: "They are legally identical", isCorrect: false },
        { text: "Only in marked bays", isCorrect: false },
      ],
    },
    {
      questionText: "How close to a junction may you park?",
      explanation:
        "No closer than 5 m, measured from the start of the kerb curve, because closer parking hides crossing traffic.",
      errorPoints: 4,
      options: [
        { text: "No closer than 5 metres", isCorrect: true },
        { text: "No closer than 1 metre", isCorrect: false },
        { text: "No closer than 15 metres", isCorrect: false },
        { text: "Parking at junctions is unrestricted", isCorrect: false },
      ],
    },
    {
      questionText: "How much space must you keep clear of a bus-stop sign?",
      explanation:
        "15 m on either side, so buses can reach the kerb and passengers can board safely.",
      errorPoints: 3,
      options: [
        { text: "15 metres either side", isCorrect: true },
        { text: "5 metres either side", isCorrect: false },
        { text: "No restriction applies", isCorrect: false },
        { text: "30 metres either side", isCorrect: false },
      ],
    },
    {
      questionText: "May you park in front of a lowered kerb?",
      explanation:
        "No. Lowered kerbs serve wheelchair users, prams and property access, and parking there is a common towing offence.",
      errorPoints: 3,
      options: [
        { text: "No — it is prohibited", isCorrect: true },
        { text: "Yes, for up to three minutes", isCorrect: false },
        { text: "Yes, if you stay in the car", isCorrect: false },
        { text: "Yes, outside business hours", isCorrect: false },
      ],
    },
    {
      questionText: "On which side of a two-way street do you park?",
      explanation:
        "On the right in the direction of travel. Left-side parking is only allowed in one-way streets or where tram tracks block the right.",
      errorPoints: 3,
      options: [
        { text: "On the right in the direction of travel", isCorrect: true },
        { text: "On either side", isCorrect: false },
        { text: "On the left, facing traffic", isCorrect: false },
        { text: "Wherever a gap exists", isCorrect: false },
      ],
    },
    {
      questionText: "How much free carriageway must remain when you park?",
      explanation:
        "Enough for other traffic to pass — in practice about 3 m, so emergency vehicles and refuse lorries get through.",
      errorPoints: 3,
      options: [
        { text: "About 3 metres", isCorrect: true },
        { text: "About 1 metre", isCorrect: false },
        { text: "About 6 metres", isCorrect: false },
        { text: "No minimum applies", isCorrect: false },
      ],
    },
    {
      questionText:
        "You park facing downhill. Which way do you turn the front wheels?",
      explanation:
        "Towards the kerb, so the car rolls into it rather than into the road if the brake fails.",
      errorPoints: 3,
      options: [
        { text: "Towards the kerb", isCorrect: true },
        { text: "Away from the kerb", isCorrect: false },
        { text: "Straight ahead", isCorrect: false },
        { text: "It makes no difference", isCorrect: false },
      ],
    },
    {
      questionText:
        "A blue P sign has a parking-disc plate below it. What must you do?",
      explanation:
        "Display a Parkscheibe set to your arrival time rounded up to the next half hour, and respect the maximum duration shown.",
      errorPoints: 3,
      options: [
        { text: "Display a disc set to your arrival time", isCorrect: true },
        { text: "Pay at a machine instead", isCorrect: false },
        { text: "Park without any limit", isCorrect: false },
        { text: "Park only if you live nearby", isCorrect: false },
      ],
    },
    {
      questionText: "Where is stopping always prohibited, even briefly?",
      explanation:
        "On the Autobahn and Kraftfahrstraße except in an emergency, at level crossings, and on narrow or blind sections.",
      errorPoints: 5,
      options: [
        { text: "On the Autobahn, except in an emergency", isCorrect: true },
        { text: "In every residential street", isCorrect: false },
        { text: "Outside built-up areas generally", isCorrect: false },
        { text: "Only at taxi ranks", isCorrect: false },
      ],
    },
    {
      questionText:
        "You stop in a queue of traffic on a no-stopping stretch. Is that an offence?",
      explanation:
        "No. A stop forced by traffic conditions is neither Halten nor Parken and is always permitted.",
      errorPoints: 3,
      options: [
        {
          text: "No — a traffic-forced stop is always allowed",
          isCorrect: true,
        },
        { text: "Yes, it is a parking offence", isCorrect: false },
        { text: "Yes, unless you use hazard lights", isCorrect: false },
        { text: "Only if you stay over three minutes", isCorrect: false },
      ],
    },
  ],
};
