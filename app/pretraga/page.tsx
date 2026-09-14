import { SearchPage, type Query } from "@/components/v8/CollectionPages";
import { pageMetadata } from "@/lib/site/metadata";
export const metadata = pageMetadata("sr", "search", { noIndex: true });
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Query>;
}) {
  return <SearchPage locale="sr" query={await searchParams} />;
}
