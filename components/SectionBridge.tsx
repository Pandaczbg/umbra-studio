"use client";

import { motion, useReducedMotion } from "framer-motion";

type SectionBridgeProps = {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "right";
};

export default function SectionBridge({
  index,
  eyebrow,
  title,
  description,
  align = "left",
}: SectionBridgeProps) {
  const reducedMotion = useReducedMotion();

  return (
    <section
      aria-label={title}
      className="relative overflow-hidden border-t border-white/[0.06] bg-[#030303] px-6 py-24 text-[#F1EDE4] sm:px-10 sm:py-28 lg:px-16 lg:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
      />

      <div className="mx-auto max-w-[1500px]">
        <motion.div
          initial={{
            opacity: 0,
            y: reducedMotion ? 0 : 18,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: {
              duration: reducedMotion ? 0 : 0.7,
              ease: [0.22, 1, 0.36, 1],
            },
          }}
          viewport={{
            once: true,
            amount: 0.55,
          }}
          className={`grid gap-8 lg:grid-cols-[0.32fr_1fr] lg:gap-20 ${
            align === "right" ? "lg:text-right" : ""
          }`}
        >
          <div
            className={`flex items-start gap-4 ${
              align === "right"
                ? "justify-end lg:flex-row-reverse"
                : ""
            }`}
          >
            <span className="mt-[0.16em] h-px w-8 shrink-0 bg-[#C69A45]" />

            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-white/30">
                {eyebrow}
              </p>

              <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white/16">
                {index}
              </p>
            </div>
          </div>

          <div>
            <h2 className="max-w-4xl text-[clamp(2.4rem,5.5vw,6rem)] font-[430] leading-[0.9] tracking-[-0.06em] text-[#F1EDE4]">
              {title}
            </h2>

            {description ? (
              <p className="mt-7 max-w-2xl text-sm leading-7 text-white/35">
                {description}
              </p>
            ) : null}
          </div>
        </motion.div>
      </div>
    </section>
  );
}