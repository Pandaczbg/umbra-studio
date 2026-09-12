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
import { useMemo, useRef } from "react";

import { projects } from "@/data/projects";
import type { Locale } from "@/data/translations";

const GOLD = "#c7a96b";
const GOLD_LIGHT = "#ead39a";

const FALLBACK_IMAGE = "/umbra-background.png";
const AUTHOR_URL = "https://branislavbojcic.com/";

const EASE = [0.22, 1, 0.36, 1] as const;

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
    eyebrow: "TRENUTNO",
    title: "Svet koji sada stvaramo.",
    intro:
      "Jedan projekat je trenutno u središtu Umbra Studija. Ostali svetovi rastu uz njega.",
    archive: "Pogledaj sve projekte",
    enter: "Uđi u svet",
    novel: "Po romanu",
    authorAria: "Otvori sajt Branislava Bojčića",
    original: "UMBRA ORIGINAL",
    project: "PROJEKAT",
    home: "Umbra Studio",
  },
  en: {
    eyebrow: "CURRENTLY",
    title: "The world we are creating now.",
    intro:
      "One project currently sits at the heart of Umbra Studio. Other worlds grow alongside it.",
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
  const reducedMotion = useReducedMotion() ?? false;
  const isEnglish = locale === "en";
  const copy = COPY[locale];

  const sectionRef = useRef<HTMLElement | null>(null);

  const inView = useInView(sectionRef, {
    once: true,
    amount: 0.10,
  });

  const orderedProjects = useMemo(
    () =>
      projects
        .filter(Boolean)
        .slice()
        .sort((a, b) => {
          if (a.featured === b.featured) {
            return 0;
          }

          return a.featured ? -1 : 1;
        }),
    [],
  );

  const activeProject = orderedProjects[0];

  const secondaryProjects = orderedProjects.slice(1);

  const archiveHref = isEnglish
    ? "/en/projects"
    : "/serije";

  const homeHref = isEnglish
    ? "/en"
    : "/";

  const hrefForProject = (slug: string) =>
    isEnglish
      ? `/en/projects/${slug}`
      : `/serije/${slug}`;

  const statusLabels = isEnglish
    ? STATUS_EN
    : STATUS_SR;

  if (!activeProject) {
    return null;
  }

  const activeImage = resolveProjectImage(
    activeProject,
    locale,
  );

  return (
    <section
      id="current-project"
      ref={sectionRef}
      data-umbra-scene="project"
      aria-labelledby="current-project-title"
      className="relative overflow-hidden border-b border-white/[0.055] bg-[#030303] py-20 sm:py-24 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div
          className="absolute inset-0 opacity-[0.075]"
          style={{
            backgroundImage: `url(${activeImage})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            filter:
              "grayscale(1) blur(22px) contrast(.72)",
            transform: "scale(1.045)",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #030303 0%, rgba(3,3,3,.76) 23%, rgba(3,3,3,.92) 72%, #030303 100%)",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 68% 40%, rgba(199,169,107,.055), transparent 38%)",
          }}
        />

        <div className="absolute inset-0 umbra-noise opacity-[0.045]" />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            `linear-gradient(90deg, transparent, ${GOLD}28, transparent)`,
        }}
      />

      <div className="relative mx-auto max-w-[1480px] px-6 sm:px-9 lg:px-12 xl:px-16">
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
          className="mb-10 flex flex-col gap-6 sm:mb-12 lg:mb-14 lg:flex-row lg:items-end lg:justify-between"
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
                {statusLabels[activeProject.status]}
              </span>
            </div>

            <Link
              href={archiveHref}
              aria-label={
                isEnglish
                  ? "Open all projects"
                  : "Otvori sve projekte"
              }
              className="group block w-fit rounded-sm outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/65"
            >
              <h2
                id="current-project-title"
                className="max-w-5xl text-[clamp(2.8rem,6vw,6.6rem)] font-[430] leading-[0.84] tracking-[-0.07em] text-[#F1EDE4] transition-[color,transform] duration-500 group-hover:-translate-y-[2px] group-hover:text-white"
              >
                {copy.title}
              </h2>

              <span className="mt-5 inline-flex items-center gap-3 text-[8px] font-semibold uppercase tracking-[0.28em]">
                <span
                  style={{
                    color: `${GOLD_LIGHT}a8`,
                  }}
                >
                  {copy.archive}
                </span>

                <ArrowUpRight
                  aria-hidden="true"
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  style={{
                    color: `${GOLD_LIGHT}70`,
                  }}
                />
              </span>
            </Link>
          </div>

          <p className="max-w-[390px] text-[11px] leading-6 text-white/[0.30] lg:pb-1 lg:text-right">
            {copy.intro}
          </p>
        </motion.header>

        <div
          className={
            secondaryProjects.length > 0
              ? "grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(300px,.55fr)]"
              : "grid"
          }
        >
          <motion.article
            initial={{
              opacity: 0,
              y: reducedMotion ? 0 : 20,
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
              delay: reducedMotion ? 0 : 0.08,
              duration: reducedMotion ? 0 : 0.78,
              ease: EASE,
            }}
            className="group flex min-w-0 flex-col overflow-hidden border border-white/[0.08] bg-[#070707]"
          >
            <Link
              href={hrefForProject(activeProject.slug)}
              aria-label={
                isEnglish
                  ? `Open ${activeProject.title}`
                  : `Otvori ${activeProject.title}`
              }
              className="group/visual relative block min-h-[420px] overflow-hidden outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#ead39a]/75 sm:min-h-[500px] lg:min-h-[610px]"
            >
              <Image
                src={activeImage}
                alt={activeProject.title}
                fill
                sizes="(min-width: 1024px) 62vw, 94vw"
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover/visual:scale-[1.035]"
                priority
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
                    "linear-gradient(180deg, rgba(0,0,0,.04) 0%, rgba(0,0,0,.02) 32%, rgba(0,0,0,.80) 100%)",
                }}
              />

              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(0,0,0,.46) 0%, transparent 68%, rgba(0,0,0,.16) 100%)",
                }}
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-5 border border-white/[0.065] sm:inset-7"
              >
                <span
                  className="absolute -left-px -top-px h-12 w-12 border-l border-t"
                  style={{
                    borderColor: `${GOLD}42`,
                  }}
                />

                <span className="absolute -right-px -top-px h-10 w-10 border-r border-t border-white/[0.06]" />

                <span className="absolute -bottom-px -left-px h-10 w-10 border-b border-l border-white/[0.045]" />

                <span
                  className="absolute -bottom-px -right-px h-12 w-12 border-b border-r"
                  style={{
                    borderColor: `${GOLD}22`,
                  }}
                />
              </div>

              <div className="absolute left-7 top-7 right-7 flex items-center justify-between sm:left-9 sm:right-9 sm:top-9">
                <span
                  className="text-[8px] font-semibold uppercase tracking-[0.30em]"
                  style={{
                    color: `${GOLD_LIGHT}92`,
                  }}
                >
                  {copy.project} 01
                </span>

                <span className="text-[7px] uppercase tracking-[0.24em] text-white/[0.30]">
                  {statusLabels[activeProject.status]}
                </span>
              </div>

              <div className="absolute inset-x-7 bottom-7 sm:inset-x-9 sm:bottom-9">
                <div className="flex items-end justify-between gap-8">
                  <div className="max-w-[78%]">
                    <p
                      className="mb-3 text-[8px] font-semibold uppercase tracking-[0.28em]"
                      style={{
                        color: `${GOLD_LIGHT}88`,
                      }}
                    >
                      {activeProject.type}
                    </p>

                    <h3 className="text-[clamp(2.7rem,6vw,7rem)] font-[430] uppercase leading-[0.82] tracking-[-0.075em] text-white">
                      {activeProject.title}
                    </h3>
                  </div>

                  <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-white/[0.14] bg-black/20 text-white/[0.50] backdrop-blur-sm transition-[border-color,color,transform,background-color] duration-300 group-hover/visual:-translate-y-0.5 group-hover/visual:border-[#ead39a]/45 group-hover/visual:bg-black/30 group-hover/visual:text-[#ead39a] sm:h-14 sm:w-14">
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-4.5 w-4.5"
                      strokeWidth={1.1}
                    />
                  </span>
                </div>
              </div>
            </Link>

            <div className="flex flex-1 flex-col px-6 py-6 sm:px-8 sm:py-8">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span
                  className="text-[7px] font-semibold uppercase tracking-[0.27em]"
                  style={{
                    color: `${GOLD_LIGHT}78`,
                  }}
                >
                  {activeProject.platform}
                </span>

                {activeProject.book ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="h-px w-6 bg-white/[0.10]"
                    />

                    <a
                      href={AUTHOR_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${copy.authorAria}: ${activeProject.book.author}`}
                      className="inline-flex max-w-full items-center gap-2 rounded-sm outline-none transition-[color,transform] duration-300 hover:translate-x-0.5 focus-visible:ring-1 focus-visible:ring-[#ead39a]/65"
                      style={{
                        color: `${GOLD_LIGHT}a8`,
                      }}
                    >
                      <span className="truncate text-[7px] font-semibold uppercase tracking-[0.18em]">
                        {copy.novel}{" "}
                        {activeProject.book.author}
                      </span>

                      <ArrowUpRight
                        aria-hidden="true"
                        className="h-3 w-3 shrink-0"
                      />
                    </a>
                  </>
                ) : (
                  <>
                    <span
                      aria-hidden="true"
                      className="h-px w-6 bg-white/[0.09]"
                    />

                    <span
                      className="inline-flex items-center gap-2 text-[7px] font-semibold uppercase tracking-[0.18em]"
                      style={{
                        color: `${GOLD_LIGHT}55`,
                      }}
                    >
                      <Clapperboard
                        aria-hidden="true"
                        className="h-3 w-3"
                      />

                      <span>{copy.original}</span>
                    </span>
                  </>
                )}
              </div>

              <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <p className="max-w-2xl text-[11px] leading-6 text-white/[0.34] sm:text-[12px] sm:leading-7">
                  {activeProject.shortDescription}
                </p>

                <Link
                  href={hrefForProject(activeProject.slug)}
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
          </motion.article>

          {secondaryProjects.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              {secondaryProjects.map(
                (project, index) => {
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
                        y: reducedMotion ? 0 : 20,
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
                          : 0.18 +
                            index * 0.08,
                        duration: reducedMotion
                          ? 0
                          : 0.72,
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
                        className="group/secondary relative block aspect-[16/10] min-h-[220px] overflow-hidden outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#ead39a]/70 lg:aspect-auto lg:h-[280px]"
                      >
                        <Image
                          src={projectImage}
                          alt={project.title}
                          fill
                          sizes="(min-width: 1024px) 34vw, 90vw"
                          className="object-cover transition-transform duration-[1000ms] ease-out group-hover/secondary:scale-[1.035]"
                        />

                        <div
                          aria-hidden="true"
                          className="absolute inset-0 bg-black/[0.28]"
                        />

                        <div
                          aria-hidden="true"
                          className="absolute inset-0"
                          style={{
                            background:
                              "linear-gradient(180deg, rgba(0,0,0,.04) 0%, rgba(0,0,0,.76) 100%)",
                          }}
                        />

                        <div className="absolute inset-x-5 bottom-5 sm:inset-x-6 sm:bottom-6">
                          <p
                            className="mb-2 text-[7px] font-semibold uppercase tracking-[0.27em]"
                            style={{
                              color: `${GOLD_LIGHT}7e`,
                            }}
                          >
                            {project.type}
                          </p>

                          <div className="flex items-end justify-between gap-5">
                            <h3 className="text-[clamp(1.8rem,3.2vw,3rem)] font-[430] uppercase leading-[0.84] tracking-[-0.06em] text-white">
                              {project.title}
                            </h3>

                            <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/[0.12] bg-black/20 text-white/[0.42] backdrop-blur-sm transition-[border-color,color,transform] duration-300 group-hover/secondary:-translate-y-0.5 group-hover/secondary:border-[#ead39a]/40 group-hover/secondary:text-[#ead39a]">
                              <ArrowUpRight
                                aria-hidden="true"
                                className="h-3.5 w-3.5"
                                strokeWidth={1.1}
                              />
                            </span>
                          </div>
                        </div>
                      </Link>

                      <div className="flex flex-1 flex-col px-5 py-5 sm:px-6 sm:py-6">
                        <div className="flex items-center justify-between gap-4">
                          <span
                            className="text-[7px] font-semibold uppercase tracking-[0.24em]"
                            style={{
                              color: `${GOLD_LIGHT}70`,
                            }}
                          >
                            {statusLabels[
                              project.status
                            ]}
                          </span>

                          <span className="text-[7px] uppercase tracking-[0.23em] text-white/[0.19]">
                            {project.platform}
                          </span>
                        </div>

                        <p className="mt-4 line-clamp-3 text-[10px] leading-5 text-white/[0.29]">
                          {project.shortDescription}
                        </p>

                        <div className="mt-5 pt-1">
                          <Link
                            href={hrefForProject(
                              project.slug,
                            )}
                            className="group/link inline-flex items-center gap-2 rounded-sm text-[7px] font-semibold uppercase tracking-[0.22em] outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/60"
                            style={{
                              color: `${GOLD_LIGHT}82`,
                            }}
                          >
                            <span>{copy.enter}</span>

                            <ArrowUpRight
                              aria-hidden="true"
                              className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                            />
                          </Link>
                        </div>
                      </div>
                    </motion.article>
                  );
                },
              )}

              <Link
                href={archiveHref}
                className="group hidden items-center justify-between border-t border-white/[0.055] pt-4 outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/60 lg:flex"
              >
                <span
                  className="text-[7px] font-semibold uppercase tracking-[0.28em]"
                  style={{
                    color: `${GOLD_LIGHT}62`,
                  }}
                >
                  {copy.archive}
                </span>

                <ArrowUpRight
                  aria-hidden="true"
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  style={{
                    color: `${GOLD_LIGHT}55`,
                  }}
                />
              </Link>
            </div>
          ) : null}
        </div>

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
            delay: reducedMotion ? 0 : 0.34,
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
          background:
            `linear-gradient(90deg, transparent, ${GOLD}1e, ${GOLD_LIGHT}0d, transparent)`,
        }}
      />
    </section>
  );
}