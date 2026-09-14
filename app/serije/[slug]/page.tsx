import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Download,
  ExternalLink,
} from "lucide-react";

import {
  getProjectBySlug,
  getProjects,
} from "@/lib/content/queries";

import type {
  ProjectContent,
  ProjectStatus,
  ProjectType,
} from "@/lib/content/types";

const GOLD = "#c4a56b";
const GOLD_LIGHT = "#dfc88f";

const FALLBACK_IMAGE = "/umbra-background.png";

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
      title: "Projekat nije pronađen — Umbra Studio",
      description:
        "Traženi Umbra Studio projekat nije pronađen.",
    };
  }

  const description =
    project.description?.sr ??
    project.shortDescription?.sr ??
    "";

  const artwork =
    project.source?.coverSr ??
    project.source?.coverEn ??
    (project.slug === "biblija"
      ? "/Biblija Cover.png"
      : FALLBACK_IMAGE);

  return {
    title: `${project.title.sr} — Umbra Studio`,
    description,
    alternates: {
      canonical: `/serije/${project.slug}`,
    },
    openGraph: {
      title: `${project.title.sr} — Umbra Studio`,
      description,
      url: `/serije/${project.slug}`,
      images: [artwork],
      type: "article",
      locale: "sr_RS",
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title.sr} — Umbra Studio`,
      description,
      images: [artwork],
    },
  };
}

function getStatusLabel(status: ProjectStatus) {
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

function getTypeLabel(type: ProjectType) {
  switch (type) {
    case "Serija":
      return "Serija";
    case "Film":
      return "Film";
    default:
      return "Projekat";
  }
}

function getProjectNumber(id: string) {
  const match = id.match(/(\d+)$/);
  return match?.[1]?.padStart(2, "0") ?? "00";
}

function getArtwork(project: ProjectContent) {
  return (
    project.source?.coverSr ??
    project.source?.coverEn ??
    (project.slug === "biblija"
      ? "/Biblija Cover.png"
      : FALLBACK_IMAGE)
  );
}

function isBiblija(project: ProjectContent) {
  return project.slug === "biblija";
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
        "py-5 sm:py-6",
        !last
          ? "border-b border-white/[0.055] sm:border-b-0 sm:border-r sm:border-white/[0.055]"
          : "",
      ].join(" ")}
    >
      <div className="umbra-code text-white/[0.18]">
        {label}
      </div>
      <div className="mt-2 text-[11px] uppercase tracking-[0.08em] text-white/[0.58] sm:text-[12px]">
        {value}
      </div>
    </div>
  );
}

function ArtworkPanel({
  src,
  alt,
  projectNumber,
  label,
  sublabel,
  book,
}: {
  src: string;
  alt: string;
  projectNumber: string;
  label: string;
  sublabel: string;
  book?: boolean;
}) {
  return (
    <figure className="relative mx-auto w-full max-w-[360px] lg:max-w-[380px]">
      <div
        aria-hidden="true"
        className="absolute -inset-3 border border-white/[0.025]"
      />
      <div
        aria-hidden="true"
        className="absolute -inset-1.5 border"
        style={{ borderColor: `${GOLD}12` }}
      />

      <div
        className={[
          "relative overflow-hidden border border-white/[0.09] bg-[#070706] shadow-[0_26px_90px_rgba(0,0,0,.38)]",
          book
            ? "aspect-[0.69/1]"
            : "aspect-[1.12/1]",
        ].join(" ")}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 380px, 84vw"
          className="object-cover"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.03),transparent_48%,rgba(0,0,0,.46))]"
        />

        <div
          aria-hidden="true"
          className="absolute inset-4 border border-white/[0.045] sm:inset-5"
        />

        <span
          aria-hidden="true"
          className="absolute left-4 top-4 h-8 w-8 border-l border-t sm:left-5 sm:top-5"
          style={{ borderColor: `${GOLD_LIGHT}38` }}
        />
        <span
          aria-hidden="true"
          className="absolute bottom-4 right-4 h-8 w-8 border-b border-r sm:bottom-5 sm:right-5"
          style={{ borderColor: `${GOLD}26` }}
        />

        <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
          <div>
            <span
              className="block umbra-code"
              style={{ color: `${GOLD_LIGHT}64` }}
            >
              {label}
            </span>
            <span className="mt-1 block umbra-code text-white/[0.22]">
              {sublabel}
            </span>
          </div>

          <span className="umbra-code text-white/[0.24]">
            {projectNumber}
          </span>
        </div>
      </div>
    </figure>
  );
}

function DownloadTile({
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
      className="group flex min-h-[74px] items-center justify-between border border-[#c4a56b]/24 bg-[#0a0908] px-5 outline-none transition-[background-color,border-color,transform] duration-300 hover:-translate-y-px hover:border-[#dfc88f]/58 hover:bg-[#c4a56b]/[0.035] focus-visible:ring-1 focus-visible:ring-[#dfc88f]/80"
    >
      <span>
        <span
          className="block umbra-code"
          style={{ color: `${GOLD_LIGHT}68` }}
        >
          {meta}
        </span>
        <span className="mt-2 block text-[12px] text-white/[0.68]">
          {label}
        </span>
      </span>

      <Download
        aria-hidden="true"
        size={16}
        strokeWidth={1.05}
        className="text-[#dfc88f]/72 transition-transform duration-300 group-hover:translate-y-0.5"
      />
    </a>
  );
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
  const artwork = getArtwork(project);
  const projectNumber = getProjectNumber(project.id);

  const title = project.title.sr;
  const description =
    project.description?.sr ??
    project.shortDescription?.sr ??
    "";

  const platform = project.platform ?? "Umbra Studio";
  const sourceTitle = source?.title ?? "";
  const sourceAuthor = source?.author ?? "";

  return (
    <main
      data-umbra-scene="project-detail"
      className="min-h-screen overflow-x-clip bg-[var(--umbra-bg)] text-[var(--umbra-ink)]"
    >
      <section
        aria-labelledby="project-title"
        className="relative overflow-hidden border-b border-white/[0.055]"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 76% 18%, rgba(196,165,107,.045), transparent 29%), linear-gradient(180deg,#060605 0%,#050504 52%,#030302 100%)",
          }}
        />

        <div className="umbra-container relative pb-12 pt-32 sm:pb-16 sm:pt-36 lg:pb-20 lg:pt-40">
          <div className="flex items-center justify-between gap-6 border-b border-white/[0.05] pb-5">
            <Link
              href="/serije"
              data-cursor-interactive
              className="group inline-flex min-h-9 items-center gap-3 text-[7px] font-semibold uppercase tracking-[0.25em] text-white/[0.28] outline-none transition-colors duration-300 hover:text-white/[0.72] focus-visible:ring-1 focus-visible:ring-[#dfc88f]/80"
            >
              <ArrowLeft
                aria-hidden="true"
                size={13}
                strokeWidth={1.05}
                className="transition-transform duration-300 group-hover:-translate-x-1"
              />
              Projekti
            </Link>

            <span className="umbra-code">
              PROJECT / {projectNumber}
            </span>
          </div>

          <div className="grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end lg:gap-20 lg:py-16 xl:grid-cols-[minmax(0,1fr)_400px]">
            <div className="max-w-[920px]">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="umbra-code"
                  style={{ color: `${GOLD_LIGHT}86` }}
                >
                  {getTypeLabel(project.type)}
                </span>

                <span
                  aria-hidden="true"
                  className="h-px w-5 bg-white/[0.13]"
                />

                <span className="umbra-code text-white/[0.28]">
                  {getStatusLabel(project.status)}
                </span>
              </div>

              <h1
                id="project-title"
                className="mt-5 max-w-[920px] text-[clamp(3rem,7vw,7.2rem)] font-[430] uppercase leading-[0.86] tracking-[-0.07em] text-[var(--umbra-platinum)]"
              >
                {title}
              </h1>

              {sourceAuthor ? (
                <div className="mt-6">
                  <span
                    className="block umbra-code"
                    style={{ color: `${GOLD_LIGHT}5c` }}
                  >
                    AUTOR IZVORNOG DELA
                  </span>

                  <a
                    href="https://branislavbojcic.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor-interactive
                    aria-label={`Otvori sajt autora ${sourceAuthor}`}
                    className="group mt-2 inline-flex min-h-9 items-center gap-3 text-[13px] font-[430] tracking-[-0.02em] text-[#dfc88f]/86 outline-none transition-colors duration-300 hover:text-[#f0d7a0] focus-visible:ring-1 focus-visible:ring-[#dfc88f]/80 sm:text-[15px]"
                  >
                    {sourceAuthor}
                    <ArrowUpRight
                      aria-hidden="true"
                      size={13}
                      strokeWidth={1.05}
                      className="text-[#dfc88f]/48 transition-[color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#dfc88f]/86"
                    />
                  </a>
                </div>
              ) : null}

              <p className="mt-6 max-w-[700px] text-[12px] leading-6 text-[var(--umbra-ink-muted)] sm:text-[14px] sm:leading-7">
                {description}
              </p>

              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/[0.055] pt-4">
                <span className="umbra-code text-white/[0.25]">
                  PLATFORMA · {platform}
                </span>
                <span className="umbra-code text-white/[0.25]">
                  STATUS · {getStatusLabel(project.status)}
                </span>
                <span className="umbra-code text-white/[0.25]">
                  FORMAT · {getTypeLabel(project.type)}
                </span>
                {source ? (
                  <span className="umbra-code text-white/[0.25]">
                    IZVOR · {sourceTitle || "IZVORNO DELO"}
                  </span>
                ) : null}
              </div>
            </div>

            {hasSource ? (
              <ArtworkPanel
                src={
                  source?.coverSr ??
                  source?.coverEn ??
                  FALLBACK_IMAGE
                }
                alt={`Naslovna strana dela ${sourceTitle}`}
                projectNumber={projectNumber}
                label="IZVORNI ROMAN"
                sublabel={sourceAuthor || "UMBRA / SOURCE"}
                book
              />
            ) : isBiblija(project) ? (
              <ArtworkPanel
                src={artwork}
                alt={`Vizuelni identitet projekta ${title}`}
                projectNumber={projectNumber}
                label="VIZUELNI PRIKAZ"
                sublabel="UMBRA / PROJECT"
              />
            ) : null}
          </div>

          <div className="flex items-center justify-between border-t border-white/[0.05] pt-5">
            <span className="umbra-code hidden sm:block">
              PRIČA / SVET / PRODUKCIJA
            </span>

            <span className="ml-auto umbra-code">
              SCROLL / PROJECT DOSSIER
            </span>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="project-dossier-title"
        className="umbra-container py-16 sm:py-20 lg:py-28"
      >
        <div className="grid gap-10 lg:grid-cols-[180px_minmax(0,1fr)] lg:gap-16 xl:grid-cols-[210px_minmax(0,1fr)] xl:gap-20">
          <aside className="lg:border-r lg:border-white/[0.055] lg:pr-8">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-px w-7"
                style={{ background: `${GOLD_LIGHT}64` }}
              />
              <span className="umbra-code">
                01 / DOSSIER
              </span>
            </div>

            <div className="mt-7 hidden umbra-code text-white/[0.12] lg:block">
              UMBRA
              <br />
              PROJECT
              <br />
              {projectNumber}
            </div>
          </aside>

          <div className="max-w-[920px]">
            <span
              className="umbra-code"
              style={{ color: `${GOLD_LIGHT}70` }}
            >
              IZVORNI MATERIJAL / PROJEKT
            </span>

            <h2
              id="project-dossier-title"
              className="mt-5 max-w-[840px] text-[clamp(2.35rem,5vw,5.2rem)] font-[430] uppercase leading-[0.88] tracking-[-0.06em] text-[var(--umbra-platinum)]"
            >
              Projekat
              <br />
              <span className="font-serif normal-case italic text-white/[0.55]">
                u fokusu
              </span>
            </h2>

            <p className="mt-7 max-w-[780px] text-[13px] leading-7 text-white/[0.38] sm:text-[14px] sm:leading-8">
              {hasSource
                ? `„${sourceTitle}“ autora ${sourceAuthor || "izvornog autora"} predstavlja književnu osnovu ovog projekta.`
                : description}
            </p>

            <div className="mt-9 grid border-y border-white/[0.055] sm:grid-cols-2 lg:grid-cols-4">
              <ProjectStat
                label="Format"
                value={getTypeLabel(project.type)}
              />
              <ProjectStat
                label="Platforma"
                value={platform}
              />
              <ProjectStat
                label="Status"
                value={getStatusLabel(project.status)}
              />
              <ProjectStat
                label="Autor"
                value={sourceAuthor || "—"}
                last
              />
            </div>
          </div>
        </div>
      </section>

      {hasSource && source ? (
        <section
          aria-labelledby="source-title"
          className="border-y border-white/[0.055] bg-[var(--umbra-surface)]"
        >
          <div className="umbra-container py-16 sm:py-20 lg:py-28">
            <div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:items-center lg:gap-20">
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                {source.pdfSr ? (
                  <BookCover
                    href={source.pdfSr}
                    downloadName="mrzim-svog-brata-sr.pdf"
                    src={
                      source.coverSr ??
                      source.coverEn ??
                      FALLBACK_IMAGE
                    }
                    alt="Naslovna strana srpskog izdanja"
                    label="SR / IZDANJE"
                  />
                ) : null}

                {source.pdfEn ? (
                  <BookCover
                    href={source.pdfEn}
                    downloadName="mrzim-svog-brata-en.pdf"
                    src={
                      source.coverEn ??
                      source.coverSr ??
                      FALLBACK_IMAGE
                    }
                    alt="Naslovna strana engleskog izdanja"
                    label="EN / EDITION"
                  />
                ) : null}
              </div>

              <div className="max-w-[760px]">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="h-px w-8"
                    style={{ background: `${GOLD_LIGHT}70` }}
                  />
                  <span
                    className="umbra-code"
                    style={{ color: `${GOLD_LIGHT}78` }}
                  >
                    IZVORNI MATERIJAL
                  </span>
                </div>

                <h2
                  id="source-title"
                  className="mt-5 text-[clamp(2.35rem,5vw,5rem)] font-[430] uppercase leading-[0.88] tracking-[-0.06em] text-[var(--umbra-platinum)]"
                >
                  Pročitaj
                  <br />
                  <span className="font-serif normal-case italic text-white/[0.56]">
                    roman
                  </span>
                </h2>

                <p className="mt-6 max-w-[680px] text-[13px] leading-7 text-white/[0.38] sm:text-[14px] sm:leading-8">
                  „{sourceTitle}“
                  {sourceAuthor
                    ? ` autora ${sourceAuthor}`
                    : ""}{" "}
                  predstavlja književnu osnovu ovog Umbra projekta. Ovde su dostupna izdanja koja su trenutno povezana sa projektom.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {source.pdfSr ? (
                    <DownloadTile
                      href={source.pdfSr}
                      label="Preuzmi srpski PDF"
                      meta="SR / PDF"
                      downloadName="mrzim-svog-brata-sr.pdf"
                    />
                  ) : null}

                  {source.pdfEn ? (
                    <DownloadTile
                      href={source.pdfEn}
                      label="Preuzmi engleski PDF"
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
                    className="group mt-5 inline-flex min-h-9 items-center gap-3 text-[7px] font-semibold uppercase tracking-[0.25em] text-white/[0.28] outline-none transition-colors duration-300 hover:text-[#dfc88f] focus-visible:ring-1 focus-visible:ring-[#dfc88f]/80"
                  >
                    <ExternalLink
                      aria-hidden="true"
                      size={13}
                      strokeWidth={1.05}
                    />
                    Otvori javni izvor
                    <ArrowUpRight
                      aria-hidden="true"
                      size={12}
                      strokeWidth={1.05}
                      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>
                ) : null}

                <div className="mt-8 border-t border-white/[0.055] pt-4 umbra-code text-white/[0.17]">
                  {sourceAuthor || "IZVOR"} / {sourceTitle}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {project.slug === "mrzim-svog-brata" ? (
        <section
          aria-labelledby="project-characters-title"
          className="umbra-container py-16 sm:py-20 lg:py-28"
        >
          <div className="border-t border-white/[0.055] pt-8">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end lg:gap-16">
              <div>
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="h-px w-8"
                    style={{ background: `${GOLD_LIGHT}70` }}
                  />
                  <span
                    className="umbra-code"
                    style={{ color: `${GOLD_LIGHT}72` }}
                  >
                    GLUMAČKA POSTAVA
                  </span>
                </div>

                <h2
                  id="project-characters-title"
                  className="mt-5 max-w-[780px] text-[clamp(2.35rem,5vw,5.1rem)] font-[430] uppercase leading-[0.88] tracking-[-0.06em] text-[var(--umbra-platinum)]"
                >
                  Likovi
                  <br />
                  <span className="font-serif normal-case italic text-white/[0.55]">
                    nose priču
                  </span>
                </h2>

                <p className="mt-6 max-w-[650px] text-[13px] leading-7 text-white/[0.38] sm:text-[14px] sm:leading-8">
                  Istraži javnu arhivu likova i otvori pojedinačne dosijee sveta koji nastaje oko projekta.
                </p>
              </div>

              <Link
                href="/likovi"
                data-cursor-interactive
                className="group flex min-h-[76px] items-center justify-between border border-white/[0.07] bg-white/[0.008] px-5 outline-none transition-[background-color,border-color,transform] duration-300 hover:-translate-y-px hover:border-[#dfc88f]/34 hover:bg-[#c4a56b]/[0.018] focus-visible:ring-1 focus-visible:ring-[#dfc88f]/80"
              >
                <span>
                  <span className="block umbra-code text-white/[0.18]">
                    CHARACTER ARCHIVE
                  </span>
                  <span className="mt-2 block text-[13px] text-white/[0.62]">
                    Otvori arhivu likova
                  </span>
                </span>

                <ArrowUpRight
                  aria-hidden="true"
                  size={16}
                  strokeWidth={1.05}
                  className="text-white/[0.28] transition-[color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#dfc88f]"
                />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <section
        aria-label="Navigacija projekta"
        className="umbra-container border-t border-white/[0.055] pb-24 pt-8 sm:pb-28"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/serije"
            data-cursor-interactive
            className="group flex min-h-[92px] items-center justify-between border border-white/[0.065] bg-white/[0.008] px-6 outline-none transition-[background-color,border-color,transform] duration-300 hover:-translate-y-px hover:border-[#c4a56b]/32 hover:bg-[#c4a56b]/[0.018] focus-visible:ring-1 focus-visible:ring-[#dfc88f]/80 sm:px-8"
          >
            <span>
              <span className="block umbra-code text-white/[0.18]">
                ARHIVA PROJEKATA
              </span>
              <span className="mt-2 block text-[16px] tracking-[-0.025em] text-white/[0.66]">
                Svi projekti
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
            data-cursor-interactive
            className="group flex min-h-[92px] items-center justify-between border border-white/[0.065] bg-white/[0.008] px-6 outline-none transition-[background-color,border-color,transform] duration-300 hover:-translate-y-px hover:border-[#c4a56b]/32 hover:bg-[#c4a56b]/[0.018] focus-visible:ring-1 focus-visible:ring-[#dfc88f]/80 sm:px-8"
          >
            <span>
              <span className="block umbra-code text-white/[0.18]">
                CHARACTER ARCHIVE
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

function BookCover({
  href,
  downloadName,
  src,
  alt,
  label,
}: {
  href: string;
  downloadName: string;
  src: string;
  alt: string;
  label: string;
}) {
  return (
    <div>
      <a
        href={href}
        download={downloadName}
        data-cursor-interactive
        aria-label={label}
        className="group block outline-none focus-visible:ring-1 focus-visible:ring-[#dfc88f]/80"
      >
        <div className="relative aspect-[0.69/1] overflow-hidden border border-white/[0.08] bg-[#060605] shadow-[0_22px_70px_rgba(0,0,0,.28)] transition-[border-color,box-shadow] duration-400 group-hover:border-[#c4a56b]/45 group-hover:shadow-[0_26px_85px_rgba(0,0,0,.38)]">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 220px, 45vw"
            className="object-cover transition-transform duration-[1100ms] group-hover:scale-[1.02]"
          />

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.02),transparent_42%,rgba(0,0,0,.50))]"
          />

          <div
            aria-hidden="true"
            className="absolute inset-3 border border-white/[0.045]"
          />

          <div className="absolute inset-x-4 bottom-4 flex items-center justify-between">
            <span className="umbra-code text-white/[0.34]">
              PDF
            </span>
            <Download
              aria-hidden="true"
              size={14}
              strokeWidth={1.05}
              className="text-[#dfc88f]/72 transition-transform duration-300 group-hover:translate-y-0.5"
            />
          </div>
        </div>
      </a>

      <div className="mt-3 umbra-code text-white/[0.22]">
        {label}
      </div>
    </div>
  );
}
