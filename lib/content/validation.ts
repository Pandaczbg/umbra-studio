/**
 * UMBRA STUDIO — V6
 * Canonical content validation
 *
 * Validates the V6 content graph before it enters the registry.
 *
 * Responsibilities:
 * - unique ids
 * - unique slugs per content type
 * - valid project ownership
 * - valid cross-content references
 * - project-boundary integrity
 * - basic content invariants
 *
 * No UI logic.
 * No routing logic.
 * No legacy-data access.
 */

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

export type UmbraContentValidationInput = {
  readonly projects: readonly ProjectContent[];
  readonly characters: readonly CharacterContent[];
  readonly episodes: readonly EpisodeContent[];
  readonly stories: readonly StoryContent[];
  readonly media: readonly MediaContent[];
  readonly relationships: readonly RelationshipContent[];
  readonly timelines: readonly TimelineEventContent[];
  readonly archive: readonly ArchiveEntryContent[];
};

type ContentWithProject = {
  readonly projectId?: ContentId;
};

type ValidationContext = {
  readonly allById: ReadonlyMap<
    ContentId,
    UmbraContent
  >;
  readonly projectsById: ReadonlyMap<
    ContentId,
    ProjectContent
  >;
  readonly charactersById: ReadonlyMap<
    ContentId,
    CharacterContent
  >;
  readonly episodesById: ReadonlyMap<
    ContentId,
    EpisodeContent
  >;
  readonly storiesById: ReadonlyMap<
    ContentId,
    StoryContent
  >;
  readonly mediaById: ReadonlyMap<
    ContentId,
    MediaContent
  >;
  readonly projectIds: ReadonlySet<ContentId>;
};

class UmbraContentValidationError extends Error {
  readonly issues: readonly string[];

  constructor(
    issues: readonly string[],
  ) {
    super(
      [
        "Umbra V6 content validation failed:",
        ...issues.map(
          (issue) => `- ${issue}`,
        ),
      ].join("\n"),
    );

    this.name =
      "UmbraContentValidationError";
    this.issues = issues;
  }
}

export function validateUmbraContent(
  input: UmbraContentValidationInput,
): void {
  const all: readonly UmbraContent[] = [
    ...input.projects,
    ...input.characters,
    ...input.episodes,
    ...input.stories,
    ...input.media,
    ...input.relationships,
    ...input.timelines,
    ...input.archive,
  ];

  const issues: string[] = [];

  const context =
    createValidationContext(
      all,
      input,
    );

  validateIds(
    all,
    issues,
  );

  validateSlugs(
    input.projects,
    "project",
    issues,
  );

  validateSlugs(
    input.characters,
    "character",
    issues,
  );

  validateSlugs(
    input.episodes,
    "episode",
    issues,
  );

  validateSlugs(
    input.stories,
    "story",
    issues,
  );

  validateSlugs(
    input.media,
    "media",
    issues,
  );

  validateSlugs(
    input.timelines,
    "timeline-event",
    issues,
  );

  validateProjectOwnedContent(
    input.characters,
    context,
    "character",
    issues,
  );

  validateProjectOwnedContent(
    input.episodes,
    context,
    "episode",
    issues,
  );

  validateProjectOwnedContent(
    input.stories,
    context,
    "story",
    issues,
  );

  validateEpisodes(
    input.episodes,
    context,
    issues,
  );

  validateStories(
    input.stories,
    context,
    issues,
  );

  validateCharacters(
    input.characters,
    context,
    issues,
  );

  validateMedia(
    input.media,
    context,
    issues,
  );

  validateRelationships(
    input.relationships,
    context,
    issues,
  );

  validateTimelines(
    input.timelines,
    context,
    issues,
  );

  validateArchive(
    input.archive,
    context,
    issues,
  );

  validateProjects(
    input.projects,
    issues,
  );

  if (issues.length > 0) {
    throw new UmbraContentValidationError(
      issues,
    );
  }
}

/* -------------------------------------------------------------------------- */
/* Context                                                                    */
/* -------------------------------------------------------------------------- */

function createValidationContext(
  all: readonly UmbraContent[],
  input: UmbraContentValidationInput,
): ValidationContext {
  return {
    allById: createMap(all),
    projectsById: createMap(
      input.projects,
    ),
    charactersById: createMap(
      input.characters,
    ),
    episodesById: createMap(
      input.episodes,
    ),
    storiesById: createMap(
      input.stories,
    ),
    mediaById: createMap(
      input.media,
    ),
    projectIds: createIdSet(
      input.projects,
    ),
  };
}

