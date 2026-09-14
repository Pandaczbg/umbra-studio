import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { searchContent } from "@/lib/search";
import { createPageMetadata } from "@/lib/seo";

import type { UmbraContent } from "@/lib/content/types";

export const metadata = createPageMetadata("sr", {
  title: "Pretraga — Umbra Studio",
  description:
    "Pretraga sadržaja Umbra Studija — projekti, likovi, epizode i priče.",
  pathname: "/pretraga",
});

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

function getResultTitle(item: UmbraContent): string {
  switch (item.contentType) {
    case "project":
    case "character":
    case "episode":
    case "story":
      return item.title.sr;

    case "media":
    case "relationship":
    case "timeline-event":
    case "archive-entry":
      return "";
  }
}

function getResultDescription(item: UmbraContent): string {
  switch (item.contentType) {
    case "project":
    case "character":
    case "episode":
    case "story":
      return item.shortDescription?.sr ?? item.description?.sr ?? "";

    case "media":
      return item.caption?.sr ?? item.description?.sr ?? "";

    case "relationship":
    case "timeline-event":
    case "archive-entry":
      return item.description?.sr ?? "";
  }
}

function getProjectSlug(projectId: string): string | null {
  switch (projectId) {
    case "project-01":
      return "mrzim-svog-brata";

    case "project-02":
      return "biblija";

    default:
      return null;
  }
}

function getResultHref(item: UmbraContent): string | null {
  switch (item.contentType) {
    case "project":
      return `/serije/${item.slug}`;

    case "character":
      return `/likovi/${item.slug}`;

    case "episode": {
      const projectSlug = getProjectSlug(item.projectId);

      return projectSlug
        ? `/serije/${projectSlug}/epizode/${item.slug}`
        : null;
    }

    case "story": {
      const projectSlug = getProjectSlug(item.projectId);

      return projectSlug
        ? `/serije/${projectSlug}/price/${item.slug}`
        : null;
    }

    case "media":
    case "relationship":
    case "timeline-event":
    case "archive-entry":
      return null;
  }
}

