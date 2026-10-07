// Shared types for the structured content layer.
// Pages, JSON-LD, sitemap and llms.txt are all generated from these records.

export type AreaId =
  "ai-products" | "rag" | "tool-calling" | "agents" | "data-pipelines" | "automation" | "developer-infrastructure";

export type Area = {
  id: AreaId;
  name: string;
  definition: string;
};

/** live: publicly available · building: in active development · research: exploratory */
export type WorkStatus = "live" | "building" | "research";

/** product → /products/[slug], everything else → /lab/[slug] */
export type WorkKind = "product" | "dataset" | "experiment" | "open-source";

export type Link = {
  label: string;
  href: string;
};

export type Fact = {
  label: string;
  value: string;
};

export type Work = {
  /** Sequential lab index. Never reuse or renumber. */
  id: string;
  slug: string;
  name: string;
  alternateName?: string;
  kind: WorkKind;
  status: WorkStatus;
  /** Page <title>; defaults to name. */
  seoTitle?: string;
  /** One line, shown in indexes. */
  tagline: string;
  /** One or two factual sentences. Used for meta descriptions and llms.txt. */
  summary: string;
  description: string[];
  /** Why this exists. */
  rationale: string;
  steps?: { title: string; text: string }[];
  facts: Fact[];
  /** Headline metric surfaced on the homepage. */
  stat?: { value: string; label: string; asOf: string };
  areas: AreaId[];
  audience: string;
  inLanguage: string;
  links: Link[];
  /** Short dated or undated status notes, newest first. */
  notes?: { date?: string; text: string }[];
  /** Schema.org SoftwareApplication fields, products only. */
  software?: {
    applicationCategory: string;
    operatingSystem: string;
    price: string;
    priceCurrency: string;
  };
};

export type Service = {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  description: string[];
  includes: string[];
  fit: string[];
  areas: AreaId[];
};

export type Supporter = {
  name: string;
  /** e.g. "Program", "Infrastructure", "Technology partner" */
  relation: string;
  href: string;
  /** Optional monochrome SVG in /public/supporters */
  logo?: string;
};
