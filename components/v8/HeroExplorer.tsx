"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/lib/site/routes";

export type ExplorerPanel = {
  title: string;
  label: string;
  text: string;
  href: string;
  action: string;
};
export default function HeroExplorer({
  panels,
  locale,
}: {
  panels: ExplorerPanel[];
  locale: Locale;
}) {
  const [selected, setSelected] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const current = panels[selected];
  if (!current) return null;
  return (
    <div className="v8-explorer">
      <div
        role="tablist"
        aria-label={
          locale === "sr" ? "Istraži Umbra Studio" : "Explore Umbra Studio"
        }
        className="v8-explorer-tabs"
      >
        {panels.map((panel, index) => (
          <button
            key={panel.label}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            id={`${id}-tab-${index}`}
            role="tab"
            aria-selected={selected === index}
            aria-controls={`${id}-panel-${index}`}
            tabIndex={selected === index ? 0 : -1}
            onClick={() => setSelected(index)}
            onKeyDown={(event) => {
              let next = index;
              if (event.key === "ArrowRight")
                next = (index + 1) % panels.length;
              else if (event.key === "ArrowLeft")
                next = (index - 1 + panels.length) % panels.length;
              else if (event.key === "Home") next = 0;
              else if (event.key === "End") next = panels.length - 1;
              else return;
              event.preventDefault();
              setSelected(next);
              tabRefs.current[next]?.focus();
            }}
          >
            <span aria-hidden="true">0{index + 1}</span>
            {panel.label}
          </button>
        ))}
      </div>
      {panels.map((panel, index) => (
        <div
          key={panel.label}
          role="tabpanel"
          tabIndex={0}
          id={`${id}-panel-${index}`}
          aria-labelledby={`${id}-tab-${index}`}
          hidden={selected !== index}
          className="v8-explorer-panel"
        >
          <h2>{panel.title}</h2>
          <p>{panel.text}</p>
          <Link href={panel.href}>
            {panel.action}
            <ArrowUpRight size={20} aria-hidden="true" />
          </Link>
        </div>
      ))}
    </div>
  );
}
