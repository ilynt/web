import type { WorkStatus } from "@/content/types";

// A deterministic, mirrored 5×5 dot matrix derived from a work's slug: the
// entry's mark in the index. Its colour follows the work's status.
const SIZE = 5;

function hash(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function glyphCells(seed: string) {
  const h = hash(seed);
  const cells: boolean[] = [];
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const mx = x < 3 ? x : SIZE - 1 - x; // mirror around the centre column
      cells.push(((h >> (y * 3 + mx)) & 1) === 1);
    }
  }
  // Always light the centre so every glyph has an anchor.
  cells[12] = true;
  return cells;
}

const statusColor: Record<WorkStatus, string> = {
  live: "var(--accent)",
  building: "var(--amber)",
  research: "var(--blue)",
};

export function WorkGlyph({ seed, status, className = "" }: { seed: string; status: WorkStatus; className?: string }) {
  const cells = glyphCells(seed);
  let lit = 0;
  return (
    <svg viewBox="0 0 50 50" aria-hidden="true" className={`glyph ${className}`}>
      {cells.map((on, i) => {
        const cx = (i % SIZE) * 10 + 5;
        const cy = Math.floor(i / SIZE) * 10 + 5;
        return on ? (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={3.4}
            fill={statusColor[status]}
            className="glyph-dot"
            style={{ "--i": lit++ } as React.CSSProperties}
          />
        ) : (
          <circle key={i} cx={cx} cy={cy} r={1.1} fill="var(--line-strong)" />
        );
      })}
    </svg>
  );
}
