"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUp,
  ArrowUpRight,
} from "lucide-react";
import {
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  useState,
  type MouseEvent,
} from "react";

type Locale = "sr" | "en";

const GOLD =
  "#c7a96b";

const GOLD_LIGHT =
  "#ead39a";

const EASE = [
  0.22,
  1,
  0.36,
  1,
] as const;

const UPWORK_URL =
  "https://www.upwork.com/freelancers/~01add8bee84754c9ea?mp_source=share";

const YOUTUBE_URL =
  "https://www.youtube.com/@umbrastud";

const INSTAGRAM_URL =
  "https://www.instagram.com/umbrastud";

const TIKTOK_URL =
  "https://www.tiktok.com/@umbrastud";

type FooterProps = {
  locale?: Locale;
};

type NavigationItem = {
  label: string;
  href: string;
};

const NAVIGATION_SR:
  NavigationItem[] = [
  {
    label: "Početna",
    href: "/",
  },
  {
    label: "Projekti",
    href: "/serije",
  },
  {
    label: "Likovi",
    href: "/likovi",
  },
  {
    label: "Umbra",
    href: "/#o-studiju",
  },
  {
    label: "Gledaj",
    href: "/#watch",
  },
];

const NAVIGATION_EN:
  NavigationItem[] = [
  {
    label: "Home",
    href: "/en",
  },
  {
    label: "Projects",
    href: "/en/projects",
  },
  {
    label: "Characters",
    href: "/en/characters",
  },
  {
    label: "Umbra",
    href: "/en#o-studiju",
  },
  {
    label: "Watch",
    href: "/en#watch",
  },
];

const SOCIAL_LINKS = [
  {
    label: "YouTube",
    href: YOUTUBE_URL,
  },
  {
    label: "Instagram",
    href: INSTAGRAM_URL,
  },
  {
    label: "TikTok",
    href: TIKTOK_URL,
  },
] as const;

const COPY = {
  sr: {
    description:
      "Nezavisan kreativni studio za priče, vizuelne svetove i digitalni film.",

    explore: "Istraži",
    follow: "Prati",
    watch: "Gledaj na YouTube-u",

    creditLabel:
      "WEBSITE / DESIGN / DEVELOPMENT",

    creditTitle:
      "Design & development",

    creditSub:
      "Art direction · UI · development",

    creditRole:
      "Designer / Developer",

    creditAuthor:
      "Aleksandar B.",

    creditAction:
      "Pogledaj rad",

    reserved:
      "Sva prava zadržana",

    source:
      "Prava na izvorna dela i materijale trećih autora ostaju njihovim odgovarajućim nosiocima prava.",

    top:
      "Vrh",

    closingBefore:
      "Priče koje ostavljaju",

    closingAccent:
      "senku",

    studioType:
      "STORY / FILM / MOTION",

    footerIndex:
      "END / 2026",

    signal:
      "PRIČA SE NASTAVLJA",

    end:
      "Završni kadar",

    footerNote:
      "Umbra Studio — 2026",
  },

  en: {
    description:
      "An independent creative studio for stories, visual worlds and digital filmmaking.",

    explore: "Explore",
    follow: "Follow",
    watch: "Watch on YouTube",

    creditLabel:
      "WEBSITE / DESIGN / DEVELOPMENT",

    creditTitle:
      "Design & development",

    creditSub:
      "Art direction · UI · development",

    creditRole:
      "Designer / Developer",

    creditAuthor:
      "Aleksandar B.",

    creditAction:
      "View work",

    reserved:
      "All rights reserved",

    source:
      "Underlying works and third-party source materials remain with their respective rights holders.",

    top:
      "Top",

    closingBefore:
      "Stories that leave a",

    closingAccent:
      "shadow",

    studioType:
      "STORY / FILM / MOTION",

    footerIndex:
      "END / 2026",

    signal:
      "THE STORY CONTINUES",

    end:
      "Closing frame",

    footerNote:
      "Umbra Studio — 2026",
  },
} as const;

