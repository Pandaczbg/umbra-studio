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
import { useState } from "react";

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
        "Kada priča, lik i svet dobiju jasnu formu, pretvaramo ih u stvaran produkcioni materijal za ekran.",
      detail:
        "Od kadra i zvuka do animacije, montaže i finalne isporuke — svaki deo produkcije postoji da služi priči.",
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
    processTitle: "Četiri stvari koje drže priču na okupu",
    processMeta: "OD IDEJE DO EKRANA",
    activeLabel: "AKTIVNA ODLUKA",
    selectionHint: "IZABERI ELEMENT",
    mediaLabel: "VIZUELNI PRIKAZ",
    mediaImage: "SLIKA",
    mediaVideo: "VIDEO",
    mediaReady: "MATERIJAL ZA PRODUKCIJU",
    mediaEmpty: "Mesto za budući kadar, sliku ili video materijal",
    openProjects: "Istraži projekte",
    openCharacters: "Upoznaj likove",
    next: "05 / GLEDAJ",
    nextLabel: "Gledaj",
    system: "PRIČA / LIK / SVET / PRODUKCIJA",
    principleCount: "04 ELEMENTA",
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
    processTitle: "Four things that hold a story together",
    processMeta: "FROM IDEA TO SCREEN",
    activeLabel: "ACTIVE DECISION",
    selectionHint: "SELECT AN ELEMENT",
    mediaLabel: "VISUAL PREVIEW",
    mediaImage: "IMAGE",
    mediaVideo: "VIDEO",
    mediaReady: "PRODUCTION MATERIAL",
    mediaEmpty: "A place for the future frame, image or video material",
    openProjects: "Explore projects",
    openCharacters: "Meet the characters",
    next: "05 / WATCH",
    nextLabel: "Watch",
    system: "STORY / CHARACTER / WORLD / PRODUCTION",
    principleCount: "04 ELEMENTS",
  },
} as const;

