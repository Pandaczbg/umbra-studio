"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import {
  getLocalePrefix,
  type Locale,
} from "@/data/translations";

type LanguageOption = {
  locale: Locale;
  label: string;
  ariaLabel: string;
};

const OPTIONS: Record<Locale, LanguageOption> = {
  sr: {
    locale: "sr",
    label: "SR",
    ariaLabel: "Prebaci na srpski",
  },
  en: {
    locale: "en",
    label: "EN",
    ariaLabel: "Switch to English",
  },
};

function detectLocale(pathname: string): Locale {
  return pathname === "/en" ||
    pathname.startsWith("/en/")
    ? "en"
    : "sr";
}

function stripEnglishPrefix(pathname: string) {
  const normalizedPath =
    pathname || "/";

  const withoutEnglishPrefix =
    normalizedPath.replace(
      /^\/en(?=\/|$)/,
      "",
    );

  return withoutEnglishPrefix || "/";
}

function mapLocalizedRoute(
  pathname: string,
  targetLocale: Locale,
) {
  const cleanPath =
    stripEnglishPrefix(pathname);

  const dynamicSeriesMatch =
    cleanPath.match(
      /^\/serije(?:\/(.+))?\/?$/,
    );

  const dynamicProjectsMatch =
    cleanPath.match(
      /^\/projects(?:\/(.+))?\/?$/,
    );

  if (targetLocale === "en") {
    if (cleanPath === "/") {
      return getLocalePrefix("en");
    }

    if (cleanPath === "/serije") {
      return "/en/projects";
    }

    if (cleanPath === "/likovi") {
      return "/en/characters";
    }

    if (dynamicSeriesMatch) {
      const slug =
        dynamicSeriesMatch[1];

      return slug
        ? `/en/projects/${slug}`
        : "/en/projects";
    }

    return `/en${cleanPath}`;
  }

  if (
    cleanPath ===
    getLocalePrefix("en")
  ) {
    return "/";
  }

  if (cleanPath === "/projects") {
    return "/serije";
  }

  if (cleanPath === "/characters") {
    return "/likovi";
  }

  if (dynamicProjectsMatch) {
    const slug =
      dynamicProjectsMatch[1];

    return slug
      ? `/serije/${slug}`
      : "/serije";
  }

  return cleanPath;
}

function preserveUrlState(
  pathname: string,
  targetLocale: Locale,
  hash: string,
  search: string,
) {
  const targetPath = mapLocalizedRoute(
    pathname,
    targetLocale,
  );

  return `${targetPath}${search}${hash}`;
}

export default function LanguageSwitcher() {
  const pathname =
    usePathname();

  const locale =
    detectLocale(pathname || "/");

  const target: Locale =
    locale === "sr"
      ? "en"
      : "sr";

  const [hash, setHash] =
    useState("");
  const [search, setSearch] =
    useState("");

  useEffect(() => {
    const syncUrlState = () => {
      setHash(
        window.location.hash,
      );
      setSearch(
        window.location.search,
      );
    };

    syncUrlState();

    window.addEventListener(
      "hashchange",
      syncUrlState,
    );

    window.addEventListener(
      "popstate",
      syncUrlState,
    );

    return () => {
      window.removeEventListener(
        "hashchange",
        syncUrlState,
      );
      window.removeEventListener(
        "popstate",
        syncUrlState,
      );
    };
  }, [pathname]);

  const targetPath = useMemo(
    () =>
      preserveUrlState(
        pathname || "/",
        target,
        hash,
        search,
      ),
    [
      hash,
      pathname,
      search,
      target,
    ],
  );

  return (
    <div
      role="group"
      aria-label={
        locale === "en"
          ? "Language"
          : "Jezik"
      }
      className="flex items-center rounded-full border border-white/[0.12] bg-white/[0.028] p-1 shadow-[0_8px_28px_rgba(0,0,0,0.18)] backdrop-blur-sm"
    >
      <span
        aria-current="page"
        className="rounded-full bg-white/[0.065] px-2.5 py-1.5 text-[8px] font-semibold uppercase tracking-[0.18em] text-white/[0.76]"
      >
        {OPTIONS[locale].label}
      </span>

      <Link
        href={targetPath}
        aria-label={
          OPTIONS[target].ariaLabel
        }
        data-cursor-interactive
        className="rounded-full px-2.5 py-1.5 text-[8px] font-semibold uppercase tracking-[0.18em] text-white/[0.38] transition-all duration-300 hover:bg-white/[0.065] hover:text-white/[0.92] focus-visible:bg-white/[0.065] focus-visible:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
      >
        {OPTIONS[target].label}
      </Link>
    </div>
  );
}
