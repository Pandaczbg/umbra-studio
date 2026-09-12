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
import {
  useMemo,
  useRef,
} from "react";

import { projects } from "@/data/projects";
import type { Locale } from "@/data/translations";

const GOLD = "#c7a96b";
const GOLD_LIGHT = "#ead39a";
const EASE = [0.22, 1, 0.36, 1] as const;

const FALLBACK_IMAGE = "/umbra-background.png";
const AUTHOR_URL = "https://branislavbojcic.com/";

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

type ProjectsPreviewProps = {
  locale?: Locale;
};

const COPY = {
  sr: {
    eyebrow: "IZABRANI PROJEKTI",
    title: "Svetovi koje stvaramo.",
    archive: "Pogledaj celu arhivu",
    intro:
      "Izabrani svetovi iz univerzuma Umbra Studija.",
    project: "PROJEKAT",
    enter: "Otvori projekat",
    novel: "Po romanu",
    authorAria: "Otvori sajt autora",
    studioOriginal: "UMBRA ORIGINAL",
    home: "Umbra Studio",
  },
  en: {
    eyebrow: "SELECTED PROJECTS",
    title: "Worlds we create.",
    archive: "View full archive",
    intro:
      "Selected worlds from the Umbra Studio universe.",
    project: "PROJECT",
    enter: "Open project",
    novel: "Novel by",
    authorAria: "Open author's website",
    studioOriginal: "UMBRA ORIGINAL",
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

export default function ProjectsPreview({
  locale = "sr",
}: ProjectsPreviewProps) {
  const reducedMotion = useReducedMotion() ?? false;
  const isEnglish = locale === "en";
  const copy = COPY[locale];

  const sectionRef = useRef<HTMLElement | null>(null);

  const inView = useInView(sectionRef, {
    once: true,
    amount: 0.12,
  });

  const visibleProjects = useMemo(
    () => projects.filter(Boolean),
    [],
  );

  const statusLabels = isEnglish
    ? STATUS_EN
    : STATUS_SR;

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

  if (!visibleProjects.length) {
    return null;
  }

  return (
    <section
      id="projects"
      ref={sectionRef}
      aria-labelledby="projects-preview-title"
      data-umbra-scene="projects"
      className="relative overflow-hidden border-b border-white/[0.055] bg-[#030303] py-20 sm:py-24 lg:py-28"
    >
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div
          className="absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage: `url(${FALLBACK_IMAGE})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            filter:
              "grayscale(1) blur(18px) contrast(.76)",
            transform: "scale(1.04)",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #030303 0%, rgba(3,3,3,.90) 20%, rgba(3,3,3,.96) 80%, #030303 100%)",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 34%, rgba(199,169,107,.045), transparent 42%)",
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
            y: reducedMotion ? 0 : 12,
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
            duration: reducedMotion ? 0 : 0.72,
            ease: EASE,
          }}
          className="mb-10 flex flex-col gap-6 sm:mb-12 lg:mb-14 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-4xl">
            <div className="mb-4 flex items-center gap-4">
              <span
                className="text-[8px] font-semibold uppercase tracking-[0.32em]"
                style={{
                  color: `${GOLD_LIGHT}78`,
                }}
              >
                {copy.eyebrow}
              </span>

              <span
                aria-hidden="true"
                className="h-px w-10"
                style={{
                  background: `${GOLD}2e`,
                }}
              />

              <span className="font-mono text-[7px] uppercase tracking-[0.22em] text-white/[0.17]">
                {String(
                  visibleProjects.length,
                ).padStart(2, "0")}
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
                id="projects-preview-title"
                className="text-[clamp(2.8rem,6vw,6.5rem)] font-[430] leading-[0.84] tracking-[-0.07em] text-[#F1EDE4] transition-[color,transform] duration-500 group-hover:-translate-y-[2px] group-hover:text-white"
              >
                {copy.title}
              </h2>

              <span className="mt-5 inline-flex items-center gap-3 text-[8px] font-semibold uppercase tracking-[0.28em]">
                <span
                  className="transition-colors duration-300 group-hover:text-white"
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
          className={[
            "grid gap-6",
            visibleProjects.length >= 3
              ? "sm:grid-cols-2 xl:grid-cols-3"
              : "sm:grid-cols-2",
          ].join(" ")}
        >
          {visibleProjects.map(
            (project, index) => {
              const projectHref =
                hrefForProject(
                  project.slug,
                );

              const imageSrc =
                resolveProjectImage(
                  project,
                  locale,
                );

              const hasBook =
                Boolean(project.book);

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
                    delay:
                      reducedMotion
                        ? 0
                        : 0.08 +
                          index * 0.09,
                    duration:
                      reducedMotion
                        ? 0
                        : 0.76,
                    ease: EASE,
                  }}
                  className="group flex min-w-0 flex-col overflow-hidden border border-white/[0.075] bg-[#070707]"
                >
                  {/* Visual portal */}
                  <Link
                    href={projectHref}
                    aria-label={
                      isEnglish
                        ? `Open ${project.title}`
                        : `Otvori ${project.title}`
                    }
                    className="group/media relative block aspect-[16/11] min-h-[300px] overflow-hidden outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#ead39a]/75 sm:min-h-[330px] lg:min-h-[360px]"
                  >
                    <Image
                      src={imageSrc}
                      alt={project.title}
                      fill
                      sizes={
                        visibleProjects.length >= 3
                          ? "(min-width: 1280px) 31vw, (min-width: 640px) 48vw, 92vw"
                          : "(min-width: 640px) 48vw, 92vw"
                      }
                      className="object-cover transition-transform duration-[1100ms] ease-out group-hover/media:scale-[1.035]"
                    />

                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-black/[0.26]"
                    />

                    <div
                      aria-hidden="true"
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(0,0,0,.04) 0%, rgba(0,0,0,.02) 36%, rgba(0,0,0,.78) 100%)",
                      }}
                    />

                    <div
                      aria-hidden="true"
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(0,0,0,.38) 0%, transparent 64%, rgba(0,0,0,.18) 100%)",
                      }}
                    />

                    {/* Quiet cinematic frame */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-4 border border-white/[0.06] sm:inset-5"
                    >
                      <span
                        className="absolute -left-px -top-px h-10 w-10 border-l border-t"
                        style={{
                          borderColor: `${GOLD}38`,
                        }}
                      />

                      <span className="absolute -right-px -top-px h-8 w-8 border-r border-t border-white/[0.055]" />

                      <span className="absolute -bottom-px -left-px h-8 w-8 border-b border-l border-white/[0.045]" />

                      <span
                        className="absolute -bottom-px -right-px h-10 w-10 border-b border-r"
                        style={{
                          borderColor: `${GOLD}20`,
                        }}
                      />
                    </div>

                    <div className="absolute inset-x-6 top-6 flex items-center justify-between sm:inset-x-8 sm:top-8">
                      <span
                        className="text-[8px] font-semibold uppercase tracking-[0.28em]"
                        style={{
                          color: `${GOLD_LIGHT}8c`,
                        }}
                      >
                        {copy.project}{" "}
                        {String(
                          index + 1,
                        ).padStart(2, "0")}
                      </span>

                      <span className="text-[7px] uppercase tracking-[0.24em] text-white/[0.28]">
                        {
                          isEnglish
                            ? STATUS_EN[
                                project.status
                              ]
                            : STATUS_SR[
                                project.status
                              ]
                        }
                      </span>
                    </div>

                    <div className="absolute inset-x-6 bottom-6 sm:inset-x-8 sm:bottom-8">
                      <div className="flex items-end justify-between gap-6">
                        <div className="max-w-[82%]">
                          <p
                            className="mb-3 text-[8px] font-semibold uppercase tracking-[0.28em]"
                            style={{
                              color: `${GOLD_LIGHT}8c`,
                            }}
                          >
                            {project.type}
                          </p>

                          <h3 className="text-[clamp(2.25rem,4.2vw,4.5rem)] font-[430] uppercase leading-[0.84] tracking-[-0.065em] text-white">
                            {project.title}
                          </h3>
                        </div>

                        <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/[0.13] bg-black/20 text-white/[0.48] backdrop-blur-sm transition-[border-color,color,transform,background-color] duration-300 group-hover/media:-translate-y-0.5 group-hover/media:border-[#ead39a]/45 group-hover/media:bg-black/30 group-hover/media:text-[#ead39a]">
                          <ArrowUpRight
                            aria-hidden="true"
                            className="h-4 w-4"
                            strokeWidth={1.15}
                          />
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Supporting project information */}
                  <div className="flex flex-1 flex-col px-6 py-6 sm:px-8 sm:py-7">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      <span
                        className="text-[7px] font-semibold uppercase tracking-[0.28em]"
                        style={{
                          color: `${GOLD_LIGHT}78`,
                        }}
                      >
                        {project.platform}
                      </span>

                      {hasBook &&
                      project.book ? (
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
                            className="inline-flex max-w-full items-center gap-2 rounded-sm outline-none transition-[color,transform] duration-300 hover:translate-x-0.5 focus-visible:ring-1 focus-visible:ring-[#ead39a]/65"
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

                            <span>
                              {copy.studioOriginal}
                            </span>
                          </span>
                        </>
                      )}
                    </div>

                    <Link
                      href={projectHref}
                      className="group/title mt-5 block w-fit max-w-full rounded-sm outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/70"
                    >
                      <span className="inline-flex items-center gap-2 text-[8px] font-semibold uppercase tracking-[0.24em]">
                        <span
                          style={{
                            color: `${GOLD_LIGHT}78`,
                          }}
                        >
                          {copy.enter}
                        </span>

                        <ArrowUpRight
                          aria-hidden="true"
                          className="h-3.5 w-3.5 transition-transform duration-300 group-hover/title:-translate-y-0.5 group-hover/title:translate-x-0.5"
                          style={{
                            color: `${GOLD_LIGHT}58`,
                          }}
                        />
                      </span>
                    </Link>

                    <p className="mt-4 max-w-[560px] text-[10px] leading-5 text-white/[0.30] sm:text-[11px]">
                      {project.shortDescription}
                    </p>

                    <div className="mt-6 flex items-end justify-between gap-5 border-t border-white/[0.055] pt-4">
                      <div className="min-w-0">
                        <span className="block text-[7px] uppercase tracking-[0.23em] text-white/[0.20]">
                          {
                            statusLabels[
                              project.status
                            ]
                          }
                        </span>
                      </div>

                      <Link
                        href={projectHref}
                        className="group/cta inline-flex shrink-0 items-center gap-2 rounded-sm text-[7px] font-semibold uppercase tracking-[0.22em] outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/60"
                        style={{
                          color: `${GOLD_LIGHT}88`,
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
              );
            },
          )}
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
            delay: reducedMotion ? 0 : 0.30,
            duration: reducedMotion ? 0 : 0.55,
            ease: EASE,
          }}
          className="mt-9 flex flex-col gap-4 border-t border-white/[0.055] pt-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <Link
            href={archiveHref}
            className="group inline-flex w-fit items-center gap-3 rounded-sm text-[7px] font-semibold uppercase tracking-[0.28em] outline-none transition-[color,transform] duration-300 hover:translate-x-0.5 hover:text-white/[0.48] focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
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
            className="group inline-flex w-fit items-center gap-3 rounded-sm text-[7px] uppercase tracking-[0.28em] outline-none transition-[color,transform] duration-300 hover:translate-x-0.5 hover:text-white/[0.42] focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
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
            `linear-gradient(90deg, transparent, ${GOLD}20, ${GOLD_LIGHT}0d, transparent)`,
        }}
      />
    </section>
  );
}