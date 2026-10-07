import { contactTopics, type ContactPayload } from "@/content/contact";
import { site } from "@/content/site";

// Sends contact form submissions through Resend's REST API.
// Required env: RESEND_API_KEY, CONTACT_FROM_EMAIL. Optional: CONTACT_TO_EMAIL.

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  let body: Partial<ContactPayload>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  // Bots fill every field; pretend success.
  if (clean(body.website, 200)) return Response.json({ ok: true });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) return Response.json({ error: "rate_limited" }, { status: 429 });

  const data = {
    name: clean(body.name, 120),
    email: clean(body.email, 200),
    organization: clean(body.organization, 160),
    topic: clean(body.topic, 60),
    message: clean(body.message, 5000),
    deployment: clean(body.deployment, 60),
    volume: clean(body.volume, 120),
  };

  const topic = contactTopics.find((t) => t.id === data.topic);
  if (!data.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || !topic || data.message.length < 10) {
    return Response.json({ error: "invalid_fields" }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !from) return Response.json({ error: "not_configured" }, { status: 503 });

  const lines = [
    `Topic: ${topic.label}`,
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    !!data.organization && `Organization: ${data.organization}`,
    !!data.deployment && `Deployment preference: ${data.deployment}`,
    !!data.volume && `Document volume: ${data.volume}`,
    "",
    data.message,
  ].filter((l) => l !== false);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: process.env.CONTACT_TO_EMAIL || site.email,
      reply_to: data.email,
      subject: `[ilyntlabs.com] ${topic.label} — ${data.name}`,
      text: lines.join("\n"),
    }),
  });

  if (!res.ok) return Response.json({ error: "send_failed" }, { status: 502 });
  return Response.json({ ok: true });
}
