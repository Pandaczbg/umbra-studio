
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CharacterDossier from "@/components/CharacterDossier";
import {
  getCharacterBySlug,
  getCharactersForProject,
} from "@/lib/characterNavigation";
import { characters } from "@/data/characters";
import { projects } from "@/data/projects";

type CharacterPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return characters.map((character) => ({
    slug: character.slug,
  }));
}

export async function generateMetadata({
  params,
}: CharacterPageProps): Promise<Metadata> {
  const { slug } = await params;

  const character = getCharacterBySlug(slug);

  if (!character) {
    return {};
  }

  const project = projects.find(
    (item) => item.slug === character.projectSlug,
  );

  const projectTitle =
    project?.title ??
    character.projectTitle ??
    "Umbra Studio";

  const description =
    character.shortDescription.trim() ||
    `Character dossier for ${character.name} within ${projectTitle}.`;

  const title = `${character.name} — Character Dossier`;

  const portrait =
    character.image ||
    project?.book?.coverEn ||
    project?.book?.coverSr ||
    project?.cover;

  return {
    title,
    description,
    alternates: {
      canonical: `/en/characters/${character.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      ...(portrait
        ? {
            images: [
              {
                url: portrait,
                alt: `${character.name} — Character Dossier`,
              },
            ],
          }
        : {}),
    },
  };
}

export default async function EnglishCharacterPage({
  params,
}: CharacterPageProps) {
  const { slug } = await params;

  const character = getCharacterBySlug(slug);

  if (!character) {
    notFound();
  }

  const relatedCharacters = getCharactersForProject(
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
