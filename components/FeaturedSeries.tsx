"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";
import {
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type { Locale } from "@/data/translations";
import { projects } from "@/data/projects";

const GOLD = "#c7a96b";
const GOLD_LIGHT = "#ead39a";
const GOLD_DARK = "#8f7142";
const FALLBACK_IMAGE = "/umbra-background.png";
const YOUTUBE_URL = "https://www.youtube.com/@umbrastud";
const AUTHOR_URL = "https://branislavbojcic.com/";

const FEATURED_PROJECT_SLUG = "mrzim-svog-brata";

const EASE = [0.22, 1, 0.36, 1] as const;

type FeaturedSeriesProps = {
  locale?: Locale;
};

function MetaItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="font-mono text-[7px] uppercase tracking-[0.24em] text-white/[0.22]">
        {label}
      </p>

      <p className="mt-2 truncate text-[10px] font-medium uppercase tracking-[0.16em] text-white/[0.56]">
        {value}
      </p>
    </div>
  );
}

export default function FeaturedSeries({
  locale = "sr",
}: FeaturedSeriesProps) {
  const reducedMotion = useReducedMotion() ?? false;
  const isEnglish = locale === "en";

  const project = useMemo(
    () =>
      projects.find(
        (item) =>
          item.slug === FEATURED_PROJECT_SLUG &&
          item.type === "Serija",
      ) ?? projects[0],
    [],
  );

  const projectHref = isEnglish
    ? `/en/projects/${project.slug}`
    : `/serije/${project.slug}`;

  const cover =
    isEnglish
      ? project.book?.coverEn ||
        project.book?.coverSr ||
        project.cover ||
        FALLBACK_IMAGE
      : project.book?.coverSr ||
        project.book?.coverEn ||
        project.cover ||
        FALLBACK_IMAGE;

  const [coverSrc, setCoverSrc] =
    useState(cover);

  useEffect(() => {
    setCoverSrc(cover);
  }, [cover]);

  const copy = useMemo(
    () =>
      isEnglish
        ? {
            eyebrow: "FEATURED SERIES",
            title: "Stories that remain.",
            intro:
              "Explore the world of Umbra Studio through stories, characters and productions built one scene at a time.",
            current: "CURRENT PRODUCTION",
            series: "CURRENT SERIES",
            open: "OPEN PROJECT",
            project: "ENTER PROJECT",
            watch: "OPEN YOUTUBE",
            format: "Web series",
            status: "In production",
            platform: "YouTube",
            footer: "THE FIRST UMBRA SERIES",
            projectCode: "PROJECT 001",
            mediaAlt: `${project.title} project cover`,
            openProject: `Open ${project.title} project`,
            authorPrefix: "Novel by",
            originalLabel: "UMBRA ADAPTATION",
          }
        : {
            eyebrow: "ISTAKNUTA SERIJA",
            title: "Priče koje ostaju.",
            intro:
              "Istraži svet Umbra Studija kroz priče, likove i produkcije koje gradimo scenu po scenu.",
            current: "AKTUELNA PRODUKCIJA",
            series: "TRENUTNA SERIJA",
            open: "OTVORI PROJEKAT",
            project: "UĐI U PROJEKAT",
            watch: "OTVORI YOUTUBE",
            format: "Serija",
            status: "U produkciji",
            platform: "YouTube",
            footer: "PRVA UMBRA SERIJA",
            projectCode: "PROJEKAT 001",
            mediaAlt: `Naslovna strana projekta ${project.title}`,
            openProject: `Otvori projekat ${project.title}`,
            authorPrefix: "Po romanu",
            originalLabel: "UMBRA ADAPTACIJA",
          },
    [isEnglish, project.title],
  );

  return (
    <section
      id="series"
      aria-labelledby="featured-series-title"
      data-umbra-scene="featured-series"
      data-umbra-interactive="project-card"
      className="relative overflow-hidden border-t border-white/[0.055] bg-[#030303]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div
          className="absolute -left-[18%] top-[6%] h-[620px] w-[620px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${GOLD}06 0%, ${GOLD}018 34%, transparent 72%)`,
            filter: "blur(80px)",
          }}
        />

        <div
          className="absolute -right-[14%] bottom-[-18%] h-[700px] w-[700px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,.014) 0%, transparent 68%)",
            filter: "blur(80px)",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,.04), transparent 26%, transparent 74%, rgba(0,0,0,.30))",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1680px] px-6 pb-24 pt-24 sm:px-9 sm:pb-28 sm:pt-28 lg:px-12 lg:pb-32 lg:pt-32 xl:px-16">
        <motion.div
          initial={{
            opacity: 0,
            y: reducedMotion ? 0 : 8,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.16,
          }}
          transition={{
            duration: reducedMotion ? 0 : 0.62,
            ease: EASE,
          }}
          className="flex items-end justify-between gap-8 border-b border-white/[0.055] pb-5"
        >
          <div className="flex items-center gap-4">
            <span
              className="font-mono text-[7px] tracking-[0.32em]"
              style={{
                color: `${GOLD_LIGHT}82`,
              }}
            >
              03
            </span>

            <span
              aria-hidden="true"
              className="h-px w-12"
              style={{
                background: `linear-gradient(90deg, ${GOLD}68, transparent)`,
              }}
            />

            <div>
              <p
                className="text-[8px] font-semibold uppercase tracking-[0.30em]"
                style={{
                  color: `${GOLD_LIGHT}76`,
                }}
              >
                {copy.eyebrow}
              </p>

              <h2
                id="featured-series-title"
                className="mt-2 text-[clamp(2.55rem,4.8vw,5.25rem)] font-[430] leading-[0.84] tracking-[-0.075em] text-white"
              >
                {copy.title}
              </h2>
            </div>
          </div>

          <p className="hidden max-w-[360px] pb-1 text-[11px] leading-6 text-white/[0.34] lg:block">
            {copy.intro}
          </p>
        </motion.div>

        <div className="grid items-center gap-14 pt-14 lg:grid-cols-[1.04fr_0.96fr] lg:gap-20 lg:pt-16 xl:grid-cols-[1.08fr_0.92fr] xl:gap-24">
          <motion.div
            initial={{
              opacity: 0,
              x: reducedMotion ? 0 : -14,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.12,
            }}
            transition={{
              duration: reducedMotion ? 0 : 0.78,
              ease: EASE,
            }}
            className="relative"
          >
            <Link
              href={projectHref}
              aria-label={copy.openProject}
              className="group/featured relative mx-auto block w-full max-w-[820px] cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/65 focus-visible:ring-offset-4 focus-visible:ring-offset-[#030303]"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-3 left-8 hidden h-px w-[74%] bg-white/[0.045] sm:block"
              />

              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-3 top-10 hidden h-[72%] w-px bg-white/[0.045] lg:block"
              />

              <div className="relative aspect-[16/10] overflow-hidden border border-white/[0.085] bg-[#080808] shadow-[0_30px_96px_rgba(0,0,0,.34)]">
                <Image
                  src={coverSrc}
                  alt={copy.mediaAlt}
                  fill
                  priority={false}
                  sizes="(min-width: 1280px) 56vw, (min-width: 1024px) 58vw, 94vw"
                  className="object-cover object-center transition-transform duration-[1000ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover/featured:scale-[1.018]"
                  onError={() => {
                    if (coverSrc !== FALLBACK_IMAGE) {
                      setCoverSrc(FALLBACK_IMAGE);
                    }
                  }}
                />

                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,.05) 0%, transparent 30%, rgba(0,0,0,.12) 58%, rgba(0,0,0,.84) 100%)",
                  }}
                />

                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background: `radial-gradient(circle at 66% 28%, ${GOLD_LIGHT}0a 0%, ${GOLD}04 20%, transparent 48%)`,
                  }}
                />

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-5 border border-white/[0.055] sm:inset-7 lg:inset-8"
                />

                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-5 top-5 h-8 w-8 border-l border-t sm:left-7 sm:top-7 lg:left-8 lg:top-8"
                  style={{
                    borderColor: `${GOLD_LIGHT}38`,
                  }}
                />

                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-5 right-5 h-8 w-8 border-b border-r sm:bottom-7 sm:right-7 lg:bottom-8 lg:right-8"
                  style={{
                    borderColor: `${GOLD}32`,
                  }}
                />

                <div className="absolute left-5 right-5 top-5 flex items-center justify-between sm:left-7 sm:right-7 sm:top-7 lg:left-8 lg:right-8 lg:top-8">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-[5px] w-[5px] rounded-full"
                      style={{
                        background: GOLD_LIGHT,
                        boxShadow: `0 0 8px ${GOLD_LIGHT}46`,
                      }}
                    />

                    <span className="text-[7px] font-semibold uppercase tracking-[0.30em] text-white/[0.42]">
                      {copy.originalLabel}
                    </span>
                  </div>

                  <span className="font-mono text-[6px] tracking-[0.24em] text-white/[0.20]">
                    001
                  </span>
                </div>

                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-6 sm:bottom-8 sm:left-8 sm:right-8 lg:bottom-10 lg:left-10 lg:right-10">
                  <div className="min-w-0">
                    <p
                      className="text-[8px] uppercase tracking-[0.38em]"
                      style={{
                        color: `${GOLD_LIGHT}96`,
                      }}
                    >
                      {copy.current}
                    </p>

                    <p className="mt-3 text-[clamp(1.9rem,4vw,4.7rem)] font-[430] uppercase leading-[0.84] tracking-[-0.06em] text-white">
                      {project.title.split(" ").slice(0, 2).join(" ")}
                      <br />
                      <span className="text-white/[0.54]">
                        {project.title.split(" ").slice(2).join(" ")}
                      </span>
                    </p>
                  </div>

                  <span
                    className="hidden shrink-0 font-mono text-[6px] tracking-[0.24em] sm:block"
                    style={{
                      color: `${GOLD_LIGHT}62`,
                    }}
                  >
                    001 / 2026
                  </span>
                </div>

                <div className="absolute right-5 top-5 sm:right-7 sm:top-7 lg:right-8 lg:top-8">
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-full border bg-black/[0.38] text-white/[0.72] transition-[background-color,border-color,color,transform] duration-300 group-hover/featured:border-[#ead39a]/45 group-hover/featured:bg-[#ead39a] group-hover/featured:text-black group-hover/featured:-translate-y-px"
                    style={{
                      borderColor: `${GOLD_LIGHT}26`,
                    }}
                  >
                    <ArrowUpRight
                      size={15}
                      strokeWidth={1}
                      className="transition-transform duration-300 group-hover/featured:translate-x-0.5 group-hover/featured:-translate-y-0.5"
                    />
                  </span>
                </div>

                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 h-px w-[24%] origin-left transition-[width] duration-500 group-hover/featured:w-full"
                  style={{
                    background: `linear-gradient(90deg, ${GOLD_DARK}, ${GOLD_LIGHT}, transparent 78%)`,
                  }}
                />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="h-px w-8"
                    style={{
                      background: `${GOLD}38`,
                    }}
                  />

                  <span className="text-[7px] uppercase tracking-[0.28em] text-white/[0.22]">
                    {copy.series}
                  </span>
                </div>

                <span
                  className="text-[7px] uppercase tracking-[0.22em] transition-colors duration-300 group-hover/featured:text-[#ead39a]/90"
                  style={{
                    color: `${GOLD_LIGHT}56`,
                  }}
                >
                  {copy.open}
                </span>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              x: reducedMotion ? 0 : 14,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.12,
            }}
            transition={{
              delay: reducedMotion ? 0 : 0.06,
              duration: reducedMotion ? 0 : 0.74,
              ease: EASE,
            }}
            className="max-w-[610px]"
          >
            <Link
              href={projectHref}
              className="group/title inline-block max-w-full outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/60"
              aria-label={copy.openProject}
            >
              <p
                className="text-[8px] font-semibold uppercase tracking-[0.32em]"
                style={{
                  color: `${GOLD_LIGHT}82`,
                }}
              >
                001 / {copy.current}
              </p>

              <h3 className="mt-6 text-[clamp(2.8rem,5vw,6.6rem)] font-[430] uppercase leading-[0.82] tracking-[-0.075em] text-white">
                {project.title.split(" ").slice(0, 2).join(" ")}
                <br />
                <span className="text-white/[0.52]">
                  {project.title.split(" ").slice(2).join(" ")}
                </span>
              </h3>

              <span
                aria-hidden="true"
                className="mt-7 block h-px w-12 origin-left transition-[width] duration-500 group-hover/title:w-20"
                style={{
                  background: `linear-gradient(90deg, ${GOLD_LIGHT}, transparent)`,
                }}
              />
            </Link>

            <p className="mt-8 max-w-[500px] text-[12px] leading-7 text-white/[0.42]">
              {isEnglish
                ? project.longDescription
                : project.longDescription}
            </p>

            {project.book?.author ? (
              <a
                href={AUTHOR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-[8px] font-semibold uppercase tracking-[0.24em] outline-none transition-opacity duration-300 hover:opacity-80 focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
                style={{
                  color: `${GOLD_LIGHT}86`,
                }}
              >
                <span>{copy.authorPrefix}</span>
                <span>{project.book.author}</span>
                <ExternalLink
                  size={11}
                  strokeWidth={1}
                />
              </a>
            ) : null}

            <div className="mt-10 grid max-w-[560px] grid-cols-3 border-y border-white/[0.06] py-6">
              <MetaItem
                label={isEnglish ? "FORMAT" : "FORMAT"}
                value={copy.format}
              />

              <MetaItem
                label={isEnglish ? "STATUS" : "STATUS"}
                value={copy.status}
              />

              <MetaItem
                label={isEnglish ? "PLATFORM" : "PLATFORMA"}
                value={copy.platform}
              />
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
              <Link
                href={projectHref}
                className="group/cta relative inline-flex min-h-[42px] items-center gap-4 pr-1 text-[8px] font-semibold uppercase tracking-[0.28em] outline-none transition-colors duration-300 focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
                style={{
                  color: GOLD_LIGHT,
                }}
              >
                <span className="relative z-10">
                  {copy.project}
                </span>

                <ArrowUpRight
                  size={14}
                  strokeWidth={1}
                  className="relative z-10 transition-transform duration-300 group-hover/cta:translate-x-1 group-hover/cta:-translate-y-0.5"
                />

                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 h-px w-8 transition-[width] duration-500 group-hover/cta:w-full"
                  style={{
                    background: `linear-gradient(90deg, ${GOLD_LIGHT}, ${GOLD}, transparent)`,
                  }}
                />
              </Link>

              <a
                href={YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group/youtube inline-flex min-h-[42px] items-center gap-3 text-[8px] font-semibold uppercase tracking-[0.28em] text-white/[0.34] outline-none transition-colors duration-300 hover:text-white/[0.72] focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
              >
                <span>{copy.watch}</span>

                <ExternalLink
                  size={12}
                  strokeWidth={1}
                  className="transition-transform duration-300 group-hover/youtube:translate-x-0.5 group-hover/youtube:-translate-y-0.5"
                />
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
            amount: 0.08,
          }}
          transition={{
            delay: reducedMotion ? 0 : 0.12,
            duration: reducedMotion ? 0 : 0.5,
            ease: EASE,
          }}
          className="mt-16 flex items-center justify-between border-t border-white/[0.05] pt-5 lg:mt-20"
        >
          <span className="font-mono text-[6px] uppercase tracking-[0.30em] text-white/[0.14]">
            {copy.footer}
          </span>

          <Link
            href={projectHref}
            className="group/bottom flex items-center gap-3 text-[7px] font-semibold uppercase tracking-[0.25em] text-white/[0.24] outline-none transition-colors duration-300 hover:text-white/[0.62] focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
          >
            <span>{copy.projectCode}</span>

            <ArrowUpRight
              size={13}
              strokeWidth={1}
              style={{
                color: `${GOLD_LIGHT}70`,
              }}
              className="transition-transform duration-300 group-hover/bottom:translate-x-0.5 group-hover/bottom:-translate-y-0.5"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
