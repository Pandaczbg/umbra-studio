"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Play } from "lucide-react";

export default function FeaturedSeries() {
  return (
    <section
      id="series"
      className="relative overflow-hidden border-t border-white/10 bg-[#0A0A0A] py-28 sm:py-36"
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 sm:px-10 lg:px-16">

        {/* SECTION HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="mb-14 flex flex-col gap-4 sm:mb-20 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.4em] text-[#C6922A]">
              Featured Series
            </p>

            <h2 className="max-w-2xl text-4xl font-semibold tracking-[-0.04em] text-[#F5F0E1] sm:text-5xl lg:text-6xl">
              Priče koje
              <br />
              ostaju.
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-7 text-white/45">
            Istraži svet Umbra Studija kroz serije, likove i priče koje
            gradimo jednu po jednu.
          </p>
        </motion.div>

        {/* FEATURED PROJECT */}
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">

          {/* POSTER */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1 }}
            className="group relative"
          >
            <div className="relative aspect-[16/10] overflow-hidden border border-white/10 bg-[#15130F]">

              {/* CINEMATIC LIGHT */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_35%,rgba(198,146,42,0.24),transparent_20%),radial-gradient(circle_at_35%_70%,rgba(255,255,255,0.06),transparent_25%)]" />

              {/* DARK VIGNETTE */}
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.9),rgba(0,0,0,0.35),rgba(0,0,0,0.75))]" />

              {/* DECORATIVE FRAME */}
              <div className="absolute inset-5 border border-[#C6922A]/20 sm:inset-8" />

              {/* TITLE INSIDE VISUAL */}
              <div className="absolute bottom-7 left-7 right-7 sm:bottom-10 sm:left-10">
                <p className="text-[9px] uppercase tracking-[0.45em] text-[#C6922A]">
                  Umbra Studio Original
                </p>

                <h3 className="mt-3 max-w-xl text-3xl font-semibold uppercase leading-[0.95] tracking-[-0.03em] text-[#F5F0E1] sm:text-5xl">
                  Mrzim svog
                  <br />
                  brata
                </h3>
              </div>

              {/* PLAY BUTTON */}
              <div className="absolute right-6 top-6 sm:right-8 sm:top-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition-all duration-300 group-hover:border-[#C6922A]/60 group-hover:bg-[#C6922A] group-hover:text-black">
                  <Play size={15} fill="currentColor" />
                </div>
              </div>
            </div>

            {/* CORNER DETAILS */}
            <div className="absolute -bottom-4 -left-4 h-16 w-16 border-b border-l border-[#C6922A]/30" />
            <div className="absolute -right-4 -top-4 h-16 w-16 border-r border-t border-[#C6922A]/30" />
          </motion.div>

          {/* CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="max-w-xl"
          >
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#C6922A]">
              001 / Current Production
            </p>

            <h3 className="mt-5 text-4xl font-semibold uppercase leading-none tracking-[-0.04em] text-[#F5F0E1] sm:text-6xl">
              Mrzim svog
              <br />
              brata
            </h3>

            <div className="mt-8 h-px w-20 bg-[#C6922A]" />

            <p className="mt-8 text-base leading-8 text-white/55">
              Prva serija Umbra Studija. Priča izgrađena kroz likove,
              odnose i događaje koji će postepeno otkrivati svoj svet.
            </p>

            {/* META */}
            <div className="mt-10 grid grid-cols-2 border-y border-white/10 py-6 sm:grid-cols-3">
              <div>
                <p className="text-[9px] uppercase tracking-[0.25em] text-white/30">
                  Format
                </p>
                <p className="mt-2 text-sm text-white/75">
                  Serija
                </p>
              </div>

              <div>
                <p className="text-[9px] uppercase tracking-[0.25em] text-white/30">
                  Status
                </p>
                <p className="mt-2 text-sm text-white/75">
                  U produkciji
                </p>
              </div>

              <div className="mt-6 sm:mt-0">
                <p className="text-[9px] uppercase tracking-[0.25em] text-white/30">
                  Platforma
                </p>
                <p className="mt-2 text-sm text-white/75">
                  YouTube
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="#series-detail"
                className="group flex items-center gap-3 rounded-full bg-[#C6922A] px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-black transition-all duration-300 hover:bg-[#D9AB52]"
              >
                Pogledaj seriju

                <ArrowUpRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>

              <a
                href="https://www.youtube.com/@umbrastud"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:border-[#C6922A]/60 hover:bg-white/10"
              >
                Gledaj epizode

                <ArrowUpRight size={15} />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}