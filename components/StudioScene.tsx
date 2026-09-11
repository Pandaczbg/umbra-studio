"use client";

import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  MoveDownRight,
} from "lucide-react";
import {
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  useRef,
  useState,
} from "react";

type Locale = "sr" | "en";

const GOLD = "#c7a96b";
const GOLD_LIGHT = "#ead39a";
const GOLD_DARK = "#8f7142";

const EASE = [
  0.22,
  1,
  0.36,
  1,
] as const;

const copyByLocale = {
  sr: {
    section: "04 / O Umbri",
    kicker: "STUDIO MANIFEST",
    titleA: "Priča",
    titleB: "ostaje.",
    lead:
      "Umbra je filmski studio koji gradi priče od prvog impulsa do poslednjeg kadra.",
    body:
      "Ideja je početak. Lik joj daje lice. Prostor joj daje atmosferu. Vreme joj daje ritam. A kadar joj daje trag koji ostaje i kada se priča završi.",
    statementA: "NE TRAŽIMO",
    statementB: "SAMO KADAR.",
    statementC: "TRAŽIMO",
    statementD:
      "ONO ŠTO OSTAJE U NJEMU.",
    principles: [
      {
        index: "01",
        title: "PRIČA",
        description:
          "Sve počinje narativom. Bez jasnog impulsa nema slike koja ima razlog da postoji.",
      },
      {
        index: "02",
        title: "LIK",
        description:
          "Lik nije dekoracija. On nosi sukob, odluku, emociju i posledicu.",
      },
      {
        index: "03",
        title: "ATMOSFERA",
        description:
          "Svetlo, prostor, boja, zvuk i vreme grade svet u kojem priča može da diše.",
      },
      {
        index: "04",
        title: "TRAG",
        description:
          "Cilj nije samo završiti kadar. Cilj je napraviti sliku koju gledalac pamti.",
      },
    ],
    closing:
      "Od ideje do ekrana — jedan sistem, mnogo priča.",
    next: "05 / GLEDAJ",
    nextLabel: "Gledaj",
  },

  en: {
    section: "04 / About Umbra",
    kicker: "STUDIO MANIFEST",
    titleA: "The story",
    titleB: "remains.",
    lead:
      "Umbra is a film studio that builds stories from the first impulse to the final frame.",
    body:
      "The idea is the beginning. The character gives it a face. Space gives it atmosphere. Time gives it rhythm. And the frame gives it a trace that remains after the story ends.",
    statementA: "WE ARE NOT",
    statementB: "LOOKING FOR",
    statementC: "JUST A FRAME.",
    statementD:
      "WE ARE LOOKING FOR WHAT REMAINS IN IT.",
    principles: [
      {
        index: "01",
        title: "STORY",
        description:
          "Everything begins with narrative. Without a clear impulse, there is no image with a reason to exist.",
      },
      {
        index: "02",
        title: "CHARACTER",
        description:
          "A character is not decoration. They carry conflict, choice, emotion and consequence.",
      },
      {
        index: "03",
        title: "ATMOSPHERE",
        description:
          "Light, space, color, sound and time build the world in which a story can breathe.",
      },
      {
        index: "04",
        title: "TRACE",
        description:
          "The goal is not simply to finish a frame. It is to create an image the viewer remembers.",
      },
    ],
    closing:
      "From idea to screen — one system, many stories.",
    next: "05 / WATCH",
    nextLabel: "Watch",
  },
} as const;

