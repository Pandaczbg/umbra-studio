export type Locale = "sr" | "en";

export const translations = {
  sr: {
    navigation: {
      home: "Početna",
      projects: "Projekti",
      characters: "Likovi",
      studio: "Umbra",
      watch: "Gledaj",
      youtube: "YouTube kanal",
      follow: "Prati kanal",
    },

    hero: {
      eyebrow: "Digitalni studio",
      title: "Priče koje ostavljaju senku",
      description:
        "Originalne filmske priče, mini-serije i ekranizacije nastale kroz spoj pripovedanja, filma i savremene tehnologije.",
      primary: "Istraži projekat",
      secondary: "Upoznaj Umbra",
    },

    characters: {
      eyebrow: "Likovi",
      title: "Ljudi iza priča",
      description:
        "Likovi se grade kao filmske ličnosti, sa svojim odnosima, motivima i mestom unutar priče.",
      action: "Otvori lik",
    },

    studio: {
      eyebrow: "Umbra Studio",
      title: "Priče traže svoj svet",
      body:
        "Umbra Studio razvija originalne narative i ekranizacije kroz spoj scenarija, režije, vizuelnog pripovedanja i savremene produkcije.",
      marker: "PRIČA / FILM / POKRET",
    },

    watch: {
      eyebrow: "Gledaj",
      title: "Priče dobijaju sliku",
      body:
        "Serije i epizode objavljujemo na YouTube kanalu Umbra Studija.",
      action: "Otvori YouTube",
    },

    footer: {
      line: "Priče koje ostavljaju senku",
      note: "Umbra Studio — 2026",
    },
  },

  en: {
    navigation: {
      home: "Home",
      projects: "Projects",
      characters: "Characters",
      studio: "Umbra",
      watch: "Watch",
      youtube: "YouTube channel",
      follow: "Follow channel",
    },

    hero: {
      eyebrow: "Digital studio",
      title: "Stories that leave a shadow",
      description:
        "Original film stories, mini-series and literary adaptations shaped through storytelling, cinema and contemporary technology.",
      primary: "Explore project",
      secondary: "Enter Umbra",
    },

    characters: {
      eyebrow: "Characters",
      title: "The people behind the stories",
      description:
        "Characters are built as cinematic personalities, with their own relationships, motives and place within the story.",
      action: "Open character",
    },

    studio: {
      eyebrow: "Umbra Studio",
      title: "Stories need their own world",
      body:
        "Umbra Studio develops original narratives and adaptations through writing, direction, visual storytelling and contemporary production.",
      marker: "STORY / FILM / MOTION",
    },

    watch: {
      eyebrow: "Watch",
      title: "Stories become images",
      body:
        "Series and episodes are released through the Umbra Studio YouTube channel.",
      action: "Open YouTube",
    },

    footer: {
      line: "Stories that leave a shadow",
      note: "Umbra Studio — 2026",
    },
  },
} as const;

export function getTranslations(
  locale: Locale,
) {
  return translations[locale];
}

export function getLocalePrefix(
  locale: Locale,
) {
  return locale === "en"
    ? "/en"
    : "";
}
