import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { getBlogPost, getPublishedPosts } from "@/data/blog";
import { routes, type Locale } from "@/lib/site/routes";
import { UMBRA_SITE_URL } from "@/lib/seo/jsonLd";
import { ActionLink, PageFrame, PageIntro } from "@/components/v8/Primitives";
import SaveButton from "./SaveButton";
import { ShareButton } from "./ShareButton";

export function BlogPage({ locale }: { locale: Locale }) {
  const posts = getPublishedPosts();
  const base = locale === "sr" ? "/blog" : "/en/blog";
  return <PageFrame locale={locale}>
    <PageIntro locale={locale} eyebrow="UMBRA JOURNAL" title="Blog" description={locale === "sr" ? "Prostor za tekstove o književnim izvorima, adaptaciji i nastanku Umbra priča." : "A place for writing about literary sources, adaptation and the making of Umbra stories."} />
    <section className="v8-container v8-collection">
      {posts.length ? <div className="v10-blog-grid">{posts.map((post) => <article className="v10-blog-card" key={post.slug}>
        {post.image && <div className="v10-blog-image"><Image src={post.image.src} alt={post.image.alt[locale]} fill sizes="(min-width: 900px) 40vw, 90vw" className="v8-cover" /></div>}
        <time dateTime={post.publishedAt} className="v8-meta">{new Intl.DateTimeFormat(locale === "sr" ? "sr-Latn-RS" : "en-GB", { dateStyle: "long", timeZone: "UTC" }).format(new Date(post.publishedAt))}</time>
        <h2><Link href={`${base}/${post.slug}`}>{post.title[locale]}</Link></h2><p>{post.summary[locale]}</p><p className="v8-muted">{post.author}</p>
      </article>)}</div> : <div className="v10-blog-empty">
        <div className="v10-blog-mark" aria-hidden="true"><BookOpen size={52} strokeWidth={1} /></div>
        <div><p className="v8-eyebrow">UMBRA STUDIO / JOURNAL</p><h2 className="v8-heading">{locale === "sr" ? "Priče između stranica i ekrana" : "Between page and screen"}</h2><p className="v8-lead">{locale === "sr" ? "Na Blogu još nema objavljenih članaka. U međuvremenu, istraži serije i njihove književne izvore." : "There are no published articles yet. In the meantime, explore the projects and their literary sources."}</p><ActionLink href={routes[locale].projects}>{locale === "sr" ? "Istraži projekte" : "Explore projects"}</ActionLink></div>
      </div>}
    </section>
  </PageFrame>;
}

export function BlogDetailPage({ locale, slug }: { locale: Locale; slug: string }) {
  const post = getBlogPost(slug);
  if (!post) notFound();
  const base = locale === "sr" ? "/blog" : "/en/blog";
  const href = `${base}/${post.slug}`;
  return <PageFrame locale={locale}>
    <PageIntro locale={locale} eyebrow="Blog" title={post.title[locale]} description={post.summary[locale]} />
    <article className="v8-container v8-collection v10-article">
      <p className="v8-meta">{post.author} · <time dateTime={post.publishedAt}>{new Intl.DateTimeFormat(locale === "sr" ? "sr-Latn-RS" : "en-GB", { dateStyle: "long", timeZone: "UTC" }).format(new Date(post.publishedAt))}</time></p>
      {post.image && <div className="v10-blog-image"><Image src={post.image.src} alt={post.image.alt[locale]} fill sizes="(min-width: 900px) 800px, 90vw" className="v8-cover" /></div>}
      <div className="v10-content-actions"><SaveButton locale={locale} item={{ id: `blog:${slug}`, kind: "blog", title: post.title[locale], href }} /><ShareButton locale={locale} url={new URL(href, UMBRA_SITE_URL).toString()} /></div>
      {post.sections.map((section) => <section id={section.id} key={section.id} className="v8-prose"><h2>{section.title[locale]}</h2>{section.paragraphs[locale].map((paragraph, index) => <p key={index}>{paragraph}</p>)}</section>)}
      {post.links.length > 0 && <nav aria-label={locale === "sr" ? "Povezane stranice" : "Related pages"}>{post.links.map((link) => <Link className="v8-result" key={link.href[locale]} href={link.href[locale]}>{link.label[locale]}<ArrowUpRight aria-hidden="true" /></Link>)}</nav>}
      <ActionLink href={base} secondary>{locale === "sr" ? "Svi članci" : "All articles"}</ActionLink>
    </article>
  </PageFrame>;
}
