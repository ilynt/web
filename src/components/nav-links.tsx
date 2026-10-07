"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/lab", label: "Lab index", match: ["/lab"] },
  { href: "/products/sinyra", label: "Sinyra", match: ["/products"] },
  { href: "/solutions", label: "Solutions", match: ["/solutions"] },
  { href: "/about", label: "About", match: ["/about"] },
  { href: "/contact", label: "Contact", match: ["/contact"] },
];

export function NavLinks() {
  const pathname = usePathname();
  return (
    <nav aria-label="Primary" className="w-full md:w-auto">
      <ul className="meta flex justify-between text-muted md:justify-start md:gap-1">
        {nav.map((item) => {
          const active = item.match.some((m) => pathname === m || pathname.startsWith(`${m}/`));
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="relative block whitespace-nowrap py-2 transition-colors hover:text-fg aria-[current=page]:text-fg md:px-3"
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute -bottom-px left-0 right-0 mx-auto h-px bg-accent transition-transform duration-500 md:left-3 md:right-3 ${active ? "scale-x-100" : "scale-x-0"}`}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
