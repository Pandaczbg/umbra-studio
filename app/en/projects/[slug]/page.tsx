import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Download, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";

import { getProjectBySlug, getProjects } from "@/lib/content/queries";

import type {
  ProjectStatus,
  ProjectType,
} from "@/lib/content/types";

export function generateStaticParams() {
  return getProjects().map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project not found | Umbra Studio",
      description:
        "The requested Umbra Studio project could not be found.",
    };
  }

  const description =
    project.description?.en ??
    project.shortDescription?.en ??
    "";

  const artwork =
    project.source?.coverEn ??
    project.source?.coverSr ??
    (project.slug === "biblija"
      ? "/Biblija Cover.png"
      : "/umbra-background.png");

  return {
    title: `${project.title.en} | Umbra Studio`,
    description,
    alternates: {
      canonical: `/en/projects/${project.slug}`,
    },
    openGraph: {
      title: `${project.title.en} | Umbra Studio`,
      description,
      url: `/en/projects/${project.slug}`,
      images: artwork ? [artwork] : undefined,
    },
  };
}

function getStatusLabel(status: ProjectStatus) {
  switch (status) {
    case "in-production":
      return "In production";

    case "development":
      return "In development";

    case "upcoming":
      return "Upcoming";

    default:
      return status;
  }
}

function getTypeLabel(type: ProjectType) {
  switch (type) {
    case "Serija":
      return "Series";

    case "Film":
      return "Film";

    default:
      return "Project";
  }
}

