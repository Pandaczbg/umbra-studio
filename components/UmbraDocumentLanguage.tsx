"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/* ==========================================================================
   UMBRA STUDIO
   DOCUMENT LANGUAGE
   V6 FINAL SYSTEM

   Responsibility
   --------------------------------------------------------------------------
   Keeps the real document language synchronized with the active route.

   SR
   --------------------------------------------------------------------------
   /
   /serije
   /serije/...
   /likovi
   /likovi/...

   EN
   --------------------------------------------------------------------------
   /en
   /en/projects
   /en/projects/...
   /en/characters
   /en/characters/...

   Architecture
   --------------------------------------------------------------------------
   - URL pathname is the source of truth.
   - The component changes only <html lang>.
   - No React state is created for locale.
   - No animation, motion listener, or navigation logic lives here.
   ========================================================================== */

type DocumentLocale =
  | "sr"
  | "en";

function resolveLocale(
  pathname: string | null,
): DocumentLocale {
  const currentPath =
    pathname ?? "/";

  return currentPath === "/en" ||
    currentPath.startsWith(
      "/en/",
    )
    ? "en"
    : "sr";
}

export default function UmbraDocumentLanguage() {
  const pathname =
    usePathname();

  const locale =
    resolveLocale(pathname);

  useEffect(() => {
    const documentElement =
      document.documentElement;

    if (
      documentElement.lang !==
      locale
    ) {
      documentElement.lang =
        locale;
    }
  }, [locale]);

  return null;
}