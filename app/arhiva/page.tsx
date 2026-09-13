import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import {
  getArchiveEntries,
} from "@/lib/archive";

import {
  createPageMetadata,
} from "@/lib/seo";

export const metadata =
  createPageMetadata(
    "sr",
    {
      title:
        "Arhiva — Umbra Studio",
      description:
        "Arhiva Umbra Studija — projekti, likovi, epizode, priče, koncepti i produkcijski materijal.",
      pathname:
        "/arhiva",
    },
  );

const GOLD =
  "#c7a96b";

const GOLD_LIGHT =
  "#ead39a";

const PANEL =
  "#060606";

export default function ArchivePage() {
  const entries =
    getArchiveEntries();

  const entryCount =
    String(
      entries.length,
    ).padStart(2, "0");

  return (
    <main className="min-h-screen overflow-hidden bg-[#030303] text-[#F1EDE4]">
      <section className="relative overflow-hidden border-b border-white/[0.055]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div
            className="absolute left-[68%] top-[8%] h-[560px] w-[560px] -translate-x-1/2 rounded-full"
            style={{
              background:
                `radial-gradient(circle, ${GOLD}08 0%, transparent 68%)`,
              filter:
                "blur(100px)",
            }}
          />

          <div
            className="absolute inset-0 opacity-[0.018]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.42) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.42) 1px, transparent 1px)",
              backgroundSize:
                "52px 52px",
            }}
          />

          <div className="absolute inset-x-[6%] top-0 h-px bg-white/[0.035]" />
          <div className="absolute left-[6%] top-0 h-full w-px bg-white/[0.018]" />
          <div className="absolute right-[6%] top-0 h-full w-px bg-white/[0.018]" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1500px] px-6 py-24 sm:px-10 sm:py-28 lg:px-16 lg:py-36">
          <div className="flex items-center justify-between border-b border-white/[0.055] pb-5">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-px w-9"
                style={{
                  background:
                    `linear-gradient(90deg, transparent, ${GOLD})`,
                }}
              />

              <span
                className="font-mono text-[7px] tracking-[0.32em]"
                style={{
                  color:
                    `${GOLD_LIGHT}78`,
                }}
              >
                06
              </span>

              <span className="font-mono text-[8px] uppercase tracking-[0.28em] text-white/[0.36]">
                ARHIVA
              </span>
            </div>

            <span className="hidden font-mono text-[6px] uppercase tracking-[0.30em] text-white/[0.14] sm:block">
              UMBRA / ARCHIVE
            </span>
          </div>

          <div className="mt-16 max-w-[980px]">
            <p className="font-mono text-[7px] uppercase tracking-[0.34em] text-white/[0.18]">
              UMBRA / ARCHIVE
            </p>

            <h1 className="mt-6 text-[clamp(3.5rem,7vw,8rem)] font-[430] uppercase leading-[0.82] tracking-[-0.078em] text-white">
              Tragovi
              <span className="block font-serif font-normal italic text-white/[0.52]">
                nastajanja
              </span>
            </h1>

            <span
              aria-hidden="true"
              className="mt-9 block h-px max-w-[520px]"
              style={{
                background:
                  `linear-gradient(90deg, ${GOLD}65, rgba(255,255,255,.06), transparent)`,
              }}
            />

            <p className="mt-7 max-w-[680px] text-[14px] leading-7 text-white/[0.40] sm:text-[15px] sm:leading-8">
              Arhiva čuva razvojne tragove,
              materijal i sadržaj koji pripada
              Umbra univerzumu, ali ne mora biti
              deo glavne navigacije.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-28">
        <div className="flex flex-col gap-5 border-b border-white/[0.055] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p
              className="font-mono text-[7px] uppercase tracking-[0.34em]"
              style={{
                color:
                  `${GOLD_LIGHT}80`,
              }}
            >
              SADRŽAJ
            </p>

            <h2 className="mt-3 text-[clamp(2rem,3.8vw,3.8rem)] font-[430] uppercase leading-[0.88] tracking-[-0.06em] text-white/[0.92]">
              Arhivski zapisi
            </h2>
          </div>

          <span className="font-mono text-[6px] uppercase tracking-[0.28em] text-white/[0.14]">
            {entryCount} ZAPISA
          </span>
        </div>

        {entries.length > 0 ? (
          <div className="mt-6 grid gap-px overflow-hidden border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-3">
            {entries.map(
              (entry) => (
                <article
                  key={entry.id}
                  className="bg-[#060606] p-6 transition-colors duration-300 hover:bg-[#080808]"
                >
                  <p
                    className="font-mono text-[6px] uppercase tracking-[0.28em]"
                    style={{
                      color:
                        `${GOLD_LIGHT}58`,
                    }}
                  >
                    {entry.type}
                  </p>

                  <h3 className="mt-4 text-xl font-[430] uppercase leading-[0.92] tracking-[-0.04em] text-white">
                    {entry.title.sr}
                  </h3>

                  {entry.description?.sr ? (
                    <p className="mt-4 text-[12px] leading-6 text-white/[0.34]">
                      {entry.description.sr}
                    </p>
                  ) : null}

                  <div
                    aria-hidden="true"
                    className="mt-7 h-px w-10"
                    style={{
                      background:
                        `linear-gradient(90deg, ${GOLD}55, transparent)`,
                    }}
                  />
                </article>
              ),
            )}
          </div>
        ) : (
          <div
            className="mt-6 border border-white/[0.07] px-6 py-16 sm:px-10 sm:py-20"
            style={{
              background: PANEL,
            }}
          >
            <div className="max-w-[680px]">
              <span
                aria-hidden="true"
                className="block h-px w-10"
                style={{
                  background:
                    `linear-gradient(90deg, ${GOLD_LIGHT}, transparent)`,
                }}
              />

              <p
                className="mt-6 font-mono text-[7px] uppercase tracking-[0.30em]"
                style={{
                  color:
                    `${GOLD_LIGHT}55`,
                }}
              >
                ARHIVA / U PRIPREMI
              </p>

              <h3 className="mt-4 text-[clamp(1.8rem,3.5vw,3.2rem)] font-[430] uppercase leading-[0.9] tracking-[-0.055em] text-white/[0.92]">
                Arhiva još nije otvorena
              </h3>

              <p className="mt-5 max-w-[560px] text-[13px] leading-7 text-white/[0.34]">
                Canonical arhivski sadržaj još nije
                objavljen. Kada bude spreman,
                pojaviće se ovde bez promene
                strukture stranice.
              </p>
            </div>
          </div>
        )}

        <div className="mt-10 flex flex-col gap-5 border-t border-white/[0.055] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="h-px w-8"
              style={{
                background:
                  `${GOLD}48`,
              }}
            />

            <span className="font-mono text-[6px] uppercase tracking-[0.28em] text-white/[0.14]">
              UMBRA / ARCHIVE
            </span>
          </div>

          <Link
            href="/serije"
            className="group flex items-center gap-3 self-start sm:self-auto"
          >
            <span className="text-[7px] uppercase tracking-[0.26em] text-white/[0.24] transition-colors duration-300 group-hover:text-white/[0.55]">
              Istraži projekte
            </span>

            <ArrowUpRight
              aria-hidden="true"
              size={13}
              strokeWidth={1.1}
              className="text-[#ead39a]/55 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </section>
    </main>
  );
}