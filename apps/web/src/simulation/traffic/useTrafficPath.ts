import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";
import type { Waypoint } from "../scenarios/types";

// ─── Tuning ─────────────────────────────────────────────────────────────────
const DEFAULT_SPEED = 6; // m/s, used when neither waypoint nor caller sets one
const REACH = 0.05; // snap onto a waypoint when this close after a step
const TURN_RATE = 4.0; // yaw lerp responsiveness (per second)
const MAX_STEP = 1 / 30; // clamp delta so a stutter can't teleport an NPC

export interface TrafficPathOptions {
  path: Waypoint[];
  /** Fallback speed (m/s) when a waypoint doesn't carry its own. */
  speed?: number;
  /** Loop back to the path start when the end is reached. */
  loop?: boolean;
  /** Seconds the NPC holds at the path start before moving off. */
  startDelay?: number;
  /** While true the NPC freezes in place (manager holds it at a light / yield). */
  paused?: boolean;
  /** Yaw lerp responsiveness override. */
  turnRate?: number;
  /** Fired once when a non-looping path reaches its final waypoint. */
  onArrive?: () => void;
}

/**
 * Drives `groupRef` kinematically along `path`: constant speed per segment, yaw
 * lerped toward the direction of travel (local -Z is the NPC's front, matching
 * the player autopilot's `atan2(-dx, -dz)`). No Rapier body — NPCs never fight
 * the player car's physics.
 *
 * All work is scalar (no per-frame Vector3 allocation). `useFrame` auto-unregisters
 * on unmount and the JSX-declared geometry/materials are disposed by R3F, so the
 * NPC cleans up automatically.
 */
export function useTrafficPath(
  groupRef: React.RefObject<THREE.Group | null>,
  opts: TrafficPathOptions,
) {
  // Per-instance state (each NPC gets its own).
  const targetIndexRef = useRef(1); // we start sitting on path[0], heading to [1]
  const delayRef = useRef(0);
  const doneRef = useRef(false);
  const initedRef = useRef(false);
  const arriveFiredRef = useRef(false);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const path = opts.path;
    if (path.length === 0) return;

    // Place the NPC on its first waypoint, facing the next one, on frame one.
    if (!initedRef.current) {
      group.position.set(path[0].x, group.position.y, path[0].z);
      group.rotation.y = initialYaw(path);
      initedRef.current = true;
    }

    const dt = Math.min(delta, MAX_STEP);

    // Hold through the start delay.
    const startDelay = opts.startDelay ?? 0;
    if (delayRef.current < startDelay) {
      delayRef.current += dt;
      return;
    }

    // Held by the manager (red light / yield) or finished a one-shot path.
    if (opts.paused || doneRef.current) return;

    let target = path[targetIndexRef.current];
    if (!target) {
      if (opts.loop) {
        targetIndexRef.current = 0;
        target = path[0];
      } else {
        doneRef.current = true;
        if (!arriveFiredRef.current) {
          arriveFiredRef.current = true;
          opts.onArrive?.();
        }
        return;
      }
    }

    const px = group.position.x;
    const pz = group.position.z;
    const dx = target.x - px;
    const dz = target.z - pz;
    const dist = Math.hypot(dx, dz);

    const speed = target.speed || opts.speed || DEFAULT_SPEED;
    const step = speed * dt;

    if (dist <= step + REACH) {
      // Reached this waypoint — snap on and aim at the next one next frame.
      group.position.x = target.x;
      group.position.z = target.z;
      targetIndexRef.current += 1;
    } else {
      const inv = 1 / dist;
      group.position.x = px + dx * inv * step;
      group.position.z = pz + dz * inv * step;
    }

    // Yaw toward the direction of travel.
    if (dist > 1e-4) {
      const desiredYaw = Math.atan2(-dx, -dz);
      let diff = desiredYaw - group.rotation.y;
      while (diff > Math.PI) diff -= 2 * Math.PI;
      while (diff < -Math.PI) diff += 2 * Math.PI;
      const t = Math.min(1, (opts.turnRate ?? TURN_RATE) * dt);
      group.rotation.y += diff * t;
    }
  });
}

/** Heading from the first waypoint toward the second (local -Z is the front). */
function initialYaw(path: Waypoint[]): number {
  if (path.length < 2) return 0;
  const dx = path[1].x - path[0].x;
  const dz = path[1].z - path[0].z;
  return Math.atan2(-dx, -dz);
}
