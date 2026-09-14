"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Send, X } from "lucide-react";
import "./assistant.css";

type Turn = { question: string; reply: Reply };
type Reply = { mode: "local" | "ai"; answer: string; sources: { id?: string; title: string; href: string }[]; notice?: string };
const copy = {
  sr: { open: "Umbra vodič", title: "Istraži Umbra svetove", close: "Zatvori vodič", intro: "Pronađi seriju, lik ili sledeću stranicu — bez otkrivanja završetaka.", local: "Pretraga javnog sadržaja · AI nije aktivan", available: "Lokalna pretraga · AI opcija je dostupna", ai: "AI povezivanje javnih izvora · može da pogreši", privacy: "Ne unosi lične podatke. Razgovor ostaje samo u ovoj otvorenoj sesiji.", consent: "Koristi AI: moje pitanje i kratak kontekst razgovora šalju se OpenAI servisu", consentNote: "AI povezuje do tri odobrena izvora; tekst odgovora ostaje urednički proveren. Pravila čuvanja podataka provajdera mogu da važe.", input: "Šta želiš da istražiš?", send: "Pošalji pitanje", loading: "Tražim u javnom sadržaju…", error: "Vodič trenutno nije dostupan. Pokušaj ponovo ili koristi pretragu sajta.", rate: "Previše zahteva u kratkom periodu. Pokušaj ponovo za minut.", fallback: "AI trenutno nije dostupan. Prikazan je rezultat lokalne pretrage.", source: "Povezane stranice", search: "Pretraga sajta", clear: "Obriši razgovor", you: "Tvoje pitanje", result: "Lokalna pretraga javnih izvora", suggestions: ["Koje serije mogu da istražim?", "MRZIM SVOG BRATA bez spojlera", "Gde je stranica o Josifu?"] },
  en: { open: "Umbra guide", title: "Explore Umbra worlds", close: "Close guide", intro: "Find a series, a character or your next page — without revealing endings.", local: "Public content search · AI is not active", available: "Local search · AI option is available", ai: "AI-assisted source selection · may be wrong", privacy: "Do not enter personal information. Conversation stays only in this open session.", consent: "Use AI: send my question and short conversation context to OpenAI", consentNote: "AI connects up to three approved sources; response text remains editorially reviewed. The provider’s data retention policies may apply.", input: "What would you like to explore?", send: "Send question", loading: "Searching public content…", error: "The guide is currently unavailable. Try again or use site search.", rate: "Too many requests in a short period. Try again in a minute.", fallback: "AI is currently unavailable. Showing a local search result.", source: "Related pages", search: "Site search", clear: "Clear conversation", you: "Your question", result: "Local public-source search", suggestions: ["Which projects can I explore?", "MRZIM SVOG BRATA without spoilers", "Where is Josif’s page?"] },
};

export default function UmbraAssistant() {
  const pathname = usePathname();
  const locale = pathname === "/en" || pathname.startsWith("/en/") ? "en" : "sr";
  // A locale change remounts the dialog, clears transient state and aborts requests.
  return <Guide key={locale} locale={locale} />;
}

