"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  ScanLine,
} from "lucide-react";
import {
  motion,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import type { Character } from "@/data/characters";
import {
  getCharacterBySlug,
  getCharacterHref,
  getCharacterNavigation,
} from "@/lib/characterNavigation";

const LAST_VISITED_KEY =
  "umbra-last-character";

const GOLD = "#c7a96b";
const GOLD_LIGHT = "#ead39a";
const EASE = [0.22, 1, 0.36, 1] as const;

type Locale = "sr" | "en";

type DossierCopy = {
  back: string;
  dossier: string;
  category: string;
  gender: string;
  height: string;
  project: string;
  profile: string;
  profileIndex: string;
  archiveMemory: string;
  lastViewed: string;
  memoryDescription: string;
  connected: string;
  sameWorld: string;
  archive: string;
  backLabel: string;
  dossierFooter: string;
  projectCta: string;
  heightUnknown: string;
  genderUnknown: string;
  portraitPending: string;
  navigation: string;
  previous: string;
  next: string;
  position: string;
  viewArchive: string;
};

const copyByLocale: Record<
  Locale,
  DossierCopy
> = {
  sr: {
    back: "Arhiva",
    dossier: "Dosije lika",
    category: "Kategorija",
    gender: "Pol",
    height: "Visina",
    project: "Projekat",
    profile: "Profil",
    profileIndex: "01 / DOSIJE",
    archiveMemory: "ARHIVSKA MEMORIJA",
    lastViewed: "Poslednje pregledan lik:",
    memoryDescription:
      "Umbra arhiva pamti poslednju tačku istraživanja na ovom uređaju.",
    connected: "POVEZANO",
    sameWorld: "Isti svet",
    archive: "Arhiva likova",
    backLabel: "Nazad",
    dossierFooter: "UMBRA DOSSIER",
    projectCta: "Projekat",
    heightUnknown: "Nije definisana",
    genderUnknown: "Nije definisan",
    portraitPending: "PORTRET / U RAZVOJU",
    navigation: "NAVIGACIJA LIKOVA",
    previous: "Prethodni lik",
    next: "Sledeći lik",
    position: "Pozicija u postavi",
    viewArchive: "Prikaži celu postavu",
  },

  en: {
    back: "Character archive",
    dossier: "Character dossier",
    category: "Category",
    gender: "Gender",
    height: "Height",
    project: "Project",
    profile: "Profile",
    profileIndex: "01 / DOSSIER",
    archiveMemory: "ARCHIVE MEMORY",
    lastViewed: "Last viewed character:",
    memoryDescription:
      "The Umbra archive remembers the last point of your exploration on this device.",
    connected: "CONNECTED",
    sameWorld: "Same world",
    archive: "Character archive",
    backLabel: "Back",
    dossierFooter: "UMBRA DOSSIER",
    projectCta: "Project",
    heightUnknown: "Not defined",
    genderUnknown: "Not defined",
    portraitPending: "PORTRAIT / IN DEVELOPMENT",
    navigation: "CHARACTER NAVIGATION",
    previous: "Previous character",
    next: "Next character",
    position: "Cast position",
    viewArchive: "View full cast",
  },
};

type CharacterDossierProps = {
  character: Character;
  relatedCharacters: Character[];
};

function getLocale(
  pathname: string | null,
): Locale {
  return pathname === "/en" ||
    pathname?.startsWith("/en/")
    ? "en"
    : "sr";
}

function getGenderLabel(
  gender: Character["gender"],
  locale: Locale,
  copy: DossierCopy,
) {
  if (gender === "MALE") {
    return locale === "en"
      ? "Male"
      : "Muški";
  }

  if (gender === "FEMALE") {
    return locale === "en"
      ? "Female"
      : "Ženski";
  }

  return copy.genderUnknown;
}

function getCategoryLabel(
  category: Character["category"],
  locale: Locale,
) {
  if (category === "MAIN") {
    return locale === "en"
      ? "Main"
      : "Glavni";
  }

  return locale === "en"
    ? "Supporting"
    : "Sporedni";
}

function getProjectHref(
  slug: string,
  locale: Locale,
) {
  return locale === "en"
    ? `/en/projects/${slug}`
    : `/serije/${slug}`;
}

function CharacterBackdrop({
  character,
}: {
  character: Character;
}) {
  return (
    <>
      {character.image ? (
        <Image
          src={character.image}
          alt={character.name}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-[0.60] grayscale-[0.14]"
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(234,211,154,0.08),transparent_34%),linear-gradient(135deg,#090909_0%,#040404_52%,#0a0908_100%)]"
        >
          <div className="absolute inset-0 opacity-[0.20] [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.055)_1px,transparent_1px)] [background-size:110px_110px]" />

          <div className="absolute left-[70%] top-[40%] h-[390px] w-[390px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.045]" />

          <div className="absolute left-[70%] top-[40%] h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#c7a96b]/[0.09]" />
        </div>
      )}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(234,211,154,0.07),transparent_32%)]" />

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,3,3,0.985)_0%,rgba(3,3,3,0.76)_28%,rgba(3,3,3,0.16)_66%,rgba(3,3,3,0.60)_100%)]" />

      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(3,3,3,0.985)_0%,rgba(3,3,3,0.04)_46%,rgba(3,3,3,0.64)_100%)]" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.016] [background-image:linear-gradient(rgba(255,255,255,.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.075)_1px,transparent_1px)] [background-size:120px_120px] [mask-image:linear-gradient(180deg,black,transparent_80%)]"
      />
    </>
  );
}

