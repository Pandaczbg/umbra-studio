"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Pause,
  Play,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { Locale } from "@/data/translations";

const GOLD = "#c7a96b";
const GOLD_LIGHT = "#ead39a";
const GOLD_DARK = "#8f7142";
const HERO_IMAGE = "/umbra-background.png";
const AUTO_ROTATE_MS = 30_000;

const EASE = [0.22, 1, 0.36, 1] as const;

interface HeroItem {
  id: string;
  number: string;
  tab: string;
  eyebrow: string;
  category: string;
  title: string;
  description: string;
  image: string;
  href: string;
  cta: string;
  meta: string;
  external?: boolean;
}

const ITEMS_SR: HeroItem[] = [
  {
    id: "aktuelno",
    number: "01",
    tab: "AKTUELNO",
    eyebrow: "SERIJA U PRODUKCIJI",
    category: "U FOKUSU",
    title: "MRZIM SVOG BRATA",
    description:
      "Priča o porodici, odnosima i onome što ostaje među ljudima kada se stare rane ponovo otvore.",
    image: HERO_IMAGE,
    href: "/serije/mrzim-svog-brata",
    cta: "Uđi u priču",
    meta: "SER / 01",
  },
  {
    id: "novo",
    number: "02",
    tab: "NOVO",
    eyebrow: "NOVA EPIZODA",
    category: "NAJNOVIJE",
    title: "NOVA EPIZODA",
    description:
      "Nastavak priče. Nova epizoda otvara sledeći trenutak i vodi priču korak dalje.",
    image: HERO_IMAGE,
    href: "/serije/mrzim-svog-brata",
    cta: "Pogledaj više",
    meta: "EP / 02",
  },
  {
    id: "likovi",
    number: "03",
    tab: "LIKOVI",
    eyebrow: "KARAKTERI I ODNOSI",
    category: "LJUDI U PRIČI",
    title: "LIKOVI",
    description:
      "Upoznaj ljude oko kojih se grade odnosi, sukobi i trenuci koji menjaju tok priče.",
    image: HERO_IMAGE,
    href: "/likovi",
    cta: "Upoznaj likove",
    meta: "CHR / 03",
  },
  {
    id: "arhiva",
    number: "04",
    tab: "IZ ARHIVE",
    eyebrow: "ODABRANI PROJEKTI",
    category: "PRIČE KOJE OSTAJU",
    title: "ARHIVA",
    description:
      "Projekti i priče koje ostaju dostupni i onda kada više nisu novi.",
    image: HERO_IMAGE,
    href: "/serije",
    cta: "Otvori arhivu",
    meta: "ARC / 04",
  },
  {
    id: "gledaj",
    number: "05",
    tab: "GLEDAJ",
    eyebrow: "VIDEO",
    category: "UMBRA NA YOUTUBE-U",
    title: "GLEDAJ UMBRU",
    description:
      "Epizode, kratki kadrovi i novi sadržaj objavljen na Umbra kanalu.",
    image: HERO_IMAGE,
    href: "https://www.youtube.com/@umbrastud",
    cta: "Otvori kanal",
    meta: "YT / 05",
    external: true,
  },
];

const ITEMS_EN: HeroItem[] = [
  {
    id: "featured",
    number: "01",
    tab: "FEATURED",
    eyebrow: "SERIES IN PRODUCTION",
    category: "IN FOCUS",
    title: "MRZIM SVOG BRATA",
    description:
      "A story about family, relationships and what remains between people when old wounds open again.",
    image: HERO_IMAGE,
    href: "/en/projects/mrzim-svog-brata",
    cta: "Enter the story",
    meta: "SER / 01",
  },
  {
    id: "new",
    number: "02",
    tab: "NEW",
    eyebrow: "NEW EPISODE",
    category: "LATEST",
    title: "NEW EPISODE",
    description:
      "The story continues. A new episode opens the next moment and moves the story forward.",
    image: HERO_IMAGE,
    href: "/en/projects/mrzim-svog-brata",
    cta: "View more",
    meta: "EP / 02",
  },
  {
    id: "characters",
    number: "03",
    tab: "CHARACTERS",
    eyebrow: "CHARACTER & RELATIONSHIPS",
    category: "PEOPLE IN THE STORY",
    title: "CHARACTERS",
    description:
      "Meet the people around whom relationships, conflicts and turning points are built.",
    image: HERO_IMAGE,
    href: "/en/characters",
    cta: "Meet the characters",
    meta: "CHR / 03",
  },
  {
    id: "archive",
    number: "04",
    tab: "ARCHIVE",
    eyebrow: "SELECTED PROJECTS",
    category: "STORIES THAT REMAIN",
    title: "ARCHIVE",
    description:
      "Projects and stories that remain available long after they stop being new.",
    image: HERO_IMAGE,
    href: "/en/projects",
    cta: "Open archive",
    meta: "ARC / 04",
  },
  {
    id: "watch",
    number: "05",
    tab: "WATCH",
    eyebrow: "VIDEO",
    category: "UMBRA ON YOUTUBE",
    title: "WATCH UMBRA",
    description:
      "Episodes, short scenes and new content published on the Umbra channel.",
    image: HERO_IMAGE,
    href: "https://www.youtube.com/@umbrastud",
    cta: "Open channel",
    meta: "YT / 05",
    external: true,
  },
];

