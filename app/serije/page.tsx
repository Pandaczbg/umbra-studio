
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  SlidersHorizontal,
} from "lucide-react";

import { projects } from "@/data/projects";

const GOLD = "#c7a96b";
const GOLD_LIGHT = "#ead39a";
const FALLBACK_IMAGE = "/umbra-background.png";

type ProjectFilter = "all" | "original" | "adaptation" | "series";

type ProjectsPageProps = {
  searchParams?: Promise<{
    vrsta?: string;
    format?: string;
  }>;
};

function getStatusLabel(
  status: (typeof projects)[number]["status"],
) {
  switch (status) {
    case "in-production":
      return "U produkciji";
    case "development":
      return "U razvoju";
    case "upcoming":
      return "Uskoro";
    default:
      return status;
  }
}

function getTypeLabel(
  type: (typeof projects)[number]["type"],
) {
  switch (type) {
    case "Serija":
      return "Serija";
    case "Film":
      return "Film";
    default:
      return "Projekat";
  }
}

function getProjectImage(
  project: (typeof projects)[number],
) {
  return (
    project.book?.coverSr ||
    project.book?.coverEn ||
    project.cover ||
    FALLBACK_IMAGE
  );
}

function getProjectNumber(id: string) {
  const match = id.match(/(\d+)$/);

  return match?.[1]?.padStart(2, "0") ?? "00";
}

/**
 * Current data model does not need a second taxonomy field.
 *
 * - A project with a `book` is treated as an adaptation.
 * - A project without a `book` is treated as an original Umbra project.
 * - `type === "Serija"` is treated as a series filter.
 *
 * This keeps the archive connected directly to `data/projects.ts`
 * instead of duplicating category information inside the page.
 */
function matchesFilter(
  project: (typeof projects)[number],
  filter: ProjectFilter,
) {
  switch (filter) {
    case "original":
      return !project.book;

    case "adaptation":
      return Boolean(project.book);

    case "series":
      return project.type === "Serija";

    case "all":
    default:
      return true;
  }
}

function resolveFilter(
  vrsta?: string,
  format?: string,
): ProjectFilter {
  if (format === "serije") {
    return "series";
  }

  if (vrsta === "originalne") {
    return "original";
  }

  if (vrsta === "ekranizacije") {
    return "adaptation";
  }

  return "all";
}

function getFilterHref(filter: ProjectFilter) {
  switch (filter) {
    case "original":
      return "/serije?vrsta=originalne";

    case "adaptation":
      return "/serije?vrsta=ekranizacije";

    case "series":
      return "/serije?format=serije";

    case "all":
    default:
      return "/serije";
  }
}

function getFilterLabel(filter: ProjectFilter) {
  switch (filter) {
    case "original":
      return "Originalne priče";

    case "adaptation":
      return "Ekranizacije";

    case "series":
      return "Serije";

    case "all":
    default:
      return "Svi projekti";
  }
}

