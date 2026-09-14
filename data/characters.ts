import type {
  CharacterContent,
  LocalizedText,
} from "@/lib/content/types";

const localized = (
  sr: string,
  en: string = sr,
): LocalizedText => ({
  sr,
  en,
});

export const characters: CharacterContent[] = [
  {
    id: "character-gvozden",
    slug: "gvozden",
    visibility: "public",

    title: localized(
      "Gvozden",
    ),

    shortDescription: localized(
      "Gvozden je zemljoradnik iz Bosne i Hercegovine, odan porodici i ideji zajedništva. Njegova čvrsta uverenja dolaze na iskušenje kada se svet oko njega promeni.",
      "Gvozden is a farmer from Bosnia and Herzegovina, devoted to his family and the idea of a shared country. His firm convictions are tested as the world around him changes.",
    ),

    contentType: "character",

    projectId: "project-01",
    category: "MAIN",
    gender: "MALE",
    heightCm: 200,
    profileAvailable: true,
    order: 1,
  },

  {
    id: "character-jadranka",
    slug: "jadranka",
    visibility: "public",

    title: localized(
      "Jadranka",
    ),

    shortDescription: localized(
      "Jadranka je Gvozdenova supruga, njegova ljubav iz srednjoškolskih dana i Anina majka. Primećuje promene u odnosima sa susedima i brine za sigurnost porodice.",
      "Jadranka is Gvozden's wife, his high-school sweetheart and Ana's mother. She notices changes in the neighborhood and worries about her family's safety.",
    ),

    contentType: "character",

    projectId: "project-01",
    category: "MAIN",
    gender: "FEMALE",
    heightCm: null,
    profileAvailable: true,
    order: 2,
  },

  {
    id: "character-ana",
    slug: "ana",
    visibility: "public",

    title: localized(
      "Ana",
    ),

    shortDescription: localized(
      "Ana je ćerka Gvozdena i Jadranke. Radoznala i posvećena učenju, želi da postane lekarka i pomaže ljudima.",
      "Ana is Gvozden and Jadranka's daughter. Curious and dedicated to her studies, she hopes to become a doctor and help others.",
    ),

    contentType: "character",

    projectId: "project-01",
    category: "MAIN",
    gender: "FEMALE",
    heightCm: null,
    profileAvailable: true,
    order: 3,
  },

  {
    id: "character-senad",
    slug: "senad",
    visibility: "public",

    title: localized(
      "Senad",
    ),

    shortDescription: localized(
      "Senad je Gvozdenov prijatelj iz detinjstva, blizak poput brata. Sa suprugom Azrom i sinom Mehmedom deo je njihovog susedskog i porodičnog sveta.",
      "Senad is Gvozden's childhood friend, as close to him as a brother. With his wife Azra and son Mehmed, he is part of the family's close-knit neighborhood.",
    ),

    contentType: "character",

    projectId: "project-01",
    category: "MAIN",
    gender: "MALE",
    heightCm: null,
    profileAvailable: true,
    order: 4,
  },

  {
    id: "character-rade",
    slug: "rade",
    visibility: "public",

    title: localized(
      "Rade",
    ),

    shortDescription: localized(
      "Rade, narednik Radoje Erceg, upoznaje Gvozdena u kasarni. Njihov odnos razvija se kroz ratne okolnosti i teška pitanja odgovornosti.",
      "Rade, Sergeant Radoje Erceg, meets Gvozden at the barracks. Their relationship develops amid war and difficult questions of responsibility.",
    ),

    contentType: "character",

    projectId: "project-01",
    category: "SUPPORTING",
    gender: "MALE",
    heightCm: null,
    profileAvailable: true,
    order: 5,
  },

  {
    id: "character-azra",
    slug: "azra",
    visibility: "public",

    title: localized(
      "Azra",
    ),

    shortDescription: localized(
      "Azra je Senadova supruga i Mehmedova majka. Njena porodica je bliska sa Gvozdenom, Jadrankom i Anom.",
      "Azra is Senad's wife and Mehmed's mother. Her family is close to Gvozden, Jadranka and Ana.",
    ),

    contentType: "character",

    projectId: "project-01",
    category: "SUPPORTING",
    gender: "FEMALE",
    heightCm: null,
    profileAvailable: true,
    order: 6,
  },

  {
    id: "character-mehmed",
    slug: "mehmed",
    visibility: "public",

    title: localized(
      "Mehmed",
    ),

    shortDescription: localized(
      "Mehmed je sin Senada i Azre. Njegovo rođenje predstavlja radost koju dve prijateljske porodice dele.",
      "Mehmed is Senad and Azra's son. His birth is a moment of joy shared by the two families.",
    ),

    contentType: "character",

    projectId: "project-01",
    category: "SUPPORTING",
    gender: "MALE",
    heightCm: null,
    profileAvailable: true,
    order: 7,
  },

  {
    id: "character-josif",
    slug: "josif",
    visibility: "public",

    title: localized(
      "Josif",
      "Joseph",
    ),

    shortDescription: localized(
      "Josif je Jakovljev sin iz Prve knjige Mojsijeve. Njegovi snovi i odnos sa braćom otvaraju priču predstavljenu u projektu BIBLIJA.",
      "Joseph is Jacob's son in the Book of Genesis. His dreams and his relationship with his brothers begin the story explored in BIBLIJA.",
    ),

    contentType: "character",

    projectId: "project-02",
    category: "MAIN",
    gender: "MALE",
    heightCm: null,
    profileAvailable: true,
    order: 1,
  },
];
