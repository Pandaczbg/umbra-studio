import type { MetadataRoute } from "next";

import { characters } from "@/data/characters";
import { projects } from "@/data/projects";
import { UMBRA_SITE_URL } from "@/lib/seo/jsonLd";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "/",
    "/en",
    "/aktuelno",
    "/en/latest",
    "/serije",
    "/en/projects",
    "/likovi",
    "/en/characters",
    "/arhiva",
    "/en/archive",
  ];

  const projectRoutes = projects.flatMap((project) => [
    `/serije/${project.slug}`,
    `/en/projects/${project.slug}`,
  ]);

  const characterRoutes = characters.flatMap((character) => [
    `/likovi/${character.slug}`,
    `/en/characters/${character.slug}`,
  ]);

  return [...staticRoutes, ...projectRoutes, ...characterRoutes].map(
    (path) => ({
      url: `${UMBRA_SITE_URL}${path}`,
      changeFrequency: "monthly" as const,
      priority:
        path === "/" || path === "/en"
          ? 1
          : path === "/aktuelno" || path === "/en/latest"
            ? 0.9
            : 0.7,
    }),
  );
}
