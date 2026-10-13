import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { TranslationKey } from "../i18n";

export const THEMES = [
  "study",
  "wood",
  "greenboard",
  "blackboard",
  "daylight",
  "contrast",
] as const;

export type Theme = (typeof THEMES)[number];

export interface ThemeMeta {
  id: Theme;
  labelKey: TranslationKey;
  /** Two swatches shown in the picker: ground and ink. */
  swatch: [string, string];
}

export const THEME_META: Record<Theme, ThemeMeta> = {
  study: {
    id: "study",
    labelKey: "theme.study",
    swatch: ["#14161a", "#3b82f6"],
  },
  wood: { id: "wood", labelKey: "theme.wood", swatch: ["#2b1d14", "#f2e7d3"] },
  greenboard: {
    id: "greenboard",
    labelKey: "theme.greenboard",
    swatch: ["#2e4a3d", "#f0d66e"],
  },
  blackboard: {
    id: "blackboard",
    labelKey: "theme.blackboard",
    swatch: ["#181818", "#f0eee8"],
  },
  daylight: {
    id: "daylight",
    labelKey: "theme.daylight",
    swatch: ["#faf9f7", "#2563eb"],
  },
  contrast: {
    id: "contrast",
    labelKey: "theme.contrast",
    swatch: ["#000000", "#ffd600"],
  },
};

const STORAGE_KEY = "rr_theme";

function isTheme(value: unknown): value is Theme {
  return (
    typeof value === "string" && (THEMES as readonly string[]).includes(value)
  );
}

function detectTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isTheme(stored)) return stored;
  } catch {
    // Storage unavailable — fall through.
  }

  // Respect an explicit light-mode preference on first visit.
  if (
    typeof matchMedia === "function" &&
    matchMedia("(prefers-color-scheme: light)").matches
  ) {
    return "daylight";
  }

  return "study";
}

interface ThemeValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => detectTheme());

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    // Keeps form controls and scrollbars in step with the theme.
    document.documentElement.style.colorScheme =
      theme === "daylight" ? "light" : "dark";
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // The choice simply will not persist.
    }
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside a ThemeProvider");
  return ctx;
}
