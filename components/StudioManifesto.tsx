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
const STUDIO_YEAR = "2026";

const EASE = [0.22, 1, 0.36, 1] as const;

const COPY = {
  sr: {
    label: "UMBRA STUDIO",
    eyebrow: "MANIFESTO",
    titleA: "Priče koje",
    titleB: "ostavljaju senku.",
    body:
      "Gradimo priče kroz kadar, karakter i pokret — od prve ideje do sveta koji može da se vidi, čuje i nastavi.",
    archive: "Istraži projekte",
    home: "Na početak",
    archiveAria: "Istraži Umbra projekte",
    homeAria: "Vrati se na početak stranice",
    mark: "STORY / IMAGE / MOTION",
    signal: "UMBRA / CLOSING FRAME",
    index: "END / 2026",
  },

  en: {
    label: "UMBRA STUDIO",
    eyebrow: "MANIFESTO",
    titleA: "Stories that",
    titleB: "leave a shadow.",
    body:
      "We build stories through frame, character and motion — from the first idea to a world that can be seen, heard and continued.",
    archive: "Explore projects",
    home: "Back to beginning",
    archiveAria: "Explore Umbra projects",
    homeAria: "Return to the beginning of the page",
    mark: "STORY / IMAGE / MOTION",
    signal: "UMBRA / CLOSING FRAME",
    index: "END / 2026",
  },
} as const;

