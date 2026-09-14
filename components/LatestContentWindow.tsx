import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";

import type { LatestContent } from "@/lib/content/latest";

const GOLD_LIGHT = "#ead39a";
const FALLBACK_IMAGE = "/umbra-background.png";

type Locale = "sr" | "en";

type Props = {
  locale: Locale;
  content: readonly LatestContent[];
};

function titleFor(item: LatestContent, locale: Locale) {
  return item.title[locale] ?? item.title.sr ?? item.title.en;
}

function descriptionFor(item: LatestContent, locale: Locale) {
  return (
    item.shortDescription?.[locale] ??
    item.description?.[locale] ??
    item.shortDescription?.sr ??
    item.description?.sr ??
    ""
  );
}

function typeLabelFor(item: LatestContent, locale: Locale) {
  switch (item.contentType) {
    case "project":
      return locale === "en" ? "PROJECT" : "PROJEKAT";
    case "episode":
      return locale === "en" ? "EPISODE" : "EPIZODA";
    case "character":
      return locale === "en" ? "CHARACTER" : "LIK";
    case "story":
      return locale === "en" ? "STORY" : "PRIČA";
  }
}

function imageFor(item: LatestContent, locale: Locale) {
  switch (item.contentType) {
    case "project":
      return (
        (locale === "en" ? item.source?.coverEn : item.source?.coverSr) ??
        item.source?.coverSr ??
        item.source?.coverEn ??
        FALLBACK_IMAGE
      );
    case "episode":
      return item.thumbnail ?? FALLBACK_IMAGE;
    default:
      return FALLBACK_IMAGE;
  }
}

function routeFor(
  item: LatestContent,
  locale: Locale,
): { href: string; external: boolean } | null {
  switch (item.contentType) {
    case "project":
      return {
        href:
          locale === "en"
            ? `/en/projects/${item.slug}`
            : `/serije/${item.slug}`,
        external: false,
      };
    case "character":
      return {
        href:
          locale === "en"
            ? `/en/characters/${item.slug}`
            : `/likovi/${item.slug}`,
        external: false,
      };
    case "episode":
      return item.youtubeUrl
        ? { href: item.youtubeUrl, external: true }
        : null;
    default:
      return null;
  }
}

function formatDate(publishedAt: string | undefined, locale: Locale) {
  if (!publishedAt) {
    return "";
  }

  const timestamp = Date.parse(publishedAt);

  if (!Number.isFinite(timestamp)) {
    return "";
  }

  return new Intl.DateTimeFormat(
    locale === "en" ? "en-GB" : "sr-Latn-RS",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "UTC",
    },
  ).format(new Date(timestamp));
}

