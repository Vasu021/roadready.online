import { create } from "zustand";
import type { ProgressStatus } from "@roadready/shared";
import { clearStoredToken } from "../utils/api";
import { resetSessionCheck } from "../utils/session";

export interface AuthUser {
  id: string;
  email: string;
}

export interface SelectedCountry {
  id: string;
  code: string;
  name: string;
  flagEmoji: string;
}

export type { ProgressStatus };
export type AuthModalMode = "login" | "register";

const COUNTRY_KEY = "rr_country";

/**
 * The chosen country is remembered so a refresh or a deep link into /signs
 * does not drop the user back on the country picker.
 */
function readStoredCountry(): SelectedCountry | null {
  try {
    const raw = localStorage.getItem(COUNTRY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SelectedCountry>;
    if (
      typeof parsed.id === "string" &&
      typeof parsed.code === "string" &&
      typeof parsed.name === "string" &&
      typeof parsed.flagEmoji === "string"
    ) {
      return parsed as SelectedCountry;
    }
    return null;
  } catch {
    return null;
  }
}

function writeStoredCountry(country: SelectedCountry | null): void {
  try {
    if (country) localStorage.setItem(COUNTRY_KEY, JSON.stringify(country));
    else localStorage.removeItem(COUNTRY_KEY);
  } catch {
    // Storage unavailable — the selection just won't survive a reload.
  }
}

interface UserStore {
  user: AuthUser | null;
  showAuthModal: boolean;
  authModalMode: AuthModalMode;
  selectedCountry: SelectedCountry | null;
  isPremium: boolean;
  scenarioProgress: Record<string, ProgressStatus>;

  setUser: (user: AuthUser | null) => void;
  setShowAuthModal: (show: boolean, mode?: AuthModalMode) => void;
  setSelectedCountry: (country: SelectedCountry | null) => void;
  setIsPremium: (value: boolean) => void;
  setScenarioProgress: (progress: Record<string, ProgressStatus>) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  showAuthModal: false,
  authModalMode: "login",
  selectedCountry: readStoredCountry(),
  isPremium: false,
  scenarioProgress: {},

  setUser: (user) => set({ user }),
  setShowAuthModal: (showAuthModal, mode) =>
    set(
      mode !== undefined
        ? { showAuthModal, authModalMode: mode }
        : { showAuthModal },
    ),
  setSelectedCountry: (selectedCountry) => {
    writeStoredCountry(selectedCountry);
    set({ selectedCountry });
  },
  setIsPremium: (isPremium) => set({ isPremium }),
  setScenarioProgress: (scenarioProgress) => set({ scenarioProgress }),
  logout: () => {
    clearStoredToken();
    resetSessionCheck();
    writeStoredCountry(null);
    set({
      user: null,
      selectedCountry: null,
      scenarioProgress: {},
      isPremium: false,
    });
  },
}));
