// Umbra Studio StudioScene V5 FINAL POLISHED
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Maximize2,
  Play,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { type KeyboardEvent, useState } from "react";

type Locale = "sr" | "en";

type StudioSceneProps = {
  locale?: Locale;
};

type MediaType = "image" | "video" | "placeholder";

type MediaSpec = {
  type: MediaType;
  src: string | null;
  poster: string | null;
  alt: string;
};

type Principle = {
  index: string;
  title: string;
  eyebrow: string;
  description: string;
  detail: string;
  code: string;
  media: MediaSpec;
};

const GOLD = "#c7a96b";
const GOLD_LIGHT = "#ead39a";
const EASE = [0.22, 1, 0.36, 1] as const;
const PRINCIPLE_COUNT = 4;

const placeholderMedia: MediaSpec = {
  type: "placeholder",
  src: null,
  poster: null,
  alt: "",
};

const principlesByLocale: Record<Locale, Principle[]> = {
  sr: [
    {
      index: "01",
      title: "PRIČA",
      eyebrow: "TEMELJ",
      description:
        "Sve počinje razlogom zbog kojeg priča mora da postoji. Narativ određuje šta gradimo, kojim redom i zašto.",
      detail:
        "Pre slike dolaze događaj, odnos, sukob i odluka. Kadar dobija smisao tek kada pripada većoj priči.",
      code: "STORY / FOUNDATION",
      media: placeholderMedia,
    },
    {
      index: "02",
      title: "LIK",
      eyebrow: "KARAKTER",
      description:
        "Ljudi nose priču. Njihove želje, odnosi, slabosti i odluke određuju kako svet treba da ih prikaže.",
      detail:
        "Ne pravimo lik da bismo popunili kadar. Gradimo karakter koji može da nosi scenu, odnos i posledicu.",
      code: "CHARACTER / IDENTITY",
      media: placeholderMedia,
    },
    {
      index: "03",
      title: "SVET",
      eyebrow: "ATMOSFERA",
      description:
        "Vreme, prostor, svetlo, zvuk i detalj stvaraju svet u koji publika može da poveruje i poželi da uđe.",
      detail:
        "Svaki detalj mora pripadati vremenu, mestu i tonu priče. Svet nije pozadina — on je deo pripovedanja.",
      code: "WORLD / ATMOSPHERE",
      media: placeholderMedia,
    },
    {
      index: "04",
      title: "PRODUKCIJA",
      eyebrow: "IZVOĐENJE",
      description:
        "Kada priča, lik i svet dobiju jasnu formu, pretvaramo ih u stvaran materijal za ekran.",
      detail:
        "Od slike i zvuka do animacije, montaže i finalne isporuke — svaki sloj produkcije postoji da služi priči.",
      code: "PRODUCTION / DELIVERY",
      media: placeholderMedia,
    },
  ],
  en: [
    {
      index: "01",
      title: "STORY",
      eyebrow: "FOUNDATION",
      description:
        "Everything begins with a reason for the story to exist. Narrative determines what we build, in what order and why.",
      detail:
        "Before the image come events, relationships, conflict and choice. A frame only matters when it belongs to a larger story.",
      code: "STORY / FOUNDATION",
      media: placeholderMedia,
    },
    {
      index: "02",
      title: "CHARACTER",
      eyebrow: "IDENTITY",
      description:
        "People carry the story. Their wants, relationships, weaknesses and choices determine how the world should portray them.",
      detail:
        "We do not create a character to fill a frame. We build one who can carry a scene, a relationship and a consequence.",
      code: "CHARACTER / IDENTITY",
      media: placeholderMedia,
    },
    {
      index: "03",
      title: "WORLD",
      eyebrow: "ATMOSPHERE",
      description:
        "Time, space, light, sound and detail create a world the audience can believe in and want to enter.",
      detail:
        "Every detail has to belong to the time, place and tone of the story. The world is not background — it is part of the narrative.",
      code: "WORLD / ATMOSPHERE",
      media: placeholderMedia,
    },
    {
      index: "04",
      title: "PRODUCTION",
      eyebrow: "EXECUTION",
      description:
        "Once story, character and world have a clear form, we turn them into production material made for the screen.",
      detail:
        "From image and sound to animation, editing and final delivery — every production layer exists to serve the story.",
      code: "PRODUCTION / DELIVERY",
      media: placeholderMedia,
    },
  ],
};

