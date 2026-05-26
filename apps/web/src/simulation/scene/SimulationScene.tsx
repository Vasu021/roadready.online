import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Lighting from './Lighting'
import Ground from './Ground'
import Road from './Road'
import CarController from '../vehicles/CarController'
import ScenarioRunner from '../scenarios/ScenarioRunner'
import StopZone from '../scenarios/StopZone'
import { getScenario } from '../scenarios'

interface SimulationSceneProps {
  scenarioId?: string
  debug?: boolean
}

export default function SimulationScene({
  scenarioId,
  debug = false,
}: SimulationSceneProps) {
  const def = scenarioId ? getScenario(scenarioId) : undefined

  return (
    <Canvas
      shadows
      camera={{ position: [0, 6, 18], fov: 60, near: 0.1, far: 1000 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%' }}
    >
      <color attach="background" args={['#87ceeb']} />
      <fog attach="fog" args={['#b8d0e8', 60, 260]} />

      <Suspense fallback={null}>
        <Lighting />
        <Ground />
        <Road />
        <CarController />

        {def?.stopZone && (
          <StopZone
            cx={def.stopZone.cx}
            cz={def.stopZone.cz}
            hw={def.stopZone.hw}
            hd={def.stopZone.hd}
          />
        )}

        {def && (
          <ScenarioRunner
            checker={def.check}
            timeLimit={def.config.timeLimit}
          />
        )}
      </Suspense>

      {debug && (
        <>
          <OrbitControls makeDefault />
          <axesHelper args={[5]} />
          <gridHelper args={[100, 20, '#555', '#333']} />
        </>
      )}
    </Canvas>
  )
}
