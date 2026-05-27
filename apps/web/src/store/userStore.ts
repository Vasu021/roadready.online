import { create } from 'zustand'
import { clearStoredToken } from '../utils/api'

export interface AuthUser {
  id: string
  email: string
}

interface UserStore {
  user: AuthUser | null
  showAuthModal: boolean
  setUser: (user: AuthUser | null) => void
  setShowAuthModal: (show: boolean) => void
  logout: () => void
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  showAuthModal: false,
  setUser: (user) => set({ user }),
  setShowAuthModal: (showAuthModal) => set({ showAuthModal }),
  logout: () => {
    clearStoredToken()
    set({ user: null })
  },
}))