const copyByLocale = {
  sr: {
    sectionLabel: "O UMBRI",
    sectionCode: "04",
    kicker: "KREATIVNI SISTEM",
    titleA: "Priče",
    titleB: "traže svoj svet",
    lead:
      "Umbra je digitalni filmski studio za razvoj priča, adaptacija i svetova koji mogu da žive izvan jednog kadra.",
    body:
      "Ne počinjemo od alata. Počinjemo od razloga da priča postoji. Zatim gradimo lik, svet i produkciju koja joj pripada.",
    processLabel: "KAKO UMBRA GRADI",
    processTitle: "Četiri stvari koje drže priču",
    processMeta: "OD IDEJE DO EKRANA",
    activeLabel: "AKTIVNA ODLUKA",
    selectionHint: "IZABERI ELEMENT",
    mediaLabel: "VIZUELNI MATERIJAL",
    mediaImage: "SLIKA",
    mediaVideo: "VIDEO",
    mediaReady: "MATERIJAL U PRIPREMI",
    mediaEmpty: "Prostor za budući kadar, sliku ili video materijal",
    openProjects: "Istraži projekte",
    openCharacters: "Upoznaj likove",
    next: "05 / GLEDAJ",
    nextLabel: "Gledaj",
    system: "PRIČA / LIK / SVET / PRODUKCIJA",
    principleCount: "04 ELEMENTA",
    mediaStatus: "IN DEVELOPMENT",
    visualCode: "UMBRA / VISUAL ARCHIVE",
  },
  en: {
    sectionLabel: "ABOUT UMBRA",
    sectionCode: "04",
    kicker: "CREATIVE SYSTEM",
    titleA: "Stories",
    titleB: "need their own world",
    lead:
      "Umbra is a digital film studio for developing stories, adaptations and worlds that can live beyond a single frame.",
    body:
      "We do not begin with the tool. We begin with the reason the story should exist. Then we build the character, world and production that belong to it.",
    processLabel: "HOW UMBRA BUILDS",
    processTitle: "Four things that hold the story",
    processMeta: "FROM IDEA TO SCREEN",
    activeLabel: "ACTIVE DECISION",
    selectionHint: "SELECT AN ELEMENT",
    mediaLabel: "VISUAL MATERIAL",
    mediaImage: "IMAGE",
    mediaVideo: "VIDEO",
    mediaReady: "MATERIAL IN DEVELOPMENT",
    mediaEmpty: "Space for the future frame, image or video material",
    openProjects: "Explore projects",
    openCharacters: "Meet the characters",
    next: "05 / WATCH",
    nextLabel: "Watch",
    system: "STORY / CHARACTER / WORLD / PRODUCTION",
    principleCount: "04 ELEMENTS",
    mediaStatus: "IN DEVELOPMENT",
    visualCode: "UMBRA / VISUAL ARCHIVE",
  },
} as const;

