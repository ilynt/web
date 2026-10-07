import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

// Search engines and AI crawlers are welcome: the site exists to be found and cited.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
