interface Props {
  position: [number, number, number];
}

/** German street bollard (Poller) — dark post with a red reflective band. */
export default function Bollard({ position }: Props) {
  return (
    <group position={position}>
      <mesh position={[0, 0.42, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.09, 0.85, 10]} />
        <meshStandardMaterial color="#2b2b2b" metalness={0.5} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.74, 0]}>
        <cylinderGeometry args={[0.085, 0.085, 0.08, 10]} />
        <meshStandardMaterial color="#e23b3b" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.85, 0]} castShadow>
        <sphereGeometry args={[0.09, 10, 10]} />
        <meshStandardMaterial color="#2b2b2b" metalness={0.5} roughness={0.6} />
      </mesh>
    </group>
  );
}
