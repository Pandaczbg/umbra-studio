import type { Metadata } from "next";

import CharactersArchive from "@/components/CharactersArchive";

import {
  getCharacterMedia,
  getCharacters,
  getProjects,
} from "@/lib/content/queries";

export const metadata: Metadata = {
  title: "Likovi — Umbra Studio",
  description:
    "Arhiva likova Umbra Studija. Istraži postavu, pronađi lik i otvori njegov dosije.",
  alternates: {
    canonical: "/likovi",
  },
  openGraph: {
    title: "Likovi — Umbra Studio",
    description:
      "Arhiva likova Umbra Studija. Istraži postavu, pronađi lik i otvori njegov dosije.",
    type: "website",
  },
};

export default function CharactersPage() {
  const characters =
    getCharacters();

  const projects =
    getProjects();

  const characterImages =
    Object.fromEntries(
      characters.map((character) => {
        const media =
          getCharacterMedia(character.id);

        return [
          character.id,
          media[0]?.src ?? null,
        ];
      }),
    );

  return (
    <CharactersArchive
      locale="sr"
      characters={characters}
      projects={projects}
      characterImages={characterImages}
    />
  );
}