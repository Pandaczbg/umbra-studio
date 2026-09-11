"use client";

import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Clapperboard,
  Layers3,
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

import { characters } from "@/data/characters";
import { projects, type ProjectStatus } from "@/data/projects";

const backgroundImage = "/umbra-background.png";

const statusLabels: Record<ProjectStatus, string> = {
  "in-production": "U produkciji",
  development: "U razvoju",
  upcoming: "Uskoro",
};

const statusShortLabels: Record<ProjectStatus, string> = {
  "in-production": "ACTIVE",
  development: "DEVELOPMENT",
  upcoming: "UPCOMING",
};

export default function ProjectsPreview() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

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

  const imageX = useTransform(
    smoothX,
    [-1, 1],
    reducedMotion ? [0, 0] : [-16, 16],
  );

  const imageY = useTransform(
    smoothY,
    [-1, 1],
    reducedMotion ? [0, 0] : [-11, 11],
  );

  const depthX = useTransform(
    smoothX,
    [-1, 1],
    reducedMotion ? [0, 0] : [-28, 28],
  );

  const depthY = useTransform(
    smoothY,
    [-1, 1],
    reducedMotion ? [0, 0] : [-20, 20],
  );

  const titleX = useTransform(
    smoothX,
    [-1, 1],
    reducedMotion ? [0, 0] : [-7, 7],
  );

  const titleY = useTransform(
    smoothY,
    [-1, 1],
    reducedMotion ? [0, 0] : [-5, 5],
  );

  const rotateY = useTransform(
    smoothX,
    [-1, 1],
    reducedMotion ? [0, 0] : [2.6, -2.6],
  );

  const rotateX = useTransform(
    smoothY,
    [-1, 1],
    reducedMotion ? [0, 0] : [-1.8, 1.8],
  );

  const lightX = useTransform(
    smoothX,
    [-1, 1],
    reducedMotion ? ["50%", "50%"] : ["30%", "70%"],
  );

  const lightY = useTransform(
    smoothY,
    [-1, 1],
    reducedMotion ? ["50%", "50%"] : ["32%", "68%"],
  );

  const projectsForDisplay = useMemo(() => projects, []);

  const activeProject =
    projectsForDisplay[activeIndex] ?? projectsForDisplay[0];

  const projectCharacters = useMemo(() => {
    if (!activeProject) {
      return [];
    }

    return characters.filter(
      (character) =>
        character.projectSlug === activeProject.slug,
    );
  }, [activeProject]);

  const primaryCharacter =
    projectCharacters.find(
      (character) => character.category === "MAIN",
    ) ?? projectCharacters[0];

  useEffect(() => {
    if (
      reducedMotion ||
      isPaused ||
      projectsForDisplay.length <= 1
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) =>
        current === projectsForDisplay.length - 1
          ? 0
          : current + 1,
      );
    }, 7200);

    return () => window.clearInterval(timer);
  }, [
    isPaused,
    projectsForDisplay.length,
    reducedMotion,
  ]);

  const goPrevious = () => {
    setActiveIndex((current) =>
      current === 0
        ? projectsForDisplay.length - 1
        : current - 1,
    );
  };

  const goNext = () => {
    setActiveIndex((current) =>
      current === projectsForDisplay.length - 1
        ? 0
        : current + 1,
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
    setIsFocused(false);
  };

  if (!activeProject) {
    return null;
  }

  return (
    <section
      id="projekti"
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative overflow-hidden border-b border-white/[0.065] bg-[#050505] py-28 sm:py-36 lg:py-44"
    >
      {/* ATMOSPHERE */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <motion.div
          style={{
            x: imageX,
            y: imageY,
            scale: reducedMotion ? 1 : 1.04,
          }}
          className="absolute inset-[-44px] opacity-[0.13]"
        >
          <div
            className="absolute inset-0 bg-cover bg-center grayscale"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              filter: "blur(10px) contrast(0.78)",
            }}
          />
        </motion.div>

        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#050505_0%,rgba(5,5,5,0.9)_22%,rgba(5,5,5,0.96)_72%,#050505_100%)]" />

        <div className="absolute inset-0 bg-[linear-gradient(90deg,#050505_0%,rgba(5,5,5,0.78)_25%,rgba(5,5,5,0.69)_76%,#050505_100%)]" />

        <div className="absolute inset-0 umbra-grid opacity-[0.028]" />

        <div className="absolute inset-0 umbra-noise opacity-[0.12]" />

        <div className="absolute left-1/2 top-[28%] h-[480px] w-[760px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(198,154,69,0.045),transparent_68%)] blur-3xl" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C69A45]/25 to-transparent" />

      <div className="relative mx-auto max-w-[1500px] px-6 sm:px-10 lg:px-16">
        {/* ONE SECTION TITLE — NO DUPLICATION */}

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
          className="mb-12 flex flex-col gap-7 border-b border-white/[0.07] pb-7 sm:mb-14 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <div className="mb-5 flex items-center gap-4 select-none">
              <span className="text-[8px] font-semibold uppercase tracking-[0.42em] text-[#C69A45]">
                PROJECT ARCHIVE
              </span>

              <span className="h-px w-10 bg-[#C69A45]/30" />
            </div>

            <h2 className="select-none max-w-4xl text-[clamp(3rem,6vw,6.5rem)] font-[430] leading-[0.86] tracking-[-0.065em] text-[#F1EDE4]">
              Svetovi koje
              <br />
              stvaramo.
            </h2>
          </div>

          <div className="max-w-sm text-[11px] leading-6 text-white/30">
            Dva projekta. Dva sveta. Jedan Umbra sistem.
          </div>
        </motion.div>

        {/* MAIN EXPERIENCE */}

        <div className="grid gap-6 lg:grid-cols-[1fr_286px]">
          {/* CINEMATIC VIEWER */}

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
              delay: 0.08,
              duration: 0.95,
              ease: [0.22, 1, 0.36, 1],
            }}
            onMouseEnter={() => setIsFocused(true)}
            onMouseLeave={() => setIsFocused(false)}
            className="relative min-h-[650px] overflow-hidden border border-white/[0.08] bg-black/45 sm:min-h-[710px]"
            style={{
              perspective: 1400,
            }}
          >
            {/* BACKGROUND */}

            <motion.div
              style={{
                x: imageX,
                y: imageY,
                rotateX,
                rotateY,
                scale: isFocused
                  ? reducedMotion
                    ? 1
                    : 1.012
                  : 1,
              }}
              className="absolute inset-[-38px] will-change-transform"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${backgroundImage})`,
                }}
              />
            </motion.div>

            {/* FRONT ATMOSPHERE */}

            <div className="absolute inset-0 bg-black/[0.36]" />

            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.28)_0%,rgba(0,0,0,0.04)_37%,rgba(0,0,0,0.84)_100%)]" />

            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.22)_51%,rgba(0,0,0,0.6)_100%)]" />

            <div className="absolute inset-0 shadow-[inset_0_0_190px_rgba(0,0,0,0.78)]" />

            {/* MOVING LIGHT */}

            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background: `radial-gradient(circle at ${lightX} ${lightY}, rgba(198,154,69,0.10) 0%, rgba(198,154,69,0.03) 18%, transparent 43%)`,
              }}
            />

            {/* DEPTH LAYER */}

            <motion.div
              aria-hidden="true"
              style={{
                x: depthX,
                y: depthY,
              }}
              className="pointer-events-none absolute inset-0 will-change-transform"
            >
              <div className="absolute left-[11%] top-[19%] h-px w-[22%] bg-white/[0.09]" />

              <div className="absolute right-[14%] top-[33%] h-px w-[16%] bg-white/[0.06]" />

              <div className="absolute bottom-[30%] left-[8%] h-px w-[13%] bg-[#C69A45]/25" />
            </motion.div>

            {/* SCAN */}

            <motion.div
              aria-hidden="true"
              initial={{
                y: "-10%",
                opacity: 0,
              }}
              animate={{
                y: reducedMotion
                  ? "-10%"
                  : ["-10%", "108%", "108%"],
                opacity: reducedMotion
                  ? 0
                  : [0, 0.32, 0],
              }}
              transition={{
                duration: 7.5,
                repeat: Infinity,
                repeatDelay: 2.5,
                ease: "linear",
              }}
              className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E7C57D]/70 to-transparent"
            />

            {/* FRAME */}

            <div className="pointer-events-none absolute inset-5 border border-white/[0.055] sm:inset-7">
              <span className="absolute left-[-1px] top-[-1px] h-11 w-11 border-l border-t border-[#C69A45]/45" />

              <span className="absolute right-[-1px] top-[-1px] h-11 w-11 border-r border-t border-white/[0.07]" />

              <span className="absolute bottom-[-1px] left-[-1px] h-11 w-11 border-b border-l border-white/[0.055]" />

              <span className="absolute bottom-[-1px] right-[-1px] h-11 w-11 border-b border-r border-[#C69A45]/22" />
            </div>

            {/* TOP DATA */}

            <div className="absolute inset-x-7 top-7 flex items-center justify-between select-none sm:inset-x-10 sm:top-10">
              <div className="flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5">
                  <motion.span
                    animate={
                      reducedMotion
                        ? undefined
                        : {
                            scale: [1, 1.9, 1],
                            opacity: [0.5, 0.08, 0.5],
                          }
                    }
                    transition={{
                      duration: 2.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 rounded-full bg-[#C69A45]"
                  />

                  <span className="relative m-auto h-1 w-1 rounded-full bg-[#C69A45]" />
                </span>

                <span className="text-[8px] font-semibold uppercase tracking-[0.34em] text-[#C69A45]">
                  {String(activeIndex + 1).padStart(2, "0")}
                </span>
              </div>

              <span className="text-[7px] uppercase tracking-[0.32em] text-white/25">
                {statusShortLabels[activeProject.status]}
              </span>
            </div>

            {/* CHARACTER ENTRY */}

            {primaryCharacter ? (
              <motion.div
                key={`${activeProject.id}-character`}
                initial={{
                  opacity: 0,
                  x: 18,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute right-7 top-28 hidden w-[160px] sm:block sm:right-10"
              >
                <Link
                  href={`/likovi/${primaryCharacter.slug}`}
                  className="group block border border-white/[0.09] bg-black/25 backdrop-blur-md"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={primaryCharacter.image}
                      alt={primaryCharacter.name}
                      className="h-full w-full object-cover grayscale-[0.15] opacity-72 transition duration-700 ease-out group-hover:scale-[1.045] group-hover:opacity-100"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                    <div className="absolute inset-x-4 top-4 flex items-center justify-between select-none">
                      <span className="font-mono text-[6px] uppercase tracking-[0.28em] text-white/35">
                        CHARACTER
                      </span>

                      <ArrowUpRight
                        size={12}
                        strokeWidth={1.2}
                        className="text-white/30 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#C69A45]"
                      />
                    </div>

                    <div className="absolute inset-x-4 bottom-4">
                      <div className="text-lg font-[430] tracking-[-0.03em] text-white">
                        {primaryCharacter.name}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ) : null}

            {/* MAIN INFORMATION */}

            <motion.div
              key={activeProject.id}
              initial={{
                opacity: 0,
                y: 26,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.68,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute inset-x-7 bottom-10 sm:inset-x-10 sm:bottom-10"
            >
              <div className="mb-5 flex items-center gap-3 select-none">
                <span className="text-[7px] uppercase tracking-[0.32em] text-[#C69A45]">
                  {activeProject.type}
                </span>

                <span className="h-px w-7 bg-white/15" />

                <span className="text-[7px] uppercase tracking-[0.32em] text-white/28">
                  {activeProject.platform}
                </span>
              </div>

              <motion.h3
                style={{
                  x: titleX,
                  y: titleY,
                }}
                className="select-none max-w-5xl text-[clamp(3.1rem,6.5vw,7.2rem)] font-[430] uppercase leading-[0.84] tracking-[-0.068em] text-white"
              >
                {activeProject.title}
              </motion.h3>

              <div className="mt-7 flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
                <p className="max-w-lg text-[13px] leading-7 text-white/42 sm:text-[14px]">
                  {activeProject.shortDescription}
                </p>

                <Link
                  href={`/serije/${activeProject.slug}`}
                  className="group inline-flex h-11 shrink-0 items-center gap-3 border border-[#C69A45]/45 bg-black/20 px-5 text-[8px] font-semibold uppercase tracking-[0.25em] text-[#E2BE72] backdrop-blur-md transition-all duration-300 hover:border-[#C69A45] hover:bg-[#C69A45]/[0.08]"
                >
                  Enter world

                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.2}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            </motion.div>

            {/* BOTTOM SIGNAL */}

            <div className="absolute inset-x-7 bottom-4 sm:inset-x-10">
              <div className="umbra-system-line" />

              <div className="mt-3 flex items-center justify-between select-none">
                <div className="flex items-center gap-3">
                  <ScanLine className="h-3.5 w-3.5 text-[#C69A45]/35" />

                  <span className="font-mono text-[6px] uppercase tracking-[0.3em] text-white/18">
                    UMBRA / CINEMATIC INDEX
                  </span>
                </div>

                <span className="font-mono text-[7px] tracking-[0.2em] text-white/18">
                  {String(activeIndex + 1).padStart(2, "0")} /{" "}
                  {String(projectsForDisplay.length).padStart(2, "0")}
                </span>
              </div>

              <div className="mt-3 h-px w-full overflow-hidden bg-white/[0.05]">
                <motion.div
                  key={activeProject.id}
                  initial={{
                    width: "0%",
                  }}
                  animate={{
                    width: reducedMotion ? "100%" : "100%",
                  }}
                  transition={{
                    duration: reducedMotion ? 0 : 7.2,
                    ease: "linear",
                  }}
                  className="h-full bg-[#C69A45]/45"
                />
              </div>
            </div>
          </motion.div>

          {/* INDEX */}

          <motion.aside
            initial={{
              opacity: 0,
              x: 22,
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
              delay: 0.17,
              duration: 0.82,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-col border border-white/[0.07] bg-black/20 p-5 backdrop-blur-xl"
          >
            <div className="mb-7 flex items-center justify-between select-none">
              <div>
                <div className="text-[7px] uppercase tracking-[0.35em] text-[#C69A45]">
                  INDEX
                </div>

                <div className="mt-2 text-[10px] uppercase tracking-[0.2em] text-white/18">
                  Active worlds
                </div>
              </div>

              <Layers3 className="h-4 w-4 text-white/15" />
            </div>

            <div className="space-y-2">
              {projectsForDisplay.map((project, index) => {
                const active = index === activeIndex;

                return (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={[
                      "group relative w-full overflow-hidden border px-4 py-5 text-left transition-all duration-500",
                      active
                        ? "border-[#C69A45]/30 bg-[#C69A45]/[0.055]"
                        : "border-white/[0.055] bg-transparent hover:border-white/[0.13] hover:bg-white/[0.018]",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-4 select-none">
                      <div className="flex gap-4">
                        <span
                          className={[
                            "font-mono text-[7px] tracking-[0.2em]",
                            active
                              ? "text-[#C69A45]"
                              : "text-white/16",
                          ].join(" ")}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <div>
                          <div
                            className={[
                              "text-[12px] font-medium uppercase tracking-[-0.015em] transition-colors duration-300",
                              active
                                ? "text-white"
                                : "text-white/44 group-hover:text-white/72",
                            ].join(" ")}
                          >
                            {project.title}
                          </div>

                          <div className="mt-2 text-[7px] uppercase tracking-[0.25em] text-white/18">
                            {statusLabels[project.status]}
                          </div>
                        </div>
                      </div>

                      <ArrowRight
                        className={[
                          "h-4 w-4 shrink-0 transition-all duration-300",
                          active
                            ? "text-[#C69A45]"
                            : "-translate-x-1 text-white/10 group-hover:translate-x-0 group-hover:text-white/35",
                        ].join(" ")}
                      />
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
              })}
            </div>

            <div className="mt-auto pt-8">
              <div className="mb-4 flex items-center justify-between select-none">
                <span className="text-[7px] uppercase tracking-[0.28em] text-white/18">
                  Navigation
                </span>

                <span className="text-[7px] uppercase tracking-[0.22em] text-white/12">
                  Auto
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={goPrevious}
                  aria-label="Prethodni projekat"
                  className="group flex h-10 flex-1 items-center justify-center border border-white/[0.07] bg-black/20 text-white/28 transition-all duration-300 hover:border-[#C69A45]/30 hover:text-[#C69A45]"
                >
                  <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
                </button>

                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Sledeći projekat"
                  className="group flex h-10 flex-1 items-center justify-center border border-white/[0.07] bg-black/20 text-white/28 transition-all duration-300 hover:border-[#C69A45]/30 hover:text-[#C69A45]"
                >
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </button>
              </div>

              <Link
                href="/serije"
                className="group mt-3 flex h-11 items-center justify-between border border-white/[0.07] px-4 text-[7px] font-semibold uppercase tracking-[0.28em] text-white/30 transition-all duration-300 hover:border-white/[0.15] hover:text-white/68"
              >
                <span className="select-none">Full archive</span>

                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#C69A45]" />
              </Link>
            </div>
          </motion.aside>
        </div>

        {/* MINIMAL FOOTER */}

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
            delay: 0.6,
            duration: 0.8,
          }}
          className="mt-14 flex items-center justify-between border-t border-white/[0.055] pt-5 select-none"
        >
          <div className="flex items-center gap-3 text-[7px] uppercase tracking-[0.32em] text-white/[0.15]">
            <Clapperboard className="h-3.5 w-3.5 text-[#C69A45]/30" />

            <span>Umbra Studio</span>
          </div>

          <div className="hidden items-center gap-3 text-[7px] uppercase tracking-[0.28em] text-white/[0.14] sm:flex">
            <span>Scroll to explore</span>

            <ArrowDown className="h-3.5 w-3.5 text-[#C69A45]/35" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}