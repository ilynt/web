import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { services } from "@/content/services";
import { breadcrumbLd, graph, pageMetadata, serviceLd } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "AI solutions for organizations",
  description:
    "Ilynt Labs builds enterprise RAG systems, custom AI software with tool calling and agents, and web applications for organizations.",
  path: "/solutions",
});

export default function SolutionsPage() {
  return (
    <div className="wrap pt-16 md:pt-24">
      <JsonLd
        data={graph(
          ...services.map(serviceLd),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Solutions", path: "/solutions" },
          ]),
        )}
      />
      <header className="max-w-4xl border-b border-line pb-16">
        <p className="meta text-faint">Ilynt Labs — For organizations</p>
        <h1 className="display mt-8 text-[clamp(2.75rem,7vw,6rem)]">
          AI systems built <span className="serif text-accent">for your data</span> and your processes.
        </h1>
        <p className="prose-lab mt-8 max-w-2xl">
          We build the same kind of pipelines that run our own products — retrieval, classification, tool calling,
          scheduled automation — for organizations, around their documents, systems and data protection requirements.
        </p>
      </header>

      <ol>
        {services.map((s, i) => (
          <li key={s.slug} className="border-b border-line">
            <article className="grid gap-8 py-14 md:grid-cols-12">
              <p className="meta text-faint md:col-span-1">S{String(i + 1).padStart(2, "0")}</p>
              <div className="md:col-span-5">
                <h2 className="text-3xl font-medium tracking-tight md:text-4xl">
                  <Link href={`/solutions/${s.slug}`} className="hover:text-accent">
                    {s.name}
                  </Link>
                </h2>
                <p className="prose-lab mt-4">{s.summary}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href={`/solutions/${s.slug}`} className="btn">
                    Details <span className="arrow">→</span>
                  </Link>
                  <Link href={`/contact?topic=${s.slug}`} className="btn">
                    Get in touch <span className="arrow">→</span>
                  </Link>
                </div>
              </div>
              <ul className="space-y-3 text-muted md:col-span-5 md:col-start-8">
                {s.includes.map((item) => (
                  <li key={item} className="flex gap-3 border-b border-line pb-3">
                    <span aria-hidden="true" className="text-accent">
                      +
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}
