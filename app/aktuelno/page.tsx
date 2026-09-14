import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import LatestContentWindow from "@/components/LatestContentWindow";
import { getLatestPublishedContent } from "@/lib/content/latest";
import {
  createBreadcrumbJsonLd,
  serializeJsonLd,
  UMBRA_SITE_URL,
} from "@/lib/seo/jsonLd";

export const metadata: Metadata = {
  title: "Aktuelno",
  description:
    "Najnovije javno objavljene priče, projekti i epizode Umbra Studija.",
  alternates: {
    canonical: "/aktuelno",
  },
  openGraph: {
    title: "Aktuelno — Umbra Studio",
    description:
      "Najnovije javno objavljene priče, projekti i epizode Umbra Studija.",
    url: `${UMBRA_SITE_URL}/aktuelno`,
  },
};

export default function LatestPage() {
  const latestContent = getLatestPublishedContent(2);

  const breadcrumbJsonLd = createBreadcrumbJsonLd([
    {
      name: "Umbra Studio",
      url: UMBRA_SITE_URL,
    },
    {
      name: "Aktuelno",
      url: `${UMBRA_SITE_URL}/aktuelno`,
    },
  ]);

  return (
    <main
      id="main-content"
      className="min-h-screen overflow-x-clip bg-[var(--umbra-bg-deep)] text-[var(--umbra-text-primary)]"
    >
      <section
        data-umbra-scene="projects-archive"
        aria-labelledby="latest-title"
        className="relative overflow-hidden border-b border-white/[0.055]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute left-1/2 top-[12%] h-[540px] w-[820px] -translate-x-1/2 rounded-full bg-[#c7a96b]/[0.018] blur-[120px]" />
          <div className="absolute inset-x-[8%] top-0 h-px bg-gradient-to-r from-transparent via-white/[0.045] to-transparent" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1360px] px-5 pb-20 pt-28 sm:px-9 sm:pb-24 lg:px-12 lg:pt-32">
          <header className="border-b border-white/[0.055] pb-6">
            <div className="flex items-center justify-between gap-6">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-px w-8 bg-gradient-to-r from-transparent to-[var(--umbra-gold)] sm:w-10"
                />
                <span className="font-mono text-[8px] tracking-[0.3em] text-[var(--umbra-gold-light)]/65">
                  01
                </span>
                <span className="truncate text-[8px] font-semibold uppercase tracking-[0.28em] text-white/[0.48] sm:text-[9px] sm:tracking-[0.34em]">
                  AKTUELNO
                </span>
              </div>

              <Link
                href="/"
                className="inline-flex min-h-11 shrink-0 items-center gap-2 text-[8px] uppercase tracking-[0.2em] text-white/[0.38] outline-none transition-colors hover:text-white focus-visible:ring-1 focus-visible:ring-[var(--umbra-gold-light)]/70"
              >
                <ArrowLeft size={13} strokeWidth={1} aria-hidden="true" />
                Početna
              </Link>
            </div>
          </header>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20">
            <div>
              <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[var(--umbra-gold-light)]/65">
                LIVE EDITORIAL FEED
              </p>

              <h1
                id="latest-title"
                className="mt-5 max-w-[820px] text-[clamp(3.25rem,8vw,7rem)] font-[420] uppercase leading-[0.86] tracking-[-0.07em] text-[var(--umbra-platinum)]"
              >
                Najnovije
                <span className="block font-serif font-normal italic text-white/[0.54]">
                  objavljeno
                </span>
              </h1>
            </div>

            <div className="flex items-end lg:justify-self-end">
              <p className="max-w-[470px] text-[11px] leading-6 text-white/[0.42] sm:text-[12px] sm:leading-7">
                Ovde se pojavljuju isključivo javno objavljeni sadržaji,
                sortirani po datumu objave. Prikazana su dva najnovija zapisa
                iz canonical sadržajnog sistema.
              </p>
            </div>
          </div>

          <div className="mt-10 sm:mt-14">
            <LatestContentWindow
              locale="sr"
              content={latestContent}
            />
          </div>

          <footer className="mt-8 flex flex-col gap-4 border-t border-white/[0.055] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-white/[0.18]">
              CANONICAL CONTENT / PUBLICATION TIME
            </span>

            <Link
              href="/serije"
              className="inline-flex min-h-11 items-center gap-2 text-[8px] font-semibold uppercase tracking-[0.2em] text-[var(--umbra-gold-light)]/65 outline-none transition-colors hover:text-[var(--umbra-gold-light)] focus-visible:ring-1 focus-visible:ring-[var(--umbra-gold-light)]/70"
            >
              Projekti
              <ArrowUpRight size={13} strokeWidth={1} aria-hidden="true" />
            </Link>
          </footer>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(breadcrumbJsonLd),
        }}
      />
    </main>
  );
}
