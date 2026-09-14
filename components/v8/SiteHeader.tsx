"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowUpRight, Compass, Menu, Search, X } from "lucide-react";
import { copy } from "@/lib/site/copy";
import LocalTime from "./LocalTime";
import { localeFor, localizedHref, routes } from "@/lib/site/routes";

function subscribeHash(callback: () => void) {
  window.addEventListener("hashchange", callback);
  window.addEventListener("popstate", callback);
  return () => {
    window.removeEventListener("hashchange", callback);
    window.removeEventListener("popstate", callback);
  };
}
const getHash = () => window.location.hash;
const emptyHash = () => "";

export default function SiteHeader() {
  const pathname = usePathname();
  const query = useSearchParams().toString();
  const locale = localeFor(pathname);
  const c = copy[locale];
  const hash = useSyncExternalStore(subscribeHash, getHash, emptyHash);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const navigation = ["latest", "projects", "characters", "archive"] as const;
  const other = locale === "sr" ? "en" : "sr";
  const languageHref = localizedHref(
    pathname + (query ? `?${query}` : "") + hash,
    other,
  );

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  function closeMenu() {
    dialog.current?.close();
  }
  function finishClose() {
    setOpen(false);
    trigger.current?.focus();
  }
  function showMenu() {
    dialog.current?.showModal();
    setOpen(true);
  }

  return (
    <>
      <a href="#main-content" className="v8-skip">
        {c.skip}
      </a>
      <header className="v8-header">
        <div className="v8-header-frame">
          <Link
            href={routes[locale].home}
            className="v8-wordmark"
            aria-label={`Umbra Studio · ${c.home}`}
          >
            <span>UMBRA</span>
            <small>STUDIO</small>
          </Link>
          <nav
            className="v8-desktop-nav"
            aria-label={
              locale === "sr" ? "Glavna navigacija" : "Main navigation"
            }
          >
            {navigation.map((key) => (
              <Link
                key={key}
                href={routes[locale][key]}
                aria-current={
                  pathname === routes[locale][key] ||
                  pathname.startsWith(`${routes[locale][key]}/`)
                    ? "page"
                    : undefined
                }
              >
                {c[key]}
              </Link>
            ))}
            <Link href={`${routes[locale].home}#o-studiju`}>{c.studio}</Link>
          </nav>
          <LocalTime locale={locale} />
          <div className="v8-header-actions">
            <button
              type="button"
              className="v8-icon-button"
              aria-label={locale === "sr" ? "Umbra vodič" : "Umbra guide"}
              aria-haspopup="dialog"
              aria-controls="umbra-guide"
              onClick={() => window.dispatchEvent(new Event("umbra:open-guide"))}
            >
              <Compass size={19} strokeWidth={1.4} aria-hidden="true" />
            </button>
            <Link
              href={routes[locale].search}
              className="v8-icon-button"
              aria-label={c.search}
            >
              <Search size={19} strokeWidth={1.4} />
            </Link>
            <a
              href={languageHref}
              onClick={(event) => {
                event.currentTarget.href = localizedHref(
                  window.location.pathname +
                    window.location.search +
                    window.location.hash,
                  other,
                );
              }}
              hrefLang={other}
              lang={other}
              className="v8-language"
              aria-label={
                other === "en" ? "Switch to English" : "Prebaci na srpski"
              }
            >
              {other.toUpperCase()}
            </a>
            <button
              ref={trigger}
              onClick={showMenu}
              aria-label={c.menu}
              aria-expanded={open}
              aria-controls="site-menu"
              className="v8-icon-button v8-menu-trigger"
            >
              <Menu size={22} strokeWidth={1.4} />
            </button>
          </div>
          <span className="v8-header-progress" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
        </div>
      </header>
      <dialog
        id="site-menu"
        ref={dialog}
        onClose={finishClose}
        className="v8-menu"
        aria-labelledby="menu-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) closeMenu();
        }}
      >
        <div className="v8-menu-inner">
          <div className="v8-menu-top">
            <p id="menu-title" className="v8-eyebrow">
              UMBRA / {c.menu}
            </p>
            <button
              className="v8-icon-button"
              onClick={closeMenu}
              aria-label={c.close}
              autoFocus
            >
              <X size={24} />
            </button>
          </div>
          <nav aria-label={c.menu}>
            {(["home", ...navigation, "search"] as const).map((key, i) => (
              <Link key={key} href={routes[locale][key]} onClick={closeMenu}>
                <span className="v8-menu-index">0{i + 1}</span>
                {c[key]}
                <ArrowUpRight aria-hidden="true" size={24} />
              </Link>
            ))}
            <Link href={`${routes[locale].home}#o-studiju`} onClick={closeMenu}>
              <span className="v8-menu-index">07</span>
              {c.studio}
              <ArrowUpRight aria-hidden="true" size={24} />
            </Link>
          </nav>
          <p className="v8-menu-note">{c.tagline}</p>
        </div>
      </dialog>
    </>
  );
}
