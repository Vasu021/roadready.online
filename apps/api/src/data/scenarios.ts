import type { ScenarioConfig } from '@roadready/shared'

export const SCENARIOS: ScenarioConfig[] = [
  {
    id: 'basic-controls',
    name: 'Basic Controls',
    city: 'Aachen',
    country: 'Germany',
    difficulty: 'beginner',
    description: 'Learn the fundamentals: accelerate, brake, steer, and stop in a marked zone.',
    timeLimit: 300,
    objectives: [
      { id: 'drive-forward', description: 'Drive forward at least 55 metres', completed: false },
      { id: 'turn-left', description: 'Turn left at least 30°', completed: false },
      { id: 'stop-in-zone', description: 'Stop inside the marked zone', completed: false },
    ],
  },
  {
    id: 'intersection-rechts-vor-links',
    name: 'Rechts vor Links',
    city: 'Aachen',
    country: 'Germany',
    difficulty: 'easy',
    description: 'Practice right-of-way at unmarked intersections — the core German traffic rule.',
    timeLimit: 180,
    objectives: [
      { id: 'approach', description: 'Approach the intersection', completed: false },
      { id: 'yield', description: 'Yield to the vehicle on the right', completed: false },
      { id: 'proceed', description: 'Proceed safely through the intersection', completed: false },
    ],
  },
  {
    id: 'roundabout',
    name: 'Roundabout',
    city: 'Aachen',
    country: 'Germany',
    difficulty: 'medium',
    description: 'Learn correct entry, navigation, and exit technique for German roundabouts.',
    timeLimit: 240,
    objectives: [
      { id: 'enter', description: 'Enter the roundabout correctly', completed: false },
      { id: 'navigate', description: 'Navigate around the circle', completed: false },
      { id: 'exit', description: 'Exit at the correct junction', completed: false },
    ],
  },
]

export function getScenarioById(id: string): ScenarioConfig | undefined {
  return SCENARIOS.find((s) => s.id === id)
}
