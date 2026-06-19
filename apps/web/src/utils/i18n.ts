/**
 * Minimal i18n scaffold (PROMPT Step 8).
 *
 * Today it returns English — `t("Confirm")` → "Confirm", or `t(key, fallback)` →
 * the fallback. Wrapping user-facing strings now means adding real locales later
 * is just a matter of populating `dictionaries` and switching `currentLocale`
 * (e.g. from the browser or a user setting) — no component changes needed.
 */
export type Locale = "en";

type Dictionary = Record<string, string>;

const dictionaries: Record<Locale, Dictionary> = {
  en: {},
};

let currentLocale: Locale = "en";

export function setLocale(locale: Locale): void {
  currentLocale = locale;
}

export function getLocale(): Locale {
  return currentLocale;
}

/**
 * Translate `key`. Falls back to `fallback`, then to the key itself, so an
 * English string used as the key always renders even with no dictionary entry.
 */
export function t(key: string, fallback?: string): string {
  return dictionaries[currentLocale]?.[key] ?? fallback ?? key;
}
