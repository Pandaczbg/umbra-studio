import { LatestPage } from "@/components/v8/CollectionPages";
import { pageMetadata } from "@/lib/site/metadata";
export const metadata = pageMetadata("en", "latest");
export default function Page() {
  return <LatestPage locale="en" />;
}
