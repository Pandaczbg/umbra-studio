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
import {
  motion,
  useReducedMotion,
} from "framer-motion";
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

const EASE = [
  0.22,
  1,
  0.36,
  1,
] as const;

const CONTENT_TRANSITION = {
  duration: 0.52,
  ease: EASE,
};

type HeroItem = {
  id: string;
  number: string;
  tab: string;
  category: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  video?: string;
  href: string;
  cta: string;
  meta: string;
  external?: boolean;
};

const ITEMS_SR: HeroItem[] = [
  {
    id: "aktuelno",
    number: "01",
    tab: "AKTUELNO",
    category: "U FOKUSU",
    eyebrow: "SERIJA U PRODUKCIJI",
    title: "MRZIM SVOG BRATA",
    description:
      "Priča o porodici, odnosima i onome što ostaje među ljudima kada se stare rane ponovo otvore.",
    image: HERO_IMAGE,
    href: "/serije/mrzim-svog-brata",
    cta: "Pogledaj više",
    meta: "Serija",
  },
  {
    id: "novo",
    number: "02",
    tab: "NOVO",
    category: "NAJNOVIJE",
    eyebrow: "NOVI SADRŽAJ",
    title: "NOVA EPIZODA",
    description:
      "Nastavak priče. Nova epizoda otvara sledeći trenutak i vodi priču korak dalje.",
    image: HERO_IMAGE,
    href: "/serije/mrzim-svog-brata",
    cta: "Pogledaj više",
    meta: "Epizoda",
  },
  {
    id: "likovi",
    number: "03",
    tab: "LIKOVI",
    category: "LJUDI U PRIČI",
    eyebrow: "KARAKTERI I ODNOSI",
    title: "LIKOVI",
    description:
      "Upoznaj ljude oko kojih se grade odnosi, sukobi i trenuci koji menjaju tok priče.",
    image: HERO_IMAGE,
    href: "/likovi",
    cta: "Pogledaj više",
    meta: "Karakteri",
  },
  {
    id: "arhiva",
    number: "04",
    tab: "IZ ARHIVE",
    category: "PRIČE KOJE OSTAJU",
    eyebrow: "ODABRANI PROJEKTI",
    title: "ARHIVA",
    description:
      "Projekti i priče koje ostaju dostupni i onda kada više nisu novi.",
    image: HERO_IMAGE,
    href: "/serije",
    cta: "Pogledaj više",
    meta: "Projekti",
  },
  {
    id: "gledaj",
    number: "05",
    tab: "GLEDAJ",
    category: "UMBRA NA YOUTUBE-U",
    eyebrow: "VIDEO",
    title: "GLEDAJ UMBRU",
    description:
      "Epizode, kratki kadrovi i novi sadržaj objavljen na Umbra kanalu.",
    image: HERO_IMAGE,
    href: "https://www.youtube.com/@umbrastud",
    cta: "Pogledaj kanal",
    meta: "YouTube",
    external: true,
  },
];

const ITEMS_EN: HeroItem[] = [
  {
    id: "featured",
    number: "01",
    tab: "FEATURED",
    category: "IN FOCUS",
    eyebrow: "SERIES IN PRODUCTION",
    title: "MRZIM SVOG BRATA",
    description:
      "A story about family, relationships and what remains between people when old wounds open again.",
    image: HERO_IMAGE,
    href: "/en/projects/mrzim-svog-brata",
    cta: "View more",
    meta: "Series",
  },
  {
    id: "new",
    number: "02",
    tab: "NEW",
    category: "LATEST",
    eyebrow: "NEW CONTENT",
    title: "NEW EPISODE",
    description:
      "The story continues. A new episode opens the next moment and moves the story forward.",
    image: HERO_IMAGE,
    href: "/en/projects/mrzim-svog-brata",
    cta: "View more",
    meta: "Episode",
  },
  {
    id: "characters",
    number: "03",
    tab: "CHARACTERS",
    category: "PEOPLE IN THE STORY",
    eyebrow: "CHARACTER & RELATIONSHIPS",
    title: "CHARACTERS",
    description:
      "Meet the people around whom relationships, conflicts and turning points are built.",
    image: HERO_IMAGE,
    href: "/en/characters",
    cta: "View more",
    meta: "Characters",
  },
  {
    id: "archive",
    number: "04",
    tab: "ARCHIVE",
    category: "STORIES THAT REMAIN",
    eyebrow: "SELECTED PROJECTS",
    title: "ARCHIVE",
    description:
      "Projects and stories that remain available long after they stop being new.",
    image: HERO_IMAGE,
    href: "/en/projects",
    cta: "View more",
    meta: "Projects",
  },
  {
    id: "watch",
    number: "05",
    tab: "WATCH",
    category: "UMBRA ON YOUTUBE",
    eyebrow: "VIDEO",
    title: "WATCH UMBRA",
    description:
      "Episodes, short scenes and new content published on the Umbra channel.",
    image: HERO_IMAGE,
    href: "https://www.youtube.com/@umbrastud",
    cta: "View channel",
    meta: "YouTube",
    external: true,
  },
];

