import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Download, ExternalLink } from "lucide-react";

import { projects } from "@/data/projects";

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return {
      title: "Project not found | Umbra Studio",
      description: "The requested Umbra Studio project could not be found.",
    };
  }

  return {
    title: `${project.title} | Umbra Studio`,
    description: project.longDescription,
    alternates: {
      canonical: `/en/projects/${project.slug}`,
    },
    openGraph: {
      title: `${project.title} | Umbra Studio`,
      description: project.longDescription,
      url: `/en/projects/${project.slug}`,
      images: project.book?.coverEn || project.book?.coverSr || project.cover ? [project.book?.coverEn || project.book?.coverSr || project.cover] : undefined,
    },
  };
}

type ProjectType = (typeof projects)[number]["type"];

type ProjectStatus = (typeof projects)[number]["status"];

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

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  const book = project.book;
  const hasBook = Boolean(book);

  return (
    <main data-umbra-scene="project-detail" className="min-h-screen overflow-hidden bg-[#050505] text-[#f1ede4]">
      {/* HERO */}
      <section className="relative min-h-[100svh] overflow-hidden">
        {book ? (
          <Image
            src={book.coverEn}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover scale-[1.045] opacity-[0.38] blur-[1px]"
          />
        ) : (
          <Image
            src="/umbra-background.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover scale-[1.03] opacity-[0.54]"
          />
        )}

        <div className="absolute inset-0 bg-[#050505]/60" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,.98)_0%,rgba(5,5,5,.92)_28%,rgba(5,5,5,.55)_62%,rgba(5,5,5,.86)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(5,5,5,.99)_0%,rgba(5,5,5,.16)_44%,rgba(5,5,5,.55)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_38%,rgba(185,154,97,.11),transparent_33%)]" />

        <div className="pointer-events-none absolute inset-5 border border-white/[0.07] sm:inset-7 lg:inset-10" />
        <div className="pointer-events-none absolute left-5 top-5 h-14 w-14 border-l border-t border-[#b99a61]/45 sm:left-7 sm:top-7 lg:left-10 lg:top-10" />
        <div className="pointer-events-none absolute bottom-5 right-5 h-14 w-14 border-b border-r border-[#b99a61]/30 sm:bottom-7 sm:right-7 lg:bottom-10 lg:right-10" />

        <div className="relative mx-auto flex min-h-[100svh] max-w-[1440px] flex-col justify-between px-5 pb-12 pt-36 sm:px-8 sm:pb-16 lg:px-12 lg:pt-44">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="h-px w-9 bg-[#b99a61]/70" />
              <span className="text-[8px] uppercase tracking-[0.36em] text-white/45">
                Umbra Studio / Project
              </span>
            </div>

            <span className="font-mono text-[7px] tracking-[0.24em] text-white/[0.22]">
              PROJECT / {project.id.slice(-2)}
            </span>
          </div>

          <div className="grid items-end gap-12 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_390px]">
            <div className="max-w-[1000px]">
              <div className="mb-6 flex flex-wrap items-center gap-4 text-[7px] uppercase tracking-[0.3em] text-white/34">
                <span>{getTypeLabel(project.type)}</span>
                <span className="h-px w-6 bg-white/[0.12]" />
                <span>{getStatusLabel(project.status)}</span>
              </div>

              <h1 className="max-w-[1050px] text-[clamp(4rem,9.5vw,10rem)] font-[440] leading-[0.8] tracking-[-0.075em]">
                {project.title}
              </h1>

              <div className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm text-white/62 sm:text-base">
                <span>Cinematic adaptation of the novel</span>
                <a
                  href="https://branislavbojcic.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#d6b776] underline decoration-[#b99a61]/70 underline-offset-4 transition-colors hover:text-[#f0d08a] hover:decoration-[#d6b776]"
                >
                  by Branislav Bojčić
                </a>
              </div>

              <p className="mt-6 max-w-[730px] text-sm leading-7 text-white/44 sm:text-base sm:leading-8">
                Umbra Studio’s first series is a cinematic adaptation of
                Branislav Bojčić’s novel “MRZIM SVOG BRATA”, developed as an
                episodic screen adaptation focused on character, atmosphere and
                cinematic storytelling.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/[0.09] pt-5 text-[7px] uppercase tracking-[0.27em] text-white/28">
                <span>Platform · {project.platform}</span>
                <span>Status · {getStatusLabel(project.status)}</span>
                <span>Format · {getTypeLabel(project.type)}</span>
                {book ? <span>Source · Novel</span> : null}
              </div>
            </div>

            {book ? (
              <div className="relative mx-auto w-full max-w-[260px] lg:max-w-[300px]">
                <div className="absolute -inset-4 border border-white/[0.035]" />
                <div className="absolute -inset-2 border border-[#b99a61]/10" />

                <div className="relative aspect-[0.69/1] overflow-hidden border border-white/[0.1] bg-[#070707] shadow-[0_30px_100px_rgba(0,0,0,.45)]">
                  <Image
                    src={book.coverEn}
                    alt={`Cover of ${book.title}`}
                    fill
                    priority
                    sizes="(min-width: 1024px) 300px, 70vw"
                    className="object-cover"
                  />

                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.05),transparent_48%,rgba(0,0,0,.6))]" />
                  <div className="pointer-events-none absolute inset-4 border border-white/[0.055]" />
                  <span className="pointer-events-none absolute left-4 top-4 h-8 w-8 border-l border-t border-[#d6b776]/35" />
                  <span className="pointer-events-none absolute bottom-4 right-4 h-8 w-8 border-b border-r border-[#b99a61]/25" />

                  <div className="pointer-events-none absolute inset-x-5 bottom-5 flex items-end justify-between">
                    <span className="text-[6px] uppercase tracking-[0.3em] text-white/38">
                      Source novel
                    </span>
                    <span className="font-mono text-[6px] tracking-[0.22em] text-white/28">
                      001
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between px-1 text-[7px] uppercase tracking-[0.25em] text-white/25">
                  <a
                    href="https://branislavbojcic.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-[#d6b776]"
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
              <div className="font-mono text-[6px] uppercase tracking-[0.24em] text-white/[0.18]">
                STORY / FRAME / MOTION
              </div>
              <div className="mt-3 h-px w-24 bg-gradient-to-r from-[#b99a61]/50 to-transparent" />
            </div>

            <div className="ml-auto flex items-center gap-3 text-[7px] uppercase tracking-[0.28em] text-white/28">
              <span className="h-5 w-px bg-white/[0.12]" />
              Scroll to enter
            </div>
          </div>
        </div>
      </section>

      {/* PROJECT DOSSIER */}
      <section className="px-5 py-28 sm:px-8 sm:py-36 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-16 lg:grid-cols-[200px_1fr]">
            <div className="lg:border-r lg:border-white/[0.07] lg:pr-10">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#b99a61]/60" />
                <span className="text-[7px] uppercase tracking-[0.3em] text-white/25">
                  01 / Project
                </span>
              </div>

              <div className="mt-8 hidden font-mono text-[8px] uppercase leading-7 tracking-[0.22em] text-white/[0.16] lg:block">
                UMBRA
                <br />
                PROJECT
                <br />
                001
              </div>
            </div>

            <div className="max-w-[950px]">
              <div className="text-[7px] uppercase tracking-[0.3em] text-[#d6b776]">
                Source material
              </div>

              <h2 className="mt-5 text-[clamp(2.7rem,5vw,5.8rem)] font-[430] leading-[0.9] tracking-[-0.06em]">
                A novel
                <br />
                <span className="font-serif italic text-white/62">
                  becomes a cinematic world
                </span>
              </h2>

              <p className="mt-9 max-w-[780px] text-[15px] leading-8 text-white/42">
                Branislav Bojčić’s “MRZIM SVOG BRATA” is the literary source
                for Umbra Studio’s first series. The adaptation develops the
                story through character, atmosphere and cinematic storytelling,
                while keeping the original work at its foundation.
              </p>

              <div className="mt-12 grid border-y border-white/[0.07] sm:grid-cols-4">
                <ProjectStat label="FORMAT" value={getTypeLabel(project.type)} />
                <ProjectStat label="PLATFORM" value={project.platform} />
                <ProjectStat label="STATUS" value={getStatusLabel(project.status)} />
                <ProjectStat label="AUTHOR" value={book?.author ?? "—"} last />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BOOK SOURCE / DOWNLOAD */}
      {hasBook && book ? (
        <section className="border-y border-white/[0.07] bg-[#080808] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
          <div className="mx-auto max-w-[1440px]">
            <div className="grid gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:gap-20">
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <BookCover
                  href={book.pdfSr}
                  downloadName="mrzim-svog-brata-sr.pdf"
                  src={book.coverSr}
                  alt="Cover of the Serbian edition"
                  label="SR / EDITION · CLICK TO DOWNLOAD"
                  downloadLabel="Download Serbian PDF"
                />
                <BookCover
                  href={book.pdfEn}
                  downloadName="mrzim-svog-brata-en.pdf"
                  src={book.coverEn}
                  alt="Cover of the English edition"
                  label="EN / EDITION · CLICK TO DOWNLOAD"
                  downloadLabel="Download English PDF"
                />
              </div>

              <div className="max-w-[760px]">
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-[#b99a61]/70" />
                  <span className="text-[7px] uppercase tracking-[0.32em] text-[#d6b776]">
                    Source material
                  </span>
                </div>

                <h2 className="mt-5 text-[clamp(2.5rem,5vw,5.2rem)] font-[430] leading-[0.9] tracking-[-0.06em]">
                  Read the
                  <br />
                  <span className="font-serif italic text-white/62">
                    novel
                  </span>
                </h2>

                <p className="mt-7 max-w-[680px] text-sm leading-7 text-white/40 sm:text-base sm:leading-8">
                  “{book.title}” by Branislav Bojčić is the literary foundation
                  of Umbra Studio’s first series. Both the Serbian and English
                  editions are available here as PDF files.
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
                    className="group mt-4 inline-flex items-center gap-3 text-[7px] uppercase tracking-[0.28em] text-white/28 transition-colors hover:text-[#d6b776]"
                  >
                    <ExternalLink size={13} strokeWidth={1.15} />
                    Open public source
                    <ArrowUpRight
                      size={13}
                      strokeWidth={1.15}
                      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>
                ) : null}

                <div className="mt-9 border-t border-white/[0.07] pt-4 text-[7px] uppercase tracking-[0.24em] text-white/[0.2]">
                  {book.author} / {book.title}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* CHARACTERS */}
      {project.slug === "mrzim-svog-brata" ? (
        <section className="px-5 py-28 sm:px-8 sm:py-36 lg:px-12">
          <div className="mx-auto max-w-[1440px] border-t border-white/[0.07] pt-8">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <div className="text-[7px] uppercase tracking-[0.3em] text-[#d6b776]">
                  Cast / Dossier
                </div>
                <h2 className="mt-4 text-4xl font-[430] tracking-[-0.045em] sm:text-5xl">
                  Project characters
                </h2>
                <p className="mt-4 max-w-[640px] text-sm leading-7 text-white/38">
                  Explore the public character archive and open individual
                  dossiers.
                </p>
              </div>

              <Link
                href="/en/characters"
                data-cursor-interactive
                className="group inline-flex items-center gap-3 text-[7px] uppercase tracking-[0.28em] text-white/32 transition-colors hover:text-[#d6b776]"
              >
                Open character archive
                <ArrowUpRight
                  size={14}
                  strokeWidth={1.15}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* NAVIGATION */}
      <section className="px-5 pb-28 sm:px-8 sm:pb-36 lg:px-12">
        <div className="mx-auto max-w-[1440px] border-t border-white/[0.08] pt-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <Link
              href="/en/projects"
              data-cursor-interactive
              className="group flex min-h-[100px] items-center justify-between border border-white/[0.08] bg-white/[0.015] px-6 transition-all duration-500 hover:border-[#b99a61]/35 hover:bg-[#b99a61]/[0.025] sm:px-8"
            >
              <div>
                <div className="text-[7px] uppercase tracking-[0.28em] text-white/22">
                  Archive
                </div>
                <div className="mt-3 text-xl tracking-[-0.04em] text-white/72">
                  All projects
                </div>
              </div>

              <ArrowLeft
                size={17}
                strokeWidth={1.15}
                className="text-white/28 transition-transform duration-500 group-hover:-translate-x-1 group-hover:text-[#d6b776]"
              />
            </Link>

            <Link
              href="/en/characters"
              data-cursor-interactive
              className="group flex min-h-[100px] items-center justify-between border border-white/[0.08] bg-white/[0.015] px-6 transition-all duration-500 hover:border-[#b99a61]/35 hover:bg-[#b99a61]/[0.025] sm:px-8"
            >
              <div>
                <div className="text-[7px] uppercase tracking-[0.28em] text-white/22">
                  Character Archive
                </div>
                <div className="mt-3 text-xl tracking-[-0.04em] text-white/72">
                  Explore characters
                </div>
              </div>

              <ArrowUpRight
                size={17}
                strokeWidth={1.15}
                className="text-white/28 transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#d6b776]"
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
          ? "border-b border-white/[0.07] sm:border-b-0 sm:border-r sm:border-white/[0.07]"
          : "",
      ].join(" ")}
    >
      <div className="text-[7px] uppercase tracking-[0.28em] text-white/20">
        {label}
      </div>
      <div className="mt-3 text-sm uppercase tracking-[0.08em] text-white/62">
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
        className="group block outline-none"
      >
        <div className="relative aspect-[0.69/1] overflow-hidden border border-white/[0.08] bg-[#060606] shadow-[0_22px_70px_rgba(0,0,0,.3)] transition-[border-color,box-shadow] duration-500 group-hover:border-[#b99a61]/45 group-hover:shadow-[0_28px_90px_rgba(0,0,0,.42)]">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 220px, 45vw"
            className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.025]"
          />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.03),transparent_42%,rgba(0,0,0,.52))]" />
          <div className="pointer-events-none absolute inset-3 border border-white/[0.045]" />
          <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-center justify-between">
            <span className="text-[6px] uppercase tracking-[0.24em] text-white/38">
              PDF
            </span>
            <Download
              size={14}
              strokeWidth={1.1}
              className="text-[#d6b776]/80 transition-transform duration-300 group-hover:translate-y-0.5 group-hover:text-[#f0d08a]"
            />
          </div>
        </div>
      </a>

      <div className="mt-3 text-[6px] uppercase tracking-[0.24em] text-white/24">
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
      className="group flex min-h-[76px] items-center justify-between border border-[#b99a61]/30 bg-[#0b0a08] px-5 transition-all duration-400 hover:border-[#d6b776]/70 hover:bg-[#b99a61]/[0.045]"
    >
      <div>
        <div className="text-[6px] uppercase tracking-[0.28em] text-[#b99a61]/70">
          {meta}
        </div>
        <div className="mt-2 text-sm text-white/72">
          {label}
        </div>
      </div>

      <Download
        size={17}
        strokeWidth={1.15}
        className="text-[#d6b776] transition-transform duration-300 group-hover:translate-y-0.5"
      />
    </a>
  );
}
