import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CharacterDossier from "@/components/CharacterDossier";
import {
  getCharacterBySlug,
  getCharacterMedia,
  getCharacterProject,
  getProjectCharacters,
  getProjects,
} from "@/lib/content/queries";

type CharacterPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getProjects()
    .flatMap((project) => getProjectCharacters(project.id))
    .filter((character) => character.profileAvailable)
    .map((character) => ({
      slug: character.slug,
    }));
}

export async function generateMetadata({
  params,
}: CharacterPageProps): Promise<Metadata> {
  const { slug } = await params;

  const character = getCharacterBySlug(slug);

  if (!character || !character.profileAvailable) {
    return {
      title: "Lik nije pronađen | Umbra Studio",
    };
  }

  const project = getCharacterProject(character.id);

  const characterName = character.title.sr;

  const characterDescription =
    character.shortDescription?.sr ??
    character.description?.sr ??
    `Dosje lika ${characterName} u okviru projekta ${
      project?.title.sr ?? "Umbra Studio"
    }.`;

  const characterMedia = getCharacterMedia(character.id);

  const portrait =
    characterMedia[0]?.src ??
    project?.source?.coverSr ??
    project?.source?.coverEn;

  return {
    title: `${characterName} | Umbra Studio`,
    description: characterDescription,
    alternates: {
      canonical: `/likovi/${character.slug}`,
    },
    openGraph: {
      title: `${characterName} | Umbra Studio`,
      description: characterDescription,
      type: "website",
      ...(portrait
        ? {
            images: [
              {
                url: portrait,
                alt: `${characterName} — Dosje lika`,
              },
            ],
          }
        : {}),
    },
  };
}

export default async function CharacterPage({
  params,
}: CharacterPageProps) {
  const { slug } = await params;

  const character = getCharacterBySlug(slug);

  if (!character || !character.profileAvailable) {
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

  const characterImage = characterMedia[0]?.src ?? null;

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