import { getCharacters } from "@/lib/content/queries";
import { CharacterDetailPage } from "@/components/v8/DetailPages";
import { detailMetadata } from "@/lib/site/metadata";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  return detailMetadata("sr", "characters", (await params).slug);
}
export default async function Page({ params }: Props) {
  return <CharacterDetailPage locale="sr" slug={(await params).slug} />;
}

export const dynamicParams = false;
export function generateStaticParams() { return getCharacters().filter((item) => item.profileAvailable).map((item) => ({ slug: item.slug })); }
