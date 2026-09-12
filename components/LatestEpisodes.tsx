"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import type { Locale } from "@/data/translations";

const GOLD = "#c7a96b";
const GOLD_LIGHT = "#ead39a";
const GOLD_DARK = "#8f7142";

const YOUTUBE_URL = "https://www.youtube.com/@umbrastud";

const PROJECT_SR = "/serije/mrzim-svog-brata";
const PROJECT_EN = "/en/projects/mrzim-svog-brata";

const EASE = [
  0.22,
  1,
  0.36,
  1,
] as const;

type LatestEpisodesProps = {
  locale?: Locale;
};

export default function LatestEpisodes({
  locale = "sr",
}: LatestEpisodesProps) {
  const reducedMotion =
    useReducedMotion() ?? false;

  const isEnglish =
    locale === "en";

  const projectHref =
    isEnglish
      ? PROJECT_EN
      : PROJECT_SR;

  return (
    <section
      id="episodes"
      aria-labelledby="latest-episodes-title"
      data-umbra-scene="episodes" data-umbra-interactive="episode-hub"
      className="relative overflow-hidden border-t border-white/[0.055] bg-[#030303]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div
          className="absolute -right-[12%] top-[6%] h-[620px] w-[620px] rounded-full"
          style={{
            background: `
              radial-gradient(
                circle,
                ${GOLD}05 0%,
                ${GOLD}014 34%,
                transparent 72%
              )
            `,
            filter: "blur(80px)",
          }}
        />

        <div
          className="absolute -left-[18%] bottom-[-30%] h-[560px] w-[760px]"
          style={{
            background:
              "radial-gradient(ellipse, rgba(255,255,255,.012), transparent 70%)",
            filter: "blur(90px)",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,.08), transparent 28%, transparent 70%, rgba(0,0,0,.32))",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1680px] px-6 pb-24 pt-24 sm:px-9 sm:pb-28 sm:pt-28 lg:px-12 lg:pb-32 lg:pt-32 xl:px-16">
        <motion.div
          initial={{
            opacity: 0,
            y:
              reducedMotion
                ? 0
                : 10,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.15,
          }}
          transition={{
            duration:
              reducedMotion
                ? 0
                : 0.68,
            ease: EASE,
          }}
          className="flex items-center justify-between border-b border-white/[0.055] pb-5"
        >
          <div className="flex items-center gap-4">
            <span
              className="font-mono text-[7px] tracking-[0.32em]"
              style={{
                color:
                  `${GOLD_LIGHT}82`,
              }}
            >
              04
            </span>

            <span
              className="h-px w-12"
              style={{
                background:
                  `linear-gradient(90deg, ${GOLD}68, transparent)`,
              }}
            />

            <span
              className="text-[8px] font-semibold uppercase tracking-[0.30em]"
              style={{
                color:
                  `${GOLD_LIGHT}76`,
              }}
            >
              {isEnglish
                ? "EPISODES"
                : "EPIZODE"}
            </span>
          </div>

          <span className="hidden font-mono text-[6px] uppercase tracking-[0.28em] text-white/[0.14] sm:block">
            04 / 05
          </span>
        </motion.div>

        <div className="grid gap-14 pt-14 lg:grid-cols-[1fr_0.84fr] lg:items-end lg:gap-24 lg:pt-16">
          <motion.div
            initial={{
              opacity: 0,
              y:
                reducedMotion
                  ? 0
                  : 18,
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
                  : 0.78,
              ease: EASE,
            }}
          >
            <p
              className="text-[8px] font-semibold uppercase tracking-[0.32em]"
              style={{
                color:
                  `${GOLD_LIGHT}82`,
              }}
            >
              {isEnglish
                ? "THE STORY CONTINUES"
                : "PRIČA SE NASTAVLJA"}
            </p>

            <h2
              id="latest-episodes-title"
              className="mt-6 max-w-[820px] text-[clamp(3.2rem,7vw,8rem)] font-[430] leading-[0.82] tracking-[-0.08em] text-white"
            >
              {isEnglish ? (
                <>
                  The story
                  <br />
                  continues.
                </>
              ) : (
                <>
                  Priča uskoro
                  <br />
                  dobija nastavak.
                </>
              )}
            </h2>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              x:
                reducedMotion
                  ? 0
                  : 16,
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
              delay:
                reducedMotion
                  ? 0
                  : 0.08,
              duration:
                reducedMotion
                  ? 0
                  : 0.68,
              ease: EASE,
            }}
            className="max-w-[520px] lg:justify-self-end"
          >
            <p className="text-[12px] leading-7 text-white/[0.40] sm:text-[13px]">
              {isEnglish
                ? "New Umbra Studio episodes will appear here as production moves forward. For now, the story is still being built behind the scenes."
                : "Nove epizode Umbra Studija biće objavljivane ovde kako produkcija bude napredovala. Za sada se priča još uvek gradi iza kulisa."}
            </p>

            <a
              href={YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group/youtube mt-7 inline-flex min-h-[42px] items-center gap-4 text-[8px] font-semibold uppercase tracking-[0.28em] outline-none transition-colors duration-300 hover:text-white focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
              style={{
                color:
                  `${GOLD_LIGHT}88`,
              }}
            >
              <span>
                {isEnglish
                  ? "Follow Umbra Studio on YouTube"
                  : "Prati Umbra Studio na YouTube-u"}
              </span>

              <ArrowUpRight
                size={14}
                strokeWidth={1}
                className="transition-transform duration-500 group-hover/youtube:translate-x-1 group-hover/youtube:-translate-y-0.5"
              />

            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{
            opacity: 0,
            y:
              reducedMotion
                ? 0
                : 14,
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
                : 0.12,
            duration:
              reducedMotion
                ? 0
                : 0.68,
            ease: EASE,
          }}
          className="relative mt-16 overflow-hidden border-y border-white/[0.055] lg:mt-20"
        >
          <div className="grid min-h-[250px] items-center lg:grid-cols-[1.2fr_0.8fr]">
            <div className="relative px-6 py-10 sm:px-8 lg:px-10">
              <div
                aria-hidden="true"
                className="absolute left-0 top-0 h-full w-px"
                style={{
                  background:
                    `linear-gradient(180deg, transparent, ${GOLD_DARK}44, transparent)`,
                }}
              />

              <p
                className="text-[8px] font-semibold uppercase tracking-[0.32em]"
                style={{
                  color:
                    `${GOLD_LIGHT}72`,
                }}
              >
                001 /{" "}
                {isEnglish
                  ? "CURRENT PRODUCTION"
                  : "AKTUELNA PRODUKCIJA"}
              </p>

              <p className="mt-5 max-w-[720px] text-[clamp(1.25rem,2.5vw,2.35rem)] font-[400] leading-[1.05] tracking-[-0.04em] text-white/[0.72]">
                {isEnglish
                  ? "The first episode will arrive when it is ready — with the story setting the pace."
                  : "Prva epizoda stiže kada bude spremna — priča određuje tempo."}
              </p>

              <p className="mt-5 max-w-[620px] text-[10px] uppercase leading-5 tracking-[0.20em] text-white/[0.20]">
                {isEnglish
                  ? "Production in progress / Episode release to follow"
                  : "Produkcija u toku / Objavljivanje epizoda sledi"}
              </p>
            </div>

            <Link
              href={projectHref}
              aria-label={
                isEnglish
                  ? "Open MRZIM SVOG BRATA project"
                  : "Otvori projekat MRZIM SVOG BRATA"
              }
              className="group/current relative flex min-h-[190px] items-center border-t border-white/[0.05] px-6 py-8 outline-none transition-colors duration-300 hover:bg-white/[0.018] focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#ead39a]/60 sm:px-8 lg:min-h-full lg:border-l lg:border-t-0 lg:px-10"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-300 group-hover/current:opacity-100"
                style={{
                  background:
                    `radial-gradient(circle at 22% 50%, ${GOLD_LIGHT}08, transparent 48%)`,
                }}
              />

              <div className="relative z-10 w-full">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[6px] uppercase tracking-[0.30em] text-white/[0.16]">
                    {isEnglish
                      ? "CURRENT"
                      : "AKTUELNO"}
                  </span>

                  <span
                    className="font-mono text-[6px] tracking-[0.24em]"
                    style={{
                      color:
                        `${GOLD_LIGHT}60`,
                    }}
                  >
                    001
                  </span>
                </div>

                <div className="mt-8 h-px w-full bg-white/[0.07]">
                  <span
                    aria-hidden="true"
                    className="block h-px w-[32%] origin-left transition-[width] duration-500 group-hover/current:w-[58%]"
                    style={{
                      background:
                        `linear-gradient(90deg, ${GOLD_DARK}, ${GOLD_LIGHT}, transparent)`,
                    }}
                  />
                </div>

                <div className="mt-6 flex items-end justify-between gap-6">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.26em] text-white/[0.32] transition-colors duration-300 group-hover/current:text-white/[0.64]">
                      MRZIM SVOG BRATA
                    </p>

                    <p className="mt-2 text-[8px] uppercase tracking-[0.24em] text-white/[0.16]">
                      {isEnglish
                        ? "IN PRODUCTION"
                        : "U PRODUKCIJI"}
                    </p>
                  </div>

                  <span
                    className="inline-flex shrink-0 items-center gap-3 text-[7px] font-semibold uppercase tracking-[0.26em] text-white/[0.30] transition-colors duration-300 group-hover/current:text-[#ead39a]/90"
                  >
                    <span>
                      {isEnglish
                        ? "PROJECT"
                        : "PROJEKAT"}
                    </span>

                    <ArrowUpRight
                      size={13}
                      strokeWidth={1}
                      style={{
                        color:
                          `${GOLD_LIGHT}6a`,
                      }}
                      className="transition-transform duration-300 group-hover/current:translate-x-0.5 group-hover/current:-translate-y-0.5"
                    />
                  </span>
                </div>
              </div>
            </Link>
          </div>
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
            delay:
              reducedMotion
                ? 0
                : 0.16,
            duration:
              reducedMotion
                ? 0
                : 0.55,
            ease: EASE,
          }}
          className="mt-7 flex items-center justify-between border-t border-white/[0.05] pt-5"
        >
          <span className="font-mono text-[6px] uppercase tracking-[0.30em] text-white/[0.14]">
            {isEnglish
              ? "MORE TO COME"
              : "JOŠ SLEDI"}
          </span>

          <Link
            href={projectHref}
            className="group/bottom inline-flex items-center gap-3 text-[7px] font-semibold uppercase tracking-[0.25em] text-white/[0.22] transition-colors duration-300 hover:text-white/[0.62] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
          >
            <span>
              {isEnglish
                ? "OPEN PROJECT"
                : "OTVORI PROJEKAT"}
            </span>

            <ArrowUpRight
              size={13}
              strokeWidth={1}
              style={{
                color:
                  `${GOLD_LIGHT}68`,
              }}
              className="transition-transform duration-500 group-hover/bottom:translate-x-0.5 group-hover/bottom:-translate-y-0.5"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
