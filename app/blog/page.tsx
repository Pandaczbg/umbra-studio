import { BlogPage } from "@/components/v10/BlogPages";
import { pageMetadata } from "@/lib/site/metadata";
export const metadata = pageMetadata("sr", "blog", { description: "Tekstovi o književnim izvorima, adaptaciji i Umbra pričama." });
export default function Page() { return <BlogPage locale="sr" />; }
