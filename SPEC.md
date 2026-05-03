# LinkedIn Post Studio — Technical Specification

**Version:** 1.0.0
**Status:** Draft → Implementation
**Last updated:** May 2026
**Owner:** _Add your name here_

> Single source of truth for what we're building, how it's structured, and the contracts between modules. Read this before writing any code. Update this when the system changes.

---

## 1. Overview

### 1.1 Product

**LinkedIn Post Studio** is a single-page web app that lets AI/ML/coding creators generate scroll-stopping LinkedIn graphics in seconds. Users pick a template, customize content, and download a `1200×1200` PNG ready to post.

### 1.2 Core value props

1. **Quick AI mode** — type one idea, get 4 ready-to-use thumbnail variants (Shock / Question / Stat / Reveal).
2. **ML-native templates** — Formula, Curve, Neural Network, Day Log, etc., designed for tech content (not generic Canva clones).
3. **AI caption generator** — matches the graphic with a tuned LinkedIn caption.
4. **Zero design skill required** — 6 themes, sensible defaults, instant preview.

### 1.3 Non-goals

- Multi-user accounts / auth (v1 is single-user, no backend persistence)
- Image hosting / CDN (downloads only)
- Native mobile app (responsive web only)
- Real-time collaboration
- Brand kit / team features

---

## 2. Tech stack (locked, May 2026)

| Layer | Choice | Version | Notes |
|---|---|---|---|
| Framework | Next.js | `16.2.x` | App Router, Turbopack default in dev |
| UI runtime | React | `19.x` | No `forwardRef`, async transitions |
| Language | TypeScript | `5.x` | `strict: true`, no `any` |
| Styling | Tailwind CSS | `v4.1.x` | CSS-first config, no `tailwind.config.js` |
| Components | shadcn/ui | CLI `v4`, `new-york` style | Unified `radix-ui`, OKLCH, `data-slot` |
| State | Zustand | `v5.x` | |
| Icons | Lucide React | latest | |
| AI SDK | `@anthropic-ai/sdk` | `v0.92.x` | Server-only |
| AI model | `claude-opus-4-7` | — | Default. Fall back to `claude-sonnet-4-6` for cost. |
| Toasts | `sonner` | latest | shadcn-recommended replacement for `toast` |
| Node | — | `>=20.0.0` | Required by Next 16 |

**Hard rules:**
- All AI calls happen server-side. `ANTHROPIC_API_KEY` is never bundled to the client.
- No `tailwind.config.js`. Theme tokens live in `app/globals.css` under `@theme { }`.
- No `React.forwardRef`. Pass `ref` as a regular prop. Use `React.ComponentProps<...>`.
- No `any`. Prefer discriminated unions for variants.
- All rendering is **inline SVG**. No `<canvas>`, no raster image rendering.

---

## 3. Architecture

### 3.1 High-level flow

```
User input ──► Zustand store ──► Pure SVG template components ──► <svg> in <PreviewPanel>
                  │                                                       │
                  │                                                       └─► SvgExporter ──► PNG download
                  │
                  └──► (optional) /api/* Route Handler ──► Anthropic SDK ──► Claude
```

### 3.2 Layering rules

1. **Templates are pure.** They take `theme` + `content` props and return SVG. No `useState`, no `useEffect`, no fetch.
2. **Store is the only mutable state.** Components read from / write to Zustand. No prop drilling beyond 1 level.
3. **AI calls only from `app/api/*` Route Handlers.** Client components call `fetch('/api/...')` via custom hooks.
4. **Hooks wrap side effects.** `useImageUpload`, `useThumbnailGenerator`, `useCaptionGenerator`, `useDownload`. Components never `fetch` directly.
5. **Utilities are class-based and framework-agnostic.** `SvgExporter`, `TextWrapper` should be unit-testable without React.

### 3.3 Folder structure

