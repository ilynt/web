import { services } from "@/content/services";
import { areas, founder, site } from "@/content/site";
import { kindLabel, statusLabel, workPath, works } from "@/content/works";
import { absoluteUrl } from "@/lib/seo";

// llms.txt (https://llmstxt.org): a plain-markdown map of the site for language
// models, generated from the same data layer as the pages.
export const dynamic = "force-static";

export function GET() {
  const body = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    `Founded by ${founder.name} (${founder.role}). Contact: ${site.email}.`,
    `Areas: ${areas.map((a) => a.name).join(", ")}.`,
    "",
    "## Products and lab work",
    "",
    ...works.map(
      (w) =>
        `- [${w.id} ${w.name}](${absoluteUrl(workPath(w))}): ${kindLabel[w.kind]}, ${statusLabel[w.status].toLowerCase()}. ${w.summary}` +
        (w.links[0] ? ` Official page: ${w.links[0].href}` : ""),
    ),
    "",
    "## Solutions for organizations",
    "",
    ...services.map((s) => `- [${s.name}](${absoluteUrl(`/solutions/${s.slug}`)}): ${s.summary}`),
    "",
    "## About",
    "",
    `- [About ${site.name}](${absoluteUrl("/about")}): who is behind the lab, key facts and official pages.`,
    `- [Lab index](${absoluteUrl("/lab")}): every product, dataset and experiment with its current state.`,
    `- [Contact](${absoluteUrl("/contact")}): contact form and email.`,
    "",
    "## Official profiles",
    "",
    `- GitHub: ${site.profiles.github}`,
    `- Hugging Face: ${site.profiles.huggingface}`,
    `- ${founder.name} on LinkedIn: ${founder.linkedin}`,
    "",
  ].join("\n");

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