export default function StudioScene({
  locale = "sr",
}: {
  locale?: Locale;
}) {
  const reducedMotion =
    useReducedMotion() ?? false;

  const copy =
    copyByLocale[locale];

  const nextHref =
    locale === "en"
      ? "/en#watch"
      : "/#watch";

  const stageRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const pointerX =
    useSpring(0, {
      stiffness: 70,
      damping: 24,
      mass: 0.6,
    });

  const pointerY =
    useSpring(0, {
      stiffness: 70,
      damping: 24,
      mass: 0.6,
    });

  const glowX =
    useTransform(
      pointerX,
      [-1, 1],
      ["28%", "72%"],
    );

  const glowY =
    useTransform(
      pointerY,
      [-1, 1],
      ["30%", "70%"],
    );

  const [activePrinciple, setActivePrinciple] =
    useState<string | null>(null);

  const handlePointerMove = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (
      reducedMotion ||
      event.pointerType ===
        "touch"
    ) {
      return;
    }

    const rect =
      event.currentTarget.getBoundingClientRect();

    pointerX.set(
      ((event.clientX -
        rect.left) /
        rect.width) *
        2 -
        1,
    );

    pointerY.set(
      ((event.clientY -
        rect.top) /
        rect.height) *
        2 -
        1,
    );
  };

  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <section
      id="o-studiju"
      data-umbra-scene="studio"
      aria-labelledby="studio-title"
      className="relative overflow-hidden border-b border-white/[0.06] bg-[#050505]"
    >
      {/* =====================================================================
          ATMOSPHERE
          ===================================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute left-1/2 top-[20%] h-[780px] w-[780px] -translate-x-1/2 rounded-full"
          style={{
            background: `
              radial-gradient(
                circle,
                ${GOLD}05 0%,
                ${GOLD}015 32%,
                transparent 72%
              )
            `,
            filter:
              "blur(85px)",
          }}
        />

        <div
          className="absolute -left-[20%] top-[38%] h-[720px] w-[720px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,.012), transparent 70%)",
            filter:
              "blur(85px)",
          }}
        />

        <span
          className="absolute inset-x-[5%] top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,.03), transparent)",
          }}
        />

        <span
          className="absolute left-[58%] top-0 h-full w-px opacity-[0.22]"
          style={{
            background:
              `linear-gradient(180deg, transparent, ${GOLD}18 25%, transparent 76%)`,
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,.03), transparent 28%, transparent 76%, rgba(0,0,0,.38))",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1540px] px-6 py-24 sm:px-9 sm:py-28 lg:px-12 lg:py-32 xl:px-16">
        {/* ===================================================================
            HEADER
            =================================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: reducedMotion ? 0 : 8,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.12,
          }}
          transition={{
            duration:
              reducedMotion ? 0 : 0.52,
            ease: EASE,
          }}
          className="flex items-center justify-between border-b border-white/[0.055] pb-5"
        >
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="h-px w-10"
              style={{
                background:
                  `linear-gradient(90deg, transparent, ${GOLD})`,
              }}
            />

            <span
              className="font-mono text-[7px] tracking-[0.42em]"
              style={{
                color:
                  `${GOLD_LIGHT}82`,
              }}
            >
              04
            </span>

            <span className="text-[8px] font-semibold uppercase tracking-[0.37em] text-white/[0.5]">
              {locale === "en"
                ? "ABOUT UMBRA"
                : "O UMBRI"}
            </span>
          </div>

          <span className="hidden font-mono text-[6px] uppercase tracking-[0.32em] text-white/[0.14] sm:block">
            {copy.kicker}
          </span>
        </motion.div>

        {/* ===================================================================
            INTRO
            =================================================================== */}

        <div className="mt-16 grid gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-24 xl:mt-20">
          <div>
            <motion.div
              initial={{
                opacity: 0,
                y: reducedMotion ? 0 : 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.14,
              }}
              transition={{
                duration:
                  reducedMotion ? 0 : 0.8,
                ease: EASE,
              }}
            >
              <h2
                id="studio-title"
                className="max-w-[1000px] text-[clamp(4.3rem,8.8vw,10.2rem)] font-[420] uppercase leading-[0.75] tracking-[-0.088em] text-white"
              >
                <span className="block">
                  {copy.titleA}
                </span>

                <span className="block font-serif font-normal italic text-white/[0.56]">
                  {copy.titleB}
                </span>
              </h2>
            </motion.div>

            <motion.div
              initial={{
                scaleX: 0,
                opacity: 0,
              }}
              whileInView={{
                scaleX: 1,
                opacity: 1,
              }}
              viewport={{
                once: true,
                amount: 0.14,
              }}
              transition={{
                delay:
                  reducedMotion ? 0 : 0.09,
                duration:
                  reducedMotion ? 0 : 0.72,
                ease: EASE,
              }}
              className="mt-9 h-px max-w-[580px] origin-left"
              style={{
                background:
                  `linear-gradient(90deg, ${GOLD}65, rgba(255,255,255,.05) 55%, transparent)`,
              }}
            />

            <motion.p
              initial={{
                opacity: 0,
                y: reducedMotion ? 0 : 10,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.12,
              }}
              transition={{
                delay:
                  reducedMotion ? 0 : 0.16,
                duration:
                  reducedMotion ? 0 : 0.58,
                ease: EASE,
              }}
              className="mt-8 max-w-[620px] text-[15px] leading-8 text-white/[0.44] sm:text-[16px]"
            >
              {copy.lead}
            </motion.p>
          </div>

          {/* =================================================================
              DEFINING OBJECT
              ================================================================= */}

          <StudioDefinition
            text={copy.body}
            reducedMotion={
              reducedMotion
            }
          />
        </div>

        {/* ===================================================================
            MANIFEST
            =================================================================== */}

        <motion.div
          ref={stageRef}
          initial={{
            opacity: 0,
            y: reducedMotion ? 0 : 18,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.12,
          }}
          transition={{
            delay:
              reducedMotion ? 0 : 0.08,
            duration:
              reducedMotion ? 0 : 0.7,
            ease: EASE,
          }}
          onPointerMove={
            handlePointerMove
          }
          onPointerLeave={
            resetPointer
          }
          className="group/manifest relative mt-24 overflow-hidden border-y border-white/[0.055] py-16 sm:mt-28 sm:py-20 lg:mt-32 lg:py-24"
        >
          {/* Interactive glow */}

          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover/manifest:opacity-100"
            style={{
              background:
                `radial-gradient(circle at ${glowX} ${glowY}, ${GOLD}08 0%, transparent 34%)`,
            }}
          />

          {/* Side geometry */}

          <span
            aria-hidden="true"
            className="absolute left-0 top-0 h-16 w-px"
            style={{
              background:
                `linear-gradient(180deg, ${GOLD_LIGHT}72, transparent)`,
            }}
          />

          <span
            aria-hidden="true"
            className="absolute bottom-0 right-0 h-16 w-px"
            style={{
              background:
                `linear-gradient(0deg, ${GOLD}46, transparent)`,
            }}
          />

          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-[4%] top-1/2 -translate-y-1/2 text-[clamp(7rem,18vw,18rem)] font-[500] uppercase leading-none tracking-[-0.11em] text-white/[0.012]"
          >
            UMBRA
          </span>

          <div className="relative max-w-[1160px]">
            <div className="flex items-center gap-3">
              <span
                className="font-mono text-[6px] tracking-[0.34em]"
                style={{
                  color:
                    `${GOLD_LIGHT}66`,
                }}
              >
                04
              </span>

              <span className="font-mono text-[6px] uppercase tracking-[0.34em] text-white/[0.16]">
                {locale === "en"
                  ? "CREATIVE POSITION"
                  : "KREATIVNI STAV"}
              </span>
            </div>

            <div className="mt-9">
              <ManifestLine
                text={copy.statementA}
                muted
                reducedMotion={
                  reducedMotion
                }
              />

              <ManifestLine
                text={copy.statementB}
                reducedMotion={
                  reducedMotion
                }
              />

              <ManifestLine
                text={copy.statementC}
                serif
                reducedMotion={
                  reducedMotion
                }
              />

              <ManifestLine
                text={copy.statementD}
                accented
                reducedMotion={
                  reducedMotion
                }
              />
            </div>

            <div className="mt-10 flex items-center gap-3">
              <motion.span
                aria-hidden="true"
                className="h-px w-12 origin-left"
                initial={{
                  scaleX: 0,
                }}
                whileInView={{
                  scaleX: 1,
                }}
                viewport={{
                  once: true,
                  amount: 0.1,
                }}
                transition={{
                  delay:
                    reducedMotion
                      ? 0
                      : 0.35,
                  duration:
                    reducedMotion
                      ? 0
                      : 0.7,
                  ease: EASE,
                }}
                style={{
                  background:
                    `linear-gradient(90deg, ${GOLD_LIGHT}, transparent)`,
                }}
              />

              <span className="font-mono text-[6px] uppercase tracking-[0.34em] text-white/[0.17]">
                UMBRA STUDIO
              </span>
            </div>
          </div>
        </motion.div>

        {/* ===================================================================
            FOUR PRINCIPLES
            =================================================================== */}

        <div className="mt-20 lg:mt-24">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <div className="font-mono text-[6px] uppercase tracking-[0.32em] text-white/[0.17]">
                {locale === "en"
                  ? "THE SYSTEM"
                  : "SISTEM"}
              </div>

              <div className="mt-2 text-[8px] uppercase tracking-[0.31em] text-white/[0.3]">
                {locale === "en"
                  ? "Four things that hold the story together."
                  : "Četiri stvari koje drže priču na okupu."}
              </div>
            </div>

            <span className="font-mono text-[6px] tracking-[0.28em] text-white/[0.14]">
              04 / 04
            </span>
          </div>

          <div className="grid gap-px border border-white/[0.055] bg-white/[0.035] sm:grid-cols-2 lg:grid-cols-4">
            {copy.principles.map(
              (principle, index) => (
                <PrincipleCard
                  key={
                    principle.index
                  }
                  principle={
                    principle
                  }
                  index={index}
                  active={
                    activePrinciple ===
                    principle.index
                  }
                  setActive={() =>
                    setActivePrinciple(
                      (
                        current,
                      ) =>
                        current ===
                        principle.index
                          ? null
                          : principle.index,
                    )
                  }
                  reducedMotion={
                    reducedMotion
                  }
                />
              ),
            )}
          </div>
        </div>

        {/* ===================================================================
            CLOSING
            =================================================================== */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
            amount: 0.08,
          }}
          transition={{
            duration:
              reducedMotion ? 0 : 0.5,
            ease: EASE,
          }}
          className="mt-16 flex flex-col gap-6 border-t border-white/[0.055] pt-6 sm:mt-20 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <span
              className="h-px w-8"
              style={{
                background:
                  `${GOLD}48`,
              }}
            />

            <span className="font-mono text-[6px] uppercase tracking-[0.3em] text-white/[0.16]">
              {copy.closing}
            </span>
          </div>

          <Link
            href={nextHref}
            className="group/next flex items-center gap-3 self-start sm:self-auto"
          >
            <span className="text-[7px] uppercase tracking-[0.28em] text-white/[0.2] transition-colors duration-300 group-hover/next:text-white/[0.48]">
              {copy.next}
            </span>

            <ArrowDownRight
              size={13}
              strokeWidth={1.1}
              className="transition-transform duration-300 group-hover/next:translate-x-0.5 group-hover/next:translate-y-0.5"
              style={{
                color:
                  `${GOLD_LIGHT}78`,
              }}
            />

            <span className="sr-only">
              {copy.nextLabel}
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ==========================================================================
   DEFINING BLOCK
   ========================================================================== */