export default function StudioManifesto({
  locale = "sr",
}: StudioManifestoProps) {
  const reducedMotion = useReducedMotion() ?? false;
  const copy = COPY[locale];

  const projectsHref =
    locale === "en" ? "/en/projects" : "/serije";
  const homeHref =
    locale === "en" ? "/en" : "/";

  const studioName =
    studioProfile.name?.trim() || copy.label;

  return (
    <section
      id="manifesto"
      data-umbra-scene="manifesto"
      data-umbra-prefooter
      aria-labelledby="manifesto-title"
      className="relative overflow-hidden border-b border-white/[0.05] bg-[#030303]"
    >
      {/* ATMOSPHERE */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute left-1/2 top-[46%] h-[780px] w-[780px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: `
              radial-gradient(
                circle,
                ${GOLD}05 0%,
                ${GOLD_LIGHT}012 28%,
                transparent 70%
              )
            `,
            filter: "blur(92px)",
          }}
        />

        <div
          className="absolute -left-[24%] top-[8%] h-[640px] w-[640px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,.008), transparent 72%)",
            filter: "blur(96px)",
          }}
        />

        <div
          className="absolute -right-[22%] bottom-[-24%] h-[720px] w-[720px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${GOLD_DARK}018, transparent 72%)`,
            filter: "blur(96px)",
          }}
        />

        <span
          className="absolute left-1/2 top-1/2 h-px w-[74vw] max-w-[1160px] -translate-x-1/2 -translate-y-1/2"
          style={{
            background: `linear-gradient(90deg, transparent, ${GOLD}07 22%, ${GOLD_LIGHT}15 50%, ${GOLD}07 78%, transparent)`,
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

      {/* FRAME */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-5 border border-white/[0.023] sm:inset-7 lg:inset-9 xl:inset-10"
      >
        <span
          className="absolute -left-px -top-px h-12 w-12 border-l border-t"
          style={{ borderColor: `${GOLD}30` }}
        />
        <span className="absolute -right-px -top-px h-10 w-10 border-r border-t border-white/[0.026]" />
        <span className="absolute -bottom-px -left-px h-10 w-10 border-b border-l border-white/[0.02]" />
        <span
          className="absolute -bottom-px -right-px h-12 w-12 border-b border-r"
          style={{ borderColor: `${GOLD_DARK}2f` }}
        />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 mx-auto flex min-h-[70svh] max-w-[1540px] flex-col justify-center px-6 py-24 sm:px-9 sm:py-28 lg:min-h-[76svh] lg:px-12 lg:py-32 xl:px-16">
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
          className="flex items-center justify-between gap-6 border-b border-white/[0.05] pb-5"
        >
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="h-px w-10"
              style={{
                background: `linear-gradient(90deg, transparent, ${GOLD})`,
              }}
            />

            <span
              className="font-mono text-[6px] uppercase tracking-[0.36em]"
              style={{ color: `${GOLD_LIGHT}6f` }}
            >
              {copy.eyebrow}
            </span>

            <span className="hidden h-px w-7 bg-white/[0.05] sm:block" />

            <span className="hidden font-mono text-[6px] uppercase tracking-[0.3em] text-white/[0.11] sm:block">
              {copy.mark}
            </span>
          </div>

          <span className="hidden font-mono text-[6px] uppercase tracking-[0.28em] text-white/[0.11] sm:block">
            {copy.index}
          </span>
        </motion.div>

        <div className="mt-14 lg:mt-18">
          <motion.div
            initial={{
              opacity: 0,
              y: reducedMotion ? 0 : 18,
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
              duration: reducedMotion ? 0 : 0.76,
              ease: EASE,
            }}
          >
            <Link
              href={projectsHref}
              aria-label={copy.archiveAria}
              className="group block max-w-[1310px] rounded-sm outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/65"
            >
              <div className="relative">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-[2%] -top-[15%] select-none text-[clamp(7rem,20vw,19rem)] font-[500] uppercase leading-none tracking-[-0.1em] text-white/[0.012]"
                >
                  UMBRA
                </span>

                <p
                  className="relative text-[8px] font-semibold uppercase tracking-[0.34em]"
                  style={{ color: `${GOLD_LIGHT}88` }}
                >
                  {studioName}
                </p>

                <h2
                  id="manifesto-title"
                  className="relative mt-7 text-[clamp(4.2rem,9.2vw,10.8rem)] font-[420] uppercase leading-[0.76] tracking-[-0.09em] text-white transition-[color,transform] duration-500 group-hover:-translate-y-[2px] group-hover:text-[#fffdf7]"
                >
                  <span className="block">
                    {copy.titleA}
                  </span>

                  <span className="mt-2 block font-serif font-normal italic text-white/[0.57] transition-colors duration-500 group-hover:text-white/[0.76] sm:mt-3">
                    {copy.titleB}
                  </span>
                </h2>

                <span
                  aria-hidden="true"
                  className="mt-7 block h-px w-12 origin-left transition-[width] duration-500 group-hover:w-24"
                  style={{
                    background: `linear-gradient(90deg, ${GOLD_LIGHT}, ${GOLD}, transparent)`,
                  }}
                />

                <span className="mt-5 inline-flex items-center gap-3 text-[7px] font-semibold uppercase tracking-[0.3em] opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                  <span style={{ color: `${GOLD_LIGHT}b0` }}>
                    {copy.archive}
                  </span>

                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-3.5 w-3.5"
                    style={{ color: `${GOLD_LIGHT}78` }}
                  />
                </span>
              </div>
            </Link>
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
              amount: 0.12,
            }}
            transition={{
              delay: reducedMotion ? 0 : 0.12,
              duration: reducedMotion ? 0 : 0.56,
              ease: EASE,
            }}
            className="mt-9 grid gap-9 lg:grid-cols-[minmax(0,560px)_auto] lg:items-end lg:justify-between"
          >
            <p className="max-w-[560px] text-[12px] leading-7 text-white/[0.31] sm:text-[13px] sm:leading-8">
              {copy.body}
            </p>

            <Link
              href={homeHref}
              aria-label={copy.homeAria}
              className="group inline-flex w-fit items-center gap-3 rounded-sm text-[7px] font-semibold uppercase tracking-[0.28em] outline-none transition-colors duration-300 hover:text-white focus-visible:ring-1 focus-visible:ring-white/35"
              style={{ color: `${GOLD_LIGHT}4f` }}
            >
              <ArrowUp
                aria-hidden="true"
                size={12}
                strokeWidth={1.1}
                className="transition-transform duration-300 group-hover:-translate-y-0.5"
              />

              <span>{copy.home}</span>

              <span
                aria-hidden="true"
                className="h-px w-7 transition-[width] duration-300 group-hover:w-12"
                style={{ background: `${GOLD_LIGHT}38` }}
              />
            </Link>
          </motion.div>
        </div>

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
            delay: reducedMotion ? 0 : 0.24,
            duration: reducedMotion ? 0 : 0.5,
          }}
          className="mt-16 flex items-center justify-between border-t border-white/[0.045] pt-5 lg:mt-20"
        >
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="h-px w-8"
              style={{ background: `${GOLD}38` }}
            />

            <span
              className="font-mono text-[6px] uppercase tracking-[0.3em]"
              style={{ color: `${GOLD_LIGHT}4e` }}
            >
              {copy.signal}
            </span>
          </div>

          <Link
            href={projectsHref}
            aria-label={copy.archiveAria}
            className="group flex items-center gap-3 font-mono text-[6px] uppercase tracking-[0.25em] outline-none transition-colors duration-300 hover:text-[#ead39a]/75 focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
            style={{ color: `${GOLD_LIGHT}30` }}
          >
            <span>{studioName}</span>

            <ArrowUpRight
              aria-hidden="true"
              size={11}
              strokeWidth={1}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </motion.div>
      </div>

      <motion.div
        aria-hidden="true"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{
          duration: reducedMotion ? 0 : 0.9,
          ease: EASE,
        }}
        className="pointer-events-none absolute bottom-0 left-0 h-px w-[42%] origin-left"
        style={{
          background: `linear-gradient(90deg, ${GOLD_DARK}, ${GOLD}, ${GOLD_LIGHT}20, transparent)`,
        }}
      />
    </section>
  );
}
