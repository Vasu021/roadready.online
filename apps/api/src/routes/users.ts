import { Router } from 'express'

const router = Router()

router.post('/', (_req, res) => {
  res.status(201).json({ message: 'User created' })
})

export default router
