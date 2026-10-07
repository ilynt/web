import { notFound } from "next/navigation";
import { WorkDetail } from "@/components/work-detail";
import { products } from "@/content/works";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const work = products.find((p) => p.slug === slug);
  if (!work) return {};
  return pageMetadata({ title: work.seoTitle ?? work.name, description: work.summary, path: `/products/${slug}` });
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const work = products.find((p) => p.slug === slug);
  if (!work) notFound();
  return <WorkDetail work={work} />;
}
