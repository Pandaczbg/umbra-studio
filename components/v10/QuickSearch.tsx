"use client";
import Link from "next/link";
import { Search, X, ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { localeFor, routes } from "@/lib/site/routes";
import type { PublicPageResult } from "@/lib/search";

export default function QuickSearch() {
  const locale = localeFor(usePathname());
  const sr = locale === "sr";
  const modal = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PublicPageResult[]>([]);
  const [state, setState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const show = () => { opener.current = document.activeElement as HTMLElement; modal.current?.showModal(); setOpen(true); input.current?.focus(); };
    const key = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k" && !document.querySelector("dialog[open]")) { e.preventDefault(); show(); } };
    window.addEventListener("umbra:open-search", show);
    window.addEventListener("keydown", key);
    return () => { window.removeEventListener("umbra:open-search", show); window.removeEventListener("keydown", key); };
  }, []);
  useEffect(() => {
    if (!open) return;
    const old = document.body.style.overflow; document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = old; };
  }, [open]);
  useEffect(() => {
    if (!open || !query.trim()) return;
    const abort = new AbortController();
    const timer = setTimeout(async () => {
      setState("loading");
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&locale=${locale}`, { signal: abort.signal });
        if (!response.ok) throw new Error();
        const data = await response.json();
        if (!abort.signal.aborted) { setResults(data.results); setState("ready"); }
      } catch { if (!abort.signal.aborted) setState("error"); }
      finally { clearTimeout(timeout); }
    }, 160);
    const timeout = setTimeout(() => { if (!abort.signal.aborted) { abort.abort(); setState("error"); } }, 6000);
    return () => { clearTimeout(timer); clearTimeout(timeout); abort.abort(); };
  }, [query, locale, open, retry]);
  const labels = sr ? { project: "Serije", character: "Likovi", source: "Književni izvori", blog: "Blog", episode: "Epizode" } : { project: "Series", character: "Characters", source: "Literary sources", blog: "Blog", episode: "Episodes" };
  return <dialog ref={modal} className="v10-search-dialog" aria-labelledby="quick-search-title" onClose={() => { setOpen(false); opener.current?.focus(); }} onClick={(e) => { if (e.target === e.currentTarget) modal.current?.close(); }}>
    <div className="v10-search-inner"><div className="v10-panel-top"><h2 id="quick-search-title">{sr ? "Istraži Umbru" : "Explore Umbra"}</h2><button className="v8-icon-button" onClick={() => modal.current?.close()} aria-label={sr ? "Zatvori pretragu" : "Close search"}><X aria-hidden="true" /></button></div>
    <form action={routes[locale].search}><label htmlFor="quick-query">{sr ? "Serija, lik, izvor ili članak" : "Series, character, source or article"}</label><div className="v10-search-input"><Search aria-hidden="true" size={20} /><input id="quick-query" name="q" ref={input} value={query} maxLength={160} autoComplete="off" onChange={(e) => { setQuery(e.target.value); setState("idle"); setResults([]); }} /><button type="submit" className="v8-icon-button" aria-label={sr ? "Otvori sve rezultate" : "Open all results"} onClick={() => modal.current?.close()}><ArrowUpRight aria-hidden="true" /></button></div></form>
    <p role="status" className="v8-muted">{!query.trim() ? (sr ? "Pronađi svoju sledeću priču" : "Find your next story") : state === "loading" || state === "idle" ? (sr ? "Pretražujem…" : "Searching…") : state === "error" ? (sr ? "Pretraga nije dostupna. Pokušaj ponovo." : "Search is unavailable. Try again.") : `${sr ? "Pronađeno" : "Results"}: ${results.length}`}</p>
    {state === "error" && <button className="v8-action" onClick={() => setRetry(retry + 1)}>{sr ? "Pokušaj ponovo" : "Try again"}</button>}
    <div className="v10-search-results">{!query.trim() ? <div className="v10-search-suggestions">{(["projects", "characters", "blog"] as const).map((key) => <Link key={key} href={routes[locale][key]} onClick={() => modal.current?.close()}>{key === "projects" ? labels.project : key === "characters" ? labels.character : "Blog"}<ArrowUpRight size={18} aria-hidden="true" /></Link>)}</div> : Object.entries(labels).map(([kind,label]) => {
      const group = results.filter((r) => r.kind === kind);
      return group.length > 0 && <section key={kind}><h3 className="v8-eyebrow">{label}</h3>{group.map((r) => <Link href={r.href} key={r.id} onClick={() => modal.current?.close()} className="v10-search-result"><span>{r.title}<small>{r.description}</small></span><ArrowUpRight size={18} aria-hidden="true" /></Link>)}</section>;
    })}</div></div>
  </dialog>;
}
