import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Download, Plus } from "lucide-react";
import {
  getProjectBySlug,
  getProjectContext,
  getCharacterBySlug,
  getCharacterProject,
  getCharacterMedia,
  getProjectCharacters,
  getCharacterEpisodes,
  getProjectRelationships,
  getProjectTimeline,
  getCharacterStories,
  getCharacterById,
} from "@/lib/content/queries";
import { getArchiveEntryById } from "@/lib/archive";
import { routes, type Locale } from "@/lib/site/routes";
import { copy, statusLabel } from "@/lib/site/copy";
import { projectArtwork, optimizedImage } from "@/lib/media/presentation";
import {
  createBreadcrumbJsonLd,
  serializeJsonLd,
  UMBRA_SITE_URL,
} from "@/lib/seo/jsonLd";
import {
  ActionLink,
  CharacterCard,
  PageFrame,
  PageIntro,
  SectionHeading,
} from "./Primitives";

function Breadcrumb({
  locale,
  section,
  title,
  slug,
}: {
  locale: Locale;
  section: "projects" | "characters" | "archive";
  title: string;
  slug: string;
}) {
  const c = copy[locale];
  const data = createBreadcrumbJsonLd([
    { name: "Umbra Studio", url: UMBRA_SITE_URL + routes[locale].home },
    { name: c[section], url: UMBRA_SITE_URL + routes[locale][section] },
    { name: title, url: UMBRA_SITE_URL + routes[locale][section] + "/" + slug },
  ]);
  return (
    <>
      <nav
        className="v8-breadcrumb"
        aria-label={locale === "sr" ? "Putanja stranice" : "Breadcrumb"}
      >
        <Link href={routes[locale].home}>Umbra</Link>
        <span aria-hidden="true">/</span>
        <Link href={routes[locale][section]}>{c[section]}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{title}</span>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
      />
    </>
  );
}

