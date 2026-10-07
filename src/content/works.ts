import type { Work } from "./types";

// The lab index. Add new entries at the end with the next sequential id.
// Status changes (building → live) are the main way the site shows momentum.
export const works: Work[] = [
  {
    id: "IL-001",
    slug: "sinyra",
    name: "Sinyra",
    alternateName: "Sinyra Labs",
    kind: "product",
    status: "live",
    seoTitle: "Sinyra — Daily AI product launch briefing in Turkish",
    tagline: "Every weekday evening, the day's AI product launches — summarized in Turkish.",
    summary:
      "Sinyra is a free daily briefing that monitors 50+ sources, ranks AI product launches and model updates by impact, and emails Turkish-language summaries every weekday at 18:00 (Türkiye time).",
    description: [
      "Sinyra tracks announcements from companies such as OpenAI, Google DeepMind, Anthropic, Meta AI, xAI, Mistral, Microsoft, AWS and GitHub, along with publications such as TechCrunch, The Verge and MIT Technology Review.",
      "Each collected item is classified by a language model and given an impact score from 0 to 100. Only real product launches and model updates make it into the briefing; funding news and speculation are filtered out.",
      "The selected stories are condensed into short Turkish summaries, each with a link to its source, and sent to subscribers as a single email every weekday at 18:00.",
    ],
    rationale:
      "Dozens of AI announcements ship every day, most of them in English. For teams that need to follow the ecosystem and their competitors, the real work is separating what actually shipped from the noise. Sinyra automates that filtering and delivers the result once a day, in Turkish, with sources.",
    steps: [
      { title: "Collect", text: "50+ company blogs, release notes and tech publications are scanned daily." },
      { title: "Classify", text: "A language model labels each item as a product launch, model update or out of scope." },
      { title: "Score", text: "Launches receive an impact score from 0 to 100 and are ranked." },
      { title: "Summarize", text: "Selected stories are summarized in Turkish with a source link." },
      { title: "Deliver", text: "The briefing is emailed every weekday at 18:00." },
    ],
    facts: [
      { label: "Delivery", value: "Weekdays, 18:00 (TRT)" },
      { label: "Channel", value: "Email" },
      { label: "Sources", value: "50+ companies and publications" },
      { label: "Language", value: "Turkish" },
      { label: "Price", value: "Free" },
      { label: "Active subscribers", value: "87 (Oct 2026)" },
    ],
    stat: { value: "87", label: "active subscribers", asOf: "2026-10" },
    areas: ["ai-products", "data-pipelines", "automation"],
    audience:
      "Product teams, developers and managers who need to follow the AI ecosystem and their competitors' product moves.",
    inLanguage: "tr",
    links: [{ label: "Subscribe to Sinyra", href: "https://sinyra.bilalabic.com" }],
    notes: [
      { text: "Mobile app in development." },
      { date: "2026-10", text: "Reached 87 active subscribers." },
    ],
    software: {
      applicationCategory: "NewsApplication",
      operatingSystem: "Web, Email",
      price: "0",
      priceCurrency: "USD",
    },
  },
  {
    id: "IL-002",
    slug: "turkish-tool-calling-dataset",
    name: "Turkish tool-calling dataset",
    kind: "dataset",
    status: "building",
    tagline: "Training and evaluation data for models that call tools from Turkish requests.",
    summary:
      "A generation pipeline that produces examples mapping Turkish user requests to correct function calls, for training and evaluating the tool-calling ability of language models in Turkish.",
    description: [
      "Tool calling is a language model's ability to pick the right tool for a request and call it with valid arguments. Most training and evaluation data for this is in English.",
      "We are building a pipeline that generates examples made of a Turkish request, a set of function definitions and the expected call. Each example is checked for structural and argument correctness before it enters the dataset.",
      "The dataset will be published under the Ilynt Labs organization on Hugging Face.",
    ],
    rationale:
      "Building agents and automation for Turkish-speaking users requires models that call tools reliably from Turkish input. Measuring and improving that needs Turkish-specific data.",
    facts: [
      { label: "Type", value: "Dataset and generation pipeline" },
      { label: "Language", value: "Turkish" },
      { label: "Published on", value: "Hugging Face · ilynt" },
    ],
    areas: ["tool-calling", "agents", "data-pipelines", "developer-infrastructure"],
    audience:
      "Developers and researchers who train, fine-tune or evaluate Turkish language models and agent systems.",
    inLanguage: "tr",
    links: [{ label: "Ilynt Labs on Hugging Face", href: "https://huggingface.co/ilynt" }],
    notes: [{ text: "Generation pipeline and quality checks in development." }],
  },
];

export const products = works.filter((w) => w.kind === "product");
export const labWorks = works.filter((w) => w.kind !== "product");

export function getWork(slug: string) {
  return works.find((w) => w.slug === slug);
}

export function workPath(work: Work) {
  return work.kind === "product" ? `/products/${work.slug}` : `/lab/${work.slug}`;
}

export function nextWorkId() {
  return `IL-${String(works.length + 1).padStart(3, "0")}`;
}

export const statusLabel: Record<Work["status"], string> = {
  live: "Live",
  building: "In development",
  research: "Research",
};

export const kindLabel: Record<Work["kind"], string> = {
  product: "Product",
  dataset: "Dataset",
  experiment: "Experiment",
  "open-source": "Open source",
};
