import type { FC } from "react";
import type { SignProps } from "./primitives";
import * as D from "./danger";
import * as P from "./priority";
import * as R from "./prohibition";
import * as M from "./mandatory";
import * as I from "./information";
import * as A from "./additional";
import * as S from "./signals";
import * as K from "./markings";
import * as X from "./combinations";

export type { SignProps } from "./primitives";
export { SIGN_COLORS } from "./primitives";

/**
 * The six StVO sign families, plus three groups a learner also has to read on
 * a real road: light signals, carriageway markings and sign combinations.
 */
export type SignCategory =
  | "danger"
  | "priority"
  | "prohibition"
  | "mandatory"
  | "information"
  | "additional"
  | "signal"
  | "marking"
  | "combination";

export interface SignMeta {
  /** Stable id, e.g. "de-danger-crossroads". */
  id: string;
  component: FC<SignProps>;
  nameDE: string;
  nameEN: string;
  category: SignCategory;
  /** What the sign means. */
  description: string;
  /** What you actually have to do when you see it. */
  explanation: string;
  /** StVO reference, where one exists. */
  legalBasis?: string;
  countryCode: string;
}

export const CATEGORY_LABELS: Record<SignCategory, string> = {
  danger: "Danger",
  priority: "Priority",
  prohibition: "Prohibition",
  mandatory: "Mandatory",
  information: "Information",
  additional: "Supplementary",
  signal: "Signals",
  marking: "Road Markings",
  combination: "Combinations",
};

export const CATEGORY_DESCRIPTIONS: Record<SignCategory, string> = {
  danger:
    "Red triangles. They warn of a hazard ahead and never give an order — slow down and stay ready.",
  priority:
    "These decide who goes first: yield, stop, priority road and the narrow-passage pair.",
  prohibition:
    "Round signs with a red ring. They forbid something: entry, overtaking, parking or a speed.",
  mandatory: "Round blue signs. They order a direction or a path you must use.",
  information:
    "Mostly rectangular. They inform: motorways, zones, one-way streets and services.",
  additional:
    "Small white plates. They never stand alone — they narrow or extend the sign above them.",
  signal:
    "Light signals override every sign at the same place. Learn each phase and the arrow variants.",
  marking:
    "Paint on the carriageway carries the same legal force as a sign on a post.",
  combination:
    "What you really meet on the road: a sign plus the plate that changes its meaning.",
};

const DE = "DE";

