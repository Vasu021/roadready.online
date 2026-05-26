import { Router } from 'express'
import { SCENARIOS, getScenarioById } from '../data/scenarios'

const router = Router()

// GET /api/scenarios
router.get('/', (_req, res) => {
  res.json(SCENARIOS)
})

// GET /api/scenarios/:id
router.get('/:id', (req, res) => {
  const scenario = getScenarioById(req.params.id)
  if (!scenario) {
    res.status(404).json({ error: 'Scenario not found' })
    return
  }
  res.json(scenario)
})

export default router
