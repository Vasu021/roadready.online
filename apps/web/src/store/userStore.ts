import { create } from 'zustand'
import type { UserProgress } from '@roadready/shared'

interface User {
  id: string
  email: string
}

interface UserStore {
  user: User | null
  progress: UserProgress[]
  isLoading: boolean
  setUser: (user: User | null) => void
  setProgress: (progress: UserProgress[]) => void
  setLoading: (loading: boolean) => void
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  progress: [],
  isLoading: false,
  setUser: (user) => set({ user }),
  setProgress: (progress) => set({ progress }),
  setLoading: (isLoading) => set({ isLoading }),
}))
