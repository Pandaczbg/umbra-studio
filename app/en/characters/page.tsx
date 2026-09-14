import { CharactersPage, type Query } from "@/components/v8/CollectionPages";
import { pageMetadata } from "@/lib/site/metadata";
export const metadata = pageMetadata("en", "characters");
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Query>;
}) {
  return <CharactersPage locale="en" query={await searchParams} />;
}
