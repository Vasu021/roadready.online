import type { ScenarioConfig } from '@roadready/shared'
import type { ProgressStatus } from '../store/userStore'

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

export interface CountryRow {
  id: string
  code: string
  name: string
  flagEmoji: string
  isActive: boolean
  scenarioCount: number
  categories: { id: string; name: string; order: number; scenarioCount: number }[]
}

export interface ScenarioRow {
  id: string
  slug: string
  name: string
  description: string
  order: number
  isActive: boolean
  isPremium: boolean
  type: 'PRACTICE' | 'TEST'
  videoUrl: string | null
  questionCount: number
}

export interface CountryScenariosResponse {
  country: { id: string; code: string; name: string; flagEmoji: string }
  categories: { id: string; name: string; order: number; scenarios: ScenarioRow[] }[]
}

export interface ScenarioProgressRow {
  scenarioId: string
  status: ProgressStatus
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
  countries: {
    list: () => request<CountryRow[]>('/api/countries'),
    facts: (code: string) =>
      request<{ facts: string | null }>(`/api/countries/${code}/facts`),
    scenarios: (code: string) =>
      request<CountryScenariosResponse>(`/api/countries/${code}/scenarios`),
  },
  scenarios: {
    list: () => request<ScenarioConfig[]>('/api/scenarios'),
    progress: (userId: string, countryCode: string) =>
      request<ScenarioProgressRow[]>(`/api/scenarios/progress/${userId}/${countryCode}`),
  },
  userCountryAccess: {
    record: (countryCode: string) =>
      request<{ alreadyExisted: boolean }>('/api/user-country-access', {
        method: 'POST',
        body: JSON.stringify({ countryCode }),
      }),
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
