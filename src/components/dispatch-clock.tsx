"use client";

import { useEffect, useState } from "react";

// Countdown to the next Sinyra briefing (weekdays 18:00, Europe/Istanbul).
// Türkiye has used a fixed UTC+3 offset since 2016, so plain offset math is enough.
const OFFSET_MS = 3 * 60 * 60 * 1000;
const SEND_HOUR = 18;

function nextDispatch(nowUtc: number) {
  const local = new Date(nowUtc + OFFSET_MS);
  const target = new Date(local);
  target.setUTCHours(SEND_HOUR, 0, 0, 0);
  const isWeekday = (d: Date) => d.getUTCDay() >= 1 && d.getUTCDay() <= 5;
  if (!isWeekday(local) || local >= target) {
    do target.setUTCDate(target.getUTCDate() + 1);
    while (!isWeekday(target));
  }
  return target.getTime() - local.getTime();
}

function format(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s % 60)}`;
}

export function DispatchClock() {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setRemaining(nextDispatch(Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  if (remaining === null) return <span>Weekdays · 18:00 TRT</span>;
  return (
    <span>
      Next briefing in <span className="tabular-nums text-fg">{format(remaining)}</span>
    </span>
  );
}
