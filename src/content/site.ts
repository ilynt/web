import type { Area } from "./types";

export const site = {
  name: "Ilynt Labs",
  legalName: "ILYNT Labs",
  url: "https://ilyntlabs.com",
  locale: "en_US",
  lang: "en",
  email: "bilal@ilyntlabs.com",
  description:
    "Ilynt Labs is an independent AI product and R&D studio based in Türkiye. It builds AI products, RAG systems, Turkish tool-calling datasets and custom AI software for organizations.",
  shortDescription:
    "Independent AI product and R&D studio building AI products, RAG systems and developer infrastructure.",
  profiles: {
    github: "https://github.com/ilynt",
    huggingface: "https://huggingface.co/ilynt",
  },
} as const;

export const founder = {
  name: "Bilal Abiç",
  role: "Founder & Developer",
  linkedin: "https://www.linkedin.com/in/bilalabic/",
} as const;

export const areas: Area[] = [
  {
    id: "ai-products",
    name: "AI products",
    definition: "Turning language models into end-user software that does one specific job from start to finish.",
  },
  {
    id: "rag",
    name: "RAG",
    definition:
      "Retrieval-augmented generation: grounding model answers in an organization's own documents, with sources shown.",
  },
  {
    id: "tool-calling",
    name: "Tool calling",
    definition:
      "Getting models to call APIs and functions with the right arguments, and producing the data to train and evaluate that.",
  },
  {
    id: "agents",
    name: "Agents",
    definition: "Multi-step workflows that plan, use tools and report results in a way that can be checked.",
  },
  {
    id: "data-pipelines",
    name: "Data pipelines",
    definition: "Scheduled processes that collect, clean, classify and prepare data from many sources for models.",
  },
  {
    id: "automation",
    name: "Automation",
    definition:
      "Turning repetitive knowledge work into scheduled, observable processes with human approval where it matters.",
  },
  {
    id: "developer-infrastructure",
    name: "Developer infrastructure",
    definition: "Reusable tooling and open-source components for data generation, model evaluation and deployment.",
  },
];

export function getArea(id: Area["id"]) {
  return areas.find((a) => a.id === id)!;
}
