/**
 * UMBRA STUDIO — V6
 * Canonical content queries
 *
 * One read-only query facade over the V6 content registry.
 *
 * Responsibilities:
 * - resolve canonical content
 * - resolve content by slug
 * - resolve public project relationships
 *
 * This layer contains no UI, routing, or legacy-data logic.
 */

import {
  umbraContent,
} from "@/lib/content";

import type {
  ArchiveEntryContent,
  CharacterContent,
  EpisodeContent,
  MediaContent,
  ProjectContent,
  RelationshipContent,
  StoryContent,
  TimelineEventContent,
} from "@/lib/content/types";

function isPublic<T extends {
  visibility:
    | "public"
    | "private"
    | "internal";
}>(
  item: T,
): item is T & {
  visibility: "public";
} {
  return item.visibility === "public";
}

function firstPublic<T extends {
  visibility:
    | "public"
    | "private"
    | "internal";
}>(
  item: T | undefined,
): T | undefined {
  return item && isPublic(item)
    ? item
    : undefined;
}

function publicItems<T extends {
  visibility:
    | "public"
    | "private"
    | "internal";
}>(
  items: readonly T[],
): readonly T[] {
  return items.filter(isPublic);
}

/* ─────────────────────────────────────────────
   Projects
   ───────────────────────────────────────────── */

export function getProjectById(
  id: string,
): ProjectContent | undefined {
  return firstPublic(
    umbraContent.getProject(id),
  );
}

export function getProjectBySlug(
  slug: string,
): ProjectContent | undefined {
  const project =
    umbraContent.projects.find(
      (item) => item.slug === slug,
    );

  return firstPublic(project);
}

export function getProjects(): readonly ProjectContent[] {
  return publicItems(
    umbraContent.projects,
  );
}

/* ─────────────────────────────────────────────
   Characters
   ───────────────────────────────────────────── */

export function getCharacterById(
  id: string,
): CharacterContent | undefined {
  return firstPublic(
    umbraContent.getCharacter(id),
  );
}

export function getCharacterBySlug(
  slug: string,
): CharacterContent | undefined {
  const character =
    umbraContent.characters.find(
      (item) => item.slug === slug,
    );

  return firstPublic(character);
}

export function getCharacters(): readonly CharacterContent[] {
  return publicItems(
    umbraContent.characters,
  );
}

export function getProjectCharacters(
  projectId: string,
): readonly CharacterContent[] {
  return publicItems(
    umbraContent.getCharactersForProject(
      projectId,
    ),
  );
}

export function getProjectCharactersBySlug(
  projectSlug: string,
): readonly CharacterContent[] {
  const project =
    getProjectBySlug(projectSlug);

  return project
    ? getProjectCharacters(project.id)
    : [];
}

export function getCharacterProject(
  characterId: string,
): ProjectContent | undefined {
  const character =
    getCharacterById(characterId);

  return character
    ? getProjectById(
        character.projectId,
      )
    : undefined;
}

/* ─────────────────────────────────────────────
   Episodes
   ───────────────────────────────────────────── */

export function getEpisodeById(
  id: string,
): EpisodeContent | undefined {
  return firstPublic(
    umbraContent.getEpisode(id),
  );
}

export function getEpisodeBySlug(
  slug: string,
): EpisodeContent | undefined {
  const episode =
    umbraContent.episodes.find(
      (item) => item.slug === slug,
    );

  return firstPublic(episode);
}

export function getEpisodes(): readonly EpisodeContent[] {
  return publicItems(
    umbraContent.episodes,
  );
}

export function getProjectEpisodes(
  projectId: string,
): readonly EpisodeContent[] {
  return publicItems(
    umbraContent.getEpisodesForProject(
      projectId,
    ),
  );
}

export function getProjectEpisodesBySlug(
  projectSlug: string,
): readonly EpisodeContent[] {
  const project =
    getProjectBySlug(projectSlug);

  return project
    ? getProjectEpisodes(project.id)
    : [];
}

export function getEpisodeProject(
  episodeId: string,
): ProjectContent | undefined {
  const episode =
    getEpisodeById(episodeId);

  return episode
    ? getProjectById(
        episode.projectId,
      )
    : undefined;
}

export function getEpisodeCharacters(
  episodeId: string,
): readonly CharacterContent[] {
  return publicItems(
    umbraContent.getCharactersForEpisode(
      episodeId,
    ),
  );
}

