import { searchPublicPages } from "@/lib/search";
export function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? "";
  if (q.length > 160) return Response.json({ error: "query_too_long" }, { status: 400 });
  return Response.json({ results: searchPublicPages(q, url.searchParams.get("locale") === "en" ? "en" : "sr").slice(0, 16) }, { headers: { "Cache-Control": "public, max-age=60" } });
}
