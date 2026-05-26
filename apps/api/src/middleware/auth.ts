import type { Request, Response, NextFunction } from 'express'
import supabaseAdmin from '../lib/supabaseAdmin'

export interface AuthRequest extends Request {
  userId?: string
  userEmail?: string
}

export async function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid Authorization header' })
    return
  }

  const token = header.slice(7)
  try {
    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token)

    if (error || !user) {
      res.status(401).json({ error: 'Invalid or expired token' })
      return
    }

    req.userId = user.id
    req.userEmail = user.email
    next()
  } catch {
    res.status(500).json({ error: 'Authentication service unavailable' })
  }
}
