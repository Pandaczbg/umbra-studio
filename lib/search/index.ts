/**
 * UMBRA STUDIO — V6
 * Search foundation
 *
 * Read-only search over the canonical V6 content registry.
 *
 * Design goals:
 * - deterministic results
 * - normalized SR/EN matching
 * - title-first relevance where available
 * - description matching
 * - optional content-type filtering
 * - stable ordering
 * - strict compatibility with every UmbraContent variant
 *
 * Rules:
 * - No UI logic
 * - No routing logic
 * - No data mutation
 * - No legacy-data access
 */

import {
  umbraContent,
} from "@/lib/content";

import type {
  ContentType,
  UmbraContent,
} from "@/lib/content/types";

export type SearchOptions = {
  readonly query: string;
  readonly types?: readonly ContentType[];
  readonly limit?: number;
};

export type SearchResult = {
  readonly item: UmbraContent;
  readonly score: number;
};

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

function normalize(
  value: string,
): string {
  return value
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .toLowerCase()
    .trim();
}

function getTitleValues(
  item: UmbraContent,
): readonly string[] {
  switch (item.contentType) {
    case "project":
    case "character":
    case "episode":
    case "story":
    case "media":
    case "timeline-event":
    case "archive-entry":
      return [
        item.title.sr,
        item.title.en,
      ];

    case "relationship":
      return [];
  }
}

function getDescriptionValues(
  item: UmbraContent,
): readonly string[] {
  switch (item.contentType) {
    case "project":
    case "character":
    case "episode":
    case "story":
    case "media":
      return [
        item.shortDescription?.sr ?? "",
        item.shortDescription?.en ?? "",
        item.description?.sr ?? "",
        item.description?.en ?? "",
      ];

    case "relationship":
    case "timeline-event":
    case "archive-entry":
      return [
        item.description?.sr ?? "",
        item.description?.en ?? "",
      ];
  }
}

function getSlugValue(
  item: UmbraContent,
): string {
  switch (item.contentType) {
    case "project":
    case "character":
    case "episode":
    case "story":
    case "media":
    case "timeline-event":
      return item.slug;

    case "relationship":
    case "archive-entry":
      return "";
  }
}

function getTitleScore(
  item: UmbraContent,
  query: string,
): number {
  const titles =
    getTitleValues(item)
      .filter(Boolean)
      .map(normalize);

  if (
    titles.some(
      (title) =>
        title === query,
    )
  ) {
    return 100;
  }

  if (
    titles.some(
      (title) =>
        title.startsWith(query),
    )
  ) {
    return 90;
  }

  if (
    titles.some(
      (title) =>
        title.includes(query),
    )
  ) {
    return 80;
  }

  return 0;
}

function getSlugScore(
  item: UmbraContent,
  query: string,
): number {
  const slug =
    normalize(
      getSlugValue(item),
    );

  if (!slug) {
    return 0;
  }

  if (
    slug === query
  ) {
    return 70;
  }

  if (
    slug.startsWith(query)
  ) {
    return 60;
  }

  if (
    slug.includes(query)
  ) {
    return 55;
  }

  return 0;
}

function getDescriptionScore(
  item: UmbraContent,
  query: string,
): number {
  const description =
    getDescriptionValues(item)
      .filter(Boolean)
      .map(normalize)
      .join(" ");

  if (
    description.includes(
      query,
    )
  ) {
    return 50;
  }

  return 0;
}

function calculateScore(
  item: UmbraContent,
  query: string,
): number {
  return Math.max(
    getTitleScore(
      item,
      query,
    ),
    getSlugScore(
      item,
      query,
    ),
    getDescriptionScore(
      item,
      query,
    ),
  );
}

function compareResults(
  a: SearchResult,
  b: SearchResult,
): number {
  if (
    a.score !==
    b.score
  ) {
    return b.score - a.score;
  }

  const titleA =
    normalize(
      getTitleValues(a.item)[0] ??
        "",
    );

  const titleB =
    normalize(
      getTitleValues(b.item)[0] ??
        "",
    );

  const titleOrder =
    titleA.localeCompare(
      titleB,
      "sr",
    );

  if (
    titleOrder !== 0
  ) {
    return titleOrder;
  }

  return a.item.id.localeCompare(
    b.item.id,
  );
}

function resolveLimit(
  limit: number | undefined,
): number {
  if (
    typeof limit !==
      "number" ||
    !Number.isFinite(limit)
  ) {
    return DEFAULT_LIMIT;
  }

  return Math.min(
    MAX_LIMIT,
    Math.max(
      1,
      Math.floor(limit),
    ),
  );
}

export function searchContent(
  options: SearchOptions,
): readonly SearchResult[] {
  const query =
    normalize(
      options.query,
    );

  if (!query) {
    return [];
  }

  const allowedTypes =
    options.types &&
    options.types.length > 0
      ? new Set(
          options.types,
        )
      : undefined;

  const results =
    umbraContent.all
      .filter(
        (item) =>
          item.visibility ===
            "public" &&
          (
            !allowedTypes ||
            allowedTypes.has(
              item.contentType,
            )
          ),
      )
      .map(
        (
          item,
        ): SearchResult => ({
          item,
          score:
            calculateScore(
              item,
              query,
            ),
        }),
      )
      .filter(
        (
          result,
        ) =>
          result.score > 0,
      );

  results.sort(
    compareResults,
  );

  return results.slice(
    0,
    resolveLimit(
      options.limit,
    ),
  );
}

export function searchProjects(
  query: string,
  limit = DEFAULT_LIMIT,
): readonly SearchResult[] {
  return searchContent({
    query,
    limit,
    types: [
      "project",
    ],
  });
}

export function searchCharacters(
  query: string,
  limit = DEFAULT_LIMIT,
): readonly SearchResult[] {
  return searchContent({
    query,
    limit,
    types: [
      "character",
    ],
  });
}

export function searchEpisodes(
  query: string,
  limit = DEFAULT_LIMIT,
): readonly SearchResult[] {
  return searchContent({
    query,
    limit,
    types: [
      "episode",
    ],
  });
}

export function searchStories(
  query: string,
  limit = DEFAULT_LIMIT,
): readonly SearchResult[] {
  return searchContent({
    query,
    limit,
    types: [
      "story",
    ],
  });
}

export function searchAll(
  query: string,
  limit = DEFAULT_LIMIT,
): readonly SearchResult[] {
  return searchContent({
    query,
    limit,
  });
}