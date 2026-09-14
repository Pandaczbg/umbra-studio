import { normalizeSearch } from "@/lib/search/normalize";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import {
  getProjects,
  getCharacters,
  getCharacterMedia,
} from "@/lib/content/queries";
import { getArchiveEntries } from "@/lib/archive";
import { searchPublicPages } from "@/lib/search";
import { getLatestPublishedContent } from "@/lib/content/latest";
import { contentHref } from "@/lib/site/content-links";
import { copy } from "@/lib/site/copy";
import { routes, type Locale } from "@/lib/site/routes";
import {
  ActionLink,
  CharacterCard,
  EmptyState,
  PageFrame,
  PageIntro,
  ProjectCard,
} from "./Primitives";

export type Query = Record<string, string | string[] | undefined>;
export function queryValue(query: Query, key: string): string {
  const value = query[key];
  return typeof value === "string" ? value.slice(0, 200).trim() : "";
}

export function ProjectsPage({
  locale,
  query = {},
}: {
  locale: Locale;
  query?: Query;
}) {
  const c = copy[locale];
  const projects = getProjects();
  const legacy = queryValue(query, "vrsta");
  const format = queryValue(query, "format");
  const selected =
    queryValue(query, "type") ||
    (legacy === "ekranizacije"
      ? "adaptation"
      : legacy === "originalne"
        ? "original"
        : format === "serije"
          ? "series"
          : "all");
  const filter = ["all", "adaptation", "original", "series"].includes(selected)
    ? selected
    : "all";
  const options = [
    ["all", c.allProjects],
    ["adaptation", locale === "sr" ? "Ekranizacije" : "Adaptations"],
    ["original", locale === "sr" ? "Originalni projekti" : "Original projects"],
    ["series", locale === "sr" ? "Serije" : "Series"],
  ];
  const visible = projects.filter(
    (project) =>
      filter === "all" ||
      (filter === "adaptation" && Boolean(project.source)) ||
      (filter === "original" && !project.source) ||
      (filter === "series" && project.type === "Serija"),
  );
  return (
    <PageFrame locale={locale}>
      <PageIntro
        locale={locale}
        eyebrow={c.projects}
        title={c.projects}
        description={c.description}
      />
      <section
        className="v8-container v8-collection"
        data-umbra-scene="projects-archive"
      >
        <nav
          className="v8-filter-links"
          aria-label={
            locale === "sr" ? "Kategorije projekata" : "Project categories"
          }
        >
          {options.map(([value, label]) => (
            <Link
              key={value}
              href={`${routes[locale].projects}${value === "all" ? "" : `?type=${value}`}`}
              aria-current={value === filter ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        <p className="v8-result-count">
          {c.resultCount}: {visible.length}
        </p>
        <div className="v8-project-grid">
          {visible.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              locale={locale}
              index={index}
            />
          ))}
        </div>
        {!visible.length && (
          <EmptyState
            title={c.noResults}
            description={locale === "sr"
              ? "U ovoj kategoriji trenutno nema projekata. Pogledaj sve projekte."
              : "There are currently no projects in this category. Browse all projects."}
          >
            <ActionLink href={routes[locale].projects}>{c.reset}</ActionLink>
          </EmptyState>
        )}
      </section>
    </PageFrame>
  );
}

export function CharactersPage({
  locale,
  query = {},
}: {
  locale: Locale;
  query?: Query;
}) {
  const c = copy[locale];
  const projects = getProjects();
  const q = queryValue(query, "q");
  const requestedProject = queryValue(query, "project");
  const project = projects.find(
    (item) => item.id === requestedProject || item.slug === requestedProject,
  )?.id ?? "";
  const requestedRole = queryValue(query, "role");
  const role = ["MAIN", "SUPPORTING"].includes(requestedRole)
    ? requestedRole
    : "";
  const characters = getCharacters().filter(
    (item) =>
      (!q ||
        normalizeSearch(item.title[locale]).includes(normalizeSearch(q))) &&
      (!project ||
        item.projectId === project ||
        projects.find((p) => p.id === item.projectId)?.slug === project) &&
      (!role || item.category === role),
  );
  return (
    <PageFrame locale={locale}>
      <PageIntro
        locale={locale}
        eyebrow={c.characters}
        title={c.characters}
        description={
          locale === "sr"
            ? "Upoznaj likove Umbra serija i njihove veze sa pričama. Pretraži ih po imenu, projektu ili ulozi."
            : "Explore the characters of Umbra series and their place in each story. Search by name, project or role."
        }
      />
      <section
        className="v8-container v8-collection"
        data-umbra-scene="characters-archive"
      >
        <form
          key={[q, project, role].join("|")}
          className="v8-filter-form"
          action={routes[locale].characters}
          method="get"
        >
          <div className="v8-field">
            <label htmlFor="character-query">{c.search}</label>
            <input
              id="character-query"
              type="search"
              name="q"
              defaultValue={q}
              placeholder={c.characters}
              maxLength={200}
            />
          </div>
          <div className="v8-field">
            <label htmlFor="character-project">{c.projectFilter}</label>
            <select
              id="character-project"
              name="project"
              defaultValue={project}
            >
              <option value="">{c.all}</option>
              {projects.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title[locale]}
                </option>
              ))}
            </select>
          </div>
          <div className="v8-field">
            <label htmlFor="character-role">{c.roleFilter}</label>
            <select id="character-role" name="role" defaultValue={role}>
              <option value="">{c.all}</option>
              <option value="MAIN">{c.main}</option>
              <option value="SUPPORTING">{c.supporting}</option>
            </select>
          </div>
          <button className="v8-action" type="submit">
            {c.search}
            <Search size={17} aria-hidden="true" />
          </button>
        </form>
        <div className="v8-results-top">
          <p className="v8-result-count">
            {c.resultCount}: {characters.length}
          </p>
          {(q || project || role) && (
            <Link className="v8-text-link" href={routes[locale].characters}>
              {c.reset}
            </Link>
          )}
        </div>
        <div className="v8-character-grid">
          {characters.map((item) => (
            <CharacterCard
              key={item.id}
              character={item}
              locale={locale}
              project={projects.find((p) => p.id === item.projectId)}
              portrait={
                getCharacterMedia(item.id).find((media) =>
                  ["image", "poster", "concept-art", "still"].includes(
                    media.mediaType,
                  ),
                )?.src
              }
            />
          ))}
        </div>
        {!characters.length && (
          <EmptyState
            title={c.noResults}
            description={
              locale === "sr"
                ? "Pokušaj sa drugim imenom ili ukloni filtere."
                : "Try another name or clear the filters."
            }
          >
            <ActionLink href={routes[locale].characters}>{c.reset}</ActionLink>
          </EmptyState>
        )}
      </section>
    </PageFrame>
  );
}

