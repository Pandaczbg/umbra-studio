"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  motion,
  useReducedMotion,
} from "framer-motion";

type Locale = "sr" | "en";

type StudioManifestoProps = {
  locale?: Locale;
};

const GOLD = "#c7a96b";
const GOLD_LIGHT = "#ead39a";
const GOLD_DARK = "#8f7142";

const EASE = [
  0.22,
  1,
  0.36,
  1,
] as const;

const STUDIO_SLOGAN = "Priče koje ostavljaju senku";

const COPY = {
  sr: {
    eyebrow: "04 / Umbra Studio",
    descriptor:
      "Originalne priče / filmska slika / novi prostor",
    body:
      "Umbra Studio je prostor za priče koje traže više od jednog kadra — od originalnih priča do ekranizacija koje spajaju pripovedanje, sliku i savremenu tehnologiju.",
    cta: "Istraži projekte",
    metaLeft:
      "STORY / IMAGE / MOTION",
    metaRight:
      "PRIČE KOJE OSTAVLJAJU SENKU",
    signature:
      "Priča ostaje",
  },

  en: {
    eyebrow: "04 / Umbra Studio",
    descriptor:
      "Original stories / cinematic image / a new space",
    body:
      "Umbra Studio is a space for stories that ask for more than a single frame — from original stories to adaptations that bring together storytelling, image and contemporary technology.",
    cta: "Explore projects",
    metaLeft:
      "STORY / IMAGE / MOTION",
    metaRight:
      "STORIES THAT LEAVE A SHADOW",
    signature:
      "The story remains",
  },
} as const;

function splitSlogan(
  slogan: string,
) {
  const words =
    slogan
      .trim()
      .split(/\s+/);

  if (
    words.length < 2
  ) {
    return {
      before: slogan,
      accent: "",
    };
  }

  return {
    before:
      words
        .slice(
          0,
          -1,
        )
        .join(" "),
    accent:
      words[
        words.length - 1
      ],
  };
}

