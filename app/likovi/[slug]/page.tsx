import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";

import { characters } from "@/data/characters";

export function generateStaticParams() {
  return characters.map((character) => ({
    slug: character.slug,
  }));
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

  const category =
    character.category === "MAIN"
      ? "Glavni lik"
      : "Sporedni lik";

  const projectHref =
    character.projectSlug
      ? `/serije/${character.projectSlug}`
      : "/serije";

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* HERO / DOSSIER COVER */}
      <section className="relative min-h-[100svh] overflow-hidden">
        <Image
          src={character.image ?? "/umbra-avatar.png"}
          alt={character.name}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-[0.68]"
        />

        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,4,4,.97)_0%,rgba(4,4,4,.72)_34%,rgba(4,4,4,.25)_68%,rgba(4,4,4,.82)_100%)]" />

        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(4,4,4,.98)_0%,rgba(4,4,4,.08)_48%,rgba(4,4,4,.5)_100%)]" />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_67%_38%,rgba(185,154,97,.085),transparent_34%)]" />

        <div className="pointer-events-none absolute inset-6 border border-white/[0.07] sm:inset-8 lg:inset-10" />

        <div className="pointer-events-none absolute left-6 top-6 h-14 w-14 border-l border-t border-[#b99a61]/50 sm:left-8 sm:top-8 lg:left-10 lg:top-10" />

        <div className="pointer-events-none absolute bottom-6 right-6 h-14 w-14 border-b border-r border-[#b99a61]/32 sm:bottom-8 sm:right-8 lg:bottom-10 lg:right-10" />

        <div className="relative mx-auto flex min-h-[100svh] max-w-[1440px] flex-col justify-between px-5 pb-12 pt-36 sm:px-8 sm:pb-16 lg:px-12 lg:pt-44">
          {/* TOP IDENTIFICATION */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="h-px w-9 bg-[#b99a61]/70" />

              <span className="text-[8px] uppercase tracking-[0.36em] text-white/40">
                Umbra Studio / Character
              </span>
            </div>

            <span className="font-mono text-[7px] tracking-[0.22em] text-white/[0.18]">
              DOSSIER / {String(character.id).slice(-2)}
            </span>
          </div>

          {/* CHARACTER IDENTITY */}
          <div className="grid gap-12 lg:grid-cols-[1fr_280px] lg:items-end">
            <div>
              <div className="mb-6 flex flex-wrap items-center gap-4 text-[7px] uppercase tracking-[0.3em]">
                <span className="text-[#d6b776]/70">
                  {category}
                </span>

                <span className="h-px w-6 bg-white/[0.12]" />

                <span className="text-white/30">
                  {character.projectTitle ?? ""}
                </span>
              </div>

              <h1 className="max-w-[1050px] text-[clamp(4.3rem,10vw,11rem)] font-[440] uppercase leading-[0.8] tracking-[-0.08em]">
                {character.name}
              </h1>

              <p className="mt-9 max-w-[700px] text-sm leading-7 text-white/42 sm:text-base sm:leading-8">
                {character.shortDescription ?? ""}
              </p>
            </div>

            <div className="hidden lg:block">
              <div className="relative border-l border-white/[0.07] pl-6">
                <span className="absolute left-[-1px] top-0 h-10 w-px bg-gradient-to-b from-[#b99a61]/70 to-transparent" />

                <div className="text-[7px] uppercase tracking-[0.28em] text-white/20">
                  Character dossier
                </div>

                <div className="mt-4 font-mono text-[8px] uppercase leading-7 tracking-[0.2em] text-white/[0.18]">
                  CAST / PROFILE
                  <br />
                  STORY / ROLE
                  <br />
                  VISUAL / IDENTITY
                </div>

                <div className="mt-5 h-px bg-white/[0.06]" />

                <div className="mt-3 font-mono text-[6px] uppercase tracking-[0.22em] text-[#d6b776]/40">
                  UMBRA / {String(character.id).slice(-2)}
                </div>
              </div>
            </div>
          </div>

          {/* HERO FOOT */}
          <div className="flex items-end justify-between">
            <div className="hidden sm:block">
              <div className="font-mono text-[6px] uppercase tracking-[0.24em] text-white/[0.16]">
                STORY / IMAGE / CHARACTER
              </div>

              <div className="mt-3 h-px w-24 bg-gradient-to-r from-[#b99a61]/55 to-transparent" />
            </div>

            <div className="ml-auto flex items-center gap-3 text-[7px] uppercase tracking-[0.28em] text-white/28">
              <span className="h-5 w-px bg-white/[0.12]" />
              Scroll to explore
            </div>
          </div>
        </div>
      </section>

      {/* CHARACTER PROFILE */}
      <section className="px-5 py-28 sm:px-8 sm:py-36 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-16 lg:grid-cols-[250px_1fr]">
            <div className="lg:border-r lg:border-white/[0.07] lg:pr-10">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#b99a61]/65" />

                <span className="text-[7px] uppercase tracking-[0.3em] text-white/24">
                  01 / Profile
                </span>
              </div>

              <div className="mt-8 hidden font-mono text-[8px] uppercase leading-7 tracking-[0.2em] text-white/[0.14] lg:block">
                CHARACTER
                <br />
                DOSSIER
                <br />
                ACCESS
              </div>
            </div>

            <div className="max-w-[900px]">
              <h2 className="text-[clamp(2.8rem,5vw,5.6rem)] font-[430] leading-[0.9] tracking-[-0.06em]">
                Lik koji
                <br />
                <span className="font-serif italic text-white/58">
                  nosi priču.
                </span>
              </h2>

              <p className="mt-9 max-w-[760px] text-[15px] leading-8 text-white/40">
                {character.shortDescription ?? ""}
              </p>

              <div className="mt-12 grid border-y border-white/[0.07] sm:grid-cols-3">
                <CharacterStat
                  label="NAME"
                  value={character.name}
                />

                <CharacterStat
                  label="ROLE"
                  value={category}
                />

                <CharacterStat
                  label="PROJECT"
                  value={
                    character.projectTitle ??
                    "Umbra Studio"
                  }
                  last
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PORTRAIT INTERLUDE */}
      <section className="px-5 pb-28 sm:px-8 sm:pb-36 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="relative aspect-[16/9] overflow-hidden border border-white/[0.08]">
            <Image
              src={
                character.image ??
                "/umbra-avatar.png"
              }
              alt={character.name}
              fill
              sizes="(max-width: 1024px) 100vw, 1440px"
              className="object-cover object-center opacity-[0.56]"
            />

            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,.82),rgba(5,5,5,.16),rgba(5,5,5,.72))]" />

            <div className="absolute inset-5 border border-white/[0.07] sm:inset-7" />

            <div className="absolute left-7 top-7 flex items-center gap-3 sm:left-9 sm:top-9">
              <span className="h-px w-7 bg-[#b99a61]/65" />

              <span className="font-mono text-[6px] uppercase tracking-[0.27em] text-white/28">
                Visual dossier
              </span>
            </div>

            <div className="absolute bottom-7 left-7 right-7 flex items-end justify-between sm:bottom-9 sm:left-9 sm:right-9">
              <div>
                <div className="text-[8px] uppercase tracking-[0.26em] text-white/24">
                  {character.projectTitle ??
                    "Umbra Studio"}
                </div>

                <div className="mt-3 text-[clamp(1.6rem,3vw,3rem)] tracking-[-0.05em] text-white/82">
                  {character.name}
                </div>
              </div>

              <div className="hidden items-center gap-3 sm:flex">
                <span className="font-mono text-[6px] uppercase tracking-[0.25em] text-white/[0.18]">
                  UMBRA / CAST
                </span>

                <span className="h-px w-8 bg-[#b99a61]/50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LINKS */}
      <section className="px-5 pb-28 sm:px-8 sm:pb-36 lg:px-12">
        <div className="mx-auto max-w-[1440px] border-t border-white/[0.08] pt-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <Link
              href="/likovi"
              data-cursor-interactive
              className="group flex min-h-[105px] items-center justify-between border border-white/[0.08] bg-white/[0.015] px-6 transition-all duration-500 hover:border-[#b99a61]/35 hover:bg-[#b99a61]/[0.025] sm:px-8"
            >
              <div>
                <div className="text-[7px] uppercase tracking-[0.28em] text-white/22">
                  Character Archive
                </div>

                <div className="mt-3 text-xl tracking-[-0.04em] text-white/72">
                  Svi likovi
                </div>
              </div>

              <ArrowLeft
                size={17}
                strokeWidth={1.15}
                className="text-white/28 transition-transform duration-500 group-hover:-translate-x-1 group-hover:text-[#d6b776]"
              />
            </Link>

            <Link
              href={projectHref}
              data-cursor-interactive
              className="group flex min-h-[105px] items-center justify-between border border-white/[0.08] bg-white/[0.015] px-6 transition-all duration-500 hover:border-[#b99a61]/35 hover:bg-[#b99a61]/[0.025] sm:px-8"
            >
              <div>
                <div className="text-[7px] uppercase tracking-[0.28em] text-white/22">
                  Project
                </div>

                <div className="mt-3 text-xl tracking-[-0.04em] text-white/72">
                  {character.projectTitle ??
                    "Pogledaj projekat"}
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

      <div className="mt-3 text-sm uppercase tracking-[0.07em] text-white/62">
        {value}
      </div>
    </div>
  );
}