```
app/
  api/
    generate-thumbnails/route.ts   POST → 4 thumbnail variants
    generate-caption/route.ts      POST → LinkedIn caption
    explain-code/route.ts          POST → code explanation bullets
  layout.tsx
  page.tsx                         Studio entry (renders <StudioLayout/>)
  globals.css                      Tailwind v4 + @theme tokens

components/
  studio/
    StudioLayout.tsx               2-column shell (controls | preview)
    ControlPanel.tsx               Left column scroll container
    PreviewPanel.tsx               Sticky right column with SVG + caption
    DownloadButton.tsx             Wraps SvgExporter
  templates/                       PURE SVG templates (1 file each)
    ThumbnailTemplate.tsx
    ConceptTemplate.tsx
    FormulaTemplate.tsx
    CompareTemplate.tsx
    DayLogTemplate.tsx
    CurveTemplate.tsx
    NetworkTemplate.tsx
    CodeTemplate.tsx
    QuoteTemplate.tsx
    TipsTemplate.tsx
    AnnounceTemplate.tsx
    ExplainerTemplate.tsx
    CarouselTemplate.tsx
  controls/                        Inputs that mutate the store
    TemplatePicker.tsx
    ThemePicker.tsx
    ContentEditor.tsx              Discriminated-union renderer per template
    ImageUploader.tsx
    ProfileUploader.tsx
    AuthorInfo.tsx
    QuickAIPanel.tsx
  shared/                          Reused inside templates
    PostFooter.tsx
    PostBackground.tsx
  ai/
    CaptionGenerator.tsx
  ui/                              shadcn-generated, do not hand-edit

lib/
  api/claude.ts                    Server-only Anthropic client factory
  utils/
    svg-export.ts                  SvgExporter class
    text-wrap.ts                   wrapText() helper for SVG <text>
    file-upload.ts                 base64 + size validation
  prompts/
    thumbnail.ts
    caption.ts
    code-explainer.ts
  constants/
    themes.ts                      THEMES record
    templates.ts                   TEMPLATES registry
  store/
    useStudioStore.ts              Zustand v5 store

hooks/
  useImageUpload.ts
  useDownload.ts
  useThumbnailGenerator.ts
  useCaptionGenerator.ts

types/
  studio.ts                        All shared types (Theme, Template, Content, etc.)
```

---

## 4. Data model

All shared types live in `types/studio.ts`. Below is the contract.

### 4.1 Theme

```ts
export type ThemeId =
  | 'terminal'
  | 'cosmic'
  | 'ocean'
  | 'sunset'
  | 'minimal'
  | 'paper';

export interface Theme {
  id: ThemeId;
  name: string;
  swatch: string;          // for theme picker UI
  bgGradient: string[];    // 2-3 hex colors for <linearGradient>
  text: string;            // primary text color
  muted: string;           // secondary text
  accent: string;          // primary accent
  accent2: string;         // secondary accent (for 2nd glow)
  cardBg: string;          // inner card / surface fill
  isDark: boolean;         // controls icon contrast, grid opacity, etc.
}
```

Defaults in `lib/constants/themes.ts`:

| id | bgGradient | accent |
|---|---|---|
| `terminal` | `['#0a0e1a', '#0f1729']` | `#00ff88` |
| `cosmic` | `['#667eea', '#764ba2', '#f093fb']` | `#ffffff` |
| `ocean` | `['#0c4a6e', '#0369a1', '#0ea5e9']` | `#7dd3fc` |
| `sunset` | `['#7c2d12', '#dc2626', '#f97316']` | `#fef3c7` |
| `minimal` | `['#ffffff', '#f8fafc']` | `#0f172a` |
| `paper` | `['#fef9c3', '#fef08a']` | `#713f12` |

### 4.2 Template registry (discriminated union)

```ts
export type TemplateId =
  // Quick AI
  | 'thumbnail'
  // ML/AI
  | 'concept' | 'formula' | 'compare' | 'dayLog' | 'curve' | 'network'
  // Basic
  | 'code' | 'quote' | 'tips' | 'announce' | 'explainer' | 'carousel';

export type TemplateContent =
  | { kind: 'thumbnail';  hook: string; subline: string; context: string;
                          style: 'shock' | 'question' | 'stat' | 'reveal' }
  | { kind: 'concept';    name: string; category: string; definition: string;
                          points: [string, string, string] }
  | { kind: 'formula';    title: string; equation: string; description: string }
  | { kind: 'compare';    leftTitle: string; leftBullets: string[];
                          rightTitle: string; rightBullets: string[] }
  | { kind: 'dayLog';     day: number; total: number; focus: string;
                          insight: string; progressPct: number }
  | { kind: 'curve';      title: string; curve: 'sigmoid' | 'relu' | 'tanh'
                          | 'gaussian' | 'logloss' | 'convex'; caption: string }
  | { kind: 'network';    title: string; layers: number[];     // e.g. [4,6,6,3,1]
                          caption: string }
  | { kind: 'code';       title: string; language: string;
                          code: string; imageDataUrl?: string }
  | { kind: 'quote';      text: string; attribution: string }
  | { kind: 'tips';       title: string; tips: string[] }     // 1–5 items
  | { kind: 'announce';   eyebrow: string; headline: string; cta: string }
  | { kind: 'explainer';  code: string; points: string[] }
  | { kind: 'carousel';   slides: CarouselSlide[] };          // up to 10
```