function getProjectNumber(id: string) {
  const match = id.match(/(\d+)$/);

  return match?.[1]?.padStart(2, "0") ?? "00";
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const source = project.source;
  const hasSource = Boolean(source);

  const artwork =
    source?.coverEn ??
    source?.coverSr ??
    (project.slug === "biblija"
      ? "/Biblija Cover.png"
      : "/umbra-background.png");

  const projectNumber = getProjectNumber(project.id);
  const projectTitle = project.title.en;

  const projectDescription =
    project.description?.en ??
    project.shortDescription?.en ??
    "";

  const sourceTitle = source?.title ?? "";
  const sourceAuthor = source?.author ?? "";
  const projectPlatform = project.platform ?? "Umbra Studio";

  return (
    <main
      data-umbra-scene="project-detail"
      className="min-h-screen overflow-x-clip bg-[#030303] text-[#F1EDE4]"
    >
      {/* ─────────────────────────────────────────────
          PROJECT HERO
      ───────────────────────────────────────────── */}

      <section className="relative min-h-[100svh] overflow-hidden border-b border-white/[0.055]">
        <Image
          src={artwork}
          alt=""
          fill
          priority
          sizes="100vw"
          className={
            hasSource
              ? "scale-[1.045] object-cover opacity-[0.38] blur-[1px]"
              : "scale-[1.03] object-cover opacity-[0.52]"
          }
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[#030303]/60"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(3,3,3,.98) 0%, rgba(3,3,3,.92) 28%, rgba(3,3,3,.55) 62%, rgba(3,3,3,.86) 100%)",
          }}
        />

        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(0deg, rgba(3,3,3,.99) 0%, rgba(3,3,3,.16) 44%, rgba(3,3,3,.56) 100%)",
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 78% 38%, rgba(199,169,107,.11), transparent 33%)",
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-5 border border-white/[0.06] sm:inset-7 lg:inset-10"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-5 top-5 h-14 w-14 border-l border-t border-[#ead39a]/30 sm:left-7 sm:top-7 lg:left-10 lg:top-10"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-5 right-5 h-14 w-14 border-b border-r border-[#c7a96b]/24 sm:bottom-7 sm:right-7 lg:bottom-10 lg:right-10"
        />

        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1560px] flex-col justify-between px-5 pb-10 pt-24 sm:px-8 sm:pb-14 sm:pt-28 lg:px-14 lg:pb-16 lg:pt-36">
          <div className="flex items-center justify-between border-b border-white/[0.055] pb-5">
            <Link
              href="/en/projects"
              className="group inline-flex min-h-10 items-center gap-3 text-[7px] uppercase tracking-[0.26em] text-white/[0.28] transition-colors duration-300 hover:text-white/[0.64] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/45"
            >
              <ArrowLeft
                aria-hidden="true"
                size={13}
                strokeWidth={1.1}
                className="transition-transform duration-300 group-hover:-translate-x-0.5"
              />

              All projects
            </Link>

            <div className="hidden items-center gap-4 sm:flex">
              <span className="font-mono text-[6px] uppercase tracking-[0.3em] text-white/[0.16]">
                UMBRA / PROJECT DOSSIER
              </span>

              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  background: "#ead39a",
                  boxShadow: "0 0 16px rgba(199,169,107,.42)",
                }}
              />
            </div>
          </div>

          <div className="grid items-center gap-14 py-14 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-20 lg:py-20 xl:grid-cols-[minmax(0,1fr)_330px]">
            <div className="max-w-[1040px]">
              <div className="flex flex-wrap items-center gap-3 font-mono text-[6px] uppercase tracking-[0.28em]">
                <span
                  style={{
                    color: "#ead39a9a",
                  }}
                >
                  {getTypeLabel(project.type)}
                </span>

                <span
                  aria-hidden="true"
                  className="h-px w-5 bg-white/[0.14]"
                />

                <span className="text-white/[0.34]">
                  {getStatusLabel(project.status)}
                </span>

                <span
                  aria-hidden="true"
                  className="h-px w-5 bg-white/[0.14]"
                />

                <span className="text-white/[0.2]">
                  PROJECT / {projectNumber}
                </span>
              </div>

              <h1
                id="project-title"
                className="mt-7 max-w-[1080px] text-[clamp(3.75rem,9vw,9.8rem)] font-[430] uppercase leading-[0.8] tracking-[-0.08em] text-white"
              >
                {projectTitle}
              </h1>

              {sourceAuthor ? (
                <div className="mt-9">
                  <span className="block font-mono text-[6px] uppercase tracking-[0.3em] text-[#ead39a]/45">
                    Original work by
                  </span>

                  <a
                    href="https://branislavbojcic.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor-interactive
                    aria-label={`Open ${sourceAuthor}'s website`}
                    className="group/author mt-2 inline-flex min-h-10 items-center gap-3 rounded-sm outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
                  >
                    <span className="text-[clamp(1.1rem,1.8vw,1.45rem)] font-[430] tracking-[-0.025em] text-[#ead39a]/88 transition-colors duration-300 group-hover/author:text-[#f4ddb0]">
                      {sourceAuthor}
                    </span>

                    <ArrowUpRight
                      aria-hidden="true"
                      size={15}
                      strokeWidth={1.05}
                      className="text-[#ead39a]/48 transition-[color,transform] duration-300 group-hover/author:-translate-y-0.5 group-hover/author:translate-x-0.5 group-hover/author:text-[#ead39a]/88"
                    />
                  </a>

                  <div className="mt-2 flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="h-px w-8"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(199,169,107,.45), transparent)",
                      }}
                    />

                    <span className="font-mono text-[6px] uppercase tracking-[0.27em] text-white/[0.22]">
                      Source novel
                    </span>
                  </div>
                </div>
              ) : null}

              <p className="mt-7 max-w-[760px] text-[14px] leading-7 text-white/[0.4] sm:text-[15px] sm:leading-8">
                {projectDescription}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4 border-t border-white/[0.08] pt-5 font-mono text-[6px] uppercase tracking-[0.25em] text-white/[0.27]">
                <span>Platform · {projectPlatform}</span>

                <span>Status · {getStatusLabel(project.status)}</span>

                <span>Format · {getTypeLabel(project.type)}</span>

                {source ? <span>Source · Novel</span> : null}
              </div>
            </div>

            {source ? (
              <BookHeroPanel
                src={
                  source.coverEn ??
                  source.coverSr ??
                  "/umbra-background.png"
                }
                alt={`Cover of ${sourceTitle}`}
                projectNumber={projectNumber}
                author={sourceAuthor}
              />
            ) : project.slug === "biblija" ? (
              <ProjectHeroPanel
                src={artwork}
                alt={`Visual identity of ${projectTitle}`}
                projectNumber={projectNumber}
              />
            ) : null}
          </div>

          <div className="flex items-end justify-between border-t border-white/[0.055] pt-5">
            <div className="hidden sm:block">
              <div className="font-mono text-[6px] uppercase tracking-[0.24em] text-white/[0.16]">
                STORY / FRAME / MOTION
              </div>

              <div
                aria-hidden="true"
                className="mt-3 h-px w-24"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(199,169,107,.5), transparent)",
                }}
              />
            </div>

            <div className="ml-auto flex min-h-10 items-center gap-3 font-mono text-[6px] uppercase tracking-[0.28em] text-white/[0.25]">
              <span
                aria-hidden="true"
                className="h-5 w-px bg-white/[0.12]"
              />

              Scroll to explore
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          PROJECT DOSSIER
      ───────────────────────────────────────────── */}

      <section
        aria-labelledby="project-dossier-title"
        className="relative"
      >
        <div className="mx-auto max-w-[1560px] px-5 py-20 sm:px-8 sm:py-24 lg:px-14 lg:py-28">
          <div className="mb-8 flex items-center gap-3 border-b border-white/[0.055] pb-6">
            <span
              aria-hidden="true"
              className="h-px w-7"
              style={{
                background: "#c7a96b",
              }}
            />

            <p className="font-mono text-[7px] uppercase tracking-[0.34em] text-[#ead39a]/72">
              DOSSIER / PROJECT
            </p>
          </div>

          <div className="grid gap-14 lg:grid-cols-[190px_minmax(0,1fr)] lg:gap-20">
            <aside className="lg:border-r lg:border-white/[0.07] lg:pr-10">
              <div className="font-mono text-[6px] uppercase leading-7 tracking-[0.24em] text-white/[0.16]">
                UMBRA
                <br />
                PROJECT
                <br />
                {projectNumber}
              </div>

              <div className="mt-8 h-px w-8 bg-[#c7a96b]/35" />
            </aside>

            <div className="max-w-[960px]">
              <p className="font-mono text-[6px] uppercase tracking-[0.3em] text-[#ead39a]/52">
                SOURCE MATERIAL
              </p>

              <h2
                id="project-dossier-title"
                className="mt-5 text-[clamp(2.65rem,5.6vw,5.8rem)] font-[430] uppercase leading-[0.87] tracking-[-0.065em] text-white/[0.94]"
              >
                A story
                <span className="block font-serif font-normal italic text-white/[0.48]">
                  becomes a cinematic world
                </span>
              </h2>

              <p className="mt-9 max-w-[790px] text-[14px] leading-7 text-white/[0.4] sm:text-[15px] sm:leading-8">
                {projectDescription}
              </p>

              <div className="mt-12 grid border-y border-white/[0.07] sm:grid-cols-4">
                <ProjectStat
                  label="FORMAT"
                  value={getTypeLabel(project.type)}
                />

                <ProjectStat
                  label="PLATFORM"
                  value={projectPlatform}
                />

                <ProjectStat
                  label="STATUS"
                  value={getStatusLabel(project.status)}
                />

                <ProjectStat
                  label="AUTHOR"
                  value={sourceAuthor || "—"}
                  last
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          SOURCE MATERIAL
      ───────────────────────────────────────────── */}

      {hasSource && source ? (
        <section
          aria-labelledby="book-source-title"
          className="border-y border-white/[0.07] bg-[#070707]"
        >
          <div className="mx-auto max-w-[1560px] px-5 py-20 sm:px-8 sm:py-24 lg:px-14 lg:py-28">
            <div className="grid gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:gap-20">
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                {source.pdfSr ? (
                  <BookCover
                    href={source.pdfSr}
                    downloadName="mrzim-svog-brata-sr.pdf"
                    src={
                      source.coverSr ??
                      source.coverEn ??
                      "/umbra-background.png"
                    }
                    alt="Cover of the Serbian edition"
                    label="SR / EDITION · DOWNLOAD PDF"
                    downloadLabel="Download Serbian PDF"
                  />
                ) : null}

                {source.pdfEn ? (
                  <BookCover
                    href={source.pdfEn}
                    downloadName="mrzim-svog-brata-en.pdf"
                    src={
                      source.coverEn ??
                      source.coverSr ??
                      "/umbra-background.png"
                    }
                    alt="Cover of the English edition"
                    label="EN / EDITION · DOWNLOAD PDF"
                    downloadLabel="Download English PDF"
                  />
                ) : null}
              </div>

              <div className="max-w-[780px]">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="h-px w-8"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(199,169,107,.7), transparent)",
                    }}
                  />

                  <span className="font-mono text-[6px] uppercase tracking-[0.32em] text-[#ead39a]/66">
                    SOURCE MATERIAL
                  </span>
                </div>

                <h2
                  id="book-source-title"
                  className="mt-5 text-[clamp(2.6rem,5.3vw,5.3rem)] font-[430] uppercase leading-[0.88] tracking-[-0.06em] text-white/[0.94]"
                >
                  Read the
                  <span className="block font-serif font-normal italic text-white/[0.48]">
                    novel
                  </span>
                </h2>

                <p className="mt-7 max-w-[700px] text-[14px] leading-7 text-white/[0.39] sm:text-[15px] sm:leading-8">
                  “{sourceTitle}” by {sourceAuthor} is the literary foundation
                  of this Umbra Studio project. Available editions are provided
                  here as PDF files.
                </p>

                <div className="mt-10 grid gap-3 sm:grid-cols-2">
                  {source.pdfSr ? (
                    <DownloadButton
                      href={source.pdfSr}
                      label="Download Serbian PDF"
                      meta="SR / PDF"
                      downloadName="mrzim-svog-brata-sr.pdf"
                    />
                  ) : null}

                  {source.pdfEn ? (
                    <DownloadButton
                      href={source.pdfEn}
                      label="Download English PDF"
                      meta="EN / PDF"
                      downloadName="mrzim-svog-brata-en.pdf"
                    />
                  ) : null}
                </div>

                {source.publicUrl ? (
                  <a
                    href={source.publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor-interactive
                    className="group mt-5 inline-flex min-h-10 items-center gap-3 font-mono text-[6px] uppercase tracking-[0.28em] text-white/[0.28] transition-colors hover:text-[#d6b776] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/45"
                  >
                    <ExternalLink
                      size={13}
                      strokeWidth={1.15}
                      aria-hidden="true"
                    />

                    Open public source

                    <ArrowUpRight
                      size={13}
                      strokeWidth={1.15}
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>
                ) : null}

                <div className="mt-9 border-t border-white/[0.07] pt-4 font-mono text-[6px] uppercase tracking-[0.24em] text-white/[0.2]">
                  {sourceAuthor} / {sourceTitle}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* ─────────────────────────────────────────────
          CHARACTERS
      ───────────────────────────────────────────── */}

      {project.slug === "mrzim-svog-brata" ? (
        <section
          aria-labelledby="project-characters-title"
          className="relative"
        >
          <div className="mx-auto max-w-[1560px] px-5 py-20 sm:px-8 sm:py-24 lg:px-14 lg:py-28">
            <div className="border-t border-white/[0.07] pt-8">
              <div className="flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="h-px w-7"
                      style={{
                        background: "#c7a96b",
                      }}
                    />

                    <span className="font-mono text-[6px] uppercase tracking-[0.3em] text-[#ead39a]/65">
                      CAST / DOSSIER
                    </span>
                  </div>

                  <h2
                    id="project-characters-title"
                    className="mt-4 text-[clamp(2.2rem,4vw,4rem)] font-[430] uppercase leading-[0.9] tracking-[-0.055em] text-white/[0.92]"
                  >
                    Project
                    <span className="ml-2 font-serif font-normal italic text-white/[0.46]">
                      characters
                    </span>
                  </h2>

                  <p className="mt-4 max-w-[640px] text-[13px] leading-7 text-white/[0.34]">
                    Explore the public character archive and open individual
                    dossiers.
                  </p>
                </div>

                <Link
                  href="/en/characters"
                  data-cursor-interactive
                  className="group inline-flex min-h-10 items-center gap-3 self-start border border-white/[0.07] bg-white/[0.015] px-4 py-3 font-mono text-[6px] uppercase tracking-[0.28em] text-white/[0.28] transition-colors duration-300 hover:border-[#ead39a]/20 hover:bg-white/[0.03] hover:text-[#d6b776] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/45 sm:self-auto"
                >
                  Open character archive

                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.15}
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* ─────────────────────────────────────────────
          EXIT FRAME
      ───────────────────────────────────────────── */}

      <section
        aria-label="Project navigation"
        className="relative"
      >
        <div className="mx-auto max-w-[1560px] px-5 pb-20 sm:px-8 sm:pb-24 lg:px-14 lg:pb-28">
          <div className="border-t border-white/[0.055] pt-6">
            <div className="grid gap-px overflow-hidden border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2">
              <Link
                href="/en/projects"
                data-cursor-interactive
                className="group flex min-h-[110px] items-center justify-between bg-[#060606] px-6 outline-none transition-colors duration-300 hover:bg-[#090909] focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#ead39a]/65 sm:px-8"
              >
                <div>
                  <div className="font-mono text-[6px] uppercase tracking-[0.27em] text-white/[0.18]">
                    ARCHIVE
                  </div>

                  <div className="mt-3 text-xl tracking-[-0.04em] text-white/[0.68]">
                    All projects
                  </div>
                </div>

                <ArrowLeft
                  aria-hidden="true"
                  size={18}
                  strokeWidth={1.15}
                  className="text-white/[0.25] transition-[color,transform] duration-500 group-hover:-translate-x-1 group-hover:text-[#d6b776]"
                />
              </Link>

              <Link
                href="/en/characters"
                data-cursor-interactive
                className="group flex min-h-[110px] items-center justify-between bg-[#060606] px-6 outline-none transition-colors duration-300 hover:bg-[#090909] focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#ead39a]/65 sm:px-8"
              >
                <div>
                  <div className="font-mono text-[6px] uppercase tracking-[0.27em] text-white/[0.18]">
                    CHARACTER ARCHIVE
                  </div>

                  <div className="mt-3 text-xl tracking-[-0.04em] text-white/[0.68]">
                    Explore characters
                  </div>
                </div>

                <ArrowUpRight
                  aria-hidden="true"
                  size={18}
                  strokeWidth={1.15}
                  className="text-white/[0.25] transition-[color,transform] duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#d6b776]"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function BookHeroPanel({
  src,
  alt,
  projectNumber,
  author,
}: {
  src: string;
  alt: string;
  projectNumber: string;
  author: string;
}) {
  return (
    <div className="relative mx-auto w-full max-w-[310px]">
      <div
        aria-hidden="true"
        className="absolute -inset-3 border border-white/[0.035]"
      />

      <div
        aria-hidden="true"
        className="absolute -inset-1.5 border border-[#c7a96b]/10"
      />

      <div className="relative aspect-[0.69/1] overflow-hidden border border-white/[0.1] bg-[#070707] shadow-[0_30px_100px_rgba(0,0,0,.45)]">
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 310px, 70vw"
          className="object-cover"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,.03), transparent 45%, rgba(0,0,0,.56))",
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-4 border border-white/[0.055]"
        />

        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-4 h-8 w-8 border-l border-t border-[#ead39a]/32"
        />

        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-4 right-4 h-8 w-8 border-b border-r border-[#c7a96b]/24"
        />

        <div className="pointer-events-none absolute inset-x-5 bottom-5 flex items-end justify-between">
          <span className="font-mono text-[6px] uppercase tracking-[0.28em] text-white/[0.38]">
            Source novel
          </span>

          <span className="font-mono text-[6px] tracking-[0.22em] text-white/[0.26]">
            {projectNumber}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between px-1 font-mono text-[6px] uppercase tracking-[0.25em] text-white/[0.24]">
        {author ? (
          <a
            href="https://branislavbojcic.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-[#d6b776] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/45"
          >
            {author}
          </a>
        ) : (
          <span>Umbra Studio</span>
        )}

        <span>Novel</span>
      </div>
    </div>
  );
}

