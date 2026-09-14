import { ProjectsPage, type Query } from "@/components/v8/CollectionPages";
import { pageMetadata } from "@/lib/site/metadata";
export const metadata = pageMetadata("en", "projects");
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Query>;
}) {
  return <ProjectsPage locale="en" query={await searchParams} />;
}
