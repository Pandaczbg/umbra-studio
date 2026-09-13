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
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  LocalizedText,
  ProjectContent,
} from "@/lib/content/types";

const GOLD = "#c7a96b";
const GOLD_LIGHT = "#ead39a";
const GOLD_DARK = "#8f7142";

const BACKGROUND_IMAGE = "/umbra-background.png";
const FALLBACK_IMAGE = "/umbra-background.png";
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
};

function getLocalizedText(
  value: LocalizedText | undefined,
  locale: Locale,
  fallback = "",
) {
  if (!value) {
    return fallback;
  }

  return value[locale] || value.sr || value.en || fallback;
}

function getYouTubeId(url?: string) {
  if (!url) {
    return null;
  }

  const patterns = [
    /youtu\.be\/([^?&/]+)/i,
    /youtube\.com\/watch\?v=([^?&/]+)/i,
    /youtube\.com\/embed\/([^?&/]+)/i,
    /youtube\.com\/shorts\/([^?&/]+)/i,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);

    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
}

function getCurrentProductionProject(
  projects: readonly ProjectContent[],
) {
  return (
    projects.find(
      (project) => project.status === "in-production",
    ) ??
    projects.find((project) => project.featured) ??
    projects.find((project) => project.type === "Serija") ??
    projects[0] ??
    null
  );
}

function resolveProjectImage(
  project: ProjectContent | null,
  locale: Locale,
) {
  if (!project) {
    return FALLBACK_IMAGE;
  }

  const source = project.source;

  if (locale === "en") {
    return (
      source?.coverEn ||
      source?.coverSr ||
      FALLBACK_IMAGE
    );
  }

  return (
    source?.coverSr ||
    source?.coverEn ||
    FALLBACK_IMAGE
  );
}