function ProjectHeroPanel({
  src,
  alt,
  projectNumber,
}: {
  src: string;
  alt: string;
  projectNumber: string;
}) {
  return (
    <div className="relative mx-auto w-full max-w-[370px]">
      <div
        aria-hidden="true"
        className="absolute -inset-4 border border-white/[0.03]"
      />

      <div
        aria-hidden="true"
        className="absolute -inset-2 border border-[#c7a96b]/10"
      />

      <div className="relative overflow-hidden border border-white/[0.095] bg-[#080808] shadow-[0_30px_100px_rgba(0,0,0,.42)]">
        <div className="relative aspect-[1.18/1]">
          <Image
            src={src}
            alt={alt}
            fill
            priority
            sizes="(min-width: 1024px) 370px, 84vw"
            className="object-cover"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,.03), transparent 48%, rgba(0,0,0,.5))",
            }}
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-4 border border-white/[0.05]"
          />

          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-4 h-8 w-8 border-l border-t border-[#ead39a]/30"
          />

          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-4 right-4 h-8 w-8 border-b border-r border-[#c7a96b]/22"
          />

          <div className="pointer-events-none absolute inset-x-5 bottom-5 flex items-end justify-between">
            <span className="font-mono text-[6px] uppercase tracking-[0.28em] text-white/[0.38]">
              Visual frame
            </span>

            <span className="font-mono text-[6px] tracking-[0.22em] text-white/[0.26]">
              {projectNumber}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between px-1 font-mono text-[6px] uppercase tracking-[0.25em] text-white/[0.24]">
        <span>BIBLIJA</span>
        <span>Umbra project</span>
      </div>
    </div>
  );
}

