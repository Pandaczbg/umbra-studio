"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUp,
  ArrowUpRight,
} from "lucide-react";
import {
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  useState,
  type MouseEvent,
} from "react";

type Locale = "sr" | "en";

type FooterProps = {
  locale?: Locale;
};

type NavigationItem = {
  label: string;
  href: string;
};

type FooterCopy = {
  description: string;
  explore: string;
  follow: string;
  watch: string;
  creditLabel: string;
  creditTitle: string;
  creditSub: string;
  creditRole: string;
  creditAuthor: string;
  creditAction: string;
  reserved: string;
  source: string;
  top: string;
  closingBefore: string;
  closingAccent: string;
  studioType: string;
  footerIndex: string;
  signal: string;
  end: string;
  footerNote: string;
  returnLabel: string;
};

const GOLD = "#c4a56b";
const GOLD_LIGHT = "#dfc88f";
const EASE = [0.22, 1, 0.36, 1] as const;

const UPWORK_URL =
  "https://www.upwork.com/freelancers/~01add8bee84754c9ea?mp_source=share";

const YOUTUBE_URL = "https://www.youtube.com/@umbrastud";
const TIKTOK_URL = "https://www.tiktok.com/@umbrastud";

const NAVIGATION_SR: NavigationItem[] = [
  {
    label: "Početna",
    href: "/",
  },
  {
    label: "Projekti",
    href: "/serije",
  },
  {
    label: "Likovi",
    href: "/likovi",
  },
  {
    label: "Umbra",
    href: "/#o-studiju",
  },
  {
    label: "Gledaj",
    href: "/#watch",
  },
];

const NAVIGATION_EN: NavigationItem[] = [
  {
    label: "Home",
    href: "/en",
  },
  {
    label: "Projects",
    href: "/en/projects",
  },
  {
    label: "Characters",
    href: "/en/characters",
  },
  {
    label: "Umbra",
    href: "/en#o-studiju",
  },
  {
    label: "Watch",
    href: "/en#watch",
  },
];

const SOCIAL_LINKS = [
  {
    label: "YouTube",
    href: YOUTUBE_URL,
  },
  {
    label: "TikTok",
    href: TIKTOK_URL,
  },
] as const;

const COPY: Record<Locale, FooterCopy> = {
  sr: {
    description:
      "Nezavisan kreativni studio za priče, vizuelne svetove i digitalni film.",
    explore: "Istraži",
    follow: "Prati",
    watch: "Gledaj na YouTube-u",
    creditLabel: "WEBSITE / DESIGN / DEVELOPMENT",
    creditTitle: "Design & development",
    creditSub: "Art direction · UI · development",
    creditRole: "Designer / Developer",
    creditAuthor: "Aleksandar B.",
    creditAction: "Pogledaj rad",
    reserved: "Sva prava zadržana",
    source:
      "Prava na izvorna dela i materijale trećih autora ostaju njihovim odgovarajućim nosiocima prava.",
    top: "Vrh",
    closingBefore: "Priče koje ostavljaju",
    closingAccent: "senku",
    studioType: "STORY / FILM / MOTION",
    footerIndex: "END / 2026",
    signal: "PRIČA SE NASTAVLJA",
    end: "Završni kadar",
    footerNote: "Umbra Studio — 2026",
    returnLabel: "Nazad na Umbra",
  },

  en: {
    description:
      "An independent creative studio for stories, visual worlds and digital filmmaking.",
    explore: "Explore",
    follow: "Follow",
    watch: "Watch on YouTube",
    creditLabel: "WEBSITE / DESIGN / DEVELOPMENT",
    creditTitle: "Design & development",
    creditSub: "Art direction · UI · development",
    creditRole: "Designer / Developer",
    creditAuthor: "Aleksandar B.",
    creditAction: "View work",
    reserved: "All rights reserved",
    source:
      "Underlying works and third-party source materials remain with their respective rights holders.",
    top: "Top",
    closingBefore: "Stories that leave a",
    closingAccent: "shadow",
    studioType: "STORY / FILM / MOTION",
    footerIndex: "END / 2026",
    signal: "THE STORY CONTINUES",
    end: "Closing frame",
    footerNote: "Umbra Studio — 2026",
    returnLabel: "Back to Umbra",
  },
};

