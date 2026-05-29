import { Router } from 'express'
import prisma from '../lib/prisma'
import { requireAuth } from '../middleware/auth'
import type { AuthRequest } from '../middleware/auth'

const router = Router()

// POST /api/user-country-access
// Body: { countryCode: string }
// Upserts a UserCountryAccess row for the authenticated user + country
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  const { countryCode } = req.body as { countryCode?: string }

  if (!countryCode || typeof countryCode !== 'string') {
    res.status(400).json({ error: 'countryCode is required' })
    return
  }

  try {
    const country = await prisma.country.findUnique({
      where: { code: countryCode.toUpperCase() },
    })

    if (!country) {
      res.status(404).json({ error: 'Country not found' })
      return
    }

    const existing = await prisma.userCountryAccess.findUnique({
      where: { userId_countryId: { userId: req.userId!, countryId: country.id } },
    })

    if (!existing) {
      await prisma.userCountryAccess.create({
        data: { userId: req.userId!, countryId: country.id },
      })
    }

    res.json({ alreadyExisted: existing !== null })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to record country access' })
  }
})

export default router