function CharacterPlaceholder({
  copy,
}: {
  copy: DossierCopy;
}) {
  return (
    <div
      aria-hidden="true"
      className="absolute bottom-8 right-8 hidden items-center gap-3 sm:flex"
    >
      <span className="h-px w-8 bg-[#c7a96b]/35" />

      <span className="font-mono text-[7px] uppercase tracking-[0.25em] text-white/[0.18]">
        {copy.portraitPending}
      </span>
    </div>
  );
}

export default function CharacterDossier({
  character,
  relatedCharacters,
}: CharacterDossierProps) {
  const pathname = usePathname();
  const locale = getLocale(pathname);
  const copy = copyByLocale[locale];
  const reducedMotion =
    useReducedMotion() ?? false;

  const [
    lastViewedSlug,
    setLastViewedSlug,
  ] = useState<string | null>(null);

  const archiveHref =
    locale === "en"
      ? "/en/characters"
      : "/likovi";

  const projectHref = getProjectHref(
    character.projectSlug,
    locale,
  );

  const navigation =
    getCharacterNavigation(character);

  useEffect(() => {
    try {
      const previousSlug =
        window.localStorage.getItem(
          LAST_VISITED_KEY,
        );

      if (
        previousSlug &&
        previousSlug !== character.slug
      ) {
        setLastViewedSlug(previousSlug);
      }

      window.localStorage.setItem(
        LAST_VISITED_KEY,
        character.slug,
      );
    } catch {
      // Storage may be unavailable.
    }
  }, [character.slug]);

  const lastViewedCharacter =
    lastViewedSlug
      ? getCharacterBySlug(
          lastViewedSlug,
        )
      : null;

  const reveal = {
    hidden: {
      opacity: 0,
      y: reducedMotion ? 0 : 24,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reducedMotion
          ? 0
          : 0.75,
        ease: EASE,
      },
    },
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#030303] text-[#f4f0e8]">
      {/* HERO */}
      <section className="relative min-h-[100svh] overflow-hidden border-b border-white/[0.07]">
        <motion.div
          initial={{
            opacity: 0,
            scale: reducedMotion
              ? 1
              : 1.025,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: reducedMotion
              ? 0
              : 1.1,
            ease: EASE,
          }}
          className="absolute inset-0"
        >
          <CharacterBackdrop
            character={character}
          />
        </motion.div>

        {!character.image ? (
          <CharacterPlaceholder
            copy={copy}
          />
        ) : null}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-6 bottom-6 border border-white/[0.05] sm:inset-x-10 lg:inset-x-16"
        />

        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1500px] flex-col px-6 pb-10 pt-7 sm:px-10 lg:px-16">
          <div className="flex items-center justify-between gap-6">
            <Link
              href={archiveHref}
              className="group inline-flex min-h-8 items-center gap-3 rounded-sm py-1 font-mono text-[8px] uppercase tracking-[0.22em] text-white/[0.42] transition-[color,transform] duration-300 hover:translate-x-0.5 hover:text-white/[0.82] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
            >
              <ArrowLeft
                aria-hidden="true"
                size={14}
                strokeWidth={1.2}
                className="transition-transform duration-300 group-hover:-translate-x-1"
              />

              {copy.back}
            </Link>

            <span className="select-none font-mono text-[8px] uppercase tracking-[0.26em] text-white/[0.20]">
              {copy.dossier}
            </span>
          </div>

          <div className="mt-auto grid items-end gap-14 pt-28 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.4fr)]">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={reveal}
            >
              <Link
                href={projectHref}
                className="group/project inline-flex items-center gap-4 rounded-sm outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
                aria-label={`${copy.project}: ${character.projectTitle}`}
              >
                <span
                  aria-hidden="true"
                  className="h-px w-8"
                  style={{
                    background: GOLD_LIGHT,
                  }}
                />

                <span
                  className="font-mono text-[9px] uppercase tracking-[0.25em] transition-colors duration-300 group-hover/project:text-white"
                  style={{
                    color: `${GOLD_LIGHT}cc`,
                  }}
                >
                  {character.projectTitle}
                </span>

                <ArrowUpRight
                  aria-hidden="true"
                  size={12}
                  strokeWidth={1.1}
                  className="opacity-50 transition-[opacity,transform] duration-300 group-hover/project:translate-x-0.5 group-hover/project:-translate-y-0.5 group-hover/project:opacity-100"
                />
              </Link>

              <h1 className="mt-7 max-w-5xl text-[clamp(4rem,11vw,11rem)] font-[430] leading-[0.76] tracking-[-0.08em]">
                {character.name}
              </h1>

              <p className="mt-10 max-w-2xl text-base leading-8 text-white/50 sm:text-lg">
                {character.shortDescription}
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={reveal}
              className="border-t border-white/[0.1] pt-6"
            >
              <div className="grid grid-cols-2 gap-x-8 gap-y-8">
                <DossierField
                  label={copy.category}
                  value={getCategoryLabel(
                    character.category,
                    locale,
                  )}
                />

                <DossierField
                  label={copy.gender}
                  value={getGenderLabel(
                    character.gender,
                    locale,
                    copy,
                  )}
                />

                <DossierField
                  label={copy.height}
                  value={
                    character.heightCm !==
                    null
                      ? `${character.heightCm} cm`
                      : copy.heightUnknown
                  }
                />

                <div>
                  <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/[0.22]">
                    {copy.project}
                  </p>

                  <Link
                    href={projectHref}
                    className="group mt-3 inline-flex items-center gap-2 rounded-sm text-sm text-white/[0.76] transition-colors duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
                  >
                    {character.projectTitle}

                    <ArrowUpRight
                      aria-hidden="true"
                      size={13}
                      strokeWidth={1.2}
                      className="text-[#ead39a]/70 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PROFILE */}
      <section className="border-b border-white/[0.07] bg-[#050505] px-6 py-28 sm:px-10 lg:px-16 lg:py-36">
        <div className="mx-auto max-w-[1500px]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.25,
            }}
            variants={reveal}
            className="grid gap-12 lg:grid-cols-[0.32fr_1fr] lg:gap-20"
          >
            <div>
              <div className="flex select-none items-start gap-4">
                <span
                  aria-hidden="true"
                  className="mt-[0.18em] h-px w-8"
                  style={{
                    background: GOLD_LIGHT,
                  }}
                />

                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-white/[0.32]">
                    {copy.profile}
                  </p>

                  <p className="mt-3 font-mono text-[8px] uppercase tracking-[0.2em] text-white/[0.16]">
                    {copy.profileIndex}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-24">
              <div>
                <p className="max-w-3xl text-[clamp(1.45rem,2.5vw,2.4rem)] font-light leading-[1.32] tracking-[-0.035em] text-white/[0.78]">
                  {character.shortDescription}
                </p>
              </div>

              <div className="border-t border-white/[0.08] pt-6">
                <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/[0.24]">
                  {copy.archiveMemory}
                </p>

                <div className="mt-5 flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{
                      background: GOLD_LIGHT,
                      boxShadow: `0 0 8px ${GOLD_LIGHT}45`,
                    }}
                  />

                  <span className="text-sm leading-6 text-white/[0.50]">
                    {copy.lastViewed}{" "}
                    {lastViewedCharacter ? (
                      <Link
                        href={getCharacterHref(
                          lastViewedCharacter,
                          locale,
                        )}
                        className="text-white/[0.76] underline decoration-white/10 underline-offset-4 transition-colors duration-300 hover:text-[#ead39a] hover:decoration-[#ead39a]/45 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
                      >
                        {lastViewedCharacter.name}
                      </Link>
                    ) : (
                      <span className="text-white/[0.35]">
                        —
                      </span>
                    )}
                  </span>
                </div>

                <p className="mt-4 text-[11px] leading-6 text-white/[0.30]">
                  {lastViewedCharacter
                    ? copy.memoryDescription
                    : locale === "en"
                      ? "Your previous archive point will appear here after you visit another character."
                      : "Prethodna tačka u arhivi pojaviće se ovde nakon što posetiš drugog lika."}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CHARACTER NAVIGATION */}
      <section className="border-b border-white/[0.07] bg-[#050505] px-6 py-20 sm:px-10 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-[1500px]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p
                className="font-mono text-[9px] uppercase tracking-[0.28em]"
                style={{
                  color: `${GOLD_LIGHT}b8`,
                }}
              >
                {copy.navigation}
              </p>

              <div className="mt-4 flex items-end gap-4">
                <Link
                  href={projectHref}
                  className="group/project-title inline-flex rounded-sm outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
                  aria-label={`${copy.project}: ${character.projectTitle}`}
                >
                  <h2 className="text-[clamp(2.2rem,4vw,4.4rem)] font-[430] leading-[0.9] tracking-[-0.06em] transition-colors duration-300 group-hover/project-title:text-white/[0.80]">
                    {character.projectTitle}
                  </h2>
                </Link>

                <span className="pb-1 font-mono text-[8px] uppercase tracking-[0.2em] text-white/[0.22]">
                  {navigation.position} /{" "}
                  {navigation.total}
                </span>
              </div>
            </div>

            <Link
              href={archiveHref}
              className="inline-flex min-h-11 items-center gap-3 self-start border border-white/[0.09] px-4 py-3 font-mono text-[8px] uppercase tracking-[0.2em] text-white/[0.40] transition-[border-color,color,transform] duration-300 hover:-translate-y-0.5 hover:border-[#c7a96b]/35 hover:text-[#ead39a] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55 lg:self-auto"
            >
              {copy.viewArchive}

              <ArrowUpRight
                aria-hidden="true"
                size={13}
                strokeWidth={1.2}
              />
            </Link>
          </div>

          <div className="mt-10 grid gap-px border border-white/[0.07] bg-white/[0.07] md:grid-cols-3">
            <CharacterNavigationCard
              href={
                navigation.previous
                  ? getCharacterHref(
                      navigation.previous,
                      locale,
                    )
                  : null
              }
              label={copy.previous}
              name={
                navigation.previous?.name ??
                null
              }
              direction="previous"
            />

            <div className="flex min-h-[150px] items-end justify-between bg-[#0a0a0a] p-6 sm:p-8">
              <div>
                <div className="font-mono text-[7px] uppercase tracking-[0.24em] text-[#ead39a]/65">
                  {copy.dossier}
                </div>

                <div className="mt-4 text-2xl font-[430] uppercase leading-none tracking-[-0.04em] text-white">
                  {character.name}
                </div>
              </div>

              <div className="font-mono text-[10px] tracking-[0.16em] text-white/[0.18]">
                {String(
                  navigation.position,
                ).padStart(2, "0")}{" "}
                /{" "}
                {String(
                  navigation.total,
                ).padStart(2, "0")}
              </div>
            </div>

            <CharacterNavigationCard
              href={
                navigation.next
                  ? getCharacterHref(
                      navigation.next,
                      locale,
                    )
                  : null
              }
              label={copy.next}
              name={
                navigation.next?.name ??
                null
              }
              direction="next"
            />
          </div>
        </div>
      </section>

      {/* RELATED */}
      {relatedCharacters.length > 0 ? (
        <section className="border-b border-white/[0.07] bg-[#030303] px-6 py-28 sm:px-10 lg:px-16 lg:py-36">
          <div className="mx-auto max-w-[1500px]">
            <div className="mb-12">
              <p
                className="font-mono text-[9px] uppercase tracking-[0.28em]"
                style={{
                  color: `${GOLD_LIGHT}b8`,
                }}
              >
                {copy.connected}
              </p>

              <h2 className="mt-5 max-w-4xl text-[clamp(2.5rem,5vw,5rem)] font-[430] leading-[0.88] tracking-[-0.06em]">
                {copy.sameWorld}
              </h2>
            </div>

            <div className="grid gap-px border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-3">
              {relatedCharacters
                .slice(0, 3)
                .map((related) => {
                  const relatedHref =
                    getCharacterHref(
                      related,
                      locale,
                    );

                  return (
                    <Link
                      key={related.id}
                      href={relatedHref}
                      aria-label={
                        locale === "en"
                          ? `Open character ${related.name}`
                          : `Otvori lik ${related.name}`
                      }
                      className="group relative min-h-[390px] overflow-hidden bg-[#070707] outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#ead39a]/55"
                    >
                      {related.image ? (
                        <Image
                          src={related.image}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover grayscale-[0.2] transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                        />
                      ) : (
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 bg-[radial-gradient(circle_at_70%_38%,rgba(234,211,154,0.07),transparent_34%),linear-gradient(135deg,#090909_0%,#050505_55%,#0b0a08_100%)]"
                        >
                          <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] [background-size:82px_82px]" />

                          <div className="absolute left-[68%] top-[38%] h-[190px] w-[190px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04]" />

                          <div className="absolute left-[68%] top-[38%] h-[120px] w-[120px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#c7a96b]/[0.08]" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.06),rgba(0,0,0,.78))]" />

                      <div className="absolute inset-x-7 bottom-7">
                        <div className="mb-4 flex items-center gap-3">
                          <span
                            aria-hidden="true"
                            className="h-px w-6"
                            style={{
                              background:
                                GOLD_LIGHT,
                            }}
                          />

                          <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/[0.38]">
                            {getCategoryLabel(
                              related.category,
                              locale,
                            )}
                          </span>
                        </div>

                        <div className="flex items-end justify-between gap-4">
                          <h3 className="text-[clamp(1.8rem,3vw,2.8rem)] font-[430] uppercase tracking-[-0.045em]">
                            {related.name}
                          </h3>

                          <ArrowUpRight
                            aria-hidden="true"
                            size={17}
                            strokeWidth={1.2}
                            className="shrink-0 text-white/[0.30] transition-[color,transform] duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#ead39a]"
                          />
                        </div>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
        </section>
      ) : null}

      <footer className="bg-[#030303] px-6 py-10 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-5 border-t border-white/[0.07] pt-7">
          <Link
            href={archiveHref}
            className="inline-flex min-h-8 items-center gap-2 py-1 font-mono text-[8px] uppercase tracking-[0.2em] text-white/[0.26] transition-colors duration-300 hover:text-[#ead39a] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
          >
            <ArrowLeft
              aria-hidden="true"
              size={13}
              strokeWidth={1.2}
            />

            {copy.backLabel}
          </Link>

          <div className="flex items-center gap-3">
            <ScanLine
              aria-hidden="true"
              size={13}
              strokeWidth={1.2}
              className="text-[#ead39a]/38"
            />

            <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/[0.16]">
              {copy.dossierFooter}
            </span>
          </div>

          <Link
            href={projectHref}
            className="inline-flex min-h-8 items-center gap-2 py-1 font-mono text-[8px] uppercase tracking-[0.2em] text-white/[0.26] transition-colors duration-300 hover:text-[#ead39a] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
          >
            {copy.projectCta}

            <ArrowUpRight
              aria-hidden="true"
              size={12}
              strokeWidth={1.15}
            />
          </Link>
        </div>
      </footer>
    </main>
  );
}

function CharacterNavigationCard({
  href,
  label,
  name,
  direction,
}: {
  href: string | null;
  label: string;
  name: string | null;
  direction: "previous" | "next";
}) {
  const isPrevious =
    direction === "previous";

  const content = (
    <div
      className={[
        "min-h-[150px] bg-[#070707] p-6 sm:p-8",
        href
          ? "transition-colors duration-300 hover:bg-[#0a0a0a]"
          : "opacity-35",
        isPrevious
          ? ""
          : "text-right",
      ].join(" ")}
    >
      <div
        className={[
          "flex items-center justify-between gap-4",
          isPrevious
            ? ""
            : "flex-row-reverse",
        ].join(" ")}
      >
        <span className="font-mono text-[7px] uppercase tracking-[0.24em] text-white/[0.22]">
          {label}
        </span>

        {isPrevious ? (
          <ArrowLeft
            aria-hidden="true"
            size={14}
            strokeWidth={1.2}
            className={
              href
                ? "text-white/[0.25] transition-[color,transform] duration-300 group-hover:-translate-x-1 group-hover:text-[#ead39a]"
                : "text-white/[0.15]"
            }
          />
        ) : (
          <ArrowUpRight
            aria-hidden="true"
            size={14}
            strokeWidth={1.2}
            className={
              href
                ? "text-white/[0.25] transition-[color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#ead39a]"
                : "text-white/[0.15]"
            }
          />
        )}
      </div>

      <div className="mt-7 text-[clamp(1.7rem,3vw,2.8rem)] font-[430] uppercase leading-[0.9] tracking-[-0.05em] text-white/[0.75] transition-colors duration-300 group-hover:text-white">
        {name ?? "—"}
      </div>
    </div>
  );

  if (!href) {
    return (
      <div aria-disabled="true">
        {content}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="group block outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#ead39a]/55"
    >
      {content}
    </Link>
  );
}

function DossierField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/[0.22]">
        {label}
      </p>

      <p className="mt-3 text-sm text-white/[0.76]">
        {value}
      </p>
    </div>
  );
}