"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  Play,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { LocalizedText } from "@/lib/content/types";
import LatestContentWindow from "@/components/LatestContentWindow";
import type { LatestContent } from "@/lib/content/latest";

const GOLD = "#c4a56b";
const GOLD_LIGHT = "#dfc88f";
const GOLD_DARK = "#8d6f43";
const BACKGROUND_IMAGE = "/umbra-background.png";
const YOUTUBE_CHANNEL = "https://www.youtube.com/@umbrastud";
const AUTO_ROTATE_MS = 9000;
const EASE = [0.22, 1, 0.36, 1] as const;

type Locale = "sr" | "en";
type WindowType = "image" | "youtube" | "page";

type HeroPanel = {
  id: string;
  number: string;
  tab: string;
  eyebrow: string;
  category: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  mediaLabel: string;
  type: WindowType;
  image?: string;
  youtubeUrl?: string;
  external?: boolean;
  latestContent?: readonly LatestContent[];
};

function getLocalizedText(
  value: LocalizedText | undefined,
  locale: Locale,
  fallback = "",
) {
  if (!value) return fallback;
  return value[locale] || value.sr || value.en || fallback;
}

function getYouTubeId(url?: string) {
  if (!url) return null;

  const patterns = [
    /youtu\.be\/([^?&/]+)/i,
    /youtube\.com\/watch\?v=([^?&/]+)/i,
    /youtube\.com\/embed\/([^?&/]+)/i,
    /youtube\.com\/shorts\/([^?&/]+)/i,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }

  return null;
}

