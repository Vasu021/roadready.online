import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import scenarioRoutes from './routes/scenarios'
import userRoutes from './routes/users'
import progressRoutes from './routes/progress'
import authRoutes from './routes/auth'

const app = express()
const PORT = process.env.PORT ?? 3001

app.use(helmet())
app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/auth', authRoutes)
app.use('/api/scenarios', scenarioRoutes)
app.use('/api/users', userRoutes)
app.use('/api/progress', progressRoutes)

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`)
})
