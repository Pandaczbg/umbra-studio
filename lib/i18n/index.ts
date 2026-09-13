/**
 * UMBRA STUDIO — V6
 * Internationalization foundation
 *
 * Responsibilities:
 * - define the canonical application locale type
 * - resolve locale prefixes
 * - resolve locale from pathname
 *
 * Rules:
 * - No UI logic
 * - No content data
 * - No React
 * - No translation dictionaries
 * - Pathname is the source of truth for route locale
 */

export type Locale =
  | "sr"
  | "en";

export const DEFAULT_LOCALE: Locale =
  "sr";

export const EN_LOCALE_PREFIX =
  "/en";

export function getLocalePrefix(
  locale: Locale,
): string {
  return locale === "en"
    ? EN_LOCALE_PREFIX
    : "";
}

export function resolveLocale(
  pathname: string | null | undefined,
): Locale {
  const currentPath =
    pathname ?? "/";

  return currentPath ===
    EN_LOCALE_PREFIX ||
    currentPath.startsWith(
      `${EN_LOCALE_PREFIX}/`,
    )
    ? "en"
    : DEFAULT_LOCALE;
}