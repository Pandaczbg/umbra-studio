"use client";

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
import { useEffect } from "react";

import type { Character } from "@/data/characters";

const LAST_VISITED_KEY = "umbra-last-character";

type CharacterDossierProps = {
  character: Character;
  relatedCharacters: Character[];
};

export default function CharacterDossier({
  character,
  relatedCharacters,
}: CharacterDossierProps) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    try {
      window.localStorage.setItem(
        LAST_VISITED_KEY,
        character.slug,
      );
    } catch {
      // Storage may be unavailable.
    }
  }, [character.slug]);

  const reveal = {
    hidden: {
      opacity: 0,
      y: reducedMotion ? 0 : 24,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reducedMotion ? 0 : 0.75,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#030303] text-[#F1EDE4]">
      <section className="relative min-h-screen overflow-hidden border-b border-white/[0.07]">
        <motion.div
          initial={{
            opacity: 0,
            scale: reducedMotion ? 1 : 1.025,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: reducedMotion ? 0 : 1.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute inset-0"
        >
          <img
            src={character.image}
            alt={character.name}
            className="h-full w-full object-cover object-center opacity-[0.62] grayscale-[0.14]"
          />
        </motion.div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(198,154,69,0.08),transparent_32%)]" />

        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,3,3,0.98)_0%,rgba(3,3,3,0.72)_28%,rgba(3,3,3,0.16)_65%,rgba(3,3,3,0.58)_100%)]" />

        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(3,3,3,0.98)_0%,rgba(3,3,3,0.04)_46%,rgba(3,3,3,0.62)_100%)]" />

        <div className="absolute inset-0 umbra-grid opacity-[0.018]" />

        <div className="umbra-scan" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-[1500px] flex-col px-6 pb-10 pt-7 sm:px-10 lg:px-16">
          <div className="flex items-center justify-between">
            <Link
              href="/likovi"
              className="group inline-flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.22em] text-white/38 transition-colors duration-300 hover:text-white/80"
            >
              <ArrowLeft
                size={14}
                strokeWidth={1.2}
                className="transition-transform duration-300 group-hover:-translate-x-1"
              />

              Arhiva
            </Link>

            <span className="font-mono text-[8px] uppercase tracking-[0.26em] text-white/20 select-none">
              CHARACTER DOSSIER
            </span>
          </div>

          <div className="mt-auto grid items-end gap-14 pt-28 lg:grid-cols-[1fr_0.4fr]">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={reveal}
            >
              <div className="mb-7 flex items-center gap-4 select-none">
                <span className="h-px w-8 bg-[#C69A45]" />

                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#C69A45]">
                  {character.projectTitle}
                </span>
              </div>

              <h1 className="select-none max-w-5xl text-[clamp(4rem,11vw,11rem)] font-[430] leading-[0.76] tracking-[-0.08em]">
                {character.name}
              </h1>

              <p className="mt-10 max-w-2xl text-base leading-8 text-white/46 sm:text-lg">
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
                  label="CATEGORY"
                  value={character.category}
                />

                <DossierField
                  label="GENDER"
                  value={
                    character.gender === "MALE"
                      ? "Muški"
                      : "Ženski"
                  }
                />

                <DossierField
                  label="HEIGHT"
                  value={
                    character.heightCm
                      ? `${character.heightCm} cm`
                      : "Nije definisano"
                  }
                />

                <div>
                  <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/20">
                    PROJECT
                  </p>

                  <Link
                    href={`/serije/${character.projectSlug}`}
                    className="group mt-3 inline-flex items-center gap-2 text-sm text-white/72"
                  >
                    {character.projectTitle}

                    <ArrowUpRight
                      size={13}
                      strokeWidth={1.2}
                      className="text-[#C69A45] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

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
              <div className="flex items-start gap-4 select-none">
                <span className="mt-[0.18em] h-px w-8 bg-[#C69A45]" />

                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-white/30">
                    PROFILE
                  </p>

                  <p className="mt-3 font-mono text-[8px] uppercase tracking-[0.2em] text-white/14">
                    01 / DOSSIER
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-24">
              <div>
                <p className="max-w-3xl text-[clamp(1.45rem,2.5vw,2.4rem)] font-light leading-[1.32] tracking-[-0.035em] text-white/75">
                  {character.shortDescription}
                </p>
              </div>

              <div className="border-t border-white/[0.08] pt-6">
                <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/22">
                  ARCHIVE MEMORY
                </p>

                <div className="mt-5 flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C69A45]" />

                  <span className="text-sm text-white/48">
                    Poslednje pregledan lik:{" "}
                    <span className="text-white/72">
                      {character.name}
                    </span>
                  </span>
                </div>

                <p className="mt-4 text-[11px] leading-6 text-white/27">
                  Umbra arhiva pamti poslednju tačku
                  istraživanja na ovom uređaju.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {relatedCharacters.length > 0 ? (
        <section className="border-b border-white/[0.07] bg-[#030303] px-6 py-28 sm:px-10 lg:px-16 lg:py-36">
          <div className="mx-auto max-w-[1500px]">
            <div className="mb-12">
              <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-[#C69A45]">
                CONNECTED
              </p>

              <h2 className="mt-5 max-w-4xl text-[clamp(2.5rem,5vw,5rem)] font-[430] leading-[0.88] tracking-[-0.06em]">
                Isti svet.
              </h2>
            </div>

            <div className="grid gap-px border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-3">
              {relatedCharacters
                .slice(0, 3)
                .map((related) => (
                  <Link
                    key={related.id}
                    href={`/likovi/${related.slug}`}
                    className="group relative min-h-[390px] overflow-hidden bg-[#070707]"
                  >
                    <img
                      src={related.image}
                      alt={related.name}
                      className="absolute inset-0 h-full w-full object-cover grayscale-[0.2] transition duration-700 ease-out group-hover:scale-[1.035]"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />

                    <div className="absolute inset-x-7 bottom-7">
                      <div className="mb-4 flex items-center gap-3">
                        <span className="h-px w-6 bg-[#C69A45]" />

                        <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/34">
                          {related.category}
                        </span>
                      </div>

                      <div className="flex items-end justify-between gap-4">
                        <h3 className="text-3xl font-[430] tracking-[-0.045em]">
                          {related.name}
                        </h3>

                        <ArrowUpRight
                          size={17}
                          strokeWidth={1.2}
                          className="text-white/28 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#C69A45]"
                        />
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      ) : null}

      <footer className="bg-[#030303] px-6 py-10 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-5 border-t border-white/[0.07] pt-7">
          <Link
            href="/likovi"
            className="inline-flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.2em] text-white/24 transition-colors duration-300 hover:text-[#C69A45]"
          >
            <ArrowLeft
              size={13}
              strokeWidth={1.2}
            />

            Nazad
          </Link>

          <div className="flex items-center gap-3">
            <ScanLine
              size={13}
              strokeWidth={1.2}
              className="text-[#C69A45]/35"
            />

            <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/15">
              UMBRA DOSSIER
            </span>
          </div>

          <Link
            href={`/serije/${character.projectSlug}`}
            className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/24 transition-colors duration-300 hover:text-[#C69A45]"
          >
            Projekat →
          </Link>
        </div>
      </footer>
    </main>
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
      <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/20">
        {label}
      </p>

      <p className="mt-3 text-sm text-white/72">
        {value}
      </p>
    </div>
  );
}