export default function StudioManifesto({
  locale = "sr",
}: StudioManifestoProps) {
  const reducedMotion =
    useReducedMotion() ?? false;

  const copy =
    COPY[locale];

  const projectsHref =
    locale === "en"
      ? "/en/projects"
      : "/serije";

  const slogan =
    splitSlogan(
      STUDIO_SLOGAN,
    );

  return (
    <section
      data-umbra-prefooter
      className="relative overflow-hidden border-b border-white/[0.06] bg-[#040404]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#040404_0%,#050505_52%,#030303_100%)]" />

        <div
          className="absolute left-[4%] top-[17%] h-[500px] w-[500px] rounded-full blur-3xl"
          style={{
            background: `
              radial-gradient(
                circle,
                ${GOLD}048,
                transparent 70%
              )
            `,
          }}
        />

        <div
          className="absolute right-[-12%] bottom-[-14%] h-[600px] w-[600px] rounded-full blur-3xl"
          style={{
            background: `
              radial-gradient(
                circle,
                ${GOLD_DARK}028,
                transparent 72%
              )
            `,
          }}
        />

        <div className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.006] blur-3xl" />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-[6%] top-0 h-full w-px bg-white/[0.011]" />
        <div className="absolute right-[6%] top-0 h-full w-px bg-white/[0.011]" />
        <div className="absolute left-1/2 top-0 hidden h-full w-px bg-white/[0.005] lg:block" />
        <div className="absolute inset-x-[6%] top-0 h-px bg-white/[0.025]" />
        <div className="absolute inset-x-[6%] bottom-0 h-px bg-white/[0.018]" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-6 py-24 sm:px-9 sm:py-28 lg:px-12 lg:py-36 xl:px-16">
        <motion.div
          initial={
            reducedMotion
              ? undefined
              : {
                  opacity: 0,
                  y: 8,
                }
          }
          whileInView={
            reducedMotion
              ? undefined
              : {
                  opacity: 1,
                  y: 0,
                }
          }
          viewport={{
            once: true,
            amount: 0.18,
          }}
          transition={{
            duration:
              reducedMotion
                ? 0
                : 0.5,
            ease: EASE,
          }}
          className="flex items-center justify-between border-b border-white/[0.05] pb-5"
        >
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="h-px w-9"
              style={{
                background:
                  `linear-gradient(90deg, transparent, ${GOLD})`,
              }}
            />

            <span
              className="font-mono text-[7px] uppercase tracking-[0.34em]"
              style={{
                color:
                  `${GOLD_LIGHT}78`,
              }}
            >
              {copy.eyebrow}
            </span>
          </div>

          <span className="hidden font-mono text-[6px] uppercase tracking-[0.28em] text-white/[0.13] sm:block">
            UMBRA STUDIO
          </span>
        </motion.div>

        <div className="mt-16 lg:mt-20">
          <motion.div
            initial={
              reducedMotion
                ? undefined
                : {
                    opacity: 0,
                    y: 20,
                  }
            }
            whileInView={
              reducedMotion
                ? undefined
                : {
                    opacity: 1,
                    y: 0,
                  }
            }
            viewport={{
              once: true,
              amount: 0.16,
            }}
            transition={{
              duration:
                reducedMotion
                  ? 0
                  : 0.78,
              ease: EASE,
            }}
          >
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-[5px] w-[5px] rounded-full"
                style={{
                  background:
                    GOLD,
                  boxShadow:
                    `0 0 9px ${GOLD}30`,
                }}
              />

              <p className="text-[8px] font-semibold uppercase tracking-[0.34em] text-white/[0.2]">
                {copy.descriptor}
              </p>
            </div>

            <h2
              aria-label={
                STUDIO_SLOGAN
              }
              className="mt-7 max-w-[1160px] font-serif text-[clamp(3.2rem,6.55vw,7.5rem)] font-normal italic leading-[0.89] tracking-[-0.066em]"
            >
              <span className="text-white/[0.7]">
                {slogan.before}
              </span>

              {" "}

              <span
                style={{
                  color:
                    GOLD_LIGHT,
                  textShadow:
                    `0 0 36px ${GOLD}10`,
                }}
              >
                {
                  slogan.accent
                }
              </span>
            </h2>
          </motion.div>

          <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end lg:gap-20">
            <motion.div
              initial={
                reducedMotion
                  ? undefined
                  : {
                      opacity: 0,
                      y: 10,
                    }
              }
              whileInView={
                reducedMotion
                  ? undefined
                  : {
                      opacity: 1,
                      y: 0,
                    }
              }
              viewport={{
                once: true,
                amount: 0.16,
              }}
              transition={{
                duration:
                  reducedMotion
                    ? 0
                    : 0.55,
                delay:
                  reducedMotion
                    ? 0
                    : 0.07,
                ease: EASE,
              }}
            >
              <div
                aria-hidden="true"
                className="h-px w-full max-w-[650px]"
                style={{
                  background:
                    `linear-gradient(90deg, ${GOLD_LIGHT}68, ${GOLD}26, transparent)`,
                }}
              />

              <p className="mt-7 max-w-[700px] text-[14px] leading-7 text-white/[0.4] sm:text-[15px] sm:leading-8">
                {
                  copy.body
                }
              </p>
            </motion.div>

            <motion.div
              initial={
                reducedMotion
                  ? undefined
                  : {
                      opacity: 0,
                      y: 10,
                    }
              }
              whileInView={
                reducedMotion
                  ? undefined
                  : {
                  opacity: 1,
                  y: 0,
                }
              }
              viewport={{
                once: true,
                amount: 0.16,
              }}
              transition={{
                duration:
                  reducedMotion
                    ? 0
                    : 0.55,
                delay:
                  reducedMotion
                    ? 0
                    : 0.15,
                ease: EASE,
              }}
              className="lg:justify-self-end"
            >
              <Link
                href={projectsHref}
                data-cursor-interactive
                className="group relative inline-flex h-12 items-center gap-4 overflow-hidden border px-6 text-[9px] font-semibold uppercase tracking-[0.25em] transition-[background-color,border-color,transform] duration-400 hover:-translate-y-px"
                style={{
                  borderColor:
                    `${GOLD}5c`,
                  background:
                    `linear-gradient(180deg, ${GOLD}08, transparent)`,
                  color:
                    GOLD_LIGHT,
                }}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      `radial-gradient(circle at 50% 100%, ${GOLD}0f, transparent 70%)`,
                  }}
                />

                <span className="relative z-10">
                  {copy.cta}
                </span>

                <ArrowUpRight
                  size={14}
                  strokeWidth={1.2}
                  className="relative z-10 transition-transform duration-400 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />

                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 h-px w-[32%] transition-[width] duration-600 group-hover:w-full"
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
              </Link>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={
            reducedMotion
              ? undefined
              : {
                  opacity: 0,
                  y: 14,
                }
          }
          whileInView={
            reducedMotion
              ? undefined
              : {
                  opacity: 1,
                  y: 0,
                }
          }
          viewport={{
            once: true,
            amount: 0.1,
          }}
          transition={{
            duration:
              reducedMotion
                ? 0
                : 0.65,
            delay:
              reducedMotion
                ? 0
                : 0.1,
            ease: EASE,
          }}
          className="relative mt-20 overflow-hidden border border-white/[0.065] bg-[#050505]"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full border lg:block"
            style={{
              borderColor:
                `${GOLD}07`,
            }}
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[230px] w-[230px] -translate-x-1/2 -translate-y-1/2 rounded-full border lg:block"
            style={{
              borderColor:
                `${GOLD}09`,
            }}
          />

          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[4px] w-[4px] -translate-x-1/2 -translate-y-1/2 rounded-full lg:block"
            style={{
              background:
                `${GOLD_LIGHT}62`,
              boxShadow:
                `0 0 13px ${GOLD}30`,
            }}
          />

          <div className="relative z-10 flex min-h-[240px] items-center justify-between gap-8 px-6 py-10 sm:px-9 sm:py-12 lg:px-12">
            <div>
              <span className="font-mono text-[6px] uppercase tracking-[0.3em] text-white/[0.12]">
                UMBRA / SIGNATURE
              </span>

              <p className="mt-5 max-w-[600px] font-serif text-[clamp(2rem,3.8vw,4rem)] italic leading-[0.92] tracking-[-0.05em] text-white/[0.6]">
                {copy.signature}
              </p>
            </div>

            <span
              aria-hidden="true"
              className="hidden h-[74px] w-[74px] shrink-0 items-center justify-center rounded-full border sm:flex"
              style={{
                borderColor:
                  `${GOLD}20`,
              }}
            >
              <span
                className="h-[5px] w-[5px] rounded-full"
                style={{
                  background:
                    GOLD_LIGHT,
                  boxShadow:
                    `0 0 10px ${GOLD_LIGHT}`,
                }}
              />
            </span>
          </div>

          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-0 h-px w-[36%]"
            style={{
              background: `
                linear-gradient(
                  90deg,
                  ${GOLD_DARK},
                  ${GOLD},
                  ${GOLD_LIGHT}24,
                  transparent
                )
              `,
            }}
          />

          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 h-px w-[18%]"
            style={{
              background:
                `linear-gradient(90deg, transparent, ${GOLD}20)`,
            }}
          />
        </motion.div>

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
            duration:
              reducedMotion
                ? 0
                : 0.5,
            delay:
              reducedMotion
                ? 0
                : 0.1,
          }}
          className="mt-16 flex items-center justify-between border-t border-white/[0.05] pt-5"
        >
          <span className="font-mono text-[6px] uppercase tracking-[0.28em] text-white/[0.13]">
            {copy.metaLeft}
          </span>

          <span
            className="hidden font-mono text-[6px] uppercase tracking-[0.28em] sm:block"
            style={{
              color:
                `${GOLD_LIGHT}32`,
            }}
          >
            {
              copy.metaRight
            }
          </span>
        </motion.div>

        <div className="mt-4 flex items-center justify-between">
          <span className="font-mono text-[6px] uppercase tracking-[0.28em] text-white/[0.08]">
            UMBRA / 04
          </span>

          <span className="font-mono text-[6px] uppercase tracking-[0.25em] text-white/[0.08]">
            {locale === "en"
              ? "CONTINUES"
              : "NASTAVLJA SE"}
          </span>
        </div>
      </div>

      <motion.div
        aria-hidden="true"
        initial={{
          scaleX: 0,
        }}
        whileInView={{
          scaleX: 1,
        }}
        viewport={{
          once: true,
          amount: 0.08,
        }}
        transition={{
          duration:
            reducedMotion
              ? 0
              : 0.85,
          ease: EASE,
        }}
        className="pointer-events-none absolute bottom-0 left-0 h-px w-[38%] origin-left"
        style={{
          background: `
            linear-gradient(
              90deg,
              ${GOLD_DARK},
              ${GOLD},
              ${GOLD_LIGHT}26,
              transparent
            )
          `,
        }}
      />
    </section>
  );
}
