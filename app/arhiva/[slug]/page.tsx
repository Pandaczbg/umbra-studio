import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Archive, CornerDownRight } from "lucide-react";
import { notFound } from "next/navigation";

import { getArchiveEntries } from "@/lib/archive";
import { createPageMetadata } from "@/lib/seo";

type ArchivePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const GOLD = "#c7a96b";
const GOLD_LIGHT = "#ead39a";

function getArchiveEntry(slug: string) {
  return getArchiveEntries().find((entry) => entry.id === slug);
}

export function generateStaticParams() {
  return getArchiveEntries().map((entry) => ({
    slug: entry.id,
  }));
}

export async function generateMetadata(
  props: ArchivePageProps,
): Promise<Metadata> {
  const params = await props.params;
  const entry = getArchiveEntry(params.slug);

  if (!entry) {
    return createPageMetadata("sr", {
      title: "Arhiva — Umbra Studio",
      pathname: `/arhiva/${params.slug}`,
    });
  }

  return createPageMetadata("sr", {
    title: `${entry.title.sr} — Umbra Studio`,
    description:
      entry.description?.sr ?? "Arhivski zapis Umbra Studija.",
    pathname: `/arhiva/${entry.id}`,
  });
}

export default async function ArchiveEntryPage(
  props: ArchivePageProps,
) {
  const params = await props.params;
  const entry = getArchiveEntry(params.slug);

  if (!entry) {
    notFound();
  }

  return (
    <main
      data-umbra-scene="archive-entry"
      className="min-h-screen overflow-x-clip bg-[#030303] text-[#F1EDE4]"
    >
      {/* ─────────────────────────────────────────────
          ENTRY HERO
      ───────────────────────────────────────────── */}

      <section className="relative overflow-hidden border-b border-white/[0.055]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div
            className="absolute left-[72%] top-[8%] h-[580px] w-[580px] -translate-x-1/2 rounded-full"
            style={{
              background: `radial-gradient(circle, ${GOLD}0b 0%, transparent 68%)`,
              filter: "blur(110px)",
            }}
          />

          <div
            className="absolute -left-[18%] bottom-[-32%] h-[560px] w-[560px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,.025) 0%, transparent 70%)",
              filter: "blur(100px)",
            }}
          />

          <div
            className="absolute inset-0 opacity-[0.014]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.48) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.48) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />

          <div className="absolute inset-x-[5.5%] top-0 h-px bg-white/[0.04]" />
          <div className="absolute inset-x-[5.5%] bottom-0 h-px bg-white/[0.025]" />

          <div className="absolute left-[5.5%] top-0 h-full w-px bg-white/[0.018]" />
          <div className="absolute right-[5.5%] top-0 h-full w-px bg-white/[0.018]" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1560px] px-5 pb-20 pt-20 sm:px-8 sm:pb-24 sm:pt-24 lg:px-14 lg:pb-32 lg:pt-28">
          <div className="flex items-center justify-between border-b border-white/[0.055] pb-5">
            <Link
              href="/arhiva"
              className="group inline-flex min-h-10 items-center gap-3 text-[7px] uppercase tracking-[0.26em] text-white/[0.28] transition-colors duration-300 hover:text-white/[0.62] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/45"
            >
              <ArrowLeft
                aria-hidden="true"
                size={13}
                strokeWidth={1.1}
                className="transition-transform duration-300 group-hover:-translate-x-0.5"
              />

              <span>Nazad u arhivu</span>
            </Link>

            <div className="hidden items-center gap-3 sm:flex">
              <Archive
                aria-hidden="true"
                size={12}
                strokeWidth={1}
                className="text-[#ead39a]/40"
              />

              <span className="font-mono text-[6px] uppercase tracking-[0.3em] text-white/[0.16]">
                UMBRA / ARCHIVE ENTRY
              </span>
            </div>
          </div>

          <div className="relative mt-16 grid gap-14 lg:mt-24 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-20">
            <div className="max-w-[1040px]">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-px w-9"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${GOLD})`,
                  }}
                />

                <span
                  className="font-mono text-[7px] uppercase tracking-[0.3em]"
                  style={{
                    color: `${GOLD_LIGHT}62`,
                  }}
                >
                  {entry.type}
                </span>
              </div>

              <h1 className="mt-7 max-w-[1050px] text-[clamp(3.15rem,7.8vw,8.2rem)] font-[430] uppercase leading-[0.8] tracking-[-0.08em] text-white">
                {entry.title.sr}
              </h1>

              <div className="mt-10 flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="h-px w-14 sm:w-24"
                  style={{
                    background: `linear-gradient(90deg, ${GOLD}70, transparent)`,
                  }}
                />

                <span className="font-mono text-[6px] uppercase tracking-[0.27em] text-white/[0.15]">
                  ARHIVSKI TRAG
                </span>
              </div>

              {entry.description?.sr ? (
                <p className="mt-7 max-w-[720px] text-[14px] leading-7 text-white/[0.4] sm:text-[15px] sm:leading-8">
                  {entry.description.sr}
                </p>
              ) : null}
            </div>

            <div className="lg:flex lg:items-end lg:justify-end">
              <div className="relative w-full max-w-[300px] border border-white/[0.07] bg-white/[0.015] p-5 backdrop-blur-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-x-5 top-0 h-px"
                  style={{
                    background: `linear-gradient(90deg, ${GOLD}48, transparent)`,
                  }}
                />

                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="font-mono text-[6px] uppercase tracking-[0.28em] text-white/[0.17]">
                      ZAPIS
                    </p>

                    <p className="mt-3 text-[clamp(2.2rem,4vw,3.7rem)] font-[420] uppercase leading-none tracking-[-0.07em] text-white/[0.9]">
                      {entry.type}
                    </p>
                  </div>

                  <span
                    aria-hidden="true"
                    className="mt-1 h-2 w-2 rounded-full"
                    style={{
                      background: GOLD_LIGHT,
                      boxShadow: `0 0 18px ${GOLD}55`,
                    }}
                  />
                </div>

                <div className="mt-6 border-t border-white/[0.055] pt-4">
                  <p className="font-mono text-[6px] uppercase tracking-[0.26em] text-white/[0.17]">
                    IDENTIFIKATOR
                  </p>

                  <p className="mt-2 break-all font-mono text-[8px] leading-5 text-white/[0.32]">
                    {entry.id}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          DOSSIER
      ───────────────────────────────────────────── */}

      <section className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/20 to-transparent"
        />

        <div className="relative z-10 mx-auto max-w-[1560px] px-5 py-20 sm:px-8 sm:py-24 lg:px-14 lg:py-28">
          <div className="mb-8 flex items-center justify-between border-b border-white/[0.055] pb-6">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-px w-7"
                style={{
                  background: GOLD,
                }}
              />

              <p
                className="font-mono text-[7px] uppercase tracking-[0.34em]"
                style={{
                  color: `${GOLD_LIGHT}80`,
                }}
              >
                DOSIJE
              </p>
            </div>

            <span className="font-mono text-[6px] uppercase tracking-[0.28em] text-white/[0.13]">
              ENTRY / 01
            </span>
          </div>

          <div className="grid gap-px overflow-hidden border border-white/[0.07] bg-white/[0.07] lg:grid-cols-[0.68fr_1.32fr]">
            <aside className="relative bg-[#060606] p-6 sm:p-8 lg:p-10">
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px"
                style={{
                  background: `linear-gradient(90deg, ${GOLD}35, transparent)`,
                }}
              />

              <p className="font-mono text-[6px] uppercase tracking-[0.28em] text-[#ead39a]/50">
                METAPODACI
              </p>

              <dl className="mt-8 space-y-7">
                <div>
                  <dt className="font-mono text-[6px] uppercase tracking-[0.24em] text-white/[0.15]">
                    TIP ZAPISA
                  </dt>

                  <dd className="mt-2 text-[11px] uppercase tracking-[0.14em] text-white/[0.56]">
                    {entry.type}
                  </dd>
                </div>

                {entry.date ? (
                  <div>
                    <dt className="font-mono text-[6px] uppercase tracking-[0.24em] text-white/[0.15]">
                      DATUM
                    </dt>

                    <dd className="mt-2 text-[11px] text-white/[0.56]">
                      {entry.date}
                    </dd>
                  </div>
                ) : null}

                <div>
                  <dt className="font-mono text-[6px] uppercase tracking-[0.24em] text-white/[0.15]">
                    ID ZAPISA
                  </dt>

                  <dd className="mt-2 break-all font-mono text-[9px] leading-5 text-white/[0.3]">
                    {entry.id}
                  </dd>
                </div>
              </dl>

              <div className="mt-12 border-t border-white/[0.055] pt-5">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full"
                    style={{
                      background: GOLD_LIGHT,
                      boxShadow: `0 0 12px ${GOLD}40`,
                    }}
                  />

                  <span className="font-mono text-[6px] uppercase tracking-[0.27em] text-white/[0.2]">
                    CANONICAL ENTRY
                  </span>
                </div>
              </div>
            </aside>

            <article className="relative bg-[#070707] p-6 sm:p-8 lg:p-12">
              <div className="absolute right-6 top-6 sm:right-8 sm:top-8 lg:right-10 lg:top-10">
                <CornerDownRight
                  aria-hidden="true"
                  size={15}
                  strokeWidth={1}
                  className="text-white/[0.1]"
                />
              </div>

              <p className="font-mono text-[6px] uppercase tracking-[0.28em] text-white/[0.15]">
                UMBRA / ARCHIVE / RECORD
              </p>

              <div className="mt-8 max-w-[820px] border-l border-white/[0.07] pl-6 sm:pl-8">
                <p className="text-[13px] leading-7 text-white/[0.4] sm:text-[14px] sm:leading-8">
                  {entry.description?.sr ??
                    "Detaljan opis ovog arhivskog zapisa još nije objavljen."}
                </p>
              </div>

              <div className="mt-12 grid gap-4 border-t border-white/[0.055] pt-6 sm:grid-cols-2">
                <div className="border border-white/[0.055] bg-white/[0.012] p-5">
                  <p className="font-mono text-[6px] uppercase tracking-[0.25em] text-white/[0.15]">
                    STATUS
                  </p>

                  <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-white/[0.38]">
                    ARHIVIRANO
                  </p>
                </div>

                <div className="border border-white/[0.055] bg-white/[0.012] p-5">
                  <p className="font-mono text-[6px] uppercase tracking-[0.25em] text-white/[0.15]">
                    IZVOR
                  </p>

                  <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-white/[0.38]">
                    UMBRA STUDIO
                  </p>
                </div>
              </div>
            </article>
          </div>

          {/* ─────────────────────────────────────────
              EXIT FRAME
          ───────────────────────────────────────── */}

          <div className="mt-10 border-t border-white/[0.055] pt-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-px w-8"
                  style={{
                    background: `${GOLD}48`,
                  }}
                />

                <span className="font-mono text-[6px] uppercase tracking-[0.28em] text-white/[0.14]">
                  UMBRA / ARCHIVE
                </span>
              </div>

              <Link
                href="/arhiva"
                className="group inline-flex min-h-10 items-center gap-3 border border-white/[0.07] bg-white/[0.015] px-4 py-3 transition-colors duration-300 hover:border-[#ead39a]/20 hover:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/45"
              >
                <span className="text-[7px] uppercase tracking-[0.26em] text-white/[0.28] transition-colors duration-300 group-hover:text-white/[0.64]">
                  Svi zapisi
                </span>

                <ArrowUpRight
                  aria-hidden="true"
                  size={13}
                  strokeWidth={1.1}
                  className="text-[#ead39a]/50 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}