"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { useRef } from "react";

type Locale = "sr" | "en";

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

const GOLD = "#c4a56b";
const GOLD_LIGHT = "#dfc88f";
const GOLD_DARK = "#8d6f43";

const EASE = [0.22, 1, 0.36, 1] as const;

const COPY: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    body: string;
    cta: string;
    items: BridgeItem[];
    archiveLabel: string;
    footerSignal: string;
  }
> = {
  sr: {
    eyebrow: "UMBRA STUDIO / NAČIN RADA",
    title: "Od priče do kadra",
    body:
      "Razvijamo originalne priče, ekranizacije i serijale kroz isti princip — narativ vodi sliku, a svaki kadar ima razlog da postoji.",
    cta: "Istraži projekte",
    archiveLabel: "PROJEKTI",
    footerSignal: "UMBRA / PRE-FOOTER",
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
        label: "SERIJE",
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
    archiveLabel: "PROJECTS",
    footerSignal: "UMBRA / PRE-FOOTER",
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

function getDestinationHref(
  locale: Locale,
  destination: BridgeItem["destination"],
) {
  const base = locale === "en" ? "/en/projects" : "/serije";

  switch (destination) {
    case "original":
      return `${base}?vrsta=originalne`;
    case "adaptation":
      return `${base}?vrsta=ekranizacije`;
    case "series":
      return `${base}?format=serije`;
  }
}

function getDestinationLabel(
  locale: Locale,
  destination: BridgeItem["destination"],
) {
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
}

export default function StudioManifesto({
  locale = "sr",
}: StudioManifestoProps) {
  const reducedMotion = useReducedMotion() ?? false;
  const copy = COPY[locale];

  const projectsHref =
    locale === "en" ? "/en/projects" : "/serije";

  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useInView(sectionRef, {
    once: true,
    amount: 0.10,
  });

  return (
    <section
      id="studio-bridge"
      ref={sectionRef}
      data-umbra-prefooter
      aria-labelledby="studio-bridge-title"
      className="relative overflow-hidden border-b border-white/[0.045] bg-[var(--umbra-bg-deep)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 18% 12%, rgba(223,200,143,.018), transparent 28%), linear-gradient(180deg,#030302 0%,#050504 58%,#030302 100%)",
          }}
        />

        <div
          className="absolute right-[-12%] bottom-[-24%] h-[520px] w-[520px] rounded-full"
          style={{
            background:
              `radial-gradient(circle, ${GOLD}014, transparent 72%)`,
            filter: "blur(90px)",
          }}
        />

        <div
          className="absolute inset-x-[5%] top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(223,200,143,.08), transparent)",
          }}
        />
      </div>

      <div className="umbra-container relative py-16 sm:py-20 lg:py-24">
        <motion.div
          initial={{
            opacity: 0,
            y: reducedMotion ? 0 : 8,
          }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{
            duration: reducedMotion ? 0 : 0.58,
            ease: EASE,
          }}
          className="border-b border-white/[0.055] pb-7 sm:pb-8"
        >
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
            <div className="max-w-[760px]">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-px w-8"
                  style={{
                    background:
                      `linear-gradient(90deg, transparent, ${GOLD_LIGHT}78)`,
                  }}
                />

                <span
                  className="umbra-code"
                  style={{ color: `${GOLD_LIGHT}72` }}
                >
                  {copy.eyebrow}
                </span>
              </div>

              <h2
                id="studio-bridge-title"
                className="mt-5 text-[clamp(2.45rem,7vw,5.8rem)] font-[430] uppercase leading-[0.89] tracking-[-0.06em] text-[var(--umbra-platinum)] sm:mt-6 sm:text-[clamp(2.9rem,5.2vw,5.8rem)]"
              >
                {copy.title}
              </h2>
            </div>

            <div className="max-w-[380px] lg:pb-1">
              <p className="text-[12px] leading-6 text-[var(--umbra-ink-muted)] sm:text-[13px] sm:leading-7">
                {copy.body}
              </p>

              <Link
                href={projectsHref}
                className="group mt-5 inline-flex min-h-10 items-center gap-3 text-[8px] font-semibold uppercase tracking-[0.24em] outline-none transition-[color,transform] duration-300 hover:-translate-y-px focus-visible:ring-1 focus-visible:ring-[#dfc88f]/70 sm:mt-6"
                style={{ color: `${GOLD_LIGHT}9f` }}
              >
                {copy.cta}

                <ArrowUpRight
                  aria-hidden="true"
                  size={13}
                  strokeWidth={1.1}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="mt-5 grid gap-px overflow-hidden border border-white/[0.065] bg-white/[0.055] md:grid-cols-3">
          {copy.items.map((item, index) => (
            <motion.div
              key={item.index}
              initial={{
                opacity: 0,
                y: reducedMotion ? 0 : 10,
              }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{
                duration: reducedMotion ? 0 : 0.54,
                delay: reducedMotion ? 0 : 0.05 + index * 0.06,
                ease: EASE,
              }}
            >
              <Link
                href={getDestinationHref(locale, item.destination)}
                aria-label={getDestinationLabel(
                  locale,
                  item.destination,
                )}
                className="group relative flex min-h-[224px] h-full flex-col bg-[#050504] p-5 outline-none transition-[background-color,transform] duration-500 hover:-translate-y-0.5 hover:bg-[#080807] focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#dfc88f]/70 sm:min-h-[246px] sm:p-7 lg:min-h-[264px] lg:p-8"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="umbra-code"
                    style={{ color: `${GOLD_LIGHT}68` }}
                  >
                    {item.index}
                  </span>

                  <span
                    aria-hidden="true"
                    className="h-px w-7 transition-[width] duration-500 group-hover:w-11"
                    style={{ background: `${GOLD}40` }}
                  />
                </div>

                <p
                  className="mt-8 umbra-code"
                  style={{ color: `${GOLD_LIGHT}4f` }}
                >
                  {item.label}
                </p>

                <h3 className="mt-3 max-w-[280px] text-[clamp(1.3rem,3.8vw,1.95rem)] font-[430] leading-[0.95] tracking-[-0.035em] text-white/[0.90] sm:mt-4">
                  {item.title}
                </h3>

                <p className="mt-4 max-w-[330px] text-[10px] leading-5 text-white/[0.29] sm:mt-5 sm:text-[11px] sm:leading-6">
                  {item.description}
                </p>

                <div className="mt-auto flex items-end justify-between gap-4 pt-7">
                  <span className="umbra-code text-white/[0.085]">
                    {copy.archiveLabel}
                  </span>

                  <span className="flex min-h-9 items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="h-px w-0 transition-[width] duration-500 group-hover:w-6"
                      style={{ background: `${GOLD_LIGHT}70` }}
                    />

                    <ArrowUpRight
                      aria-hidden="true"
                      size={13}
                      strokeWidth={1.05}
                      className="text-white/[0.18] transition-[color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#dfc88f]/78"
                    />
                  </span>
                </div>

                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 h-px w-0 transition-[width] duration-500 group-hover:w-24"
                  style={{
                    background:
                      `linear-gradient(90deg, ${GOLD_DARK}, ${GOLD_LIGHT}, transparent)`,
                  }}
                />
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : undefined}
          transition={{
            duration: reducedMotion ? 0 : 0.46,
            delay: reducedMotion ? 0 : 0.20,
            ease: EASE,
          }}
          className="mt-8 flex items-center justify-between border-t border-white/[0.045] pt-5 sm:mt-9"
        >
          <span className="umbra-code text-white/[0.09]">
            {copy.footerSignal}
          </span>

          <span
            className="umbra-code"
            style={{ color: `${GOLD_LIGHT}25` }}
          >
            END FRAME / NEXT
          </span>
        </motion.div>
      </div>
    </section>
  );
}
