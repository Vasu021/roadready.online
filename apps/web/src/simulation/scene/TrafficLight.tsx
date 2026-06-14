import { useRef, useEffect } from "react";
import * as THREE from "three";

interface Props {
  position: [number, number, number];
  /** Controlled externally — 'red' until the challenge is resolved. */
  phase: "red" | "yellow" | "green";
}

const ON = 3.5;
const OFF = 0.04;

export default function TrafficLight({ position, phase }: Props) {
  const redRef = useRef<THREE.Mesh>(null!);
  const yellowRef = useRef<THREE.Mesh>(null!);
  const greenRef = useRef<THREE.Mesh>(null!);

  useEffect(() => {
    if (!redRef.current || !yellowRef.current || !greenRef.current) return;
    (redRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
      phase === "red" ? ON : OFF;
    (
      yellowRef.current.material as THREE.MeshStandardMaterial
    ).emissiveIntensity = phase === "yellow" ? ON : OFF;
    (
      greenRef.current.material as THREE.MeshStandardMaterial
    ).emissiveIntensity = phase === "green" ? ON : OFF;
  }, [phase]);

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
