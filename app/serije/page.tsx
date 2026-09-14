import { ProjectsPage, type Query } from "@/components/v8/CollectionPages";
import { pageMetadata } from "@/lib/site/metadata";
export const metadata = pageMetadata("sr", "projects");
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Query>;
}) {
  return <ProjectsPage locale="sr" query={await searchParams} />;
}