/* -------------------------------------------------------------------------- */
/* Identity                                                                   */
/* -------------------------------------------------------------------------- */

function validateIds(
  items: readonly UmbraContent[],
  issues: string[],
): void {
  const seen =
    new Set<ContentId>();

  for (const item of items) {
    if (!item.id.trim()) {
      issues.push(
        `${item.contentType} has an empty id`,
      );
      continue;
    }

    if (seen.has(item.id)) {
      issues.push(
        `duplicate content id "${item.id}"`,
      );
      continue;
    }

    seen.add(item.id);
  }
}

function validateSlugs<
  T extends {
    slug: string;
  },
>(
  items: readonly T[],
  type: string,
  issues: string[],
): void {
  const seen =
    new Set<string>();

  for (const item of items) {
    if (!item.slug.trim()) {
      issues.push(
        `${type} has an empty slug`,
      );
      continue;
    }

    if (seen.has(item.slug)) {
      issues.push(
        `duplicate ${type} slug "${item.slug}"`,
      );
      continue;
    }

    seen.add(item.slug);
  }
}

/* -------------------------------------------------------------------------- */
/* Projects                                                                   */
/* -------------------------------------------------------------------------- */

function validateProjects(
  projects: readonly ProjectContent[],
  issues: string[],
): void {
  for (const project of projects) {
    validateLocalizedTitle(
      project,
      issues,
    );

    if (
      project.source &&
      !project.source.title.trim()
    ) {
      issues.push(
        `project "${project.id}" has an empty source title`,
      );
    }
  }
}

/* -------------------------------------------------------------------------- */
/* Project ownership                                                          */
/* -------------------------------------------------------------------------- */

function validateProjectOwnedContent(
  items: readonly ContentWithProject[],
  context: ValidationContext,
  type: string,
  issues: string[],
): void {
  for (const item of items) {
    if (!item.projectId) {
      issues.push(
        `${type} "${getItemId(item)}" has no projectId`,
      );
      continue;
    }

    if (
      !context.projectIds.has(
        item.projectId,
      )
    ) {
      issues.push(
        `${type} "${getItemId(item)}" references unknown project "${item.projectId}"`,
      );
    }
  }
}

/* -------------------------------------------------------------------------- */
/* Episodes                                                                   */
/* -------------------------------------------------------------------------- */

function validateEpisodes(
  episodes: readonly EpisodeContent[],
  context: ValidationContext,
  issues: string[],
): void {
  for (const episode of episodes) {
    validateLocalizedTitle(
      episode,
      issues,
    );

    if (
      !Number.isInteger(
        episode.episodeNumber,
      ) ||
      episode.episodeNumber < 1
    ) {
      issues.push(
        `episode "${episode.id}" has invalid episodeNumber`,
      );
    }

    if (
      episode.runtimeSeconds !==
        undefined &&
      episode.runtimeSeconds < 0
    ) {
      issues.push(
        `episode "${episode.id}" has invalid runtimeSeconds`,
      );
    }

    if (
      episode.chapterStart !==
        undefined &&
      episode.chapterEnd !==
        undefined &&
      episode.chapterEnd <
        episode.chapterStart
    ) {
      issues.push(
        `episode "${episode.id}" has chapterEnd before chapterStart`,
      );
    }

    if (
      episode.storyId
    ) {
      const story =
        context.storiesById.get(
          episode.storyId,
        );

      if (!story) {
        issues.push(
          `episode "${episode.id}" references unknown story "${episode.storyId}"`,
        );
      } else if (
        story.projectId !==
        episode.projectId
      ) {
        issues.push(
          `episode "${episode.id}" and story "${story.id}" belong to different projects`,
        );
      }
    }

    for (const characterId of
      episode.characterIds ?? []) {
      const character =
        context.charactersById.get(
          characterId,
        );

      if (!character) {
        issues.push(
          `episode "${episode.id}" references unknown character "${characterId}"`,
        );
        continue;
      }

      assertSameProject(
        episode.projectId,
        character.projectId,
        `episode "${episode.id}"`,
        `character "${character.id}"`,
        issues,
      );
    }
  }
}

