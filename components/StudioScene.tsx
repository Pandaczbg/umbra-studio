"use client";

import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";
import {
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  useRef,
  useState,
} from "react";

type Locale = "sr" | "en";

const GOLD = "#c7a96b";
const GOLD_LIGHT = "#ead39a";
const GOLD_DARK = "#8f7142";

const EASE = [0.22, 1, 0.36, 1] as const;

const copyByLocale = {
  sr: {
    section: "04 / O UMBRI",
    kicker: "STUDIO",
    titleA: "Priče",
    titleB: "koje ostaju.",
    lead:
      "Umbra Studio je prostor za filmske priče, adaptacije i svetove koji ne nestaju zajedno sa poslednjim kadrom.",
    body:
      "Ne počinjemo od tehnologije. Počinjemo od priče. Od lika koji ima razlog da postoji, prostora koji ima svoju tišinu i trenutka koji zaslužuje da bude zapamćen.",
    statementA: "NE TRAŽIMO",
    statementB: "LEP KADAR.",
    statementC: "TRAŽIMO",
    statementD: "KADAR KOJI OSTAVLJA SENKU.",
    systemLabel: "KAKO GRADIMO",
    systemTitle:
      "Svaka priča ima svoj ritam.",
    principles: [
      {
        index: "01",
        title: "PRIČA",
        description:
          "Pre slike dolazi razlog. Svaki kadar mora da pripada nečemu većem od samog kadra.",
      },
      {
        index: "02",
        title: "LIK",
        description:
          "Priču nose ljudi. Njihove odluke, odnosi i posledice daju svetu težinu.",
      },
      {
        index: "03",
        title: "SVET",
        description:
          "Mesto, vreme, svetlo, zvuk i detalj stvaraju prostor u koji gledalac može da poveruje.",
      },
      {
        index: "04",
        title: "TRAG",
        description:
          "Najvažnije počinje kada se kadar završi. Ako nešto ostane u gledaocu, priča je uspela.",
      },
    ],
    closing:
      "Umbra Studio — priče koje ostavljaju senku.",
    next: "05 / GLEDAJ",
    nextLabel: "Gledaj",
    definitionLabel: "NAŠA IDEJA",
    positionLabel: "AUTORSKI STAV",
    systemMeta:
      "PRIČA / LIK / SVET / TRAG",
  },

  en: {
    section: "04 / ABOUT UMBRA",
    kicker: "STUDIO",
    titleA: "Stories",
    titleB: "that remain.",
    lead:
      "Umbra Studio is a space for cinematic stories, adaptations and worlds that do not disappear with the final frame.",
    body:
      "We do not begin with technology. We begin with the story. With a character who has a reason to exist, a space with its own silence, and a moment worth remembering.",
    statementA: "WE ARE NOT",
    statementB: "LOOKING FOR A",
    statementC: "BEAUTIFUL FRAME.",
    statementD: "WE WANT THE FRAME THAT LEAVES A SHADOW.",
    systemLabel: "HOW WE BUILD",
    systemTitle:
      "Every story has its own rhythm.",
    principles: [
      {
        index: "01",
        title: "STORY",
        description:
          "The reason comes before the image. Every frame must belong to something larger than itself.",
      },
      {
        index: "02",
        title: "CHARACTER",
        description:
          "Stories are carried by people. Their choices, relationships and consequences give a world its weight.",
      },
      {
        index: "03",
        title: "WORLD",
        description:
          "Place, time, light, sound and detail create a space the viewer can believe in.",
      },
      {
        index: "04",
        title: "TRACE",
        description:
          "The most important part begins when the frame ends. If something remains with the viewer, the story worked.",
      },
    ],
    closing:
      "Umbra Studio — stories that leave a shadow.",
    next: "05 / WATCH",
    nextLabel: "Watch",
    definitionLabel: "OUR IDEA",
    positionLabel: "CREATIVE POSITION",
    systemMeta:
      "STORY / CHARACTER / WORLD / TRACE",
  },
} as const;