function getTitleLines(title: string): [string, string | null] {
  const words = title.trim().split(/\s+/);

  if (words.length <= 1) return [title, null];
  if (words.length === 2) return [words[0], words[1]];
  if (words.length === 3) return [words[0], words.slice(1).join(" ")];

  const split = Math.ceil(words.length / 2);
  return [words.slice(0, split).join(" "), words.slice(split).join(" ")];
}

export default function HomeHero({ locale = "sr" }: { locale?: Locale }) {
  const reducedMotion = useReducedMotion() ?? false;
  const items = useMemo(() => (locale === "en" ? ITEMS_EN : ITEMS_SR), [locale]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(!reducedMotion);
  const [isHovering, setIsHovering] = useState(false);
  const [ready, setReady] = useState(false);
  const [imageLayer, setImageLayer] = useState(0);
  const [imageA, setImageA] = useState(HERO_IMAGE);
  const [imageB, setImageB] = useState(HERO_IMAGE);

  const activeIndexRef = useRef(activeIndex);
  const imageLayerRef = useRef(imageLayer);
  const timerRef = useRef<number | null>(null);
  const startedAtRef = useRef(0);
  const remainingRef = useRef(AUTO_ROTATE_MS);

  const activeItem = items[activeIndex];
  const [titleLineOne, titleLineTwo] = getTitleLines(activeItem.title);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    imageLayerRef.current = imageLayer;
  }, [imageLayer]);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const changeItem = useCallback(
    (nextIndex: number, resetTimer = true) => {
      const normalized = (nextIndex + items.length) % items.length;
      if (normalized === activeIndexRef.current) return;

      const nextItem = items[normalized];

      if (imageLayerRef.current === 0) {
        setImageB(nextItem.image);
        imageLayerRef.current = 1;
        setImageLayer(1);
      } else {
        setImageA(nextItem.image);
        imageLayerRef.current = 0;
        setImageLayer(0);
      }

      activeIndexRef.current = normalized;
      setActiveIndex(normalized);

      if (resetTimer) {
        remainingRef.current = AUTO_ROTATE_MS;
        startedAtRef.current = Date.now();
      }
    },
    [items],
  );

  const next = useCallback(() => changeItem(activeIndexRef.current + 1), [changeItem]);
  const previous = useCallback(() => changeItem(activeIndexRef.current - 1), [changeItem]);
  const togglePlayback = useCallback(() => setIsPlaying((value) => !value), []);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), reducedMotion ? 20 : 120);
    return () => window.clearTimeout(timer);
  }, [reducedMotion]);

  useEffect(() => {
    const urls = Array.from(new Set(items.map((item) => item.image).filter(Boolean)));
    urls.forEach((url) => {
      const image = new window.Image();
      image.decoding = "async";
      image.src = url;
    });
  }, [items]);

  useEffect(() => {
    if (reducedMotion) return;

    clearTimer();
    if (!isPlaying || isHovering) return;

    const schedule = () => {
      const remaining = Math.max(300, remainingRef.current);
      startedAtRef.current = Date.now();

      timerRef.current = window.setTimeout(() => {
        timerRef.current = null;
        changeItem(activeIndexRef.current + 1, true);
        schedule();
      }, remaining);
    };

    schedule();
    return () => clearTimer();
  }, [changeItem, clearTimer, isHovering, isPlaying, reducedMotion]);

  useEffect(() => {
    if (reducedMotion && isPlaying) setIsPlaying(false);
  }, [isPlaying, reducedMotion]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const handlePointerEnter = useCallback(() => {
    if (!reducedMotion && isPlaying) {
      const elapsed = Date.now() - startedAtRef.current;
      remainingRef.current = Math.max(300, remainingRef.current - elapsed);
    }
    clearTimer();
    setIsHovering(true);
  }, [clearTimer, isPlaying, reducedMotion]);

  const handlePointerLeave = useCallback(() => {
    if (!reducedMotion && isPlaying) startedAtRef.current = Date.now();
    setIsHovering(false);
  }, [isPlaying, reducedMotion]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT" ||
        target?.isContentEditable;

      if (typing) return;

      const hero = target?.closest('[data-umbra-scene="hero"]');
      if (!hero) return;

      switch (event.key) {
        case "ArrowRight":
          event.preventDefault();
          next();
          break;
        case "ArrowLeft":
          event.preventDefault();
          previous();
          break;
        case " ":
          event.preventDefault();
          togglePlayback();
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [next, previous, togglePlayback]);

  const renderCTA = () => {
    const className =
      "group/cta relative inline-flex h-11 items-center gap-4 overflow-hidden text-[10px] font-medium uppercase tracking-[0.22em] transition-colors duration-500 sm:text-[11px]";

    const content = (
      <>
        <span className="relative z-10">{activeItem.cta}</span>
        <span
          aria-hidden="true"
          className="relative z-10 flex h-7 w-7 items-center justify-center text-white/45 transition-all duration-500 group-hover/cta:translate-x-1 group-hover/cta:text-white"
        >
          <ArrowUpRight size={15} strokeWidth={1} />
        </span>
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-px w-12 transition-[width] duration-700 group-hover/cta:w-full"
          style={{
            background: `linear-gradient(90deg, ${GOLD_LIGHT}, ${GOLD}, transparent)`,
          }}
        />
      </>
    );

    if (activeItem.external) {
      return (
        <a href={activeItem.href} target="_blank" rel="noreferrer" className={className} style={{ color: GOLD_LIGHT }}>
          {content}
        </a>
      );
    }

    return (
      <Link href={activeItem.href} className={className} style={{ color: GOLD_LIGHT }}>
        {content}
      </Link>
    );
  };

  return (
    <section
      data-umbra-scene="hero"
      aria-labelledby="umbra-hero-title"
      className="relative min-h-[100svh] overflow-hidden bg-[#020202] text-white"
      onMouseEnter={handlePointerEnter}
      onMouseLeave={handlePointerLeave}
      onFocusCapture={() => setIsHovering(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          handlePointerLeave();
        }
      }}
    >
      {/* Full-bleed cinematic background. The existing artwork is allowed to breathe. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[3%]">
          <Image
            src={imageA}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{
              objectPosition: "center center",
              opacity: imageLayer === 0 ? 1 : 0,
              transform:
                "translate3d(0, calc(var(--umbra-scroll-y, 0px) * 0.008), 0) scale(1.025)",
              transition: reducedMotion
                ? "none"
                : "opacity 1500ms cubic-bezier(.22,1,.36,1)",
              willChange: "opacity, transform",
            }}
          />
        </div>

        <div className="absolute -inset-[3%]">
          <Image
            src={imageB}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            style={{
              objectPosition: "center center",
              opacity: imageLayer === 1 ? 1 : 0,
              transform:
                "translate3d(0, calc(var(--umbra-scroll-y, 0px) * 0.008), 0) scale(1.025)",
              transition: reducedMotion
                ? "none"
                : "opacity 1500ms cubic-bezier(.22,1,.36,1)",
              willChange: "opacity, transform",
            }}
          />
        </div>

        {/* One cinematic grade, not a stack of UI overlays. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,.88) 0%, rgba(0,0,0,.60) 29%, rgba(0,0,0,.12) 63%, rgba(0,0,0,.36) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,.56) 0%, rgba(0,0,0,.03) 30%, rgba(0,0,0,.10) 58%, rgba(0,0,0,.82) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at var(--umbra-pointer-x, 68%) var(--umbra-pointer-y, 28%), rgba(234,211,154,.045), transparent 24%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{ boxShadow: "inset 0 0 170px rgba(0,0,0,.58)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.035] mix-blend-soft-light"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,.22) .5px, transparent .6px)",
            backgroundSize: "4px 4px",
          }}
        />
      </div>

      {/* Subtle editorial locator. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.7, ease: EASE }}
        className="relative z-30 mx-auto max-w-[1680px] px-6 pt-24 sm:px-9 lg:px-12 lg:pt-28 xl:px-16"
      >
        <div className="flex items-center gap-4">
          <span
            className="font-mono text-[8px] tracking-[0.32em]"
            style={{ color: `${GOLD_LIGHT}78` }}
          >
            {activeItem.number}
          </span>
          <span
            className="h-px w-12"
            style={{ background: `linear-gradient(90deg, ${GOLD}70, transparent)` }}
          />
          <span className="text-[9px] font-medium uppercase tracking-[0.28em] text-white/35">
            {activeItem.eyebrow}
          </span>
        </div>
      </motion.div>

      {/* Primary statement. */}
      <div className="relative z-30 mx-auto flex min-h-[calc(100svh-7rem)] max-w-[1680px] items-end px-6 pb-24 sm:px-9 lg:pb-28 lg:px-12 xl:px-16">
        <motion.div
          key={activeItem.id}
          initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.72, ease: EASE }}
          className="w-full max-w-[940px]"
        >
          <h1
            id="umbra-hero-title"
            className="uppercase text-white"
            style={{
              fontFamily: '"Helvetica Neue", "Arial Narrow", Arial, sans-serif',
              fontSize: "clamp(4.25rem, 8.1vw, 10rem)",
              fontWeight: 500,
              lineHeight: 0.78,
              letterSpacing: "-0.075em",
              textWrap: "balance",
            }}
          >
            <span className="block overflow-hidden">
              <motion.span
                key={`${activeItem.id}-one`}
                className="block"
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.9, ease: EASE }}
              >
                {titleLineOne}
              </motion.span>
            </span>

            {titleLineTwo && (
              <span className="block overflow-hidden">
                <motion.span
                  key={`${activeItem.id}-two`}
                  className="block text-white/[0.94]"
                  initial={{ y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{
                    delay: reducedMotion ? 0 : 0.045,
                    duration: reducedMotion ? 0 : 0.95,
                    ease: EASE,
                  }}
                >
                  {titleLineTwo}
                </motion.span>
              </span>
            )}
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reducedMotion ? 0 : 0.38, duration: reducedMotion ? 0 : 0.6, ease: EASE }}
            className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2"
          >
            <span
              className="font-serif text-[clamp(1.05rem,1.55vw,1.35rem)] italic"
              style={{ color: `${GOLD_LIGHT}b0` }}
            >
              {activeItem.category}
            </span>
            <span className="h-px w-10" style={{ background: `linear-gradient(90deg, ${GOLD}60, transparent)` }} />
            <span className="font-mono text-[7px] uppercase tracking-[0.28em] text-white/30">
              {activeItem.meta}
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reducedMotion ? 0 : 0.5, duration: reducedMotion ? 0 : 0.6, ease: EASE }}
            className="mt-5 max-w-[560px] text-[12px] leading-7 text-white/[0.48]"
          >
            {activeItem.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reducedMotion ? 0 : 0.62, duration: reducedMotion ? 0 : 0.6, ease: EASE }}
            className="mt-7 flex items-center gap-7"
          >
            {renderCTA()}
            <span className="hidden font-mono text-[7px] uppercase tracking-[0.28em] text-white/20 sm:block">
              {locale === "en" ? "Explore the archive" : "Istraži priču"}
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Readable story selector. */}
      <motion.nav
        aria-label={locale === "en" ? "Hero stories" : "Hero priče"}
        initial={{ opacity: 0, x: 14 }}
        animate={{ opacity: ready ? 1 : 0, x: ready ? 0 : 14 }}
        transition={{ delay: reducedMotion ? 0 : 0.5, duration: reducedMotion ? 0 : 0.75, ease: EASE }}
        className="absolute bottom-24 right-6 z-40 hidden lg:right-12 lg:block xl:right-16"
      >
        <div className="flex min-w-[190px] flex-col items-stretch">
          <div className="mb-4 flex items-center justify-between gap-8 border-b border-white/10 pb-3">
            <span className="text-[8px] font-medium uppercase tracking-[0.26em] text-white/45">
              {locale === "en" ? "Explore" : "Istraži"}
            </span>
            <button
              type="button"
              onClick={togglePlayback}
              aria-label={
                isPlaying
                  ? locale === "en" ? "Pause automatic rotation" : "Pauziraj automatsku rotaciju"
                  : locale === "en" ? "Start automatic rotation" : "Pokreni automatsku rotaciju"
              }
              className="text-white/35 transition-colors hover:text-white"
            >
              {isPlaying ? <Pause size={11} strokeWidth={1.2} /> : <Play size={11} strokeWidth={1.2} />}
            </button>
          </div>

          <div className="space-y-1">
            {items.map((item, index) => {
              const active = index === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onMouseEnter={() => changeItem(index)}
                  onClick={() => changeItem(index)}
                  aria-label={item.tab}
                  aria-current={active ? "true" : undefined}
                  className="group flex w-full items-center gap-3 py-2 text-left"
                >
                  <span
                    className="w-6 font-mono text-[8px] tracking-[0.22em]"
                    style={{ color: active ? GOLD_LIGHT : "rgba(255,255,255,.28)" }}
                  >
                    {item.number}
                  </span>
                  <span
                    className="h-px transition-all duration-500"
                    style={{
                      width: active ? 38 : 18,
                      background: active ? GOLD_LIGHT : "rgba(255,255,255,.18)",
                    }}
                  />
                  <span
                    className="text-[9px] font-medium uppercase tracking-[0.22em] transition-colors duration-300"
                    style={{ color: active ? "rgba(255,255,255,.88)" : "rgba(255,255,255,.36)" }}
                  >
                    {item.tab}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center gap-3 border-t border-white/10 pt-3">
            <span className="text-[7px] uppercase tracking-[0.2em] text-white/22">
              {isPlaying ? (locale === "en" ? "Auto" : "Auto") : locale === "en" ? "Paused" : "Pauza"}
            </span>
            <span className="h-px flex-1 overflow-hidden bg-white/10">
              <motion.span
                className="block h-px origin-left"
                animate={{ scaleX: isPlaying && !isHovering ? 1 : 0 }}
                transition={{ duration: AUTO_ROTATE_MS / 1000, ease: "linear" }}
                style={{ background: `linear-gradient(90deg, ${GOLD_DARK}, ${GOLD_LIGHT})` }}
              />
            </span>
          </div>
        </div>
      </motion.nav>

      {/* Quiet discovery controls. */}
      <div className="pointer-events-none absolute bottom-7 left-6 right-6 z-40 sm:left-9 sm:right-9 lg:left-12 lg:right-12 xl:left-16 xl:right-16">
        <div className="flex items-end justify-between">
          <span className="hidden text-[8px] uppercase tracking-[0.26em] text-white/20 lg:block">
            UMBRA STUDIO
          </span>

          <div className="absolute left-1/2 -translate-x-1/2">
            <div className="flex flex-col items-center gap-2">
              <span className="text-[8px] uppercase tracking-[0.28em] text-white/25">
                {locale === "en" ? "Scroll to explore" : "Skroluj za istraživanje"}
              </span>
              {!reducedMotion && (
                <motion.span
                  animate={{ y: [0, 4, 0], opacity: [0.18, 0.6, 0.18] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowDown size={11} strokeWidth={1.15} style={{ color: `${GOLD_LIGHT}60` }} />
                </motion.span>
              )}
            </div>
          </div>

          <div className="pointer-events-auto hidden items-center gap-1 lg:flex">
            <button
              type="button"
              onClick={previous}
              aria-label={locale === "en" ? "Previous story" : "Prethodna priča"}
              className="flex h-7 w-7 items-center justify-center text-white/30 transition-colors hover:text-white"
            >
              <ArrowLeft size={11} strokeWidth={1.1} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label={locale === "en" ? "Next story" : "Sledeća priča"}
              className="flex h-7 w-7 items-center justify-center text-white/30 transition-colors hover:text-white"
            >
              <ArrowRight size={11} strokeWidth={1.1} />
            </button>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 right-0 z-50 h-px bg-white/[0.025]">
        <motion.div
          className="h-full origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: ready ? 1 : 0 }}
          transition={{ delay: reducedMotion ? 0 : 0.35, duration: reducedMotion ? 0 : 1, ease: EASE }}
          style={{
            width: "34%",
            background: `linear-gradient(90deg, transparent, ${GOLD_DARK}, ${GOLD_LIGHT}, transparent)`,
          }}
        />
      </div>

      {!reducedMotion && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[60] bg-[#020202]"
          initial={{ opacity: 1 }}
          animate={{ opacity: ready ? 0 : 1 }}
          transition={{ delay: 0.02, duration: 0.5, ease: EASE }}
        />
      )}
    </section>
  );
}
