import { useMemo } from 'react'

interface Props {
  position: [number, number, number]
  width: number
  depth: number
  height: number
  color: string
  roofColor?: string
}

export default function Building({ position, width, depth, height, color, roofColor }: Props) {
  const bodyMat = useMemo(
    () => ({
      color,
      roughness: 0.85,
      metalness: 0.05,
    }),
    [color],
  )

  return (
    <group position={position}>
      {/* Main body */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial {...bodyMat} />
      </mesh>

      {/* Simple flat roof with a slight lip */}
      <mesh position={[0, height + 0.12, 0]} castShadow>
        <boxGeometry args={[width + 0.2, 0.24, depth + 0.2]} />
        <meshStandardMaterial color={roofColor ?? '#555'} roughness={0.9} />
      </mesh>
    </group>
  )
}
