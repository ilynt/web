import { kindLabel, labWorks, statusLabel } from "@/content/works";
import { ogSize, renderOg } from "@/lib/og";

export const alt = "Ilynt Labs lab entry";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return labWorks.map((w) => ({ slug: w.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const work = labWorks.find((w) => w.slug === slug)!;
  return renderOg({ title: work.name, meta: `${work.id} · ${kindLabel[work.kind]}`, accent: statusLabel[work.status] });
}
