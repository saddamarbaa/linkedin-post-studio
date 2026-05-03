# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository status

This is a **pre-implementation** repository. There is no `package.json`, no Next.js scaffolding, and no build/lint/test commands yet. The repo currently contains:

- `SPEC.md` — the **source of truth**. Read it before writing any code, and update it whenever the system changes.
- `Old-code.ts` — a single-file React reference implementation (~2600 lines) of an earlier prototype. Treat it as **design reference only**: copy SVG layout math, theme palettes, `wrapText` logic, and template visuals from it, but do not port its structure verbatim. The new app must follow the layering rules in SPEC §3.2.
- `linkedin-post-studio-prompt-2026.md.pdf` — PDF version of the spec.

When the project is scaffolded, this file should be updated with the actual `npm` commands (lint / typecheck / test / dev / build) and any deviations from the spec.

## What we're building

A single-page Next.js app that generates 1200×1200 PNG LinkedIn graphics for AI/ML/coding creators. Users pick a template + theme, edit content, and download. Optional Claude-powered "Quick AI" generates 4 thumbnail variants from a one-line idea, and a caption generator produces a matching LinkedIn post.

## Locked stack (do not deviate without updating SPEC §2)

Next.js 16.2 (App Router, Turbopack) · React 19 · TypeScript strict · Tailwind v4 (CSS-first, no `tailwind.config.js`) · shadcn/ui `new-york` · Zustand v5 · `@anthropic-ai/sdk` v0.92 · Node ≥20.

Default model: `claude-opus-4-7`. Fallback: `claude-sonnet-4-6`.

## Architectural rules that are easy to violate

These cut across multiple files, so they are not obvious from any single file:

1. **Templates are pure SVG components.** A file in `components/templates/` takes `theme` + `content` props and returns `<svg>`. No `useState`, no `useEffect`, no `fetch`, no store access. If you need state, the template is wrong — lift it.
2. **Zustand store is the only mutable state.** Avoid prop drilling beyond one level. Content is keyed by template `kind` in `contentByKind` so users don't lose work when switching templates.
3. **AI calls are server-only.** `ANTHROPIC_API_KEY` must never reach the client bundle. Client components call custom hooks (`useThumbnailGenerator`, `useCaptionGenerator`), which `fetch('/api/...')`. Route handlers in `app/api/*` are the only place `getClaude()` is called.
4. **Rendering is inline SVG only.** No `<canvas>` for rendering, no raster output. The only canvas use is inside `SvgExporter` to rasterize the live `<svg>` to PNG at export time.
5. **Export uses base64 data URLs, not blob URLs.** Blob URLs break inside iframe sandboxes and fail after revoke. `SvgExporter.toPng()` must return a `data:image/png;base64,...` string.
6. **No `React.forwardRef`.** React 19 — pass `ref` as a regular prop. Use `React.ComponentProps<...>` for prop typing.
7. **No `tailwind.config.js`.** Theme tokens go in `app/globals.css` under `@theme { }`. Plugins via `@plugin "...";`.
8. **No `any`.** Template content is a discriminated union on `kind` — exhaust it in editors and renderers.

## Visual contract (SPEC §5)

Every template renders to a fixed **1200×1200 viewBox** with 80px padding. Layout is rigid:

- Content area: `y=120` to `y=1040`
- Divider line: `y=1060`, `theme.muted` at 40% opacity, `x: 80 → 1120`
- Footer: `y=1060–1200` — left = avatar (80px circle via `clipPath`) + name (24/700) + tagline (18/400, muted); right = LinkedIn badge (80px rounded square, `#0A66C2` fill, white italic `in`)
- Background: `<linearGradient>` from `theme.bgGradient`, plus 60×60 grid overlay (opacity 0.04 dark / 0.06 light), plus two `<radialGradient>` glows (top-left `accent`, bottom-right `accent2`, ~600 radius, ~0.35 opacity)

Themes (`terminal`, `cosmic`, `ocean`, `sunset`, `minimal`, `paper`) are defined in SPEC §4.1 with exact hex values. `Old-code.ts` lines 4–71 has the reference palette — note the spec's `bgGradient` for `terminal` (`['#0a0e1a','#0f1729']`) differs slightly from `Old-code.ts` (`['#0a0e1a','#1a1f3a']`); prefer the spec.

## API contract length limits (enforced server-side)

`/api/generate-thumbnails` returns 4 variants. After Claude responds, the route **must** truncate with `…` if Claude over-runs:

- `hook` ≤ 35 chars, `subline` ≤ 30 chars, `context` ≤ 25 chars (per variant)
- Variant styles are fixed: `shock` | `question` | `stat` | `reveal` (see SPEC §7.1 for prompt rules)

`/api/generate-caption`: 200–400 words, `→` for bullets (not `•` or `-`), 5–8 hashtags, ends with engagement question.

`/api/explain-code`: 3–5 bullets, each ≤ 90 chars.

If `ANTHROPIC_API_KEY` is missing, AI routes return `503 { error: 'AI not configured' }` and the UI hides Quick AI buttons.

## Image upload constraints

- Mime: `image/png` | `image/jpeg` | `image/webp`; max 5 MB
- Always convert to base64 data URL via `FileReader`. Never store blob URLs.
- Hero image has 4 layouts (`hero` / `split` / `background` / `inline`) — exact dimensions in SPEC §8.3
- Code template can use either text or a screenshot rendered inside a macOS-style window frame (traffic-light dots `#ff5f57` / `#febc2e` / `#28c840`)

## Folder structure target

See SPEC §3.3 for the full tree. Key boundaries:

- `lib/utils/` — class-based, framework-agnostic, unit-testable in Node (`SvgExporter`, `TextWrapper`)
- `lib/prompts/` — prompt template functions, source of truth for AI prompts
- `lib/constants/` — `THEMES`, `TEMPLATES` registries
- `hooks/` — wrap all side effects; components never `fetch` directly
- `components/ui/` — shadcn-generated, do not hand-edit

## Known open questions (SPEC §18)

These are unresolved and the user has not chosen yet — surface them rather than silently deciding:
- Persist `Author` to `localStorage`?
- Carousel download: 10 PNGs vs zip vs PDF?
- Rate limiting on AI routes for v1?
- Additional caption tones beyond `professional` / `casual` / `bold` / `storytelling`?
