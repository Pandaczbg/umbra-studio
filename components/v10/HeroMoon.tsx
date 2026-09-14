"use client";

import Image from "next/image";
import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";

/** The V9 moon is an actual foreground layer: its return physically covers the seal. */
export default function HeroMoon() {
  const frame = useRef<HTMLDivElement>(null);
  const toggleOnTouch = (event: ReactPointerEvent<HTMLDivElement>) => {
    const node = frame.current;
    if (!node || event.pointerType !== "touch") return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (node.dataset.revealed) {
      delete node.dataset.revealed;
    } else {
      node.dataset.revealed = "true";
    }
  };
  useEffect(() => {
    const node = frame.current;
    if (!node) return;
    const allowed = matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    const reset = () => { delete node.dataset.revealed; };
    const reveal = (event: PointerEvent) => {
      if (allowed.matches && event.pointerType !== "touch") node.dataset.revealed = "true";
    };
    node.addEventListener("pointerenter", reveal, { passive: true });
    node.addEventListener("pointerleave", reset);
    window.addEventListener("blur", reset);
    allowed.addEventListener("change", reset);
    reducedMotion.addEventListener("change", reset);
    return () => {
      reset();
      node.removeEventListener("pointerenter", reveal);
      node.removeEventListener("pointerleave", reset);
      window.removeEventListener("blur", reset);
      allowed.removeEventListener("change", reset);
      reducedMotion.removeEventListener("change", reset);
    };
  }, []);
  return (
    <div className="v10-moon-scene" ref={frame} onPointerDown={toggleOnTouch} aria-hidden="true">
      <div className="v10-moon-light" />
      <div className="v10-moon-seal">
        <Image src="/images/v10/umbra-seal.webp" alt="" width={640} height={640} sizes="(max-width: 700px) 145px, 260px" />
      </div>
      <div className="v10-moon-disc">
        <Image src="/images/v9/umbra-eclipse.webp" alt="" width={1672} height={941} sizes="(max-width: 700px) 790px, 1500px" className="v10-moon-texture" />
      </div>
    </div>
  );
}
