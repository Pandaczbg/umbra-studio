export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export const UMBRA_SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL ?? "https://umbra-studio.aleksandarbojcic94.workers.dev").replace(/\/$/, "");

export const UMBRA_YOUTUBE_URL =
  "https://www.youtube.com/@umbrastud";

export function createUmbraOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Umbra Studio",
    url: UMBRA_SITE_URL,
    slogan: "Priče koje ostavljaju senku.",
    sameAs: [UMBRA_YOUTUBE_URL],
    logo: `${UMBRA_SITE_URL}/umbra-avatar.png`,
  };
}

export function createUmbraWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Umbra Studio",
    url: UMBRA_SITE_URL,
    inLanguage: ["sr", "en"],
    publisher: {
      "@type": "Organization",
      name: "Umbra Studio",
      url: UMBRA_SITE_URL,
    },
  };
}

export function createBreadcrumbJsonLd(
  items: readonly {
    name: string;
    url: string;
  }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
