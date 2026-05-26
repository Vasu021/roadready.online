import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../../store/gameStore'

interface Props {
  cx: number
  cz: number
  hw: number  // half-width  (X axis)
  hd: number  // half-depth  (Z axis)
}

const _pos = new THREE.Vector3()

export default function StopZone({ cx, cz, hw, hd }: Props) {
  const fillRef = useRef<THREE.Mesh>(null!)
  const edgeRef = useRef<THREE.LineSegments>(null!)

  // Pulse the fill opacity when the car is inside the zone
  useFrame(() => {
    const state = useGameStore.getState()
    if (!state.carState) return

    const [x, , z] = state.carState.position
    _pos.set(x, 0, z)

    const inside = Math.abs(x - cx) <= hw && Math.abs(z - cz) <= hd
    const mat = fillRef.current.material as THREE.MeshBasicMaterial
    const phase = state.scenarioPhase

    if (phase === 'passed') {
      mat.color.set('#22c55e')
      mat.opacity = 0.45
    } else if (inside) {
      mat.color.set('#facc15')
      mat.opacity = 0.35
    } else {
      mat.color.set('#3b82f6')
      mat.opacity = 0.18
    }

    // Pulse edge brightness when active
    const edgeMat = edgeRef.current.material as THREE.LineBasicMaterial
    edgeMat.color.set(inside || phase === 'passed' ? '#ffffff' : '#60a5fa')
  })

  return (
    <group position={[cx, 0.02, cz]}>
      {/* Filled floor tile */}
      <mesh ref={fillRef} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[hw * 2, hd * 2]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.18} depthWrite={false} />
      </mesh>

      {/* Border edges */}
      <lineSegments ref={edgeRef}>
        <edgesGeometry
          args={[new THREE.BoxGeometry(hw * 2, 0.01, hd * 2)]}
        />
        <lineBasicMaterial color="#60a5fa" linewidth={2} />
      </lineSegments>

      {/* STOP label — flat plane with text-like indicator */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[4, 1.2]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.15} depthWrite={false} />
      </mesh>
    </group>
  )
}
