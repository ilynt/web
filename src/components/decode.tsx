"use client";

import { useEffect, useRef } from "react";

// Resolves text out of noise the first time it scrolls into view, like a
// signal locking in. The real text is server-rendered; the effect only runs
// with motion allowed, and assistive tech always reads the final label.
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/·—";

export function Decode({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const duration = 380 + text.length * 18;
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          const settled = Math.floor(p * text.length);
          let out = text.slice(0, settled);
          for (let i = settled; i < text.length; i++) {
            out += text[i] === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0];
          }
          el.textContent = out;
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      el.textContent = text;
    };
  }, [text]);

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden="true">
        {text}
      </span>
    </span>
  );
}
