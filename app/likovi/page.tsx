import { CharactersPage, type Query } from "@/components/v8/CollectionPages";
import { pageMetadata } from "@/lib/site/metadata";
export const metadata = pageMetadata("sr", "characters");
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Query>;
}) {
  return <CharactersPage locale="sr" query={await searchParams} />;
}
