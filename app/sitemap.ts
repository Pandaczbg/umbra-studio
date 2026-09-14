import type { MetadataRoute } from "next";
import { getProjects, getCharacters } from "@/lib/content/queries";
import { getArchiveEntries } from "@/lib/archive";
import { UMBRA_SITE_URL } from "@/lib/seo/jsonLd";
import { localizedHref } from "@/lib/site/routes";
import { getPublishedPosts } from "@/data/blog";
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/aktuelno",
    "/serije",
    "/likovi",
    "/arhiva",
    "/blog",
    ...getPublishedPosts().map((post) => `/blog/${post.slug}`),
    ...getProjects().map((p) => `/serije/${p.slug}`),
    ...getCharacters()
      .filter((c) => c.profileAvailable)
      .map((c) => `/likovi/${c.slug}`),
    ...getArchiveEntries().map((a) => `/arhiva/${encodeURIComponent(a.id)}`),
  ];
  return paths.flatMap((path) =>
    ["sr", "en"].map((locale) => ({
      url: UMBRA_SITE_URL + localizedHref(path, locale as "sr" | "en"),
      alternates: {
        languages: {
          sr: UMBRA_SITE_URL + localizedHref(path, "sr"),
          en: UMBRA_SITE_URL + localizedHref(path, "en"),
        },
      },
    })),
  );
}
