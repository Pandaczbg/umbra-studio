import { ArchivePage } from "@/components/v8/CollectionPages";
import { pageMetadata } from "@/lib/site/metadata";
export const metadata = pageMetadata("en", "archive");
export default function Page() {
  return <ArchivePage locale="en" />;
}
