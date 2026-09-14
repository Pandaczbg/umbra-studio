import { getArchiveEntries } from "@/lib/archive";
import { ArchiveDetailPage } from "@/components/v8/DetailPages";
import { detailMetadata } from "@/lib/site/metadata";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  return detailMetadata("en", "archive", (await params).slug);
}
export default async function Page({ params }: Props) {
  return <ArchiveDetailPage locale="en" slug={(await params).slug} />;
}

export const dynamicParams = false;
export function generateStaticParams() { return getArchiveEntries().map((item) => ({ slug: item.id })); }
