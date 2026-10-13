import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { LOCALES } from "@roadready/shared";
import type { Locale } from "@roadready/shared";
import { setApiLocale } from "../utils/api";
import { en } from "./en";
import type { TranslationKey, Translations } from "./en";

export type { Locale, TranslationKey };

/** A locale file may be incomplete; missing keys fall back to English. */
export type Dictionary = Partial<Translations>;

export interface LocaleMeta {
  code: Locale;
  /** The language's own name, which is what a speaker looks for in a list. */
  nativeName: string;
  englishName: string;
  rtl?: boolean;
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  en: { code: "en", nativeName: "English", englishName: "English" },
  de: { code: "de", nativeName: "Deutsch", englishName: "German" },
  tr: { code: "tr", nativeName: "Türkçe", englishName: "Turkish" },
  ar: { code: "ar", nativeName: "العربية", englishName: "Arabic", rtl: true },
  ru: { code: "ru", nativeName: "Русский", englishName: "Russian" },
  ro: { code: "ro", nativeName: "Română", englishName: "Romanian" },
  pl: { code: "pl", nativeName: "Polski", englishName: "Polish" },
  fr: { code: "fr", nativeName: "Français", englishName: "French" },
  it: { code: "it", nativeName: "Italiano", englishName: "Italian" },
  es: { code: "es", nativeName: "Español", englishName: "Spanish" },
  pt: { code: "pt", nativeName: "Português", englishName: "Portuguese" },
  hr: { code: "hr", nativeName: "Hrvatski", englishName: "Croatian" },
  el: { code: "el", nativeName: "Ελληνικά", englishName: "Greek" },
};

/** Loaded on demand so a visitor downloads one language, not thirteen. */
const LOADERS: Record<Locale, () => Promise<Dictionary>> = {
  en: async () => en,
  de: () => import("./locales/de").then((m) => m.de),
  tr: () => import("./locales/tr").then((m) => m.tr),
  ar: () => import("./locales/ar").then((m) => m.ar),
  ru: () => import("./locales/ru").then((m) => m.ru),
  ro: () => import("./locales/ro").then((m) => m.ro),
  pl: () => import("./locales/pl").then((m) => m.pl),
  fr: () => import("./locales/fr").then((m) => m.fr),
  it: () => import("./locales/it").then((m) => m.it),
  es: () => import("./locales/es").then((m) => m.es),
  pt: () => import("./locales/pt").then((m) => m.pt),
  hr: () => import("./locales/hr").then((m) => m.hr),
  el: () => import("./locales/el").then((m) => m.el),
};

const STORAGE_KEY = "rr_locale";

function isLocale(value: unknown): value is Locale {
  return (
    typeof value === "string" && (LOCALES as readonly string[]).includes(value)
  );
}

/** Stored choice first, then the browser's language, then English. */
function detectLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    // Storage unavailable — fall through to the browser language.
  }

  for (const candidate of navigator.languages ?? [navigator.language]) {
    const short = candidate?.toLowerCase().slice(0, 2);
    if (isLocale(short)) return short;
  }

  return "en";
}

export type TranslateFn = (
  key: TranslationKey,
  vars?: Record<string, string | number>,
) => string;

interface I18nValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslateFn;
  /** BCP-47 tag for speech synthesis and Intl formatting. */
  bcp47: string;
  rtl: boolean;
}

const I18nContext = createContext<I18nValue | null>(null);

/** Replaces {name} placeholders. */
function interpolate(
  template: string,
  vars?: Record<string, string | number>,
): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
}

const BCP47: Record<Locale, string> = {
  en: "en-GB",
  de: "de-DE",
  tr: "tr-TR",
  ar: "ar-SA",
  ru: "ru-RU",
  ro: "ro-RO",
  pl: "pl-PL",
  fr: "fr-FR",
  it: "it-IT",
  es: "es-ES",
  pt: "pt-PT",
  hr: "hr-HR",
  el: "el-GR",
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => detectLocale());
  const [dictionary, setDictionary] = useState<Dictionary>(en);

  // Content requests must carry the same language as the interface.
  useEffect(() => {
    setApiLocale(locale);
  }, [locale]);

  useEffect(() => {
    let cancelled = false;

    LOADERS[locale]()
      .then((dict) => {
        if (!cancelled) setDictionary(dict);
      })
      .catch(() => {
        if (!cancelled) setDictionary(en);
      });

    return () => {
      cancelled = true;
    };
  }, [locale]);

  // Arabic needs the document flipped, and every locale needs the lang
  // attribute so screen readers and speech synthesis pick the right voice.
  useEffect(() => {
    const meta = LOCALE_META[locale];
    document.documentElement.lang = locale;
    document.documentElement.dir = meta.rtl ? "rtl" : "ltr";
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // The choice simply will not persist.
    }
  }, []);

  const t = useCallback<TranslateFn>(
    (key, vars) => interpolate(dictionary[key] ?? en[key] ?? key, vars),
    [dictionary],
  );

  const value = useMemo<I18nValue>(
    () => ({
      locale,
      setLocale,
      t,
      bcp47: BCP47[locale],
      rtl: Boolean(LOCALE_META[locale].rtl),
    }),
    [locale, setLocale, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside an I18nProvider");
  return ctx;
}

/** Shorthand for components that only need the translate function. */
export function useT(): TranslateFn {
  return useI18n().t;
}
