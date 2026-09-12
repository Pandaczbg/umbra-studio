/**
 * UMBRA STUDIO — V6
 * Legacy → Canonical content adapters
 *
 * This file is the migration bridge between the locked V5 data registry
 * and the V6 canonical content model.
 *
 * Important:
 * - Existing V5 data remains the source of truth during migration.
 * - No V5 file is mutated here.
 * - No UI or route logic belongs here.
 * - English fields intentionally fall back to the SR source value until
 *   the V6 translation/content migration is completed. This is a bridge,
 *   not a claim that the Serbian copy is an English translation.
 */

import { characters as legacyCharacters } from "@/data/characters";
import { episodes as legacyEpisodes } from "@/data/episodes";
import { projects as legacyProjects } from "@/data/projects";

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

export function adaptProjects(): ProjectContent[] {
  return legacyProjects.map((project) => ({
    id: project.id,
    slug: project.slug,
    visibility: "public",
    title: localized(project.title),
    shortDescription: localized(project.shortDescription),
    description: localized(project.longDescription),
    contentType: "project",
    type: project.type,
    status: project.status,
    featured: project.featured,
    platform: project.platform,
    source: toProjectSource(project.book),
  }));
}

export function adaptCharacters(
  projects: readonly ProjectContent[] = adaptProjects(),
): CharacterContent[] {
  const projectIdBySlug = new Map(
    projects.map((project) => [
      project.slug,
      project.id,
    ]),
  );

  return legacyCharacters.map((character) => {
    const projectId =
      projectIdBySlug.get(character.projectSlug);

    if (!projectId) {
      throw new Error(
        `Umbra V6 adapter: character "${character.id}" references unknown project "${character.projectSlug}".`,
      );
    }

    return {
      id: character.id,
      slug: character.slug,
      visibility: "public",
      title: localized(character.name),
      shortDescription: localized(
        character.shortDescription,
      ),
      contentType: "character",
      projectId,
      category: character.category,
      gender: character.gender,
      heightCm: character.heightCm,
      profileAvailable: character.profileAvailable,
      order: character.order,
    };
  });
}

export function adaptEpisodes(
  projects: readonly ProjectContent[] = adaptProjects(),
): EpisodeContent[] {
  const projectIdBySlug = new Map(
    projects.map((project) => [
      project.slug,
      project.id,
    ]),
  );

  return legacyEpisodes.map((episode) => {
    const projectId =
      projectIdBySlug.get(episode.projectSlug);

    if (!projectId) {
      throw new Error(
        `Umbra V6 adapter: episode "${episode.id}" references unknown project "${episode.projectSlug}".`,
      );
    }

    return {
      id: episode.id,
      slug: `${episode.projectSlug}-ep-${episode.episodeNumber}`,
      visibility: "public",
      title: localized(episode.title),
      description: localized(
        episode.description,
      ),
      contentType: "episode",
      projectId,
      episodeNumber: episode.episodeNumber,
      status: episode.status,
      runtime: episode.runtime,
      chapterStart: episode.chapterStart,
      chapterEnd: episode.chapterEnd,
      logline: episode.logline
        ? localized(episode.logline)
        : undefined,
      featured: episode.featured,
      youtubeUrl: episode.youtubeUrl,
      thumbnail: episode.thumbnail,
    };
  });
}
