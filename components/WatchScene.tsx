"use client";

import {
  ArrowDown,
  ArrowUpRight,
  Play,
} from "lucide-react";
import {
  motion,
  useReducedMotion,
} from "framer-motion";

import type { Locale } from "@/data/translations";

const GOLD = "#c7a96b";
const GOLD_LIGHT = "#ead39a";
const GOLD_DARK = "#8f7142";

const EASE = [0.22, 1, 0.36, 1] as const;

const YOUTUBE_URL =
  "https://www.youtube.com/@umbrastud";

const COPY = {
  sr: {
    eyebrow: "05 / GLEDAJ",
    titleA: "Priča",
    titleB: "se nastavlja.",
    body:
      "Ono što počinje ovde, nastavlja se kroz serije, epizode i nove priče na Umbra kanalu.",
    channel: "UMBRA STUDIO / YOUTUBE",
    action: "OTVORI KANAL",
    portal: "GLEDAJ NA YOUTUBE-U",
    portalNote:
      "Sledeća scena čeka na drugoj strani.",
    signal: "UMBRA / SIGNAL",
    continue: "SLEDEĆI KADAR",
    end: "KRAJ POČETNE STRANE",
    enter: "UĐI NA KANAL",
    transmission: "SIGNAL / UMBRA STUDIO",
    platform: "YOUTUBE",
    index: "05 / 05",
  },

  en: {
    eyebrow: "05 / WATCH",
    titleA: "The story",
    titleB: "continues.",
    body:
      "What begins here continues through series, episodes and new stories on the Umbra channel.",
    channel: "UMBRA STUDIO / YOUTUBE",
    action: "OPEN CHANNEL",
    portal: "WATCH ON YOUTUBE",
    portalNote:
      "The next scene waits on the other side.",
    signal: "UMBRA / SIGNAL",
    continue: "NEXT FRAME",
    end: "END OF HOMEPAGE",
    enter: "ENTER CHANNEL",
    transmission: "SIGNAL / UMBRA STUDIO",
    platform: "YOUTUBE",
    index: "05 / 05",
  },
};

