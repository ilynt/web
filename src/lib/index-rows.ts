import { getArea } from "@/content/site";
import type { Work } from "@/content/types";
import { kindLabel, statusLabel, workPath } from "@/content/works";
import type { IndexRow } from "@/components/work-index";

export function toIndexRows(list: Work[]): IndexRow[] {
  return list.map((w) => ({
    id: w.id,
    slug: w.slug,
    href: workPath(w),
    name: w.name,
    tagline: w.tagline,
    kind: kindLabel[w.kind],
    status: w.status,
    statusLabel: statusLabel[w.status],
    areas: w.areas.slice(0, 2).map((a) => getArea(a).name),
    facts: w.facts,
  }));
}
