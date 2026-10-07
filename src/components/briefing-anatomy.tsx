import { InView } from "./in-view";
import { SpatialTilt } from "./spatial-tilt";

// Schematic of a Sinyra email: structure only, no real or invented headlines.
const rows = [
  { label: "Product launch", score: 94, width: "82%" },
  { label: "Model update", score: 81, width: "68%" },
  { label: "Product launch", score: 72, width: "74%" },
];

export function BriefingAnatomy() {
  return (
    <InView as="figure" className="relative" threshold={0.35}>
      <SpatialTilt>
        <div
          className="rounded-xl border border-line bg-raised p-5 shadow-[0_40px_120px_-40px_rgb(200_245_60/0.18)] md:p-7"
          aria-hidden="true"
        >
          <div className="flex items-center justify-between border-b border-line pb-4">
            <span className="font-medium">Sinyra</span>
            <span className="meta text-faint">Weekday · 18:00</span>
          </div>
          <ul className="mt-2">
            {rows.map((row, i) => (
              <li
                key={i}
                className="feed-row flex gap-4 border-b border-line py-5 last:border-b-0"
                style={{ "--r": i } as React.CSSProperties}
              >
                <span className="meta flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-line text-base text-accent">
                  {row.score}
                </span>
                <span className="flex-1">
                  <span className="meta block text-faint">{row.label}</span>
                  <span className="feed-bar mt-2 block h-2.5 rounded-full bg-fg/80" style={{ width: row.width }} />
                  <span className="feed-bar mt-2 block h-2 w-11/12 rounded-full bg-fg/15" />
                  <span className="feed-bar mt-1.5 block h-2 w-2/3 rounded-full bg-fg/15" />
                  <span className="meta mt-3 block text-faint">Source ↗</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </SpatialTilt>
      <figcaption className="meta mt-6 text-faint">
        Briefing structure — impact score, category, Turkish summary, source link.
      </figcaption>
    </InView>
  );
}
