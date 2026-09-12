"use client";

import {
  motion,
  useReducedMotion,
} from "framer-motion";

type SectionBridgeProps = {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "right";
};

const GOLD = "#c7a96b";
const GOLD_LIGHT = "#ead39a";

const EASE = [
  0.22,
  1,
  0.36,
  1,
] as const;

export default function SectionBridge({
  index,
  eyebrow,
  title,
  description,
  align = "left",
}: SectionBridgeProps) {
  const reducedMotion =
    useReducedMotion() ?? false;

  const isRight =
    align === "right";

  return (
    <section
      aria-label={title}
      className="relative overflow-hidden border-t border-white/[0.055] bg-[var(--umbra-bg)] px-6 py-24 text-[#F1EDE4] sm:px-9 sm:py-28 lg:px-12 lg:py-32 xl:px-16"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            `linear-gradient(90deg, transparent 0%, ${GOLD}24 50%, transparent 100%)`,
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div
          className={[
            "absolute top-1/2 h-[360px] w-[520px] -translate-y-1/2 rounded-full",
            isRight
              ? "left-[-18%]"
              : "right-[-18%]",
          ].join(" ")}
          style={{
            background:
              `radial-gradient(circle, ${GOLD}04 0%, transparent 70%)`,
            filter:
              "blur(75px)",
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.45) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.45) 1px, transparent 1px)",
            backgroundSize:
              "48px 48px",
            maskImage:
              "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1680px]">
        <motion.div
          initial={{
            opacity: 0,
            y:
              reducedMotion
                ? 0
                : 16,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.42,
          }}
          transition={{
            duration:
              reducedMotion
                ? 0
                : 0.72,
            ease: EASE,
          }}
          className={[
            "grid gap-8 lg:grid-cols-[0.30fr_1fr] lg:gap-20",
            isRight
              ? "lg:text-right"
              : "",
          ].join(" ")}
        >
          <div
            className={[
              "flex items-start gap-4",
              isRight
                ? "justify-start lg:justify-end lg:flex-row-reverse"
                : "",
            ].join(" ")}
          >
            <span
              aria-hidden="true"
              className="mt-[0.42em] h-px w-10 shrink-0"
              style={{
                background:
                  `linear-gradient(90deg, ${GOLD_LIGHT}, ${GOLD}, transparent)`,
              }}
            />

            <div
              className={
                isRight
                  ? "lg:text-right"
                  : ""
              }
            >
              <p
                className="font-mono text-[8px] font-medium uppercase tracking-[0.30em]"
                style={{
                  color:
                    `${GOLD_LIGHT}78`,
                }}
              >
                {eyebrow}
              </p>

              <p className="mt-3 font-mono text-[8px] uppercase tracking-[0.22em] text-white/[0.16]">
                {index}
              </p>
            </div>
          </div>

          <div
            className={
              isRight
                ? "lg:justify-self-end"
                : ""
            }
          >
            <h2 className="max-w-[980px] text-[clamp(2.5rem,5.5vw,6rem)] font-[430] leading-[0.88] tracking-[-0.065em] text-[#F1EDE4]">
              {title}
            </h2>

            {description ? (
              <p className="mt-7 max-w-[680px] text-[12px] leading-7 text-white/[0.34] sm:text-[13px]">
                {description}
              </p>
            ) : null}
          </div>
        </motion.div>

        <motion.div
          aria-hidden="true"
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
            amount: 0.35,
          }}
          transition={{
            delay:
              reducedMotion
                ? 0
                : 0.18,
            duration:
              reducedMotion
                ? 0
                : 0.9,
            ease: EASE,
          }}
          className={[
            "mt-10 h-px w-16 origin-left",
            isRight
              ? "ml-auto origin-right"
              : "",
          ].join(" ")}
          style={{
            background:
              `linear-gradient(90deg, ${GOLD_LIGHT}, transparent)`,
          }}
        />
      </div>
    </section>
  );
}
