import type {
  CharacterContent,
  EpisodeContent,
  ProjectContent,
  StoryContent,
} from "./types";
export type EditorialContent =
  | CharacterContent
  | EpisodeContent
  | ProjectContent
  | StoryContent;

/** Pure chronological selector: no fabricated dates or featured-as-latest fallback. */
export function selectLatest(
  items: readonly EditorialContent[],
  limit = 2,
  now = Date.now(),
): EditorialContent[] {
  const count = Number.isFinite(limit)
    ? Math.min(12, Math.max(1, Math.floor(limit)))
    : 2;
  return items
    .filter((item) => {
      const timestamp = Date.parse(item.publishedAt ?? "");
      return (
        item.visibility === "public" &&
        Number.isFinite(timestamp) &&
        timestamp <= now &&
        (item.contentType !== "episode" || item.status === "published")
      );
    })
    .sort(
      (a, b) =>
        Date.parse(b.publishedAt!) - Date.parse(a.publishedAt!) ||
        (a.order ?? Number.MAX_SAFE_INTEGER) -
          (b.order ?? Number.MAX_SAFE_INTEGER) ||
        a.id.localeCompare(b.id),
    )
    .slice(0, count);
}
