import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CharacterDossier from "@/components/CharacterDossier";
import {
  getCharacterBySlug,
  getCharacterMedia,
  getCharacterProject,
  getCharacters,
  getProjectCharacters,
} from "@/lib/content/queries";

type CharacterPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getCharacters().map((character) => ({
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

  const project = getCharacterProject(character.id);

  if (!project) {
    return {};
  }

  const characterName = character.title.en;

  const characterDescription =
    character.shortDescription?.en ??
    character.description?.en ??
    `Character dossier for ${characterName}`;

  const title = `${characterName} — Character Dossier`;

  const characterMedia = getCharacterMedia(character.id);

  const portrait =
    characterMedia[0]?.src ??
    project.source?.coverEn ??
    project.source?.coverSr;

  return {
    title,
    description: characterDescription,
    alternates: {
      canonical: `/en/characters/${character.slug}`,
    },
    openGraph: {
      title,
      description: characterDescription,
      type: "website",
      ...(portrait
        ? {
            images: [
              {
                url: portrait,
                alt: `${characterName} — Character Dossier`,
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

  const project = getCharacterProject(character.id);

  if (!project) {
    notFound();
  }

  const characters = getProjectCharacters(project.id);

  const relatedCharacters = characters.filter(
    (item) => item.id !== character.id,
  );

  const characterMedia = getCharacterMedia(character.id);

  const characterImage =
    characterMedia[0]?.src ?? null;

  const relatedCharacterImages = Object.fromEntries(
    relatedCharacters.map((related) => {
      const media = getCharacterMedia(related.id);

      return [
        related.id,
        media[0]?.src ?? null,
      ];
    }),
  );

  return (
    <CharacterDossier
      character={character}
      relatedCharacters={relatedCharacters}
      characters={characters}
      project={project}
      characterImage={characterImage}
      relatedCharacterImages={relatedCharacterImages}
    />
  );
}