"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { contactTopics, ragDeploymentOptions } from "@/content/contact";

type State = "idle" | "sending" | "sent" | "error" | "fallback";

const field =
  "mt-2 block w-full rounded-md border border-line bg-raised px-4 py-3 text-fg placeholder:text-faint transition-colors focus:border-accent focus:outline-none";

export function ContactForm({ email }: { email: string }) {
  const params = useSearchParams();
  const initial = params.get("topic");
  const [topic, setTopic] = useState(contactTopics.some((t) => t.id === initial) ? initial! : "");
  const [state, setState] = useState<State>("idle");
  const [mailto, setMailto] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) return setState("sent");
      if (res.status === 503) {
        const label = contactTopics.find((t) => t.id === data.topic)?.label ?? "";
        const body = [data.message, "", `— ${data.name}${data.organization ? `, ${data.organization}` : ""}`].join("\n");
        setMailto(`mailto:${email}?subject=${encodeURIComponent(label)}&body=${encodeURIComponent(body)}`);
        return setState("fallback");
      }
      setState("error");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div role="status" className="rounded-lg border border-line p-8">
        <p className="status live-dot meta" data-status="live">
          Received
        </p>
        <p className="mt-4 text-2xl font-medium tracking-tight">Thanks — your message is in.</p>
        <p className="mt-3 text-muted">We reply from {email}, usually within two working days.</p>
      </div>
    );
  }

  const isRag = topic === "enterprise-rag";

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate={false}>
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="meta text-muted">Name</span>
          <input name="name" required autoComplete="name" className={field} />
        </label>
        <label className="block">
          <span className="meta text-muted">Email</span>
          <input name="email" type="email" required autoComplete="email" className={field} />
        </label>
      </div>
      <label className="block">
        <span className="meta text-muted">
          Organization <span className="text-faint normal-case">(optional)</span>
        </span>
        <input name="organization" autoComplete="organization" className={field} />
      </label>

      <fieldset>
        <legend className="meta text-muted">Topic</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {contactTopics.map((t) => (
            <label key={t.id} className="cursor-pointer">
              <input
                type="radio"
                name="topic"
                value={t.id}
                required
                checked={topic === t.id}
                onChange={() => setTopic(t.id)}
                className="peer sr-only"
              />
              <span className="block rounded-full border border-line px-4 py-2 text-sm text-muted transition-colors hover:border-fg peer-checked:border-accent peer-checked:bg-accent peer-checked:text-[color:var(--accent-ink)] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
                {t.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {isRag && (
        <div className="grid gap-6 rounded-lg border border-line p-5 sm:grid-cols-2">
          <p className="meta text-faint sm:col-span-2">RAG project details — optional, helps us prepare</p>
          <label className="block">
            <span className="meta text-muted">Deployment preference</span>
            <select name="deployment" defaultValue="" className={field}>
              <option value="">Select</option>
              {ragDeploymentOptions.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="meta text-muted">Document types and rough volume</span>
            <input name="volume" placeholder="e.g. ~5,000 PDFs and a Confluence space" className={field} />
          </label>
        </div>
      )}

      <label className="block">
        <span className="meta text-muted">Message</span>
        <textarea
          name="message"
          required
          minLength={10}
          rows={6}
          placeholder={
            isRag
              ? "Which documents should the system answer from, and who will use it?"
              : "What are you working on, and where could we help?"
          }
          className={field}
        />
      </label>

      {/* Honeypot */}
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-6 pt-2">
        <button type="submit" disabled={state === "sending"} className="btn btn-primary disabled:opacity-60">
          {state === "sending" ? "Sending…" : "Send message"} <span className="arrow">→</span>
        </button>
        <p aria-live="polite" className="text-sm text-muted">
          {state === "error" && (
            <>
              Something went wrong. Please write to{" "}
              <a href={`mailto:${email}`} className="link">
                {email}
              </a>
              .
            </>
          )}
          {state === "fallback" && (
            <>
              The form is unavailable right now.{" "}
              <a href={mailto} className="link">
                Open it in your email app
              </a>{" "}
              instead.
            </>
          )}
        </p>
      </div>
    </form>
  );
}
