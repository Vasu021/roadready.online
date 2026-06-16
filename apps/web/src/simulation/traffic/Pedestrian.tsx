import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTrafficPath } from "./useTrafficPath";
import type { Waypoint } from "../scenarios/types";

// A simple walking figure: capsule torso + sphere head + two swinging legs.
// Faces local -Z (its forward), matching the path follower's yaw convention.

interface Props {
  path: Waypoint[];
  /** Walking speed (m/s); defaults to a calm ~1.3 m/s. */
  speed?: number;
  loop?: boolean;
  startDelay?: number;
  /** Held in place by the manager (waiting at the kerb). */
  paused?: boolean;
  /** Jacket colour. */
  color?: string;
  onArrive?: () => void;
}

const WALK_SPEED = 1.3;

export default function Pedestrian({
  path,
  speed = WALK_SPEED,
  loop,
  startDelay,
  paused,
  color = "#2563eb",
  onArrive,
}: Props) {
  const groupRef = useRef<THREE.Group | null>(null);
  const legLRef = useRef<THREE.Group | null>(null);
  const legRRef = useRef<THREE.Group | null>(null);

  useTrafficPath(groupRef, { path, speed, loop, startDelay, paused, onArrive });

  // Swing the legs while walking; freeze the stride when held.
  useFrame((state) => {
    if (paused) return;
    const swing = Math.sin(state.clock.elapsedTime * 6) * 0.5;
    if (legLRef.current) legLRef.current.rotation.x = swing;
    if (legRRef.current) legRRef.current.rotation.x = -swing;
  });

  return (
    <group ref={groupRef}>
      {/* Torso */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <capsuleGeometry args={[0.2, 0.5, 4, 10]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.55, 0]} castShadow>
        <sphereGeometry args={[0.16, 14, 14]} />
        <meshStandardMaterial color="#f1c27d" roughness={0.7} />
      </mesh>
      {/* Legs (pivot at the hip so they swing from the top) */}
      <group ref={legLRef} position={[-0.1, 0.72, 0]}>
        <mesh position={[0, -0.36, 0]} castShadow>
          <boxGeometry args={[0.14, 0.72, 0.16]} />
          <meshStandardMaterial color="#1f2937" roughness={0.85} />
        </mesh>
      </group>
      <group ref={legRRef} position={[0.1, 0.72, 0]}>
        <mesh position={[0, -0.36, 0]} castShadow>
          <boxGeometry args={[0.14, 0.72, 0.16]} />
          <meshStandardMaterial color="#1f2937" roughness={0.85} />
        </mesh>
      </group>
    </group>
  );
}
