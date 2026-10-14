import { contactTopics, type ContactPayload } from "@/content/contact";
import { clean, isEmail, line, mailResponse, rateLimited, sendMail } from "@/lib/mail";

// Contact form submissions → email to the lab inbox (see src/lib/mail.ts).
export async function POST(request: Request) {
  let body: Partial<ContactPayload>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  // Bots fill every field; pretend success.
  if (clean(body.website, 200)) return Response.json({ ok: true });
  if (rateLimited(request)) return Response.json({ error: "rate_limited" }, { status: 429 });

  const data = {
    name: line(body.name, 120),
    email: line(body.email, 200),
    organization: line(body.organization, 160),
    topic: line(body.topic, 60),
    message: clean(body.message, 5000),
    deployment: line(body.deployment, 60),
    volume: line(body.volume, 120),
  };

  const topic = contactTopics.find((t) => t.id === data.topic);
  if (!data.name || !isEmail(data.email) || !topic || data.message.length < 10) {
    return Response.json({ error: "invalid_fields" }, { status: 422 });
  }

  const text = [
    `Topic: ${topic.label}`,
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    !!data.organization && `Organization: ${data.organization}`,
    !!data.deployment && `Deployment preference: ${data.deployment}`,
    !!data.volume && `Document volume: ${data.volume}`,
    "",
    data.message,
  ]
    .filter((l) => l !== false)
    .join("\n");

  return mailResponse(await sendMail({ subject: `${topic.label} — ${data.name}`, text, replyTo: data.email }));
}
