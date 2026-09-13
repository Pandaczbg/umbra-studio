import type {
  ArchiveEntryContent,
  CharacterContent,
  ContentId,
  EpisodeContent,
  MediaContent,
  ProjectContent,
  RelationshipContent,
  StoryContent,
  TimelineEventContent,
  UmbraContent,
} from "@/lib/content/types";

/* ========================================================================== 
   UMBRA STUDIO — V7 POLISH
   CANONICAL CONTENT REGISTRY

   Responsibilities
   --------------------------------------------------------------------------
   - Own one immutable in-memory index over canonical content.
   - Provide O(1) primary-id lookups.
   - Provide precomputed relationship/group lookups.
   - Keep query code free from ad-hoc scans and duplicated relationship logic.
   - Fail fast when a canonical relation points at a missing target.

   Non-responsibilities
   --------------------------------------------------------------------------
   - No UI logic.
   - No routing logic.
   - No localization logic.
   - No runtime date parsing.
   - No persistence.
   ========================================================================== */

export type UmbraContentRegistryInput = {
  readonly projects?: readonly ProjectContent[];
  readonly characters?: readonly CharacterContent[];
  readonly episodes?: readonly EpisodeContent[];
  readonly stories?: readonly StoryContent[];
  readonly media?: readonly MediaContent[];
  readonly relationships?: readonly RelationshipContent[];
  readonly timelines?: readonly TimelineEventContent[];
  readonly archive?: readonly ArchiveEntryContent[];
};

export type UmbraContentRegistry = {
  readonly all: readonly UmbraContent[];

  readonly projects: readonly ProjectContent[];
  readonly characters: readonly CharacterContent[];
  readonly episodes: readonly EpisodeContent[];
  readonly stories: readonly StoryContent[];
  readonly media: readonly MediaContent[];
  readonly relationships: readonly RelationshipContent[];
  readonly timelines: readonly TimelineEventContent[];
  readonly archive: readonly ArchiveEntryContent[];

  getById(id: ContentId): UmbraContent | undefined;

  getProject(id: ContentId): ProjectContent | undefined;

  getCharacter(id: ContentId): CharacterContent | undefined;

  getEpisode(id: ContentId): EpisodeContent | undefined;

  getStory(id: ContentId): StoryContent | undefined;

  getMedia(id: ContentId): MediaContent | undefined;

  getRelationship(id: ContentId): RelationshipContent | undefined;

  getTimelineEvent(
    id: ContentId,
  ): TimelineEventContent | undefined;

  getArchiveEntry(
    id: ContentId,
  ): ArchiveEntryContent | undefined;

  getCharactersForProject(
    projectId: ContentId,
  ): readonly CharacterContent[];

  getEpisodesForProject(
    projectId: ContentId,
  ): readonly EpisodeContent[];

  getStoriesForProject(
    projectId: ContentId,
  ): readonly StoryContent[];

  getMediaForProject(
    projectId: ContentId,
  ): readonly MediaContent[];

  getTimelineForProject(
    projectId: ContentId,
  ): readonly TimelineEventContent[];

  getArchiveForProject(
    projectId: ContentId,
  ): readonly ArchiveEntryContent[];

  getRelationshipsForProject(
    projectId: ContentId,
  ): readonly RelationshipContent[];

  getCharactersForEpisode(
    episodeId: ContentId,
  ): readonly CharacterContent[];

  getEpisodesForCharacter(
    characterId: ContentId,
  ): readonly EpisodeContent[];

  getStoriesForCharacter(
    characterId: ContentId,
  ): readonly StoryContent[];

  getMediaForCharacter(
    characterId: ContentId,
  ): readonly MediaContent[];

  getMediaForEpisode(
    episodeId: ContentId,
  ): readonly MediaContent[];

  getMediaForStory(
    storyId: ContentId,
  ): readonly MediaContent[];
};

type IdLookup<T extends { id: ContentId }> =
  ReadonlyMap<ContentId, T>;

type GroupLookup<T> =
  ReadonlyMap<ContentId, readonly T[]>;

function freezeArray<T>(
  items: readonly T[],
): readonly T[] {
  return Object.freeze([...items]);
}

