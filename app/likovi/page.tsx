
import type { Metadata } from "next";

import CharactersArchive from "@/components/CharactersArchive";

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
  return <CharactersArchive locale="sr" />;
}
