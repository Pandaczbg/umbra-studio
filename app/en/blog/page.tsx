import { BlogPage } from "@/components/v10/BlogPages";
import { pageMetadata } from "@/lib/site/metadata";
export const metadata = pageMetadata("en", "blog", { description: "Writing about literary sources, adaptation and Umbra stories." });
export default function Page() { return <BlogPage locale="en" />; }
