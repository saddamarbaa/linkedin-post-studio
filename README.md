# LinkedIn Post Studio

Generate scroll-stopping 1200×1200 LinkedIn graphics for AI/ML/coding creators. Pick a template, choose a theme, edit content, download a PNG. Optional Claude-powered "Quick AI" turns a one-line idea into 4 thumbnail variants and a matching caption.

> **Source of truth:** [SPEC.md](SPEC.md) — read it before changing the system. This README is the operator's guide; the spec is the contract.

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Quick start](#quick-start)
- [Environment variables](#environment-variables)
- [Available scripts](#available-scripts)
- [Project structure](#project-structure)
- [Architecture](#architecture)
- [API routes](#api-routes)
- [Conventions and rules](#conventions-and-rules)
- [Deployment](#deployment)
- [Performance and accessibility](#performance-and-accessibility)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## Features

- **13 templates** across three groups — Quick AI (`thumbnail`), ML/AI (`concept`, `formula`, `compare`, `dayLog`, `curve`, `network`), and Basic (`code`, `quote`, `tips`, `announce`, `explainer`, `carousel`).
- **6 themes** — `terminal`, `cosmic`, `ocean`, `sunset`, `minimal`, `paper`. See [SPEC §4.1](SPEC.md#41-theme).
- **Quick AI** — Claude generates 4 thumbnail variants (`shock` / `question` / `stat` / `reveal`) from a single idea.
- **Caption generator** — produces a 200–400 word LinkedIn caption tuned to the graphic, in `professional` / `casual` / `bold` / `storytelling` tones.
- **Hero image upload** — 4 layouts (`hero`, `split`, `background`, `inline`); PNG/JPEG/WebP up to 5 MB.
- **Inline SVG rendering** — every template is a pure 1200×1200 `<svg>`. PNG export is rasterized at download time only.
- **Server-side AI** — `ANTHROPIC_API_KEY` never reaches the client bundle.

---

## Tech stack

| Layer        | Choice                       | Version    |
|--------------|------------------------------|------------|
| Framework    | Next.js (App Router, Turbopack) | `16.2.x` |
| UI runtime   | React                        | `19.x`     |
| Language     | TypeScript (strict)          | `5.x`      |
| Styling      | Tailwind CSS (CSS-first)     | `v4.1.x`   |
| Components   | shadcn/ui (`new-york`)       | CLI v4     |
| State        | Zustand                      | `v5.x`     |
| AI SDK       | `@anthropic-ai/sdk`          | `v0.92.x`  |
| Default model| `claude-opus-4-7` (fallback `claude-sonnet-4-6`) | — |
| Toasts       | `sonner`                     | latest     |
| Node         | `>=20.0.0`                   | required   |

The stack is **locked**; deviations require updating [SPEC §2](SPEC.md#2-tech-stack-locked-may-2026).

---

## Quick start

### Prerequisites

- Node `>=20.0.0`
- An Anthropic API key (optional — the app runs without one; AI features are hidden)

### Install and run

```bash
# 1. install dependencies
npm install

# 2. configure environment
cp .env.example .env.local
# then edit .env.local and paste your ANTHROPIC_API_KEY

# 3. start the dev server (Turbopack)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
npm run start
```

---

## Environment variables

Copy [.env.example](.env.example) to `.env.local` and fill in real values. Never commit `.env.local`.

| Variable               | Required | Scope        | Purpose                                      |
|------------------------|----------|--------------|----------------------------------------------|
| `ANTHROPIC_API_KEY`    | optional | server only  | Powers Quick AI and caption generation. If unset, AI routes return `503 { error: 'AI not configured' }` and the UI hides AI affordances. |
| `NEXT_PUBLIC_APP_URL`  | optional | client + server | Used for Open Graph / social card URLs.   |

Get a key at [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys).

---

## Available scripts

```bash
npm run dev      # Start Next dev server with Turbopack
npm run build    # Production build
npm run start    # Run the production build
npm run lint     # ESLint (eslint-config-next)
```

> Test and typecheck scripts are not yet wired up — see [SPEC §15](SPEC.md#15-testing) for the planned setup (Vitest + Testing Library + Playwright).

---

## Project structure

```
app/
  api/
    generate-thumbnails/route.ts   POST → 4 thumbnail variants
    generate-caption/route.ts      POST → LinkedIn caption
    explain-code/route.ts          POST → code explanation bullets
  layout.tsx                       Root layout (fonts, Toaster)
  page.tsx                         Studio entry; reads ANTHROPIC_API_KEY server-side
  globals.css                      Tailwind v4 + @theme tokens

components/
  studio/      Shell — StudioLayout, DownloadButton
  templates/   PURE SVG templates, one file each
  controls/    Inputs that mutate the Zustand store
  shared/      Reused inside templates (PostFooter, PostBackground, HeroImage)
  ai/          CaptionGenerator
  ui/          shadcn-generated primitives — do not hand-edit

lib/
  api/claude.ts        Server-only Anthropic client factory
  utils/               SvgExporter, TextWrapper, file validation
  prompts/             AI prompt templates (source of truth)
  constants/           THEMES, TEMPLATES registries
  store/               Zustand v5 store

types/
  studio.ts            All shared types (Theme, Template, Content, Author, …)
```

Full target tree in [SPEC §3.3](SPEC.md#33-folder-structure).

---

## Architecture

### Data flow

```
User input ─► Zustand store ─► Pure SVG template ─► <svg> in <PreviewPanel>
                  │                                        │
                  │                                        └─► SvgExporter ─► PNG download
                  │
                  └─► (optional) /api/* Route Handler ─► Anthropic SDK ─► Claude
```

### Layering rules

1. **Templates are pure.** Files in [components/templates/](components/templates/) take `theme` + `content` props and return SVG. No `useState`, no `useEffect`, no `fetch`, no store access.
2. **Zustand is the only mutable state.** Content is keyed by template `kind` in `contentByKind` so users don't lose work when switching templates.
3. **AI calls happen only in `app/api/*` Route Handlers.** Client components call `fetch('/api/...')` via custom hooks — never directly.
4. **Rendering is inline SVG only.** No `<canvas>` for layout. The only canvas use is inside [SvgExporter](lib/utils/svg-export.ts) when rasterizing to PNG at export.
5. **Export uses base64 data URLs**, not blob URLs (blob URLs break inside iframe sandboxes).

See [SPEC §3.2](SPEC.md#32-layering-rules) for the full rationale.

---

## API routes

All routes return JSON; errors are `{ error: string }` with appropriate status codes.

### `POST /api/generate-thumbnails`

```ts
// request
{ idea: string }    // 5–200 chars

// response 200
{
  variants: [
    { style: 'shock'    | 'question' | 'stat' | 'reveal',
      hook: string,     // ≤ 35 chars (truncated server-side with …)
      subline: string,  // ≤ 30 chars
      context: string } // ≤ 25 chars
    // ×4
  ]
}
```

### `POST /api/generate-caption`

```ts
// request
{
  tone: 'professional' | 'casual' | 'bold' | 'storytelling';
  authorHandle: string;
  graphicSummary: string;
}

// response 200
{ caption: string }   // 200–400 words, → for bullets, 5–8 hashtags
```

### `POST /api/explain-code`

```ts
// request
{ code: string; language: string }

// response 200
{ points: string[] }  // 3–5 bullets, each ≤ 90 chars
```

Full contracts in [SPEC §6](SPEC.md#6-api-contracts). Prompt templates live in [lib/prompts/](lib/prompts/).

---

## Conventions and rules

These cut across files and are easy to miss. The full list lives in [CLAUDE.md](CLAUDE.md); the load-bearing ones:

- **No `any`.** Template content is a discriminated union on `kind` — exhaust it everywhere.
- **No `React.forwardRef`.** React 19 — pass `ref` as a regular prop. Use `React.ComponentProps<...>` for prop typing.
- **No `tailwind.config.js`.** Theme tokens live in [app/globals.css](app/globals.css) under `@theme { }`. Plugins via `@plugin "...";`.
- **Templates are pure SVG components** — see layering rules above.
- **AI calls are server-only.** `ANTHROPIC_API_KEY` must never reach the client bundle.
- **Image uploads convert to base64 data URLs** via `FileReader`. PNG/JPEG/WebP only, 5 MB max. Never store blob URLs.
- **Visual contract is rigid:** 1200×1200 viewBox, 80px padding, divider at `y=1060`, footer `y=1060–1200`. See [SPEC §5](SPEC.md#5-visual--svg-specification).

---

## Deployment

### Vercel (recommended)

```bash
vercel --prod
```

Project settings:

- Framework preset: **Next.js**
- Build command: `next build` (default)
- Output directory: `.next` (default)
- Environment variables: add `ANTHROPIC_API_KEY` to **Production** and **Preview** scopes.

### Other targets

- **Netlify** — works via the Next.js Adapter API (stable in 16.2).
- **Cloudflare Pages** — works via the OpenNext adapter.
- **Self-host** — `next start` behind nginx on Node 20+.

See [SPEC §16](SPEC.md#16-deployment).

---

## Performance and accessibility

### Performance budget

| Metric                              | Target          |
|-------------------------------------|-----------------|
| First load JS (page route)          | ≤ 200 KB gzip   |
| LCP (preview render)                | ≤ 1.5s on M2 / fast 4G |
| Time-to-PNG download                | ≤ 800ms after click |
| Claude thumbnail generation (p50)   | ≤ 4s            |

Tactics: per-icon Lucide imports, `next/dynamic` for heavy templates (`CurveTemplate`, `NetworkTemplate`), server-rendered SVG where no interactivity is needed.

### Accessibility

- All inputs use shadcn `<Label>` bound via `htmlFor`.
- Color contrast ≥ 4.5:1 for body text on every theme.
- Keyboard: `Tab` cycles through controls; the preview region is `aria-live="polite"`.
- `prefers-reduced-motion` disables hover transitions.

---

## Troubleshooting

**Quick AI buttons don't appear.**
`ANTHROPIC_API_KEY` is missing or empty. Add it to `.env.local` and restart the dev server. The page reads the key server-side at render time — see [app/page.tsx](app/page.tsx).

**PNG download fails or produces a broken file.**
Confirm export uses base64 data URLs (not blob URLs). The `SvgExporter` fallback shows a sonner toast suggesting *Right-click → Save image as…*.

**Thumbnail variants come back over the length limit.**
Server-side truncation (with `…`) lives in the route handler, not in the prompt. If you change the prompt, keep the truncation step.

**Package manager.**
This project uses `npm`. A `package-lock.json` is checked in — don't introduce other lockfiles (`pnpm-lock.yaml`, `yarn.lock`).

---

## Contributing

1. Read [SPEC.md](SPEC.md) and [CLAUDE.md](CLAUDE.md).
2. Branch from `main`.
3. Keep templates pure; keep AI calls server-side; keep types exhaustive.
4. Update the spec changelog ([SPEC §20](SPEC.md#20-changelog)) when behavior or contracts change.
5. Run `npm run lint` before pushing.

Open questions tracked in [SPEC §18](SPEC.md#18-open-questions) — flag these in PR discussions rather than silently deciding.
