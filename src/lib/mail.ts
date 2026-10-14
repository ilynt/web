import { site } from "@/content/site";

// Shared helpers for the form endpoints (contact, release notifications).
// Mail goes through Resend's REST API. Required env: RESEND_API_KEY,
// CONTACT_FROM_EMAIL. Optional: CONTACT_TO_EMAIL (defaults to site.email).

export const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
/** Single-line fields end up in subjects and headers: strip line breaks. */
export const line = (v: unknown, max: number) => clean(v, max).replace(/[\r\n]+/g, " ");
export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

/** Best-effort, per-instance rate limit keyed by client IP. */
export function rateLimited(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

export async function sendMail({
  subject,
  text,
  replyTo,
}: {
  subject: string;
  text: string;
  replyTo: string;
}): Promise<"ok" | "not_configured" | "failed"> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !from) return "not_configured";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: process.env.CONTACT_TO_EMAIL || site.email,
      reply_to: replyTo,
      subject: `[ilyntlabs.com] ${subject}`,
      text,
    }),
  });
  return res.ok ? "ok" : "failed";
}

export function mailResponse(result: Awaited<ReturnType<typeof sendMail>>) {
  if (result === "ok") return Response.json({ ok: true });
  if (result === "not_configured") return Response.json({ error: "not_configured" }, { status: 503 });
  return Response.json({ error: "send_failed" }, { status: 502 });
}
