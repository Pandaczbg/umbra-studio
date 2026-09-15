"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { routes, type Locale } from "@/lib/site/routes";
import { copy } from "@/lib/site/copy";
import ContextDescription from "./ContextDescription";
import styles from "./StoryHero.module.css";

type HeroProject = { id: string; title: string; description: string; href: string };

export default function StoryHero({ locale, projects }: { locale: Locale; projects: HeroProject[] }) {
  const frame = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState(0);
  const project = projects[selected] ?? projects[0];
  const c = copy[locale];

  useEffect(() => {
    const node = frame.current;
    if (!node) return;
    const allowed = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let raf = 0;
    const reset = () => {
      cancelAnimationFrame(raf);
      node.style.removeProperty("--light-x");
      node.style.removeProperty("--light-y");
    };
    const move = (event: PointerEvent) => {
      if (!allowed.matches || event.pointerType !== "mouse") return;
      const bounds = node.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
      const y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        node.style.setProperty("--light-x", `${x * 20}px`);
        node.style.setProperty("--light-y", `${y * 12}px`);
      });
    };
    node.addEventListener("pointermove", move, { passive: true });
    node.addEventListener("pointerleave", reset);
    node.addEventListener("pointercancel", reset);
    window.addEventListener("blur", reset);
    allowed.addEventListener("change", reset);
    return () => {
      reset();
      node.removeEventListener("pointermove", move);
      node.removeEventListener("pointerleave", reset);
      node.removeEventListener("pointercancel", reset);
      window.removeEventListener("blur", reset);
      allowed.removeEventListener("change", reset);
    };
  }, []);

  return (
    <section ref={frame} className={styles.hero} id="hero" data-umbra-scene="hero" aria-labelledby="umbra-hero-title">
      <div className={styles.art} aria-hidden="true">
        <Image src="/images/v10/umbra-story-light.webp" alt="" fill preload sizes="100vw" />
      </div>
      <div className={styles.light} aria-hidden="true" />
      <div className={styles.inner}>
        <div className={styles.intro}>
          <p className={styles.eyebrow}>{c.independent}</p>
          <h1 id="umbra-hero-title" className={styles.title}>
            {locale === "sr" ? <>Priče koje<br />ostavljaju <em>senku.</em></> : <>Stories that<br />leave a <em>shadow.</em></>}
          </h1>
          <p className={styles.description}><ContextDescription locale={locale} /></p>
          <div className={styles.actions}>
            <Link className={styles.primary} href={routes[locale].projects}>{c.allProjects}<ArrowUpRight size={18} aria-hidden="true" /></Link>
            <a className={styles.secondary} href="#o-studiju">{c.studio}<ArrowDown size={17} aria-hidden="true" /></a>
          </div>
        </div>
        <div className={styles.bottom}>
          <div className={styles.caption}>
            <span>UMBRA STUDIO</span>
            <p>{locale === "sr" ? "Od stranice do kadra" : "From page to frame"}</p>
            <a href="#projekti">{locale === "sr" ? "Otkrij svetove Umbre" : "Discover Umbra’s worlds"}<ArrowDown size={16} aria-hidden="true" /></a>
          </div>
          {project && <div className={styles.projects}>
            <div className={styles.choices} role="group" aria-label={locale === "sr" ? "Izaberi projekat za pregled" : "Choose a project to preview"}>
              {projects.map((item, index) => <button key={item.id} type="button" aria-pressed={project.id === item.id} aria-controls="umbra-project-preview" onClick={() => setSelected(index)}>
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{item.title}
              </button>)}
            </div>
            <div id="umbra-project-preview" className={styles.preview}>
              <p aria-live="polite" aria-atomic="true">{project.description || project.title}</p>
              <Link href={project.href}>{locale === "sr" ? "Istraži projekat" : "Explore project"}<ArrowUpRight size={17} aria-hidden="true" /><span className={styles.srOnly}>: {project.title}</span></Link>
            </div>
          </div>}
        </div>
      </div>
    </section>
  );
}
