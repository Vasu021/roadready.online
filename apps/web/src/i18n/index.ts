/**
 * Minimal translation shim.
 *
 * Translations are not wired up yet, but every user-facing string goes through
 * `t()` from the start so adding a locale later is a data change rather than a
 * sweep through every component. `t` returns the key's English default and
 * interpolates `{name}` placeholders.
 */

export type Locale = "en";

let locale: Locale = "en";

const dictionaries: Record<Locale, Record<string, string>> = {
  en: {},
};

export function setLocale(next: Locale): void {
  locale = next;
}

export function getLocale(): Locale {
  return locale;
}

export function t(
  defaultText: string,
  vars?: Record<string, string | number>,
): string {
  const translated = dictionaries[locale][defaultText] ?? defaultText;
  if (!vars) return translated;
  return translated.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}

/** Picks a singular or plural string and interpolates `{n}`. */
export function tn(n: number, one: string, many: string): string {
  return t(n === 1 ? one : many, { n });
}
