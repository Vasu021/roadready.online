import basicControls from './basicControls'
import type { ScenarioDef } from './types'

const registry: Record<string, ScenarioDef> = {
  'basic-controls': basicControls,
}

export function getScenario(id: string): ScenarioDef | undefined {
  return registry[id]
}

export function getAllScenarios(): ScenarioDef[] {
  return Object.values(registry)
}

export type { ScenarioDef }
export type { ScenarioChecker } from './types'
