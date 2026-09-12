
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Images,
} from "lucide-react";
import { useState } from "react";

import {
  characters,
  type Character,
} from "@/data/characters";
import { getCharacterHref } from "@/lib/characterNavigation";

type Locale = "sr" | "en";

const GOLD = "#c7a96b";
const GOLD_LIGHT = "#ead39a";
const GOLD_DARK = "#8f7142";

const EASE = [
  0.22,
  1,
  0.36,
  1,
] as const;

const copyByLocale = {
  sr: {
    eyebrow: "LIKOVI",
    titleA: "Ljudi",
    titleB: "iza priče",
    description:
      "Svaku priču nose ljudi. Njihovi odnosi, odluke i tišina oblikuju svet Umbre.",
    archive: "ARHIVA LIKOVA",
    archiveDescription:
      "Kompletna postava i dosijei likova unutar Umbra univerzuma.",
    openArchive: "OTVORI ARHIVU",
    cast: "POSTAVA",
    selected: "IZABRANO",
    select: "IZABERI LIK",
    dossier: "OTVORI DOSIJE",
    gallery: "OTVORI GALERIJU",
    galleryLabel: "Otvori galeriju lika",
    next: "04 / O UMBRI",
    universe: "UMBRA UNIVERZUM",
    index: "INDEKS",
    registered: "REGISTROVANI LIKOVI",
    project: "PROJEKAT",
    role: "ULOGA",
    portrait: "PORTRET",
    preview: "PREGLED",
    viewCharacter: "Prikaži lika",
  },

  en: {
    eyebrow: "CHARACTERS",
    titleA: "The people",
    titleB: "behind the story",
    description:
      "Every story is carried by people. Their relationships, choices and silences shape the world of Umbra.",
    archive: "CHARACTER ARCHIVE",
    archiveDescription:
      "The complete cast and character dossiers within the Umbra universe.",
    openArchive: "OPEN ARCHIVE",
    cast: "CAST",
    selected: "SELECTED",
    select: "SELECT CHARACTER",
    dossier: "OPEN DOSSIER",
    gallery: "OPEN GALLERY",
    galleryLabel: "Open character gallery",
    next: "04 / ABOUT UMBRA",
    universe: "UMBRA UNIVERSE",
    index: "INDEX",
    registered: "REGISTERED CHARACTERS",
    project: "PROJECT",
    role: "ROLE",
    portrait: "PORTRAIT",
    preview: "PREVIEW",
    viewCharacter: "Show character",
  },
} as const;

function getCharacterCategory(
  character: Character,
  locale: Locale,
) {
  return character.category === "MAIN"
    ? locale === "en"
      ? "Main"
      : "Glavni"
    : locale === "en"
      ? "Supporting"
      : "Sporedni";
}

function getProjectHref(
  slug: string,
  locale: Locale,
) {
  return locale === "en"
    ? `/en/projects/${slug}`
    : `/serije/${slug}`;
}

function getCharacterGalleryHref(
  character: Character,
  locale: Locale,
) {
  return `${getCharacterHref(
    character,
    locale,
  )}#galerija`;
}