/* -------------------------------------------------------------------------- */
/* Stories                                                                    */
/* -------------------------------------------------------------------------- */

function validateStories(
  stories: readonly StoryContent[],
  context: ValidationContext,
  issues: string[],
): void {
  for (const story of stories) {
    validateLocalizedTitle(
      story,
      issues,
    );

    for (const characterId of
      story.characterIds ?? []) {
      const character =
        context.charactersById.get(
          characterId,
        );

      if (!character) {
        issues.push(
          `story "${story.id}" references unknown character "${characterId}"`,
        );
        continue;
      }

      assertSameProject(
        story.projectId,
        character.projectId,
        `story "${story.id}"`,
        `character "${character.id}"`,
        issues,
      );
    }

    for (const episodeId of
      story.episodeIds ?? []) {
      const episode =
        context.episodesById.get(
          episodeId,
        );

      if (!episode) {
        issues.push(
          `story "${story.id}" references unknown episode "${episodeId}"`,
        );
        continue;
      }

      assertSameProject(
        story.projectId,
        episode.projectId,
        `story "${story.id}"`,
        `episode "${episode.id}"`,
        issues,
      );
    }
  }
}

/* -------------------------------------------------------------------------- */
/* Characters                                                                 */
/* -------------------------------------------------------------------------- */

function validateCharacters(
  characters: readonly CharacterContent[],
  context: ValidationContext,
  issues: string[],
): void {
  for (const character of characters) {
    validateLocalizedTitle(
      character,
      issues,
    );

    for (const episodeId of
      character.episodeIds ?? []) {
      const episode =
        context.episodesById.get(
          episodeId,
        );

      if (!episode) {
        issues.push(
          `character "${character.id}" references unknown episode "${episodeId}"`,
        );
        continue;
      }

      assertSameProject(
        character.projectId,
        episode.projectId,
        `character "${character.id}"`,
        `episode "${episode.id}"`,
        issues,
      );
    }

    for (const storyId of
      character.storyIds ?? []) {
      const story =
        context.storiesById.get(
          storyId,
        );

      if (!story) {
        issues.push(
          `character "${character.id}" references unknown story "${storyId}"`,
        );
        continue;
      }

      assertSameProject(
        character.projectId,
        story.projectId,
        `character "${character.id}"`,
        `story "${story.id}"`,
        issues,
      );
    }

    for (const mediaId of
      character.mediaIds ?? []) {
      const media =
        context.mediaById.get(
          mediaId,
        );

      if (!media) {
        issues.push(
          `character "${character.id}" references unknown media "${mediaId}"`,
        );
        continue;
      }

      validateMediaProject(
        media,
        character.projectId,
        `character "${character.id}"`,
        issues,
      );
    }
  }
}

/* -------------------------------------------------------------------------- */
/* Media                                                                      */
/* -------------------------------------------------------------------------- */

function validateMedia(
  media: readonly MediaContent[],
  context: ValidationContext,
  issues: string[],
): void {
  for (const item of media) {
    validateLocalizedTitle(
      item,
      issues,
    );

    if (!item.src.trim()) {
      issues.push(
        `media "${item.id}" has an empty src`,
      );
    }

    const referencedProjects =
      new Set<ContentId>();

    addMediaProject(
      item.projectId,
      context,
      referencedProjects,
      item.id,
      issues,
    );

    if (item.characterId) {
      const character =
        context.charactersById.get(
          item.characterId,
        );

      if (!character) {
        issues.push(
          `media "${item.id}" references unknown character "${item.characterId}"`,
        );
      } else {
        referencedProjects.add(
          character.projectId,
        );
      }
    }

    if (item.episodeId) {
      const episode =
        context.episodesById.get(
          item.episodeId,
        );

      if (!episode) {
        issues.push(
          `media "${item.id}" references unknown episode "${item.episodeId}"`,
        );
      } else {
        referencedProjects.add(
          episode.projectId,
        );
      }
    }

    if (item.storyId) {
      const story =
        context.storiesById.get(
          item.storyId,
        );

      if (!story) {
        issues.push(
          `media "${item.id}" references unknown story "${item.storyId}"`,
        );
      } else {
        referencedProjects.add(
          story.projectId,
        );
      }
    }

    if (
      referencedProjects.size > 1
    ) {
      issues.push(
        `media "${item.id}" references content from multiple projects`,
      );
    }
  }
}