function createIdLookup<T extends { id: ContentId }>(
  items: readonly T[],
): IdLookup<T> {
  const lookup = new Map<ContentId, T>();

  for (const item of items) {
    if (lookup.has(item.id)) {
      throw new Error(
        `Duplicate Umbra content id: "${item.id}"`,
      );
    }

    lookup.set(item.id, item);
  }

  return lookup;
}

function createProjectLookup<
  T extends { projectId: ContentId },
>(
  items: readonly T[],
): GroupLookup<T> {
  const groups = new Map<ContentId, T[]>();

  for (const item of items) {
    const group = groups.get(item.projectId);

    if (group) {
      group.push(item);
    } else {
      groups.set(item.projectId, [item]);
    }
  }

  const result = new Map<ContentId, readonly T[]>();

  for (const [projectId, group] of groups) {
    result.set(projectId, freezeArray(group));
  }

  return result;
}

function createRelationLookup<
  TSource extends { id: ContentId },
  TTarget extends { id: ContentId },
>(
  sourceItems: readonly TSource[],
  getTargetIds: (
    source: TSource,
  ) => readonly ContentId[],
  targetLookup: IdLookup<TTarget>,
): GroupLookup<TTarget> {
  const groups = new Map<ContentId, TTarget[]>();

  for (const source of sourceItems) {
    const groupId = source.id;

    for (const targetId of getTargetIds(source)) {
      const target = targetLookup.get(targetId);

      if (!target) {
        throw new Error(
          `Umbra content reference "${targetId}" does not exist.`,
        );
      }

      const group = groups.get(groupId);

      if (group) {
        group.push(target);
      } else {
        groups.set(groupId, [target]);
      }
    }
  }

  const result = new Map<ContentId, readonly TTarget[]>();

  for (const [sourceId, group] of groups) {
    result.set(sourceId, freezeArray(group));
  }

  return result;
}

function createReverseRelationLookup<
  TSource extends { id: ContentId },
>(
  sourceItems: readonly TSource[],
  getTargetIds: (
    source: TSource,
  ) => readonly ContentId[],
): GroupLookup<TSource> {
  const groups = new Map<ContentId, TSource[]>();

  for (const source of sourceItems) {
    for (const targetId of getTargetIds(source)) {
      const group = groups.get(targetId);

      if (group) {
        group.push(source);
      } else {
        groups.set(targetId, [source]);
      }
    }
  }

  const result = new Map<ContentId, readonly TSource[]>();

  for (const [targetId, group] of groups) {
    result.set(targetId, freezeArray(group));
  }

  return result;
}

function createMediaLookup(
  media: readonly MediaContent[],
  getRelation: (
    item: MediaContent,
  ) => ContentId | undefined,
): GroupLookup<MediaContent> {
  const groups = new Map<ContentId, MediaContent[]>();

  for (const item of media) {
    const relatedId = getRelation(item);

    if (!relatedId) {
      continue;
    }

    const group = groups.get(relatedId);

    if (group) {
      group.push(item);
    } else {
      groups.set(relatedId, [item]);
    }
  }

  const result = new Map<ContentId, readonly MediaContent[]>();

  for (const [relatedId, group] of groups) {
    result.set(relatedId, freezeArray(group));
  }

  return result;
}

function sortCharacters(
  items: readonly CharacterContent[],
): readonly CharacterContent[] {
  return freezeArray(
    [...items].sort(
      (a, b) =>
        (a.order ?? 0) - (b.order ?? 0),
    ),
  );
}

function sortEpisodes(
  items: readonly EpisodeContent[],
): readonly EpisodeContent[] {
  return freezeArray(
    [...items].sort(
      (a, b) =>
        a.episodeNumber - b.episodeNumber,
    ),
  );
}

function sortStories(
  items: readonly StoryContent[],
): readonly StoryContent[] {
  return freezeArray(
    [...items].sort(
      (a, b) =>
        (a.order ?? 0) - (b.order ?? 0),
    ),
  );
}

