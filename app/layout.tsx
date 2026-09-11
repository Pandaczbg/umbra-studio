import type { Metadata } from "next";

import "./globals.css";

import UmbraAtmosphere from "@/components/UmbraAtmosphere";
import UmbraMotionSystem from "@/components/UmbraMotionSystem";
import UmbraSceneDirector from "@/components/UmbraSceneDirector";
import Header from "@/components/Header";
import UmbraScrollbar from "@/components/UmbraScrollbar";
import UmbraPageTransition from "@/components/UmbraPageTransition";
import UmbraImageTransition from "@/components/UmbraImageTransition";

export const metadata: Metadata = {
  title:
    "Umbra Studio — Priče koje ostavljaju senku",

  description:
    "Umbra Studio — digitalni studio posvećen originalnim filmskim pričama, mini-serijama i ekranizacijama.",
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