"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function LatestEpisodes() {
  return (
    <section
      id="episodes"
      className="relative overflow-hidden border-t border-white/10 bg-[#0A0A0A] py-24 sm:py-32"
    >
      <div className="mx-auto w-full max-w-[1500px] px-6 sm:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end"
        >
          <div>
            <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.42em] text-[#C6922A]">
              Episodes
            </p>

            <h2 className="text-4xl font-semibold leading-[0.95] tracking-[-0.05em] text-[#F5F0E1] sm:text-5xl lg:text-6xl">
              Priča uskoro
              <br />
              dobija nastavak.
            </h2>
          </div>

          <div className="max-w-xl">
            <p className="text-sm leading-7 text-white/45 sm:text-base">
              Nova izdanja i epizode Umbra Studio projekata biće objavljivane
              ovde kako produkcija bude napredovala.
            </p>

            <a
              href="https://www.youtube.com/@umbrastud"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C6922A]"
            >
              Prati Umbra Studio na YouTube-u
              <ArrowUpRight size={14} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}