### 4.3 Author / footer

```ts
export interface Author {
  name: string;
  tagline: string;
  profileImageDataUrl?: string;   // base64; fallback = first-letter circle
}
```

### 4.4 Hero image

```ts
export type HeroLayout = 'hero' | 'split' | 'background' | 'inline';

export interface HeroImage {
  dataUrl: string;
  layout: HeroLayout;
  opacity: number;     // 0..1
}
```

### 4.5 Store shape

```ts
export interface StudioState {
  // selection
  templateId: TemplateId;
  themeId: ThemeId;

  // content keyed by template kind so users don't lose work when switching
  contentByKind: Partial<Record<TemplateContent['kind'], TemplateContent>>;

  // shared
  author: Author;
  hero?: HeroImage;

  // AI state
  ai: {
    thumbnails: { loading: boolean; error?: string;
                  variants?: ThumbnailVariant[] };
    caption:    { loading: boolean; error?: string; text?: string;
                  tone: CaptionTone };
  };

  // actions
  setTemplate: (id: TemplateId) => void;
  setTheme: (id: ThemeId) => void;
  patchContent: <K extends TemplateContent['kind']>(
    kind: K, patch: Partial<Extract<TemplateContent, { kind: K }>>
  ) => void;
  setAuthor: (patch: Partial<Author>) => void;
  setHero: (hero?: HeroImage) => void;
  setProfileImage: (dataUrl?: string) => void;

  // AI actions
  generateThumbnails: (idea: string) => Promise<void>;
  pickThumbnailVariant: (index: number) => void;
  generateCaption: (tone: CaptionTone) => Promise<void>;
}
```

---

## 5. Visual / SVG specification

Every template renders into a fixed `1200 × 1200` viewBox.

```
┌────────────────────────────────────── 1200 ──────────────────────────────────────┐
│  (radial glow, top-left, accent)                                                 │
│                                                                                  │
│   y=120 ────────────────────  CONTENT AREA  ────────────────────                │
│                                                                                  │
│                                                                                  │
│                                                                                  │
│                                                                                  │
│                                                                                  │
│                                                                                  │
│                                                                                  │
│                                                                                  │
│                                                                                  │
│                                                                                  │
│   y=1040 ──────────────────────────────────────────────────────                 │
│   y=1060 ────────────  divider line  ───────────────────────                    │
│   y=1060–1200  FOOTER (avatar + name+tagline | LinkedIn badge)                  │
│                                                                       (glow,    │
│                                                                bottom-right,    │
│                                                                       accent2)  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Padding:** 80px from all edges.
**Background:** `<linearGradient>` from `theme.bgGradient`.
**Grid overlay:** 60×60 px grid pattern, opacity `0.04` (dark themes) or `0.06` (light themes).
**Glows:** two `<radialGradient>` circles, top-left = `accent`, bottom-right = `accent2`, radius ~600, opacity ~0.35.

### 5.1 Typography

| Use | Font stack | Weight | Size |
|---|---|---|---|
| Body | `system-ui, -apple-system, sans-serif` | 400–600 | 24–36 |
| Big titles | same | 800–900 | 60–140 |
| Quotes | `Georgia, serif` | 400 italic | 60–96 |
| Formulas | `'Cambria Math', Georgia, serif` italic | 400 | 80–120 |
| Code | `ui-monospace, 'SF Mono', Monaco, monospace` | 400–500 | 22–28 |

Letter-spacing for big titles: `-1` to `-4`.

### 5.2 Footer

- **Left:** circle avatar (80px diameter, `clipPath`) OR initial circle (theme.accent fill, white letter), then `name` (24px, weight 700) + `tagline` (18px, weight 400, `theme.muted`).
- **Right:** rounded square (80px) with `#0A66C2` fill and white `in` glyph (weight 800, italic).
- **Divider:** 1px line at `y=1060`, `theme.muted` at 40% opacity, x: 80 → 1120.