function Card({
  item,
  index,
  locale,
}: {
  item: LatestContent;
  index: number;
  locale: Locale;
}) {
  const title = titleFor(item, locale);
  const description = descriptionFor(item, locale);
  const typeLabel = typeLabelFor(item, locale);
  const image = imageFor(item, locale);
  const route = routeFor(item, locale);
  const date = formatDate(item.publishedAt, locale);

  const card = (
    <article className="group/card relative h-full overflow-hidden border border-white/[0.085] bg-[#080808] shadow-[0_24px_70px_rgba(0,0,0,.26)] transition-[border-color,transform,box-shadow] duration-500 group-hover/card:-translate-y-1 group-hover/card:border-white/[0.14] group-hover/card:shadow-[0_32px_90px_rgba(0,0,0,.34)]">
      <div className="relative aspect-[1.10/0.92] overflow-hidden">
        <Image
          src={image}
          alt=""
          fill
          sizes="(min-width: 1024px) 24vw, (min-width: 640px) 42vw, 90vw"
          className="object-cover opacity-[0.82] transition-transform duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover/card:scale-[1.025]"
          priority={index === 0}
        />

        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,.10), rgba(0,0,0,.14) 42%, rgba(0,0,0,.92) 100%)",
          }}
        />

        <span
          aria-hidden="true"
          className="absolute inset-4 border border-white/[0.055] sm:inset-5"
        />

        <span
          aria-hidden="true"
          className="absolute left-4 top-4 h-7 w-7 border-l border-t sm:left-5 sm:top-5"
          style={{ borderColor: `${GOLD_LIGHT}30` }}
        />

        <div className="absolute inset-x-4 bottom-4 sm:inset-x-5 sm:bottom-5">
          <div className="flex items-center justify-between gap-4">
            <span
              className="text-[6px] font-semibold uppercase tracking-[0.25em] sm:text-[7px]"
              style={{ color: `${GOLD_LIGHT}72` }}
            >
              {typeLabel}
            </span>
            <span className="font-mono text-[6px] uppercase tracking-[0.20em] text-white/[0.18]">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          <h3 className="mt-3 max-w-[95%] text-[clamp(1.45rem,4vw,2.7rem)] font-[430] uppercase leading-[0.88] tracking-[-0.064em] text-white">
            {title}
          </h3>
        </div>
      </div>

      <div className="flex min-h-[118px] flex-col justify-between gap-4 border-t border-white/[0.055] p-4 sm:min-h-[136px] sm:p-5">
        <div>
          <div className="flex items-center justify-between gap-4">
            <span className="font-mono text-[6px] uppercase tracking-[0.22em] text-white/[0.17]">
              {locale === "en" ? "PUBLISHED" : "OBJAVLJENO"}
            </span>
            <time
              dateTime={item.publishedAt}
              className="font-mono text-[6px] uppercase tracking-[0.18em]"
              style={{ color: `${GOLD_LIGHT}58` }}
            >
              {date}
            </time>
          </div>

          {description ? (
            <p className="mt-3 max-w-[95%] text-[9px] leading-5 text-white/[0.31] sm:text-[10px] sm:leading-6">
              {description}
            </p>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-4">
          <span
            className="text-[6px] font-semibold uppercase tracking-[0.22em]"
            style={{ color: `${GOLD_LIGHT}62` }}
          >
            {route
              ? locale === "en"
                ? "OPEN CONTENT"
                : "OTVORI SADRŽAJ"
              : locale === "en"
                ? "PUBLISHED ITEM"
                : "OBJAVLJEN SADRŽAJ"}
          </span>

          {route ? (
            route.external ? (
              <ExternalLink
                aria-hidden="true"
                size={12}
                strokeWidth={1.1}
                className="text-white/[0.40] transition-colors duration-300 group-hover/card:text-[#ead39a]"
              />
            ) : (
              <ArrowUpRight
                aria-hidden="true"
                size={12}
                strokeWidth={1.1}
                className="text-white/[0.40] transition-colors duration-300 group-hover/card:text-[#ead39a]"
              />
            )
          ) : null}
        </div>
      </div>
    </article>
  );

  if (!route) {
    return card;
  }

  return (
    <Link
      href={route.href}
      target={route.external ? "_blank" : undefined}
      rel={route.external ? "noopener noreferrer" : undefined}
      className="group/card block h-full outline-none focus-visible:ring-1 focus-visible:ring-[#ead39a]/70"
      aria-label={
        route.external
          ? locale === "en"
            ? `Open ${title} on YouTube`
            : `Otvori ${title} na YouTube-u`
          : locale === "en"
            ? `Open ${title}`
            : `Otvori ${title}`
      }
    >
      {card}
    </Link>
  );
}

export default function LatestContentWindow({ locale, content }: Props) {
  if (content.length === 0) {
    return (
      <div className="flex h-full min-h-[360px] flex-col items-center justify-center px-7 py-10 text-center sm:min-h-[390px] sm:px-10">
        <span
          className="text-[7px] font-semibold uppercase tracking-[0.30em]"
          style={{ color: `${GOLD_LIGHT}70` }}
        >
          {locale === "en" ? "LIVE EDITORIAL FEED" : "AKTUELNI SADRŽAJ"}
        </span>

        <h3 className="mt-5 max-w-[480px] text-[clamp(2rem,5vw,3.8rem)] font-[430] uppercase leading-[0.88] tracking-[-0.068em] text-white">
          {locale === "en"
            ? "Nothing published yet"
            : "Još nema objavljenog sadržaja"}
        </h3>

        <p className="mt-5 max-w-[360px] text-[10px] leading-5 text-white/[0.28] sm:text-[11px] sm:leading-6">
          {locale === "en"
            ? "This window will surface the two newest public items as soon as real publication dates are entered into the canonical content registry."
            : "Ovaj prozor će prikazati dva najnovija javna sadržaja čim stvarni datumi objave budu uneseni u canonical content registry."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid h-full min-h-[360px] grid-cols-1 gap-px bg-white/[0.055] sm:min-h-[390px] sm:grid-cols-2">
      {content.slice(0, 2).map((item, index) => (
        <Card key={item.id} item={item} index={index} locale={locale} />
      ))}
    </div>
  );
}