/* -------------------------------------------------------------------------- */
/* Relationships                                                              */
/* -------------------------------------------------------------------------- */

function validateRelationships(
  relationships: readonly RelationshipContent[],
  context: ValidationContext,
  issues: string[],
): void {
  for (const relationship of relationships) {
    if (
      !context.projectIds.has(
        relationship.projectId,
      )
    ) {
      issues.push(
        `relationship "${relationship.id}" references unknown project "${relationship.projectId}"`,
      );
    }

    const source =
      context.allById.get(
        relationship.sourceId,
      );

    const target =
      context.allById.get(
        relationship.targetId,
      );

    if (!source) {
      issues.push(
        `relationship "${relationship.id}" references unknown source "${relationship.sourceId}"`,
      );
    }

    if (!target) {
      issues.push(
        `relationship "${relationship.id}" references unknown target "${relationship.targetId}"`,
      );
    }

    if (
      relationship.sourceId ===
      relationship.targetId
    ) {
      issues.push(
        `relationship "${relationship.id}" cannot connect an entity to itself`,
      );
    }

    if (source) {
      validateContentProject(
        source,
        relationship.projectId,
        `relationship "${relationship.id}" source`,
        issues,
      );
    }

    if (target) {
      validateContentProject(
        target,
        relationship.projectId,
        `relationship "${relationship.id}" target`,
        issues,
      );
    }
  }
}

/* -------------------------------------------------------------------------- */
/* Timeline                                                                   */
/* -------------------------------------------------------------------------- */

function validateTimelines(
  timelines: readonly TimelineEventContent[],
  context: ValidationContext,
  issues: string[],
): void {
  for (const timeline of timelines) {
    if (
      !context.projectIds.has(
        timeline.projectId,
      )
    ) {
      issues.push(
        `timeline "${timeline.id}" references unknown project "${timeline.projectId}"`,
      );
      continue;
    }

    validateLocalizedTitle(
      timeline,
      issues,
    );

    for (const characterId of
      timeline.characterIds ?? []) {
      const character =
        context.charactersById.get(
          characterId,
        );

      if (!character) {
        issues.push(
          `timeline "${timeline.id}" references unknown character "${characterId}"`,
        );
        continue;
      }

      assertSameProject(
        timeline.projectId,
        character.projectId,
        `timeline "${timeline.id}"`,
        `character "${character.id}"`,
        issues,
      );
    }

    for (const storyId of
      timeline.storyIds ?? []) {
      const story =
        context.storiesById.get(
          storyId,
        );

      if (!story) {
        issues.push(
          `timeline "${timeline.id}" references unknown story "${storyId}"`,
        );
        continue;
      }

      assertSameProject(
        timeline.projectId,
        story.projectId,
        `timeline "${timeline.id}"`,
        `story "${story.id}"`,
        issues,
      );
    }

    for (const episodeId of
      timeline.episodeIds ?? []) {
      const episode =
        context.episodesById.get(
          episodeId,
        );

      if (!episode) {
        issues.push(
          `timeline "${timeline.id}" references unknown episode "${episodeId}"`,
        );
        continue;
      }

      assertSameProject(
        timeline.projectId,
        episode.projectId,
        `timeline "${timeline.id}"`,
        `episode "${episode.id}"`,
        issues,
      );
    }
  }
}

/* -------------------------------------------------------------------------- */
/* Archive                                                                    */
/* -------------------------------------------------------------------------- */

