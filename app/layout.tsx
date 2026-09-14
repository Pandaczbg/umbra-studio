import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { headers } from "next/headers";
import { Suspense } from "react";
import "./globals.css";
import "./v8.css";
import SiteHeader from "@/components/v8/SiteHeader";
import UmbraMotionSystem from "@/components/UmbraMotionSystem";
import UmbraSceneDirector from "@/components/UmbraSceneDirector";
import {
  createUmbraOrganizationJsonLd,
  createUmbraWebsiteJsonLd,
  serializeJsonLd,
  UMBRA_SITE_URL,
} from "@/lib/seo/jsonLd";
const geist = localFont({
  src: "../public/fonts/Geist.woff2",
  display: "swap",
  variable: "--font-geist-sans",
  weight: "100 900",
});
export const metadata: Metadata = {
  metadataBase: new URL(UMBRA_SITE_URL),
  title: { default: "Umbra Studio", template: "%s — Umbra Studio" },
  applicationName: "Umbra Studio",
  creator: "Umbra Studio",
  publisher: "Umbra Studio",
  manifest: "/manifest.webmanifest",
  robots: { index: true, follow: true },
};
export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#080908",
};
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = (await headers()).get("x-umbra-locale") === "en" ? "en" : "sr";
  return (
    <html lang={locale} className={geist.variable} suppressHydrationWarning>
      <body>
        <UmbraMotionSystem />
        <UmbraSceneDirector />
        <Suspense
          fallback={
            <div className="v8-header" aria-hidden="true">
              <div className="v8-header-frame">UMBRA STUDIO</div>
            </div>
          }
        >
          <SiteHeader />
        </Suspense>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(createUmbraOrganizationJsonLd()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(createUmbraWebsiteJsonLd()),
          }}
        />
        {children}
      </body>
    </html>
  );
}
