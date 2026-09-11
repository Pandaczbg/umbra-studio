"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Locale, getLocalePrefix } from "@/data/translations";

function buildLocalizedPath(pathname: string, targetLocale: Locale) {
  const clean = pathname === "/" ? "" : pathname.replace(/^\/en(?=\/|$)/, "");
  return `${getLocalePrefix(targetLocale)}${clean || "/"}`;
}

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const locale: Locale =
    pathname === "/en" || pathname.startsWith("/en/") ? "en" : "sr";

  const target: Locale = locale === "sr" ? "en" : "sr";

  return (
    <div className="flex items-center rounded-full border border-white/10 bg-white/[0.025] p-1 text-[8px] uppercase tracking-[0.2em]">
      <span className="px-2 text-white/80">{locale}</span>
      <Link
        href={buildLocalizedPath(pathname, target)}
        aria-label={target === "en" ? "Switch to English" : "Prebaci na srpski"}
        data-cursor-interactive
        className="rounded-full px-2 py-1 text-white/35 transition-colors duration-300 hover:bg-white/[0.06] hover:text-white"
      >
        {target}
      </Link>
    </div>
  );
}
