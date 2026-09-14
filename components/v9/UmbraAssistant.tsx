"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Send, X } from "lucide-react";
import "./assistant.css";

type Reply = { mode: "local" | "ai"; answer: string; sources: { title: string; href: string }[]; notice?: string };
const copy = {
  sr: { open: "Umbra vodič", title: "Istraži Umbra svetove", close: "Zatvori vodič", intro: "Pronađi seriju, lik ili sledeću stranicu — bez otkrivanja završetaka.", local: "Pretraga javnog sadržaja · AI nije aktivan", available: "Lokalna pretraga · AI opcija je dostupna", ai: "AI izbor javnog odgovora · može da pogreši", privacy: "Ne unosi lične podatke. Poruke se ne čuvaju u istoriji ovog vodiča.", consent: "Koristi AI: moje pitanje se šalje OpenAI servisu", consentNote: "AI bira među odobrenim odgovorima. Pravila čuvanja podataka provajdera mogu da važe.", input: "Šta želiš da istražiš?", send: "Pošalji pitanje", loading: "Tražim u javnom sadržaju…", error: "Vodič trenutno nije dostupan. Pokušaj ponovo ili koristi pretragu sajta.", rate: "Previše zahteva u kratkom periodu. Pokušaj ponovo za minut.", fallback: "AI trenutno nije dostupan. Prikazan je rezultat lokalne pretrage.", source: "Povezane stranice", search: "Pretraga sajta", clear: "Obriši razgovor", you: "Tvoje pitanje", result: "Odgovor", suggestions: ["Koje serije mogu da istražim?", "MRZIM SVOG BRATA bez spojlera", "Gde je stranica o Josifu?"] },
  en: { open: "Umbra guide", title: "Explore Umbra worlds", close: "Close guide", intro: "Find a series, a character or your next page — without revealing endings.", local: "Public content search · AI is not active", available: "Local search · AI option is available", ai: "AI-selected public answer · may be wrong", privacy: "Do not enter personal information. Messages are not saved to this guide’s history.", consent: "Use AI: send my question to OpenAI", consentNote: "AI selects from approved answers. The provider’s data retention policies may apply.", input: "What would you like to explore?", send: "Send question", loading: "Searching public content…", error: "The guide is currently unavailable. Try again or use site search.", rate: "Too many requests in a short period. Try again in a minute.", fallback: "AI is currently unavailable. Showing a local search result.", source: "Related pages", search: "Site search", clear: "Clear conversation", you: "Your question", result: "Answer", suggestions: ["Which projects can I explore?", "MRZIM SVOG BRATA without spoilers", "Where is Josif’s page?"] },
};

export default function UmbraAssistant() {
  const pathname = usePathname();
  const locale = pathname === "/en" || pathname.startsWith("/en/") ? "en" : "sr";
  // A locale change remounts the dialog, clears transient state and aborts requests.
  return <Guide key={locale} locale={locale} />;
}

