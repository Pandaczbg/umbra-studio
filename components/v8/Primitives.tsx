import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import type { Locale } from "@/lib/site/routes";
import { routes } from "@/lib/site/routes";
import { copy, statusLabel } from "@/lib/site/copy";
import type { CharacterContent, ProjectContent } from "@/lib/content/types";
import { projectArtwork } from "@/lib/media/presentation";
import { UMBRA_YOUTUBE_URL } from "@/lib/seo/jsonLd";
import ContextDescription from "@/components/v10/ContextDescription";
import SaveButton from "@/components/v10/SaveButton";

export function ActionLink({
  href,
  children,
  secondary = false,
  external = false,
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
  external?: boolean;
}) {
  const className = `v8-action${secondary ? " v8-action-secondary" : ""}`;
  return external ? (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <ArrowUpRight size={18} aria-hidden="true" />
    </a>
  ) : (
    <Link href={href} className={className}>
      {children}
      <ArrowUpRight size={18} aria-hidden="true" />
    </Link>
  );
}

export function SectionHeading({
  number,
  eyebrow,
  title,
  children,
}: {
  number: string;
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="v8-section-heading">
      <div>
        <p className="v8-eyebrow">
          <span>{number}</span>
          {eyebrow}
        </p>
        <h2 className="v8-heading">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export function PageIntro({
  locale,
  eyebrow,
  title,
  description,
}: {
  locale: Locale;
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="v8-page-intro v8-container">
      <Link className="v8-back" href={routes[locale].home}>
        Umbra Studio <span aria-hidden="true">/</span> {eyebrow}
      </Link>
      <div className="v8-intro-grid">
        <h1 className="v8-title">
          {title}
        </h1>
        {description && <p className="v8-lead">{description}</p>}
      </div>
    </section>
  );
}

export function PageFrame({
  locale,
  children,
  home = false,
}: {
  locale: Locale;
  children: ReactNode;
  home?: boolean;
}) {
  return (
    <>
      <main
        id="main-content"
        tabIndex={-1}
        className={home ? "v8-main v8-home" : "v8-main"}
      >
        {children}
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}

export function SiteFooter({ locale }: { locale: Locale }) {
  const c = copy[locale];
  return (
    <footer id="footer" className="v8-footer" data-umbra-prefooter>
      <div className="v8-container">
        <div className="v8-footer-top">
          <p className="v8-eyebrow">
            {locale === "sr" ? "Priča se nastavlja" : "The story continues"}
          </p>
          <a className="v8-back" href="#main-content">
            {c.top}
            <ArrowDown className="v8-arrow-up" size={16} aria-hidden="true" />
          </a>
        </div>
        <div className="v8-footer-grid">
          <div>
            <p className="v8-footer-statement">
              {locale === "sr" ? (
                <>
                  Sve počinje
                  <br />
                  jednom <em>pričom</em>
                </>
              ) : (
                <>
                  It all begins
                  <br />
                  with a <em>story</em>
                </>
              )}
            </p>
            <p className="v8-muted">
              {c.independent}.<br />
              <ContextDescription locale={locale} />
            </p>
          </div>
          <nav
            aria-label={
              locale === "sr" ? "Navigacija u podnožju" : "Footer navigation"
            }
          >
            <p className="v8-eyebrow">
              {locale === "sr" ? "Istraži" : "Explore"}
            </p>
            {(
              ["projects", "characters", "latest", "archive", "blog", "search", "account"] as const
            ).map((key) => (
              <Link key={key} href={routes[locale][key]}>
                {c[key]}
              </Link>
            ))}
          </nav>
          <div>
            <p className="v8-eyebrow">
              {locale === "sr" ? "Prati studio" : "Follow the studio"}
            </p>
            <a
              className="v8-social"
              href={UMBRA_YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              YouTube <ArrowUpRight size={16} aria-hidden="true" />
            </a>
            <a
              className="v8-social"
              href="https://www.tiktok.com/@umbrastud"
              target="_blank"
              rel="noopener noreferrer"
            >
              TikTok <ArrowUpRight size={16} aria-hidden="true" />
            </a>
            <p className="v8-credit">
              <span>{locale === "sr" ? "Instagram · profil još nije dostupan" : "Instagram · profile not available yet"}</span><br /><br />
              {locale === "sr" ? "Dizajn i razvoj" : "Design & development"}
              <br />
              <a
                href="https://www.upwork.com/freelancers/~01add8bee84754c9ea?mp_source=share"
                target="_blank"
                rel="noopener noreferrer"
              >
                Aleksandar B. ↗
              </a>
            </p>
          </div>
        </div>
        <div className="v8-footer-wordmark" aria-hidden="true">
          UMBRA
        </div>
        <div className="v8-footer-bottom">
          <p>© {new Date().getFullYear()} Umbra Studio</p>
          <p>
            {locale === "sr"
              ? "Prava na izvorna dela pripadaju njihovim autorima."
              : "Underlying works remain with their respective rights holders."}
          </p>
          <span>STORY / FILM / MOTION</span>
        </div>
      </div>
    </footer>
  );
}

export function EmptyState({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="v8-empty">
      <span className="v8-empty-orbit" aria-hidden="true" />
      <div>
        <h2 className="v8-small-heading">{title}</h2>
        <p className="v8-muted">{description}</p>
        {children && <div className="v8-actions">{children}</div>}
      </div>
    </div>
  );
}

export function ProjectCard({
  project,
  locale,
  index = 0,
}: {
  project: ProjectContent;
  locale: Locale;
  index?: number;
}) {
  const art = projectArtwork(project, locale);
  const c = copy[locale];
  return (
    <article className="v8-project-card" data-project={project.slug}>
      <Link
        href={`${routes[locale].projects}/${project.slug}`}
        className="v8-project-link"
      >
        <div className={`v8-project-art${art.isBook ? " v8-book-art" : ""}`}>
          <Image
            src={art.src}
            alt={art.alt}
            fill
            sizes="(min-width: 1440px) 650px, (min-width: 768px) 46vw, 90vw"
            className={art.isBook ? "v8-contain" : "v8-cover"}
          />
          <span className="v8-art-number" aria-hidden="true">
            0{index + 1}
          </span>
          <span className="v8-card-arrow">
            <ArrowUpRight size={24} aria-hidden="true" />
          </span>
        </div>
        <div className="v8-project-meta">
          <span>
            {project.type === "Serija"
              ? c.series
              : project.type === "Film"
                ? c.film
                : c.project}
          </span>
          <span>{statusLabel(project.status, locale)}</span>
        </div>
        <h2 className="v8-card-title">{project.title[locale]}</h2>
        <p className="v8-muted">{project.shortDescription?.[locale]}</p>
      </Link>
      <SaveButton locale={locale} item={{ id: `project:${project.slug}`, kind: "project", title: project.title[locale], href: `${routes[locale].projects}/${project.slug}` }} />
    </article>
  );
}

export function CharacterCard({
  character,
  project,
  locale,
  portrait,
}: {
  character: CharacterContent;
  project?: ProjectContent;
  locale: Locale;
  portrait?: string | null;
}) {
  const c = copy[locale];
  const content = (
    <>
      <div className="v8-character-art">
        {portrait ? (
          <Image
            src={portrait}
            alt={character.title[locale]}
            fill
            sizes="(min-width: 1024px) 23vw, (min-width: 640px) 45vw, 90vw"
            className="v8-cover"
          />
        ) : (
          <>
            <span className="v8-character-monogram" aria-hidden="true">
              {character.title[locale].slice(0, 1)}
            </span>
            <span className="v8-character-seal" aria-hidden="true">
              UMBRA
              <br />
              STUDIO
            </span>
            <small>{c.noPortrait}</small>
          </>
        )}
        {character.profileAvailable && <span className="v8-card-arrow">
          <ArrowUpRight size={20} aria-hidden="true" />
        </span>}
      </div>
      <p className="v8-eyebrow">
        {character.category === "MAIN" ? c.main : c.supporting}
      </p>
      <h3 className="v8-character-name">{character.title[locale]}</h3>
      {project && <p className="v8-meta">{project.title[locale]}</p>}
    </>
  );
  return (
    <article className="v8-character-card" data-project={project?.slug}>
      {character.profileAvailable ? (
        <Link href={`${routes[locale].characters}/${character.slug}`}>
          {content}
        </Link>
      ) : (
        <div>{content}</div>
      )}
      {character.profileAvailable && <SaveButton locale={locale} item={{ id: `character:${character.slug}`, kind: "character", title: character.title[locale], href: `${routes[locale].characters}/${character.slug}` }} />}
    </article>
  );
}
