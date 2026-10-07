import type { Service, Supporter } from "./types";

// Work for organizations. Each service has its own page and a contact topic
// (/contact?topic=<slug>) so incoming requests carry their context.
export const services: Service[] = [
  {
    slug: "enterprise-rag",
    name: "Enterprise RAG systems",
    tagline: "AI search and answers over an organization's own documents, with every answer sourced.",
    summary:
      "We build RAG systems that search an organization's internal documents, policies, contracts and knowledge bases, ground answers in that content and cite the source of every answer.",
    description: [
      "General-purpose chat models don't know an organization's internal documents and answer without sources. A RAG (retrieval-augmented generation) system first searches the organization's own content, finds the relevant passages and grounds the model's answer in them.",
      "We design each deployment around the organization's data: which sources to connect, how documents are chunked and indexed, who can access which documents, and where the system runs.",
      "When data must not leave the organization, we deliver on-premise, private cloud or hybrid deployments. Data protection requirements, including KVKK in Türkiye, are handled at the design stage.",
    ],
    includes: [
      "Connected document sources with a continuously updated index",
      "Retrieval and chunking tuned for Turkish and English content",
      "Source document and passage shown with every answer",
      "User- and role-based access control",
      "On-premise, private cloud or hybrid deployment",
      "Accuracy evaluation against real questions",
    ],
    fit: [
      "Teams searching scattered document archives",
      "Customer support and internal help desk knowledge bases",
      "Legal, compliance and HR policies",
      "Technical documentation and product knowledge",
    ],
    areas: ["rag", "data-pipelines"],
    steps: [
      { title: "Ingest", text: "Documents are pulled from connected sources and kept in sync." },
      { title: "Index", text: "Content is split into passages and indexed for search, with access rules attached." },
      { title: "Retrieve", text: "A question is matched against the passages the user is allowed to see." },
      { title: "Answer", text: "The model writes an answer using only the retrieved passages." },
      { title: "Cite", text: "Each answer links back to the source document and passage." },
    ],
  },
  {
    slug: "custom-ai-systems",
    name: "Custom AI systems",
    tagline: "AI software that runs a specific business process, uses tools and produces measurable output.",
    summary:
      "We build AI software that connects to an organization's existing systems and automates a specific process with tool calling and agent workflows.",
    description: [
      "Every organization needs something different from AI: classifying documents, producing reports, routing requests, extracting data or taking actions in internal systems.",
      "We build these as software that connects to the organization's APIs, databases and business tools, logs what it does at each step, and asks for human approval where needed.",
      "The collect, classify, score and summarize pipeline behind Sinyra is one example of this kind of process.",
    ],
    includes: [
      "Process analysis and model selection",
      "Integration with internal systems and APIs through tool calling",
      "Multi-step agent workflows",
      "Scheduled data pipelines and reporting",
      "Action logs and human-approval steps",
    ],
    fit: [
      "Teams automating repetitive knowledge work",
      "Processes that need regular monitoring and reporting",
      "Work that extracts structured information from unstructured data",
    ],
    areas: ["agents", "tool-calling", "automation", "data-pipelines"],
    relatedWorks: ["sinyra", "turkish-tool-calling-dataset"],
  },
  {
    slug: "web-and-app-development",
    name: "Web and application development",
    tagline: "Web applications, dashboards and websites — with AI features where they help.",
    summary:
      "We build custom web applications, admin dashboards and websites for organizations, with AI features where they are useful.",
    description: [
      "An AI system is only as useful as the interface people use it through. In RAG and automation projects we build the interface, admin panel and integrations alongside the system.",
      "We also take on web application and website projects without an AI component, held to the same engineering standard.",
    ],
    includes: [
      "Web applications and admin dashboards",
      "Company websites",
      "API and backend development",
      "Adding AI features to existing products",
    ],
    fit: [
      "RAG or automation systems that need an interface",
      "A new digital product or internal tool",
      "Teams adding AI features to an existing product",
    ],
    areas: ["ai-products", "developer-infrastructure"],
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}

// Organizations, programs and platforms that support Ilynt Labs.
// The homepage section renders only when this list is non-empty.
export const supporters: Supporter[] = [];