function PrincipleSelector({
  principle,
  active,
  onSelect,
  reducedMotion,
}: {
  principle: Principle;
  active: boolean;
  onSelect: () => void;
  reducedMotion: boolean;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      aria-label={`${principle.index} ${principle.title}`}
      onClick={onSelect}
      className="group relative block w-full cursor-pointer text-left outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#ead39a]/75"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-colors duration-500"
        style={{
          background: active
            ? "linear-gradient(90deg, rgba(199,169,107,.065), rgba(199,169,107,.01) 76%, transparent)"
            : "transparent",
        }}
      />

      <span className="relative z-10 flex min-h-[108px] items-start justify-between gap-5 px-5 py-5 sm:min-h-[120px] sm:px-7 sm:py-6">
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
                background: active
                  ? `${GOLD}78`
                  : "rgba(255,255,255,.08)",
                width: active ? "30px" : "18px",
              }}
            />

            <span
              className="font-mono text-[6px] uppercase tracking-[0.25em] transition-colors duration-300"
              style={{
                color: active
                  ? `${GOLD_LIGHT}92`
                  : "rgba(255,255,255,.14)",
              }}
            >
              {principle.eyebrow}
            </span>
          </span>

          <span
            className="mt-5 block text-[clamp(1.45rem,2.5vw,2.2rem)] font-[430] uppercase leading-[0.88] tracking-[-0.055em] transition-[color,transform] duration-300"
            style={{
              color: active
                ? "rgba(255,255,255,.98)"
                : "rgba(255,255,255,.40)",
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
          duration: reducedMotion ? 0 : 0.44,
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
}: {
  media: MediaSpec;
  locale: Locale;
}) {
  const copy = copyByLocale[locale];
  const isImage = media.type === "image" && Boolean(media.src);
  const isVideo = media.type === "video" && Boolean(media.src);

  return (
    <div className="relative overflow-hidden border border-white/[0.08] bg-[#050505] shadow-[0_30px_90px_rgba(0,0,0,.34)]">
      <div className="absolute inset-x-0 top-0 z-20 flex h-9 items-center justify-between border-b border-white/[0.06] bg-black/45 px-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="h-1 w-1 rounded-full"
            style={{
              background: GOLD_LIGHT,
              boxShadow: `0 0 10px ${GOLD_LIGHT}40`,
            }}
          />
          <span className="font-mono text-[6px] uppercase tracking-[0.28em] text-white/[0.28]">
            {copy.mediaLabel}
          </span>
        </div>

        <Maximize2
          aria-hidden="true"
          size={11}
          strokeWidth={1.1}
          className="text-white/[0.18]"
        />
      </div>

      <div className="relative aspect-[16/10] min-h-[270px] sm:min-h-[320px]">
        {(isImage || isVideo) && media.src ? (
          isImage ? (
            <Image
              src={media.src}
              alt={media.alt}
              fill
              sizes="(min-width: 1024px) 52vw, 100vw"
              className="object-cover"
              priority={false}
            />
          ) : (
            <video
              src={media.src}
              poster={media.poster ?? undefined}
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
          )
        ) : (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_30%,rgba(234,211,154,.055),transparent_28%),linear-gradient(135deg,#090909_0%,#050505_58%,#080706_100%)]" />
            <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] [background-size:74px_74px]" />
            <div className="absolute inset-[9%] border border-white/[0.035]" />
            <div className="absolute inset-[13%] border border-[#c7a96b]/[0.06]" />

            <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-[#c7a96b]/[0.16] bg-black/20">
                <Play
                  aria-hidden="true"
                  size={13}
                  strokeWidth={1.1}
                  className="translate-x-px text-[#ead39a]/60"
                />
              </div>

              <span className="font-mono text-[7px] uppercase tracking-[0.30em] text-[#ead39a]/45">
                {copy.mediaReady}
              </span>

              <span className="mt-3 max-w-[260px] text-[11px] leading-5 text-white/[0.23]">
                {copy.mediaEmpty}
              </span>
            </div>

            <span className="absolute left-4 top-14 h-7 w-7 border-l border-t border-[#ead39a]/20" />
            <span className="absolute bottom-4 right-4 h-7 w-7 border-b border-r border-[#c7a96b]/16" />
          </>
        )}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 border-[10px] border-black/10"
        />

        <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-end justify-between gap-4">
          <div>
            <span className="font-mono text-[6px] uppercase tracking-[0.28em] text-[#ead39a]/58">
              {isVideo ? copy.mediaVideo : copy.mediaImage}
            </span>
          </div>
          <span className="font-mono text-[6px] uppercase tracking-[0.25em] text-white/[0.16]">
            UMBRA / VISUAL
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

  return (
    <section
      id="o-studiju"
      data-umbra-scene="studio"
      aria-labelledby="studio-title"
      className="relative overflow-hidden border-b border-white/[0.06] bg-[#050505]"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-[62%] top-[10%] h-[620px] w-[620px] -translate-x-1/2 rounded-full"
          style={{
            background: `radial-gradient(circle, ${GOLD}06 0%, transparent 68%)`,
            filter: "blur(88px)",
          }}
        />
        <div
          className="absolute -left-[18%] top-[48%] h-[760px] w-[760px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,.010), transparent 70%)",
            filter: "blur(105px)",
          }}
        />
        <div className="absolute inset-x-[6%] top-0 h-px bg-white/[0.035]" />
        <div className="absolute left-[6%] top-0 h-full w-px bg-white/[0.018]" />
        <div className="absolute right-[6%] top-0 h-full w-px bg-white/[0.018]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1500px] px-6 py-24 sm:px-10 sm:py-28 lg:px-16 lg:py-32">
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

        <div className="mt-16 grid gap-14 lg:grid-cols-[1.06fr_.94fr] lg:gap-24 xl:mt-20">
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
              className="mt-6 max-w-[880px] text-[clamp(3.4rem,6.8vw,7.7rem)] font-[430] uppercase leading-[0.82] tracking-[-0.078em] text-white"
            >
              <span className="block">{copy.titleA}</span>
              <span className="block font-serif font-normal italic text-white/[0.56]">
                {copy.titleB}
              </span>
            </h2>

            <span
              aria-hidden="true"
              className="mt-9 block h-px max-w-[520px]"
              style={{
                background: `linear-gradient(90deg, ${GOLD}65, rgba(255,255,255,.06), transparent)`,
              }}
            />

            <p className="mt-7 max-w-[620px] text-[14px] leading-7 text-white/[0.42] sm:text-[15px] sm:leading-8">
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
          className="mt-24 sm:mt-28 lg:mt-32"
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
                className="mt-3 max-w-[820px] text-[clamp(1.9rem,3.55vw,3.45rem)] font-[430] uppercase leading-[0.9] tracking-[-0.06em] text-white/[0.92]"
              >
                {copy.processTitle}
              </h3>
            </div>

            <span className="font-mono text-[6px] uppercase tracking-[0.28em] text-white/[0.14]">
              {copy.principleCount}
            </span>
          </div>

          <div
            className="mt-5 grid overflow-hidden border border-white/[0.07] bg-[#060606] lg:grid-cols-[0.72fr_1.28fr]"
            role="tablist"
            aria-label={copy.processLabel}
          >
            <div className="divide-y divide-white/[0.06] border-b border-white/[0.06] lg:border-b-0 lg:border-r">
              {principles.map((principle, index) => (
                <PrincipleSelector
                  key={`${locale}-${principle.index}`}
                  principle={principle}
                  active={index === activeIndex}
                  onSelect={() => selectPrinciple(index)}
                  reducedMotion={reducedMotion}
                />
              ))}
            </div>

            <div className="relative min-h-[600px] overflow-hidden bg-[#070707] sm:min-h-[690px]">
              <div className="absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-[#c7a96b]/45 to-transparent" />

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`${locale}-${activePrinciple.index}`}
                  initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reducedMotion ? 0 : -8 }}
                  transition={{ duration: reducedMotion ? 0 : 0.38, ease: EASE }}
                  className="relative z-10 flex h-full min-h-[600px] flex-col p-5 sm:min-h-[690px] sm:p-7 lg:p-9"
                  role="tabpanel"
                  aria-label={activePrinciple.title}
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

                    <div className="flex items-center gap-3 font-mono text-[6px] uppercase tracking-[0.22em] text-white/[0.14]">
                      <span>{copy.mediaLabel}</span>
                      <span>{activePrinciple.index} / 04</span>
                    </div>
                  </div>

                  <div className="grid flex-1 gap-7 pt-7 xl:grid-cols-[minmax(0,1fr)_minmax(250px,.46fr)]">
                    <MediaWindow
                      media={activePrinciple.media}
                      locale={locale}
                    />

                    <div className="flex flex-col justify-between border-l border-white/[0.06] pl-6 xl:pl-7">
                      <div>
                        <p
                          className="font-mono text-[7px] uppercase tracking-[0.3em]"
                          style={{ color: `${GOLD_LIGHT}76` }}
                        >
                          {activePrinciple.eyebrow}
                        </p>

                        <h4 className="mt-4 text-[clamp(2rem,3.8vw,3.9rem)] font-[430] uppercase leading-[0.86] tracking-[-0.065em] text-white">
                          {activePrinciple.title}
                        </h4>

                        <p className="mt-5 text-[12px] leading-6 text-white/[0.40] sm:text-[13px] sm:leading-7">
                          {activePrinciple.description}
                        </p>
                      </div>

                      <div className="mt-8 border-t border-white/[0.06] pt-5">
                        <p className="font-mono text-[6px] uppercase tracking-[0.26em] text-white/[0.16]">
                          {copy.activeLabel}
                        </p>
                        <p className="mt-3 text-[11px] leading-5 text-white/[0.50] sm:text-[12px] sm:leading-6">
                          {activePrinciple.detail}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-7 flex flex-col gap-4 border-t border-white/[0.06] pt-5 sm:flex-row sm:items-center sm:justify-between">
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

        <div className="mt-16 grid gap-3 sm:grid-cols-2">
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
          className="mt-12 flex flex-col gap-5 border-t border-white/[0.055] pt-6 sm:flex-row sm:items-center sm:justify-between"
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
