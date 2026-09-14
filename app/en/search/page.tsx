import { SearchPage, type Query } from "@/components/v8/CollectionPages";
import { pageMetadata } from "@/lib/site/metadata";
export const metadata = pageMetadata("en", "search", { noIndex: true });
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Query>;
}) {
  return <SearchPage locale="en" query={await searchParams} />;
}
