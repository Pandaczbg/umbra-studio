"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Images,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import type {
  CharacterContent,
  LocalizedText,
  ProjectContent,
} from "@/lib/content/types";

type Locale = "sr" | "en";

const GOLD = "#c4a56b";
const GOLD_LIGHT = "#dfc88f";
const GOLD_DARK = "#8d6f43";
const IVORY = "#f3eee4";

const EASE = [0.22, 1, 0.36, 1] as const;

const copyByLocale = {
  sr: {
    eyebrow: "LIKOVI",
    titleA: "Ljudi",
    titleB: "iza priče",
    description:
      "Svaku priču nose ljudi. Njihovi odnosi, odluke i tišina oblikuju svet Umbre.",
    archive: "ARHIVA LIKOVA",
    archiveDescription:
      "Postava i dosijei likova unutar Umbra univerzuma.",
    openArchive: "OTVORI ARHIVU",
    cast: "POSTAVA",
    selected: "TRENUTNI LIK",
    select: "IZABERI LIK",
    dossier: "OTVORI DOSIJE",
    gallery: "GALERIJA",
    galleryLabel: "Otvori galeriju lika",
    next: "04 / O UMBRI",
    index: "INDEKS",
    registered: "REGISTROVANI LIKOVI",
    project: "PROJEKAT",
    role: "ULOGA",
    portrait: "PORTRET",
    previous: "Prethodni lik",
    nextCharacter: "Sledeći lik",
  },
  en: {
    eyebrow: "CHARACTERS",
    titleA: "The people",
    titleB: "behind the story",
    description:
      "Every story is carried by people. Their relationships, choices and silences shape the world of Umbra.",
    archive: "CHARACTER ARCHIVE",
    archiveDescription:
      "The cast and character dossiers within the Umbra universe.",
    openArchive: "OPEN ARCHIVE",
    cast: "CAST",
    selected: "CURRENT CHARACTER",
    select: "SELECT CHARACTER",
    dossier: "OPEN DOSSIER",
    gallery: "GALLERY",
    galleryLabel: "Open character gallery",
    next: "04 / ABOUT UMBRA",
    index: "INDEX",
    registered: "REGISTERED CHARACTERS",
    project: "PROJECT",
    role: "ROLE",
    portrait: "PORTRAIT",
    previous: "Previous character",
    nextCharacter: "Next character",
  },
} as const;

function getLocalizedText(
  text: LocalizedText | undefined,
  locale: Locale,
) {
  if (!text) return "";
  return text[locale] ?? text.sr ?? text.en ?? "";
}

function getCharacterName(
  character: CharacterContent,
  locale: Locale,
) {
  return getLocalizedText(character.title, locale);
}

function getCharacterDescription(
  character: CharacterContent,
  locale: Locale,
) {
  return (
    getLocalizedText(
      character.shortDescription ?? character.description,
      locale,
    ) || (locale === "en" ? "Character dossier" : "Dosije lika")
  );
}

