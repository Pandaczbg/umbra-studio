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

export type UmbraContentRegistryInput = {
  projects?: readonly ProjectContent[];
  characters?: readonly CharacterContent[];
  episodes?: readonly EpisodeContent[];
  stories?: readonly StoryContent[];
  media?: readonly MediaContent[];
  relationships?: readonly RelationshipContent[];
  timelines?: readonly TimelineEventContent[];
  archive?: readonly ArchiveEntryContent[];
};

export type UmbraContentRegistry = {
  all: readonly UmbraContent[];

  projects: readonly ProjectContent[];
  characters: readonly CharacterContent[];
  episodes: readonly EpisodeContent[];
  stories: readonly StoryContent[];
  media: readonly MediaContent[];
  relationships: readonly RelationshipContent[];
  timelines: readonly TimelineEventContent[];
  archive: readonly ArchiveEntryContent[];

  getById(id: ContentId): UmbraContent | undefined;
  getProject(id: ContentId): ProjectContent | undefined;
  getCharacter(id: ContentId): CharacterContent | undefined;
  getEpisode(id: ContentId): EpisodeContent | undefined;
  getStory(id: ContentId): StoryContent | undefined;
  getMedia(id: ContentId): MediaContent | undefined;
  getRelationship(id: ContentId): RelationshipContent | undefined;
  getTimelineEvent(id: ContentId): TimelineEventContent | undefined;
  getArchiveEntry(id: ContentId): ArchiveEntryContent | undefined;

  getCharactersForProject(projectId: ContentId): CharacterContent[];
  getEpisodesForProject(projectId: ContentId): EpisodeContent[];
  getStoriesForProject(projectId: ContentId): StoryContent[];
  getMediaForProject(projectId: ContentId): MediaContent[];
  getTimelineForProject(projectId: ContentId): TimelineEventContent[];
  getArchiveForProject(projectId: ContentId): ArchiveEntryContent[];
  getRelationshipsForProject(projectId: ContentId): RelationshipContent[];
};

function createLookup<T extends { id: ContentId }>(
  items: readonly T[],
): Map<ContentId, T> {
  return new Map(items.map((item) => [item.id, item]));
}

export function createUmbraContentRegistry(
  input: UmbraContentRegistryInput = {},
): UmbraContentRegistry {
  const projects = [...(input.projects ?? [])];
  const characters = [...(input.characters ?? [])];
  const episodes = [...(input.episodes ?? [])];
  const stories = [...(input.stories ?? [])];
  const media = [...(input.media ?? [])];
  const relationships = [...(input.relationships ?? [])];
  const timelines = [...(input.timelines ?? [])];
  const archive = [...(input.archive ?? [])];

  const all: UmbraContent[] = [
    ...projects,
    ...characters,
    ...episodes,
    ...stories,
    ...media,
    ...relationships,
    ...timelines,
    ...archive,
  ];

  const allById = createLookup(all);
  const projectsById = createLookup(projects);
  const charactersById = createLookup(characters);
  const episodesById = createLookup(episodes);
  const storiesById = createLookup(stories);
  const mediaById = createLookup(media);
  const relationshipsById = createLookup(relationships);
  const timelinesById = createLookup(timelines);
  const archiveById = createLookup(archive);

  return {
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
      return characters
        .filter((character) => character.projectId === projectId)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    },

    getEpisodesForProject(projectId) {
      return episodes
        .filter((episode) => episode.projectId === projectId)
        .sort((a, b) => a.episodeNumber - b.episodeNumber);
    },

    getStoriesForProject(projectId) {
      return stories
        .filter((story) => story.projectId === projectId)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    },

    getMediaForProject(projectId) {
      return media.filter((item) => item.projectId === projectId);
    },

    getTimelineForProject(projectId) {
      return timelines.filter((item) => item.projectId === projectId);
    },

    getArchiveForProject(projectId) {
      return archive.filter((item) => item.projectId === projectId);
    },

    getRelationshipsForProject(projectId) {
      return relationships.filter(
        (relationship) => relationship.projectId === projectId,
      );
    },
  };
}