function Guide({ locale }: { locale: "sr" | "en" }) {
  const c = copy[locale];
  const pathname = usePathname();
  const [turns, setTurns] = useState<Turn[]>([]);
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
    if (question && reply) setTurns(previous => [...previous, { question, reply }].slice(-7));
    setQuestion(query); setMessage(""); setReply(null); setError(""); setLoading(true);
    try {
      const response = await fetch("/api/assistant", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: query, locale, useAI: useAI && available, context: { route: pathname, previousSourceIds: (reply?.sources ?? turns.at(-1)?.reply.sources ?? []).flatMap(source => source.id ? [source.id] : []).slice(0, 3), previousQuestions: [...turns.map(turn => turn.question), ...(reply && question ? [question] : [])].slice(-4) } }), signal: abort.signal });
      if (!response.ok) { setError(response.status === 429 ? c.rate : c.error); return; }
      const data: unknown = await response.json();
      if (!data || typeof data !== "object" || !("answer" in data) || typeof data.answer !== "string" || !("sources" in data) || !Array.isArray(data.sources) || !("mode" in data) || !["local", "ai"].includes(String(data.mode))) throw new Error("invalid_reply");
      const candidate = data as Reply;
      if (candidate.answer.length > 4000 || candidate.sources.length > 3 || candidate.sources.some(source => !source || typeof source.title !== "string" || typeof source.href !== "string" || !/^\/(?!\/)[a-zA-Z0-9/#-]*$/.test(source.href))) throw new Error("invalid_reply");
      if (!abort.signal.aborted) setReply(candidate);
    } catch { if (dialog.current?.open) setError(navigator.onLine ? c.error : locale === "sr" ? "Nema mrežne veze. Pitanje je zadržano — pokušaj ponovo kada se povežeš." : "You are offline. Your question is kept — retry when connected."); }
    finally { window.clearTimeout(timeout); if (controller.current === abort) { controller.current = null; setLoading(false); } }
  }

  return <>
    <dialog id="umbra-guide" ref={dialog} className="umbra-guide" aria-labelledby="umbra-guide-title" aria-describedby="umbra-guide-intro" onCancel={(event) => { event.preventDefault(); close(); }} onClick={(event) => { if (event.target === dialog.current) { const rect = dialog.current.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close(); } }}>
      <div className="umbra-guide-header"><div><p className="umbra-guide-kicker">UMBRA STUDIO</p><h2 id="umbra-guide-title">{c.title}</h2></div><button type="button" className="umbra-guide-close" onClick={close} aria-label={c.close}><X size={22} aria-hidden="true" /></button></div>
      <div className="umbra-guide-scroll">
        <p id="umbra-guide-intro">{c.intro}</p>
        <p className="umbra-guide-mode">{available ? c.available : c.local}</p>
        <div className="umbra-guide-suggestions">{(pathname.includes("gvozden") ? [locale === "sr" ? "Ko je Gvozden?" : "Who is Gvozden?", locale === "sr" ? "Ko je njegova supruga?" : "Who is his wife?", locale === "sr" ? "Ko je njegov prijatelj?" : "Who is his friend?"] : c.suggestions).map((suggestion) => <button key={suggestion} type="button" disabled={loading} onClick={() => void ask(suggestion)}>{suggestion}<span aria-hidden="true">↗</span></button>)}</div>
        {turns.length > 0 && <div className="umbra-guide-history" aria-label={locale === "sr" ? "Prethodna pitanja" : "Previous questions"}>{turns.map((turn, index) => <details key={index}><summary>{turn.question}</summary><p>{turn.reply.answer}</p><nav aria-label={c.source}>{turn.reply.sources.map(source => <Link key={source.href} href={source.href} onClick={close}>{source.title} ↗</Link>)}</nav></details>)}</div>}
        {question && <div className="umbra-guide-question"><span>{c.you}</span><p>{question}</p></div>}
        <div ref={resultRef} role="status" aria-live="polite" aria-atomic="true">
          {loading && <p className="umbra-guide-loading">{c.loading}</p>}
          {error && <div><p className="umbra-guide-error">{error}</p><button className="umbra-guide-clear" type="button" onClick={() => void ask(question)}>{locale === "sr" ? "Pokušaj ponovo" : "Try again"}</button></div>}
          {reply && <div className="umbra-guide-answer"><span className="umbra-guide-mode">{reply.mode === "ai" ? c.ai : c.result}</span>{reply.notice === "unavailable" && <p className="umbra-guide-notice">{c.fallback}</p>}<p className="umbra-guide-answer-text">{reply.answer}</p>{reply.sources.length > 0 && <nav aria-label={c.source}>{reply.sources.filter((source) => typeof source.href === "string" && /^\/(?!\/)/.test(source.href)).map((source) => <Link key={source.href} href={source.href} onClick={close}>{source.title}<span aria-hidden="true"> ↗</span></Link>)}</nav>}</div>}
        </div>
        {(question || reply) && <button type="button" className="umbra-guide-clear" disabled={loading} onClick={() => { setQuestion(""); setReply(null); setError(""); setTurns([]); }}>{c.clear}</button>}
        {available && <div className="umbra-guide-consent"><label><input type="checkbox" checked={useAI} onChange={(event) => setUseAI(event.target.checked)} />{c.consent}</label><p>{c.consentNote}</p></div>}
      </div>
      <form className="umbra-guide-form" onSubmit={(event) => { event.preventDefault(); void ask(message); }}>
        <label htmlFor="umbra-guide-input">{c.input}</label><div className="umbra-guide-input-row"><input id="umbra-guide-input" value={message} onChange={(event) => setMessage(event.target.value)} maxLength={500} autoComplete="off" enterKeyHint="send" disabled={loading} /><button type="submit" disabled={loading || !message.trim()} aria-label={c.send}><Send size={19} aria-hidden="true" /></button></div>
        <p>{c.privacy}</p><Link className="umbra-guide-search" href={locale === "sr" ? "/pretraga" : "/en/search"} onClick={close}>{c.search} ↗</Link>
      </form>
    </dialog>
  </>;
}
