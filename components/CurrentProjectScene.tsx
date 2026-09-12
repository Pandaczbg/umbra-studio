"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Clapperboard,
  Layers3,
} from "lucide-react";
import {
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { useRef } from "react";

import { projects } from "@/data/projects";
import type { Locale } from "@/data/translations";

const GOLD = "#c7a96b";
const GOLD_LIGHT = "#ead39a";
const FALLBACK_IMAGE = "/umbra-background.png";
const AUTHOR_URL = "https://branislavbojcic.com/";

const EASE = [
  0.22,
  1,
  0.36,
  1,
] as const;

const STATUS_SR = {
  "in-production": "U produkciji",
  development: "U razvoju",
  upcoming: "Uskoro",
} as const;

const STATUS_EN = {
  "in-production": "In production",
  development: "In development",
  upcoming: "Coming soon",
} as const;

type CurrentProjectSceneProps = {
  locale?: Locale;
};

const COPY = {
  sr: {
    eyebrow: "PROJEKTI",
    title: "Svet koji sada stvaramo",
    intro:
      "Svaki projekat je deo Umbra sveta. Ovde možeš upoznati njihove priče, likove i svetove.",
    archive: "Pogledaj sve projekte",
    enter: "Uđi u svet",
    novel: "Po romanu",
    authorAria: "Otvori sajt Branislava Bojčića",
    original: "UMBRA ORIGINAL",
    project: "PROJEKAT",
    home: "Umbra Studio",
  },

  en: {
    eyebrow: "PROJECTS",
    title: "The worlds we are creating",
    intro:
      "Every project is part of the Umbra universe. Explore their stories, characters and worlds.",
    archive: "Explore all projects",
    enter: "Enter world",
    novel: "Novel by",
    authorAria: "Open Branislav Bojčić's website",
    original: "UMBRA ORIGINAL",
    project: "PROJECT",
    home: "Umbra Studio",
  },
} as const;

function resolveProjectImage(
  project: (typeof projects)[number],
  locale: Locale,
) {
  if (locale === "en") {
    return (
      project.book?.coverEn ||
      project.book?.coverSr ||
      project.cover ||
      FALLBACK_IMAGE
    );
  }

  return (
    project.book?.coverSr ||
    project.book?.coverEn ||
    project.cover ||
    FALLBACK_IMAGE
  );
}

export default function CurrentProjectScene({
  locale = "sr",
}: CurrentProjectSceneProps) {
  const reducedMotion =
    useReducedMotion() ?? false;

  const isEnglish = locale === "en";
  const copy = COPY[locale];

  const sectionRef =
    useRef<HTMLElement | null>(null);

  const inView = useInView(sectionRef, {
    once: true,
    amount: 0.08,
  });

  const archiveHref = isEnglish
    ? "/en/projects"
    : "/serije";

  const homeHref = isEnglish
    ? "/en"
    : "/";

  const hrefForProject = (
    slug: string,
  ) =>
    isEnglish
      ? `/en/projects/${slug}`
      : `/serije/${slug}`;

  const statusLabels = isEnglish
    ? STATUS_EN
    : STATUS_SR;

  if (projects.length === 0) {
    return null;
  }

  return (
    <section
      id="current-project"
      ref={sectionRef}
      data-umbra-scene="project"
      aria-labelledby="projects-title"
      className="relative overflow-hidden border-b border-white/[0.055] bg-[#030303] py-20 sm:py-24 lg:py-28"
    >
      {/* ATMOSPHERE */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 8%, rgba(199,169,107,.045), transparent 34%), linear-gradient(180deg, #030303 0%, #050505 52%, #030303 100%)",
          }}
        />

        <div className="absolute inset-0 umbra-noise opacity-[0.04]" />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${GOLD}28, transparent)`,
        }}
      />

      <div className="relative mx-auto max-w-[1480px] px-6 sm:px-9 lg:px-12 xl:px-16">
        {/* HEADER */}
        <motion.header
          initial={{
            opacity: 0,
            y: reducedMotion ? 0 : 10,
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
            duration: reducedMotion ? 0 : 0.68,
            ease: EASE,
          }}
          className="mb-10 flex flex-col gap-7 border-b border-white/[0.055] pb-10 sm:mb-12 sm:pb-12 lg:mb-14 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-5xl">
            <div className="mb-4 flex items-center gap-4">
              <span
                className="text-[8px] font-semibold uppercase tracking-[0.32em]"
                style={{
                  color: `${GOLD_LIGHT}7e`,
                }}
              >
                {copy.eyebrow}
              </span>

              <span
                aria-hidden="true"
                className="h-px w-10"
                style={{
                  background: `${GOLD}2d`,
                }}
              />

              <span className="font-mono text-[7px] uppercase tracking-[0.22em] text-white/[0.17]">
                {String(projects.length).padStart(
                  2,
                  "0",
                )}{" "}
                {isEnglish
                  ? "WORLDS"
                  : "SVETA"}
              </span>
            </div>

            <h2
              id="projects-title"
              className="max-w-5xl text-[clamp(2.8rem,6vw,6.6rem)] font-[430] leading-[0.84] tracking-[-0.07em] text-[#f1ede4]"
            >
              {copy.title}
            </h2>
          </div>

          <div className="flex max-w-[410px] flex-col gap-5 lg:items-end lg:text-right">
            <p className="text-[11px] leading-6 text-white/[0.30]">
              {copy.intro}
            </p>

            <Link
              href={archiveHref}
              className="group inline-flex w-fit items-center gap-3 rounded-sm text-[8px] font-semibold uppercase tracking-[0.28em] outline-none transition-[color,transform] duration-300 hover:-translate-y-0.5 hover:text-white focus-visible:ring-1 focus-visible:ring-[#ead39a]/65"
              style={{
                color: `${GOLD_LIGHT}a8`,
              }}
            >
              <span>{copy.archive}</span>

              <ArrowUpRight
                aria-hidden="true"
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </motion.header>

        {/* EQUAL PROJECT GRID */}
        <div className="grid gap-5 md:grid-cols-2 xl:gap-6">
          {projects.map((project, index) => {
            const projectImage =
              resolveProjectImage(
                project,
                locale,
              );

            return (
              <motion.article
                key={project.id}
                initial={{
                  opacity: 0,
                  y: reducedMotion ? 0 : 22,
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
                  delay: reducedMotion
                    ? 0
                    : index * 0.08,
                  duration: reducedMotion ? 0 : 0.72,
                  ease: EASE,
                }}
                className="group flex min-w-0 flex-col overflow-hidden border border-white/[0.075] bg-[#070707]"
              >
                <Link
                  href={hrefForProject(
                    project.slug,
                  )}
                  aria-label={
                    isEnglish
                      ? `Open ${project.title}`
                      : `Otvori ${project.title}`
                  }
                  className="group/visual relative block aspect-[16/10] overflow-hidden outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#ead39a]/75 sm:aspect-[16/9]"
                >
                  <Image
                    src={projectImage}
                    alt={project.title}
                    fill
                    sizes="(min-width: 1280px) 48vw, (min-width: 768px) 48vw, 94vw"
                    className="object-cover transition-transform duration-[1100ms] ease-out group-hover/visual:scale-[1.035]"
                  />

                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-black/[0.20]"
                  />

                  <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,.06) 0%, rgba(0,0,0,.04) 36%, rgba(0,0,0,.82) 100%)",
                    }}
                  />

                  <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(0,0,0,.34) 0%, transparent 64%, rgba(0,0,0,.16) 100%)",
                    }}
                  />

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-5 border border-white/[0.065] sm:inset-7"
                  >
                    <span
                      className="absolute -left-px -top-px h-10 w-10 border-l border-t sm:h-12 sm:w-12"
                      style={{
                        borderColor: `${GOLD}42`,
                      }}
                    />

                    <span className="absolute -right-px -top-px h-9 w-9 border-r border-t border-white/[0.06]" />

                    <span className="absolute -bottom-px -left-px h-9 w-9 border-b border-l border-white/[0.045]" />

                    <span
                      className="absolute -bottom-px -right-px h-10 w-10 border-b border-r sm:h-12 sm:w-12"
                      style={{
                        borderColor: `${GOLD}22`,
                      }}
                    />
                  </div>

                  <div className="absolute left-6 right-6 top-6 flex items-center justify-between gap-5 sm:left-8 sm:right-8 sm:top-8">
                    <span
                      className="text-[8px] font-semibold uppercase tracking-[0.30em]"
                      style={{
                        color: `${GOLD_LIGHT}92`,
                      }}
                    >
                      {copy.project}{" "}
                      {String(index + 1).padStart(
                        2,
                        "0",
                      )}
                    </span>

                    <span className="text-[7px] uppercase tracking-[0.24em] text-white/[0.30]">
                      {
                        statusLabels[
                          project.status
                        ]
                      }
                    </span>
                  </div>

                  <div className="absolute inset-x-6 bottom-6 sm:inset-x-8 sm:bottom-8">
                    <div className="mb-3 flex items-center gap-3">
                      <span
                        className="text-[8px] font-semibold uppercase tracking-[0.27em]"
                        style={{
                          color: `${GOLD_LIGHT}82`,
                        }}
                      >
                        {project.type}
                      </span>

                      <span
                        aria-hidden="true"
                        className="h-px w-6 bg-white/[0.10]"
                      />

                      <span className="text-[7px] uppercase tracking-[0.22em] text-white/[0.28]">
                        {project.platform}
                      </span>
                    </div>

                    <div className="flex items-end justify-between gap-6">
                      <h3 className="max-w-[78%] text-[clamp(2.5rem,5vw,5.3rem)] font-[430] uppercase leading-[0.84] tracking-[-0.07em] text-white">
                        {project.title}
                      </h3>

                      <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/[0.13] bg-black/20 text-white/[0.46] backdrop-blur-sm transition-[border-color,color,transform,background-color] duration-300 group-hover/visual:-translate-y-0.5 group-hover/visual:border-[#ead39a]/45 group-hover/visual:bg-black/30 group-hover/visual:text-[#ead39a] sm:h-13 sm:w-13">
                        <ArrowUpRight
                          aria-hidden="true"
                          className="h-4 w-4"
                          strokeWidth={1.1}
                        />
                      </span>
                    </div>
                  </div>
                </Link>

                {/* SAME INFORMATION STRUCTURE FOR EVERY PROJECT */}
                <div className="flex flex-1 flex-col px-6 py-6 sm:px-8 sm:py-8">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    {project.book ? (
                      <>
                        <span
                          aria-hidden="true"
                          className="h-px w-6 bg-white/[0.10]"
                        />

                        <a
                          href={AUTHOR_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${copy.authorAria}: ${project.book.author}`}
                          className="group/author inline-flex max-w-full items-center gap-2 rounded-sm outline-none transition-[color,transform] duration-300 hover:translate-x-0.5 focus-visible:ring-1 focus-visible:ring-[#ead39a]/65"
                          style={{
                            color: `${GOLD_LIGHT}a8`,
                          }}
                        >
                          <span className="truncate text-[7px] font-semibold uppercase tracking-[0.18em]">
                            {copy.novel}{" "}
                            {project.book.author}
                          </span>

                          <ArrowUpRight
                            aria-hidden="true"
                            className="h-3 w-3 shrink-0"
                          />
                        </a>
                      </>
                    ) : (
                      <>
                        <Clapperboard
                          aria-hidden="true"
                          className="h-3 w-3"
                          style={{
                            color: `${GOLD_LIGHT}62`,
                          }}
                        />

                        <span
                          className="inline-flex items-center gap-2 text-[7px] font-semibold uppercase tracking-[0.18em]"
                          style={{
                            color: `${GOLD_LIGHT}78`,
                          }}
                        >
                          {copy.original}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="mt-5 flex flex-1 flex-col gap-5">
                    <p className="max-w-2xl text-[11px] leading-6 text-white/[0.34] sm:text-[12px] sm:leading-7">
                      {
                        project.shortDescription
                      }
                    </p>

                    <div className="mt-auto flex items-end justify-between gap-5 pt-2">
                      <div className="flex flex-col gap-2">
                        <span className="text-[7px] uppercase tracking-[0.20em] text-white/[0.20]">
                          {
                            statusLabels[
                              project.status
                            ]
                          }
                        </span>

                        <span
                          className="h-px w-8 transition-[width] duration-500 group-hover:w-14"
                          style={{
                            background: `${GOLD}55`,
                          }}
                        />
                      </div>

                      <Link
                        href={hrefForProject(
                          project.slug,
                        )}
                        className="group/cta inline-flex h-11 shrink-0 items-center gap-3 rounded-sm border px-5 text-[8px] font-semibold uppercase tracking-[0.24em] outline-none backdrop-blur-md transition-[border-color,color,transform,background-color] duration-300 hover:-translate-y-0.5 focus-visible:ring-1 focus-visible:ring-[#ead39a]/65"
                        style={{
                          borderColor: `${GOLD}42`,
                          background: `${GOLD}06`,
                          color: `${GOLD_LIGHT}c8`,
                        }}
                      >
                        <span>{copy.enter}</span>

                        <ArrowUpRight
                          aria-hidden="true"
                          className="h-3.5 w-3.5 transition-transform duration-300 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* FOOTER */}
        <motion.footer
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
            delay: reducedMotion ? 0 : 0.3,
            duration: reducedMotion ? 0 : 0.52,
            ease: EASE,
          }}
          className="mt-9 flex items-center justify-between border-t border-white/[0.055] pt-5"
        >
          <Link
            href={archiveHref}
            className="group inline-flex items-center gap-3 rounded-sm text-[7px] font-semibold uppercase tracking-[0.28em] outline-none transition-[color,transform] duration-300 hover:translate-x-0.5 hover:text-white/[0.48] focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
            style={{
              color: "rgba(255,255,255,.17)",
            }}
          >
            <Layers3
              aria-hidden="true"
              className="h-3.5 w-3.5"
              style={{
                color: `${GOLD}45`,
              }}
            />

            <span>{copy.archive}</span>

            <ArrowUpRight
              aria-hidden="true"
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              style={{
                color: `${GOLD_LIGHT}55`,
              }}
            />
          </Link>

          <Link
            href={homeHref}
            className="group hidden items-center gap-3 rounded-sm text-[7px] uppercase tracking-[0.28em] outline-none transition-[color,transform] duration-300 hover:translate-x-0.5 hover:text-white/[0.42] focus-visible:ring-1 focus-visible:ring-[#ead39a]/55 sm:flex"
            style={{
              color: "rgba(255,255,255,.13)",
            }}
          >
            <Clapperboard
              aria-hidden="true"
              className="h-3.5 w-3.5"
              style={{
                color: `${GOLD}40`,
              }}
            />

            <span>{copy.home}</span>
          </Link>
        </motion.footer>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-px w-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${GOLD}1e, ${GOLD_LIGHT}0d, transparent)`,
        }}
      />
    </section>
  );
}