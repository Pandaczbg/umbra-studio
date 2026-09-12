import {
  characters,
  episodes,
  getCharacter,
  getCharactersForProject,
  getEpisode,
  getEpisodesForProject,
  getProject,
  getProjectBySlug,
  projects,
} from "@/lib/content";

import type {
  CharacterContent,
  EpisodeContent,
  ProjectContent,
} from "@/lib/content/types";

export function findProjectBySlug(
  slug: string,
): ProjectContent | undefined {
  return getProjectBySlug(slug);
}

export function findCharacterBySlug(
  slug: string,
): CharacterContent | undefined {
  return characters.find(
    (character) => character.slug === slug,
  );
}

export function findEpisodeBySlug(
  slug: string,
): EpisodeContent | undefined {
  return episodes.find(
    (episode) => episode.slug === slug,
  );
}

export function findProjectById(
  projectId: string,
): ProjectContent | undefined {
  return getProject(projectId);
}

export function findCharacterById(
  characterId: string,
): CharacterContent | undefined {
  return getCharacter(characterId);
}

export function findEpisodeById(
  episodeId: string,
): EpisodeContent | undefined {
  return getEpisode(episodeId);
}

export function getCharactersForProjectSlug(
  projectSlug: string,
): CharacterContent[] {
  const project = findProjectBySlug(
    projectSlug,
  );

  if (!project) {
    return [];
  }

  return getCharactersForProject(
    project.id,
  );
}

export function getEpisodesForProjectSlug(
  projectSlug: string,
): EpisodeContent[] {
  const project = findProjectBySlug(
    projectSlug,
  );

  if (!project) {
    return [];
  }

  return getEpisodesForProject(
    project.id,
  );
}

export function getCharacterProject(
  character: CharacterContent,
): ProjectContent | undefined {
  return findProjectById(
    character.projectId,
  );
}

export function getEpisodeProject(
  episode: EpisodeContent,
): ProjectContent | undefined {
  return findProjectById(
    episode.projectId,
  );
}

export function getEpisodeCharacterContext(
  episode: EpisodeContent,
): CharacterContent[] {
  return [];
}

/**
 * Returns all public projects in their canonical registry order.
 */
export function getAllProjects(): ProjectContent[] {
  return [...projects];
}

/**
 * Returns all public characters in registry order.
 */
export function getAllCharacters(): CharacterContent[] {
  return [...characters];
}

/**
 * Returns all episodes in canonical episode order.
 */
export function getAllEpisodes(): EpisodeContent[] {
  return [...episodes];
}