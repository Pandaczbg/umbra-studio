import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { projects } from "@/data/projects";

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const project = projects.find(
    (item) => item.slug === slug,
  );

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* HERO */}
      <section className="relative min-h-[100svh] overflow-hidden">
        <Image
          src="/umbra-background.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover scale-[1.03] opacity-[0.54]"
        />

        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,4,4,.96)_0%,rgba(4,4,4,.72)_38%,rgba(4,4,4,.28)_72%,rgba(4,4,4,.78)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(4,4,4,.98)_0%,rgba(4,4,4,.1)_42%,rgba(4,4,4,.4)_100%)]" />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_42%,rgba(185,154,97,.07),transparent_38%)]" />

        <div className="pointer-events-none absolute inset-6 border border-white/[0.07] sm:inset-8 lg:inset-10" />

        <div className="pointer-events-none absolute left-6 top-6 h-14 w-14 border-l border-t border-[#b99a61]/45 sm:left-8 sm:top-8 lg:left-10 lg:top-10" />

        <div className="pointer-events-none absolute bottom-6 right-6 h-14 w-14 border-b border-r border-[#b99a61]/30 sm:bottom-8 sm:right-8 lg:bottom-10 lg:right-10" />

        <div className="relative mx-auto flex min-h-[100svh] max-w-[1440px] flex-col justify-between px-5 pb-12 pt-36 sm:px-8 sm:pb-16 lg:px-12 lg:pt-44">
          {/* TOP DATA */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="h-px w-9 bg-[#b99a61]/70" />

              <span className="text-[8px] uppercase tracking-[0.36em] text-white/42">
                Umbra Studio / Project
              </span>
            </div>

            <span className="font-mono text-[7px] tracking-[0.24em] text-white/[0.2]">
              PROJECT / {project.id.slice(-2)}
            </span>
          </div>

          {/* HERO CONTENT */}
          <div className="max-w-[1100px]">
            <div className="mb-6 flex flex-wrap items-center gap-4 text-[7px] uppercase tracking-[0.3em] text-white/32">
              <span>{project.type}</span>
              <span className="h-px w-6 bg-white/[0.12]" />
              <span>{project.status.replace("-", " ")}</span>
            </div>

            <h1 className="max-w-[1050px] text-[clamp(4rem,9.5vw,10rem)] font-[440] leading-[0.8] tracking-[-0.075em]">
              {project.title}
            </h1>

            <p className="mt-9 max-w-[700px] text-sm leading-7 text-white/42 sm:text-base sm:leading-8">
              {project.longDescription}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/[0.09] pt-5 text-[7px] uppercase tracking-[0.27em] text-white/28">
              <span>
                Platform · {project.platform}
              </span>

              <span>
                Status · {project.status}
              </span>

              <span>
                Format · {project.type}
              </span>
            </div>
          </div>

          {/* BOTTOM MARKER */}
          <div className="flex items-end justify-between">
            <div className="hidden sm:block">
              <div className="font-mono text-[6px] uppercase tracking-[0.24em] text-white/[0.17]">
                STORY / FRAME / MOTION
              </div>

              <div className="mt-3 h-px w-24 bg-gradient-to-r from-[#b99a61]/50 to-transparent" />
            </div>

            <div className="ml-auto flex items-center gap-3 text-[7px] uppercase tracking-[0.28em] text-white/28">
              <span className="h-5 w-px bg-white/[0.12]" />
              Scroll to enter
            </div>
          </div>
        </div>
      </section>

      {/* PROJECT DOSSIER */}
      <section className="px-5 py-28 sm:px-8 sm:py-36 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-16 lg:grid-cols-[260px_1fr]">
            <div className="lg:border-r lg:border-white/[0.07] lg:pr-10">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#b99a61]/60" />

                <span className="text-[7px] uppercase tracking-[0.3em] text-white/25">
                  01 / Project
                </span>
              </div>

              <div className="mt-8 hidden font-mono text-[8px] uppercase leading-7 tracking-[0.22em] text-white/[0.16] lg:block">
                UMBRA
                <br />
                PROJECT
                <br />
                DOSSIER
              </div>
            </div>

            <div className="max-w-[900px]">
              <h2 className="text-[clamp(2.7rem,5vw,5.8rem)] font-[430] leading-[0.9] tracking-[-0.06em]">
                Filmska
                <br />
                <span className="font-serif italic text-white/62">
                  adaptacija.
                </span>
              </h2>

              <p className="mt-9 max-w-[760px] text-[15px] leading-8 text-white/40">
                Projekat je razvijen oko karaktera, atmosfere i
                vizuelne interpretacije izvornog materijala.
                Umbra Studio pristupa priči kao filmskom svetu,
                gde narativ, kadar i pokret rade zajedno.
              </p>

              <div className="mt-12 grid border-y border-white/[0.07] sm:grid-cols-3">
                <ProjectStat
                  label="TYPE"
                  value={project.type}
                />

                <ProjectStat
                  label="PLATFORM"
                  value={project.platform}
                />

                <ProjectStat
                  label="STATUS"
                  value={project.status}
                  last
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VISUAL INTERLUDE */}
      <section className="px-5 pb-28 sm:px-8 sm:pb-36 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="relative aspect-[16/8] overflow-hidden border border-white/[0.08]">
            <Image
              src="/umbra-background.png"
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 1440px"
              className="object-cover opacity-[0.46] transition-transform duration-[1600ms] hover:scale-[1.035]"
            />

            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,.82),rgba(5,5,5,.18),rgba(5,5,5,.72))]" />

            <div className="absolute inset-5 border border-white/[0.07] sm:inset-7" />

            <div className="absolute left-7 top-7 flex items-center gap-3 sm:left-9 sm:top-9">
              <span className="h-px w-7 bg-[#b99a61]/60" />

              <span className="font-mono text-[6px] uppercase tracking-[0.28em] text-white/28">
                Visual Archive
              </span>
            </div>

            <div className="absolute bottom-7 left-7 right-7 flex items-end justify-between sm:bottom-9 sm:left-9 sm:right-9">
              <div>
                <div className="text-[8px] uppercase tracking-[0.28em] text-white/25">
                  Umbra Studio
                </div>

                <div className="mt-3 text-2xl tracking-[-0.04em] text-white/78 sm:text-4xl">
                  Priča dobija
                  <span className="font-serif italic text-white/48">
                    {" "}
                    prostor.
                  </span>
                </div>
              </div>

              <ArrowUpRight
                size={18}
                strokeWidth={1.1}
                className="text-white/35"
              />
            </div>
          </div>
        </div>
      </section>

      {/* NAVIGATION */}
      <section className="px-5 pb-28 sm:px-8 sm:pb-36 lg:px-12">
        <div className="mx-auto max-w-[1440px] border-t border-white/[0.08] pt-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <Link
              href="/serije"
              data-cursor-interactive
              className="group flex min-h-[100px] items-center justify-between border border-white/[0.08] bg-white/[0.015] px-6 transition-all duration-500 hover:border-[#b99a61]/35 hover:bg-[#b99a61]/[0.025] sm:px-8"
            >
              <div>
                <div className="text-[7px] uppercase tracking-[0.28em] text-white/22">
                  Archive
                </div>

                <div className="mt-3 text-xl tracking-[-0.04em] text-white/72">
                  Svi projekti
                </div>
              </div>

              <ArrowLeft
                size={17}
                strokeWidth={1.15}
                className="text-white/28 transition-transform duration-500 group-hover:-translate-x-1 group-hover:text-[#d6b776]"
              />
            </Link>

            <Link
              href={`/likovi`}
              data-cursor-interactive
              className="group flex min-h-[100px] items-center justify-between border border-white/[0.08] bg-white/[0.015] px-6 transition-all duration-500 hover:border-[#b99a61]/35 hover:bg-[#b99a61]/[0.025] sm:px-8"
            >
              <div>
                <div className="text-[7px] uppercase tracking-[0.28em] text-white/22">
                  Character Archive
                </div>

                <div className="mt-3 text-xl tracking-[-0.04em] text-white/72">
                  Istraži likove
                </div>
              </div>

              <ArrowUpRight
                size={17}
                strokeWidth={1.15}
                className="text-white/28 transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#d6b776]"
              />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function ProjectStat({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className={[
        "py-6",
        !last
          ? "border-b border-white/[0.07] sm:border-b-0 sm:border-r sm:border-white/[0.07]"
          : "",
      ].join(" ")}
    >
      <div className="text-[7px] uppercase tracking-[0.28em] text-white/20">
        {label}
      </div>

      <div className="mt-3 text-sm uppercase tracking-[0.08em] text-white/62">
        {value}
      </div>
    </div>
  );
}