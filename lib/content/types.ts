/**
 * UMBRA STUDIO — V6
 * Canonical content schema
 *
 * Shared content language for the entire Umbra digital universe.
 *
 * Rules:
 * - Types only
 * - No data
 * - No routing
 * - No UI logic
 * - Canonical relationships are represented explicitly
 * - Content collections are treated as readonly
 */

export type ContentId = string;

export type ContentVisibility =
  | "public"
  | "private"
  | "internal";

export type ContentType =
  | "project"
  | "character"
  | "episode"
  | "story"
  | "media"
  | "relationship"
  | "timeline-event"
  | "archive-entry";

export type ProjectType =
  | "Serija"
  | "Film"
  | "Projekat";

export type ProjectStatus =
  | "in-production"
  | "development"
  | "upcoming";

export type CharacterGender =
  | "MALE"
  | "FEMALE"
  | null;

export type CharacterCategory =
  | "MAIN"
  | "SUPPORTING";

export type EpisodeStatus =
  | "planned"
  | "in-production"
  | "completed"
  | "published"
  | "archived";

export type StoryStatus =
  | "planned"
  | "in-development"
  | "active"
  | "completed"
  | "archived";

export type MediaType =
  | "image"
  | "poster"
  | "cover"
  | "concept-art"
  | "still"
  | "video"
  | "trailer"
  | "teaser"
  | "short"
  | "audio"
  | "document";

export type RelationshipType =
  | "family"
  | "partner"
  | "friend"
  | "ally"
  | "conflict"
  | "authority"
  | "rival"
  | "associated";

export type TimelinePrecision =
  | "exact"
  | "year"
  | "period"
  | "unknown";

export type ArchiveEntryType =
  | "project"
  | "character"
  | "episode"
  | "story"
  | "media"
  | "concept"
  | "research"
  | "document";

export type ContentReference = {
  readonly type: ContentType;
  readonly id: ContentId;
};

export type LocalizedText = {
  readonly sr: string;
  readonly en: string;
};

export type ContentBase = {
  readonly id: ContentId;
  readonly slug: string;
  readonly visibility: ContentVisibility;
  readonly title: LocalizedText;
  readonly shortDescription?: LocalizedText;
  readonly description?: LocalizedText;
  readonly order?: number;
};

export type ProjectSource = {
  readonly title: string;
  readonly author?: string;
  readonly coverSr?: string;
  readonly coverEn?: string;
  readonly pdfSr?: string;
  readonly pdfEn?: string;
  readonly publicUrl?: string;
};

export type ProjectContent =
  ContentBase & {
    readonly contentType: "project";

    readonly type: ProjectType;
    readonly status: ProjectStatus;
    readonly featured: boolean;
    readonly platform?: string;

    readonly source?: ProjectSource;
  };

export type CharacterContent =
  ContentBase & {
    readonly contentType: "character";

    readonly projectId: ContentId;

    readonly category: CharacterCategory;
    readonly gender: CharacterGender;
    readonly heightCm: number | null;

    readonly profileAvailable: boolean;

    /**
     * Reverse/explicit content links.
     * These are optional until the relevant content exists.
     */
    readonly episodeIds?: readonly ContentId[];
    readonly storyIds?: readonly ContentId[];
    readonly mediaIds?: readonly ContentId[];
  };

export type EpisodeContent =
  ContentBase & {
    readonly contentType: "episode";

    readonly projectId: ContentId;
    readonly storyId?: ContentId;

    readonly episodeNumber: number;
    readonly status: EpisodeStatus;

    readonly runtime?: string;
    readonly runtimeSeconds?: number;
    readonly releaseDate?: string;

    readonly chapterStart?: number;
    readonly chapterEnd?: number;

    readonly logline?: LocalizedText;

    readonly featured: boolean;

    readonly youtubeUrl?: string;
    readonly thumbnail?: string;

    /**
     * Explicit content relationships.
     */
    readonly characterIds?: readonly ContentId[];
    readonly mediaIds?: readonly ContentId[];
  };

export type StoryContent =
  ContentBase & {
    readonly contentType: "story";

    readonly projectId: ContentId;
    readonly status: StoryStatus;

    /**
     * Explicit content relationships.
     */
    readonly characterIds?: readonly ContentId[];
    readonly episodeIds?: readonly ContentId[];
    readonly mediaIds?: readonly ContentId[];
  };

export type MediaContent =
  ContentBase & {
    readonly contentType: "media";

    readonly mediaType: MediaType;
    readonly src: string;

    readonly poster?: string;

    readonly alt?: LocalizedText;
    readonly caption?: LocalizedText;

    /**
     * A media item may belong to one or more
     * content contexts.
     */
    readonly projectId?: ContentId;
    readonly characterId?: ContentId;
    readonly episodeId?: ContentId;
    readonly storyId?: ContentId;
  };

export type RelationshipContent = {
  readonly id: ContentId;
  readonly contentType: "relationship";
  readonly visibility: ContentVisibility;

  readonly projectId: ContentId;

  readonly sourceId: ContentId;
  readonly targetId: ContentId;

  readonly type: RelationshipType;

  readonly description?: LocalizedText;
};

export type TimelineEventContent = {
  readonly id: ContentId;
  readonly contentType: "timeline-event";
  readonly visibility: ContentVisibility;

  readonly projectId: ContentId;
  readonly slug: string;

  readonly title: LocalizedText;
  readonly description?: LocalizedText;

  readonly date?: string;
  readonly period?: string;

  readonly precision: TimelinePrecision;

  readonly characterIds?: readonly ContentId[];
  readonly storyIds?: readonly ContentId[];
  readonly episodeIds?: readonly ContentId[];
};

export type ArchiveEntryContent = {
  readonly id: ContentId;
  readonly contentType: "archive-entry";
  readonly visibility: ContentVisibility;

  readonly type: ArchiveEntryType;

  readonly title: LocalizedText;
  readonly description?: LocalizedText;

  readonly date?: string;

  readonly projectId?: ContentId;
  readonly characterId?: ContentId;
  readonly episodeId?: ContentId;
  readonly storyId?: ContentId;

  readonly mediaIds?: readonly ContentId[];
};

export type UmbraContent =
  | ProjectContent
  | CharacterContent
  | EpisodeContent
  | StoryContent
  | MediaContent
  | RelationshipContent
  | TimelineEventContent
  | ArchiveEntryContent;