export function LatestPage({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const latest = getLatestPublishedContent(12);
  return (
    <PageFrame locale={locale}>
      <PageIntro
        locale={locale}
        eyebrow={c.latest}
        title={c.latest}
        description={
          locale === "sr"
            ? "Objave Umbra Studija, od najnovije ka starijim."
            : "Umbra Studio updates, with the newest first."
        }
      />
      <section className="v8-container v8-collection">
        {latest.length ? (
          latest.map((item) => (
            <Link
              className="v8-result"
              key={item.id}
              href={contentHref(item, locale) ?? routes[locale].projects}
            >
              <time className="v8-meta" dateTime={item.publishedAt}>
                {new Intl.DateTimeFormat(
                  locale === "sr" ? "sr-Latn-RS" : "en-GB",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    timeZone: "UTC",
                  },
                ).format(new Date(item.publishedAt!))}
              </time>
              <div>
                <h2>{item.title[locale]}</h2>
                <p>{item.shortDescription?.[locale]}</p>
              </div>
              <ArrowUpRight aria-hidden="true" />
            </Link>
          ))
        ) : (
          <EmptyState title={c.noLatest} description={c.noLatestText}>
            <ActionLink href={routes[locale].projects}>
              {c.allProjects}
            </ActionLink>
          </EmptyState>
        )}
      </section>
    </PageFrame>
  );
}

