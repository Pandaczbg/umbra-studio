"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clapperboard, Layers3 } from "lucide-react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

import type {
  LocalizedText,
  ProjectContent,
} from "@/lib/content/types";

type Locale = "sr" | "en";

const GOLD = "#c4a56b";
const GOLD_LIGHT = "#dfc88f";
const GOLD_DARK = "#8d6f43";
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
  projects: readonly ProjectContent[];
};

const COPY = {
  sr: {
    eyebrow: "PROJEKTI",
    scene: "02 / 05",
    title: "Priče u fokusu",
    intro:
      "Umbra razvija više priča i produkcija paralelno. Svaki projekat ima svoj svet, ton i put.",
    archive: "Svi projekti",
    enter: "Uđi u projekat",
    novel: "Po romanu",
    authorAria: "Otvori sajt Branislava Bojčića",
    original: "UMBRA ORIGINAL",
    project: "PROJEKAT",
    worlds: "NAŠE PRIČE",
    projectFallback: "Projekat",
    status: "STATUS",
    platform: "PLATFORMA",
    open: "OTVORI",
    count: "U FOKUSU STUDIJA",
  },
  en: {
    eyebrow: "PROJECTS",
    scene: "02 / 05",
    title: "Stories in focus",
    intro:
      "Umbra develops multiple stories and productions in parallel. Each project has its own world, tone and path.",
    archive: "All projects",
    enter: "Enter project",
    novel: "Novel by",
    authorAria: "Open Branislav Bojčić's website",
    original: "UMBRA ORIGINAL",
    project: "PROJECT",
    worlds: "OUR STORIES",
    projectFallback: "Project",
    status: "STATUS",
    platform: "PLATFORM",
    open: "OPEN",
    count: "STUDIO FOCUS",
  },
} as const;

function getLocalizedText(
  text: LocalizedText | undefined,
  locale: Locale,
): string {
  if (!text) {
    return "";
  }

  return text[locale] || text.sr || text.en || "";
}

function resolveProjectImage(
  project: ProjectContent,
  locale: Locale,
): string {
  if (locale === "en") {
    return (
      project.source?.coverEn ||
      project.source?.coverSr ||
      FALLBACK_IMAGE
    );
  }

  return (
    project.source?.coverSr ||
    project.source?.coverEn ||
    FALLBACK_IMAGE
  );
}

function getProjectHref(slug: string, locale: Locale): string {
  return locale === "en"
    ? `/en/projects/${slug}`
    : `/serije/${slug}`;
}

