import type { Locale } from "@/lib/site/routes";

export type BlogPost = {
  slug: string;
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
  author: string;
  publishedAt: string;
  status: "draft" | "published";
  image?: { src: string; alt: Record<Locale, string> };
  sections: { id: string; title: Record<Locale, string>; paragraphs: Record<Locale, string[]> }[];
  links: { label: Record<Locale, string>; href: Record<Locale, string> }[];
};

// Only approved public articles belong here. No article was supplied for V10.
const posts: readonly BlogPost[] = [];

export function getPublishedPosts(): readonly BlogPost[] {
  return posts.filter((post) => post.status === "published" && post.author.trim() && Number.isFinite(Date.parse(post.publishedAt)) && Date.parse(post.publishedAt) <= Date.now());
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return getPublishedPosts().find((post) => post.slug === slug);
}
