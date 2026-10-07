import type { MetadataRoute } from "next";
import { services } from "@/content/services";
import { workPath, works } from "@/content/works";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    ...works.map((w) => ({ path: workPath(w), priority: w.kind === "product" ? 0.9 : 0.7 })),
    { path: "/lab", priority: 0.8 },
    { path: "/solutions", priority: 0.8 },
    ...services.map((s) => ({ path: `/solutions/${s.slug}`, priority: 0.7 })),
    { path: "/about", priority: 0.6 },
    { path: "/contact", priority: 0.5 },
  ];
  return pages.map((p) => ({ url: absoluteUrl(p.path), changeFrequency: "weekly", priority: p.priority }));
}
