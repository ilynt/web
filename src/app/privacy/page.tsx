import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
import { founder, site } from "@/content/site";
import { breadcrumbLd, graph, pageMetadata } from "@/lib/seo";

const updated = "2026-10-14";

export const metadata = pageMetadata({
  title: "Privacy",
  description:
    "How Ilynt Labs handles personal data from the contact form, release notifications, email and website analytics, and how to exercise your rights.",
  path: "/privacy",
});

// Plain-language privacy notice. Keep it in sync with what the site actually
// does: forms in src/app/api/*, analytics in the root layout.
const sections: { id: string; title: string; body: React.ReactNode }[] = [
  {
    id: "controller",
    title: "Who is responsible",
    body: (
      <p>
        The data controller is {founder.name}, founder of {site.name}, who operates the lab and this website. Contact:{" "}
        <a href={`mailto:${site.email}`} className="link">
          {site.email}
        </a>
        .
      </p>
    ),
  },
  {
    id: "data",
    title: "What we collect and why",
    body: (
      <ul>
        <li>
          <strong>Contact form:</strong> your name, email address, organization (optional), the topic you select, your
          message and, for RAG enquiries, the optional project details you enter. Used only to reply to your enquiry and
          to discuss a possible project.
        </li>
        <li>
          <strong>Release notifications:</strong> your email address and the lab entry you asked about. Used only to
          send you one email when that entry is released.
        </li>
        <li>
          <strong>Email you send us directly:</strong> the content of your email and your address, used to reply.
        </li>
        <li>
          <strong>Website analytics:</strong> we use Vercel Web Analytics, which records aggregated page views (page,
          referrer, country, device and browser type) without cookies. Visitors are not identified across sites, and the
          anonymous session hash is discarded after 24 hours.
        </li>
        <li>
          <strong>Server logs:</strong> our hosting provider processes technical request data such as IP address and
          browser type to deliver the site and protect it from abuse.
        </li>
      </ul>
    ),
  },
  {
    id: "cookies",
    title: "Cookies",
    body: (
      <p>
        This website does not set cookies and does not use advertising or cross-site tracking. Fonts are served from our
        own domain.
      </p>
    ),
  },
  {
    id: "processors",
    title: "Service providers",
    body: (
      <>
        <p>We use the following providers to run the site and handle email:</p>
        <ul>
          <li>
            <strong>Vercel</strong> — website hosting and analytics.
          </li>
          <li>
            <strong>Resend</strong> — delivers form submissions to our inbox.
          </li>
          <li>
            <strong>Google Workspace</strong> — our email inbox.
          </li>
          <li>
            <strong>Cloudflare</strong> — DNS for our domain.
          </li>
        </ul>
        <p>
          These providers may process data on servers outside Türkiye, including in the United States. We do not sell
          personal data or share it with anyone else.
        </p>
      </>
    ),
  },
  {
    id: "retention",
    title: "How long we keep it",
    body: (
      <p>
        Enquiries and related correspondence are kept for as long as needed to respond and to keep a record of our
        communication. Release notification requests are deleted once the notification has been sent. You can ask us to
        delete your data at any time.
      </p>
    ),
  },
  {
    id: "rights",
    title: "Your rights",
    body: (
      <p>
        Under Turkish Personal Data Protection Law No. 6698 (KVKK), and where applicable the GDPR, you can ask whether
        we process your personal data, request access to it, ask for it to be corrected or deleted, learn who it was
        shared with, and object to its processing. Send your request to{" "}
        <a href={`mailto:${site.email}`} className="link">
          {site.email}
        </a>
        ; we answer within 30 days.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes",
    body: <p>If this notice changes, the date below is updated. Significant changes are noted on this page.</p>,
  },
];

export default function PrivacyPage() {
  return (
    <PageShell>
      <div className="wrap pt-16 md:pt-24">
        <JsonLd
          data={graph(
            breadcrumbLd([
              { name: "Home", path: "/" },
              { name: "Privacy", path: "/privacy" },
            ]),
          )}
        />
        <header className="max-w-4xl border-b border-line pb-16">
          <p className="meta text-faint">Legal</p>
          <h1 className="display mt-8 text-[clamp(2.75rem,6vw,5rem)]">Privacy</h1>
          <p className="prose-lab mt-8 max-w-2xl">
            What personal data this website and the lab handle, why, and how to reach us about it. Short version: we
            collect only what you send us, use it to reply, and set no cookies.
          </p>
          <p className="meta mt-6 text-faint">Last updated {updated}</p>
        </header>

        <div className="grid gap-16 pt-16 md:grid-cols-12 md:gap-8">
          <nav aria-label="On this page" className="hidden md:col-span-3 md:block">
            <ul className="meta sticky top-24 space-y-1 text-muted">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="inline-block py-1 hover:text-fg">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-14 md:col-span-8 md:col-start-5">
            {sections.map((s) => (
              <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="scroll-mt-24">
                <h2 id={`${s.id}-title`} className="text-2xl font-medium tracking-tight">
                  {s.title}
                </h2>
                <div className="prose-lab mt-4 [&_li]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">{s.body}</div>
              </section>
            ))}
            <p className="text-muted">
              Questions about a project rather than data?{" "}
              <Link href="/contact" className="link">
                Contact
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
