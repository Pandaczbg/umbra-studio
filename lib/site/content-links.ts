import { getProjectById } from "@/lib/content/queries";
import type { UmbraContent } from "@/lib/content/types";
import { routes, type Locale } from "./routes";

export function contentHref(item: UmbraContent, locale: Locale): string | null {
  switch (item.contentType) {
    case "project":
      return `${routes[locale].projects}/${item.slug}`;
    case "character":
      return item.profileAvailable
        ? `${routes[locale].characters}/${item.slug}`
        : null;
    case "episode":
    case "story": {
      const project = getProjectById(item.projectId);
      return project
        ? `${routes[locale].projects}/${project.slug}#${item.contentType}-${item.slug}`
        : null;
    }
    case "archive-entry":
      return `${routes[locale].archive}/${encodeURIComponent(item.id)}`;
    default:
      return null;
  }
}
