# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

Package manager is `pnpm` (see `packageManager` in `package.json`).

```sh
pnpm dev            # dev server (Turbopack)
pnpm build          # production build; prerenders every page statically
pnpm start          # serve the production build
pnpm lint           # ESLint (flat config, eslint-config-next)
pnpm exec tsc --noEmit   # type-check; run `pnpm exec next typegen` first on a clean checkout (generates PageProps types)
```

There is no test suite. Verify changes with `pnpm lint`, `tsc`, `pnpm build`, and by checking pages in a browser at desktop and mobile widths.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 (CSS-first config in `src/app/globals.css`, no `tailwind.config`). Next 16 differs from older versions (async `params`, `proxy` instead of `middleware`, etc.) — read `node_modules/next/dist/docs/` before using an unfamiliar API.

## Architecture

**Everything is driven by the content layer in `src/content/`.** Components never hard-code product, service or company facts.

- `site.ts` — organization facts, founder, official profiles, work areas.
- `works.ts` — the **lab index**: every product, dataset, experiment and open-source project as a `Work` with a sequential id (`IL-001`, `IL-002`, …) and a `status` (`live` / `building` / `research`). `kind: "product"` routes to `/products/[slug]`; every other kind routes to `/lab/[slug]` (`workPath()`). Never renumber ids; append new entries at the end.
- `services.ts` — solutions for organizations (`/solutions/[slug]`) and `supporters` (the homepage supporters section renders only when this array is non-empty).
- `contact.ts` — contact form topics; `/contact?topic=<id>` preselects one. `enterprise-rag` reveals extra RAG fields.

The same records feed the pages, JSON-LD (`src/lib/seo.ts`), `sitemap.ts`, `robots.ts`, `llms.txt/route.ts` and OG images (`src/lib/og.tsx` + `opengraph-image.tsx` files). Adding a `Work` or `Service` automatically adds its page, sitemap entry, structured data and llms.txt line — no homepage changes needed.

**SEO/GEO:** per-page metadata goes through `pageMetadata()` in `src/lib/seo.ts` (canonical, OG, Twitter). JSON-LD is rendered with `<JsonLd>` as a single `@graph`; Organization/WebSite/Person live in the root layout and are referenced by `@id` from page-level nodes (SoftwareApplication, Dataset, Service, BreadcrumbList, FAQPage). Important facts must exist as real HTML text, never only in canvas/animation.

**Motion system** — one vocabulary (signals resolve, lock in, travel along rails). All of it is gated on `prefers-reduced-motion: no-preference`; the static state is the default and contains all content. CSS lives in the "Motion system" section of `globals.css`.
- `signal-field.tsx` — WebGL dot-matrix hero shader. Initialises on `requestIdleCallback`, pauses offscreen/hidden, drops to DPR 1 / 30fps on touch or narrow screens, fades with scroll, renders one static frame under reduced motion. A CSS `.dot-grid` is the fallback.
- `rise-text.tsx` (hero headline words), `decode.tsx` (mono labels resolve from noise; real text is in an `sr-only` copy), `in-view.tsx` (sets `data-inview` once; CSS animates `.feed-row`, `.feed-bar`, `.rail-node`, `.cell`), `spatial-tilt.tsx` (pointer-driven 3D tilt, fine pointers only).
- `work-glyph.tsx` — deterministic mirrored 5×5 dot matrix per work slug, coloured by status.
- `work-index.tsx` — lab index with a cursor-following preview card (fine pointers only, `aria-hidden`).
- Page transitions use React `<ViewTransition>` (types via `src/types/react-experimental.d.ts`). Every `page.tsx` wraps its content in `<PageShell>`; header and footer are pinned with `viewTransitionName`. A work's title morphs from its index row to the detail `h1` via the shared name `work-<slug>` — never render two elements with the same name on one page.
- `dispatch-clock.tsx` — countdown to the next Sinyra briefing (weekdays 18:00, Europe/Istanbul, fixed UTC+3).

Formatting: Prettier with `printWidth: 120` (`.prettierrc.json`); run `pnpm dlx prettier@3 --write "src/**/*.{ts,tsx,css}"`.

**Design tokens** are CSS variables on `:root` in `globals.css`, exposed to Tailwind via `@theme inline` (`bg`, `raised`, `fg`, `muted`, `faint`, `line`, `accent`). Shared component classes: `.wrap`, `.meta`, `.display`, `.serif`, `.prose-lab`, `.btn`, `.status[data-status]`, `.link`. The site is dark-only.

## Content rules

- The site is in English. Sinyra itself is a Turkish-language product (`inLanguage: "tr"`).
- Tone: concise, technical, factual. No "revolutionizing", "future of AI", buzzword stacking, or "coming soon". Momentum is shown through statuses, the next empty index slot and status notes.
- Never invent products, metrics, partners, people or URLs. Dated metrics (e.g. Sinyra subscriber count in `works.ts`) must carry their as-of date and be updated by hand.

## Contact form

`src/app/api/contact/route.ts` sends mail via the Resend REST API from the verified subdomain `mail.ilyntlabs.com` (Resend DNS records live in Cloudflare, which hosts the `ilyntlabs.com` zone; Google Workspace handles inbound mail on the root domain). Production env vars on Vercel: `RESEND_API_KEY` (sensitive) and `CONTACT_FROM_EMAIL` (`Ilynt Labs <noreply@mail.ilyntlabs.com>`); optional `CONTACT_TO_EMAIL` (defaults to `bilal@ilyntlabs.com`). See `.env.example`. Without them the API returns 503 and the form offers a prefilled `mailto:` fallback. Rate limiting is in-memory per instance (best effort). End-to-end delivery verified in production on 2026-10-07.
