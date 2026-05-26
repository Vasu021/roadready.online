import type { ScenarioConfig } from '@roadready/shared'
import { supabase } from '../lib/supabase'

const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3001'

async function getToken(): Promise<string | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session?.access_token ?? null
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getToken()
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, { ...init, headers })
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`)
  return res.json() as Promise<T>
}

export interface AttemptRow {
  id: string
  userId: string
  scenarioId: string
  passed: boolean
  score: number
  timeSeconds: number
  completedAt: string
}

export interface SaveAttemptPayload {
  scenarioId: string
  passed: boolean
  score?: number
  timeSeconds?: number
}

export const api = {
  scenarios: {
    list: () => request<ScenarioConfig[]>('/api/scenarios'),
  },
  progress: {
    save: (payload: SaveAttemptPayload) =>
      request<AttemptRow>('/api/progress', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    getByUser: (userId: string) => request<AttemptRow[]>(`/api/progress/${userId}`),
  },
}