export const DE_SIGNS: SignMeta[] = [
  // ── Gefahrzeichen ─────────────────────────────────────────────────────────
  {
    id: "de-danger-general",
    component: D.DangerGeneral,
    nameDE: "Gefahrstelle",
    nameEN: "General danger",
    category: "danger",
    description:
      "A hazard that has no sign of its own — anything from a damaged surface to an unusual layout.",
    explanation:
      "Reduce speed, increase your following distance and read the road ahead. A supplementary plate often names the actual hazard.",
    legalBasis: "StVO Zeichen 101",
    countryCode: DE,
  },
  {
    id: "de-danger-crossroads",
    component: D.DangerCrossroads,
    nameDE: "Kreuzung oder Einmündung",
    nameEN: "Crossroads or junction",
    category: "danger",
    description:
      "A crossroads ahead where neither road is signed as the priority road, so right-before-left applies.",
    explanation:
      "Slow down and look right. The vehicle coming from your right has priority — be ready to stop even if you are going straight on.",
    legalBasis: "StVO Zeichen 102",
    countryCode: DE,
  },
  {
    id: "de-danger-junction-right",
    component: D.DangerJunctionRight,
    nameDE: "Einmündung von rechts",
    nameEN: "T-junction from the right",
    category: "danger",
    description:
      "A side road joins from the right and right-before-left applies at it.",
    explanation:
      "Expect vehicles emerging from the right with priority. Cover the brake and check the junction mouth early.",
    legalBasis: "StVO Zeichen 102",
    countryCode: DE,
  },
  {
    id: "de-danger-junction-left",
    component: D.DangerJunctionLeft,
    nameDE: "Einmündung von links",
    nameEN: "T-junction from the left",
    category: "danger",
    description: "A side road joins from the left at an unmarked junction.",
    explanation:
      "You have priority over the joining road here, but approach ready to react — drivers often misjudge the rule.",
    legalBasis: "StVO Zeichen 102",
    countryCode: DE,
  },
  {
    id: "de-danger-curve-right",
    component: D.DangerCurveRight,
    nameDE: "Kurve rechts",
    nameEN: "Curve to the right",
    category: "danger",
    description: "A bend to the right that is sharper than it looks.",
    explanation:
      "Brake before the bend, not in it. Stay right of the centre line and accelerate only once the road straightens.",
    legalBasis: "StVO Zeichen 103-20",
    countryCode: DE,
  },
  {
    id: "de-danger-curve-left",
    component: D.DangerCurveLeft,
    nameDE: "Kurve links",
    nameEN: "Curve to the left",
    category: "danger",
    description: "A bend to the left requiring a lower speed.",
    explanation:
      "Reduce speed before entering and keep well right — oncoming traffic may cut the corner.",
    legalBasis: "StVO Zeichen 103-10",
    countryCode: DE,
  },
  {
    id: "de-danger-double-curve",
    component: D.DangerDoubleCurve,
    nameDE: "Doppelkurve",
    nameEN: "Double curve",
    category: "danger",
    description:
      "Two or more bends in quick succession; the first one shown is the first you meet.",
    explanation:
      "Pick a speed you can hold through both bends and do not overtake — the second bend hides oncoming traffic.",
    legalBasis: "StVO Zeichen 105",
    countryCode: DE,
  },
  {
    id: "de-danger-steep-descent",
    component: D.DangerSteepDescent,
    nameDE: "Gefälle",
    nameEN: "Steep descent",
    category: "danger",
    description:
      "A downhill gradient of the percentage shown. Braking distances grow and brakes can overheat.",
    explanation:
      "Select a low gear and use engine braking instead of riding the brake pedal. Vehicles going uphill have priority in narrow sections.",
    legalBasis: "StVO Zeichen 108",
    countryCode: DE,
  },
  {
    id: "de-danger-steep-ascent",
    component: D.DangerSteepAscent,
    nameDE: "Steigung",
    nameEN: "Steep ascent",
    category: "danger",
    description: "An uphill gradient of the percentage shown.",
    explanation:
      "Change down early to keep momentum, and expect slow lorries. In a narrow passage, traffic coming uphill has priority.",
    legalBasis: "StVO Zeichen 110",
    countryCode: DE,
  },
  {
    id: "de-danger-uneven-road",
    component: D.DangerUnevenRoad,
    nameDE: "Unebene Fahrbahn",
    nameEN: "Uneven road",
    category: "danger",
    description: "Bumps, dips, potholes or frost damage in the surface.",
    explanation:
      "Slow down well before the section. A hard bump at speed can cost you steering grip and damage the suspension.",
    legalBasis: "StVO Zeichen 112",
    countryCode: DE,
  },
  {
    id: "de-danger-slippery-road",
    component: D.DangerSlipperyRoad,
    nameDE: "Schleuder- oder Rutschgefahr",
    nameEN: "Risk of skidding",
    category: "danger",
    description:
      "The surface can be slippery — often when wet, icy or soiled. A plate may limit it to those conditions.",
    explanation:
      "Reduce speed early and avoid abrupt steering, braking or acceleration. Double your following distance.",
    legalBasis: "StVO Zeichen 114",
    countryCode: DE,
  },
  {
    id: "de-danger-pedestrians",
    component: D.DangerPedestrians,
    nameDE: "Fußgänger",
    nameEN: "Pedestrians",
    category: "danger",
    description:
      "Pedestrians frequently cross here, often where there is no crossing.",
    explanation:
      "Lower your speed and scan both pavements. Be ready to stop for someone stepping out between parked cars.",
    legalBasis: "StVO Zeichen 133",
    countryCode: DE,
  },
  {
    id: "de-danger-children",
    component: D.DangerChildren,
    nameDE: "Kinder",
    nameEN: "Children",
    category: "danger",
    description:
      "Children near the road — typically by a school, kindergarten or playground.",
    explanation:
      "Slow right down, cover the brake and watch every child. Children act unpredictably and misjudge speed and distance.",
    legalBasis: "StVO Zeichen 136",
    countryCode: DE,
  },
  {
    id: "de-danger-cyclists",
    component: D.DangerCyclists,
    nameDE: "Radverkehr",
    nameEN: "Cyclists crossing or joining",
    category: "danger",
    description:
      "Cyclists cross or join the carriageway here, sometimes from both directions.",
    explanation:
      "Check mirrors and blind spot before turning, and leave 1.5 m when passing (2 m outside built-up areas).",
    legalBasis: "StVO Zeichen 138",
    countryCode: DE,
  },
  {
    id: "de-danger-animals",
    component: D.DangerAnimals,
    nameDE: "Wildwechsel",
    nameEN: "Wild animals crossing",
    category: "danger",
    description: "Deer and other game cross here, most often at dawn and dusk.",
    explanation:
      "Reduce speed, dip your headlights for oncoming traffic and brake in a straight line if an animal appears — never swerve into oncoming traffic. Where one animal crossed, more will follow.",
    legalBasis: "StVO Zeichen 142",
    countryCode: DE,
  },
  {
    id: "de-danger-railway-barrier",
    component: D.DangerRailwayWithBarrier,
    nameDE: "Bahnübergang mit Schranke",
    nameEN: "Level crossing with barrier",
    category: "danger",
    description:
      "A railway level crossing protected by barriers or half-barriers.",
    explanation:
      "Approach slowly, never queue onto the crossing and never drive around closing barriers. Wait behind the stop line until they lift fully.",
    legalBasis: "StVO Zeichen 150",
    countryCode: DE,
  },
  {
    id: "de-danger-railway-no-barrier",
    component: D.DangerRailwayNoBarrier,
    nameDE: "Bahnübergang ohne Schranke",
    nameEN: "Level crossing without barrier",
    category: "danger",
    description:
      "An unprotected level crossing — only the St Andrew's cross marks the track itself.",
    explanation:
      "Slow to a speed from which you can stop, look and listen both ways, and cross only when you can clear the track completely.",
    legalBasis: "StVO Zeichen 151",
    countryCode: DE,
  },
  {
    id: "de-danger-andreaskreuz",
    component: D.DangerAndreaskreuz,
    nameDE: "Andreaskreuz",
    nameEN: "St Andrew's cross",
    category: "danger",
    description:
      "Marks the level crossing itself. Rail traffic always has priority here.",
    explanation:
      "Stop before the cross if a train approaches, if the red light shows or if the bell sounds. Never stop on the track.",
    legalBasis: "StVO Zeichen 201",
    countryCode: DE,
  },
  {
    id: "de-danger-traffic-lights",
    component: D.DangerTrafficLights,
    nameDE: "Lichtzeichenanlage",
    nameEN: "Traffic lights ahead",
    category: "danger",
    description:
      "Traffic lights that are hard to see in time — after a bend or a crest.",
    explanation:
      "Ease off the accelerator and be ready to stop. The lights may already be red when they come into view.",
    legalBasis: "StVO Zeichen 131",
    countryCode: DE,
  },
  {
    id: "de-danger-road-narrows",
    component: D.DangerRoadNarrows,
    nameDE: "Verengte Fahrbahn",
    nameEN: "Road narrows (both sides)",
    category: "danger",
    description: "The carriageway narrows from both sides.",
    explanation:
      "The sign gives nobody priority. Adjust speed, watch oncoming traffic and be ready to give way to avoid a stand-off.",
    legalBasis: "StVO Zeichen 120",
    countryCode: DE,
  },
  {
    id: "de-danger-road-narrows-right",
    component: D.DangerRoadNarrowsRight,
    nameDE: "Einseitig verengte Fahrbahn",
    nameEN: "Road narrows on one side",
    category: "danger",
    description:
      "The carriageway narrows from one side only — the side shown on the sign.",
    explanation:
      "Expect traffic to merge out of the closing lane. Make space early rather than racing to the pinch point.",
    legalBasis: "StVO Zeichen 121",
    countryCode: DE,
  },
  {
    id: "de-danger-construction",
    component: D.DangerConstruction,
    nameDE: "Arbeitsstelle",
    nameEN: "Road works",
    category: "danger",
    description: "Road works with workers, machinery and changed lane layouts.",
    explanation:
      "Slow down, follow the temporary markings — yellow lines override white ones — and watch for people working close to the lane.",
    legalBasis: "StVO Zeichen 123",
    countryCode: DE,
  },
  {
    id: "de-danger-two-way-traffic",
    component: D.DangerTwoWayTraffic,
    nameDE: "Gegenverkehr",
    nameEN: "Two-way traffic ahead",
    category: "danger",
    description:
      "A one-way or dual-carriageway section ends and oncoming traffic resumes.",
    explanation:
      "Move right, cancel any thought of overtaking and expect headlights ahead on a road that felt one-way a moment ago.",
    legalBasis: "StVO Zeichen 125",
    countryCode: DE,
  },
  {
    id: "de-danger-traffic-queues",
    component: D.DangerTrafficQueues,
    nameDE: "Staugefahr",
    nameEN: "Risk of traffic queues",
    category: "danger",
    description:
      "Congestion forms here regularly — typically before road works or a junction.",
    explanation:
      "Lift off early, increase your distance and switch on hazard lights when you reach the back of a stationary queue to warn following traffic.",
    legalBasis: "StVO Zeichen 124",
    countryCode: DE,
  },
  {
    id: "de-danger-falling-rocks",
    component: D.DangerFallingRocks,
    nameDE: "Steinschlag",
    nameEN: "Falling rocks",
    category: "danger",
    description:
      "Rocks can fall onto the carriageway from the slope beside it.",
    explanation:
      "Do not stop under the slope. Watch for debris on your side of the road and be ready to steer around it without braking hard.",
    legalBasis: "StVO Zeichen 116",
    countryCode: DE,
  },
  {
    id: "de-danger-crosswind",
    component: D.DangerCrosswind,
    nameDE: "Seitenwind",
    nameEN: "Side wind",
    category: "danger",
    description:
      "Strong gusts across the road — on bridges, embankments and open country.",
    explanation:
      "Hold the wheel firmly, reduce speed and expect a sudden push when you leave the shelter of a cutting, a lorry or a bridge pier.",
    legalBasis: "StVO Zeichen 117",
    countryCode: DE,
  },

  // ── Vorfahrtzeichen ───────────────────────────────────────────────────────
  {
    id: "de-priority-give-way",
    component: P.PriorityGiveWay,
    nameDE: "Vorfahrt gewähren",
    nameEN: "Give way / Yield",
    category: "priority",
    description:
      "You must give way to all traffic on the crossing priority road.",
    explanation:
      "Slow down enough to stop. You need not stop if the road is clear, but you may never force crossing traffic to brake or swerve.",
    legalBasis: "StVO Zeichen 205",
    countryCode: DE,
  },
  {
    id: "de-priority-stop",
    component: P.PriorityStop,
    nameDE: "Halt! Vorfahrt gewähren",
    nameEN: "Stop and give way",
    category: "priority",
    description: "You must come to a complete standstill and then give way.",
    explanation:
      "Stop at the stop line every single time, even on an empty road at night. If the line is missing, stop where you can see along the crossing road.",
    legalBasis: "StVO Zeichen 206",
    countryCode: DE,
  },
  {
    id: "de-priority-next-intersection",
    component: P.PriorityAtNextIntersection,
    nameDE: "Vorfahrt",
    nameEN: "Priority at next intersection",
    category: "priority",
    description:
      "You have priority at the junction immediately ahead. The thick bar is your road.",
    explanation:
      "Keep your priority, but do not insist on it blindly — check that waiting drivers have actually seen you before you commit.",
    legalBasis: "StVO Zeichen 301",
    countryCode: DE,
  },
  {
    id: "de-priority-road",
    component: P.PriorityRoad,
    nameDE: "Vorfahrtstraße",
    nameEN: "Priority road",
    category: "priority",
    description:
      "You are on the priority road and keep right of way at the following junctions.",
    explanation:
      "You have priority until the end sign. Lights, police signals and right-of-way rules for turning still apply.",
    legalBasis: "StVO Zeichen 306",
    countryCode: DE,
  },
  {
    id: "de-priority-road-end",
    component: P.PriorityRoadEnd,
    nameDE: "Ende der Vorfahrtstraße",
    nameEN: "End of priority road",
    category: "priority",
    description: "Your automatic right of way ends here.",
    explanation:
      "From the next junction, right-before-left or new signs apply. Treat the following intersection as unregulated until you see otherwise.",
    legalBasis: "StVO Zeichen 307",
    countryCode: DE,
  },
  {
    id: "de-priority-over-oncoming",
    component: P.PriorityOverOncoming,
    nameDE: "Vorrang vor dem Gegenverkehr",
    nameEN: "Priority over oncoming traffic",
    category: "priority",
    description:
      "In the narrow section ahead you have priority; oncoming traffic must wait.",
    explanation:
      "Proceed through the gap, but stay ready to brake — the oncoming driver may have misread their own sign.",
    legalBasis: "StVO Zeichen 308",
    countryCode: DE,
  },
  {
    id: "de-priority-oncoming-has-right",
    component: P.PriorityOncomingHasRight,
    nameDE: "Vorrang des Gegenverkehrs",
    nameEN: "Oncoming traffic has priority",
    category: "priority",
    description:
      "You must give way through the narrowing; oncoming traffic goes first.",
    explanation:
      "Stop before the narrow section and wait until it is completely clear. Do not creep in behind the last oncoming vehicle.",
    legalBasis: "StVO Zeichen 208",
    countryCode: DE,
  },

  // ── Verbotszeichen ────────────────────────────────────────────────────────
  {
    id: "de-prohibition-no-entry",
    component: R.ProhibitNoEntry,
    nameDE: "Verbot der Einfahrt",
    nameEN: "No entry",
    category: "prohibition",
    description:
      "You may not drive in past this sign. Traffic from the other side may be allowed.",
    explanation:
      "Never enter — this is usually the exit of a one-way street, so you would be driving head-on into traffic. Find another route.",
    legalBasis: "StVO Zeichen 267",
    countryCode: DE,
  },
  {
    id: "de-prohibition-all-vehicles",
    component: R.ProhibitAllVehicles,
    nameDE: "Verbot für Fahrzeuge aller Art",
    nameEN: "No vehicles of any kind",
    category: "prohibition",
    description:
      "Closed to every vehicle, in both directions. Pushing a bicycle on foot is still allowed.",
    explanation:
      "Do not drive or cycle past. Check any supplementary plate — exceptions for residents or deliveries are common.",
    legalBasis: "StVO Zeichen 250",
    countryCode: DE,
  },
  {
    id: "de-prohibition-cars",
    component: R.ProhibitCars,
    nameDE: "Verbot für Kraftwagen",
    nameEN: "No cars",
    category: "prohibition",
    description:
      "Cars and other multi-track motor vehicles may not pass; motorcycles may.",
    explanation:
      "Turn around or take the signed alternative route. Supplementary plates may exempt buses or residents.",
    legalBasis: "StVO Zeichen 251",
    countryCode: DE,
  },
  {
    id: "de-prohibition-motor-vehicles",
    component: R.ProhibitMotorVehicles,
    nameDE: "Verbot für Krafträder und Kraftwagen",
    nameEN: "No motor vehicles",
    category: "prohibition",
    description:
      "No motorised vehicle of any kind. Bicycles, pedestrians and horse-drawn vehicles are unaffected.",
    explanation:
      "Leave the car and continue on foot or by bicycle if you need to go through — often used for forest and field roads.",
    legalBasis: "StVO Zeichen 260",
    countryCode: DE,
  },
  {
    id: "de-prohibition-motorcycles",
    component: R.ProhibitMotorcycles,
    nameDE: "Verbot für Krafträder",
    nameEN: "No motorcycles",
    category: "prohibition",
    description: "Motorcycles and mopeds with an engine may not pass.",
    explanation:
      "Typically used on roads where noise is restricted, sometimes only at weekends — read the plate below.",
    legalBasis: "StVO Zeichen 255",
    countryCode: DE,
  },
  {
    id: "de-prohibition-trucks",
    component: R.ProhibitTrucks,
    nameDE: "Verbot für Kraftfahrzeuge über 3,5 t",
    nameEN: "No trucks",
    category: "prohibition",
    description:
      "Goods vehicles above 3.5 t (or the weight on the sign), including trailers, may not pass.",
    explanation:
      "Applies to the permitted total weight, not the current load. Vans and cars below the limit may continue.",
    legalBasis: "StVO Zeichen 253",
    countryCode: DE,
  },
  {
    id: "de-prohibition-cyclists",
    component: R.ProhibitCyclists,
    nameDE: "Verbot für Radverkehr",
    nameEN: "No cyclists",
    category: "prohibition",
    description: "Cycling past this sign is prohibited.",
    explanation:
      "Dismount and push the bicycle, or use the signed cycle route. As a driver, do not expect cyclists on this stretch.",
    legalBasis: "StVO Zeichen 254",
    countryCode: DE,
  },
  {
    id: "de-prohibition-pedestrians",
    component: R.ProhibitPedestrians,
    nameDE: "Verbot für Fußgänger",
    nameEN: "No pedestrians",
    category: "prohibition",
    description: "Pedestrians may not use this road or path.",
    explanation:
      "Used where there is no safe walking space. As a driver, treat anyone on foot here as an emergency, not normal traffic.",
    legalBasis: "StVO Zeichen 259",
    countryCode: DE,
  },
  {
    id: "de-prohibition-speed-30",
    component: R.ProhibitSpeed30,
    nameDE: "Zulässige Höchstgeschwindigkeit 30",
    nameEN: "Speed limit 30 km/h",
    category: "prohibition",
    description: "Maximum permitted speed of 30 km/h from this sign.",
    explanation:
      "Applies until an end sign, a different limit or the end of the built-up area. Common outside schools and in residential streets.",
    legalBasis: "StVO Zeichen 274",
    countryCode: DE,
  },
  {
    id: "de-prohibition-speed-50",
    component: R.ProhibitSpeed50,
    nameDE: "Zulässige Höchstgeschwindigkeit 50",
    nameEN: "Speed limit 50 km/h",
    category: "prohibition",
    description: "Maximum permitted speed of 50 km/h.",
    explanation:
      "Confirms or imposes the built-up-area limit. On a country road it is a reduction you must obey immediately.",
    legalBasis: "StVO Zeichen 274",
    countryCode: DE,
  },
  {
    id: "de-prohibition-speed-70",
    component: R.ProhibitSpeed70,
    nameDE: "Zulässige Höchstgeschwindigkeit 70",
    nameEN: "Speed limit 70 km/h",
    category: "prohibition",
    description: "Maximum permitted speed of 70 km/h.",
    explanation:
      "Typical on country roads with poor sight lines or many junctions. Expect a stepped reduction to follow.",
    legalBasis: "StVO Zeichen 274",
    countryCode: DE,
  },
  {
    id: "de-prohibition-speed-100",
    component: R.ProhibitSpeed100,
    nameDE: "Zulässige Höchstgeschwindigkeit 100",
    nameEN: "Speed limit 100 km/h",
    category: "prohibition",
    description: "Maximum permitted speed of 100 km/h.",
    explanation:
      "Often used on the Autobahn before works or a bend. Cars with trailers remain limited to 80 km/h regardless.",
    legalBasis: "StVO Zeichen 274",
    countryCode: DE,
  },
  {
    id: "de-prohibition-speed-130",
    component: R.ProhibitSpeed130,
    nameDE: "Zulässige Höchstgeschwindigkeit 130",
    nameEN: "Speed limit 130 km/h",
    category: "prohibition",
    description:
      "Maximum permitted speed of 130 km/h — a real limit, not a recommendation.",
    explanation:
      "Do not confuse it with the 130 km/h Richtgeschwindigkeit: inside a red ring, 130 is enforceable and exceeding it is an offence.",
    legalBasis: "StVO Zeichen 274",
    countryCode: DE,
  },
  {
    id: "de-prohibition-zone-30",
    component: R.ProhibitZone30,
    nameDE: "Beginn einer Zone 30",
    nameEN: "Start of a 30 km/h zone",
    category: "prohibition",
    description: "A whole area limited to 30 km/h, not just one street.",
    explanation:
      "The limit applies to every road in the zone until the end sign. Junctions inside the zone are usually right-before-left.",
    legalBasis: "StVO Zeichen 274.1",
    countryCode: DE,
  },
  {
    id: "de-prohibition-speed-limit-end",
    component: R.ProhibitSpeedLimitEnd,
    nameDE: "Ende der Geschwindigkeitsbeschränkung",
    nameEN: "End of speed limit",
    category: "prohibition",
    description: "The signed speed limit ends here.",
    explanation:
      "The general limit for that road type applies again — 50 in town, 100 outside, unrestricted on the Autobahn.",
    legalBasis: "StVO Zeichen 278",
    countryCode: DE,
  },
  {
    id: "de-prohibition-no-overtaking",
    component: R.ProhibitNoOvertaking,
    nameDE: "Überholverbot für Kraftfahrzeuge",
    nameEN: "No overtaking",
    category: "prohibition",
    description: "You may not overtake any motor vehicle.",
    explanation:
      "Stay in line until the end sign. You may still pass cyclists and other non-motorised traffic with the required clearance.",
    legalBasis: "StVO Zeichen 276",
    countryCode: DE,
  },
  {
    id: "de-prohibition-no-overtaking-trucks",
    component: R.ProhibitNoOvertakingTrucks,
    nameDE: "Überholverbot für Kraftfahrzeuge über 3,5 t",
    nameEN: "No overtaking for trucks",
    category: "prohibition",
    description:
      "Vehicles over 3.5 t may not overtake. Cars may continue to overtake normally.",
    explanation:
      "As a car driver, expect lorries to stay in the right lane here — and do not box them in at the end of the restriction.",
    legalBasis: "StVO Zeichen 277",
    countryCode: DE,
  },
  {
    id: "de-prohibition-overtaking-end",
    component: R.ProhibitOvertakingEnd,
    nameDE: "Ende des Überholverbots",
    nameEN: "End of no-overtaking zone",
    category: "prohibition",
    description: "The overtaking ban ends here.",
    explanation:
      "Overtaking is allowed again, but only when you can see far enough and complete it without forcing anyone to brake.",
    legalBasis: "StVO Zeichen 280",
    countryCode: DE,
  },
  {
    id: "de-prohibition-no-parking",
    component: R.ProhibitNoParking,
    nameDE: "Eingeschränktes Halteverbot",
    nameEN: "No parking",
    category: "prohibition",
    description:
      "Parking is prohibited, but stopping for up to three minutes — or to load and unload — is allowed.",
    explanation:
      "You may stop briefly to let passengers in or out, but you may not leave the vehicle. The arrow or plate shows which stretch is affected.",
    legalBasis: "StVO Zeichen 286",
    countryCode: DE,
  },
  {
    id: "de-prohibition-no-stopping",
    component: R.ProhibitNoStopping,
    nameDE: "Absolutes Halteverbot",
    nameEN: "No stopping",
    category: "prohibition",
    description: "You may not stop at all, however briefly.",
    explanation:
      "Only traffic conditions — a queue or a red light — justify stopping here. Dropping someone off is already an offence.",
    legalBasis: "StVO Zeichen 283",
    countryCode: DE,
  },
  {
    id: "de-prohibition-no-u-turn",
    component: R.ProhibitNoUTurn,
    nameDE: "Verbot des Wendens",
    nameEN: "No U-turn",
    category: "prohibition",
    description: "Turning round to drive back is prohibited.",
    explanation:
      "Continue to a junction where turning is allowed. The ban covers the whole stretch, not only the sign's location.",
    legalBasis: "StVO Zeichen 272",
    countryCode: DE,
  },
  {
    id: "de-prohibition-weight-limit",
    component: R.ProhibitWeightLimit,
    nameDE: "Zulässiges Gesamtgewicht",
    nameEN: "Weight limit",
    category: "prohibition",
    description:
      "Vehicles whose permitted total weight exceeds the figure shown may not pass.",
    explanation:
      "It is the vehicle's permitted weight that counts, not what it actually weighs today. Typical before weak bridges.",
    legalBasis: "StVO Zeichen 262",
    countryCode: DE,
  },
  {
    id: "de-prohibition-height-limit",
    component: R.ProhibitHeightLimit,
    nameDE: "Zulässige Höhe",
    nameEN: "Height limit",
    category: "prohibition",
    description:
      "Vehicles higher than the figure shown — load included — may not pass.",
    explanation:
      "Measure from the ground to the highest point of your load. Roof boxes and bicycles on the roof count.",
    legalBasis: "StVO Zeichen 265",
    countryCode: DE,
  },
  {
    id: "de-prohibition-all-end",
    component: R.ProhibitAllRestrictionsEnd,
    nameDE: "Ende aller Streckenverbote",
    nameEN: "End of all restrictions",
    category: "prohibition",
    description:
      "Every signed restriction on this stretch ends at once — limits, overtaking bans and the rest.",
    explanation:
      "The general rules for the road type apply again. It does not cancel zone signs such as Zone 30.",
    legalBasis: "StVO Zeichen 282",
    countryCode: DE,
  },

  // ── Vorschriftzeichen ─────────────────────────────────────────────────────
  {
    id: "de-mandatory-straight",
    component: M.MandatoryStraight,
    nameDE: "Vorgeschriebene Fahrtrichtung geradeaus",
    nameEN: "Straight ahead only",
    category: "mandatory",
    description: "You must continue straight on.",
    explanation:
      "Turning left or right is prohibited, as is a U-turn. Get into the correct lane before you reach the sign.",
    legalBasis: "StVO Zeichen 209-30",
    countryCode: DE,
  },
  {
    id: "de-mandatory-turn-right",
    component: M.MandatoryTurnRight,
    nameDE: "Vorgeschriebene Fahrtrichtung rechts",
    nameEN: "Turn right",
    category: "mandatory",
    description: "You must turn right.",
    explanation:
      "No other manoeuvre is permitted. Signal, check your blind spot for cyclists and complete the turn.",
    legalBasis: "StVO Zeichen 209-20",
    countryCode: DE,
  },
  {
    id: "de-mandatory-turn-left",
    component: M.MandatoryTurnLeft,
    nameDE: "Vorgeschriebene Fahrtrichtung links",
    nameEN: "Turn left",
    category: "mandatory",
    description: "You must turn left.",
    explanation:
      "Give way to oncoming traffic before completing the turn — the sign orders your direction, it does not grant priority.",
    legalBasis: "StVO Zeichen 209-10",
    countryCode: DE,
  },
  {
    id: "de-mandatory-turn-right-here",
    component: M.MandatoryTurnRightHere,
    nameDE: "Vorgeschriebene Fahrtrichtung hier rechts",
    nameEN: "Turn right here",
    category: "mandatory",
    description: "You must turn right at this point, not at the next junction.",
    explanation:
      "The bend in the arrow means the turn starts at the sign itself — typically at the end of a one-way street.",
    legalBasis: "StVO Zeichen 211-20",
    countryCode: DE,
  },
  {
    id: "de-mandatory-turn-left-here",
    component: M.MandatoryTurnLeftHere,
    nameDE: "Vorgeschriebene Fahrtrichtung hier links",
    nameEN: "Turn left here",
    category: "mandatory",
    description: "You must turn left at this point.",
    explanation:
      "Follow the arrow immediately. Watch for oncoming traffic and for pedestrians crossing the road you turn into.",
    legalBasis: "StVO Zeichen 211-10",
    countryCode: DE,
  },
  {
    id: "de-mandatory-straight-or-right",
    component: M.MandatoryStraightOrRight,
    nameDE: "Geradeaus oder rechts",
    nameEN: "Straight ahead or right",
    category: "mandatory",
    description: "Only these two directions are allowed.",
    explanation:
      "Left turns and U-turns are prohibited. Decide early and position yourself in the correct lane.",
    legalBasis: "StVO Zeichen 214-20",
    countryCode: DE,
  },
  {
    id: "de-mandatory-straight-or-left",
    component: M.MandatoryStraightOrLeft,
    nameDE: "Geradeaus oder links",
    nameEN: "Straight ahead or left",
    category: "mandatory",
    description: "Only these two directions are allowed.",
    explanation:
      "Right turns are prohibited. If you turn left, oncoming traffic still has priority.",
    legalBasis: "StVO Zeichen 214-10",
    countryCode: DE,
  },
  {
    id: "de-mandatory-pass-right",
    component: M.MandatoryPassRight,
    nameDE: "Rechts vorbei",
    nameEN: "Pass on the right",
    category: "mandatory",
    description:
      "You must pass the obstruction — an island or works area — on its right-hand side.",
    explanation:
      "Follow the arrow exactly. Going the other side would put you into oncoming traffic.",
    legalBasis: "StVO Zeichen 222-20",
    countryCode: DE,
  },
  {
    id: "de-mandatory-pass-left",
    component: M.MandatoryPassLeft,
    nameDE: "Links vorbei",
    nameEN: "Pass on the left",
    category: "mandatory",
    description: "You must pass the obstruction on its left-hand side.",
    explanation:
      "Common where a cycle lane or bus stop occupies the right side. Check your mirror before moving out.",
    legalBasis: "StVO Zeichen 222-10",
    countryCode: DE,
  },
  {
    id: "de-mandatory-roundabout",
    component: M.MandatoryRoundabout,
    nameDE: "Kreisverkehr",
    nameEN: "Roundabout",
    category: "mandatory",
    description:
      "A roundabout: drive round it clockwise, to the right of the island.",
    explanation:
      "With the give-way sign beneath it, traffic already circulating has priority. Do not signal on entry; signal right just before your exit.",
    legalBasis: "StVO Zeichen 215",
    countryCode: DE,
  },
  {
    id: "de-mandatory-cycle-path",
    component: M.MandatoryCyclePath,
    nameDE: "Radweg",
    nameEN: "Compulsory cycle path",
    category: "mandatory",
    description:
      "Cyclists must use this path; motor vehicles may not drive or park on it.",
    explanation:
      "As a driver, never stop on it — not even briefly. When turning across it, give way to cyclists going straight on.",
    legalBasis: "StVO Zeichen 237",
    countryCode: DE,
  },
  {
    id: "de-mandatory-foot-path",
    component: M.MandatoryFootPath,
    nameDE: "Gehweg",
    nameEN: "Footpath",
    category: "mandatory",
    description:
      "Reserved for pedestrians. Cycling and driving are prohibited.",
    explanation:
      "Children under eight must cycle here, and up to ten they may. Expect them even though it is a footpath.",
    legalBasis: "StVO Zeichen 239",
    countryCode: DE,
  },
  {
    id: "de-mandatory-shared-path",
    component: M.MandatorySharedPath,
    nameDE: "Gemeinsamer Fuß- und Radweg",
    nameEN: "Shared pedestrian and cycle path",
    category: "mandatory",
    description:
      "One surface for both, with no separation. Cyclists must give consideration to pedestrians.",
    explanation:
      "Cyclists must moderate their speed and may not endanger those on foot. Drivers crossing it must give way to both.",
    legalBasis: "StVO Zeichen 240",
    countryCode: DE,
  },
  {
    id: "de-mandatory-segregated-path",
    component: M.MandatorySegregatedPath,
    nameDE: "Getrennter Rad- und Gehweg",
    nameEN: "Segregated cycle and foot path",
    category: "mandatory",
    description:
      "Cyclists and pedestrians each have their own marked side, as shown on the sign.",
    explanation:
      "Stay on your side. The sign's layout tells you which side belongs to whom — it is not always the same.",
    legalBasis: "StVO Zeichen 241",
    countryCode: DE,
  },
  {
    id: "de-mandatory-minimum-speed",
    component: M.MandatoryMinimumSpeed,
    nameDE: "Mindestgeschwindigkeit",
    nameEN: "Minimum speed",
    category: "mandatory",
    description:
      "You may not drive slower than the speed shown unless conditions force you to.",
    explanation:
      "If your vehicle or load cannot maintain it, you may not use that lane or road at all.",
    legalBasis: "StVO Zeichen 275",
    countryCode: DE,
  },
  {
    id: "de-mandatory-bus-lane",
    component: M.MandatoryBusLane,
    nameDE: "Bussonderfahrstreifen",
    nameEN: "Bus lane",
    category: "mandatory",
    description: "A lane reserved for scheduled buses.",
    explanation:
      "Other traffic may not drive in it — taxis and cyclists only where a plate allows. You may cross it to turn off.",
    legalBasis: "StVO Zeichen 245",
    countryCode: DE,
  },

  // ── Richtzeichen ──────────────────────────────────────────────────────────
  {
    id: "de-information-autobahn",
    component: I.InfoAutobahn,
    nameDE: "Autobahn",
    nameEN: "Motorway (Autobahn)",
    category: "information",
    description:
      "The start of the Autobahn and of the special rules that come with it.",
    explanation:
      "Only vehicles capable of more than 60 km/h may enter. No general speed limit, but 130 km/h is the recommended speed. No stopping, no reversing, no U-turns.",
    legalBasis: "StVO Zeichen 330.1",
    countryCode: DE,
  },
  {
    id: "de-information-autobahn-end",
    component: I.InfoAutobahnEnd,
    nameDE: "Ende der Autobahn",
    nameEN: "End of motorway",
    category: "information",
    description: "The Autobahn and its rules end here.",
    explanation:
      "Normal road rules return: expect oncoming traffic, junctions and a 100 km/h limit outside built-up areas. Slow down in good time.",
    legalBasis: "StVO Zeichen 330.2",
    countryCode: DE,
  },
  {
    id: "de-information-expressway",
    component: I.InfoExpressway,
    nameDE: "Kraftfahrstraße",
    nameEN: "Expressway",
    category: "information",
    description:
      "A road for motor vehicles only, with Autobahn-like access rules but not always a divided carriageway.",
    explanation:
      "Only vehicles capable of more than 60 km/h. There is no general 'no limit' rule here — 100 km/h applies unless signed otherwise.",
    legalBasis: "StVO Zeichen 331.1",
    countryCode: DE,
  },
  {
    id: "de-information-bundesstrasse",
    component: I.InfoBundesstrasse,
    nameDE: "Bundesstraße",
    nameEN: "Federal road number",
    category: "information",
    description: "Identifies a federal highway by its number.",
    explanation:
      "Purely for navigation. The usual limits apply: 100 km/h outside built-up areas unless a sign says otherwise.",
    legalBasis: "StVO Zeichen 401",
    countryCode: DE,
  },
  {
    id: "de-information-one-way",
    component: I.InfoOneWay,
    nameDE: "Einbahnstraße",
    nameEN: "One-way street",
    category: "information",
    description: "Traffic may only flow in the direction of the arrow.",
    explanation:
      "You may not reverse against the flow. Parking is allowed on both sides, and cyclists may come towards you where a plate permits it.",
    legalBasis: "StVO Zeichen 220",
    countryCode: DE,
  },
  {
    id: "de-information-dead-end",
    component: I.InfoDeadEnd,
    nameDE: "Sackgasse",
    nameEN: "Dead end",
    category: "information",
    description: "There is no through route for vehicles.",
    explanation:
      "You will have to turn around. Variants with a gap in the red bar mean cyclists or pedestrians can still get through.",
    legalBasis: "StVO Zeichen 357",
    countryCode: DE,
  },
  {
    id: "de-information-pedestrian-zone",
    component: I.InfoPedestrianZone,
    nameDE: "Fußgängerzone",
    nameEN: "Pedestrian zone",
    category: "information",
    description: "An area for pedestrians. Vehicles are generally banned.",
    explanation:
      "Enter only if a plate permits it — delivery traffic at set hours, for example. Then drive at walking pace and give way to everyone.",
    legalBasis: "StVO Zeichen 242.1",
    countryCode: DE,
  },
  {
    id: "de-information-pedestrian-zone-end",
    component: I.InfoPedestrianZoneEnd,
    nameDE: "Ende der Fußgängerzone",
    nameEN: "End of pedestrian zone",
    category: "information",
    description: "The pedestrian zone ends here.",
    explanation:
      "Normal traffic rules resume. Watch for pedestrians still spilling out of the zone behind you.",
    legalBasis: "StVO Zeichen 242.2",
    countryCode: DE,
  },
  {
    id: "de-information-residential-zone",
    component: I.InfoResidentialZone,
    nameDE: "Verkehrsberuhigter Bereich",
    nameEN: "Traffic-calmed residential zone",
    category: "information",
    description:
      "A shared-space street — often called a Spielstraße — where children may play on the road.",
    explanation:
      "Drive at walking pace, never obstruct pedestrians, and park only in marked spaces. Pedestrians may use the full width of the road.",
    legalBasis: "StVO Zeichen 325.1",
    countryCode: DE,
  },
  {
    id: "de-information-residential-zone-end",
    component: I.InfoResidentialZoneEnd,
    nameDE: "Ende des verkehrsberuhigten Bereichs",
    nameEN: "End of traffic-calmed zone",
    category: "information",
    description: "The traffic-calmed zone ends here.",
    explanation:
      "Normal rules apply again — but you are leaving a zone, so you must give way to traffic on the road you join.",
    legalBasis: "StVO Zeichen 325.2",
    countryCode: DE,
  },
  {
    id: "de-information-parking",
    component: I.InfoParking,
    nameDE: "Parken",
    nameEN: "Parking",
    category: "information",
    description: "Parking is permitted here.",
    explanation:
      "Always read the plate below: a time limit, a parking disc, residents-only or a charge can all apply.",
    legalBasis: "StVO Zeichen 314",
    countryCode: DE,
  },
  {
    id: "de-information-hospital",
    component: I.InfoHospital,
    nameDE: "Krankenhaus",
    nameEN: "Hospital",
    category: "information",
    description: "A hospital is nearby.",
    explanation:
      "Expect ambulances joining and leaving at speed, and avoid unnecessary noise. Keep access routes clear.",
    legalBasis: "StVO Zeichen 365-58",
    countryCode: DE,
  },
  {
    id: "de-information-first-aid",
    component: I.InfoFirstAid,
    nameDE: "Erste Hilfe",
    nameEN: "First aid station",
    category: "information",
    description: "A first-aid station or emergency help point.",
    explanation:
      "Useful to register as you pass — in an emergency you can direct help here instead of describing a stretch of road.",
    legalBasis: "StVO Zeichen 365-51",
    countryCode: DE,
  },
  {
    id: "de-information-fuel",
    component: I.InfoFuelStation,
    nameDE: "Tankstelle",
    nameEN: "Fuel station",
    category: "information",
    description: "A fuel station, usually with the distance on a plate.",
    explanation:
      "On the Autobahn, note the distance to the next one — service areas can be 50 km apart.",
    legalBasis: "StVO Zeichen 365-52",
    countryCode: DE,
  },
  {
    id: "de-information-pedestrian-crossing",
    component: I.InfoPedestrianCrossingSign,
    nameDE: "Fußgängerüberweg",
    nameEN: "Pedestrian crossing (zebra)",
    category: "information",
    description:
      "Marks a zebra crossing where pedestrians have priority over vehicles.",
    explanation:
      "Approach at a speed from which you can stop. Let anyone who clearly wants to cross go first, and never overtake at the crossing.",
    legalBasis: "StVO Zeichen 350",
    countryCode: DE,
  },
  {
    id: "de-information-bus-stop",
    component: I.InfoBusStop,
    nameDE: "Haltestelle",
    nameEN: "Bus or tram stop",
    category: "information",
    description: "A stop for buses, trams or school buses.",
    explanation:
      "No parking within 15 m of the sign. If a bus has its hazard lights on at the stop, pass only at walking pace.",
    legalBasis: "StVO Zeichen 224",
    countryCode: DE,
  },
  {
    id: "de-information-town-entry",
    component: I.InfoTownEntry,
    nameDE: "Ortstafel",
    nameEN: "Town entry sign",
    category: "information",
    description:
      "The start of a built-up area — and with it the 50 km/h general limit.",
    explanation:
      "The limit applies from the sign itself, so brake before it. Right-before-left becomes common again on side streets.",
    legalBasis: "StVO Zeichen 310",
    countryCode: DE,
  },
  {
    id: "de-information-town-exit",
    component: I.InfoTownExit,
    nameDE: "Ortstafel Rückseite",
    nameEN: "Town exit sign",
    category: "information",
    description:
      "The end of the built-up area. The out-of-town limit of 100 km/h applies again.",
    explanation:
      "Only accelerate once you have passed the sign and the road allows it. The name of the next town is shown below.",
    legalBasis: "StVO Zeichen 311",
    countryCode: DE,
  },
  {
    id: "de-information-distance-indicator",
    component: I.InfoDistanceIndicator,
    nameDE: "Entfernungstafel",
    nameEN: "Distance indicator",
    category: "information",
    description: "Destinations with their distance in kilometres.",
    explanation:
      "Read it early so you do not have to make a late lane change at the junction it announces.",
    legalBasis: "StVO Zeichen 453",
    countryCode: DE,
  },

  // ── Zusatzzeichen ─────────────────────────────────────────────────────────
  {
    id: "de-additional-when-wet",
    component: A.PlateWhenWet,
    nameDE: "Bei Nässe",
    nameEN: "When wet",
    category: "additional",
    description: "The sign above applies only while the carriageway is wet.",
    explanation:
      "Wet means visibly wet — a closed film of water. In doubt, obey the restriction: the burden of proof is on you.",
    legalBasis: "StVO Zusatzzeichen 1053-35",
    countryCode: DE,
  },
  {
    id: "de-additional-residents-excepted",
    component: A.PlateResidentsExcepted,
    nameDE: "Anlieger frei",
    nameEN: "Residents excepted",
    category: "additional",
    description:
      "The prohibition above does not apply to people with business at the properties on that road.",
    explanation:
      "Only drive in if you actually have business there — visiting, delivering or living. Using it as a shortcut is an offence.",
    legalBasis: "StVO Zusatzzeichen 1020-30",
    countryCode: DE,
  },
  {
    id: "de-additional-time-restriction",
    component: A.PlateTimeRestriction,
    nameDE: "Zeitliche Beschränkung",
    nameEN: "Time restriction",
    category: "additional",
    description: "The sign above applies only during the hours and days shown.",
    explanation:
      "Outside those hours the restriction does not exist. Black figures mean working days; red figures include Sundays and holidays.",
    legalBasis: "StVO Zusatzzeichen 1040",
    countryCode: DE,
  },
  {
    id: "de-additional-distance",
    component: A.PlateDistance,
    nameDE: "Entfernungsangabe",
    nameEN: "Distance ahead",
    category: "additional",
    description: "The sign above applies in the distance shown, not here.",
    explanation:
      "Use the warning: it tells you how much road you have to adjust your speed or position.",
    legalBasis: "StVO Zusatzzeichen 1004",
    countryCode: DE,
  },
  {
    id: "de-additional-length",
    component: A.PlateLength,
    nameDE: "Längenangabe",
    nameEN: "Length of the restriction",
    category: "additional",
    description: "The sign above applies for the stretch shown.",
    explanation:
      "Plan accordingly — a no-overtaking zone 'auf 2 km' means settling in behind the lorry for two kilometres.",
    legalBasis: "StVO Zusatzzeichen 1001",
    countryCode: DE,
  },
  {
    id: "de-additional-trucks-only",
    component: A.PlateTrucksOnly,
    nameDE: "Nur für Kraftfahrzeuge über 3,5 t",
    nameEN: "Applies to trucks only",
    category: "additional",
    description: "The sign above applies only to goods vehicles over 3.5 t.",
    explanation:
      "As a car driver you are unaffected — but expect lorries to behave differently here because of it.",
    legalBasis: "StVO Zusatzzeichen 1048-12",
    countryCode: DE,
  },
  {
    id: "de-additional-except-cyclists",
    component: A.PlateExceptCyclists,
    nameDE: "Radverkehr frei",
    nameEN: "Cyclists excepted",
    category: "additional",
    description: "Cyclists are exempt from the prohibition above.",
    explanation:
      "Commonly under a no-entry sign, so expect cyclists coming towards you in a one-way street.",
    legalBasis: "StVO Zusatzzeichen 1022-10",
    countryCode: DE,
  },
  {
    id: "de-additional-priority-course",
    component: A.PlatePriorityCourse,
    nameDE: "Verlauf der Vorfahrtstraße",
    nameEN: "Course of the priority road",
    category: "additional",
    description:
      "Shows how the priority road runs through the junction ahead — the bold line is the priority road.",
    explanation:
      "Read it before you commit. Priority can turn off while the road you are on continues straight — then you must give way.",
    legalBasis: "StVO Zusatzzeichen 1002",
    countryCode: DE,
  },
  {
    id: "de-additional-parking-disc",
    component: A.PlateParkingDisc,
    nameDE: "Parkscheibe",
    nameEN: "Parking disc required",
    category: "additional",
    description:
      "Parking is allowed for the time shown if you display a parking disc.",
    explanation:
      "Set the disc to your arrival time, rounded up to the next half hour, and put it behind the windscreen where it can be read.",
    legalBasis: "StVO Zusatzzeichen 1040-32",
    countryCode: DE,
  },
  {
    id: "de-additional-green-arrow",
    component: A.PlateGreenArrow,
    nameDE: "Grünpfeil",
    nameEN: "Green arrow plate",
    category: "additional",
    description:
      "Permits a right turn while the light is red — a plate, not a signal.",
    explanation:
      "Stop completely first, then turn only if you endanger nobody. Pedestrians and cyclists with green always go first.",
    legalBasis: "StVO Zeichen 720",
    countryCode: DE,
  },
  {
    id: "de-additional-snow-chains",
    component: A.PlateSnowChains,
    nameDE: "Schneeketten vorgeschrieben",
    nameEN: "Snow chains required",
    category: "additional",
    description: "Snow chains are compulsory on at least two driven wheels.",
    explanation:
      "Without chains you may not continue, whatever tyres you have. Maximum speed with chains fitted is 50 km/h.",
    legalBasis: "StVO Zeichen 268",
    countryCode: DE,
  },

  // ── Lichtzeichen ──────────────────────────────────────────────────────────
  {
    id: "de-signal-red",
    component: S.SignalRed,
    nameDE: "Rot",
    nameEN: "Red light",
    category: "signal",
    description: "Stop. Do not enter the intersection.",
    explanation:
      "Stop before the stop line — or before the lights if there is none. Running a red costs a fine, points and often a driving ban.",
    legalBasis: "StVO § 37",
    countryCode: DE,
  },
  {
    id: "de-signal-red-yellow",
    component: S.SignalRedYellow,
    nameDE: "Rot-Gelb",
    nameEN: "Red and yellow together",
    category: "signal",
    description: "Green is about to appear — get ready to move off.",
    explanation:
      "Red still applies: engage gear and prepare, but do not roll forward until the green shows.",
    legalBasis: "StVO § 37",
    countryCode: DE,
  },
  {
    id: "de-signal-yellow",
    component: S.SignalYellow,
    nameDE: "Gelb",
    nameEN: "Yellow light",
    category: "signal",
    description: "Wait for the next signal — red follows.",
    explanation:
      "Stop if you can do so safely. Only continue if braking would be dangerous because you are already too close.",
    legalBasis: "StVO § 37",
    countryCode: DE,
  },
  {
    id: "de-signal-green",
    component: S.SignalGreen,
    nameDE: "Grün",
    nameEN: "Green light",
    category: "signal",
    description: "Traffic may proceed.",
    explanation:
      "Green permits, it does not oblige. Do not enter a junction you cannot clear, and when turning, give way to pedestrians and cyclists.",
    legalBasis: "StVO § 37",
    countryCode: DE,
  },
  {
    id: "de-signal-green-arrow-left",
    component: S.SignalGreenArrowLeft,
    nameDE: "Grüner Pfeil im Signalgeber",
    nameEN: "Green arrow signal",
    category: "signal",
    description: "A protected turn: conflicting traffic is being held at red.",
    explanation:
      "You may turn without waiting for a gap. Still check for cyclists and pedestrians who may have ignored their own red.",
    legalBasis: "StVO § 37",
    countryCode: DE,
  },
  {
    id: "de-signal-flashing-yellow",
    component: S.SignalFlashingYellow,
    nameDE: "Gelbes Blinklicht",
    nameEN: "Flashing yellow",
    category: "signal",
    description: "A warning only. It grants no priority to anyone.",
    explanation:
      "Proceed with particular care and give way to pedestrians. Often used at crossings and tram stops, or when the main signal is off.",
    legalBasis: "StVO § 37",
    countryCode: DE,
  },
  {
    id: "de-signal-pedestrian-red",
    component: S.SignalPedestrianRed,
    nameDE: "Fußgängersignal Rot",
    nameEN: "Pedestrian signal — red",
    category: "signal",
    description: "Pedestrians must wait.",
    explanation:
      "As a driver, expect people to step out anyway — especially children and anyone hurrying for a tram.",
    legalBasis: "StVO § 37",
    countryCode: DE,
  },
  {
    id: "de-signal-pedestrian-green",
    component: S.SignalPedestrianGreen,
    nameDE: "Fußgängersignal Grün",
    nameEN: "Pedestrian signal — green",
    category: "signal",
    description: "Pedestrians may cross.",
    explanation:
      "If you are turning into that road, you must give way even on your own green. Wait until the crossing is clear.",
    legalBasis: "StVO § 37",
    countryCode: DE,
  },
  {
    id: "de-signal-cyclist",
    component: S.SignalCyclist,
    nameDE: "Radfahrersignal",
    nameEN: "Cycle signal",
    category: "signal",
    description:
      "A separate signal for cyclists, which often changes at a different moment from yours.",
    explanation:
      "Cyclists may get green before you. Check the cycle lane over your shoulder before every right turn.",
    legalBasis: "StVO § 37",
    countryCode: DE,
  },
  {
    id: "de-signal-tram",
    component: S.SignalTram,
    nameDE: "Signal für Schienenfahrzeuge",
    nameEN: "Tram signal",
    category: "signal",
    description:
      "Bar signals used for trams and buses — a vertical bar permits, a horizontal bar stops.",
    explanation:
      "These never apply to you. Learn to recognise them so you do not mistake a tram's white bar for your own green.",
    legalBasis: "StVO § 37",
    countryCode: DE,
  },
  {
    id: "de-signal-lane-closed",
    component: S.SignalLaneClosed,
    nameDE: "Rotes Kreuz über dem Fahrstreifen",
    nameEN: "Lane closed (red cross)",
    category: "signal",
    description: "The lane beneath the gantry is closed.",
    explanation:
      "Leave the lane before you reach the gantry. Driving under a red cross is treated as seriously as running a red light.",
    legalBasis: "StVO Zeichen 1-3 (Wechselverkehrszeichen)",
    countryCode: DE,
  },
  {
    id: "de-signal-lane-divert",
    component: S.SignalLaneDivert,
    nameDE: "Wechselwegweisung",
    nameEN: "Lane diversion arrow",
    category: "signal",
    description: "Move into the lane the arrow indicates.",
    explanation:
      "Change lane smoothly and early. It usually means an obstruction or works beyond the gantry.",
    legalBasis: "StVO § 39",
    countryCode: DE,
  },

  // ── Fahrbahnmarkierungen ──────────────────────────────────────────────────
  {
    id: "de-marking-broken-line",
    component: K.MarkingBrokenLine,
    nameDE: "Leitlinie",
    nameEN: "Broken lane line",
    category: "marking",
    description:
      "Guides traffic and separates lanes. You may cross it when it is safe.",
    explanation:
      "Short dashes with long gaps separate lanes; long dashes with short gaps warn that a solid line follows.",
    legalBasis: "StVO Zeichen 340",
    countryCode: DE,
  },
  {
    id: "de-marking-solid-line",
    component: K.MarkingSolidLine,
    nameDE: "Fahrstreifenbegrenzung",
    nameEN: "Solid line",
    category: "marking",
    description: "You may not cross or straddle this line.",
    explanation:
      "Overtaking that requires crossing it is prohibited. You may only cross to reach a property entrance where unavoidable.",
    legalBasis: "StVO Zeichen 295",
    countryCode: DE,
  },
  {
    id: "de-marking-double-solid-line",
    component: K.MarkingDoubleSolidLine,
    nameDE: "Doppelte durchgehende Linie",
    nameEN: "Double solid line",
    category: "marking",
    description: "Neither direction may cross.",
    explanation:
      "Used where sight lines are poor in both directions. Never overtake, and never cut across to turn left.",
    legalBasis: "StVO Zeichen 295",
    countryCode: DE,
  },
  {
    id: "de-marking-solid-and-broken",
    component: K.MarkingSolidAndBrokenLine,
    nameDE: "Durchgehende und unterbrochene Linie",
    nameEN: "Solid line beside a broken line",
    category: "marking",
    description: "Only the side with the broken line next to it may cross.",
    explanation:
      "Look at which line is on your side: broken means you may overtake, solid means you may not.",
    legalBasis: "StVO Zeichen 296",
    countryCode: DE,
  },
  {
    id: "de-marking-stop-line",
    component: K.MarkingStopLine,
    nameDE: "Haltlinie",
    nameEN: "Stop line",
    category: "marking",
    description:
      "Where you must stop at a STOP sign or a red light — a thick, solid transverse line.",
    explanation:
      "Stop with your bumper before the line, not on it. Creeping over it at a red light is already an offence.",
    legalBasis: "StVO Zeichen 294",
    countryCode: DE,
  },
  {
    id: "de-marking-give-way-line",
    component: K.MarkingGiveWayLine,
    nameDE: "Wartelinie",
    nameEN: "Give-way line",
    category: "marking",
    description:
      "A broken transverse line marking where to wait when you must give way.",
    explanation:
      "It is a guide, not an order to stop: you may roll on if the road is clear, unlike at a solid stop line.",
    legalBasis: "StVO Zeichen 341",
    countryCode: DE,
  },
  {
    id: "de-marking-crosswalk",
    component: K.MarkingCrosswalk,
    nameDE: "Zebrastreifen",
    nameEN: "Zebra crossing",
    category: "marking",
    description:
      "Broad white stripes where pedestrians have priority over vehicles.",
    explanation:
      "Approach ready to stop, give way to anyone who wants to cross, never overtake at it, and do not stop within 5 m before it.",
    legalBasis: "StVO Zeichen 293",
    countryCode: DE,
  },
  {
    id: "de-marking-hatched-area",
    component: K.MarkingHatchedArea,
    nameDE: "Sperrfläche",
    nameEN: "Hatched keep-clear area",
    category: "marking",
    description: "An area no vehicle may drive on or stop in.",
    explanation:
      "Treat it as a wall. It usually protects a merge point, a turning lane or a pedestrian refuge.",
    legalBasis: "StVO Zeichen 298",
    countryCode: DE,
  },
  {
    id: "de-marking-cycle-lane",
    component: K.MarkingCycleLane,
    nameDE: "Radfahrstreifen",
    nameEN: "Cycle lane",
    category: "marking",
    description:
      "A cycle lane on the carriageway, separated by a solid line and marked with a bicycle symbol.",
    explanation:
      "Motor vehicles may not drive, stop or park on it. Cross it only to turn off, and give way to cyclists going straight on.",
    legalBasis: "StVO Zeichen 237 + 295",
    countryCode: DE,
  },
  {
    id: "de-marking-cycle-strip",
    component: K.MarkingCycleProtectiveStrip,
    nameDE: "Schutzstreifen für Radverkehr",
    nameEN: "Advisory cycle strip",
    category: "marking",
    description:
      "A cycle strip marked with a broken line, which cars may cross when necessary.",
    explanation:
      "You may drive over it briefly if the lane is too narrow, but never park on it, and cyclists keep priority within it.",
    legalBasis: "StVO Zeichen 340",
    countryCode: DE,
  },
  {
    id: "de-marking-direction-arrows",
    component: K.MarkingDirectionArrows,
    nameDE: "Pfeilmarkierung",
    nameEN: "Lane direction arrows",
    category: "marking",
    description: "Shows which directions a lane may be used for.",
    explanation:
      "Binding like a sign: once you are in a lane marked only for turning, you must turn. Choose your lane early.",
    legalBasis: "StVO Zeichen 297",
    countryCode: DE,
  },
  {
    id: "de-marking-bus-lane",
    component: K.MarkingBusLane,
    nameDE: "Busspur-Markierung",
    nameEN: "Bus lane marking",
    category: "marking",
    description: "The word BUS marks a lane reserved for scheduled services.",
    explanation:
      "Do not drive in it, even when your lane is jammed. You may cross it to turn off or to reach a parking space.",
    legalBasis: "StVO Zeichen 245",
    countryCode: DE,
  },
  {
    id: "de-marking-parking-bay",
    component: K.MarkingParkingBay,
    nameDE: "Parkflächenmarkierung",
    nameEN: "Parking bay markings",
    category: "marking",
    description: "Marks where and how vehicles may be parked.",
    explanation:
      "Park inside the markings only. Where bays are marked, parking outside them is prohibited even if space looks free.",
    legalBasis: "StVO Zeichen 299",
    countryCode: DE,
  },

  // ── Kombinationen ─────────────────────────────────────────────────────────
  {
    id: "de-combo-speed30-when-wet",
    component: X.ComboSpeed30WhenWet,
    nameDE: "Höchstgeschwindigkeit 30 bei Nässe",
    nameEN: "Speed limit 30 when wet",
    category: "combination",
    description:
      "The 30 km/h limit applies only while the road surface is wet.",
    explanation:
      "On a dry road the general limit applies. Once the surface is visibly wet, 30 km/h is binding — including spray from other vehicles.",
    legalBasis: "StVO Zeichen 274 + 1053-35",
    countryCode: DE,
  },
  {
    id: "de-combo-no-parking-residents",
    component: X.ComboNoParkingResidents,
    nameDE: "Eingeschränktes Halteverbot, Anlieger frei",
    nameEN: "No parking except residents",
    category: "combination",
    description:
      "Parking is prohibited unless you have business with the properties on this road.",
    explanation:
      "Residents and their visitors may park; everyone else may stop only briefly. Being 'nearly a resident' does not count.",
    legalBasis: "StVO Zeichen 286 + 1020-30",
    countryCode: DE,
  },
  {
    id: "de-combo-priority-road-course",
    component: X.ComboPriorityRoadCourse,
    nameDE: "Vorfahrtstraße mit Verlaufsangabe",
    nameEN: "Priority road with its course",
    category: "combination",
    description:
      "You are on the priority road and the plate shows where that road goes at the next junction.",
    explanation:
      "The most misread combination on German roads: if the bold line turns off and you go straight, you lose priority and must give way.",
    legalBasis: "StVO Zeichen 306 + 1002",
    countryCode: DE,
  },
  {
    id: "de-combo-give-way-100m",
    component: X.ComboGiveWayIn100m,
    nameDE: "Vorfahrt gewähren in 100 m",
    nameEN: "Give way in 100 m",
    category: "combination",
    description:
      "An advance warning: you will have to give way 100 m further on.",
    explanation:
      "Start slowing now and look for the junction. The actual give-way sign stands at the junction itself.",
    legalBasis: "StVO Zeichen 205 + 1004",
    countryCode: DE,
  },
  {
    id: "de-combo-children-2km",
    component: X.ComboChildrenNext2km,
    nameDE: "Kinder auf 2 km",
    nameEN: "Children for the next 2 km",
    category: "combination",
    description: "The children warning applies for the next two kilometres.",
    explanation:
      "Keep your speed down for the whole stretch, not just past the sign — the hazard does not end at the next corner.",
    legalBasis: "StVO Zeichen 136 + 1001",
    countryCode: DE,
  },
  {
    id: "de-combo-no-entry-trucks",
    component: X.ComboNoEntryTrucksOnly,
    nameDE: "Einfahrt verboten für LKW",
    nameEN: "No entry for trucks",
    category: "combination",
    description:
      "The entry ban applies only to goods vehicles; cars may drive in.",
    explanation:
      "The plate narrows the prohibition to the vehicles shown. Always read it before assuming a road is closed to you.",
    legalBasis: "StVO Zeichen 267 + 1048-12",
    countryCode: DE,
  },
  {
    id: "de-combo-red-light-green-arrow",
    component: X.ComboRedLightGreenArrow,
    nameDE: "Rotlicht mit Grünpfeil",
    nameEN: "Red light with green arrow plate",
    category: "combination",
    description:
      "Red for all movements, except that a right turn is allowed after stopping.",
    explanation:
      "Stop completely at the line first — this is not a green light. Then turn right only if no pedestrian or cyclist is affected.",
    legalBasis: "StVO Zeichen 720 + § 37",
    countryCode: DE,
  },
  {
    id: "de-combo-pedestrian-zone-delivery",
    component: X.ComboPedestrianZoneDelivery,
    nameDE: "Fußgängerzone, Lieferverkehr frei",
    nameEN: "Pedestrian zone, deliveries excepted",
    category: "combination",
    description:
      "A pedestrian zone that delivery vehicles may enter, usually at set times.",
    explanation:
      "If you are permitted in, drive at walking pace and give way to every pedestrian. They may use the whole width of the street.",
    legalBasis: "StVO Zeichen 242.1 + 1026-35",
    countryCode: DE,
  },
];

/** All signs for a country, in catalogue order. */
export function getSignsForCountry(countryCode: string): SignMeta[] {
  return DE_SIGNS.filter((s) => s.countryCode === countryCode.toUpperCase());
}

/** Look one sign up by id. */
export function getSignById(id: string): SignMeta | undefined {
  return DE_SIGNS.find((s) => s.id === id);
}

/** Categories that actually contain signs, in display order. */
export const SIGN_CATEGORY_ORDER: SignCategory[] = [
  "danger",
  "priority",
  "prohibition",
  "mandatory",
  "information",
  "additional",
  "signal",
  "marking",
  "combination",
];

export function countByCategory(signs: SignMeta[]): Record<string, number> {
  return signs.reduce<Record<string, number>>((acc, s) => {
    acc[s.category] = (acc[s.category] ?? 0) + 1;
    return acc;
  }, {});
}
