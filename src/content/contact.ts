import { services } from "./services";

// Topics offered by the contact form. `?topic=<id>` preselects one, so pages
// can link to /contact with their context attached.
export const contactTopics = [
  ...services.map((s) => ({ id: s.slug, label: s.name })),
  { id: "sinyra", label: "Sinyra" },
  { id: "collaboration", label: "Research or open-source collaboration" },
  { id: "other", label: "Something else" },
];

export const ragDeploymentOptions = ["On-premise", "Private cloud", "Hybrid", "Not decided yet"];

export type ContactPayload = {
  name: string;
  email: string;
  organization?: string;
  topic: string;
  message: string;
  deployment?: string;
  volume?: string;
  /** Honeypot: must stay empty. */
  website?: string;
};