type FooterCopy =
  (typeof COPY)[keyof typeof COPY];

/* ==========================================================================
   INTERACTIVE CREDIT
   ========================================================================== */

function InteractiveCredit({
  copy,
  reducedMotion,
}: {
  copy: FooterCopy;
  reducedMotion: boolean;
}) {
  const [active, setActive] =
    useState(false);

  return (
    <a
      href={UPWORK_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${copy.creditAction}: ${copy.creditAuthor}`}
      onPointerEnter={() =>
        setActive(true)
      }
      onPointerLeave={() =>
        setActive(false)
      }
      onFocus={() =>
        setActive(true)
      }
      onBlur={() =>
        setActive(false)
      }
      className="group relative block outline-none focus-visible:outline-none"
    >
      <div className="mb-3 flex items-center justify-between">
        <span
          className="text-[6px] font-semibold uppercase tracking-[0.32em]"
          style={{
            color: `${GOLD_LIGHT}54`,
          }}
        >
          {copy.creditLabel}
        </span>

        <span className="hidden font-mono text-[5px] uppercase tracking-[0.24em] text-white/[0.07] sm:block">
          01 / CREDIT
        </span>
      </div>

      <motion.div
        className="relative overflow-hidden border-y border-white/[0.075] py-5 sm:py-6"
        animate={{
          borderColor: active
            ? "rgba(234,211,154,.18)"
            : "rgba(255,255,255,.075)",
          boxShadow:
            active && !reducedMotion
              ? `inset 0 0 0 1px ${GOLD}08, 0 0 34px ${GOLD}09`
              : "inset 0 0 0 1px transparent, 0 0 0 rgba(0,0,0,0)",
        }}
        transition={{
          duration:
            reducedMotion
              ? 0
              : 0.42,
          ease: EASE,
        }}
      >
        {!reducedMotion && (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            animate={{
              opacity:
                active ? 1 : 0,
            }}
            transition={{
              duration:
                0.38,
              ease: EASE,
            }}
            style={{
              background: `
                radial-gradient(
                  ellipse 360px 120px at 86% 50%,
                  ${GOLD}08,
                  transparent 72%
                )
              `,
            }}
          />
        )}

        {!reducedMotion && (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-[-28%] z-10 w-[18%] skew-x-[-18deg]"
            animate={
              active
                ? {
                    x: "740%",
                    opacity: [0, 0.8, 0],
                  }
                : {
                    x: "0%",
                    opacity: 0,
                  }
            }
            transition={{
              duration:
                active
                  ? 0.72
                  : 0,
              ease:
                "easeInOut",
            }}
            style={{
              background: `
                linear-gradient(
                  90deg,
                  transparent,
                  ${GOLD_LIGHT}28,
                  ${GOLD_LIGHT}05,
                  transparent
                )
              `,
              filter:
                "blur(3px)",
            }}
          />
        )}

        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 h-px origin-left"
          initial={{
            width: "0%",
            opacity: 0,
          }}
          whileInView={{
            width: "22%",
            opacity: 0.68,
          }}
          viewport={{
            once: true,
            amount: 0.4,
          }}
          transition={{
            duration:
              reducedMotion
                ? 0
                : 0.7,
            delay:
              reducedMotion
                ? 0
                : 0.08,
            ease: EASE,
          }}
          style={{
            background: `
              linear-gradient(
                90deg,
                ${GOLD_LIGHT},
                ${GOLD},
                transparent
              )
            `,
          }}
        />

        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 h-px origin-left"
          animate={{
            width:
              active
                ? "36%"
                : "0%",
            opacity:
              active
                ? 1
                : 0,
          }}
          transition={{
            duration:
              reducedMotion
                ? 0
                : 0.5,
            ease: EASE,
          }}
          style={{
            background: `
              linear-gradient(
                90deg,
                ${GOLD_LIGHT},
                ${GOLD},
                transparent
              )
            `,
          }}
        />

        {!reducedMotion && (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute right-[50px] top-1/2 z-20 h-[4px] w-[4px] -translate-y-1/2 rounded-full"
            animate={{
              opacity:
                active
                  ? [0.25, 1, 0.35]
                  : 0.12,
              scale:
                active
                  ? [0.85, 1.35, 0.9]
                  : 1,
            }}
            transition={{
              duration:
                active
                  ? 0.8
                  : 2.8,
              repeat:
                active
                  ? 0
                  : Infinity,
              ease:
                "easeInOut",
            }}
            style={{
              background:
                GOLD_LIGHT,
              boxShadow:
                `0 0 10px ${GOLD_LIGHT}80`,
            }}
          />
        )}

        <div className="relative z-20 grid items-center gap-7 lg:grid-cols-[minmax(0,1fr)_auto]">
          <motion.div
            animate={
              reducedMotion ||
              !active
                ? {
                    x: 0,
                    y: 0,
                  }
                : {
                    x: 1.5,
                    y: -0.5,
                  }
            }
            transition={{
              duration:
                reducedMotion
                  ? 0
                  : 0.38,
              ease: EASE,
            }}
          >
            <h3 className="text-[clamp(1.3rem,2.5vw,2.55rem)] font-[420] uppercase leading-[0.94] tracking-[-0.05em] text-white/[0.62] transition-colors duration-500 group-hover:text-white/[0.86] group-focus-visible:text-white/[0.86]">
              {copy.creditTitle}
            </h3>

            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <span className="text-[6px] uppercase tracking-[0.18em] text-white/[0.14]">
                {copy.creditSub}
              </span>

              <span
                aria-hidden="true"
                className="hidden h-px w-5 sm:block"
                style={{
                  background:
                    `${GOLD}25`,
                }}
              />

              <span
                className="text-[6px] uppercase tracking-[0.18em]"
                style={{
                  color:
                    `${GOLD_LIGHT}40`,
                }}
              >
                {copy.creditRole}
              </span>
            </div>
          </motion.div>

          <div className="relative flex items-center justify-end gap-4 sm:gap-5">
            <motion.div
              className="relative text-right"
              animate={
                reducedMotion ||
                !active
                  ? {
                      x: 0,
                    }
                  : {
                      x: -3,
                    }
              }
              transition={{
                duration:
                  reducedMotion
                    ? 0
                    : 0.38,
                ease: EASE,
              }}
            >
              <div className="mb-1 text-[5px] font-mono uppercase tracking-[0.3em] text-white/[0.08]">
                CREATIVE CREDIT
              </div>

              <div className="relative inline-block px-1 py-1">
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-2 -top-2 h-[6px] w-[6px] border-l border-t"
                  animate={{
                    opacity:
                      active
                        ? 1
                        : 0.3,
                    x:
                      active
                        ? 0
                        : 1,
                    y:
                      active
                        ? 0
                        : 1,
                  }}
                  transition={{
                    duration:
                      reducedMotion
                        ? 0
                        : 0.28,
                    ease: EASE,
                  }}
                  style={{
                    borderColor:
                      `${GOLD_LIGHT}88`,
                  }}
                />

                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-2 -top-2 h-[6px] w-[6px] border-r border-t"
                  animate={{
                    opacity:
                      active
                        ? 1
                        : 0.3,
                    x:
                      active
                        ? 0
                        : -1,
                    y:
                      active
                        ? 0
                        : 1,
                  }}
                  transition={{
                    duration:
                      reducedMotion
                        ? 0
                        : 0.28,
                    ease: EASE,
                  }}
                  style={{
                    borderColor:
                      `${GOLD_LIGHT}88`,
                  }}
                />

                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-2 -left-2 h-[6px] w-[6px] border-b border-l"
                  animate={{
                    opacity:
                      active
                        ? 1
                        : 0.3,
                    x:
                      active
                        ? 0
                        : 1,
                    y:
                      active
                        ? 0
                        : -1,
                  }}
                  transition={{
                    duration:
                      reducedMotion
                        ? 0
                        : 0.28,
                    ease: EASE,
                  }}
                  style={{
                    borderColor:
                      `${GOLD_LIGHT}88`,
                  }}
                />

                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-2 -right-2 h-[6px] w-[6px] border-b border-r"
                  animate={{
                    opacity:
                      active
                        ? 1
                        : 0.3,
                    x:
                      active
                        ? 0
                        : -1,
                    y:
                      active
                        ? 0
                        : -1,
                  }}
                  transition={{
                    duration:
                      reducedMotion
                        ? 0
                        : 0.28,
                    ease: EASE,
                  }}
                  style={{
                    borderColor:
                      `${GOLD_LIGHT}88`,
                  }}
                />

                <motion.span
                  className="relative z-10 inline-block text-[9px] font-medium uppercase tracking-[0.17em]"
                  animate={{
                    color:
                      active
                        ? GOLD_LIGHT
                        : "rgba(255,255,255,.38)",
                    letterSpacing:
                      active
                        ? "0.19em"
                        : "0.17em",
                  }}
                  transition={{
                    duration:
                      reducedMotion
                        ? 0
                        : 0.32,
                    ease: EASE,
                  }}
                >
                  {copy.creditAuthor}

                  <motion.span
                    aria-hidden="true"
                    className="absolute -bottom-1 left-0 h-px origin-left"
                    animate={{
                      width:
                        active
                          ? "100%"
                          : "0%",
                      opacity:
                        active
                          ? 1
                          : 0,
                    }}
                    transition={{
                      duration:
                        reducedMotion
                          ? 0
                          : 0.35,
                      ease: EASE,
                    }}
                    style={{
                      background: `
                        linear-gradient(
                          90deg,
                          ${GOLD_LIGHT},
                          transparent
                        )
                      `,
                    }}
                  />
                </motion.span>

                {!reducedMotion && (
                  <motion.span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-[22px] top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border"
                    animate={{
                      opacity:
                        active
                          ? 0.9
                          : 0.18,
                      scale:
                        active
                          ? 1.08
                          : 1,
                    }}
                    transition={{
                      duration:
                        active
                          ? 0.34
                          : 0.45,
                      ease: EASE,
                    }}
                    style={{
                      borderColor:
                        active
                          ? `${GOLD_LIGHT}70`
                          : `${GOLD}30`,
                      boxShadow:
                        active
                          ? `0 0 13px ${GOLD}20, inset 0 0 10px ${GOLD}10`
                          : "none",
                    }}
                  />
                )}

                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-[11px] top-1/2 z-30 h-[3px] w-[3px] -translate-y-1/2 rounded-full"
                  animate={{
                    opacity:
                      active
                        ? [0.25, 1, 0.35]
                        : 0.2,
                    scale:
                      active
                        ? [0.8, 1.4, 0.9]
                        : 1,
                  }}
                  transition={{
                    duration:
                      active
                        ? 0.7
                        : 2.8,
                    repeat:
                      active
                        ? 0
                        : Infinity,
                    ease:
                      "easeInOut",
                  }}
                  style={{
                    background:
                      GOLD_LIGHT,
                    boxShadow:
                      `0 0 9px ${GOLD_LIGHT}80`,
                  }}
                />
              </div>

              <div className="mt-1.5 text-[5px] uppercase tracking-[0.2em] text-white/[0.08]">
                {copy.creditRole}
              </div>
            </motion.div>

            <motion.span
              aria-hidden="true"
              className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-white/[0.2]"
              animate={{
                x:
                  active
                    ? -3
                    : 0,
                borderColor:
                  active
                    ? "rgba(234,211,154,.42)"
                    : "rgba(255,255,255,.08)",
                color:
                  active
                    ? GOLD_LIGHT
                    : "rgba(255,255,255,.2)",
                scale:
                  active
                    ? 1.06
                    : 1,
              }}
              transition={{
                duration:
                  reducedMotion
                    ? 0
                    : 0.38,
                ease: EASE,
              }}
            >
              <motion.span
                animate={{
                  rotate:
                    active
                      ? -24
                      : 0,
                  x:
                    active
                      ? -1
                      : 0,
                }}
                transition={{
                  duration:
                    reducedMotion
                      ? 0
                      : 0.36,
                  ease: EASE,
                }}
              >
                <ArrowUpRight
                  size={11}
                  strokeWidth={1}
                />
              </motion.span>

              {!reducedMotion && (
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-[-4px] rounded-full border border-transparent"
                  animate={{
                    rotate:
                      active
                        ? -60
                        : 0,
                    borderTopColor:
                      active
                        ? "rgba(234,211,154,.42)"
                        : "rgba(0,0,0,0)",
                    borderRightColor:
                      active
                        ? "rgba(234,211,154,.08)"
                        : "rgba(0,0,0,0)",
                  }}
                  transition={{
                    duration:
                      reducedMotion
                        ? 0
                        : 0.48,
                    ease: EASE,
                  }}
                />
              )}
            </motion.span>
          </div>

          {!reducedMotion && (
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute right-[47px] top-1/2 hidden h-px origin-right lg:block"
              animate={{
                width:
                  active
                    ? 72
                    : 0,
                opacity:
                  active
                    ? 0.5
                    : 0,
              }}
              transition={{
                duration:
                  0.4,
                ease: EASE,
              }}
              style={{
                background: `
                  linear-gradient(
                    270deg,
                    ${GOLD_LIGHT},
                    transparent
                  )
                `,
              }}
            />
          )}
        </div>

        {!reducedMotion && (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-[-1px] h-[2px] w-[2px] rounded-full"
            initial={{
              x: 0,
              opacity: 0,
            }}
            whileInView={{
              x: [
                "0%",
                "1800%",
                "0%",
              ],
              opacity: [
                0,
                0.75,
                0,
              ],
            }}
            viewport={{
              once: true,
              amount: 0.5,
            }}
            transition={{
              duration:
                1.8,
              delay:
                0.25,
              ease:
                "easeInOut",
            }}
            style={{
              background:
                GOLD_LIGHT,
              boxShadow:
                `0 0 8px ${GOLD_LIGHT}80`,
            }}
          />
        )}
      </motion.div>

      <div className="mt-3 flex items-center justify-between">
        <span className="font-mono text-[5px] uppercase tracking-[0.23em] text-white/[0.055]">
          UMBRA / CREATIVE DEVELOPMENT
        </span>

        <motion.span
          animate={{
            color:
              active
                ? GOLD_LIGHT
                : "rgba(234,211,154,.22)",
          }}
          transition={{
            duration:
              reducedMotion
                ? 0
                : 0.28,
          }}
          className="text-[6px] uppercase tracking-[0.21em]"
        >
          {copy.creditAction}
        </motion.span>
      </div>
    </a>
  );
}

/* ==========================================================================
   FOOTER
   ========================================================================== */

export default function Footer({
  locale = "sr",
}: FooterProps) {
  const reducedMotion =
    useReducedMotion() ?? false;

  const isEnglish =
    locale === "en";

  const navigation =
    isEnglish
      ? NAVIGATION_EN
      : NAVIGATION_SR;

  const copy =
    COPY[locale];

  const scrollToTop = (
    event: MouseEvent<HTMLAnchorElement>,
  ) => {
    event.preventDefault();

    window.scrollTo({
      top: 0,
      behavior:
        reducedMotion
          ? "auto"
          : "smooth",
    });

    window.history.replaceState(
      null,
      "",
      window.location.pathname +
        window.location.search,
    );
  };

  return (
    <footer
      id="footer"
      className="relative overflow-hidden border-t border-white/[0.07] bg-[#040404]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div
          className="absolute left-1/2 top-[-180px] h-[410px] w-[620px] -translate-x-1/2 rounded-full opacity-20"
          style={{
            background: `
              radial-gradient(
                ellipse,
                ${GOLD}07 0%,
                transparent 72%
              )
            `,
            filter:
              "blur(82px)",
          }}
        />

        <div
          className="absolute bottom-0 left-1/2 h-px w-[44vw] -translate-x-1/2"
          style={{
            background: `
              linear-gradient(
                90deg,
                transparent,
                ${GOLD}22,
                transparent
              )
            `,
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1420px] px-6 sm:px-9 lg:px-12 xl:px-16">
        <motion.section
          initial={{
            opacity: 0,
            y:
              reducedMotion
                ? 0
                : 7,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.1,
          }}
          transition={{
            duration:
              reducedMotion
                ? 0
                : 0.58,
            ease: EASE,
          }}
          className="border-b border-white/[0.07] py-14 sm:py-17 lg:py-19"
        >
          <div className="flex flex-col gap-9 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Link
                href={isEnglish ? "/en" : "/"}
                aria-label={
                  isEnglish
                    ? "Umbra Studio home"
                    : "Početna strana Umbra Studija"
                }
                className="group flex w-fit items-center gap-3 rounded-sm outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
              >
                <span
                  aria-hidden="true"
                  className="h-px w-8 transition-[width] duration-300 group-hover:w-10"
                  style={{
                    background:
                      `linear-gradient(
                        90deg,
                        transparent,
                        ${GOLD}
                      )`,
                  }}
                />

                <span
                  className="text-[7px] font-semibold uppercase tracking-[0.38em] transition-colors duration-300 group-hover:text-white/[0.9]"
                  style={{
                    color:
                      `${GOLD_LIGHT}68`,
                  }}
                >
                  UMBRA STUDIO
                </span>
              </Link>

              <Link
                href={isEnglish ? "/en" : "/"}
                aria-label={
                  isEnglish
                    ? "Return to Umbra Studio home"
                    : "Vrati se na početnu stranu Umbra Studija"
                }
                className="group block w-fit max-w-[980px] rounded-sm outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
              >
                <p className="mt-7 font-serif text-[clamp(2.3rem,4.65vw,5rem)] italic leading-[0.9] tracking-[-0.06em] text-white/[0.74] transition-[color,transform] duration-500 group-hover:-translate-y-[2px] group-hover:text-white/[0.88]">
                  {copy.closingBefore}{" "}
                  <span
                    style={{
                      color:
                        GOLD_LIGHT,
                    }}
                  >
                    {copy.closingAccent}
                  </span>
                </p>

                <span className="mt-5 inline-flex items-center gap-3 text-[7px] font-semibold uppercase tracking-[0.3em] opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                  <span style={{ color: `${GOLD_LIGHT}9a` }}>
                    {isEnglish ? "Back to Umbra" : "Nazad na Umbra"}
                  </span>

                  <ArrowUpRight
                    aria-hidden="true"
                    size={12}
                    strokeWidth={1.1}
                    style={{
                      color: `${GOLD_LIGHT}70`,
                    }}
                  />
                </span>
              </Link>

              <motion.div
                initial={{
                  scaleX: 0,
                  opacity: 0,
                }}
                whileInView={{
                  scaleX: 1,
                  opacity: 1,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration:
                    reducedMotion
                      ? 0
                      : 0.68,
                  delay:
                    reducedMotion
                      ? 0
                      : 0.05,
                  ease: EASE,
                }}
                className="mt-7 h-px w-full max-w-[540px] origin-left"
                style={{
                  background: `
                    linear-gradient(
                      90deg,
                      ${GOLD_LIGHT},
                      ${GOLD}1e,
                      transparent
                    )
                  `,
                }}
              />
            </div>

            <a
              href="#"
              onClick={scrollToTop}
              className="group flex items-center gap-3 text-[7px] uppercase tracking-[0.25em] text-white/[0.25] transition-colors duration-300 hover:text-[#ead39a] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/60"
              aria-label={copy.top}
            >
              <span>
                {copy.top}
              </span>

              <span className="flex h-8 w-8 items-center justify-center border border-white/[0.08] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-[#ead39a]/[0.22]">
                <ArrowUp
                  size={11}
                  strokeWidth={1}
                />
              </span>
            </a>
          </div>
        </motion.section>

        <section className="border-b border-white/[0.07] py-11 sm:py-13 lg:py-14">
          <div className="grid gap-12 lg:grid-cols-[1.25fr_.7fr_.7fr] lg:gap-20">
            <motion.div
              initial={{
                opacity: 0,
                y:
                  reducedMotion
                    ? 0
                    : 7,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.1,
              }}
              transition={{
                duration:
                  reducedMotion
                    ? 0
                    : 0.5,
                ease: EASE,
              }}
            >
              <Link
                href={isEnglish ? "/en" : "/"}
                aria-label={
                  isEnglish
                    ? "Umbra Studio home"
                    : "Početna strana Umbra Studija"
                }
                className="group flex w-fit items-center gap-4 rounded-sm outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
              >
                <div className="relative h-9 w-9 overflow-hidden border border-white/[0.09] bg-black transition-[border-color,transform] duration-300 group-hover:-translate-y-px group-hover:border-[#ead39a]/30">
                  <Image
                    src="/umbra-avatar.png"
                    alt="Umbra Studio"
                    fill
                    sizes="36px"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>

                <div>
                  <div className="text-[9px] uppercase tracking-[0.3em] text-white/[0.7] transition-colors duration-300 group-hover:text-white/[0.9]">
                    UMBRA STUDIO
                  </div>

                  <div
                    className="mt-1 text-[6px] uppercase tracking-[0.22em]"
                    style={{
                      color:
                        `${GOLD_LIGHT}4e`,
                    }}
                  >
                    {copy.studioType}
                  </div>
                </div>
              </Link>

              <p className="mt-6 max-w-[470px] text-[12px] leading-6 text-white/[0.33] sm:text-[13px]">
                {copy.description}
              </p>

              <a
                href={YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-5 inline-flex items-center gap-3 text-[7px] uppercase tracking-[0.22em] text-white/[0.28] transition-colors duration-300 hover:text-[#ead39a] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/50"
              >
                {copy.watch}

                <ArrowUpRight
                  aria-hidden="true"
                  size={11}
                  strokeWidth={1}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                y:
                  reducedMotion
                    ? 0
                    : 7,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.1,
              }}
              transition={{
                duration:
                  reducedMotion
                    ? 0
                    : 0.5,
                delay:
                  reducedMotion
                    ? 0
                    : 0.04,
                ease: EASE,
              }}
            >
              <div
                className="text-[7px] uppercase tracking-[0.28em]"
                style={{
                  color:
                    `${GOLD_LIGHT}4d`,
                }}
              >
                {copy.explore}
              </div>

              <nav
                aria-label={
                  isEnglish
                    ? "Footer navigation"
                    : "Footer navigacija"
                }
                className="mt-4"
              >
                {navigation.map(
                  (
                    item,
                  ) => (
                    <Link
                      key={`${item.label}-${item.href}`}
                      href={item.href}
                      className="group flex items-center justify-between border-b border-white/[0.045] py-3 text-[8px] uppercase tracking-[0.18em] text-white/[0.4] transition-all duration-300 hover:pl-1 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#ead39a]/45"
                    >
                      {item.label}

                      <ArrowUpRight
                        aria-hidden="true"
                        size={10}
                        strokeWidth={1}
                        className="text-white/[0.13] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#ead39a]"
                      />
                    </Link>
                  ),
                )}
              </nav>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                y:
                  reducedMotion
                    ? 0
                    : 7,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.1,
              }}
              transition={{
                duration:
                  reducedMotion
                    ? 0
                    : 0.5,
                delay:
                  reducedMotion
                    ? 0
                    : 0.08,
                ease: EASE,
              }}
            >
              <div
                className="text-[7px] uppercase tracking-[0.28em]"
                style={{
                  color:
                    `${GOLD_LIGHT}4d`,
                }}
              >
                {copy.follow}
              </div>

              <div className="mt-4">
                {SOCIAL_LINKS.map(
                  (
                    social,
                  ) => (
                    <a
                      key={
                        social.label
                      }
                      href={
                        social.href
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between border-b border-white/[0.045] py-3 text-[8px] uppercase tracking-[0.18em] text-white/[0.4] transition-all duration-300 hover:pl-1 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#ead39a]/45"
                    >
                      {social.label}

                      <ArrowUpRight
                        aria-hidden="true"
                        size={10}
                        strokeWidth={1}
                        className="text-white/[0.13] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#ead39a]"
                      />
                    </a>
                  ),
                )}
              </div>
            </motion.div>
          </div>
        </section>

        <motion.section
          initial={{
            opacity: 0,
            y:
              reducedMotion
                ? 0
                : 6,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.08,
          }}
          transition={{
            duration:
              reducedMotion
                ? 0
                : 0.55,
            ease: EASE,
          }}
          className="py-8 sm:py-9 lg:py-10"
        >
          <InteractiveCredit
            copy={copy}
            reducedMotion={
              reducedMotion
            }
          />
        </motion.section>

        <section className="border-t border-white/[0.07] py-7 sm:py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[7px] uppercase tracking-[0.18em] text-white/[0.21]">
              <span>
                {copy.footerNote}
              </span>

              <span className="hidden h-3 w-px bg-white/[0.08] sm:block" />

              <span>
                {copy.reserved}
              </span>
            </div>

            <div className="flex items-center gap-4 text-[6px] uppercase tracking-[0.22em] text-white/[0.13]">
              <span>Story</span>
              <span>Film</span>
              <span>Motion</span>
            </div>
          </div>

          <p className="mt-3 max-w-[1000px] text-[6px] leading-5 tracking-[0.05em] text-white/[0.13]">
            {copy.source}
          </p>
        </section>

        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration:
              reducedMotion
                ? 0
                : 0.45,
          }}
          className="flex flex-col gap-3 border-t border-white/[0.07] py-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="h-[3px] w-[3px] rounded-full"
              style={{
                background:
                  GOLD,
                boxShadow:
                  `0 0 7px ${GOLD}20`,
              }}
            />

            <span className="font-mono text-[6px] uppercase tracking-[0.28em] text-white/[0.13]">
              UMBRA / END FRAME
            </span>

            <span
              aria-hidden="true"
              className="hidden h-px w-7 sm:block"
              style={{
                background:
                  `${GOLD}28`,
              }}
            />

            <span
              className="hidden font-mono text-[6px] uppercase tracking-[0.2em] sm:block"
              style={{
                color:
                  `${GOLD_LIGHT}3e`,
              }}
            >
              {copy.signal}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[6px] uppercase tracking-[0.22em] text-white/[0.13]">
              {copy.end}
            </span>

            <span
              className="font-mono text-[6px] uppercase tracking-[0.22em]"
              style={{
                color:
                  `${GOLD_LIGHT}46`,
              }}
            >
              {copy.footerIndex}
            </span>
          </div>
        </motion.div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-px w-full"
        style={{
          background: `
            linear-gradient(
              90deg,
              transparent,
              ${GOLD}22,
              ${GOLD_LIGHT}10,
              transparent
            )
          `,
        }}
      />
    </footer>
  );
}
