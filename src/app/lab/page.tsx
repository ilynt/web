import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { WorkIndex } from "@/components/work-index";
import { areas } from "@/content/site";
import { nextWorkId, statusLabel, workPath, works } from "@/content/works";
import { toIndexRows } from "@/lib/index-rows";
import { absoluteUrl, breadcrumbLd, graph, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Lab index",
  description:
    "The Ilynt Labs index: every product, dataset and experiment the lab builds, numbered in order with its current state.",
  path: "/lab",
});

export default function LabPage() {
  const counts = (["live", "building", "research"] as const).map((s) => ({
    status: s,
    count: works.filter((w) => w.status === s).length,
  }));

  return (
    <div className="wrap pt-16 md:pt-24">
      <JsonLd
        data={graph(
          {
            "@type": "CollectionPage",
            name: "Lab index",
            url: absoluteUrl("/lab"),
            mainEntity: {
              "@type": "ItemList",
              itemListElement: works.map((w, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: w.name,
                url: absoluteUrl(workPath(w)),
              })),
            },
          },
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Lab index", path: "/lab" },
          ]),
        )}
      />
      <header className="grid gap-10 border-b border-line pb-16 md:grid-cols-12">
        <div className="md:col-span-8">
          <p className="meta text-faint">Ilynt Labs — Index</p>
          <h1 className="display mt-8 text-[clamp(3rem,8vw,7rem)]">Lab index</h1>
          <p className="prose-lab mt-8 max-w-xl">
            Every product, dataset, experiment and open-source project from Ilynt Labs gets a sequential number and a
            state. Products have their own pages; datasets and experiments live in the lab.
          </p>
        </div>
        <dl className="meta grid grid-cols-3 gap-px self-end overflow-hidden rounded-lg border border-line bg-line md:col-span-4">
          {counts.map((c) => (
            <div key={c.status} className="flex flex-col bg-bg p-4">
              <dt className="status whitespace-normal" data-status={c.status}>
                {statusLabel[c.status]}
              </dt>
              <dd className="mt-auto pt-3 text-3xl font-medium tracking-tight text-fg normal-case">
                {String(c.count).padStart(2, "0")}
              </dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="mt-12">
        <WorkIndex rows={toIndexRows(works)} nextId={nextWorkId()} />
      </div>

      <section aria-labelledby="areas" className="mt-28">
        <h2 id="areas" className="meta mb-8 text-faint">
          Areas covered
        </h2>
        <ul className="flex flex-wrap gap-2">
          {areas.map((a) => (
            <li key={a.id} className="meta rounded-full border border-line px-3 py-1.5 text-muted" title={a.definition}>
              {a.name}
            </li>
          ))}
        </ul>
        <p className="mt-10 text-muted">
          Building something in these areas for your organization?{" "}
          <Link href="/solutions" className="link">
            See solutions
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
