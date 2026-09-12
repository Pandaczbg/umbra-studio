"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import type { Locale } from "@/data/translations";

type StudioManifestoProps = {
  locale?: Locale;
};

type BridgeItem = {
  index: string;
  label: string;
  title: string;
  description: string;
  destination: "original" | "adaptation" | "series";
};

const GOLD = "#c7a96b";
const GOLD_LIGHT = "#ead39a";
const EASE = [0.22, 1, 0.36, 1] as const;

const COPY: Record<Locale, {
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  items: BridgeItem[];
}> = {
  sr: {
    eyebrow: "UMBRA STUDIO / NAČIN RADA",
    title: "Od priče do kadra",
    body:
      "Razvijamo originalne priče, ekranizacije i serijale kroz isti princip — narativ vodi sliku, a svaki kadar ima razlog da postoji.",
    cta: "Istraži projekte",
    items: [
      {
        index: "01",
        label: "ORIGINALNE PRIČE",
        title: "Novi svetovi",
        description:
          "Ideje koje počinju od lika, sukoba i sveta koji tek treba da bude izgrađen.",
        destination: "original",
      },
      {
        index: "02",
        label: "EKRANIZACIJE",
        title: "Poznate priče, nova slika",
        description:
          "Književni predložak prevodimo u vizuelni jezik bez gubitka njegovog identiteta.",
        destination: "adaptation",
      },
      {
        index: "03",
        label: "SERIJA",
        title: "Priča koja traje",
        description:
          "Epizode gradimo tako da svaka ima svoj ritam i razlog da gledalac nastavi dalje.",
        destination: "series",
      },
    ],
  },
  en: {
    eyebrow: "UMBRA STUDIO / HOW WE WORK",
    title: "From story to frame",
    body:
      "We develop original stories, adaptations and series through the same principle — narrative leads the image, and every frame has a reason to exist.",
    cta: "Explore projects",
    items: [
      {
        index: "01",
        label: "ORIGINAL STORIES",
        title: "New worlds",
        description:
          "Ideas that begin with character, conflict and a world that still needs to be built.",
        destination: "original",
      },
      {
        index: "02",
        label: "ADAPTATIONS",
        title: "Known stories, new image",
        description:
          "We translate literary material into a visual language without losing its identity.",
        destination: "adaptation",
      },
      {
        index: "03",
        label: "SERIES",
        title: "Stories that continue",
        description:
          "Episodes are shaped around their own rhythm and a reason to keep watching.",
        destination: "series",
      },
    ],
  },
};

