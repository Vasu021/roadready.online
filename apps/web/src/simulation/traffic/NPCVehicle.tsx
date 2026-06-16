import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTrafficPath } from "./useTrafficPath";
import type { Waypoint, NpcVehicleVariant } from "../scenarios/types";

// All meshes below are authored with the vehicle's FRONT along local -Z, so the
// path follower's yaw (atan2(-dx, -dz)) points the headlights down the path.
// Wheels (radius ~0.32) rest on the ground at y≈0.32; the parent group sits at y=0.

interface Props {
  variant: NpcVehicleVariant;
  path: Waypoint[];
  speed?: number;
  loop?: boolean;
  startDelay?: number;
  /** Held in place by the manager (red light / yield). */
  paused?: boolean;
  /** Body colour for the 'car' variant; ignored by the others. */
  color?: string;
  onArrive?: () => void;
}

export default function NPCVehicle({
  variant,
  path,
  speed,
  loop,
  startDelay,
  paused,
  color,
  onArrive,
}: Props) {
  const groupRef = useRef<THREE.Group | null>(null);
  useTrafficPath(groupRef, { path, speed, loop, startDelay, paused, onArrive });

  return (
    <group ref={groupRef}>
      {variant === "car" && <CarBody color={color} />}
      {variant === "bus" && <BusBody />}
      {variant === "ambulance" && <AmbulanceBody />}
      {variant === "cyclist" && <CyclistBody />}
    </group>
  );
}

// ─── Wheel helper ─────────────────────────────────────────────────────────────

function Wheel({
  position,
  radius = 0.32,
  width = 0.2,
}: {
  position: [number, number, number];
  radius?: number;
  width?: number;
}) {
  return (
    <mesh position={position} rotation={[0, 0, Math.PI / 2]} castShadow>
      <cylinderGeometry args={[radius, radius, width, 14]} />
      <meshStandardMaterial color="#111827" roughness={0.85} />
    </mesh>
  );
}

// ─── Car ────────────────────────────────────────────────────────────────────

function CarBody({ color = "#b91c1c" }: { color?: string }) {
  return (
    <group>
      {/* Chassis */}
      <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.7, 0.55, 3.5]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.6} />
      </mesh>
      {/* Cabin */}
      <mesh position={[0, 1.15, -0.1]} castShadow>
        <boxGeometry args={[1.55, 0.5, 1.7]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.5} />
      </mesh>
      {/* Windshield (front, -Z) + rear window (+Z) */}
      <mesh position={[0, 1.14, -0.95]}>
        <boxGeometry args={[1.46, 0.42, 0.06]} />
        <meshStandardMaterial
          color="#7dd3fc"
          transparent
          opacity={0.55}
          roughness={0.05}
        />
      </mesh>
      <mesh position={[0, 1.14, 0.74]}>
        <boxGeometry args={[1.46, 0.4, 0.06]} />
        <meshStandardMaterial
          color="#7dd3fc"
          transparent
          opacity={0.5}
          roughness={0.05}
        />
      </mesh>
      {/* Headlights at the front (-Z) */}
      {([-0.5, 0.5] as const).map((x, i) => (
        <mesh key={`h${i}`} position={[x, 0.7, -1.76]}>
          <boxGeometry args={[0.34, 0.16, 0.05]} />
          <meshStandardMaterial
            color="white"
            emissive="white"
            emissiveIntensity={0.6}
          />
        </mesh>
      ))}
      {/* Taillights at the rear (+Z) */}
      {([-0.5, 0.5] as const).map((x, i) => (
        <mesh key={`t${i}`} position={[x, 0.7, 1.76]}>
          <boxGeometry args={[0.34, 0.16, 0.05]} />
          <meshStandardMaterial
            color="#ef4444"
            emissive="#dc2626"
            emissiveIntensity={1.1}
          />
        </mesh>
      ))}
      <Wheel position={[-0.78, 0.32, -1.18]} />
      <Wheel position={[0.78, 0.32, -1.18]} />
      <Wheel position={[-0.78, 0.32, 1.18]} />
      <Wheel position={[0.78, 0.32, 1.18]} />
    </group>
  );
}

// ─── Bus ──────────────────────────────────────────────────────────────────────

function BusBody() {
  return (
    <group>
      {/* Long body */}
      <mesh position={[0, 1.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 2.4, 10]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.5} metalness={0.3} />
      </mesh>
      {/* Window band on both sides */}
      {([-1.26, 1.26] as const).map((x, i) => (
        <mesh key={`w${i}`} position={[x, 1.95, 0]}>
          <boxGeometry args={[0.04, 0.8, 8.6]} />
          <meshStandardMaterial
            color="#1f2937"
            transparent
            opacity={0.7}
            roughness={0.1}
          />
        </mesh>
      ))}
      {/* Windshield (front, -Z) */}
      <mesh position={[0, 1.95, -5.02]}>
        <boxGeometry args={[2.3, 1.0, 0.06]} />
        <meshStandardMaterial
          color="#7dd3fc"
          transparent
          opacity={0.55}
          roughness={0.05}
        />
      </mesh>
      {/* Headlights / taillights */}
      {([-0.85, 0.85] as const).map((x, i) => (
        <mesh key={`bh${i}`} position={[x, 0.7, -5.02]}>
          <boxGeometry args={[0.4, 0.2, 0.05]} />
          <meshStandardMaterial
            color="white"
            emissive="white"
            emissiveIntensity={0.6}
          />
        </mesh>
      ))}
      {([-0.85, 0.85] as const).map((x, i) => (
        <mesh key={`bt${i}`} position={[x, 0.7, 5.02]}>
          <boxGeometry args={[0.4, 0.2, 0.05]} />
          <meshStandardMaterial
            color="#ef4444"
            emissive="#dc2626"
            emissiveIntensity={1.0}
          />
        </mesh>
      ))}
      {/* 3 axles per side */}
      {[-3.2, 0.4, 3.6].flatMap((z, i) => [
        <Wheel key={`bl${i}`} position={[-1.05, 0.45, z]} radius={0.45} />,
        <Wheel key={`br${i}`} position={[1.05, 0.45, z]} radius={0.45} />,
      ])}
    </group>
  );
}

