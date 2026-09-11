"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  Play,
} from "lucide-react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  useCallback,
  useRef,
  useState,
} from "react";

import type { Locale } from "@/data/translations";

const GOLD = "#c7a96b";
const GOLD_LIGHT = "#ead39a";
const GOLD_DARK = "#8f7142";

const EASE = [
  0.22,
  1,
  0.36,
  1,
] as const;

const POSTER_SRC = "/mrzim-poster.jpg";

export default function CurrentProjectScene({
  locale = "sr",
}: {
  locale?: Locale;
}) {
  const reducedMotion =
    useReducedMotion() ?? false;

  const isEnglish =
    locale === "en";

  const projectHref =
    isEnglish
      ? "/en/projects/mrzim-svog-brata"
      : "/serije/mrzim-svog-brata";

  const charactersHref =
    isEnglish
      ? "/en/characters"
      : "/likovi";

  const posterRef =
    useRef<HTMLAnchorElement | null>(
      null,
    );

  const pointerX =
    useMotionValue(0);

  const pointerY =
    useMotionValue(0);

  const smoothX = useSpring(
    pointerX,
    {
      stiffness: 95,
      damping: 18,
      mass: 0.55,
    },
  );

  const smoothY = useSpring(
    pointerY,
    {
      stiffness: 95,
      damping: 18,
      mass: 0.55,
    },
  );

  const posterX = useTransform(
    smoothX,
    [-1, 1],
    reducedMotion
      ? [0, 0]
      : [-7, 7],
  );

  const posterY = useTransform(
    smoothY,
    [-1, 1],
    reducedMotion
      ? [0, 0]
      : [-7, 7],
  );

  const lightX = useTransform(
    smoothX,
    [-1, 1],
    ["38%", "62%"],
  );

  const lightY = useTransform(
    smoothY,
    [-1, 1],
    ["38%", "62%"],
  );

  const [isHovered, setIsHovered] =
    useState(false);

  const [isFocused, setIsFocused] =
    useState(false);

  const handlePointerMove =
    useCallback(
      (
        event: React.PointerEvent<HTMLAnchorElement>,
      ) => {
        if (
          reducedMotion ||
          event.pointerType ===
            "touch"
        ) {
          return;
        }

        const rect =
          event.currentTarget.getBoundingClientRect();

        const x =
          (event.clientX -
            rect.left) /
            rect.width;

        const y =
          (event.clientY -
            rect.top) /
            rect.height;

        pointerX.set(
          x * 2 - 1,
        );

        pointerY.set(
          y * 2 - 1,
        );
      },
      [
        pointerX,
        pointerY,
        reducedMotion,
      ],
    );

  const resetPointer =
    useCallback(() => {
      pointerX.set(0);
      pointerY.set(0);
    }, [
      pointerX,
      pointerY,
    ]);

  return (
    <section
      id="current-project"
      data-umbra-scene="project"
      aria-labelledby="current-project-title"
      className="relative overflow-hidden border-b border-white/[0.06] bg-[#050505]"
    >
      {/* =====================================================================
          ATMOSPHERE
          ===================================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute inset-x-[6%] top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,.028), transparent)",
          }}
        />

        <motion.div
          animate={{
            opacity:
              isHovered || isFocused
                ? 0.72
                : 0.48,
            scale:
              isHovered || isFocused
                ? 1.035
                : 1,
          }}
          transition={{
            duration: 0.9,
            ease: EASE,
          }}
          className="absolute -right-[12%] top-[5%] h-[760px] w-[760px] rounded-full"
          style={{
            background: `
              radial-gradient(
                circle,
                ${GOLD}07 0%,
                ${GOLD}022 32%,
                transparent 72%
              )
            `,
            filter:
              "blur(65px)",
          }}
        />

        <div
          className="absolute bottom-[-20%] left-[16%] h-[560px] w-[800px] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse, rgba(255,255,255,.013), transparent 74%)",
            filter:
              "blur(75px)",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,.08), transparent 20%, transparent 74%, rgba(0,0,0,.38))",
          }}
        />
      </div>

      {/* =====================================================================
          MAIN CONTAINER
          ===================================================================== */}

      <div className="relative z-10 mx-auto max-w-[1540px] px-6 py-24 sm:px-9 sm:py-28 lg:px-12 lg:py-24 xl:px-16">
        {/* ===================================================================
            SECTION HEADER
            =================================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: reducedMotion
              ? 0
              : 8,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.12,
          }}
          transition={{
            duration:
              reducedMotion
                ? 0
                : 0.55,
            ease: EASE,
          }}
          className="flex items-center justify-between border-b border-white/[0.055] pb-5"
        >
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="h-px w-10"
              style={{
                background:
                  `linear-gradient(90deg, transparent, ${GOLD})`,
              }}
            />

            <span
              className="font-mono text-[7px] tracking-[0.42em]"
              style={{
                color:
                  `${GOLD_LIGHT}82`,
              }}
            >
              02
            </span>

            <span className="text-[8px] font-semibold uppercase tracking-[0.38em] text-white/[0.56]">
              {isEnglish
                ? "CURRENT PROJECT"
                : "AKTUELNI PROJEKAT"}
            </span>
          </div>

          <span className="hidden font-mono text-[6px] tracking-[0.3em] text-white/[0.16] sm:block">
            02 / 05
          </span>
        </motion.div>

        {/* ===================================================================
            MAIN COMPOSITION
            =================================================================== */}

        <div className="mt-12 grid items-center gap-14 lg:grid-cols-[0.82fr_1fr] lg:gap-[4.5rem] xl:mt-16 xl:grid-cols-[0.86fr_1fr] xl:gap-[7rem]">
          {/* =================================================================
              LEFT — STORY INFORMATION
              ================================================================= */}

          <div>
            <motion.div
              initial={{
                opacity: 0,
                x: reducedMotion
                  ? 0
                  : -14,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                amount: 0.14,
              }}
              transition={{
                duration:
                  reducedMotion
                    ? 0
                    : 0.72,
                ease: EASE,
              }}
            >
              {/* Identity line */}

              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="relative flex h-[7px] w-[7px] items-center justify-center rounded-full"
                >
                  <span
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        GOLD,
                      boxShadow:
                        `0 0 10px ${GOLD}38`,
                    }}
                  />

                  {!reducedMotion && (
                    <motion.span
                      aria-hidden="true"
                      className="absolute -inset-1 rounded-full border"
                      animate={{
                        opacity: [
                          0.12,
                          0.42,
                          0.12,
                        ],
                        scale: [
                          0.8,
                          1.15,
                          0.8,
                        ],
                      }}
                      transition={{
                        duration: 2.6,
                        repeat:
                          Infinity,
                        ease:
                          "easeInOut",
                      }}
                      style={{
                        borderColor:
                          `${GOLD}42`,
                      }}
                    />
                  )}
                </span>

                <span className="text-[7px] uppercase tracking-[0.34em] text-white/[0.31]">
                  {isEnglish
                    ? "UMBRA ORIGINAL"
                    : "UMBRA ORIGINAL"}
                </span>

                <span className="h-px w-7 bg-white/[0.08]" />

                <span
                  className="font-mono text-[7px] tracking-[0.26em]"
                  style={{
                    color:
                      `${GOLD_LIGHT}70`,
                  }}
                >
                  001
                </span>
              </div>

              {/* Title */}

              <div className="relative mt-8">
                <motion.h2
                  id="current-project-title"
                  initial={{
                    opacity: 0,
                    y: reducedMotion
                      ? 0
                      : 28,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.14,
                  }}
                  transition={{
                    delay:
                      reducedMotion
                        ? 0
                        : 0.08,
                    duration:
                      reducedMotion
                        ? 0
                        : 0.84,
                    ease: EASE,
                  }}
                  className="max-w-[760px] text-[clamp(3.65rem,7vw,8.5rem)] font-[420] uppercase leading-[0.77] tracking-[-0.085em] text-white"
                >
                  <span className="block">
                    MRZIM
                  </span>

                  <span className="block text-white/[0.57]">
                    SVOG BRATA
                  </span>
                </motion.h2>

                {/* Architectural text marker */}

                <motion.span
                  aria-hidden="true"
                  initial={{
                    scaleY: 0,
                  }}
                  whileInView={{
                    scaleY: 1,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.15,
                  }}
                  transition={{
                    delay:
                      reducedMotion
                        ? 0
                        : 0.2,
                    duration:
                      reducedMotion
                        ? 0
                        : 0.65,
                    ease: EASE,
                  }}
                  className="absolute -left-4 top-1 hidden h-[88%] w-px origin-top lg:block"
                  style={{
                    background:
                      `linear-gradient(180deg, ${GOLD_LIGHT}72, ${GOLD}1e, transparent)`,
                  }}
                />
              </div>

              {/* Accent beam */}

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
                  amount: 0.14,
                }}
                transition={{
                  delay:
                    reducedMotion
                      ? 0
                      : 0.15,
                  duration:
                    reducedMotion
                      ? 0
                      : 0.78,
                  ease: EASE,
                }}
                className="mt-8 h-px w-full max-w-[530px] origin-left"
                style={{
                  background:
                    `linear-gradient(90deg, ${GOLD_LIGHT}6e, ${GOLD}35 42%, rgba(255,255,255,.045) 62%, transparent)`,
                }}
              />

              {/* Metadata */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: reducedMotion
                    ? 0
                    : 9,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.13,
                }}
                transition={{
                  delay:
                    reducedMotion
                      ? 0
                      : 0.23,
                  duration:
                    reducedMotion
                      ? 0
                      : 0.55,
                  ease: EASE,
                }}
                className="mt-8 grid max-w-[580px] grid-cols-3 border-t border-white/[0.055] pt-6"
              >
                <Meta
                  label={
                    isEnglish
                      ? "Status"
                      : "Status"
                  }
                  value={
                    isEnglish
                      ? "In production"
                      : "U produkciji"
                  }
                />

                <Meta
                  label={
                    isEnglish
                      ? "Format"
                      : "Format"
                  }
                  value={
                    isEnglish
                      ? "Web series"
                      : "Web serija"
                  }
                  accent
                />

                <Meta
                  label={
                    isEnglish
                      ? "Episodes"
                      : "Epizode"
                  }
                  value="04"
                />
              </motion.div>

              {/* Story statement */}

              <motion.p
                initial={{
                  opacity: 0,
                  y: reducedMotion
                    ? 0
                    : 9,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.12,
                }}
                transition={{
                  delay:
                    reducedMotion
                      ? 0
                      : 0.3,
                  duration:
                    reducedMotion
                      ? 0
                      : 0.58,
                  ease: EASE,
                }}
                className="mt-8 max-w-[500px] text-[11px] leading-6 text-white/[0.32] sm:text-[12px] sm:leading-7"
              >
                {isEnglish
                  ? "The first Umbra production — a cinematic series built around family, character and the weight of what remains unsaid."
                  : "Prva Umbra produkcija — filmska serija o porodici, karakterima i težini onoga što ostaje neizgovoreno."}
              </motion.p>

              {/* Project link */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: reducedMotion
                    ? 0
                    : 10,
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
                  delay:
                    reducedMotion
                      ? 0
                      : 0.38,
                  duration:
                    reducedMotion
                      ? 0
                      : 0.55,
                  ease: EASE,
                }}
                className="mt-8"
              >
                <Link
                  href={projectHref}
                  className="group/cta inline-flex items-center gap-4"
                >
                  <span
                    className="relative flex h-12 items-center gap-4 border px-5"
                    style={{
                      borderColor:
                        `${GOLD}55`,
                    }}
                  >
                    <span className="text-[8px] font-semibold uppercase tracking-[0.3em] text-white/[0.65] transition-colors duration-300 group-hover/cta:text-white/[0.9]">
                      {isEnglish
                        ? "Enter project"
                        : "Uđi u projekat"}
                    </span>

                    <ArrowUpRight
                      size={13}
                      strokeWidth={1.1}
                      className="text-white/[0.36] transition-all duration-300 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5 group-hover/cta:text-[#ead39a]/80"
                    />

                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 h-px w-8 transition-[width] duration-500 group-hover/cta:w-full"
                      style={{
                        background:
                          `linear-gradient(90deg, ${GOLD_LIGHT}, ${GOLD}, transparent)`,
                      }}
                    />
                  </span>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* =================================================================
              RIGHT — CINEMATIC POSTER
              ================================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              y: reducedMotion
                ? 0
                : 28,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.07,
            }}
            transition={{
              delay:
                reducedMotion
                  ? 0
                  : 0.12,
              duration:
                reducedMotion
                  ? 0
                  : 0.9,
              ease: EASE,
            }}
          >
            <Link
              ref={posterRef}
              href={projectHref}
              onPointerMove={
                handlePointerMove
              }
              onPointerEnter={() =>
                setIsHovered(true)
              }
              onPointerLeave={() => {
                setIsHovered(false);
                resetPointer();
              }}
              onFocus={() =>
                setIsFocused(true)
              }
              onBlur={() =>
                setIsFocused(false)
              }
              className="group/poster relative mx-auto block w-full max-w-[610px] outline-none"
              aria-label={
                isEnglish
                  ? "Open MRZIM SVOG BRATA project"
                  : "Otvori projekat MRZIM SVOG BRATA"
              }
            >
              {/* Outer offset frame */}

              <div
                aria-hidden="true"
                className="absolute -inset-3 border border-white/[0.025] transition-all duration-700 group-hover/poster:-inset-4 group-hover/poster:border-white/[0.045]"
              />

              {/* Poster */}

              <motion.div
                style={{
                  x: posterX,
                  y: posterY,
                }}
                className="relative aspect-[0.72/1] overflow-hidden border border-white/[0.08] bg-[#080808] shadow-[0_25px_80px_rgba(0,0,0,.3)]"
              >
                {/* Image */}

                <Image
                  src={POSTER_SRC}
                  alt={
                    isEnglish
                      ? "MRZIM SVOG BRATA poster"
                      : "Poster serije MRZIM SVOG BRATA"
                  }
                  fill
                  sizes="(min-width: 1280px) 42vw, (min-width: 1024px) 48vw, 92vw"
                  priority
                  className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover/poster:scale-[1.025]"
                />

                {/* Grade */}

                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background: `
                      linear-gradient(
                        180deg,
                        rgba(0,0,0,.28),
                        transparent 26%,
                        transparent 54%,
                        rgba(0,0,0,.16) 70%,
                        rgba(0,0,0,.76) 100%
                      )
                    `,
                  }}
                />

                {/* Interactive optical light */}

                <motion.div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/poster:opacity-100"
                  style={{
                    background: `radial-gradient(circle at ${lightX} ${lightY}, ${GOLD_LIGHT}0d 0%, ${GOLD}05 18%, transparent 44%)`,
                  }}
                />

                {/* Grain-like depth */}

                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-[0.08] mix-blend-screen"
                  style={{
                    background:
                      "radial-gradient(circle at 20% 20%, rgba(255,255,255,.22) 0 1px, transparent 1px)",
                    backgroundSize:
                      "4px 4px",
                  }}
                />

                {/* Inner frame */}

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-4 border border-white/[0.055] sm:inset-5 lg:inset-6"
                />

                {/* Editorial crop frame */}

                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-[12%] border"
                  animate={{
                    opacity:
                      isHovered ||
                      isFocused
                        ? 0.11
                        : 0.035,
                  }}
                  transition={{
                    duration: 0.5,
                  }}
                  style={{
                    borderColor:
                      GOLD_LIGHT,
                  }}
                />

                {/* Corner accents */}

                <span
                  aria-hidden="true"
                  className="absolute left-5 top-5 h-7 w-7 border-l border-t lg:left-6 lg:top-6"
                  style={{
                    borderColor:
                      `${GOLD_LIGHT}38`,
                  }}
                />

                <span
                  aria-hidden="true"
                  className="absolute bottom-5 right-5 h-7 w-7 border-b border-r lg:bottom-6 lg:right-6"
                  style={{
                    borderColor:
                      `${GOLD}32`,
                  }}
                />

                {/* Top metadata */}

                <div className="absolute left-5 right-5 top-5 flex items-center justify-between lg:left-6 lg:right-6 lg:top-6">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{
                        background:
                          GOLD_LIGHT,
                        boxShadow:
                          `0 0 8px ${GOLD_LIGHT}45`,
                      }}
                    />

                    <span className="font-mono text-[5px] uppercase tracking-[0.32em] text-white/[0.38]">
                      UMBRA ORIGINAL
                    </span>
                  </div>

                  <span className="font-mono text-[5px] tracking-[0.28em] text-white/[0.2]">
                    001
                  </span>
                </div>

                {/* Center play indicator */}

                <motion.div
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  animate={{
                    y:
                      isHovered ||
                      isFocused
                        ? -2
                        : 0,
                  }}
                  transition={{
                    duration: 0.45,
                    ease: EASE,
                  }}
                >
                  <div
                    className="relative flex h-[72px] w-[72px] items-center justify-center rounded-full border bg-black/[0.18] backdrop-blur-[2px]"
                    style={{
                      borderColor:
                        `${GOLD_LIGHT}${isHovered || isFocused ? "35" : "22"}`,
                    }}
                  >
                    {!reducedMotion && (
                      <motion.span
                        aria-hidden="true"
                        className="absolute -inset-2 rounded-full border"
                        animate={{
                          opacity:
                            isHovered ||
                            isFocused
                              ? [
                                  0.08,
                                  0.32,
                                  0.08,
                                ]
                              : 0,
                          scale:
                            isHovered ||
                            isFocused
                              ? [
                                  0.94,
                                  1.07,
                                  0.94,
                                ]
                              : 1,
                        }}
                        transition={{
                          duration: 2.3,
                          repeat:
                            Infinity,
                          ease:
                            "easeInOut",
                        }}
                        style={{
                          borderColor:
                            `${GOLD_LIGHT}32`,
                        }}
                      />
                    )}

                    <Play
                      size={16}
                      strokeWidth={1.05}
                      fill="currentColor"
                      className="ml-0.5 text-white/[0.5] transition-colors duration-300 group-hover/poster:text-[#ead39a]/90"
                    />
                  </div>
                </motion.div>

                {/* Bottom poster typography */}

                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 lg:p-7">
                  <div className="max-w-[80%]">
                    <div className="text-[7px] uppercase tracking-[0.34em] text-white/[0.52]">
                      MRZIM SVOG BRATA
                    </div>

                    <div className="mt-2 text-[6px] uppercase tracking-[0.3em] text-white/[0.24]">
                      {isEnglish
                        ? "THE FIRST UMBRA SERIES"
                        : "PRVA UMBRA SERIJA"}
                    </div>
                  </div>

                  <div className="absolute bottom-6 right-6 lg:bottom-7 lg:right-7">
                    <span
                      className="font-mono text-[6px] tracking-[0.28em]"
                      style={{
                        color:
                          `${GOLD_LIGHT}55`,
                      }}
                    >
                      001 / 2026
                    </span>
                  </div>
                </div>

                {/* Hover sweep */}

                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-[-25%] top-0 h-full w-[18%] skew-x-[-16deg]"
                  animate={{
                    x:
                      isHovered ||
                      isFocused
                        ? "760%"
                        : "-25%",
                    opacity:
                      isHovered ||
                      isFocused
                        ? [
                            0,
                            0.3,
                            0,
                          ]
                        : 0,
                  }}
                  transition={{
                    duration:
                      isHovered ||
                      isFocused
                        ? 1.05
                        : 0.3,
                    ease:
                      "easeInOut",
                  }}
                  style={{
                    background:
                      `linear-gradient(90deg, transparent, ${GOLD_LIGHT}18, transparent)`,
                    filter:
                      "blur(2px)",
                  }}
                />

                {/* Bottom signal */}

                <motion.span
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 h-px"
                  animate={{
                    width:
                      isHovered ||
                      isFocused
                        ? "100%"
                        : "24%",
                  }}
                  transition={{
                    duration: 0.62,
                    ease: EASE,
                  }}
                  style={{
                    background:
                      `linear-gradient(90deg, ${GOLD_DARK}, ${GOLD_LIGHT}, transparent 78%)`,
                  }}
                />
              </motion.div>

              {/* Caption */}

              <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="h-px w-9"
                    style={{
                      background:
                        `${GOLD}42`,
                    }}
                  />

                  <span className="text-[7px] uppercase tracking-[0.3em] text-white/[0.22]">
                    {isEnglish
                      ? "CURRENT PRODUCTION"
                      : "AKTUELNA PRODUKCIJA"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className="text-[7px] uppercase tracking-[0.28em] transition-colors duration-300"
                    style={{
                      color:
                        isHovered ||
                        isFocused
                          ? `${GOLD_LIGHT}88`
                          : `${GOLD_LIGHT}58`,
                    }}
                  >
                    {isEnglish
                      ? "Open"
                      : "Otvori"}
                  </span>

                  <ArrowUpRight
                    size={11}
                    strokeWidth={1.1}
                    className="text-white/[0.26] transition-all duration-300 group-hover/poster:-translate-y-0.5 group-hover/poster:translate-x-0.5 group-hover/poster:text-white/[0.64]"
                  />
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* ===================================================================
            NEXT SCENE BRIDGE
            =================================================================== */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
            amount: 0.08,
          }}
          transition={{
            delay:
              reducedMotion
                ? 0
                : 0.18,
            duration:
              reducedMotion
                ? 0
                : 0.5,
            ease: EASE,
          }}
          className="mt-16 flex items-center justify-between border-t border-white/[0.05] pt-5"
        >
          <span className="font-mono text-[6px] uppercase tracking-[0.3em] text-white/[0.14]">
            {isEnglish
              ? "THE STORY CONTINUES"
              : "PRIČA SE NASTAVLJA"}
          </span>

          <Link
            href={charactersHref}
            className="group/next flex items-center gap-3"
          >
            <span className="text-[7px] uppercase tracking-[0.27em] text-white/[0.2] transition-colors duration-300 group-hover/next:text-white/[0.46]">
              {isEnglish
                ? "03 / CHARACTERS"
                : "03 / LIKOVI"}
            </span>

            <ArrowDownRight
              size={13}
              strokeWidth={1.1}
              className="transition-transform duration-300 group-hover/next:translate-x-0.5 group-hover/next:translate-y-0.5"
              style={{
                color:
                  `${GOLD_LIGHT}70`,
              }}
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function Meta({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <span className="text-[6px] uppercase tracking-[0.3em] text-white/[0.2]">
        {label}
      </span>

      <span
        className="truncate text-[8px] uppercase tracking-[0.2em]"
        style={{
          color: accent
            ? `${GOLD_LIGHT}82`
            : "rgba(255,255,255,.4)",
        }}
      >
        {value}
      </span>
    </div>
  );
}