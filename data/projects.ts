import type {
  LocalizedText,
  ProjectContent,
} from "@/lib/content/types";

function localized(
  sr: string,
  en: string = sr,
): LocalizedText {
  return {
    sr,
    en,
  };
}

export const projects: ProjectContent[] = [
  {
    id: "project-01",
    slug: "mrzim-svog-brata",
    visibility: "public",

    title: localized(
      "MRZIM SVOG BRATA",
    ),

    shortDescription: localized(
      "Prva serija Umbra Studija, filmska adaptacija romana „MRZIM SVOG BRATA“ Branislava Bojčića",
    ),

    description: localized(
      "Prva serija Umbra Studija je filmska adaptacija romana „MRZIM SVOG BRATA“ Branislava Bojčića, razvijena kao epizodna ekranizacija sa fokusom na likove, atmosferu i filmsko pripovedanje.",
    ),

    contentType: "project",

    type: "Serija",
    status: "in-production",
    featured: true,

    platform: "YouTube",

    source: {
      title: "MRZIM SVOG BRATA",
      author: "Branislav Bojčić",
      coverSr:
        "/books/Mrzim-svog-brata/cover-sr.png",
      coverEn:
        "/books/Mrzim-svog-brata/cover-en.jpg",
      pdfSr:
        "/books/Mrzim-svog-brata/mrzim-svog-brata-sr.pdf",
      pdfEn:
        "/books/Mrzim-svog-brata/mrzim-svog-brata-en.pdf",
      publicUrl:
        "https://drive.google.com/file/d/0ByismsjbT993SUQtbjVwOUZrc2s/view?resourcekey=0-KVM6XhPzmZXtDIVKBYQOcQ",
    },
  },

  {
    id: "project-02",
    slug: "biblija",
    visibility: "public",

    title: localized(
      "BIBLIJA",
    ),

    shortDescription: localized(
      "Samostalan storytelling univerzum Umbra Studija, zasnovan na biblijskim pričama.",
    ),

    description: localized(
      "Umbra Studio razvija BIBLIJU kao zaseban storytelling univerzum zasnovan na biblijskim pričama.",
    ),

    contentType: "project",

    type: "Projekat",
    status: "development",
    featured: false,

    platform: "Umbra Studio",

    cover: "/Biblija Cover.png",
  },
];