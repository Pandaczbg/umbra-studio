import { getProjects } from "@/lib/content/queries";
import { ProjectDetailPage } from "@/components/v8/DetailPages";
import { detailMetadata } from "@/lib/site/metadata";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  return detailMetadata("en", "projects", (await params).slug);
}
export default async function Page({ params }: Props) {
  return <ProjectDetailPage locale="en" slug={(await params).slug} />;
}

export const dynamicParams = false;
export function generateStaticParams() { return getProjects().map((item) => ({ slug: item.slug })); }
