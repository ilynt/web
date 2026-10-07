import Link from "next/link";
import { workPath, works } from "@/content/works";

export default function NotFound() {
  return (
    <div className="wrap pt-24 md:pt-36">
      <p className="meta text-faint">404</p>
      <h1 className="display mt-8 text-[clamp(2.75rem,7vw,6rem)]">
        No entry at this address<span className="caret ml-2" aria-hidden="true" />
      </h1>
      <p className="prose-lab mt-8 max-w-lg">The page may have moved. These are the current entries in the lab index:</p>
      <ul className="mt-8 max-w-2xl border-t border-line">
        {works.map((w) => (
          <li key={w.id} className="border-b border-line">
            <Link href={workPath(w)} className="flex gap-6 py-4 hover:text-accent">
              <span className="meta pt-1 text-faint">{w.id}</span>
              {w.name}
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-10">
        <Link href="/" className="link">
          Back to home
        </Link>
      </p>
    </div>
  );
}
