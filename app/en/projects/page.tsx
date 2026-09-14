import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { getProjects } from "@/lib/content/queries";

import type { ProjectContent } from "@/lib/content/types";

export const metadata: Metadata = {
  title: "Projects — Umbra Studio",
  description:
    "Stories, worlds and productions from Umbra Studio — gathered in one place.",
  alternates: {
    canonical: "/en/projects",
  },
  openGraph: {
    title: "Projects — Umbra Studio",
    description:
      "Stories, worlds and productions from Umbra Studio — gathered in one place.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects — Umbra Studio",
    description:
      "Stories, worlds and productions from Umbra Studio — gathered in one place.",
  },
};

const GOLD = "#c7a96b";
const GOLD_LIGHT = "#ead39a";
const FALLBACK_IMAGE = "/umbra-background.png";

const STATUS_LABELS = {
  "in-production": "In production",
  development: "In development",
  upcoming: "Coming soon",
} as const;

function getStatusLabel(status: ProjectContent["status"]) {
  return STATUS_LABELS[status];
}

function getTypeLabel(type: ProjectContent["type"]) {
  switch (type) {
    case "Serija":
      return "Series";
    case "Film":
      return "Film";
    default:
      return "Project";
  }
}

function resolveProjectImage(project: ProjectContent) {
  return (
    project.source?.coverEn ??
    project.source?.coverSr ??
    FALLBACK_IMAGE
  );
}

function getProjectNumber(id: string) {
  const match = id.match(/(\d+)$/);

  return match?.[1]?.padStart(2, "0") ?? "00";
}