export default function CharactersScene({
  locale = "sr",
}: {
  locale?: Locale;
}) {
  const reducedMotion =
    useReducedMotion() ?? false;

  const copy =
    copyByLocale[locale];

  const archiveHref =
    locale === "en"
      ? "/en/characters"
      : "/likovi";

  const nextHref =
    locale === "en"
      ? "/en#o-studiju"
      : "/#o-studiju";

  const firstCharacter =
    characters[0] ?? null;

  const [
    activeId,
    setActiveId,
  ] = useState<string | null>(
    firstCharacter?.id ?? null,
  );

  const activeCharacter =
    characters.find(
      (character) =>
        character.id === activeId,
    ) ?? null;

  const activeIndex =
    activeCharacter
      ? characters.findIndex(
          (character) =>
            character.id ===
            activeCharacter.id,
        )
      : -1;

  const characterCount =
    characters.length;

  const selectCharacter = (
    character: Character,
  ) => {
    setActiveId(character.id);
  };

  const handleRowKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    character: Character,
  ) => {
    if (
      event.target !==
      event.currentTarget
    ) {
      return;
    }

    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      selectCharacter(character);
    }
  };

  return (
    <section
      id="likovi-scene"
      data-umbra-scene="characters"
      aria-labelledby="characters-title"
      className="relative overflow-x-clip border-b border-white/[0.055] bg-[#050505]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <motion.div
          animate={{
            opacity:
              activeCharacter
                ? 0.30
                : 0.20,
            scale:
              activeCharacter
                ? 1.02
                : 1,
          }}
          transition={{
            duration:
              reducedMotion
                ? 0
                : 0.8,
            ease: EASE,
          }}
          className="absolute -left-[20%] top-[5%] h-[680px] w-[680px] rounded-full"
          style={{
            background:
              `radial-gradient(circle, ${GOLD}07 0%, ${GOLD}018 35%, transparent 72%)`,
            filter:
              "blur(92px)",
          }}
        />

        <motion.div
          animate={{
            opacity:
              activeCharacter
                ? 0.08
                : 0.045,
          }}
          transition={{
            duration:
              reducedMotion
                ? 0
                : 0.8,
            ease: EASE,
          }}
          className="absolute -right-[18%] top-[42%] h-[760px] w-[760px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,.016), transparent 70%)",
            filter:
              "blur(108px)",
          }}
        />

        <div
          className="absolute inset-x-[5%] top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,.035), transparent)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1480px] px-6 py-20 sm:px-9 sm:py-24 lg:px-12 lg:py-28 xl:px-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-20 xl:grid-cols-[minmax(0,1fr)_350px] xl:gap-24">
          <div>
            <motion.div
              initial={{
                opacity: 0,
                y:
                  reducedMotion
                    ? 0
                    : 7,
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
                duration:
                  reducedMotion
                    ? 0
                    : 0.5,
                ease: EASE,
              }}
              className="flex items-center gap-3"
            >
              <span
                aria-hidden="true"
                className="h-px w-10"
                style={{
                  background:
                    `linear-gradient(90deg, transparent, ${GOLD})`,
                }}
              />

              <span
                className="font-mono text-[7px] tracking-[0.38em]"
                style={{
                  color:
                    `${GOLD_LIGHT}76`,
                }}
              >
                03
              </span>

              <span className="text-[8px] font-semibold uppercase tracking-[0.34em] text-white/[0.40]">
                {copy.eyebrow}
              </span>
            </motion.div>

            <motion.h2
              id="characters-title"
              initial={{
                opacity: 0,
                y:
                  reducedMotion
                    ? 0
                    : 16,
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
                delay:
                  reducedMotion
                    ? 0
                    : 0.04,
                duration:
                  reducedMotion
                    ? 0
                    : 0.7,
                ease: EASE,
              }}
              className="mt-7 max-w-[820px] text-[clamp(3.4rem,6.2vw,7.4rem)] font-[420] uppercase leading-[0.81] tracking-[-0.082em] text-white"
            >
              <span className="block">
                {copy.titleA}
              </span>

              <span className="mt-2 block font-serif font-normal italic text-white/[0.55]">
                {copy.titleB}
              </span>
            </motion.h2>

            <motion.div
              initial={{
                opacity: 0,
                scaleX: 0,
              }}
              whileInView={{
                opacity: 1,
                scaleX: 1,
              }}
              viewport={{
                once: true,
                amount: 0.1,
              }}
              transition={{
                delay:
                  reducedMotion
                    ? 0
                    : 0.10,
                duration:
                  reducedMotion
                    ? 0
                    : 0.62,
                ease: EASE,
              }}
              className="mt-8 h-px w-full max-w-[520px] origin-left"
              style={{
                background:
                  `linear-gradient(90deg, ${GOLD}52, rgba(255,255,255,.045), transparent)`,
              }}
            />

            <motion.p
              initial={{
                opacity: 0,
                y:
                  reducedMotion
                    ? 0
                    : 8,
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
                delay:
                  reducedMotion
                    ? 0
                    : 0.15,
                duration:
                  reducedMotion
                    ? 0
                    : 0.5,
                ease: EASE,
              }}
              className="mt-7 max-w-[610px] text-[12px] leading-7 text-white/[0.34] sm:text-[13px] sm:leading-7"
            >
              {copy.description}
            </motion.p>
          </div>

          <motion.aside
            initial={{
              opacity: 0,
              x:
                reducedMotion
                  ? 0
                  : 12,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.1,
            }}
            transition={{
              delay:
                reducedMotion
                  ? 0
                  : 0.08,
              duration:
                reducedMotion
                  ? 0
                  : 0.58,
              ease: EASE,
            }}
            className="self-end lg:pb-1"
          >
            <Link
              href={archiveHref}
              aria-label={
                copy.openArchive
              }
              className="group/archive relative block border-l border-white/[0.075] pl-6 outline-none transition-[border-color,transform] duration-[400ms] hover:-translate-y-0.5 hover:border-[#ead39a]/35 focus-visible:ring-1 focus-visible:ring-[#ead39a]/55 sm:pl-7"
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-[4px] w-[4px] rounded-full"
                  style={{
                    background: GOLD,
                    boxShadow:
                      `0 0 9px ${GOLD}28`,
                  }}
                />

                <span className="text-[7px] uppercase tracking-[0.30em] text-white/[0.22] transition-colors duration-300 group-hover/archive:text-white/[0.40]">
                  {copy.archive}
                </span>
              </div>

              <div className="mt-4 flex items-end gap-4">
                <span
                  className="font-mono text-[46px] leading-none tracking-[-0.06em]"
                  style={{
                    color:
                      `${GOLD_LIGHT}58`,
                  }}
                >
                  {String(
                    characterCount,
                  ).padStart(
                    2,
                    "0",
                  )}
                </span>

                <span className="mb-1 max-w-[150px] text-[7px] uppercase leading-4 tracking-[0.24em] text-white/[0.17]">
                  {copy.registered}
                </span>
              </div>

              <div className="mt-5 h-px w-full bg-white/[0.05]" />

              <p className="mt-4 max-w-[280px] text-[10px] leading-5 text-white/[0.25]">
                {copy.archiveDescription}
              </p>

              <div className="mt-6 inline-flex items-center gap-3">
                <span
                  className="text-[7px] uppercase tracking-[0.28em]"
                  style={{
                    color:
                      `${GOLD_LIGHT}72`,
                  }}
                >
                  {copy.openArchive}
                </span>

                <ArrowUpRight
                  aria-hidden="true"
                  size={12}
                  strokeWidth={1.05}
                  className="transition-transform duration-300 group-hover/archive:-translate-y-0.5 group-hover/archive:translate-x-0.5"
                />
              </div>

              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 left-0 h-px w-0 transition-[width] duration-500 group-hover/archive:w-20"
                style={{
                  background:
                    `linear-gradient(90deg, ${GOLD_LIGHT}, transparent)`,
                }}
              />
            </Link>
          </motion.aside>
        </div>

        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
            amount: 0.06,
          }}
          transition={{
            duration:
              reducedMotion
                ? 0
                : 0.45,
          }}
          className="mt-14 flex items-center justify-between border-y border-white/[0.055] py-3.5 xl:mt-16"
        >
          <div className="flex items-center gap-3">
            <motion.span
              animate={{
                scale:
                  activeCharacter
                    ? [1, 1.15, 1]
                    : 1,
              }}
              transition={{
                duration:
                  reducedMotion
                    ? 0
                    : 0.4,
                ease: EASE,
              }}
              className="h-[5px] w-[5px] rounded-full"
              style={{
                background: GOLD,
                boxShadow:
                  `0 0 8px ${GOLD}30`,
              }}
            />

            <span className="text-[7px] uppercase tracking-[0.30em] text-white/[0.22]">
              {activeCharacter
                ? copy.selected
                : copy.cast}
            </span>
          </div>

          <div className="flex items-center gap-5">
            <span className="hidden max-w-[180px] truncate text-[6px] uppercase tracking-[0.24em] text-white/[0.15] sm:block">
              {activeCharacter
                ? activeCharacter.name
                : copy.select}
            </span>

            <span className="font-mono text-[6px] tracking-[0.24em] text-white/[0.14]">
              {activeIndex >= 0
                ? String(
                    activeIndex + 1,
                  ).padStart(2, "0")
                : "00"}
              /
              {String(
                characterCount,
              ).padStart(2, "0")}
            </span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_330px] xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="lg:border-r lg:border-white/[0.055]">
            {characters.map(
              (character, index) => {
                const active =
                  character.id ===
                  activeId;

                const category =
                  getCharacterCategory(
                    character,
                    locale,
                  );

                const characterHref =
                  getCharacterHref(
                    character,
                    locale,
                  );

                return (
                  <motion.div
                    key={
                      character.id
                    }
                    initial={false}
                    animate={{
                      backgroundColor:
                        active
                          ? "rgba(255,255,255,.018)"
                          : "rgba(0,0,0,0)",
                    }}
                    transition={{
                      duration:
                        reducedMotion
                          ? 0
                          : 0.28,
                      ease: EASE,
                    }}
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      selectCharacter(
                        character,
                      )
                    }
                    onKeyDown={(
                      event,
                    ) =>
                      handleRowKeyDown(
                        event,
                        character,
                      )
                    }
                    aria-pressed={
                      active
                    }
                    className="group/row relative flex w-full cursor-pointer items-center overflow-hidden border-b border-white/[0.055] py-5 text-left outline-none transition-colors duration-300 hover:bg-white/[0.012] focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#ead39a]/60 sm:py-6 lg:py-7"
                  >
                    <motion.span
                      aria-hidden="true"
                      className="pointer-events-none absolute left-0 top-0 h-full w-[2px] origin-center"
                      animate={{
                        scaleY:
                          active
                            ? 1
                            : 0,
                        opacity:
                          active
                            ? 1
                            : 0,
                      }}
                      transition={{
                        duration:
                          reducedMotion
                            ? 0
                            : 0.32,
                        ease: EASE,
                      }}
                      style={{
                        background:
                          `linear-gradient(180deg, ${GOLD_LIGHT}, ${GOLD_DARK})`,
                      }}
                    />

                    <span
                      className="hidden w-[68px] shrink-0 pl-1 font-mono text-[7px] tracking-[0.22em] sm:block lg:w-[82px]"
                      style={{
                        color:
                          active
                            ? `${GOLD_LIGHT}70`
                            : "rgba(255,255,255,.10)",
                      }}
                    >
                      {String(
                        index + 1,
                      ).padStart(2, "0")}
                    </span>

                    <div className="relative z-10 min-w-0 flex-1 pr-4">
                      <Link
                        href={
                          characterHref
                        }
                        aria-label={`${copy.dossier}: ${character.name}`}
                        onClick={(
                          event,
                        ) => {
                          event.stopPropagation();
                        }}
                        onKeyDown={(
                          event,
                        ) => {
                          event.stopPropagation();
                        }}
                        className="group/name inline-block max-w-full rounded-sm outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/60"
                      >
                        <motion.span
                          animate={{
                            x:
                              active
                                ? 4
                                : 0,
                            color:
                              active
                                ? "rgba(255,255,255,.94)"
                                : "rgba(255,255,255,.68)",
                          }}
                          transition={{
                            duration:
                              reducedMotion
                                ? 0
                                : 0.28,
                            ease: EASE,
                          }}
                          className="block truncate text-[17px] font-[440] uppercase leading-none tracking-[-0.024em] transition-colors duration-300 group-hover/name:text-white sm:text-[20px] lg:text-[23px]"
                        >
                          {
                            character.name
                          }
                        </motion.span>

                        <motion.span
                          animate={{
                            x:
                              active
                                ? 4
                                : 0,
                            opacity:
                              active
                                ? 0.75
                                : 0.28,
                          }}
                          transition={{
                            duration:
                              reducedMotion
                                ? 0
                                : 0.28,
                            ease: EASE,
                          }}
                          className="mt-2 block text-[6px] uppercase tracking-[0.28em]"
                          style={{
                            color:
                              GOLD_LIGHT,
                          }}
                        >
                          {category}
                        </motion.span>
                      </Link>
                    </div>

                    <span className="hidden max-w-[240px] px-5 text-right text-[8px] leading-5 text-white/[0.20] md:block xl:max-w-[280px]">
                      {
                        character.shortDescription
                      }
                    </span>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        selectCharacter(
                          character,
                        );
                      }}
                      aria-pressed={
                        active
                      }
                      aria-label={`${copy.select}: ${character.name}`}
                      title={copy.preview}
                      className={[
                        "group/select relative z-20 mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border outline-none",
                        "transition-[border-color,background-color,color,transform] duration-300",
                        active
                          ? "border-[#ead39a]/35 bg-[#ead39a]/[0.035] text-[#ead39a]"
                          : "border-white/[0.07] text-white/[0.22]",
                        "hover:-translate-y-px hover:border-white/[0.18] hover:bg-white/[0.025] hover:text-white/[0.60]",
                        "focus-visible:ring-1 focus-visible:ring-[#ead39a]/60",
                      ].join(" ")}
                    >
                      <ArrowRight
                        aria-hidden="true"
                        size={12}
                        strokeWidth={1.05}
                        className="transition-transform duration-300 group-hover/select:translate-x-0.5"
                      />
                    </button>

                    <motion.span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 z-0"
                      initial={false}
                      animate={{
                        opacity:
                          active
                            ? 1
                            : 0,
                      }}
                      transition={{
                        duration:
                          reducedMotion
                            ? 0
                            : 0.26,
                        ease: EASE,
                      }}
                      style={{
                        background:
                          `linear-gradient(90deg, ${GOLD}05, transparent 62%)`,
                      }}
                    />

                    <motion.span
                      aria-hidden="true"
                      className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left"
                      initial={false}
                      animate={{
                        scaleX:
                          active
                            ? 1
                            : 0,
                        opacity:
                          active
                            ? 1
                            : 0,
                      }}
                      transition={{
                        duration:
                          reducedMotion
                            ? 0
                            : 0.48,
                        ease: EASE,
                      }}
                      style={{
                        background:
                          `linear-gradient(90deg, ${GOLD_DARK}, ${GOLD_LIGHT}, transparent 72%)`,
                      }}
                    />
                  </motion.div>
                );
              },
            )}
          </div>

          <aside className="border-t border-white/[0.055] lg:border-t-0">
            <div className="lg:sticky lg:top-24">
              <AnimatePresence
                mode="wait"
                initial={false}
              >
                {activeCharacter ? (
                  <motion.div
                    key={
                      activeCharacter.id
                    }
                    initial={{
                      opacity: 0,
                      y:
                        reducedMotion
                          ? 0
                          : 8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y:
                        reducedMotion
                          ? 0
                          : -6,
                    }}
                    transition={{
                      duration:
                        reducedMotion
                          ? 0
                          : 0.34,
                      ease: EASE,
                    }}
                    className="p-6 sm:p-7 lg:p-7"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="font-mono text-[6px] uppercase tracking-[0.30em]"
                        style={{
                          color:
                            `${GOLD_LIGHT}70`,
                        }}
                      >
                        {
                          copy.selected
                        }
                      </span>

                      <span className="font-mono text-[6px] tracking-[0.24em] text-white/[0.14]">
                        {String(
                          activeIndex + 1,
                        ).padStart(
                          2,
                          "0",
                        )}
                        /
                        {String(
                          characterCount,
                        ).padStart(
                          2,
                          "0",
                        )}
                      </span>
                    </div>

                    <Link
                      href={getCharacterGalleryHref(
                        activeCharacter,
                        locale,
                      )}
                      aria-label={`${copy.galleryLabel}: ${activeCharacter.name}`}
                      onClick={(
                        event,
                      ) => {
                        event.stopPropagation();
                      }}
                      className="group/gallery relative mt-4 block overflow-hidden border border-white/[0.075] bg-[#070707] outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/65"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <AnimatePresence
                          mode="wait"
                          initial={false}
                        >
                          <motion.div
                            key={
                              activeCharacter.id
                            }
                            initial={{
                              opacity: 0,
                              scale:
                                reducedMotion
                                  ? 1
                                  : 1.018,
                            }}
                            animate={{
                              opacity: 1,
                              scale: 1,
                            }}
                            exit={{
                              opacity: 0,
                              scale:
                                reducedMotion
                                  ? 1
                                  : 0.988,
                            }}
                            transition={{
                              duration:
                                reducedMotion
                                  ? 0
                                  : 0.38,
                              ease: EASE,
                            }}
                            className="absolute inset-0"
                          >
                            {activeCharacter.image ? (
                              <Image
                                src={
                                  activeCharacter.image
                                }
                                alt={
                                  activeCharacter.name
                                }
                                fill
                                sizes="(min-width: 1024px) 360px, 88vw"
                                className="object-cover grayscale-[0.08] transition-transform duration-[900ms] group-hover/gallery:scale-[1.025]"
                              />
                            ) : (
                              <div
                                aria-hidden="true"
                                className="absolute inset-0 bg-[radial-gradient(circle_at_72%_38%,rgba(234,211,154,0.09),transparent_34%),linear-gradient(135deg,#090909_0%,#050505_55%,#0b0a08_100%)]"
                              >
                                <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.045)_1px,transparent_1px)] [background-size:64px_64px]" />

                                <div className="absolute left-[72%] top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.05]" />

                                <div className="absolute left-[72%] top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#c7a96b]/[0.12]" />
                              </div>
                            )}

                            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.015),transparent_44%,rgba(0,0,0,.70))]" />
                          </motion.div>
                        </AnimatePresence>

                        <div className="absolute inset-x-4 top-4 flex items-center justify-between">
                          <span className="font-mono text-[5px] uppercase tracking-[0.26em] text-white/[0.28]">
                            {
                              copy.portrait
                            }
                          </span>

                          <span className="flex items-center gap-2 text-[5px] uppercase tracking-[0.24em] text-white/[0.30] transition-colors duration-300 group-hover/gallery:text-[#ead39a]/85">
                            <Images
                              aria-hidden="true"
                              size={10}
                              strokeWidth={1}
                            />

                            {copy.gallery}
                          </span>
                        </div>

                        <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4">
                          <span
                            className="font-mono text-[5px] uppercase tracking-[0.26em]"
                            style={{
                              color:
                                `${GOLD_LIGHT}62`,
                            }}
                          >
                            {
                              activeCharacter.projectTitle
                            }
                          </span>

                          <span
                            aria-hidden="true"
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.10] bg-black/[0.30] text-white/[0.50] transition-all duration-300 group-hover/gallery:-translate-y-0.5 group-hover/gallery:border-[#ead39a]/40 group-hover/gallery:text-[#ead39a]"
                          >
                            <ArrowUpRight
                              size={11}
                              strokeWidth={1}
                            />
                          </span>
                        </div>
                      </div>
                    </Link>

                    <div
                      className="mt-5 h-px w-14"
                      style={{
                        background:
                          `linear-gradient(90deg, ${GOLD_LIGHT}, transparent)`,
                      }}
                    />

                    <div className="mt-5">
                      <span className="font-mono text-[6px] tracking-[0.26em] text-white/[0.13]">
                        {String(
                          activeIndex + 1,
                        ).padStart(
                          2,
                          "0",
                        )}{" "}
                        /{" "}
                        {String(
                          characterCount,
                        ).padStart(
                          2,
                          "0",
                        )}
                      </span>

                      <Link
                        href={getCharacterHref(
                          activeCharacter,
                          locale,
                        )}
                        aria-label={`${copy.dossier}: ${activeCharacter.name}`}
                        onClick={(
                          event,
                        ) => {
                          event.stopPropagation();
                        }}
                        className="group/name mt-3 block max-w-[290px] rounded-sm outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/60"
                      >
                        <h3 className="text-[clamp(2rem,3vw,3.15rem)] font-[430] uppercase leading-[0.86] tracking-[-0.06em] text-white transition-colors duration-300 group-hover/name:text-white/[0.86]">
                          {
                            activeCharacter.name
                          }
                        </h3>

                        <span className="mt-3 inline-flex items-center gap-2 text-[6px] uppercase tracking-[0.25em] text-white/[0.17] transition-colors duration-300 group-hover/name:text-[#ead39a]/75">
                          {
                            copy.dossier
                          }

                          <ArrowUpRight
                            aria-hidden="true"
                            size={10}
                            strokeWidth={1}
                            className="transition-transform duration-300 group-hover/name:-translate-y-0.5 group-hover/name:translate-x-0.5"
                          />
                        </span>
                      </Link>
                    </div>

                    <div className="mt-6 flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="h-[4px] w-[4px] rounded-full"
                        style={{
                          background:
                            GOLD,
                          boxShadow:
                            `0 0 7px ${GOLD}28`,
                        }}
                      />

                      <span className="text-[6px] uppercase tracking-[0.28em] text-white/[0.29]">
                        {getCharacterCategory(
                          activeCharacter,
                          locale,
                        )}
                      </span>
                    </div>

                    <p className="mt-5 max-w-[290px] text-[10px] leading-5 text-white/[0.30]">
                      {
                        activeCharacter.shortDescription
                      }
                    </p>

                    <div className="mt-6 grid grid-cols-2 gap-4 border-y border-white/[0.055] py-4">
                      <div className="min-w-0">
                        <span className="font-mono text-[5px] uppercase tracking-[0.26em] text-white/[0.12]">
                          {
                            copy.project
                          }
                        </span>

                        <Link
                          href={getProjectHref(
                            activeCharacter.projectSlug,
                            locale,
                          )}
                          onClick={(
                            event,
                          ) => {
                            event.stopPropagation();
                          }}
                          className="mt-2 block truncate rounded-sm text-[8px] uppercase tracking-[0.07em] text-white/[0.47] outline-none transition-colors duration-300 hover:text-[#ead39a] focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
                        >
                          {
                            activeCharacter.projectTitle
                          }
                        </Link>
                      </div>

                      <div>
                        <span className="font-mono text-[5px] uppercase tracking-[0.26em] text-white/[0.12]">
                          {
                            copy.role
                          }
                        </span>

                        <span className="mt-2 block text-[8px] uppercase tracking-[0.07em] text-white/[0.27]">
                          {getCharacterCategory(
                            activeCharacter,
                            locale,
                          )}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={getCharacterHref(
                        activeCharacter,
                        locale,
                      )}
                      onClick={(
                        event,
                      ) => {
                        event.stopPropagation();
                      }}
                      className="group/dossier mt-6 flex min-h-[42px] items-center justify-between border border-[#c7a96b]/24 bg-[#0a0907] px-4 outline-none transition-[border-color,background-color,transform] duration-300 hover:-translate-y-px hover:border-[#ead39a]/55 hover:bg-[#c7a96b]/[0.035] focus-visible:ring-1 focus-visible:ring-[#ead39a]/60"
                    >
                      <span
                        className="text-[7px] font-semibold uppercase tracking-[0.27em]"
                        style={{
                          color:
                            `${GOLD_LIGHT}78`,
                        }}
                      >
                        {
                          copy.dossier
                        }
                      </span>

                      <ArrowUpRight
                        aria-hidden="true"
                        size={12}
                        strokeWidth={1.05}
                        className="text-white/[0.26] transition-transform duration-300 group-hover/dossier:-translate-y-0.5 group-hover/dossier:translate-x-0.5"
                      />
                    </Link>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </aside>
        </div>

        <motion.div
          initial={{
            opacity: 0,
            y:
              reducedMotion
                ? 0
                : 6,
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
            duration:
              reducedMotion
                ? 0
                : 0.45,
          }}
          className="mt-14 flex items-center justify-between border-t border-white/[0.055] pt-5 sm:mt-16"
        >
          <Link
            href={archiveHref}
            className="group/archive-footer flex items-center gap-3 rounded-sm outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
          >
            <span
              aria-hidden="true"
              className="h-px w-8 transition-[width] duration-300 group-hover/archive-footer:w-11"
              style={{
                background:
                  `${GOLD}3d`,
              }}
            />

            <span className="font-mono text-[6px] uppercase tracking-[0.28em] text-white/[0.14] transition-colors duration-300 group-hover/archive-footer:text-white/[0.34]">
              {copy.archive}
            </span>
          </Link>

          <Link
            href={nextHref}
            className="group/next flex items-center gap-3 rounded-sm outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
          >
            <span className="text-[7px] uppercase tracking-[0.26em] text-white/[0.19] transition-colors duration-300 group-hover/next:text-white/[0.42]">
              {copy.next}
            </span>

            <ArrowDown
              aria-hidden="true"
              size={13}
              strokeWidth={1.05}
              className="transition-transform duration-300 group-hover/next:translate-y-1"
              style={{
                color:
                  `${GOLD_LIGHT}70`,
              }}
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
