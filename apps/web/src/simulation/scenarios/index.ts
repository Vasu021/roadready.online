import type { ScenarioDef } from "./types";

// ── Basic Skills ──────────────────────────────────────────────────────────────
import basicControls from "./basicControls";
import mirrorSignalManeuver from "./mirror-signal-maneuver";
import speedStoppingDistance from "./speed-stopping-distance";
import parkingRulesDe from "./parking-rules-de";
// ── Right of Way & Priority ───────────────────────────────────────────────────
import rechtsVorLinks from "./rechts-vor-links";
import giveWaySign from "./give-way-sign";
import stopSign from "./stop-sign";
import priorityRoadSigns from "./priority-road-signs";
import vorfahrtPriorityIntersection from "./vorfahrt-priority-intersection";
import turningLeftOncoming from "./turning-left-oncoming";
import roundabout from "./roundabout";
// ── Traffic Lights & Signals ──────────────────────────────────────────────────
import trafficLights from "./trafficLights";
import greenArrow from "./green-arrow";
import signalsOverride from "./signals-override";
// ── Road Signs ────────────────────────────────────────────────────────────────
import prohibitionSigns from "./prohibition-signs";
import mandatorySigns from "./mandatory-signs";
import speedLimitTempo30 from "./speed-limit-tempo30";
import warningSigns from "./warning-signs";
// ── Vulnerable Road Users ─────────────────────────────────────────────────────
import pedestrianCrossing from "./pedestrian-crossing";
import cyclistBlindSpot from "./cyclist-blind-spot";
import tramPriority from "./tram-priority";
import schoolZone from "./school-zone";
// ── Special Situations & Highway ──────────────────────────────────────────────
import emergencyVehicle from "./emergency-vehicle";
import busStop from "./bus-stop";
import autobahnRules from "./autobahn-rules";
import zipperMerge from "./zipper-merge";
import railwayCrossing from "./railway-crossing";
import adverseConditions from "./adverse-conditions";
// ── Test ──────────────────────────────────────────────────────────────────────
import fullTestGermany from "./fullTestGermany";

// slug → ScenarioDef. A slug is playable from Home only if it appears here and
// exactly matches the seeded DB slug. (full-test-germany is wired in Step 8.)
const registry: Record<string, ScenarioDef> = {
  // Basic Skills
  "basic-controls": basicControls,
  "mirror-signal-maneuver": mirrorSignalManeuver,
  "speed-stopping-distance": speedStoppingDistance,
  "parking-rules-de": parkingRulesDe,
  // Right of Way & Priority
  "rechts-vor-links": rechtsVorLinks,
  "give-way-sign": giveWaySign,
  "stop-sign": stopSign,
  "priority-road-signs": priorityRoadSigns,
  "vorfahrt-priority-intersection": vorfahrtPriorityIntersection,
  "turning-left-oncoming": turningLeftOncoming,
  roundabout: roundabout,
  // Traffic Lights & Signals
  "traffic-lights": trafficLights,
  "green-arrow": greenArrow,
  "signals-override": signalsOverride,
  // Road Signs
  "prohibition-signs": prohibitionSigns,
  "mandatory-signs": mandatorySigns,
  "speed-limit-tempo30": speedLimitTempo30,
  "warning-signs": warningSigns,
  // Vulnerable Road Users
  "pedestrian-crossing": pedestrianCrossing,
  "cyclist-blind-spot": cyclistBlindSpot,
  "tram-priority": tramPriority,
  "school-zone": schoolZone,
  // Special Situations & Highway
  "emergency-vehicle": emergencyVehicle,
  "bus-stop": busStop,
  "autobahn-rules": autobahnRules,
  "zipper-merge": zipperMerge,
  "railway-crossing": railwayCrossing,
  "adverse-conditions": adverseConditions,
  // Test
  "full-test-germany": fullTestGermany,
};

export function getScenario(id: string): ScenarioDef | undefined {
  return registry[id];
}

export function getAllScenarios(): ScenarioDef[] {
  return Object.values(registry);
}

export type { ScenarioDef };
export type { ScenarioChecker } from "./types";
