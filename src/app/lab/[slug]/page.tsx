import { notFound } from "next/navigation";
import { WorkDetail } from "@/components/work-detail";
import { labWorks } from "@/content/works";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return labWorks.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: PageProps<"/lab/[slug]">) {
  const { slug } = await params;
  const work = labWorks.find((w) => w.slug === slug);
  if (!work) return {};
  return pageMetadata({ title: work.seoTitle ?? work.name, description: work.summary, path: `/lab/${slug}` });
}

export default async function LabEntryPage({ params }: PageProps<"/lab/[slug]">) {
  const { slug } = await params;
  const work = labWorks.find((w) => w.slug === slug);
  if (!work) notFound();
  return <WorkDetail work={work} />;
}