function StudioDefinition({
  text,
  reducedMotion,
}: {
  text: string;
  reducedMotion: boolean;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: reducedMotion ? 0 : 20,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
      }}
      viewport={{
        once: true,
        amount: 0.13,
      }}
      transition={{
        delay:
          reducedMotion ? 0 : 0.12,
        duration:
          reducedMotion ? 0 : 0.7,
        ease: EASE,
      }}
      className="relative self-end border-l border-white/[0.07] pl-6 sm:pl-8"
    >
      <span
        aria-hidden="true"
        className="absolute -left-px top-0 h-14 w-px"
        style={{
          background:
            `linear-gradient(180deg, ${GOLD_LIGHT}70, transparent)`,
        }}
      />

      <div className="font-mono text-[6px] uppercase tracking-[0.34em] text-white/[0.17]">
        DEFINICIJA
      </div>

      <p className="mt-5 max-w-[530px] text-[13px] leading-7 text-white/[0.34] sm:text-[14px] sm:leading-8">
        {text}
      </p>

      <div className="mt-8 flex items-center gap-3">
        <span
          className="h-px w-8"
          style={{
            background:
              `${GOLD}4d`,
          }}
        />

        <span className="font-mono text-[6px] tracking-[0.3em] text-white/[0.14]">
          04 / 05
        </span>
      </div>
    </motion.div>
  );
}

