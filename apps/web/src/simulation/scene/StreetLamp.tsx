interface Props {
  position: [number, number, number];
  /** Yaw so the arm reaches over the road. */
  rotationY?: number;
}

/** Procedural street lamp — pole + arm + emissive lamp head. */
export default function StreetLamp({ position, rotationY = 0 }: Props) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Pole */}
      <mesh position={[0, 2.4, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.1, 4.8, 10]} />
        <meshStandardMaterial color="#3b3f45" metalness={0.6} roughness={0.5} />
      </mesh>
      {/* Arm reaching over the road */}
      <mesh position={[0.35, 4.7, 0]} castShadow>
        <boxGeometry args={[0.8, 0.08, 0.08]} />
        <meshStandardMaterial color="#3b3f45" metalness={0.6} roughness={0.5} />
      </mesh>
      {/* Lamp housing */}
      <mesh position={[0.72, 4.62, 0]} castShadow>
        <boxGeometry args={[0.36, 0.14, 0.22]} />
        <meshStandardMaterial color="#2b2b2b" roughness={0.6} />
      </mesh>
      {/* Glowing element */}
      <mesh position={[0.72, 4.53, 0]}>
        <boxGeometry args={[0.28, 0.05, 0.16]} />
        <meshStandardMaterial
          color="#fff3c4"
          emissive="#ffe08a"
          emissiveIntensity={1.4}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
