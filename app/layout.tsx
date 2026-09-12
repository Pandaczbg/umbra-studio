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

/* ==========================================================================
   UMBRA STUDIO
   ROOT LAYOUT
   V5 FINAL SYSTEM

   Responsibilities
   --------------------------------------------------------------------------
   - global metadata
   - global stylesheet
   - document language synchronization
   - motion source of truth
   - scene source of truth
   - atmospheric layer
   - persistent navigation
   - custom scrollbar
   - page transition layer
   - image transition layer

   Layout does NOT own:
   - navigation state
   - scene calculation
   - scroll physics
   - pointer tracking
   - page-specific content
   ========================================================================== */

const SITE_URL =
  "https://umbra-studio.aleksandarbojcic94.workers.dev";

const SITE_TITLE =
  "Umbra Studio — Priče koje ostavljaju senku";

const SITE_DESCRIPTION =
  "Umbra Studio — digitalni studio posvećen originalnim filmskim pričama, mini-serijama i ekranizacijama.";

export const metadata: Metadata = {
  metadataBase:
    new URL(SITE_URL),

  title: {
    default:
      SITE_TITLE,
    template:
      "%s — Umbra Studio",
  },

  description:
    SITE_DESCRIPTION,

  applicationName:
    "Umbra Studio",
  creator:
    "Umbra Studio",
  publisher:
    "Umbra Studio",

  category:
    "entertainment",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type:
      "website",
    siteName:
      "Umbra Studio",
    title:
      SITE_TITLE,
    description:
      SITE_DESCRIPTION,
    url:
      SITE_URL,
    locale:
      "sr_RS",
  },

  twitter: {
    card:
      "summary_large_image",
    title:
      SITE_TITLE,
    description:
      SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  colorScheme:
    "dark",
  themeColor:
    "#030303",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="sr"
      suppressHydrationWarning
    >
      <body>
        {/* ================================================================
           DOCUMENT LANGUAGE
           Keeps <html lang> aligned with / and /en route state
           ================================================================= */}

        <UmbraDocumentLanguage />

        {/* ================================================================
           GLOBAL MOTION
           Single source of truth for scroll metrics
           ================================================================= */}

        <UmbraMotionSystem />

        {/* ================================================================
           GLOBAL SCENE
           Resolves active cinematic scene from page structure
           ================================================================= */}

        <UmbraSceneDirector />

        {/* ================================================================
           GLOBAL ATMOSPHERE
           Pointer / light / ambient background layer
           ================================================================= */}

        <UmbraAtmosphere />

        {/* ================================================================
           PERSISTENT UI
           ================================================================= */}

        <Header />

        <UmbraScrollbar />

        {/* ================================================================
           TRANSITION SYSTEM
           Page-level and image-level cinematic transitions
           ================================================================= */}

        <UmbraPageTransition />

        <UmbraImageTransition />

        {/* ================================================================
           PAGE CONTENT
           ================================================================= */}

        {children}
      </body>
    </html>
  );
}