/* ==========================================================================
   MANIFEST LINE
   ========================================================================== */

function ManifestLine({
  text,
  serif = false,
  muted = false,
  accented = false,
  reducedMotion,
}: {
  text: string;
  serif?: boolean;
  muted?: boolean;
  accented?: boolean;
  reducedMotion: boolean;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: reducedMotion ? 0 : 14,
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
        duration:
          reducedMotion ? 0 : 0.62,
        ease: EASE,
      }}
      className={[
        "text-[clamp(2.2rem,5vw,5.8rem)] font-[420] uppercase leading-[0.86] tracking-[-0.062em]",
        serif
          ? "font-serif font-normal italic"
          : "",
        muted
          ? "text-white/[0.29]"
          : "",
        accented
          ? "text-white/[0.74]"
          : "",
        !muted &&
        !accented &&
        !serif
          ? "text-white"
          : "",
        "sm:leading-[0.84]",
      ].join(" ")}
    >
      {text}
    </motion.div>
  );
}

/* ==========================================================================
   PRINCIPLE CARD
   ========================================================================== */

function PrincipleCard({
  principle,
  index,
  active,
  setActive,
  reducedMotion,
}: {
  principle: {
    index: string;
    title: string;
    description: string;
  };
  index: number;
  active: boolean;
  setActive: () => void;
  reducedMotion: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={setActive}
      initial={{
        opacity: 0,
        y: reducedMotion ? 0 : 12,
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
        delay:
          reducedMotion
            ? 0
            : index * 0.04,
        duration:
          reducedMotion ? 0 : 0.48,
        ease: EASE,
      }}
      className="group/card relative min-h-[255px] overflow-hidden bg-[#060606] p-6 text-left outline-none sm:p-7 lg:p-8"
    >
      {/* Active field */}

      <motion.span
        aria-hidden="true"
        className="absolute inset-0 origin-bottom-left"
        animate={{
          opacity: active ? 1 : 0,
          scaleY: active ? 1 : 0,
        }}
        transition={{
          duration:
            reducedMotion ? 0 : 0.5,
          ease: EASE,
        }}
        style={{
          background:
            `linear-gradient(145deg, ${GOLD}07, transparent 58%)`,
        }}
      />

      {/* Top */}

      <div className="relative z-10 flex items-center justify-between">
        <span
          className="font-mono text-[7px] tracking-[0.26em]"
          style={{
            color: active
              ? `${GOLD_LIGHT}78`
              : "rgba(255,255,255,.17)",
          }}
        >
          {principle.index}
        </span>

        <motion.span
          animate={{
            rotate: active ? 45 : 0,
            x: active ? 1 : 0,
            y: active ? -1 : 0,
          }}
          transition={{
            duration:
              reducedMotion ? 0 : 0.35,
            ease: EASE,
          }}
        >
          <ArrowUpRight
            size={12}
            strokeWidth={1.05}
            className="text-white/[0.19] transition-colors duration-300 group-hover/card:text-white/[0.58]"
          />
        </motion.span>
      </div>

      {/* Number atmosphere */}

      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-3 top-10 font-mono text-[92px] font-medium leading-none tracking-[-0.09em] text-white/[0.012]"
      >
        {principle.index}
      </span>

      {/* Title */}

      <motion.h3
        animate={{
          x: active ? 4 : 0,
          color: active
            ? "#ffffff"
            : "rgba(255,255,255,.84)",
        }}
        transition={{
          duration:
            reducedMotion ? 0 : 0.38,
          ease: EASE,
        }}
        className="relative z-10 mt-16 text-[18px] font-[520] uppercase tracking-[-0.025em] sm:text-[20px]"
      >
        {principle.title}
      </motion.h3>

      {/* Description */}

      <motion.p
        animate={{
          opacity: active ? 0.56 : 0.28,
          y: active ? 0 : 2,
        }}
        transition={{
          duration:
            reducedMotion ? 0 : 0.35,
          ease: EASE,
        }}
        className="relative z-10 mt-4 max-w-[240px] text-[9px] leading-5 sm:text-[10px] sm:leading-6"
      >
        {principle.description}
      </motion.p>

      {/* Bottom signal */}

      <motion.span
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-px origin-left"
        animate={{
          scaleX: active ? 1 : 0.16,
        }}
        transition={{
          duration:
            reducedMotion ? 0 : 0.55,
          ease: EASE,
        }}
        style={{
          width: "100%",
          background:
            `linear-gradient(90deg, ${GOLD_DARK}, ${GOLD_LIGHT}, transparent 72%)`,
        }}
      />

      {/* Side signal */}

      <motion.span
        aria-hidden="true"
        className="absolute bottom-0 left-0 top-0 w-px origin-bottom"
        animate={{
          scaleY: active ? 1 : 0,
        }}
        transition={{
          duration:
            reducedMotion ? 0 : 0.55,
          ease: EASE,
        }}
        style={{
          background:
            `linear-gradient(180deg, ${GOLD_LIGHT}, transparent)`,
        }}
      />
    </motion.button>
  );
}