---

## 6. API contracts

All routes return JSON. All errors return `{ error: string }` with appropriate status code.

### 6.1 `POST /api/generate-thumbnails`

**Request body:**
```ts
{ idea: string }    // 5–200 chars, required
```

**Response 200:**
```ts
{
  variants: [
    { style: 'shock';    hook: string; subline: string; context: string },
    { style: 'question'; hook: string; subline: string; context: string },
    { style: 'stat';     hook: string; subline: string; context: string },
    { style: 'reveal';   hook: string; subline: string; context: string },
  ]
}
```

**Constraints (enforced server-side after Claude returns):**
- `hook` ≤ 35 chars
- `subline` ≤ 30 chars
- `context` ≤ 25 chars
- Truncate with `…` if Claude over-runs.

**Errors:**
- `400` invalid body
- `429` rate limited
- `500` Claude error / parse error

### 6.2 `POST /api/generate-caption`

**Request body:**
```ts
{
  tone: 'professional' | 'casual' | 'bold' | 'storytelling';
  authorHandle: string;
  graphicSummary: string;     // serialized content the user is about to post
}
```

**Response 200:**
```ts
{ caption: string }    // 200–400 words
```

### 6.3 `POST /api/explain-code`

**Request body:**
```ts
{ code: string; language: string }
```

**Response 200:**
```ts
{ points: string[] }    // 3–5 short bullet points
```

### 6.4 Server implementation pattern

```ts
// app/api/generate-thumbnails/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getClaude } from '@/lib/api/claude';
import { thumbnailPrompt } from '@/lib/prompts/thumbnail';

export async function POST(req: NextRequest) {
  const { idea } = await req.json();
  if (typeof idea !== 'string' || idea.length < 5) {
    return NextResponse.json({ error: 'invalid idea' }, { status: 400 });
  }

  const client = getClaude();
  const msg = await client.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 1024,
    messages: [{ role: 'user', content: thumbnailPrompt(idea) }],
  });

  // parse + clamp lengths
  const text = msg.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('');

  const parsed = JSON.parse(text);   // wrap in try/catch in real code
  return NextResponse.json(parsed);
}
```

---

## 7. AI prompts (source of truth)

Stored in `lib/prompts/*.ts` as exported template functions.

### 7.1 Thumbnail prompt (`lib/prompts/thumbnail.ts`)

```
You are a LinkedIn thumbnail designer for AI/ML/coding content.
User idea: "${idea}"

Generate 4 scroll-stopping thumbnail variations. Return ONLY valid JSON:
{
  "variants": [
    { "style": "shock",    "hook": "...", "subline": "...", "context": "..." },
    { "style": "question", "hook": "...", "subline": "...", "context": "..." },
    { "style": "stat",     "hook": "...", "subline": "...", "context": "..." },
    { "style": "reveal",   "hook": "...", "subline": "...", "context": "..." }
  ]
}

Rules:
- "shock":    ALL CAPS, 3-5 powerful words, urgent
- "question": Provocative question
- "stat":     Big number/multiplier with context
- "reveal":   Personal/story-driven
- hook    ≤ 35 chars
- subline ≤ 30 chars
- context ≤ 25 chars
- Power words allowed: STOP, NEVER, WHY, HOW, SECRET, TRUTH, MISTAKE
- Be specific to the topic. No generic filler.
```

### 7.2 Caption prompt (`lib/prompts/caption.ts`)

```
You are a LinkedIn growth expert for AI/ML creators. Write a high-engagement caption.

Tone: ${tone}
Author: ${handle}

Graphic content:
${content}

Style:
- Strong hook in first line
- Short paragraphs (1–2 sentences) with line breaks
- Use → for bullet points (not • or -)
- Include "Key Takeaways" section
- End with engagement question
- 5–8 hashtags at end
- 200–400 words

Output ONLY the caption.
```

### 7.3 Code-explainer prompt (`lib/prompts/code-explainer.ts`)

