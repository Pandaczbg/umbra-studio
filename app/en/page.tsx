import HomePage from "@/components/v8/HomePage";
import { pageMetadata } from "@/lib/site/metadata";
export const metadata = pageMetadata("en", "home");
export default function Page() {
  return <HomePage locale="en" />;
}
