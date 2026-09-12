/**
 * UMBRA STUDIO — V6
 * Legacy → Canonical content adapters
 *
 * Migration bridge between the locked V5 data registry
 * and the V6 canonical content model.
 *
 * Rules:
 * - V5 remains the source of truth during migration.
 * - No V5 source file is mutated.
 * - No routing logic.
 * - No UI logic.
 * - No invented content.
 * - English values fall back to SR until real EN content exists.
 */

import {
  characters as legacyCharacters,
} from "@/data/characters";
import {
  episodes as legacyEpisodes,
} from "@/data/episodes";
import {
  projects as legacyProjects,
} from "@/data/projects";

import type {
  CharacterContent,
  EpisodeContent,
  LocalizedText,
  ProjectContent,
  ProjectSource,
} from "@/lib/content/types";

function localized(
  sr: string,
  en?: string,
): LocalizedText {
  return {
    sr,
    en: en ?? sr,
  };
}

function toProjectSource(
  book:
    | (typeof legacyProjects)[number]["book"]
    | undefined,
): ProjectSource | undefined {
  if (!book) {
    return undefined;
  }

  return {
    title: book.title,
    author: book.author,
    coverSr: book.coverSr,
    coverEn: book.coverEn,
    pdfSr: book.pdfSr,
    pdfEn: book.pdfEn,
    publicUrl: book.publicUrl,
  };
}

function createProjectIdBySlug(
  projects: readonly ProjectContent[],
) {
  const projectIdBySlug =
    new Map<string, string>();

  for (const project of projects) {
    if (projectIdBySlug.has(project.slug)) {
      throw new Error(
        `Umbra V6 adapter: duplicate project slug "${project.slug}".`,
      );
    }

    projectIdBySlug.set(
      project.slug,
      project.id,
    );
  }

  return projectIdBySlug;
}

function assertProjectId(
  projectIdBySlug: ReadonlyMap<
    string,
    string
  >,
  entityType: string,
  entityId: string,
  projectSlug: string,
): string {
  const projectId =
    projectIdBySlug.get(projectSlug);

  if (!projectId) {
    throw new Error(
      `Umbra V6 adapter: ${entityType} "${entityId}" references unknown project "${projectSlug}".`,
    );
  }

  return projectId;
}

export function adaptProjects(): ProjectContent[] {
  return legacyProjects.map(
    (project) => ({
      id: project.id,
      slug: project.slug,
      visibility: "public",

      title: localized(
        project.title,
      ),

      shortDescription:
        localized(
          project.shortDescription,
        ),

      description:
        localized(
          project.longDescription,
        ),

      contentType: "project",

      type: project.type,
      status: project.status,
      featured: project.featured,

      platform:
        project.platform,

      source:
        toProjectSource(
          project.book,
        ),
    }),
  );
}

export function adaptCharacters(
  projects: readonly ProjectContent[],
): CharacterContent[] {
  const projectIdBySlug =
    createProjectIdBySlug(
      projects,
    );

  return legacyCharacters.map(
    (character) => {
      const projectId =
        assertProjectId(
          projectIdBySlug,
          "character",
          character.id,
          character.projectSlug,
        );

      return {
        id: character.id,
        slug: character.slug,
        visibility: "public",

        title: localized(
          character.name,
        ),

        shortDescription:
          localized(
            character.shortDescription,
          ),

        contentType: "character",

        projectId,

        category:
          character.category,

        gender:
          character.gender,

        heightCm:
          character.heightCm,

        profileAvailable:
          character.profileAvailable,

        order:
          character.order,
      };
    },
  );
}

export function adaptEpisodes(
  projects: readonly ProjectContent[],
): EpisodeContent[] {
  const projectIdBySlug =
    createProjectIdBySlug(
      projects,
    );

  return legacyEpisodes.map(
    (episode) => {
      const projectId =
        assertProjectId(
          projectIdBySlug,
          "episode",
          episode.id,
          episode.projectSlug,
        );

      return {
        id: episode.id,

        slug: `${episode.projectSlug}-ep-${episode.episodeNumber}`,

        visibility: "public",

        title: localized(
          episode.title,
        ),

        description:
          localized(
            episode.description,
          ),

        contentType: "episode",

        projectId,

        episodeNumber:
          episode.episodeNumber,

        status:
          episode.status,

        runtime:
          episode.runtime,

        chapterStart:
          episode.chapterStart,

        chapterEnd:
          episode.chapterEnd,

        logline:
          episode.logline
            ? localized(
                episode.logline,
              )
            : undefined,

        featured:
          episode.featured,

        youtubeUrl:
          episode.youtubeUrl,

        thumbnail:
          episode.thumbnail,
      };
    },
  );
}