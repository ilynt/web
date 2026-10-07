"use client";

import { useEffect, useRef } from "react";

// Gives a card physical depth: a resting perspective tilt that eases toward
// the pointer, with a soft light that follows it. Fine pointers only.
export function SpatialTilt({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!mq.matches) return;

    const rest = { rx: 3, ry: -7 };
    const cur = { rx: rest.rx, ry: rest.ry, lx: 50, ly: 30 };
    const target = { ...cur };
    let raf = 0;

    const loop = () => {
      cur.rx += (target.rx - cur.rx) * 0.08;
      cur.ry += (target.ry - cur.ry) * 0.08;
      cur.lx += (target.lx - cur.lx) * 0.1;
      cur.ly += (target.ly - cur.ly) * 0.1;
      el.style.setProperty("--rx", `${cur.rx.toFixed(2)}deg`);
      el.style.setProperty("--ry", `${cur.ry.toFixed(2)}deg`);
      el.style.setProperty("--lx", `${cur.lx.toFixed(1)}%`);
      el.style.setProperty("--ly", `${cur.ly.toFixed(1)}%`);
      const settled =
        Math.abs(target.rx - cur.rx) < 0.01 &&
        Math.abs(target.ry - cur.ry) < 0.01 &&
        Math.abs(target.lx - cur.lx) < 0.1;
      raf = settled ? 0 : requestAnimationFrame(loop);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      target.ry = (x - 0.5) * 12;
      target.rx = (0.5 - y) * 9;
      target.lx = x * 100;
      target.ly = y * 100;
      kick();
    };
    const onLeave = () => {
      target.rx = rest.rx;
      target.ry = rest.ry;
      target.lx = 50;
      target.ly = 30;
      kick();
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} className="[perspective:1400px]">
      <div className="relative [transform:rotateX(var(--rx,3deg))_rotateY(var(--ry,-7deg))] [transform-style:preserve-3d] motion-reduce:[transform:none]">
        {children}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-xl"
          style={{
            background:
              "radial-gradient(420px circle at var(--lx,50%) var(--ly,30%), rgb(236 235 230 / 0.06), transparent 60%)",
          }}
        />
      </div>
    </div>
  );
}
