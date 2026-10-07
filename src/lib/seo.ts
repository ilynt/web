import type { Metadata } from "next";
import { founder, site } from "@/content/site";
import type { Service, Work } from "@/content/types";
import { workPath } from "@/content/works";

export const absoluteUrl = (path = "/") => new URL(path, site.url).toString();

export const ids = {
  organization: `${site.url}/#organization`,
  website: `${site.url}/#website`,
  founder: `${site.url}/about#bilal-abic`,
};

export function pageMetadata({
  title,
  description,
  path,
}: {
  title?: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: site.locale,
      url: path,
      title: title ? `${title} · ${site.name}` : site.name,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: title ? `${title} · ${site.name}` : site.name,
      description,
    },
  };
}

type Json = Record<string, unknown>;

export function organizationLd(): Json {
  return {
    "@type": "Organization",
    "@id": ids.organization,
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    logo: absoluteUrl("/logo.png"),
    email: site.email,
    description: site.description,
    foundingLocation: { "@type": "Country", name: "Türkiye" },
    founder: { "@id": ids.founder },
    sameAs: [site.profiles.github, site.profiles.huggingface],
    contactPoint: {
      "@type": "ContactPoint",
      email: site.email,
      contactType: "sales",
      availableLanguage: ["tr", "en"],
      url: absoluteUrl("/contact"),
    },
  };
}

export function founderLd(): Json {
  return {
    "@type": "Person",
    "@id": ids.founder,
    name: founder.name,
    jobTitle: founder.role,
    worksFor: { "@id": ids.organization },
    sameAs: [founder.linkedin],
  };
}

export function websiteLd(): Json {
  return {
    "@type": "WebSite",
    "@id": ids.website,
    url: site.url,
    name: site.name,
    inLanguage: site.lang,
    publisher: { "@id": ids.organization },
  };
}

export function workLd(work: Work): Json {
  const url = absoluteUrl(workPath(work));
  if (work.software) {
    return {
      "@type": "SoftwareApplication",
      "@id": `${url}#software`,
      name: work.name,
      alternateName: work.alternateName,
      url: work.links[0]?.href ?? url,
      mainEntityOfPage: url,
      description: work.summary,
      applicationCategory: work.software.applicationCategory,
      operatingSystem: work.software.operatingSystem,
      inLanguage: work.inLanguage,
      audience: { "@type": "Audience", audienceType: work.audience },
      offers: {
        "@type": "Offer",
        price: work.software.price,
        priceCurrency: work.software.priceCurrency,
      },
      creator: { "@id": ids.organization },
      publisher: { "@id": ids.organization },
    };
  }
  // Only published datasets are described as schema.org Datasets.
  if (work.kind === "dataset" && work.status === "live") {
    return {
      "@type": "Dataset",
      "@id": `${url}#dataset`,
      name: work.name,
      url,
      description: work.summary,
      inLanguage: work.inLanguage,
      creator: { "@id": ids.organization },
    };
  }
  return {
    "@type": "CreativeWork",
    "@id": `${url}#work`,
    name: work.name,
    url,
    description: work.summary,
    inLanguage: work.inLanguage,
    creativeWorkStatus: work.status === "live" ? "Published" : "In development",
    creator: { "@id": ids.organization },
  };
}

export function serviceLd(service: Service): Json {
  const url = absoluteUrl(`/solutions/${service.slug}`);
  return {
    "@type": "Service",
    "@id": `${url}#service`,
    name: service.name,
    url,
    description: service.summary,
    serviceType: service.name,
    provider: { "@id": ids.organization },
    areaServed: { "@type": "Country", name: "Türkiye" },
    availableLanguage: ["tr", "en"],
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]): Json {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** Wraps nodes into a single @graph document. */
export function graph(...nodes: Json[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}
