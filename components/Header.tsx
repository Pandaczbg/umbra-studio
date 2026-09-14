/* ==========================================================================
   UMBRA STUDIO — V7 ULTRA PREMIUM LUX SYSTEM
   Production-ready editorial header

   Visual contract
   --------------------------------------------------------------------------
   - Low profile: the header should disappear behind the work.
   - Original gold perimeter progress frame is retained.
   - Clock / date / location are retained, but compressed.
   - Logo, navigation and one primary action form the hierarchy.
   - Social links are secondary utility, never the visual focus.
   - No independent scroll engine; UmbraMotionSystem remains the source of truth.
   ========================================================================== */

"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type MouseEvent,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { useReducedMotion } from "framer-motion";

import LanguageSwitcher from "@/components/LanguageSwitcher";

type Locale = "sr" | "en";
type NavItemKey = "latest" | "projects" | "characters" | "studio";

type SceneKey =
  | "hero"
  | "project"
  | "characters"
  | "studio"
  | "watch"
  | "projects-archive"
  | "project-detail"
  | "characters-archive"
  | "character-dossier";

type MotionDetail = {
  scrollY?: number;
};

type SceneChangeDetail = {
  id?: SceneKey;
};

type NavItem = {
  key: NavItemKey;
  sr: string;
  en: string;
  srRoute: string;
  enRoute: string;
  srHash?: string;
  enHash?: string;
};

const GOLD = "#c8a866";
const GOLD_LIGHT = "#f4dca6";

const YOUTUBE_URL = "https://www.youtube.com/@umbrastud";
const TIKTOK_URL = "https://www.tiktok.com/@umbrastud";
const YOUTUBE_SUBSCRIBE_URL =
  "https://www.youtube.com/@umbrastud?sub_confirmation=1";

const NAVIGATION: NavItem[] = [
  {
    key: "latest",
    sr: "Aktuelno",
    en: "Latest",
    srRoute: "/aktuelno",
    enRoute: "/en/latest",
  },
  {
    key: "projects",
    sr: "Projekti",
    en: "Projects",
    srRoute: "/serije",
    enRoute: "/en/projects",
    srHash: "#current-project",
    enHash: "#current-project",
  },
  {
    key: "characters",
    sr: "Likovi",
    en: "Characters",
    srRoute: "/likovi",
    enRoute: "/en/characters",
    srHash: "#likovi",
    enHash: "#likovi",
  },
  {
    key: "studio",
    sr: "Umbra",
    en: "Umbra",
    srRoute: "/#o-studiju",
    enRoute: "/en#o-studiju",
    srHash: "#o-studiju",
    enHash: "#o-studiju",
  },
];

const SCENE_TO_NAV: Record<SceneKey, NavItemKey> = {
  hero: "latest",
  project: "projects",
  characters: "characters",
  studio: "studio",
  watch: "studio",
  "projects-archive": "projects",
  "project-detail": "projects",
  "characters-archive": "characters",
  "character-dossier": "characters",
};

const TIMEZONE_LABELS: Record<string, string> = {
  "Europe/Vienna": "VIENNA / AT",
  "Europe/Belgrade": "BELGRADE / RS",
  "Europe/Budapest": "BUDAPEST / HU",
  "Europe/Berlin": "BERLIN / DE",
  "Europe/Prague": "PRAGUE / CZ",
  "Europe/Bratislava": "BRATISLAVA / SK",
  "Europe/Ljubljana": "LJUBLJANA / SI",
  "Europe/Zagreb": "ZAGREB / HR",
  "Europe/Sarajevo": "SARAJEVO / BA",
  "Europe/Paris": "PARIS / FR",
  "Europe/Rome": "ROME / IT",
  "Europe/London": "LONDON / UK",
  "Europe/Amsterdam": "AMSTERDAM / NL",
  "Europe/Brussels": "BRUSSELS / BE",
  "Europe/Madrid": "MADRID / ES",
  "Europe/Lisbon": "LISBON / PT",
  "Europe/Stockholm": "STOCKHOLM / SE",
  "Europe/Oslo": "OSLO / NO",
  "Europe/Copenhagen": "COPENHAGEN / DK",
};

function getLocale(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "sr";
}

