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
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

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
    mediaReady: "VIZUELNI MODEL",
    mediaEmpty:
      "Namerno apstraktan prikaz principa dok stvarni produkcioni materijal ne preuzme ovaj prostor",
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
    mediaReady: "VISUAL MODEL",
    mediaEmpty:
      "An intentionally abstract representation until real production material takes over this space",
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
  tabId,
  panelId,
  onSelect,
  onKeyDown,
  tabIndex,
  buttonRef,
  reducedMotion,
}: {
  principle: Principle;
  active: boolean;
  tabId: string;
  panelId: string;
  onSelect: () => void;
  onKeyDown: (
    event: KeyboardEvent<HTMLButtonElement>,
  ) => void;
  tabIndex: number;
  buttonRef: (
    element: HTMLButtonElement | null,
  ) => void;
  reducedMotion: boolean;
}) {
  return (
    <button
      ref={buttonRef}
      type="button"
      id={tabId}
      role="tab"
      aria-selected={active}
      aria-controls={panelId}
      aria-label={`${principle.index} ${principle.title}`}
      tabIndex={tabIndex}
      onClick={onSelect}
      onKeyDown={onKeyDown}
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

      <span className="relative z-10 flex min-h-[96px] items-start justify-between gap-5 px-4 py-5 sm:min-h-[120px] sm:px-7 sm:py-6">
        <span>
          <span className="flex items-center gap-3">
            <span
              className="font-mono text-[7px] tracking-[0.25em] transition-colors duration-300"
              style={{
                color: active
                  ? GOLD_LIGHT
                  : "rgba(255,255,255,.20)",
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
            className="mt-4 block text-[clamp(1.35rem,2.5vw,2.2rem)] font-[430] uppercase leading-[0.88] tracking-[-0.055em] transition-[color,transform] duration-300 sm:mt-5"
            style={{
              color: active
                ? "rgba(255,255,255,.98)"
                : "rgba(255,255,255,.40)",
              transform: active
                ? "translateX(3px)"
                : "translateX(0)",
            }}
          >
            {principle.title}
          </span>
        </span>

        <span
          aria-hidden="true"
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-[border-color,background-color,transform] duration-300"
          style={{
            borderColor: active
              ? `${GOLD}55`
              : "rgba(255,255,255,.07)",
            background: active
              ? `${GOLD}08`
              : "transparent",
            transform: active
              ? "rotate(45deg)"
              : "rotate(0deg)",
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

function VisualModel({
  principle,
}: {
  principle: Principle;
}) {
  const tone =
    principle.index === "01"
      ? "story"
      : principle.index === "02"
        ? "character"
        : principle.index === "03"
          ? "world"
          : "production";

  if (tone === "story") {
    return (
      <div
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_68%_28%,rgba(234,211,154,.08),transparent_26%),linear-gradient(135deg,#090909_0%,#050505_58%,#080706_100%)]"
      >
        <div className="absolute inset-8 border border-white/[0.045] sm:inset-12" />

        <div className="absolute left-[13%] right-[11%] top-[24%] h-px bg-white/[0.10]" />
        <div className="absolute left-[13%] right-[21%] top-[39%] h-px bg-white/[0.07]" />
        <div className="absolute left-[13%] right-[31%] top-[54%] h-px bg-white/[0.05]" />

        <div className="absolute left-[13%] top-[24%] h-[30%] w-px bg-[#ead39a]/[0.38]" />

        <div className="absolute left-[13%] top-[24%] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#ead39a]/[0.55] bg-[#050505]" />
        <div className="absolute left-[34%] top-[24%] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c7a96b]/[0.52]" />
        <div className="absolute left-[61%] top-[39%] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ead39a]/[0.42]" />
        <div className="absolute left-[82%] top-[54%] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#c7a96b]/[0.38]" />

        <div className="absolute bottom-[16%] left-[13%] font-mono text-[6px] uppercase tracking-[0.30em] text-white/[0.18]">
          EVENT / RELATION / DECISION
        </div>

        <div className="absolute right-[12%] top-[18%] font-mono text-[6px] tracking-[0.28em] text-[#ead39a]/[0.36]">
          01
        </div>
      </div>
    );
  }

  if (tone === "character") {
    return (
      <div
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_70%_36%,rgba(234,211,154,.075),transparent_26%),linear-gradient(135deg,#090909_0%,#050505_58%,#080706_100%)]"
      >
        <div className="absolute left-1/2 top-1/2 h-[48%] w-[48%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.05]" />

        <div className="absolute left-1/2 top-1/2 h-[34%] w-[34%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#c7a96b]/[0.14]" />

        <div className="absolute left-1/2 top-[37%] h-20 w-20 -translate-x-1/2 rounded-full border border-[#ead39a]/[0.22] bg-[#ead39a]/[0.025]" />

        <div className="absolute left-1/2 top-[56%] h-[26%] w-[38%] -translate-x-1/2 rounded-[50%_50%_42%_42%] border border-white/[0.055]" />

        <div className="absolute left-[24%] top-[28%] h-px w-[52%] bg-white/[0.06]" />
        <div className="absolute left-[24%] top-[70%] h-px w-[52%] bg-white/[0.05]" />

        <div className="absolute left-[12%] top-[16%] font-mono text-[6px] uppercase tracking-[0.30em] text-white/[0.16]">
          DESIRE
        </div>

        <div className="absolute bottom-[16%] left-[12%] font-mono text-[6px] uppercase tracking-[0.30em] text-[#ead39a]/[0.34]">
          RELATION / CHOICE
        </div>

        <div className="absolute right-[12%] top-[16%] font-mono text-[6px] tracking-[0.28em] text-[#ead39a]/[0.36]">
          02
        </div>
      </div>
    );
  }

  if (tone === "world") {
    return (
      <div
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_74%_25%,rgba(234,211,154,.085),transparent_23%),linear-gradient(135deg,#080909_0%,#050505_60%,#080706_100%)]"
      >
        <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] [background-size:64px_64px]" />

        <div className="absolute bottom-[14%] left-[9%] h-[48%] w-[82%] border-t border-white/[0.08]" />

        <div className="absolute bottom-[14%] left-[24%] h-[48%] w-px bg-white/[0.06]" />
        <div className="absolute bottom-[14%] left-[52%] h-[48%] w-px bg-white/[0.04]" />
        <div className="absolute bottom-[14%] left-[78%] h-[48%] w-px bg-white/[0.06]" />

        <div className="absolute left-[70%] top-[27%] h-[30%] w-[30%] -translate-x-1/2 rounded-full border border-[#ead39a]/[0.18]" />

        <div className="absolute left-[70%] top-[27%] h-[18%] w-[18%] -translate-x-1/2 rounded-full bg-[#ead39a]/[0.028]" />

        <div className="absolute left-[9%] top-[16%] font-mono text-[6px] uppercase tracking-[0.30em] text-white/[0.16]">
          TIME / SPACE / LIGHT
        </div>

        <div className="absolute bottom-[11%] left-[9%] font-mono text-[6px] uppercase tracking-[0.30em] text-[#ead39a]/[0.34]">
          WORLD BUILDING
        </div>

        <div className="absolute right-[10%] top-[15%] font-mono text-[6px] tracking-[0.28em] text-[#ead39a]/[0.36]">
          03
        </div>
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_28%_28%,rgba(234,211,154,.055),transparent_24%),linear-gradient(135deg,#090909_0%,#050505_58%,#080706_100%)]"
    >
      <div className="absolute inset-[9%] border border-white/[0.045]" />
      <div className="absolute inset-[15%] border border-[#c7a96b]/[0.07]" />

      <div className="absolute left-[14%] right-[14%] top-[25%] h-px bg-white/[0.07]" />
      <div className="absolute left-[14%] right-[14%] top-[50%] h-px bg-white/[0.055]" />
      <div className="absolute left-[14%] right-[14%] top-[75%] h-px bg-white/[0.04]" />

      <div className="absolute left-[28%] top-[25%] h-[50%] w-px bg-[#ead39a]/[0.18]" />
      <div className="absolute left-[54%] top-[25%] h-[50%] w-px bg-white/[0.055]" />
      <div className="absolute left-[78%] top-[25%] h-[50%] w-px bg-white/[0.05]" />

      <div className="absolute left-[28%] top-[25%] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#ead39a]/[0.42]" />
      <div className="absolute left-[54%] top-[50%] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c7a96b]/[0.38]" />
      <div className="absolute left-[78%] top-[75%] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#c7a96b]/[0.30]" />

      <div className="absolute left-[14%] top-[13%] font-mono text-[6px] uppercase tracking-[0.30em] text-white/[0.16]">
        FRAME / EDIT / DELIVER
      </div>

      <div className="absolute bottom-[12%] right-[13%] font-mono text-[6px] uppercase tracking-[0.28em] text-[#ead39a]/[0.34]">
        04 / PRODUCTION
      </div>

      <div className="absolute right-[12%] top-[13%] font-mono text-[6px] tracking-[0.28em] text-[#ead39a]/[0.36]">
        04
      </div>
    </div>
  );
}

function MediaWindow({
  media,
  principle,
  locale,
}: {
  media: MediaSpec;
  principle: Principle;
  locale: Locale;
}) {
  const copy = copyByLocale[locale];

  const isImage =
    media.type === "image" &&
    Boolean(media.src);

  const isVideo =
    media.type === "video" &&
    Boolean(media.src);

  const hasRealMedia = isImage || isVideo;

  return (
    <div className="relative overflow-hidden border border-white/[0.08] bg-[#050505] shadow-[0_30px_90px_rgba(0,0,0,.34)]">
      <div className="absolute inset-x-0 top-0 z-20 flex h-9 items-center justify-between border-b border-white/[0.06] bg-black/45 px-4 backdrop-blur-md sm:h-10 sm:px-5">
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

        <span className="flex items-center gap-2">
          <span className="hidden font-mono text-[6px] uppercase tracking-[0.24em] text-white/[0.14] sm:block">
            {principle.code}
          </span>

          <Maximize2
            aria-hidden="true"
            size={11}
            strokeWidth={1.1}
            className="text-white/[0.18]"
          />
        </span>
      </div>

      <div className="relative aspect-[4/3] min-h-[250px] sm:aspect-[16/10] sm:min-h-[320px]">
        {hasRealMedia && media.src ? (
          isImage ? (
            <Image
              src={media.src}
              alt={media.alt}
              fill
              sizes="(min-width: 1280px) 46vw, (min-width: 1024px) 48vw, 100vw"
              className="object-cover"
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
          <VisualModel principle={principle} />
        )}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 border-[8px] border-black/10 sm:border-[10px]"
        />

        <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 sm:inset-x-5 sm:bottom-5">
          <div className="min-w-0">
            <span className="block font-mono text-[6px] uppercase tracking-[0.28em] text-[#ead39a]/58">
              {hasRealMedia
                ? isVideo
                  ? copy.mediaVideo
                  : copy.mediaImage
                : copy.mediaReady}
            </span>

            {!hasRealMedia ? (
              <span className="mt-2 block max-w-[290px] text-[9px] leading-4 text-white/[0.22] sm:text-[10px] sm:leading-5">
                {copy.mediaEmpty}
              </span>
            ) : null}
          </div>

          <span className="shrink-0 font-mono text-[6px] uppercase tracking-[0.25em] text-white/[0.16]">
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
  const reducedMotion =
    useReducedMotion() ?? false;

  const copy = copyByLocale[locale];
  const principles =
    principlesByLocale[locale];

  const [activeIndex, setActiveIndex] =
    useState(0);

  const tabRefs = useRef<
    Array<HTMLButtonElement | null>
  >([]);

  const activePrinciple =
    principles[activeIndex];

  const nextHref =
    locale === "en"
      ? "/en#watch"
      : "/#watch";

  const projectsHref =
    locale === "en"
      ? "/en/projects"
      : "/serije";

  const charactersHref =
    locale === "en"
      ? "/en/characters"
      : "/likovi";

  const focusTab = (index: number) => {
    window.requestAnimationFrame(() => {
      tabRefs.current[index]?.focus();
    });
  };

  const selectPrinciple = (
    index: number,
  ) => {
    setActiveIndex(index);
  };

  const moveSelection = (
    direction: number,
    shouldFocus = false,
  ) => {
    const nextIndex =
      (activeIndex +
        direction +
        principles.length) %
      principles.length;

    setActiveIndex(nextIndex);

    if (shouldFocus) {
      focusTab(nextIndex);
    }
  };

  const handlePrincipleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex: number | null = null;

    switch (event.key) {
      case "ArrowLeft":
      case "ArrowUp":
        nextIndex =
          (index - 1 + principles.length) %
          principles.length;
        break;

      case "ArrowRight":
      case "ArrowDown":
        nextIndex =
          (index + 1) % principles.length;
        break;

      case "Home":
        nextIndex = 0;
        break;

      case "End":
        nextIndex =
          principles.length - 1;
        break;

      default:
        return;
    }

    event.preventDefault();
    setActiveIndex(nextIndex);
    focusTab(nextIndex);
  };

  return (
    <section
      id="o-studiju"
      data-umbra-scene="studio"
      aria-labelledby="studio-title"
      className="relative overflow-hidden border-b border-white/[0.06] bg-[#050505]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div
          className="absolute left-[62%] top-[10%] h-[520px] w-[520px] -translate-x-1/2 rounded-full sm:h-[620px] sm:w-[620px]"
          style={{
            background: `radial-gradient(circle, ${GOLD}06 0%, transparent 68%)`,
            filter: "blur(88px)",
          }}
        />

        <div
          className="absolute -left-[18%] top-[48%] h-[650px] w-[650px] rounded-full sm:h-[760px] sm:w-[760px]"
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

      <div className="relative z-10 mx-auto max-w-[1500px] px-5 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-32">
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
            duration: reducedMotion ? 0 : 0.5,
            ease: EASE,
          }}
          className="flex items-center justify-between border-b border-white/[0.055] pb-5"
        >
          <div className="flex min-w-0 items-center gap-3">
            <span
              aria-hidden="true"
              className="h-px w-7 shrink-0 sm:w-9"
              style={{
                background: `linear-gradient(90deg, transparent, ${GOLD})`,
              }}
            />

            <span
              className="font-mono text-[7px] tracking-[0.32em]"
              style={{
                color: `${GOLD_LIGHT}80`,
              }}
            >
              {copy.sectionCode}
            </span>

            <span className="truncate font-mono text-[7px] uppercase tracking-[0.24em] text-white/[0.38] sm:text-[8px] sm:tracking-[0.28em]">
              {copy.sectionLabel}
            </span>
          </div>

          <span className="hidden font-mono text-[6px] uppercase tracking-[0.3em] text-white/[0.15] sm:block">
            {copy.kicker}
          </span>
        </motion.div>

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-[1.06fr_.94fr] lg:gap-24 xl:mt-20">
          <motion.div
            initial={{
              opacity: 0,
              y: reducedMotion ? 0 : 20,
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
              duration: reducedMotion ? 0 : 0.78,
              ease: EASE,
            }}
          >
            <p className="font-mono text-[6px] uppercase tracking-[0.30em] text-white/[0.2] sm:text-[7px] sm:tracking-[0.34em]">
              {copy.system}
            </p>

            <h2
              id="studio-title"
              className="mt-5 max-w-[880px] text-[clamp(3.2rem,11vw,7.7rem)] font-[430] uppercase leading-[0.83] tracking-[-0.078em] text-white sm:mt-6 sm:text-[clamp(3.4rem,6.8vw,7.7rem)]"
            >
              <span className="block">
                {copy.titleA}
              </span>

              <span className="block font-serif font-normal italic text-white/[0.56]">
                {copy.titleB}
              </span>
            </h2>

            <span
              aria-hidden="true"
              className="mt-7 block h-px max-w-[520px] sm:mt-9"
              style={{
                background: `linear-gradient(90deg, ${GOLD}65, rgba(255,255,255,.06), transparent)`,
              }}
            />

            <p className="mt-6 max-w-[620px] text-[12px] leading-6 text-white/[0.42] sm:mt-7 sm:text-[15px] sm:leading-8">
              {copy.lead}
            </p>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              x: reducedMotion ? 0 : 18,
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
              duration: reducedMotion ? 0 : 0.66,
              ease: EASE,
            }}
            className="self-end"
          >
            <div className="relative border-l border-white/[0.07] pl-5 sm:pl-8">
              <span
                aria-hidden="true"
                className="absolute left-[-1px] top-0 h-16 w-px"
                style={{
                  background:
                    "linear-gradient(180deg, #ead39a, transparent)",
                }}
              />

              <p className="font-mono text-[6px] uppercase tracking-[0.32em] text-white/[0.17]">
                {locale === "en"
                  ? "UMBRA / DEFINITION"
                  : "UMBRA / DEFINICIJA"}
              </p>

              <p className="mt-4 max-w-[530px] text-[11px] leading-6 text-white/[0.34] sm:mt-5 sm:text-[14px] sm:leading-8">
                {copy.body}
              </p>

              <div className="mt-6 flex items-center gap-3 sm:mt-8">
                <span
                  className="h-px w-7 sm:w-8"
                  style={{
                    background: `${GOLD}55`,
                  }}
                />

                <span className="font-mono text-[6px] uppercase tracking-[0.26em] text-white/[0.16]">
                  {copy.processMeta}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.section
          aria-labelledby="studio-process-title"
          initial={{
            opacity: 0,
            y: reducedMotion ? 0 : 16,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.1,
          }}
          transition={{
            duration: reducedMotion ? 0 : 0.62,
            ease: EASE,
          }}
          className="mt-18 sm:mt-24 lg:mt-28 xl:mt-32"
        >
          <div className="flex flex-col gap-5 border-b border-white/[0.055] pb-5 sm:flex-row sm:items-end sm:justify-between sm:pb-6">
            <div>
              <p
                className="font-mono text-[6px] uppercase tracking-[0.32em] sm:text-[7px] sm:tracking-[0.34em]"
                style={{
                  color: `${GOLD_LIGHT}80`,
                }}
              >
                {copy.processLabel}
              </p>

              <h3
                id="studio-process-title"
                className="mt-3 max-w-[820px] text-[clamp(1.8rem,7vw,3.45rem)] font-[430] uppercase leading-[0.9] tracking-[-0.06em] text-white/[0.92] sm:text-[clamp(1.9rem,3.55vw,3.45rem)]"
              >
                {copy.processTitle}
              </h3>
            </div>

            <span className="font-mono text-[6px] uppercase tracking-[0.28em] text-white/[0.14]">
              {copy.principleCount}
            </span>
          </div>

          <div className="mt-5 grid overflow-hidden border border-white/[0.07] bg-[#060606] lg:grid-cols-[0.72fr_1.28fr]">
            <div
              className="order-2 divide-y divide-white/[0.06] border-t border-white/[0.06] lg:order-1 lg:border-r lg:border-t-0"
              role="tablist"
              aria-label={copy.processLabel}
              aria-orientation="vertical"
            >
              {principles.map(
                (principle, index) => {
                  const tabId = `studio-tab-${locale}-${principle.index}`;
                  const panelId = `studio-panel-${locale}-${principle.index}`;

                  return (
                    <PrincipleSelector
                      key={`${locale}-${principle.index}`}
                      principle={principle}
                      active={
                        index === activeIndex
                      }
                      tabId={tabId}
                      panelId={panelId}
                      tabIndex={
                        index === activeIndex
                          ? 0
                          : -1
                      }
                      buttonRef={(element) => {
                        tabRefs.current[index] =
                          element;
                      }}
                      onSelect={() =>
                        selectPrinciple(index)
                      }
                      onKeyDown={(event) =>
                        handlePrincipleKeyDown(
                          event,
                          index,
                        )
                      }
                      reducedMotion={
                        reducedMotion
                      }
                    />
                  );
                },
              )}
            </div>

            <div className="order-1 relative min-h-[530px] overflow-hidden bg-[#070707] sm:min-h-[620px] lg:order-2">
              <div className="absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-[#c7a96b]/45 to-transparent" />

              <AnimatePresence
                mode="wait"
                initial={false}
              >
                <motion.div
                  key={`${locale}-${activePrinciple.index}`}
                  id={`studio-panel-${locale}-${activePrinciple.index}`}
                  initial={{
                    opacity: 0,
                    y: reducedMotion ? 0 : 12,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: reducedMotion ? 0 : -8,
                  }}
                  transition={{
                    duration:
                      reducedMotion ? 0 : 0.38,
                    ease: EASE,
                  }}
                  className="relative z-10 flex h-full min-h-[530px] flex-col p-4 sm:min-h-[620px] sm:p-7 lg:p-9"
                  role="tabpanel"
                  aria-labelledby={`studio-tab-${locale}-${activePrinciple.index}`}
                  tabIndex={0}
                >
                  <div className="flex items-center justify-between border-b border-white/[0.05] pb-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className="font-mono text-[7px] tracking-[0.24em]"
                        style={{
                          color: `${GOLD_LIGHT}78`,
                        }}
                      >
                        {activePrinciple.index}
                      </span>

                      <span className="h-px w-6 bg-white/[0.08] sm:w-7" />

                      <span className="truncate font-mono text-[6px] uppercase tracking-[0.22em] text-white/[0.18] sm:tracking-[0.25em]">
                        {activePrinciple.code}
                      </span>
                    </div>

                    <div className="flex shrink-0 items-center gap-3 font-mono text-[6px] uppercase tracking-[0.22em] text-white/[0.14]">
                      <span className="hidden sm:block">
                        {copy.mediaLabel}
                      </span>

                      <span>
                        {activePrinciple.index} / 04
                      </span>
                    </div>
                  </div>

                  <div className="grid flex-1 gap-6 pt-6 xl:grid-cols-[minmax(0,1fr)_minmax(250px,.46fr)]">
                    <MediaWindow
                      media={
                        activePrinciple.media
                      }
                      principle={activePrinciple}
                      locale={locale}
                    />

                    <div className="flex flex-col justify-between border-t border-white/[0.06] pt-6 xl:border-l xl:border-t-0 xl:pl-7 xl:pt-0">
                      <div>
                        <p
                          className="font-mono text-[6px] uppercase tracking-[0.28em] sm:text-[7px] sm:tracking-[0.3em]"
                          style={{
                            color: `${GOLD_LIGHT}76`,
                          }}
                        >
                          {
                            activePrinciple.eyebrow
                          }
                        </p>

                        <h4 className="mt-3 text-[clamp(2rem,9vw,3.9rem)] font-[430] uppercase leading-[0.86] tracking-[-0.065em] text-white sm:mt-4 sm:text-[clamp(2rem,3.8vw,3.9rem)]">
                          {
                            activePrinciple.title
                          }
                        </h4>

                        <p className="mt-4 text-[10px] leading-5 text-white/[0.40] sm:mt-5 sm:text-[13px] sm:leading-7">
                          {
                            activePrinciple.description
                          }
                        </p>
                      </div>

                      <div className="mt-7 border-t border-white/[0.06] pt-5">
                        <p className="font-mono text-[6px] uppercase tracking-[0.25em] text-white/[0.16]">
                          {copy.activeLabel}
                        </p>

                        <p className="mt-3 text-[10px] leading-5 text-white/[0.50] sm:text-[12px] sm:leading-6">
                          {
                            activePrinciple.detail
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-4 border-t border-white/[0.06] pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <Check
                        aria-hidden="true"
                        size={11}
                        strokeWidth={1.2}
                        style={{
                          color: `${GOLD_LIGHT}70`,
                        }}
                      />

                      <span className="font-mono text-[6px] uppercase tracking-[0.25em] text-white/[0.14]">
                        {copy.processMeta}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() =>
                          moveSelection(-1)
                        }
                        aria-label={
                          locale === "en"
                            ? "Previous element"
                            : "Prethodni element"
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] text-white/[0.25] transition-[border-color,color,transform] duration-300 hover:-translate-x-px hover:border-[#c7a96b]/35 hover:text-[#ead39a] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/65"
                      >
                        <ArrowLeft
                          aria-hidden="true"
                          size={12}
                          strokeWidth={1.1}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          moveSelection(1)
                        }
                        aria-label={
                          locale === "en"
                            ? "Next element"
                            : "Sledeći element"
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] text-white/[0.25] transition-[border-color,color,transform] duration-300 hover:translate-x-px hover:border-[#c7a96b]/35 hover:text-[#ead39a] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/65"
                      >
                        <ArrowRight
                          aria-hidden="true"
                          size={12}
                          strokeWidth={1.1}
                        />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="font-mono text-[6px] uppercase tracking-[0.24em] text-white/[0.12]">
              {copy.selectionHint}
            </span>

            <span className="font-mono text-[6px] uppercase tracking-[0.26em] text-white/[0.12]">
              {activePrinciple.index} / 04
            </span>
          </div>
        </motion.section>

        <div className="mt-12 grid gap-3 sm:mt-16 sm:grid-cols-2">
          <Link
            href={projectsHref}
            className="group flex min-h-[64px] items-center justify-between border border-white/[0.075] bg-[#060606] px-4 outline-none transition-[border-color,transform,background] duration-400 hover:-translate-y-0.5 hover:border-[#c7a96b]/30 hover:bg-[#080808] focus-visible:ring-1 focus-visible:ring-[#ead39a]/60 sm:min-h-[68px] sm:px-6"
          >
            <span>
              <span className="block font-mono text-[6px] uppercase tracking-[0.26em] text-white/[0.15]">
                UMBRA / PROJECTS
              </span>

              <span className="mt-2 block text-[9px] uppercase tracking-[0.12em] text-white/[0.52] transition-colors duration-300 group-hover:text-white/[0.8] sm:text-[10px] sm:tracking-[0.14em]">
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
            className="group flex min-h-[64px] items-center justify-between border border-white/[0.075] bg-[#060606] px-4 outline-none transition-[border-color,transform,background] duration-400 hover:-translate-y-0.5 hover:border-[#c7a96b]/30 hover:bg-[#080808] focus-visible:ring-1 focus-visible:ring-[#ead39a]/60 sm:min-h-[68px] sm:px-6"
          >
            <span>
              <span className="block font-mono text-[6px] uppercase tracking-[0.26em] text-white/[0.15]">
                UMBRA / CHARACTERS
              </span>

              <span className="mt-2 block text-[9px] uppercase tracking-[0.12em] text-white/[0.52] transition-colors duration-300 group-hover:text-white/[0.8] sm:text-[10px] sm:tracking-[0.14em]">
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
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
            amount: 0.08,
          }}
          transition={{
            duration: reducedMotion ? 0 : 0.5,
            ease: EASE,
          }}
          className="mt-10 flex flex-col gap-5 border-t border-white/[0.055] pt-6 sm:mt-12 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <span
              className="h-px w-7 sm:w-8"
              style={{
                background: `${GOLD}48`,
              }}
            />

            <span className="font-mono text-[6px] uppercase tracking-[0.25em] text-white/[0.15] sm:tracking-[0.28em]">
              {copy.system}
            </span>
          </div>

          <Link
            href={nextHref}
            className="group flex min-h-9 items-center gap-3 self-start outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55 sm:self-auto"
          >
            <span className="text-[6px] uppercase tracking-[0.23em] text-white/[0.2] transition-colors duration-300 group-hover:text-white/[0.48] sm:text-[7px] sm:tracking-[0.26em]">
              {copy.next}
            </span>

            <ArrowDownRight
              aria-hidden="true"
              size={13}
              strokeWidth={1.1}
              className="text-[#ead39a]/55 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
            />

            <span className="sr-only">
              {copy.nextLabel}
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}