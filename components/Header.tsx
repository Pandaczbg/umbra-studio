"use client";

import Image from "next/image";
import {
  memo,
  useCallback,
  useEffect,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import {
  usePathname,
  useRouter,
} from "next/navigation";
import {
  motion,
  useReducedMotion,
} from "framer-motion";

import LanguageSwitcher from "@/components/LanguageSwitcher";

import {
  type Locale,
  getTranslations,
} from "@/data/translations";

/* ==========================================================================
   UMBRA STUDIO
   HEADER
   V5 FINAL SYSTEM

   Premium / Cinematic / Editorial / Quiet Motion

   SYSTEM CONTRACT
   --------------------------------------------------------------------------
   Header is an interface consumer, not an independent motion engine.

   Source of truth
   --------------------------------------------------------------------------
   - UmbraMotionSystem  -> "umbra:motion"
   - UmbraSceneDirector -> "umbra:scene-change"
   - URL pathname        -> route / locale truth

   Header owns
   --------------------------------------------------------------------------
   - navigation UI
   - mobile menu state
   - local clock
   - navigation intent
   - route-aware active state

   Header does NOT own
   --------------------------------------------------------------------------
   - native scroll tracking
   - scene calculation
   - independent scroll animation loop
   - scrollbar geometry
   - page atmosphere

   V5 scene contract
   --------------------------------------------------------------------------
   Homepage:
   hero / project / characters / studio / watch

   Deep routes:
   projects-archive / project-detail
   characters-archive / character-dossier

   Deep-route scenes resolve to the corresponding global navigation item.
   ========================================================================== */

const GOLD = "#c7a96b";
const GOLD_LIGHT = "#ead39a";

const INSTAGRAM_URL =
  "https://www.instagram.com/umbrastud";

const YOUTUBE_URL =
  "https://www.youtube.com/@umbrastud";

const TIKTOK_URL =
  "https://www.tiktok.com/@umbrastud";

const YOUTUBE_SUBSCRIBE_URL =
  "https://www.youtube.com/@umbrastud?sub_confirmation=1";

type NavItemKey =
  | "home"
  | "projects"
  | "characters"
  | "studio";

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

type MotionDirection =
  | "up"
  | "down"
  | "idle";

type MotionDetail = {
  scrollY?: number;
  progress?: number;
  speed?: number;
  direction?: MotionDirection;
};

type SceneChangeDetail = {
  id?: SceneKey;
  direction?: MotionDirection;
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

/* ==========================================================================
   NAVIGATION
   ========================================================================== */

const NAVIGATION: NavItem[] = [
  {
    key: "home",
    sr: "Početna",
    en: "Home",
    srRoute: "/",
    enRoute: "/en",
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

const SCENE_TO_NAV: Record<
  SceneKey,
  NavItemKey
> = {
  hero: "home",
  project: "projects",
  characters: "characters",
  studio: "studio",
  watch: "studio",
  "projects-archive": "projects",
  "project-detail": "projects",
  "characters-archive": "characters",
  "character-dossier": "characters",
};

/* ==========================================================================
   HELPERS
   ========================================================================== */

function getLocale(
  pathname: string,
): Locale {
  return pathname === "/en" ||
    pathname.startsWith("/en/")
    ? "en"
    : "sr";
}

function isHomePath(
  pathname: string,
  locale: Locale,
): boolean {
  return locale === "en"
    ? pathname === "/en"
    : pathname === "/";
}

function getActiveRoute(
  pathname: string,
): NavItemKey {
  if (
    pathname === "/" ||
    pathname === "/en"
  ) {
    return "home";
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

function getRoute(
  item: NavItem,
  locale: Locale,
): string {
  return locale === "en"
    ? item.enRoute
    : item.srRoute;
}

function getHash(
  item: NavItem,
  locale: Locale,
): string | undefined {
  return locale === "en"
    ? item.enHash
    : item.srHash;
}

function getSceneTarget(
  scene: SceneKey,
  hash?: string,
): HTMLElement | null {
  const sceneElement =
    document.querySelector<HTMLElement>(
      `[data-umbra-scene="${scene}"]`,
    );

  if (sceneElement) {
    return sceneElement;
  }

  if (hash) {
    return document.getElementById(
      hash.replace(/^#/, ""),
    );
  }

  return null;
}

function getSceneForNavItem(
  item: NavItemKey,
): SceneKey | null {
  switch (item) {
    case "home":
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
  pathname: string,
  locale: Locale,
  hash: string | undefined,
  item: NavItem,
): string {
  if (
    isHomePath(
      pathname,
      locale,
    )
  ) {
    if (item.key === "home") {
      return locale === "en"
        ? "/en"
        : "/";
    }

    if (hash) {
      return hash;
    }
  }

  return getRoute(
    item,
    locale,
  );
}

function getViewerLocation(): string {
  if (
    typeof window === "undefined"
  ) {
    return "LOCAL";
  }

  const timezone =
    Intl.DateTimeFormat()
      .resolvedOptions()
      .timeZone;

  const timezoneMap: Record<
    string,
    string
  > = {
    "Europe/Vienna":
      "VIENNA / AT",
    "Europe/Belgrade":
      "BELGRADE / RS",
    "Europe/Budapest":
      "BUDAPEST / HU",
    "Europe/Berlin":
      "BERLIN / DE",
    "Europe/Prague":
      "PRAGUE / CZ",
    "Europe/Bratislava":
      "BRATISLAVA / SK",
    "Europe/Ljubljana":
      "LJUBLJANA / SI",
    "Europe/Zagreb":
      "ZAGREB / HR",
    "Europe/Sarajevo":
      "SARAJEVO / BA",
    "Europe/Paris":
      "PARIS / FR",
    "Europe/Rome":
      "ROME / IT",
    "Europe/London":
      "LONDON / UK",
    "Europe/Amsterdam":
      "AMSTERDAM / NL",
    "Europe/Brussels":
      "BRUSSELS / BE",
    "Europe/Madrid":
      "MADRID / ES",
    "Europe/Lisbon":
      "LISBON / PT",
    "Europe/Stockholm":
      "STOCKHOLM / SE",
    "Europe/Oslo":
      "OSLO / NO",
    "Europe/Copenhagen":
      "COPENHAGEN / DK",
    "Europe/Warsaw":
      "WARSAW / PL",
    "Europe/Bucharest":
      "BUCHAREST / RO",
    "Europe/Athens":
      "ATHENS / GR",
    "America/New_York":
      "NEW YORK / US",
    "America/Chicago":
      "CHICAGO / US",
    "America/Denver":
      "DENVER / US",
    "America/Los_Angeles":
      "LOS ANGELES / US",
    "America/Toronto":
      "TORONTO / CA",
    "America/Vancouver":
      "VANCOUVER / CA",
    "Asia/Tokyo":
      "TOKYO / JP",
    "Asia/Seoul":
      "SEOUL / KR",
    "Asia/Singapore":
      "SINGAPORE / SG",
    "Asia/Dubai":
      "DUBAI / AE",
    "Asia/Kolkata":
      "DELHI / IN",
    "Australia/Sydney":
      "SYDNEY / AU",
  };

  return (
    timezoneMap[timezone] ??
    timezone
      .replace(
        /^(Europe|America|Asia|Australia)\//,
        "",
      )
      .replace(
        /_/g,
        " / ",
      )
      .toUpperCase()
  );
}

/* ==========================================================================
   ICONS
   ========================================================================== */

function ArrowUpRight({
  size = 14,
}: {
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}

function InstagramIcon() {
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
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
      />
      <circle
        cx="12"
        cy="12"
        r="4"
      />
      <circle
        cx="17.5"
        cy="6.5"
        r=".8"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect
        x="2.5"
        y="5.5"
        width="19"
        height="13"
        rx="4"
      />
      <path
        d="m10 9 5 3-5 3V9Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg
      width="14"
      height="14"
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
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
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
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </svg>
  );
}

function YoutubeMark() {
  return (
    <span
      aria-hidden="true"
      className="flex h-4 w-4 items-center justify-center rounded-[3px] border border-current"
    >
      <span className="ml-px block h-0 w-0 border-y-[3px] border-l-[5px] border-y-transparent border-l-current" />
    </span>
  );
}

/* ==========================================================================
   CLOCK
   ========================================================================== */

const UmbraClock = memo(
  function UmbraClock({
    locale,
    mobile = false,
  }: {
    locale: Locale;
    mobile?: boolean;
  }) {
    const reducedMotion =
      useReducedMotion() ?? false;

    const [time, setTime] =
      useState("--:--");

    const [date, setDate] =
      useState("-- ---");

    const [location, setLocation] =
      useState("LOCAL");

    const [secondPulse, setSecondPulse] =
      useState(false);

    useEffect(() => {
      const formatterLocale =
        locale === "en"
          ? "en-GB"
          : "sr-Latn-RS";

      const timeFormatter =
        new Intl.DateTimeFormat(
          formatterLocale,
          {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          },
        );

      const dateFormatter =
        new Intl.DateTimeFormat(
          formatterLocale,
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          },
        );

      const locationTimer =
        window.setTimeout(() => {
          setLocation(
            getViewerLocation(),
          );
        }, 0);

      let pulseTimer:
        | number
        | null = null;

      const updateClock = () => {
        const now =
          new Date();

        setTime(
          timeFormatter.format(now),
        );

        setDate(
          dateFormatter
            .format(now)
            .replace(
              /\./g,
              "",
            )
            .toUpperCase(),
        );

        setSecondPulse(true);

        if (
          pulseTimer !==
          null
        ) {
          window.clearTimeout(
            pulseTimer,
          );
        }

        pulseTimer =
          window.setTimeout(() => {
            setSecondPulse(false);
            pulseTimer = null;
          }, 180);
      };

      updateClock();

      const timer =
        window.setInterval(
          updateClock,
          1000,
        );

      return () => {
        window.clearInterval(
          timer,
        );

        window.clearTimeout(
          locationTimer,
        );

        if (
          pulseTimer !==
          null
        ) {
          window.clearTimeout(
            pulseTimer,
          );
        }
      };
    }, [locale]);

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
        <div className="relative flex min-w-[184px] items-start">
          <div className="relative mr-3 mt-[5px] flex h-7 w-[7px] items-start justify-center">
            <motion.span
              aria-hidden="true"
              animate={
                reducedMotion
                  ? {
                      opacity: 0.85,
                    }
                  : {
                      opacity:
                        secondPulse
                          ? [0.5, 1]
                          : 0.75,
                    }
              }
              transition={{
                duration:
                  reducedMotion
                    ? 0
                    : 0.18,
                ease: "easeOut",
              }}
              className="block h-[5px] w-[5px] rounded-full"
              style={{
                background:
                  GOLD_LIGHT,
                boxShadow:
                  `0 0 8px ${GOLD_LIGHT}54`,
              }}
            />

            <span
              aria-hidden="true"
              className="absolute left-1/2 top-[10px] h-[20px] w-px -translate-x-1/2"
              style={{
                background: `linear-gradient(
                  180deg,
                  ${GOLD}42,
                  transparent
                )`,
              }}
            />
          </div>

          <div className="flex min-w-0 flex-col leading-none">
            <div className="flex items-center gap-2">
              <span
                className="font-mono text-[7px] font-medium uppercase tracking-[0.28em]"
                style={{
                  color:
                    `${GOLD_LIGHT}88`,
                }}
              >
                {locale === "en"
                  ? "LOCAL TIME"
                  : "LOKALNO VREME"}
              </span>

              <span
                aria-hidden="true"
                className="h-px w-5"
                style={{
                  background: `linear-gradient(
                    90deg,
                    ${GOLD}32,
                    transparent
                  )`,
                }}
              />
            </div>

            <motion.span
              animate={
                reducedMotion
                  ? undefined
                  : {
                      opacity:
                        secondPulse
                          ? 0.78
                          : 1,
                    }
              }
              transition={{
                duration: 0.16,
              }}
              className="mt-[5px] block font-mono text-[18px] font-semibold leading-none tracking-[0.11em]"
              style={{
                color:
                  `${GOLD_LIGHT}e6`,
              }}
            >
              {time}
            </motion.span>

            <span className="mt-[6px] font-mono text-[7px] uppercase tracking-[0.24em] text-white/[0.68]">
              {date}
            </span>

            <span className="mt-[5px] font-mono text-[7px] uppercase tracking-[0.15em] text-white/[0.68]">
              {location}
            </span>
          </div>
        </div>

        <span
          aria-hidden="true"
          className={
            mobile
              ? "hidden"
              : "ml-4 h-10 w-px"
          }
          style={{
            background: `linear-gradient(
              180deg,
              transparent,
              ${GOLD}30,
              ${GOLD_LIGHT}18,
              transparent
            )`,
          }}
        />
      </div>
    );
  },
);

/* ==========================================================================
   SOCIAL LINK
   ========================================================================== */

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
      className="group relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/[0.10] bg-white/[0.012] text-white/[0.52] transition-[border-color,background-color,color,transform] duration-300 hover:-translate-y-px hover:border-[#ead39a]/[0.28] hover:bg-white/[0.025] hover:text-[#ead39a] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/50"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(
            circle at 50% 0%,
            ${GOLD_LIGHT}10,
            transparent 68%
          )`,
        }}
      />

      <span className="relative z-10">
        {children}
      </span>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 transition-[width] duration-300 group-hover:w-4"
        style={{
          background:
            GOLD_LIGHT,
        }}
      />
    </a>
  );
}

/* ==========================================================================
   DESKTOP NAV
   ========================================================================== */

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
    event: MouseEvent<
      HTMLAnchorElement
    >,
    item: NavItem,
  ) => void;
}) {
  return (
    <a
      href={href}
      onClick={(event) =>
        onClick(
          event,
          item,
        )
      }
      aria-current={
        active
          ? "page"
          : undefined
      }
      className={[
        "group relative flex h-12 items-center justify-center px-5",
        "text-[10px] font-medium uppercase tracking-[0.24em]",
        "outline-none transition-colors duration-300",
        active
          ? "text-[#fbf8f0]"
          : "text-white/[0.58] hover:text-white/[0.92]",
      ].join(" ")}
    >
      <span
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-x-3 bottom-1 h-px origin-center",
          "bg-gradient-to-r from-transparent via-[#ead39a]/75 to-transparent",
          "transition-[transform,opacity] duration-300",
          active
            ? "scale-x-100 opacity-100"
            : "scale-x-0 opacity-0 group-hover:scale-x-[0.72] group-hover:opacity-70",
        ].join(" ")}
      />

      <span
        aria-hidden="true"
        className={[
          "pointer-events-none absolute bottom-[3px] left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full",
          "transition-[transform,opacity] duration-300",
          active
            ? "scale-100 opacity-100"
            : "scale-50 opacity-0",
        ].join(" ")}
        style={{
          background:
            GOLD_LIGHT,
          boxShadow:
            `0 0 7px ${GOLD_LIGHT}55`,
        }}
      />

      <span className="relative z-10 transition-transform duration-300 group-hover:-translate-y-px">
        {label}
      </span>
    </a>
  );
}

/* ==========================================================================
   SUBSCRIBE
   ========================================================================== */

function DesktopSubscribe({
  label,
}: {
  label: string;
}) {
  return (
    <a
      href={YOUTUBE_SUBSCRIBE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group relative flex h-11 items-center gap-3 overflow-hidden border border-[#c7a96b72] bg-[#c7a96b]/[0.025] px-5 text-[9px] font-semibold uppercase tracking-[0.20em] text-[#f7f2e8] transition-[border-color,background-color,transform] duration-300 hover:-translate-y-px hover:border-[#ead39a]/[0.88] hover:bg-[#c7a96b]/[0.06] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-[-50%] left-0 w-[22%] -translate-x-[170%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-[#ead39a]/[0.22] to-transparent opacity-0 transition-[transform,opacity] duration-700 ease-out group-hover:translate-x-[620%] group-hover:opacity-100"
      />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ead39a]/[0.5] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <span
        aria-hidden="true"
        className="relative z-10 h-1.5 w-1.5 rounded-full"
        style={{
          background:
            GOLD,
          boxShadow:
            `0 0 7px ${GOLD}55`,
        }}
      />

      <span className="relative z-10">
        {label}
      </span>

      <span className="relative z-10 text-[#ead39a] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
        <ArrowUpRight size={12} />
      </span>
    </a>
  );
}

/* ==========================================================================
   MOBILE NAV
   ========================================================================== */

function MobileNavItem({
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
    event: MouseEvent<
      HTMLAnchorElement
    >,
    item: NavItem,
  ) => void;
}) {
  return (
    <a
      href={href}
      onClick={(event) =>
        onClick(
          event,
          item,
        )
      }
      aria-current={
        active
          ? "page"
          : undefined
      }
      className={[
        "group flex items-center justify-between",
        "border-b border-white/[0.06] py-4",
        "text-[10px] font-medium uppercase tracking-[0.23em]",
        "transition-colors duration-300",
        active
          ? "text-[#f4f1ea]"
          : "text-white/[0.46] hover:text-white/[0.84]",
      ].join(" ")}
    >
      <span>
        {label}
      </span>

      <span
        className="transition-[transform,color] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        style={{
          color: active
            ? GOLD_LIGHT
            : "rgba(255,255,255,.24)",
        }}
      >
        <ArrowUpRight size={13} />
      </span>
    </a>
  );
}

/* ==========================================================================
   PROGRESS FRAME
   ========================================================================== */

function ScrollProgressFrame() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[40]"
    >
      <span
        className="absolute left-0 right-0 top-0 h-px"
        style={{
          background:
            `${GOLD}24`,
        }}
      />

      <span
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            `${GOLD}20`,
        }}
      />

      <span
        className="absolute bottom-0 left-0 top-0 w-px"
        style={{
          background:
            `${GOLD}20`,
        }}
      />

      <span
        className="absolute bottom-0 right-0 top-0 w-px"
        style={{
          background:
            `${GOLD}24`,
        }}
      />

      <span
        className="absolute left-0 top-0 h-px w-full origin-left"
        style={{
          transform:
            "scaleX(clamp(0, calc(var(--umbra-scroll-progress) / 0.25), 1))",
          background:
            `linear-gradient(
              90deg,
              ${GOLD_LIGHT},
              ${GOLD}
            )`,
        }}
      />

      <span
        className="absolute right-0 top-0 h-full w-px origin-top"
        style={{
          transform:
            "scaleY(clamp(0, calc((var(--umbra-scroll-progress) - 0.25) / 0.25), 1))",
          background:
            `linear-gradient(
              180deg,
              ${GOLD_LIGHT},
              ${GOLD}
            )`,
        }}
      />

      <span
        className="absolute bottom-0 right-0 h-px w-full origin-right"
        style={{
          transform:
            "scaleX(clamp(0, calc((var(--umbra-scroll-progress) - 0.5) / 0.25), 1))",
          background:
            `linear-gradient(
              270deg,
              ${GOLD_LIGHT},
              ${GOLD}
            )`,
        }}
      />

      <span
        className="absolute bottom-0 left-0 h-full w-px origin-bottom"
        style={{
          transform:
            "scaleY(clamp(0, calc((var(--umbra-scroll-progress) - 0.75) / 0.25), 1))",
          background:
            `linear-gradient(
              0deg,
              ${GOLD_LIGHT},
              ${GOLD}
            )`,
        }}
      />
    </div>
  );
}

/* ==========================================================================
   HEADER
   ========================================================================== */

export default function Header() {
  const pathname =
    usePathname();

  const router =
    useRouter();

  const locale =
    getLocale(pathname);

  const reducedMotion =
    useReducedMotion() ?? false;

  const translations =
    getTranslations(locale);

  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false);

  const [
    scrolled,
    setScrolled,
  ] = useState(false);

  const [
    scene,
    setScene,
  ] = useState<SceneKey>(
    getInitialScene(
      pathname,
      locale,
    ),
  );

  const activeRoute =
    getActiveRoute(pathname);

  const activeSection =
    isHomePath(
      pathname,
      locale,
    )
      ? SCENE_TO_NAV[scene]
      : activeRoute;

  /* ------------------------------------------------------------------------
     GLOBAL MOTION
     ------------------------------------------------------------------------ */

  useEffect(() => {
    const handleMotion =
      (event: Event) => {
        const detail =
          (
            event as CustomEvent<MotionDetail>
          ).detail;

        const scrollY =
          typeof detail?.scrollY ===
          "number"
            ? detail.scrollY
            : window.scrollY;

        const nextScrolled =
          scrollY > 24;

        setScrolled(
          (current) =>
            current ===
            nextScrolled
              ? current
              : nextScrolled,
        );
      };

    window.addEventListener(
      "umbra:motion",
      handleMotion,
    );

    return () => {
      window.removeEventListener(
        "umbra:motion",
        handleMotion,
      );
    };
  }, []);

  /* ------------------------------------------------------------------------
     GLOBAL SCENE SYNC
     ------------------------------------------------------------------------ */

  useEffect(() => {
    const onSceneChange =
      (event: Event) => {
        const detail =
          (
            event as CustomEvent<SceneChangeDetail>
          ).detail;

        if (
          !detail?.id
        ) {
          return;
        }

        setScene(
          (current) =>
            current ===
            detail.id
              ? current
              : detail.id!,
        );
      };

    window.addEventListener(
      "umbra:scene-change",
      onSceneChange,
    );

    return () => {
      window.removeEventListener(
        "umbra:scene-change",
        onSceneChange,
      );
    };
  }, []);

  /* ------------------------------------------------------------------------
     ROUTE RESET
     ------------------------------------------------------------------------ */

  useEffect(() => {
    const frame =
      window.requestAnimationFrame(
        () => {
          setMobileOpen(false);
        },
      );

    return () => {
      window.cancelAnimationFrame(
        frame,
      );
    };
  }, [
    pathname,
    locale,
  ]);

  /* ------------------------------------------------------------------------
     MOBILE BODY LOCK
     ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    const onKeyDown =
      (
        event: KeyboardEvent,
      ) => {
        if (
          event.key ===
          "Escape"
        ) {
          setMobileOpen(false);
        }
      };

    window.addEventListener(
      "keydown",
      onKeyDown,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        onKeyDown,
      );
    };
  }, [mobileOpen]);

  /* ------------------------------------------------------------------------
     PROGRAMMATIC SCROLL
     ------------------------------------------------------------------------ */

  const smoothScrollTo =
    useCallback(
      (targetY: number) => {
        const safeTarget =
          Math.max(
            0,
            targetY,
          );

        window.scrollTo({
          top: safeTarget,
          behavior:
            reducedMotion
              ? "auto"
              : "smooth",
        });
      },
      [reducedMotion],
    );

  /* ------------------------------------------------------------------------
     SECTION SCROLL
     ------------------------------------------------------------------------ */

  const scrollToSection =
    useCallback(
      (
        hash: string,
        nextScene: SceneKey,
      ) => {
        const element =
          getSceneTarget(
            nextScene,
            hash,
          );

        if (!element) {
          return;
        }

        const header =
          document.querySelector<HTMLElement>(
            ".umbra-site-header",
          );

        const headerHeight =
          header?.getBoundingClientRect()
            .height ?? 80;

        const target =
          element.getBoundingClientRect()
            .top +
          window.scrollY -
          headerHeight -
          18;

        setMobileOpen(false);

        window.history.replaceState(
          null,
          "",
          hash,
        );

        smoothScrollTo(
          Math.max(
            0,
            target,
          ),
        );
      },
      [
        setMobileOpen,
        smoothScrollTo,
      ],
    );

  /* ------------------------------------------------------------------------
     NAVIGATION
     ------------------------------------------------------------------------ */

  const handleNavClick =
    useCallback(
      (
        event: MouseEvent<
          HTMLAnchorElement
        >,
        item: NavItem,
      ) => {
        const home =
          isHomePath(
            pathname,
            locale,
          );

        const hash =
          getHash(
            item,
            locale,
          );

        const route =
          getRoute(
            item,
            locale,
          );

        if (
          item.key ===
          "home"
        ) {
          event.preventDefault();

          setMobileOpen(false);

          if (home) {
            window.history.replaceState(
              null,
              "",
              locale === "en"
                ? "/en"
                : "/",
            );

            smoothScrollTo(0);
            return;
          }

          router.push(
            locale === "en"
              ? "/en"
              : "/",
          );

          return;
        }

        if (
          home &&
          hash
        ) {
          event.preventDefault();

          const nextScene =
            getSceneForNavItem(
              item.key,
            );

          if (!nextScene) {
            return;
          }

          scrollToSection(
            hash,
            nextScene,
          );

          return;
        }

        event.preventDefault();

        setMobileOpen(false);

        router.push(route);
      },
      [
        pathname,
        locale,
        router,
        scrollToSection,
        setMobileOpen,
        smoothScrollTo,
      ],
    );

  /* ------------------------------------------------------------------------
     BRAND
     ------------------------------------------------------------------------ */

  const brandHref =
    locale === "en"
      ? "/en"
      : "/";

  const handleBrandClick =
    (
      event: MouseEvent<
        HTMLAnchorElement
      >,
    ) => {
      event.preventDefault();

      setMobileOpen(false);

      if (
        isHomePath(
          pathname,
          locale,
        )
      ) {
        window.history.replaceState(
          null,
          "",
          brandHref,
        );

        smoothScrollTo(0);
        return;
      }

      router.push(brandHref);
    };

  /* ------------------------------------------------------------------------
     RENDER
     ------------------------------------------------------------------------ */

  return (
    <header className="umbra-site-header">
      <div className="umbra-site-header__hit-area pointer-events-none fixed inset-x-0 top-0 z-[500] px-3 pt-3 sm:px-5 sm:pt-4 lg:px-7">
        <div className="mx-auto w-full max-w-[1560px]">
          <div
            data-scrolled={
              scrolled
                ? "true"
                : "false"
            }
            className={[
              "pointer-events-auto relative overflow-hidden border",
              "border-white/[0.12]",
              "transition-[background-color,box-shadow] duration-500",
              scrolled
                ? "bg-[#050505]/98 shadow-[0_24px_70px_rgba(0,0,0,.48)]"
                : "bg-[#060606]/96 shadow-[0_18px_55px_rgba(0,0,0,.30)]",
            ].join(" ")}
          >
            <ScrollProgressFrame />

            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-px"
              style={{
                background: `linear-gradient(
                  90deg,
                  transparent,
                  ${GOLD}42,
                  ${GOLD_LIGHT}22,
                  ${GOLD}42,
                  transparent
                )`,
              }}
            />

            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-px"
              style={{
                background: `linear-gradient(
                  90deg,
                  transparent,
                  rgba(255,255,255,.04) 25%,
                  ${GOLD}15 50%,
                  rgba(255,255,255,.04) 75%,
                  transparent
                )`,
              }}
            />

            <div className="relative z-10 grid min-h-[72px] grid-cols-[auto_1fr_auto] items-center px-3.5 sm:min-h-[76px] sm:px-5.5 lg:px-6">
              <div className="flex min-w-0 items-center">
                <UmbraClock
                  locale={locale}
                />

                <a
                  href={brandHref}
                  onClick={
                    handleBrandClick
                  }
                  aria-label={
                    locale === "en"
                      ? "Umbra Studio home"
                      : "Umbra Studio početna"
                  }
                  className="group flex min-w-0 items-center outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
                >
                  <span className="relative block h-11 w-11 shrink-0 overflow-hidden border border-white/[0.14] bg-black/55 shadow-[0_8px_24px_rgba(0,0,0,.22)] sm:h-12 sm:w-12">
                    <Image
                      src="/umbra-avatar.png"
                      alt="Umbra Studio"
                      fill
                      priority
                      sizes="48px"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />

                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.3]"
                    />

                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-[7px] bottom-0 h-px origin-center scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                      style={{
                        background:
                          GOLD_LIGHT,
                      }}
                    />
                  </span>

                  <span className="ml-4 hidden min-w-0 lg:block">
                    <span className="block truncate text-[11px] font-semibold uppercase tracking-[0.32em] text-white/[0.90] transition-colors duration-300 group-hover:text-white">
                      UMBRA STUDIO
                    </span>

                    <span className="mt-1 block text-[6px] uppercase tracking-[0.24em] text-white/[0.28] transition-colors duration-300 group-hover:text-white/[0.38]">
                      STORIES THAT LEAVE A SHADOW
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
                className="hidden justify-self-center gap-1 lg:flex"
              >
                {NAVIGATION.map(
                  (item) => {
                    const hash =
                      getHash(
                        item,
                        locale,
                      );

                    return (
                      <DesktopNavItem
                        key={
                          item.key
                        }
                        item={item}
                        label={
                          locale ===
                          "en"
                            ? item.en
                            : item.sr
                        }
                        href={
                          homeTarget(
                            pathname,
                            locale,
                            hash,
                            item,
                          )
                        }
                        active={
                          activeSection ===
                          item.key
                        }
                        onClick={
                          handleNavClick
                        }
                      />
                    );
                  },
                )}
              </nav>

              <div className="flex items-center gap-2 lg:gap-2.5">
                <div className="hidden items-center gap-1 lg:flex">
                  <SocialLink
                    href={
                      INSTAGRAM_URL
                    }
                    label="Instagram"
                  >
                    <InstagramIcon />
                  </SocialLink>

                  <SocialLink
                    href={
                      YOUTUBE_URL
                    }
                    label="YouTube"
                  >
                    <YoutubeIcon />
                  </SocialLink>

                  <SocialLink
                    href={
                      TIKTOK_URL
                    }
                    label="TikTok"
                  >
                    <TikTokIcon />
                  </SocialLink>
                </div>

                <div className="hidden h-8 w-px bg-white/[0.07] lg:block" />

                <div className="hidden md:block">
                  <LanguageSwitcher />
                </div>

                <div className="hidden h-8 w-px bg-white/[0.07] lg:block" />

                <div className="hidden lg:block">
                  <DesktopSubscribe
                    label={
                      translations
                        .navigation
                        .follow
                    }
                  />
                </div>

                <button
                  type="button"
                  aria-label={
                    mobileOpen
                      ? locale ===
                        "en"
                        ? "Close menu"
                        : "Zatvori meni"
                      : locale ===
                          "en"
                        ? "Open menu"
                        : "Otvori meni"
                  }
                  aria-expanded={
                    mobileOpen
                  }
                  aria-controls="umbra-mobile-menu"
                  onClick={() =>
                    setMobileOpen(
                      (value) =>
                        !value,
                    )
                  }
                  className="flex h-10 w-10 items-center justify-center border border-white/[0.1] bg-white/[0.018] text-white/[0.65] transition-[border-color,background-color,color,transform] duration-300 hover:border-[#ead39a]/[0.25] hover:bg-white/[0.035] hover:text-[#ead39a] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55 lg:hidden"
                >
                  {mobileOpen ? (
                    <CloseIcon />
                  ) : (
                    <MenuIcon />
                  )}
                </button>
              </div>
            </div>

            <div
              id="umbra-mobile-menu"
              aria-hidden={
                !mobileOpen
              }
              inert={
                !mobileOpen
              }
              className={[
                "grid overflow-hidden border-t border-white/[0.06] lg:hidden",
                "transition-[grid-template-rows,opacity] duration-300",
                mobileOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "pointer-events-none grid-rows-[0fr] opacity-0",
              ].join(" ")}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="px-4 pb-5 pt-2 sm:px-5">
                  <nav
                    aria-label={
                      locale ===
                      "en"
                        ? "Mobile navigation"
                        : "Mobilna navigacija"
                    }
                  >
                    {NAVIGATION.map(
                      (item) => {
                        const hash =
                          getHash(
                            item,
                            locale,
                          );

                        return (
                          <MobileNavItem
                            key={
                              item.key
                            }
                            item={
                              item
                            }
                            label={
                              locale ===
                              "en"
                                ? item.en
                                : item.sr
                            }
                            href={
                              homeTarget(
                                pathname,
                                locale,
                                hash,
                                item,
                              )
                            }
                            active={
                              activeSection ===
                              item.key
                            }
                            onClick={
                              handleNavClick
                            }
                          />
                        );
                      },
                    )}
                  </nav>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <SocialLink
                        href={
                          INSTAGRAM_URL
                        }
                        label="Instagram"
                      >
                        <InstagramIcon />
                      </SocialLink>

                      <SocialLink
                        href={
                          YOUTUBE_URL
                        }
                        label="YouTube"
                      >
                        <YoutubeIcon />
                      </SocialLink>

                      <SocialLink
                        href={
                          TIKTOK_URL
                        }
                        label="TikTok"
                      >
                        <TikTokIcon />
                      </SocialLink>
                    </div>

                    <LanguageSwitcher />
                  </div>

                  <a
                    href={
                      YOUTUBE_SUBSCRIBE_URL
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={
                      translations
                        .navigation
                        .follow
                    }
                    className="group relative mt-4 flex h-11 items-center justify-center gap-2 overflow-hidden border border-[#c7a96b55] text-[9px] font-semibold uppercase tracking-[0.22em] text-white/[0.9] transition-[border-color,background-color,color] duration-300 hover:border-[#ead39a] hover:bg-[#ead39a]/[0.035] hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-y-[-50%] left-0 w-[24%] -translate-x-[170%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-[#ead39a]/[0.18] to-transparent opacity-0 transition-[transform,opacity] duration-700 ease-out group-hover:translate-x-[520%] group-hover:opacity-100"
                    />

                    <YoutubeMark />

                    <span>
                      {
                        translations
                          .navigation
                          .follow
                      }
                    </span>

                    <span className="text-[#ead39a] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      <ArrowUpRight size={13} />
                    </span>
                  </a>

                  <div className="mt-5 border-t border-white/[0.05] pt-4">
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

/* ==========================================================================
   ROUTE SCENE
   ========================================================================== */

function getRouteScene(
  pathname: string,
  locale: Locale,
): SceneKey | null {
  const projectsArchivePath =
    locale === "en"
      ? "/en/projects"
      : "/serije";

  const projectsDetailPrefix =
    locale === "en"
      ? "/en/projects/"
      : "/serije/";

  const charactersArchivePath =
    locale === "en"
      ? "/en/characters"
      : "/likovi";

  const characterDetailPrefix =
    locale === "en"
      ? "/en/characters/"
      : "/likovi/";

  if (
    pathname ===
    projectsArchivePath
  ) {
    return "projects-archive";
  }

  if (
    pathname.startsWith(
      projectsDetailPrefix,
    )
  ) {
    return "project-detail";
  }

  if (
    pathname ===
    charactersArchivePath
  ) {
    return "characters-archive";
  }

  if (
    pathname.startsWith(
      characterDetailPrefix,
    )
  ) {
    return "character-dossier";
  }

  if (
    isHomePath(
      pathname,
      locale,
    )
  ) {
    return "hero";
  }

  return null;
}

function getInitialScene(
  pathname: string,
  locale: Locale,
): SceneKey {
  return (
    getRouteScene(
      pathname,
      locale,
    ) ?? "hero"
  );
}
