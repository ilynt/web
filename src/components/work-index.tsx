"use client";

import Link from "next/link";
import { useEffect, useRef, useState, ViewTransition } from "react";
import { WorkGlyph } from "./work-glyph";

export type IndexRow = {
  id: string;
  slug: string;
  href: string;
  name: string;
  tagline: string;
  kind: string;
  status: "live" | "building" | "research";
  statusLabel: string;
  areas: string[];
  facts: { label: string; value: string }[];
};

// The lab index. On fine pointers a preview card trails the cursor; the card
// only repeats what the row already says, so it is hidden from assistive tech.
export function WorkIndex({ rows, nextId }: { rows: IndexRow[]; nextId: string }) {
  const [active, setActive] = useState<IndexRow | null>(null);
  const [enabled, setEnabled] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled || !active) return;
    let raf = 0;
    const loop = () => {
      const p = pos.current;
      p.x += (p.tx - p.x) * 0.16;
      p.y += (p.ty - p.y) * 0.16;
      if (cardRef.current) {
        cardRef.current.style.transform = `translate3d(${p.x + 28}px, ${p.y - 40}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [enabled, active]);

  const onMove = (e: React.PointerEvent) => {
    pos.current.tx = e.clientX;
    pos.current.ty = e.clientY;
  };
  const onEnter = (row: IndexRow) => (e: React.PointerEvent) => {
    if (!active) {
      pos.current.x = pos.current.tx = e.clientX;
      pos.current.y = pos.current.ty = e.clientY;
    }
    setActive(row);
  };

  return (
    <div className="relative" onPointerMove={enabled ? onMove : undefined} onPointerLeave={() => setActive(null)}>
      <div className="meta hidden grid-cols-12 gap-6 border-b border-line pb-3 text-faint md:grid" aria-hidden="true">
        <span className="col-span-1">No.</span>
        <span className="col-span-5">Work</span>
        <span className="col-span-2">Type</span>
        <span className="col-span-2">Areas</span>
        <span className="col-span-2 text-right">State</span>
      </div>
      <ol>
        {rows.map((row) => (
          <li key={row.id} className="border-b border-line">
            <Link
              href={row.href}
              onPointerEnter={enabled ? onEnter(row) : undefined}
              className="group grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-2 py-6 transition-colors md:grid-cols-12 md:py-7"
              style={{ opacity: active && active.id !== row.id ? 0.4 : 1, transition: "opacity .4s" }}
            >
              <span className="flex flex-col gap-3 md:col-span-1">
                <span className="meta text-faint">{row.id}</span>
                <WorkGlyph seed={row.slug} status={row.status} className="size-7" />
              </span>
              <span className="md:col-span-5">
                <ViewTransition name={`work-${row.slug}`} share="morph" default="none">
                  <span className="block w-fit text-2xl font-medium tracking-tight transition-colors group-hover:text-accent md:text-3xl">
                    {row.name}
                  </span>
                </ViewTransition>
                <span className="mt-2 block max-w-xl text-muted">{row.tagline}</span>
              </span>
              <span className="meta col-start-2 text-muted md:col-span-2 md:col-start-auto">{row.kind}</span>
              <span className="meta col-start-2 hidden text-muted md:col-span-2 md:col-start-auto md:block">
                {row.areas.join(" · ")}
              </span>
              <span className="meta col-start-2 md:col-span-2 md:col-start-auto md:text-right">
                <span className={`status ${row.status === "live" ? "live-dot" : ""}`} data-status={row.status}>
                  {row.statusLabel}
                </span>
              </span>
            </Link>
          </li>
        ))}
        <li
          aria-hidden="true"
          className="grid grid-cols-[auto_1fr] items-baseline gap-x-6 py-6 text-faint md:grid-cols-12 md:py-7"
        >
          <span className="meta md:col-span-1">{nextId}</span>
          <span className="md:col-span-11">
            <span className="caret opacity-60" />
          </span>
        </li>
      </ol>

      {enabled && (
        <div
          ref={cardRef}
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-30 w-72 rounded-lg border border-line bg-raised/95 p-5 shadow-2xl backdrop-blur transition-opacity duration-300"
          style={{ opacity: active ? 1 : 0 }}
        >
          {active && (
            <>
              <div className="flex items-baseline justify-between">
                <span className="flex items-center gap-4">
                  <WorkGlyph
                    seed={active.slug}
                    status={active.status}
                    className="glyph-live size-12"
                    key={active.slug}
                  />
                  <span className="text-4xl font-medium tracking-tighter">{active.id.slice(3)}</span>
                </span>
                <span className="meta status" data-status={active.status}>
                  {active.statusLabel}
                </span>
              </div>
              <dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
                {active.facts.slice(0, 4).map((f) => (
                  <div key={f.label} className="flex justify-between gap-4">
                    <dt className="text-faint">{f.label}</dt>
                    <dd className="text-right">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </>
          )}
        </div>
      )}
    </div>
  );
}
