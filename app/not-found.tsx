import { headers } from "next/headers";
import { PageFrame, ActionLink } from "@/components/v8/Primitives";
import { routes } from "@/lib/site/routes";
import { copy } from "@/lib/site/copy";
export default async function NotFound() {
  const locale = (await headers()).get("x-umbra-locale") === "en" ? "en" : "sr";
  const c = copy[locale];
  return (
    <PageFrame locale={locale}>
      <section className="v8-container v8-error">
        <p className="v8-eyebrow">404 / UMBRA STUDIO</p>
        <h1 className="v8-title">
          {locale === "sr" ? "Izvan kadra" : "Out of frame"}
        </h1>
        <p className="v8-lead">
          {locale === "sr"
            ? "Ova stranica ne postoji. Otvori početnu stranicu ili pretraži Umbra projekte."
            : "This page does not exist. Open the home page or search Umbra projects."}
        </p>
        <div className="v8-actions">
          <ActionLink href={routes[locale].home}>{c.home}</ActionLink>
          <ActionLink href={routes[locale].search} secondary>
            {c.search}
          </ActionLink>
        </div>
      </section>
    </PageFrame>
  );
}