export function getCharacterEpisodes(
  characterId: string,
): readonly EpisodeContent[] {
  return publicItems(
    umbraContent.getEpisodesForCharacter(
      characterId,
    ),
  );
}

/* ─────────────────────────────────────────────
   Stories
   ───────────────────────────────────────────── */

export function getStoryById(
  id: string,
): StoryContent | undefined {
  return firstPublic(
    umbraContent.getStory(id),
  );
}

export function getStories(): readonly StoryContent[] {
  return publicItems(
    umbraContent.stories,
  );
}

export function getProjectStories(
  projectId: string,
): readonly StoryContent[] {
  return publicItems(
    umbraContent.getStoriesForProject(
      projectId,
    ),
  );
}

export function getCharacterStories(
  characterId: string,
): readonly StoryContent[] {
  return publicItems(
    umbraContent.getStoriesForCharacter(
      characterId,
    ),
  );
}

/* ─────────────────────────────────────────────
   Media
   ───────────────────────────────────────────── */

export function getMediaById(
  id: string,
): MediaContent | undefined {
  return firstPublic(
    umbraContent.getMedia(id),
  );
}

export function getMedia(): readonly MediaContent[] {
  return publicItems(
    umbraContent.media,
  );
}

export function getProjectMedia(
  projectId: string,
): readonly MediaContent[] {
  return publicItems(
    umbraContent.getMediaForProject(
      projectId,
    ),
  );
}

export function getCharacterMedia(
  characterId: string,
): readonly MediaContent[] {
  return publicItems(
    umbraContent.getMediaForCharacter(
      characterId,
    ),
  );
}

export function getEpisodeMedia(
  episodeId: string,
): readonly MediaContent[] {
  return publicItems(
    umbraContent.getMediaForEpisode(
      episodeId,
    ),
  );
}

export function getStoryMedia(
  storyId: string,
): readonly MediaContent[] {
  return publicItems(
    umbraContent.getMediaForStory(
      storyId,
    ),
  );
}

/* ─────────────────────────────────────────────
   Relationships
   ───────────────────────────────────────────── */

export function getRelationshipById(
  id: string,
): RelationshipContent | undefined {
  return firstPublic(
    umbraContent.getRelationship(id),
  );
}

export function getProjectRelationships(
  projectId: string,
): readonly RelationshipContent[] {
  return publicItems(
    umbraContent.getRelationshipsForProject(
      projectId,
    ),
  );
}

/* ─────────────────────────────────────────────
   Timeline
   ───────────────────────────────────────────── */

export function getTimelineEventById(
  id: string,
): TimelineEventContent | undefined {
  return firstPublic(
    umbraContent.getTimelineEvent(id),
  );
}

export function getProjectTimeline(
  projectId: string,
): readonly TimelineEventContent[] {
  return publicItems(
    umbraContent.getTimelineForProject(
      projectId,
    ),
  );
}

/* ─────────────────────────────────────────────
   Archive
   ───────────────────────────────────────────── */

export function getArchiveEntryById(
  id: string,
): ArchiveEntryContent | undefined {
  return firstPublic(
    umbraContent.getArchiveEntry(id),
  );
}

export function getProjectArchive(
  projectId: string,
): readonly ArchiveEntryContent[] {
  return publicItems(
    umbraContent.getArchiveForProject(
      projectId,
    ),
  );
}

/* ─────────────────────────────────────────────
   Project context
   ───────────────────────────────────────────── */

export type ProjectContext = {
  readonly project: ProjectContent;
  readonly characters: readonly CharacterContent[];
  readonly episodes: readonly EpisodeContent[];
  readonly stories: readonly StoryContent[];
  readonly media: readonly MediaContent[];
  readonly relationships: readonly RelationshipContent[];
  readonly timeline: readonly TimelineEventContent[];
  readonly archive: readonly ArchiveEntryContent[];
};

export function getProjectContext(
  projectId: string,
): ProjectContext | undefined {
  const project =
    getProjectById(projectId);

  if (!project) {
    return undefined;
  }

  return {
    project,
    characters:
      getProjectCharacters(
        projectId,
      ),
    episodes:
      getProjectEpisodes(
        projectId,
      ),
    stories:
      getProjectStories(
        projectId,
      ),
    media:
      getProjectMedia(
        projectId,
      ),
    relationships:
      getProjectRelationships(
        projectId,
      ),
    timeline:
      getProjectTimeline(
        projectId,
      ),
    archive:
      getProjectArchive(
        projectId,
      ),
  };
}