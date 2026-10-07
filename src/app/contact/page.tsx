import { PageShell } from "@/components/page-shell";
import { Suspense } from "react";
import { ContactForm } from "@/components/contact-form";
import { JsonLd } from "@/components/json-ld";
import { founder, site } from "@/content/site";
import { absoluteUrl, breadcrumbLd, graph, ids, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact",
  description: `Contact Ilynt Labs about enterprise RAG systems, custom AI software, web development or the lab's products. Email ${site.email}.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <PageShell>
      <div className="wrap pt-16 md:pt-24">
        <JsonLd
          data={graph(
            {
              "@type": "ContactPage",
              url: absoluteUrl("/contact"),
              name: `Contact ${site.name}`,
              about: { "@id": ids.organization },
            },
            breadcrumbLd([
              { name: "Home", path: "/" },
              { name: "Contact", path: "/contact" },
            ]),
          )}
        />
        <div className="grid gap-16 md:grid-cols-12 md:gap-8">
          <header className="md:col-span-5">
            <p className="meta text-faint">Contact</p>
            <h1 className="display mt-8 text-[clamp(2.75rem,6vw,5.5rem)]">
              Tell us what <span className="serif text-accent">you&apos;re building.</span>
            </h1>
            <p className="prose-lab mt-8 max-w-md">
              Projects, product questions or collaborations. Messages go directly to {founder.name}.
            </p>
            <dl className="mt-12 divide-y divide-line border-y border-line">
              <div className="flex justify-between gap-6 py-4">
                <dt className="meta pt-1 text-faint">Email</dt>
                <dd>
                  <a href={`mailto:${site.email}`} className="link">
                    {site.email}
                  </a>
                </dd>
              </div>
              <div className="flex justify-between gap-6 py-4">
                <dt className="meta pt-1 text-faint">Languages</dt>
                <dd>English, Turkish</dd>
              </div>
              <div className="flex justify-between gap-6 py-4">
                <dt className="meta pt-1 text-faint">Based in</dt>
                <dd>Türkiye</dd>
              </div>
            </dl>
          </header>
          <div className="md:col-span-6 md:col-start-7 md:pt-4">
            <Suspense fallback={<div className="h-[640px]" />}>
              <ContactForm email={site.email} />
            </Suspense>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
