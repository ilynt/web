import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { services } from "@/content/services";
import { areas, founder, site } from "@/content/site";
import { products, workPath, works } from "@/content/works";
import { absoluteUrl, breadcrumbLd, graph, ids, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About",
  description:
    "About Ilynt Labs: an independent AI product and R&D studio in Türkiye founded by Bilal Abiç. What the lab builds, who is behind it and where to find it.",
  path: "/about",
});

// Plain question/answer pairs: the most citable form of the lab's key facts.
const faq = [
  {
    q: "What is Ilynt Labs?",
    a: `${site.name} is an independent AI product and R&D studio based in Türkiye. It builds its own AI products and datasets and develops AI systems for organizations.`,
  },
  {
    q: "What does Ilynt Labs work on?",
    a: `${areas.map((a) => a.name).join(", ")}.`,
  },
  {
    q: "What products has Ilynt Labs built?",
    a: products.map((p) => `${p.name}: ${p.summary}`).join(" "),
  },
  {
    q: "What is Ilynt Labs building now?",
    a: works
      .filter((w) => w.status !== "live")
      .map((w) => `${w.name}: ${w.summary}`)
      .join(" "),
  },
  {
    q: "What does Ilynt Labs offer organizations?",
    a: services.map((s) => `${s.name} — ${s.summary}`).join(" "),
  },
  {
    q: "Who is behind Ilynt Labs?",
    a: `${site.name} was founded by ${founder.name}, who works as its ${founder.role.toLowerCase()}.`,
  },
  {
    q: "How can I contact Ilynt Labs?",
    a: `By email at ${site.email} or through the contact form at ${absoluteUrl("/contact")}.`,
  },
];

export default function AboutPage() {
  return (
    <div className="wrap pt-16 md:pt-24">
      <JsonLd
        data={graph(
          {
            "@type": "AboutPage",
            url: absoluteUrl("/about"),
            name: `About ${site.name}`,
            mainEntity: { "@id": ids.organization },
          },
          {
            "@type": "FAQPage",
            url: absoluteUrl("/about"),
            mainEntity: faq.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        )}
      />

      <header className="max-w-5xl border-b border-line pb-16">
        <p className="meta text-faint">About</p>
        <h1 className="display mt-8 text-[clamp(2.75rem,7vw,6rem)]">
          A small lab that <span className="serif text-accent">ships</span>.
        </h1>
        <div className="prose-lab mt-8 max-w-2xl">
          <p>{site.description}</p>
          <p>
            Work starts with a concrete question and a small build. Some builds become products, like{" "}
            <Link href="/products/sinyra" className="link">
              Sinyra
            </Link>
            ; some become datasets or open-source tools; some stay experiments. Everything gets a number in the{" "}
            <Link href="/lab" className="link">
              lab index
            </Link>
            .
          </p>
        </div>
      </header>

      <section id="bilal-abic" aria-labelledby="people" className="grid gap-10 border-b border-line py-16 md:grid-cols-12">
        <h2 id="people" className="meta text-faint md:col-span-3">
          People
        </h2>
        <div className="md:col-span-6">
          <p className="text-3xl font-medium tracking-tight">{founder.name}</p>
          <p className="meta mt-2 text-muted">{founder.role}</p>
          <p className="prose-lab mt-6">
            {founder.name} founded {site.name} and designs and builds its products, datasets and client systems.
          </p>
          <p className="mt-6">
            <a href={founder.linkedin} className="link">
              LinkedIn — {founder.name}
            </a>
          </p>
        </div>
      </section>

      <section aria-labelledby="facts" className="grid gap-10 border-b border-line py-16 md:grid-cols-12">
        <h2 id="facts" className="meta text-faint md:col-span-3">
          Key facts
        </h2>
        <dl className="space-y-10 md:col-span-8">
          {faq.map((f) => (
            <div key={f.q}>
              <dt className="text-xl font-medium">{f.q}</dt>
              <dd className="prose-lab mt-3">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="official" className="grid gap-10 py-16 md:grid-cols-12">
        <h2 id="official" className="meta text-faint md:col-span-3">
          Official pages
        </h2>
        <ul className="divide-y divide-line border-y border-line md:col-span-8">
          {[
            { label: "Website", href: site.url },
            { label: "GitHub", href: site.profiles.github },
            { label: "Hugging Face", href: site.profiles.huggingface },
            ...products.map((p) => ({ label: p.name, href: p.links[0].href })),
            { label: "Email", href: `mailto:${site.email}`, text: site.email },
          ].map((l) => (
            <li key={l.label} className="flex justify-between gap-6 py-4">
              <span className="meta pt-1 text-faint">{l.label}</span>
              <a href={l.href} className="link text-right">
                {"text" in l ? l.text : l.href.replace(/^https:\/\//, "")}
              </a>
            </li>
          ))}
          {products.map((p) => (
            <li key={`${p.id}-page`} className="flex justify-between gap-6 py-4">
              <span className="meta pt-1 text-faint">{p.name} on this site</span>
              <Link href={workPath(p)} className="link text-right">
                {workPath(p)}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
