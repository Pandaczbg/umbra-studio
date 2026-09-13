import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Search,
} from "lucide-react";

import {
  searchContent,
} from "@/lib/search";

import {
  createPageMetadata,
} from "@/lib/seo";

import type {
  UmbraContent,
} from "@/lib/content/types";

export const metadata =
  createPageMetadata(
    "sr",
    {
      title:
        "Pretraga — Umbra Studio",
      description:
        "Pretraga sadržaja Umbra Studija — projekti, likovi, epizode i priče.",
      pathname:
        "/pretraga",
    },
  );

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

function getResultTitle(
  item: UmbraContent,
): string {
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

function getResultDescription(
  item: UmbraContent,
): string {
  switch (item.contentType) {
    case "project":
    case "character":
    case "episode":
    case "story":
      return (
        item.shortDescription?.sr ??
        item.description?.sr ??
        ""
      );

    case "media":
      return (
        item.caption?.sr ??
        item.description?.sr ??
        ""
      );

    case "relationship":
    case "timeline-event":
    case "archive-entry":
      return (
        item.description?.sr ??
        ""
      );
  }
}

function getProjectSlug(
  projectId: string,
): string | null {
  switch (projectId) {
    case "project-01":
      return "mrzim-svog-brata";

    case "project-02":
      return "biblija";

    default:
      return null;
  }
}

function getResultHref(
  item: UmbraContent,
): string | null {
  switch (item.contentType) {
    case "project":
      return `/serije/${item.slug}`;

    case "character":
      return `/likovi/${item.slug}`;

    case "episode": {
      const projectSlug =
        getProjectSlug(
          item.projectId,
        );

      return projectSlug
        ? `/serije/${projectSlug}/epizode/${item.slug}`
        : null;
    }

    case "story": {
      const projectSlug =
        getProjectSlug(
          item.projectId,
        );

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

function getTypeLabel(
  item: UmbraContent,
): string {
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

export default async function SearchPage(
  props: SearchPageProps,
) {
  const searchParams =
    await props.searchParams;

  const query =
    searchParams.q?.trim() ??
    "";

  const results =
    query
      ? searchContent({
          query,
          types: [
            "project",
            "character",
            "episode",
            "story",
          ],
        })
      : [];

  return (
    <main className="min-h-screen overflow-hidden bg-[#030303] text-[#F1EDE4]">
      <section className="relative overflow-hidden border-b border-white/[0.055]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute left-[70%] top-[8%] h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-[#c7a96b]/[0.035] blur-[100px]" />

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
        </div>

        <div className="relative z-10 mx-auto max-w-[1500px] px-6 py-24 sm:px-10 sm:py-28 lg:px-16 lg:py-36">
          <div className="flex items-center justify-between border-b border-white/[0.055] pb-5">
            <div className="flex items-center gap-3">
              <span className="h-px w-9 bg-gradient-to-r from-transparent to-[#c7a96b]" />

              <span className="font-mono text-[7px] tracking-[0.32em] text-[#ead39a]/60">
                07
              </span>

              <span className="font-mono text-[8px] uppercase tracking-[0.28em] text-white/[0.36]">
                PRETRAGA
              </span>
            </div>

            <span className="hidden font-mono text-[6px] uppercase tracking-[0.30em] text-white/[0.14] sm:block">
              UMBRA / SEARCH
            </span>
          </div>

          <div className="mt-16 max-w-[980px]">
            <p className="font-mono text-[7px] uppercase tracking-[0.34em] text-white/[0.18]">
              UMBRA / DISCOVERY
            </p>

            <h1 className="mt-6 text-[clamp(3.4rem,7vw,7.8rem)] font-[430] uppercase leading-[0.82] tracking-[-0.078em] text-white">
              Pronađi
              <span className="block font-serif font-normal italic text-white/[0.52]">
                priču
              </span>
            </h1>

            <div className="mt-10 max-w-[760px]">
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
                  className="h-16 w-full border border-white/[0.10] bg-[#060606] pl-13 pr-5 text-[13px] text-white outline-none placeholder:text-white/[0.20] focus:border-[#c7a96b]/45"
                />

                <button
                  type="submit"
                  className="absolute right-2 top-2 bottom-2 border border-[#c7a96b]/30 px-5 font-mono text-[6px] uppercase tracking-[0.28em] text-[#ead39a]/65 transition-[background,color,border-color] duration-300 hover:border-[#ead39a]/50 hover:bg-[#c7a96b]/[0.06] hover:text-[#ead39a]"
                >
                  Traži
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-28">
        {!query ? (
          <div className="border border-white/[0.07] bg-[#060606] px-6 py-16 sm:px-10 sm:py-20">
            <p className="font-mono text-[7px] uppercase tracking-[0.30em] text-[#ead39a]/50">
              PRETRAGA / ČEKA UNOS
            </p>

            <h2 className="mt-4 text-[clamp(1.9rem,3.6vw,3.4rem)] font-[430] uppercase leading-[0.9] tracking-[-0.055em] text-white/[0.92]">
              Unesi pojam koji tražiš
            </h2>

            <p className="mt-5 max-w-[620px] text-[13px] leading-7 text-white/[0.34]">
              Pretraga prolazi kroz canonical Umbra
              sadržaj i daje prednost naslovima,
              slugovima i opisima.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-5 border-b border-white/[0.055] pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-[7px] uppercase tracking-[0.34em] text-[#ead39a]/60">
                  REZULTATI
                </p>

                <h2 className="mt-3 text-[clamp(2rem,3.8vw,3.8rem)] font-[430] uppercase leading-[0.88] tracking-[-0.06em] text-white/[0.92]">
                  {results.length > 0
                    ? `Rezultati za „${query}“`
                    : `Nema rezultata za „${query}“`}
                </h2>
              </div>

              <span className="font-mono text-[6px] uppercase tracking-[0.28em] text-white/[0.14]">
                {String(
                  results.length,
                ).padStart(2, "0")}{" "}
                REZULTATA
              </span>
            </div>

            {results.length > 0 ? (
              <div className="mt-6 grid gap-px overflow-hidden border border-white/[0.07] bg-white/[0.07]">
                {results.map(
                  (
                    result,
                  ) => {
                    const item =
                      result.item;

                    const href =
                      getResultHref(
                        item,
                      );

                    const content =
                      (
                        <article className="group bg-[#060606] p-6 transition-colors duration-300 hover:bg-[#080808] sm:p-7">
                          <div className="flex items-start justify-between gap-6">
                            <div>
                              <p className="font-mono text-[6px] uppercase tracking-[0.28em] text-[#ead39a]/50">
                                {getTypeLabel(
                                  item,
                                )}
                              </p>

                              <h3 className="mt-4 text-[clamp(1.5rem,2.8vw,2.3rem)] font-[430] uppercase leading-[0.9] tracking-[-0.05em] text-white/[0.88] transition-colors duration-300 group-hover:text-white">
                                {getResultTitle(
                                  item,
                                )}
                              </h3>

                              {getResultDescription(
                                item,
                              ) ? (
                                <p className="mt-4 max-w-[760px] text-[12px] leading-6 text-white/[0.34]">
                                  {getResultDescription(
                                    item,
                                  )}
                                </p>
                              ) : null}
                            </div>

                            <ArrowUpRight
                              aria-hidden="true"
                              size={15}
                              strokeWidth={1.1}
                              className="shrink-0 text-white/[0.20] transition-[color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#ead39a]"
                            />
                          </div>
                        </article>
                      );

                    return href ? (
                      <Link
                        key={item.id}
                        href={href}
                      >
                        {content}
                      </Link>
                    ) : (
                      <div
                        key={item.id}
                      >
                        {content}
                      </div>
                    );
                  },
                )}
              </div>
            ) : (
              <div className="mt-6 border border-white/[0.07] bg-[#060606] px-6 py-16 sm:px-10 sm:py-20">
                <p className="font-mono text-[7px] uppercase tracking-[0.30em] text-[#ead39a]/50">
                  PRETRAGA / 0
                </p>

                <h3 className="mt-4 text-[clamp(1.8rem,3.5vw,3.2rem)] font-[430] uppercase leading-[0.9] tracking-[-0.055em] text-white/[0.92]">
                  Nema pronađenog sadržaja
                </h3>

                <p className="mt-5 max-w-[600px] text-[13px] leading-7 text-white/[0.34]">
                  Pokušaj sa drugim nazivom,
                  imenom lika ili naslovom
                  epizode.
                </p>
              </div>
            )}
          </>
        )}

        <div className="mt-10 flex flex-col gap-5 border-t border-white/[0.055] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="group inline-flex items-center gap-3 text-[7px] uppercase tracking-[0.26em] text-white/[0.20] transition-colors duration-300 hover:text-white/[0.52]"
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
      </section>
    </main>
  );
}