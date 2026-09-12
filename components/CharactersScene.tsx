"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import {
  motion,
  useReducedMotion,
} from "framer-motion";
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

const EASE = [0.22, 1, 0.36, 1] as const;

const copyByLocale = {
  sr: {
    eyebrow: "LIKOVI",
    titleA: "Ljudi",
    titleB: "iza priče.",
    description:
      "Priča dobija lice kroz ljude koji je nose. Njihovi odnosi, sukobi i tišina oblikuju svet Umbre.",
    archive: "ARHIVA LIKOVA",
    archiveDescription:
      "Kompletna postava, priče i odnosi unutar Umbra univerzuma.",
    openArchive: "OTVORI ARHIVU",
    cast: "POSTAVA",
    selected: "IZABRANO",
    select: "IZABERI LIK",
    dossier: "OTVORI DOSIJE",
    next: "04 / O UMBRI",
    universe: "UMBRA UNIVERZUM",
    index: "INDEKS",
    registered: "REGISTROVANI LIKOVI",
    project: "PROJEKAT",
    role: "ULOGA",
    portrait: "PORTRET",
    selectionHint: "Izaberi lik za prikaz.",
  },

  en: {
    eyebrow: "CHARACTERS",
    titleA: "The people",
    titleB: "behind the story.",
    description:
      "Every story takes shape through the people who carry it. Their relationships, conflicts and silences define the world of Umbra.",
    archive: "CHARACTER ARCHIVE",
    archiveDescription:
      "The complete cast, stories and relationships within the Umbra universe.",
    openArchive: "OPEN ARCHIVE",
    cast: "CAST",
    selected: "SELECTED",
    select: "SELECT CHARACTER",
    dossier: "OPEN DOSSIER",
    next: "04 / ABOUT UMBRA",
    universe: "UMBRA UNIVERSE",
    index: "INDEX",
    registered: "REGISTERED CHARACTERS",
    project: "PROJECT",
    role: "ROLE",
    portrait: "PORTRAIT",
    selectionHint: "Select a character to preview.",
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

export default function CharactersScene({
  locale = "sr",
}: {
  locale?: Locale;
}) {
  const reducedMotion = useReducedMotion() ?? false;
  const copy = copyByLocale[locale];

  const archiveHref =
    locale === "en" ? "/en/characters" : "/likovi";

  const nextHref =
    locale === "en" ? "/en#o-studiju" : "/#o-studiju";

  const [activeId, setActiveId] = useState<string | null>(
    null,
  );

  const activeCharacter =
    activeId
      ? characters.find(
          (character) => character.id === activeId,
        ) ?? null
      : null;

  const activeIndex = activeCharacter
    ? characters.findIndex(
        (character) => character.id === activeCharacter.id,
      )
    : -1;

  const selectCharacter = (character: Character) => {
    setActiveId((current) =>
      current === character.id ? null : character.id,
    );
  };

  return (
    <section
      id="likovi-scene"
      data-umbra-scene="characters"
      aria-labelledby="characters-title"
      className="relative overflow-hidden border-b border-white/[0.055] bg-[#050505]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <motion.div
          animate={{
            opacity: activeCharacter ? 0.46 : 0.24,
            scale: activeCharacter ? 1.04 : 1,
          }}
          transition={{
            duration: reducedMotion ? 0 : 1,
            ease: EASE,
          }}
          className="absolute -left-[18%] top-[5%] h-[720px] w-[720px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${GOLD}08 0%, ${GOLD}02 36%, transparent 72%)`,
            filter: "blur(90px)",
          }}
        />

        <motion.div
          animate={{
            opacity: activeCharacter ? 0.12 : 0.06,
          }}
          transition={{
            duration: reducedMotion ? 0 : 1,
            ease: EASE,
          }}
          className="absolute -right-[20%] top-[46%] h-[820px] w-[820px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,.018), transparent 70%)",
            filter: "blur(110px)",
          }}
        />

        <div className="absolute inset-x-[5%] top-0 h-px bg-gradient-to-r from-transparent via-white/[0.035] to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1540px] px-6 py-24 sm:px-9 sm:py-28 lg:px-12 lg:py-36 xl:px-16">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-24 xl:grid-cols-[minmax(0,1fr)_390px]">
          <div>
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
                amount: 0.14,
              }}
              transition={{
                duration: reducedMotion ? 0 : 0.52,
                ease: EASE,
              }}
              className="flex items-center gap-3"
            >
              <span
                aria-hidden="true"
                className="h-px w-10"
                style={{
                  background: `linear-gradient(90deg, transparent, ${GOLD})`,
                }}
              />
              <span
                className="font-mono text-[7px] tracking-[0.4em]"
                style={{ color: `${GOLD_LIGHT}76` }}
              >
                03
              </span>
              <span className="text-[8px] font-semibold uppercase tracking-[0.38em] text-white/[0.42]">
                {copy.eyebrow}
              </span>
            </motion.div>

            <motion.h2
              id="characters-title"
              initial={{
                opacity: 0,
                y: reducedMotion ? 0 : 24,
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
                delay: reducedMotion ? 0 : 0.04,
                duration: reducedMotion ? 0 : 0.82,
                ease: EASE,
              }}
              className="mt-8 max-w-[980px] text-[clamp(4rem,8.2vw,9.5rem)] font-[420] uppercase leading-[0.79] tracking-[-0.088em] text-white"
            >
              <span className="block">{copy.titleA}</span>
              <span className="block font-serif font-normal italic text-white/[0.54]">
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
                delay: reducedMotion ? 0 : 0.12,
                duration: reducedMotion ? 0 : 0.68,
                ease: EASE,
              }}
              className="mt-10 h-px w-full max-w-[600px] origin-left"
              style={{
                background: `linear-gradient(90deg, ${GOLD}58, rgba(255,255,255,.05), transparent)`,
              }}
            />

            <motion.p
              initial={{
                opacity: 0,
                y: reducedMotion ? 0 : 10,
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
                delay: reducedMotion ? 0 : 0.17,
                duration: reducedMotion ? 0 : 0.58,
                ease: EASE,
              }}
              className="mt-8 max-w-[650px] text-[13px] leading-7 text-white/[0.38] sm:text-[14px] sm:leading-8"
            >
              {copy.description}
            </motion.p>
          </div>

          <motion.aside
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
              amount: 0.1,
            }}
            transition={{
              delay: reducedMotion ? 0 : 0.12,
              duration: reducedMotion ? 0 : 0.68,
              ease: EASE,
            }}
            className="self-end"
          >
            <Link
              href={archiveHref}
              aria-label={copy.openArchive}
              className="group/archive relative block border-l border-white/[0.075] pl-6 outline-none transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-[#ead39a]/35 focus-visible:ring-1 focus-visible:ring-[#ead39a]/55 sm:pl-8"
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-[4px] w-[4px] rounded-full"
                  style={{
                    background: GOLD,
                    boxShadow: `0 0 10px ${GOLD}28`,
                  }}
                />
                <span className="text-[7px] uppercase tracking-[0.32em] text-white/[0.22] transition-colors duration-300 group-hover/archive:text-white/[0.42]">
                  {copy.archive}
                </span>
              </div>

              <div className="mt-5 flex items-end gap-4">
                <motion.span
                  animate={{
                    color: activeCharacter
                      ? `${GOLD_LIGHT}9a`
                      : `${GOLD_LIGHT}64`,
                  }}
                  transition={{
                    duration: reducedMotion ? 0 : 0.4,
                    ease: EASE,
                  }}
                  className="font-mono text-[60px] leading-none tracking-[-0.06em]"
                >
                  {String(characters.length).padStart(2, "0")}
                </motion.span>
                <span className="mb-1 max-w-[150px] text-[7px] uppercase leading-4 tracking-[0.26em] text-white/[0.18]">
                  {copy.registered}
                </span>
              </div>

              <div className="mt-6 h-px w-full bg-white/[0.055]" />

              <p className="mt-5 max-w-[285px] text-[10px] leading-5 text-white/[0.27]">
                {copy.archiveDescription}
              </p>

              <div className="mt-8 inline-flex items-center gap-3">
                <span
                  className="text-[7px] uppercase tracking-[0.3em]"
                  style={{ color: `${GOLD_LIGHT}76` }}
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
                className="pointer-events-none absolute bottom-0 left-0 h-px w-0 transition-[width] duration-500 group-hover/archive:w-24"
                style={{
                  background: `linear-gradient(90deg, ${GOLD_LIGHT}, transparent)`,
                }}
              />
            </Link>
          </motion.aside>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.06 }}
          transition={{ duration: reducedMotion ? 0 : 0.5 }}
          className="mt-16 flex items-center justify-between border-y border-white/[0.055] py-4 xl:mt-20"
        >
          <div className="flex items-center gap-3">
            <motion.span
              animate={{
                scale: activeCharacter ? [1, 1.2, 1] : 1,
              }}
              transition={{
                duration: reducedMotion ? 0 : 0.48,
                ease: EASE,
              }}
              className="h-[5px] w-[5px] rounded-full"
              style={{
                background: GOLD,
                boxShadow: `0 0 9px ${GOLD}32`,
              }}
            />
            <span className="text-[7px] uppercase tracking-[0.32em] text-white/[0.22]">
              {activeCharacter ? copy.selected : copy.cast}
            </span>
          </div>

          <div className="flex items-center gap-5">
            <span className="hidden max-w-[180px] truncate text-[6px] uppercase tracking-[0.26em] text-white/[0.15] sm:block">
              {activeCharacter ? activeCharacter.name : copy.select}
            </span>
            <span className="font-mono text-[6px] tracking-[0.25em] text-white/[0.15]">
              {activeIndex >= 0
                ? String(activeIndex + 1).padStart(2, "0")
                : "00"}
              /{String(characters.length).padStart(2, "0")}
            </span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_390px]">
          <div className="lg:border-r lg:border-white/[0.055]">
            {characters.map((character, index) => {
              const active = character.id === activeId;
              const category = getCharacterCategory(character, locale);
              const characterHref = getCharacterHref(character, locale);

              return (
                <div
                  key={character.id}
                  className={[
                    "group/row relative flex w-full items-center overflow-hidden border-b border-white/[0.055]",
                    "py-6 text-left sm:py-7 lg:py-8",
                    active
                      ? "bg-white/[0.022]"
                      : "hover:bg-white/[0.012]",
                  ].join(" ")}
                >
                  <motion.span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-0 top-0 z-20 h-full w-[2px] origin-center"
                    animate={{
                      scaleY: active ? 1 : 0,
                      opacity: active ? 1 : 0,
                    }}
                    transition={{
                      duration: reducedMotion ? 0 : 0.38,
                      ease: EASE,
                    }}
                    style={{
                      background: `linear-gradient(180deg, ${GOLD_LIGHT}, ${GOLD_DARK})`,
                    }}
                  />

                  <span
                    className="hidden w-[82px] shrink-0 pl-1 font-mono text-[8px] tracking-[0.24em] sm:block lg:w-[96px]"
                    style={{
                      color: active
                        ? `${GOLD_LIGHT}7c`
                        : "rgba(255,255,255,.12)",
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="min-w-0 flex-1 pr-4">
                    <Link
                      href={characterHref}
                      aria-label={`${copy.dossier}: ${character.name}`}
                      className="group/title inline-block max-w-full rounded-sm outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
                    >
                      <motion.span
                        animate={{ x: active ? 7 : 0 }}
                        transition={{
                          duration: reducedMotion ? 0 : 0.38,
                          ease: EASE,
                        }}
                        className="block truncate text-[19px] font-[440] uppercase leading-none tracking-[-0.028em] text-white/[0.72] transition-colors duration-300 group-hover/title:text-white sm:text-[23px] lg:text-[28px]"
                      >
                        {character.name}
                      </motion.span>
                      <motion.span
                        animate={{
                          x: active ? 7 : 0,
                          opacity: active ? 0.74 : 0.29,
                        }}
                        transition={{
                          duration: reducedMotion ? 0 : 0.34,
                          ease: EASE,
                        }}
                        className="mt-2 block text-[6px] uppercase tracking-[0.3em]"
                        style={{ color: GOLD_LIGHT }}
                      >
                        {category}
                      </motion.span>
                    </Link>
                  </div>

                  <span className="hidden max-w-[270px] truncate px-6 text-right text-[9px] leading-5 text-white/[0.21] md:block lg:max-w-[310px]">
                    {character.shortDescription}
                  </span>

                  <button
                    type="button"
                    onClick={() => selectCharacter(character)}
                    aria-pressed={active}
                    aria-label={`${copy.select}: ${character.name}`}
                    className="group/select relative mr-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/[0.07] outline-none transition-all duration-300 hover:border-white/[0.18] hover:bg-white/[0.035] focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
                    style={{
                      color: active
                        ? GOLD_LIGHT
                        : "rgba(255,255,255,.23)",
                    }}
                  >
                    <ArrowRight
                      aria-hidden="true"
                      size={13}
                      strokeWidth={1.05}
                      className="transition-transform duration-300 group-hover/select:translate-x-0.5"
                    />
                  </button>

                  <motion.span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-0"
                    initial={false}
                    animate={{ opacity: active ? 1 : 0 }}
                    transition={{
                      duration: reducedMotion ? 0 : 0.3,
                      ease: EASE,
                    }}
                    style={{
                      background: `linear-gradient(90deg, ${GOLD}06, transparent 64%)`,
                    }}
                  />

                  <motion.span
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-0 left-0 z-10 h-px origin-left"
                    initial={false}
                    animate={{ scaleX: active ? 1 : 0 }}
                    transition={{
                      duration: reducedMotion ? 0 : 0.58,
                      ease: EASE,
                    }}
                    style={{
                      width: "100%",
                      background: `linear-gradient(90deg, ${GOLD_DARK}, ${GOLD_LIGHT}, transparent 72%)`,
                    }}
                  />
                </div>
              );
            })}
          </div>

          <aside className="border-t border-white/[0.055] lg:border-t-0">
            <div className="sticky top-24">
              {!activeCharacter ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.1 }}
                  className="flex min-h-[390px] flex-col justify-between p-7 sm:p-8"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[6px] uppercase tracking-[0.32em] text-white/[0.16]">
                        {copy.index}
                      </span>
                      <span className="font-mono text-[6px] tracking-[0.24em] text-white/[0.11]">
                        00 / {String(characters.length).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="mt-6 h-px w-10 bg-white/[0.09]" />
                  </div>

                  <div>
                    <div
                      className="font-mono text-[64px] leading-none tracking-[-0.07em]"
                      style={{ color: `${GOLD_LIGHT}20` }}
                    >
                      00
                    </div>
                    <p className="mt-5 max-w-[240px] text-[10px] leading-5 text-white/[0.25]">
                      {copy.selectionHint}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="h-px w-7"
                      style={{ background: `${GOLD}38` }}
                    />
                    <span className="font-mono text-[5px] uppercase tracking-[0.28em] text-white/[0.14]">
                      {copy.universe}
                    </span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={activeCharacter.id}
                  initial={{
                    opacity: 0,
                    x: reducedMotion ? 0 : 12,
                  }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: reducedMotion ? 0 : 0.46,
                    ease: EASE,
                  }}
                  className="min-h-[390px] p-7 sm:p-8"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="font-mono text-[6px] uppercase tracking-[0.32em]"
                      style={{ color: `${GOLD_LIGHT}70` }}
                    >
                      {copy.selected}
                    </span>
                    <span className="font-mono text-[6px] tracking-[0.25em] text-white/[0.13]">
                      {String(activeIndex + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <Link
                    href={getCharacterHref(activeCharacter, locale)}
                    aria-label={`${copy.dossier}: ${activeCharacter.name}`}
                    className="group/portrait mt-5 block overflow-hidden border border-white/[0.07] bg-[#070707] outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
                  >
                    <div className="relative aspect-[16/8] overflow-hidden">
                      {activeCharacter.image ? (
                        <Image
                          src={activeCharacter.image}
                          alt={activeCharacter.name}
                          fill
                          sizes="390px"
                          className="object-cover grayscale-[0.14] transition-transform duration-700 group-hover/portrait:scale-[1.025]"
                        />
                      ) : (
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 bg-[radial-gradient(circle_at_72%_38%,rgba(234,211,154,0.09),transparent_34%),linear-gradient(135deg,#090909_0%,#050505_55%,#0b0a08_100%)]"
                        >
                          <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] [background-size:72px_72px]" />
                          <div className="absolute left-[72%] top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.05]" />
                          <div className="absolute left-[72%] top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#c7a96b]/[0.12]" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.03),transparent_52%,rgba(0,0,0,.70))]" />

                      <div className="absolute inset-x-4 bottom-4 flex items-center justify-between">
                        <span className="font-mono text-[5px] uppercase tracking-[0.28em] text-white/[0.28]">
                          {copy.portrait}
                        </span>
                        <ArrowUpRight
                          aria-hidden="true"
                          size={12}
                          strokeWidth={1.05}
                          className="text-white/[0.36] transition-transform duration-300 group-hover/portrait:-translate-y-0.5 group-hover/portrait:translate-x-0.5"
                        />
                      </div>
                    </div>
                  </Link>

                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                      duration: reducedMotion ? 0 : 0.6,
                      ease: EASE,
                    }}
                    className="mt-5 h-px w-full origin-left"
                    style={{
                      background: `linear-gradient(90deg, ${GOLD_LIGHT}54, transparent)`,
                    }}
                  />

                  <div className="mt-8">
                    <span className="font-mono text-[6px] tracking-[0.28em] text-white/[0.13]">
                      {String(activeIndex + 1).padStart(2, "0")} / {String(characters.length).padStart(2, "0")}
                    </span>

                    <Link
                      href={getCharacterHref(activeCharacter, locale)}
                      aria-label={`${copy.dossier}: ${activeCharacter.name}`}
                      className="group/name mt-4 block max-w-[290px] rounded-sm outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
                    >
                      <h3 className="text-[clamp(2.2rem,3vw,3.6rem)] font-[430] uppercase leading-[0.86] tracking-[-0.065em] text-white transition-colors duration-300 group-hover/name:text-white/[0.84]">
                        {activeCharacter.name}
                      </h3>
                      <span className="mt-3 inline-flex items-center gap-2 text-[6px] uppercase tracking-[0.26em] text-white/[0.16] transition-colors duration-300 group-hover/name:text-white/[0.34]">
                        {copy.dossier}
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
                      className="h-[5px] w-[5px] rounded-full"
                      style={{
                        background: GOLD,
                        boxShadow: `0 0 8px ${GOLD}38`,
                      }}
                    />
                    <span className="text-[6px] uppercase tracking-[0.3em] text-white/[0.32]">
                      {getCharacterCategory(activeCharacter, locale)}
                    </span>
                  </div>

                  <div className="mt-7 border-t border-white/[0.055] pt-5">
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <span className="font-mono text-[5px] uppercase tracking-[0.28em] text-white/[0.13]">
                          {copy.project}
                        </span>
                        <Link
                          href={getProjectHref(
                            activeCharacter.projectSlug,
                            locale,
                          )}
                          className="mt-2 block truncate rounded-sm text-[8px] uppercase tracking-[0.08em] text-white/[0.48] outline-none transition-colors duration-300 hover:text-[#ead39a] focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
                        >
                          {activeCharacter.projectTitle}
                        </Link>
                      </div>

                      <div>
                        <span className="font-mono text-[5px] uppercase tracking-[0.28em] text-white/[0.13]">
                          {copy.role}
                        </span>
                        <span className="mt-2 block text-[8px] uppercase tracking-[0.08em] text-white/[0.28]">
                          {getCharacterCategory(activeCharacter, locale)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-7 max-w-[280px] text-[10px] leading-5 text-white/[0.32]">
                    {activeCharacter.shortDescription}
                  </p>

                  <Link
                    href={getCharacterHref(activeCharacter, locale)}
                    className="group/dossier mt-8 flex items-center justify-between border border-white/[0.085] px-4 py-3 outline-none transition-all duration-300 hover:border-white/[0.18] hover:bg-white/[0.018] focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
                  >
                    <span
                      className="text-[7px] uppercase tracking-[0.28em]"
                      style={{ color: `${GOLD_LIGHT}72` }}
                    >
                      {copy.dossier}
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      size={12}
                      strokeWidth={1.05}
                      className="text-white/[0.24] transition-transform duration-300 group-hover/dossier:-translate-y-0.5 group-hover/dossier:translate-x-0.5"
                    />
                  </Link>
                </motion.div>
              )}
            </div>
          </aside>
        </div>

        <motion.div
          initial={{
            opacity: 0,
            y: reducedMotion ? 0 : 7,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true, amount: 0.06 }}
          transition={{
            duration: reducedMotion ? 0 : 0.5,
            ease: EASE,
          }}
          className="mt-16 flex items-center justify-between border-t border-white/[0.055] pt-6 sm:mt-20"
        >
          <Link
            href={archiveHref}
            className="group/archive-footer flex items-center gap-3 rounded-sm outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
          >
            <span
              aria-hidden="true"
              className="h-px w-8 transition-[width] duration-300 group-hover/archive-footer:w-11"
              style={{ background: `${GOLD}3d` }}
            />
            <span className="font-mono text-[6px] uppercase tracking-[0.3em] text-white/[0.14] transition-colors duration-300 group-hover/archive-footer:text-white/[0.34]">
              {copy.archive}
            </span>
          </Link>

          <Link
            href={nextHref}
            className="group/next flex items-center gap-3 rounded-sm outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
          >
            <span className="text-[7px] uppercase tracking-[0.28em] text-white/[0.19] transition-colors duration-300 group-hover/next:text-white/[0.44]">
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
