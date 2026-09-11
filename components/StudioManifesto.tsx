"use client";

import Link from "next/link";
import {
  ArrowUp,
  ArrowUpRight,
} from "lucide-react";
import {
  motion,
  useReducedMotion,
} from "framer-motion";

import { studioProfile } from "@/data/studio";
import type { Locale } from "@/data/translations";

type StudioManifestoProps = {
  locale?: Locale;
};

const GOLD = "#c7a96b";
const GOLD_LIGHT = "#ead39a";
const GOLD_DARK = "#8f7142";

const EASE = [0.22, 1, 0.36, 1] as const;

const COPY = {
  sr: {
    label: "UMBRA STUDIO",
    eyebrow: "ZAVRŠNI KADAR",
    description: "Priče koje ostavljaju senku.",
    archive: "Pogledaj projekte",
    back: "Na početak",
    mark: "STORY / IMAGE / MOTION",
    closing: "Svaka priča ima svoj trag.",
    projectsAria: "Pogledaj Umbra projekte",
    homeAria: "Vrati se na početak stranice",
  },

  en: {
    label: "UMBRA STUDIO",
    eyebrow: "FINAL FRAME",
    description: "Stories that leave a shadow.",
    archive: "Explore projects",
    back: "Back to beginning",
    mark: "STORY / IMAGE / MOTION",
    closing: "Every story leaves a trace.",
    projectsAria: "Explore Umbra projects",
    homeAria: "Return to the beginning of the page",
  },
} as const;

/* ==========================================================================
   FINAL FRAME

   Intentionally NOT a numbered scene.
   It closes the homepage narrative and hands the visitor into the footer.
   ========================================================================== */