export function ProjectDetailPage({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string;
}) {
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  const context = getProjectContext(project.id);
  if (!context) notFound();
  const c = copy[locale];
  const art = projectArtwork(project, locale);
  const source = project.source;
  return (
    <PageFrame locale={locale}>
      <div className="v8-container v8-detail-top">
        <Breadcrumb
          locale={locale}
          section="projects"
          title={project.title[locale]}
          slug={slug}
        />
      </div>
      <section
        className="v8-container v8-detail-hero"
        data-umbra-scene="project-detail"
      >
        <div>
          <p className="v8-eyebrow">
            {project.type === "Serija" ? c.series : c.project} <span>—</span>{" "}
            {statusLabel(project.status, locale)}
          </p>
          <h1 className="v8-title">
            {project.title[locale]}
          </h1>
          <p className="v8-lead">{project.description?.[locale]}</p>
          {source?.author && (
            <p className="v8-author">
              {c.author}:{" "}
              <a
                href="https://branislavbojcic.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {source.author} ↗
              </a>
            </p>
          )}
          <div className="v8-actions">
            <ActionLink
              href={
                context.characters.length
                  ? "#project-characters"
                  : "#project-dossier"
              }
            >
              {context.characters.length ? c.characters : c.explore}
            </ActionLink>
            {source && (
              <ActionLink href="#source" secondary>
                {c.read}
              </ActionLink>
            )}
          </div>
        </div>
        <figure className={`v8-detail-art${art.isBook ? " v8-book-art" : ""}`}>
          <Image
            src={art.src}
            alt={art.alt}
            fill
            preload
            sizes="(min-width: 1024px) 45vw, 90vw"
            className={art.isBook ? "v8-contain" : "v8-cover"}
          />
          <figcaption>
            {source ? c.source : c.project} / UMBRA STUDIO
          </figcaption>
        </figure>
      </section>
      <section id="project-dossier" className="v8-container v8-facts">
        <dl>
          {[
            [
              c.format,
              project.type === "Serija"
                ? c.series
                : project.type === "Film"
                  ? c.film
                  : c.project,
            ],
            [c.status, statusLabel(project.status, locale)],
            [c.platform, project.platform],
            [c.author, source?.author],
          ]
            .filter(([, value]) => value)
            .map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
        </dl>
      </section>
      {project.slug === "mrzim-svog-brata" && (
        <div className="v8-container">
          <figure className="v9-story-landscape">
            <Image
              src="/images/v9/bosnia-1980.webp"
              alt={locale === "sr"
                ? "Ambijentalna ilustracija seoskog pejzaža inspirisana početkom romana"
                : "Atmospheric rural landscape illustration inspired by the opening of the novel"}
              fill
              sizes="(min-width: 1440px) 1320px, 100vw"
              className="v8-cover"
            />
            <figcaption>
              {locale === "sr"
                ? "Ambijentalna ilustracija inspirisana početkom romana"
                : "Atmospheric illustration inspired by the opening of the novel"}
            </figcaption>
          </figure>
        </div>
      )}
      {source && (
        <section id="source" className="v8-section v8-source-section">
          <div className="v8-container v8-source-grid">
            <div className="v8-book-editions">
              {(["sr", "en"] as const).map((language) => {
                const cover =
                  language === "sr" ? source.coverSr : source.coverEn;
                const pdf = language === "sr" ? source.pdfSr : source.pdfEn;
                return cover ? (
                  <figure key={language}>
                    <div className="v8-edition-cover">
                      <Image
                        src={optimizedImage(cover)}
                        alt={locale === "sr"
                          ? `Naslovnica knjige ${source.title} na ${language === "sr" ? "srpskom" : "engleskom"} jeziku`
                          : `${language === "sr" ? "Serbian" : "English"} cover of ${project.title.en}`}
                        fill
                        sizes="(min-width: 1024px) 220px, 40vw"
                        className="v8-contain"
                      />
                    </div>
                    <figcaption>
                      {language.toUpperCase()} / {locale === "sr" ? "Naslovnica" : "Cover"}
                    </figcaption>
                    {pdf && (
                      <a
                        className="v8-text-link"
                        download
                        href={pdf}
                        aria-label={language === "sr" ? c.downloadSr : c.downloadEn}
                      >
                        PDF <Download size={16} aria-hidden="true" />
                      </a>
                    )}
                  </figure>
                ) : null;
              })}
            </div>
            <div>
              <p className="v8-eyebrow">{c.source}</p>
              <h2 className="v8-heading">
                {c.read}
                  </h2>
              <p className="v8-lead">{source.title}</p>
              {source.author && <p className="v8-muted">{source.author}</p>}
              {source.coverEn && !source.pdfEn && (
                <p className="v8-muted">
                  {locale === "sr"
                    ? "Engleska naslovnica je prikazana uz srpsko izdanje. Engleski tekst romana nije dostupan za preuzimanje."
                    : "The English cover is shown alongside the Serbian edition. The English novel is not available to download."}
                </p>
              )}
              <div className="v8-actions">
                {source.pdfSr && (
                  <a className="v8-action" href={source.pdfSr} download>
                    {c.downloadSr}
                    <Download size={17} aria-hidden="true" />
                  </a>
                )}
                {source.pdfEn && (
                  <a
                    className="v8-action v8-action-secondary"
                    href={source.pdfEn}
                    download
                  >
                    {c.downloadEn}
                    <Download size={17} aria-hidden="true" />
                  </a>
                )}
              </div>
              {source.publicUrl && (
                <a
                  className="v8-text-link"
                  href={source.publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {c.openSource}
                  <ArrowUpRight size={17} aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </section>
      )}
      {context.characters.length > 0 && (
        <section id="project-characters" className="v8-container v8-section">
          <SectionHeading
            number="01"
            eyebrow={c.characters}
            title={
              locale === "sr" ? (
                <>
                  Lica <em>ovog sveta</em>
                </>
              ) : (
                <>
                  Faces of <em>this world</em>
                </>
              )
            }
          />
          <div className="v8-character-grid">
            {context.characters.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                locale={locale}
                portrait={
                  getCharacterMedia(character.id).find((media) =>
                    ["image", "poster", "concept-art", "still"].includes(
                      media.mediaType,
                    ),
                  )?.src
                }
              />
            ))}
          </div>
        </section>
      )}
      {context.episodes.length > 0 && (
        <section id="episodes" className="v8-container v8-section">
          <SectionHeading number="02" eyebrow={c.episodes} title={c.episodes} />
          {context.episodes.some((episode) => episode.status === "planned") && (
            <p className="v8-muted v8-section-note">
              {locale === "sr"
                ? "Planirane epizode predstavljaju privremeni okvir adaptacije. Naslovi i raspored mogu se menjati; datumi objavljivanja nisu potvrđeni."
                : "Planned episodes form a provisional adaptation outline. Titles and order may change; release dates are not confirmed."}
            </p>
          )}
          <div className="v8-episodes">
            {context.episodes.map((episode) => (
              <details
                key={episode.id}
                id={`episode-${episode.slug}`}
                className="v8-episode"
              >
                <summary>
                  <span className="v8-meta">
                    {String(episode.episodeNumber).padStart(2, "0")}
                  </span>
                  <h3>{episode.title[locale]}</h3>
                  <span className="v8-status">
                    {statusLabel(episode.status, locale)}
                  </span>
                  <Plus size={20} aria-hidden="true" />
                </summary>
                <div className="v8-episode-content">
                  <p>
                    {episode.logline?.[locale] ??
                      episode.shortDescription?.[locale] ??
                      episode.description?.[locale] ??
                      c.plannedNote}
                  </p>
                  {episode.runtime && <p>{episode.runtime}</p>}
                  {episode.status === "published" && episode.youtubeUrl && (
                    <ActionLink external href={episode.youtubeUrl}>
                      {c.watch}
                    </ActionLink>
                  )}
                </div>
              </details>
            ))}
          </div>
        </section>
      )}
      {context.stories.length > 0 && (
        <section className="v8-container v8-section">
          <SectionHeading number="03" eyebrow={c.story} title={c.story} />
          {context.stories.map((story) => (
            <article
              id={`story-${story.slug}`}
              key={story.id}
              className="v8-prose"
            >
              <h3>{story.title[locale]}</h3>
              <p>{story.description?.[locale]}</p>
            </article>
          ))}
        </section>
      )}
      <div className="v8-container v8-detail-end">
        <ActionLink href={routes[locale].projects} secondary>
          {c.allProjects}
        </ActionLink>
        <ActionLink href={routes[locale].characters} secondary>
          {c.allCharacters}
        </ActionLink>
      </div>
    </PageFrame>
  );
}

export function CharacterDetailPage({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string;
}) {
  const character = getCharacterBySlug(slug);
  if (!character || !character.profileAvailable) notFound();
  const project = getCharacterProject(character.id);
  if (!project) notFound();
  const c = copy[locale];
  const media = getCharacterMedia(character.id);
  const portrait = media.find((item) =>
    ["image", "poster", "concept-art", "still"].includes(item.mediaType),
  );
  const related = getProjectCharacters(project.id).filter(
    (item) => item.id !== character.id && item.profileAvailable,
  );
  const episodes = getCharacterEpisodes(character.id);
  const stories = getCharacterStories(character.id);
  const relationships = getProjectRelationships(project.id).filter(
    (item) => item.sourceId === character.id || item.targetId === character.id,
  );
  const timeline = getProjectTimeline(project.id).filter((item) =>
    item.characterIds?.includes(character.id),
  );
  return (
    <PageFrame locale={locale}>
      <div className="v8-container v8-detail-top">
        <Breadcrumb
          locale={locale}
          section="characters"
          title={character.title[locale]}
          slug={slug}
        />
      </div>
      <section
        className="v8-container v8-dossier"
        data-umbra-scene="character-dossier"
      >
        <figure className="v8-dossier-portrait">
          {portrait ? (
            <Image
              src={portrait.src}
              alt={portrait.alt?.[locale] ?? character.title[locale]}
              fill
              preload
              sizes="(min-width: 1024px) 36vw, 90vw"
              className="v8-cover"
            />
          ) : (
            <>
              <span className="v8-dossier-letter" aria-hidden="true">
                {character.title[locale][0]}
              </span>
              <span className="v8-character-seal" aria-hidden="true">
                UMBRA
                <br />
                STUDIO
              </span>
            </>
          )}
          <figcaption>{portrait ? c.characterNote : c.noPortrait}</figcaption>
        </figure>
        <div>
          <p className="v8-eyebrow">
            {c.characterNote} <span>/</span>{" "}
            {character.category === "MAIN" ? c.main : c.supporting}
          </p>
          <h1 className="v8-title">
            {character.title[locale]}
          </h1>
          <Link
            href={`${routes[locale].projects}/${project.slug}`}
            className="v8-text-link"
          >
            {project.title[locale]}
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
          <p className="v8-lead">
            {character.description?.[locale] ??
              character.shortDescription?.[locale]}
          </p>
          <dl className="v8-dossier-facts">
            <div>
              <dt>{c.project}</dt>
              <dd>{project.title[locale]}</dd>
            </div>
            <div>
              <dt>{locale === "sr" ? "Uloga" : "Role"}</dt>
              <dd>{character.category === "MAIN" ? c.main : c.supporting}</dd>
            </div>
            {character.gender && (
              <div>
                <dt>{locale === "sr" ? "Pol" : "Gender"}</dt>
                <dd>
                  {character.gender === "MALE"
                    ? locale === "sr"
                      ? "Muški"
                      : "Male"
                    : locale === "sr"
                      ? "Ženski"
                      : "Female"}
                </dd>
              </div>
            )}
            {character.heightCm !== null && (
              <div>
                <dt>{locale === "sr" ? "Visina" : "Height"}</dt>
                <dd>{character.heightCm} cm</dd>
              </div>
            )}
          </dl>
        </div>
      </section>
      {(episodes.length > 0 ||
        stories.length > 0 ||
        relationships.length > 0 ||
        timeline.length > 0) && (
        <section className="v8-container v8-section v8-prose">
          {episodes.length > 0 && (
            <>
              <h2>{c.episodes}</h2>
              {episodes.map((episode) => (
                <Link
                  className="v8-result"
                  href={`${routes[locale].projects}/${project.slug}#episode-${episode.slug}`}
                  key={episode.id}
                >
                  <span>{episode.title[locale]}</span>
                  <span>{statusLabel(episode.status, locale)}</span>
                  <ArrowUpRight size={18} aria-hidden="true" />
                </Link>
              ))}
            </>
          )}
          {stories.map((story) => (
            <article key={story.id}>
              <h2>{story.title[locale]}</h2>
              <p>{story.description?.[locale]}</p>
            </article>
          ))}
          {relationships.map((relationship) => {
            const other = getCharacterById(
              relationship.sourceId === character.id
                ? relationship.targetId
                : relationship.sourceId,
            );
            return other ? (
              <article key={relationship.id}>
                <h2>{other.title[locale]}</h2>
                <p>{relationship.description?.[locale]}</p>
                {other.profileAvailable && (
                  <ActionLink
                    href={`${routes[locale].characters}/${other.slug}`}
                    secondary
                  >
                    {c.dossier}
                  </ActionLink>
                )}
              </article>
            ) : null;
          })}
          {timeline.map((event) => (
            <article key={event.id}>
              <h2>{event.title[locale]}</h2>
              <p>{event.description?.[locale]}</p>
            </article>
          ))}
        </section>
      )}
      {related.length > 0 && (
        <section className="v8-container v8-section">
          <SectionHeading
            number="01"
            eyebrow={c.characters}
            title={c.sameWorld}
          />
          <div className="v8-character-grid">
            {related.map((item) => (
              <CharacterCard
                key={item.id}
                character={item}
                locale={locale}
                portrait={
                  getCharacterMedia(item.id).find((m) =>
                    ["image", "poster", "concept-art", "still"].includes(
                      m.mediaType,
                    ),
                  )?.src
                }
              />
            ))}
          </div>
        </section>
      )}
      <div className="v8-container v8-detail-end">
        <ActionLink href={routes[locale].characters} secondary>
          {c.allCharacters}
        </ActionLink>
        <ActionLink
          href={`${routes[locale].projects}/${project.slug}`}
          secondary
        >
          {c.explore}
        </ActionLink>
      </div>
    </PageFrame>
  );
}

export function ArchiveDetailPage({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string;
}) {
  const entry = getArchiveEntryById(slug);
  if (!entry) notFound();
  const c = copy[locale];
  return (
    <PageFrame locale={locale}>
      <PageIntro
        locale={locale}
        eyebrow={c.archive}
        title={entry.title[locale]}
        description={entry.description?.[locale]}
      />
      <section className="v8-container v8-collection v8-prose">
        <Breadcrumb
          locale={locale}
          section="archive"
          title={entry.title[locale]}
          slug={slug}
        />
        <ActionLink href={routes[locale].archive} secondary>
          {c.archive}
        </ActionLink>
      </section>
    </PageFrame>
  );
}
