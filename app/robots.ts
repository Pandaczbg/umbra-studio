import type { MetadataRoute } from "next";

import { UMBRA_SITE_URL } from "@/lib/seo/jsonLd";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${UMBRA_SITE_URL}/sitemap.xml`,
    host: UMBRA_SITE_URL,
  };
}
