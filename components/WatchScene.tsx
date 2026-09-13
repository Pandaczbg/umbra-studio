"use client";

import {
  ArrowDown,
  ArrowUpRight,
  Play,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
type Locale = "sr" | "en";

const GOLD = "#c7a96b";
const GOLD_LIGHT = "#ead39a";
const GOLD_DARK = "#8f7142";
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
    portalNote: "Sledeća scena čeka na drugoj strani",
    signal: "UMBRA / SIGNAL",
    continue: "SLEDEĆI KADAR",
    end: "KRAJ POČETNE STRANE",
    enter: "UĐI NA KANAL",
    transmission: "SIGNAL / UMBRA STUDIO",
    platform: "YOUTUBE",
    index: "05 / 05",
    mediaStatus: "KANAL SPREMAN",
    mediaLabel: "VIDEO / DISTRIBUCIJA",
    youtubeAria: "Otvori Umbra Studio YouTube kanal",
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
    portalNote: "The next scene waits on the other side",
    signal: "UMBRA / SIGNAL",
    continue: "NEXT FRAME",
    end: "END OF HOMEPAGE",
    enter: "ENTER CHANNEL",
    transmission: "SIGNAL / UMBRA STUDIO",
    platform: "YOUTUBE",
    index: "05 / 05",
    mediaStatus: "CHANNEL READY",
    mediaLabel: "VIDEO / DISTRIBUTION",
    youtubeAria: "Open the Umbra Studio YouTube channel",
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
      className="group block rounded-sm outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/70"
    >
      <div className="relative overflow-hidden border border-white/[0.075] bg-[#060606] shadow-[0_26px_80px_rgba(0,0,0,.24)] transition-[border-color,box-shadow,transform] duration-500 group-hover:-translate-y-1 group-hover:border-white/[0.14] group-hover:shadow-[0_34px_100px_rgba(0,0,0,.34)]">
        <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between border-b border-white/[0.055] px-5 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="h-[5px] w-[5px] rounded-full"
              style={{
                background: GOLD,
                boxShadow: `0 0 9px ${GOLD}35`,
              }}
            />
            <span className="font-mono text-[6px] uppercase tracking-[0.3em] text-white/[0.24]">
              {copy.mediaLabel}
            </span>
          </div>
          <span
            className="font-mono text-[6px] uppercase tracking-[0.26em]"
            style={{ color: `${GOLD_LIGHT}42` }}
          >
            {copy.index}
          </span>
        </div>

        <div className="relative aspect-[16/10] bg-[#040404] pt-10">
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 54% 48%, ${GOLD}08 0%, ${GOLD}02 28%, transparent 62%)`,
            }}
          />

          <div
            aria-hidden="true"
            className="absolute inset-[8%] border border-white/[0.035]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-[14%] border border-white/[0.045]"
          />

          <span
            aria-hidden="true"
            className="absolute left-[14%] top-[18%] h-9 w-9 border-l border-t"
            style={{ borderColor: `${GOLD}28` }}
          />
          <span
            aria-hidden="true"
            className="absolute right-[14%] top-[18%] h-9 w-9 border-r border-t border-white/[0.03]"
          />
          <span
            aria-hidden="true"
            className="absolute bottom-[18%] left-[14%] h-9 w-9 border-b border-l border-white/[0.025]"
          />
          <span
            aria-hidden="true"
            className="absolute bottom-[18%] right-[14%] h-9 w-9 border-b border-r"
            style={{ borderColor: `${GOLD_DARK}2d` }}
          />

          <div className="absolute inset-x-[18%] top-[23%] bottom-[23%] border border-white/[0.055]">
            <span
              aria-hidden="true"
              className="absolute left-0 top-0 h-6 w-6 border-l border-t"
              style={{ borderColor: `${GOLD}25` }}
            />
            <span
              aria-hidden="true"
              className="absolute right-0 bottom-0 h-6 w-6 border-b border-r border-white/[0.025]"
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span
                className="font-mono text-[6px] uppercase tracking-[0.34em]"
                style={{ color: `${GOLD_LIGHT}58` }}
              >
                {copy.mediaStatus}
              </span>

              <motion.div
                initial={false}
                animate={
                  reducedMotion
                    ? { scale: 1 }
                    : { scale: [1, 1.02, 1] }
                }
                transition={
                  reducedMotion
                    ? undefined
                    : {
                        duration: 3.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }
                }
                className="relative mt-5 flex h-[62px] w-[62px] items-center justify-center border border-white/[0.1] bg-black/25 sm:h-[70px] sm:w-[70px]"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-[-7px] border border-[#c7a96b]/[0.08]"
                />
                <Play
                  aria-hidden="true"
                  size={17}
                  strokeWidth={1.05}
                  fill="currentColor"
                  className="ml-[2px] text-white/[0.48] transition-colors duration-300 group-hover:text-[#ead39a]/90"
                />
              </motion.div>

              <span className="mt-5 max-w-[300px] text-[10px] leading-5 text-white/[0.24] sm:text-[11px]">
                {copy.portalNote}
              </span>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-5 bottom-4 flex items-center justify-between gap-4 sm:inset-x-6">
            <span className="font-mono text-[6px] uppercase tracking-[0.28em] text-white/[0.16]">
              {copy.transmission}
            </span>
            <span
              className="font-mono text-[6px] uppercase tracking-[0.24em]"
              style={{ color: `${GOLD_LIGHT}42` }}
            >
              {copy.platform}
            </span>
          </div>

          <span
            aria-hidden="true"
            className="absolute left-0 top-0 h-px w-full origin-left scale-x-[0.12] transition-transform duration-500 group-hover:scale-x-100"
            style={{
              background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT}38, transparent 80%)`,
            }}
          />
          <span
            aria-hidden="true"
            className="absolute bottom-0 right-0 h-px w-full origin-right scale-x-[0.12] transition-transform duration-500 group-hover:scale-x-100"
            style={{ background: `linear-gradient(90deg, transparent, ${GOLD})` }}
          />
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-white/[0.055] px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="h-px w-8"
              style={{ background: `${GOLD}42` }}
            />
            <span className="text-[7px] uppercase tracking-[0.27em] text-white/[0.18]">
              {copy.portal}
            </span>
          </div>

          <span
            className="flex items-center gap-2 text-[7px] uppercase tracking-[0.27em]"
            style={{ color: `${GOLD_LIGHT}62` }}
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
      className="relative scroll-mt-[170px] overflow-x-clip border-b border-white/[0.055] bg-[#050505]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute left-[63%] top-[26%] h-[720px] w-[720px] -translate-x-1/2 rounded-full"
          style={{
            background: `radial-gradient(circle, ${GOLD}05 0%, ${GOLD}014 34%, transparent 72%)`,
            filter: "blur(96px)",
          }}
        />

        <div
          className="absolute -left-[20%] top-[20%] h-[620px] w-[620px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,.010), transparent 70%)",
            filter: "blur(100px)",
          }}
        />

        <div
          className="absolute right-[-8%] bottom-[-24%] h-[520px] w-[680px] rounded-full"
          style={{
            background: `radial-gradient(ellipse, ${GOLD}012, transparent 74%)`,
            filter: "blur(90px)",
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

      <div className="relative z-10 mx-auto w-full max-w-[1500px] px-6 py-24 sm:px-9 sm:py-28 lg:px-12 lg:py-32 xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: reducedMotion ? 0 : 0.5, ease: EASE }}
          className="flex items-center justify-between border-b border-white/[0.055] pb-5"
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
              className="font-mono text-[7px] tracking-[0.4em]"
              style={{ color: `${GOLD_LIGHT}82` }}
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

        <div className="mt-14 grid items-center gap-14 lg:grid-cols-2 lg:gap-16 xl:mt-20 xl:gap-20">
          <div>
            <motion.div
              initial={{ opacity: 0, x: reducedMotion ? 0 : -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.14 }}
              transition={{ duration: reducedMotion ? 0 : 0.62, ease: EASE }}
              className="flex items-center gap-3"
            >
              <span
                aria-hidden="true"
                className="flex h-5 w-5 items-center justify-center border"
                style={{ borderColor: `${GOLD}28` }}
              >
                <Play
                  aria-hidden="true"
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
              initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.14 }}
              transition={{
                delay: reducedMotion ? 0 : 0.05,
                duration: reducedMotion ? 0 : 0.78,
                ease: EASE,
              }}
              className="mt-7 max-w-[800px] text-[clamp(3.8rem,7.4vw,8.4rem)] font-[420] uppercase leading-[0.79] tracking-[-0.084em] text-white"
            >
              <span className="block">{copy.titleA}</span>
              <span className="block font-serif font-normal italic text-white/[0.56]">
                {copy.titleB}
              </span>
            </motion.h2>

            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{
                delay: reducedMotion ? 0 : 0.14,
                duration: reducedMotion ? 0 : 0.68,
                ease: EASE,
              }}
              className="mt-9 h-px w-full max-w-[520px] origin-left"
              style={{
                background: `linear-gradient(90deg, ${GOLD}60, rgba(255,255,255,.05), transparent)`,
              }}
            />

            <motion.p
              initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.14 }}
              transition={{
                delay: reducedMotion ? 0 : 0.21,
                duration: reducedMotion ? 0 : 0.56,
                ease: EASE,
              }}
              className="mt-7 max-w-[590px] text-[13px] leading-7 text-white/[0.37] sm:text-[14px] sm:leading-8"
            >
              {copy.body}
            </motion.p>

            <motion.a
              href={YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={copy.youtubeAria}
              initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.14 }}
              transition={{
                delay: reducedMotion ? 0 : 0.32,
                duration: reducedMotion ? 0 : 0.54,
                ease: EASE,
              }}
              className="group relative mt-9 inline-flex min-h-12 items-center gap-4 overflow-hidden border px-6 py-3 text-[9px] font-semibold uppercase tracking-[0.27em] transition-[transform,border-color,background-color] duration-300 hover:-translate-y-px focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/70"
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
                  background: `radial-gradient(circle at 50% 0%, ${GOLD}12, transparent 68%)`,
                }}
              />
              <span className="relative z-10">{copy.action}</span>
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
                  background: `linear-gradient(90deg, ${GOLD_LIGHT}, ${GOLD}, transparent)`,
                }}
              />
            </motion.a>
          </div>

          <motion.div
            initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.08 }}
            transition={{
              delay: reducedMotion ? 0 : 0.08,
              duration: reducedMotion ? 0 : 0.78,
              ease: EASE,
            }}
          >
            <PortalFrame locale={locale} reducedMotion={reducedMotion} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: reducedMotion ? 0 : 7 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08 }}
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
              style={{ background: `${GOLD}42` }}
            />
            <span
              className="font-mono text-[6px] uppercase tracking-[0.3em]"
              style={{ color: `${GOLD_LIGHT}5e` }}
            >
              {copy.signal}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[7px] uppercase tracking-[0.26em] text-white/[0.14]">
              {copy.continue}
            </span>
            {!reducedMotion && (
              <motion.span
                animate={{ y: [0, 2, 0] }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="flex h-8 w-8 items-center justify-center border"
                style={{ borderColor: `${GOLD}20` }}
              >
                <ArrowDown
                  aria-hidden="true"
                  size={13}
                  strokeWidth={1.05}
                  style={{ color: `${GOLD_LIGHT}78` }}
                />
              </motion.span>
            )}
          </div>
        </motion.div>

        <div className="mt-12 flex items-center justify-between border-t border-white/[0.05] pt-5">
          <span className="font-mono text-[6px] uppercase tracking-[0.3em] text-white/[0.1]">
            {copy.end}
          </span>
          <span
            className="font-mono text-[6px] uppercase tracking-[0.26em]"
            style={{ color: `${GOLD_LIGHT}36` }}
          >
            {copy.index}
          </span>
        </div>
      </div>
    </section>
  );
}
