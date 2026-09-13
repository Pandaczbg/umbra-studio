/**
 * UMBRA STUDIO — V6
 * Media queries
 *
 * Read-only media facade over the canonical V6 content registry.
 *
 * Responsibilities:
 * - expose public media
 * - resolve media by id
 * - resolve media related to projects, characters, episodes and stories
 *
 * Rules:
 * - No UI logic
 * - No routing logic
 * - No data mutation
 * - No legacy-data access
 * - Public visibility is enforced here
 */

import {
  umbraContent,
} from "@/lib/content";

import type {
  MediaContent,
} from "@/lib/content/types";

function isPublic(
  item: MediaContent,
): item is MediaContent & {
  visibility: "public";
} {
  return item.visibility === "public";
}

export function getMediaItems():
  readonly MediaContent[] {
  return umbraContent.media.filter(
    isPublic,
  );
}

export function getMediaById(
  id: string,
): MediaContent | undefined {
  const media =
    umbraContent.getMedia(id);

  return media &&
    isPublic(media)
    ? media
    : undefined;
}

export function getMediaForProject(
  projectId: string,
): readonly MediaContent[] {
  return umbraContent
    .getMediaForProject(
      projectId,
    )
    .filter(isPublic);
}

export function getMediaForCharacter(
  characterId: string,
): readonly MediaContent[] {
  return umbraContent
    .getMediaForCharacter(
      characterId,
    )
    .filter(isPublic);
}

export function getMediaForEpisode(
  episodeId: string,
): readonly MediaContent[] {
  return umbraContent
    .getMediaForEpisode(
      episodeId,
    )
    .filter(isPublic);
}

export function getMediaForStory(
  storyId: string,
): readonly MediaContent[] {
  return umbraContent
    .getMediaForStory(
      storyId,
    )
    .filter(isPublic);
}