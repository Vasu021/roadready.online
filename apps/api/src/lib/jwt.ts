import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET ?? 'dev-secret-change-in-production'
const EXPIRY = '7d'

export interface JwtPayload {
  sub: string   // userId
  email: string
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRY })
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, SECRET) as JwtPayload
}
