import { BlogDetailPage } from "@/components/v10/BlogPages";
import { getBlogPost, getPublishedPosts } from "@/data/blog";
import { pageMetadata } from "@/lib/site/metadata";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  return post ? pageMetadata("sr", "blog", { slug, title: `${post.title.sr} — Umbra Studio`, description: post.summary.sr }) : { title: "404 — Umbra Studio", robots: { index: false, follow: true } };
}
export default async function Page({ params }: Props) { return <BlogDetailPage locale="sr" slug={(await params).slug} />; }

export const dynamicParams = false;
export function generateStaticParams() { return getPublishedPosts().map((post) => ({ slug: post.slug })); }
