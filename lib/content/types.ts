/**
 * UMBRA STUDIO — V7 POLISH
 * Canonical content schema
 *
 * Shared content language for the entire Umbra digital universe.
 * Types only. No data, routing or UI logic belongs here.
 *
 * Design goals
 * --------------------------------------------------------------------------
 * - Keep one stable canonical contract for registry, validation, queries and UI.
 * - Support editorial publication state without inventing publication dates.
 * - Keep relationship indexes explicit so the registry can build reverse lookups.
 * - Preserve the existing V6 data contract used by project/detail views.
 * - Avoid introducing runtime validation into the type layer.
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
  type: ContentType;
  id: ContentId;
};

export type LocalizedText = {
  sr: string;
  en: string;
};

export type ContentBase = {
  id: ContentId;
  slug: string;
  visibility: ContentVisibility;
  title: LocalizedText;
  shortDescription?: LocalizedText;
  description?: LocalizedText;

  /**
   * Canonical publication timestamp used by editorial latest feeds.
   *
   * The value is intentionally typed as string because this layer does not
   * validate or parse dates. Content validation belongs in runtime/data
   * validation, not in the schema-only contract.
   */
  publishedAt?: string;

  order?: number;
};

export type ProjectSource = {
  title: string;
  author?: string;
  coverSr?: string;
  coverEn?: string;
  pdfSr?: string;
  pdfEn?: string;
  publicUrl?: string;
};

export type ProjectContent = ContentBase & {
  contentType: "project";
  type: ProjectType;
  status: ProjectStatus;
  featured: boolean;

  /** Primary project artwork used by current V6 project surfaces. */
  cover?: string;

  platform?: string;
  source?: ProjectSource;
};

export type CharacterContent = ContentBase & {
  contentType: "character";
  projectId: ContentId;
  category: CharacterCategory;
  gender: CharacterGender;
  heightCm: number | null;
  profileAvailable: boolean;

  /** Reverse indexes used by canonical relationship queries/validation. */
  episodeIds?: ContentId[];
  storyIds?: ContentId[];
  mediaIds?: ContentId[];
};

export type EpisodeContent = ContentBase & {
  contentType: "episode";
  projectId: ContentId;
  storyId?: ContentId;
  episodeNumber: number;
  status: EpisodeStatus;
  runtime?: string;
  runtimeSeconds?: number;
  releaseDate?: string;
  chapterStart?: number;
  chapterEnd?: number;
  logline?: LocalizedText;
  featured: boolean;

  /** Reverse indexes used by canonical relationship queries/validation. */
  characterIds?: ContentId[];
  mediaIds?: ContentId[];

  youtubeUrl?: string;
  thumbnail?: string;
};

export type StoryContent = ContentBase & {
  contentType: "story";
  projectId: ContentId;
  status: StoryStatus;

  /** Explicit links keep the canonical graph queryable in both directions. */
  characterIds?: ContentId[];
  episodeIds?: ContentId[];
  mediaIds?: ContentId[];
};

export type MediaContent = ContentBase & {
  contentType: "media";
  mediaType: MediaType;
  src: string;
  poster?: string;
  alt?: LocalizedText;
  caption?: LocalizedText;
  projectId?: ContentId;
  characterId?: ContentId;
  episodeId?: ContentId;
  storyId?: ContentId;
};

export type RelationshipContent = {
  id: ContentId;
  contentType: "relationship";
  visibility: ContentVisibility;
  projectId: ContentId;
  sourceId: ContentId;
  targetId: ContentId;
  type: RelationshipType;
  description?: LocalizedText;
};

export type TimelineEventContent = {
  id: ContentId;
  contentType: "timeline-event";
  visibility: ContentVisibility;
  projectId: ContentId;
  slug: string;
  title: LocalizedText;
  description?: LocalizedText;
  date?: string;
  period?: string;
  precision: TimelinePrecision;
  characterIds?: ContentId[];
  storyIds?: ContentId[];
  episodeIds?: ContentId[];
};

export type ArchiveEntryContent = {
  id: ContentId;
  contentType: "archive-entry";
  visibility: ContentVisibility;
  type: ArchiveEntryType;
  title: LocalizedText;
  description?: LocalizedText;
  date?: string;
  projectId?: ContentId;
  characterId?: ContentId;
  episodeId?: ContentId;
  storyId?: ContentId;
  mediaIds?: ContentId[];
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
