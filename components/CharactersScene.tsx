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
import {
  useMemo,
  useState,
} from "react";

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

const EASE = [
  0.22,
  1,
  0.36,
  1,
] as const;

const copyByLocale = {
  sr: {
    eyebrow: "03 / LIKOVI",
    titleA: "Ljudi",
    titleB: "iza priče.",
    description:
      "Svaka priča dobija lice kroz ljude koji je nose. Oni stvaraju odnose, sukobe i trenutke koji ostaju dugo nakon poslednjeg kadra.",
    archive: "Arhiva likova",
    archiveDescription:
      "Kompletna postava, priče i odnosi unutar Umbra univerzuma.",
    openArchive: "Otvori arhivu",
    cast: "POSTAVA",
    registered: "REGISTROVANI LIKOVI",
    select: "IZABERI LIK",
    selected: "IZABRANO",
    main: "GLAVNI LIK",
    supporting: "SPOREDNI LIK",
    role: "ULOGA",
    dossier: "Otvori arhivu",
    next: "04 / O UMBRI",
    universe: "UMBRA UNIVERZUM",
    index: "INDEKS",
    close: "Poništi izbor",
  },

  en: {
    eyebrow: "03 / CHARACTERS",
    titleA: "The people",
    titleB: "behind the story.",
    description:
      "Every story takes its shape through the people who carry it. They create the relationships, conflicts and moments that remain long after the final frame.",
    archive: "Character archive",
    archiveDescription:
      "The complete cast, stories and relationships within the Umbra universe.",
    openArchive: "Open archive",
    cast: "CAST",
    registered: "REGISTERED CHARACTERS",
    select: "SELECT CHARACTER",
    selected: "SELECTED",
    main: "MAIN CHARACTER",
    supporting: "SUPPORTING CHARACTER",
    role: "ROLE",
    dossier: "Open archive",
    next: "04 / ABOUT UMBRA",
    universe: "UMBRA UNIVERSE",
    index: "INDEX",
    close: "Clear selection",
  },
} as const;

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

  const characterList =
    useMemo<CharacterView[]>(
      () =>
        characters.map(
          (character) =>
            character as CharacterView,
        ),
      [],
    );

  const [activeId, setActiveId] =
    useState<string | null>(null);

  const activeCharacter =
    activeId
      ? characterList.find(
          (character) =>
            character.id ===
            activeId,
        ) ?? null
      : null;

  const activeIndex =
    activeCharacter
      ? characterList.findIndex(
          (character) =>
            character.id ===
            activeCharacter.id,
        )
      : -1;

  const selectCharacter = (
    id: string,
  ) => {
    setActiveId(
      (current) =>
        current === id
          ? null
          : id,
    );
  };

  return (
    <section
      id="likovi"
      data-umbra-scene="characters"
      aria-labelledby="characters-title"
      className="relative overflow-hidden border-b border-white/[0.06] bg-[#050505]"
    >
      {/* =====================================================================
          ATMOSPHERE
          ===================================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <motion.div
          animate={{
            opacity:
              activeCharacter
                ? 0.5
                : 0.28,
          }}
          transition={{
            duration:
              reducedMotion ? 0 : 0.8,
            ease: EASE,
          }}
          className="absolute -left-[18%] top-[10%] h-[700px] w-[700px] rounded-full"
          style={{
            background:
              `radial-gradient(circle, ${GOLD}07 0%, ${GOLD}018 34%, transparent 72%)`,
            filter:
              "blur(80px)",
          }}
        />

        <motion.div
          animate={{
            opacity:
              activeCharacter
                ? 0.14
                : 0.07,
          }}
          transition={{
            duration:
              reducedMotion ? 0 : 0.8,
          }}
          className="absolute -right-[18%] top-[42%] h-[780px] w-[780px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,.02), transparent 70%)",
            filter:
              "blur(90px)",
          }}
        />

        <span
          className="absolute inset-x-[5%] top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,.03), transparent)",
          }}
        />
      </div>

      {/* =====================================================================
          MAIN
          ===================================================================== */}

      <div className="relative z-10 mx-auto max-w-[1540px] px-6 py-24 sm:px-9 sm:py-28 lg:px-12 lg:py-32 xl:px-16">
        {/* ===================================================================
            HEADER
            =================================================================== */}

        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_350px] lg:gap-24">
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
                amount: 0.12,
              }}
              transition={{
                duration:
                  reducedMotion ? 0 : 0.5,
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
                className="font-mono text-[7px] tracking-[0.42em]"
                style={{
                  color:
                    `${GOLD_LIGHT}7e`,
                }}
              >
                03
              </span>

              <span className="text-[8px] font-semibold uppercase tracking-[0.38em] text-white/[0.48]">
                {locale === "en"
                  ? "CHARACTERS"
                  : "LIKOVI"}
              </span>
            </motion.div>

            <motion.h2
              id="characters-title"
              initial={{
                opacity: 0,
                y: reducedMotion ? 0 : 22,
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
                  reducedMotion ? 0 : 0.05,
                duration:
                  reducedMotion ? 0 : 0.78,
                ease: EASE,
              }}
              className="mt-7 max-w-[930px] text-[clamp(4rem,8.1vw,9.1rem)] font-[420] uppercase leading-[0.77] tracking-[-0.085em] text-white"
            >
              <span className="block">
                {copy.titleA}
              </span>

              <span className="block font-serif font-normal italic text-white/[0.56]">
                {copy.titleB}
              </span>
            </motion.h2>

            <motion.div
              initial={{
                scaleX: 0,
                opacity: 0,
              }}
              whileInView={{
                scaleX: 1,
                opacity: 1,
              }}
              viewport={{
                once: true,
                amount: 0.1,
              }}
              transition={{
                delay:
                  reducedMotion ? 0 : 0.12,
                duration:
                  reducedMotion ? 0 : 0.68,
                ease: EASE,
              }}
              className="mt-9 h-px w-full max-w-[560px] origin-left"
              style={{
                background:
                  `linear-gradient(90deg, ${GOLD}60, rgba(255,255,255,.05), transparent)`,
              }}
            />

            <motion.p
              initial={{
                opacity: 0,
                y: reducedMotion ? 0 : 9,
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
                  reducedMotion ? 0 : 0.18,
                duration:
                  reducedMotion ? 0 : 0.56,
                ease: EASE,
              }}
              className="mt-8 max-w-[650px] text-[13px] leading-7 text-white/[0.38] sm:text-[14px] sm:leading-8"
            >
              {copy.description}
            </motion.p>
          </div>

          {/* =================================================================
              ARCHIVE MODULE
              ================================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              x: reducedMotion ? 0 : 16,
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
                reducedMotion ? 0 : 0.12,
              duration:
                reducedMotion ? 0 : 0.65,
              ease: EASE,
            }}
            className="self-end"
          >
            <div className="relative border-l border-white/[0.07] pl-6 sm:pl-7">
              <span className="text-[7px] uppercase tracking-[0.34em] text-white/[0.2]">
                {copy.archive}
              </span>

              <div className="mt-4 flex items-baseline gap-4">
                <motion.span
                  animate={{
                    color:
                      activeCharacter
                        ? `${GOLD_LIGHT}9a`
                        : `${GOLD_LIGHT}68`,
                  }}
                  transition={{
                    duration: 0.35,
                  }}
                  className="font-mono text-[58px] leading-none tracking-[-0.05em]"
                >
                  {String(
                    characterList.length,
                  ).padStart(
                    2,
                    "0",
                  )}
                </motion.span>

                <span className="text-[7px] uppercase tracking-[0.27em] text-white/[0.18]">
                  {copy.registered}
                </span>
              </div>

              <div className="mt-6 h-px w-full bg-white/[0.055]" />

              <p className="mt-5 max-w-[270px] text-[10px] leading-5 text-white/[0.27]">
                {
                  copy.archiveDescription
                }
              </p>

              <Link
                href={archiveHref}
                className="group/archive mt-7 inline-flex items-center gap-3 text-[7px] uppercase tracking-[0.3em]"
                style={{
                  color:
                    `${GOLD_LIGHT}72`,
                }}
              >
                <span>
                  {
                    copy.openArchive
                  }
                </span>

                <ArrowUpRight
                  size={12}
                  strokeWidth={1.1}
                  className="transition-transform duration-300 group-hover/archive:-translate-y-0.5 group-hover/archive:translate-x-0.5"
                />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* ===================================================================
            CAST BAR
            =================================================================== */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
            amount: 0.07,
          }}
          transition={{
            duration:
              reducedMotion ? 0 : 0.5,
          }}
          className="mt-16 flex items-center justify-between border-y border-white/[0.055] py-4 xl:mt-20"
        >
          <div className="flex items-center gap-3">
            <motion.span
              animate={{
                scale:
                  activeCharacter
                    ? [1, 1.22, 1]
                    : 1,
              }}
              transition={{
                duration: 0.5,
              }}
              className="h-[5px] w-[5px] rounded-full"
              style={{
                background: GOLD,
                boxShadow:
                  `0 0 8px ${GOLD}35`,
              }}
            />

            <span className="text-[7px] uppercase tracking-[0.32em] text-white/[0.22]">
              {activeCharacter
                ? copy.selected
                : copy.cast}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden text-[6px] uppercase tracking-[0.28em] text-white/[0.13] sm:block">
              {activeCharacter
                ? activeCharacter.name
                : copy.select}
            </span>

            <span className="font-mono text-[6px] tracking-[0.25em] text-white/[0.15]">
              {activeIndex >= 0
                ? String(
                    activeIndex + 1,
                  ).padStart(
                    2,
                    "0",
                  )
                : "00"}
              /
              {String(
                characterList.length,
              ).padStart(
                2,
                "0",
              )}
            </span>
          </div>
        </motion.div>

        {/* ===================================================================
            CHARACTER WORKSPACE
            =================================================================== */}

        <div className="mt-1 grid lg:grid-cols-[minmax(0,1fr)_330px] xl:grid-cols-[minmax(0,1fr)_380px]">
          {/* ================================================================
             CHARACTER LIST
             ================================================================ */}

          <div className="border-r-0 lg:border-r lg:border-white/[0.055]">
            {characterList.map(
              (
                character,
                index,
              ) => {
                const active =
                  character.id ===
                  activeId;

                const type =
                  character.type ===
                  "main"
                    ? copy.main
                    : copy.supporting;

                return (
                  <motion.button
                    key={character.id}
                    type="button"
                    onClick={() =>
                      selectCharacter(
                        character.id,
                      )
                    }
                    initial={{
                      opacity: 0,
                      y: reducedMotion
                        ? 0
                        : 8,
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
                      delay:
                        reducedMotion
                          ? 0
                          : Math.min(
                              index *
                                0.025,
                              0.18,
                            ),
                      duration:
                        reducedMotion
                          ? 0
                          : 0.45,
                      ease: EASE,
                    }}
                    className={[
                      "group/row relative flex w-full items-center overflow-hidden",
                      "border-b border-white/[0.055]",
                      "py-5 text-left outline-none",
                      "sm:py-6 lg:py-7",
                      "transition-colors duration-300",
                      active
                        ? "bg-white/[0.025]"
                        : "hover:bg-white/[0.012]",
                    ].join(" ")}
                    aria-pressed={
                      active
                    }
                  >
                    {/* Active edge */}

                    <motion.span
                      aria-hidden="true"
                      className="absolute left-0 top-0 h-full w-[2px] origin-center"
                      animate={{
                        scaleY: active
                          ? 1
                          : 0,
                        opacity: active
                          ? 1
                          : 0,
                      }}
                      transition={{
                        duration:
                          reducedMotion
                            ? 0
                            : 0.36,
                        ease: EASE,
                      }}
                      style={{
                        background:
                          `linear-gradient(180deg, ${GOLD_LIGHT}, ${GOLD_DARK})`,
                      }}
                    />

                    {/* Number */}

                    <span
                      className="hidden w-[82px] shrink-0 pl-1 font-mono text-[8px] tracking-[0.24em] sm:block lg:w-[96px]"
                      style={{
                        color: active
                          ? `${GOLD_LIGHT}78`
                          : "rgba(255,255,255,.12)",
                      }}
                    >
                      {String(
                        index + 1,
                      ).padStart(
                        2,
                        "0",
                      )}
                    </span>

                    {/* Main text */}

                    <span className="relative z-10 min-w-0 flex-1 pr-4">
                      <motion.span
                        animate={{
                          x: active
                            ? 6
                            : 0,
                        }}
                        transition={{
                          duration:
                            reducedMotion
                              ? 0
                              : 0.36,
                          ease: EASE,
                        }}
                        className="block truncate text-[18px] font-[440] uppercase leading-none tracking-[-0.025em] sm:text-[22px] lg:text-[27px]"
                        style={{
                          color: active
                            ? "#ffffff"
                            : "rgba(255,255,255,.7)",
                        }}
                      >
                        {
                          character.name
                        }
                      </motion.span>

                      <motion.span
                        animate={{
                          x: active
                            ? 6
                            : 0,
                          opacity: active
                            ? 0.72
                            : 0.3,
                        }}
                        transition={{
                          duration:
                            reducedMotion
                              ? 0
                              : 0.35,
                          ease: EASE,
                        }}
                        className="mt-2 block text-[6px] uppercase tracking-[0.3em]"
                        style={{
                          color:
                            GOLD_LIGHT,
                        }}
                      >
                        {type}
                      </motion.span>
                    </span>

                    {/* Role */}

                    <span className="hidden max-w-[260px] truncate px-6 text-right text-[9px] leading-5 text-white/[0.22] md:block lg:max-w-[300px]">
                      {
                        character.role
                      }
                    </span>

                    {/* Selector */}

                    <span
                      className={[
                        "relative z-10 mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border",
                        "transition-all duration-300",
                        active
                          ? "border-white/[0.18] bg-white/[0.035]"
                          : "border-white/[0.075] group-hover/row:border-white/[0.16]",
                      ].join(" ")}
                      style={{
                        color: active
                          ? GOLD_LIGHT
                          : "rgba(255,255,255,.24)",
                      }}
                    >
                      <motion.span
                        animate={{
                          x: active
                            ? 1
                            : 0,
                        }}
                        transition={{
                          duration:
                            0.25,
                        }}
                      >
                        <ArrowRight
                          size={13}
                          strokeWidth={
                            1.05
                          }
                        />
                      </motion.span>
                    </span>

                    {/* Hover field */}

                    <motion.span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0"
                      initial={false}
                      animate={{
                        opacity:
                          active
                            ? 1
                            : 0,
                      }}
                      transition={{
                        duration: 0.3,
                      }}
                      style={{
                        background:
                          `linear-gradient(90deg, ${GOLD}06, transparent 60%)`,
                      }}
                    />

                    {/* Bottom gold trace */}

                    <motion.span
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 h-px origin-left"
                      initial={false}
                      animate={{
                        scaleX: active
                          ? 1
                          : 0,
                      }}
                      transition={{
                        duration:
                          reducedMotion
                            ? 0
                            : 0.58,
                        ease: EASE,
                      }}
                      style={{
                        width: "100%",
                        background:
                          `linear-gradient(90deg, ${GOLD_DARK}, ${GOLD_LIGHT}, transparent 72%)`,
                      }}
                    />
                  </motion.button>
                );
              },
            )}
          </div>

          {/* ================================================================
             FIXED PREVIEW PANEL
             ================================================================ */}

          <div className="min-h-[310px] border-t border-white/[0.055] lg:border-t-0">
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
                  className="flex min-h-[310px] flex-col justify-between p-7 lg:p-8"
                >
                  <div>
                    <span className="font-mono text-[6px] uppercase tracking-[0.32em] text-white/[0.16]">
                      {copy.index}
                    </span>

                    <div className="mt-5 h-px w-10 bg-white/[0.09]" />
                  </div>

                  <div>
                    <div
                      className="font-mono text-[55px] leading-none tracking-[-0.06em]"
                      style={{
                        color:
                          `${GOLD_LIGHT}22`,
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
                        background:
                          `${GOLD}38`,
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
                    x: reducedMotion
                      ? 0
                      : 10,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    duration:
                      reducedMotion
                        ? 0
                        : 0.46,
                    ease: EASE,
                  }}
                  className="min-h-[310px] p-7 lg:p-8"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="font-mono text-[6px] uppercase tracking-[0.32em]"
                      style={{
                        color:
                          `${GOLD_LIGHT}6e`,
                      }}
                    >
                      {copy.selected}
                    </span>

                    <span className="font-mono text-[6px] tracking-[0.25em] text-white/[0.14]">
                      {String(
                        activeIndex + 1,
                      ).padStart(
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
                      duration:
                        reducedMotion
                          ? 0
                          : 0.6,
                      ease: EASE,
                    }}
                    className="mt-5 h-px w-full origin-left"
                    style={{
                      background:
                        `linear-gradient(90deg, ${GOLD_LIGHT}56, transparent)`,
                    }}
                  />

                  <h3 className="mt-10 text-[clamp(2rem,3vw,3.5rem)] font-[430] uppercase leading-[0.84] tracking-[-0.06em] text-white">
                    {
                      activeCharacter.name
                    }
                  </h3>

                  <div className="mt-5 flex items-center gap-3">
                    <span
                      className="h-[5px] w-[5px] rounded-full"
                      style={{
                        background:
                          GOLD,
                        boxShadow:
                          `0 0 8px ${GOLD}38`,
                      }}
                    />

                    <span className="text-[6px] uppercase tracking-[0.3em] text-white/[0.34]">
                      {
                        activeCharacter.type ===
                        "main"
                          ? copy.main
                          : copy.supporting
                      }
                    </span>
                  </div>

                  {activeCharacter.role && (
                    <div className="mt-10 border-t border-white/[0.055] pt-5">
                      <span className="font-mono text-[5px] uppercase tracking-[0.3em] text-white/[0.15]">
                        {copy.role}
                      </span>

                      <p className="mt-3 text-[10px] leading-5 text-white/[0.32]">
                        {
                          activeCharacter.role
                        }
                      </p>
                    </div>
                  )}

                  <Link
                    href={archiveHref}
                    className="group/dossier mt-8 flex items-center justify-between border border-white/[0.09] px-4 py-3 transition-all duration-300 hover:border-white/[0.19] hover:bg-white/[0.018]"
                  >
                    <span
                      className="text-[7px] uppercase tracking-[0.28em]"
                      style={{
                        color:
                          `${GOLD_LIGHT}72`,
                      }}
                    >
                      {copy.dossier}
                    </span>

                    <ArrowUpRight
                      size={12}
                      strokeWidth={1.05}
                      className="text-white/[0.25] transition-transform duration-300 group-hover/dossier:-translate-y-0.5 group-hover/dossier:translate-x-0.5"
                    />
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* ===================================================================
            LOWER BRIDGE
            =================================================================== */}

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
            duration:
              reducedMotion ? 0 : 0.5,
            ease: EASE,
          }}
          className="mt-16 flex items-center justify-between border-t border-white/[0.055] pt-6 sm:mt-20"
        >
          <div className="flex items-center gap-3">
            <span
              className="h-px w-8"
              style={{
                background:
                  `${GOLD}3d`,
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