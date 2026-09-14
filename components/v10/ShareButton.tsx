"use client";

import { useId, useState } from "react";
import { Check, Link as LinkIcon } from "lucide-react";
import type { Locale } from "@/lib/site/routes";

export function ShareButton({ locale, url }: { locale: Locale; url: string }) {
  const [state, setState] = useState<"idle" | "busy" | "success" | "error">("idle");
  const id = useId();
  async function copyLink() {
    setState("busy");
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Unavailable");
      await navigator.clipboard.writeText(url);
      setState("success");
    } catch { setState("error"); }
  }
  return <div className="v10-share">
    <button className="v8-action v8-action-secondary" type="button" onClick={copyLink} disabled={state === "busy"}>
      {state === "success" ? <Check size={17} aria-hidden="true" /> : <LinkIcon size={17} aria-hidden="true" />}
      {locale === "sr" ? "Kopiraj link" : "Copy link"}
    </button>
    <span role="status" className="v10-share-status">{state === "success" ? (locale === "sr" ? "Link je kopiran." : "Link copied.") : state === "error" ? (locale === "sr" ? "Kopiranje nije uspelo. Označi i kopiraj adresu ispod." : "Copy failed. Select and copy the address below.") : ""}</span>
    {state === "error" && <div className="v8-field"><label htmlFor={id}>{locale === "sr" ? "Adresa stranice" : "Page address"}</label><input id={id} readOnly value={url} onFocus={(event) => event.currentTarget.select()} /></div>}
  </div>;
}