export default function StudioManifesto({
  locale = "sr",
}: StudioManifestoProps) {
  const reducedMotion = useReducedMotion() ?? false;
  const copy = COPY[locale];

  const projectsHref =
    locale === "en"
      ? "/en/projects"
      : "/serije";

  const homeHref =
    locale === "en"
      ? "/en"
      : "/";

  const studioName =
    studioProfile.name || copy.label;

  return (
    <section
      data-umbra-prefooter
      aria-label={
        locale === "en"
          ? "Umbra closing statement"
          : "Umbra završni kadar"
      }
      className="relative overflow-hidden border-b border-white/[0.045] bg-[#030303]"
    >
      {/* ========================================================================
         ATMOSPHERE
         ======================================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute left-1/2 top-1/2 h-[760px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: `
              radial-gradient(
                circle,
                ${GOLD}04 0%,
                ${GOLD}018 28%,
                transparent 69%
              )
            `,
            filter: "blur(90px)",
          }}
        />

        <div
          className="absolute -left-[28%] top-[10%] h-[700px] w-[700px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,.007), transparent 71%)",
            filter: "blur(94px)",
          }}
        />

        <div
          className="absolute -right-[18%] bottom-[-26%] h-[680px] w-[680px] rounded-full"
          style={{
            background:
              `radial-gradient(circle, ${GOLD_DARK}020, transparent 72%)`,
            filter: "blur(94px)",
          }}
        />

        <span
          className="absolute left-1/2 top-1/2 h-px w-[72vw] max-w-[1120px] -translate-x-1/2 -translate-y-1/2"
          style={{
            background:
              `linear-gradient(90deg, transparent, ${GOLD}08 24%, ${GOLD_LIGHT}16 50%, ${GOLD}08 76%, transparent)`,
          }}
        />

        <span
          className="absolute inset-x-[5%] top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,.024), transparent)",
          }}
        />
      </div>

      {/* ========================================================================
         OUTER FRAME
         ======================================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-5 border border-white/[0.024] sm:inset-7 lg:inset-9 xl:inset-10"
      >
        <span
          className="absolute -left-px -top-px h-12 w-12 border-l border-t"
          style={{
            borderColor: `${GOLD}2e`,
          }}
        />

        <span
          className="absolute -right-px -top-px h-10 w-10 border-r border-t"
          style={{
            borderColor: "rgba(255,255,255,.026)",
          }}
        />

        <span
          className="absolute -bottom-px -left-px h-10 w-10 border-b border-l"
          style={{
            borderColor: "rgba(255,255,255,.02)",
          }}
        />

        <span
          className="absolute -bottom-px -right-px h-12 w-12 border-b border-r"
          style={{
            borderColor: `${GOLD_DARK}2d`,
          }}
        />
      </div>

      {/* ========================================================================
         CONTENT
         ======================================================================== */}

      <div className="relative z-10 mx-auto flex min-h-[68svh] max-w-[1540px] flex-col justify-center px-6 py-24 sm:px-9 sm:py-28 lg:min-h-[72svh] lg:px-12 lg:py-32 xl:px-16">
        {/* ======================================================================
           TOP MARK
           ====================================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: reducedMotion ? 0 : 7,
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
            duration: reducedMotion ? 0 : 0.5,
            ease: EASE,
          }}
          className="flex items-center gap-3"
        >
          <span
            aria-hidden="true"
            className="h-px w-10"
            style={{
              background:
                `linear-gradient(90deg, transparent, ${GOLD})`,
            }}
          />

          <span
            className="font-mono text-[6px] uppercase tracking-[0.36em]"
            style={{
              color: `${GOLD_LIGHT}6e`,
            }}
          >
            {copy.eyebrow}
          </span>

          <span className="hidden h-px w-7 bg-white/[0.05] sm:block" />

          <span className="hidden font-mono text-[6px] uppercase tracking-[0.3em] text-white/[0.11] sm:block">
            {copy.mark}
          </span>
        </motion.div>

        {/* ======================================================================
           STATEMENT
           ====================================================================== */}

        <div className="mt-16 lg:mt-20">
          <motion.div
            initial={{
              opacity: 0,
              y: reducedMotion ? 0 : 24,
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
              duration: reducedMotion ? 0 : 0.82,
              ease: EASE,
            }}
          >
            <div className="relative">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-[24%] left-[-2%] select-none text-[clamp(7rem,19vw,18rem)] font-[500] uppercase leading-none tracking-[-0.1em] text-white/[0.011]"
              >
                UMBRA
              </span>

              <h2 className="relative max-w-[1280px] text-[clamp(3.8rem,8.3vw,9.8rem)] font-[420] uppercase leading-[0.77] tracking-[-0.088em] text-white">
                <span className="block text-white/[0.72]">
                  {studioName}
                </span>

                <span className="mt-2 block font-serif font-normal italic text-white/[0.56] sm:mt-3">
                  {copy.description}
                </span>
              </h2>
            </div>
          </motion.div>

          {/* ====================================================================
             SIGNATURE LINE
             ==================================================================== */}

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
              amount: 0.12,
            }}
            transition={{
              delay: reducedMotion ? 0 : 0.12,
              duration: reducedMotion ? 0 : 0.8,
              ease: EASE,
            }}
            className="mt-10 h-px w-full max-w-[760px] origin-left"
            style={{
              background:
                `linear-gradient(90deg, ${GOLD}64, ${GOLD_LIGHT}18 46%, transparent)`,
            }}
          />

          {/* ====================================================================
             CLOSING + ACTIONS
             ==================================================================== */}

          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <motion.p
              initial={{
                opacity: 0,
                y: reducedMotion ? 0 : 9,
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
                delay: reducedMotion ? 0 : 0.18,
                duration: reducedMotion ? 0 : 0.55,
                ease: EASE,
              }}
              className="max-w-[540px] text-[12px] leading-7 text-white/[0.27] sm:text-[13px] sm:leading-7"
            >
              {copy.closing}
            </motion.p>

            <motion.div
              initial={{
                opacity: 0,
                y: reducedMotion ? 0 : 9,
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
                delay: reducedMotion ? 0 : 0.22,
                duration: reducedMotion ? 0 : 0.55,
                ease: EASE,
              }}
              className="flex flex-wrap items-center gap-3"
            >
              <Link
                href={projectsHref}
                aria-label={copy.projectsAria}
                className="group inline-flex h-11 items-center gap-3 border border-[#c7a96b52] px-5 text-[8px] font-semibold uppercase tracking-[0.24em] transition-[transform,border-color,background-color] duration-300 hover:-translate-y-px hover:border-[#ead39a] hover:bg-[#c7a96b08] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/70"
                style={{
                  color: GOLD_LIGHT,
                }}
              >
                <span>{copy.archive}</span>

                <ArrowUpRight
                  aria-hidden="true"
                  size={12}
                  strokeWidth={1.15}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>

              <Link
                href={homeHref}
                aria-label={copy.homeAria}
                className="group inline-flex h-11 items-center gap-3 border border-white/[0.08] px-5 text-[8px] font-semibold uppercase tracking-[0.24em] text-white/[0.3] transition-[transform,border-color,color] duration-300 hover:-translate-y-px hover:border-white/[0.16] hover:text-white/[0.56] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
              >
                <ArrowUp
                  aria-hidden="true"
                  size={12}
                  strokeWidth={1.15}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5"
                />

                <span>{copy.back}</span>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* ======================================================================
           FINAL SIGNATURE
           ====================================================================== */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
            amount: 0.06,
          }}
          transition={{
            delay: reducedMotion ? 0 : 0.28,
            duration: reducedMotion ? 0 : 0.5,
          }}
          className="mt-20 flex items-center justify-between border-t border-white/[0.045] pt-5"
        >
          <span className="font-mono text-[6px] uppercase tracking-[0.3em] text-white/[0.1]">
            {copy.label}
          </span>

          <span
            className="font-mono text-[6px] uppercase tracking-[0.27em]"
            style={{
              color: `${GOLD_LIGHT}30`,
            }}
          >
            EST. / UMBRA
          </span>
        </motion.div>
      </div>

      {/* ========================================================================
         BOTTOM SIGNAL
         ======================================================================== */}

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
          amount: 0.05,
        }}
        transition={{
          duration: reducedMotion ? 0 : 0.9,
          ease: EASE,
        }}
        className="pointer-events-none absolute bottom-0 left-0 h-px w-[42%] origin-left"
        style={{
          background:
            `linear-gradient(90deg, ${GOLD_DARK}, ${GOLD}, ${GOLD_LIGHT}20, transparent)`,
        }}
      />
    </section>
  );
}