function getCharacterCategory(
  character: CharacterContent,
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

function getProjectHref(slug: string, locale: Locale) {
  return locale === "en" ? `/en/projects/${slug}` : `/serije/${slug}`;
}

function getCharacterHref(
  character: CharacterContent,
  locale: Locale,
) {
  return locale === "en"
    ? `/en/characters/${character.slug}`
    : `/likovi/${character.slug}`;
}

function getCharacterGalleryHref(
  character: CharacterContent,
  locale: Locale,
) {
  return `${getCharacterHref(character, locale)}#galerija`;
}

type CharactersSceneProps = {
  locale?: Locale;
  characters: readonly CharacterContent[];
  projects: readonly ProjectContent[];
  characterImages: Record<string, string | null>;
};

export default function CharactersScene({
  locale = "sr",
  characters,
  projects,
  characterImages,
}: CharactersSceneProps) {
  const reducedMotion = useReducedMotion() ?? false;
  const copy = copyByLocale[locale];

  const archiveHref = locale === "en" ? "/en/characters" : "/likovi";
  const nextHref = locale === "en" ? "/en#o-studiju" : "/#o-studiju";

  const projectById = useMemo(
    () => new Map(projects.map((project) => [project.id, project])),
    [projects],
  );

  const firstCharacter = characters[0] ?? null;
  const [activeId, setActiveId] = useState<string | null>(
    firstCharacter?.id ?? null,
  );

  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useInView(sectionRef, {
    once: true,
    amount: 0.12,
  });

  const activeIndex = characters.findIndex(
    (character) => character.id === activeId,
  );

  const activeCharacter =
    activeIndex >= 0 ? characters[activeIndex] ?? null : null;

  const characterCount = characters.length;

  const activeProject = activeCharacter
    ? projectById.get(activeCharacter.projectId) ?? null
    : null;

  const selectByIndex = useCallback(
    (index: number) => {
      if (!characterCount) return;
      const nextIndex = (index + characterCount) % characterCount;
      const character = characters[nextIndex];
      if (character) {
        setActiveId(character.id);
      }
    },
    [characterCount, characters],
  );

  const handleRowKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
      if (
        event.key === "ArrowDown" ||
        event.key === "ArrowRight"
      ) {
        event.preventDefault();
        selectByIndex(index + 1);
        return;
      }

      if (
        event.key === "ArrowUp" ||
        event.key === "ArrowLeft"
      ) {
        event.preventDefault();
        selectByIndex(index - 1);
        return;
      }

      if (event.key === "Home") {
        event.preventDefault();
        selectByIndex(0);
        return;
      }

      if (event.key === "End") {
        event.preventDefault();
        selectByIndex(characterCount - 1);
      }
    },
    [characterCount, selectByIndex],
  );

  return (
    <section
      id="likovi-scene"
      ref={sectionRef}
      data-umbra-scene="characters"
      aria-labelledby="characters-title"
      className="relative overflow-x-clip border-b border-white/[0.055] bg-[var(--umbra-bg)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 72% 8%, rgba(223,200,143,.024), transparent 28%), linear-gradient(180deg, #060605 0%, #050504 52%, #030302 100%)",
          }}
        />
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(223,200,143,.14), transparent)",
          }}
        />
      </div>

      <div className="umbra-container relative py-16 sm:py-20 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-14 xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-18">
          <div>
            <motion.div
              initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{
                duration: reducedMotion ? 0 : 0.55,
                ease: EASE,
              }}
              className="flex items-center gap-3"
            >
              <span
                aria-hidden="true"
                className="h-px w-9"
                style={{
                  background:
                    `linear-gradient(90deg, transparent, ${GOLD_LIGHT}85)`,
                }}
              />
              <span
                className="umbra-code"
                style={{ color: `${GOLD_LIGHT}78` }}
              >
                03
              </span>
              <span
                className="umbra-label"
                style={{ color: "rgba(238,233,222,.46)" }}
              >
                {copy.eyebrow}
              </span>
            </motion.div>

            <motion.h2
              id="characters-title"
              initial={{ opacity: 0, y: reducedMotion ? 0 : 14 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{
                delay: reducedMotion ? 0 : 0.04,
                duration: reducedMotion ? 0 : 0.72,
                ease: EASE,
              }}
              className="mt-5 max-w-[760px] text-[clamp(2.8rem,7.7vw,6.2rem)] font-[430] uppercase leading-[0.88] tracking-[-0.06em] text-[var(--umbra-platinum)]"
            >
              <span className="block">{copy.titleA}</span>
              <span
                className="mt-2 block font-[400] italic tracking-[-0.03em]"
                style={{
                  fontFamily:
                    'var(--font-umbra-serif), "Iowan Old Style", "Palatino Linotype", Georgia, serif',
                  color: "rgba(238,233,222,.58)",
                }}
              >
                {copy.titleB}
              </span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={inView ? { opacity: 1, scaleX: 1 } : undefined}
              transition={{
                delay: reducedMotion ? 0 : 0.10,
                duration: reducedMotion ? 0 : 0.68,
                ease: EASE,
              }}
              className="mt-6 h-px max-w-[460px] origin-left"
              style={{
                background:
                  `linear-gradient(90deg, ${GOLD_LIGHT}48, rgba(255,255,255,.04), transparent)`,
              }}
            />

            <motion.p
              initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{
                delay: reducedMotion ? 0 : 0.16,
                duration: reducedMotion ? 0 : 0.52,
                ease: EASE,
              }}
              className="mt-5 max-w-[570px] text-[12px] leading-6 text-[var(--umbra-ink-muted)] sm:text-[13px] sm:leading-7"
            >
              {copy.description}
            </motion.p>
          </div>

          <motion.aside
            initial={{ opacity: 0, x: reducedMotion ? 0 : 10 }}
            animate={inView ? { opacity: 1, x: 0 } : undefined}
            transition={{
              delay: reducedMotion ? 0 : 0.10,
              duration: reducedMotion ? 0 : 0.60,
              ease: EASE,
            }}
            className="self-end lg:pb-1"
          >
            <Link
              href={archiveHref}
              aria-label={copy.openArchive}
              className="group/archive block border-l border-white/[0.06] pl-5 outline-none transition-[border-color,transform] duration-400 hover:-translate-y-0.5 hover:border-[#dfc88f]/30 focus-visible:ring-1 focus-visible:ring-[#dfc88f]/70 sm:pl-6"
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-[4px] w-[4px] rounded-full"
                  style={{
                    background: GOLD_LIGHT,
                    boxShadow: `0 0 8px ${GOLD_LIGHT}26`,
                  }}
                />
                <span
                  className="text-[7px] uppercase tracking-[0.28em] text-white/[0.26] transition-colors duration-300 group-hover/archive:text-white/[0.46]"
                >
                  {copy.archive}
                </span>
              </div>

              <div className="mt-4 flex items-end gap-4">
                <span
                  className="font-mono text-[34px] leading-none tracking-[-0.05em]"
                  style={{ color: `${GOLD_LIGHT}62` }}
                >
                  {String(characterCount).padStart(2, "0")}
                </span>
                <span className="mb-1 max-w-[150px] text-[7px] uppercase leading-4 tracking-[0.22em] text-white/[0.20]">
                  {copy.registered}
                </span>
              </div>

              <div className="mt-4 h-px bg-white/[0.045]" />

              <p className="mt-4 max-w-[280px] text-[10px] leading-5 text-white/[0.30]">
                {copy.archiveDescription}
              </p>

              <div className="mt-4 inline-flex min-h-10 items-center gap-3">
                <span
                  className="text-[7px] uppercase tracking-[0.24em]"
                  style={{ color: `${GOLD_LIGHT}7a` }}
                >
                  {copy.openArchive}
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  size={12}
                  strokeWidth={1.05}
                  className="transition-transform duration-300 group-hover/archive:-translate-y-0.5 group-hover/archive:translate-x-0.5"
                  style={{ color: `${GOLD_LIGHT}70` }}
                />
              </div>
            </Link>
          </motion.aside>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : undefined}
          transition={{ duration: reducedMotion ? 0 : 0.5 }}
          className="mt-10 flex items-center justify-between border-y border-white/[0.055] py-3.5 sm:mt-12"
        >
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="h-[4px] w-[4px] rounded-full"
              style={{
                background: GOLD,
                boxShadow: `0 0 7px ${GOLD}28`,
              }}
            />
            <span className="text-[7px] uppercase tracking-[0.27em] text-white/[0.25]">
              {activeCharacter ? copy.selected : copy.cast}
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <div className="hidden items-center gap-1 sm:flex">
              <button
                type="button"
                onClick={() => selectByIndex(activeIndex - 1)}
                aria-label={copy.previous}
                disabled={characterCount < 2}
                className="flex h-9 w-9 items-center justify-center border border-white/[0.06] text-white/[0.28] outline-none transition-[border-color,color,transform] duration-300 hover:-translate-y-px hover:border-[#dfc88f]/30 hover:text-[#dfc88f] disabled:pointer-events-none disabled:opacity-30 focus-visible:ring-1 focus-visible:ring-[#dfc88f]/70"
              >
                <ArrowLeft size={12} strokeWidth={1.05} />
              </button>

              <button
                type="button"
                onClick={() => selectByIndex(activeIndex + 1)}
                aria-label={copy.nextCharacter}
                disabled={characterCount < 2}
                className="flex h-9 w-9 items-center justify-center border border-white/[0.06] text-white/[0.28] outline-none transition-[border-color,color,transform] duration-300 hover:-translate-y-px hover:border-[#dfc88f]/30 hover:text-[#dfc88f] disabled:pointer-events-none disabled:opacity-30 focus-visible:ring-1 focus-visible:ring-[#dfc88f]/70"
              >
                <ArrowRight size={12} strokeWidth={1.05} />
              </button>
            </div>

            <span className="hidden max-w-[180px] truncate text-[7px] uppercase tracking-[0.22em] text-white/[0.18] sm:block">
              {activeCharacter
                ? getCharacterName(activeCharacter, locale)
                : copy.select}
            </span>

            <span className="umbra-code">
              {activeIndex >= 0
                ? String(activeIndex + 1).padStart(2, "0")
                : "00"}
              /{String(characterCount).padStart(2, "0")}
            </span>
          </div>
        </motion.div>

        <div className="mt-1 grid lg:grid-cols-[minmax(0,1fr)_330px] xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="order-2 lg:order-1 lg:border-r lg:border-white/[0.055]">
            {characters.map((character, index) => {
              const active = character.id === activeId;

              return (
                <motion.button
                  key={character.id}
                  type="button"
                  initial={false}
                  whileHover={reducedMotion ? undefined : { x: 2 }}
                  whileTap={reducedMotion ? undefined : { scale: 0.998 }}
                  animate={{
                    backgroundColor: active
                      ? "rgba(255,255,255,.016)"
                      : "rgba(0,0,0,0)",
                  }}
                  transition={{
                    duration: reducedMotion ? 0 : 0.28,
                    ease: EASE,
                  }}
                  onClick={() => setActiveId(character.id)}
                  onKeyDown={(event) =>
                    handleRowKeyDown(event, index)
                  }
                  aria-pressed={active}
                  aria-label={`${copy.select}: ${getCharacterName(character, locale)}`}
                  className="group/row relative flex w-full min-w-0 items-center overflow-hidden border-b border-white/[0.055] py-4 text-left outline-none transition-[background-color] duration-300 hover:bg-white/[0.012] focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#dfc88f]/70 sm:py-5 lg:py-6"
                >
                  <motion.span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-0 top-0 h-full w-px origin-center"
                    animate={{
                      scaleY: active ? 1 : 0,
                      opacity: active ? 1 : 0,
                    }}
                    transition={{
                      duration: reducedMotion ? 0 : 0.30,
                      ease: EASE,
                    }}
                    style={{
                      background:
                        `linear-gradient(180deg, ${GOLD_LIGHT}, ${GOLD_DARK})`,
                    }}
                  />

                  <span
                    className="hidden w-[62px] shrink-0 pl-1 font-mono text-[7px] tracking-[0.20em] sm:block lg:w-[76px]"
                    style={{
                      color: active
                        ? `${GOLD_LIGHT}6c`
                        : "rgba(255,255,255,.11)",
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="relative z-10 min-w-0 flex-1 pr-4">
                    <motion.span
                      animate={{
                        x: active ? 3 : 0,
                        color: active
                          ? IVORY
                          : "rgba(255,255,255,.68)",
                      }}
                      transition={{
                        duration: reducedMotion ? 0 : 0.26,
                        ease: EASE,
                      }}
                      className="block truncate text-[15px] font-[440] uppercase leading-none tracking-[-0.018em] sm:text-[18px] lg:text-[20px]"
                    >
                      {getCharacterName(character, locale)}
                    </motion.span>

                    <motion.span
                      animate={{
                        x: active ? 3 : 0,
                        opacity: active ? 0.78 : 0.28,
                      }}
                      transition={{
                        duration: reducedMotion ? 0 : 0.26,
                        ease: EASE,
                      }}
                      className="mt-2 block text-[6px] uppercase tracking-[0.25em]"
                      style={{ color: GOLD_LIGHT }}
                    >
                      {getCharacterCategory(character, locale)}
                    </motion.span>
                  </span>

                  <span className="hidden max-w-[230px] px-5 text-right text-[8px] leading-5 text-white/[0.18] md:block">
                    {getCharacterDescription(character, locale)}
                  </span>

                  <span
                    aria-hidden="true"
                    className="relative z-10 mr-1 flex h-9 w-9 shrink-0 items-center justify-center border border-white/[0.065] text-white/[0.22] transition-[border-color,color,transform] duration-300 group-hover/row:-translate-y-px group-hover/row:border-[rgba(223,200,143,.22)] group-hover/row:text-white/[0.62] sm:mr-2"
                  >
                    <ArrowRight
                      size={12}
                      strokeWidth={1.05}
                      className="transition-transform duration-300 group-hover/row:translate-x-0.5"
                    />
                  </span>

                  <motion.span
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left"
                    initial={false}
                    animate={{
                      scaleX: active ? 1 : 0,
                      opacity: active ? 1 : 0,
                    }}
                    transition={{
                      duration: reducedMotion ? 0 : 0.44,
                      ease: EASE,
                    }}
                    style={{
                      background:
                        `linear-gradient(90deg, ${GOLD_DARK}, ${GOLD_LIGHT}, transparent 72%)`,
                    }}
                  />
                </motion.button>
              );
            })}
          </div>

          <aside className="order-1 border-b border-white/[0.055] lg:order-2 lg:border-b-0">
            <div className="lg:sticky lg:top-24">
              <AnimatePresence mode="wait" initial={false}>
                {activeCharacter ? (
                  <motion.div
                    key={activeCharacter.id}
                    initial={{
                      opacity: 0,
                      y: reducedMotion ? 0 : 7,
                    }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      y: reducedMotion ? 0 : -5,
                    }}
                    transition={{
                      duration: reducedMotion ? 0 : 0.34,
                      ease: EASE,
                    }}
                    className="p-5 sm:p-6 lg:p-7"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="umbra-code"
                        style={{ color: `${GOLD_LIGHT}72` }}
                      >
                        {copy.selected}
                      </span>

                      <span className="umbra-code">
                        {String(activeIndex + 1).padStart(2, "0")}/
                        {String(characterCount).padStart(2, "0")}
                      </span>
                    </div>

                    <Link
                      href={getCharacterGalleryHref(
                        activeCharacter,
                        locale,
                      )}
                      aria-label={`${copy.galleryLabel}: ${getCharacterName(activeCharacter, locale)}`}
                      className="group/gallery mt-4 block overflow-hidden border border-white/[0.075] bg-[var(--umbra-surface)] outline-none focus-visible:ring-1 focus-visible:ring-[#dfc88f]/70"
                    >
                      <div className="relative aspect-[5/4] overflow-hidden">
                        <AnimatePresence
                          mode="wait"
                          initial={false}
                        >
                          <motion.div
                            key={activeCharacter.id}
                            initial={{
                              opacity: 0,
                              scale: reducedMotion ? 1 : 1.014,
                            }}
                            animate={{
                              opacity: 1,
                              scale: 1,
                            }}
                            exit={{
                              opacity: 0,
                              scale: reducedMotion ? 1 : 0.992,
                            }}
                            transition={{
                              duration: reducedMotion ? 0 : 0.40,
                              ease: EASE,
                            }}
                            className="absolute inset-0"
                          >
                            {characterImages[activeCharacter.id] ? (
                              <Image
                                src={
                                  characterImages[
                                    activeCharacter.id
                                  ]!
                                }
                                alt={getCharacterName(
                                  activeCharacter,
                                  locale,
                                )}
                                fill
                                sizes="(min-width: 1024px) 360px, 92vw"
                                className="object-cover grayscale-[0.04] transition-transform duration-[1100ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover/gallery:scale-[1.02]"
                              />
                            ) : (
                              <div
                                aria-hidden="true"
                                className="absolute inset-0 bg-[radial-gradient(circle_at_72%_38%,rgba(223,200,143,.08),transparent_34%),linear-gradient(135deg,#0a0908_0%,#050504_55%,#0d0c09_100%)]"
                              >
                                <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(rgba(255,255,255,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] [background-size:68px_68px]" />
                                <div className="absolute left-[72%] top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.045]" />
                                <div className="absolute left-[72%] top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#dfc88f]/[0.10]" />
                              </div>
                            )}

                            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.01),transparent_45%,rgba(0,0,0,.66))]" />
                          </motion.div>
                        </AnimatePresence>

                        <div className="absolute inset-x-3.5 top-3.5 flex items-center justify-between gap-3 sm:inset-x-4 sm:top-4">
                          <span className="font-mono text-[5px] uppercase tracking-[0.26em] text-white/[0.28]">
                            {copy.portrait}
                          </span>

                          <span className="flex items-center gap-2 text-[5px] uppercase tracking-[0.22em] text-white/[0.28] transition-colors duration-300 group-hover/gallery:text-[#dfc88f]/80">
                            <Images
                              aria-hidden="true"
                              size={10}
                              strokeWidth={1}
                            />
                            {copy.gallery}
                          </span>
                        </div>

                        <div className="absolute inset-x-3.5 bottom-3.5 flex items-end justify-between gap-4 sm:inset-x-4 sm:bottom-4">
                          <span
                            className="max-w-[72%] truncate font-mono text-[5px] uppercase tracking-[0.24em]"
                            style={{ color: `${GOLD_LIGHT}60` }}
                          >
                            {activeProject
                              ? getLocalizedText(
                                  activeProject.title,
                                  locale,
                                )
                              : activeCharacter.projectId}
                          </span>

                          <span
                            aria-hidden="true"
                            className="flex h-7 w-7 shrink-0 items-center justify-center border border-white/[0.09] bg-black/[0.28] text-white/[0.48] transition-all duration-300 group-hover/gallery:-translate-y-0.5 group-hover/gallery:border-[#dfc88f]/36 group-hover/gallery:text-[#dfc88f]"
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
                      className="mt-5 h-px w-12"
                      style={{
                        background:
                          `linear-gradient(90deg, ${GOLD_LIGHT}, transparent)`,
                      }}
                    />

                    <div className="mt-5">
                      <span className="umbra-code">
                        {String(activeIndex + 1).padStart(2, "0")} /{" "}
                        {String(characterCount).padStart(2, "0")}
                      </span>

                      <Link
                        href={getCharacterHref(
                          activeCharacter,
                          locale,
                        )}
                        aria-label={`${copy.dossier}: ${getCharacterName(activeCharacter, locale)}`}
                        className="group/name mt-3 block max-w-[320px] outline-none focus-visible:ring-1 focus-visible:ring-[#dfc88f]/70"
                      >
                        <h3
                          className="text-[clamp(1.8rem,5.7vw,2.8rem)] font-[430] uppercase leading-[0.90] tracking-[-0.048em] text-white transition-colors duration-300 group-hover/name:text-white/[0.86]"
                        >
                          {getCharacterName(
                            activeCharacter,
                            locale,
                          )}
                        </h3>

                        <span
                          className="mt-3 inline-flex min-h-9 items-center gap-2 text-[6px] uppercase tracking-[0.24em] text-white/[0.20] transition-colors duration-300 group-hover/name:text-[#dfc88f]/78"
                        >
                          {copy.dossier}
                          <ArrowUpRight
                            aria-hidden="true"
                            size={10}
                            strokeWidth={1}
                          />
                        </span>
                      </Link>
                    </div>

                    <div className="mt-5 flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="h-[4px] w-[4px] rounded-full"
                        style={{
                          background: GOLD,
                          boxShadow: `0 0 7px ${GOLD}28`,
                        }}
                      />
                      <span className="text-[6px] uppercase tracking-[0.27em] text-white/[0.31]">
                        {getCharacterCategory(
                          activeCharacter,
                          locale,
                        )}
                      </span>
                    </div>

                    <p className="mt-5 max-w-[320px] text-[10px] leading-5 text-white/[0.32]">
                      {getCharacterDescription(
                        activeCharacter,
                        locale,
                      )}
                    </p>

                    <div className="mt-6 grid grid-cols-2 gap-4 border-y border-white/[0.055] py-4">
                      <div className="min-w-0">
                        <span className="umbra-code">
                          {copy.project}
                        </span>

                        {activeProject ? (
                          <Link
                            href={getProjectHref(
                              activeProject.slug,
                              locale,
                            )}
                            className="mt-2 block truncate text-[8px] uppercase tracking-[0.07em] text-white/[0.50] outline-none transition-colors duration-300 hover:text-[#dfc88f] focus-visible:ring-1 focus-visible:ring-[#dfc88f]/70"
                          >
                            {getLocalizedText(
                              activeProject.title,
                              locale,
                            )}
                          </Link>
                        ) : (
                          <span className="mt-2 block truncate text-[8px] uppercase tracking-[0.07em] text-white/[0.27]">
                            {activeCharacter.projectId}
                          </span>
                        )}
                      </div>

                      <div>
                        <span className="umbra-code">
                          {copy.role}
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
                      className="group/dossier mt-5 flex min-h-[42px] items-center justify-between border border-[rgba(196,165,107,.20)] bg-[rgba(196,165,107,.022)] px-4 outline-none transition-[border-color,background-color,transform] duration-300 hover:-translate-y-px hover:border-[rgba(223,200,143,.46)] hover:bg-[rgba(196,165,107,.038)] focus-visible:ring-1 focus-visible:ring-[#dfc88f]/70"
                    >
                      <span
                        className="text-[7px] font-semibold uppercase tracking-[0.26em]"
                        style={{ color: `${GOLD_LIGHT}78` }}
                      >
                        {copy.dossier}
                      </span>
                      <ArrowUpRight
                        aria-hidden="true"
                        size={12}
                        strokeWidth={1.05}
                        className="text-white/[0.28] transition-transform duration-300 group-hover/dossier:-translate-y-0.5 group-hover/dossier:translate-x-0.5"
                      />
                    </Link>
                  </motion.div>
                ) : (
                  <div className="p-5 sm:p-6 lg:p-7">
                    <span className="umbra-code">
                      {copy.cast}
                    </span>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </aside>
        </div>

        <motion.div
          initial={{ opacity: 0, y: reducedMotion ? 0 : 6 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: reducedMotion ? 0 : 0.45 }}
          className="mt-10 flex items-center justify-between border-t border-white/[0.055] pt-5 sm:mt-12"
        >
          <Link
            href={archiveHref}
            className="group/archive-footer flex min-h-9 items-center gap-3 rounded-sm outline-none focus-visible:ring-1 focus-visible:ring-[#dfc88f]/70"
          >
            <span
              aria-hidden="true"
              className="h-px w-7 transition-[width] duration-300 group-hover/archive-footer:w-11"
              style={{ background: `${GOLD}3d` }}
            />
            <span className="umbra-code transition-colors duration-300 group-hover/archive-footer:text-white/[0.32]">
              {copy.archive}
            </span>
          </Link>

          <Link
            href={nextHref}
            className="group/next flex min-h-9 items-center gap-3 rounded-sm outline-none focus-visible:ring-1 focus-visible:ring-[#dfc88f]/70"
          >
            <span className="text-[7px] uppercase tracking-[0.23em] text-white/[0.20] transition-colors duration-300 group-hover/next:text-white/[0.42]">
              {copy.next}
            </span>
            <ArrowDown
              aria-hidden="true"
              size={13}
              strokeWidth={1.05}
              className="transition-transform duration-300 group-hover/next:translate-y-1"
              style={{ color: `${GOLD_LIGHT}70` }}
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
