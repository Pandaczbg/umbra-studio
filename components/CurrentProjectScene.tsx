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
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

import type { Locale } from "@/data/translations";

const GOLD = "#c7a96b";
const GOLD_LIGHT = "#ead39a";
const GOLD_DARK = "#8f7142";

const FALLBACK_IMAGE = "/umbra-background.png";

const EASE = [
  0.22,
  1,
  0.36,
  1,
] as const;

type CurrentProjectSceneProps = {
  locale?: Locale;
};

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
    <div className="min-w-0">
      <div className="font-mono text-[7px] uppercase tracking-[0.24em] text-white/[0.20]">
        {label}
      </div>

      <div
        className="mt-2 truncate text-[10px] font-medium uppercase tracking-[0.16em]"
        style={{
          color: accent
            ? `${GOLD_LIGHT}8c`
            : "rgba(241,237,228,.48)",
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default function CurrentProjectScene({
  locale = "sr",
}: CurrentProjectSceneProps) {
  const reducedMotion = useReducedMotion() ?? false;
  const isEnglish = locale === "en";

  const projectHref = isEnglish
    ? "/en/projects/mrzim-svog-brata"
    : "/serije/mrzim-svog-brata";

  const charactersHref = isEnglish
    ? "/en/characters"
    : "/likovi";

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const smoothX = useSpring(pointerX, {
    stiffness: 110,
    damping: 20,
    mass: 0.5,
  });

  const smoothY = useSpring(pointerY, {
    stiffness: 110,
    damping: 20,
    mass: 0.5,
  });

  const posterX = useTransform(
    smoothX,
    [-1, 1],
    reducedMotion ? [0, 0] : [-8, 8],
  );

  const posterY = useTransform(
    smoothY,
    [-1, 1],
    reducedMotion ? [0, 0] : [-8, 8],
  );

  const lightX = useTransform(
    smoothX,
    [-1, 1],
    ["36%", "64%"],
  );

  const lightY = useTransform(
    smoothY,
    [-1, 1],
    ["35%", "65%"],
  );

  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [posterSrc, setPosterSrc] =
    useState(FALLBACK_IMAGE);

  const interactive = hovered || focused;

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLAnchorElement>) => {
      if (
        reducedMotion ||
        event.pointerType === "touch"
      ) {
        return;
      }

      const rect =
        event.currentTarget.getBoundingClientRect();

      pointerX.set(
        ((event.clientX - rect.left) / rect.width) *
          2 -
          1,
      );

      pointerY.set(
        ((event.clientY - rect.top) / rect.height) *
          2 -
          1,
      );
    },
    [pointerX, pointerY, reducedMotion],
  );

  const resetPointer = useCallback(() => {
    pointerX.set(0);
    pointerY.set(0);
  }, [pointerX, pointerY]);

  return (
    <section
      id="current-project"
      data-umbra-scene="project"
      aria-labelledby="current-project-title"
      className="relative overflow-hidden border-b border-white/[0.055] bg-[#030303]"
    >
      {/* Ambient field */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute -right-[16%] top-[8%] h-[720px] w-[720px] rounded-full"
          style={{
            background: `
              radial-gradient(
                circle,
                ${GOLD}07 0%,
                ${GOLD}022 34%,
                transparent 72%
              )
            `,
            filter: "blur(70px)",
            opacity: interactive ? 0.95 : 0.68,
            transition: "opacity 700ms var(--ease-umbra-out)",
          }}
        />

        <div
          className="absolute bottom-[-22%] left-[8%] h-[520px] w-[760px]"
          style={{
            background:
              "radial-gradient(ellipse, rgba(255,255,255,.012), transparent 72%)",
            filter: "blur(82px)",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,.10), transparent 24%, transparent 72%, rgba(0,0,0,.40))",
          }}
        />
      </div>

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-[1680px]
          px-6
          pb-20
          pt-24
          sm:px-9
          sm:pb-24
          sm:pt-28
          lg:px-12
          lg:pb-28
          lg:pt-32
          xl:px-16
        "
      >
        {/* Scene header */}

        <motion.div
          initial={{
            opacity: 0,
            y: reducedMotion ? 0 : 8,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.16,
          }}
          transition={{
            duration: reducedMotion ? 0 : 0.6,
            ease: EASE,
          }}
          className="flex items-center justify-between border-b border-white/[0.055] pb-5"
        >
          <div className="flex items-center gap-4">
            <span
              className="font-mono text-[7px] tracking-[0.32em]"
              style={{
                color: `${GOLD_LIGHT}82`,
              }}
            >
              02
            </span>

            <span
              className="h-px w-12"
              style={{
                background: `linear-gradient(90deg, ${GOLD}70, transparent)`,
              }}
            />

            <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-white/[0.62]">
              {isEnglish
                ? "CURRENT PROJECT"
                : "AKTUELNI PROJEKAT"}
            </span>
          </div>

          <span className="hidden font-mono text-[6px] uppercase tracking-[0.28em] text-white/[0.15] sm:block">
            02 / 05
          </span>
        </motion.div>

        {/* Main composition */}

        <div className="grid items-center gap-14 pt-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16 lg:pt-16 xl:grid-cols-[0.88fr_1.12fr] xl:gap-24">
          {/* Editorial copy */}

          <motion.div
            initial={{
              opacity: 0,
              x: reducedMotion ? 0 : -18,
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
              duration: reducedMotion ? 0 : 0.78,
              ease: EASE,
            }}
            className="max-w-[680px]"
          >
            <div className="flex items-center gap-3">
              <span
                className="h-[6px] w-[6px] rounded-full"
                style={{
                  background: GOLD,
                  boxShadow: `0 0 12px ${GOLD}42`,
                }}
              />

              <span className="text-[8px] font-semibold uppercase tracking-[0.32em] text-white/[0.36]">
                UMBRA ORIGINAL
              </span>

              <span className="font-mono text-[7px] tracking-[0.24em] text-white/[0.18]">
                001
              </span>
            </div>

            <div className="mt-8 overflow-hidden">
              <motion.h2
                id="current-project-title"
                initial={{
                  opacity: 0,
                  y: reducedMotion ? 0 : 42,
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
                  delay: reducedMotion ? 0 : 0.08,
                  duration: reducedMotion ? 0 : 0.92,
                  ease: EASE,
                }}
                className="text-[clamp(4rem,7.2vw,8.8rem)] font-[430] uppercase leading-[0.79] tracking-[-0.085em] text-white"
              >
                <span className="block">
                  MRZIM
                </span>

                <span className="block text-white/[0.52]">
                  SVOG BRATA
                </span>
              </motion.h2>
            </div>

            <motion.div
              initial={{
                opacity: 0,
                x: reducedMotion ? 0 : -10,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                amount: 0.12,
              }}
              transition={{
                delay: reducedMotion ? 0 : 0.30,
                duration: reducedMotion ? 0 : 0.55,
                ease: EASE,
              }}
              className="mt-7 flex items-center gap-4"
            >
              <span
                className="font-serif text-[clamp(1.05rem,1.45vw,1.30rem)] italic"
                style={{
                  color: `${GOLD_LIGHT}9d`,
                }}
              >
                {isEnglish
                  ? "Series in production"
                  : "Serija u produkciji"}
              </span>

              <span
                className="h-px w-14"
                style={{
                  background: `linear-gradient(90deg, ${GOLD}64, transparent)`,
                }}
              />
            </motion.div>

            <motion.p
              initial={{
                opacity: 0,
                y: reducedMotion ? 0 : 10,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.10,
              }}
              transition={{
                delay: reducedMotion ? 0 : 0.42,
                duration: reducedMotion ? 0 : 0.58,
                ease: EASE,
              }}
              className="mt-7 max-w-[510px] text-[12px] leading-7 text-white/[0.40]"
            >
              {isEnglish
                ? "The first Umbra production — a cinematic series built around family, character and the weight of what remains unsaid."
                : "Prva Umbra produkcija — filmska serija o porodici, karakterima i težini onoga što ostaje neizgovoreno."}
            </motion.p>

            <motion.div
              initial={{
                opacity: 0,
                y: reducedMotion ? 0 : 8,
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
                delay: reducedMotion ? 0 : 0.52,
                duration: reducedMotion ? 0 : 0.55,
                ease: EASE,
              }}
              className="mt-9 grid max-w-[580px] grid-cols-3 border-t border-white/[0.055] pt-5"
            >
              <Meta
                label={isEnglish ? "Status" : "Status"}
                value={
                  isEnglish
                    ? "In production"
                    : "U produkciji"
                }
              />

              <Meta
                label="Format"
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

            <motion.div
              initial={{
                opacity: 0,
                y: reducedMotion ? 0 : 8,
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
                delay: reducedMotion ? 0 : 0.62,
                duration: reducedMotion ? 0 : 0.56,
                ease: EASE,
              }}
              className="mt-9 flex items-center gap-5"
            >
              <Link
                href={projectHref}
                className="group/project relative inline-flex min-h-[44px] items-center gap-4 pr-1 text-[8px] font-semibold uppercase tracking-[0.30em] sm:text-[9px]"
                style={{
                  color: GOLD_LIGHT,
                }}
              >
                <span className="relative z-10">
                  {isEnglish
                    ? "Enter project"
                    : "Uđi u projekat"}
                </span>

                <ArrowUpRight
                  size={13}
                  strokeWidth={1}
                  className="relative z-10 transition-transform duration-500 group-hover/project:translate-x-1 group-hover/project:-translate-y-0.5"
                />

                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 h-px w-8 transition-[width] duration-700 group-hover/project:w-full"
                  style={{
                    background: `linear-gradient(90deg, ${GOLD_LIGHT}, ${GOLD}, transparent)`,
                  }}
                />
              </Link>

              <span className="font-mono text-[5px] uppercase tracking-[0.32em] text-white/[0.14]">
                {isEnglish
                  ? "PROJECT 001"
                  : "PROJEKAT 001"}
              </span>
            </motion.div>
          </motion.div>

          {/* Cinematic key art */}

          <motion.div
            initial={{
              opacity: 0,
              y: reducedMotion ? 0 : 30,
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
              delay: reducedMotion ? 0 : 0.10,
              duration: reducedMotion ? 0 : 0.95,
              ease: EASE,
            }}
            className="relative"
          >
            <Link
              href={projectHref}
              onPointerMove={handlePointerMove}
              onPointerEnter={() => setHovered(true)}
              onPointerLeave={() => {
                setHovered(false);
                resetPointer();
              }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className="group/project-art relative mx-auto block w-full max-w-[680px] outline-none"
              aria-label={
                isEnglish
                  ? "Open MRZIM SVOG BRATA project"
                  : "Otvori projekat MRZIM SVOG BRATA"
              }
            >
              {/* offset registration mark */}

              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-3 top-10 hidden h-[72%] w-px bg-white/[0.045] lg:block"
              />

              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-3 left-10 hidden h-px w-[72%] bg-white/[0.045] lg:block"
              />

              <motion.div
                style={{
                  x: posterX,
                  y: posterY,
                }}
                className="relative aspect-[0.78/1] overflow-hidden border border-white/[0.08] bg-[#080808] shadow-[0_28px_90px_rgba(0,0,0,.34)]"
              >
                <Image
                  src={posterSrc}
                  alt={
                    isEnglish
                      ? "MRZIM SVOG BRATA"
                      : "MRZIM SVOG BRATA"
                  }
                  fill
                  priority
                  sizes="(min-width: 1280px) 47vw, (min-width: 1024px) 52vw, 94vw"
                  className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover/project-art:scale-[1.025]"
                  onError={() =>
                    setPosterSrc(FALLBACK_IMAGE)
                  }
                />

                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background: `
                      linear-gradient(
                        180deg,
                        rgba(0,0,0,.08) 0%,
                        transparent 34%,
                        rgba(0,0,0,.08) 58%,
                        rgba(0,0,0,.72) 100%
                      )
                    `,
                  }}
                />

                <motion.div
                  aria-hidden="true"
                  className="absolute inset-0"
                  animate={{
                    opacity: interactive ? 1 : 0,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: EASE,
                  }}
                  style={{
                    background: `radial-gradient(circle at ${lightX} ${lightY}, ${GOLD_LIGHT}12, ${GOLD}05 20%, transparent 48%)`,
                  }}
                />

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-4 border border-white/[0.055] sm:inset-5 lg:inset-6"
                />

                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-5 top-5 h-8 w-8 border-l border-t lg:left-6 lg:top-6"
                  animate={{
                    opacity: interactive
                      ? 0.8
                      : 0.42,
                  }}
                  transition={{
                    duration: 0.45,
                  }}
                  style={{
                    borderColor: `${GOLD_LIGHT}38`,
                  }}
                />

                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-5 right-5 h-8 w-8 border-b border-r lg:bottom-6 lg:right-6"
                  animate={{
                    opacity: interactive
                      ? 0.85
                      : 0.35,
                  }}
                  transition={{
                    duration: 0.45,
                  }}
                  style={{
                    borderColor: `${GOLD}32`,
                  }}
                />

                {/* top project marker */}

                <div className="absolute left-5 right-5 top-5 flex items-center justify-between lg:left-6 lg:right-6 lg:top-6">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-[5px] w-[5px] rounded-full"
                      style={{
                        background:
                          GOLD_LIGHT,
                        boxShadow: `0 0 8px ${GOLD_LIGHT}48`,
                      }}
                    />

                    <span className="text-[7px] font-semibold uppercase tracking-[0.30em] text-white/[0.42]">
                      UMBRA ORIGINAL
                    </span>
                  </div>

                  <span className="font-mono text-[6px] tracking-[0.24em] text-white/[0.22]">
                    001
                  </span>
                </div>

                {/* center play cue */}

                <motion.div
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  animate={{
                    scale: interactive ? 1.04 : 1,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: EASE,
                  }}
                >
                  <span
                    className="flex h-[68px] w-[68px] items-center justify-center rounded-full border bg-black/[0.16] backdrop-blur-[2px]"
                    style={{
                      borderColor: interactive
                        ? `${GOLD_LIGHT}42`
                        : `${GOLD_LIGHT}22`,
                    }}
                  >
                    <Play
                      size={15}
                      strokeWidth={1}
                      fill="currentColor"
                      className="ml-0.5 text-white/[0.58] transition-colors duration-300 group-hover/project-art:text-[#ead39a]"
                    />
                  </span>
                </motion.div>

                {/* bottom title band */}

                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 lg:p-7">
                  <div className="max-w-[75%]">
                    <div className="text-[9px] font-medium uppercase tracking-[0.24em] text-white/[0.66]">
                      MRZIM SVOG BRATA
                    </div>

                    <div className="mt-2 text-[7px] uppercase tracking-[0.24em] text-white/[0.30]">
                      {isEnglish
                        ? "THE FIRST UMBRA SERIES"
                        : "PRVA UMBRA SERIJA"}
                    </div>
                  </div>

                  <div className="absolute bottom-6 right-6 lg:bottom-7 lg:right-7">
                    <span
                      className="font-mono text-[6px] tracking-[0.24em]"
                      style={{
                        color: `${GOLD_LIGHT}62`,
                      }}
                    >
                      001 / 2026
                    </span>
                  </div>
                </div>

                {/* hover signal */}

                <motion.span
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 h-px origin-left"
                  animate={{
                    width: interactive
                      ? "100%"
                      : "26%",
                  }}
                  transition={{
                    duration: 0.65,
                    ease: EASE,
                  }}
                  style={{
                    background: `linear-gradient(90deg, ${GOLD_DARK}, ${GOLD_LIGHT}, transparent 78%)`,
                  }}
                />
              </motion.div>

              {/* caption */}

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className="h-px w-8"
                    style={{
                      background: `${GOLD}38`,
                    }}
                  />

                  <span className="text-[7px] uppercase tracking-[0.28em] text-white/[0.22]">
                    {isEnglish
                      ? "CURRENT PRODUCTION"
                      : "AKTUELNA PRODUKCIJA"}
                  </span>
                </div>

                <span
                  className="text-[7px] uppercase tracking-[0.22em]"
                  style={{
                    color: interactive
                      ? `${GOLD_LIGHT}8c`
                      : `${GOLD_LIGHT}52`,
                  }}
                >
                  {isEnglish
                    ? "OPEN PROJECT"
                    : "OTVORI PROJEKAT"}
                </span>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Scene hand-off */}

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
            delay: reducedMotion ? 0 : 0.16,
            duration: reducedMotion ? 0 : 0.55,
            ease: EASE,
          }}
          className="mt-16 flex items-center justify-between border-t border-white/[0.05] pt-5 lg:mt-20"
        >
          <div>
            <span className="font-mono text-[6px] uppercase tracking-[0.30em] text-white/[0.14]">
              {isEnglish
                ? "THE STORY CONTINUES"
                : "PRIČA SE NASTAVLJA"}
            </span>
          </div>

          <Link
            href={charactersHref}
            className="group/next flex items-center gap-3"
          >
            <span className="text-[7px] font-semibold uppercase tracking-[0.25em] text-white/[0.24] transition-colors duration-300 group-hover/next:text-white/[0.62]">
              {isEnglish
                ? "03 / CHARACTERS"
                : "03 / LIKOVI"}
            </span>

            <ArrowDownRight
              size={13}
              strokeWidth={1}
              className="transition-transform duration-400 group-hover/next:translate-x-0.5 group-hover/next:translate-y-0.5"
              style={{
                color: `${GOLD_LIGHT}70`,
              }}
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