export default function WatchScene({
  locale = "sr",
}: {
  locale?: Locale;
}) {
  const reducedMotion =
    useReducedMotion() ?? false;

  const copy = COPY[locale];

  return (
    <section
      id="watch"
      data-umbra-scene="watch"
      aria-labelledby="watch-title"
      className="relative overflow-hidden border-b border-white/[0.055] bg-[#050505]"
    >
      {/* ================================================================
          ATMOSPHERE
          ================================================================ */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute left-1/2 top-[34%] h-[740px] w-[740px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: `
              radial-gradient(
                circle,
                ${GOLD}05 0%,
                ${GOLD}018 34%,
                transparent 72%
              )
            `,
            filter: "blur(90px)",
          }}
        />

        <div
          className="absolute -left-[20%] top-[22%] h-[620px] w-[620px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,.012), transparent 70%)",
            filter: "blur(95px)",
          }}
        />

        <div
          className="absolute -bottom-[18%] right-[3%] h-[540px] w-[700px] rounded-full"
          style={{
            background: `
              radial-gradient(
                ellipse,
                ${GOLD}015,
                transparent 74%
              )
            `,
            filter: "blur(84px)",
          }}
        />

        <span
          className="absolute inset-x-[5%] top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,.026), transparent)",
          }}
        />

        <span
          className="absolute left-1/2 top-0 hidden h-full w-px lg:block"
          style={{
            background: `
              linear-gradient(
                180deg,
                transparent,
                ${GOLD}07 28%,
                ${GOLD}04 68%,
                transparent
              )
            `,
          }}
        />
      </div>

      {/* ================================================================
          OUTER FRAME
          ================================================================ */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-5 border border-white/[0.025] sm:inset-7 lg:inset-9 xl:inset-10"
      >
        <span
          className="absolute -left-px -top-px h-12 w-12 border-l border-t"
          style={{
            borderColor: `${GOLD}28`,
          }}
        />

        <span className="absolute -right-px -top-px h-10 w-10 border-r border-t border-white/[0.035]" />

        <span className="absolute -bottom-px -left-px h-10 w-10 border-b border-l border-white/[0.025]" />

        <span
          className="absolute -bottom-px -right-px h-12 w-12 border-b border-r"
          style={{
            borderColor: `${GOLD_DARK}2d`,
          }}
        />
      </div>

      {/* ================================================================
          CONTENT
          ================================================================ */}

      <div className="relative z-10 mx-auto max-w-[1540px] px-6 py-24 sm:px-9 sm:py-28 lg:px-12 lg:py-36 xl:px-16">
        {/* ==============================================================
            SECTION HEADER
            ============================================================== */}

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
            amount: 0.14,
          }}
          transition={{
            duration: reducedMotion ? 0 : 0.5,
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
              className="font-mono text-[7px] tracking-[0.4em]"
              style={{
                color: `${GOLD_LIGHT}82`,
              }}
            >
              05
            </span>

            <span className="text-[8px] font-semibold uppercase tracking-[0.4em] text-white/[0.52]">
              {copy.eyebrow}
            </span>
          </div>

          <span className="hidden font-mono text-[6px] uppercase tracking-[0.3em] text-white/[0.13] sm:block">
            {copy.index}
          </span>
        </motion.div>

        {/* ==============================================================
            MAIN COMPOSITION
            ============================================================== */}

        <div className="mt-14 grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-20 xl:mt-20 xl:gap-[7rem]">
          {/* ============================================================
              LEFT
              ============================================================ */}

          <div>
            <motion.div
              initial={{
                opacity: 0,
                x: reducedMotion ? 0 : -12,
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
                duration: reducedMotion ? 0 : 0.62,
                ease: EASE,
              }}
              className="flex items-center gap-3"
            >
              <span
                aria-hidden="true"
                className="flex h-5 w-5 items-center justify-center border"
                style={{
                  borderColor: `${GOLD}28`,
                }}
              >
                <Play
                  size={8}
                  strokeWidth={1.05}
                  fill="currentColor"
                  className="ml-px text-white/[0.42]"
                />
              </span>

              <span className="text-[7px] uppercase tracking-[0.32em] text-white/[0.2]">
                {copy.channel}
              </span>

              <span
                aria-hidden="true"
                className="h-px w-7 bg-white/[0.06]"
              />
            </motion.div>

            <motion.h2
              id="watch-title"
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
                amount: 0.14,
              }}
              transition={{
                delay: reducedMotion ? 0 : 0.05,
                duration: reducedMotion ? 0 : 0.8,
                ease: EASE,
              }}
              className="mt-7 max-w-[920px] text-[clamp(4rem,8.3vw,9.2rem)] font-[420] uppercase leading-[0.77] tracking-[-0.086em] text-white"
            >
              <span className="block">
                {copy.titleA}
              </span>

              <span className="block font-serif font-normal italic text-white/[0.58]">
                {copy.titleB}
              </span>
            </motion.h2>

            <motion.div
              initial={{
                scaleX: 0,
              }}
              whileInView={{
                scaleX: 1,
              }}
              viewport={{
                once: true,
                amount: 0.12,
              }}
              transition={{
                delay: reducedMotion ? 0 : 0.14,
                duration: reducedMotion ? 0 : 0.68,
                ease: EASE,
              }}
              className="mt-9 h-px w-full max-w-[560px] origin-left"
              style={{
                background:
                  `linear-gradient(90deg, ${GOLD}60, rgba(255,255,255,.05), transparent)`,
              }}
            />

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
                amount: 0.14,
              }}
              transition={{
                delay: reducedMotion ? 0 : 0.22,
                duration: reducedMotion ? 0 : 0.56,
                ease: EASE,
              }}
              className="mt-7 max-w-[590px] text-[13px] leading-7 text-white/[0.36] sm:text-[14px] sm:leading-8"
            >
              {copy.body}
            </motion.p>

            <motion.a
              href={YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={copy.action}
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
                amount: 0.14,
              }}
              transition={{
                delay: reducedMotion ? 0 : 0.34,
                duration: reducedMotion ? 0 : 0.54,
                ease: EASE,
              }}
              className="group relative mt-9 inline-flex h-12 items-center gap-4 overflow-hidden border px-6 text-[9px] font-semibold uppercase tracking-[0.27em] transition-[transform,border-color,background-color] duration-300 hover:-translate-y-px focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/70"
              style={{
                borderColor: `${GOLD}62`,
                background: `${GOLD}03`,
                color: GOLD_LIGHT,
              }}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    `radial-gradient(circle at 50% 0%, ${GOLD}12, transparent 68%)`,
                }}
              />

              <span className="relative z-10">
                {copy.action}
              </span>

              <ArrowUpRight
                aria-hidden="true"
                size={14}
                strokeWidth={1.15}
                className="relative z-10 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />

              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 h-px w-8 transition-[width] duration-500 group-hover:w-full"
                style={{
                  background:
                    `linear-gradient(90deg, ${GOLD_LIGHT}, ${GOLD}, transparent)`,
                }}
              />
            </motion.a>
          </div>

          {/* ============================================================
              YOUTUBE PORTAL
              ============================================================ */}

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
              amount: 0.08,
            }}
            transition={{
              delay: reducedMotion ? 0 : 0.1,
              duration: reducedMotion ? 0 : 0.82,
              ease: EASE,
            }}
          >
            <a
              href={YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={copy.portal}
              className="group block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/70"
            >
              <div className="relative aspect-[1/0.94] overflow-hidden border border-white/[0.075] bg-[#060606] transition-[border-color,box-shadow,transform] duration-500 group-hover:-translate-y-1 group-hover:border-white/[0.13] group-hover:shadow-[0_28px_90px_rgba(0,0,0,.36)]">
                {/* Inner frame */}

                <div
                  aria-hidden="true"
                  className="absolute inset-5 border border-white/[0.04] sm:inset-6 lg:inset-7"
                />

                {/* Light field */}

                <div
                  aria-hidden="true"
                  className="absolute inset-x-[13%] top-[15%] h-[58%]"
                  style={{
                    background:
                      `linear-gradient(125deg, transparent 0%, ${GOLD}06 45%, transparent 100%)`,
                    filter: "blur(30px)",
                  }}
                />

                <div
                  aria-hidden="true"
                  className="absolute bottom-[14%] left-[12%] h-px w-[76%]"
                  style={{
                    background:
                      `linear-gradient(90deg, transparent, ${GOLD}22, transparent)`,
                  }}
                />

                <div
                  aria-hidden="true"
                  className="absolute left-[18%] top-[18%] h-[64%] w-px bg-white/[0.025]"
                />

                <div
                  aria-hidden="true"
                  className="absolute right-[18%] top-[18%] h-[64%] w-px bg-white/[0.018]"
                />

                {/* Central play area */}

                <div className="absolute inset-x-[15%] bottom-[22%] top-[22%] border border-white/[0.055] transition-[border-color,transform] duration-500 group-hover:scale-[1.008] group-hover:border-white/[0.09]">
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 h-9 w-9 border-l border-t"
                    style={{
                      borderColor: `${GOLD}28`,
                    }}
                  />

                  <span className="absolute right-0 top-0 h-9 w-9 border-r border-t border-white/[0.035]" />

                  <span className="absolute bottom-0 left-0 h-9 w-9 border-b border-l border-white/[0.03]" />

                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 right-0 h-9 w-9 border-b border-r"
                    style={{
                      borderColor: `${GOLD_DARK}28`,
                    }}
                  />

                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="relative flex h-[82px] w-[82px] items-center justify-center border border-white/[0.1] bg-black/[0.28] transition-[border-color,background-color,transform] duration-500 group-hover:scale-[1.035] group-hover:border-[#ead39a]/[0.28] group-hover:bg-black/[0.38] sm:h-[90px] sm:w-[90px]">
                      <span
                        aria-hidden="true"
                        className="absolute inset-[-7px] border border-white/[0.025] transition-[border-color,transform] duration-500 group-hover:scale-[1.025] group-hover:border-[#c7a96b]/[0.1]"
                      />

                      <Play
                        size={20}
                        strokeWidth={1.05}
                        fill="currentColor"
                        className="ml-[2px] text-white/[0.46] transition-colors duration-300 group-hover:text-[#ead39a]/90"
                      />
                    </div>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between sm:bottom-7 sm:left-7 sm:right-7">
                    <span className="font-mono text-[6px] uppercase tracking-[0.3em] text-white/[0.16]">
                      {copy.transmission}
                    </span>

                    <span
                      className="font-mono text-[6px] uppercase tracking-[0.24em]"
                      style={{
                        color: `${GOLD_LIGHT}3e`,
                      }}
                    >
                      PLAY
                    </span>
                  </div>
                </div>

                {/* Top metadata */}

                <div className="absolute left-5 top-5 flex items-center gap-3 sm:left-7 sm:top-7">
                  <span
                    aria-hidden="true"
                    className="h-[5px] w-[5px] rounded-full"
                    style={{
                      background: GOLD,
                      boxShadow: `0 0 8px ${GOLD}30`,
                    }}
                  />

                  <span className="font-mono text-[6px] uppercase tracking-[0.3em] text-white/[0.2]">
                    {copy.platform}
                  </span>
                </div>

                <span
                  className="absolute right-5 top-5 font-mono text-[6px] uppercase tracking-[0.27em] sm:right-7 sm:top-7"
                  style={{
                    color: `${GOLD_LIGHT}42`,
                  }}
                >
                  UMBRA
                </span>

                {/* Hover field */}

                <span
                  aria-hidden="true"
                  className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      `radial-gradient(circle at 50% 50%, ${GOLD}06, transparent 46%)`,
                  }}
                />

                {/* Active edges */}

                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 h-px w-full origin-left scale-x-[0.08] transition-transform duration-500 group-hover:scale-x-100"
                  style={{
                    background:
                      `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT}35, transparent 78%)`,
                  }}
                />

                <span
                  aria-hidden="true"
                  className="absolute bottom-0 right-0 h-px w-full origin-right scale-x-[0.08] transition-transform duration-500 group-hover:scale-x-100"
                  style={{
                    background:
                      `linear-gradient(90deg, transparent, ${GOLD})`,
                  }}
                />
              </div>

              {/* Portal caption */}

              <div className="mt-4 flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="h-px w-8"
                    style={{
                      background: `${GOLD}42`,
                    }}
                  />

                  <span className="text-[7px] uppercase tracking-[0.27em] text-white/[0.18]">
                    {copy.portal}
                  </span>
                </div>

                <span
                  className="flex items-center gap-2 text-[7px] uppercase tracking-[0.27em]"
                  style={{
                    color: `${GOLD_LIGHT}58`,
                  }}
                >
                  {copy.enter}

                  <ArrowUpRight
                    aria-hidden="true"
                    size={11}
                    strokeWidth={1.1}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </span>
              </div>

              <div className="mt-2 px-1 text-[7px] uppercase tracking-[0.22em] text-white/[0.1]">
                {copy.portalNote}
              </div>
            </a>
          </motion.div>
        </div>

        {/* ==============================================================
            CLOSING
            ============================================================== */}

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
            amount: 0.06,
          }}
          transition={{
            delay: reducedMotion ? 0 : 0.08,
            duration: reducedMotion ? 0 : 0.5,
            ease: EASE,
          }}
          className="mt-16 flex flex-col gap-5 border-t border-white/[0.055] pt-6 sm:mt-20 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="h-px w-8"
              style={{
                background: `${GOLD}42`,
              }}
            />

            <span
              className="font-mono text-[6px] uppercase tracking-[0.3em]"
              style={{
                color: `${GOLD_LIGHT}5e`,
              }}
            >
              {copy.signal}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[7px] uppercase tracking-[0.26em] text-white/[0.13]">
              {copy.continue}
            </span>

            <motion.span
              aria-hidden="true"
              animate={
                reducedMotion
                  ? undefined
                  : {
                      y: [0, 2, 0],
                    }
              }
              transition={
                reducedMotion
                  ? undefined
                  : {
                      duration: 2.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
              }
              className="flex h-8 w-8 items-center justify-center border"
              style={{
                borderColor: `${GOLD}20`,
              }}
            >
              <ArrowDown
                size={13}
                strokeWidth={1.05}
                style={{
                  color: `${GOLD_LIGHT}78`,
                }}
              />
            </motion.span>
          </div>
        </motion.div>

        {/* ==============================================================
            END FRAME
            ============================================================== */}

        <div className="mt-12 flex items-center justify-between border-t border-white/[0.05] pt-5">
          <span className="font-mono text-[6px] uppercase tracking-[0.3em] text-white/[0.1]">
            {copy.end}
          </span>

          <span
            className="font-mono text-[6px] uppercase tracking-[0.26em]"
            style={{
              color: `${GOLD_LIGHT}36`,
            }}
          >
            {copy.index}
          </span>
        </div>
      </div>
    </section>
  );
}