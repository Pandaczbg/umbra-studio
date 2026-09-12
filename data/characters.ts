export type CharacterGender = "MALE" | "FEMALE" | null;

export type CharacterCategory = "MAIN" | "SUPPORTING";

export type Character = {
  id: string;
  slug: string;
  name: string;
  projectSlug: string;
  projectTitle: string;
  category: CharacterCategory;
  gender: CharacterGender;
  heightCm: number | null;
  shortDescription: string;
  image: string;
  profileAvailable: boolean;
  order: number;
};

/**
 * Canonical character registry.
 *
 * This file is the single source of truth for the character system.
 * UI components and routes must derive their character lists, ordering,
 * relationships and navigation from this registry rather than maintaining
 * separate hard-coded character arrays.
 *
 * Image paths are intentionally empty until real character artwork exists.
 * Components must render their controlled cinematic fallback state when
 * image is empty; they must never invent /characters/*.png paths.
 *
 * profileAvailable refers to the existence of a character profile route/data,
 * not to the availability of character artwork.
 *
 * order controls the canonical cast order inside each project and therefore
 * provides stable previous/next navigation without depending on incidental
 * array manipulation inside UI components.
 */
export const characters: Character[] = [
  {
    id: "character-gvozden",
    slug: "gvozden",
    name: "Gvozden",
    projectSlug: "mrzim-svog-brata",
    projectTitle: "MRZIM SVOG BRATA",
    category: "MAIN",
    gender: "MALE",
    heightCm: 200,
    shortDescription:
      "Glavni lik priče. Njegov životni put povezuje porodični život, prijateljstva, rat i posledice događaja koji menjaju njegov svet.",
    image: "",
    profileAvailable: true,
    order: 1,
  },
  {
    id: "character-jadranka",
    slug: "jadranka",
    name: "Jadranka",
    projectSlug: "mrzim-svog-brata",
    projectTitle: "MRZIM SVOG BRATA",
    category: "MAIN",
    gender: "FEMALE",
    heightCm: null,
    shortDescription:
      "Gvozdenova supruga i jedna od centralnih osoba njegovog porodičnog sveta.",
    image: "",
    profileAvailable: true,
    order: 2,
  },
  {
    id: "character-ana",
    slug: "ana",
    name: "Ana",
    projectSlug: "mrzim-svog-brata",
    projectTitle: "MRZIM SVOG BRATA",
    category: "MAIN",
    gender: "FEMALE",
    heightCm: null,
    shortDescription:
      "Ćerka Gvozdena i Jadranke. Njeno prisustvo predstavlja važan deo porodične linije priče.",
    image: "",
    profileAvailable: true,
    order: 3,
  },
  {
    id: "character-senad",
    slug: "senad",
    name: "Senad",
    projectSlug: "mrzim-svog-brata",
    projectTitle: "MRZIM SVOG BRATA",
    category: "MAIN",
    gender: "MALE",
    heightCm: null,
    shortDescription:
      "Gvozdenov prijatelj čija sudbina postaje jedna od ključnih niti kroz razvoj priče.",
    image: "",
    profileAvailable: true,
    order: 4,
  },
  {
    id: "character-rade",
    slug: "rade",
    name: "Rade",
    projectSlug: "mrzim-svog-brata",
    projectTitle: "MRZIM SVOG BRATA",
    category: "SUPPORTING",
    gender: "MALE",
    heightCm: null,
    shortDescription:
      "Sporedni lik povezan sa svetom priče i događajima oko glavnih likova.",
    image: "",
    profileAvailable: true,
    order: 5,
  },
  {
    id: "character-azra",
    slug: "azra",
    name: "Azra",
    projectSlug: "mrzim-svog-brata",
    projectTitle: "MRZIM SVOG BRATA",
    category: "SUPPORTING",
    gender: "FEMALE",
    heightCm: null,
    shortDescription:
      "Lik povezan sa Senadom i društvenim krugom koji čini važan deo sveta priče.",
    image: "",
    profileAvailable: true,
    order: 6,
  },
  {
    id: "character-mehmed",
    slug: "mehmed",
    name: "Mehmed",
    projectSlug: "mrzim-svog-brata",
    projectTitle: "MRZIM SVOG BRATA",
    category: "SUPPORTING",
    gender: "MALE",
    heightCm: null,
    shortDescription:
      "Sporedni lik iz sveta priče, povezan sa odnosima i događajima koji oblikuju narativ.",
    image: "",
    profileAvailable: true,
    order: 7,
  },
  {
    id: "character-josif",
    slug: "josif",
    name: "Josif",
    projectSlug: "biblija",
    projectTitle: "BIBLIJA",
    category: "MAIN",
    gender: "MALE",
    heightCm: null,
    shortDescription:
      "Glavni lik projekta BIBLIJA i ulazna tačka u jedan od narativnih segmenata ovog univerzuma.",
    image: "",
    profileAvailable: true,
    order: 1,
  },
];