export function ArchivePage({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const entries = getArchiveEntries();
  return (
    <PageFrame locale={locale}>
      <PageIntro
        locale={locale}
        eyebrow={c.archive}
        title={c.archive}
        description={
          locale === "sr"
            ? "Pregled objavljenih materijala povezanih sa Umbra projektima."
            : "Browse published materials connected to Umbra projects."
        }
      />
      <section className="v8-container v8-collection">
        {entries.length ? (
          entries.map((entry) => (
            <Link
              key={entry.id}
              className="v8-result"
              href={`${routes[locale].archive}/${encodeURIComponent(entry.id)}`}
            >
              <span className="v8-meta">{c.archive}</span>
              <div>
                <h2>{entry.title[locale]}</h2>
                <p>{entry.description?.[locale]}</p>
              </div>
              <ArrowUpRight aria-hidden="true" />
            </Link>
          ))
        ) : (
          <EmptyState title={c.noArchive} description={c.noArchiveText}>
            <ActionLink href={routes[locale].projects} secondary>
              {c.allProjects}
            </ActionLink>
          </EmptyState>
        )}
      </section>
    </PageFrame>
  );
}

export function SearchPage({
  locale,
  query,
}: {
  locale: Locale;
  query: Query;
}) {
  const c = copy[locale];
  const q = queryValue(query, "q");
  const type = queryValue(query, "type");
  const types = ["project", "character", "source", "blog", "episode"] as const;
  const selected = types.find((t) => t === type);
  const results = q ? searchPublicPages(q, locale, selected) : [];
  const labels = { project: c.projects, character: c.characters, source: c.source, blog: "Blog", episode: c.episodes };
  return (
    <PageFrame locale={locale}>
      <PageIntro
        locale={locale}
        eyebrow={c.search}
        title={c.search}
        description={c.query}
      />
      <section className="v8-container v8-collection">
        <form
          key={[q, type].join("|")}
          className="v8-search-form"
          action={routes[locale].search}
          method="get"
        >
          <label className="v8-sr-only" htmlFor="search-query">
            {c.query}
          </label>
          <input
            id="search-query"
            name="q"
            type="search"
            maxLength={200}
            defaultValue={q}
            placeholder={c.placeholder}
          />
          <label className="v8-sr-only" htmlFor="search-type">
            {c.format}
          </label>
          <select id="search-type" name="type" defaultValue={selected ?? ""}>
            <option value="">{c.all}</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {labels[t]}
              </option>
            ))}
          </select>
          <button className="v8-action" type="submit">
            <Search size={18} aria-hidden="true" />
            {c.search}
          </button>
        </form>
        {!q ? (
          <div className="v8-search-suggestions">
            <p className="v8-eyebrow">
              {locale === "sr" ? "Počni odavde" : "Start here"}
            </p>
            {getProjects().map((p) => (
              <Link
                key={p.id}
                href={`${routes[locale].search}?q=${encodeURIComponent(p.title[locale])}`}
              >
                {p.title[locale]}
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            ))}
          </div>
        ) : (
          <>
            <p className="v8-result-count">
              {c.resultCount}: {results.length} · {locale === "sr" ? `„${q}“` : `“${q}”`}
            </p>
            {types.map((kind) => {
              const group = results.filter((item) => item.kind === kind);
              return group.length > 0 ? <section className="v10-search-group" key={kind} aria-labelledby={`results-${kind}`}>
                <h2 id={`results-${kind}`} className="v8-eyebrow">{labels[kind]} · {group.length}</h2>
                {group.map((item) => <Link className="v8-result" key={item.id} href={item.href}>
                  <span className="v8-meta">{labels[kind]}</span>
                  <div><h3>{item.title}</h3><p>{item.description}</p></div>
                  <ArrowUpRight aria-hidden="true" />
                </Link>)}
              </section> : null;
            })}
            {!results.length && (
              <EmptyState
                title={c.noResults}
                description={
                  locale === "sr"
                    ? "Proveri naziv ili pokušaj sa kraćim pojmom."
                    : "Check the name or try a shorter search term."
                }
              >
                <ActionLink href={routes[locale].search} secondary>
                  {c.reset}
                </ActionLink>
              </EmptyState>
            )}
          </>
        )}
      </section>
    </PageFrame>
  );
}
