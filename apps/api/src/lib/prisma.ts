import { PrismaClient } from '@prisma/client'

// Prisma 7: no constructor options needed — reads DATABASE_URL from process.env
// dotenv/config is imported first in src/index.ts so DATABASE_URL is already set
const prisma = new PrismaClient()

export default prisma
