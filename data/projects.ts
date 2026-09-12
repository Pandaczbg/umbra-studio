export type ProjectStatus =
  | "in-production"
  | "development"
  | "upcoming";

export type ProjectBook = {
  title: string;
  author: string;
  coverSr: string;
  coverEn: string;
  pdfSr: string;
  pdfEn: string;
  publicUrl?: string;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  type: "Serija" | "Film" | "Projekat";
  status: ProjectStatus;
  shortDescription: string;
  longDescription: string;
  platform: string;
  featured: boolean;

  /**
   * Project-level artwork for projects without a ProjectBook.
   *
   * All project-facing components should resolve artwork from this data
   * model instead of hard-coding asset paths in individual components.
   */
  cover?: string;

  book?: ProjectBook;
};

export const projects: Project[] = [
  {
    id: "project-01",
    slug: "mrzim-svog-brata",
    title: "MRZIM SVOG BRATA",
    type: "Serija",
    status: "in-production",

    shortDescription:
      "Prva serija Umbra Studija, filmska adaptacija romana „MRZIM SVOG BRATA“ Branislava Bojčića",

    longDescription:
      "Prva serija Umbra Studija je filmska adaptacija romana „MRZIM SVOG BRATA“ Branislava Bojčića, razvijena kao epizodna ekranizacija sa fokusom na likove, atmosferu i filmsko pripovedanje.",

    platform: "YouTube",
    featured: true,

    book: {
      title: "MRZIM SVOG BRATA",
      author: "Branislav Bojčić",

      // Fajlovi koji su trenutno u public/books/Mrzim-svog-brata/
      coverSr: "/books/Mrzim-svog-brata/cover-sr.jpg",
      coverEn: "/books/Mrzim-svog-brata/cover-en.jpg",

      pdfSr:
        "/books/Mrzim-svog-brata/mrzim-svog-brata-sr.pdf",
      pdfEn:
        "/books/Mrzim-svog-brata/mrzim-svog-brata-en.pdf",

      publicUrl:
        "https://drive.google.com/file/d/0ByismsjbT993SUQtbjVwOUZrc2s/view?userstoinvite=kotiljion@gmail.com&resourcekey=0-KVM6XhPzmZXtDIVKBYQOcQ",
    },
  },

  {
    id: "project-02",
    slug: "biblija",
    title: "BIBLIJA",
    type: "Projekat",
    status: "development",

    shortDescription:
      "Drugi projekat studija Umbra, zasnovan na biblijskom svetu i njegovim pričama.",

    longDescription:
      "Umbra Studio razvija BIBLIJU kao zaseban storytelling univerzum zasnovan na biblijskim pričama.",

    platform: "Umbra Studio",
    featured: false,

    // Stvarni projekat artwork: public/Biblija Cover.png
    cover: "/Biblija Cover.png",
  },
];
