/**
 * UMBRA STUDIO — V6
 * SEO foundation
 *
 * Shared metadata helpers for the Umbra application.
 *
 * Responsibilities:
 * - localized SEO title and description
 * - canonical URL generation
 * - Open Graph metadata
 * - Twitter card metadata
 * - robots metadata
 *
 * Rules:
 * - No UI logic
 * - No routing components
 * - No content registry access
 * - No browser APIs
 * - No hard-coded production domain
 * - metadataBase belongs to the application/layout metadata layer
 */

import type { Metadata } from "next";
import { UMBRA_SITE_URL } from "./jsonLd";

export type SeoLocale =
  | "sr"
  | "en";

const SITE_NAME =
  "Umbra Studio";

const SITE_URL =
  UMBRA_SITE_URL;

const DEFAULT_IMAGE =
  "/umbra-background.png";

const SITE_COPY: Record<
  SeoLocale,
  {
    readonly title: string;
    readonly description: string;
  }
> = {
  sr: {
    title:
      "Umbra Studio — Priče koje ostavljaju senku",
    description:
      "Digitalni studio za razvoj priča, adaptacija i svetova kroz film, pripovedanje i savremenu tehnologiju.",
  },

  en: {
    title:
      "Umbra Studio — Stories that leave a shadow",
    description:
      "A digital studio for developing stories, adaptations and worlds through cinema, storytelling and contemporary technology.",
  },
};

export function getSiteTitle(
  locale: SeoLocale,
): string {
  return SITE_COPY[locale].title;
}

export function getSiteDescription(
  locale: SeoLocale,
): string {
  return SITE_COPY[locale].description;
}

export function getCanonicalUrl(
  pathname = "/",
): string {
  const normalizedPath =
    pathname === ""
      ? "/"
      : pathname.startsWith("/")
        ? pathname
        : `/${pathname}`;

  return new URL(
    normalizedPath,
    SITE_URL,
  ).toString();
}

export function getAbsoluteAssetUrl(
  assetPath: string,
): string {
  if (
    assetPath.startsWith(
      "http://",
    ) ||
    assetPath.startsWith(
      "https://",
    )
  ) {
    return assetPath;
  }

  const normalizedPath =
    assetPath.startsWith("/")
      ? assetPath
      : `/${assetPath}`;

  return new URL(
    normalizedPath,
    SITE_URL,
  ).toString();
}

export type PageMetadataOptions = {
  readonly title?: string;
  readonly description?: string;
  readonly pathname?: string;
  readonly image?: string;
  readonly type?: "website" | "article";
  readonly noIndex?: boolean;
};

export function createPageMetadata(
  locale: SeoLocale,
  options: PageMetadataOptions = {},
): Metadata {
  const title =
    options.title ??
    getSiteTitle(locale);

  const description =
    options.description ??
    getSiteDescription(locale);

  const pathname =
    options.pathname ?? "/";

  const image =
    options.image ??
    DEFAULT_IMAGE;

  const canonical =
    getCanonicalUrl(
      pathname,
    );

  const imageUrl =
    getAbsoluteAssetUrl(
      image,
    );

  const metadata: Metadata = {
    title,
    description,

    alternates: {
      canonical,
    },

    openGraph: {
      title,
      description,
      siteName: SITE_NAME,
      url: canonical,
      type:
        options.type ??
        "website",
      images: [
        {
          url: imageUrl,
          alt: title,
        },
      ],
    },

    twitter: {
      card:
        "summary_large_image",
      title,
      description,
      images: [
        imageUrl,
      ],
    },
  };

  if (options.noIndex) {
    metadata.robots = {
      index: false,
      follow: false,
    };
  }

  return metadata;
}