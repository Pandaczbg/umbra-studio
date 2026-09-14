"use client";

import {
  ArrowDown,
  ArrowUpRight,
  Play,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

type Locale = "sr" | "en";

const GOLD = "#c4a56b";
const GOLD_LIGHT = "#dfc88f";
const GOLD_DARK = "#8d6f43";

const EASE = [0.22, 1, 0.36, 1] as const;

const YOUTUBE_URL = "https://www.youtube.com/@umbrastud";

const COPY = {
  sr: {
    eyebrow: "GLEDAJ",
    titleA: "Priča",
    titleB: "se nastavlja",
    body:
      "Ono što počinje ovde, nastavlja se kroz serije, epizode i nove priče na Umbra kanalu.",
    channel: "UMBRA STUDIO / YOUTUBE",
    action: "OTVORI KANAL",
    portal: "GLEDAJ NA YOUTUBE-U",
    portalNote:
      "Epizode, serije i nove priče žive na Umbra kanalu.",
    signal: "UMBRA / SIGNAL",
    continue: "SLEDEĆE / NAČIN RADA",
    bridge: "PRE-FOOTER / NAČIN RADA",
    transmission: "UMBRA STUDIO",
    platform: "YOUTUBE",
    index: "05 / 05",
    mediaStatus: "KANAL SPREMAN",
    mediaLabel: "VIDEO / DISTRIBUCIJA",
    youtubeAria: "Otvori Umbra Studio YouTube kanal",
    portalLabel: "DISTRIBUCIJA PRIČE",
  },
  en: {
    eyebrow: "WATCH",
    titleA: "The story",
    titleB: "continues",
    body:
      "What begins here continues through series, episodes and new stories on the Umbra channel.",
    channel: "UMBRA STUDIO / YOUTUBE",
    action: "OPEN CHANNEL",
    portal: "WATCH ON YOUTUBE",
    portalNote:
      "Episodes, series and new stories live on the Umbra channel.",
    signal: "UMBRA / SIGNAL",
    continue: "NEXT / HOW WE WORK",
    bridge: "PRE-FOOTER / HOW WE WORK",
    transmission: "UMBRA STUDIO",
    platform: "YOUTUBE",
    index: "05 / 05",
    mediaStatus: "CHANNEL READY",
    mediaLabel: "VIDEO / DISTRIBUTION",
    youtubeAria: "Open the Umbra Studio YouTube channel",
    portalLabel: "STORY DISTRIBUTION",
  },
} as const;

function PortalFrame({
  locale,
  reducedMotion,
}: {
  locale: Locale;
  reducedMotion: boolean;
}) {
  const copy = COPY[locale];

  return (
    <a
      href={YOUTUBE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={copy.youtubeAria}
      className="group block outline-none focus-visible:ring-1 focus-visible:ring-[#dfc88f]/75"
    >
      <div className="relative overflow-hidden border border-white/[0.075] bg-[#060605] shadow-[0_24px_64px_rgba(0,0,0,.28)] transition-[border-color,box-shadow,transform] duration-500 group-hover:-translate-y-0.5 group-hover:border-white/[0.13] group-hover:shadow-[0_30px_82px_rgba(0,0,0,.34)]">
        <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between border-b border-white/[0.05] px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="h-[4px] w-[4px] rounded-full"
              style={{
                background: GOLD_LIGHT,
                boxShadow: `0 0 8px ${GOLD_LIGHT}30`,
              }}
            />
            <span className="umbra-code text-white/[0.24]">
              {copy.mediaLabel}
            </span>
          </div>

          <span
            className="umbra-code"
            style={{ color: `${GOLD_LIGHT}42` }}
          >
            {copy.index}
          </span>
        </div>

        <div className="relative aspect-[4/3] bg-[#040404] pt-10 sm:aspect-[16/10]">
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                `radial-gradient(circle at 54% 48%, ${GOLD}08 0%, ${GOLD}02 28%, transparent 62%)`,
            }}
          />

          <div
            aria-hidden="true"
            className="absolute inset-[8%] border border-white/[0.032]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-[14%] border border-white/[0.04]"
          />

          <span
            aria-hidden="true"
            className="absolute left-[14%] top-[18%] h-8 w-8 border-l border-t sm:h-9 sm:w-9"
            style={{ borderColor: `${GOLD}24` }}
          />
          <span
            aria-hidden="true"
            className="absolute right-[14%] top-[18%] h-8 w-8 border-r border-t border-white/[0.025] sm:h-9 sm:w-9"
          />
          <span
            aria-hidden="true"
            className="absolute bottom-[18%] left-[14%] h-8 w-8 border-b border-l border-white/[0.022] sm:h-9 sm:w-9"
          />
          <span
            aria-hidden="true"
            className="absolute bottom-[18%] right-[14%] h-8 w-8 border-b border-r sm:h-9 sm:w-9"
            style={{ borderColor: `${GOLD_DARK}28` }}
          />

          <div className="absolute inset-x-[13%] top-[22%] bottom-[22%] border border-white/[0.05] sm:inset-x-[18%] sm:top-[23%] sm:bottom-[23%]">
            <span
              aria-hidden="true"
              className="absolute left-0 top-0 h-5 w-5 border-l border-t sm:h-6 sm:w-6"
              style={{ borderColor: `${GOLD}22` }}
            />
            <span
              aria-hidden="true"
              className="absolute bottom-0 right-0 h-5 w-5 border-b border-r border-white/[0.022] sm:h-6 sm:w-6"
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
              <span
                className="umbra-code"
                style={{ color: `${GOLD_LIGHT}58` }}
              >
                {copy.mediaStatus}
              </span>

              <motion.div
                initial={false}
                animate={
                  reducedMotion
                    ? { scale: 1 }
                    : { scale: [1, 1.018, 1] }
                }
                transition={
                  reducedMotion
                    ? undefined
                    : {
                        duration: 3.4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }
                }
                className="relative mt-4 flex h-14 w-14 items-center justify-center border border-white/[0.09] bg-black/25 sm:mt-5 sm:h-[66px] sm:w-[66px]"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-[-7px] border border-[#c4a56b]/[0.07]"
                />

                <Play
                  aria-hidden="true"
                  size={16}
                  strokeWidth={1.05}
                  fill="currentColor"
                  className="ml-[2px] text-white/[0.46] transition-colors duration-300 group-hover:text-[#dfc88f]"
                />
              </motion.div>

              <span className="mt-4 text-[7px] uppercase tracking-[0.23em] text-white/[0.16] sm:mt-5 sm:text-[8px]">
                {copy.portalLabel}
              </span>

              <span className="mt-3 max-w-[300px] text-[9px] leading-5 text-white/[0.23] sm:text-[11px]">
                {copy.portalNote}
              </span>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-center justify-between gap-4 sm:inset-x-6">
            <span className="umbra-code text-white/[0.15]">
              {copy.transmission}
            </span>

            <span
              className="umbra-code"
              style={{ color: `${GOLD_LIGHT}42` }}
            >
              {copy.platform}
            </span>
          </div>

          <span
            aria-hidden="true"
            className="absolute left-0 top-0 h-px w-full origin-left scale-x-[0.12] transition-transform duration-500 group-hover:scale-x-100"
            style={{
              background:
                `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT}38, transparent 80%)`,
            }}
          />

          <span
            aria-hidden="true"
            className="absolute bottom-0 right-0 h-px w-full origin-right scale-x-[0.12] transition-transform duration-500 group-hover:scale-x-100"
            style={{
              background:
                `linear-gradient(90deg, transparent, ${GOLD})`,
            }}
          />
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-white/[0.05] px-4 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span
              aria-hidden="true"
              className="h-px w-7 shrink-0"
              style={{ background: `${GOLD}3d` }}
            />
            <span className="truncate text-[7px] uppercase tracking-[0.24em] text-white/[0.18] sm:tracking-[0.27em]">
              {copy.portal}
            </span>
          </div>

          <span
            className="flex min-h-9 shrink-0 items-center gap-2 text-[7px] uppercase tracking-[0.22em] sm:tracking-[0.26em]"
            style={{ color: `${GOLD_LIGHT}62` }}
          >
            {copy.action}
            <ArrowUpRight
              aria-hidden="true"
              size={11}
              strokeWidth={1.1}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </div>
    </a>
  );
}

export default function WatchScene({
  locale = "sr",
}: {
  locale?: Locale;
}) {
  const reducedMotion = useReducedMotion() ?? false;
  const copy = COPY[locale];

  return (
    <section
      id="watch"
      data-umbra-scene="watch"
      data-umbra-interactive="watch-portal"
      aria-labelledby="watch-title"
      className="relative scroll-mt-[110px] overflow-x-clip border-b border-white/[0.055] bg-[var(--umbra-bg)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute left-[64%] top-[24%] h-[560px] w-[560px] -translate-x-1/2 rounded-full sm:h-[680px] sm:w-[680px]"
          style={{
            background:
              `radial-gradient(circle, ${GOLD}04 0%, ${GOLD}012 34%, transparent 72%)`,
            filter: "blur(94px)",
          }}
        />

        <div
          className="absolute -left-[20%] top-[22%] h-[500px] w-[500px] rounded-full sm:h-[600px] sm:w-[600px]"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,.009), transparent 70%)",
            filter: "blur(100px)",
          }}
        />

        <span
          aria-hidden="true"
          className="absolute inset-x-[5%] top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,.024), transparent)",
          }}
        />
      </div>

      <div className="umbra-container relative py-16 sm:py-22 lg:py-24">
        <motion.div
          initial={{
            opacity: 0,
            y: reducedMotion ? 0 : 8,
          }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reducedMotion ? 0 : 0.5,
            ease: EASE,
          }}
          className="flex items-center justify-between border-b border-white/[0.055] pb-5"
        >
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="h-px w-8 sm:w-10"
              style={{
                background:
                  `linear-gradient(90deg, transparent, ${GOLD_LIGHT}72)`,
              }}
            />

            <span
              className="umbra-code"
              style={{ color: `${GOLD_LIGHT}7c` }}
            >
              05
            </span>

            <span className="text-[8px] font-semibold uppercase tracking-[0.34em] text-white/[0.46] sm:tracking-[0.38em]">
              {copy.eyebrow}
            </span>
          </div>

          <span className="hidden umbra-code sm:block">
            {copy.index}
          </span>
        </motion.div>

        <div className="mt-10 grid items-center gap-10 sm:mt-14 lg:grid-cols-2 lg:gap-16 xl:mt-16 xl:gap-18">
          <div>
            <motion.div
              initial={{
                opacity: 0,
                x: reducedMotion ? 0 : -10,
              }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.14 }}
              transition={{
                duration: reducedMotion ? 0 : 0.58,
                ease: EASE,
              }}
              className="flex items-center gap-3"
            >
              <span
                aria-hidden="true"
                className="flex h-5 w-5 items-center justify-center border"
                style={{ borderColor: `${GOLD}24` }}
              >
                <Play
                  aria-hidden="true"
                  size={8}
                  strokeWidth={1.05}
                  fill="currentColor"
                  className="ml-px text-white/[0.40]"
                />
              </span>

              <span className="text-[7px] uppercase tracking-[0.28em] text-white/[0.20] sm:tracking-[0.32em]">
                {copy.channel}
              </span>
            </motion.div>

            <motion.h2
              id="watch-title"
              initial={{
                opacity: 0,
                y: reducedMotion ? 0 : 18,
              }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.14 }}
              transition={{
                delay: reducedMotion ? 0 : 0.04,
                duration: reducedMotion ? 0 : 0.72,
                ease: EASE,
              }}
              className="mt-6 max-w-[760px] text-[clamp(2.8rem,8.4vw,6.4rem)] font-[430] uppercase leading-[0.86] tracking-[-0.06em] text-[var(--umbra-platinum)] sm:mt-7 sm:text-[clamp(3.1rem,5.8vw,6.4rem)]"
            >
              <span className="block">{copy.titleA}</span>
              <span
                className="block font-[400] italic"
                style={{
                  fontFamily:
                    'var(--font-umbra-serif), "Iowan Old Style", "Palatino Linotype", Georgia, serif',
                  color: "rgba(238,233,222,.58)",
                  letterSpacing: "-0.025em",
                }}
              >
                {copy.titleB}
              </span>
            </motion.h2>

            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{
                delay: reducedMotion ? 0 : 0.12,
                duration: reducedMotion ? 0 : 0.64,
                ease: EASE,
              }}
              className="mt-7 h-px max-w-[460px] origin-left"
              style={{
                background:
                  `linear-gradient(90deg, ${GOLD_LIGHT}48, rgba(255,255,255,.04), transparent)`,
              }}
            />

            <motion.p
              initial={{
                opacity: 0,
                y: reducedMotion ? 0 : 7,
              }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.14 }}
              transition={{
                delay: reducedMotion ? 0 : 0.18,
                duration: reducedMotion ? 0 : 0.52,
                ease: EASE,
              }}
              className="mt-5 max-w-[560px] text-[12px] leading-6 text-[var(--umbra-ink-muted)] sm:mt-6 sm:text-[14px] sm:leading-7"
            >
              {copy.body}
            </motion.p>

            <motion.a
              href={YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={copy.youtubeAria}
              initial={{
                opacity: 0,
                y: reducedMotion ? 0 : 7,
              }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.14 }}
              transition={{
                delay: reducedMotion ? 0 : 0.25,
                duration: reducedMotion ? 0 : 0.52,
                ease: EASE,
              }}
              className="group relative mt-7 inline-flex min-h-11 items-center gap-4 overflow-hidden border px-5 py-3 text-[8px] font-semibold uppercase tracking-[0.24em] outline-none transition-[transform,border-color,background-color] duration-300 hover:-translate-y-px focus-visible:ring-1 focus-visible:ring-[#dfc88f]/75 sm:mt-8 sm:px-6 sm:text-[9px] sm:tracking-[0.26em]"
              style={{
                borderColor: `${GOLD}55`,
                background: `${GOLD}03`,
                color: GOLD_LIGHT,
              }}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    `radial-gradient(circle at 50% 0%, ${GOLD}10, transparent 68%)`,
                }}
              />

              <span className="relative z-10">
                {copy.action}
              </span>

              <ArrowUpRight
                aria-hidden="true"
                size={14}
                strokeWidth={1.1}
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

          <motion.div
            initial={{
              opacity: 0,
              y: reducedMotion ? 0 : 18,
            }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.08 }}
            transition={{
              delay: reducedMotion ? 0 : 0.07,
              duration: reducedMotion ? 0 : 0.72,
              ease: EASE,
            }}
          >
            <PortalFrame
              locale={locale}
              reducedMotion={reducedMotion}
            />
          </motion.div>
        </div>

        <motion.div
          initial={{
            opacity: 0,
            y: reducedMotion ? 0 : 6,
          }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{
            delay: reducedMotion ? 0 : 0.06,
            duration: reducedMotion ? 0 : 0.48,
            ease: EASE,
          }}
          className="mt-12 flex flex-col gap-5 border-t border-white/[0.055] pt-6 sm:mt-16 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="h-px w-8"
              style={{ background: `${GOLD}3d` }}
            />
            <span
              className="umbra-code"
              style={{ color: `${GOLD_LIGHT}5e` }}
            >
              {copy.signal}
            </span>
          </div>

          <a
            href="#studio-bridge"
            className="group flex min-h-9 items-center gap-4 outline-none focus-visible:ring-1 focus-visible:ring-[#dfc88f]/70"
          >
            <span className="text-[7px] uppercase tracking-[0.24em] text-white/[0.16] transition-colors duration-300 group-hover:text-white/[0.40]">
              {copy.continue}
            </span>

            <motion.span
              animate={
                reducedMotion ? undefined : { y: [0, 2, 0] }
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
              style={{ borderColor: `${GOLD}1c` }}
            >
              <ArrowDown
                aria-hidden="true"
                size={13}
                strokeWidth={1.05}
                style={{ color: `${GOLD_LIGHT}70` }}
              />
            </motion.span>
          </a>
        </motion.div>

        <div
          id="studio-bridge"
          className="mt-9 flex items-center justify-between border-t border-white/[0.045] pt-5 sm:mt-10"
        >
          <span className="umbra-code text-white/[0.10]">
            {copy.bridge}
          </span>

          <span
            className="umbra-code"
            style={{ color: `${GOLD_LIGHT}32` }}
          >
            {copy.index}
          </span>
        </div>
      </div>
    </section>
  );
}
