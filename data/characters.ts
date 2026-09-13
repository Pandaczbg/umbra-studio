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
    title: localized("Gvozden"),
    shortDescription: localized(
      "Glavni lik priče. Njegov životni put povezuje porodični život, prijateljstva, rat i posledice događaja koji menjaju njegov svet.",
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
      "Gvozdenova supruga i jedna od centralnih osoba njegovog porodičnog sveta.",
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
      "Ćerka Gvozdena i Jadranke. Njeno prisustvo predstavlja važan deo porodične linije priče.",
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
      "Gvozdenov prijatelj čija sudbina postaje jedna od ključnih niti kroz razvoj priče.",
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
      "Sporedni lik povezan sa svetom priče i događajima oko glavnih likova.",
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
      "Lik povezan sa Senadom i društvenim krugom koji čini važan deo sveta priče.",
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
      "Sporedni lik iz sveta priče, povezan sa odnosima i događajima koji oblikuju narativ.",
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
    ),
    shortDescription: localized(
      "Glavni lik projekta BIBLIJA i ulazna tačka u jedan od narativnih segmenata ovog univerzuma.",
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