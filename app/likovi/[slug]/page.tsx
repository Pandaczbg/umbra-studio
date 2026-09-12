import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";

import {
  characters,
  type Character,
} from "@/data/characters";
import {
  getCharacterHref,
  getCharacterNavigation,
} from "@/lib/characterNavigation";

export function generateStaticParams() {
  return characters.map((character) => ({
    slug: character.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const character = characters.find(
    (item) => item.slug === slug,
  );

  if (!character) {
    return {
      title: "Lik nije pronađen",
      description: "Traženi Umbra Studio lik nije pronađen",
    };
  }

  return {
    title: `${character.name} — Umbra Studio`,
    description: character.shortDescription,
    alternates: {
      canonical: `/likovi/${character.slug}`,
    },
    openGraph: {
      title: `${character.name} — Umbra Studio`,
      description: character.shortDescription,
      url: `/likovi/${character.slug}`,
    },
  };
}

function getCategoryLabel(
  category: Character["category"],
) {
  return category === "MAIN"
    ? "Glavni lik"
    : "Sporedni lik";
}

function getGenderLabel(
  gender: Character["gender"],
) {
  if (gender === "MALE") {
    return "Muški";
  }

  if (gender === "FEMALE") {
    return "Ženski";
  }

  return "Nije navedeno";
}

function getProjectHref(
  projectSlug: string,
) {
  return `/serije/${projectSlug}`;
}

export default async function CharacterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const character = characters.find(
    (item) => item.slug === slug,
  );

  if (!character) {
    notFound();
  }

  const navigation =
    getCharacterNavigation(character);

  const previousHref = navigation.previous
    ? getCharacterHref(
        navigation.previous,
        "sr",
      )
    : null;

  const nextHref = navigation.next
    ? getCharacterHref(
        navigation.next,
        "sr",
      )
    : null;

  return (
    <main
      data-umbra-scene="character-dossier"
      className="min-h-screen overflow-hidden bg-[var(--umbra-bg)] text-[#f1ede4]"
    >
      <section
        aria-labelledby="character-title"
        className="relative min-h-[100svh] overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 72% 24%, rgba(199,169,107,.07), transparent 30%), linear-gradient(180deg, #030303 0%, #050505 52%, #030303 100%)",
          }}
        />

        {character.image ? (
          <>
            <Image
              src={character.image}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-[0.34]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,3,3,.97)_0%,rgba(3,3,3,.86)_42%,rgba(3,3,3,.52)_100%)]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(0deg,rgba(3,3,3,.98)_0%,rgba(3,3,3,.18)_52%,rgba(3,3,3,.62)_100%)]"
            />
          </>
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 70% 38%, rgba(199,169,107,.09), transparent 28%), radial-gradient(circle at 48% 56%, rgba(255,255,255,.018), transparent 28%)",
            }}
          >
            <div className="absolute left-1/2 top-1/2 h-[23rem] w-[23rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.035] sm:h-[30rem] sm:w-[30rem]" />
            <div className="absolute left-1/2 top-1/2 h-[15rem] w-[15rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#c7a96b]/[0.07] sm:h-[20rem] sm:w-[20rem]" />
          </div>
        )}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-5 border border-white/[0.065] sm:inset-7 lg:inset-10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-5 top-5 h-14 w-14 border-l border-t border-[#c7a96b]/35 sm:left-7 sm:top-7 lg:left-10 lg:top-10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-5 right-5 h-14 w-14 border-b border-r border-[#c7a96b]/22 sm:bottom-7 sm:right-7 lg:bottom-10 lg:right-10"
        />

        <div className="relative mx-auto flex min-h-[100svh] max-w-[1500px] flex-col justify-between px-5 pb-12 pt-32 sm:px-8 sm:pb-16 sm:pt-36 lg:px-12 lg:pt-44">
          <div className="flex items-center justify-between gap-6">
            <Link
              href="/likovi"
              data-cursor-interactive
              className="group inline-flex items-center gap-3 text-[7px] uppercase tracking-[0.28em] text-white/[0.30] transition-colors duration-300 hover:text-[#ead39a] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
            >
              <ArrowLeft
                aria-hidden="true"
                size={13}
                strokeWidth={1.1}
                className="transition-transform duration-300 group-hover:-translate-x-1"
              />
              Arhiva likova
            </Link>

            <span className="font-mono text-[7px] uppercase tracking-[0.24em] text-white/[0.18]">
              DOSIJE /{" "}
              {String(
                navigation.position,
              ).padStart(2, "0")}
              {" / "}
              {String(
                navigation.total,
              ).padStart(2, "0")}
            </span>
          </div>

          <div className="grid items-end gap-12 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px]">
            <div className="max-w-[1000px]">
              <div className="mb-6 flex flex-wrap items-center gap-4 text-[7px] uppercase tracking-[0.3em] text-white/[0.28]">
                <span>
                  {character.projectTitle}
                </span>

                <span
                  aria-hidden="true"
                  className="h-px w-6 bg-white/[0.10]"
                />

                <span>
                  {getCategoryLabel(
                    character.category,
                  )}
                </span>
              </div>

              <h1
                id="character-title"
                className="max-w-[1100px] text-[clamp(4rem,10vw,10rem)] font-[430] leading-[0.8] tracking-[-0.075em]"
              >
                {character.name}
              </h1>

              <p className="mt-7 max-w-[720px] text-sm leading-7 text-white/[0.38] sm:text-base sm:leading-8">
                {character.shortDescription}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/[0.08] pt-5 text-[7px] uppercase tracking-[0.27em] text-white/[0.24]">
                <span>
                  Projekat ·{" "}
                  {character.projectTitle}
                </span>

                <span>
                  Uloga ·{" "}
                  {getCategoryLabel(
                    character.category,
                  )}
                </span>

                <span>
                  Pol ·{" "}
                  {getGenderLabel(
                    character.gender,
                  )}
                </span>

                {character.heightCm ? (
                  <span>
                    Visina ·{" "}
                    {character.heightCm} cm
                  </span>
                ) : null}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[290px]">
              <div
                aria-hidden="true"
                className="absolute -inset-4 border border-white/[0.03]"
              />

              <div
                aria-hidden="true"
                className="absolute -inset-2 border border-[#c7a96b]/[0.09]"
              />

              <div className="relative aspect-[0.78/1] overflow-hidden border border-white/[0.08] bg-[#060606] shadow-[0_30px_100px_rgba(0,0,0,.38)]">
                {character.image ? (
                  <Image
                    src={character.image}
                    alt={character.name}
                    fill
                    priority
                    sizes="(min-width: 1024px) 290px, 72vw"
                    className="object-cover"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(circle at 50% 38%, rgba(234,211,154,.10), transparent 24%), linear-gradient(180deg, rgba(255,255,255,.018), rgba(0,0,0,.36))",
                    }}
                  >
                    <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#ead39a]/[0.10]" />
                    <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.035]" />
                  </div>
                )}

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.02),transparent_46%,rgba(0,0,0,.62))]"
                />

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-4 border border-white/[0.045]"
                />

                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-4 h-8 w-8 border-l border-t border-[#ead39a]/25"
                />

                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-4 right-4 h-8 w-8 border-b border-r border-[#c7a96b]/18"
                />

                <div className="pointer-events-none absolute inset-x-5 bottom-5 flex items-end justify-between">
                  <span className="text-[6px] uppercase tracking-[0.28em] text-white/[0.30]">
                    Character dossier
                  </span>

                  <span className="font-mono text-[6px] tracking-[0.22em] text-white/[0.20]">
                    {String(
                      navigation.position,
                    ).padStart(2, "0")}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between px-1 text-[7px] uppercase tracking-[0.24em] text-white/[0.20]">
                <span>
                  {character.name}
                </span>

                <span>
                  {character.projectTitle}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-end justify-between gap-8">
            <Link
              href={getProjectHref(
                character.projectSlug,
              )}
              data-cursor-interactive
              className="group hidden items-center gap-3 text-[7px] uppercase tracking-[0.26em] text-white/[0.18] transition-colors duration-300 hover:text-[#ead39a] sm:inline-flex"
            >
              Projekat

              <ArrowUpRight
                aria-hidden="true"
                size={12}
                strokeWidth={1.1}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>

            <div className="ml-auto flex items-center gap-3 text-[7px] uppercase tracking-[0.28em] text-white/[0.22]">
              <span
                aria-hidden="true"
                className="h-5 w-px bg-white/[0.10]"
              />
              Skroluj za ulazak
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-28 sm:px-8 sm:py-36 lg:px-12">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-16 lg:grid-cols-[200px_1fr]">
            <div className="lg:border-r lg:border-white/[0.07] lg:pr-10">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-px w-8 bg-[#c7a96b]/65"
                />

                <span className="text-[7px] uppercase tracking-[0.30em] text-white/[0.24]">
                  01 / Dosije
                </span>
              </div>

              <div className="mt-8 hidden font-mono text-[8px] uppercase leading-7 tracking-[0.22em] text-white/[0.14] lg:block">
                UMBRA
                <br />
                CHARACTER
                <br />
                DOSSIER
              </div>
            </div>

            <div className="max-w-[950px]">
              <div className="text-[7px] uppercase tracking-[0.3em] text-[#ead39a]/70">
                Profil lika
              </div>

              <h2 className="mt-5 text-[clamp(2.7rem,5vw,5.8rem)] font-[430] leading-[0.9] tracking-[-0.06em]">
                Priča
                <br />
                <span className="font-serif italic text-white/[0.58]">
                  kroz lik
                </span>
              </h2>

              <p className="mt-9 max-w-[780px] text-[15px] leading-8 text-white/[0.40]">
                {character.shortDescription}
              </p>

              <div className="mt-12 grid border-y border-white/[0.07] sm:grid-cols-4">
                <CharacterStat
                  label="PROJEKAT"
                  value={
                    character.projectTitle
                  }
                />

                <CharacterStat
                  label="ULOGA"
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

      <section className="border-y border-white/[0.07] bg-[#080808] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
        <div className="mx-auto max-w-[1500px]">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="h-px w-8 bg-[#c7a96b]/60"
            />

            <span className="text-[7px] uppercase tracking-[0.32em] text-[#ead39a]/68">
              Svet lika
            </span>
          </div>

          <div className="mt-8 grid gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
            <div>
              <h2 className="max-w-[800px] text-[clamp(2.5rem,5vw,5.3rem)] font-[430] leading-[0.9] tracking-[-0.06em]">
                Mesto lika
                <br />
                <span className="font-serif italic text-white/[0.56]">
                  u priči
                </span>
              </h2>
            </div>

            <div className="max-w-[560px] border-t border-white/[0.07] pt-5 text-sm leading-7 text-white/[0.34]">
              {character.name} pripada projektu{" "}
              <Link
                href={getProjectHref(
                  character.projectSlug,
                )}
                className="text-[#ead39a]/80 transition-colors hover:text-[#f4ddb0]"
                data-cursor-interactive
              >
                {character.projectTitle}
              </Link>
              {" "}i predstavlja deo njegovog kanonskog sveta.
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-28 pt-24 sm:px-8 sm:pb-36 lg:px-12">
        <div className="mx-auto max-w-[1500px] border-t border-white/[0.08] pt-8">
          <div className="grid gap-5 sm:grid-cols-2">
            {previousHref ? (
              <Link
                href={previousHref}
                data-cursor-interactive
                className="group flex min-h-[110px] items-center justify-between border border-white/[0.08] bg-white/[0.012] px-6 transition-[border-color,background-color] duration-500 hover:border-[#c7a96b]/30 hover:bg-[#c7a96b]/[0.022] sm:px-8"
              >
                <div>
                  <div className="text-[7px] uppercase tracking-[0.28em] text-white/[0.20]">
                    Prethodni dosije
                  </div>

                  <div className="mt-3 text-xl tracking-[-0.04em] text-white/[0.68]">
                    {navigation.previous?.name}
                  </div>
                </div>

                <ArrowLeft
                  aria-hidden="true"
                  size={17}
                  strokeWidth={1.15}
                  className="text-white/[0.28] transition-transform duration-300 group-hover:-translate-x-1 group-hover:text-[#ead39a]"
                />
              </Link>
            ) : (
              <Link
                href="/likovi"
                data-cursor-interactive
                className="group flex min-h-[110px] items-center justify-between border border-white/[0.08] bg-white/[0.012] px-6 transition-[border-color,background-color] duration-500 hover:border-[#c7a96b]/30 hover:bg-[#c7a96b]/[0.022] sm:px-8"
              >
                <div>
                  <div className="text-[7px] uppercase tracking-[0.28em] text-white/[0.20]">
                    Arhiva
                  </div>

                  <div className="mt-3 text-xl tracking-[-0.04em] text-white/[0.68]">
                    Svi likovi
                  </div>
                </div>

                <ArrowLeft
                  aria-hidden="true"
                  size={17}
                  strokeWidth={1.15}
                  className="text-white/[0.28] transition-transform duration-300 group-hover:-translate-x-1 group-hover:text-[#ead39a]"
                />
              </Link>
            )}

            {nextHref ? (
              <Link
                href={nextHref}
                data-cursor-interactive
                className="group flex min-h-[110px] items-center justify-between border border-white/[0.08] bg-white/[0.012] px-6 transition-[border-color,background-color] duration-500 hover:border-[#c7a96b]/30 hover:bg-[#c7a96b]/[0.022] sm:px-8"
              >
                <div>
                  <div className="text-[7px] uppercase tracking-[0.28em] text-white/[0.20]">
                    Sledeći dosije
                  </div>

                  <div className="mt-3 text-xl tracking-[-0.04em] text-white/[0.68]">
                    {navigation.next?.name}
                  </div>
                </div>

                <ArrowRight
                  aria-hidden="true"
                  size={17}
                  strokeWidth={1.15}
                  className="text-white/[0.28] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#ead39a]"
                />
              </Link>
            ) : (
              <Link
                href="/likovi"
                data-cursor-interactive
                className="group flex min-h-[110px] items-center justify-between border border-white/[0.08] bg-white/[0.012] px-6 transition-[border-color,background-color] duration-500 hover:border-[#c7a96b]/30 hover:bg-[#c7a96b]/[0.022] sm:px-8"
              >
                <div>
                  <div className="text-[7px] uppercase tracking-[0.28em] text-white/[0.20]">
                    Arhiva
                  </div>

                  <div className="mt-3 text-xl tracking-[-0.04em] text-white/[0.68]">
                    Svi likovi
                  </div>
                </div>

                <ArrowUpRight
                  aria-hidden="true"
                  size={17}
                  strokeWidth={1.15}
                  className="text-white/[0.28] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            )}
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
      <div className="text-[7px] uppercase tracking-[0.28em] text-white/[0.18]">
        {label}
      </div>

      <div className="mt-3 text-sm uppercase tracking-[0.08em] text-white/[0.62]">
        {value}
      </div>
    </div>
  );
}
