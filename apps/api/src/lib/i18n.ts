import prisma from "./prisma";

/** The 13 languages the official German theory exam is offered in. */
export const LOCALES = [
  "en",
  "de",
  "tr",
  "ar",
  "ru",
  "ro",
  "pl",
  "fr",
  "it",
  "es",
  "pt",
  "hr",
  "el",
] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export function parseLocale(value: unknown): Locale {
  if (typeof value !== "string") return DEFAULT_LOCALE;
  const lower = value.toLowerCase().slice(0, 2);
  return (LOCALES as readonly string[]).includes(lower)
    ? (lower as Locale)
    : DEFAULT_LOCALE;
}

export type EntityType =
  | "module"
  | "lesson"
  | "question"
  | "option"
  | "scenario"
  | "topicTest"
  | "country";

type Key = `${EntityType}:${string}:${string}`;

/**
 * Looks up translations for a set of entities in one query and returns a
 * resolver. Content stays in the base locale (English) when no row exists, so
 * a partly translated language degrades field by field rather than failing.
 */
export async function loadTranslations(
  entityType: EntityType,
  entityIds: string[],
  locale: Locale,
): Promise<(id: string, field: string, fallback: string) => string> {
  if (locale === DEFAULT_LOCALE || entityIds.length === 0) {
    return (_id, _field, fallback) => fallback;
  }

  const rows = await prisma.translation.findMany({
    where: { entityType, entityId: { in: entityIds }, locale },
    select: { entityId: true, field: true, value: true },
  });

  const map = new Map<Key, string>();
  for (const row of rows) {
    map.set(`${entityType}:${row.entityId}:${row.field}`, row.value);
  }

  return (id, field, fallback) =>
    map.get(`${entityType}:${id}:${field}`) ?? fallback;
}

/** Convenience for a single entity. */
export async function translateOne(
  entityType: EntityType,
  entityId: string,
  locale: Locale,
): Promise<(field: string, fallback: string) => string> {
  const resolve = await loadTranslations(entityType, [entityId], locale);
  return (field, fallback) => resolve(entityId, field, fallback);
}