function InteractiveCredit({
  copy,
  reducedMotion,
}: {
  copy: FooterCopy;
  reducedMotion: boolean;
}) {
  const [active, setActive] = useState(false);

  return (
    <a
      href={UPWORK_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${copy.creditAction}: ${copy.creditAuthor}`}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      className="group block rounded-sm outline-none focus-visible:ring-1 focus-visible:ring-[#dfc88f]/70"
    >
      <div className="mb-3 flex items-center justify-between gap-4">
        <span
          className="umbra-code"
          style={{ color: `${GOLD_LIGHT}58` }}
        >
          {copy.creditLabel}
        </span>

        <span className="hidden umbra-code text-white/[0.07] sm:block">
          01 / CREDIT
        </span>
      </div>

      <motion.div
        className="relative overflow-hidden border-y border-white/[0.065] py-5 sm:py-6"
        animate={{
          borderColor: active
            ? "rgba(223,200,143,.20)"
            : "rgba(255,255,255,.065)",
        }}
        transition={{
          duration: reducedMotion ? 0 : 0.36,
          ease: EASE,
        }}
      >
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          animate={{
            opacity: active ? 1 : 0,
          }}
          transition={{
            duration: reducedMotion ? 0 : 0.3,
            ease: EASE,
          }}
          style={{
            background:
              `radial-gradient(ellipse 360px 120px at 88% 50%, ${GOLD}08, transparent 72%)`,
          }}
        />

        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 h-px origin-left"
          animate={{
            width: active ? "32%" : "14%",
            opacity: active ? 1 : 0.5,
          }}
          transition={{
            duration: reducedMotion ? 0 : 0.42,
            ease: EASE,
          }}
          style={{
            background:
              `linear-gradient(90deg, ${GOLD_LIGHT}, ${GOLD}, transparent)`,
          }}
        />

        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 h-px origin-left"
          animate={{
            width: active ? "26%" : "0%",
            opacity: active ? 1 : 0,
          }}
          transition={{
            duration: reducedMotion ? 0 : 0.42,
            ease: EASE,
          }}
          style={{
            background:
              `linear-gradient(90deg, ${GOLD_LIGHT}, ${GOLD}, transparent)`,
          }}
        />

        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <motion.div
            animate={{
              x: reducedMotion || !active ? 0 : 2,
            }}
            transition={{
              duration: reducedMotion ? 0 : 0.3,
              ease: EASE,
            }}
          >
            <h3 className="text-[clamp(1.2rem,2.7vw,2rem)] font-[420] uppercase leading-[0.94] tracking-[-0.045em] text-white/[0.62] transition-colors duration-300 group-hover:text-white/[0.86] group-focus-visible:text-white/[0.86]">
              {copy.creditTitle}
            </h3>

            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <span className="text-[6px] uppercase tracking-[0.17em] text-white/[0.15]">
                {copy.creditSub}
              </span>

              <span
                aria-hidden="true"
                className="hidden h-px w-5 sm:block"
                style={{ background: `${GOLD}28` }}
              />

              <span
                className="text-[6px] uppercase tracking-[0.17em]"
                style={{ color: `${GOLD_LIGHT}48` }}
              >
                {copy.creditRole}
              </span>
            </div>
          </motion.div>

          <div className="flex items-center justify-between gap-5 sm:justify-end">
            <div className="text-left sm:text-right">
              <div className="mb-1 umbra-code text-white/[0.08]">
                CREATIVE CREDIT
              </div>

              <motion.span
                animate={{
                  color: active
                    ? GOLD_LIGHT
                    : "rgba(255,255,255,.38)",
                }}
                transition={{
                  duration: reducedMotion ? 0 : 0.3,
                }}
                className="relative inline-block text-[8px] font-medium uppercase tracking-[0.17em]"
              >
                {copy.creditAuthor}

                <motion.span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-0 h-px origin-left"
                  animate={{
                    width: active ? "100%" : "0%",
                    opacity: active ? 1 : 0,
                  }}
                  transition={{
                    duration: reducedMotion ? 0 : 0.3,
                    ease: EASE,
                  }}
                  style={{
                    background:
                      `linear-gradient(90deg, ${GOLD_LIGHT}, transparent)`,
                  }}
                />
              </motion.span>

              <div className="mt-1.5 text-[5px] uppercase tracking-[0.18em] text-white/[0.08]">
                {copy.creditRole}
              </div>
            </div>

            <motion.span
              aria-hidden="true"
              className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border"
              animate={{
                borderColor: active
                  ? "rgba(223,200,143,.42)"
                  : "rgba(255,255,255,.08)",
                color: active
                  ? GOLD_LIGHT
                  : "rgba(255,255,255,.20)",
                scale: active ? 1.04 : 1,
              }}
              transition={{
                duration: reducedMotion ? 0 : 0.32,
                ease: EASE,
              }}
            >
              <motion.span
                animate={{
                  rotate: active ? -22 : 0,
                }}
                transition={{
                  duration: reducedMotion ? 0 : 0.3,
                  ease: EASE,
                }}
              >
                <ArrowUpRight
                  aria-hidden="true"
                  size={11}
                  strokeWidth={1}
                />
              </motion.span>
            </motion.span>
          </div>
        </div>
      </motion.div>

      <div className="mt-3 flex items-center justify-between">
        <span className="umbra-code text-white/[0.055]">
          UMBRA / CREATIVE DEVELOPMENT
        </span>

        <motion.span
          animate={{
            color: active
              ? GOLD_LIGHT
              : "rgba(223,200,143,.22)",
          }}
          transition={{
            duration: reducedMotion ? 0 : 0.25,
          }}
          className="text-[6px] uppercase tracking-[0.21em]"
        >
          {copy.creditAction}
        </motion.span>
      </div>
    </a>
  );
}

export default function Footer({
  locale = "sr",
}: FooterProps) {
  const reducedMotion = useReducedMotion() ?? false;
  const isEnglish = locale === "en";

  const navigation = isEnglish
    ? NAVIGATION_EN
    : NAVIGATION_SR;

  const copy = COPY[locale];

  const scrollToTop = (
    event: MouseEvent<HTMLAnchorElement>,
  ) => {
    event.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? "auto" : "smooth",
    });

    window.history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search,
    );
  };

  return (
    <footer
      id="footer"
      data-umbra-end-frame
      className="relative overflow-hidden border-t border-white/[0.065] bg-[var(--umbra-bg)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div
          className="absolute left-1/2 top-[-150px] h-[330px] w-[540px] -translate-x-1/2 rounded-full"
          style={{
            background:
              `radial-gradient(ellipse, ${GOLD}06 0%, transparent 72%)`,
            filter: "blur(78px)",
          }}
        />

        <div
          className="absolute bottom-0 left-1/2 h-px w-[42vw] -translate-x-1/2"
          style={{
            background:
              `linear-gradient(90deg, transparent, ${GOLD}20, transparent)`,
          }}
        />
      </div>

      <div className="umbra-container relative z-10">
        <motion.section
          initial={{
            opacity: 0,
            y: reducedMotion ? 0 : 6,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.08,
          }}
          transition={{
            duration: reducedMotion ? 0 : 0.56,
            ease: EASE,
          }}
          className="border-b border-white/[0.065] py-12 sm:py-14 lg:py-16"
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
            <div className="min-w-0">
              <Link
                href={isEnglish ? "/en" : "/"}
                aria-label={
                  isEnglish
                    ? "Umbra Studio home"
                    : "Početna strana Umbra Studija"
                }
                className="group flex w-fit items-center gap-3 rounded-sm outline-none focus-visible:ring-1 focus-visible:ring-[#dfc88f]/70"
              >
                <span
                  aria-hidden="true"
                  className="h-px w-7 transition-[width] duration-300 group-hover:w-10"
                  style={{
                    background:
                      `linear-gradient(90deg, transparent, ${GOLD})`,
                  }}
                />

                <span
                  className="umbra-code transition-colors duration-300 group-hover:text-white/[0.9]"
                  style={{
                    color: `${GOLD_LIGHT}70`,
                  }}
                >
                  UMBRA STUDIO
                </span>
              </Link>

              <Link
                href={isEnglish ? "/en" : "/"}
                aria-label={
                  isEnglish
                    ? "Return to Umbra Studio home"
                    : "Vrati se na početnu stranu Umbra Studija"
                }
                className="group block max-w-[880px] rounded-sm outline-none focus-visible:ring-1 focus-visible:ring-[#dfc88f]/70"
              >
                <p className="mt-5 font-serif text-[clamp(2rem,6vw,4.7rem)] italic leading-[0.93] tracking-[-0.055em] text-white/[0.68] transition-colors duration-500 group-hover:text-white/[0.86] sm:mt-6 sm:text-[clamp(2.25rem,4.2vw,4.7rem)]">
                  {copy.closingBefore}{" "}
                  <span style={{ color: GOLD_LIGHT }}>
                    {copy.closingAccent}
                  </span>
                </p>

                <span className="mt-4 inline-flex min-h-8 items-center gap-3 text-[6px] font-semibold uppercase tracking-[0.28em] opacity-70 transition-[opacity,transform] duration-300 group-hover:translate-x-1 group-hover:opacity-100 sm:text-[7px]">
                  <span style={{ color: `${GOLD_LIGHT}8c` }}>
                    {copy.returnLabel}
                  </span>

                  <ArrowUpRight
                    aria-hidden="true"
                    size={12}
                    strokeWidth={1.1}
                    style={{ color: `${GOLD_LIGHT}70` }}
                  />
                </span>
              </Link>

              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: reducedMotion ? 0 : 0.64,
                  delay: reducedMotion ? 0 : 0.04,
                  ease: EASE,
                }}
                className="mt-5 h-px w-full max-w-[480px] origin-left"
                style={{
                  background:
                    `linear-gradient(90deg, ${GOLD_LIGHT}, ${GOLD}1e, transparent)`,
                }}
              />
            </div>

            <a
              href="#"
              onClick={scrollToTop}
              className="group flex min-h-9 w-fit items-center gap-3 rounded-sm text-[6px] uppercase tracking-[0.24em] text-white/[0.25] outline-none transition-colors duration-300 hover:text-[#dfc88f] focus-visible:ring-1 focus-visible:ring-[#dfc88f]/70 sm:text-[7px]"
              aria-label={copy.top}
            >
              <span>{copy.top}</span>

              <span className="flex h-8 w-8 items-center justify-center border border-white/[0.08] transition-[border-color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:border-[#dfc88f]/[0.24]">
                <ArrowUp
                  aria-hidden="true"
                  size={11}
                  strokeWidth={1}
                />
              </span>
            </a>
          </div>
        </motion.section>

        <section className="border-b border-white/[0.065] py-10 sm:py-12 lg:py-14">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_.75fr_.65fr] lg:gap-16 xl:gap-20">
            <motion.div
              initial={{
                opacity: 0,
                y: reducedMotion ? 0 : 6,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.1,
              }}
              transition={{
                duration: reducedMotion ? 0 : 0.5,
                ease: EASE,
              }}
            >
              <Link
                href={isEnglish ? "/en" : "/"}
                aria-label={
                  isEnglish
                    ? "Umbra Studio home"
                    : "Početna strana Umbra Studija"
                }
                className="group flex w-fit items-center gap-3 rounded-sm outline-none focus-visible:ring-1 focus-visible:ring-[#dfc88f]/70 sm:gap-4"
              >
                <div className="relative h-9 w-9 overflow-hidden border border-white/[0.09] bg-black transition-[border-color,transform] duration-300 group-hover:-translate-y-px group-hover:border-[#dfc88f]/30">
                  <Image
                    src="/umbra-avatar.png"
                    alt="Umbra Studio"
                    fill
                    sizes="36px"
                    className="object-cover"
                  />
                </div>

                <div>
                  <div className="text-[8px] uppercase tracking-[0.28em] text-white/[0.7] transition-colors duration-300 group-hover:text-white/[0.9]">
                    UMBRA STUDIO
                  </div>

                  <div
                    className="mt-1 text-[6px] uppercase tracking-[0.20em]"
                    style={{ color: `${GOLD_LIGHT}4e` }}
                  >
                    {copy.studioType}
                  </div>
                </div>
              </Link>

              <p className="mt-5 max-w-[470px] text-[11px] leading-6 text-white/[0.33] sm:mt-6 sm:text-[13px]">
                {copy.description}
              </p>

              <a
                href={YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-5 inline-flex min-h-9 items-center gap-3 text-[6px] uppercase tracking-[0.20em] text-white/[0.28] outline-none transition-colors duration-300 hover:text-[#dfc88f] focus-visible:ring-1 focus-visible:ring-[#dfc88f]/70 sm:text-[7px]"
              >
                {copy.watch}

                <ArrowUpRight
                  aria-hidden="true"
                  size={11}
                  strokeWidth={1}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                y: reducedMotion ? 0 : 6,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.1,
              }}
              transition={{
                duration: reducedMotion ? 0 : 0.5,
                delay: reducedMotion ? 0 : 0.04,
                ease: EASE,
              }}
            >
              <div
                className="umbra-code"
                style={{ color: `${GOLD_LIGHT}4d` }}
              >
                {copy.explore}
              </div>

              <nav
                aria-label={
                  isEnglish
                    ? "Footer navigation"
                    : "Footer navigacija"
                }
                className="mt-3"
              >
                {navigation.map((item) => (
                  <Link
                    key={`${item.label}-${item.href}`}
                    href={item.href}
                    className="group flex min-h-10 items-center justify-between border-b border-white/[0.045] py-2.5 text-[7px] uppercase tracking-[0.17em] text-white/[0.4] outline-none transition-[padding,color] duration-300 hover:pl-1 hover:text-white focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#dfc88f]/60 sm:text-[8px]"
                  >
                    {item.label}

                    <ArrowUpRight
                      aria-hidden="true"
                      size={10}
                      strokeWidth={1}
                      className="text-white/[0.13] transition-[color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#dfc88f]"
                    />
                  </Link>
                ))}
              </nav>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                y: reducedMotion ? 0 : 6,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.1,
              }}
              transition={{
                duration: reducedMotion ? 0 : 0.5,
                delay: reducedMotion ? 0 : 0.08,
                ease: EASE,
              }}
            >
              <div
                className="umbra-code"
                style={{ color: `${GOLD_LIGHT}4d` }}
              >
                {copy.follow}
              </div>

              <div className="mt-3">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-h-10 items-center justify-between border-b border-white/[0.045] py-2.5 text-[7px] uppercase tracking-[0.17em] text-white/[0.4] outline-none transition-[padding,color] duration-300 hover:pl-1 hover:text-white focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#dfc88f]/60 sm:text-[8px]"
                  >
                    {social.label}

                    <ArrowUpRight
                      aria-hidden="true"
                      size={10}
                      strokeWidth={1}
                      className="text-white/[0.13] transition-[color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#dfc88f]"
                    />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <motion.section
          initial={{
            opacity: 0,
            y: reducedMotion ? 0 : 5,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.08,
          }}
          transition={{
            duration: reducedMotion ? 0 : 0.52,
            ease: EASE,
          }}
          className="py-7 sm:py-8 lg:py-9"
        >
          <InteractiveCredit
            copy={copy}
            reducedMotion={reducedMotion}
          />
        </motion.section>

        <section className="border-t border-white/[0.065] py-6 sm:py-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[6px] uppercase tracking-[0.17em] text-white/[0.21] sm:text-[7px]">
              <span>{copy.footerNote}</span>

              <span className="hidden h-3 w-px bg-white/[0.08] sm:block" />

              <span>{copy.reserved}</span>
            </div>

            <div className="flex items-center gap-3 text-[5px] uppercase tracking-[0.20em] text-white/[0.13] sm:text-[6px]">
              <span>Story</span>
              <span>Film</span>
              <span>Motion</span>
            </div>
          </div>

          <p className="mt-3 max-w-[1000px] text-[6px] leading-5 tracking-[0.05em] text-white/[0.13]">
            {copy.source}
          </p>
        </section>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: reducedMotion ? 0 : 0.45,
          }}
          className="flex flex-col gap-3 border-t border-white/[0.065] py-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="h-[3px] w-[3px] rounded-full"
              style={{
                background: GOLD,
                boxShadow: `0 0 7px ${GOLD}20`,
              }}
            />

            <span className="umbra-code text-white/[0.13]">
              UMBRA / END FRAME
            </span>

            <span
              aria-hidden="true"
              className="hidden h-px w-6 sm:block"
              style={{ background: `${GOLD}28` }}
            />

            <span
              className="hidden umbra-code sm:block"
              style={{ color: `${GOLD_LIGHT}3e` }}
            >
              {copy.signal}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <span className="umbra-code text-white/[0.13]">
              {copy.end}
            </span>

            <span
              className="umbra-code"
              style={{ color: `${GOLD_LIGHT}46` }}
            >
              {copy.footerIndex}
            </span>
          </div>
        </motion.div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-px w-full"
        style={{
          background:
            `linear-gradient(90deg, transparent, ${GOLD}22, ${GOLD_LIGHT}10, transparent)`,
        }}
      />
    </footer>
  );
}