```
You are explaining ${language} code to a LinkedIn audience of ML/coding creators.

Code:
${code}

Return ONLY valid JSON:
{ "points": ["…", "…", "…"] }   // 3–5 bullet points, each ≤ 90 chars
```

---

## 8. Image upload

### 8.1 Validation

- Allowed mime types: `image/png`, `image/jpeg`, `image/webp`
- Max file size: **5 MB** (reject with toast otherwise)
- Convert to **base64 data URL** via `FileReader`. Never store blob URLs (they break iframe sandboxes & download-after-revoke).

### 8.2 Profile photo

- Square crop in UI preview, rendered as circle inside SVG via `<clipPath>`.
- If no upload: render initial-letter circle (theme.accent fill, white letter).

### 8.3 Hero image — 4 layouts

| Layout | Position | Size | Notes |
|---|---|---|---|
| `hero` | top banner | 1040×260, y=120 | rounded corners 24px |
| `split` | right half | 520×800, x=600 | rounded 24px |
| `background` | full | 1040×920 | opacity from slider, behind content |
| `inline` | centered | 320×320 circle | clipped to circle |

### 8.4 Code screenshot

- Replaces text-based code in `CodeTemplate`.
- Rendered inside macOS-style window frame: 3 traffic-light dots (red `#ff5f57`, yellow `#febc2e`, green `#28c840`), title bar `theme.cardBg`.

---

## 9. PNG export

`SvgExporter` lives at `lib/utils/svg-export.ts`. **Class-based, dependency-free, testable in Node.**

```ts
export class SvgExporter {
  constructor(private readonly svgEl: SVGSVGElement) {}

  /** Returns a base64 data URL (NOT a blob URL — required for iframe sandbox). */
  async toPng(opts?: { width?: number; height?: number }): Promise<string> { … }

  /** Triggers a browser download via a hidden <a> tag. */
  async download(filename: string): Promise<void> { … }
}
```

**Algorithm:**

1. `serializeSvg`: clone the live `<svg>`, inline computed styles, set `xmlns`, return string.
2. `svgToImage`: build `data:image/svg+xml;base64,${btoa(svg)}` and load into an `Image`.
3. `imageToCanvas`: draw onto `OffscreenCanvas` (or fallback `<canvas>`) at 1200×1200.
4. `canvasToDataUrl`: `canvas.toDataURL('image/png')`.
5. Trigger download with a hidden `<a download>` whose `href` is the data URL.

**Fallback:** if export fails, surface a sonner toast with "Right-click the preview and choose *Save image as…*".

---

## 10. UI / interaction spec

### 10.1 Layout

| Breakpoint | Layout |
|---|---|
| `≥ 1024px` | 2-col: left 400px (scroll), right flex-1 (sticky preview) |
| `< 1024px` | Stacked: controls top, preview below |

### 10.2 Controls panel groups (top to bottom)

1. **Quick AI** card — idea input + Generate button + 4-variant picker
2. **Template** picker — 3 collapsible groups: *Quick AI / ML & AI / Basic*
3. **Theme** picker — 6 swatches in a 3×2 grid
4. **Content editor** — switches based on `templateId` (uses discriminated union)
5. **Image upload** — hero + layout selector + opacity slider
6. **Profile photo** — upload + circular preview
7. **Author info** — name + tagline inputs

### 10.3 Aesthetics

- `rounded-2xl`, `shadow-sm`, `border` with `border-slate-200`
- White card surfaces on a `slate-50` page background
- 200ms transitions on hover / active states
- All interactive elements have visible `:focus-visible` rings (a11y)

### 10.4 Loading / error states

- AI generation: skeleton variants + spinner; errors → sonner toast `error`.
- Image upload: progress bar 0–100% via `FileReader.onprogress`; size errors → toast.
- Download: button → spinner → "Downloaded ✓" for 1.5s.

---

## 11. Tailwind v4 setup

`app/globals.css`:

```css
@import "tailwindcss";

@theme {
  /* brand */
  --color-brand-500: #0A66C2;

  /* radii */
  --radius-card: 1rem;
  --radius-button: 0.625rem;

  /* fonts */
  --font-sans: ui-sans-serif, system-ui, sans-serif;
  --font-mono: ui-monospace, 'SF Mono', Monaco, monospace;
  --font-serif: Georgia, serif;
}

/* shadcn new-york base layer (auto-injected by `npx shadcn init`) */
```

