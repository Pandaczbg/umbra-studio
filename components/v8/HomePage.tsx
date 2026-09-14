import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Play } from "lucide-react";
import {
  getCharacters,
  getCharacterMedia,
  getProjects,
  getEpisodes,
} from "@/lib/content/queries";
import { getLatestPublishedContent } from "@/lib/content/latest";
import { copy } from "@/lib/site/copy";
import { routes, type Locale } from "@/lib/site/routes";
import { contentHref } from "@/lib/site/content-links";
import { UMBRA_YOUTUBE_URL } from "@/lib/seo/jsonLd";
import {
  ActionLink,
  CharacterCard,
  EmptyState,
  PageFrame,
  ProjectCard,
  SectionHeading,
} from "./Primitives";
import HeroExplorer from "./HeroExplorer";
import HeroMoon from "@/components/v10/HeroMoon";
import ContextDescription from "@/components/v10/ContextDescription";

export default function HomePage({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const projects = getProjects();
  const characters = getCharacters().filter((item) => item.profileAvailable);
  const latest = getLatestPublishedContent(2);
  const videos = getEpisodes().filter(
    (item) => item.status === "published" && item.youtubeUrl,
  );
  const featured = projects.find((item) => item.featured) ?? projects[0];
  const panels = [
    {
      label: c.latest,
      title: latest[0]?.title[locale] ?? c.noLatest,
      text: latest[0]?.shortDescription?.[locale] ?? c.noLatestText,
      href: latest[0]
        ? (contentHref(latest[0], locale) ?? routes[locale].latest)
        : routes[locale].latest,
      action: c.latest,
    },
    {
      label: c.projects,
      title: featured?.title[locale] ?? c.projects,
      text: featured?.shortDescription?.[locale] ?? c.description,
      href: featured
        ? `${routes[locale].projects}/${featured.slug}`
        : routes[locale].projects,
      action: c.explore,
    },
    {
      label: c.characters,
      title:
        locale === "sr"
          ? "Upoznaj svet kroz njegove likove"
          : "Meet the world through its characters",
      text:
        locale === "sr"
          ? "Istraži likove i njihove dosjee, od prvog projekta do svetova koji tek nastaju."
          : "Explore character dossiers, from our first project to worlds still taking shape.",
      href: routes[locale].characters,
      action: c.allCharacters,
    },
    {
      label: c.archive,
      title: c.noArchive,
      text: c.noArchiveText,
      href: routes[locale].archive,
      action: c.archive,
    },
    {
      label: c.watch,
      title:
        locale === "sr" ? "Priča dobija pokret" : "The story comes to life",
      text: locale === "sr" ? "Objavljene video-priče prati na Umbra YouTube kanalu." : "Follow Umbra’s video stories on our YouTube channel.",
      href: `${routes[locale].home}#watch`,
      action: c.watch,
    },
  ];
  return (
    <PageFrame locale={locale} home>
      <section className="v9-hero v10-hero" data-umbra-scene="hero" id="hero">
        <div className="v9-hero-image" aria-hidden="true">
          <Image src="/images/v10/hero-v9-landscape.webp" alt="" fill preload sizes="100vw" className="v8-cover" />
        </div>
        <HeroMoon />
        <div className="v8-container v9-hero-content">
          <p className="v8-eyebrow v9-hero-kicker">{c.independent}</p>
          <h1>{locale === "sr" ? <>Priče koje<br />ostavljaju<br /><em>senku</em></> : <>Stories that<br />leave a<br /><em>shadow</em></>}</h1>
          <p className="v8-lead"><ContextDescription locale={locale} /></p>
          <div className="v8-actions">
            <ActionLink href={routes[locale].projects}>{c.allProjects}</ActionLink>
            <a className="v8-text-link" href="#o-studiju">{c.studio}<ArrowDown size={17} aria-hidden="true" /></a>
          </div>
          <div className="v9-hero-foot">
            <a className="v9-scroll-cue" href="#projekti"><ArrowDown size={18} aria-hidden="true" />{locale === "sr" ? "Otkrij svetove Umbre" : "Discover Umbra’s worlds"}</a>
            {featured && <Link className="v9-featured-link" href={`${routes[locale].projects}/${featured.slug}`}><span className="v8-meta">{locale === "sr" ? "Prva serija" : "Our first series"}</span><span>{featured.title[locale]}<ArrowUpRight size={19} aria-hidden="true" /></span></Link>}
          </div>
        </div>
      </section>
      <div className="v8-container v9-explorer-wrap">
        <HeroExplorer panels={[panels[1], panels[2], panels[0], panels[3], panels[4]]} locale={locale} />
      </div>

      <section
        className="v8-section v8-container"
        id="projekti"
        data-umbra-scene="project"
      >
        <SectionHeading
          number="01"
          eyebrow={c.projects}
          title={
            locale === "sr" ? (
              <>
                Svetovi <em>u nastajanju</em>
              </>
            ) : (
              <>
                Worlds <em>in the making</em>
              </>
            )
          }
        >
          <Link className="v8-text-link" href={routes[locale].projects}>
            {c.allProjects}
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </SectionHeading>
        <div className="v8-project-grid">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              locale={locale}
              index={index}
            />
          ))}
        </div>
      </section>

      <section
        className="v8-section v8-characters-section"
        id="likovi"
        data-umbra-scene="characters"
      >
        <div className="v8-container">
          <SectionHeading
            number="02"
            eyebrow={c.characters}
            title={
              locale === "sr" ? (
                <>
                  Likovi nose <em>priču</em>
                </>
              ) : (
                <>
                  Characters carry <em>the story</em>
                </>
              )
            }
          >
            <Link href={routes[locale].characters} className="v8-text-link">
              {c.allCharacters}
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </SectionHeading>
          <div className="v8-character-grid">
            {characters.slice(0, 4).map((character) => (
              <CharacterCard
                key={character.id}
                locale={locale}
                character={character}
                project={projects.find(
                  (project) => project.id === character.projectId,
                )}
                portrait={
                  getCharacterMedia(character.id).find((item) =>
                    ["image", "poster", "concept-art", "still"].includes(
                      item.mediaType,
                    ),
                  )?.src
                }
              />
            ))}
          </div>
        </div>
      </section>

      <section
        className="v8-section v8-container"
        id="o-studiju"
        data-umbra-scene="studio"
      >
        <figure className="v9-studio-art">
          <Image src="/images/umbra-world.webp" alt={locale === "sr" ? "Simbolični filmski pejzaž Umbra Studija" : "Umbra Studio’s symbolic cinematic landscape"} fill sizes="(min-width: 1600px) 1400px, 91vw" className="v8-cover" />
        </figure>
        <div className="v8-studio-grid">
          <div>
            <p className="v8-eyebrow">
              <span>03</span> UMBRA STUDIO
            </p>
            <h2 className="v8-heading">
              {locale === "sr" ? (
                <>
                  Između svetla
                  <br />i <em>senke</em>
                </>
              ) : (
                <>
                  Between light
                  <br />
                  and <em>shadow</em>
                </>
              )}
            </h2>
            <p className="v8-lead">
              {locale === "sr"
                ? "Umbra Studio razvija serijalizovane priče uz književne izvore i AI alate za filmsko stvaralaštvo."
                : "Umbra Studio develops serialized stories using literary sources and AI filmmaking tools."}
            </p>
          </div>
          <div className="v8-studio-editorial">
            <h3 className="v8-small-heading">{locale === "sr" ? "Kako nastaju naše priče" : "How our stories take shape"}</h3>
            <p>
              {locale === "sr"
                ? "Polazimo od priče. Od lika koji ostaje u mislima, od sveta koji traži da bude viđen. Književnost, sliku i savremenu tehnologiju povezujemo u filmski izraz."
                : "We begin with a story. A character that stays with you. A world waiting to be seen. We bring literature, imagery and contemporary technology together through cinematic expression."}
            </p>
            <div className="v8-principles">
              {(locale === "sr"
                ? [
                    ["01", "Priča", "Ideja i izvorno delo daju pravac."],
                    [
                      "02",
                      "Svet",
                      "Lik, atmosfera i vizuelni jezik grade celinu.",
                    ],
                    ["03", "Film", "Kadar, zvuk i ritam daju priči život."],
                  ]
                : [
                    [
                      "01",
                      "Story",
                      "An idea and its source set the direction.",
                    ],
                    [
                      "02",
                      "World",
                      "Character, atmosphere and visual language form a whole.",
                    ],
                    [
                      "03",
                      "Film",
                      "Frame, sound and rhythm bring the story to life.",
                    ],
                  ]
              ).map(([number, title, text]) => (
                <div key={number}>
                  <span>{number}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </div>
            <Link className="v8-text-link" href={routes[locale].blog}>{locale === "sr" ? "Istraži Umbra Blog" : "Explore the Umbra Blog"}<ArrowUpRight size={18} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <section
        className="v8-section v8-watch-section"
        id="watch"
        data-umbra-scene="watch"
      >
        <div className="v8-container">
          <SectionHeading
            number="04"
            eyebrow={c.watch}
            title={
              locale === "sr" ? (
                <>
                  Priča dobija <em>pokret</em>
                </>
              ) : (
                <>
                  Stories come <em>to life</em>
                </>
              )
            }
          />
          <div className="v8-watch-grid">
            <div className="v8-watch-frame">
              <Play size={46} strokeWidth={1} aria-hidden="true" />
              <p className="v8-eyebrow">
                {videos.length ? c.published : c.production}
              </p>
              <p>
                {videos.length
                  ? locale === "sr"
                    ? "Objavljene epizode"
                    : "Published episodes"
                  : locale === "sr"
                    ? "Prvi kadar tek dolazi."
                    : "The first frame is still to come."}
              </p>
            </div>
            <div>
              <h3 className="v8-small-heading">
                {locale === "sr" ? "Umbra na YouTube-u" : "Umbra on YouTube"}
              </h3>
              <p className="v8-muted">
                {videos.length ? c.description : locale === "sr" ? "Na sajtu još nema objavljenih video-epizoda. Poseti kanal i prati nove objave Umbra Studija." : "No video episodes are published on this site yet. Visit the channel for updates from Umbra Studio."}
              </p>
              <div className="v8-actions">
                <ActionLink href={UMBRA_YOUTUBE_URL} external>
                  {locale === "sr"
                    ? "Otvori YouTube kanal"
                    : "Visit our YouTube channel"}
                </ActionLink>
              </div>
              {videos.map((episode) => (
                <a
                  className="v8-text-link"
                  key={episode.id}
                  href={episode.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {episode.title[locale]}
                  <ArrowUpRight size={18} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="v8-section v8-container" id="aktuelno">
        <SectionHeading
          number="05"
          eyebrow={c.latest}
          title={
            locale === "sr" ? (
              <>
                Iz <em>studija</em>
              </>
            ) : (
              <>
                From <em>the studio</em>
              </>
            )
          }
        />
        <div className="v8-latest-list">
          {latest.length ? (
            latest.map((item) => (
              <Link
                className="v8-result"
                key={item.id}
                href={contentHref(item, locale) ?? routes[locale].latest}
              >
                <span className="v8-meta">{c.latest}</span>
                <div>
                  <h3>{item.title[locale]}</h3>
                  <p>{item.shortDescription?.[locale]}</p>
                </div>
                <ArrowUpRight aria-hidden="true" />
              </Link>
            ))
          ) : (
            <EmptyState title={c.noLatest} description={c.noLatestText}>
              <ActionLink href={routes[locale].projects} secondary>
                {c.allProjects}
              </ActionLink>
            </EmptyState>
          )}
        </div>
      </section>
    </PageFrame>
  );
}
