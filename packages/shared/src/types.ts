export type Difficulty = 'beginner' | 'easy' | 'medium' | 'hard'

export interface Objective {
  id: string
  description: string
  completed: boolean
}

export interface ScenarioConfig {
  id: string
  name: string
  city: string
  country: string
  difficulty: Difficulty
  description: string
  objectives: Objective[]
  timeLimit: number
}

export interface CarState {
  position: [number, number, number]
  rotation: [number, number, number]
  velocity: number
  isHandbraking: boolean
}

export interface UserProgress {
  userId: string
  scenarioId: string
  completedAt: string
  score: number
  passed: boolean
}