function ProjectAuthor({
  sourceAuthor,
  copy,
}: {
  sourceAuthor: string | null;
  copy: (typeof COPY)["sr"] | (typeof COPY)["en"];
}) {
  if (sourceAuthor) {
    return (
      <a
        href={AUTHOR_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${copy.authorAria}: ${sourceAuthor}`}
        className="inline-flex min-h-10 max-w-full items-center gap-2 text-[8px] font-semibold uppercase tracking-[0.18em] outline-none transition-colors duration-300 hover:text-white focus-visible:ring-1 focus-visible:ring-[#dfc88f]/70"
        style={{ color: `${GOLD_LIGHT}b0` }}
      >
        <span className="truncate">
          {copy.novel} {sourceAuthor}
        </span>
        <ArrowUpRight
          aria-hidden="true"
          className="h-3.5 w-3.5 shrink-0"
          strokeWidth={1.1}
        />
      </a>
    );
  }

  return (
    <span
      className="inline-flex min-h-10 items-center gap-2 text-[8px] font-semibold uppercase tracking-[0.18em]"
      style={{ color: `${GOLD_LIGHT}8a` }}
    >
      <Clapperboard
        aria-hidden="true"
        className="h-3.5 w-3.5"
        strokeWidth={1.1}
      />
      {copy.original}
    </span>
  );
}

export default function CurrentProjectScene({
  locale = "sr",
  projects,
}: CurrentProjectSceneProps) {
  const reducedMotion = useReducedMotion() ?? false;
  const copy = COPY[locale];
  const sectionRef = useRef<HTMLElement | null>(null);

  const inView = useInView(sectionRef, {
    once: true,
    amount: 0.12,
  });

  if (projects.length === 0) {
    return null;
  }

  const statusLabels = locale === "en" ? STATUS_EN : STATUS_SR;
  const archiveHref = locale === "en" ? "/en/projects" : "/serije";

  return (
    <section
      id="current-project"
      ref={sectionRef}
      data-umbra-scene="project"
      aria-labelledby="projects-title"
      className="relative overflow-hidden border-b border-white/[0.055] bg-[var(--umbra-bg-deep)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 78% 16%, rgba(223,200,143,.032), transparent 30%), linear-gradient(180deg, #030302 0%, #060605 54%, #030302 100%)",
          }}
        />
        <div className="absolute inset-0 opacity-[0.012] [background-image:radial-gradient(rgba(255,255,255,.22)_0.5px,transparent_.6px)] [background-size:4px_4px]" />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(196,165,107,.24), transparent)",
        }}
      />

      <div className="umbra-container relative py-16 sm:py-20 lg:py-24">
        <motion.header
          initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{
            duration: reducedMotion ? 0 : 0.58,
            ease: EASE,
          }}
          className="border-b border-white/[0.055] pb-6 sm:pb-7"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
            <div className="max-w-4xl">
              <div className="mb-4 flex items-center gap-3">
                <span className="umbra-label">{copy.eyebrow}</span>
                <span
                  aria-hidden="true"
                  className="h-px w-8"
                  style={{ background: "rgba(196,165,107,.30)" }}
                />
                <span className="umbra-code">{copy.scene}</span>
              </div>

              <h2
                id="projects-title"
                className="umbra-display-tight max-w-4xl text-[clamp(2.3rem,6vw,5.55rem)] font-[430] text-[var(--umbra-platinum)]"
              >
                {copy.title}
              </h2>
            </div>

            <div className="max-w-[360px] lg:pb-1 lg:text-right">
              <p className="text-[12px] leading-6 text-[var(--umbra-ink-muted)] sm:text-[13px]">
                {copy.intro}
              </p>

              <Link
                href={archiveHref}
                className="mt-5 inline-flex min-h-10 items-center gap-3 text-[8px] font-semibold uppercase tracking-[0.24em] outline-none transition-colors duration-300 hover:text-white focus-visible:ring-1 focus-visible:ring-[#dfc88f]/70"
                style={{ color: `${GOLD_LIGHT}b0` }}
              >
                {copy.archive}
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-3.5 w-3.5"
                  strokeWidth={1.1}
                />
              </Link>
            </div>
          </div>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: reducedMotion ? 0 : 16 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{
            delay: reducedMotion ? 0 : 0.04,
            duration: reducedMotion ? 0 : 0.64,
            ease: EASE,
          }}
          className="mt-10 sm:mt-12"
        >
          <div className="mb-5 flex items-end justify-between gap-6 border-b border-white/[0.06] pb-4">
            <div>
              <p className="umbra-label">{copy.count}</p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.20em] text-white/[0.24]">
                {copy.worlds}
              </p>
            </div>

            <span className="umbra-code">
              {String(projects.length).padStart(2, "0")}
            </span>
          </div>

          <div
            className={[
              "grid gap-5 lg:gap-6",
              projects.length === 1
                ? "mx-auto max-w-[900px]"
                : projects.length === 2
                  ? "md:grid-cols-2"
                  : "md:grid-cols-2 xl:grid-cols-3",
            ].join(" ")}
          >
            {projects.map((project, index) => {
              const image = resolveProjectImage(project, locale);
              const title =
                getLocalizedText(project.title, locale) ||
                copy.projectFallback;
              const description = getLocalizedText(
                project.shortDescription ?? project.description,
                locale,
              );
              const href = getProjectHref(project.slug, locale);
              const sourceAuthor =
                project.source?.author?.trim() || null;
              const platform = project.platform?.trim() || null;

              return (
                <motion.article
                  key={project.id}
                  initial={{
                    opacity: 0,
                    y: reducedMotion ? 0 : 14,
                  }}
                  animate={
                    inView ? { opacity: 1, y: 0 } : undefined
                  }
                  transition={{
                    delay: reducedMotion
                      ? 0
                      : 0.10 + index * 0.06,
                    duration: reducedMotion ? 0 : 0.62,
                    ease: EASE,
                  }}
                  className="group overflow-hidden border border-white/[0.075] bg-[linear-gradient(180deg,rgba(255,255,255,.012),rgba(255,255,255,.004)),#070706] shadow-[0_18px_48px_rgba(0,0,0,.16)] transition-[border-color,transform,box-shadow] duration-500 hover:-translate-y-0.5 hover:border-[rgba(223,200,143,.14)] hover:shadow-[0_24px_64px_rgba(0,0,0,.22)]"
                >
                  <Link
                    href={href}
                    aria-label={title}
                    className="relative block outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#dfc88f]/80"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#050504]">
                      <Image
                        src={image}
                        alt=""
                        fill
                        sizes="(min-width: 1280px) 31vw, (min-width: 768px) 47vw, 94vw"
                        className="object-cover transition-transform duration-[1150ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.03]"
                      />

                      <div
                        aria-hidden="true"
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(180deg, rgba(0,0,0,.02) 0%, transparent 36%, rgba(0,0,0,.84) 100%)",
                        }}
                      />

                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-4 border border-white/[0.05] sm:inset-6"
                      />

                      <span
                        aria-hidden="true"
                        className="absolute left-4 top-4 h-7 w-7 border-l border-t sm:left-6 sm:top-6 sm:h-8 sm:w-8"
                        style={{ borderColor: `${GOLD}30` }}
                      />

                      <span
                        aria-hidden="true"
                        className="absolute bottom-4 right-4 h-7 w-7 border-b border-r sm:bottom-6 sm:right-6 sm:h-8 sm:w-8"
                        style={{ borderColor: `${GOLD}1d` }}
                      />

                      <div className="absolute left-5 right-5 top-5 flex items-center justify-between gap-4 sm:left-6 sm:right-6 sm:top-6">
                        <span className="umbra-code text-white/[0.34]">
                          {copy.project}{" "}
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <span
                          className="text-[7px] uppercase tracking-[0.20em]"
                          style={{
                            color:
                              project.status === "in-production"
                                ? `${GOLD_LIGHT}88`
                                : "rgba(255,255,255,.30)",
                          }}
                        >
                          {statusLabels[project.status]}
                        </span>
                      </div>

                      <div className="absolute inset-x-5 bottom-5 sm:inset-x-6 sm:bottom-6">
                        <div className="mb-2 flex items-center gap-3">
                          <span
                            className="text-[7px] font-semibold uppercase tracking-[0.22em]"
                            style={{ color: `${GOLD_LIGHT}82` }}
                          >
                            {project.type}
                          </span>

                          {platform ? (
                            <>
                              <span
                                aria-hidden="true"
                                className="h-px w-4 bg-white/[0.10]"
                              />
                              <span className="text-[7px] uppercase tracking-[0.18em] text-white/[0.30]">
                                {platform}
                              </span>
                            </>
                          ) : null}
                        </div>

                        <div className="flex items-end justify-between gap-4">
                          <h3 className="umbra-display-tight max-w-[84%] text-[clamp(1.75rem,5.2vw,3.8rem)] font-[430] uppercase text-white">
                            {title}
                          </h3>

                          <span
                            aria-hidden="true"
                            className="hidden h-10 w-10 shrink-0 items-center justify-center border bg-black/[0.20] text-white/[0.45] backdrop-blur-sm transition-[border-color,color,transform,background-color] duration-300 group-hover:-translate-y-0.5 group-hover:border-[#dfc88f]/35 group-hover:bg-[#dfc88f] group-hover:text-black sm:flex"
                            style={{ borderColor: `${GOLD_LIGHT}30` }}
                          >
                            <ArrowUpRight
                              className="h-3.5 w-3.5"
                              strokeWidth={1.1}
                            />
                          </span>
                        </div>
                      </div>

                      <span
                        aria-hidden="true"
                        className="absolute bottom-0 left-0 h-px w-[22%] transition-[width] duration-500 group-hover:w-full"
                        style={{
                          background:
                            `linear-gradient(90deg, ${GOLD_DARK}, ${GOLD_LIGHT}, transparent 78%)`,
                        }}
                      />
                    </div>
                  </Link>

                  <div className="flex flex-1 flex-col border-t border-white/[0.045] bg-[linear-gradient(180deg,rgba(255,255,255,.008),transparent),#070706] p-5 sm:p-6">
                    <ProjectAuthor
                      sourceAuthor={sourceAuthor}
                      copy={copy}
                    />

                    {description ? (
                      <p className="mt-4 max-w-2xl text-[11px] leading-6 text-[var(--umbra-ink-muted)] sm:text-[12px] sm:leading-7">
                        {description}
                      </p>
                    ) : null}

                    <div className="mt-5 flex items-end justify-between gap-4 pt-1">
                      <div>
                        <p className="umbra-code">
                          {copy.status}
                        </p>
                        <p
                          className="mt-2 text-[8px] font-semibold uppercase tracking-[0.14em]"
                          style={{
                            color:
                              project.status === "in-production"
                                ? `${GOLD_LIGHT}88`
                                : "rgba(255,255,255,.44)",
                          }}
                        >
                          {statusLabels[project.status]}
                        </p>
                      </div>

                      <Link
                        href={href}
                        className="inline-flex min-h-10 items-center gap-3 text-[8px] font-semibold uppercase tracking-[0.23em] outline-none focus-visible:ring-1 focus-visible:ring-[#dfc88f]/70"
                        style={{ color: `${GOLD_LIGHT}9f` }}
                      >
                        {copy.open}
                        <ArrowUpRight
                          aria-hidden="true"
                          className="h-3.5 w-3.5"
                          strokeWidth={1.1}
                        />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </motion.div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : undefined}
          transition={{
            delay: reducedMotion ? 0 : 0.30,
            duration: reducedMotion ? 0 : 0.48,
            ease: EASE,
          }}
          className="mt-11 flex items-center justify-between border-t border-white/[0.06] pt-5 sm:mt-13"
        >
          <Link
            href={archiveHref}
            className="inline-flex min-h-10 items-center gap-3 text-[8px] font-semibold uppercase tracking-[0.24em] outline-none transition-colors duration-300 hover:text-white focus-visible:ring-1 focus-visible:ring-[#dfc88f]/70"
            style={{ color: "rgba(255,255,255,.28)" }}
          >
            <Layers3
              aria-hidden="true"
              className="h-3.5 w-3.5"
              style={{ color: `${GOLD}52` }}
            />
            {copy.archive}
            <ArrowUpRight
              aria-hidden="true"
              className="h-3.5 w-3.5"
              style={{ color: `${GOLD_LIGHT}5c` }}
            />
          </Link>
        </motion.footer>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(196,165,107,.07), rgba(223,200,143,.05), transparent)",
        }}
      />
    </section>
  );
}
