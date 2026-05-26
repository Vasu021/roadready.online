import { useMemo } from 'react'

const ROAD_LENGTH = 100
const ROAD_WIDTH = 7           // 3.5 m per lane, 2 lanes
const ROAD_Y = 0.001           // fractionally above ground to prevent z-fighting
const MARKING_Y = 0.003        // above road surface
const EDGE_LINE_WIDTH = 0.15
const CENTER_LINE_WIDTH = 0.12
const DASH_LENGTH = 3          // German Fahrstreifenbegrenzung: 3 m on
const DASH_GAP = 3             //                                3 m off

// Solid white edge line running the full road length
function EdgeLine({ x }: { x: number }) {
  return (
    <mesh position={[x, MARKING_Y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[EDGE_LINE_WIDTH, ROAD_LENGTH]} />
      <meshBasicMaterial color="white" />
    </mesh>
  )
}

// Dashed white centre Mittellinie
function CenterDashes() {
  const positions = useMemo(() => {
    const cycle = DASH_LENGTH + DASH_GAP
    const count = Math.floor(ROAD_LENGTH / cycle)
    return Array.from({ length: count }, (_, i) =>
      -ROAD_LENGTH / 2 + DASH_LENGTH / 2 + i * cycle,
    )
  }, [])

  return (
    <>
      {positions.map((z, i) => (
        <mesh key={i} position={[0, MARKING_Y, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[CENTER_LINE_WIDTH, DASH_LENGTH]} />
          <meshBasicMaterial color="white" />
        </mesh>
      ))}
    </>
  )
}

export default function Road() {
  const edgeX = ROAD_WIDTH / 2 - EDGE_LINE_WIDTH / 2

  return (
    <group>
      {/* Asphalt surface */}
      <mesh position={[0, ROAD_Y, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[ROAD_WIDTH, ROAD_LENGTH]} />
        <meshStandardMaterial color="#1f1f1f" roughness={0.85} metalness={0} />
      </mesh>

      {/* Solid white edge lines */}
      <EdgeLine x={-edgeX} />
      <EdgeLine x={edgeX} />

      {/* Dashed centre line */}
      <CenterDashes />
    </group>
  )
}
