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
  getProject,
  projects,
} from "@/lib/content";
import type {
  ProjectStatus,
  ProjectType,
} from "@/lib/content/types";

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
  const project = projects.find(
    (item) => item.slug === slug,
  );

  if (!project) {
    return {
      title: "Projekat nije pronađen",
      description:
        "Traženi Umbra Studio projekat nije pronađen",
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
      : "/umbra-background.png");

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
      images: artwork,
    },
  };
}

function getStatusLabel(
  status: ProjectStatus,
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
  type: ProjectType,
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

function getProjectNumber(id: string) {
  const match = id.match(/(\d+)$/);

  return (
    match?.[1]?.padStart(2, "0") ?? "00"
  );
}

function isBiblija(projectSlug: string) {
  return projectSlug === "biblija";
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const project = projects.find(
    (item) => item.slug === slug,
  );

  if (!project) {
    notFound();
  }

  const canonicalProject =
    getProject(project.id);

  if (!canonicalProject) {
    notFound();
  }

  const source = canonicalProject.source;
  const hasSource = Boolean(source);

  const artwork =
    source?.coverSr ??
    source?.coverEn ??
    (canonicalProject.slug === "biblija"
      ? "/Biblija Cover.png"
      : "/umbra-background.png");

  const projectNumber = getProjectNumber(
    canonicalProject.id,
  );

  const showBiblijaArtwork =
    isBiblija(canonicalProject.slug);

  const projectTitle =
    canonicalProject.title.sr;

  const projectDescription =
    canonicalProject.description?.sr ??
    canonicalProject.shortDescription?.sr ??
    "";

  const sourceTitle = source?.title ?? "";
  const sourceAuthor = source?.author ?? "";

  const projectPlatform =
    canonicalProject.platform ?? "Umbra Studio";

  return (
    <main
      data-umbra-scene="project-detail"
      className="min-h-screen overflow-hidden bg-[var(--umbra-bg)] text-[#f1ede4]"
    >
      <section
        aria-labelledby="project-title"
        className="relative min-h-[100svh] overflow-hidden"
      >
        <Image
          src={artwork}
          alt=""
          fill
          priority
          sizes="100vw"
          className={
            hasSource
              ? "object-cover scale-[1.045] opacity-[0.38] blur-[1px]"
              : "object-cover scale-[1.03] opacity-[0.54]"
          }
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[var(--umbra-bg)]/60"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,.98)_0%,rgba(5,5,5,.92)_28%,rgba(5,5,5,.55)_62%,rgba(5,5,5,.86)_100%)]"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(0deg,rgba(5,5,5,.99)_0%,rgba(5,5,5,.16)_44%,rgba(5,5,5,.55)_100%)]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_38%,rgba(185,154,97,.11),transparent_33%)]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-5 border border-white/[0.07] sm:inset-7 lg:inset-10"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-5 top-5 h-14 w-14 border-l border-t border-[#b99a61]/45 sm:left-7 sm:top-7 lg:left-10 lg:top-10"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-5 right-5 h-14 w-14 border-b border-r border-[#b99a61]/30 sm:bottom-7 sm:right-7 lg:bottom-10 lg:right-10"
        />

        <div className="relative mx-auto flex min-h-[100svh] max-w-[1440px] flex-col justify-between px-5 pb-12 pt-36 sm:px-8 sm:pb-16 lg:px-12 lg:pt-44">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-px w-9 bg-[#b99a61]/70"
              />

              <span className="text-[8px] uppercase tracking-[0.36em] text-white/45">
                Umbra Studio / Projekat
              </span>
            </div>

            <span className="font-mono text-[7px] tracking-[0.24em] text-white/[0.22]">
              PROJECT / {projectNumber}
            </span>
          </div>

          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_370px]">
            <div className="max-w-[1000px]">
              <div className="mb-6 flex flex-wrap items-center gap-4 text-[7px] uppercase tracking-[0.3em] text-white/34">
                <span>
                  {getTypeLabel(
                    canonicalProject.type,
                  )}
                </span>

                <span
                  aria-hidden="true"
                  className="h-px w-6 bg-white/[0.12]"
                />

                <span>
                  {getStatusLabel(
                    canonicalProject.status,
                  )}
                </span>
              </div>

              <h1
                id="project-title"
                className="max-w-[1050px] text-[clamp(4rem,9.5vw,10rem)] font-[440] leading-[0.8] tracking-[-0.075em]"
              >
                {projectTitle}
              </h1>

              {sourceAuthor ? (
                <div className="mt-8">
                  <span className="block text-[7px] font-semibold uppercase tracking-[0.32em] text-[#ead39a]/45">
                    Autor izvornog dela
                  </span>

                  <a
                    href="https://branislavbojcic.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor-interactive
                    aria-label={`Otvori sajt autora ${sourceAuthor}`}
                    className="group/author mt-2 inline-flex items-center gap-3 rounded-sm outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/65"
                  >
                    <span className="text-[clamp(1.1rem,1.8vw,1.45rem)] font-[430] tracking-[-0.025em] text-[#ead39a]/90 transition-colors duration-300 group-hover/author:text-[#f4ddb0]">
                      {sourceAuthor}
                    </span>

                    <ArrowUpRight
                      aria-hidden="true"
                      size={15}
                      strokeWidth={1.05}
                      className="text-[#ead39a]/52 transition-[color,transform] duration-300 group-hover/author:-translate-y-0.5 group-hover/author:translate-x-0.5 group-hover/author:text-[#ead39a]/88"
                    />
                  </a>

                  <div className="mt-2 flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="h-px w-8 bg-[#c7a96b]/35"
                    />

                    <span className="text-[7px] uppercase tracking-[0.28em] text-white/[0.22]">
                      Izvorni roman
                    </span>
                  </div>
                </div>
              ) : null}

              <p className="mt-6 max-w-[730px] text-sm leading-7 text-white/44 sm:text-base sm:leading-8">
                {projectDescription}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/[0.09] pt-5 text-[7px] uppercase tracking-[0.27em] text-white/28">
                <span>
                  Platforma ·{" "}
                  {projectPlatform}
                </span>

                <span>
                  Status ·{" "}
                  {getStatusLabel(
                    canonicalProject.status,
                  )}
                </span>

                <span>
                  Format ·{" "}
                  {getTypeLabel(
                    canonicalProject.type,
                  )}
                </span>

                {source ? (
                  <span>
                    Izvor · Roman
                  </span>
                ) : null}
              </div>
            </div>

            {source ? (
              <BookHeroPanel
                src={
                  source.coverSr ??
                  source.coverEn ??
                  "/umbra-background.png"
                }
                alt={`Naslovna strana dela ${sourceTitle}`}
                projectNumber={projectNumber}
                author={sourceAuthor}
              />
            ) : showBiblijaArtwork ? (
              <ProjectHeroPanel
                src={artwork}
                alt={`Vizuelni identitet projekta ${projectTitle}`}
                projectNumber={projectNumber}
              />
            ) : null}
          </div>

          <div className="flex items-end justify-between">
            <div className="hidden sm:block">
              <div className="font-mono text-[6px] uppercase tracking-[0.24em] text-white/[0.18]">
                PRIČA / KADAR / POKRET
              </div>

              <div
                aria-hidden="true"
                className="mt-3 h-px w-24 bg-gradient-to-r from-[#b99a61]/50 to-transparent"
              />
            </div>

            <div className="ml-auto flex items-center gap-3 text-[7px] uppercase tracking-[0.28em] text-white/28">
              <span
                aria-hidden="true"
                className="h-5 w-px bg-white/[0.12]"
              />
              Skroluj za ulazak
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="project-dossier-title"
        className="px-5 py-28 sm:px-8 sm:py-36 lg:px-12"
      >
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-16 lg:grid-cols-[200px_1fr]">
            <div className="lg:border-r lg:border-white/[0.07] lg:pr-10">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-px w-8 bg-[#b99a61]/60"
                />

                <span className="text-[7px] uppercase tracking-[0.3em] text-white/25">
                  01 / Projekat
                </span>
              </div>

              <div className="mt-8 hidden font-mono text-[8px] uppercase leading-7 tracking-[0.22em] text-white/[0.16] lg:block">
                UMBRA
                <br />
                PROJECT
                <br />
                {projectNumber}
              </div>
            </div>

            <div className="max-w-[950px]">
              <div className="text-[7px] uppercase tracking-[0.3em] text-[#d6b776]">
                Izvorni materijal
              </div>

              <h2
                id="project-dossier-title"
                className="mt-5 text-[clamp(2.7rem,5vw,5.8rem)] font-[430] leading-[0.9] tracking-[-0.06em]"
              >
                Priča
                <br />
                <span className="font-serif italic text-white/62">
                  postaje filmski svet
                </span>
              </h2>

              <p className="mt-9 max-w-[780px] text-[15px] leading-8 text-white/42">
                {source
                  ? `${sourceAuthor} je autor dela „${sourceTitle}“, koje predstavlja književnu osnovu ovog projekta. Umbra Studio razvija adaptaciju kroz likove, atmosferu i filmsko pripovedanje, uz zadržavanje izvornog dela kao temelja.`
                  : projectDescription}
              </p>

              <div className="mt-12 grid border-y border-white/[0.07] sm:grid-cols-4">
                <ProjectStat
                  label="FORMAT"
                  value={getTypeLabel(
                    canonicalProject.type,
                  )}
                />

                <ProjectStat
                  label="PLATFORMA"
                  value={projectPlatform}
                />

                <ProjectStat
                  label="STATUS"
                  value={getStatusLabel(
                    canonicalProject.status,
                  )}
                />

                <ProjectStat
                  label="AUTOR"
                  value={sourceAuthor || "—"}
                  last
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {hasSource && source ? (
        <section
          aria-labelledby="book-source-title"
          className="border-y border-white/[0.07] bg-[#080808] px-5 py-24 sm:px-8 sm:py-32 lg:px-12"
        >
          <div className="mx-auto max-w-[1440px]">
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
                    alt="Naslovna strana srpskog izdanja"
                    label="SR / IZDANJE · PREUZMI PDF"
                    downloadLabel="Preuzmi srpski PDF"
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
                    alt="Naslovna strana engleskog izdanja"
                    label="EN / IZDANJE · PREUZMI PDF"
                    downloadLabel="Preuzmi engleski PDF"
                  />
                ) : null}
              </div>

              <div className="max-w-[760px]">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="h-px w-8 bg-[#b99a61]/70"
                  />

                  <span className="text-[7px] uppercase tracking-[0.32em] text-[#d6b776]">
                    Izvorni materijal
                  </span>
                </div>

                <h2
                  id="book-source-title"
                  className="mt-5 text-[clamp(2.5rem,5vw,5.2rem)] font-[430] leading-[0.9] tracking-[-0.06em]"
                >
                  Pročitaj
                  <br />
                  <span className="font-serif italic text-white/62">
                    roman
                  </span>
                </h2>

                <p className="mt-7 max-w-[680px] text-sm leading-7 text-white/40 sm:text-base sm:leading-8">
                  „{sourceTitle}“ autora{" "}
                  {sourceAuthor} predstavlja
                  književnu osnovu ovog Umbra projekta.
                  Ovde su dostupna izdanja koja su
                  trenutno povezana sa projektom.
                </p>

                <div className="mt-10 grid gap-3 sm:grid-cols-2">
                  {source.pdfSr ? (
                    <DownloadButton
                      href={source.pdfSr}
                      label="Preuzmi srpski PDF"
                      meta="SR / PDF"
                      downloadName="mrzim-svog-brata-sr.pdf"
                    />
                  ) : null}

                  {source.pdfEn ? (
                    <DownloadButton
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
                    className="group mt-4 inline-flex items-center gap-3 text-[7px] uppercase tracking-[0.28em] text-white/28 transition-colors hover:text-[#d6b776]"
                  >
                    <ExternalLink
                      size={13}
                      strokeWidth={1.15}
                    />

                    Otvori javni izvor

                    <ArrowUpRight
                      size={13}
                      strokeWidth={1.15}
                      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>
                ) : null}

                <div className="mt-9 border-t border-white/[0.07] pt-4 text-[7px] uppercase tracking-[0.24em] text-white/[0.2]">
                  {sourceAuthor} /{" "}
                  {sourceTitle}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {canonicalProject.slug ===
      "mrzim-svog-brata" ? (
        <section
          aria-labelledby="project-characters-title"
          className="px-5 py-28 sm:px-8 sm:py-36 lg:px-12"
        >
          <div className="mx-auto max-w-[1440px] border-t border-white/[0.07] pt-8">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <div className="text-[7px] uppercase tracking-[0.3em] text-[#d6b776]">
                  Glumačka postava / Dosijei
                </div>

                <h2
                  id="project-characters-title"
                  className="mt-4 text-4xl font-[430] tracking-[-0.045em] sm:text-5xl"
                >
                  Likovi projekta
                </h2>

                <p className="mt-4 max-w-[640px] text-sm leading-7 text-white/38">
                  Istraži javnu arhivu likova i
                  otvori pojedinačne dosijee.
                </p>
              </div>

              <Link
                href="/likovi"
                data-cursor-interactive
                className="group inline-flex items-center gap-3 text-[7px] uppercase tracking-[0.28em] text-white/32 transition-colors hover:text-[#d6b776]"
              >
                Otvori arhivu likova

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

      <section
        aria-label="Navigacija projekta"
        className="px-5 pb-28 sm:px-8 sm:pb-36 lg:px-12"
      >
        <div className="mx-auto max-w-[1440px] border-t border-white/[0.08] pt-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <Link
              href="/serije"
              data-cursor-interactive
              className="group flex min-h-[100px] items-center justify-between border border-white/[0.08] bg-white/[0.015] px-6 transition-all duration-500 hover:border-[#b99a61]/35 hover:bg-[#b99a61]/[0.025] sm:px-8"
            >
              <div>
                <div className="text-[7px] uppercase tracking-[0.28em] text-white/22">
                  Arhiva
                </div>

                <div className="mt-3 text-xl tracking-[-0.04em] text-white/72">
                  Svi projekti
                </div>
              </div>

              <ArrowLeft
                aria-hidden="true"
                size={17}
                strokeWidth={1.15}
                className="text-white/28 transition-transform duration-500 group-hover:-translate-x-1 group-hover:text-[#d6b776]"
              />
            </Link>

            <Link
              href="/likovi"
              data-cursor-interactive
              className="group flex min-h-[100px] items-center justify-between border border-white/[0.08] bg-white/[0.015] px-6 transition-all duration-500 hover:border-[#b99a61]/35 hover:bg-[#b99a61]/[0.025] sm:px-8"
            >
              <div>
                <div className="text-[7px] uppercase tracking-[0.28em] text-white/22">
                  Arhiva likova
                </div>

                <div className="mt-3 text-xl tracking-[-0.04em] text-white/72">
                  Istraži likove
                </div>
              </div>

              <ArrowUpRight
                aria-hidden="true"
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
    <div className="relative mx-auto w-full max-w-[300px]">
      <div
        aria-hidden="true"
        className="absolute -inset-3 border border-white/[0.035]"
      />

      <div
        aria-hidden="true"
        className="absolute -inset-1.5 border border-[#b99a61]/10"
      />

      <div className="relative aspect-[0.69/1] overflow-hidden border border-white/[0.1] bg-[#070707] shadow-[0_30px_100px_rgba(0,0,0,.45)]">
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 300px, 70vw"
          className="object-cover"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.04),transparent_45%,rgba(0,0,0,.54))]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-4 border border-white/[0.055]"
        />

        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-4 h-8 w-8 border-l border-t border-[#d6b776]/35"
        />

        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-4 right-4 h-8 w-8 border-b border-r border-[#b99a61]/25"
        />

        <div className="pointer-events-none absolute inset-x-5 bottom-5 flex items-end justify-between">
          <span className="text-[6px] uppercase tracking-[0.3em] text-white/38">
            Izvorni roman
          </span>

          <span className="font-mono text-[6px] tracking-[0.22em] text-white/28">
            {projectNumber}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between px-1 text-[7px] uppercase tracking-[0.25em] text-white/25">
        <span>{author}</span>
        <span>Roman</span>
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
    <div className="relative mx-auto w-full max-w-[360px]">
      <div
        aria-hidden="true"
        className="absolute -inset-4 border border-white/[0.03]"
      />

      <div
        aria-hidden="true"
        className="absolute -inset-2 border border-[#b99a61]/10"
      />

      <div className="relative overflow-hidden border border-white/[0.095] bg-[#080808] shadow-[0_30px_100px_rgba(0,0,0,.42)]">
        <div className="relative aspect-[1.18/1]">
          <Image
            src={src}
            alt={alt}
            fill
            priority
            sizes="(min-width: 1024px) 360px, 84vw"
            className="object-cover"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.03),transparent_48%,rgba(0,0,0,.48))]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-4 border border-white/[0.05]"
          />

          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-4 h-8 w-8 border-l border-t border-[#d6b776]/32"
          />

          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-4 right-4 h-8 w-8 border-b border-r border-[#b99a61]/24"
          />

          <div className="pointer-events-none absolute inset-x-5 bottom-5 flex items-end justify-between">
            <span className="text-[6px] uppercase tracking-[0.3em] text-white/38">
              Vizuelni kadar
            </span>

            <span className="font-mono text-[6px] tracking-[0.22em] text-white/26">
              {projectNumber}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between px-1 text-[7px] uppercase tracking-[0.25em] text-white/25">
        <span>BIBLIJA</span>
        <span>Umbra projekat</span>
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

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.03),transparent_42%,rgba(0,0,0,.52))]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-3 border border-white/[0.045]"
          />

          <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-center justify-between">
            <span className="text-[6px] uppercase tracking-[0.24em] text-white/38">
              PDF
            </span>

            <Download
              aria-hidden="true"
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
      className="group flex min-h-[76px] items-center justify-between border border-[#b99a61]/30 bg-[#0b0a08] px-5 transition-[border-color,background-color] duration-400 hover:border-[#d6b776]/70 hover:bg-[#b99a61]/[0.045]"
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
        aria-hidden="true"
        size={17}
        strokeWidth={1.15}
        className="text-[#d6b776] transition-transform duration-300 group-hover:translate-y-0.5"
      />
    </a>
  );
}