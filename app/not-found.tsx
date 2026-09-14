"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import { usePathname } from "next/navigation";

export default function NotFound() {
  const pathname = usePathname();
  const isEnglish = pathname === "/en" || pathname.startsWith("/en/");

  const copy = isEnglish
    ? {
        eyebrow: "Umbra Archive",
        frame: "Archive / Missing frame",
        title: "This page could not be found",
        description:
          "The address you opened does not exist in the current Umbra archive or is no longer part of the studio's public space.",
        home: "Home",
        projects: "Projects",
        characters: "Characters",
        return: "Return to the story",
        footer: "Stories that leave a shadow",
        homeHref: "/en",
        projectsHref: "/en/projects",
        charactersHref: "/en/characters",
      }
    : {
        eyebrow: "Umbra Archive",
        frame: "Archive / Missing frame",
        title: "Ova stranica nije pronađena",
        description:
          "Adresa koju si otvorio ne postoji u trenutnoj Umbra arhivi ili više nije deo javno dostupnog prostora studija.",
        home: "Početna",
        projects: "Projekti",
        characters: "Likovi",
        return: "Vrati se u priču",
        footer: "Priče koje ostavljaju senku",
        homeHref: "/",
        projectsHref: "/serije",
        charactersHref: "/likovi",
      };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--umbra-bg)] text-[#F1EDE4]">
      {/* =========================================================
          ATMOSPHERE
      ========================================================= */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C7A96B]/[0.035] blur-[150px]" />

        <div className="absolute inset-0 opacity-[0.02] [background-image:linear-gradient(rgba(255,255,255,.45)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.45)_1px,transparent_1px)] [background-size:90px_90px]" />

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C7A96B]/45 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
      </div>

      {/* FRAME */}
      <div className="pointer-events-none absolute inset-5 hidden border border-white/[0.045] sm:inset-7 lg:block">
        <span className="absolute left-0 top-0 h-14 w-14 border-l border-t border-[#C7A96B]/30" />

        <span className="absolute right-0 top-0 h-14 w-14 border-r border-t border-white/[0.08]" />

        <span className="absolute bottom-0 left-0 h-14 w-14 border-b border-l border-white/[0.08]" />

        <span className="absolute bottom-0 right-0 h-14 w-14 border-b border-r border-[#C7A96B]/22" />
      </div>

      {/* =========================================================
          CONTENT
      ========================================================= */}
      <div className="relative w-full max-w-5xl px-6 py-16 text-center sm:px-10">
        {/* EYEBROW */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <span className="h-px w-10 bg-[#C7A96B]/60" />

          <span className="text-[8px] font-medium uppercase tracking-[0.42em] text-[#C7A96B]">
            {copy.eyebrow}
          </span>

          <span className="h-px w-10 bg-[#C7A96B]/60" />
        </div>

        {/* ERROR NUMBER */}
        <div
          aria-hidden="true"
          className="font-mono text-[clamp(7rem,20vw,16rem)] font-light leading-[0.78] tracking-[-0.09em] text-white/[0.055]"
        >
          404
        </div>

        {/* MESSAGE */}
        <div className="relative -mt-5 sm:-mt-8 md:-mt-12">
          <div className="mx-auto mb-5 flex items-center justify-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C7A96B] shadow-[0_0_12px_rgba(199,169,107,0.65)]" />

            <span className="text-[7px] uppercase tracking-[0.3em] text-white/18">
              {copy.frame}
            </span>
          </div>

          <h1 className="text-[clamp(2rem,4vw,4rem)] font-medium tracking-[-0.045em]">
            {copy.title}
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/30 sm:text-[15px]">
            {copy.description}
          </p>
        </div>

        {/* NAVIGATION */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={copy.homeHref}
            className="group inline-flex items-center gap-4 bg-[#C7A96B] px-6 py-4 text-[8px] font-semibold uppercase tracking-[0.25em] text-black transition-colors duration-300 hover:bg-[#DFBD78]"
          >
            <ArrowLeft
              size={13}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />

            {copy.home}
          </Link>

          <Link
            href={copy.projectsHref}
            className="group inline-flex items-center gap-4 border border-white/[0.12] px-6 py-4 text-[8px] font-semibold uppercase tracking-[0.25em] text-white/43 transition-all duration-300 hover:border-[#C7A96B]/35 hover:text-[#C7A96B]"
          >
            {copy.projects}

            <ArrowUpRight
              size={12}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>

          <Link
            href={copy.charactersHref}
            className="group inline-flex items-center gap-4 border border-white/[0.12] px-6 py-4 text-[8px] font-semibold uppercase tracking-[0.25em] text-white/43 transition-all duration-300 hover:border-[#C7A96B]/35 hover:text-[#C7A96B]"
          >
            {copy.characters}

            <ArrowUpRight
              size={12}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {/* ARCHIVE LINE */}
        <div className="mx-auto mt-14 max-w-md border-t border-white/[0.08] pt-6">
          <div className="flex items-center justify-center gap-4 text-[7px] uppercase tracking-[0.28em] text-white/13">
            <span>Stories</span>

            <span className="h-px w-5 bg-white/[0.08]" />

            <span>Characters</span>

            <span className="h-px w-5 bg-white/[0.08]" />

            <span>Worlds</span>
          </div>
        </div>

        {/* FOOT MARK */}
        <div className="mt-8 flex items-center justify-center gap-4 text-[7px] uppercase tracking-[0.3em] text-white/10">
          <span>UMBRA STUDIO</span>

          <span className="h-px w-7 bg-white/[0.08]" />

          <span>{copy.footer}</span>
        </div>

        {/* MICRO NAV */}
        <div className="mt-8">
          <Link
            href={copy.homeHref}
            className="group inline-flex items-center gap-3 text-[7px] font-semibold uppercase tracking-[0.26em] text-white/16 transition-colors duration-300 hover:text-[#C7A96B]"
          >
            {copy.return}

            <ArrowRight
              size={11}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </main>
  );
}