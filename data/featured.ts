export type FeaturedType =
  | "episode"
  | "project"
  | "character"
  | "announcement"
  | "coming-soon";

export type FeaturedItem = {
  id: string;
  type: FeaturedType;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  image?: string;
  active: boolean;
  priority: number;
};

export const featuredItems: FeaturedItem[] = [
  {
    id: "featured-project-01",
    type: "project",
    eyebrow: "FEATURED PROJECT / PROJECT 01",
    title: "MRZIM SVOG BRATA",
    description:
      "Prva serija studija Umbra, zasnovana na romanu Branislava Bojčića.",
    href: "/serije/mrzim-svog-brata",
    image: "/umbra-background.png",
    active: true,
    priority: 100,
  },

  /*
   * Future examples:
   *
   * {
   *   id: "featured-episode-01",
   *   type: "episode",
   *   eyebrow: "NOVA EPIZODA",
   *   title: "EPIZODA 01",
   *   description: "Nova epizoda serije...",
   *   href: "/serije/mrzim-svog-brata",
   *   image: "/episodes/episode-01.jpg",
   *   active: true,
   *   priority: 110,
   * },
   *
   * {
   *   id: "featured-character-01",
   *   type: "character",
   *   eyebrow: "NOVI LIK",
   *   title: "GVOZDEN",
   *   description: "Upoznajte lik...",
   *   href: "/likovi/gvozden",
   *   image: "/characters/gvozden.png",
   *   active: true,
   *   priority: 90,
   * },
   */
];

export function getFeaturedItems() {
  return featuredItems
    .filter((item) => item.active)
    .sort((a, b) => b.priority - a.priority);
}

export function getPrimaryFeaturedItem() {
  return getFeaturedItems()[0] ?? null;
}
