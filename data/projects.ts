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
      "Umbra Studio's first series, a screen adaptation of Branislav Bojčić's novel MRZIM SVOG BRATA",
    ),

    description: localized(
      "Ekranizacija romana Branislava Bojčića o Gvozdenu, njegovoj porodici i prijateljstvima u Bosni i Hercegovini. Priča počinje životom na selu i prati iskušenja kojima raspad zajedničkog sveta izlaže njegova uverenja.",
      "An adaptation of Branislav Bojčić's novel about Gvozden, his family and his friendships in Bosnia and Herzegovina. Beginning with rural family life, the story follows the challenges to his convictions as the world he knows begins to fracture.",
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
      "Biblijske priče u filmskom izrazu Umbra Studija",
      "Biblical stories explored through Umbra Studio's cinematic approach",
    ),

    description: localized(
      "BIBLIJA je zaseban projekat Umbra Studija zasnovan na biblijskim pričama. Među predstavljenim likovima je Josif, Jakovljev sin, čija priča počinje porodičnim odnosima i snovima.",
      "BIBLIJA is a separate Umbra Studio project based on biblical stories. Its featured characters include Joseph, Jacob's son, whose story begins with family relationships and dreams.",
    ),

    contentType: "project",

    type: "Projekat",
    status: "development",
    featured: false,

    platform: "Umbra Studio",

    cover: "/Biblija Cover.png",
  },
];
