"use client";

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
import { useMemo, useState } from "react";

import {
  characters,
  type Character,
} from "@/data/characters";

type Locale = "sr" | "en";

type CharacterView = Character & {
  type?: "main" | "supporting" | string;
  role?: string;
};

const GOLD = "#c7a96b";
const GOLD_LIGHT = "#ead39a";
const GOLD_DARK = "#8f7142";

const EASE = [0.22, 1, 0.36, 1] as const;

const copyByLocale = {
  sr: {
    eyebrow: "03 / LIKOVI",
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
    main: "GLAVNI LIK",
    supporting: "SPOREDNI LIK",
    role: "ULOGA",
    dossier: "OTVORI ARHIVU",
    next: "04 / O UMBRI",
    universe: "UMBRA UNIVERZUM",
    index: "INDEKS",
  },

  en: {
    eyebrow: "03 / CHARACTERS",
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
    main: "MAIN CHARACTER",
    supporting: "SUPPORTING CHARACTER",
    role: "ROLE",
    dossier: "OPEN ARCHIVE",
    next: "04 / ABOUT UMBRA",
    universe: "UMBRA UNIVERSE",
    index: "INDEX",
  },
} as const;

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

  const characterList = useMemo<CharacterView[]>(
    () =>
      characters.map(
        (character) => character as CharacterView,
      ),
    [],
  );

  const [activeId, setActiveId] = useState<string | null>(
    null,
  );

  const activeCharacter = activeId
    ? characterList.find(
        (character) => character.id === activeId,
      ) ?? null
    : null;

  const activeIndex = activeCharacter
    ? characterList.findIndex(
        (character) =>
          character.id === activeCharacter.id,
      )
    : -1;

  const selectCharacter = (id: string) => {
    setActiveId((current) =>
      current === id ? null : id,
    );
  };

  return (
    <section
      id="likovi"
      data-umbra-scene="characters"
      aria-labelledby="characters-title"
      className="relative overflow-hidden border-b border-white/[0.055] bg-[#050505]"
    >
      {/* ================================================================
          ATMOSPHERE
          ================================================================ */}

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

      {/* ================================================================
          MAIN CONTENT
          ================================================================ */}

      <div className="relative z-10 mx-auto max-w-[1540px] px-6 py-24 sm:px-9 sm:py-28 lg:px-12 lg:py-36 xl:px-16">
        {/* ==============================================================
            INTRO
            ============================================================== */}

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
                style={{
                  color: `${GOLD_LIGHT}76`,
                }}
              >
                03
              </span>

              <span className="text-[8px] font-semibold uppercase tracking-[0.38em] text-white/[0.42]">
                {locale === "en" ? "CHARACTERS" : "LIKOVI"}
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

          {/* ==============================================================
              ARCHIVE
              ============================================================== */}

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
            <div className="relative border-l border-white/[0.075] pl-6 sm:pl-8">
              <div className="flex items-center gap-3">
                <span
                  className="h-[4px] w-[4px] rounded-full"
                  style={{
                    background: GOLD,
                    boxShadow: `0 0 10px ${GOLD}28`,
                  }}
                />

                <span className="text-[7px] uppercase tracking-[0.32em] text-white/[0.22]">
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
                  {String(characterList.length).padStart(
                    2,
                    "0",
                  )}
                </motion.span>

                <span className="mb-1 max-w-[150px] text-[7px] uppercase leading-4 tracking-[0.26em] text-white/[0.18]">
                  {locale === "en"
                    ? "REGISTERED CHARACTERS"
                    : "REGISTROVANI LIKOVI"}
                </span>
              </div>

              <div className="mt-6 h-px w-full bg-white/[0.055]" />

              <p className="mt-5 max-w-[285px] text-[10px] leading-5 text-white/[0.27]">
                {copy.archiveDescription}
              </p>

              <Link
                href={archiveHref}
                className="group/archive mt-8 inline-flex items-center gap-3"
                style={{
                  color: `${GOLD_LIGHT}76`,
                }}
              >
                <span className="text-[7px] uppercase tracking-[0.3em]">
                  {copy.openArchive}
                </span>

                <ArrowUpRight
                  size={12}
                  strokeWidth={1.05}
                  className="transition-transform duration-300 group-hover/archive:-translate-y-0.5 group-hover/archive:translate-x-0.5"
                />
              </Link>
            </div>
          </motion.aside>
        </div>

        {/* ==============================================================
            CAST META BAR
            ============================================================== */}

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
            duration: reducedMotion ? 0 : 0.5,
          }}
          className="mt-16 flex items-center justify-between border-y border-white/[0.055] py-4 xl:mt-20"
        >
          <div className="flex items-center gap-3">
            <motion.span
              animate={{
                scale: activeCharacter
                  ? [1, 1.2, 1]
                  : 1,
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
              {activeCharacter
                ? activeCharacter.name
                : copy.select}
            </span>

            <span className="font-mono text-[6px] tracking-[0.25em] text-white/[0.15]">
              {activeIndex >= 0
                ? String(activeIndex + 1).padStart(2, "0")
                : "00"}
              /
              {String(characterList.length).padStart(
                2,
                "0",
              )}
            </span>
          </div>
        </motion.div>

        {/* ==============================================================
            CHARACTER WORKSPACE
            ============================================================== */}

        <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_390px]">
          {/* ============================================================
              CHARACTER LIST
              ============================================================ */}

          <div className="lg:border-r lg:border-white/[0.055]">
            {characterList.map(
              (character, index) => {
                const active =
                  character.id === activeId;

                const type =
                  character.type === "main"
                    ? copy.main
                    : copy.supporting;

                return (
                  <motion.button
                    key={character.id}
                    type="button"
                    onClick={() =>
                      selectCharacter(character.id)
                    }
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
                      amount: 0.05,
                    }}
                    transition={{
                      delay: reducedMotion
                        ? 0
                        : Math.min(index * 0.025, 0.18),
                      duration: reducedMotion ? 0 : 0.46,
                      ease: EASE,
                    }}
                    className={[
                      "group/row relative flex w-full items-center overflow-hidden",
                      "border-b border-white/[0.055]",
                      "py-6 text-left outline-none",
                      "sm:py-7 lg:py-8",
                      "transition-colors duration-300",
                      active
                        ? "bg-white/[0.022]"
                        : "hover:bg-white/[0.012]",
                    ].join(" ")}
                    aria-pressed={active}
                  >
                    {/* Active edge */}

                    <motion.span
                      aria-hidden="true"
                      className="absolute left-0 top-0 h-full w-[2px] origin-center"
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

                    {/* Index */}

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

                    {/* Character name */}

                    <span className="relative z-10 min-w-0 flex-1 pr-4">
                      <motion.span
                        animate={{
                          x: active ? 7 : 0,
                        }}
                        transition={{
                          duration: reducedMotion ? 0 : 0.38,
                          ease: EASE,
                        }}
                        className="block truncate text-[19px] font-[440] uppercase leading-none tracking-[-0.028em] text-white sm:text-[23px] lg:text-[28px]"
                        style={{
                          color: active
                            ? "#ffffff"
                            : "rgba(255,255,255,.69)",
                        }}
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
                        style={{
                          color: GOLD_LIGHT,
                        }}
                      >
                        {type}
                      </motion.span>
                    </span>

                    {/* Role */}

                    <span className="hidden max-w-[270px] truncate px-6 text-right text-[9px] leading-5 text-white/[0.21] md:block lg:max-w-[310px]">
                      {character.role}
                    </span>

                    {/* Selector */}

                    <span
                      className={[
                        "relative z-10 mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border",
                        "transition-all duration-300",
                        active
                          ? "border-white/[0.18] bg-white/[0.035]"
                          : "border-white/[0.07] group-hover/row:border-white/[0.16]",
                      ].join(" ")}
                      style={{
                        color: active
                          ? GOLD_LIGHT
                          : "rgba(255,255,255,.23)",
                      }}
                    >
                      <motion.span
                        animate={{
                          x: active ? 1 : 0,
                        }}
                        transition={{
                          duration: reducedMotion ? 0 : 0.25,
                          ease: EASE,
                        }}
                      >
                        <ArrowRight
                          size={13}
                          strokeWidth={1.05}
                        />
                      </motion.span>
                    </span>

                    {/* Active wash */}

                    <motion.span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0"
                      initial={false}
                      animate={{
                        opacity: active ? 1 : 0,
                      }}
                      transition={{
                        duration: reducedMotion ? 0 : 0.3,
                        ease: EASE,
                      }}
                      style={{
                        background: `linear-gradient(90deg, ${GOLD}06, transparent 64%)`,
                      }}
                    />

                    {/* Bottom trace */}

                    <motion.span
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 h-px origin-left"
                      initial={false}
                      animate={{
                        scaleX: active ? 1 : 0,
                      }}
                      transition={{
                        duration: reducedMotion ? 0 : 0.58,
                        ease: EASE,
                      }}
                      style={{
                        width: "100%",
                        background: `linear-gradient(90deg, ${GOLD_DARK}, ${GOLD_LIGHT}, transparent 72%)`,
                      }}
                    />
                  </motion.button>
                );
              },
            )}
          </div>

          {/* ============================================================
              PREVIEW
              ============================================================ */}

          <aside className="border-t border-white/[0.055] lg:border-t-0">
            <div className="sticky top-24">
              {!activeCharacter ? (
                <motion.div
                  initial={{
                    opacity: 0,
                  }}
                  whileInView={{
                    opacity: 1,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.1,
                  }}
                  className="flex min-h-[330px] flex-col justify-between p-7 sm:p-8"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[6px] uppercase tracking-[0.32em] text-white/[0.16]">
                        {copy.index}
                      </span>

                      <span className="font-mono text-[6px] tracking-[0.24em] text-white/[0.11]">
                        00 /{" "}
                        {String(characterList.length).padStart(
                          2,
                          "0",
                        )}
                      </span>
                    </div>

                    <div className="mt-6 h-px w-10 bg-white/[0.09]" />
                  </div>

                  <div>
                    <div
                      className="font-mono text-[64px] leading-none tracking-[-0.07em]"
                      style={{
                        color: `${GOLD_LIGHT}20`,
                      }}
                    >
                      00
                    </div>

                    <p className="mt-5 max-w-[240px] text-[10px] leading-5 text-white/[0.25]">
                      {copy.select}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className="h-px w-7"
                      style={{
                        background: `${GOLD}38`,
                      }}
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
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    duration: reducedMotion ? 0 : 0.46,
                    ease: EASE,
                  }}
                  className="min-h-[330px] p-7 sm:p-8"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="font-mono text-[6px] uppercase tracking-[0.32em]"
                      style={{
                        color: `${GOLD_LIGHT}70`,
                      }}
                    >
                      {copy.selected}
                    </span>

                    <span className="font-mono text-[6px] tracking-[0.25em] text-white/[0.13]">
                      {String(activeIndex + 1).padStart(
                        2,
                        "0",
                      )}
                    </span>
                  </div>

                  <motion.div
                    initial={{
                      scaleX: 0,
                    }}
                    animate={{
                      scaleX: 1,
                    }}
                    transition={{
                      duration: reducedMotion ? 0 : 0.6,
                      ease: EASE,
                    }}
                    className="mt-5 h-px w-full origin-left"
                    style={{
                      background: `linear-gradient(90deg, ${GOLD_LIGHT}54, transparent)`,
                    }}
                  />

                  <div className="mt-10">
                    <span className="font-mono text-[6px] tracking-[0.28em] text-white/[0.13]">
                      {String(activeIndex + 1).padStart(
                        2,
                        "0",
                      )}{" "}
                      /{" "}
                      {String(characterList.length).padStart(
                        2,
                        "0",
                      )}
                    </span>

                    <h3 className="mt-4 max-w-[290px] text-[clamp(2.2rem,3vw,3.6rem)] font-[430] uppercase leading-[0.86] tracking-[-0.065em] text-white">
                      {activeCharacter.name}
                    </h3>
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    <span
                      className="h-[5px] w-[5px] rounded-full"
                      style={{
                        background: GOLD,
                        boxShadow: `0 0 8px ${GOLD}38`,
                      }}
                    />

                    <span className="text-[6px] uppercase tracking-[0.3em] text-white/[0.32]">
                      {activeCharacter.type === "main"
                        ? copy.main
                        : copy.supporting}
                    </span>
                  </div>

                  {activeCharacter.role && (
                    <div className="mt-10 border-t border-white/[0.055] pt-5">
                      <span className="font-mono text-[5px] uppercase tracking-[0.3em] text-white/[0.14]">
                        {copy.role}
                      </span>

                      <p className="mt-3 max-w-[280px] text-[10px] leading-5 text-white/[0.32]">
                        {activeCharacter.role}
                      </p>
                    </div>
                  )}

                  <Link
                    href={archiveHref}
                    className="group/dossier mt-8 flex items-center justify-between border border-white/[0.085] px-4 py-3 transition-all duration-300 hover:border-white/[0.18] hover:bg-white/[0.018]"
                  >
                    <span
                      className="text-[7px] uppercase tracking-[0.28em]"
                      style={{
                        color: `${GOLD_LIGHT}72`,
                      }}
                    >
                      {copy.dossier}
                    </span>

                    <ArrowUpRight
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

        {/* ==============================================================
            SECTION BRIDGE
            ============================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: reducedMotion ? 0 : 7,
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
            duration: reducedMotion ? 0 : 0.5,
            ease: EASE,
          }}
          className="mt-16 flex items-center justify-between border-t border-white/[0.055] pt-6 sm:mt-20"
        >
          <div className="flex items-center gap-3">
            <span
              className="h-px w-8"
              style={{
                background: `${GOLD}3d`,
              }}
            />

            <span className="font-mono text-[6px] uppercase tracking-[0.3em] text-white/[0.14]">
              {copy.universe}
            </span>
          </div>

          <Link
            href={nextHref}
            className="group/next flex items-center gap-3"
          >
            <span className="text-[7px] uppercase tracking-[0.28em] text-white/[0.19] transition-colors duration-300 group-hover/next:text-white/[0.44]">
              {copy.next}
            </span>

            <ArrowDown
              size={13}
              strokeWidth={1.05}
              className="transition-transform duration-300 group-hover/next:translate-y-1"
              style={{
                color: `${GOLD_LIGHT}70`,
              }}
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}