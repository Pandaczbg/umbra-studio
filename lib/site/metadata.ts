import type { Metadata } from "next";
import { getCharacterBySlug, getProjectBySlug } from "@/lib/content/queries";
import { getArchiveEntryById } from "@/lib/archive";
import { UMBRA_SITE_URL } from "@/lib/seo/jsonLd";
import { localizedHref, routes, type Locale, type Section } from "./routes";
import { copy } from "./copy";

export function pageMetadata(
  locale: Locale,
  section: Section,
  options: {
    title?: string;
    description?: string;
    slug?: string;
    noIndex?: boolean;
  } = {},
): Metadata {
  const c = copy[locale];
  const title =
    options.title ??
    (section === "home"
      ? `Umbra Studio — ${c.tagline}`
      : `${c[section]} — Umbra Studio`);
  const description = options.description ?? c.description;
  const path =
    routes[locale][section] +
    (options.slug ? `/${encodeURIComponent(options.slug)}` : "");
  const canonical = new URL(path, UMBRA_SITE_URL).toString();
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      languages: {
        sr: localizedHref(path, "sr"),
        en: localizedHref(path, "en"),
        "x-default": localizedHref(path, "sr"),
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Umbra Studio",
      type: "website",
      locale: locale === "sr" ? "sr_RS" : "en_GB",
      alternateLocale: locale === "sr" ? "en_GB" : "sr_RS",
      images: [
        {
          url: "/images/umbra-world.webp",
          width: 1671,
          height: 941,
          alt: "Umbra Studio",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/umbra-world.webp"],
    },
    ...(options.noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}

export function detailMetadata(
  locale: Locale,
  section: "projects" | "characters" | "archive",
  slug: string,
): Metadata {
  const item =
    section === "projects"
      ? getProjectBySlug(slug)
      : section === "characters"
        ? getCharacterBySlug(slug)
        : getArchiveEntryById(slug);
  if (!item || ("profileAvailable" in item && !item.profileAvailable))
    return {
      title: { absolute: "404 — Umbra Studio" },
      robots: { index: false, follow: true },
    };
  return pageMetadata(locale, section, {
    slug,
    title: `${item.title[locale]} — Umbra Studio`,
    description: item.description?.[locale] ??
      ("shortDescription" in item ? item.shortDescription?.[locale] : undefined),
  });
}
