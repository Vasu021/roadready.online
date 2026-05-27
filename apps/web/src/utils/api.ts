import type { ScenarioConfig } from '@roadready/shared'

const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3001'

const TOKEN_KEY = 'rr_token'

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getStoredToken()
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, { ...init, headers })
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`)
  return res.json() as Promise<T>
}

export interface AuthPayload {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: { id: string; email: string }
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
  auth: {
    register: (payload: AuthPayload) =>
      request<AuthResponse>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    login: (payload: AuthPayload) =>
      request<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  },
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
