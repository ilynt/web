import { PageShell } from "@/components/page-shell";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { getService, services } from "@/content/services";
import { getArea, site } from "@/content/site";
import { workPath, works } from "@/content/works";
import { breadcrumbLd, graph, pageMetadata, serviceLd } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/solutions/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return pageMetadata({ title: service.name, description: service.summary, path: `/solutions/${slug}` });
}

export default async function ServicePage({ params }: PageProps<"/solutions/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  const related = works.filter((w) => w.areas.some((a) => service.areas.includes(a)));

  return (
    <PageShell>
      <article className="wrap pt-12 md:pt-16">
        <JsonLd
          data={graph(
            serviceLd(service),
            breadcrumbLd([
              { name: "Home", path: "/" },
              { name: "Solutions", path: "/solutions" },
              { name: service.name, path: `/solutions/${slug}` },
            ]),
          )}
        />
        <nav aria-label="Breadcrumb" className="meta text-faint">
          <ol className="flex flex-wrap gap-2">
            <li>
              <Link href="/solutions" className="hover:text-fg">
                Solutions
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-muted">
              {service.name}
            </li>
          </ol>
        </nav>

        <header className="mt-14 max-w-5xl border-b border-line pb-16">
          <h1 className="display text-[clamp(2.75rem,7vw,6rem)]">{service.name}</h1>
          <p className="mt-6 max-w-2xl text-xl leading-snug md:text-2xl">{service.tagline}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href={`/contact?topic=${service.slug}`} className="btn btn-primary">
              Discuss a project <span className="arrow">→</span>
            </Link>
            <a href={`mailto:${site.email}?subject=${encodeURIComponent(service.name)}`} className="btn">
              {site.email}
            </a>
          </div>
        </header>

        <div className="grid gap-16 pt-16 md:grid-cols-12 md:gap-8">
          <section aria-labelledby="overview" className="md:col-span-7">
            <h2 id="overview" className="meta mb-6 text-faint">
              Overview
            </h2>
            <div className="prose-lab">
              {service.description.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </section>
          <div className="space-y-12 md:col-span-4 md:col-start-9">
            <section aria-labelledby="includes">
              <h2 id="includes" className="meta mb-4 text-faint">
                What we deliver
              </h2>
              <ul className="divide-y divide-line border-y border-line">
                {service.includes.map((item) => (
                  <li key={item} className="py-3">
                    {item}
                  </li>
                ))}
              </ul>
            </section>
            <section aria-labelledby="fit">
              <h2 id="fit" className="meta mb-4 text-faint">
                A good fit for
              </h2>
              <ul className="space-y-2 text-muted">
                {service.fit.map((item) => (
                  <li key={item}>— {item}</li>
                ))}
              </ul>
            </section>
            <section aria-labelledby="areas">
              <h2 id="areas" className="meta mb-4 text-faint">
                Areas
              </h2>
              <ul className="flex flex-wrap gap-2">
                {service.areas.map((a) => (
                  <li key={a} className="meta rounded-full border border-line px-3 py-1.5 text-muted">
                    {getArea(a).name}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        {related.length > 0 && (
          <section aria-labelledby="related" className="mt-24 border-t border-line pt-10">
            <h2 id="related" className="meta mb-6 text-faint">
              Related work from the lab
            </h2>
            <ul className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
              {related.map((w) => (
                <li key={w.id} className="bg-bg">
                  <Link href={workPath(w)} className="group block p-6">
                    <span className="meta text-faint">{w.id}</span>
                    <span className="mt-2 block text-xl group-hover:text-accent">{w.name}</span>
                    <span className="mt-2 block text-sm text-muted">{w.tagline}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </PageShell>
  );
}