export default function EnglishProjectsPage() {
  const projects = getProjects();
  const projectCount = String(projects.length).padStart(2, "0");

  return (
    <main
      data-umbra-scene="projects-archive"
      className="min-h-screen overflow-x-clip bg-[#050505] text-[#eee9de]"
    >
      {/* ================================================================
          ARCHIVE INTRO
          Quiet editorial opening
          ================================================================ */}

      <section className="relative overflow-hidden border-b border-white/[0.055]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div
            className="absolute right-[8%] top-[8%] h-[520px] w-[520px] rounded-full"
            style={{
              background: `radial-gradient(circle, ${GOLD}08 0%, transparent 68%)`,
              filter: "blur(110px)",
            }}
          />

          <div
            className="absolute inset-x-0 bottom-0 h-64"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, rgba(255,255,255,.012) 100%)",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-[1360px] px-5 pb-20 pt-24 sm:px-8 sm:pb-24 sm:pt-28 lg:px-10 lg:pb-28 lg:pt-32">
          <div className="flex items-center justify-between gap-6 border-b border-white/[0.055] pb-5">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-px w-7"
                style={{
                  background: GOLD,
                }}
              />

              <span
                className="font-mono text-[7px] uppercase tracking-[0.28em]"
                style={{
                  color: `${GOLD_LIGHT}78`,
                }}
              >
                02
              </span>

              <span className="font-mono text-[7px] uppercase tracking-[0.28em] text-white/[0.38]">
                Projects
              </span>
            </div>

            <span className="hidden font-mono text-[6px] uppercase tracking-[0.28em] text-white/[0.16] sm:block">
              Umbra Studio / Archive
            </span>
          </div>

          <div className="mt-16 max-w-[1060px] lg:mt-20">
            <p className="font-mono text-[7px] uppercase tracking-[0.32em] text-white/[0.22]">
              The Umbra universe
            </p>

            <h1 className="mt-5 max-w-[1000px] text-[clamp(3.25rem,7vw,6.8rem)] font-[430] uppercase leading-[0.88] tracking-[-0.065em] text-[#f4f0e7]">
              Stories
              <span className="ml-2 font-serif font-normal italic text-white/[0.48]">
                in development
              </span>
            </h1>

            <div className="mt-8 max-w-[680px]">
              <p className="text-[14px] leading-7 text-white/[0.42] sm:text-[15px] sm:leading-8">
                Stories, worlds and productions from Umbra Studio — gathered in
                one place.
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/[0.055] pt-5">
            <span className="font-mono text-[7px] uppercase tracking-[0.28em] text-white/[0.22]">
              {projectCount} projects
            </span>

            <span
              aria-hidden="true"
              className="hidden h-px w-8 bg-white/[0.12] sm:block"
            />

            <span className="font-mono text-[7px] uppercase tracking-[0.28em] text-white/[0.18]">
              Umbra Studio
            </span>
          </div>
        </div>
      </section>

      {/* ================================================================
          PROJECT ARCHIVE
          Equal-weight editorial catalogue
          ================================================================ */}

      <section className="relative">
        <div className="mx-auto max-w-[1360px] px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
          <div className="mb-9 flex flex-col gap-5 border-b border-white/[0.055] pb-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-px w-7"
                  style={{
                    background: `${GOLD}b5`,
                  }}
                />

                <p
                  className="font-mono text-[7px] uppercase tracking-[0.3em]"
                  style={{
                    color: `${GOLD_LIGHT}78`,
                  }}
                >
                  Catalogue
                </p>
              </div>

              <h2 className="mt-4 text-[clamp(2.15rem,4vw,3.8rem)] font-[430] uppercase leading-[0.9] tracking-[-0.055em] text-white/[0.92]">
                Current
                <span className="ml-2 font-serif font-normal italic text-white/[0.45]">
                  worlds
                </span>
              </h2>
            </div>

            <span className="font-mono text-[7px] uppercase tracking-[0.26em] text-white/[0.18]">
              {projectCount} projects
            </span>
          </div>

          <div className="grid gap-px overflow-hidden border border-white/[0.07] bg-white/[0.07] md:grid-cols-2">
            {projects.map((project, index) => {
              const image = resolveProjectImage(project);
              const title = project.title.en;
              const description =
                project.shortDescription?.en ??
                project.description?.en ??
                "";
              const number = getProjectNumber(project.id);

              return (
                <Link
                  key={project.id}
                  href={`/en/projects/${project.slug}`}
                  aria-label={`Open ${title}`}
                  data-cursor-interactive
                  className="group block overflow-hidden bg-[#060606] outline-none transition-colors duration-500 hover:bg-[#090909] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#ead39a]/65"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={image}
                      alt={title}
                      fill
                      priority={index === 0}
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.025]"
                    />

                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-black/[0.16]"
                    />

                    <div
                      aria-hidden="true"
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(0,0,0,.02) 0%, rgba(0,0,0,.08) 45%, rgba(0,0,0,.76) 100%)",
                      }}
                    />

                    <div
                      aria-hidden="true"
                      className="absolute inset-x-5 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent sm:inset-x-6"
                    />

                    <div className="absolute inset-x-5 top-5 flex items-center justify-between gap-5 sm:inset-x-6 sm:top-6">
                      <span
                        className="font-mono text-[7px] uppercase tracking-[0.26em]"
                        style={{
                          color: `${GOLD_LIGHT}78`,
                        }}
                      >
                        {getTypeLabel(project.type)}
                      </span>

                      <span className="font-mono text-[7px] tracking-[0.22em] text-white/[0.25]">
                        {number}
                      </span>
                    </div>

                    <div className="absolute inset-x-5 bottom-5 sm:inset-x-6 sm:bottom-6">
                      <div className="flex items-end justify-between gap-5">
                        <div className="min-w-0">
                          <p className="mb-3 font-mono text-[7px] uppercase tracking-[0.23em] text-white/[0.34]">
                            {getStatusLabel(project.status)}
                          </p>

                          <h3 className="max-w-[720px] text-[clamp(2rem,4.2vw,4.4rem)] font-[430] uppercase leading-[0.84] tracking-[-0.06em] text-white">
                            {title}
                          </h3>
                        </div>

                        <span
                          aria-hidden="true"
                          className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/[0.15] bg-black/20 text-white/[0.42] backdrop-blur-sm transition-[border-color,color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:border-[#ead39a]/45 group-hover:text-[#ead39a]"
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 py-6 sm:px-6 sm:py-7">
                    <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-start">
                      <div>
                        <p className="max-w-[660px] text-[12px] leading-7 text-white/[0.38] sm:text-[13px] sm:leading-7">
                          {description}
                        </p>

                        {project.source ? (
                          <div className="mt-5 flex min-w-0 items-center gap-3">
                            <span
                              className="shrink-0 font-mono text-[7px] uppercase tracking-[0.2em]"
                              style={{
                                color: `${GOLD_LIGHT}70`,
                              }}
                            >
                              Source
                            </span>

                            <span
                              aria-hidden="true"
                              className="h-px w-6 shrink-0 bg-white/[0.1]"
                            />

                            <span className="truncate text-[8px] uppercase tracking-[0.16em] text-white/[0.26]">
                              {project.source.author ?? "Original work"}
                            </span>
                          </div>
                        ) : (
                          <div className="mt-5 font-mono text-[7px] uppercase tracking-[0.2em] text-white/[0.25]">
                            Umbra Original
                          </div>
                        )}
                      </div>

                      <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/[0.055] pt-5 lg:border-t-0 lg:border-l lg:pl-6 lg:pt-0">
                        <div>
                          <dt className="font-mono text-[6px] uppercase tracking-[0.23em] text-white/[0.17]">
                            Status
                          </dt>

                          <dd className="mt-1.5 text-[8px] uppercase tracking-[0.14em] text-white/[0.42]">
                            {getStatusLabel(project.status)}
                          </dd>
                        </div>

                        <div>
                          <dt className="font-mono text-[6px] uppercase tracking-[0.23em] text-white/[0.17]">
                            Platform
                          </dt>

                          <dd className="mt-1.5 text-[8px] uppercase tracking-[0.14em] text-white/[0.42]">
                            {project.platform ?? "Umbra Studio"}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    <div className="mt-7 flex items-center justify-between border-t border-white/[0.055] pt-4">
                      <span className="font-mono text-[7px] uppercase tracking-[0.24em] text-white/[0.17]">
                        Umbra Studio
                      </span>

                      <span
                        className="inline-flex min-h-8 items-center gap-2 font-mono text-[7px] uppercase tracking-[0.2em]"
                        style={{
                          color: `${GOLD_LIGHT}82`,
                        }}
                      >
                        Open project

                        <ArrowUpRight
                          aria-hidden="true"
                          className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* ============================================================
              ARCHIVE NAVIGATION
              ============================================================ */}

          <div className="mt-10 grid gap-px overflow-hidden border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2">
            <Link
              href="/en"
              data-cursor-interactive
              className="group flex min-h-[104px] items-center justify-between bg-[#060606] px-6 outline-none transition-colors duration-400 hover:bg-[#090909] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#ead39a]/65 sm:px-8"
            >
              <div>
                <p className="font-mono text-[7px] uppercase tracking-[0.26em] text-white/[0.18]">
                  Umbra Studio
                </p>

                <p className="mt-3 text-xl tracking-[-0.035em] text-white/[0.7]">
                  Home
                </p>
              </div>

              <ArrowLeft
                aria-hidden="true"
                className="h-5 w-5 text-white/[0.28] transition-[color,transform] duration-300 group-hover:-translate-x-1 group-hover:text-[#d6b776]"
              />
            </Link>

            <Link
              href="/en/characters"
              data-cursor-interactive
              className="group flex min-h-[104px] items-center justify-between bg-[#060606] px-6 outline-none transition-colors duration-400 hover:bg-[#090909] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#ead39a]/65 sm:px-8"
            >
              <div>
                <p className="font-mono text-[7px] uppercase tracking-[0.26em] text-white/[0.18]">
                  Archive
                </p>

                <p className="mt-3 text-xl tracking-[-0.035em] text-white/[0.7]">
                  Explore characters
                </p>
              </div>

              <ArrowUpRight
                aria-hidden="true"
                className="h-5 w-5 text-white/[0.28] transition-[color,transform] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#d6b776]"
              />
            </Link>
          </div>

          <p className="mt-6 text-right font-mono text-[6px] uppercase tracking-[0.24em] text-white/[0.13]">
            {projectCount} projects in the current catalogue
          </p>
        </div>
      </section>
    </main>
  );
}