function getFilterCount(filter: ProjectFilter) {
  return projects.filter((project) =>
    matchesFilter(project, filter),
  ).length;
}

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const resolvedSearchParams = await searchParams;
  const activeFilter = resolveFilter(
    resolvedSearchParams?.vrsta,
    resolvedSearchParams?.format,
  );

  const visibleProjects = projects.filter((project) =>
    matchesFilter(project, activeFilter),
  );

  const filters: ProjectFilter[] = [
    "all",
    "original",
    "adaptation",
    "series",
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[#030303] text-[#f1ede4]">
      {/* INTRO */}
      <section
        aria-labelledby="projects-title"
        className="relative scroll-mt-[150px] border-b border-white/[0.055] px-6 pb-14 pt-36 sm:px-9 sm:pb-16 lg:px-12 lg:pb-20 lg:pt-44 xl:px-16"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 72% 26%, rgba(199,169,107,.055), transparent 30%)",
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/[0.07]"
        />

        <div className="relative mx-auto max-w-[1480px]">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-px w-8"
                style={{
                  background: `${GOLD}70`,
                }}
              />

              <span
                className="text-[7px] font-semibold uppercase tracking-[0.32em]"
                style={{
                  color: `${GOLD_LIGHT}78`,
                }}
              >
                Umbra Studio / Projekti
              </span>
            </div>

            <span className="hidden font-mono text-[6px] uppercase tracking-[0.25em] text-white/[0.15] sm:block">
              Archive
            </span>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,.65fr)] lg:items-end lg:gap-20">
            <div>
              <h1
                id="projects-title"
                className="max-w-[1050px] text-[clamp(3.9rem,9vw,9.5rem)] font-[430] uppercase leading-[0.80] tracking-[-0.075em] text-white"
              >
                Svetovi
                <br />
                <span className="font-serif italic normal-case text-white/[0.58]">
                  koje stvaramo
                </span>
              </h1>
            </div>

            <div className="max-w-[430px] lg:pb-2">
              <p className="text-sm leading-7 text-white/[0.38] sm:text-[15px] sm:leading-8">
                Projekti Umbra Studija okupljeni na jednom mestu — priče,
                svetovi i produkcije u nastajanju.
              </p>

              <div className="mt-7 flex items-center gap-4 border-t border-white/[0.065] pt-4">
                <span className="font-mono text-[6px] uppercase tracking-[0.25em] text-white/[0.17]">
                  {visibleProjects.length}{" "}
                  {visibleProjects.length === 1 ? "projekat" : "projekta"}
                </span>

                <span
                  aria-hidden="true"
                  className="h-px w-5 bg-white/[0.12]"
                />

                <span className="text-[7px] uppercase tracking-[0.25em] text-white/[0.20]">
                  {getFilterLabel(activeFilter)}
                </span>
              </div>
            </div>
          </div>

          {/* ARCHIVE FILTER */}
          <nav
            aria-label="Filtriraj projekte"
            className="mt-12 border-t border-white/[0.055] pt-5"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <SlidersHorizontal
                  aria-hidden="true"
                  size={13}
                  strokeWidth={1.15}
                  className="text-[#ead39a]/55"
                />

                <span className="font-mono text-[6px] uppercase tracking-[0.30em] text-white/[0.20]">
                  Pregled arhive
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => {
                  const isActive = filter === activeFilter;

                  return (
                    <Link
                      key={filter}
                      href={getFilterHref(filter)}
                      aria-current={isActive ? "page" : undefined}
                      data-cursor-interactive
                      className="group inline-flex items-center gap-3 border border-white/[0.075] px-4 py-2.5 outline-none transition-[border-color,background-color,color,transform] duration-300 hover:-translate-y-px hover:border-[#c7a96b]/34 hover:bg-[#c7a96b]/[0.025] focus-visible:ring-1 focus-visible:ring-[#ead39a]/70"
                      style={
                        isActive
                          ? {
                              borderColor: `${GOLD}55`,
                              background: `${GOLD}08`,
                            }
                          : undefined
                      }
                    >
                      <span
                        className="text-[6px] uppercase tracking-[0.25em]"
                        style={{
                          color: isActive
                            ? `${GOLD_LIGHT}90`
                            : "rgba(255,255,255,.25)",
                        }}
                      >
                        {getFilterLabel(filter)}
                      </span>

                      <span
                        className="font-mono text-[6px] tracking-[0.20em]"
                        style={{
                          color: isActive
                            ? `${GOLD_LIGHT}58`
                            : "rgba(255,255,255,.14)",
                        }}
                      >
                        {getFilterCount(filter)
                          .toString()
                          .padStart(2, "0")}
                      </span>

                      {isActive ? (
                        <Check
                          aria-hidden="true"
                          size={11}
                          strokeWidth={1.3}
                          className="text-[#ead39a]/70"
                        />
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>
        </div>
      </section>

      {/* PROJECT ARCHIVE */}
      <section
        aria-label="Arhiva projekata"
        className="px-6 py-16 sm:px-9 sm:py-20 lg:px-12 lg:py-24 xl:px-16"
      >
        <div className="mx-auto max-w-[1480px]">
          {visibleProjects.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
              {visibleProjects.map((project, index) => (
                <Link
                  key={project.id}
                  href={`/serije/${project.slug}`}
                  aria-label={`Otvori projekat ${project.title}`}
                  data-cursor-interactive
                  className="group block overflow-hidden border border-white/[0.065] bg-[#070707] outline-none transition-[border-color,transform] duration-500 hover:-translate-y-0.5 hover:border-[#c7a96b]/32 focus-visible:ring-1 focus-visible:ring-[#ead39a]/70"
                >
                  {/* VISUAL */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={getProjectImage(project)}
                      alt={project.title}
                      fill
                      priority={index === 0}
                      sizes="(min-width: 1024px) 47vw, 94vw"
                      className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.025]"
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
                          "linear-gradient(180deg, rgba(0,0,0,.04) 0%, rgba(0,0,0,.08) 42%, rgba(0,0,0,.76) 100%)",
                      }}
                    />

                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-4 border border-white/[0.05] sm:inset-5"
                    />

                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute left-4 top-4 h-9 w-9 border-l border-t sm:left-5 sm:top-5"
                      style={{
                        borderColor: `${GOLD_LIGHT}38`,
                      }}
                    />

                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute bottom-4 right-4 h-9 w-9 border-b border-r sm:bottom-5 sm:right-5"
                      style={{
                        borderColor: `${GOLD}2b`,
                      }}
                    />

                    <div className="absolute inset-x-5 top-5 flex items-center justify-between gap-4 sm:inset-x-6 sm:top-6">
                      <span
                        className="text-[6px] font-semibold uppercase tracking-[0.28em]"
                        style={{
                          color: `${GOLD_LIGHT}72`,
                        }}
                      >
                        Project
                      </span>

                      <span className="font-mono text-[6px] tracking-[0.22em] text-white/[0.22]">
                        {getProjectNumber(project.id)}
                      </span>
                    </div>

                    <div className="absolute inset-x-5 bottom-5 sm:inset-x-6 sm:bottom-6">
                      <div className="flex items-end justify-between gap-6">
                        <div className="min-w-0">
                          <div className="mb-3 flex flex-wrap items-center gap-3 text-[7px] font-semibold uppercase tracking-[0.27em]">
                            <span
                              style={{
                                color: `${GOLD_LIGHT}82`,
                              }}
                            >
                              {getTypeLabel(project.type)}
                            </span>

                            <span
                              aria-hidden="true"
                              className="h-px w-4 bg-white/[0.16]"
                            />

                            <span className="text-white/[0.34]">
                              {getStatusLabel(project.status)}
                            </span>
                          </div>

                          <h2 className="text-[clamp(2.2rem,4.8vw,5rem)] font-[430] uppercase leading-[0.82] tracking-[-0.065em] text-white">
                            {project.title}
                          </h2>
                        </div>

                        <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/[0.14] bg-black/20 text-white/[0.40] backdrop-blur-sm transition-[border-color,color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:border-[#ead39a]/40 group-hover:text-[#ead39a] sm:h-11 sm:w-11">
                          <ArrowUpRight
                            aria-hidden="true"
                            className="h-3.5 w-3.5"
                          />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* INFORMATION */}
                  <div className="border-t border-white/[0.06] px-5 py-5 sm:px-6 sm:py-6">
                    <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                      <p className="max-w-[600px] text-[11px] leading-6 text-white/[0.32] sm:text-[12px] sm:leading-7">
                        {project.shortDescription}
                      </p>

                      <div className="grid grid-cols-2 gap-x-7 gap-y-3 text-right sm:min-w-[190px]">
                        <div>
                          <div className="text-[6px] uppercase tracking-[0.23em] text-white/[0.17]">
                            Status
                          </div>

                          <div className="mt-1 text-[7px] uppercase tracking-[0.16em] text-white/[0.42]">
                            {getStatusLabel(project.status)}
                          </div>
                        </div>

                        <div>
                          <div className="text-[6px] uppercase tracking-[0.23em] text-white/[0.17]">
                            Platform
                          </div>

                          <div className="mt-1 text-[7px] uppercase tracking-[0.16em] text-white/[0.42]">
                            {project.platform}
                          </div>
                        </div>
                      </div>
                    </div>

                    {project.book ? (
                      <div className="mt-5 flex items-center gap-3">
                        <span
                          className="text-[7px] font-semibold uppercase tracking-[0.21em]"
                          style={{
                            color: `${GOLD_LIGHT}78`,
                          }}
                        >
                          Ekranizacija
                        </span>

                        <span
                          aria-hidden="true"
                          className="h-px w-6 bg-white/[0.10]"
                        />

                        <span className="truncate text-[7px] uppercase tracking-[0.18em] text-white/[0.25]">
                          {project.book.author}
                        </span>
                      </div>
                    ) : (
                      <div className="mt-5 text-[7px] font-semibold uppercase tracking-[0.21em] text-white/[0.26]">
                        Umbra Original
                      </div>
                    )}

                    <div className="mt-7 flex items-center justify-between border-t border-white/[0.055] pt-4">
                      <span className="text-[6px] uppercase tracking-[0.25em] text-white/[0.18]">
                        Umbra Studio
                      </span>

                      <span
                        className="inline-flex items-center gap-2 text-[6px] font-semibold uppercase tracking-[0.22em]"
                        style={{
                          color: `${GOLD_LIGHT}82`,
                        }}
                      >
                        Otvori projekat

                        <ArrowUpRight
                          aria-hidden="true"
                          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="border border-white/[0.065] bg-[#070707] px-6 py-16 sm:px-10 sm:py-20">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-px w-8"
                  style={{ background: `${GOLD}70` }}
                />

                <span
                  className="text-[7px] font-semibold uppercase tracking-[0.28em]"
                  style={{ color: `${GOLD_LIGHT}78` }}
                >
                  Arhiva
                </span>
              </div>

              <h2 className="mt-6 max-w-2xl text-[clamp(2rem,5vw,4.5rem)] font-[430] uppercase leading-[0.86] tracking-[-0.06em] text-white">
                Nema projekata
                <br />
                u ovoj kategoriji
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-white/[0.30]">
                Kategorija je spremna za buduće projekte. Vrati se na celu
                arhivu da vidiš sve što trenutno stvaramo.
              </p>

              <Link
                href="/serije"
                data-cursor-interactive
                className="group mt-8 inline-flex items-center gap-3 border border-white/[0.08] px-5 py-3 text-[7px] font-semibold uppercase tracking-[0.24em] text-white/[0.45] outline-none transition-[border-color,color,transform] duration-300 hover:-translate-y-px hover:border-[#ead39a]/40 hover:text-[#ead39a] focus-visible:ring-1 focus-visible:ring-[#ead39a]/70"
              >
                Svi projekti
                <ArrowUpRight
                  aria-hidden="true"
                  size={13}
                  strokeWidth={1.15}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* LOWER NAVIGATION */}
      <section className="px-6 pb-24 pt-2 sm:px-9 sm:pb-32 lg:px-12 xl:px-16">
        <div className="mx-auto max-w-[1480px] border-t border-white/[0.065] pt-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/"
              data-cursor-interactive
              className="group flex min-h-[100px] items-center justify-between border border-white/[0.065] bg-white/[0.012] px-6 outline-none transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-[#c7a96b]/30 hover:bg-[#c7a96b]/[0.025] focus-visible:ring-1 focus-visible:ring-[#ead39a]/65 sm:px-8"
            >
              <div>
                <div className="text-[7px] font-semibold uppercase tracking-[0.27em] text-white/[0.20]">
                  Umbra Studio
                </div>

                <div className="mt-3 text-xl tracking-[-0.04em] text-white/[0.70]">
                  Početna
                </div>
              </div>

              <ArrowLeft
                aria-hidden="true"
                className="h-[18px] w-[18px] text-white/[0.26] transition-[color,transform] duration-300 group-hover:-translate-x-1 group-hover:text-[#d6b776]"
              />
            </Link>

            <Link
              href="/likovi"
              data-cursor-interactive
              className="group flex min-h-[100px] items-center justify-between border border-white/[0.065] bg-white/[0.012] px-6 outline-none transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-[#c7a96b]/30 hover:bg-[#c7a96b]/[0.025] focus-visible:ring-1 focus-visible:ring-[#ead39a]/65 sm:px-8"
            >
              <div>
                <div className="text-[7px] font-semibold uppercase tracking-[0.27em] text-white/[0.20]">
                  Arhiva
                </div>

                <div className="mt-3 text-xl tracking-[-0.04em] text-white/[0.70]">
                  Istraži likove
                </div>
              </div>

              <ArrowUpRight
                aria-hidden="true"
                className="h-[18px] w-[18px] text-white/[0.26] transition-[color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#d6b776]"
              />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
