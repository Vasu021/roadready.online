import type { ScenarioDef, ScenarioChecker } from './types'

// ── Stop zone (world space, XZ plane) ─────────────────────────────────────────
export const STOP_ZONE = { cx: -15, cz: -25, hw: 8, hd: 8 }

// ── Objective IDs ─────────────────────────────────────────────────────────────
const OBJ_DRIVE = 'drive-forward'
const OBJ_TURN = 'turn-left'
const OBJ_STOP = 'stop-in-zone'

// ── Checker ───────────────────────────────────────────────────────────────────
const check: ScenarioChecker = (carState, completed, _elapsed) => {
  const newlyCompleted: string[] = []
  const done = (id: string) => completed[id] || newlyCompleted.includes(id)

  const [x, , z] = carState.position
  const yaw = carState.rotation[1] // Euler Y (radians)
  const speed = carState.velocity  // km/h

  // 1 ▸ Drive forward ~55 m (spawn z=40 → reach z ≤ -15)
  if (!completed[OBJ_DRIVE] && z <= -15) {
    newlyCompleted.push(OBJ_DRIVE)
  }

  // 2 ▸ Turn left ≥ 30° (only valid after driving forward)
  if (done(OBJ_DRIVE) && !completed[OBJ_TURN] && yaw >= Math.PI / 6) {
    newlyCompleted.push(OBJ_TURN)
  }

  // 3 ▸ Stop inside the marked zone (only valid after turning)
  const inZone =
    Math.abs(x - STOP_ZONE.cx) <= STOP_ZONE.hw &&
    Math.abs(z - STOP_ZONE.cz) <= STOP_ZONE.hd
  if (done(OBJ_TURN) && !completed[OBJ_STOP] && inZone && speed < 3) {
    newlyCompleted.push(OBJ_STOP)
  }

  return {
    newlyCompleted,
    passed: done(OBJ_DRIVE) && done(OBJ_TURN) && done(OBJ_STOP),
    failed: false,
  }
}

// ── Scenario definition ───────────────────────────────────────────────────────
const basicControls: ScenarioDef = {
  config: {
    id: 'basic-controls',
    name: 'Basic Controls',
    city: 'Aachen',
    country: 'Germany',
    difficulty: 'beginner',
    description: 'Drive forward, turn left, and stop in the marked zone.',
    timeLimit: 120,
    objectives: [
      { id: OBJ_DRIVE, description: 'Drive forward 55 m', completed: false },
      { id: OBJ_TURN, description: 'Turn left', completed: false },
      { id: OBJ_STOP, description: 'Stop inside the marked zone', completed: false },
    ],
  },
  check,
  stopZone: STOP_ZONE,
}

export default basicControls
