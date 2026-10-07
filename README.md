# ilyntlabs.com

Website of [Ilynt Labs](https://ilyntlabs.com) — an independent AI product and R&D studio.

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4.

```sh
pnpm install
pnpm dev
```

## Adding content

All products, lab entries, solutions and supporters live in `src/content/`. Pages, sitemap, structured data, OG images and `/llms.txt` are generated from there.

- New product or lab entry: append to `works` in `src/content/works.ts` with the next `IL-xxx` id.
- New solution: append to `services` in `src/content/services.ts`.
- Supporters: add to `supporters` in `src/content/services.ts`; the homepage section appears automatically.

## Environment

Copy `.env.example` to `.env.local` and set the Resend variables to enable the contact form. Without them the form falls back to `mailto:`.