function buildPanels(
  locale: Locale,
  latestContent: readonly LatestContent[],
): HeroPanel[] {
  const latest = latestContent[0] ?? null;
  const title = latest
    ? getLocalizedText(latest.title, locale)
    : locale === "en"
      ? "LATEST"
      : "AKTUELNO";
  const description = latest
    ? getLocalizedText(
        latest.shortDescription ?? latest.description,
        locale,
        locale === "en"
          ? "The two newest public pieces in the Umbra editorial feed."
          : "Dva najnovija javno objavljena sadržaja u Umbra uređivačkom toku.",
      )
    : locale === "en"
      ? "The two newest public pieces in the Umbra editorial feed."
      : "Dva najnovija javno objavljena sadržaja u Umbra uređivačkom toku.";

  const latestHref = locale === "en" ? "/en/latest" : "/aktuelno";

  if (locale === "en") {
    return [
      {
        id: "featured",
        number: "01",
        tab: "FEATURED",
        eyebrow: "LATEST PUBLISHED",
        category: "LIVE EDITORIAL FEED",
        title,
        description,
        href: latestHref,
        cta: "Open latest",
        mediaLabel: "LATEST CONTENT",
        type: "page",
        image: BACKGROUND_IMAGE,
        latestContent,
      },
      {
        id: "series",
        number: "02",
        tab: "SERIES",
        eyebrow: "SERIES ARCHIVE",
        category: "THE STORY WORLD",
        title: "SERIES",
        description:
          "Explore the productions and worlds being developed inside Umbra Studio.",
        href: "/en/projects",
        cta: "Explore projects",
        mediaLabel: "SERIES INDEX",
        type: "page",
        image: BACKGROUND_IMAGE,
      },
      {
        id: "characters",
        number: "03",
        tab: "CHARACTERS",
        eyebrow: "CHARACTER & RELATIONSHIPS",
        category: "PEOPLE IN THE STORY",
        title: "CHARACTERS",
        description:
          "Meet the people and relationships that shape the stories behind the images.",
        href: "/en/characters",
        cta: "Meet characters",
        mediaLabel: "CHARACTER INDEX",
        type: "page",
        image: BACKGROUND_IMAGE,
      },
      {
        id: "archive",
        number: "04",
        tab: "ARCHIVE",
        eyebrow: "SELECTED WORK",
        category: "STORIES THAT REMAIN",
        title: "ARCHIVE",
        description:
          "A quieter space for projects, notes and stories that remain part of the Umbra world.",
        href: "/en/archive",
        cta: "Open archive",
        mediaLabel: "ARCHIVE WINDOW",
        type: "page",
        image: BACKGROUND_IMAGE,
      },
      {
        id: "watch",
        number: "05",
        tab: "WATCH",
        eyebrow: "UMBRA ON YOUTUBE",
        category: "VIDEO",
        title: "WATCH UMBRA",
        description:
          "When a concrete episode or film is selected, its YouTube player lives here. The channel remains one click away.",
        href: YOUTUBE_CHANNEL,
        cta: "Open YouTube",
        mediaLabel: "YOUTUBE WINDOW",
        type: "youtube",
        external: true,
      },
    ];
  }

  return [
    {
      id: "aktuelno",
      number: "01",
      tab: "AKTUELNO",
      eyebrow: "NAJNOVIJE OBJAVLJENO",
      category: "AKTUELNI SADRŽAJ",
      title,
      description,
      href: latestHref,
      cta: "Otvori aktuelno",
      mediaLabel: "NAJNOVIJI SADRŽAJ",
      type: "page",
      image: BACKGROUND_IMAGE,
      latestContent,
    },
    {
      id: "serije",
      number: "02",
      tab: "SERIJE",
      eyebrow: "ARHIVA SERIJA",
      category: "SVETOVI PRIČA",
      title: "SERIJE",
      description:
        "Istraži serije i produkcije koje Umbra razvija, jednu priču po jednu.",
      href: "/serije",
      cta: "Pogledaj serije",
      mediaLabel: "INDEKS SERIJA",
      type: "page",
      image: BACKGROUND_IMAGE,
    },
    {
      id: "likovi",
      number: "03",
      tab: "LIKOVI",
      eyebrow: "KARAKTERI I ODNOSI",
      category: "LJUDI U PRIČI",
      title: "LIKOVI",
      description:
        "Upoznaj ljude i odnose koji nose težinu priča koje Umbra gradi.",
      href: "/likovi",
      cta: "Upoznaj likove",
      mediaLabel: "INDEKS LIKOVA",
      type: "page",
      image: BACKGROUND_IMAGE,
    },
    {
      id: "arhiva",
      number: "04",
      tab: "ARHIVA",
      eyebrow: "ODABRANI SADRŽAJ",
      category: "PRIČE KOJE OSTAJU",
      title: "ARHIVA",
      description:
        "Mirniji sloj Umbra sveta — projekti, zapisi i priče koje ostaju dostupni.",
      href: "/arhiva",
      cta: "Otvori arhivu",
      mediaLabel: "PROZOR ARHIVE",
      type: "page",
      image: BACKGROUND_IMAGE,
    },
    {
      id: "gledaj",
      number: "05",
      tab: "GLEDAJ",
      eyebrow: "UMBRA NA YOUTUBE-U",
      category: "VIDEO",
      title: "GLEDAJ UMBRU",
      description:
        "Kada je konkretan video aktuelan, njegov YouTube player preuzima ovaj prozor.",
      href: YOUTUBE_CHANNEL,
      cta: "Otvori kanal",
      mediaLabel: "YOUTUBE PROZOR",
      type: "youtube",
      external: true,
    },
  ];
}

