import {
  adaptCharacters,
  adaptEpisodes,
  adaptProjects,
} from "@/lib/content/adapters";
import { createUmbraContentRegistry } from "@/lib/content/registry";

const projects = adaptProjects();
const characters = adaptCharacters(projects);
const episodes = adaptEpisodes(projects);

export const umbraContent =
  createUmbraContentRegistry({
    projects,
    characters,
    episodes,

    // V6 entiteti koji još nisu migrirani
    stories: [],
    media: [],
    relationships: [],
    timelines: [],
    archive: [],
  });

export {
  projects,
  characters,
  episodes,
};

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
} = umbraContent;

/**
 * V6 query helpers
 */

export function getCharacterBySlug(
  slug: string,
) {
  return characters.find(
    (character) => character.slug === slug,
  );
}

export function getProjectBySlug(
  slug: string,
) {
  return projects.find(
    (project) => project.slug === slug,
  );
}