interface Props {
  position: [number, number, number];
  rotationY?: number;
}

/** Simple wooden park bench (procedural). */
export default function Bench({ position, rotationY = 0 }: Props) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Seat */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.08, 0.5]} />
        <meshStandardMaterial color="#6b4f2a" roughness={0.9} />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 0.72, -0.21]} castShadow>
        <boxGeometry args={[1.6, 0.4, 0.06]} />
        <meshStandardMaterial color="#6b4f2a" roughness={0.9} />
      </mesh>
      {/* Metal legs */}
      {[-0.7, 0.7].map((x, i) => (
        <mesh key={i} position={[x, 0.22, 0]} castShadow>
          <boxGeometry args={[0.08, 0.45, 0.45]} />
          <meshStandardMaterial
            color="#3a3a3a"
            metalness={0.5}
            roughness={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}
