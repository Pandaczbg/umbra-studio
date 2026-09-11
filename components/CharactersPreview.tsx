"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Database,
  Orbit,
  ScanLine,
} from "lucide-react";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

import { characters, type Character } from "@/data/characters";

type ProjectFilter = "ALL" | string;
type GenderFilter = "ALL" | "MALE" | "FEMALE";
type CategoryFilter = "ALL" | "MAIN" | "SUPPORTING";

const LAST_VISITED_KEY = "umbra-last-character";

export default function CharactersPreview() {
  const [projectFilter, setProjectFilter] =
    useState<ProjectFilter>("ALL");

  const [genderFilter, setGenderFilter] =
    useState<GenderFilter>("ALL");

  const [categoryFilter, setCategoryFilter] =
    useState<CategoryFilter>("ALL");

  const [activeIndex, setActiveIndex] = useState(0);
  const [lastVisited, setLastVisited] =
    useState<string | null>(null);

  const reducedMotion = useReducedMotion();

  const sectionRef = useRef<HTMLElement | null>(null);

  const inView = useInView(sectionRef, {
    once: true,
    amount: 0.14,
  });

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const smoothX = useSpring(pointerX, {
    stiffness: 42,
    damping: 24,
    mass: 0.8,
  });

  const smoothY = useSpring(pointerY, {
    stiffness: 42,
    damping: 24,
    mass: 0.8,
  });

  const portraitX = useTransform(
    smoothX,
    [-1, 1],
    reducedMotion ? [0, 0] : [-10, 10],
  );

  const portraitY = useTransform(
    smoothY,
    [-1, 1],
    reducedMotion ? [0, 0] : [-8, 8],
  );

  const orbitX = useTransform(
    smoothX,
    [-1, 1],
    reducedMotion ? [0, 0] : [-17, 17],
  );

  const orbitY = useTransform(
    smoothY,
    [-1, 1],
    reducedMotion ? [0, 0] : [-12, 12],
  );

  const charactersByProject = useMemo(() => {
    return Array.from(
      new Map(
        characters.map((character) => [
          character.projectSlug,
          character.projectTitle,
        ]),
      ),
    );
  }, []);

  const filteredCharacters = useMemo(() => {
    return characters.filter((character) => {
      const matchesProject =
        projectFilter === "ALL" ||
        character.projectSlug === projectFilter;

      const matchesGender =
        genderFilter === "ALL" ||
        character.gender === genderFilter;

      const matchesCategory =
        categoryFilter === "ALL" ||
        character.category === categoryFilter;

      return (
        matchesProject &&
        matchesGender &&
        matchesCategory
      );
    });
  }, [
    categoryFilter,
    genderFilter,
    projectFilter,
  ]);

  const activeCharacter =
    filteredCharacters[activeIndex] ??
    filteredCharacters[0] ??
    null;

  const relatedCharacters = useMemo(() => {
    if (!activeCharacter) {
      return [];
    }

    const sameProject = characters.filter(
      (character) =>
        character.projectSlug ===
          activeCharacter.projectSlug &&
        character.id !== activeCharacter.id,
    );

    return sameProject.slice(0, 4);
  }, [activeCharacter]);

  useEffect(() => {
    setActiveIndex(0);
  }, [
    projectFilter,
    genderFilter,
    categoryFilter,
  ]);

  useEffect(() => {
    try {
      const stored =
        window.localStorage.getItem(
          LAST_VISITED_KEY,
        );

      if (stored) {
        setLastVisited(stored);
      }
    } catch {
      // Storage may be unavailable.
    }
  }, []);

  useEffect(() => {
    if (!activeCharacter) {
      return;
    }

    try {
      window.localStorage.setItem(
        LAST_VISITED_KEY,
        activeCharacter.slug,
      );
    } catch {
      // Storage may be unavailable.
    }
  }, [activeCharacter]);

  const selectCharacter = (character: Character) => {
    const index = filteredCharacters.findIndex(
      (item) => item.id === character.id,
    );

    if (index >= 0) {
      setActiveIndex(index);
    }
  };

  const nextCharacter = () => {
    if (filteredCharacters.length <= 1) {
      return;
    }

    setActiveIndex((current) =>
      current === filteredCharacters.length - 1
        ? 0
        : current + 1,
    );
  };

  const previousCharacter = () => {
    if (filteredCharacters.length <= 1) {
      return;
    }

    setActiveIndex((current) =>
      current === 0
        ? filteredCharacters.length - 1
        : current - 1,
    );
  };

  const handlePointerMove = (
    event: React.PointerEvent<HTMLElement>,
  ) => {
    if (reducedMotion) {
      return;
    }

    if (event.pointerType === "touch") {
      return;
    }

    const rect =
      event.currentTarget.getBoundingClientRect();

    const x =
      (event.clientX - rect.left) / rect.width;

    const y =
      (event.clientY - rect.top) / rect.height;

    pointerX.set(x * 2 - 1);
    pointerY.set(y * 2 - 1);
  };

  const handlePointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <section
      id="likovi"
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative overflow-hidden border-b border-white/[0.065] bg-[#030303] py-28 sm:py-36 lg:py-44"
    >
      {/* =====================================================
          ATMOSPHERE
      ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-[18%] top-[30%] h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(198,154,69,0.035),transparent_70%)] blur-3xl" />

        <div className="absolute right-[8%] top-[15%] h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.018),transparent_72%)] blur-3xl" />

        <div className="absolute inset-0 umbra-grid opacity-[0.022]" />

        <div className="absolute inset-0 umbra-noise opacity-[0.08]" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C69A45]/22 to-transparent" />

      <div className="relative mx-auto max-w-[1500px] px-6 sm:px-10 lg:px-16">
        {/* ===================================================
            HEADER
        =================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={
            inView
              ? {
                  opacity: 1,
                  y: 0,
                }
              : undefined
          }
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mb-12 flex flex-col gap-8 border-b border-white/[0.07] pb-8 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <div className="mb-5 flex items-center gap-4 select-none">
              <span className="font-mono text-[8px] font-medium uppercase tracking-[0.42em] text-[#C69A45]">
                CHARACTER ARCHIVE
              </span>

              <span className="h-px w-10 bg-[#C69A45]/30" />
            </div>

            <h2 className="select-none max-w-4xl text-[clamp(3rem,6vw,6.5rem)] font-[430] leading-[0.84] tracking-[-0.067em] text-[#F1EDE4]">
              Ljudi iza priča.
            </h2>
          </div>

          <div className="flex items-end justify-between gap-8 lg:min-w-[330px]">
            <div>
              <p className="font-mono text-[8px] uppercase tracking-[0.26em] text-white/20">
                INDEX
              </p>

              <p className="mt-3 font-mono text-[10px] tracking-[0.16em] text-white/42">
                {String(filteredCharacters.length).padStart(
                  2,
                  "0",
                )}{" "}
                /{" "}
                {String(characters.length).padStart(
                  2,
                  "0",
                )}
              </p>
            </div>

            {lastVisited ? (
              <div className="text-right">
                <p className="font-mono text-[7px] uppercase tracking-[0.25em] text-[#C69A45]/70">
                  MEMORY
                </p>

                <p className="mt-2 max-w-[140px] truncate text-[10px] uppercase tracking-[0.04em] text-white/32">
                  {characters.find(
                    (character) =>
                      character.slug === lastVisited,
                  )?.name ?? "—"}
                </p>
              </div>
            ) : null}
          </div>
        </motion.div>

        {/* ===================================================
            FILTER SYSTEM
        =================================================== */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={
            inView
              ? {
                  opacity: 1,
                }
              : undefined
          }
          transition={{
            delay: 0.12,
            duration: 0.7,
          }}
          className="mb-8 flex flex-col gap-5 border-b border-white/[0.055] pb-6 xl:flex-row xl:items-center xl:justify-between"
        >
          <div className="flex flex-wrap gap-2">
            <FilterButton
              active={projectFilter === "ALL"}
              onClick={() => setProjectFilter("ALL")}
            >
              ALL PROJECTS
            </FilterButton>

            {charactersByProject.map(
              ([slug, title]) => (
                <FilterButton
                  key={slug}
                  active={projectFilter === slug}
                  onClick={() => setProjectFilter(slug)}
                >
                  {title}
                </FilterButton>
              ),
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {(
              ["ALL", "MALE", "FEMALE"] as const
            ).map((value) => (
              <FilterButton
                key={value}
                active={genderFilter === value}
                onClick={() =>
                  setGenderFilter(value)
                }
              >
                {value}
              </FilterButton>
            ))}

            {(
              ["ALL", "MAIN", "SUPPORTING"] as const
            ).map((value) => (
              <FilterButton
                key={value}
                active={categoryFilter === value}
                onClick={() =>
                  setCategoryFilter(value)
                }
              >
                {value}
              </FilterButton>
            ))}
          </div>
        </motion.div>

        {/* ===================================================
            ORBIT EXPERIENCE
        =================================================== */}

        {activeCharacter ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={
                inView
                  ? {
                      opacity: 1,
                      y: 0,
                    }
                  : undefined
              }
              transition={{
                delay: 0.15,
                duration: 0.95,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative min-h-[670px] overflow-hidden border border-white/[0.08] bg-[#060606]"
              style={{
                perspective: 1300,
              }}
            >
              {/* PORTRAIT */}

              <motion.div
                style={{
                  x: portraitX,
                  y: portraitY,
                  scale: reducedMotion ? 1 : 1.025,
                }}
                className="absolute inset-[-28px]"
              >
                <motion.img
                  key={activeCharacter.id}
                  initial={{
                    opacity: 0,
                    scale: 1.035,
                  }}
                  animate={{
                    opacity: 0.76,
                    scale: 1,
                  }}
                  transition={{
                    duration: reducedMotion ? 0 : 0.8,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  src={activeCharacter.image}
                  alt={activeCharacter.name}
                  className="h-full w-full object-cover object-center grayscale-[0.12]"
                />
              </motion.div>

              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.87)_0%,rgba(0,0,0,0.25)_52%,rgba(0,0,0,0.48)_100%)]" />

              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.02)_38%,rgba(0,0,0,0.88)_100%)]" />

              <div className="absolute inset-0 shadow-[inset_0_0_180px_rgba(0,0,0,0.82)]" />

              {/* ORBIT */}

              <motion.div
                aria-hidden="true"
                style={{
                  x: orbitX,
                  y: orbitY,
                }}
                className="pointer-events-none absolute inset-0"
              >
                <div className="absolute left-[52%] top-[46%] h-[430px] w-[430px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06] lg:h-[510px] lg:w-[510px]" />

                <div className="absolute left-[52%] top-[46%] h-[320px] w-[510px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-[#C69A45]/[0.10] rotate-[-18deg]" />

                <div className="absolute left-[52%] top-[46%] h-px w-[520px] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

                <div className="absolute left-[52%] top-[46%] h-[510px] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/[0.055] to-transparent" />
              </motion.div>

              {/* CORNERS */}

              <div className="pointer-events-none absolute inset-5 border border-white/[0.055] sm:inset-7">
                <span className="absolute left-[-1px] top-[-1px] h-10 w-10 border-l border-t border-[#C69A45]/40" />

                <span className="absolute right-[-1px] top-[-1px] h-10 w-10 border-r border-t border-white/[0.07]" />

                <span className="absolute bottom-[-1px] left-[-1px] h-10 w-10 border-b border-l border-white/[0.055]" />

                <span className="absolute bottom-[-1px] right-[-1px] h-10 w-10 border-b border-r border-[#C69A45]/20" />
              </div>

              {/* TOP DATA */}

              <div className="absolute inset-x-7 top-7 flex items-center justify-between sm:inset-x-10 sm:top-10">
                <div className="flex items-center gap-3 select-none">
                  <Orbit
                    size={14}
                    strokeWidth={1.2}
                    className="text-[#C69A45]"
                  />

                  <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#C69A45]">
                    LIVING ARCHIVE
                  </span>
                </div>

                <span className="font-mono text-[7px] uppercase tracking-[0.25em] text-white/20">
                  {String(activeIndex + 1).padStart(2, "0")} /{" "}
                  {String(filteredCharacters.length).padStart(
                    2,
                    "0",
                  )}
                </span>
              </div>

              {/* MAIN CONTENT */}

              <motion.div
                key={activeCharacter.id}
                initial={{
                  opacity: 0,
                  y: 24,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.64,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute inset-x-7 bottom-10 z-10 sm:inset-x-10 sm:bottom-10"
              >
                <div className="mb-5 flex items-center gap-4 select-none">
                  <span className="font-mono text-[7px] uppercase tracking-[0.3em] text-[#C69A45]">
                    {activeCharacter.projectTitle}
                  </span>

                  <span className="h-px w-7 bg-white/15" />

                  <span className="font-mono text-[7px] uppercase tracking-[0.25em] text-white/28">
                    {activeCharacter.category}
                  </span>
                </div>

                <h3 className="select-none max-w-4xl text-[clamp(3.8rem,7.6vw,8rem)] font-[430] leading-[0.79] tracking-[-0.075em] text-white">
                  {activeCharacter.name}
                </h3>

                <div className="mt-7 flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
                  <p className="max-w-xl text-[13px] leading-7 text-white/42 sm:text-[14px]">
                    {activeCharacter.shortDescription}
                  </p>

                  <Link
                    href={`/likovi/${activeCharacter.slug}`}
                    onClick={() => {
                      try {
                        window.localStorage.setItem(
                          LAST_VISITED_KEY,
                          activeCharacter.slug,
                        );
                      } catch {
                        // Storage may be unavailable.
                      }
                    }}
                    className="group inline-flex h-11 shrink-0 items-center gap-3 border border-[#C69A45]/45 bg-black/25 px-5 text-[8px] font-semibold uppercase tracking-[0.26em] text-[#E2BE72] backdrop-blur-md transition-all duration-300 hover:border-[#C69A45] hover:bg-[#C69A45]/[0.08]"
                  >
                    Open dossier

                    <ArrowUpRight
                      size={14}
                      strokeWidth={1.2}
                      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </Link>
                </div>
              </motion.div>

              {/* RELATED NODES */}

              {relatedCharacters.length > 0 ? (
                <div className="pointer-events-none absolute inset-0 hidden lg:block">
                  {relatedCharacters
                    .slice(0, 3)
                    .map((related, index) => {
                      const positions = [
                        "right-[9%] top-[30%]",
                        "right-[17%] top-[54%]",
                        "left-[46%] top-[17%]",
                      ];

                      return (
                        <motion.div
                          key={related.id}
                          initial={{
                            opacity: 0,
                          }}
                          animate={{
                            opacity: 1,
                          }}
                          transition={{
                            delay: 0.2 + index * 0.08,
                            duration: 0.5,
                          }}
                          className={`pointer-events-auto absolute ${positions[index]}`}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              selectCharacter(related)
                            }
                            className="group flex items-center gap-3"
                          >
                            <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                              <span className="absolute h-4 w-4 rounded-full border border-[#C69A45]/25 transition-transform duration-300 group-hover:scale-125" />

                              <span className="h-1.5 w-1.5 rounded-full bg-[#C69A45]/70 transition-transform duration-300 group-hover:scale-125" />
                            </span>

                            <span className="whitespace-nowrap border-b border-white/[0.08] pb-1 text-[8px] uppercase tracking-[0.2em] text-white/30 transition-colors duration-300 group-hover:border-[#C69A45]/35 group-hover:text-white/72">
                              {related.name}
                            </span>
                          </button>
                        </motion.div>
                      );
                    })}
                </div>
              ) : null}

              {/* BOTTOM SYSTEM */}

              <div className="absolute inset-x-7 bottom-4 sm:inset-x-10">
                <div className="umbra-system-line" />

                <div className="mt-3 flex items-center justify-between select-none">
                  <div className="flex items-center gap-3">
                    <ScanLine
                      size={13}
                      strokeWidth={1.2}
                      className="text-[#C69A45]/35"
                    />

                    <span className="font-mono text-[6px] uppercase tracking-[0.3em] text-white/18">
                      CHARACTER / SPATIAL INDEX
                    </span>
                  </div>

                  <span className="font-mono text-[7px] tracking-[0.2em] text-white/16">
                    UMBRA
                  </span>
                </div>
              </div>
            </motion.div>

            {/* =================================================
                CHARACTER INDEX
            ================================================= */}

            <motion.aside
              initial={{
                opacity: 0,
                x: 20,
              }}
              animate={
                inView
                  ? {
                      opacity: 1,
                      x: 0,
                    }
                  : undefined
              }
              transition={{
                delay: 0.24,
                duration: 0.82,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex flex-col border border-white/[0.07] bg-black/20 p-5 backdrop-blur-xl"
            >
              <div className="mb-7 flex items-center justify-between select-none">
                <div>
                  <div className="font-mono text-[7px] uppercase tracking-[0.34em] text-[#C69A45]">
                    CAST INDEX
                  </div>

                  <div className="mt-2 text-[9px] uppercase tracking-[0.18em] text-white/18">
                    Select character
                  </div>
                </div>

                <Database
                  size={15}
                  strokeWidth={1.2}
                  className="text-white/15"
                />
              </div>

              <div className="space-y-1.5">
                {filteredCharacters.map(
                  (character, index) => {
                    const active =
                      character.id === activeCharacter.id;

                    return (
                      <button
                        key={character.id}
                        type="button"
                        onClick={() =>
                          selectCharacter(character)
                        }
                        className={[
                          "group relative w-full overflow-hidden border px-4 py-4 text-left transition-all duration-400",
                          active
                            ? "border-[#C69A45]/30 bg-[#C69A45]/[0.055]"
                            : "border-white/[0.05] hover:border-white/[0.12] hover:bg-white/[0.018]",
                        ].join(" ")}
                      >
                        <div className="flex items-center justify-between gap-4 select-none">
                          <div className="flex items-center gap-3">
                            <span
                              className={[
                                "font-mono text-[7px]",
                                active
                                  ? "text-[#C69A45]"
                                  : "text-white/15",
                              ].join(" ")}
                            >
                              {String(index + 1).padStart(
                                2,
                                "0",
                              )}
                            </span>

                            <span
                              className={[
                                "text-[11px] font-medium uppercase tracking-[-0.01em] transition-colors duration-300",
                                active
                                  ? "text-white"
                                  : "text-white/42 group-hover:text-white/72",
                              ].join(" ")}
                            >
                              {character.name}
                            </span>
                          </div>

                          <ArrowRight
                            size={14}
                            strokeWidth={1.2}
                            className={[
                              "transition-all duration-300",
                              active
                                ? "text-[#C69A45]"
                                : "text-white/10 group-hover:translate-x-0.5 group-hover:text-white/32",
                            ].join(" ")}
                          />
                        </div>

                        <div className="mt-2 pl-7 text-[6px] uppercase tracking-[0.27em] text-white/16">
                          {character.projectTitle}
                        </div>

                        <span
                          className={[
                            "absolute bottom-0 left-0 h-px bg-[#C69A45] transition-all duration-500",
                            active
                              ? "w-full opacity-70"
                              : "w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-50",
                          ].join(" ")}
                        />
                      </button>
                    );
                  },
                )}
              </div>

              <div className="mt-auto pt-8">
                <div className="mb-4 flex items-center justify-between select-none">
                  <span className="font-mono text-[7px] uppercase tracking-[0.27em] text-white/18">
                    Navigate
                  </span>

                  <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-white/12">
                    Orbit
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={previousCharacter}
                    aria-label="Prethodni lik"
                    className="group flex h-10 flex-1 items-center justify-center border border-white/[0.07] text-white/26 transition-all duration-300 hover:border-[#C69A45]/30 hover:text-[#C69A45]"
                  >
                    <ArrowLeft
                      size={15}
                      strokeWidth={1.2}
                      className="transition-transform duration-300 group-hover:-translate-x-0.5"
                    />
                  </button>

                  <button
                    type="button"
                    onClick={nextCharacter}
                    aria-label="Sledeći lik"
                    className="group flex h-10 flex-1 items-center justify-center border border-white/[0.07] text-white/26 transition-all duration-300 hover:border-[#C69A45]/30 hover:text-[#C69A45]"
                  >
                    <ArrowRight
                      size={15}
                      strokeWidth={1.2}
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                    />
                  </button>
                </div>

                <Link
                  href="/likovi"
                  className="group mt-3 flex h-11 items-center justify-between border border-white/[0.07] px-4 text-[7px] font-semibold uppercase tracking-[0.27em] text-white/28 transition-all duration-300 hover:border-white/[0.15] hover:text-white/68"
                >
                  <span>Full archive</span>

                  <ArrowUpRight
                    size={15}
                    strokeWidth={1.2}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#C69A45]"
                  />
                </Link>
              </div>
            </motion.aside>
          </div>
        ) : (
          <div className="border border-white/[0.07] px-6 py-20 text-center">
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/25">
              No characters match this filter.
            </p>
          </div>
        )}

        {/* ===================================================
            LOWER SIGNAL
        =================================================== */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={
            inView
              ? {
                  opacity: 1,
                }
              : undefined
          }
          transition={{
            delay: 0.55,
            duration: 0.75,
          }}
          className="mt-14 flex items-center justify-between border-t border-white/[0.055] pt-5 select-none"
        >
          <div className="flex items-center gap-3">
            <span className="font-mono text-[6px] uppercase tracking-[0.3em] text-white/[0.15]">
              UMBRA STUDIO / LIVING CHARACTER ARCHIVE
            </span>
          </div>

          <span className="hidden items-center gap-3 font-mono text-[6px] uppercase tracking-[0.25em] text-white/[0.14] sm:flex">
            <span>Explore</span>

            <span className="h-px w-8 bg-[#C69A45]/25" />
          </span>
        </motion.div>
      </div>
    </section>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "border px-3 py-2 font-mono text-[7px] uppercase tracking-[0.2em] transition-all duration-300",
        active
          ? "border-[#C69A45]/35 bg-[#C69A45]/[0.07] text-[#E7C57D]"
          : "border-white/[0.06] text-white/25 hover:border-white/[0.13] hover:text-white/55",
      ].join(" ")}
    >
      {children}
    </button>
  );
}