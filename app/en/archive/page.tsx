import Link from "next/link";
import { ArrowUpRight, Archive, CornerDownRight } from "lucide-react";

import { getArchiveEntries } from "@/lib/archive";
import { createPageMetadata } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata = createPageMetadata("en", {
  title: "Archive — Umbra Studio",
  description:
    "Umbra Studio archive — projects, characters, episodes, stories, concepts and production material.",
  pathname: "/en/archive",
});

const GOLD = "#c7a96b";
const GOLD_LIGHT = "#ead39a";

export default function ArchivePage() {
  const entries = getArchiveEntries();
  const entryCount = String(entries.length).padStart(2, "0");

  return (
    <main
      data-umbra-scene="archive"
      className="min-h-screen overflow-x-clip bg-[#030303] text-[#F1EDE4]"
    >
      {/* ─────────────────────────────────────────────
          ARCHIVE HERO
      ───────────────────────────────────────────── */}

      <section className="relative overflow-hidden border-b border-white/[0.055]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div
            className="absolute left-[70%] top-[6%] h-[620px] w-[620px] -translate-x-1/2 rounded-full"
            style={{
              background: `radial-gradient(circle, ${GOLD}0b 0%, transparent 68%)`,
              filter: "blur(110px)",
            }}
          />

          <div
            className="absolute -left-[12%] bottom-[-28%] h-[520px] w-[520px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,.025) 0%, transparent 70%)",
              filter: "blur(90px)",
            }}
          />

          <div
            className="absolute inset-0 opacity-[0.014]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />

          <div className="absolute inset-x-[5.5%] top-0 h-px bg-white/[0.04]" />
          <div className="absolute inset-x-[5.5%] bottom-0 h-px bg-white/[0.025]" />

          <div className="absolute left-[5.5%] top-0 h-full w-px bg-white/[0.018]" />
          <div className="absolute right-[5.5%] top-0 h-full w-px bg-white/[0.018]" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1560px] px-5 pb-20 pt-24 sm:px-8 sm:pb-24 sm:pt-28 lg:px-14 lg:pb-32 lg:pt-36">
          <div className="flex items-center justify-between border-b border-white/[0.055] pb-5">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-px w-8"
                style={{
                  background: `linear-gradient(90deg, transparent, ${GOLD})`,
                }}
              />

              <span
                className="font-mono text-[7px] tracking-[0.3em]"
                style={{
                  color: `${GOLD_LIGHT}78`,
                }}
              >
                06
              </span>

              <span className="font-mono text-[8px] uppercase tracking-[0.28em] text-white/[0.36]">
                ARCHIVE
              </span>
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              <Archive
                aria-hidden="true"
                size={12}
                strokeWidth={1}
                className="text-[#ead39a]/40"
              />

              <span className="font-mono text-[6px] uppercase tracking-[0.3em] text-white/[0.16]">
                UMBRA / ARCHIVE VAULT
              </span>
            </div>
          </div>

          <div className="relative mt-16 grid gap-14 lg:mt-24 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-20">
            <div className="max-w-[980px]">
              <p className="font-mono text-[7px] uppercase tracking-[0.34em] text-white/[0.18]">
                UMBRA / ARCHIVE
              </p>

              <h1 className="mt-6 text-[clamp(3.45rem,8vw,8.6rem)] font-[430] uppercase leading-[0.8] tracking-[-0.08em] text-white">
                Traces
                <span className="block pl-[0.02em] font-serif font-normal italic text-white/[0.5]">
                  in the making
                </span>
              </h1>

              <div className="mt-9 flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="block h-px w-16 sm:w-24"
                  style={{
                    background: `linear-gradient(90deg, ${GOLD}65, transparent)`,
                  }}
                />

                <span className="font-mono text-[6px] uppercase tracking-[0.26em] text-white/[0.16]">
                  OPEN ARCHIVE
                </span>
              </div>

              <p className="mt-7 max-w-[700px] text-[14px] leading-7 text-white/[0.4] sm:text-[15px] sm:leading-8">
                The archive preserves development traces, material and content
                belonging to the Umbra universe without placing it inside the
                main navigation.
              </p>
            </div>

            <div className="lg:flex lg:items-end lg:justify-end">
              <div className="relative w-full max-w-[300px] border border-white/[0.07] bg-white/[0.015] p-5 backdrop-blur-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-x-5 top-0 h-px"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(199,169,107,.26), transparent)",
                  }}
                />

                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="font-mono text-[6px] uppercase tracking-[0.28em] text-white/[0.17]">
                      ENTRIES
                    </p>

                    <p className="mt-3 text-[clamp(2.6rem,5vw,4.3rem)] font-[420] leading-none tracking-[-0.07em] text-white/[0.92]">
                      {entryCount}
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
                    STATUS
                  </p>

                  <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-white/[0.38]">
                    {entries.length > 0 ? "ACTIVE ARCHIVE" : "IN PREPARATION"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          ARCHIVE CONTENT
      ───────────────────────────────────────────── */}

      <section className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/20 to-transparent"
        />

        <div className="relative z-10 mx-auto max-w-[1560px] px-5 py-20 sm:px-8 sm:py-24 lg:px-14 lg:py-28">
          <div className="flex flex-col gap-6 border-b border-white/[0.055] pb-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
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
                  CONTENT
                </p>
              </div>

              <h2 className="mt-4 text-[clamp(2.15rem,4vw,4rem)] font-[430] uppercase leading-[0.86] tracking-[-0.065em] text-white/[0.92]">
                Archive
                <span className="ml-2 font-serif font-normal italic text-white/[0.48]">
                  entries
                </span>
              </h2>
            </div>

            <span className="font-mono text-[6px] uppercase tracking-[0.28em] text-white/[0.14]">
              {entryCount} ENTRIES
            </span>
          </div>

          {entries.length > 0 ? (
            <div className="mt-8 grid gap-px overflow-hidden border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-3">
              {entries.map((entry, index) => {
                const sequence = String(index + 1).padStart(2, "0");

                return (
                  <Link
                    key={entry.id}
                    href={`/en/archive/${entry.id}`}
                    className="group block outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#ead39a]/65"
                  >
                    <article className="relative min-h-[250px] overflow-hidden bg-[#060606] p-6 transition-colors duration-300 hover:bg-[#090909] sm:min-h-[270px] sm:p-7">
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                        style={{
                          background:
                            "radial-gradient(circle at 80% 15%, rgba(199,169,107,.055), transparent 46%)",
                        }}
                      />

                      <div className="relative flex h-full flex-col">
                        <div className="flex items-center justify-between gap-4">
                          <p
                            className="font-mono text-[6px] uppercase tracking-[0.28em]"
                            style={{
                              color: `${GOLD_LIGHT}58`,
                            }}
                          >
                            {entry.type}
                          </p>

                          <span className="font-mono text-[6px] tracking-[0.2em] text-white/[0.12]">
                            {sequence}
                          </span>
                        </div>

                        <div className="mt-7 flex items-start justify-between gap-5">
                          <h3 className="max-w-[88%] text-xl font-[430] uppercase leading-[0.92] tracking-[-0.04em] text-white transition-colors duration-300 group-hover:text-white/[0.96]">
                            {entry.title.en}
                          </h3>

                          <ArrowUpRight
                            aria-hidden="true"
                            size={13}
                            strokeWidth={1.1}
                            className="shrink-0 text-white/[0.12] transition-[color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#ead39a]/70"
                          />
                        </div>

                        {entry.description?.en ? (
                          <p className="mt-4 max-w-[92%] text-[12px] leading-6 text-white/[0.34]">
                            {entry.description.en}
                          </p>
                        ) : null}

                        <div className="mt-auto flex items-end justify-between gap-5 pt-10">
                          <span
                            aria-hidden="true"
                            className="block h-px w-10 transition-[width] duration-500 group-hover:w-16"
                            style={{
                              background:
                                "linear-gradient(90deg, rgba(199,169,107,.55), transparent)",
                            }}
                          />

                          <CornerDownRight
                            aria-hidden="true"
                            size={13}
                            strokeWidth={1}
                            className="text-white/[0.1] transition-[color,transform] duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:text-[#ead39a]/50"
                          />
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="relative mt-8 overflow-hidden border border-white/[0.07] bg-[#060606] px-6 py-16 sm:px-10 sm:py-20 lg:px-12 lg:py-24">
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(234,211,154,.4), transparent 65%)",
                }}
              />

              <div
                aria-hidden="true"
                className="absolute right-0 top-0 h-full w-[46%] opacity-25"
                style={{
                  background:
                    "radial-gradient(circle at center, rgba(255,255,255,.035), transparent 68%)",
                }}
              />

              <div className="relative max-w-[720px]">
                <span
                  aria-hidden="true"
                  className="block h-px w-10"
                  style={{
                    background:
                      "linear-gradient(90deg, #ead39a, transparent)",
                  }}
                />

                <p className="mt-6 font-mono text-[7px] uppercase tracking-[0.3em] text-[#ead39a]/50">
                  ARCHIVE / IN PREPARATION
                </p>

                <h3 className="mt-4 text-[clamp(2rem,4vw,3.5rem)] font-[430] uppercase leading-[0.88] tracking-[-0.06em] text-white/[0.92]">
                  The archive
                  <span className="ml-2 font-serif font-normal italic text-white/[0.46]">
                    is not open yet
                  </span>
                </h3>

                <p className="mt-6 max-w-[580px] text-[13px] leading-7 text-white/[0.34]">
                  Canonical archive content has not been published yet. When it
                  is ready, it will appear here without changing the page
                  structure.
                </p>
              </div>
            </div>
          )}

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
                href="/en/projects"
                className="group inline-flex min-h-10 items-center gap-3 self-start border border-white/[0.07] bg-white/[0.015] px-4 py-3 transition-colors duration-300 hover:border-[#ead39a]/20 hover:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/45 sm:self-auto"
              >
                <span className="text-[7px] uppercase tracking-[0.26em] text-white/[0.28] transition-colors duration-300 group-hover:text-white/[0.64]">
                  Explore projects
                </span>

                <ArrowUpRight
                  aria-hidden="true"
                  size={13}
                  strokeWidth={1.1}
                  className="text-[#ead39a]/50 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}