/**
 * UMBRA STUDIO — V6
 * Canonical content entry point
 *
 * Responsibilities:
 * - Build the canonical content snapshot from V5 adapters
 * - Create the immutable V6 registry
 * - Expose readonly collections and registry accessors
 *
 * No UI logic belongs here.
 * No route logic belongs here.
 * No direct legacy-data access belongs outside the adapters.
 */

import {
  adaptCharacters,
  adaptEpisodes,
  adaptProjects,
} from "@/lib/content/adapters";
import {
  createUmbraContentRegistry,
} from "@/lib/content/registry";

const projectContent =
  adaptProjects();

const characterContent =
  adaptCharacters(
    projectContent,
  );

const episodeContent =
  adaptEpisodes(
    projectContent,
  );

export const umbraContent =
  createUmbraContentRegistry({
    projects: projectContent,
    characters: characterContent,
    episodes: episodeContent,

    /*
     * These V6 entity collections are intentionally
     * empty until their real canonical source data
     * exists.
     *
     * We do not manufacture content during migration.
     */
    stories: [],
    media: [],
    relationships: [],
    timelines: [],
    archive: [],
  });

/**
 * Canonical readonly collections
 */
export const {
  projects,
  characters,
  episodes,
  stories,
  media,
  relationships,
  timelines,
  archive,
} = umbraContent;

/**
 * Canonical registry accessors
 */
export const {
  getById,

  getProject,
  getCharacter,
  getEpisode,
  getStory,
  getMedia,
  getRelationship,
  getTimelineEvent,
  getArchiveEntry,

  getCharactersForProject,
  getEpisodesForProject,
  getStoriesForProject,
  getMediaForProject,
  getTimelineForProject,
  getArchiveForProject,
  getRelationshipsForProject,

  getCharactersForEpisode,
  getEpisodesForCharacter,
  getStoriesForCharacter,
  getMediaForCharacter,
  getMediaForEpisode,
  getMediaForStory,
} = umbraContent;

/**
 * Compatibility lookups
 *
 * These remain here temporarily so existing callers can
 * resolve canonical entities by slug without knowing
 * registry internals.
 *
 * Dedicated query functions will eventually live in
 * lib/content/queries.ts.
 */
export function getCharacterBySlug(
  slug: string,
) {
  return characters.find(
    (character) =>
      character.slug === slug,
  );
}

export function getProjectBySlug(
  slug: string,
) {
  return projects.find(
    (project) =>
      project.slug === slug,
  );
}

export function getEpisodeBySlug(
  slug: string,
) {
  return episodes.find(
    (episode) =>
      episode.slug === slug,
  );
}