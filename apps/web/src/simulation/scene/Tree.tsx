import { useMemo } from "react";
import * as THREE from "three";

interface Props {
  position: [number, number, number];
  scale?: number;
  variant?: 0 | 1 | 2;
}

// Three foliage colour variants so trees aren't all identical
const FOLIAGE_COLORS = ["#2d6a2d", "#3a7d44", "#1f5e1f"] as const;

export default function Tree({ position, scale = 1, variant = 0 }: Props) {
  const color = FOLIAGE_COLORS[variant % 3];

  const trunkMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#5c3d1a", roughness: 0.95 }),
    [],
  );
  const foliageMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color, roughness: 0.9 }),
    [color],
  );

  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 1.0, 0]} castShadow material={trunkMat}>
        <cylinderGeometry args={[0.15, 0.2, 2.0, 7]} />
      </mesh>
      {/* Lower foliage cone */}
      <mesh position={[0, 3.0, 0]} castShadow material={foliageMat}>
        <coneGeometry args={[1.4, 2.2, 8]} />
      </mesh>
      {/* Upper foliage cone */}
      <mesh position={[0, 4.4, 0]} castShadow material={foliageMat}>
        <coneGeometry args={[0.9, 1.8, 8]} />
      </mesh>
      {/* Top */}
      <mesh position={[0, 5.5, 0]} castShadow material={foliageMat}>
        <coneGeometry args={[0.5, 1.2, 8]} />
      </mesh>
    </group>
  );
}