export default function HomeHero({
  locale = "sr",
}: {
  locale?: Locale;
}) {
  const reducedMotion =
    useReducedMotion() ?? false;

  const items = useMemo(
    () =>
      locale === "en"
        ? ITEMS_EN
        : ITEMS_SR,
    [locale],
  );

  const [activeIndex, setActiveIndex] =
    useState(0);

  const [isPlaying, setIsPlaying] =
    useState(!reducedMotion);

  const [isHovering, setIsHovering] =
    useState(false);

  const [ready, setReady] =
    useState(false);

  const [frontLayer, setFrontLayer] =
    useState(0);

  const [frontImage, setFrontImage] =
    useState(HERO_IMAGE);

  const [backImage, setBackImage] =
    useState(HERO_IMAGE);

  const rotationStartedAt =
    useRef(Date.now());

  const remainingRotation =
    useRef(AUTO_ROTATE_MS);

  const activeItem =
    items[activeIndex];

  const changeItem = useCallback(
    (index: number) => {
      const normalized =
        (index + items.length) %
        items.length;

      if (
        normalized === activeIndex
      ) {
        return;
      }

      const nextItem =
        items[normalized];

      if (frontLayer === 0) {
        setBackImage(nextItem.image);
        setFrontLayer(1);
      } else {
        setFrontImage(nextItem.image);
        setFrontLayer(0);
      }

      setActiveIndex(normalized);

      rotationStartedAt.current =
        Date.now();

      remainingRotation.current =
        AUTO_ROTATE_MS;
    },
    [
      activeIndex,
      frontLayer,
      items,
    ],
  );

  const next = useCallback(() => {
    changeItem(activeIndex + 1);
  }, [
    activeIndex,
    changeItem,
  ]);

  const previous = useCallback(() => {
    changeItem(activeIndex - 1);
  }, [
    activeIndex,
    changeItem,
  ]);

  useEffect(() => {
    const timer =
      window.setTimeout(
        () => setReady(true),
        reducedMotion ? 20 : 110,
      );

    return () =>
      window.clearTimeout(timer);
  }, [reducedMotion]);

  useEffect(() => {
    if (
      typeof window === "undefined"
    ) {
      return;
    }

    const urls = Array.from(
      new Set(
        items
          .map(
            (item) =>
              item.image,
          )
          .filter(Boolean),
      ),
    );

    urls.forEach((url) => {
      const image =
        new window.Image();

      image.src = url;
    });
  }, [items]);

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    items.forEach(
      (item, index) => {
        if (index === 0) {
          return;
        }

        const image =
          new window.Image();

        image.src = item.image;
      },
    );
  }, [
    items,
    reducedMotion,
  ]);

  useEffect(() => {
    if (
      reducedMotion ||
      !isPlaying ||
      isHovering
    ) {
      return;
    }

    let timer: number;

    const schedule =
      () => {
        timer =
          window.setTimeout(
            () => {
              remainingRotation.current =
                AUTO_ROTATE_MS;

              rotationStartedAt.current =
                Date.now();

              setActiveIndex(
                (current) =>
                  (current + 1) %
                  items.length,
              );

              const nextIndex =
                (activeIndex + 1) %
                items.length;

              const nextItem =
                items[nextIndex];

              if (frontLayer === 0) {
                setBackImage(
                  nextItem.image,
                );
                setFrontLayer(1);
              } else {
                setFrontImage(
                  nextItem.image,
                );
                setFrontLayer(0);
              }

              schedule();
            },
            remainingRotation.current,
          );
      };

    rotationStartedAt.current =
      Date.now();

    schedule();

    return () =>
      window.clearTimeout(timer);
  }, [
    activeIndex,
    frontLayer,
    isHovering,
    isPlaying,
    items,
    reducedMotion,
  ]);

  useEffect(() => {
    if (
      reducedMotion &&
      isPlaying
    ) {
      setIsPlaying(false);
    }
  }, [
    isPlaying,
    reducedMotion,
  ]);

  useEffect(() => {
    const onKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key ===
        "ArrowRight"
      ) {
        event.preventDefault();
        next();
      }

      if (
        event.key === "ArrowLeft"
      ) {
        event.preventDefault();
        previous();
      }

      if (
        event.key === " "
      ) {
        const target =
          event.target as HTMLElement | null;

        const typing =
          target?.tagName ===
            "INPUT" ||
          target?.tagName ===
            "TEXTAREA" ||
          target?.tagName ===
            "SELECT" ||
          target?.isContentEditable;

        if (typing) {
          return;
        }

        event.preventDefault();

        setIsPlaying(
          (value) => !value,
        );
      }
    };

    window.addEventListener(
      "keydown",
      onKeyDown,
    );

    return () =>
      window.removeEventListener(
        "keydown",
        onKeyDown,
      );
  }, [next, previous]);

  useEffect(() => {
    if (
      !isPlaying ||
      isHovering ||
      reducedMotion
    ) {
      return;
    }

    rotationStartedAt.current =
      Date.now();
  }, [
    activeIndex,
    isHovering,
    isPlaying,
    reducedMotion,
  ]);

  const handleEnter = () => {
    if (
      !reducedMotion &&
      isPlaying
    ) {
      const elapsed =
        Date.now() -
        rotationStartedAt.current;

      remainingRotation.current =
        Math.max(
          250,
          remainingRotation.current -
            elapsed,
        );
    }

    setIsHovering(true);
  };

  const handleLeave = () => {
    if (
      !reducedMotion &&
      isPlaying
    ) {
      rotationStartedAt.current =
        Date.now();
    }

    setIsHovering(false);
  };

  return (
    <section
      data-umbra-scene="hero"
      aria-labelledby="umbra-hero-title"
      className="relative min-h-[100svh] overflow-hidden bg-[#030303]"
      onMouseEnter={
        handleEnter
      }
      onMouseLeave={
        handleLeave
      }
      onFocusCapture={() =>
        setIsHovering(true)
      }
      onBlurCapture={(event) => {
        if (
          !event.currentTarget.contains(
            event.relatedTarget as Node | null,
          )
        ) {
          handleLeave();
        }
      }}
    >
      {/* =====================================================================
          STABLE DOUBLE-BUFFER BACKGROUND
          ===================================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -inset-[3%]">
          <Image
            src={frontImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
            style={{
              opacity:
                frontLayer === 0
                  ? 1
                  : 0,
              transform:
                "translate3d(0, calc(var(--umbra-scroll-y, 0px) * 0.035), 0) scale(1.025)",
              transition: reducedMotion
                ? "none"
                : "opacity 900ms cubic-bezier(.22,1,.36,1)",
              willChange: "opacity",
            }}
          />
        </div>

        <div className="absolute -inset-[3%]">
          <Image
            src={backImage}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
            style={{
              opacity:
                frontLayer === 1
                  ? 1
                  : 0,
              transform:
                "translate3d(0, calc(var(--umbra-scroll-y, 0px) * 0.035), 0) scale(1.025)",
              transition: reducedMotion
                ? "none"
                : "opacity 900ms cubic-bezier(.22,1,.36,1)",
              willChange: "opacity",
            }}
          />
        </div>

        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(
                90deg,
                rgba(2,2,2,.985) 0%,
                rgba(2,2,2,.93) 15%,
                rgba(2,2,2,.68) 41%,
                rgba(2,2,2,.30) 70%,
                rgba(2,2,2,.70) 100%
              )
            `,
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(
                180deg,
                rgba(2,2,2,.88) 0%,
                rgba(2,2,2,.27) 28%,
                rgba(2,2,2,.04) 52%,
                rgba(2,2,2,.56) 77%,
                rgba(2,2,2,.99) 100%
              )
            `,
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 72% 39%, rgba(199,169,107,.09), transparent 35%)",
          }}
        />

        <div
          className="absolute inset-x-0 bottom-0 h-[48%]"
          style={{
            background:
              "linear-gradient(180deg, transparent, rgba(0,0,0,.98))",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            boxShadow:
              "inset 0 0 190px rgba(0,0,0,.92)",
          }}
        />
      </div>

      {/* =====================================================================
          FRAME
          ===================================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-5 z-10 border border-white/[0.045] sm:inset-7 lg:inset-9 xl:inset-11"
      >
        <motion.span
          className="absolute -left-px -top-px h-20 w-20 border-l border-t"
          initial={{
            opacity: 0,
            scale: 0.72,
          }}
          animate={{
            opacity: ready ? 1 : 0,
            scale: ready ? 1 : 0.72,
          }}
          transition={{
            duration:
              reducedMotion ? 0 : 0.72,
            ease: EASE,
          }}
          style={{
            borderColor: `${GOLD}4b`,
          }}
        />

        <motion.span
          className="absolute -bottom-px -right-px h-20 w-20 border-b border-r"
          initial={{
            opacity: 0,
            scale: 0.72,
          }}
          animate={{
            opacity: ready ? 1 : 0,
            scale: ready ? 1 : 0.72,
          }}
          transition={{
            delay:
              reducedMotion ? 0 : 0.08,
            duration:
              reducedMotion ? 0 : 0.72,
            ease: EASE,
          }}
          style={{
            borderColor:
              `${GOLD_DARK}48`,
          }}
        />
      </div>

      {/* =====================================================================
          TOP META
          ===================================================================== */}

      <div className="relative z-30 mx-auto flex max-w-[1540px] items-center justify-between px-6 pt-28 sm:px-9 lg:px-12 lg:pt-32 xl:px-16">
        <motion.div
          initial={{
            opacity: 0,
            y: -7,
          }}
          animate={{
            opacity: ready ? 1 : 0,
            y: ready ? 0 : -7,
          }}
          transition={{
            duration:
              reducedMotion ? 0 : 0.55,
            ease: EASE,
          }}
          className="flex items-center gap-4"
        >
          <span
            className="font-mono text-[7px] tracking-[0.34em]"
            style={{
              color:
                `${GOLD_LIGHT}7d`,
            }}
          >
            UMBRA / 01
          </span>

          <span
            className="h-px w-10"
            style={{
              background:
                `linear-gradient(90deg, ${GOLD}78, transparent)`,
            }}
          />

          <span className="text-[7px] font-semibold uppercase tracking-[0.4em] text-white/[0.29]">
            {locale === "en"
              ? "EDITORIAL"
              : "AKTUELNO"}
          </span>
        </motion.div>

        <div className="hidden items-center gap-3 lg:flex">
          <span className="font-mono text-[6px] uppercase tracking-[0.3em] text-white/[0.17]">
            {locale === "en"
              ? "STORIES IN MOTION"
              : "PRIČE U POKRETU"}
          </span>

          <span
            className="h-[3px] w-[3px] rounded-full"
            style={{
              background: GOLD,
              boxShadow:
                `0 0 8px ${GOLD}65`,
            }}
          />
        </div>
      </div>

      {/* =====================================================================
          CONTENT
          ===================================================================== */}

      <div className="relative z-30 mx-auto flex min-h-[calc(100svh-11rem)] max-w-[1540px] items-end px-6 pb-14 sm:px-9 lg:px-12 lg:pb-16 xl:px-16">
        <div className="grid w-full items-end gap-10 lg:grid-cols-[minmax(0,1fr)_400px] xl:grid-cols-[minmax(0,1fr)_425px] xl:gap-16">
          {/* ===================================================================
              MAIN CONTENT
              =================================================================== */}

          <div className="min-w-0">
            <motion.div
              key={activeItem.id}
              initial={{
                opacity: 0,
                x: reducedMotion ? 0 : 14,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={
                CONTENT_TRANSITION
              }
            >
              <div className="mb-5 flex items-center gap-3">
                <span
                  className="font-mono text-[7px] tracking-[0.34em]"
                  style={{
                    color:
                      GOLD_LIGHT,
                  }}
                >
                  {activeItem.number}
                </span>

                <span
                  className="h-px w-10"
                  style={{
                    background:
                      `linear-gradient(90deg, ${GOLD}78, transparent)`,
                  }}
                />

                <span
                  className="text-[7px] font-semibold uppercase tracking-[0.4em]"
                  style={{
                    color:
                      `${GOLD_LIGHT}82`,
                  }}
                >
                  {activeItem.category}
                </span>
              </div>

              <h1
                id="umbra-hero-title"
                className="max-w-[1060px] text-[clamp(3.3rem,7.6vw,8.8rem)] font-[420] uppercase leading-[0.78] tracking-[-0.083em] text-white"
              >
                {activeItem.title}
              </h1>

              <div className="mt-5 flex items-center gap-4">
                <span
                  className="font-serif text-[clamp(1rem,1.55vw,1.4rem)] italic"
                  style={{
                    color:
                      `${GOLD_LIGHT}a6`,
                  }}
                >
                  {activeItem.eyebrow}
                </span>

                <span
                  className="h-px w-20"
                  style={{
                    background:
                      `linear-gradient(90deg, ${GOLD}60, transparent)`,
                  }}
                />
              </div>

              <p className="mt-6 max-w-[620px] text-[11px] leading-6 text-white/[0.41] sm:text-[12px] sm:leading-7">
                {
                  activeItem.description
                }
              </p>

              <div className="mt-7 flex items-center gap-5">
                {activeItem.external ? (
                  <a
                    href={
                      activeItem.href
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="group/cta relative inline-flex h-12 items-center gap-4 overflow-hidden border px-6 text-[8px] font-semibold uppercase tracking-[0.3em] sm:text-[9px]"
                    style={{
                      borderColor:
                        `${GOLD}70`,
                      color:
                        GOLD_LIGHT,
                    }}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/cta:opacity-100"
                      style={{
                        background:
                          `radial-gradient(circle at 50% 0%, ${GOLD_LIGHT}12, transparent 70%)`,
                      }}
                    />

                    <span className="relative z-10">
                      {
                        activeItem.cta
                      }
                    </span>

                    <ArrowUpRight
                      size={13}
                      strokeWidth={1.1}
                      className="relative z-10 transition-transform duration-300 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5"
                    />

                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 h-px w-10 transition-[width] duration-500 group-hover/cta:w-full"
                      style={{
                        background:
                          `linear-gradient(90deg, ${GOLD_LIGHT}, ${GOLD}, transparent)`,
                      }}
                    />
                  </a>
                ) : (
                  <Link
                    href={
                      activeItem.href
                    }
                    className="group/cta relative inline-flex h-12 items-center gap-4 overflow-hidden border px-6 text-[8px] font-semibold uppercase tracking-[0.3em] sm:text-[9px]"
                    style={{
                      borderColor:
                        `${GOLD}70`,
                      color:
                        GOLD_LIGHT,
                    }}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/cta:opacity-100"
                      style={{
                        background:
                          `radial-gradient(circle at 50% 0%, ${GOLD_LIGHT}12, transparent 70%)`,
                      }}
                    />

                    <span className="relative z-10">
                      {
                        activeItem.cta
                      }
                    </span>

                    <ArrowUpRight
                      size={13}
                      strokeWidth={1.1}
                      className="relative z-10 transition-transform duration-300 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5"
                    />

                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 h-px w-10 transition-[width] duration-500 group-hover/cta:w-full"
                      style={{
                        background:
                          `linear-gradient(90deg, ${GOLD_LIGHT}, ${GOLD}, transparent)`,
                      }}
                    />
                  </Link>
                )}

                <span className="font-mono text-[6px] uppercase tracking-[0.28em] text-white/[0.18]">
                  {activeItem.meta}
                </span>
              </div>
            </motion.div>
          </div>

          {/* ===================================================================
              EDITORIAL SELECTOR
              =================================================================== */}

          <motion.aside
            initial={{
              opacity: 0,
              x: 18,
            }}
            animate={{
              opacity: ready ? 1 : 0,
              x: ready ? 0 : 18,
            }}
            transition={{
              delay:
                reducedMotion ? 0 : 0.32,
              duration:
                reducedMotion ? 0 : 0.7,
              ease: EASE,
            }}
            className="relative"
          >
            <div className="mb-4 flex items-end justify-between border-b border-white/[0.08] pb-4">
              <div>
                <span className="font-mono text-[6px] uppercase tracking-[0.34em] text-white/[0.21]">
                  {locale === "en"
                    ? "EXPLORE"
                    : "PREGLEDAJ"}
                </span>

                <div className="mt-2 flex items-center gap-3">
                  <motion.span
                    key={
                      activeItem.number
                    }
                    initial={{
                      opacity: 0,
                      y: 3,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.28,
                    }}
                    className="font-mono text-[6px] tracking-[0.26em]"
                    style={{
                      color:
                        `${GOLD_LIGHT}74`,
                    }}
                  >
                    {activeItem.number}
                  </motion.span>

                  <span className="font-mono text-[6px] text-white/[0.12]">
                    /
                  </span>

                  <span className="font-mono text-[6px] text-white/[0.12]">
                    {String(
                      items.length,
                    ).padStart(
                      2,
                      "0",
                    )}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setIsPlaying(
                    (value) => !value,
                  )
                }
                aria-label={
                  isPlaying
                    ? locale ===
                        "en"
                      ? "Pause automatic rotation"
                      : "Pauziraj automatsku rotaciju"
                    : locale ===
                        "en"
                      ? "Start automatic rotation"
                      : "Pokreni automatsku rotaciju"
                }
                className="flex h-10 w-10 items-center justify-center border border-white/[0.1] text-white/[0.34] transition-all duration-300 hover:border-white/[0.24] hover:text-white/[0.8]"
              >
                {isPlaying ? (
                  <Pause
                    size={11}
                    strokeWidth={1.1}
                  />
                ) : (
                  <Play
                    size={11}
                    strokeWidth={1.1}
                  />
                )}
              </button>
            </div>

            <div
              role="tablist"
              aria-label={
                locale === "en"
                  ? "Hero content"
                  : "Hero sadržaj"
              }
              className="relative border-t border-white/[0.08]"
            >
              {items.map(
                (item, index) => {
                  const active =
                    index ===
                    activeIndex;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={
                        active
                      }
                      aria-controls="umbra-hero-panel"
                      onMouseEnter={() =>
                        changeItem(
                          index,
                        )
                      }
                      onClick={() =>
                        changeItem(
                          index,
                        )
                      }
                      className="group/tab relative flex h-[68px] w-full items-center border-b border-white/[0.08] text-left outline-none"
                    >
                      <motion.span
                        aria-hidden="true"
                        className="absolute inset-y-0 left-0 w-px"
                        animate={{
                          scaleY: active
                            ? 1
                            : 0,
                        }}
                        transition={{
                          duration:
                            0.45,
                          ease: EASE,
                        }}
                        style={{
                          background:
                            `linear-gradient(180deg, transparent, ${GOLD_LIGHT}, transparent)`,
                        }}
                      />

                      <motion.span
                        className="font-mono text-[6px] tracking-[0.3em]"
                        animate={{
                          x: active
                            ? 3
                            : 0,
                          opacity: active
                            ? 1
                            : 0.45,
                        }}
                        transition={{
                          duration:
                            0.3,
                          ease: EASE,
                        }}
                        style={{
                          color: active
                            ? `${GOLD_LIGHT}98`
                            : "rgba(255,255,255,.19)",
                        }}
                      >
                        {item.number}
                      </motion.span>

                      <motion.span
                        className="pl-5 text-[8px] font-semibold uppercase tracking-[0.34em]"
                        animate={{
                          x: active
                            ? 5
                            : 0,
                          opacity: active
                            ? 1
                            : 0.56,
                        }}
                        transition={{
                          duration:
                            0.36,
                          ease: EASE,
                        }}
                        style={{
                          color: active
                            ? "rgba(255,255,255,.87)"
                            : "rgba(255,255,255,.37)",
                        }}
                      >
                        {item.tab}
                      </motion.span>

                      <motion.span
                        className="ml-auto mr-1"
                        animate={{
                          x: active
                            ? 0
                            : 4,
                          opacity: active
                            ? 0.7
                            : 0.16,
                        }}
                        transition={{
                          duration:
                            0.3,
                          ease: EASE,
                        }}
                      >
                        <ArrowRight
                          size={11}
                          strokeWidth={1}
                        />
                      </motion.span>

                      <motion.span
                        aria-hidden="true"
                        className="absolute bottom-0 left-0 h-px origin-left"
                        animate={{
                          scaleX: active
                            ? 1
                            : 0,
                        }}
                        transition={{
                          duration:
                            0.58,
                          ease: EASE,
                        }}
                        style={{
                          width:
                            "100%",
                          background:
                            `linear-gradient(90deg, ${GOLD_DARK}, ${GOLD}, transparent)`,
                        }}
                      />

                      <motion.span
                        aria-hidden="true"
                        className="absolute inset-0"
                        animate={{
                          opacity: active
                            ? 1
                            : 0,
                        }}
                        transition={{
                          duration:
                            0.35,
                        }}
                        style={{
                          background:
                            `linear-gradient(90deg, ${GOLD}05, transparent 55%)`,
                        }}
                      />
                    </button>
                  );
                },
              )}
            </div>

            {/* =================================================================
                MEDIA PREVIEW
                ================================================================= */}

            <div
              id="umbra-hero-panel"
              role="tabpanel"
              className="relative mt-6 overflow-hidden border border-white/[0.09] bg-black/[0.25]"
            >
              <div className="relative aspect-[16/8.6] overflow-hidden">
                <Image
                  src={
                    activeItem.image
                  }
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 425px"
                  className="object-cover"
                  style={{
                    opacity: 0.92,
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-r from-black/[0.68] via-black/[0.13] to-black/[0.58]" />

                <div className="absolute inset-0 flex items-end justify-between p-5">
                  <motion.div
                    key={
                      activeItem.id
                    }
                    initial={{
                      opacity: 0,
                      y: 6,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration:
                        reducedMotion
                          ? 0
                          : 0.42,
                      ease: EASE,
                    }}
                  >
                    <div
                      className="font-mono text-[5px] uppercase tracking-[0.3em]"
                      style={{
                        color:
                          `${GOLD_LIGHT}74`,
                      }}
                    >
                      {activeItem.meta}
                    </div>

                    <div className="mt-2 max-w-[190px] text-[10px] font-medium uppercase leading-4 tracking-[0.06em] text-white/[0.67]">
                      {
                        activeItem.category
                      }
                    </div>
                  </motion.div>

                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 items-center justify-center border border-white/[0.15] bg-black/[0.2]"
                  >
                    <ArrowUpRight
                      size={13}
                      strokeWidth={1}
                      className="text-white/[0.62]"
                    />
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/[0.08] px-4 py-3">
                <span className="font-mono text-[5px] uppercase tracking-[0.3em] text-white/[0.18]">
                  {locale === "en"
                    ? "SELECTED CONTENT"
                    : "ODABRANI SADRŽAJ"}
                </span>

                <span
                  className="font-mono text-[5px] uppercase tracking-[0.25em]"
                  style={{
                    color:
                      `${GOLD_LIGHT}52`,
                  }}
                >
                  UMBRA
                </span>
              </div>
            </div>

            {/* =================================================================
                30 SECOND TIMELINE
                ================================================================= */}

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-[5px] uppercase tracking-[0.3em] text-white/[0.16]">
                  {isPlaying
                    ? locale ===
                        "en"
                      ? "AUTO"
                      : "AUTOMATSKI"
                    : locale ===
                        "en"
                      ? "PAUSED"
                      : "PAUZIRANO"}
                </span>

                <span className="font-mono text-[5px] tracking-[0.25em] text-white/[0.12]">
                  30S
                </span>
              </div>

              <div className="flex gap-1">
                {items.map(
                  (item, index) => {
                    const active =
                      activeIndex ===
                      index;

                    return (
                      <div
                        key={`progress-${item.id}`}
                        className="relative h-px flex-1 overflow-hidden bg-white/[0.09]"
                      >
                        <motion.span
                          className="absolute inset-0"
                          animate={{
                            opacity: active
                              ? 1
                              : index <
                                  activeIndex
                                ? 0.38
                                : 0,
                          }}
                          transition={{
                            duration:
                              0.28,
                          }}
                          style={{
                            background:
                              `linear-gradient(90deg, ${GOLD_DARK}, ${GOLD_LIGHT})`,
                          }}
                        />

                        {active && (
                          <motion.span
                            key={`${activeItem.id}-${isPlaying}-${isHovering}`}
                            className="absolute inset-y-0 left-0 origin-left"
                            initial={{
                              scaleX: 0,
                            }}
                            animate={{
                              scaleX:
                                isPlaying &&
                                !isHovering
                                  ? 1
                                  : 0,
                            }}
                            transition={{
                              duration:
                                AUTO_ROTATE_MS /
                                1000,
                              ease: "linear",
                            }}
                            style={{
                              background:
                                `linear-gradient(90deg, ${GOLD_DARK}, ${GOLD_LIGHT})`,
                            }}
                          />
                        )}
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          </motion.aside>
        </div>
      </div>

      {/* =====================================================================
          BOTTOM CONTROLS
          ===================================================================== */}

      <div className="pointer-events-none absolute bottom-7 left-6 right-6 z-40 flex items-center justify-between sm:left-9 sm:right-9 lg:left-12 lg:right-12 xl:left-16 xl:right-16">
        <span className="hidden font-mono text-[5px] uppercase tracking-[0.3em] text-white/[0.14] lg:block">
          {locale === "en"
            ? "SELECT A STORY"
            : "IZABERI SADRŽAJ"}
        </span>

        <div className="absolute left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-2">
            <span className="font-mono text-[5px] uppercase tracking-[0.35em] text-white/[0.14]">
              {locale === "en"
                ? "SCROLL"
                : "SKROLUJ"}
            </span>

            {!reducedMotion && (
              <motion.span
                animate={{
                  y: [0, 4, 0],
                  opacity: [
                    0.25,
                    0.7,
                    0.25,
                  ],
                }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <ArrowDown
                  size={11}
                  strokeWidth={1.05}
                  style={{
                    color:
                      `${GOLD_LIGHT}60`,
                  }}
                />
              </motion.span>
            )}
          </div>
        </div>

        <div className="pointer-events-auto hidden items-center gap-2 lg:flex">
          <button
            type="button"
            onClick={previous}
            aria-label={
              locale === "en"
                ? "Previous content"
                : "Prethodni sadržaj"
            }
            className="flex h-9 w-9 items-center justify-center border border-white/[0.1] text-white/[0.27] transition-all duration-300 hover:border-white/[0.24] hover:text-white/[0.75]"
          >
            <ArrowLeft
              size={12}
              strokeWidth={1.05}
            />
          </button>

          <button
            type="button"
            onClick={next}
            aria-label={
              locale === "en"
                ? "Next content"
                : "Sledeći sadržaj"
            }
            className="flex h-9 w-9 items-center justify-center border border-white/[0.1] text-white/[0.27] transition-all duration-300 hover:border-white/[0.24] hover:text-white/[0.75]"
          >
            <ArrowRight
              size={12}
              strokeWidth={1.05}
            />
          </button>
        </div>
      </div>

      {/* =====================================================================
          BOTTOM TRACE
          ===================================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-50 h-px bg-white/[0.035]"
      >
        <motion.div
          className="h-full origin-left"
          initial={{
            scaleX: 0,
          }}
          animate={{
            scaleX: ready ? 1 : 0,
          }}
          transition={{
            delay:
              reducedMotion ? 0 : 0.28,
            duration:
              reducedMotion ? 0 : 0.85,
            ease: EASE,
          }}
          style={{
            width: "44%",
            background:
              `linear-gradient(90deg, ${GOLD_DARK}, ${GOLD}, ${GOLD_LIGHT}, transparent)`,
          }}
        />
      </div>

      {/* =====================================================================
          OPENING
          ===================================================================== */}

      {!reducedMotion && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[60] bg-[#030303]"
          initial={{
            opacity: 1,
          }}
          animate={{
            opacity: ready ? 0 : 1,
          }}
          transition={{
            delay: 0.02,
            duration: 0.4,
            ease: EASE,
          }}
        />
      )}
    </section>
  );
}