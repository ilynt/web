import { renderOg, ogSize } from "@/lib/og";

export const alt = "Ilynt Labs — Independent AI product and R&D studio";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOg({
    title: "AI products, datasets and systems — shipped.",
    meta: "Independent AI product & R&D studio",
    accent: "ilyntlabs.com",
  });
}
