import { Router } from 'express'
import type { ScenarioConfig } from '@roadready/shared'

const router = Router()

router.get('/', (_req, res) => {
  const scenarios: ScenarioConfig[] = []
  res.json(scenarios)
})

router.get('/:id', (req, res) => {
  res.json({ id: req.params.id })
})

export default router
