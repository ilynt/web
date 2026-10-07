import Link from "next/link";
import { founder, site } from "@/content/site";
import { services } from "@/content/services";
import { statusLabel, workPath, works } from "@/content/works";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-32 border-t border-line" style={{ viewTransitionName: "site-footer" }}>
      <div className="wrap grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="max-w-sm text-muted">{site.shortDescription}</p>
          <a href={`mailto:${site.email}`} className="link mt-6 inline-block text-lg">
            {site.email}
          </a>
        </div>

        <nav aria-label="Lab index" className="md:col-span-3">
          <h2 className="meta mb-4 text-faint">Lab index</h2>
          <ul className="space-y-2">
            {works.map((w) => (
              <li key={w.id} className="flex items-baseline gap-3">
                <span className="meta text-faint">{w.id}</span>
                <Link href={workPath(w)} className="hover:text-accent">
                  {w.name}
                </Link>
                <span className="sr-only">({statusLabel[w.status]})</span>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Solutions" className="md:col-span-3">
          <h2 className="meta mb-4 text-faint">Solutions</h2>
          <ul className="space-y-2">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/solutions/${s.slug}`} className="hover:text-accent">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-2">
          <h2 className="meta mb-4 text-faint">Elsewhere</h2>
          <ul className="space-y-2">
            <li>
              <a href={site.profiles.github} className="hover:text-accent" rel="me">
                GitHub
              </a>
            </li>
            <li>
              <a href={site.profiles.huggingface} className="hover:text-accent" rel="me">
                Hugging Face
              </a>
            </li>
            <li>
              <a href={founder.linkedin} className="hover:text-accent">
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="wrap overflow-hidden">
        {/* Decorative wordmark drawn as SVG so it is not treated as body text. */}
        <svg aria-hidden="true" viewBox="0 0 1000 178" className="block w-full select-none">
          <text
            x="0"
            y="150"
            textLength="1000"
            lengthAdjust="spacingAndGlyphs"
            fill="#181817"
            style={{ font: "500 205px var(--font-geist-sans)", letterSpacing: "-0.035em" }}
          >
            ilynt labs
          </text>
        </svg>
      </div>

      <div className="wrap meta flex flex-wrap justify-between gap-4 border-t border-line py-6 text-faint">
        <p>
          © {year} {site.legalName}
        </p>
        <p className="flex gap-6">
          <Link href="/about" className="hover:text-fg">
            About
          </Link>
          <a href="/llms.txt" className="hover:text-fg">
            llms.txt
          </a>
          <a href="/sitemap.xml" className="hover:text-fg">
            Sitemap
          </a>
        </p>
      </div>
    </footer>
  );
}
