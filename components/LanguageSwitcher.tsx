"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useState,
} from "react";

type Locale = "sr" | "en";

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
  return pathname === "/en" || pathname.startsWith("/en/")
    ? "en"
    : "sr";
}

function stripEnglishPrefix(pathname: string) {
  const normalizedPath = pathname || "/";
  const withoutEnglishPrefix = normalizedPath.replace(
    /^\/en(?=\/|$)/,
    "",
  );

  return withoutEnglishPrefix || "/";
}

function mapLocalizedRoute(
  pathname: string,
  targetLocale: Locale,
) {
  const cleanPath = stripEnglishPrefix(pathname);

  const seriesMatch = cleanPath.match(
    /^\/serije(?:\/(.+))?\/?$/,
  );

  const englishProjectsMatch = cleanPath.match(
    /^\/projects(?:\/(.+))?\/?$/,
  );

  const characterMatch = cleanPath.match(
    /^\/likovi(?:\/(.+))?\/?$/,
  );

  const englishCharactersMatch = cleanPath.match(
    /^\/characters(?:\/(.+))?\/?$/,
  );

  const archiveMatch = cleanPath.match(
    /^\/arhiva(?:\/(.+))?\/?$/,
  );

  const englishArchiveMatch = cleanPath.match(
    /^\/archive(?:\/(.+))?\/?$/,
  );

  if (targetLocale === "en") {
    if (cleanPath === "/") {
      return "/en";
    }

    if (cleanPath === "/serije") {
      return "/en/projects";
    }

    if (seriesMatch) {
      const slug = seriesMatch[1];
      return slug ? `/en/projects/${slug}` : "/en/projects";
    }

    if (cleanPath === "/likovi") {
      return "/en/characters";
    }

    if (characterMatch) {
      const slug = characterMatch[1];
      return slug ? `/en/characters/${slug}` : "/en/characters";
    }

    if (cleanPath === "/aktuelno") {
      return "/en/latest";
    }

    if (cleanPath === "/arhiva") {
      return "/en/archive";
    }

    if (archiveMatch) {
      const slug = archiveMatch[1];
      return slug ? `/en/archive/${slug}` : "/en/archive";
    }

    if (cleanPath === "/pretraga") {
      return "/en";
    }

    return `/en${cleanPath}`;
  }

  if (cleanPath === "/en" || cleanPath === "") {
    return "/";
  }

  if (cleanPath === "/projects") {
    return "/serije";
  }

  if (englishProjectsMatch) {
    const slug = englishProjectsMatch[1];
    return slug ? `/serije/${slug}` : "/serije";
  }

  if (cleanPath === "/characters") {
    return "/likovi";
  }

  if (englishCharactersMatch) {
    const slug = englishCharactersMatch[1];
    return slug ? `/likovi/${slug}` : "/likovi";
  }

  if (cleanPath === "/latest") {
    return "/aktuelno";
  }

  if (cleanPath === "/archive") {
    return "/arhiva";
  }

  if (englishArchiveMatch) {
    const slug = englishArchiveMatch[1];
    return slug ? `/arhiva/${slug}` : "/arhiva";
  }

  if (cleanPath === "/search") {
    return "/pretraga";
  }

  return cleanPath;
}

function preserveUrlState(
  pathname: string,
  targetLocale: Locale,
  hash: string,
  search: string,
) {
  const cleanPath = stripEnglishPrefix(pathname);
  const unsupportedSearchRoute =
    cleanPath === "/pretraga" || cleanPath === "/search";
  const targetPath = mapLocalizedRoute(pathname, targetLocale);
  const shouldDropSearch =
    unsupportedSearchRoute &&
    (targetPath === "/en" || targetPath === "/");

  return `${targetPath}${shouldDropSearch ? "" : search}${hash}`;
}

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const locale = detectLocale(pathname || "/");
  const target: Locale = locale === "sr" ? "en" : "sr";

  const [hash, setHash] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const syncUrlState = () => {
      setHash(window.location.hash);
      setSearch(window.location.search);
    };

    syncUrlState();

    window.addEventListener("hashchange", syncUrlState);
    window.addEventListener("popstate", syncUrlState);

    return () => {
      window.removeEventListener("hashchange", syncUrlState);
      window.removeEventListener("popstate", syncUrlState);
    };
  }, [pathname]);

  const targetPath = preserveUrlState(
    pathname || "/",
    target,
    hash,
    search,
  );

  const activeOption = OPTIONS[locale];
  const targetOption = OPTIONS[target];

  return (
    <div
      role="group"
      aria-label={locale === "en" ? "Language" : "Jezik"}
      className="relative flex items-center gap-1 rounded-full border border-white/[0.10] bg-[var(--umbra-glass-fill-deep)] p-1 shadow-[var(--umbra-shadow-soft)] backdrop-blur-xl"
      style={{
        boxShadow:
          "0 10px 30px rgba(0,0,0,.24), inset 0 1px 0 rgba(255,255,255,.06)",
      }}
    >
      <span
        aria-current="page"
        className="relative inline-flex min-w-9 items-center justify-center rounded-full border border-white/[0.06] px-2.5 py-1.5 text-[8px] font-semibold uppercase tracking-[0.18em] text-[var(--umbra-champagne-soft)]"
        style={{
          background:
            "linear-gradient(180deg, rgba(234,211,154,.09), rgba(255,255,255,.025))",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,.08), 0 0 12px rgba(199,169,107,.05)",
        }}
      >
        <span
          aria-hidden="true"
          className="absolute inset-x-2 bottom-[3px] h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(234,211,154,.70), transparent)",
          }}
        />

        <span className="relative">{activeOption.label}</span>
      </span>

      <span
        aria-hidden="true"
        className="h-3 w-px bg-white/[0.09]"
      />

      <Link
        href={targetPath}
        aria-label={targetOption.ariaLabel}
        data-cursor-interactive
        className="inline-flex min-w-9 items-center justify-center rounded-full border border-transparent px-2.5 py-1.5 text-[8px] font-semibold uppercase tracking-[0.18em] text-white/[0.38] outline-none transition-[background-color,border-color,color,box-shadow,transform] duration-300 hover:border-white/[0.07] hover:bg-white/[0.045] hover:text-white/[0.86] focus-visible:border-[rgba(234,211,154,.28)] focus-visible:bg-white/[0.05] focus-visible:text-white focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
      >
        {targetOption.label}
      </Link>
    </div>
  );
}
