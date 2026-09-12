
import type { Metadata } from "next";

import CharactersArchive from "@/components/CharactersArchive";

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
  return <CharactersArchive locale="en" />;
}