function PrincipleSelector({
  principle,
  active,
  onSelect,
  onKeyDown,
  reducedMotion,
}: {
  principle: Principle;
  active: boolean;
  onSelect: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  reducedMotion: boolean;
}) {
  return (
    <button
      type="button"
      id={`studio-tab-${principle.index}`}
      data-studio-tab={principle.index}
      role="tab"
      tabIndex={active ? 0 : -1}
      aria-selected={active}
      aria-controls={`studio-panel-${principle.index}`}
      aria-label={`${principle.index} ${principle.title}`}
      onClick={onSelect}
      onKeyDown={onKeyDown}
      className="group relative block w-full cursor-pointer text-left outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#ead39a]/75"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-[background-color,opacity] duration-500"
        style={{
          background: active
            ? "linear-gradient(90deg, rgba(199,169,107,.075), rgba(199,169,107,.018) 70%, transparent)"
            : "transparent",
        }}
      />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-full w-px origin-top transition-transform duration-500"
        style={{
          transform: active ? "scaleY(1)" : "scaleY(0)",
          background: `linear-gradient(180deg, ${GOLD_LIGHT}, ${GOLD}22 72%, transparent)`,
        }}
      />

      <span className="relative z-10 flex h-full min-h-[0] items-start justify-between gap-4 px-5 py-5 sm:px-6 sm:py-5">
        <span>
          <span className="flex items-center gap-3">
            <span
              className="font-mono text-[7px] tracking-[0.25em] transition-colors duration-300"
              style={{
                color: active ? GOLD_LIGHT : "rgba(255,255,255,.20)",
              }}
            >
              {principle.index}
            </span>
            <span
              aria-hidden="true"
              className="h-px transition-[background-color,width] duration-300"
              style={{
                background: active ? `${GOLD}78` : "rgba(255,255,255,.08)",
                width: active ? "30px" : "18px",
              }}
            />
            <span
              className="font-mono text-[6px] uppercase tracking-[0.25em] transition-colors duration-300"
              style={{
                color: active ? `${GOLD_LIGHT}92` : "rgba(255,255,255,.14)",
              }}
            >
              {principle.eyebrow}
            </span>
          </span>

          <span
            className="mt-5 block text-[clamp(1.32rem,2.1vw,1.95rem)] font-[430] uppercase leading-[0.88] tracking-[-0.055em] transition-[color,transform] duration-300"
            style={{
              color: active ? "rgba(255,255,255,.98)" : "rgba(255,255,255,.40)",
              transform: active ? "translateX(3px)" : "translateX(0)",
            }}
          >
            {principle.title}
          </span>
        </span>

        <span
          aria-hidden="true"
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-[border-color,background-color,transform] duration-300"
          style={{
            borderColor: active ? `${GOLD}55` : "rgba(255,255,255,.07)",
            background: active ? `${GOLD}08` : "transparent",
            transform: active ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          <ArrowUpRight
            size={12}
            strokeWidth={1.1}
            className="text-white/[0.34]"
          />
        </span>
      </span>

      <motion.span
        aria-hidden="true"
        initial={false}
        animate={{
          scaleX: active ? 1 : 0,
          opacity: active ? 1 : 0,
        }}
        transition={{
          duration: reducedMotion ? 0 : 0.42,
          ease: EASE,
        }}
        className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left"
        style={{
          background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT}42, transparent)`,
        }}
      />
    </button>
  );
}

function MediaWindow({
  media,
  locale,
  index,
}: {
  media: MediaSpec;
  locale: Locale;
  index: string;
}) {
  const copy = copyByLocale[locale];
  const isImage = media.type === "image" && Boolean(media.src);
  const isVideo = media.type === "video" && Boolean(media.src);

  return (
    <div className="relative overflow-hidden border border-white/[0.085] bg-[#040404] shadow-[0_24px_70px_rgba(0,0,0,.34)]">
      <div className="flex h-8 items-center justify-between border-b border-white/[0.055] bg-[#050505] px-4 sm:px-5">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full"
            style={{
              background: GOLD_LIGHT,
              boxShadow: `0 0 12px ${GOLD_LIGHT}38`,
            }}
          />
          <span className="font-mono text-[6px] uppercase tracking-[0.3em] text-white/[0.34]">
            {copy.mediaLabel}
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[6px] uppercase tracking-[0.25em] text-white/[0.16]">
          <span>{index} / {PRINCIPLE_COUNT.toString().padStart(2, "0")}</span>
          <Maximize2
            aria-hidden="true"
            size={11}
            strokeWidth={1.05}
          />
        </div>
      </div>

      <div className="relative h-[clamp(200px,19vw,248px)] overflow-hidden">
        {isImage && media.src ? (
          <Image
            src={media.src}
            alt={media.alt}
            fill
            sizes="(min-width: 1280px) 54vw, (min-width: 1024px) 58vw, 100vw"
            className="object-cover"
          />
        ) : isVideo && media.src ? (
          <video
            src={media.src}
            poster={media.poster ?? undefined}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_24%,rgba(234,211,154,.065),transparent_24%),radial-gradient(circle_at_30%_80%,rgba(199,169,107,.028),transparent_32%),linear-gradient(135deg,#0b0b0a_0%,#050505_54%,#080706_100%)]" />
            <div className="absolute inset-0 opacity-[0.055] [background-image:linear-gradient(rgba(255,255,255,.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] [background-size:86px_86px]" />
            <div className="absolute inset-[8%] border border-white/[0.045]" />
            <div className="absolute inset-[15%] border border-[#c7a96b]/[0.055]" />

            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#c7a96b]/[0.12]"
            />
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.055]"
            />

            <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center">
              <span
                className="mb-4 font-mono text-[6px] uppercase tracking-[0.34em]"
                style={{ color: `${GOLD_LIGHT}55` }}
              >
                {copy.mediaStatus}
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c7a96b]/[0.18] bg-black/25">
                <Play
                  aria-hidden="true"
                  size={12}
                  strokeWidth={1.05}
                  className="translate-x-px text-[#ead39a]/60"
                />
              </div>
              <span className="mt-4 max-w-[290px] text-[11px] leading-5 text-white/[0.24] sm:text-[12px]">
                {copy.mediaEmpty}
              </span>
            </div>

            <span className="absolute left-5 top-5 h-8 w-8 border-l border-t border-[#ead39a]/18" />
            <span className="absolute bottom-5 right-5 h-8 w-8 border-b border-r border-[#c7a96b]/14" />
          </>
        )}

        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 border-[12px] border-black/[0.07]"
        />

        <div className="pointer-events-none absolute inset-x-4 bottom-3 flex items-end justify-between gap-4">
          <span className="font-mono text-[6px] uppercase tracking-[0.3em] text-[#ead39a]/58">
            {isVideo ? copy.mediaVideo : copy.mediaImage}
          </span>
          <span className="font-mono text-[6px] uppercase tracking-[0.25em] text-white/[0.16]">
            {copy.visualCode}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function StudioScene({
  locale = "sr",
}: StudioSceneProps) {
  const reducedMotion = useReducedMotion() ?? false;
  const copy = copyByLocale[locale];
  const principles = principlesByLocale[locale];
  const [activeIndex, setActiveIndex] = useState(0);
  const activePrinciple = principles[activeIndex];

  const nextHref = locale === "en" ? "/en#watch" : "/#watch";
  const projectsHref = locale === "en" ? "/en/projects" : "/serije";
  const charactersHref = locale === "en" ? "/en/characters" : "/likovi";

  const selectPrinciple = (index: number) => {
    setActiveIndex(index);
  };

  const moveSelection = (direction: number) => {
    setActiveIndex(
      (activeIndex + direction + principles.length) % principles.length,
    );
  };

  const handleSelectorKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex: number | null = null;

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      nextIndex = (index + 1) % principles.length;
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      nextIndex = (index - 1 + principles.length) % principles.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = principles.length - 1;
    }

    if (nextIndex === null) {
      return;
    }

    event.preventDefault();
    setActiveIndex(nextIndex);
    window.requestAnimationFrame(() => {
      const nextTab = document.querySelector<HTMLButtonElement>(
        `[data-studio-tab="${principles[nextIndex as number].index}"]`,
      );
      nextTab?.focus();
    });
  };

  return (
    <section
      id="o-studiju"
      data-umbra-scene="studio"
      aria-labelledby="studio-title"
      className="relative overflow-hidden border-b border-white/[0.06] bg-[#050505] scroll-mt-[240px]"
      style={{ scrollMarginTop: "240px" }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-[68%] top-[8%] h-[620px] w-[620px] -translate-x-1/2 rounded-full"
          style={{
            background: `radial-gradient(circle, ${GOLD}055 0%, transparent 66%)`,
            filter: "blur(92px)",
          }}
        />
        <div
          className="absolute -left-[18%] top-[48%] h-[760px] w-[760px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,.009), transparent 70%)",
            filter: "blur(110px)",
          }}
        />
        <div className="absolute inset-x-[6%] top-0 h-px bg-white/[0.035]" />
        <div className="absolute left-[6%] top-0 h-full w-px bg-white/[0.018]" />
        <div className="absolute right-[6%] top-0 h-full w-px bg-white/[0.018]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1480px] px-6 pb-24 pt-36 sm:px-10 sm:pb-28 sm:pt-[208px] lg:px-16 lg:pb-32 lg:pt-[220px]">
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
              className="h-px w-9"
              style={{
                background: `linear-gradient(90deg, transparent, ${GOLD})`,
              }}
            />
            <span
              className="font-mono text-[7px] tracking-[0.32em]"
              style={{ color: `${GOLD_LIGHT}80` }}
            >
              {copy.sectionCode}
            </span>
            <span className="font-mono text-[8px] uppercase tracking-[0.28em] text-white/[0.38]">
              {copy.sectionLabel}
            </span>
          </div>

          <span className="hidden font-mono text-[6px] uppercase tracking-[0.3em] text-white/[0.15] sm:block">
            {copy.kicker}
          </span>
        </motion.div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.03fr_.97fr] lg:gap-20 xl:mt-16">
          <motion.div
            initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.14 }}
            transition={{ duration: reducedMotion ? 0 : 0.78, ease: EASE }}
          >
            <p className="font-mono text-[7px] uppercase tracking-[0.34em] text-white/[0.2]">
              {copy.system}
            </p>

            <h2
              id="studio-title"
              className="mt-6 max-w-[760px] text-[clamp(3.1rem,5.7vw,6.6rem)] font-[430] uppercase leading-[0.82] tracking-[-0.078em] text-white"
            >
              <span className="block">{copy.titleA}</span>
              <span className="block font-serif font-normal italic text-white/[0.56]">
                {copy.titleB}
              </span>
            </h2>

            <span
              aria-hidden="true"
              className="mt-9 block h-px max-w-[500px]"
              style={{
                background:
                  `linear-gradient(90deg, ${GOLD}65, rgba(255,255,255,.06), transparent)`,
              }}
            />

            <p className="mt-7 max-w-[610px] text-[14px] leading-7 text-white/[0.42] sm:text-[15px] sm:leading-8">
              {copy.lead}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: reducedMotion ? 0 : 18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.14 }}
            transition={{ duration: reducedMotion ? 0 : 0.66, ease: EASE }}
            className="self-end"
          >
            <div className="relative border-l border-white/[0.07] pl-6 sm:pl-8">
              <span
                aria-hidden="true"
                className="absolute left-[-1px] top-0 h-16 w-px"
                style={{
                  background: "linear-gradient(180deg, #ead39a, transparent)",
                }}
              />

              <p className="font-mono text-[6px] uppercase tracking-[0.34em] text-white/[0.17]">
                {locale === "en" ? "UMBRA / DEFINITION" : "UMBRA / DEFINICIJA"}
              </p>

              <p className="mt-5 max-w-[530px] text-[13px] leading-7 text-white/[0.34] sm:text-[14px] sm:leading-8">
                {copy.body}
              </p>

              <div className="mt-8 flex items-center gap-3">
                <span className="h-px w-8" style={{ background: `${GOLD}55` }} />
                <span className="font-mono text-[6px] uppercase tracking-[0.28em] text-white/[0.16]">
                  {copy.processMeta}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.section
          aria-labelledby="studio-process-title"
          initial={{ opacity: 0, y: reducedMotion ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: reducedMotion ? 0 : 0.62, ease: EASE }}
          className="mt-20 sm:mt-24 lg:mt-28"
        >
          <div className="flex flex-col gap-5 border-b border-white/[0.055] pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p
                className="font-mono text-[7px] uppercase tracking-[0.34em]"
                style={{ color: `${GOLD_LIGHT}80` }}
              >
                {copy.processLabel}
              </p>
              <h3
                id="studio-process-title"
                className="mt-3 max-w-[760px] text-[clamp(1.7rem,3vw,2.85rem)] font-[430] uppercase leading-[0.9] tracking-[-0.06em] text-white/[0.92]"
              >
                {copy.processTitle}
              </h3>
            </div>

            <span className="font-mono text-[6px] uppercase tracking-[0.28em] text-white/[0.14]">
              {copy.principleCount}
            </span>
          </div>

          <div
            className="mt-5 grid overflow-hidden border border-white/[0.075] bg-[#050505] lg:grid-cols-[0.5fr_0.5fr] lg:items-stretch"
            role="tablist"
            aria-label={copy.processLabel}
          >
            <div className="grid grid-rows-4 divide-y divide-white/[0.055] border-b border-white/[0.055] lg:border-b-0 lg:border-r">
              {principles.map((principle, index) => (
                <div key={`${locale}-${principle.index}`} data-studio-selector={principle.index}>
                  <PrincipleSelector
                    principle={principle}
                    active={index === activeIndex}
                    onSelect={() => selectPrinciple(index)}
                    onKeyDown={(event) => handleSelectorKeyDown(event, index)}
                    reducedMotion={reducedMotion}
                  />
                </div>
              ))}
            </div>

            <div
              id={`studio-panel-${activePrinciple.index}`}
              className="relative min-h-[472px] overflow-hidden bg-[#070707]"
            >
              <div className="absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-[#c7a96b]/45 to-transparent" />

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`${locale}-${activePrinciple.index}`}
                  initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reducedMotion ? 0 : -8 }}
                  transition={{ duration: reducedMotion ? 0 : 0.38, ease: EASE }}
                  className="relative z-10 flex h-full min-h-0 flex-col p-4 sm:p-5 lg:p-5"
                  role="tabpanel"
                  aria-labelledby={`studio-tab-${activePrinciple.index}`}
                >
                  <div className="flex items-center justify-between border-b border-white/[0.05] pb-4">
                    <div className="flex items-center gap-3">
                      <span
                        className="font-mono text-[7px] tracking-[0.24em]"
                        style={{ color: `${GOLD_LIGHT}78` }}
                      >
                        {activePrinciple.index}
                      </span>
                      <span className="h-px w-7 bg-white/[0.08]" />
                      <span className="font-mono text-[6px] uppercase tracking-[0.25em] text-white/[0.18]">
                        {activePrinciple.code}
                      </span>
                    </div>

                    <div className="hidden items-center gap-3 font-mono text-[6px] uppercase tracking-[0.22em] text-white/[0.14] sm:flex">
                      <span>{copy.mediaLabel}</span>
                      <span>{activePrinciple.index} / 04</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <MediaWindow
                      media={activePrinciple.media}
                      locale={locale}
                      index={activePrinciple.index}
                    />
                  </div>

                  <div className="mt-4 grid gap-5 border-t border-white/[0.055] pt-4 lg:grid-cols-[0.44fr_0.56fr] lg:gap-5">
                    <div>
                      <p
                        className="font-mono text-[7px] uppercase tracking-[0.3em]"
                        style={{ color: `${GOLD_LIGHT}76` }}
                      >
                        {activePrinciple.eyebrow}
                      </p>
                      <h4 className="mt-3 text-[clamp(1.6rem,2.7vw,2.75rem)] font-[430] uppercase leading-[0.86] tracking-[-0.065em] text-white">
                        {activePrinciple.title}
                      </h4>
                    </div>

                    <div className="lg:border-l lg:border-white/[0.055] lg:pl-8">
                      <p className="text-[12px] leading-6 text-white/[0.43] sm:text-[13px] sm:leading-7">
                        {activePrinciple.description}
                      </p>

                      <div className="mt-4 border-t border-white/[0.05] pt-4">
                        <p className="font-mono text-[6px] uppercase tracking-[0.26em] text-white/[0.16]">
                          {copy.activeLabel}
                        </p>
                        <p className="mt-2 text-[11px] leading-5 text-white/[0.52] sm:text-[12px] sm:leading-6">
                          {activePrinciple.detail}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-white/[0.055] pt-3">
                    <div className="flex items-center gap-3">
                      <Check
                        aria-hidden="true"
                        size={11}
                        strokeWidth={1.2}
                        style={{ color: `${GOLD_LIGHT}70` }}
                      />
                      <span className="font-mono text-[6px] uppercase tracking-[0.25em] text-white/[0.14]">
                        {copy.processMeta}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => moveSelection(-1)}
                        aria-label={locale === "en" ? "Previous element" : "Prethodni element"}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] text-white/[0.25] transition-[border-color,color,transform] duration-300 hover:-translate-x-px hover:border-[#c7a96b]/35 hover:text-[#ead39a] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/65"
                      >
                        <ArrowLeft size={12} strokeWidth={1.1} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSelection(1)}
                        aria-label={locale === "en" ? "Next element" : "Sledeći element"}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] text-white/[0.25] transition-[border-color,color,transform] duration-300 hover:translate-x-px hover:border-[#c7a96b]/35 hover:text-[#ead39a] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/65"
                      >
                        <ArrowRight size={12} strokeWidth={1.1} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="font-mono text-[6px] uppercase tracking-[0.26em] text-white/[0.12]">
              {copy.selectionHint}
            </span>
            <span className="font-mono text-[6px] uppercase tracking-[0.26em] text-white/[0.12]">
              {activePrinciple.index} / 04
            </span>
          </div>
        </motion.section>

        <div className="mt-12 grid gap-3 sm:grid-cols-2">
          <Link
            href={projectsHref}
            className="group flex min-h-[68px] items-center justify-between border border-white/[0.075] bg-[#060606] px-5 transition-[border-color,transform,background] duration-400 hover:-translate-y-0.5 hover:border-[#c7a96b]/30 hover:bg-[#080808] sm:px-6"
          >
            <span>
              <span className="block font-mono text-[6px] uppercase tracking-[0.28em] text-white/[0.15]">
                UMBRA / PROJECTS
              </span>
              <span className="mt-2 block text-[10px] uppercase tracking-[0.14em] text-white/[0.52] transition-colors duration-300 group-hover:text-white/[0.8]">
                {copy.openProjects}
              </span>
            </span>
            <ArrowUpRight
              aria-hidden="true"
              size={15}
              strokeWidth={1.1}
              className="text-white/[0.25] transition-[color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#ead39a]"
            />
          </Link>

          <Link
            href={charactersHref}
            className="group flex min-h-[68px] items-center justify-between border border-white/[0.075] bg-[#060606] px-5 transition-[border-color,transform,background] duration-400 hover:-translate-y-0.5 hover:border-[#c7a96b]/30 hover:bg-[#080808] sm:px-6"
          >
            <span>
              <span className="block font-mono text-[6px] uppercase tracking-[0.28em] text-white/[0.15]">
                UMBRA / CHARACTERS
              </span>
              <span className="mt-2 block text-[10px] uppercase tracking-[0.14em] text-white/[0.52] transition-colors duration-300 group-hover:text-white/[0.8]">
                {copy.openCharacters}
              </span>
            </span>
            <ArrowUpRight
              aria-hidden="true"
              size={15}
              strokeWidth={1.1}
              className="text-white/[0.25] transition-[color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#ead39a]"
            />
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{ duration: reducedMotion ? 0 : 0.5, ease: EASE }}
          className="mt-10 flex flex-col gap-5 border-t border-white/[0.055] pt-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="h-px w-8" style={{ background: `${GOLD}48` }} />
            <span className="font-mono text-[6px] uppercase tracking-[0.28em] text-white/[0.15]">
              {copy.system}
            </span>
          </div>

          <Link
            href={nextHref}
            className="group flex items-center gap-3 self-start sm:self-auto"
          >
            <span className="text-[7px] uppercase tracking-[0.26em] text-white/[0.2] transition-colors duration-300 group-hover:text-white/[0.48]">
              {copy.next}
            </span>
            <ArrowDownRight
              aria-hidden="true"
              size={13}
              strokeWidth={1.1}
              className="text-[#ead39a]/55 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
            />
            <span className="sr-only">{copy.nextLabel}</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
