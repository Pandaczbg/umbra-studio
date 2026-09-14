"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeFor, routes } from "@/lib/site/routes";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = localeFor(usePathname());
  return (
    <main id="main-content" className="v8-main">
      <section className="v8-container v8-error">
        <p className="v8-eyebrow">UMBRA STUDIO</p>
        <h1 className="v8-title">
          {locale === "sr" ? "Stranica nije učitana" : "Page could not load"}
        </h1>
        <p className="v8-lead">
          {locale === "sr"
            ? "Stranica nije mogla da se učita. Pokušaj ponovo."
            : "The page could not load. Please try again."}
        </p>
        <div className="v8-actions">
          <button type="button" className="v8-action" onClick={reset}>
            {locale === "sr" ? "Pokušaj ponovo" : "Try again"}
          </button>
          <Link
            className="v8-action v8-action-secondary"
            href={routes[locale].home}
          >
            {locale === "sr" ? "Početna" : "Home"}
          </Link>
        </div>
      </section>
    </main>
  );
}
