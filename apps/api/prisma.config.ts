import path from 'node:path'
import { defineConfig } from 'prisma/config'
import { config as loadEnv } from 'dotenv'

// prisma.config.ts is evaluated before the CLI auto-loads .env, so load it here
loadEnv({ path: path.join(__dirname, '.env') })

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  datasource: {
    // DIRECT_URL bypasses connection poolers — required for migrate / db push
    url: process.env.DIRECT_URL,
  },
})
