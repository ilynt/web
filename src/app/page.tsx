import Link from "next/link";
import { BriefingAnatomy } from "@/components/briefing-anatomy";
import { DispatchClock } from "@/components/dispatch-clock";
import { JsonLd } from "@/components/json-ld";
import { Pipeline } from "@/components/pipeline";
import { SectionHead } from "@/components/section-head";
import { SignalField } from "@/components/signal-field";
import { WorkIndex } from "@/components/work-index";
import { services, supporters } from "@/content/services";
import { areas, founder, site } from "@/content/site";
import { getWork, nextWorkId, statusLabel, workPath, works } from "@/content/works";
import { toIndexRows } from "@/lib/index-rows";
import { graph, workLd } from "@/lib/seo";

export default function HomePage() {
  const sinyra = getWork("sinyra")!;
  const liveCount = works.filter((w) => w.status === "live").length;

  return (
    <>
      <JsonLd data={graph(...works.map(workLd))} />

      {/* Hero */}
      <section aria-labelledby="hero-title" className="relative overflow-hidden border-b border-line">
        <SignalField className="absolute inset-y-0 right-0 w-full [mask-image:linear-gradient(to_right,transparent_0%,black_55%)] md:w-[68%] md:[mask-image:linear-gradient(to_right,transparent,black_35%,black_85%,transparent)]" />
        <div className="wrap relative flex min-h-[calc(100svh-4rem)] flex-col justify-between gap-16 pb-8 pt-20 md:pt-28">
          <div className="max-w-5xl">
            <p className="meta text-muted">Independent AI product &amp; R&amp;D studio — Türkiye</p>
            <h1 id="hero-title" className="display mt-8 text-[clamp(2.75rem,8vw,7.25rem)]">
              Ilynt Labs builds AI products, datasets and systems <span className="serif text-accent">— and ships them.</span>
            </h1>
            <p className="prose-lab mt-8 max-w-xl text-lg">
              We work on RAG, tool calling, agents, data pipelines and automation. Our first product, Sinyra, is live
              with {sinyra.stat?.value} {sinyra.stat?.label}.
              We also build AI systems for organizations.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="#work" className="btn btn-primary">
                See the work <span className="arrow">↓</span>
              </Link>
              <Link href="/solutions" className="btn">
                Work with us <span className="arrow">→</span>
              </Link>
            </div>
          </div>

          {/* Lab console: what is running right now */}
          <dl className="meta grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
            <div className="bg-bg/90 p-4 backdrop-blur">
              <dt className="text-faint">Index</dt>
              <dd className="mt-2 text-fg">
                {String(works.length).padStart(2, "0")} entries · {String(liveCount).padStart(2, "0")} live · next{" "}
                {nextWorkId()}
              </dd>
            </div>
            <div className="bg-bg/90 p-4 backdrop-blur">
              <dt className="text-faint">IL-001 Sinyra</dt>
              <dd className="mt-2 text-muted">
                <DispatchClock />
              </dd>
            </div>
            <div className="bg-bg/90 p-4 backdrop-blur">
              <dt className="text-faint">On the bench</dt>
              <dd className="mt-2 text-fg">
                {works
                  .filter((w) => w.status === "building")
                  .map((w) => w.name)
                  .join(", ")}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Featured product */}
      <section aria-labelledby="sinyra-title" className="wrap pt-28 md:pt-40">
        <div className="grid gap-16 md:grid-cols-12 md:gap-8">
          <div className="reveal md:col-span-6">
            <p className="meta flex flex-wrap items-center gap-x-4 gap-y-2 text-faint">
              <span>
                <span className="text-accent">01</span> — First product · {sinyra.id}
              </span>
              <span className="status live-dot" data-status={sinyra.status}>
                {statusLabel[sinyra.status]}
              </span>
            </p>
            <h2 id="sinyra-title" className="display mt-8 text-[clamp(3.5rem,10vw,9rem)]">
              {sinyra.name}
            </h2>
            <p className="mt-6 max-w-lg text-xl leading-snug md:text-2xl">{sinyra.tagline}</p>
            <div className="prose-lab mt-8 max-w-lg">
              <p>{sinyra.summary}</p>
              <p>{sinyra.rationale}</p>
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href={sinyra.links[0].href} className="btn btn-primary">
                {sinyra.links[0].label} <span className="arrow">↗</span>
              </a>
              <Link href={workPath(sinyra)} className="btn">
                Product details <span className="arrow">→</span>
              </Link>
            </div>
          </div>
          <div className="reveal md:col-span-5 md:col-start-8 md:pt-24">
            <BriefingAnatomy />
          </div>
        </div>

        <div className="reveal mt-24 border-t border-line pt-10">
          <h3 className="meta mb-10 text-faint">How Sinyra works</h3>
          <Pipeline steps={sinyra.steps!} />
        </div>

        <dl className="reveal mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-6">
          {sinyra.facts.map((f) => (
            <div key={f.label} className="bg-bg p-5">
              <dt className="meta text-faint">{f.label}</dt>
              <dd className="mt-3 text-lg leading-tight">{f.value}</dd>
            </div>
          ))}
        </dl>
        <p className="meta mt-4 text-faint">{sinyra.notes?.map((n) => n.text.replace(/\.$/, "")).join(" · ")}</p>
      </section>

      {/* Lab index */}
      <section id="work" aria-labelledby="work-title" className="wrap scroll-mt-20 pt-32 md:pt-44">
        <SectionHead no="02" label="Lab index" id="work-title" title="Every product, dataset and experiment gets the next number.">
          <p>
            The index is the record of what Ilynt Labs builds. Entries move from research to development to live; new
            ones are added as work starts.
          </p>
        </SectionHead>
        <div className="mt-16">
          <WorkIndex rows={toIndexRows(works)} nextId={nextWorkId()} />
        </div>
      </section>

      {/* Areas */}
      <section aria-labelledby="areas-title" className="wrap pt-32 md:pt-44">
        <SectionHead no="03" label="Areas" id="areas-title" title="What we work on" />
        <dl className="mt-16 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {areas.map((area) => {
            const related = works.filter((w) => w.areas.includes(area.id));
            return (
              <div key={area.id} className="reveal flex flex-col bg-bg p-6">
                <dt className="text-lg font-medium">{area.name}</dt>
                <dd className="mt-3 flex-1 text-sm leading-relaxed text-muted">{area.definition}</dd>
                <dd className="meta mt-6 flex gap-3 text-faint">
                  {related.length > 0 ? (
                    related.map((w) => (
                      <Link key={w.id} href={workPath(w)} className="hover:text-accent">
                        {w.id}
                      </Link>
                    ))
                  ) : (
                    <Link href="/solutions" className="hover:text-accent">
                      Solutions
                    </Link>
                  )}
                </dd>
              </div>
            );
          })}
          <div className="hidden flex-col justify-end bg-bg p-6 lg:flex">
            <Link href="/lab" className="meta text-muted hover:text-accent">
              Full lab index →
            </Link>
          </div>
        </dl>
      </section>

      {/* Solutions */}
      <section aria-labelledby="solutions-title" className="wrap pt-32 md:pt-44">
        <SectionHead
          no="04"
          label="For organizations"
          id="solutions-title"
          title={
            <>
              The same engineering, <span className="serif">built for your data.</span>
            </>
          }
        >
          <p>
            We build RAG systems, custom AI software and web applications for organizations. The pipelines behind our own
            products are the starting point.
          </p>
        </SectionHead>
        <ol className="mt-16 border-t border-line">
          {services.map((s, i) => (
            <li key={s.slug} className="reveal border-b border-line">
              <Link
                href={`/solutions/${s.slug}`}
                className="group grid gap-4 py-8 md:grid-cols-12 md:items-baseline md:gap-6 md:py-10"
              >
                <span className="meta text-faint md:col-span-1">S{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-2xl font-medium tracking-tight transition-colors group-hover:text-accent md:col-span-4 md:text-3xl">
                  {s.name}
                </h3>
                <p className="text-muted md:col-span-6">{s.tagline}</p>
                <span className="meta text-muted transition-transform group-hover:translate-x-1 md:col-span-1 md:text-right" aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ol>
        <p className="mt-8">
          <Link href="/contact?topic=enterprise-rag" className="link">
            Discuss a RAG project
          </Link>
        </p>
      </section>

      {/* Supporters — renders only when there are real entries */}
      {supporters.length > 0 && (
        <section aria-labelledby="supporters-title" className="wrap pt-32 md:pt-44">
          <SectionHead no="05" label="Supported by" id="supporters-title" title="Programs and platforms behind the lab" />
          <ul className="mt-12 flex flex-wrap gap-x-12 gap-y-6 border-t border-line pt-8">
            {supporters.map((s) => (
              <li key={s.name}>
                <a href={s.href} className="group flex items-baseline gap-3">
                  <span className="text-lg group-hover:text-accent">{s.name}</span>
                  <span className="meta text-faint">{s.relation}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* People + contact */}
      <section aria-labelledby="people-title" className="wrap pt-32 md:pt-44">
        <div className="grid gap-12 border-t border-line pt-10 md:grid-cols-12">
          <div className="md:col-span-3">
            <h2 id="people-title" className="meta text-faint">
              <span className="text-accent">{supporters.length > 0 ? "06" : "05"}</span> — Behind the work
            </h2>
          </div>
          <div className="md:col-span-4">
            <p className="text-2xl font-medium tracking-tight">{founder.name}</p>
            <p className="meta mt-2 text-muted">{founder.role}</p>
            <p className="prose-lab mt-6">
              Ilynt Labs is founded and run by {founder.name}, who designs and builds its products, datasets and client
              systems.
            </p>
            <p className="mt-6 flex gap-6">
              <a href={founder.linkedin} className="link">
                LinkedIn
              </a>
              <Link href="/about" className="link">
                About the lab
              </Link>
            </p>
          </div>
          <div className="md:col-span-5">
            <p className="display text-[clamp(2rem,4vw,3.25rem)]">
              Have a problem worth building for? <span className="serif text-accent">Write to us.</span>
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="btn btn-primary">
                Contact form <span className="arrow">→</span>
              </Link>
              <a href={`mailto:${site.email}`} className="btn">
                {site.email}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
