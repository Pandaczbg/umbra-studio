import type { ProjectContent } from "../content/types";
import type { Locale } from "../site/routes";

const optimized: Record<string, string> = {
  "/umbra-background.png": "/images/umbra-world.webp",
  "/Biblija Cover.png": "/images/biblija.webp",
  "/books/Mrzim-svog-brata/cover-sr.png": "/images/novel-sr.webp",
  "/books/Mrzim-svog-brata/cover-en.jpg": "/images/novel-en.webp",
};
export function optimizedImage(src: string): string {
  return optimized[src] ?? src;
}
export function projectArtwork(project: ProjectContent, locale: Locale) {
  const cover = project.cover;
  const source =
    locale === "sr"
      ? (project.source?.coverSr ?? project.source?.coverEn)
      : (project.source?.coverEn ?? project.source?.coverSr);
  return {
    src: optimizedImage(cover ?? source ?? "/umbra-background.png"),
    isBook: !cover && Boolean(source),
    alt: project.title[locale],
  };
}
