import {
  getCharacterBySlug as getCanonicalCharacterBySlug,
  getProjectById,
  getProjectBySlug,
  getProjectCharacters,
} from "@/lib/content/queries";

import type {
  CharacterContent,
} from "@/lib/content/types";

export type CharacterLocale =
  | "sr"
  | "en";

export type Character =
  CharacterContent;

export type CharacterNavigation = {
  current: Character;
  previous: Character | null;
  next: Character | null;
  position: number;
  total: number;
  projectCharacters: Character[];
};

function getProjectCharactersBySlug(
  projectSlug: string,
): Character[] {
  const project =
    getProjectBySlug(
      projectSlug,
    );

  if (!project) {
    return [];
  }

  return [
    ...getProjectCharacters(
      project.id,
    ),
  ];
}

export function getCharactersForProject(
  projectSlug: string,
): Character[] {
  return getProjectCharactersBySlug(
    projectSlug,
  );
}

export function getCharacterBySlug(
  slug: string,
): Character | undefined {
  return getCanonicalCharacterBySlug(
    slug,
  );
}

export function getCharacterNavigation(
  character: Character,
): CharacterNavigation {
  const project =
    getProjectById(
      character.projectId,
    );

  const projectCharacters =
    project
      ? [
          ...getProjectCharacters(
            project.id,
          ),
        ]
      : [];

  const currentIndex =
    projectCharacters.findIndex(
      (item) => item.id === character.id,
    );

  const position =
    currentIndex >= 0
      ? currentIndex + 1
      : 0;

  return {
    current: character,

    previous:
      currentIndex > 0
        ? projectCharacters[
            currentIndex - 1
          ]
        : null,

    next:
      currentIndex >= 0 &&
      currentIndex <
        projectCharacters.length - 1
        ? projectCharacters[
            currentIndex + 1
          ]
        : null,

    position,
    total: projectCharacters.length,
    projectCharacters,
  };
}

export function getCharacterHref(
  character: Character,
  locale: CharacterLocale,
): string {
  return locale === "en"
    ? `/en/characters/${character.slug}`
    : `/likovi/${character.slug}`;
}