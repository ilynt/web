import Link from "next/link";
import { getArea } from "@/content/site";
import type { Work } from "@/content/types";
import { kindLabel, statusLabel, workPath, works } from "@/content/works";
import { breadcrumbLd, graph, workLd } from "@/lib/seo";
import { BriefingAnatomy } from "./briefing-anatomy";
import { DispatchClock } from "./dispatch-clock";
import { JsonLd } from "./json-ld";
import { PageShell, WorkTitleTransition } from "./page-shell";
import { Pipeline } from "./pipeline";
import { WorkGlyph } from "./work-glyph";

// Optional per-entry visuals, keyed by slug.
const visuals: Record<string, React.ReactNode> = {
  sinyra: (
    <>
      <BriefingAnatomy />
      <p className="meta mt-3 text-muted">
        <DispatchClock />
      </p>
    </>
  ),
};

export function WorkDetail({ work }: { work: Work }) {
  const path = workPath(work);
  const index = works.findIndex((w) => w.id === work.id);
  const prev = works[index - 1];
  const next = works[index + 1];
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Lab index", path: "/lab" },
    { name: work.name, path },
  ];

  return (
    <PageShell>
      <article className="wrap pt-12 md:pt-16">
        <JsonLd data={graph(workLd(work), breadcrumbLd(crumbs))} />

        <nav aria-label="Breadcrumb" className="meta text-faint">
          <ol className="flex flex-wrap gap-2">
            <li>
              <Link href="/lab" className="inline-block py-1 hover:text-fg">
                Lab index
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-muted">
              {work.id}
            </li>
          </ol>
        </nav>

        <header className="mt-14 grid gap-12 border-b border-line pb-16 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="meta flex flex-wrap items-center gap-x-5 gap-y-2 text-faint">
              <span>{work.id}</span>
              <span>{kindLabel[work.kind]}</span>
              <span className={`status ${work.status === "live" ? "live-dot" : ""}`} data-status={work.status}>
                {statusLabel[work.status]}
              </span>
            </p>
            <WorkGlyph seed={work.slug} status={work.status} className="glyph-live mt-10 size-14" />
            <WorkTitleTransition slug={work.slug}>
              <h1 className="display mt-6 w-fit text-[clamp(3rem,9vw,8rem)]">{work.name}</h1>
            </WorkTitleTransition>
            <p className="mt-6 max-w-2xl text-xl leading-snug md:text-2xl">{work.tagline}</p>
            {work.links.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-3">
                {work.links.map((l, i) => (
                  <a key={l.href} href={l.href} className={`btn ${i === 0 ? "btn-primary" : ""}`}>
                    {l.label} <span className="arrow">↗</span>
                  </a>
                ))}
              </div>
            )}
          </div>
          {visuals[work.slug] && <div className="md:col-span-4 md:col-start-9">{visuals[work.slug]}</div>}
        </header>

        <div className="grid gap-16 pt-16 md:grid-cols-12 md:gap-8">
          <div className="space-y-16 md:col-span-7">
            <section aria-labelledby="what">
              <h2 id="what" className="meta mb-6 text-faint">
                What it is
              </h2>
              <div className="prose-lab">
                {work.description.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </section>
            <section aria-labelledby="why">
              <h2 id="why" className="meta mb-6 text-faint">
                Why it exists
              </h2>
              <p className="text-xl leading-relaxed">{work.rationale}</p>
            </section>
            <section aria-labelledby="who">
              <h2 id="who" className="meta mb-6 text-faint">
                Who it is for
              </h2>
              <p className="prose-lab">{work.audience}</p>
            </section>
          </div>

          <div className="md:col-span-4 md:col-start-9">
            <div className="space-y-10 md:sticky md:top-24">
              <dl className="divide-y divide-line border-y border-line">
                {work.facts.map((f) => (
                  <div key={f.label} className="flex justify-between gap-6 py-3">
                    <dt className="meta pt-0.5 text-faint">{f.label}</dt>
                    <dd className="text-right">{f.value}</dd>
                  </div>
                ))}
                <div className="flex justify-between gap-6 py-3">
                  <dt className="meta pt-0.5 text-faint">Built by</dt>
                  <dd className="text-right">
                    <Link href="/about" className="link">
                      Ilynt Labs
                    </Link>
                  </dd>
                </div>
              </dl>
              <div>
                <h2 className="meta mb-3 text-faint">Areas</h2>
                <ul className="flex flex-wrap gap-2">
                  {work.areas.map((a) => (
                    <li key={a} className="meta rounded-full border border-line px-3 py-1.5 text-muted">
                      {getArea(a).name}
                    </li>
                  ))}
                </ul>
              </div>
              {work.notes && work.notes.length > 0 && (
                <div>
                  <h2 className="meta mb-3 text-faint">Status log</h2>
                  <ul className="space-y-2 text-sm text-muted">
                    {work.notes.map((n) => (
                      <li key={n.text} className="flex gap-3">
                        <span className="meta w-16 shrink-0 text-faint">{n.date ?? "Now"}</span>
                        <span>{n.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {work.steps && (
          <section aria-labelledby="how" className="mt-24 border-t border-line pt-10">
            <h2 id="how" className="meta mb-10 text-faint">
              How it works
            </h2>
            <Pipeline steps={work.steps} />
          </section>
        )}

        <nav aria-label="Adjacent entries" className="mt-24 grid border-t border-line sm:grid-cols-2">
          {prev ? (
            <Link href={workPath(prev)} className="group py-8 sm:border-r sm:border-line sm:pr-8">
              <span className="meta text-faint">← {prev.id}</span>
              <span className="mt-2 block text-xl group-hover:text-accent">{prev.name}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={workPath(next)} className="group py-8 text-right sm:pl-8">
              <span className="meta text-faint">{next.id} →</span>
              <span className="mt-2 block text-xl group-hover:text-accent">{next.name}</span>
            </Link>
          ) : (
            <Link href="/lab" className="group py-8 text-right sm:pl-8">
              <span className="meta text-faint">Index →</span>
              <span className="mt-2 block text-xl group-hover:text-accent">All entries</span>
            </Link>
          )}
        </nav>
      </article>
    </PageShell>
  );
}
