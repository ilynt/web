import { renderMark } from "@/lib/mark";

// Stable PNG logo URL (/logo.png) for structured data and the web manifest.
export const dynamic = "force-static";

export function GET() {
  return renderMark(512);
}
