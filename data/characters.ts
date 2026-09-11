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
};

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
    shortDescription: "Glavni lik priče. Njegov životni put povezuje porodični život, prijateljstva, rat i posledice događaja koji menjaju njegov svet.",
    image: "/characters/gvozden.png",
    profileAvailable: true,
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
    shortDescription: "Gvozdenova supruga i jedna od centralnih osoba njegovog porodičnog sveta.",
    image: "/characters/jadranka.png",
    profileAvailable: true,
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
    shortDescription: "Ćerka Gvozdena i Jadranke. Njeno prisustvo predstavlja važan deo porodične linije priče.",
    image: "/characters/ana.png",
    profileAvailable: true,
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
    shortDescription: "Gvozdenov prijatelj čija sudbina postaje jedna od ključnih niti kroz razvoj priče.",
    image: "/characters/senad.png",
    profileAvailable: true,
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
    shortDescription: "Sporedni lik povezan sa svetom priče i događajima oko glavnih likova.",
    image: "/characters/rade.png",
    profileAvailable: true,
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
    shortDescription: "Lik povezan sa Senadom i društvenim krugom koji čini važan deo sveta priče.",
    image: "/characters/azra.png",
    profileAvailable: true,
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
    shortDescription: "Sporedni lik iz sveta priče, povezan sa odnosima i događajima koji oblikuju narativ.",
    image: "/characters/mehmed.png",
    profileAvailable: true,
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
    shortDescription: "Glavni lik projekta BIBLIJA i ulazna tačka u jedan od narativnih segmenata ovog univerzuma.",
    image: "/characters/josif.png",
    profileAvailable: true,
  },
];
