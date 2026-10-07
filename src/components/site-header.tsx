import Link from "next/link";
import { LogoMark } from "./logo";
import { NavLinks } from "./nav-links";

export function SiteHeader() {
  return (
    <header
      className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-md"
      style={{ viewTransitionName: "site-header" }}
    >
      <a
        href="#main"
        className="meta sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:bg-fg focus:px-3 focus:py-2 focus:text-bg"
      >
        Skip to content
      </a>
      <div className="wrap flex flex-wrap items-center justify-between gap-x-8 gap-y-2 py-3 md:h-16 md:py-0">
        <Link href="/" className="group flex items-center gap-2.5" aria-label="Ilynt Labs — home">
          <LogoMark className="size-6 text-fg transition-transform duration-500 group-hover:rotate-[-18deg]" />
          <span className="text-[0.95rem] font-medium tracking-tight">Ilynt Labs</span>
        </Link>
        <NavLinks />
      </div>
    </header>
  );
}
