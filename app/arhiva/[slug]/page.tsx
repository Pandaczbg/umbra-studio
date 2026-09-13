import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import {
  getArchiveEntries,
} from "@/lib/archive";

import {
  createPageMetadata,
} from "@/lib/seo";

type ArchivePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function getArchiveEntry(
  slug: string,
) {
  return getArchiveEntries().find(
    (entry) =>
      entry.id === slug,
  );
}

export function generateStaticParams() {
  return getArchiveEntries().map(
    (entry) => ({
      slug: entry.id,
    }),
  );
}

export async function generateMetadata(
  props: ArchivePageProps,
): Promise<Metadata> {
  const params =
    await props.params;

  const entry =
    getArchiveEntry(
      params.slug,
    );

  if (!entry) {
    return createPageMetadata(
      "sr",
      {
        title:
          "Arhiva — Umbra Studio",
        pathname:
          `/arhiva/${params.slug}`,
      },
    );
  }

  return createPageMetadata(
    "sr",
    {
      title:
        `${entry.title.sr} — Umbra Studio`,
      description:
        entry.description?.sr ??
        "Arhivski zapis Umbra Studija.",
      pathname:
        `/arhiva/${entry.id}`,
    },
  );
}

export default async function ArchiveEntryPage(
  props: ArchivePageProps,
) {
  const params =
    await props.params;

  const entry =
    getArchiveEntry(
      params.slug,
    );

  if (!entry) {
    notFound();
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#030303] text-[#F1EDE4]">
      <section className="relative border-b border-white/[0.055]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute left-[68%] top-[8%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#c7a96b]/[0.035] blur-[100px]" />
          <div className="absolute inset-x-[6%] top-0 h-px bg-white/[0.035]" />
          <div className="absolute left-[6%] top-0 h-full w-px bg-white/[0.018]" />
          <div className="absolute right-[6%] top-0 h-full w-px bg-white/[0.018]" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1500px] px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-32">
          <Link
            href="/arhiva"
            className="group inline-flex items-center gap-3 text-[7px] uppercase tracking-[0.26em] text-white/[0.24] transition-colors duration-300 hover:text-white/[0.58]"
          >
            <ArrowLeft
              aria-hidden="true"
              size={13}
              strokeWidth={1.1}
              className="transition-transform duration-300 group-hover:-translate-x-0.5"
            />
            Nazad u arhivu
          </Link>

          <div className="mt-16 max-w-[980px]">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-px w-9 bg-gradient-to-r from-transparent to-[#c7a96b]"
              />

              <span className="font-mono text-[7px] tracking-[0.28em] text-[#ead39a]/55">
                {entry.type}
              </span>
            </div>

            <h1 className="mt-7 text-[clamp(3rem,7vw,7.6rem)] font-[430] uppercase leading-[0.84] tracking-[-0.075em] text-white">
              {entry.title.sr}
            </h1>

            <span
              aria-hidden="true"
              className="mt-9 block h-px max-w-[520px] bg-gradient-to-r from-[#c7a96b]/60 via-white/[0.06] to-transparent"
            />

            {entry.description?.sr ? (
              <p className="mt-7 max-w-[700px] text-[14px] leading-7 text-white/[0.40] sm:text-[15px] sm:leading-8">
                {entry.description.sr}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-28">
        <div className="grid gap-px overflow-hidden border border-white/[0.07] bg-white/[0.07] lg:grid-cols-[0.72fr_1.28fr]">
          <div className="bg-[#060606] p-6 sm:p-8">
            <p className="font-mono text-[6px] uppercase tracking-[0.28em] text-[#ead39a]/50">
              ZAPIS
            </p>

            <dl className="mt-7 space-y-6">
              <div>
                <dt className="font-mono text-[6px] uppercase tracking-[0.24em] text-white/[0.15]">
                  TIP
                </dt>
                <dd className="mt-2 text-[12px] uppercase tracking-[0.12em] text-white/[0.54]">
                  {entry.type}
                </dd>
              </div>

              {entry.date ? (
                <div>
                  <dt className="font-mono text-[6px] uppercase tracking-[0.24em] text-white/[0.15]">
                    DATUM
                  </dt>
                  <dd className="mt-2 text-[12px] text-white/[0.54]">
                    {entry.date}
                  </dd>
                </div>
              ) : null}

              <div>
                <dt className="font-mono text-[6px] uppercase tracking-[0.24em] text-white/[0.15]">
                  ID
                </dt>
                <dd className="mt-2 break-all font-mono text-[10px] text-white/[0.30]">
                  {entry.id}
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-[#070707] p-6 sm:p-8 lg:p-10">
            <p className="font-mono text-[6px] uppercase tracking-[0.28em] text-white/[0.15]">
              UMBRA / ARCHIVE ENTRY
            </p>

            <div className="mt-8 border-l border-white/[0.07] pl-6 sm:pl-8">
              <p className="text-[13px] leading-7 text-white/[0.40] sm:text-[14px] sm:leading-8">
                {entry.description?.sr ??
                  "Detaljan opis ovog arhivskog zapisa još nije objavljen."}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between border-t border-white/[0.055] pt-6">
          <span className="font-mono text-[6px] uppercase tracking-[0.28em] text-white/[0.14]">
            UMBRA / ARCHIVE
          </span>

          <Link
            href="/arhiva"
            className="group flex items-center gap-3"
          >
            <span className="text-[7px] uppercase tracking-[0.26em] text-white/[0.22] transition-colors duration-300 group-hover:text-white/[0.52]">
              Svi zapisi
            </span>

            <ArrowUpRight
              aria-hidden="true"
              size={13}
              strokeWidth={1.1}
              className="text-[#ead39a]/55 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </section>
    </main>
  );
}