function buildPanels(
  locale: Locale,
  currentProject: ProjectContent | null,
): HeroPanel[] {
  const title = currentProject
    ? getLocalizedText(currentProject.title, locale)
    : "MRZIM SVOG BRATA";

  const description = currentProject
    ? getLocalizedText(
        currentProject.shortDescription ?? currentProject.description,
        locale,
        locale === "en"
          ? "Umbra Studio's current production."
          : "Trenutna produkcija Umbra Studija.",
      )
    : locale === "en"
      ? "Umbra Studio's current production."
      : "Trenutna produkcija Umbra Studija.";

  const projectHref = currentProject
    ? locale === "en"
      ? `/en/projects/${currentProject.slug}`
      : `/serije/${currentProject.slug}`
    : locale === "en"
      ? "/en/projects"
      : "/serije";

  if (locale === "en") {
    return [
      {
        id: "featured",
        number: "01",
        tab: "FEATURED",
        eyebrow: "CURRENT PRODUCTION",
        category: "IN FOCUS",
        title,
        description,
        href: projectHref,
        cta: "Enter project",
        mediaLabel: "PROJECT WINDOW",
        type: "image",
        image: resolveProjectImage(currentProject, locale),
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
        mediaLabel: "CHARACTER WINDOW",
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
      eyebrow: "SERIJA U PRODUKCIJI",
      category: "U FOKUSU",
      title,
      description,
      href: projectHref,
      cta: "Uđi u projekat",
      mediaLabel: "PROZOR PROJEKTA",
      type: "image",
      image: resolveProjectImage(currentProject, locale),
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
      mediaLabel: "PROZOR LIKOVA",
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
  const mediaIsClickable = panel.type !== "youtube";
  const mediaLinkLabel =
    panel.type === "youtube"
      ? locale === "en"
        ? "Open YouTube"
        : "Otvori YouTube"
      : locale === "en"
        ? "Open section"
        : "Otvori sekciju";

  return (
    <div className="group/window relative overflow-hidden border border-white/[0.085] bg-[#070707] shadow-[0_32px_96px_rgba(0,0,0,.36)]">
      <div className="relative aspect-[1.14/0.93] overflow-hidden">
        {panel.type === "youtube" && youtubeId ? (
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
              sizes="(min-width: 1280px) 38vw, (min-width: 1024px) 44vw, 94vw"
              className="object-cover transition-transform duration-[950ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover/window:scale-[1.018]"
              priority={
                panel.id === "aktuelno" || panel.id === "featured"
              }
            />

            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(0,0,0,.05), transparent 34%, rgba(0,0,0,.84) 100%)",
              }}
            />

            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, rgba(0,0,0,.48), transparent 58%, rgba(0,0,0,.24) 100%)",
              }}
            />
          </>
        )}

        {!youtubeId && panel.type === "youtube" ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/[0.14] px-8 text-center">
            <span
              className="flex h-[68px] w-[68px] items-center justify-center rounded-full border bg-black/[0.30]"
              style={{ borderColor: `${GOLD_LIGHT}38` }}
            >
              <Play
                size={18}
                strokeWidth={1}
                fill="currentColor"
                style={{ color: `${GOLD_LIGHT}b0` }}
              />
            </span>

            <span
              className="mt-6 text-[8px] font-semibold uppercase tracking-[0.30em]"
              style={{ color: `${GOLD_LIGHT}82` }}
            >
              YOUTUBE PLAYER
            </span>

            <span className="mt-3 max-w-[300px] text-[10px] leading-6 text-white/[0.34]">
              {locale === "en"
                ? "Add the current episode URL to turn this window into the active video player."
                : "Dodaj URL aktuelne epizode i ovaj prozor postaje aktivni YouTube plejer."}
            </span>
          </div>
        ) : null}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-5 border border-white/[0.055] sm:inset-6 lg:inset-7"
        />

        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-5 top-5 h-9 w-9 border-l border-t sm:left-6 sm:top-6 lg:left-7 lg:top-7"
          style={{ borderColor: `${GOLD_LIGHT}38` }}
        />

        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-5 right-5 h-9 w-9 border-b border-r sm:bottom-6 sm:right-6 lg:bottom-7 lg:right-7"
          style={{ borderColor: `${GOLD}2f` }}
        />

        <div className="absolute left-5 right-5 top-5 flex items-center justify-between sm:left-6 sm:right-6 sm:top-6 lg:left-7 lg:right-7 lg:top-7">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="h-[5px] w-[5px] rounded-full"
              style={{
                background: GOLD_LIGHT,
                boxShadow: `0 0 8px ${GOLD_LIGHT}44`,
              }}
            />

            <span className="text-[8px] font-semibold uppercase tracking-[0.28em] text-white/[0.42]">
              UMBRA WINDOW
            </span>
          </div>

          <span className="font-mono text-[6px] uppercase tracking-[0.24em] text-white/[0.18]">
            {panel.number}
          </span>
        </div>

        <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-6 sm:inset-x-7 sm:bottom-7 lg:inset-x-8 lg:bottom-8">
          <div>
            <p
              className="text-[8px] uppercase tracking-[0.34em]"
              style={{ color: `${GOLD_LIGHT}84` }}
            >
              {panel.mediaLabel}
            </p>

            <p className="mt-3 max-w-[560px] text-[clamp(1.65rem,3.4vw,3.5rem)] font-[430] uppercase leading-[0.84] tracking-[-0.065em] text-white">
              {panel.title}
            </p>
          </div>

          {panel.type === "youtube" && !youtubeId ? (
            <span
              className="hidden shrink-0 rounded-full border px-3 py-2 font-mono text-[6px] uppercase tracking-[0.24em] sm:block"
              style={{
                borderColor: `${GOLD_LIGHT}28`,
                color: `${GOLD_LIGHT}68`,
                background: "rgba(0,0,0,.22)",
              }}
            >
              YOUTUBE
            </span>
          ) : null}
        </div>

        {mediaIsClickable ? (
          <Link
            href={panel.href}
            target={panel.external ? "_blank" : undefined}
            rel={panel.external ? "noopener noreferrer" : undefined}
            aria-label={mediaLinkLabel}
            className="absolute inset-0 z-20 outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#ead39a]/75"
          />
        ) : null}

        <span
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-px w-[30%] transition-[width] duration-500 group-hover/window:w-full"
          style={{
            background: `linear-gradient(90deg, ${GOLD_DARK}, ${GOLD_LIGHT}, transparent 78%)`,
          }}
        />

        <div className="absolute bottom-5 right-5 z-30 sm:bottom-6 sm:right-6">
          {youtubeId ? (
            <a
              href={panel.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/media-link inline-flex items-center gap-3 border border-white/[0.10] bg-black/[0.42] px-3.5 py-2.5 text-[7px] font-semibold uppercase tracking-[0.22em] text-white/[0.60] outline-none transition-colors duration-300 hover:border-[#ead39a]/35 hover:bg-[#ead39a]/10 hover:text-white focus-visible:ring-1 focus-visible:ring-[#ead39a]/70"
            >
              {locale === "en" ? "Open on YouTube" : "Otvori na YouTube-u"}
              <ExternalLink
                size={12}
                strokeWidth={1}
                className="transition-transform duration-300 group-hover/media-link:translate-x-0.5 group-hover/media-link:-translate-y-0.5"
              />
            </a>
          ) : (
            <span
              className="inline-flex items-center gap-3 border border-white/[0.10] bg-black/[0.34] px-3.5 py-2.5 text-[7px] font-semibold uppercase tracking-[0.22em] text-white/[0.48] transition-colors duration-300 group-hover/window:border-[#ead39a]/30 group-hover/window:text-[#ead39a]/80"
            >
              {mediaLinkLabel}
              {panel.external ? (
                <ExternalLink size={12} strokeWidth={1} />
              ) : (
                <ArrowUpRight size={12} strokeWidth={1} />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HomeHero({
  locale = "sr",
  projects,
}: {
  locale?: Locale;
  projects: readonly ProjectContent[];
}) {
  const reducedMotion = useReducedMotion() ?? false;

  const currentProject = useMemo(
    () => getCurrentProductionProject(projects),
    [projects],
  );

  const panels = useMemo(
    () => buildPanels(locale, currentProject),
    [locale, currentProject],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [navHovered, setNavHovered] = useState(false);
  const [userSelected, setUserSelected] = useState(false);

  const activePanel = panels[activeIndex] ?? panels[0] ?? null;

  const activeTitleLines = useMemo(
    () => (activePanel ? activePanel.title.split(" ") : []),
    [activePanel],
  );

  const timerRef = useRef<number | null>(null);
  const pointerFine = useRef(false);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const goTo = useCallback(
    (
      index: number,
      source: "hover" | "click" | "focus" = "click",
    ) => {
      if (!panels.length) {
        return;
      }

      const nextIndex = (index + panels.length) % panels.length;

      setActiveIndex((current) =>
        current === nextIndex ? current : nextIndex,
      );

      if (source === "click") {
        setUserSelected(true);
      }
    },
    [panels.length],
  );

  const next = useCallback(() => {
    goTo(activeIndex + 1, "click");
  }, [activeIndex, goTo]);

  const previous = useCallback(() => {
    goTo(activeIndex - 1, "click");
  }, [activeIndex, goTo]);

  const rotationActive =
    !reducedMotion &&
    !navHovered &&
    !userSelected &&
    panels.length > 1;

  useEffect(() => {
    if (!rotationActive) {
      clearTimer();
      return;
    }

    clearTimer();

    timerRef.current = window.setTimeout(() => {
      setActiveIndex((current) =>
        current === panels.length - 1 ? 0 : current + 1,
      );
    }, AUTO_ROTATE_MS);

    return clearTimer;
  }, [activeIndex, clearTimer, panels.length, rotationActive]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  useEffect(() => {
    const media = window.matchMedia("(pointer: fine)");

    const update = () => {
      pointerFine.current = media.matches;
    };

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  const handlePanelHover = useCallback(
    (index: number) => {
      if (!pointerFine.current) {
        return;
      }

      goTo(index, "hover");
    },
    [goTo],
  );

  const handlePanelFocus = useCallback(
    (index: number) => {
      goTo(index, "focus");
    },
    [goTo],
  );

  if (!activePanel) {
    return null;
  }

  const isExternal = Boolean(activePanel.external);
  const isCurrentProduction =
    activePanel.id === "aktuelno" || activePanel.id === "featured";

  return (
    <section
      id="hero"
      data-umbra-scene="hero"
      aria-labelledby="umbra-hero-title"
      className="relative min-h-[88svh] overflow-hidden bg-[var(--umbra-bg-deep)] text-white lg:min-h-[calc(100svh-4.5rem)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <Image
          src={BACKGROUND_IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{
            opacity: 0.38,
            filter: "brightness(.64) contrast(.96) saturate(.74)",
            transform: "scale(1.025)",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,.74) 0%, rgba(0,0,0,.54) 31%, rgba(0,0,0,.14) 66%, rgba(0,0,0,.58) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,.50) 0%, rgba(0,0,0,.02) 28%, rgba(0,0,0,.07) 58%, rgba(0,0,0,.74) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 69% 30%, ${GOLD_LIGHT}08, transparent 40%)`,
          }}
        />
        <div className="absolute inset-0 shadow-[inset_0_0_170px_rgba(0,0,0,.46)]" />
        <div
          className="absolute inset-0 opacity-[0.010]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,.24) .5px, transparent .6px)",
            backgroundSize: "4px 4px",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background:
              `linear-gradient(90deg, transparent, ${GOLD}30, transparent)`,
          }}
        />
      </div>

      <div className="relative z-10 mx-auto min-h-[100svh] max-w-[1680px] px-6 sm:px-9 lg:px-12 xl:px-16">
        <div className="flex items-center justify-between pt-24 sm:pt-28 lg:pt-32">
          <div className="flex items-center gap-4">
            <span
              className="font-mono text-[7px] tracking-[0.32em]"
              style={{ color: `${GOLD_LIGHT}80` }}
            >
              {activePanel.number}
            </span>
            <span
              aria-hidden="true"
              className="h-px w-12"
              style={{
                background: `linear-gradient(90deg, ${GOLD}70, transparent)`,
              }}
            />
            <span
              className="text-[8px] font-medium uppercase tracking-[0.28em]"
              style={{ color: `${GOLD_LIGHT}76` }}
            >
              {activePanel.eyebrow}
            </span>
          </div>

          <span className="hidden font-mono text-[6px] uppercase tracking-[0.28em] text-white/[0.14] md:block">
            {String(activeIndex + 1).padStart(2, "0")} / {String(panels.length).padStart(2, "0")}
          </span>
        </div>

        <div className="grid min-h-[calc(88svh-8rem)] items-center gap-10 pb-8 pt-6 lg:grid-cols-[1fr_0.78fr] lg:gap-16 lg:pb-10 lg:pt-2 xl:grid-cols-[1.02fr_0.76fr] xl:gap-20">
          <motion.div
            key={activePanel.id}
            initial={{ opacity: 0, x: reducedMotion ? 0 : -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: reducedMotion ? 0 : 0.28,
              ease: EASE,
            }}
            className="max-w-[980px]"
          >
            <Link
              href={activePanel.href}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className="group/title inline-block max-w-[980px] outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/70"
              aria-label={
                locale === "en"
                  ? `Open ${activePanel.title}`
                  : `Otvori ${activePanel.title}`
              }
            >
              <div className="mb-7 flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-[6px] w-[6px] rounded-full"
                  style={{
                    background: GOLD,
                    boxShadow: `0 0 12px ${GOLD}42`,
                  }}
                />
                <span
                  className="text-[8px] font-semibold uppercase tracking-[0.34em]"
                  style={{ color: `${GOLD_LIGHT}82` }}
                >
                  {activePanel.category}
                </span>
              </div>

              <h1
                id="umbra-hero-title"
                className="uppercase text-white"
                style={{
                  fontFamily:
                    '"Helvetica Neue", "Arial Narrow", Arial, sans-serif',
                  fontSize: "clamp(3.6rem, 7.2vw, 8.8rem)",
                  fontWeight: 430,
                  lineHeight: 0.8,
                  letterSpacing: "-0.085em",
                }}
              >
                {activeTitleLines.map((word, index) => (
                  <span
                    key={`${activePanel.id}-${word}-${index}`}
                    className={[
                      "block",
                      index > Math.floor(activeTitleLines.length / 2)
                        ? "text-white/[0.48]"
                        : "",
                    ].join(" ")}
                  >
                    {word}
                  </span>
                ))}
              </h1>

              <div
                aria-hidden="true"
                className="mt-6 h-px w-8 origin-left transition-[width] duration-500 group-hover/title:w-20"
                style={{
                  background:
                    `linear-gradient(90deg, ${GOLD_LIGHT}, ${GOLD}, transparent)`,
                }}
              />
            </Link>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <span
                className="font-serif text-[clamp(1.05rem,1.5vw,1.35rem)] italic"
                style={{ color: `${GOLD_LIGHT}a2` }}
              >
                {activePanel.eyebrow}
              </span>
              <span
                aria-hidden="true"
                className="h-px w-10"
                style={{ background: `${GOLD}54` }}
              />
              <span className="font-mono text-[6px] uppercase tracking-[0.28em] text-white/[0.18]">
                {activePanel.number} / {activePanel.tab}
              </span>
            </div>

            <p className="mt-6 max-w-[570px] text-[12px] leading-7 text-white/[0.39] sm:text-[13px]">
              {activePanel.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
              <Link
                href={activePanel.href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="group/cta inline-flex min-h-11 items-center gap-4 pr-1 text-[8px] font-semibold uppercase tracking-[0.28em] outline-none transition-colors duration-300 hover:text-white focus-visible:ring-1 focus-visible:ring-[#ead39a]/70"
                style={{ color: GOLD_LIGHT }}
              >
                <span>{activePanel.cta}</span>
                {isExternal ? (
                  <ExternalLink
                    size={13}
                    strokeWidth={1}
                    className="transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
                  />
                ) : (
                  <ArrowUpRight
                    size={14}
                    strokeWidth={1}
                    className="transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
                  />
                )}
              </Link>

              <span className="font-mono text-[6px] uppercase tracking-[0.28em] text-white/[0.14]">
                {isCurrentProduction
                  ? locale === "en"
                    ? "SELECTED PRODUCTION"
                    : "AKTUELNA PRODUKCIJA"
                  : locale === "en"
                    ? "EDITORIAL VIEW"
                    : "UREĐIVAČKI PREGLED"}
              </span>
            </div>
          </motion.div>

          <motion.div
            key={`window-${activePanel.id}`}
            initial={{ opacity: 0, x: reducedMotion ? 0 : 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: reducedMotion ? 0 : 0.02,
              duration: reducedMotion ? 0 : 0.32,
              ease: EASE,
            }}
            className="group/window relative mx-auto w-full max-w-[570px] lg:justify-self-end"
          >
            <MediaWindow panel={activePanel} locale={locale} />

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-px w-8"
                  style={{ background: `${GOLD}38` }}
                />
                <span className="text-[7px] uppercase tracking-[0.28em] text-white/[0.18]">
                  {activePanel.mediaLabel}
                </span>
              </div>

              {activePanel.type === "youtube" ? (
                <a
                  href={activePanel.youtubeUrl ?? activePanel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[7px] uppercase tracking-[0.22em] outline-none transition-colors hover:text-white focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
                  style={{ color: `${GOLD_LIGHT}58` }}
                >
                  {getYouTubeId(activePanel.youtubeUrl)
                    ? locale === "en"
                      ? "OPEN VIDEO"
                      : "OTVORI VIDEO"
                    : locale === "en"
                      ? "OPEN CHANNEL"
                      : "OTVORI KANAL"}
                </a>
              ) : (
                <Link
                  href={activePanel.href}
                  className="text-[7px] uppercase tracking-[0.22em] outline-none transition-colors hover:text-white focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
                  style={{ color: `${GOLD_LIGHT}58` }}
                >
                  {locale === "en" ? "OPEN" : "OTVORI"}
                </Link>
              )}
            </div>
          </motion.div>
        </div>

        <div className="relative border-t border-white/[0.05] pb-5 pt-4">
          <div className="flex items-center justify-between">
            <div className="hidden items-center gap-1 sm:flex">
              <button
                type="button"
                onClick={previous}
                aria-label={
                  locale === "en" ? "Previous section" : "Prethodna sekcija"
                }
                className="flex h-8 w-8 items-center justify-center text-white/[0.26] outline-none transition-colors hover:text-white focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
              >
                <ArrowLeft size={12} strokeWidth={1.1} />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label={
                  locale === "en" ? "Next section" : "Sledeća sekcija"
                }
                className="flex h-8 w-8 items-center justify-center text-white/[0.26] outline-none transition-colors hover:text-white focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
              >
                <ArrowRight size={12} strokeWidth={1.1} />
              </button>
            </div>

            <div className="mx-auto flex items-center gap-3 sm:mx-0">
              <span className="text-[7px] uppercase tracking-[0.28em] text-white/[0.18]">
                {locale === "en" ? "SCROLL TO EXPLORE" : "SKROLUJ ZA ISTRAŽIVANJE"}
              </span>
              {!reducedMotion ? (
                <motion.span
                  aria-hidden="true"
                  animate={{ y: [0, 4, 0], opacity: [0.18, 0.60, 0.18] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowDown
                    size={11}
                    strokeWidth={1.1}
                    style={{ color: `${GOLD_LIGHT}58` }}
                  />
                </motion.span>
              ) : null}
            </div>

            <span className="hidden font-mono text-[6px] uppercase tracking-[0.26em] text-white/[0.12] sm:block">
              {String(activeIndex + 1).padStart(2, "0")} / {String(panels.length).padStart(2, "0")}
            </span>
          </div>

          <div className="mt-3 h-px w-full overflow-hidden bg-white/[0.045]">
            {rotationActive ? (
              <motion.span
                key={activePanel.id}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: AUTO_ROTATE_MS / 1000, ease: "linear" }}
                className="block h-px"
                style={{
                  background:
                    `linear-gradient(90deg, transparent, ${GOLD_DARK}, ${GOLD_LIGHT}, transparent)`,
                }}
              />
            ) : (
              <span
                className="block h-px w-full"
                style={{
                  background:
                    `linear-gradient(90deg, transparent, ${GOLD_DARK}, ${GOLD_LIGHT}, transparent)`,
                }}
              />
            )}
          </div>
        </div>

        <nav
          aria-label={locale === "en" ? "Hero sections" : "Hero sekcije"}
          onMouseEnter={() => setNavHovered(true)}
          onMouseLeave={() => setNavHovered(false)}
          className="absolute bottom-16 right-6 z-50 isolate hidden w-[292px] lg:right-12 lg:block xl:right-16"
        >
          <div className="relative z-10 border border-white/[0.10] bg-[#050505] px-5 pb-4 pt-5 shadow-[0_22px_70px_rgba(0,0,0,.52)]">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[9px] font-semibold uppercase tracking-[0.30em] text-white/[0.40]">
                {locale === "en" ? "EXPLORE" : "ISTRAŽI"}
              </span>
              <span className="font-mono text-[6px] uppercase tracking-[0.24em] text-white/[0.12]">
                {userSelected
                  ? locale === "en"
                    ? "SELECTED"
                    : "IZABRANO"
                  : navHovered
                    ? locale === "en"
                      ? "PAUSED"
                      : "PAUZA"
                    : "AUTO"}
              </span>
            </div>

            <p className="mb-3 text-[7px] uppercase tracking-[0.26em] text-white/[0.16]">
              {locale === "en" ? "SELECT A WINDOW" : "IZABERI PROZOR"}
            </p>

            <div className="space-y-1.5">
              {panels.map((panel, index) => {
                const active = index === activeIndex;

                return (
                  <button
                    key={panel.id}
                    type="button"
                    onMouseEnter={() => handlePanelHover(index)}
                    onFocus={() => handlePanelFocus(index)}
                    onClick={() => goTo(index, "click")}
                    aria-pressed={active}
                    className={[
                      "group relative flex w-full items-center gap-3 px-3 py-2.5 text-left outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55",
                      active
                        ? "bg-white/[0.045]"
                        : "hover:bg-white/[0.025]",
                    ].join(" ")}
                  >
                    <span
                      className="w-8 font-mono text-[9px] tracking-[0.18em]"
                      style={{
                        color: active
                          ? GOLD_LIGHT
                          : "rgba(255,255,255,.22)",
                      }}
                    >
                      {panel.number}
                    </span>

                    <span
                      aria-hidden="true"
                      className="h-px transition-[width,background-color] duration-150"
                      style={{
                        width: active ? 48 : 22,
                        background: active
                          ? GOLD_LIGHT
                          : "rgba(255,255,255,.16)",
                      }}
                    />

                    <span
                      className="text-[10px] font-semibold uppercase tracking-[0.24em] transition-colors duration-150"
                      style={{
                        color: active
                          ? "rgba(255,255,255,.94)"
                          : "rgba(255,255,255,.36)",
                      }}
                    >
                      {panel.tab}
                    </span>

                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 h-px transition-[width,opacity] duration-150"
                      style={{
                        width: active ? "68%" : "0%",
                        opacity: active ? 0.65 : 0,
                        background:
                          `linear-gradient(90deg, ${GOLD_DARK}, ${GOLD_LIGHT}, transparent)`,
                      }}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-white/[0.025]"
      >
        <motion.div
          key={activeIndex}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: reducedMotion ? 0 : 0.8, ease: EASE }}
          className="h-full w-[38%] origin-left"
          style={{
            background:
              `linear-gradient(90deg, transparent, ${GOLD_DARK}, ${GOLD_LIGHT}, transparent)`,
          }}
        />
      </div>
    </section>
  );
}