function MediaWindow({
  panel,
  locale,
}: {
  panel: HeroPanel;
  locale: Locale;
}) {
  const youtubeId = getYouTubeId(panel.youtubeUrl);
  const mediaIsClickable = panel.type !== "youtube" && !panel.latestContent;

  return (
    <div className="relative overflow-hidden border border-white/[0.085] bg-[#070707] shadow-[0_24px_70px_rgba(0,0,0,.34)]">
      <div className="relative aspect-[1.06/0.9] overflow-hidden sm:aspect-[1.08/0.88] lg:aspect-[1.12/0.9]">
        {panel.latestContent ? (
          <LatestContentWindow locale={locale} content={panel.latestContent} />
        ) : panel.type === "youtube" && youtubeId ? (
          <iframe
            title={`${panel.title} YouTube video`}
            src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1&playsinline=1`}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <>
            <Image
              src={panel.image ?? BACKGROUND_IMAGE}
              alt=""
              fill
              sizes="(min-width: 1280px) 41vw, (min-width: 1024px) 46vw, 94vw"
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.012]"
              priority
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.04),transparent_32%,rgba(0,0,0,.84)_100%)]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.42),transparent_62%,rgba(0,0,0,.20)_100%)]"
            />
          </>
        )}

        {!youtubeId && panel.type === "youtube" ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/[0.18] px-8 text-center">
            <span
              className="flex h-14 w-14 items-center justify-center rounded-full border sm:h-16 sm:w-16"
              style={{ borderColor: `${GOLD_LIGHT}38` }}
            >
              <Play size={17} strokeWidth={1} fill="currentColor" style={{ color: `${GOLD_LIGHT}b0` }} />
            </span>
            <span
              className="mt-4 text-[7px] font-semibold uppercase tracking-[0.28em]"
              style={{ color: `${GOLD_LIGHT}82` }}
            >
              YOUTUBE
            </span>
            <span className="mt-3 max-w-[300px] text-[10px] leading-6 text-white/[0.34]">
              {locale === "en"
                ? "Add the current episode URL to activate the player here."
                : "Dodaj URL aktuelne epizode da bi se plejer aktivirao ovde."}
            </span>
          </div>
        ) : null}

        <div aria-hidden="true" className="pointer-events-none absolute inset-4 border border-white/[0.05] sm:inset-5 lg:inset-6" />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-4 h-7 w-7 border-l border-t sm:left-5 sm:top-5 sm:h-8 sm:w-8 lg:left-6 lg:top-6"
          style={{ borderColor: `${GOLD_LIGHT}38` }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-4 right-4 h-7 w-7 border-b border-r sm:bottom-5 sm:right-5 sm:h-8 sm:w-8 lg:bottom-6 lg:right-6"
          style={{ borderColor: `${GOLD}2f` }}
        />

        <div className="absolute left-4 right-4 top-4 flex items-center justify-between sm:left-5 sm:right-5 sm:top-5 lg:left-6 lg:right-6 lg:top-6">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="h-[5px] w-[5px] rounded-full"
              style={{ background: GOLD_LIGHT, boxShadow: `0 0 8px ${GOLD_LIGHT}44` }}
            />
            <span className="text-[7px] font-semibold uppercase tracking-[0.22em] text-white/[0.40] sm:text-[8px] sm:tracking-[0.26em]">
              UMBRA WINDOW
            </span>
          </div>
          <span className="font-mono text-[6px] uppercase tracking-[0.22em] text-white/[0.16]">
            {panel.number}
          </span>
        </div>

        <div className="absolute inset-x-4 bottom-4 sm:inset-x-5 sm:bottom-5 lg:inset-x-6 lg:bottom-6">
          <p className="text-[7px] uppercase tracking-[0.24em]" style={{ color: `${GOLD_LIGHT}84` }}>
            {panel.mediaLabel}
          </p>
          <p className="mt-2 max-w-[520px] text-[clamp(1.25rem,4vw,2.85rem)] font-[450] uppercase leading-[0.88] tracking-[-0.055em] text-white sm:mt-2.5">
            {panel.title}
          </p>
        </div>

        {mediaIsClickable ? (
          <Link
            href={panel.href}
            aria-label={locale === "en" ? `Open ${panel.title}` : `Otvori ${panel.title}`}
            className="absolute inset-0 z-20 outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#ead39a]/75"
          />
        ) : null}

        <span
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-px w-1/3"
          style={{ background: `linear-gradient(90deg, ${GOLD_DARK}, ${GOLD_LIGHT}, transparent 78%)` }}
        />
      </div>

      <div className="flex items-center justify-between border-t border-white/[0.05] px-4 py-3 sm:px-5">
        <span className="text-[6px] uppercase tracking-[0.22em] text-white/[0.18] sm:text-[7px] sm:tracking-[0.26em]">
          {panel.category}
        </span>
        {panel.type === "youtube" ? (
          <a
            href={panel.youtubeUrl ?? panel.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-9 items-center gap-2 text-[7px] font-semibold uppercase tracking-[0.20em] outline-none transition-colors hover:text-white focus-visible:ring-1 focus-visible:ring-[#ead39a]/70"
            style={{ color: `${GOLD_LIGHT}68` }}
          >
            {locale === "en" ? "OPEN" : "OTVORI"}
            <ExternalLink size={12} strokeWidth={1} />
          </a>
        ) : (
          <Link
            href={panel.href}
            className="inline-flex min-h-9 items-center gap-2 text-[7px] font-semibold uppercase tracking-[0.20em] outline-none transition-colors hover:text-white focus-visible:ring-1 focus-visible:ring-[#ead39a]/70"
            style={{ color: `${GOLD_LIGHT}68` }}
          >
            {locale === "en" ? "OPEN" : "OTVORI"}
            <ArrowUpRight size={12} strokeWidth={1} />
          </Link>
        )}
      </div>
    </div>
  );
}

export default function HomeHero({
  locale = "sr",
  latestContent = [],
}: {
  locale?: Locale;
  latestContent?: readonly LatestContent[];
}) {
  const reducedMotion = useReducedMotion() ?? false;
  const panels = useMemo(() => buildPanels(locale, latestContent), [locale, latestContent]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [navHovered, setNavHovered] = useState(false);
  const [userSelected, setUserSelected] = useState(false);
  const [canAutoRotate, setCanAutoRotate] = useState(false);

  const activePanel = panels[activeIndex] ?? panels[0] ?? null;
  const activeTitleLines = useMemo(
    () => (activePanel ? activePanel.title.split(" ") : []),
    [activePanel],
  );

  const goTo = useCallback(
    (index: number, source: "hover" | "click" | "focus" = "click") => {
      if (!panels.length) return;
      const nextIndex = (index + panels.length) % panels.length;
      setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
      if (source === "click") setUserSelected(true);
    },
    [panels.length],
  );

  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const previous = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    const media = window.matchMedia("(pointer: fine) and (min-width: 1024px)");
    const update = () => setCanAutoRotate(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const rotationActive =
    canAutoRotate &&
    !reducedMotion &&
    !navHovered &&
    !userSelected &&
    panels.length > 1;

  useEffect(() => {
    if (!rotationActive) return;
    const timeout = window.setTimeout(() => {
      setActiveIndex((current) => (current === panels.length - 1 ? 0 : current + 1));
    }, AUTO_ROTATE_MS);
    return () => window.clearTimeout(timeout);
  }, [activeIndex, panels.length, rotationActive]);

  if (!activePanel) return null;

  const isExternal = Boolean(activePanel.external);
  const isLatestPanel = activePanel.id === "aktuelno" || activePanel.id === "featured";

  return (
    <section
      id="hero"
      data-umbra-scene="hero"
      aria-labelledby="umbra-hero-title"
      className="relative min-h-[100svh] overflow-hidden bg-[var(--umbra-bg-deep)] text-white lg:min-h-[calc(100svh-4.5rem)]"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <Image
          src={BACKGROUND_IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ opacity: 0.34, filter: "brightness(.66) contrast(.97) saturate(.72)", transform: "scale(1.02)" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.76)_0%,rgba(0,0,0,.52)_34%,rgba(0,0,0,.16)_68%,rgba(0,0,0,.50)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.54)_0%,rgba(0,0,0,.08)_34%,rgba(0,0,0,.18)_62%,rgba(0,0,0,.82)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_28%,rgba(223,200,143,.035),transparent_38%)]" />
        <div className="absolute inset-0 [box-shadow:inset_0_0_150px_rgba(0,0,0,.50)]" />
        <div className="absolute inset-0 opacity-[0.008] [background-image:radial-gradient(rgba(255,255,255,.22)_0.5px,transparent_.6px)] [background-size:4px_4px]" />
        <div className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}32, transparent)` }} />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1540px] flex-col px-5 pb-5 pt-24 sm:px-8 sm:pb-6 sm:pt-28 lg:px-10 lg:pt-28 xl:px-14">
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <span className="shrink-0 font-mono text-[7px] tracking-[0.30em]" style={{ color: `${GOLD_LIGHT}80` }}>
              {activePanel.number}
            </span>
            <span aria-hidden="true" className="h-px w-7 sm:w-10" style={{ background: `linear-gradient(90deg, ${GOLD}70, transparent)` }} />
            <span className="truncate text-[7px] font-medium uppercase tracking-[0.24em] sm:text-[8px] sm:tracking-[0.28em]" style={{ color: `${GOLD_LIGHT}76` }}>
              {activePanel.eyebrow}
            </span>
          </div>
          <span className="hidden font-mono text-[6px] uppercase tracking-[0.26em] text-white/[0.14] md:block">
            {String(activeIndex + 1).padStart(2, "0")} / {String(panels.length).padStart(2, "0")}
          </span>
        </div>

        <nav aria-label={locale === "en" ? "Hero sections" : "Hero sekcije"} className="mt-5 overflow-x-auto pb-1 lg:hidden">
          <div className="flex min-w-max items-center gap-1.5">
            {panels.map((panel, index) => {
              const active = index === activeIndex;
              return (
                <button
                  key={panel.id}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-pressed={active}
                  className={`inline-flex min-h-10 items-center gap-2 border px-3.5 text-left text-[7px] font-semibold uppercase tracking-[0.20em] outline-none transition-colors focus-visible:ring-1 focus-visible:ring-[#ead39a]/70 ${active ? "border-[#ead39a]/30 bg-[#ead39a]/[0.08] text-white" : "border-white/[0.08] bg-white/[0.018] text-white/[0.38]"}`}
                >
                  <span className="font-mono text-[7px]" style={{ color: active ? GOLD_LIGHT : "rgba(255,255,255,.22)" }}>
                    {panel.number}
                  </span>
                  <span>{panel.tab}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="grid flex-1 items-center gap-9 pb-6 pt-9 lg:grid-cols-[1fr_.86fr] lg:gap-14 lg:pb-8 lg:pt-4 xl:grid-cols-[1.02fr_.82fr] xl:gap-18">
          <motion.div
            key={activePanel.id}
            initial={{ opacity: 0, x: reducedMotion ? 0 : -7 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.28, ease: EASE }}
            className="max-w-[760px]"
          >
            <Link
              href={activePanel.href}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className="group/title inline-block outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/70"
              aria-label={locale === "en" ? `Open ${activePanel.title}` : `Otvori ${activePanel.title}`}
            >
              <div className="mb-5 flex items-center gap-3 sm:mb-6">
                <span aria-hidden="true" className="h-[5px] w-[5px] rounded-full" style={{ background: GOLD, boxShadow: `0 0 10px ${GOLD}42` }} />
                <span className="text-[7px] font-semibold uppercase tracking-[0.28em] sm:text-[8px] sm:tracking-[0.32em]" style={{ color: `${GOLD_LIGHT}80` }}>
                  {activePanel.category}
                </span>
              </div>

              <h1 id="umbra-hero-title" className="max-w-[760px] uppercase text-white" style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif', fontSize: "clamp(2.9rem, 9vw, 5.1rem)", fontWeight: 430, lineHeight: 0.9, letterSpacing: "-0.072em" }}>
                {activeTitleLines.map((word, index) => (
                  <span key={`${activePanel.id}-${word}-${index}`} className={index === activeTitleLines.length - 1 && activeTitleLines.length > 1 ? "block text-white/[0.52]" : "block"}>
                    {word}
                  </span>
                ))}
              </h1>
              <div aria-hidden="true" className="mt-5 h-px w-8 origin-left transition-[width] duration-500 group-hover/title:w-16 sm:mt-6 sm:w-10 sm:group-hover/title:w-20" style={{ background: `linear-gradient(90deg, ${GOLD_LIGHT}, ${GOLD}, transparent)` }} />
            </Link>

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 sm:mt-7 sm:gap-x-6">
              <span className="font-serif text-[clamp(.95rem,2.6vw,1.15rem)] italic" style={{ color: `${GOLD_LIGHT}9c` }}>
                {activePanel.eyebrow}
              </span>
              <span aria-hidden="true" className="hidden h-px w-8 sm:block" style={{ background: `${GOLD}54` }} />
              <span className="font-mono text-[6px] uppercase tracking-[0.22em] text-white/[0.18]">
                {activePanel.number} / {activePanel.tab}
              </span>
            </div>

            <p className="mt-5 max-w-[540px] text-[11px] leading-6 text-white/[0.46] sm:mt-6 sm:text-[13px] sm:leading-7">
              {activePanel.description}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 sm:mt-8">
              <Link
                href={activePanel.href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="inline-flex min-h-11 items-center gap-3 text-[8px] font-semibold uppercase tracking-[0.26em] outline-none transition-colors duration-300 hover:text-white focus-visible:ring-1 focus-visible:ring-[#ead39a]/70 sm:gap-4"
                style={{ color: GOLD_LIGHT }}
              >
                <span>{activePanel.cta}</span>
                {isExternal ? <ExternalLink size={13} strokeWidth={1} /> : <ArrowUpRight size={14} strokeWidth={1} />}
              </Link>
              <span className="font-mono text-[6px] uppercase tracking-[0.22em] text-white/[0.14]">
                {isLatestPanel ? (locale === "en" ? "LATEST PUBLISHED" : "NAJNOVIJE OBJAVLJENO") : locale === "en" ? "EDITORIAL VIEW" : "UREĐIVAČKI PREGLED"}
              </span>
            </div>
          </motion.div>

          <motion.div
            key={`window-${activePanel.id}`}
            initial={{ opacity: 0, x: reducedMotion ? 0 : 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: reducedMotion ? 0 : 0.02, duration: reducedMotion ? 0 : 0.30, ease: EASE }}
            className="group relative mx-auto w-full max-w-[540px] lg:justify-self-end"
          >
            <MediaWindow panel={activePanel} locale={locale} />
          </motion.div>
        </div>

        <div className="relative border-t border-white/[0.05] pt-4 lg:pb-4">
          <div className="flex items-center justify-between gap-4">
            <div className="hidden items-center gap-1 sm:flex">
              <button type="button" onClick={previous} aria-label={locale === "en" ? "Previous section" : "Prethodna sekcija"} className="flex min-h-10 min-w-10 items-center justify-center text-white/[0.28] outline-none transition-colors hover:text-white focus-visible:ring-1 focus-visible:ring-[#ead39a]/70">
                <ArrowLeft size={12} strokeWidth={1.1} />
              </button>
              <button type="button" onClick={next} aria-label={locale === "en" ? "Next section" : "Sledeća sekcija"} className="flex min-h-10 min-w-10 items-center justify-center text-white/[0.28] outline-none transition-colors hover:text-white focus-visible:ring-1 focus-visible:ring-[#ead39a]/70">
                <ArrowRight size={12} strokeWidth={1.1} />
              </button>
            </div>

            <div className="mx-auto flex items-center gap-3 sm:mx-0">
              <span className="text-[6px] uppercase tracking-[0.22em] text-white/[0.18] sm:text-[7px] sm:tracking-[0.26em]">
                {locale === "en" ? "SCROLL TO EXPLORE" : "SKROLUJ ZA ISTRAŽIVANJE"}
              </span>
              {!reducedMotion ? (
                <motion.span aria-hidden="true" animate={{ y: [0, 3, 0], opacity: [0.18, 0.55, 0.18] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
                  <ArrowDown size={11} strokeWidth={1.1} style={{ color: `${GOLD_LIGHT}58` }} />
                </motion.span>
              ) : null}
            </div>

            <span className="hidden font-mono text-[6px] uppercase tracking-[0.24em] text-white/[0.12] sm:block">
              {String(activeIndex + 1).padStart(2, "0")} / {String(panels.length).padStart(2, "0")}
            </span>
          </div>

          <div className="mt-3 h-px w-full overflow-hidden bg-white/[0.045]">
            {rotationActive ? (
              <motion.span key={activePanel.id} initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: AUTO_ROTATE_MS / 1000, ease: "linear" }} className="block h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD_DARK}, ${GOLD_LIGHT}, transparent)` }} />
            ) : (
              <span className="block h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${GOLD_DARK}, ${GOLD_LIGHT}, transparent)` }} />
            )}
          </div>
        </div>

        <nav aria-label={locale === "en" ? "Hero sections" : "Hero sekcije"} onMouseEnter={() => setNavHovered(true)} onMouseLeave={() => setNavHovered(false)} className="absolute bottom-12 right-5 z-20 hidden w-[270px] lg:right-10 lg:block xl:right-14">
          <div className="border border-white/[0.09] bg-[#050505]/92 px-4 pb-3.5 pt-4 shadow-[0_20px_60px_rgba(0,0,0,.46)] backdrop-blur-md">
            <div className="mb-3.5 flex items-center justify-between">
              <span className="text-[8px] font-semibold uppercase tracking-[0.28em] text-white/[0.40]">{locale === "en" ? "EXPLORE" : "ISTRAŽI"}</span>
              <span className="font-mono text-[6px] uppercase tracking-[0.22em] text-white/[0.12]">{userSelected ? (locale === "en" ? "SELECTED" : "IZABRANO") : navHovered ? (locale === "en" ? "PAUSED" : "PAUZA") : "AUTO"}</span>
            </div>
            <div className="space-y-1">
              {panels.map((panel, index) => {
                const active = index === activeIndex;
                return (
                  <button
                    key={panel.id}
                    type="button"
                    onMouseEnter={() => canAutoRotate && goTo(index, "hover")}
                    onFocus={() => goTo(index, "focus")}
                    onClick={() => goTo(index)}
                    aria-pressed={active}
                    className={`group relative flex min-h-10 w-full items-center gap-3 px-2.5 text-left outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/70 ${active ? "bg-white/[0.045]" : "hover:bg-white/[0.025]"}`}
                  >
                    <span className="w-7 font-mono text-[8px] tracking-[0.16em]" style={{ color: active ? GOLD_LIGHT : "rgba(255,255,255,.22)" }}>
                      {panel.number}
                    </span>
                    <span aria-hidden="true" className="h-px transition-[width,background-color] duration-150" style={{ width: active ? 42 : 20, background: active ? GOLD_LIGHT : "rgba(255,255,255,.15)" }} />
                    <span className="text-[9px] font-semibold uppercase tracking-[0.22em] transition-colors duration-150" style={{ color: active ? "rgba(255,255,255,.94)" : "rgba(255,255,255,.36)" }}>
                      {panel.tab}
                    </span>
                    <span aria-hidden="true" className="absolute bottom-0 left-0 h-px transition-[width,opacity] duration-150" style={{ width: active ? "62%" : "0%", opacity: active ? 0.65 : 0, background: `linear-gradient(90deg, ${GOLD_DARK}, ${GOLD_LIGHT}, transparent)` }} />
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-white/[0.025]">
        <motion.div key={activeIndex} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: reducedMotion ? 0 : 0.8, ease: EASE }} className="h-full w-[34%] origin-left" style={{ background: `linear-gradient(90deg, transparent, ${GOLD_DARK}, ${GOLD_LIGHT}, transparent)` }} />
      </div>
    </section>
  );
}
