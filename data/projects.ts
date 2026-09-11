export type ProjectStatus = "in-production" | "development" | "upcoming";

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
};

export const projects: Project[] = [
  {
    id: "project-01",
    slug: "mrzim-svog-brata",
    title: "MRZIM SVOG BRATA",
    type: "Serija",
    status: "in-production",
    shortDescription: "Prva serija studija Umbra, zasnovana na romanu Branislava Bojčića.",
    longDescription:
      "Umbra Studio razvija MRZIM SVOG BRATA kao epizodnu filmsku adaptaciju izvornog dela, s posebnim fokusom na likove, atmosferu i filmsko pripovedanje.",
    platform: "YouTube",
    featured: true,
  },
  {
    id: "project-02",
    slug: "biblija",
    title: "BIBLIJA",
    type: "Projekat",
    status: "development",
    shortDescription: "Drugi projekat studija Umbra, zasnovan na biblijskom svetu i njegovim pričama.",
    longDescription:
      "Umbra Studio razvija BIBLIJU kao zaseban storytelling univerzum zasnovan na biblijskim pričama.",
    platform: "Umbra Studio",
    featured: false,
  },
];
