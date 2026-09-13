import type { Metadata } from "next";

import CharactersArchive from "@/components/CharactersArchive";

import {
  getCharacterMedia,
  getCharacters,
  getProjects,
} from "@/lib/content/queries";

export const metadata: Metadata = {
  title: "Characters — Umbra Studio",
  description:
    "The Umbra Studio character archive. Explore the cast, find a character and open their dossier.",
  alternates: {
    canonical: "/en/characters",
  },
  openGraph: {
    title: "Characters — Umbra Studio",
    description:
      "The Umbra Studio character archive. Explore the cast, find a character and open their dossier.",
    type: "website",
  },
};

export default function EnglishCharactersPage() {
  const characters =
    getCharacters();

  const projects =
    getProjects();

  const characterImages =
    Object.fromEntries(
      characters.map((character) => {
        const media =
          getCharacterMedia(
            character.id,
          );

        return [
          character.id,
          media[0]?.src ?? null,
        ];
      }),
    );

  return (
    <CharactersArchive
      locale="en"
      characters={characters}
      projects={projects}
      characterImages={characterImages}
    />
  );
}