function isHomePath(pathname: string, locale: Locale): boolean {
  return locale === "en" ? pathname === "/en" : pathname === "/";
}

function getActiveRoute(pathname: string): NavItemKey {
  if (
    pathname === "/" ||
    pathname === "/en" ||
    pathname === "/aktuelno" ||
    pathname === "/en/latest"
  ) {
    return "latest";
  }

  if (
    pathname === "/serije" ||
    pathname.startsWith("/serije/") ||
    pathname === "/en/projects" ||
    pathname.startsWith("/en/projects/")
  ) {
    return "projects";
  }

  if (
    pathname === "/likovi" ||
    pathname.startsWith("/likovi/") ||
    pathname === "/en/characters" ||
    pathname.startsWith("/en/characters/")
  ) {
    return "characters";
  }

  return "studio";
}

function getRoute(item: NavItem, locale: Locale): string {
  return locale === "en" ? item.enRoute : item.srRoute;
}

function getHash(item: NavItem, locale: Locale): string | undefined {
  return locale === "en" ? item.enHash : item.srHash;
}

function getSceneTarget(
  scene: SceneKey,
  hash?: string,
): HTMLElement | null {
  const sceneElement = document.querySelector<HTMLElement>(
    `[data-umbra-scene="${scene}"]`,
  );

  if (sceneElement) {
    return sceneElement;
  }

  return hash ? document.getElementById(hash.replace(/^#/, "")) : null;
}

function getSceneForNavItem(item: NavItemKey): SceneKey | null {
  switch (item) {
    case "latest":
      return "hero";
    case "projects":
      return "project";
    case "characters":
      return "characters";
    case "studio":
      return "studio";
    default:
      return null;
  }
}

function homeTarget(
  locale: Locale,
  hash: string | undefined,
  item: NavItem,
): string {
  if (item.key === "latest") {
    return locale === "en" ? "/en" : "/";
  }

  const homeRoute = locale === "en" ? "/en" : "/";
  return `${homeRoute}${hash ?? ""}`;
}

function getInitialScene(pathname: string, locale: Locale): SceneKey {
  const projectsArchivePath = locale === "en" ? "/en/projects" : "/serije";
  const projectsDetailPrefix =
    locale === "en" ? "/en/projects/" : "/serije/";
  const charactersArchivePath =
    locale === "en" ? "/en/characters" : "/likovi";
  const characterDetailPrefix =
    locale === "en" ? "/en/characters/" : "/likovi/";

  if (pathname === projectsArchivePath) {
    return "projects-archive";
  }

  if (pathname.startsWith(projectsDetailPrefix)) {
    return "project-detail";
  }

  if (pathname === charactersArchivePath) {
    return "characters-archive";
  }

  if (pathname.startsWith(characterDetailPrefix)) {
    return "character-dossier";
  }

  return isHomePath(pathname, locale) ? "hero" : "hero";
}

function getViewerLocation(): string {
  if (typeof window === "undefined") {
    return "LOCAL";
  }

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    TIMEZONE_LABELS[timezone] ??
    timezone
      .replace(/^(Europe|America|Asia|Australia)\//, "")
      .replace(/_/g, " / ")
      .toUpperCase()
  );
}

function useViewerLocation(): string {
  return useSyncExternalStore(
    () => () => {},
    getViewerLocation,
    () => "LOCAL",
  );
}

/* -------------------------------------------------------------------------- */
/* ICONS                                                                      */
/* -------------------------------------------------------------------------- */

function ArrowUpRight({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="m10 9 5 3-5 3V9Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M14.2 4.2c.3 1.7 1.3 2.9 2.9 3.4.6.2 1.2.3 1.9.3v2.5c-.8 0-1.7-.2-2.4-.5v5.4c0 3.1-2.2 5.1-5.2 5.1-2.7 0-4.8-1.8-4.8-4.3 0-2.7 2.3-4.6 5.1-4.6.4 0 .7 0 1 .1v2.6c-.3-.1-.6-.1-.9-.1-.3 0-.6.8-1.3 2 0 1 .8 1.7 1.8 1.7 1.1 0 2-.8 2-2.1V4.2h2.1Z"
        fill="currentColor"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 8h16" />
      <path d="M4 16h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* CLOCK / DATE / LOCATION                                                    */
/* -------------------------------------------------------------------------- */

function UmbraClock({
  locale,
  mobile = false,
}: {
  locale: Locale;
  mobile?: boolean;
}) {
  const reducedMotion = useReducedMotion() ?? false;
  const location = useViewerLocation();
  const [time, setTime] = useState("--:--");
  const [date, setDate] = useState("-- ---");
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const formatterLocale = locale === "en" ? "en-GB" : "sr-Latn-RS";

    const timeFormatter = new Intl.DateTimeFormat(formatterLocale, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const dateFormatter = new Intl.DateTimeFormat(formatterLocale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    let pulseTimer: number | null = null;

    const update = () => {
      const now = new Date();

      setTime(timeFormatter.format(now));
      setDate(
        dateFormatter
          .format(now)
          .replace(/\./g, "")
          .toUpperCase(),
      );

      if (!reducedMotion) {
        setPulse(true);

        if (pulseTimer !== null) {
          window.clearTimeout(pulseTimer);
        }

        pulseTimer = window.setTimeout(() => {
          setPulse(false);
          pulseTimer = null;
        }, 150);
      }
    };

    update();

    const timer = window.setInterval(update, 1000);

    return () => {
      window.clearInterval(timer);

      if (pulseTimer !== null) {
        window.clearTimeout(pulseTimer);
      }
    };
  }, [locale, reducedMotion]);

  return (
    <div
      className={
        mobile
          ? "flex w-full items-start"
          : "hidden shrink-0 xl:flex"
      }
      aria-label={
        locale === "en"
          ? "Local time, date and viewer location"
          : "Lokalno vreme, datum i lokacija gledaoca"
      }
    >
      <div className="flex min-w-[150px] items-start">
        <span
          aria-hidden="true"
          className="relative mr-2.5 mt-[4px] flex h-7 w-[6px] justify-center"
        >
          <span
            className={[
              "mt-px h-[5px] w-[5px] rounded-full bg-[#ead39a] transition-opacity duration-150",
              pulse ? "opacity-100" : "opacity-65",
            ].join(" ")}
            style={{
              boxShadow: `0 0 ${pulse ? "9px" : "6px"} ${GOLD_LIGHT}42`,
            }}
          />
          <span
            className="absolute left-1/2 top-[9px] h-[18px] w-px -translate-x-1/2"
            style={{
              background:
                `linear-gradient(180deg, ${GOLD}34, transparent)`,
            }}
          />
        </span>

        <div className="leading-none">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[6px] font-medium uppercase tracking-[0.31em] text-[#f0d9a2]/72">
              {locale === "en" ? "LOCAL TIME" : "LOKALNO VREME"}
            </span>
            <span
              aria-hidden="true"
              className="h-px w-4 bg-gradient-to-r from-[#c7a96b]/28 to-transparent"
            />
          </div>

          <div className="mt-[4px] font-mono text-[14px] font-semibold leading-none tracking-[0.11em] text-[#f3d89c]/95">
            {time}
          </div>

          <div className="mt-[4px] flex items-center gap-2 font-mono text-[5.5px] uppercase tracking-[0.18em] text-white/[0.38]">
            <span>{date}</span>
            <span aria-hidden="true" className="text-[#c7a96b]/30">
              /
            </span>
            <span>{location}</span>
          </div>
        </div>
      </div>

      <span
        aria-hidden="true"
        className={mobile ? "hidden" : "ml-3 h-8 w-px"}
        style={{
          background:
            `linear-gradient(180deg, transparent, ${GOLD}22, rgba(255,255,255,.06), transparent)`,
        }}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* SOCIAL                                                                     */
/* -------------------------------------------------------------------------- */

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group flex h-7 w-7 items-center justify-center rounded-full border border-[#d6ba7b]/[0.15] bg-white/[0.014] text-white/[0.48] shadow-[inset_0_1px_0_rgba(255,255,255,.035)] transition-[border-color,color,transform,background-color,box-shadow] duration-300 hover:-translate-y-px hover:border-[#f0d9a2]/[0.42] hover:bg-[#f0d9a2]/[0.035] hover:text-[#f3d89c] hover:shadow-[0_8px_20px_rgba(200,168,102,.08),inset_0_1px_0_rgba(255,255,255,.05)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#f0d9a2]/55"
    >
      {children}
    </a>
  );
}

/* -------------------------------------------------------------------------- */
/* DESKTOP NAV                                                                */
/* -------------------------------------------------------------------------- */

function DesktopNavItem({
  item,
  label,
  href,
  active,
  onClick,
}: {
  item: NavItem;
  label: string;
  href: string;
  active: boolean;
  onClick: (
    event: MouseEvent<HTMLAnchorElement>,
    item: NavItem,
  ) => void;
}) {
  return (
    <a
      href={href}
      onClick={(event) => onClick(event, item)}
      aria-current={active ? "page" : undefined}
      className={[
        "group relative flex h-11 items-center px-4",
        "text-[9px] font-medium uppercase tracking-[0.225em]",
        "transition-colors duration-300 outline-none",
        active
          ? "text-[#fffaf2]"
          : "text-white/[0.54] hover:text-white/[0.88]",
      ].join(" ")}
    >
      <span>{label}</span>

      <span
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-x-3 bottom-0.5 h-px origin-center",
          "bg-gradient-to-r from-transparent via-[#f0d9a2]/80 to-transparent",
          "transition-[transform,opacity] duration-300",
          active
            ? "scale-x-100 opacity-100"
            : "scale-x-0 opacity-0 group-hover:scale-x-[0.62] group-hover:opacity-80",
        ].join(" ")}
      />
    </a>
  );
}

/* -------------------------------------------------------------------------- */
/* ORIGINAL GOLD PERIMETER PROGRESS                                           */
/* -------------------------------------------------------------------------- */

function ScrollProgressFrame() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[40]"
    >
      <span
        className="absolute left-0 right-0 top-0 h-px origin-left"
        style={{
          transform:
            "scaleX(clamp(0, calc(var(--umbra-scroll-progress) / 0.25), 1))",
          background:
            `linear-gradient(90deg, ${GOLD_LIGHT}, ${GOLD})`,
          boxShadow:
            `0 0 10px ${GOLD}28`,
        }}
      />

      <span
        className="absolute bottom-0 right-0 top-0 w-px origin-top"
        style={{
          transform:
            "scaleY(clamp(0, calc((var(--umbra-scroll-progress) - 0.25) / 0.25), 1))",
          background:
            `linear-gradient(180deg, ${GOLD_LIGHT}, ${GOLD})`,
          boxShadow:
            `0 0 10px ${GOLD}28`,
        }}
      />

      <span
        className="absolute bottom-0 left-0 right-0 h-px origin-right"
        style={{
          transform:
            "scaleX(clamp(0, calc((var(--umbra-scroll-progress) - 0.5) / 0.25), 1))",
          background:
            `linear-gradient(270deg, ${GOLD_LIGHT}, ${GOLD})`,
          boxShadow:
            `0 0 10px ${GOLD}28`,
        }}
      />

      <span
        className="absolute bottom-0 left-0 top-0 w-px origin-bottom"
        style={{
          transform:
            "scaleY(clamp(0, calc((var(--umbra-scroll-progress) - 0.75) / 0.25), 1))",
          background:
            `linear-gradient(0deg, ${GOLD_LIGHT}, ${GOLD})`,
          boxShadow:
            `0 0 10px ${GOLD}28`,
        }}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* HEADER                                                                     */
/* -------------------------------------------------------------------------- */

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = getLocale(pathname);
  const reducedMotion = useReducedMotion() ?? false;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scene, setScene] = useState<SceneKey>(
    getInitialScene(pathname, locale),
  );

  const activeRoute = getActiveRoute(pathname);
  const activeSection = isHomePath(pathname, locale)
    ? SCENE_TO_NAV[scene]
    : activeRoute;

  const followLabel =
    locale === "en"
      ? "Watch on YouTube"
      : "Gledaj na YouTube-u";

  useEffect(() => {
    const handleMotion = (event: Event) => {
      const detail = (
        event as CustomEvent<MotionDetail>
      ).detail;

      const scrollY =
        typeof detail?.scrollY === "number"
          ? detail.scrollY
          : window.scrollY;

      const nextScrolled = scrollY > 18;

      setScrolled((current) =>
        current === nextScrolled ? current : nextScrolled,
      );
    };

    window.addEventListener("umbra:motion", handleMotion);

    return () => {
      window.removeEventListener("umbra:motion", handleMotion);
    };
  }, []);

  useEffect(() => {
    const handleSceneChange = (event: Event) => {
      const detail = (
        event as CustomEvent<SceneChangeDetail>
      ).detail;

      if (!detail?.id) {
        return;
      }

      setScene((current) =>
        current === detail.id ? current : detail.id!,
      );
    };

    window.addEventListener("umbra:scene-change", handleSceneChange);

    return () => {
      window.removeEventListener(
        "umbra:scene-change",
        handleSceneChange,
      );
    };
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setMobileOpen(false);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [pathname, locale]);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen]);

  const pendingNavRef = useRef<{
    key: NavItemKey;
    timer: number;
  } | null>(null);

  useEffect(() => {
    return () => {
      if (pendingNavRef.current) {
        window.clearTimeout(pendingNavRef.current.timer);
      }
    };
  }, []);

  const goHomeForNavItem = (item: NavItem) => {
    const hash = getHash(item, locale);
    const home = isHomePath(pathname, locale);

    setMobileOpen(false);

    if (item.key === "latest") {
      if (home) {
        window.history.replaceState(
          null,
          "",
          locale === "en" ? "/en" : "/",
        );
        smoothScrollTo(0);
      } else {
        router.push(locale === "en" ? "/en" : "/");
      }
      return;
    }

    if (home && hash) {
      const nextScene = getSceneForNavItem(item.key);

      if (nextScene) {
        scrollToSection(hash, nextScene);
      }
      return;
    }

    const homeRoute = locale === "en" ? "/en" : "/";
    router.push(`${homeRoute}${hash ?? ""}`);
  };

  const openCategoryRoute = (item: NavItem) => {
    setMobileOpen(false);
    router.push(getRoute(item, locale));
  };

  const smoothScrollTo = (targetY: number) => {
    window.scrollTo({
      top: Math.max(0, targetY),
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  const scrollToSection = (
    hash: string,
    nextScene: SceneKey,
  ) => {
    const element = getSceneTarget(nextScene, hash);

    if (!element) {
      return;
    }

    const header = document.querySelector<HTMLElement>(
      ".umbra-site-header",
    );
    const headerHeight = header?.getBoundingClientRect().height ?? 70;

    const target =
      element.getBoundingClientRect().top +
      window.scrollY -
      headerHeight -
      12;

    setMobileOpen(false);
    window.history.replaceState(null, "", hash);
    smoothScrollTo(target);
  };

  const handleNavClick = (
    event: MouseEvent<HTMLAnchorElement>,
    item: NavItem,
  ) => {
    event.preventDefault();

    // System behavior: single click = return to the relevant scene on Home;
    // double click = enter the real category/archive route.
    // The small delay is intentional so a second click can upgrade the intent.
    if (event.detail >= 2) {
      if (pendingNavRef.current) {
        window.clearTimeout(pendingNavRef.current.timer);
        pendingNavRef.current = null;
      }

      openCategoryRoute(item);
      return;
    }

    if (event.detail === 0) {
      goHomeForNavItem(item);
      return;
    }

    if (pendingNavRef.current) {
      window.clearTimeout(pendingNavRef.current.timer);
    }

    const timer = window.setTimeout(() => {
      goHomeForNavItem(item);
      pendingNavRef.current = null;
    }, 260);

    pendingNavRef.current = {
      key: item.key,
      timer,
    };
  };

  const brandHref = locale === "en" ? "/en" : "/";

  const handleBrandClick = (
    event: MouseEvent<HTMLAnchorElement>,
  ) => {
    event.preventDefault();
    setMobileOpen(false);

    if (isHomePath(pathname, locale)) {
      window.history.replaceState(null, "", brandHref);
      smoothScrollTo(0);
      return;
    }

    router.push(brandHref);
  };

  return (
    <header className="umbra-site-header">
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[500] px-3 pt-2.5 sm:px-5 sm:pt-3 lg:px-6">
        <div className="mx-auto w-full max-w-[1680px]">
          <div
            data-scrolled={scrolled ? "true" : "false"}
            className={[
              "pointer-events-auto relative overflow-hidden border",
              "transition-[background-color,border-color,box-shadow] duration-500",
              scrolled
                ? "border-[#cbb07a]/[0.20] bg-[rgba(7,6,5,.965)] shadow-[0_26px_78px_rgba(0,0,0,.52),0_2px_14px_rgba(200,168,102,.035)]"
                : "border-[#cbb07a]/[0.13] bg-[rgba(12,10,8,.91)] shadow-[0_20px_56px_rgba(0,0,0,.34),0_2px_12px_rgba(200,168,102,.02)]",
            ].join(" ")}
            style={{
              backdropFilter: "blur(24px) saturate(1.12)",
              WebkitBackdropFilter: "blur(22px) saturate(1.10)",
            }}
          >
            <ScrollProgressFrame />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-[1]"
              style={{
                background:
                  "radial-gradient(circle at 50% -105%, rgba(244,220,166,.13), transparent 44%), radial-gradient(circle at 12% 0%, rgba(200,168,102,.055), transparent 32%), linear-gradient(180deg, rgba(255,255,255,.038), transparent 28%, rgba(0,0,0,.12))",
              }}
            />

            <div className="relative z-20 grid min-h-[82px] grid-cols-[auto_1fr_auto] items-center px-4 sm:min-h-[84px] sm:px-5 lg:min-h-[86px] lg:px-7">
              <div className="flex min-w-0 items-center">
                <UmbraClock locale={locale} />

                <a
                  href={brandHref}
                  onClick={handleBrandClick}
                  aria-label={
                    locale === "en"
                      ? "Umbra Studio home"
                      : "Umbra Studio početna"
                  }
                  className="group flex min-w-0 items-center outline-none focus-visible:ring-1 focus-visible:ring-[#f0d9a2]/55"
                >
                  <span className="relative block h-[38px] w-[38px] shrink-0 overflow-hidden rounded-full border border-[#c9a96e]/[0.22] bg-[#080807]/[0.88] shadow-[0_0_0_1px_rgba(255,255,255,.035),0_10px_30px_rgba(0,0,0,.38)] sm:h-10 sm:w-10">
                    <Image
                      src="/umbra-avatar.png"
                      alt="Umbra Studio"
                      fill
                      priority
                      sizes="40px"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-[2px] rounded-full border border-white/[0.04]"
                    />
                  </span>

                  <span className="ml-3 hidden min-w-0 lg:block">
                    <span className="block truncate text-[11px] font-semibold uppercase tracking-[0.30em] text-[#f7f1e7]/[0.98]">
                      UMBRA STUDIO
                    </span>
                    <span className="mt-0.5 block truncate text-[6.5px] uppercase tracking-[0.28em] text-[#d9bb7d]/[0.70]">
                      {locale === "en"
                        ? "STORIES THAT LEAVE A SHADOW"
                        : "PRIČE KOJE OSTAVLJAJU SENKU"}
                    </span>
                  </span>
                </a>
              </div>

              <nav
                aria-label={
                  locale === "en"
                    ? "Main navigation"
                    : "Glavna navigacija"
                }
                className="hidden items-center justify-self-center lg:flex lg:gap-1.5"
              >
                {NAVIGATION.map((item) => {
                  const hash = getHash(item, locale);

                  return (
                    <DesktopNavItem
                      key={item.key}
                      item={item}
                      label={
                        locale === "en" ? item.en : item.sr
                      }
                      href={homeTarget(locale, hash, item)}
                      active={activeSection === item.key}
                      onClick={handleNavClick}
                    />
                  );
                })}
              </nav>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="hidden items-center lg:flex">
                  <SocialLink href={TIKTOK_URL} label="TikTok">
                    <TikTokIcon />
                  </SocialLink>
                  <SocialLink href={YOUTUBE_URL} label="YouTube">
                    <YoutubeIcon />
                  </SocialLink>
                </div>

                <div className="hidden md:block">
                  <LanguageSwitcher />
                </div>

                <a
                  href={YOUTUBE_SUBSCRIBE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={followLabel}
                  className="group relative hidden h-9 items-center gap-2 rounded-sm border border-[#d6ba7b]/[0.22] bg-[#f0d9a2]/[0.025] px-3 text-[7.5px] font-semibold uppercase tracking-[0.18em] text-[#f3eee5]/[0.78] transition-[border-color,background-color,color,transform] duration-300 hover:border-[#f0d9a2]/[0.68] hover:bg-[#f0d9a2]/[0.07] hover:text-[#fffaf1] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#f0d9a2]/55 lg:flex"
                >
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full bg-[#c7a96b]"
                    style={{
                      boxShadow: `0 0 7px ${GOLD}45`,
                    }}
                  />
                  <span>{followLabel}</span>
                  <span className="text-[#ead39a]">
                    <ArrowUpRight size={10} />
                  </span>
                </a>

                <button
                  type="button"
                  aria-label={
                    mobileOpen
                      ? locale === "en"
                        ? "Close menu"
                        : "Zatvori meni"
                      : locale === "en"
                        ? "Open menu"
                        : "Otvori meni"
                  }
                  aria-expanded={mobileOpen}
                  aria-controls="umbra-mobile-menu"
                  onClick={() =>
                    setMobileOpen((value) => !value)
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-sm border border-[#d6ba7b]/[0.13] bg-white/[0.012] text-white/[0.48] shadow-[inset_0_1px_0_rgba(255,255,255,.025)] transition-[border-color,color,background-color] duration-300 hover:border-[#c9a96e]/[0.48] hover:bg-[#c9a96e]/[0.05] hover:text-[#f0d9a2] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#f0d9a2]/55 lg:hidden"
                >
                  {mobileOpen ? <CloseIcon /> : <MenuIcon />}
                </button>
              </div>
            </div>

            <div
              id="umbra-mobile-menu"
              aria-hidden={!mobileOpen}
              inert={!mobileOpen}
              className={[
                "grid overflow-hidden border-t border-white/[0.05] bg-[rgba(4,4,4,.97)] lg:hidden",
                "transition-[grid-template-rows,opacity] duration-250",
                mobileOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "pointer-events-none grid-rows-[0fr] opacity-0",
              ].join(" ")}
              style={{
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(18px)",
              }}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="px-4 pb-4 pt-1.5 sm:px-5">
                  <nav
                    aria-label={
                      locale === "en"
                        ? "Mobile navigation"
                        : "Mobilna navigacija"
                    }
                  >
                    {NAVIGATION.map((item) => {
                      const hash = getHash(item, locale);
                      const active =
                        activeSection === item.key;

                      return (
                        <a
                          key={item.key}
                          href={homeTarget(locale, hash, item)}
                          onClick={(event) =>
                            handleNavClick(event, item)
                          }
                          aria-current={
                            active ? "page" : undefined
                          }
                          className={[
                            "group flex items-center justify-between border-b border-white/[0.05] py-3.5",
                            "text-[9.5px] font-medium uppercase tracking-[0.20em]",
                            active
                              ? "text-[#f7f2e8]"
                              : "text-white/[0.42] hover:text-white/[0.80]",
                          ].join(" ")}
                        >
                          <span>
                            {locale === "en"
                              ? item.en
                              : item.sr}
                          </span>
                          <span
                            className={
                              active
                                ? "text-[#ead39a]"
                                : "text-white/[0.16]"
                            }
                          >
                            <ArrowUpRight size={12} />
                          </span>
                        </a>
                      );
                    })}
                  </nav>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <SocialLink
                        href={TIKTOK_URL}
                        label="TikTok"
                      >
                        <TikTokIcon />
                      </SocialLink>
                      <SocialLink
                        href={YOUTUBE_URL}
                        label="YouTube"
                      >
                        <YoutubeIcon />
                      </SocialLink>
                    </div>

                    <LanguageSwitcher />
                  </div>

                  <a
                    href={YOUTUBE_SUBSCRIBE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={followLabel}
                    className="mt-3 flex h-9 items-center justify-center gap-2 border border-[#c7a96b]/[0.30] text-[7px] font-semibold uppercase tracking-[0.16em] text-white/[0.78] transition-[border-color,background-color,color] duration-300 hover:border-[#ead39a]/[0.62] hover:bg-white/[0.016] hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#f0d9a2]/55"
                  >
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full bg-[#c7a96b]"
                    />
                    <span>{followLabel}</span>
                    <ArrowUpRight size={11} />
                  </a>

                  <div className="mt-4 border-t border-white/[0.05] pt-3">
                    <UmbraClock
                      locale={locale}
                      mobile
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
