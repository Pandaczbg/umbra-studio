import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CharacterDossier from "@/components/CharacterDossier";
import {
  getCharacterBySlug,
  getCharactersForProject,
} from "@/lib/characterNavigation";
import { characters } from "@/data/characters";
import { projects } from "@/data/projects";

export function generateStaticParams() {
  return characters.map((character) => ({
    slug: character.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const character = getCharacterBySlug(slug);

  if (!character) {
    return {};
  }

  const project = projects.find(
    (item) => item.slug === character.projectSlug,
  );

  const description =
    character.shortDescription.trim() ||
    `Dosije lika ${character.name} u okviru projekta ${
      project?.title ??
      character.projectTitle ??
      "Umbra Studio"
    }.`;

  return {
    title: `${character.name} — Dosije lika`,
    description,
    openGraph: {
      title: `${character.name} — Dosije lika`,
      description,
      type: "website",
    },
  };
}

export default async function CharacterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const character = getCharacterBySlug(slug);

  if (!character) {
    notFound();
  }

  const relatedCharacters =
    getCharactersForProject(
      character.projectSlug,
    ).filter(
      (item) => item.slug !== character.slug,
    );

  return (
    <CharacterDossier
      character={character}
      relatedCharacters={relatedCharacters}
    />
  );
}