export default function StudioScene({
  locale = "sr",
}: {
  locale?: Locale;
}) {
  const reducedMotion = useReducedMotion() ?? false;
  const copy = copyByLocale[locale];

  const nextHref =
    locale === "en"
      ? "/en#watch"
      : "/#watch";

  const stageRef = useRef<HTMLDivElement | null>(null);

  const pointerX = useSpring(0, {
    stiffness: 70,
    damping: 24,
    mass: 0.6,
  });

  const pointerY = useSpring(0, {
    stiffness: 70,
    damping: 24,
    mass: 0.6,
  });

  const glowX = useTransform(
    pointerX,
    [-1, 1],
    ["28%", "72%"],
  );

  const glowY = useTransform(
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
      event.pointerType === "touch"
    ) {
      return;
    }

    const rect =
      event.currentTarget.getBoundingClientRect();

    pointerX.set(
      ((event.clientX - rect.left) /
        rect.width) *
        2 -
        1,
    );

    pointerY.set(
      ((event.clientY - rect.top) /
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
      className="relative overflow-hidden border-b border-white/[0.055] bg-[#050505]"
    >
      {/* ================================================================
          ATMOSPHERE
          ================================================================ */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute left-1/2 top-[18%] h-[820px] w-[820px] -translate-x-1/2 rounded-full"
          style={{
            background: `
              radial-gradient(
                circle,
                ${GOLD}05 0%,
                ${GOLD}014 34%,
                transparent 72%
              )
            `,
            filter: "blur(95px)",
          }}
        />

        <div
          className="absolute -left-[22%] top-[44%] h-[760px] w-[760px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,.012), transparent 70%)",
            filter: "blur(95px)",
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
          className="absolute left-[62%] top-0 h-full w-px opacity-[0.13]"
          style={{
            background: `
              linear-gradient(
                180deg,
                transparent,
                ${GOLD}16 25%,
                transparent 74%
              )
            `,
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,.025), transparent 26%, transparent 76%, rgba(0,0,0,.4))",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1540px] px-6 py-24 sm:px-9 sm:py-28 lg:px-12 lg:py-36 xl:px-16">
        {/* ==============================================================
            SECTION HEADER
            ============================================================== */}

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
            duration: reducedMotion ? 0 : 0.52,
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

        {/* ==============================================================
            INTRO
            ============================================================== */}

        <div className="mt-16 grid gap-16 lg:grid-cols-[1.08fr_0.92fr] lg:gap-24 xl:mt-20">
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
                duration: reducedMotion ? 0 : 0.82,
                ease: EASE,
              }}
            >
              <h2
                id="studio-title"
                className="max-w-[1040px] text-[clamp(4.3rem,8.9vw,10.2rem)] font-[420] uppercase leading-[0.75] tracking-[-0.088em] text-white"
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
                delay: reducedMotion ? 0 : 0.09,
                duration: reducedMotion ? 0 : 0.72,
                ease: EASE,
              }}
              className="mt-10 h-px max-w-[620px] origin-left"
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
                delay: reducedMotion ? 0 : 0.16,
                duration: reducedMotion ? 0 : 0.58,
                ease: EASE,
              }}
              className="mt-8 max-w-[660px] text-[15px] leading-8 text-white/[0.45] sm:text-[16px]"
            >
              {copy.lead}
            </motion.p>
          </div>

          {/* ============================================================
              DEFINITION
              ============================================================ */}

          <StudioDefinition
            text={copy.body}
            label={copy.definitionLabel}
            reducedMotion={reducedMotion}
          />
        </div>

        {/* ==============================================================
            MANIFEST
            ============================================================== */}

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
            delay: reducedMotion ? 0 : 0.08,
            duration: reducedMotion ? 0 : 0.7,
            ease: EASE,
          }}
          onPointerMove={handlePointerMove}
          onPointerLeave={resetPointer}
          className="group/manifest relative mt-24 overflow-hidden border-y border-white/[0.055] py-16 sm:mt-28 sm:py-20 lg:mt-32 lg:py-24"
        >
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover/manifest:opacity-100"
            style={{
              background:
                `radial-gradient(circle at ${glowX} ${glowY}, ${GOLD}08 0%, transparent 36%)`,
            }}
          />

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
            className="pointer-events-none absolute -right-[4%] top-1/2 -translate-y-1/2 text-[clamp(8rem,19vw,19rem)] font-[500] uppercase leading-none tracking-[-0.11em] text-white/[0.012]"
          >
            UMBRA
          </span>

          <div className="relative max-w-[1180px]">
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
                {copy.positionLabel}
              </span>
            </div>

            <div className="mt-10">
              <ManifestLine
                text={copy.statementA}
                muted
                reducedMotion={reducedMotion}
              />

              <ManifestLine
                text={copy.statementB}
                reducedMotion={reducedMotion}
              />

              <ManifestLine
                text={copy.statementC}
                serif
                reducedMotion={reducedMotion}
              />

              <ManifestLine
                text={copy.statementD}
                accented
                reducedMotion={reducedMotion}
              />
            </div>

            <div className="mt-11 flex items-center gap-3">
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
                  delay: reducedMotion ? 0 : 0.35,
                  duration: reducedMotion ? 0 : 0.7,
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

        {/* ==============================================================
            SYSTEM
            ============================================================== */}

        <div className="mt-20 lg:mt-24">
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
              amount: 0.1,
            }}
            transition={{
              duration: reducedMotion ? 0 : 0.5,
              ease: EASE,
            }}
            className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              <div className="font-mono text-[6px] uppercase tracking-[0.32em] text-white/[0.17]">
                {copy.systemLabel}
              </div>

              <h3 className="mt-3 max-w-[700px] text-[clamp(1.5rem,2.7vw,2.7rem)] font-[420] uppercase leading-[0.92] tracking-[-0.045em] text-white/[0.82]">
                {copy.systemTitle}
              </h3>
            </div>

            <div className="flex items-center gap-4">
              <span className="hidden font-mono text-[6px] uppercase tracking-[0.28em] text-white/[0.12] sm:block">
                {copy.systemMeta}
              </span>

              <span className="font-mono text-[6px] tracking-[0.28em] text-white/[0.14]">
                04 / 04
              </span>
            </div>
          </motion.div>

          <div className="grid gap-px border border-white/[0.055] bg-white/[0.035] sm:grid-cols-2 lg:grid-cols-4">
            {copy.principles.map(
              (principle, index) => (
                <PrincipleCard
                  key={principle.index}
                  principle={principle}
                  index={index}
                  active={
                    activePrinciple ===
                    principle.index
                  }
                  setActive={() =>
                    setActivePrinciple(
                      (current) =>
                        current ===
                        principle.index
                          ? null
                          : principle.index,
                    )
                  }
                  reducedMotion={reducedMotion}
                />
              ),
            )}
          </div>
        </div>

        {/* ==============================================================
            CLOSING
            ============================================================== */}

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
            duration: reducedMotion ? 0 : 0.5,
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

            <span
              className="font-mono text-[6px] uppercase tracking-[0.3em] text-white/[0.16]"
              style={{
                color: `${GOLD_LIGHT}5d`,
              }}
            >
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
  label,
  reducedMotion,
}: {
  text: string;
  label: string;
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
        delay: reducedMotion ? 0 : 0.12,
        duration: reducedMotion ? 0 : 0.7,
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
        {label}
      </div>

      <p className="mt-5 max-w-[540px] text-[13px] leading-7 text-white/[0.34] sm:text-[14px] sm:leading-8">
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
          UMBRA / 04
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
        y: reducedMotion ? 0 : 16,
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
        duration: reducedMotion ? 0 : 0.64,
        ease: EASE,
      }}
      className={[
        "max-w-[1180px] text-[clamp(2.15rem,5vw,5.8rem)] font-[420] uppercase leading-[0.86] tracking-[-0.064em]",
        serif
          ? "font-serif font-normal italic"
          : "",
        muted
          ? "text-white/[0.29]"
          : "",
        accented
          ? "max-w-[1100px] text-white/[0.78]"
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
        delay: reducedMotion
          ? 0
          : index * 0.04,
        duration: reducedMotion
          ? 0
          : 0.48,
        ease: EASE,
      }}
      className="group/card relative min-h-[255px] overflow-hidden bg-[#060606] p-6 text-left outline-none sm:p-7 lg:p-8"
    >
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 origin-bottom-left"
        animate={{
          opacity: active ? 1 : 0,
          scaleY: active ? 1 : 0,
        }}
        transition={{
          duration: reducedMotion ? 0 : 0.5,
          ease: EASE,
        }}
        style={{
          background:
            `linear-gradient(145deg, ${GOLD}07, transparent 58%)`,
        }}
      />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-3 top-10 font-mono text-[92px] font-medium leading-none tracking-[-0.09em] text-white/[0.012]"
      >
        {principle.index}
      </span>

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
            duration: reducedMotion ? 0 : 0.35,
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

      <motion.h3
        animate={{
          x: active ? 4 : 0,
          color: active
            ? "#ffffff"
            : "rgba(255,255,255,.84)",
        }}
        transition={{
          duration: reducedMotion ? 0 : 0.38,
          ease: EASE,
        }}
        className="relative z-10 mt-16 text-[18px] font-[520] uppercase tracking-[-0.025em] sm:text-[20px]"
      >
        {principle.title}
      </motion.h3>

      <motion.p
        animate={{
          opacity: active ? 0.58 : 0.29,
          y: active ? 0 : 2,
        }}
        transition={{
          duration: reducedMotion ? 0 : 0.35,
          ease: EASE,
        }}
        className="relative z-10 mt-4 max-w-[240px] text-[9px] leading-5 sm:text-[10px] sm:leading-6"
      >
        {principle.description}
      </motion.p>

      <motion.span
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-px origin-left"
        animate={{
          scaleX: active ? 1 : 0.14,
        }}
        transition={{
          duration: reducedMotion ? 0 : 0.55,
          ease: EASE,
        }}
        style={{
          width: "100%",
          background:
            `linear-gradient(90deg, ${GOLD_DARK}, ${GOLD_LIGHT}, transparent 72%)`,
        }}
      />

      <motion.span
        aria-hidden="true"
        className="absolute bottom-0 left-0 top-0 w-px origin-bottom"
        animate={{
          scaleY: active ? 1 : 0,
        }}
        transition={{
          duration: reducedMotion ? 0 : 0.55,
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