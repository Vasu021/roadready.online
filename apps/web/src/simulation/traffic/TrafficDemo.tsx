import { useState } from "react";
import TrafficLight from "../scene/TrafficLight";
import TrafficManager from "./TrafficManager";
import type { TrafficPhase } from "./TrafficManager";
import type { NpcSpawn } from "../scenarios/types";

// ─── TEMPORARY DEV MOUNT (Step 5) ──────────────────────────────────────────────
// Smoke-tests the NPC traffic system. NOT part of normal play — SimulationScene
// only renders this when the URL carries `?trafficDemo=1`. Remove (or fold into
// the declarative per-scenario placement) once Step 6 wires npcs into scenarios.
//
// What it shows: a car held at the red light then released on green, a freely
// cruising car, a bus, an ambulance with flashing blue lights, a cyclist on the
// bike lane, and a pedestrian crossing the zebra.

const SPAWNS: NpcSpawn[] = [
  // Held at the junction while the light is red; turns left (west) on green.
  {
    id: "demo-stop-car",
    variant: "car",
    behavior: "stop-at-red",
    // Short route so it clears the junction within one green and then parks
    // (a finished path is never re-held, so it won't freeze on the next yellow).
    path: [
      { x: -1.75, z: -1, speed: 5 },
      { x: -7, z: -5, speed: 4 },
      { x: -22, z: -5, speed: 9 },
    ],
  },
  // A second car cruising north up Road 1, looping for continuous motion.
  {
    id: "demo-free-car",
    variant: "car",
    behavior: "free",
    loop: true,
    speed: 8,
    path: [
      { x: 1.75, z: -8, speed: 8 },
      { x: 1.75, z: 44, speed: 9 },
    ],
  },
  // Bus heading west along Road 2 (north lane), looping.
  {
    id: "demo-bus",
    variant: "bus",
    behavior: "free",
    loop: true,
    speed: 8,
    path: [
      { x: 2, z: -6.5, speed: 8 },
      { x: -60, z: -6.5, speed: 8 },
    ],
  },
  // Ambulance approaching from behind the player, then west — flashing blue.
  {
    id: "demo-ambulance",
    variant: "ambulance",
    behavior: "emergency",
    startDelay: 2,
    path: [
      { x: 1, z: 60, speed: 16 },
      { x: 1, z: -1, speed: 12 },
      { x: -8, z: -5, speed: 8 },
      { x: -58, z: -5, speed: 12 },
    ],
  },
  // Cyclist on the red bike lane (x≈-2.7), southbound, looping.
  {
    id: "demo-cyclist",
    variant: "cyclist",
    behavior: "free",
    loop: true,
    speed: 5,
    path: [
      { x: -2.7, z: 40, speed: 5 },
      { x: -2.7, z: 4, speed: 5 },
    ],
  },
  // Pedestrian crossing the zebra at x≈-46.5 (north sidewalk → south sidewalk).
  {
    id: "demo-pedestrian",
    variant: "pedestrian",
    behavior: "free",
    startDelay: 1,
    speed: 1.3,
    path: [
      { x: -46.5, z: -9.5, speed: 1.3 },
      { x: -46.5, z: 0, speed: 1.3 },
    ],
  },
];

export default function TrafficDemo() {
  const [lightPhase, setLightPhase] = useState<TrafficPhase>("red");

  return (
    <>
      <TrafficLight
        position={[5, 0, -5]}
        autoCycle
        startPhase="red"
        cycle={{ red: 5, green: 6, yellow: 2 }}
        onPhaseChange={setLightPhase}
      />
      <TrafficManager spawns={SPAWNS} lightPhase={lightPhase} />
    </>
  );
}