function validateArchive(
  archive: readonly ArchiveEntryContent[],
  context: ValidationContext,
  issues: string[],
): void {
  for (const entry of archive) {
    if (
      entry.projectId &&
      !context.projectIds.has(
        entry.projectId,
      )
    ) {
      issues.push(
        `archive "${entry.id}" references unknown project "${entry.projectId}"`,
      );
    }

    if (entry.characterId) {
      const character =
        context.charactersById.get(
          entry.characterId,
        );

      if (!character) {
        issues.push(
          `archive "${entry.id}" references unknown character "${entry.characterId}"`,
        );
      } else {
        assertOptionalProject(
          entry.projectId,
          character.projectId,
          `archive "${entry.id}"`,
          `character "${character.id}"`,
          issues,
        );
      }
    }

    if (entry.episodeId) {
      const episode =
        context.episodesById.get(
          entry.episodeId,
        );

      if (!episode) {
        issues.push(
          `archive "${entry.id}" references unknown episode "${entry.episodeId}"`,
        );
      } else {
        assertOptionalProject(
          entry.projectId,
          episode.projectId,
          `archive "${entry.id}"`,
          `episode "${episode.id}"`,
          issues,
        );
      }
    }

    if (entry.storyId) {
      const story =
        context.storiesById.get(
          entry.storyId,
        );

      if (!story) {
        issues.push(
          `archive "${entry.id}" references unknown story "${entry.storyId}"`,
        );
      } else {
        assertOptionalProject(
          entry.projectId,
          story.projectId,
          `archive "${entry.id}"`,
          `story "${story.id}"`,
          issues,
        );
      }
    }

    for (const mediaId of
      entry.mediaIds ?? []) {
      if (
        !context.mediaById.has(
          mediaId,
        )
      ) {
        issues.push(
          `archive "${entry.id}" references unknown media "${mediaId}"`,
        );
      }
    }
  }
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function createMap<
  T extends {
    id: ContentId;
  },
>(
  items: readonly T[],
): ReadonlyMap<
  ContentId,
  T
> {
  return new Map(
    items.map(
      (item) => [
        item.id,
        item,
      ],
    ),
  );
}

function createIdSet<
  T extends {
    id: ContentId;
  },
>(
  items: readonly T[],
): ReadonlySet<ContentId> {
  return new Set(
    items.map(
      (item) => item.id,
    ),
  );
}

function getItemId(
  item: ContentWithProject,
): string {
  return (
    "id" in item &&
    typeof item.id === "string"
      ? item.id
      : "unknown"
  );
}

function validateLocalizedTitle(
  item: {
    readonly id: ContentId;
    readonly title: {
      readonly sr: string;
      readonly en: string;
    };
  },
  issues: string[],
): void {
  if (!item.title.sr.trim()) {
    issues.push(
      `content "${item.id}" has an empty SR title`,
    );
  }

  if (!item.title.en.trim()) {
    issues.push(
      `content "${item.id}" has an empty EN title`,
    );
  }
}

function validateContentProject(
  item: UmbraContent,
  projectId: ContentId,
  context: string,
  issues: string[],
): void {
  if (
    item.contentType ===
    "project"
  ) {
    if (
      item.id !== projectId
    ) {
      issues.push(
        `${context} crosses project boundary`,
      );
    }

    return;
  }

  if (
    item.contentType ===
      "character" ||
    item.contentType ===
      "episode" ||
    item.contentType ===
      "story"
  ) {
    assertSameProject(
      projectId,
      item.projectId,
      context,
      `${item.contentType} "${item.id}"`,
      issues,
    );

    return;
  }

  if (item.projectId) {
    assertSameProject(
      projectId,
      item.projectId,
      context,
      `${item.contentType} "${item.id}"`,
      issues,
    );
  }
}

function validateMediaProject(
  media: MediaContent,
  projectId: ContentId,
  context: string,
  issues: string[],
): void {
  if (
    media.projectId &&
    media.projectId !==
      projectId
  ) {
    issues.push(
      `${context} references media "${media.id}" from another project`,
    );
  }
}

function addMediaProject(
  projectId: ContentId | undefined,
  context: ValidationContext,
  projects: Set<ContentId>,
  mediaId: ContentId,
  issues: string[],
): void {
  if (!projectId) {
    return;
  }

  if (
    !context.projectIds.has(
      projectId,
    )
  ) {
    issues.push(
      `media "${mediaId}" references unknown project "${projectId}"`,
    );
    return;
  }

  projects.add(projectId);
}

function assertSameProject(
  firstProjectId: ContentId,
  secondProjectId: ContentId,
  firstContext: string,
  secondContext: string,
  issues: string[],
): void {
  if (
    firstProjectId !==
    secondProjectId
  ) {
    issues.push(
      `${firstContext} and ${secondContext} belong to different projects`,
    );
  }
}

function assertOptionalProject(
  explicitProjectId: ContentId | undefined,
  referencedProjectId: ContentId,
  ownerContext: string,
  referencedContext: string,
  issues: string[],
): void {
  if (
    explicitProjectId &&
    explicitProjectId !==
      referencedProjectId
  ) {
    issues.push(
      `${ownerContext} and ${referencedContext} belong to different projects`,
    );
  }
}