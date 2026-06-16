import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Phase = "red" | "yellow" | "green";

interface Props {
  position: [number, number, number];
  /**
   * Controlled phase (default 'red'). Used when `autoCycle` is false — e.g. the
   * traffic-lights scenario flips this to 'green' once the challenge resolves.
   */
  phase?: Phase;
  /**
   * Self-cycle red → green → yellow → red without external control. Lets a
   * scenario show realistic lights when it isn't gated by a challenge.
   */
  autoCycle?: boolean;
  /** Per-phase durations (seconds) when `autoCycle` is on. */
  cycle?: { red: number; green: number; yellow: number };
  /** Phase the auto-cycle starts on. */
  startPhase?: Phase;
  /** Notified on every (effective) phase change — managers read this. */
  onPhaseChange?: (phase: Phase) => void;
}

const ON = 3.5;
const OFF = 0.04;
const ORDER: Phase[] = ["red", "green", "yellow"];
const DEFAULT_CYCLE = { red: 6, green: 6, yellow: 2 };

export default function TrafficLight({
  position,
  phase = "red",
  autoCycle = false,
  cycle = DEFAULT_CYCLE,
  startPhase = "red",
  onPhaseChange,
}: Props) {
  const redRef = useRef<THREE.Mesh>(null!);
  const yellowRef = useRef<THREE.Mesh>(null!);
  const greenRef = useRef<THREE.Mesh>(null!);

  const [autoPhase, setAutoPhase] = useState<Phase>(startPhase);
  const phaseRef = useRef<Phase>(startPhase);
  const timerRef = useRef(0);

  const effectivePhase: Phase = autoCycle ? autoPhase : phase;

  // Self-cycling clock (no-op unless autoCycle).
  useFrame((_, delta) => {
    if (!autoCycle) return;
    timerRef.current += delta;
    if (timerRef.current >= cycle[phaseRef.current]) {
      timerRef.current = 0;
      const next = ORDER[(ORDER.indexOf(phaseRef.current) + 1) % ORDER.length];
      phaseRef.current = next;
      setAutoPhase(next);
    }
  });

  // Drive the bulb emissives + notify listeners whenever the phase changes.
  useEffect(() => {
    if (redRef.current) {
      (
        redRef.current.material as THREE.MeshStandardMaterial
      ).emissiveIntensity = effectivePhase === "red" ? ON : OFF;
    }
    if (yellowRef.current) {
      (
        yellowRef.current.material as THREE.MeshStandardMaterial
      ).emissiveIntensity = effectivePhase === "yellow" ? ON : OFF;
    }
    if (greenRef.current) {
      (
        greenRef.current.material as THREE.MeshStandardMaterial
      ).emissiveIntensity = effectivePhase === "green" ? ON : OFF;
    }
    onPhaseChange?.(effectivePhase);
  }, [effectivePhase, onPhaseChange]);

  return (
    <group position={position}>
      {/* Pole */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.09, 5, 8]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.8} metalness={0.4} />
      </mesh>

      {/* Housing box */}
      <mesh position={[0, 5.6, 0]} castShadow>
        <boxGeometry args={[0.45, 1.5, 0.32]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>

      {/* Red */}
      <mesh ref={redRef} position={[0, 6.2, 0.12]}>
        <sphereGeometry args={[0.14, 14, 14]} />
        <meshStandardMaterial
          color="#ff2020"
          emissive="#ff2020"
          emissiveIntensity={ON}
          roughness={0.3}
        />
      </mesh>

      {/* Yellow */}
      <mesh ref={yellowRef} position={[0, 5.6, 0.12]}>
        <sphereGeometry args={[0.14, 14, 14]} />
        <meshStandardMaterial
          color="#ffcc00"
          emissive="#ffcc00"
          emissiveIntensity={OFF}
          roughness={0.3}
        />
      </mesh>

      {/* Green */}
      <mesh ref={greenRef} position={[0, 5.0, 0.12]}>
        <sphereGeometry args={[0.14, 14, 14]} />
        <meshStandardMaterial
          color="#00dd44"
          emissive="#00dd44"
          emissiveIntensity={OFF}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}
