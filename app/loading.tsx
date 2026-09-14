"use client";
import { usePathname } from "next/navigation";
import { localeFor } from "@/lib/site/routes";
export default function Loading() {
  const locale = localeFor(usePathname());
  return (
    <div className="v8-main" aria-busy="true">
      <div className="v8-container v8-loading" role="status" aria-live="polite">
        <p className="v8-eyebrow">UMBRA STUDIO</p>
        <p className="v8-lead">
          {locale === "sr" ? "Učitavanje…" : "Loading…"}
        </p>
        <div className="v8-loading-bar" aria-hidden="true" />
      </div>
    </div>
  );
}