// ─── Ambulance (German RTW — flashing BLUE lights) ─────────────────────────────

function AmbulanceBody() {
  const lightA = useRef<THREE.MeshStandardMaterial | null>(null);
  const lightB = useRef<THREE.MeshStandardMaterial | null>(null);

  // Alternate the two roof lights (~6 Hz) to read as an emergency strobe.
  useFrame((state) => {
    const on = Math.sin(state.clock.elapsedTime * 12) > 0;
    if (lightA.current) lightA.current.emissiveIntensity = on ? 5 : 0.1;
    if (lightB.current) lightB.current.emissiveIntensity = on ? 0.1 : 5;
  });

  return (
    <group>
      {/* White van body */}
      <mesh position={[0, 1.25, 0.2]} castShadow receiveShadow>
        <boxGeometry args={[2.0, 2.0, 4.4]} />
        <meshStandardMaterial
          color="#f8fafc"
          roughness={0.45}
          metalness={0.2}
        />
      </mesh>
      {/* Lower cab nose (front, -Z) */}
      <mesh position={[0, 0.85, -2.5]} castShadow>
        <boxGeometry args={[2.0, 1.2, 0.9]} />
        <meshStandardMaterial
          color="#f8fafc"
          roughness={0.45}
          metalness={0.2}
        />
      </mesh>
      {/* Windshield */}
      <mesh position={[0, 1.45, -2.0]}>
        <boxGeometry args={[1.84, 0.7, 0.06]} />
        <meshStandardMaterial
          color="#7dd3fc"
          transparent
          opacity={0.55}
          roughness={0.05}
        />
      </mesh>
      {/* Red side stripes (German RTW livery) */}
      {([-1.02, 1.02] as const).map((x, i) => (
        <mesh key={`s${i}`} position={[x, 1.1, 0.2]}>
          <boxGeometry args={[0.04, 0.3, 4.3]} />
          <meshStandardMaterial color="#dc2626" roughness={0.5} />
        </mesh>
      ))}
      {/* Roof light bar + two flashing blue lamps */}
      <mesh position={[0, 2.32, -0.4]} castShadow>
        <boxGeometry args={[1.5, 0.16, 0.5]} />
        <meshStandardMaterial color="#1f2937" roughness={0.6} />
      </mesh>
      <mesh position={[-0.42, 2.42, -0.4]}>
        <boxGeometry args={[0.5, 0.16, 0.4]} />
        <meshStandardMaterial
          ref={lightA}
          color="#1e3a8a"
          emissive="#2563eb"
          emissiveIntensity={5}
        />
      </mesh>
      <mesh position={[0.42, 2.42, -0.4]}>
        <boxGeometry args={[0.5, 0.16, 0.4]} />
        <meshStandardMaterial
          ref={lightB}
          color="#1e3a8a"
          emissive="#2563eb"
          emissiveIntensity={0.1}
        />
      </mesh>
      {/* Headlights */}
      {([-0.7, 0.7] as const).map((x, i) => (
        <mesh key={`ah${i}`} position={[x, 0.6, -2.92]}>
          <boxGeometry args={[0.34, 0.18, 0.05]} />
          <meshStandardMaterial
            color="white"
            emissive="white"
            emissiveIntensity={0.7}
          />
        </mesh>
      ))}
      <Wheel position={[-0.95, 0.4, -1.7]} radius={0.4} />
      <Wheel position={[0.95, 0.4, -1.7]} radius={0.4} />
      <Wheel position={[-0.95, 0.4, 1.6]} radius={0.4} />
      <Wheel position={[0.95, 0.4, 1.6]} radius={0.4} />
    </group>
  );
}

// ─── Cyclist ──────────────────────────────────────────────────────────────────

function CyclistBody() {
  return (
    <group>
      {/* Two in-line wheels (front -Z, rear +Z) */}
      <mesh
        position={[0, 0.35, -0.55]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[0.35, 0.35, 0.06, 16]} />
        <meshStandardMaterial color="#1f2937" roughness={0.7} />
      </mesh>
      <mesh
        position={[0, 0.35, 0.55]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[0.35, 0.35, 0.06, 16]} />
        <meshStandardMaterial color="#1f2937" roughness={0.7} />
      </mesh>
      {/* Frame */}
      <mesh position={[0, 0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 1.0, 8]} />
        <meshStandardMaterial color="#0ea5e9" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.72, 0.45]}>
        <cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />
        <meshStandardMaterial color="#374151" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Handlebars */}
      <mesh position={[0, 0.95, -0.5]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, 0.5, 8]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      {/* Rider — legs, torso, head */}
      <mesh position={[0, 0.78, 0.1]}>
        <boxGeometry args={[0.32, 0.5, 0.25]} />
        <meshStandardMaterial color="#1f2937" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.25, 0.05]} castShadow>
        <capsuleGeometry args={[0.22, 0.45, 4, 10]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.72, 0.0]} castShadow>
        <sphereGeometry args={[0.17, 14, 14]} />
        <meshStandardMaterial color="#fcd34d" roughness={0.6} />
      </mesh>
    </group>
  );
}
