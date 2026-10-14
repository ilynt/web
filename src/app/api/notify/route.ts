import { works } from "@/content/works";
import { clean, isEmail, line, mailResponse, rateLimited, sendMail } from "@/lib/mail";

// "Tell me when it ships" requests for lab entries that are not live yet.
// Each request is emailed to the lab inbox; there is no stored list.
export async function POST(request: Request) {
  let body: { email?: unknown; work?: unknown; website?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  if (clean(body.website, 200)) return Response.json({ ok: true });
  if (rateLimited(request)) return Response.json({ error: "rate_limited" }, { status: 429 });

  const email = line(body.email, 200);
  const work = works.find((w) => w.slug === line(body.work, 120) && w.status !== "live");
  if (!isEmail(email) || !work) return Response.json({ error: "invalid_fields" }, { status: 422 });

  const text = [
    `Release notification request`,
    `Entry: ${work.id} ${work.name}`,
    `Email: ${email}`,
    "",
    "Reply to this email when the entry is released.",
  ].join("\n");

  return mailResponse(
    await sendMail({ subject: `Release notification — ${work.id} ${work.name}`, text, replyTo: email }),
  );
}
