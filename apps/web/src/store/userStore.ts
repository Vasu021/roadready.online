import { create } from 'zustand'
import { clearStoredToken } from '../utils/api'

export interface AuthUser {
  id: string
  email: string
}

export interface SelectedCountry {
  id: string
  code: string
  name: string
  flagEmoji: string
}

export type ProgressStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
export type AuthModalMode = 'login' | 'register'

interface UserStore {
  user: AuthUser | null
  showAuthModal: boolean
  authModalMode: AuthModalMode
  selectedCountry: SelectedCountry | null
  isPremium: boolean
  scenarioProgress: Record<string, ProgressStatus>

  setUser: (user: AuthUser | null) => void
  setShowAuthModal: (show: boolean, mode?: AuthModalMode) => void
  setSelectedCountry: (country: SelectedCountry | null) => void
  setIsPremium: (value: boolean) => void
  setScenarioProgress: (progress: Record<string, ProgressStatus>) => void
  logout: () => void
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  showAuthModal: false,
  authModalMode: 'login',
  selectedCountry: null,
  isPremium: false,
  scenarioProgress: {},

  setUser: (user) => set({ user }),
  setShowAuthModal: (showAuthModal, mode) =>
    set(mode !== undefined ? { showAuthModal, authModalMode: mode } : { showAuthModal }),
  setSelectedCountry: (selectedCountry) => set({ selectedCountry }),
  setIsPremium: (isPremium) => set({ isPremium }),
  setScenarioProgress: (scenarioProgress) => set({ scenarioProgress }),
  logout: () => {
    clearStoredToken()
    set({ user: null, selectedCountry: null, scenarioProgress: {}, isPremium: false })
  },
}))
