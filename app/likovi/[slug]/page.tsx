import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Ruler,
} from "lucide-react";

import {
  characters,
} from "@/data/characters";

import {
  getCharacterNavigation,
  getCharactersForProject,
} from "@/lib/characterNavigation";

function getCharacterBySlug(
  slug: string,
) {
  return characters.find(
    (character) => character.slug === slug,
  );
}

function getCategoryLabel(
  category: typeof characters[number]["category"],
) {
  return category === "MAIN"
    ? "Glavni lik"
    : "Sporedni lik";
}

function getGenderLabel(
  gender: typeof characters[number]["gender"],
) {
  switch (gender) {
    case "MALE":
      return "Muški";
    case "FEMALE":
      return "Ženski";
    default:
      return "—";
  }
}

export function generateStaticParams() {
  return characters
    .filter(
      (character) =>
        character.profileAvailable,
    )
    .map((character) => ({
      slug: character.slug,
    }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const character =
    getCharacterBySlug(slug);

  if (!character) {
    return {
      title: "Lik nije pronađen | Umbra Studio",
    };
  }

  return {
    title: `${character.name} | Umbra Studio`,
    description:
      character.shortDescription,
  };
}

export default async function CharacterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const character =
    getCharacterBySlug(slug);

  if (
    !character ||
    !character.profileAvailable
  ) {
    notFound();
  }

  const navigation =
    getCharacterNavigation(
      character,
    );

  const projectCharacters =
    getCharactersForProject(
      character.projectSlug,
    );

  const previous =
    navigation.previous;

  const next =
    navigation.next;

  return (
    <main
      data-umbra-scene="character-dossier"
      className="min-h-screen overflow-hidden bg-[var(--umbra-bg)] text-[#f1ede4]"
    >
      {/* ================================================================ */}
      {/* HERO                                                             */}
      {/* ================================================================ */}

      <section className="relative min-h-[100svh] overflow-hidden">
        {character.image ? (
          <Image
            src={character.image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover scale-[1.04] opacity-[0.42] blur-[0.5px]"
          />
        ) : (
          <Image
            src="/umbra-background.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover scale-[1.03] opacity-[0.45]"
          />
        )}

        <div className="absolute inset-0 bg-[var(--umbra-bg)]/62" />

        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,.98)_0%,rgba(5,5,5,.9)_30%,rgba(5,5,5,.56)_66%,rgba(5,5,5,.86)_100%)]" />

        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(5,5,5,.99)_0%,rgba(5,5,5,.18)_46%,rgba(5,5,5,.56)_100%)]" />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_76%_38%,rgba(185,154,97,.11),transparent_34%)]" />

        <div className="pointer-events-none absolute inset-5 border border-white/[0.07] sm:inset-7 lg:inset-10" />

        <div className="pointer-events-none absolute left-5 top-5 h-14 w-14 border-l border-t border-[#b99a61]/45 sm:left-7 sm:top-7 lg:left-10 lg:top-10" />

        <div className="pointer-events-none absolute bottom-5 right-5 h-14 w-14 border-b border-r border-[#b99a61]/30 sm:bottom-7 sm:right-7 lg:bottom-10 lg:right-10" />

        <div className="relative mx-auto flex min-h-[100svh] max-w-[1440px] flex-col justify-between px-5 pb-12 pt-36 sm:px-8 sm:pb-16 lg:px-12 lg:pt-44">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="h-px w-9 bg-[#b99a61]/70" />

              <span className="text-[8px] uppercase tracking-[0.36em] text-white/45">
                Umbra Studio / Lik
              </span>
            </div>

            <span className="font-mono text-[7px] tracking-[0.24em] text-white/[0.22]">
              CHARACTER /{" "}
              {String(
                character.order,
              ).padStart(2, "0")}
            </span>
          </div>

          <div className="grid items-end gap-14 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px]">
            <div className="max-w-[1000px]">
              <div className="mb-6 flex flex-wrap items-center gap-4 text-[7px] uppercase tracking-[0.3em] text-white/34">
                <span>
                  {getCategoryLabel(
                    character.category,
                  )}
                </span>

                <span className="h-px w-6 bg-white/[0.12]" />

                <span>
                  {character.projectTitle}
                </span>
              </div>

              <h1 className="max-w-[1000px] text-[clamp(4rem,10vw,9.5rem)] font-[440] leading-[0.8] tracking-[-0.075em]">
                {character.name}
              </h1>

              <p className="mt-8 max-w-[720px] text-sm leading-7 text-white/44 sm:text-base sm:leading-8">
                {
                  character.shortDescription
                }
              </p>

              <div className="mt-10 grid max-w-[720px] border-y border-white/[0.08] sm:grid-cols-3">
                <CharacterStat
                  label="STATUS"
                  value={
                    getCategoryLabel(
                      character.category,
                    )
                  }
                />

                <CharacterStat
                  label="POL"
                  value={getGenderLabel(
                    character.gender,
                  )}
                />

                <CharacterStat
                  label="VISINA"
                  value={
                    character.heightCm
                      ? `${character.heightCm} cm`
                      : "—"
                  }
                  last
                />
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="border border-white/[0.08] bg-[#080808]/45 p-6 backdrop-blur-[2px]">
                <div className="text-[7px] uppercase tracking-[0.3em] text-[#d6b776]">
                  Dosije lika
                </div>

                <div className="mt-6 border-t border-white/[0.07] pt-5">
                  <div className="text-[7px] uppercase tracking-[0.25em] text-white/20">
                    Projekat
                  </div>

                  <div className="mt-2 text-sm tracking-[-0.02em] text-white/65">
                    {character.projectTitle}
                  </div>
                </div>

                {character.heightCm ? (
                  <div className="mt-6 border-t border-white/[0.07] pt-5">
                    <div className="flex items-center gap-2 text-[7px] uppercase tracking-[0.25em] text-white/20">
                      <Ruler
                        size={11}
                        strokeWidth={1}
                      />
                      Visina
                    </div>

                    <div className="mt-2 text-sm text-white/65">
                      {character.heightCm} cm
                    </div>
                  </div>
                ) : null}

                <div className="mt-6 border-t border-white/[0.07] pt-5">
                  <div className="text-[7px] uppercase tracking-[0.25em] text-white/20">
                    Dosije
                  </div>

                  <div className="mt-2 font-mono text-[8px] uppercase tracking-[0.18em] text-white/32">
                    {String(
                      navigation.position,
                    ).padStart(2, "0")}{" "}
                    /{" "}
                    {String(
                      navigation.total,
                    ).padStart(2, "0")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div className="hidden sm:block">
              <div className="font-mono text-[6px] uppercase tracking-[0.24em] text-white/[0.18]">
                CHARACTER / STORY / MEMORY
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

      {/* ================================================================ */}
      {/* CHARACTER DOSSIER                                                */}
      {/* ================================================================ */}

      <section className="px-5 py-28 sm:px-8 sm:py-36 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-16 lg:grid-cols-[200px_1fr]">
            <div className="lg:border-r lg:border-white/[0.07] lg:pr-10">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#b99a61]/60" />

                <span className="text-[7px] uppercase tracking-[0.3em] text-white/25">
                  01 / Dosije
                </span>
              </div>

              <div className="mt-8 hidden font-mono text-[8px] uppercase leading-7 tracking-[0.22em] text-white/[0.16] lg:block">
                UMBRA
                <br />
                CHARACTER
                <br />
                DOSSIER
              </div>
            </div>

            <div className="max-w-[950px]">
              <div className="text-[7px] uppercase tracking-[0.3em] text-[#d6b776]">
                Lik
              </div>

              <h2 className="mt-5 text-[clamp(2.7rem,5vw,5.8rem)] font-[430] leading-[0.9] tracking-[-0.06em]">
                {character.name}
                <br />
                <span className="font-serif italic text-white/52">
                  deo priče.
                </span>
              </h2>

              <p className="mt-9 max-w-[780px] text-[15px] leading-8 text-white/42">
                {
                  character.shortDescription
                }
              </p>

              <div className="mt-12 grid gap-0 border-y border-white/[0.07] sm:grid-cols-3">
                <CharacterStat
                  label="KATEGORIJA"
                  value={getCategoryLabel(
                    character.category,
                  )}
                />

                <CharacterStat
                  label="POL"
                  value={getGenderLabel(
                    character.gender,
                  )}
                />

                <CharacterStat
                  label="VISINA"
                  value={
                    character.heightCm
                      ? `${character.heightCm} cm`
                      : "—"
                  }
                  last
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* PROJECT CAST                                                     */}
      {/* ================================================================ */}

      <section className="border-y border-white/[0.07] bg-[#080808] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#b99a61]/70" />

                <span className="text-[7px] uppercase tracking-[0.32em] text-[#d6b776]">
                  Cast / Arhiva
                </span>
              </div>

              <h2 className="mt-5 text-[clamp(2.3rem,4.5vw,4.8rem)] font-[430] leading-[0.92] tracking-[-0.055em]">
                Likovi projekta
              </h2>
            </div>

            <Link
              href="/likovi"
              data-cursor-interactive
              className="group inline-flex items-center gap-3 text-[7px] uppercase tracking-[0.28em] text-white/32 transition-colors hover:text-[#d6b776]"
            >
              Otvori arhivu
              <ArrowUpRight
                size={14}
                strokeWidth={1.15}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <div className="mt-12 grid border-y border-white/[0.07] sm:grid-cols-2 lg:grid-cols-4">
            {projectCharacters.map(
              (item) => {
                const active =
                  item.id ===
                  character.id;

                return (
                  <Link
                    key={item.id}
                    href={`/likovi/${item.slug}`}
                    data-cursor-interactive
                    className={[
                      "group relative min-h-[130px] border-white/[0.07] p-6 transition-colors duration-400",
                      "sm:border-r lg:border-r",
                      active
                        ? "bg-[#b99a61]/[0.045]"
                        : "hover:bg-white/[0.02]",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="font-mono text-[7px] tracking-[0.2em] text-white/18">
                        {String(
                          item.order,
                        ).padStart(2, "0")}
                      </span>

                      {active ? (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#d6b776]" />
                      ) : (
                        <ArrowUpRight
                          size={14}
                          strokeWidth={1.1}
                          className="text-white/16 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#d6b776]"
                        />
                      )}
                    </div>

                    <div className="mt-8">
                      <div className="text-base tracking-[-0.025em] text-white/68">
                        {item.name}
                      </div>

                      <div className="mt-2 text-[6px] uppercase tracking-[0.25em] text-white/20">
                        {getCategoryLabel(
                          item.category,
                        )}
                      </div>
                    </div>
                  </Link>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* PREV / NEXT                                                       */}
      {/* ================================================================ */}

      <section className="px-5 pb-28 pt-24 sm:px-8 sm:pb-36 lg:px-12">
        <div className="mx-auto max-w-[1440px] border-t border-white/[0.08] pt-8">
          <div className="grid gap-5 sm:grid-cols-2">
            {previous ? (
              <Link
                href={`/likovi/${previous.slug}`}
                data-cursor-interactive
                className="group flex min-h-[112px] items-center justify-between border border-white/[0.08] bg-white/[0.015] px-6 transition-all duration-500 hover:border-[#b99a61]/35 hover:bg-[#b99a61]/[0.025] sm:px-8"
              >
                <div>
                  <div className="text-[7px] uppercase tracking-[0.28em] text-white/22">
                    Prethodni lik
                  </div>

                  <div className="mt-3 text-xl tracking-[-0.04em] text-white/72">
                    {previous.name}
                  </div>
                </div>

                <ArrowLeft
                  size={17}
                  strokeWidth={1.15}
                  className="text-white/28 transition-transform duration-500 group-hover:-translate-x-1 group-hover:text-[#d6b776]"
                />
              </Link>
            ) : (
              <div />
            )}

            {next ? (
              <Link
                href={`/likovi/${next.slug}`}
                data-cursor-interactive
                className="group flex min-h-[112px] items-center justify-between border border-white/[0.08] bg-white/[0.015] px-6 transition-all duration-500 hover:border-[#b99a61]/35 hover:bg-[#b99a61]/[0.025] sm:px-8"
              >
                <div>
                  <div className="text-[7px] uppercase tracking-[0.28em] text-white/22">
                    Sledeći lik
                  </div>

                  <div className="mt-3 text-xl tracking-[-0.04em] text-white/72">
                    {next.name}
                  </div>
                </div>

                <ArrowUpRight
                  size={17}
                  strokeWidth={1.15}
                  className="text-white/28 transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#d6b776]"
                />
              </Link>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}

function CharacterStat({
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