export default function StudioManifesto({
  locale = "sr",
}: StudioManifestoProps) {
  const reducedMotion = useReducedMotion() ?? false;
  const copy = COPY[locale];
  const projectsHref = locale === "en" ? "/en/projects" : "/serije";

  const getDestinationHref = (destination: BridgeItem["destination"]) => {
    const base = locale === "en" ? "/en/projects" : "/serije";

    switch (destination) {
      case "original":
        return `${base}?vrsta=originalne`;
      case "adaptation":
        return `${base}?vrsta=ekranizacije`;
      case "series":
        return `${base}?format=serije`;
    }
  };

  const getDestinationLabel = (destination: BridgeItem["destination"]) => {
    if (locale === "en") {
      switch (destination) {
        case "original":
          return "Open original stories";
        case "adaptation":
          return "Open adaptations";
        case "series":
          return "Open series";
      }
    }

    switch (destination) {
      case "original":
        return "Otvori originalne priče";
      case "adaptation":
        return "Otvori ekranizacije";
      case "series":
        return "Otvori serije";
    }
  };

  return (
    <section
      id="studio-bridge"
      data-umbra-prefooter
      aria-labelledby="studio-bridge-title"
      className="relative overflow-hidden border-t border-white/[0.045] border-b border-white/[0.045] bg-[#030303]"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-[8%] top-[18%] h-[520px] w-[520px] rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, ${GOLD}045, transparent 70%)`,
          }}
        />
        <div
          className="absolute right-[-14%] bottom-[-20%] h-[600px] w-[600px] rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, ${GOLD}025, transparent 72%)`,
          }}
        />
        <div className="absolute inset-x-[6%] top-1/2 h-px -translate-y-1/2 bg-white/[0.018]" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-6 py-20 sm:px-9 sm:py-24 lg:px-12 lg:py-28 xl:px-16">
        <motion.div
          initial={reducedMotion ? undefined : { opacity: 0, y: 12 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.16 }}
          transition={{ duration: reducedMotion ? 0 : 0.58, ease: EASE }}
          className="flex flex-col gap-8 border-b border-white/[0.05] pb-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16"
        >
          <div className="max-w-[860px]">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-px w-9"
                style={{
                  background: `linear-gradient(90deg, ${GOLD}, transparent)`,
                }}
              />
              <span
                className="font-mono text-[7px] uppercase tracking-[0.34em]"
                style={{ color: `${GOLD_LIGHT}82` }}
              >
                {copy.eyebrow}
              </span>
            </div>

            <h2
              id="studio-bridge-title"
              className="mt-7 max-w-[820px] text-[clamp(3rem,5.7vw,6.8rem)] font-[430] leading-[0.86] tracking-[-0.075em] text-white"
            >
              {copy.title}
            </h2>
          </div>

          <div className="max-w-[420px] lg:pb-1">
            <p className="text-[13px] leading-7 text-white/[0.38] sm:text-[14px] sm:leading-8">
              {copy.body}
            </p>

            <Link
              href={projectsHref}
              className="group mt-7 inline-flex items-center gap-3 text-[8px] font-semibold uppercase tracking-[0.28em] outline-none transition-colors duration-300 hover:text-white focus-visible:ring-1 focus-visible:ring-[#ead39a]/55"
              style={{ color: `${GOLD_LIGHT}82` }}
            >
              <span>{copy.cta}</span>
              <ArrowUpRight
                aria-hidden="true"
                size={13}
                strokeWidth={1.15}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </motion.div>

        <div className="grid gap-px overflow-hidden border border-white/[0.055] bg-white/[0.055] md:grid-cols-3">
          {copy.items.map((item, index) => (
            <motion.div
              key={item.index}
              initial={reducedMotion ? undefined : { opacity: 0, y: 14 }}
              whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.14 }}
              transition={{
                duration: reducedMotion ? 0 : 0.54,
                delay: reducedMotion ? 0 : index * 0.07,
                ease: EASE,
              }}
            >
              <Link
                href={getDestinationHref(item.destination)}
                aria-label={getDestinationLabel(item.destination)}
                className="group relative flex min-h-[250px] h-full flex-col bg-[#040404] p-7 outline-none transition-[background-color,transform] duration-500 hover:bg-[#070707] focus-visible:ring-1 focus-visible:ring-[#ead39a]/55 sm:p-8 lg:min-h-[290px] lg:p-10"
              >
              <div className="flex items-center justify-between">
                <span
                  className="font-mono text-[7px] tracking-[0.3em]"
                  style={{ color: `${GOLD_LIGHT}72` }}
                >
                  {item.index}
                </span>
                <span
                  aria-hidden="true"
                  className="h-px w-8 transition-[width] duration-500 group-hover:w-14"
                  style={{ background: `${GOLD}55` }}
                />
              </div>

              <p
                className="mt-10 font-mono text-[6px] uppercase tracking-[0.28em]"
                style={{ color: `${GOLD_LIGHT}4f` }}
              >
                {item.label}
              </p>

              <h3 className="mt-4 max-w-[280px] text-[clamp(1.35rem,2.3vw,2rem)] font-[430] leading-[0.95] tracking-[-0.045em] text-white/[0.9]">
                {item.title}
              </h3>

              <p className="mt-5 max-w-[340px] text-[11px] leading-6 text-white/[0.28] sm:text-[12px]">
                {item.description}
              </p>

                <div className="absolute bottom-7 left-7 right-7 flex items-center justify-between sm:bottom-8 sm:left-8 sm:right-8 lg:bottom-10 lg:left-10 lg:right-10">
                  <span className="font-mono text-[6px] uppercase tracking-[0.28em] text-white/[0.10]">
                    {locale === "en" ? "OPEN / ARCHIVE" : "OTVORI / ARHIV"}
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="h-px w-0 bg-[#ead39a]/65 transition-[width] duration-500 group-hover:w-8" />
                    <ArrowUpRight
                      aria-hidden="true"
                      size={13}
                      strokeWidth={1.1}
                      className="text-white/[0.16] transition-[color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#ead39a]/75"
                    />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
