import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Clapperboard,
  Download,
  ExternalLink,
  UsersRound,
} from "lucide-react";

import { characters } from "@/data/characters";
import { projects } from "@/data/projects";

const GOLD = "#c7a96b";
const GOLD_LIGHT = "#ead39a";
const FALLBACK_IMAGE = "/umbra-background.png";
const AUTHOR_URL = "https://branislavbojcic.com/";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps) {
  const { slug } = await params;

  const project = projects.find(
    (item) => item.slug === slug,
  );

  if (!project) {
    return {
      title: "Project not found | Umbra Studio",
    };
  }

  const image =
    project.book?.coverEn ||
    project.book?.coverSr ||
    project.cover ||
    FALLBACK_IMAGE;

  return {
    title: `${project.title} | Umbra Studio`,
    description: project.longDescription,
    openGraph: {
      title: `${project.title} | Umbra Studio`,
      description: project.longDescription,
      images: [image],
    },
  };
}

function getStatusLabel(
  status: (typeof projects)[number]["status"],
) {
  switch (status) {
    case "in-production":
      return "In production";
    case "development":
      return "In development";
    case "upcoming":
      return "Coming soon";
    default:
      return status;
  }
}

function getTypeLabel(
  type: (typeof projects)[number]["type"],
) {
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

function getProjectImage(
  project: (typeof projects)[number],
) {
  return (
    project.book?.coverEn ||
    project.book?.coverSr ||
    project.cover ||
    FALLBACK_IMAGE
  );
}

export default async function ProjectPage({
  params,
}: ProjectPageProps) {
  const { slug } = await params;

  const project = projects.find(
    (item) => item.slug === slug,
  );

  if (!project) {
    notFound();
  }

  const book = project.book;
  const projectImage = getProjectImage(project);
  const statusLabel = getStatusLabel(project.status);
  const typeLabel = getTypeLabel(project.type);
  const projectNumber = getProjectNumber(project.id);

  const projectCharacters = characters
    .filter(
      (character) =>
        character.projectSlug === project.slug,
    )
    .sort((a, b) => a.order - b.order);

  const otherProjects = projects.filter(
    (item) => item.slug !== project.slug,
  );

  return (
    <main className="min-h-screen overflow-hidden bg-[#030303] text-[#F1EDE4]">
      {/* HERO */}
      <section className="relative min-h-[100svh] overflow-hidden border-b border-white/[0.055]">
        <Image
          src={projectImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="scale-[1.04] object-cover opacity-[0.36] blur-[1px]"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-black/[0.46]"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(3,3,3,.98) 0%, rgba(3,3,3,.90) 28%, rgba(3,3,3,.50) 66%, rgba(3,3,3,.84) 100%)",
          }}
        />

        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(0deg, rgba(3,3,3,.99) 0%, rgba(3,3,3,.12) 46%, rgba(3,3,3,.58) 100%)",
          }}
        />

        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 76% 36%, rgba(199,169,107,.10), transparent 34%)",
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-5 border border-white/[0.06] sm:inset-7 lg:inset-10"
        />

        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-5 top-5 h-14 w-14 border-l border-t sm:left-7 sm:top-7 lg:left-10 lg:top-10"
          style={{
            borderColor: `${GOLD}58`,
          }}
        />

        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-5 right-5 h-14 w-14 border-b border-r sm:bottom-7 sm:right-7 lg:bottom-10 lg:right-10"
          style={{
            borderColor: `${GOLD}30`,
          }}
        />

        <div className="absolute inset-0 umbra-noise opacity-[0.045]" />

        <div className="relative mx-auto flex min-h-[100svh] max-w-[1480px] flex-col justify-between px-6 pb-10 pt-32 sm:px-9 sm:pb-14 lg:px-12 lg:pt-40 xl:px-16">
          <div className="flex items-center justify-between gap-6">
            <Link
              href="/en/projects"
              className="group inline-flex items-center gap-3 rounded-sm text-[7px] font-semibold uppercase tracking-[0.28em] text-white/[0.32] outline-none transition-[color,transform] duration-300 hover:translate-x-0.5 hover:text-white/[0.60] focus-visible:ring-1 focus-visible:ring-[#ead39a]/60"
            >
              <ArrowLeft
                aria-hidden="true"
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5"
              />

              All projects
            </Link>

            <span className="hidden text-[7px] uppercase tracking-[0.24em] text-white/[0.18] sm:block">
              Project
            </span>
          </div>

          <div className="grid items-end gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(250px,320px)] xl:grid-cols-[minmax(0,1fr)_minmax(290px,370px)]">
            <div className="max-w-[1050px]">
              <div className="mb-6 flex flex-wrap items-center gap-4 text-[7px] font-semibold uppercase tracking-[0.30em]">
                <span
                  style={{
                    color: `${GOLD_LIGHT}88`,
                  }}
                >
                  {typeLabel}
                </span>

                <span
                  aria-hidden="true"
                  className="h-px w-6 bg-white/[0.12]"
                />

                <span className="text-white/[0.34]">
                  {statusLabel}
                </span>
              </div>

              <h1 className="text-[clamp(3.8rem,9vw,10rem)] font-[430] uppercase leading-[0.80] tracking-[-0.075em] text-white">
                {project.title}
              </h1>

              <span
                aria-hidden="true"
                className="mt-6 block h-px w-12 origin-left"
                style={{
                  background: `linear-gradient(90deg, ${GOLD_LIGHT}, ${GOLD}, transparent)`,
                }}
              />

              {book ? (
                <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-white/[0.58] sm:text-[15px]">
                  <span>Based on the novel</span>

                  <span
                    aria-hidden="true"
                    className="h-px w-5 bg-white/[0.12]"
                  />

                  <a
                    href={AUTHOR_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#d6b776] underline decoration-[#c7a96b]/45 underline-offset-4 transition-colors hover:text-[#f0d08a] hover:decoration-[#ead39a]/70"
                  >
                    {book.author}

                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-3 w-3"
                    />
                  </a>
                </div>
              ) : (
                <div className="mt-7 inline-flex items-center gap-2 text-[7px] font-semibold uppercase tracking-[0.23em]">
                  <Clapperboard
                    aria-hidden="true"
                    className="h-3 w-3"
                    style={{
                      color: `${GOLD}60`,
                    }}
                  />

                  <span
                    style={{
                      color: `${GOLD_LIGHT}62`,
                    }}
                  >
                    UMBRA ORIGINAL
                  </span>
                </div>
              )}

              <p className="mt-6 max-w-[780px] text-sm leading-7 text-white/[0.42] sm:text-[15px] sm:leading-8">
                {project.longDescription}
              </p>

              <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/[0.075] pt-5 text-[7px] uppercase tracking-[0.25em] text-white/[0.24]">
                <span>
                  Platform · {project.platform}
                </span>

                <span>
                  Status · {statusLabel}
                </span>

                <span>
                  Format · {typeLabel}
                </span>

                <span>
                  {book
                    ? "Source · Novel"
                    : "Source · Umbra Studio"}
                </span>
              </div>
            </div>

            {book ? (
              <div className="mx-auto w-full max-w-[300px]">
                <div className="relative">
                  <div
                    aria-hidden="true"
                    className="absolute -inset-4 border border-white/[0.035]"
                  />

                  <div
                    aria-hidden="true"
                    className="absolute -inset-2 border"
                    style={{
                      borderColor: `${GOLD}18`,
                    }}
                  />

                  <div className="relative aspect-[0.69/1] overflow-hidden border border-white/[0.10] bg-[#070707] shadow-[0_30px_100px_rgba(0,0,0,.48)]">
                    <Image
                      src={
                        book.coverEn ||
                        book.coverSr
                      }
                      alt={`Cover of ${book.title}`}
                      fill
                      sizes="(min-width: 1024px) 300px, 70vw"
                      className="object-cover transition-transform duration-[1000ms] hover:scale-[1.02]"
                    />

                    <div
                      aria-hidden="true"
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(0,0,0,.02) 0%, transparent 45%, rgba(0,0,0,.58) 100%)",
                      }}
                    />

                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-4 border border-white/[0.05]"
                    />

                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute left-4 top-4 h-8 w-8 border-l border-t"
                      style={{
                        borderColor: `${GOLD_LIGHT}3d`,
                      }}
                    />

                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute bottom-4 right-4 h-8 w-8 border-b border-r"
                      style={{
                        borderColor: `${GOLD}2b`,
                      }}
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4 px-1 text-[7px] uppercase tracking-[0.24em] text-white/[0.24]">
                  <a
                    href={AUTHOR_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate underline decoration-white/10 underline-offset-4 transition-colors hover:text-[#d6b776] hover:decoration-[#c7a96b]/55"
                  >
                    {book.author}
                  </a>

                  <span>Novel</span>
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex items-end justify-between">
            <div className="hidden sm:block">
              <span className="text-[6px] uppercase tracking-[0.25em] text-white/[0.16]">
                Story / Frame / Motion
              </span>

              <div
                aria-hidden="true"
                className="mt-3 h-px w-24"
                style={{
                  background: `linear-gradient(90deg, ${GOLD}58, transparent)`,
                }}
              />
            </div>

            <span className="ml-auto text-[7px] uppercase tracking-[0.27em] text-white/[0.25]">
              Scroll to enter
            </span>
          </div>
        </div>
      </section>

      {/* PROJECT CONTEXT */}
      <section className="px-6 py-24 sm:px-9 sm:py-32 lg:px-12 lg:py-36 xl:px-16">
        <div className="mx-auto max-w-[1480px]">
          <div className="max-w-[920px]">
            <div
              className="text-[7px] font-semibold uppercase tracking-[0.30em]"
              style={{
                color: `${GOLD_LIGHT}82`,
              }}
            >
              {book ? "Source work" : "Project world"}
            </div>

            <h2 className="mt-5 text-[clamp(2.7rem,5.3vw,5.8rem)] font-[430] leading-[0.88] tracking-[-0.06em]">
              {book ? (
                <>
                  A novel becomes
                  <br />
                  <span className="font-serif italic text-white/[0.58]">
                    a cinematic world.
                  </span>
                </>
              ) : (
                <>
                  An idea becomes
                  <br />
                  <span className="font-serif italic text-white/[0.58]">
                    a cinematic world.
                  </span>
                </>
              )}
            </h2>

            <p className="mt-9 max-w-[780px] text-[14px] leading-8 text-white/[0.36] sm:text-[15px]">
              {book
                ? `"${book.title}" by ${book.author} is the literary foundation of this Umbra Studio project. The adaptation develops its story through character, atmosphere and cinematic storytelling.`
                : project.longDescription}
            </p>

            <div className="mt-12 grid border-y border-white/[0.065] sm:grid-cols-4">
              <ProjectStat
                label="Format"
                value={typeLabel}
              />

              <ProjectStat
                label="Platform"
                value={project.platform}
              />

              <ProjectStat
                label="Status"
                value={statusLabel}
              />

              <ProjectStat
                label={book ? "Author" : "Source"}
                value={
                  book
                    ? book.author
                    : "Umbra Studio"
                }
                last
              />
            </div>
          </div>
        </div>
      </section>

      {/* SOURCE MATERIAL */}
      {book ? (
        <section className="border-y border-white/[0.065] bg-[#070707] px-6 py-24 sm:px-9 sm:py-32 lg:px-12 xl:px-16">
          <div className="mx-auto max-w-[1480px]">
            <div className="grid gap-14 lg:grid-cols-[minmax(0,.68fr)_minmax(0,1.32fr)] lg:items-center lg:gap-20">
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <BookCover
                  href={book.pdfSr}
                  downloadName="mrzim-svog-brata-sr.pdf"
                  src={book.coverSr}
                  alt="Cover of the Serbian edition"
                  label="SR / EDITION"
                  downloadLabel="Download Serbian PDF"
                />

                <BookCover
                  href={book.pdfEn}
                  downloadName="mrzim-svog-brata-en.pdf"
                  src={book.coverEn}
                  alt="Cover of the English edition"
                  label="EN / EDITION"
                  downloadLabel="Download English PDF"
                />
              </div>

              <div className="max-w-[760px]">
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
                      color: `${GOLD_LIGHT}82`,
                    }}
                  >
                    Source material
                  </span>
                </div>

                <h2 className="mt-5 text-[clamp(2.5rem,5vw,5.2rem)] font-[430] leading-[0.90] tracking-[-0.06em]">
                  Read the
                  <br />
                  <span className="font-serif italic text-white/[0.58]">
                    novel.
                  </span>
                </h2>

                <p className="mt-7 max-w-[680px] text-[14px] leading-8 text-white/[0.36] sm:text-[15px]">
                  &quot;{book.title}&quot; by{" "}
                  {book.author} is the literary
                  foundation of this project. Both
                  the Serbian and English editions are
                  available as PDF downloads.
                </p>

                <div className="mt-10 grid gap-3 sm:grid-cols-2">
                  <DownloadButton
                    href={book.pdfSr}
                    label="Download Serbian PDF"
                    meta="SR / PDF"
                    downloadName="mrzim-svog-brata-sr.pdf"
                  />

                  <DownloadButton
                    href={book.pdfEn}
                    label="Download English PDF"
                    meta="EN / PDF"
                    downloadName="mrzim-svog-brata-en.pdf"
                  />
                </div>

                {book.publicUrl ? (
                  <a
                    href={book.publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor-interactive
                    className="group mt-5 inline-flex items-center gap-3 rounded-sm text-[7px] font-semibold uppercase tracking-[0.27em] text-white/[0.27] outline-none transition-[color,transform] duration-300 hover:translate-x-0.5 hover:text-[#d6b776] focus-visible:ring-1 focus-visible:ring-[#ead39a]/60"
                  >
                    <ExternalLink
                      aria-hidden="true"
                      className="h-3.5 w-3.5"
                    />

                    Open public source

                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>
                ) : null}

                <div className="mt-9 border-t border-white/[0.065] pt-4 text-[7px] uppercase tracking-[0.24em] text-white/[0.20]">
                  {book.author} / {book.title}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="border-y border-white/[0.065] bg-[#070707] px-6 py-24 sm:px-9 sm:py-32 lg:px-12 xl:px-16">
          <div className="mx-auto max-w-[1480px]">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,.68fr)_minmax(0,1.32fr)] lg:items-center lg:gap-20">
              <Link
                href={`/en/projects/${project.slug}`}
                aria-label={`Open ${project.title}`}
                className="group/poster block w-fit max-w-full outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/70"
              >
                <ProjectArtworkFrame
                  project={project}
                  image={projectImage}
                  compact
                />
              </Link>

              <div className="max-w-[760px]">
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
                      color: `${GOLD_LIGHT}82`,
                    }}
                  >
                    Project material
                  </span>
                </div>

                <h2 className="mt-5 text-[clamp(2.5rem,5vw,5.2rem)] font-[430] leading-[0.90] tracking-[-0.06em]">
                  Enter the
                  <br />
                  <span className="font-serif italic text-white/[0.58]">
                    project world.
                  </span>
                </h2>

                <p className="mt-7 max-w-[680px] text-[14px] leading-8 text-white/[0.36] sm:text-[15px]">
                  {project.longDescription}
                </p>

                <div className="mt-10 grid gap-3 sm:grid-cols-2">
                  <ProjectInfo
                    label="PLATFORM"
                    value={project.platform}
                  />

                  <ProjectInfo
                    label="STATUS"
                    value={statusLabel}
                  />
                </div>

                <div className="mt-9 border-t border-white/[0.065] pt-4 text-[7px] uppercase tracking-[0.24em] text-white/[0.20]">
                  {project.title} / {project.platform}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CHARACTERS */}
      {projectCharacters.length > 0 ? (
        <section className="px-6 py-24 sm:px-9 sm:py-32 lg:px-12 lg:py-36 xl:px-16">
          <div className="mx-auto max-w-[1480px]">
            <div className="border-t border-white/[0.065] pt-8">
              <div className="flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div
                    className="text-[7px] font-semibold uppercase tracking-[0.30em]"
                    style={{
                      color: `${GOLD_LIGHT}82`,
                    }}
                  >
                    Characters / Dossiers
                  </div>

                  <h2 className="mt-4 text-[clamp(2.3rem,4.5vw,4.8rem)] font-[430] tracking-[-0.055em]">
                    People inside the story.
                  </h2>

                  <p className="mt-4 max-w-[650px] text-[11px] leading-6 text-white/[0.30] sm:text-[12px] sm:leading-7">
                    Explore the characters that shape
                    this project and open their individual
                    dossiers.
                  </p>
                </div>

                <Link
                  href="/en/characters"
                  data-cursor-interactive
                  className="group inline-flex items-center gap-3 rounded-sm text-[7px] font-semibold uppercase tracking-[0.27em] text-white/[0.30] outline-none transition-[color,transform] duration-300 hover:translate-x-0.5 hover:text-[#d6b776] focus-visible:ring-1 focus-visible:ring-[#ead39a]/60"
                >
                  Open character archive

                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
              </div>

              <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {projectCharacters.map(
                  (character) => (
                    <Link
                      key={character.id}
                      href={`/en/characters/${character.slug}`}
                      data-cursor-interactive
                      className="group flex min-h-[92px] items-center justify-between border border-white/[0.065] bg-white/[0.012] px-5 outline-none transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-[#c7a96b]/32 hover:bg-[#c7a96b]/[0.025] focus-visible:ring-1 focus-visible:ring-[#ead39a]/65 sm:px-6"
                    >
                      <div className="min-w-0">
                        <div
                          className="text-[7px] font-semibold uppercase tracking-[0.24em]"
                          style={{
                            color: `${GOLD_LIGHT}72`,
                          }}
                        >
                          Character
                        </div>

                        <div className="mt-2 truncate text-base tracking-[-0.03em] text-white/[0.72]">
                          {character.name}
                        </div>
                      </div>

                      <ArrowUpRight
                        aria-hidden="true"
                        className="h-4 w-4 shrink-0 text-white/[0.25] transition-[color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#d6b776]"
                      />
                    </Link>
                  ),
                )}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* OTHER PROJECTS */}
      {otherProjects.length > 0 ? (
        <section className="border-t border-white/[0.065] bg-[#050505] px-6 py-24 sm:px-9 sm:py-32 lg:px-12 xl:px-16">
          <div className="mx-auto max-w-[1480px]">
            <div className="flex items-end justify-between gap-6">
              <div>
                <div
                  className="text-[7px] font-semibold uppercase tracking-[0.30em]"
                  style={{
                    color: `${GOLD_LIGHT}7b`,
                  }}
                >
                  Continue exploring
                </div>

                <h2 className="mt-4 text-[clamp(2.3rem,4.5vw,4.8rem)] font-[430] leading-[0.88] tracking-[-0.06em]">
                  Other worlds.
                </h2>
              </div>

              <Link
                href="/en/projects"
                className="group hidden items-center gap-3 rounded-sm text-[7px] font-semibold uppercase tracking-[0.26em] text-white/[0.28] outline-none transition-[color,transform] duration-300 hover:translate-x-0.5 hover:text-white/[0.55] focus-visible:ring-1 focus-visible:ring-[#ead39a]/60 sm:inline-flex"
              >
                All projects

                <ArrowUpRight
                  aria-hidden="true"
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>

            <div className="mt-9 grid gap-5 sm:grid-cols-2">
              {otherProjects.map(
                (otherProject) => (
                  <Link
                    key={otherProject.id}
                    href={`/en/projects/${otherProject.slug}`}
                    data-cursor-interactive
                    className="group relative block overflow-hidden border border-white/[0.065] bg-[#070707] outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/70"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={getProjectImage(
                          otherProject,
                        )}
                        alt={`${otherProject.title} artwork`}
                        fill
                        sizes="(min-width: 640px) 50vw, 94vw"
                        className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.035]"
                      />

                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-black/[0.33]"
                      />

                      <div
                        aria-hidden="true"
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(180deg, rgba(0,0,0,.06), rgba(0,0,0,.82))",
                        }}
                      />

                      <div className="absolute inset-x-5 bottom-5 sm:inset-x-6 sm:bottom-6">
                        <div className="flex items-end justify-between gap-5">
                          <div>
                            <div
                              className="mb-2 text-[7px] font-semibold uppercase tracking-[0.25em]"
                              style={{
                                color: `${GOLD_LIGHT}7b`,
                              }}
                            >
                              {getTypeLabel(
                                otherProject.type,
                              )}
                            </div>

                            <h3 className="text-[clamp(1.8rem,3.5vw,3.3rem)] font-[430] uppercase leading-[0.84] tracking-[-0.06em] text-white">
                              {otherProject.title}
                            </h3>
                          </div>

                          <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/[0.13] bg-black/20 text-white/[0.40] backdrop-blur-sm transition-[border-color,color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:border-[#ead39a]/40 group-hover:text-[#ead39a]">
                            <ArrowUpRight
                              aria-hidden="true"
                              className="h-3.5 w-3.5"
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ),
              )}
            </div>
          </div>
        </section>
      ) : null}

      {/* NAVIGATION */}
      <section className="px-6 pb-24 sm:px-9 sm:pb-32 lg:px-12 xl:px-16">
        <div className="mx-auto max-w-[1480px] border-t border-white/[0.065] pt-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/en/projects"
              data-cursor-interactive
              className="group flex min-h-[100px] items-center justify-between border border-white/[0.065] bg-white/[0.012] px-6 outline-none transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-[#c7a96b]/32 hover:bg-[#c7a96b]/[0.025] focus-visible:ring-1 focus-visible:ring-[#ead39a]/65 sm:px-8"
            >
              <div>
                <div className="text-[7px] font-semibold uppercase tracking-[0.27em] text-white/[0.20]">
                  Archive
                </div>

                <div className="mt-3 text-xl tracking-[-0.04em] text-white/[0.70]">
                  All projects
                </div>
              </div>

              <ArrowLeft
                aria-hidden="true"
                className="h-[18px] w-[18px] text-white/[0.26] transition-[color,transform] duration-300 group-hover:-translate-x-1 group-hover:text-[#d6b776]"
              />
            </Link>

            <Link
              href="/en/characters"
              data-cursor-interactive
              className="group flex min-h-[100px] items-center justify-between border border-white/[0.065] bg-white/[0.012] px-6 outline-none transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-[#c7a96b]/32 hover:bg-[#c7a96b]/[0.025] focus-visible:ring-1 focus-visible:ring-[#ead39a]/65 sm:px-8"
            >
              <div>
                <div className="flex items-center gap-2 text-[7px] font-semibold uppercase tracking-[0.27em] text-white/[0.20]">
                  <UsersRound
                    aria-hidden="true"
                    className="h-3 w-3"
                  />

                  Characters
                </div>

                <div className="mt-3 text-xl tracking-[-0.04em] text-white/[0.70]">
                  Explore characters
                </div>
              </div>

              <ArrowUpRight
                aria-hidden="true"
                className="h-[18px] w-[18px] text-white/[0.26] transition-[color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </section>
    </main>
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
          ? "border-b border-white/[0.065] sm:border-b-0 sm:border-r sm:border-white/[0.065]"
          : "",
      ].join(" ")}
    >
      <div className="text-[7px] font-semibold uppercase tracking-[0.28em] text-white/[0.20]">
        {label}
      </div>

      <div className="mt-3 text-sm uppercase tracking-[0.08em] text-white/[0.62]">
        {value}
      </div>
    </div>
  );
}

function ProjectInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border border-white/[0.065] bg-[#0b0b0b] px-5 py-5">
      <div
        className="text-[6px] font-semibold uppercase tracking-[0.28em]"
        style={{
          color: `${GOLD_LIGHT}68`,
        }}
      >
        {label}
      </div>

      <div className="mt-2 text-sm uppercase tracking-[0.08em] text-white/[0.68]">
        {value}
      </div>
    </div>
  );
}

function ProjectArtworkFrame({
  project,
  image,
  compact = false,
}: {
  project: (typeof projects)[number];
  image: string;
  compact?: boolean;
}) {
  const number = getProjectNumber(project.id);

  return (
    <span
      className={[
        "relative block w-full",
        compact
          ? "max-w-[340px]"
          : "max-w-[300px]",
      ].join(" ")}
    >
      <span
        aria-hidden="true"
        className={[
          "pointer-events-none absolute border border-white/[0.035]",
          compact ? "-inset-3" : "-inset-4",
        ].join(" ")}
      />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-2 border border-[#c7a96b]/[0.10]"
      />

      <span className="relative block aspect-[0.78/1] overflow-hidden border border-white/[0.10] bg-[#070707] shadow-[0_30px_100px_rgba(0,0,0,.45)]">
        <Image
          src={image}
          alt={`${project.title} artwork`}
          fill
          sizes="(min-width: 1024px) 300px, 78vw"
          className="object-contain transition-transform duration-[1100ms] group-hover/poster:scale-[1.025]"
        />

        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-3 border border-white/[0.045] sm:inset-4"
        />

        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-4 h-8 w-8 border-l border-t"
          style={{
            borderColor: `${GOLD_LIGHT}46`,
          }}
        />

        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-4 right-4 h-8 w-8 border-b border-r"
          style={{
            borderColor: `${GOLD}32`,
          }}
        />

        <span className="pointer-events-none absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 sm:inset-x-6 sm:bottom-6">
          <span
            className="text-[6px] font-semibold uppercase tracking-[0.29em]"
            style={{
              color: `${GOLD_LIGHT}72`,
            }}
          >
            {project.book
              ? "Source novel"
              : "Project artwork"}
          </span>

          <span className="font-mono text-[6px] tracking-[0.22em] text-white/[0.28]">
            {number}
          </span>
        </span>

        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 h-px w-[30%] transition-[width] duration-500 group-hover/poster:w-full"
          style={{
            background:
              `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT}, transparent 76%)`,
          }}
        />

        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.02),transparent_46%,rgba(0,0,0,.42))]"
        />
      </span>
    </span>
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
        className="group block rounded-sm outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/70"
      >
        <div className="relative aspect-[0.69/1] overflow-hidden border border-white/[0.08] bg-[#060606] shadow-[0_22px_70px_rgba(0,0,0,.30)] transition-[border-color,box-shadow] duration-500 group-hover:border-[#c7a96b]/45 group-hover:shadow-[0_28px_90px_rgba(0,0,0,.42)]">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 220px, 45vw"
            className="object-cover transition-transform duration-[1100ms] group-hover:scale-[1.025]"
          />

          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,.02), transparent 42%, rgba(0,0,0,.52))",
            }}
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-3 border border-white/[0.045]"
          />

          <div className="absolute inset-x-4 bottom-4 flex items-center justify-between">
            <span className="text-[6px] font-semibold uppercase tracking-[0.24em] text-white/[0.38]">
              PDF
            </span>

            <Download
              aria-hidden="true"
              className="h-3.5 w-3.5 text-[#d6b776]/80 transition-transform duration-300 group-hover:translate-y-0.5 group-hover:text-[#f0d08a]"
            />
          </div>
        </div>
      </a>

      <div className="mt-3 text-[6px] font-semibold uppercase tracking-[0.24em] text-white/[0.23]">
        {label} · click to download
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
      className="group flex min-h-[76px] items-center justify-between rounded-sm border border-[#c7a96b]/28 bg-[#0a0907] px-5 outline-none transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-[#ead39a]/65 hover:bg-[#c7a96b]/[0.045] focus-visible:ring-1 focus-visible:ring-[#ead39a]/70"
    >
      <div>
        <div
          className="text-[6px] font-semibold uppercase tracking-[0.28em]"
          style={{
            color: `${GOLD}78`,
          }}
        >
          {meta}
        </div>

        <div className="mt-2 text-sm text-white/[0.70]">
          {label}
        </div>
      </div>

      <Download
        aria-hidden="true"
        className="h-4 w-4 text-[#d6b776] transition-transform duration-300 group-hover:translate-y-0.5"
      />
    </a>
  );
}