export function createUmbraContentRegistry(
  input: UmbraContentRegistryInput = {},
): UmbraContentRegistry {
  const projects = freezeArray(input.projects ?? []);
  const characters = sortCharacters(
    input.characters ?? [],
  );
  const episodes = sortEpisodes(
    input.episodes ?? [],
  );
  const stories = sortStories(
    input.stories ?? [],
  );
  const media = freezeArray(input.media ?? []);
  const relationships = freezeArray(
    input.relationships ?? [],
  );
  const timelines = freezeArray(
    input.timelines ?? [],
  );
  const archive = freezeArray(input.archive ?? []);

  const all = freezeArray([
    ...projects,
    ...characters,
    ...episodes,
    ...stories,
    ...media,
    ...relationships,
    ...timelines,
    ...archive,
  ]);

  const allById = createIdLookup(all);
  const projectsById = createIdLookup(projects);
  const charactersById = createIdLookup(characters);
  const episodesById = createIdLookup(episodes);
  const storiesById = createIdLookup(stories);
  const mediaById = createIdLookup(media);
  const relationshipsById = createIdLookup(
    relationships,
  );
  const timelinesById = createIdLookup(timelines);
  const archiveById = createIdLookup(archive);

  const charactersByProject = createProjectLookup(
    characters,
  );
  const episodesByProject = createProjectLookup(
    episodes,
  );
  const storiesByProject = createProjectLookup(
    stories,
  );

  const mediaWithProject = media.filter(
    (
      item,
    ): item is MediaContent & {
      projectId: ContentId;
    } => Boolean(item.projectId),
  );

  const mediaByProject = createProjectLookup(
    mediaWithProject,
  );

  const timelinesByProject = createProjectLookup(
    timelines,
  );

  const archiveWithProject = archive.filter(
    (
      item,
    ): item is ArchiveEntryContent & {
      projectId: ContentId;
    } => Boolean(item.projectId),
  );

  const archiveByProject = createProjectLookup(
    archiveWithProject,
  );

  const relationshipsByProject = createProjectLookup(
    relationships,
  );

  const charactersByEpisode = createRelationLookup(
    episodes,
    (episode) => episode.characterIds ?? [],
    charactersById,
  );

  const episodesByCharacter = createReverseRelationLookup(
    episodes,
    (episode) => episode.characterIds ?? [],
  );

  const storiesByCharacter = createReverseRelationLookup(
    stories,
    (story) => story.characterIds ?? [],
  );

  const mediaByCharacter = createMediaLookup(
    media,
    (item) => item.characterId,
  );

  const mediaByEpisode = createMediaLookup(
    media,
    (item) => item.episodeId,
  );

  const mediaByStory = createMediaLookup(
    media,
    (item) => item.storyId,
  );

  return Object.freeze({
    all,

    projects,
    characters,
    episodes,
    stories,
    media,
    relationships,
    timelines,
    archive,

    getById(id) {
      return allById.get(id);
    },

    getProject(id) {
      return projectsById.get(id);
    },

    getCharacter(id) {
      return charactersById.get(id);
    },

    getEpisode(id) {
      return episodesById.get(id);
    },

    getStory(id) {
      return storiesById.get(id);
    },

    getMedia(id) {
      return mediaById.get(id);
    },

    getRelationship(id) {
      return relationshipsById.get(id);
    },

    getTimelineEvent(id) {
      return timelinesById.get(id);
    },

    getArchiveEntry(id) {
      return archiveById.get(id);
    },

    getCharactersForProject(projectId) {
      return charactersByProject.get(projectId) ?? [];
    },

    getEpisodesForProject(projectId) {
      return episodesByProject.get(projectId) ?? [];
    },

    getStoriesForProject(projectId) {
      return storiesByProject.get(projectId) ?? [];
    },

    getMediaForProject(projectId) {
      return mediaByProject.get(projectId) ?? [];
    },

    getTimelineForProject(projectId) {
      return timelinesByProject.get(projectId) ?? [];
    },

    getArchiveForProject(projectId) {
      return archiveByProject.get(projectId) ?? [];
    },

    getRelationshipsForProject(projectId) {
      return relationshipsByProject.get(projectId) ?? [];
    },

    getCharactersForEpisode(episodeId) {
      return charactersByEpisode.get(episodeId) ?? [];
    },

    getEpisodesForCharacter(characterId) {
      return episodesByCharacter.get(characterId) ?? [];
    },

    getStoriesForCharacter(characterId) {
      return storiesByCharacter.get(characterId) ?? [];
    },

    getMediaForCharacter(characterId) {
      return mediaByCharacter.get(characterId) ?? [];
    },

    getMediaForEpisode(episodeId) {
      return mediaByEpisode.get(episodeId) ?? [];
    },

    getMediaForStory(storyId) {
      return mediaByStory.get(storyId) ?? [];
    },
  });
}
