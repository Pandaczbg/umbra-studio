import type { Metadata } from "next";

import "./globals.css";

import UmbraAtmosphere from "@/components/UmbraAtmosphere";
import UmbraMotionSystem from "@/components/UmbraMotionSystem";
import UmbraSceneDirector from "@/components/UmbraSceneDirector";
import Header from "@/components/Header";
import UmbraScrollbar from "@/components/UmbraScrollbar";
import UmbraPageTransition from "@/components/UmbraPageTransition";
import UmbraImageTransition from "@/components/UmbraImageTransition";

const SITE_URL =
  "https://umbra-studio.aleksandarbojcic94.workers.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default:
      "Umbra Studio — Priče koje ostavljaju senku",
    template:
      "%s — Umbra Studio",
  },

  description:
    "Umbra Studio — digitalni studio posvećen originalnim filmskim pričama, mini-serijama i ekranizacijama.",

  applicationName:
    "Umbra Studio",

  creator:
    "Umbra Studio",

  publisher:
    "Umbra Studio",

  openGraph: {
    type: "website",
    siteName:
      "Umbra Studio",
    title:
      "Umbra Studio — Priče koje ostavljaju senku",
    description:
      "Umbra Studio — digitalni studio posvećen originalnim filmskim pričama, mini-serijama i ekranizacijama.",
    url: SITE_URL,
    locale: "sr_RS",
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Umbra Studio — Priče koje ostavljaju senku",
    description:
      "Umbra Studio — digitalni studio posvećen originalnim filmskim pričama, mini-serijama i ekranizacijama.",
  },

  robots: {
    index: true,
    follow: true,
  },
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
        <UmbraAtmosphere />

        <UmbraMotionSystem />
        <UmbraSceneDirector />

        <Header />

        <UmbraScrollbar />

        <UmbraPageTransition />
        <UmbraImageTransition />

        {children}
      </body>
    </html>
  );
}