> No `tailwind.config.js`. `content` is auto-detected. Plugins go through `@plugin "...";` in CSS.

---

## 12. Environment variables

`.env.local` (committed to `.env.example`, never to git):

```
ANTHROPIC_API_KEY=sk-ant-api03-...
```

| Var | Required | Where | Purpose |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | ✅ | server only | Claude calls |
| `NEXT_PUBLIC_APP_URL` | optional | both | Used for OG tags |

If `ANTHROPIC_API_KEY` is missing, AI routes return `503` with `{ error: 'AI not configured' }` and the UI hides Quick AI buttons.

---

## 13. Performance budget

| Metric | Target |
|---|---|
| First load JS (page route) | ≤ 200 KB gzipped |
| LCP (preview render) | ≤ 1.5s on M2 / fast 4G |
| Time-to-PNG download | ≤ 800ms after click |
| Claude thumbnail generation p50 | ≤ 4s |

Strategies:
- Templates are server-rendered where possible (no client interactivity needed for SVG).
- Lucide icons imported per-icon, never barrel-imported.
- Heavy template files (`CurveTemplate`, `NetworkTemplate`) lazy-loaded with `next/dynamic`.

---

## 14. Accessibility

- All inputs have `<Label>` (shadcn) bound via `htmlFor`.
- Color contrast ≥ 4.5:1 for body text on every theme. The Cosmic / Sunset gradients use light text — verified.
- Keyboard: `Tab` cycles through controls; preview area is `aria-live="polite"` so SR users hear updates.
- `prefers-reduced-motion` disables hover transitions.

---

## 15. Testing

| Layer | Tool | What we test |
|---|---|---|
| Utils | Vitest | `SvgExporter`, `wrapText`, file validation |
| Components | Vitest + Testing Library | controls update store correctly |
| API routes | Vitest with mocked Anthropic client | shape of responses, error paths |
| E2E | Playwright | "type idea → pick variant → download PNG" happy path |

CI: GitHub Actions on PR — `npm run lint && npm run typecheck && npm test`.

---

## 16. Deployment

**Target:** Vercel (Next.js 16 + Turbopack first-class).

```bash
vercel --prod
```

**Vercel project settings:**
- Framework preset: `Next.js`
- Build command: `next build` (default)
- Output: `.next` (default)
- Env vars: add `ANTHROPIC_API_KEY` in dashboard, **Production + Preview** scopes.

**Other targets** (for reference, not v1):
- Netlify: works with Next.js Adapter API (stable in 16.2)
- Cloudflare Pages: works via OpenNext adapter
- Self-host: `next start` behind nginx, Node 20+

---

## 17. Glossary

| Term | Meaning |
|---|---|
| **Template** | A specific design layout (e.g., `formula`, `dayLog`). 1 file per template. |
| **Theme** | A color/typography preset applied to *any* template. |
| **Variant** | One of the 4 AI-generated thumbnail options for a single user idea. |
| **Content** | The user-editable text/numbers/images for the current template. |
| **Hero image** | Optional uploaded image used as banner / split / background / inline. |
| **Footer** | The author block + LinkedIn badge at the bottom of every design. |

---

## 18. Open questions

- [ ] Should we persist `Author` to `localStorage` so users don't re-enter on every visit?
- [ ] Carousel template: download as 10 separate PNGs, a zipped bundle, or a multi-page PDF?
- [ ] Do we want a "share to LinkedIn" deep link, or download-only for v1?
- [ ] Caption tone: should we add "Contrarian" / "Educator" beyond the 4 listed?
- [ ] Rate limiting on AI routes — IP-based via Vercel Edge Config, or skip for v1?

---

## 19. Out of scope (explicitly)

- User accounts, login, OAuth
- Saving / loading designs
- A/B testing of variants on real LinkedIn
- Translations / i18n
- Image generation (Claude can't generate raster images — we do SVG only)
- Video / GIF export

---

## 20. Changelog

| Date | Author | Change |
|---|---|---|
| 2026-05-02 | initial draft | Spec created, locked stack to Next 16.2 / React 19 / Tailwind v4 / Opus 4.7 |

---

_End of spec. Update the changelog when you change anything above._
