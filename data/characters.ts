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
      "Centralni lik priče: vredan čovek iz Bosne, odan porodici i ideji Jugoslavije, čiji se svet pod pritiskom rata i gubitka duboko menja.",
      "The central character of the story: a hardworking man from Bosnia, devoted to his family and the idea of Yugoslavia, whose world is profoundly changed by war and loss.",
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
      "Gvozdenova supruga i njegova prva ljubav, majka Ane i važan oslonac njihove porodice; među prvima primećuje promene u svetu oko njih.",
      "Gvozden's wife and first love, Ana's mother, and an important pillar of their family; she is among the first to notice the changes in the world around them.",
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
      "Gvozdenova i Jadrankina ćerka, odlična učenica i očev najveći ponos; želi da postane lekarka i da jednog dana brine o svojim roditeljima.",
      "The daughter of Gvozden and Jadranka, an excellent student and her father's greatest pride; she wants to become a doctor and care for her parents one day.",
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
      "Gvozdenov prijatelj još od detinjstva, Senad je poput brata njegovoj porodici; suprug je Azre i otac Mehmeda, a njegov ratni put postaje jedna od ključnih niti priče.",
      "Gvozden's friend since childhood, Senad is like a brother to his family; he is Azra's husband and Mehmed's father, and his wartime path becomes one of the story's key threads.",
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
      "Narednik Erceg i Gvozdenov ratni saborac i prijatelj, važna figura u ratnom delu priče čiji odnos prema ratu i ljudima postaje sve složeniji.",
      "Sergeant Erceg, Gvozden's wartime companion and friend, an important figure in the war narrative whose relationship with war and people becomes increasingly complex.",
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
      "Senadova supruga i Mehmedova majka, bliska Gvozdenu, Jadranki i Ani; pripada malom krugu komšija sa kojima porodica zadržava blizak odnos.",
      "Senad's wife and Mehmed's mother, close to Gvozden, Jadranka, and Ana; she belongs to the small circle of neighbors who remain close to the family.",
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
      "Sin Senada i Azre, čije postojanje povezuje njihove porodice sa Gvozdenom, Jadrankom i Anom i dobija posebno značenje u kasnijem razvoju priče.",
      "The son of Senad and Azra, whose place in the story connects their family with Gvozden, Jadranka, and Ana and gains particular significance later in the narrative.",
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
      "Prvi lik projekta BIBLIJA. Sin Jakova čija priča prati snove, izdaju braće, odlazak u Misir, uspon do velike vlasti i ponovno okupljanje porodice.",
      "The first character of the BIBLIJA project. Jacob's son whose story follows dreams, betrayal by his brothers, his journey to Egypt, his rise to great power, and the reunion of his family.",
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