function getTypeLabel(item: UmbraContent): string {
  switch (item.contentType) {
    case "project":
      return "PROJEKAT";

    case "character":
      return "LIK";

    case "episode":
      return "EPIZODA";

    case "story":
      return "PRIČA";

    case "media":
      return "MEDIJA";

    case "relationship":
      return "ODNOS";

    case "timeline-event":
      return "DOGAĐAJ";

    case "archive-entry":
      return "ARHIVA";
  }
}

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q?.trim() ?? "";

  const results = query
    ? searchContent({
        query,
        types: ["project", "character", "episode", "story"],
      })
    : [];

  const resultCount = String(results.length).padStart(2, "0");

  return (
    <main
      data-umbra-scene="search"
      className="min-h-screen overflow-x-clip bg-[#030303] text-[#F1EDE4]"
    >
      {/* ─────────────────────────────────────────────
          SEARCH HERO
      ───────────────────────────────────────────── */}

      <section className="relative overflow-hidden border-b border-white/[0.055]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div
            className="absolute left-[72%] top-[5%] h-[620px] w-[620px] -translate-x-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(199,169,107,.045) 0%, transparent 68%)",
              filter: "blur(110px)",
            }}
          />

          <div
            className="absolute -left-[14%] bottom-[-34%] h-[540px] w-[540px] rounded-full"
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

        <div className="relative z-10 mx-auto max-w-[1560px] px-5 pb-20 pt-24 sm:px-8 sm:pb-24 sm:pt-28 lg:px-14 lg:pb-32 lg:pt-36">
          <div className="flex items-center justify-between border-b border-white/[0.055] pb-5">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-px w-8"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, #c7a96b)",
                }}
              />

              <span className="font-mono text-[7px] tracking-[0.3em] text-[#ead39a]/65">
                07
              </span>

              <span className="font-mono text-[8px] uppercase tracking-[0.28em] text-white/[0.36]">
                PRETRAGA
              </span>
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              <SlidersHorizontal
                aria-hidden="true"
                size={11}
                strokeWidth={1}
                className="text-[#ead39a]/35"
              />

              <span className="font-mono text-[6px] uppercase tracking-[0.3em] text-white/[0.15]">
                UMBRA / DISCOVERY
              </span>
            </div>
          </div>

          <div className="relative mt-16 grid gap-14 lg:mt-24 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-20">
            <div className="max-w-[980px]">
              <p className="font-mono text-[7px] uppercase tracking-[0.34em] text-white/[0.18]">
                UMBRA / DISCOVERY
              </p>

              <h1 className="mt-6 text-[clamp(3.5rem,8vw,8.6rem)] font-[430] uppercase leading-[0.8] tracking-[-0.08em] text-white">
                Pronađi
                <span className="block pl-[0.02em] font-serif font-normal italic text-white/[0.5]">
                  priču
                </span>
              </h1>

              <div className="mt-9 flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="h-px w-16 sm:w-24"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(199,169,107,.5), transparent)",
                  }}
                />

                <span className="font-mono text-[6px] uppercase tracking-[0.27em] text-white/[0.16]">
                  PRETRAGA UMBRA SADRŽAJA
                </span>
              </div>

              <div className="mt-8 max-w-[820px]">
                <form
                  method="get"
                  action="/pretraga"
                  className="relative"
                >
                  <Search
                    aria-hidden="true"
                    size={16}
                    strokeWidth={1.1}
                    className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#ead39a]/45"
                  />

                  <input
                    type="search"
                    name="q"
                    defaultValue={query}
                    placeholder="Pretraži projekte, likove, epizode..."
                    aria-label="Pretraži Umbra Studio"
                    className="h-16 w-full border border-white/[0.10] bg-[#060606] pl-13 pr-24 text-[13px] text-white outline-none transition-[border-color,background-color,box-shadow] duration-300 placeholder:text-white/[0.2] focus:border-[#c7a96b]/45 focus:bg-[#080808] focus:shadow-[0_0_0_1px_rgba(199,169,107,.06),0_14px_40px_rgba(0,0,0,.24)] sm:h-[68px] sm:pr-32"
                  />

                  <button
                    type="submit"
                    className="absolute right-2 top-2 bottom-2 min-h-10 border border-[#c7a96b]/30 px-4 font-mono text-[6px] uppercase tracking-[0.28em] text-[#ead39a]/65 transition-[background,color,border-color] duration-300 hover:border-[#ead39a]/50 hover:bg-[#c7a96b]/[0.06] hover:text-[#ead39a] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/50 sm:px-5"
                  >
                    Traži
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:flex lg:items-end lg:justify-end">
              <div className="w-full max-w-[300px] border border-white/[0.07] bg-white/[0.015] p-5 backdrop-blur-sm">
                <div
                  aria-hidden="true"
                  className="mb-6 h-px w-full"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(199,169,107,.28), transparent)",
                  }}
                />

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[6px] uppercase tracking-[0.28em] text-white/[0.17]">
                      STATUS
                    </p>

                    <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-white/[0.52]">
                      {query ? "UPIT AKTIVAN" : "ČEKA UNOS"}
                    </p>
                  </div>

                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-2 w-2 rounded-full"
                    style={{
                      background: "#ead39a",
                      boxShadow:
                        "0 0 18px rgba(199,169,107,.34)",
                    }}
                  />
                </div>

                <div className="mt-6 border-t border-white/[0.055] pt-4">
                  <p className="font-mono text-[6px] uppercase tracking-[0.25em] text-white/[0.17]">
                    REZULTATI
                  </p>

                  <p className="mt-2 text-[clamp(2rem,4vw,3rem)] font-[420] leading-none tracking-[-0.07em] text-white/[0.9]">
                    {resultCount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          SEARCH CONTENT
      ───────────────────────────────────────────── */}

      <section className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/20 to-transparent"
        />

        <div className="relative z-10 mx-auto max-w-[1560px] px-5 py-20 sm:px-8 sm:py-24 lg:px-14 lg:py-28">
          {!query ? (
            <div className="relative overflow-hidden border border-white/[0.07] bg-[#060606] px-6 py-16 sm:px-10 sm:py-20 lg:px-12 lg:py-24">
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
                className="absolute right-0 top-0 h-full w-[44%] opacity-25"
                style={{
                  background:
                    "radial-gradient(circle at center, rgba(255,255,255,.035), transparent 68%)",
                }}
              />

              <div className="relative max-w-[720px]">
                <Search
                  aria-hidden="true"
                  size={17}
                  strokeWidth={1}
                  className="text-[#ead39a]/45"
                />

                <p className="mt-6 font-mono text-[7px] uppercase tracking-[0.3em] text-[#ead39a]/50">
                  PRETRAGA / ČEKA UNOS
                </p>

                <h2 className="mt-4 text-[clamp(2rem,4vw,3.6rem)] font-[430] uppercase leading-[0.88] tracking-[-0.06em] text-white/[0.92]">
                  Unesi pojam
                  <span className="ml-2 font-serif font-normal italic text-white/[0.45]">
                    koji tražiš
                  </span>
                </h2>

                <p className="mt-6 max-w-[620px] text-[13px] leading-7 text-white/[0.34]">
                  Pretraga prolazi kroz canonical Umbra sadržaj i daje prednost
                  naslovima, slugovima i opisima.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-6 border-b border-white/[0.055] pb-7 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="h-px w-7"
                      style={{
                        background: "#c7a96b",
                      }}
                    />

                    <p className="font-mono text-[7px] uppercase tracking-[0.34em] text-[#ead39a]/65">
                      REZULTATI
                    </p>
                  </div>

                  <h2 className="mt-4 max-w-[900px] break-words text-[clamp(2rem,4vw,4rem)] font-[430] uppercase leading-[0.86] tracking-[-0.065em] text-white/[0.92]">
                    {results.length > 0
                      ? `Rezultati za „${query}“`
                      : `Nema rezultata za „${query}“`}
                  </h2>
                </div>

                <span className="shrink-0 font-mono text-[6px] uppercase tracking-[0.28em] text-white/[0.14]">
                  {resultCount} REZULTATA
                </span>
              </div>

              {results.length > 0 ? (
                <div className="mt-8 grid gap-px overflow-hidden border border-white/[0.07] bg-white/[0.07]">
                  {results.map((result, index) => {
                    const item = result.item;
                    const href = getResultHref(item);
                    const title = getResultTitle(item);
                    const description = getResultDescription(item);
                    const sequence = String(index + 1).padStart(2, "0");

                    const content = (
                      <article className="group relative min-h-[180px] bg-[#060606] p-6 transition-colors duration-300 hover:bg-[#090909] sm:min-h-[200px] sm:p-7 lg:p-8">
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                          style={{
                            background:
                              "radial-gradient(circle at 80% 15%, rgba(199,169,107,.055), transparent 46%)",
                          }}
                        />

                        <div className="relative flex h-full flex-col">
                          <div className="flex items-center justify-between gap-5">
                            <p className="font-mono text-[6px] uppercase tracking-[0.28em] text-[#ead39a]/50">
                              {getTypeLabel(item)}
                            </p>

                            <span className="font-mono text-[6px] tracking-[0.2em] text-white/[0.12]">
                              {sequence}
                            </span>
                          </div>

                          <div className="mt-6 flex items-start justify-between gap-8">
                            <div className="max-w-[900px]">
                              <h3 className="text-[clamp(1.5rem,3vw,2.5rem)] font-[430] uppercase leading-[0.9] tracking-[-0.05em] text-white/[0.88] transition-colors duration-300 group-hover:text-white">
                                {title}
                              </h3>

                              {description ? (
                                <p className="mt-4 max-w-[780px] text-[12px] leading-6 text-white/[0.34]">
                                  {description}
                                </p>
                              ) : null}
                            </div>

                            <ArrowUpRight
                              aria-hidden="true"
                              size={15}
                              strokeWidth={1.1}
                              className="mt-1 shrink-0 text-white/[0.16] transition-[color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#ead39a]/75"
                            />
                          </div>

                          <div className="mt-auto pt-8">
                            <span
                              aria-hidden="true"
                              className="block h-px w-10 transition-[width] duration-500 group-hover:w-16"
                              style={{
                                background:
                                  "linear-gradient(90deg, rgba(199,169,107,.55), transparent)",
                              }}
                            />
                          </div>
                        </div>
                      </article>
                    );

                    return href ? (
                      <Link
                        key={item.id}
                        href={href}
                        className="block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#ead39a]/45"
                      >
                        {content}
                      </Link>
                    ) : (
                      <div key={item.id}>{content}</div>
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
                        "linear-gradient(90deg, rgba(234,211,154,.34), transparent 65%)",
                    }}
                  />

                  <div className="relative max-w-[680px]">
                    <p className="font-mono text-[7px] uppercase tracking-[0.3em] text-[#ead39a]/50">
                      PRETRAGA / 0
                    </p>

                    <h3 className="mt-4 text-[clamp(2rem,4vw,3.4rem)] font-[430] uppercase leading-[0.88] tracking-[-0.06em] text-white/[0.92]">
                      Nema pronađenog
                      <span className="ml-2 font-serif font-normal italic text-white/[0.45]">
                        sadržaja
                      </span>
                    </h3>

                    <p className="mt-6 max-w-[600px] text-[13px] leading-7 text-white/[0.34]">
                      Pokušaj sa drugim nazivom, imenom lika ili naslovom
                      epizode.
                    </p>

                    <div className="mt-8 flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="h-px w-10"
                        style={{
                          background:
                            "linear-gradient(90deg, rgba(199,169,107,.52), transparent)",
                        }}
                      />

                      <span className="font-mono text-[6px] uppercase tracking-[0.26em] text-white/[0.15]">
                        PONOVI PRETRAGU
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="mt-10 border-t border-white/[0.055] pt-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="/"
                className="group inline-flex min-h-10 items-center gap-3 self-start text-[7px] uppercase tracking-[0.26em] text-white/[0.22] transition-colors duration-300 hover:text-white/[0.58] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/45"
              >
                <ArrowLeft
                  aria-hidden="true"
                  size={13}
                  strokeWidth={1.1}
                  className="transition-transform duration-300 group-hover:-translate-x-0.5"
                />

                Početna
              </Link>

              <span className="font-mono text-[6px] uppercase tracking-[0.28em] text-white/[0.12]">
                UMBRA / SEARCH
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}