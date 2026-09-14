"use client";
import { useSyncExternalStore } from "react";
import type { Locale } from "@/lib/site/routes";

function subscribe(callback: () => void) {
  const timer = window.setInterval(callback, 1000);
  return () => window.clearInterval(timer);
}
const snapshot = () => Math.floor(Date.now() / 1000);
const serverSnapshot = () => 0;

/** Isolated clock: its updates do not rerender navigation or content. */
export default function LocalTime({ locale }: { locale: Locale }) {
  const seconds = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const language = locale === "sr" ? "sr-Latn-RS" : "en-GB";
  const date = seconds ? new Date(seconds * 1000) : null;
  const zone = date
    ? Intl.DateTimeFormat()
        .resolvedOptions()
        .timeZone.split("/")
        .at(-1)
        ?.replaceAll("_", " ")
    : "";
  return (
    <div
      className="v8-local-time"
      aria-label={locale === "sr" ? "Tvoje lokalno vreme" : "Your local time"}
    >
      <time dateTime={date?.toISOString()}>
        {date
          ? new Intl.DateTimeFormat(language, {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
            }).format(date)
          : "—:—:—"}
      </time>
      <span>
        {date
          ? new Intl.DateTimeFormat(language, {
              day: "2-digit",
              month: "short",
            }).format(date)
          : "—"}{" "}
        · {zone}
      </span>
    </div>
  );
}
