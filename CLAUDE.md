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

**Motion and progressive enhancement:**
- `signal-field.tsx` — WebGL dot-matrix hero shader. A CSS `.dot-grid` underneath is the fallback; the loop pauses offscreen/hidden and renders a single static frame under `prefers-reduced-motion`.
- `work-index.tsx` — lab index list with a cursor-following preview card, enabled only for fine pointers without reduced motion. The card repeats row content and is `aria-hidden`.
- Scroll reveals use CSS `animation-timeline: view()` (`.reveal`) inside `@supports` and a reduced-motion guard — no JS.
- `dispatch-clock.tsx` — countdown to the next Sinyra briefing (weekdays 18:00, Europe/Istanbul, fixed UTC+3).

**Design tokens** are CSS variables on `:root` in `globals.css`, exposed to Tailwind via `@theme inline` (`bg`, `raised`, `fg`, `muted`, `faint`, `line`, `accent`). Shared component classes: `.wrap`, `.meta`, `.display`, `.serif`, `.prose-lab`, `.btn`, `.status[data-status]`, `.link`. The site is dark-only.

## Content rules

- The site is in English. Sinyra itself is a Turkish-language product (`inLanguage: "tr"`).
- Tone: concise, technical, factual. No "revolutionizing", "future of AI", buzzword stacking, or "coming soon". Momentum is shown through statuses, the next empty index slot and status notes.
- Never invent products, metrics, partners, people or URLs. Dated metrics (e.g. Sinyra subscriber count in `works.ts`) must carry their as-of date and be updated by hand.

## Contact form

`src/app/api/contact/route.ts` sends mail via the Resend REST API. Requires `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` (address on a Resend-verified domain); optional `CONTACT_TO_EMAIL` (defaults to `bilal@ilyntlabs.com`). See `.env.example`. Without them the API returns 503 and the form offers a prefilled `mailto:` fallback. Rate limiting is in-memory per instance (best effort). Email delivery has not been tested end-to-end yet.
