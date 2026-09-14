"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";
import type { Locale } from "@/lib/site/routes";

export type GalleryImage = { src: string; alt: string; caption: string };

export function Gallery({ images, locale }: { images: GalleryImage[]; locale: Locale }) {
  const [selected, setSelected] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const titleId = useId();
  useEffect(() => {
    if (selected === null) return;
    const element = dialog.current;
    if (!element) return;
    if (!element.open) element.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = overflow; };
  }, [selected]);
  function close() {
    dialog.current?.close();
    setSelected(null);
    trigger.current?.focus();
  }
  function move(delta: number) { setSelected((value) => value === null ? null : (value + delta + images.length) % images.length); }
  return <>
    <div className="v10-gallery-grid">
      {images.map((item, index) => <figure key={item.src}>
        <button type="button" className="v10-gallery-open" aria-label={`${locale === "sr" ? "Uvećaj" : "Enlarge"}: ${item.caption}`} onClick={(event) => { trigger.current = event.currentTarget; setSelected(index); }}>
          <Image src={item.src} alt={item.alt} fill sizes="(min-width: 900px) 40vw, 90vw" className="v8-contain" />
          <Expand size={20} className="v10-gallery-expand" aria-hidden="true" />
        </button><figcaption>{item.caption}</figcaption>
      </figure>)}
    </div>
    <dialog ref={dialog} className="v10-gallery-dialog" aria-labelledby={titleId} onCancel={(event) => { event.preventDefault(); close(); }} onClick={(event) => { if (event.target === event.currentTarget) close(); }} onKeyDown={(event) => {
      if (event.key === "Tab") {
        const controls = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("button:not(:disabled)"));
        const first = controls[0];
        const last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
      if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); } if (event.key === "ArrowRight") { event.preventDefault(); move(1); } }}>
      {selected !== null && <div className="v10-gallery-view">
        <div className="v10-gallery-toolbar"><h2 id={titleId}>{locale === "sr" ? "Galerija" : "Gallery"}</h2><button type="button" className="v10-gallery-control" onClick={close} aria-label={locale === "sr" ? "Zatvori galeriju" : "Close gallery"} autoFocus><X aria-hidden="true" /></button></div>
        <figure><div className="v10-gallery-full"><Image src={images[selected].src} alt={images[selected].alt} fill sizes="90vw" className="v8-contain" /></div><figcaption aria-live="polite">{images[selected].caption}</figcaption></figure>
        {images.length > 1 && <div className="v10-gallery-pagination"><button type="button" className="v10-gallery-control" onClick={() => move(-1)} aria-label={locale === "sr" ? "Prethodna slika" : "Previous image"}><ArrowLeft aria-hidden="true" /></button><span>{selected + 1} / {images.length}</span><button type="button" className="v10-gallery-control" onClick={() => move(1)} aria-label={locale === "sr" ? "Sledeća slika" : "Next image"}><ArrowRight aria-hidden="true" /></button></div>}
      </div>}
    </dialog>
  </>;
}
