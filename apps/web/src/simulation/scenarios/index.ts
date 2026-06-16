import basicControls from "./basicControls";
import trafficLights from "./trafficLights";
import giveWaySign from "./give-way-sign";
import rechtsVorLinks from "./rechts-vor-links";
import pedestrianCrossing from "./pedestrian-crossing";
import emergencyVehicle from "./emergency-vehicle";
import cyclistBlindSpot from "./cyclist-blind-spot";
import type { ScenarioDef } from "./types";

const registry: Record<string, ScenarioDef> = {
  "basic-controls": basicControls,
  "traffic-lights": trafficLights,
  "give-way-sign": giveWaySign,
  "rechts-vor-links": rechtsVorLinks,
  "pedestrian-crossing": pedestrianCrossing,
  "emergency-vehicle": emergencyVehicle,
  "cyclist-blind-spot": cyclistBlindSpot,
};

export function getScenario(id: string): ScenarioDef | undefined {
  return registry[id];
}

export function getAllScenarios(): ScenarioDef[] {
  return Object.values(registry);
}

export type { ScenarioDef };
export type { ScenarioChecker } from "./types";
