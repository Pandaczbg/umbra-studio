import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { projects } from "@/data/projects";

export default function ProjectsPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* HERO */}
      <section className="relative px-5 pb-24 pt-36 sm:px-8 sm:pb-32 lg:px-12 lg:pb-40">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[8%] top-[15%] h-[360px] w-[360px] rounded-full bg-[#b99a61]/[0.035] blur-[120px]" />
          <div className="absolute right-[-5%] top-[28%] h-[500px] w-[500px] rounded-full bg-white/[0.018] blur-[140px]" />
          <div className="absolute inset-x-0 top-0 h-px bg-white/[0.08]" />
        </div>

        <div className="relative mx-auto max-w-[1440px]">
          <div className="flex items-center gap-3 text-[8px] uppercase tracking-[0.38em] text-white/35">
            <span className="h-px w-10 bg-[#b99a61]" />
            Umbra Studio / Projekti
          </div>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px] lg:items-end">
            <div>
              <h1 className="max-w-[1050px] text-[clamp(3.7rem,8vw,8.6rem)] font-medium leading-[0.84] tracking-[-0.075em]">
                Svetovi koje
                <br />
                <span className="font-serif italic font-normal text-white/70">
                  gradimo.
                </span>
              </h1>
            </div>

            <div className="max-w-[320px] border-l border-white/[0.12] pl-6 pb-2">
              <p className="text-[11px] uppercase leading-6 tracking-[0.18em] text-white/35">
                Originalne priče.
                <br />
                Filmski svetovi.
                <br />
                Likovi koji ostaju.
              </p>
            </div>
          </div>

          <div className="mt-16 flex items-center justify-between border-t border-white/[0.09] pt-5 text-[8px] uppercase tracking-[0.28em] text-white/30">
            <span>Projects Archive</span>
            <span>
              {String(projects.length).padStart(2, "0")} Works
            </span>
          </div>
        </div>
      </section>

      {/* PROJECT ARCHIVE */}
      <section className="px-5 pb-32 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-5 lg:grid-cols-2">
            {projects.map((project, index) => (
              <Link
                key={project.id}
                href={`/serije/${project.slug}`}
                data-cursor-interactive
                className="group relative block overflow-hidden border border-white/[0.09] bg-[#080808] outline-none transition-colors duration-500 hover:border-[#b99a61]/35 focus-visible:border-[#b99a61]/60"
              >
                <div
                  data-cursor-media
                  data-transition-image
                  className="relative aspect-[16/10] overflow-hidden"
                >
                  <Image
                    src="/umbra-background.png"
                    alt={project.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover opacity-[0.42] transition duration-[1400ms] ease-out group-hover:scale-[1.055] group-hover:opacity-[0.58]"
                  />

                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,.08)_0%,rgba(5,5,5,.18)_38%,rgba(5,5,5,.94)_100%)]" />

                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,.38)_100%)] opacity-70" />

                  <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 sm:p-7">
                    <span className="text-[8px] uppercase tracking-[0.28em] text-white/45">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="border border-white/[0.12] bg-black/20 px-3 py-1.5 text-[7px] uppercase tracking-[0.25em] text-white/45 backdrop-blur-md">
                      {project.type}
                    </span>
                  </div>

                  <div className="pointer-events-none absolute inset-5 border border-white/[0.07] transition-all duration-700 group-hover:inset-4 group-hover:border-[#b99a61]/30 sm:inset-7 sm:group-hover:inset-6" />

                  <div className="pointer-events-none absolute left-5 top-5 h-5 w-5 border-l border-t border-[#b99a61]/45 opacity-50 transition-all duration-700 group-hover:left-4 group-hover:top-4 group-hover:opacity-100 sm:left-7 sm:top-7 sm:group-hover:left-6 sm:group-hover:top-6" />

                  <div className="pointer-events-none absolute bottom-5 right-5 h-5 w-5 border-b border-r border-[#b99a61]/45 opacity-50 transition-all duration-700 group-hover:bottom-4 group-hover:right-4 group-hover:opacity-100 sm:bottom-7 sm:right-7 sm:group-hover:bottom-6 sm:group-hover:right-6" />

                  <div className="pointer-events-none absolute inset-y-0 -left-[25%] w-[22%] skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/[0.07] to-transparent opacity-0 transition-all duration-[1100ms] group-hover:left-[115%] group-hover:opacity-100" />
                </div>

                <div className="relative border-t border-white/[0.07] px-6 py-7 sm:px-8 sm:py-8">
                  <div className="flex items-start justify-between gap-8">
                    <div className="max-w-[700px]">
                      <div className="text-[clamp(2rem,4vw,4rem)] leading-[0.92] tracking-[-0.055em] text-white transition-colors duration-500 group-hover:text-[#e3d2af]">
                        {project.title}
                      </div>

                      <p className="mt-5 max-w-[600px] text-sm leading-7 text-white/40 transition-colors duration-500 group-hover:text-white/52">
                        {project.shortDescription}
                      </p>
                    </div>

                    <div className="mt-1 hidden h-11 w-11 shrink-0 items-center justify-center border border-white/[0.11] text-white/45 transition-all duration-500 group-hover:border-[#b99a61]/50 group-hover:bg-[#b99a61]/[0.08] group-hover:text-[#d4bc8b] sm:flex">
                      <ArrowUpRight
                        size={15}
                        strokeWidth={1.25}
                        className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-between border-t border-white/[0.07] pt-5">
                    <span className="text-[8px] uppercase tracking-[0.28em] text-white/25">
                      Umbra / {project.id.slice(-2)}
                    </span>

                    <span className="inline-flex items-center gap-3 text-[8px] uppercase tracking-[0.25em] text-white/45 transition-colors duration-500 group-hover:text-[#b99a61]">
                      Otvori projekat
                      <span className="text-sm leading-none">
                        →
                      </span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING FRAME */}
      <section className="px-5 pb-32 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1440px] border-t border-white/[0.08] pt-10">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-[8px] uppercase tracking-[0.32em] text-white/25">
                Umbra Studio
              </div>

              <div className="mt-4 text-2xl tracking-[-0.04em] text-white/75 sm:text-3xl">
                Priča prvo.
                <span className="font-serif italic text-white/45">
                  {" "}
                  Sve ostalo dolazi posle.
                </span>
              </div>
            </div>

            <Link
              href="/"
              data-cursor-interactive
              className="group inline-flex w-fit items-center gap-4 border-b border-white/[0.18] pb-2 text-[8px] uppercase tracking-[0.26em] text-white/45 transition-colors duration-500 hover:border-[#b99a61]/50 hover:text-[#b99a61]"
            >
              Nazad na početnu
              <span className="transition-transform duration-500 group-hover:-translate-x-1">
                ←
              </span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}