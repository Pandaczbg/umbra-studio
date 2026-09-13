/**
 * UMBRA STUDIO — V6
 * Canonical content entry point
 *
 * Responsibilities:
 * - Consume canonical V6 content registries directly
 * - Create the canonical in-memory registry
 * - Expose readonly collections and registry accessors
 *
 * Rules:
 * - No UI logic
 * - No routing logic
 * - No validation side effects
 * - No legacy adapters
 * - No data transformation
 * - No slug-query logic
 */

import {
  characters as sourceCharacters,
} from "@/data/characters";

import {
  episodes as sourceEpisodes,
} from "@/data/episodes";

import {
  projects as sourceProjects,
} from "@/data/projects";

import {
  createUmbraContentRegistry,
} from "@/lib/content/registry";

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

/* -------------------------------------------------------------------------- */
/* Canonical source snapshot                                                  */
/* -------------------------------------------------------------------------- */

const projectContent: readonly ProjectContent[] =
  sourceProjects;

const characterContent: readonly CharacterContent[] =
  sourceCharacters;

const episodeContent: readonly EpisodeContent[] =
  sourceEpisodes;

/*
 * These collections intentionally remain empty until
 * their real canonical source data exists.
 *
 * No content is invented during migration.
 */
const storyContent: readonly StoryContent[] =
  [];

const mediaContent: readonly MediaContent[] =
  [];

const relationshipContent:
  readonly RelationshipContent[] =
  [];

const timelineContent:
  readonly TimelineEventContent[] =
  [];

const archiveContent:
  readonly ArchiveEntryContent[] =
  [];

/* -------------------------------------------------------------------------- */
/* Canonical registry                                                         */
/* -------------------------------------------------------------------------- */

export const umbraContent =
  createUmbraContentRegistry({
    projects: projectContent,
    characters: characterContent,
    episodes: episodeContent,
    stories: storyContent,
    media: mediaContent,
    relationships: relationshipContent,
    timelines: timelineContent,
    archive: archiveContent,
  });

/* -------------------------------------------------------------------------- */
/* Canonical collections                                                      */
/* -------------------------------------------------------------------------- */

export const projects =
  umbraContent.projects;

export const characters =
  umbraContent.characters;

export const episodes =
  umbraContent.episodes;

export const stories =
  umbraContent.stories;

export const media =
  umbraContent.media;

export const relationships =
  umbraContent.relationships;

export const timelines =
  umbraContent.timelines;

export const archive =
  umbraContent.archive;

/* -------------------------------------------------------------------------- */
/* Registry accessors                                                         */
/* -------------------------------------------------------------------------- */

export const getById =
  umbraContent.getById;

export const getProject =
  umbraContent.getProject;

export const getCharacter =
  umbraContent.getCharacter;

export const getEpisode =
  umbraContent.getEpisode;

export const getStory =
  umbraContent.getStory;

export const getMedia =
  umbraContent.getMedia;

export const getRelationship =
  umbraContent.getRelationship;

export const getTimelineEvent =
  umbraContent.getTimelineEvent;

export const getArchiveEntry =
  umbraContent.getArchiveEntry;

/* -------------------------------------------------------------------------- */
/* Project relationships                                                      */
/* -------------------------------------------------------------------------- */

export const getCharactersForProject =
  umbraContent.getCharactersForProject;

export const getEpisodesForProject =
  umbraContent.getEpisodesForProject;

export const getStoriesForProject =
  umbraContent.getStoriesForProject;

export const getMediaForProject =
  umbraContent.getMediaForProject;

export const getTimelineForProject =
  umbraContent.getTimelineForProject;

export const getArchiveForProject =
  umbraContent.getArchiveForProject;

export const getRelationshipsForProject =
  umbraContent.getRelationshipsForProject;

/* -------------------------------------------------------------------------- */
/* Cross-content relationships                                                */
/* -------------------------------------------------------------------------- */

export const getCharactersForEpisode =
  umbraContent.getCharactersForEpisode;

export const getEpisodesForCharacter =
  umbraContent.getEpisodesForCharacter;

export const getStoriesForCharacter =
  umbraContent.getStoriesForCharacter;

export const getMediaForCharacter =
  umbraContent.getMediaForCharacter;

export const getMediaForEpisode =
  umbraContent.getMediaForEpisode;

export const getMediaForStory =
  umbraContent.getMediaForStory;