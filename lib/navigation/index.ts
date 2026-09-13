/**
 * UMBRA STUDIO — V6
 * Navigation helpers
 *
 * Small route helpers shared by navigation-aware code.
 *
 * Responsibilities:
 * - resolve locale route prefixes
 * - build canonical project routes
 * - build canonical character routes
 * - build canonical episode routes
 * - build language-aware watch routes
 *
 * Rules:
 * - No UI logic
 * - No React
 * - No content registry access
 * - No hard-coded content data
 */

export type NavigationLocale =
  | "sr"
  | "en";

export function getNavigationPrefix(
  locale: NavigationLocale,
): string {
  return locale === "en"
    ? "/en"
    : "";
}

export function getProjectsHref(
  locale: NavigationLocale,
): string {
  return `${getNavigationPrefix(locale)}/projects`;
}

export function getCharactersHref(
  locale: NavigationLocale,
): string {
  return `${getNavigationPrefix(locale)}/characters`;
}

export function getProjectHref(
  slug: string,
  locale: NavigationLocale,
): string {
  return locale === "en"
    ? `/en/projects/${slug}`
    : `/serije/${slug}`;
}

export function getCharacterHref(
  slug: string,
  locale: NavigationLocale,
): string {
  return locale === "en"
    ? `/en/characters/${slug}`
    : `/likovi/${slug}`;
}

export function getEpisodeHref(
  projectSlug: string,
  episodeSlug: string,
  locale: NavigationLocale,
): string {
  return locale === "en"
    ? `/en/projects/${projectSlug}/episodes/${episodeSlug}`
    : `/serije/${projectSlug}/epizode/${episodeSlug}`;
}

export function getStoryHref(
  projectSlug: string,
  storySlug: string,
  locale: NavigationLocale,
): string {
  return locale === "en"
    ? `/en/projects/${projectSlug}/stories/${storySlug}`
    : `/serije/${projectSlug}/price/${storySlug}`;
}

export function getWatchHref(
  locale: NavigationLocale,
): string {
  return locale === "en"
    ? "/en#watch"
    : "/#watch";
}

export function getStudioHref(
  locale: NavigationLocale,
): string {
  return locale === "en"
    ? "/en#o-studiju"
    : "/#o-studiju";
}