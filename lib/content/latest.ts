import {
  getCharacters,
  getEpisodes,
  getProjects,
  getStories,
} from "@/lib/content/queries";
import type { UmbraContent } from "@/lib/content/types";

export type LatestContent = Extract<
  UmbraContent,
  | { contentType: "project" }
  | { contentType: "episode" }
  | { contentType: "character" }
  | { contentType: "story" }
>;

/**
 * Returns the newest public content items with an explicit publication time.
 * `featured` is intentionally ignored: latest is chronological, not editorial.
 */
export function getLatestPublishedContent(
  limit = 2,
): readonly LatestContent[] {
  const safeLimit = Math.min(12, Math.max(1, Math.floor(limit)));

  const candidates: LatestContent[] = [
    ...getProjects(),
    ...getEpisodes(),
    ...getCharacters(),
    ...getStories(),
  ];

  return candidates
    .filter(isPublishedEditorialContent)
    .sort(comparePublication)
    .slice(0, safeLimit);
}

function isPublishedEditorialContent(item: LatestContent): boolean {
  if (item.visibility !== "public" || !item.publishedAt) {
    return false;
  }

  if (item.contentType === "episode" && item.status !== "published") {
    return false;
  }

  const timestamp = Date.parse(item.publishedAt);

  return Number.isFinite(timestamp) && timestamp <= Date.now();
}

function comparePublication(a: LatestContent, b: LatestContent): number {
  const aTime = Date.parse(a.publishedAt ?? "");
  const bTime = Date.parse(b.publishedAt ?? "");

  if (aTime !== bTime) {
    return bTime - aTime;
  }

  const aOrder = a.order ?? Number.MAX_SAFE_INTEGER;
  const bOrder = b.order ?? Number.MAX_SAFE_INTEGER;

  if (aOrder !== bOrder) {
    return aOrder - bOrder;
  }

  return a.id.localeCompare(b.id);
}
