// Existing adaptation outline, not an announced release schedule.
// Preserve identifiers and chapter ranges; editorial confirmation is pending.
import type {
  EpisodeContent,
  LocalizedText,
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

export const episodes: EpisodeContent[] = [
  {
    id: "mrzim-ep-01",
    slug: "mrzim-svog-brata-ep-01",
    visibility: "public",

    title: localized(
      "KUĆA",
      "HOME",
    ),

    description: localized(
      "Gvozden, Jadranka i Ana u središtu su uvoda u porodični svet romana.",
      "Gvozden, Jadranka and Ana are at the heart of this introduction to the family world of the novel.",
    ),

    contentType: "episode",

    projectId: "project-01",

    episodeNumber: 1,
    status: "planned",

    chapterStart: 1,
    chapterEnd: 1,

    featured: true,
  },

  {
    id: "mrzim-ep-02",
    slug: "mrzim-svog-brata-ep-02",
    visibility: "public",

    title: localized(
      "PISMO",
      "THE LETTER",
    ),

    description: localized(
      "Vojni poziv unosi neizvesnost u Gvozdenovu svakodnevicu.",
      "A military call-up brings uncertainty into Gvozden's daily life.",
    ),

    contentType: "episode",

    projectId: "project-01",

    episodeNumber: 2,
    status: "planned",

    chapterStart: 2,
    chapterEnd: 3,

    featured: false,
  },

  {
    id: "mrzim-ep-03",
    slug: "mrzim-svog-brata-ep-03",
    visibility: "public",

    title: localized(
      "RAT",
      "WAR",
    ),

    description: localized(
      "Susret sa Radetom otvara nova pitanja o dužnosti, poverenju i ratu.",
      "Meeting Rade raises new questions about duty, trust and war.",
    ),

    contentType: "episode",

    projectId: "project-01",

    episodeNumber: 3,
    status: "planned",

    chapterStart: 3,
    chapterEnd: 4,

    featured: false,
  },

  {
    id: "mrzim-ep-04",
    slug: "mrzim-svog-brata-ep-04",
    visibility: "public",

    title: localized(
      "PUKOTINA",
      "THE FRACTURE",
    ),

    description: localized(
      "Gvozdenova uverenja suočavaju se sa okolnostima koje ne može lako da razume.",
      "Gvozden's convictions meet circumstances he struggles to understand.",
    ),

    contentType: "episode",

    projectId: "project-01",

    episodeNumber: 4,
    status: "planned",

    chapterStart: 4,
    chapterEnd: 5,

    featured: false,
  },

  {
    id: "mrzim-ep-05",
    slug: "mrzim-svog-brata-ep-05",
    visibility: "public",

    title: localized(
      "POVRATAK",
      "THE RETURN",
    ),

    description: localized(
      "Dom ostaje središte Gvozdenovih briga dok neizvesnost raste.",
      "Home remains at the center of Gvozden's concerns as uncertainty grows.",
    ),

    contentType: "episode",

    projectId: "project-01",

    episodeNumber: 5,
    status: "planned",

    chapterStart: 6,
    chapterEnd: 6,

    featured: true,
  },

  {
    id: "mrzim-ep-06",
    slug: "mrzim-svog-brata-ep-06",
    visibility: "public",

    title: localized(
      "PEPEO",
      "ASHES",
    ),

    description: localized(
      "Priča ispituje koliko čoveka mogu promeniti događaji nad kojima nema kontrolu.",
      "The story explores how deeply a person can be changed by events beyond their control.",
    ),

    contentType: "episode",

    projectId: "project-01",

    episodeNumber: 6,
    status: "planned",

    chapterStart: 7,
    chapterEnd: 8,

    featured: true,
  },

  {
    id: "mrzim-ep-07",
    slug: "mrzim-svog-brata-ep-07",
    visibility: "public",

    title: localized(
      "LOV",
      "THE HUNT",
    ),

    description: localized(
      "Gvozdenovi izbori otvaraju pitanja motiva i odgovornosti.",
      "Gvozden's choices raise questions about motives and responsibility.",
    ),

    contentType: "episode",

    projectId: "project-01",

    episodeNumber: 7,
    status: "planned",

    chapterStart: 9,
    chapterEnd: 9,

    featured: false,
  },

  {
    id: "mrzim-ep-08",
    slug: "mrzim-svog-brata-ep-08",
    visibility: "public",

    title: localized(
      "POTRAGA",
      "THE SEARCH",
    ),

    description: localized(
      "U središtu ovog dela radnog nacrta je istrajnost koja dolazi na iskušenje.",
      "This part of the provisional outline centers on persistence put to the test.",
    ),

    contentType: "episode",

    projectId: "project-01",

    episodeNumber: 8,
    status: "planned",

    chapterStart: 10,
    chapterEnd: 10,

    featured: false,
  },

  {
    id: "mrzim-ep-09",
    slug: "mrzim-svog-brata-ep-09",
    visibility: "public",

    title: localized(
      "SARAJEVO",
      "SARAJEVO",
    ),

    description: localized(
      "Sarajevo postaje važan prostor priče, sa novim neizvesnostima za Gvozdena.",
      "Sarajevo becomes an important setting, bringing new uncertainties for Gvozden.",
    ),

    contentType: "episode",

    projectId: "project-01",

    episodeNumber: 9,
    status: "planned",

    chapterStart: 11,
    chapterEnd: 11,

    featured: true,
  },

  {
    id: "mrzim-ep-10",
    slug: "mrzim-svog-brata-ep-10",
    visibility: "public",

    title: localized(
      "BEKSTVO",
      "ESCAPE",
    ),

    description: localized(
      "Promena mesta ne donosi jednostavne odgovore na pitanja iz prošlosti.",
      "A change of place offers no easy answers to questions from the past.",
    ),

    contentType: "episode",

    projectId: "project-01",

    episodeNumber: 10,
    status: "planned",

    chapterStart: 12,
    chapterEnd: 14,

    featured: false,
  },

  {
    id: "mrzim-ep-11",
    slug: "mrzim-svog-brata-ep-11",
    visibility: "public",

    title: localized(
      "HAG",
      "THE HAGUE",
    ),

    description: localized(
      "Radni nacrt otvara temu odgovornosti i različitih pogleda na iste događaje.",
      "The provisional outline turns to responsibility and different views of the same events.",
    ),

    contentType: "episode",

    projectId: "project-01",

    episodeNumber: 11,
    status: "planned",

    chapterStart: 15,
    chapterEnd: 15,

    featured: false,
  },

  {
    id: "mrzim-ep-12",
    slug: "mrzim-svog-brata-ep-12",
    visibility: "public",

    title: localized(
      "BRAT",
      "BROTHER",
    ),

    description: localized(
      "Odnos Gvozdena i Senada ostaje u središtu pitanja šta znači nazvati nekoga bratom.",
      "Gvozden and Senad's relationship remains central to the question of what it means to call someone a brother.",
    ),

    contentType: "episode",

    projectId: "project-01",

    episodeNumber: 12,
    status: "planned",

    chapterStart: 16,
    chapterEnd: 16,

    featured: true,
  },
];
