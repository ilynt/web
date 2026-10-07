import Link from "next/link";
import { LogoMark } from "./logo";

export const nav = [
  { href: "/lab", label: "Lab index" },
  { href: "/products/sinyra", label: "Sinyra" },
  { href: "/solutions", label: "Solutions" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-md">
      <a
        href="#main"
        className="meta sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:bg-fg focus:px-3 focus:py-2 focus:text-bg"
      >
        Skip to content
      </a>
      <div className="wrap flex flex-wrap items-center justify-between gap-x-8 gap-y-2 py-3 md:h-16 md:py-0">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Ilynt Labs — home">
          <LogoMark className="size-6 text-fg" />
          <span className="text-[0.95rem] font-medium tracking-tight">Ilynt Labs</span>
        </Link>
        <nav aria-label="Primary" className="w-full md:w-auto">
          <ul className="meta flex justify-between text-muted md:justify-start md:gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block whitespace-nowrap rounded-full py-2 transition-colors hover:text-fg md:px-3"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
