import {
  characters,
  type Character,
} from "@/data/characters";

export type CharacterLocale = "sr" | "en";

export type CharacterNavigation = {
  current: Character;
  previous: Character | null;
  next: Character | null;
  position: number;
  total: number;
  projectCharacters: Character[];
};

export function getCharactersForProject(
  projectSlug: string,
): Character[] {
  return characters
    .filter(
      (character) =>
        character.projectSlug === projectSlug,
    )
    .sort(
      (a, b) => a.order - b.order,
    );
}

export function getCharacterBySlug(
  slug: string,
): Character | undefined {
  return characters.find(
    (character) => character.slug === slug,
  );
}

export function getCharacterNavigation(
  character: Character,
): CharacterNavigation {
  const projectCharacters =
    getCharactersForProject(
      character.projectSlug,
    );

  const currentIndex =
    projectCharacters.findIndex(
      (item) => item.slug === character.slug,
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
    total:
      projectCharacters.length,
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
