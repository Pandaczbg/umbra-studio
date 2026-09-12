"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useState,
} from "react";

import {
  getLocalePrefix,
  type Locale,
} from "@/data/translations";

type LanguageOption = {
  locale: Locale;
  label: string;
  ariaLabel: string;
};

const OPTIONS: Record<
  Locale,
  LanguageOption
> = {
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

function detectLocale(
  pathname: string,
): Locale {
  return pathname === "/en" ||
    pathname.startsWith("/en/")
    ? "en"
    : "sr";
}

function stripEnglishPrefix(
  pathname: string,
) {
  const normalizedPath =
    pathname || "/";

  const withoutEnglishPrefix =
    normalizedPath.replace(
      /^\/en(?=\/|$)/,
      "",
    );

  return (
    withoutEnglishPrefix || "/"
  );
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
  const targetPath =
    mapLocalizedRoute(
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

  const targetPath =
    preserveUrlState(
      pathname || "/",
      target,
      hash,
      search,
    );

  const activeOption =
    OPTIONS[locale];

  const targetOption =
    OPTIONS[target];

  return (
    <div
      role="group"
      aria-label={
        locale === "en"
          ? "Language"
          : "Jezik"
      }
      className="flex items-center gap-1 rounded-full border border-white/[0.10] bg-black/[0.20] p-1 shadow-[0_8px_28px_rgba(0,0,0,0.18)] backdrop-blur-md"
    >
      <span
        aria-current="page"
        className="relative inline-flex min-w-9 items-center justify-center rounded-full px-2.5 py-1.5 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#ead39a]/88"
      >
        <span
          aria-hidden="true"
          className="absolute inset-x-2 bottom-1 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(234,211,154,.72), transparent)",
          }}
        />

        <span className="relative">
          {activeOption.label}
        </span>
      </span>

      <span
        aria-hidden="true"
        className="h-3 w-px bg-white/[0.10]"
      />

      <Link
        href={targetPath}
        aria-label={
          targetOption.ariaLabel
        }
        data-cursor-interactive
        className="inline-flex min-w-9 items-center justify-center rounded-full px-2.5 py-1.5 text-[8px] font-semibold uppercase tracking-[0.18em] text-white/[0.34] outline-none transition-[background-color,color,transform] duration-300 hover:bg-white/[0.055] hover:text-white/[0.88] focus-visible:bg-white/[0.055] focus-visible:text-white focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
      >
        {targetOption.label}
      </Link>
    </div>
  );
}
