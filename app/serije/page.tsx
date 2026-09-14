import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
} from "lucide-react";

import { getProjects } from "@/lib/content/queries";
import type { ProjectContent } from "@/lib/content/types";

export const metadata: Metadata = {
  title: "Projekti — Umbra Studio",
  description:
    "Projekti Umbra Studija — priče, ekranizacije i produkcije koje nastaju iz ideje.",
  alternates: {
    canonical: "/serije",
  },
  openGraph: {
    title: "Projekti — Umbra Studio",
    description:
      "Projekti Umbra Studija — priče, ekranizacije i produkcije koje nastaju iz ideje.",
    type: "website",
    locale: "sr_RS",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projekti — Umbra Studio",
    description:
      "Projekti Umbra Studija — priče, ekranizacije i produkcije koje nastaju iz ideje.",
  },
};

const GOLD = "#c4a56b";
const GOLD_LIGHT = "#dfc88f";

const FALLBACK_IMAGE = "/umbra-background.png";

type ProjectFilter =
  | "all"
  | "original"
  | "adaptation"
  | "series";

type ProjectsPageProps = {
  searchParams?: Promise<{
    vrsta?: string;
    format?: string;
  }>;
};

function getStatusLabel(status: ProjectContent["status"]) {
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

function getTypeLabel(type: ProjectContent["type"]) {
  switch (type) {
    case "Serija":
      return "Serija";
    case "Film":
      return "Film";
    default:
      return "Projekat";
  }
}

function getProjectImage(project: ProjectContent) {
  return (
    project.source?.coverSr ??
    project.source?.coverEn ??
    FALLBACK_IMAGE
  );
}

function getProjectNumber(id: string) {
  const match = id.match(/(\d+)$/);
  return match?.[1]?.padStart(2, "0") ?? "00";
}

function matchesFilter(
  project: ProjectContent,
  filter: ProjectFilter,
) {
  switch (filter) {
    case "original":
      return !project.source;
    case "adaptation":
      return Boolean(project.source);
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

function getFilterCount(
  projects: readonly ProjectContent[],
  filter: ProjectFilter,
) {
  return projects.filter((project) =>
    matchesFilter(project, filter),
  ).length;
}

function ProjectCard({
  project,
  number,
}: {
  project: ProjectContent;
  number: string;
}) {
  const title = project.title.sr;
  const shortDescription =
    project.shortDescription?.sr ??
    project.description?.sr ??
    "";
  const image = getProjectImage(project);

  return (
    <article className="group relative">
      <Link
        href={`/serije/${project.slug}`}
        aria-label={`Otvori projekat ${title}`}
        className="block rounded-sm outline-none focus-visible:ring-1 focus-visible:ring-[#dfc88f]/80"
      >
        <div className="overflow-hidden border border-white/[0.065] bg-[var(--umbra-surface)] transition-[border-color,transform,box-shadow] duration-500 group-hover:-translate-y-0.5 group-hover:border-[#c4a56b]/35 group-hover:shadow-[0_22px_60px_rgba(0,0,0,.24)]">
          <div className="relative aspect-[16/10] overflow-hidden bg-[#050504]">
            <Image
              src={image}
              alt={title}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition-[transform,filter] duration-[1000ms] ease-out group-hover:scale-[1.018] group-hover:brightness-[1.025]"
            />

            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.04),rgba(0,0,0,.03)_36%,rgba(0,0,0,.76)_100%)]"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-4 border border-white/[0.045] sm:inset-5"
            />

            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-4 h-8 w-8 border-l border-t sm:left-5 sm:top-5 sm:h-9 sm:w-9"
              style={{ borderColor: `${GOLD_LIGHT}42` }}
            />

            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-4 right-4 h-7 w-7 border-b border-r sm:bottom-5 sm:right-5 sm:h-8 sm:w-8"
              style={{ borderColor: `${GOLD}2e` }}
            />

            <div className="absolute inset-x-5 top-5 flex items-center justify-between gap-4 sm:inset-x-6 sm:top-6">
              <span className="umbra-code" style={{ color: `${GOLD_LIGHT}70` }}>
                {getTypeLabel(project.type)}
              </span>
              <span className="umbra-code text-white/[0.24]">
                {number}
              </span>
            </div>

            <div className="absolute inset-x-5 bottom-5 sm:inset-x-6 sm:bottom-6">
              <div className="mb-3 flex items-center gap-3">
                <span
                  className="umbra-code"
                  style={{ color: `${GOLD_LIGHT}82` }}
                >
                  {getStatusLabel(project.status)}
                </span>
                <span
                  aria-hidden="true"
                  className="h-px w-5 bg-white/[0.18]"
                />
                <span className="umbra-code text-white/[0.28]">
                  {project.platform ?? "Umbra Studio"}
                </span>
              </div>

              <h2 className="max-w-[720px] text-[clamp(2rem,4.7vw,4.8rem)] font-[430] uppercase leading-[0.84] tracking-[-0.065em] text-[var(--umbra-platinum)]">
                {title}
              </h2>

              <div className="mt-5 flex items-center justify-between gap-5">
                <span className="umbra-code text-white/[0.11]">
                  UMBRA / PROJECT
                </span>

                <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/[0.12] bg-black/25 text-white/[0.42] backdrop-blur-md transition-[border-color,color,transform,background-color] duration-300 group-hover:-translate-y-0.5 group-hover:border-[#dfc88f]/40 group-hover:bg-black/35 group-hover:text-[#dfc88f] sm:h-11 sm:w-11">
                  <ArrowUpRight
                    aria-hidden="true"
                    size={15}
                    strokeWidth={1.05}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-6 border-t border-white/[0.055] px-5 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-8 sm:px-6 sm:py-6">
            <p className="max-w-[680px] text-[11px] leading-6 text-white/[0.32] sm:text-[12px] sm:leading-7">
              {shortDescription}
            </p>

            <div className="flex min-w-[160px] flex-col justify-end gap-3 sm:text-right">
              {project.source ? (
                <div className="flex items-center gap-3 sm:justify-end">
                  <span
                    className="umbra-code"
                    style={{ color: `${GOLD_LIGHT}76` }}
                  >
                    EKRANIZACIJA
                  </span>

                  <span
                    aria-hidden="true"
                    className="h-px w-5 bg-white/[0.1]"
                  />

                  <span className="umbra-code text-white/[0.22]">
                    {project.source.author ?? "Izvorno delo"}
                  </span>
                </div>
              ) : (
                <span className="umbra-code text-white/[0.24]">
                  UMBRA ORIGINAL
                </span>
              )}

              <span
                className="inline-flex items-center gap-2 self-start text-[7px] font-semibold uppercase tracking-[0.22em] sm:self-end"
                style={{ color: `${GOLD_LIGHT}82` }}
              >
                Otvori projekat
                <ArrowUpRight
                  aria-hidden="true"
                  size={12}
                  strokeWidth={1.05}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const projects = getProjects();
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
    <main className="min-h-screen overflow-x-clip bg-[var(--umbra-bg)] text-[var(--umbra-ink)]">
      <section
        aria-labelledby="projects-title"
        className="relative overflow-hidden border-b border-white/[0.055] pt-32 sm:pt-36 lg:pt-40"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 78% 14%, rgba(196,165,107,.055), transparent 28%), radial-gradient(circle at 16% 82%, rgba(255,255,255,.018), transparent 24%)",
          }}
        />

        <div className="absolute inset-x-0 top-0 h-px bg-white/[0.055]" />

        <div className="umbra-container relative">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-px w-8"
                style={{
                  background:
                    `linear-gradient(90deg, transparent, ${GOLD_LIGHT}78)`,
                }}
              />
              <span
                className="umbra-code"
                style={{ color: `${GOLD_LIGHT}76` }}
              >
                UMBRA STUDIO / PROJEKTI
              </span>
            </div>

            <span className="hidden umbra-code sm:block">
              ARCHIVE / 01
            </span>
          </div>

          <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,.55fr)] lg:items-end lg:gap-20">
            <div>
              <p
                className="umbra-code"
                style={{ color: `${GOLD_LIGHT}52` }}
              >
                PRIČE / EKRANIZACIJE / PRODUKCIJE
              </p>

              <h1
                id="projects-title"
                className="mt-5 max-w-[900px] text-[clamp(3rem,7vw,6.7rem)] font-[430] uppercase leading-[0.86] tracking-[-0.07em] text-[var(--umbra-platinum)]"
              >
                Projekti
              </h1>
            </div>

            <div className="max-w-[430px] lg:pb-1">
              <p className="text-[12px] leading-6 text-[var(--umbra-ink-muted)] sm:text-[13px] sm:leading-7">
                Projekti Umbra Studija — priče, ekranizacije i produkcije koje nastaju iz ideje.
              </p>

              <div className="mt-6 flex items-center gap-3 border-t border-white/[0.055] pt-4">
                <span className="umbra-code">
                  {visibleProjects.length}{" "}
                  {visibleProjects.length === 1
                    ? "PROJEKAT"
                    : "PROJEKATA"}
                </span>

                <span
                  aria-hidden="true"
                  className="h-px w-5 bg-white/[0.11]"
                />

                <span className="umbra-code text-white/[0.20]">
                  {getFilterLabel(activeFilter)}
                </span>
              </div>
            </div>
          </div>

          <nav
            aria-label="Filtriraj projekte"
            className="mt-10 border-t border-white/[0.055] py-5"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <span className="umbra-code text-white/[0.18]">
                ARHIVA / FILTER
              </span>

              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => {
                  const isActive = filter === activeFilter;

                  return (
                    <Link
                      key={filter}
                      href={getFilterHref(filter)}
                      aria-current={
                        isActive ? "page" : undefined
                      }
                      className="inline-flex min-h-9 items-center gap-3 rounded-sm border px-4 py-2.5 outline-none transition-[border-color,background-color,color,transform] duration-300 hover:-translate-y-px focus-visible:ring-1 focus-visible:ring-[#dfc88f]/75"
                      style={
                        isActive
                          ? {
                              borderColor: `${GOLD}56`,
                              background:
                                `linear-gradient(180deg, ${GOLD}0d, rgba(255,255,255,.012))`,
                            }
                          : {
                              borderColor:
                                "rgba(255,255,255,.075)",
                              background:
                                "rgba(255,255,255,.008)",
                            }
                      }
                    >
                      <span
                        className="text-[7px] uppercase tracking-[0.24em]"
                        style={{
                          color: isActive
                            ? `${GOLD_LIGHT}92`
                            : "rgba(255,255,255,.30)",
                        }}
                      >
                        {getFilterLabel(filter)}
                      </span>

                      <span
                        className="umbra-code"
                        style={{
                          color: isActive
                            ? `${GOLD_LIGHT}58`
                            : "rgba(255,255,255,.14)",
                        }}
                      >
                        {getFilterCount(projects, filter)
                          .toString()
                          .padStart(2, "0")}
                      </span>

                      {isActive ? (
                        <Check
                          aria-hidden="true"
                          size={11}
                          strokeWidth={1.25}
                          className="text-[#dfc88f]/72"
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

      <section
        aria-label="Arhiva projekata"
        className="umbra-container py-14 sm:py-18 lg:py-24"
      >
        {visibleProjects.length > 0 ? (
          <div className="grid gap-7 md:grid-cols-2 lg:gap-8">
            {visibleProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                number={getProjectNumber(project.id)}
              />
            ))}
          </div>
        ) : (
          <div className="border border-white/[0.065] bg-[var(--umbra-surface)] px-6 py-16 sm:px-10 sm:py-20">
            <span
              className="umbra-code"
              style={{ color: `${GOLD_LIGHT}76` }}
            >
              ARHIVA
            </span>

            <h2 className="mt-5 max-w-[720px] text-[clamp(2.2rem,5vw,4.4rem)] font-[430] uppercase leading-[0.88] tracking-[-0.06em] text-[var(--umbra-platinum)]">
              Nema projekata u ovoj kategoriji
            </h2>

            <p className="mt-5 max-w-[560px] text-[12px] leading-6 text-white/[0.30] sm:text-[13px] sm:leading-7">
              Kategorija je spremna za buduće projekte. Vrati se na celu arhivu da vidiš trenutno dostupne naslove.
            </p>

            <Link
              href="/serije"
              className="mt-7 inline-flex min-h-10 items-center gap-3 border border-white/[0.08] px-5 py-3 text-[7px] font-semibold uppercase tracking-[0.24em] text-white/[0.42] outline-none transition-[border-color,color,background-color,transform] duration-300 hover:-translate-y-px hover:border-[#dfc88f]/40 hover:bg-[#c4a56b]/[0.02] hover:text-[#dfc88f] focus-visible:ring-1 focus-visible:ring-[#dfc88f]/75"
            >
              Svi projekti
              <ArrowUpRight
                aria-hidden="true"
                size={13}
                strokeWidth={1.1}
              />
            </Link>
          </div>
        )}
      </section>

      <section className="umbra-container border-t border-white/[0.055] pb-24 pt-8 sm:pb-28">
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/"
            className="group flex min-h-[92px] items-center justify-between border border-white/[0.065] bg-[rgba(255,255,255,.008)] px-6 outline-none transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-[#c4a56b]/30 hover:bg-[#c4a56b]/[0.018] focus-visible:ring-1 focus-visible:ring-[#dfc88f]/75 sm:px-8"
          >
            <span>
              <span className="umbra-code text-white/[0.18]">
                UMBRA STUDIO
              </span>
              <span className="mt-2 block text-[16px] tracking-[-0.025em] text-white/[0.66]">
                Početna
              </span>
            </span>

            <ArrowLeft
              aria-hidden="true"
              size={18}
              strokeWidth={1.05}
              className="text-white/[0.26] transition-[color,transform] duration-300 group-hover:-translate-x-1 group-hover:text-[#dfc88f]"
            />
          </Link>

          <Link
            href="/likovi"
            className="group flex min-h-[92px] items-center justify-between border border-white/[0.065] bg-[rgba(255,255,255,.008)] px-6 outline-none transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-[#c4a56b]/30 hover:bg-[#c4a56b]/[0.018] focus-visible:ring-1 focus-visible:ring-[#dfc88f]/75 sm:px-8"
          >
            <span>
              <span className="umbra-code text-white/[0.18]">
                ARHIVA
              </span>
              <span className="mt-2 block text-[16px] tracking-[-0.025em] text-white/[0.66]">
                Istraži likove
              </span>
            </span>

            <ArrowUpRight
              aria-hidden="true"
              size={18}
              strokeWidth={1.05}
              className="text-white/[0.26] transition-[color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#dfc88f]"
            />
          </Link>
        </div>
      </section>
    </main>
  );
}