function Guide({ locale }: { locale: "sr" | "en" }) {
  const c = copy[locale];
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const controller = useRef<AbortController | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [available, setAvailable] = useState(false);
  const [useAI, setUseAI] = useState(false);
  const [message, setMessage] = useState("");
  const [question, setQuestion] = useState("");
  const [reply, setReply] = useState<Reply | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => () => controller.current?.abort(), []);
  useEffect(() => {
    const show = () => {
      if (!dialog.current || dialog.current.open) return;
      opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      dialog.current.showModal(); setOpen(true);
    };
    window.addEventListener("umbra:open-guide", show);
    return () => window.removeEventListener("umbra:open-guide", show);
  }, []);
  useEffect(() => {
    if (!open) return;
    const abort = new AbortController();
    fetch("/api/assistant", { signal: abort.signal, cache: "no-store" })
      .then(async (response) => response.ok ? response.json() : null)
      .then((data) => { if (!abort.signal.aborted) setAvailable(data?.aiAvailable === true); })
      .catch(() => { if (!abort.signal.aborted) setAvailable(false); });
    return () => abort.abort();
  }, [open]);
  useEffect(() => {
    if (!open) return;
    // VisualViewport tracks the mobile keyboard without fixed screen assumptions.
    const viewport = window.visualViewport;
    const resize = () => {
      if (dialog.current) {
        dialog.current.style.setProperty("--guide-height", `${viewport?.height ?? window.innerHeight}px`);
        dialog.current.style.setProperty("--guide-top", `${viewport?.offsetTop ?? 0}px`);
      }
    };
    resize(); viewport?.addEventListener("resize", resize); viewport?.addEventListener("scroll", resize);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { viewport?.removeEventListener("resize", resize); viewport?.removeEventListener("scroll", resize); document.body.style.overflow = previous; };
  }, [open]);
  useEffect(() => { if (reply || error) resultRef.current?.scrollIntoView({ block: "nearest", behavior: "instant" }); }, [reply, error]);

  function close() {
    controller.current?.abort(); setLoading(false); dialog.current?.close(); setOpen(false);
    (opener.current?.isConnected ? opener.current : document.querySelector<HTMLElement>('button[aria-controls="umbra-guide"]'))?.focus();
  }
  async function ask(value: string) {
    const query = value.trim();
    if (!query || loading || query.length > 500) return;
    const abort = new AbortController(); controller.current = abort;
    const timeout = window.setTimeout(() => abort.abort(), 12_000);
    setQuestion(query); setMessage(""); setReply(null); setError(""); setLoading(true);
    try {
      const response = await fetch("/api/assistant", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: query, locale, useAI: useAI && available }), signal: abort.signal });
      if (!response.ok) { setError(response.status === 429 ? c.rate : c.error); return; }
      const data: unknown = await response.json();
      if (!data || typeof data !== "object" || !("answer" in data) || typeof data.answer !== "string" || !("sources" in data) || !Array.isArray(data.sources) || !("mode" in data) || !["local", "ai"].includes(String(data.mode))) throw new Error("invalid_reply");
      setReply(data as Reply);
    } catch { if (dialog.current?.open) setError(c.error); }
    finally { window.clearTimeout(timeout); if (controller.current === abort) { controller.current = null; setLoading(false); } }
  }

  return <>
    <dialog id="umbra-guide" ref={dialog} className="umbra-guide" aria-labelledby="umbra-guide-title" aria-describedby="umbra-guide-intro" onCancel={(event) => { event.preventDefault(); close(); }} onClick={(event) => { if (event.target === dialog.current) { const rect = dialog.current.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close(); } }}>
      <div className="umbra-guide-header"><div><p className="umbra-guide-kicker">UMBRA STUDIO</p><h2 id="umbra-guide-title">{c.title}</h2></div><button type="button" className="umbra-guide-close" onClick={close} aria-label={c.close}><X size={22} aria-hidden="true" /></button></div>
      <div className="umbra-guide-scroll">
        <p id="umbra-guide-intro">{c.intro}</p>
        <p className="umbra-guide-mode">{available ? c.available : c.local}</p>
        <div className="umbra-guide-suggestions">{c.suggestions.map((suggestion) => <button key={suggestion} type="button" disabled={loading} onClick={() => void ask(suggestion)}>{suggestion}<span aria-hidden="true">↗</span></button>)}</div>
        {question && <div className="umbra-guide-question"><span>{c.you}</span><p>{question}</p></div>}
        <div ref={resultRef} role="status" aria-live="polite" aria-atomic="true">
          {loading && <p className="umbra-guide-loading">{c.loading}</p>}
          {error && <p className="umbra-guide-error">{error}</p>}
          {reply && <div className="umbra-guide-answer"><span className="umbra-guide-mode">{reply.mode === "ai" ? c.ai : c.result}</span>{reply.notice === "unavailable" && <p className="umbra-guide-notice">{c.fallback}</p>}<p className="umbra-guide-answer-text">{reply.answer}</p>{reply.sources.length > 0 && <nav aria-label={c.source}>{reply.sources.filter((source) => typeof source.href === "string" && /^\/(?!\/)/.test(source.href)).map((source) => <Link key={source.href} href={source.href} onClick={close}>{source.title}<span aria-hidden="true"> ↗</span></Link>)}</nav>}</div>}
        </div>
        {(question || reply) && <button type="button" className="umbra-guide-clear" disabled={loading} onClick={() => { setQuestion(""); setReply(null); setError(""); }}>{c.clear}</button>}
        {available && <div className="umbra-guide-consent"><label><input type="checkbox" checked={useAI} onChange={(event) => setUseAI(event.target.checked)} />{c.consent}</label><p>{c.consentNote}</p></div>}
      </div>
      <form className="umbra-guide-form" onSubmit={(event) => { event.preventDefault(); void ask(message); }}>
        <label htmlFor="umbra-guide-input">{c.input}</label><div className="umbra-guide-input-row"><input id="umbra-guide-input" value={message} onChange={(event) => setMessage(event.target.value)} maxLength={500} autoComplete="off" enterKeyHint="send" disabled={loading} /><button type="submit" disabled={loading || !message.trim()} aria-label={c.send}><Send size={19} aria-hidden="true" /></button></div>
        <p>{c.privacy}</p><Link className="umbra-guide-search" href={locale === "sr" ? "/pretraga" : "/en/search"} onClick={close}>{c.search} ↗</Link>
      </form>
    </dialog>
  </>;
}
