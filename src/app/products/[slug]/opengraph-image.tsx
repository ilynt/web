import { products, statusLabel } from "@/content/works";
import { ogSize, renderOg } from "@/lib/og";

export const alt = "Ilynt Labs product";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const work = products.find((p) => p.slug === slug)!;
  return renderOg({ title: `${work.name} — ${work.tagline}`, meta: `${work.id} · Product`, accent: statusLabel[work.status] });
}
