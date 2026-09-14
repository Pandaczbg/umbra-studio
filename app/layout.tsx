import type { Metadata, Viewport } from "next";

import "./globals.css";

import UmbraAtmosphere from "@/components/UmbraAtmosphere";
import UmbraDocumentLanguage from "@/components/UmbraDocumentLanguage";
import UmbraMotionSystem from "@/components/UmbraMotionSystem";
import UmbraSceneDirector from "@/components/UmbraSceneDirector";
import Header from "@/components/Header";
import UmbraScrollbar from "@/components/UmbraScrollbar";
import UmbraPageTransition from "@/components/UmbraPageTransition";
import UmbraImageTransition from "@/components/UmbraImageTransition";
import {
  createUmbraOrganizationJsonLd,
  createUmbraWebsiteJsonLd,
  serializeJsonLd,
  UMBRA_SITE_URL,
} from "@/lib/seo/jsonLd";

/* ==========================================================================
   UMBRA STUDIO
   ROOT LAYOUT
   V7 SYSTEM FOUNDATION

   V7 additions
   --------------------------------------------------------------------------
   - WebSite + Organization JSON-LD
   - manifest discovery
   - stable global metadata source
   - unchanged V6 motion / scene architecture
   ========================================================================== */

const SITE_TITLE =
  "Umbra Studio — Priče koje ostavljaju senku";

const SITE_DESCRIPTION =
  "Umbra Studio — digitalni studio posvećen originalnim filmskim pričama, mini-serijama i ekranizacijama.";

const organizationJsonLd = createUmbraOrganizationJsonLd();
const websiteJsonLd = createUmbraWebsiteJsonLd();

export const metadata: Metadata = {
  metadataBase: new URL(UMBRA_SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s — Umbra Studio",
  },
  description: SITE_DESCRIPTION,
  applicationName: "Umbra Studio",
  creator: "Umbra Studio",
  publisher: "Umbra Studio",
  category: "entertainment",
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    siteName: "Umbra Studio",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: UMBRA_SITE_URL,
    locale: "sr_RS",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#030303",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr" suppressHydrationWarning>
      <body>
        <UmbraDocumentLanguage />
        <UmbraMotionSystem />
        <UmbraSceneDirector />
        <UmbraAtmosphere />
        <Header />
        <UmbraScrollbar />
        <UmbraPageTransition />
        <UmbraImageTransition />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(websiteJsonLd),
          }}
        />

        {children}
      </body>
    </html>
  );
}
