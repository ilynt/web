import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
import { WorkGlyph } from "@/components/work-glyph";
import { changelog } from "@/content/changelog";
import { getWork, workPath } from "@/content/works";
import { breadcrumbLd, graph, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Changelog",
  description: "A dated record of what Ilynt Labs has shipped: products, datasets, releases and changes to the lab.",
  path: "/changelog",
});

const monthName = (date: string) =>
  new Date(`${date.slice(0, 7)}-01T00:00:00Z`).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

export default function ChangelogPage() {
  const months = [...new Set(changelog.map((e) => e.date.slice(0, 7)))];

  return (
    <PageShell>
      <div className="wrap pt-16 md:pt-24">
        <JsonLd
          data={graph(
            breadcrumbLd([
              { name: "Home", path: "/" },
              { name: "Changelog", path: "/changelog" },
            ]),
          )}
        />
        <header className="max-w-4xl border-b border-line pb-16">
          <p className="meta text-faint">Ilynt Labs — Changelog</p>
          <h1 className="display mt-8 text-[clamp(3rem,8vw,7rem)]">Changelog</h1>
          <p className="prose-lab mt-8 max-w-xl">
            What shipped, and when. Releases, status changes and milestones across the{" "}
            <Link href="/lab" className="link">
              lab index
            </Link>
            .
          </p>
        </header>

        {months.map((month) => (
          <section
            key={month}
            aria-labelledby={`m-${month}`}
            className="grid gap-6 border-b border-line py-12 md:grid-cols-12"
          >
            <h2 id={`m-${month}`} className="meta text-faint md:col-span-3">
              {monthName(month)}
            </h2>
            <ol className="space-y-8 md:col-span-8">
              {changelog
                .filter((e) => e.date.startsWith(month))
                .map((e) => {
                  const work = e.work ? getWork(e.work) : undefined;
                  return (
                    <li key={e.date + e.text} className="grid grid-cols-[5.5rem_1fr] gap-4">
                      <time dateTime={e.date} className="meta pt-1 text-faint">
                        {e.date.length > 7 ? e.date.slice(8) + " " + monthName(e.date).slice(0, 3) : "—"}
                      </time>
                      <div>
                        <p className="text-lg leading-snug">{e.text}</p>
                        {work && (
                          <Link
                            href={workPath(work)}
                            className="meta mt-2 inline-flex items-center gap-2 py-1 text-muted hover:text-accent"
                          >
                            <WorkGlyph seed={work.slug} status={work.status} className="size-4" />
                            {work.id} {work.name}
                          </Link>
                        )}
                      </div>
                    </li>
                  );
                })}
            </ol>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
