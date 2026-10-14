"use client";

import Link from "next/link";
import { useState } from "react";

// One-field "email me when this ships" form for lab entries that are not live.
export function NotifyForm({ slug, label }: { slug: string; label: string }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setState("sending");
    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, work: slug }),
      });
      setState(res.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <p role="status" className="status meta" data-status="live">
        Noted — you will get one email when {label} is released.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor={`notify-${slug}`} className="meta text-faint">
        Get one email when {label} is released
      </label>
      <div className="mt-3 flex gap-2">
        <input
          id={`notify-${slug}`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          className="min-w-0 flex-1 rounded-full border border-line bg-raised px-4 py-2.5 text-sm text-fg placeholder:text-faint focus:border-accent focus:outline-none"
        />
        <button type="submit" disabled={state === "sending"} className="btn shrink-0 disabled:opacity-60">
          {state === "sending" ? "…" : "Notify me"}
        </button>
      </div>
      {/* Honeypot */}
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <input name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <p aria-live="polite" className="mt-2 text-xs text-muted">
        {state === "error" ? (
          "Could not send. Please try again or use the contact page."
        ) : (
          <>
            Used only for this notification.{" "}
            <Link href="/privacy" className="link">
              Privacy
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
