import { useFrame } from '@react-three/fiber'
import { useGameStore } from '../../store/gameStore'
import type { ScenarioChecker } from './types'

interface Props {
  checker: ScenarioChecker
  timeLimit: number
}

/**
 * Invisible R3F component that evaluates scenario objectives every frame.
 * Uses getState() instead of reactive selectors so it never triggers re-renders.
 */
export default function ScenarioRunner({ checker, timeLimit }: Props) {
  useFrame((_, delta) => {
    const store = useGameStore.getState()
    if (store.scenarioPhase !== 'running' || !store.carState) return

    const newElapsed = store.elapsedSeconds + delta
    store.setElapsed(newElapsed)

    if (newElapsed >= timeLimit) {
      store.setScenarioPhase('failed')
      return
    }

    // Build completed map from current objective states
    const completed: Record<string, boolean> = {}
    for (const obj of store.objectives) {
      completed[obj.id] = obj.completed
    }

    const result = checker(store.carState, completed, newElapsed)

    for (const id of result.newlyCompleted) {
      store.completeObjective(id)
    }
    if (result.passed) store.setScenarioPhase('passed')
    if (result.failed) store.setScenarioPhase('failed')
  })

  return null
}
