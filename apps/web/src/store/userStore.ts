import { create } from "zustand";
import type { AuthUser, CountrySummary } from "@roadready/shared";
import { clearStoredToken } from "../utils/api";

export type AuthModalMode = "login" | "register";

/** Survives reloads so a returning user lands straight on their topic list. */
const COUNTRY_KEY = "rr_country";

function loadCountry(): CountrySummary | null {
  try {
    const raw = localStorage.getItem(COUNTRY_KEY);
    return raw ? (JSON.parse(raw) as CountrySummary) : null;
  } catch {
    return null;
  }
}

interface UserStore {
  user: AuthUser | null;
  /** True until the stored token has been checked against the API on boot. */
  isBootstrapping: boolean;
  showAuthModal: boolean;
  authModalMode: AuthModalMode;
  selectedCountry: CountrySummary | null;

  setUser: (user: AuthUser | null) => void;
  setBootstrapping: (value: boolean) => void;
  setShowAuthModal: (show: boolean, mode?: AuthModalMode) => void;
  setSelectedCountry: (country: CountrySummary | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isBootstrapping: true,
  showAuthModal: false,
  authModalMode: "login",
  selectedCountry: loadCountry(),

  setUser: (user) => set({ user }),
  setBootstrapping: (isBootstrapping) => set({ isBootstrapping }),

  // Both fields move together so a modal can never open showing the wrong tab.
  setShowAuthModal: (showAuthModal, mode) =>
    set(
      mode !== undefined
        ? { showAuthModal, authModalMode: mode }
        : { showAuthModal },
    ),

  setSelectedCountry: (selectedCountry) => {
    if (selectedCountry) {
      localStorage.setItem(COUNTRY_KEY, JSON.stringify(selectedCountry));
    } else {
      localStorage.removeItem(COUNTRY_KEY);
    }
    set({ selectedCountry });
  },

  logout: () => {
    clearStoredToken();
    localStorage.removeItem(COUNTRY_KEY);
    set({ user: null, selectedCountry: null, showAuthModal: false });
  },
}));