function ProjectStat({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className={[
        "py-6",
        !last
          ? "border-b border-white/[0.07] sm:border-b-0 sm:border-r sm:border-white/[0.07]"
          : "",
      ].join(" ")}
    >
      <div className="font-mono text-[6px] uppercase tracking-[0.28em] text-white/[0.2]">
        {label}
      </div>

      <div className="mt-3 text-[11px] uppercase tracking-[0.08em] text-white/[0.62]">
        {value}
      </div>
    </div>
  );
}

function BookCover({
  href,
  downloadName,
  src,
  alt,
  label,
  downloadLabel,
}: {
  href: string;
  downloadName: string;
  src: string;
  alt: string;
  label: string;
  downloadLabel: string;
}) {
  return (
    <div>
      <a
        href={href}
        download={downloadName}
        data-cursor-interactive
        aria-label={downloadLabel}
        className="group block outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
      >
        <div className="relative aspect-[0.69/1] overflow-hidden border border-white/[0.08] bg-[#060606] shadow-[0_22px_70px_rgba(0,0,0,.3)] transition-[border-color,box-shadow] duration-500 group-hover:border-[#c7a96b]/45 group-hover:shadow-[0_28px_90px_rgba(0,0,0,.42)]">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 220px, 45vw"
            className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.025]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,.03), transparent 42%, rgba(0,0,0,.52))",
            }}
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-3 border border-white/[0.045]"
          />

          <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-center justify-between">
            <span className="font-mono text-[6px] uppercase tracking-[0.24em] text-white/[0.38]">
              PDF
            </span>

            <Download
              aria-hidden="true"
              size={14}
              strokeWidth={1.1}
              className="text-[#d6b776]/80 transition-[color,transform] duration-300 group-hover:translate-y-0.5 group-hover:text-[#f0d08a]"
            />
          </div>
        </div>
      </a>

      <div className="mt-3 font-mono text-[6px] uppercase tracking-[0.24em] text-white/[0.24]">
        {label}
      </div>
    </div>
  );
}

function DownloadButton({
  href,
  label,
  meta,
  downloadName,
}: {
  href: string;
  label: string;
  meta: string;
  downloadName: string;
}) {
  return (
    <a
      href={href}
      download={downloadName}
      data-cursor-interactive
      className="group flex min-h-[76px] items-center justify-between border border-[#c7a96b]/30 bg-[#0b0a08] px-5 transition-[background-color,border-color] duration-300 hover:border-[#d6b776]/70 hover:bg-[#c7a96b]/[0.045] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
    >
      <div>
        <div className="font-mono text-[6px] uppercase tracking-[0.28em] text-[#c7a96b]/70">
          {meta}
        </div>

        <div className="mt-2 text-sm text-white/[0.72]">{label}</div>
      </div>

      <Download
        aria-hidden="true"
        size={17}
        strokeWidth={1.15}
        className="text-[#d6b776] transition-transform duration-300 group-hover:translate-y-0.5"
      />
    </a>
  );
}