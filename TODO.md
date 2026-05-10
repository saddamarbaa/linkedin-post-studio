# TODO — Future Features

Roadmap for the next round of features, in rough priority order. Each entry has a goal, acceptance criteria, and a starting implementation sketch so anyone (or a future agent) can pick it up cold.

> **Status legend:** `[ ]` not started · `[~]` in progress · `[x]` done

---

## 1. User authentication

Today anyone can use the studio anonymously. That's great for the landing experience, but it blocks:

- Saving drafts across sessions and devices
- Persisting `Author` (name, tagline, avatar) instead of re-typing it every visit
- Per-user rate limits on AI routes (cost control)
- Future: a gallery of past graphics, a paid tier

### Acceptance criteria

- [ ] Sign-in with Google OAuth + email magic link
- [ ] Sign-out available from the header (`StudioHeader`)
- [ ] Anonymous use **still works** — auth is optional, never gating the core flow
- [ ] When signed in, `Author` auto-populates from the user profile and survives a hard reload
- [ ] AI route handlers (`/api/generate-thumbnails`, `/api/generate-caption`, `/api/explain-code`) can read the session and reject anonymous calls when a quota flag is on (default: off)

### Implementation sketch

- **Provider:** Auth.js v5 (NextAuth) — first-class App Router support, edge-friendly. Alt: Clerk if we want their hosted UI.
- **DB:** Vercel Postgres + Drizzle ORM. Tables: `users`, `accounts`, `sessions`, `drafts`.
- **Files:** `app/api/auth/[...nextauth]/route.ts`, a `middleware.ts` for protected routes, a new `<UserMenu />` slotted into `StudioHeader`.
- **Store:** add `session` selector to `useStudioStore`; gate AI buttons on session when quota is on.

### Open questions

- Require auth for AI routes from day 1, or keep them open and add quota later?
- Drafts: server-stored from the start, or localStorage with sync-on-sign-in?
- Free tier limits — N AI calls per user per day?

---

## 2. Light & Dark mode

The whole UI is locked to a light slate palette. Devs expect a dark mode, and the studio would feel more polished with one.

### Acceptance criteria

- [ ] Three modes: `light`, `dark`, `system` (default `system`)
- [ ] Theme toggle in `StudioHeader`, next to the AI status pill
- [ ] **No flash of wrong theme** on first paint — script must run pre-hydration
- [ ] Studio chrome adapts: `StudioHeader`, `StudioHero`, `StudioFooter`, all `Card`s, `TemplatePicker`, `ThemePicker`, `ContentEditor`, `ImageUploader`, `YourInfo`, `CaptionGenerator`, `QuickAIPanel`
- [ ] **Live preview SVG is unaffected** — it follows the user's chosen *graphic* theme (`terminal`, `ocean`, …), not the UI theme
- [ ] Toast colors adapt (sonner already supports this)

### Implementation sketch

- `next-themes` is already in `package.json`. Wrap children in `<ThemeProvider attribute="class" defaultTheme="system" enableSystem />` inside `app/layout.tsx`.
- Define dark tokens in `app/globals.css` under `@theme` (e.g., `--color-surface`, `--color-surface-foreground`) and reference them from components instead of raw `bg-white` / `text-slate-900`.
- Audit and add `dark:` variants to every component listed above. The preview `Card` needs special care — `bg-white` should become a neutral surface that won't bleed into the rendered SVG.
- `viewport.themeColor` is already set per-mode in `app/layout.tsx`, no change needed.

### Open questions

- Default to `system` or `light`? (Lean `system`.)
- Add a sepia / "paper" UI mode, or stick to strict two-mode?

---

## 3. Better UI polish

Catch-all bucket for the next round of visual and interaction upgrades.

### Acceptance criteria

- [ ] **Two-column layout at `lg:`** — controls on the left, sticky preview on the right. Mobile keeps the current stacked layout.
- [ ] **Per-template thumbnails** in `TemplatePicker` — render each template at 200×200 so users see what they're picking *before* clicking
- [ ] **AI loading states** — skeleton thumbnails and a shimmering caption block instead of a plain spinner
- [ ] **Keyboard shortcuts:** `⌘S` download, `⌘C` copy, `⌘K` focus content editor, `←` / `→` switch carousel slides
- [ ] **Undo / redo** on content edits — 10-step history in the Zustand store, triggered by `⌘Z` / `⌘⇧Z`
- [ ] **Action toasts** — "4 thumbnails ready · View" instead of text-only toasts
- [ ] **First-visit tour** — optional 3-step coach-mark walkthrough (e.g., `driver.js`), dismissible, never shown again after dismiss
- [ ] **Accessibility pass** — visible focus rings on every interactive element, `aria-label` on icon-only buttons, keyboard reachability for slide chevrons and template tiles
- [ ] **Mobile preview** — scale-to-fit so the 1200×1200 frame is fully visible without horizontal scroll

### Implementation sketch

- Refactor `StudioInner` into `<ControlsColumn />` + `<PreviewColumn />` at `lg:` breakpoint via a CSS grid. Below `lg:` fall back to the current single column.
- Template thumbnails: lazy-render each template inside an `IntersectionObserver`-gated wrapper — don't pay for templates that aren't on screen.
- Undo / redo: a small middleware on `useStudioStore` that snapshots `contentByKind` only (not template / theme switches — those would create thrash).
- Shortcuts: a single `useStudioShortcuts()` hook mounted once in `StudioLayout`. Use `event.metaKey || event.ctrlKey` so it works cross-platform.
- Tour: store dismissal in `localStorage` under `postStudio.tourDismissed`.

### Open questions

- Mobile preview: scale-to-fit (always visible) or move to a separate "Preview" tab?
- Onboarding tour: blocking modal first, or non-blocking pop-overs?

---

## Cross-cutting concerns

Worth flagging once because they touch all three features:

- **Persistence boundary** — decide localStorage vs. server DB *before* auth lands, otherwise we'll have to migrate existing users when auth ships.
- **Bundle size** — dark-mode CSS, the auth provider, and the tour library all add JS. Set a Lighthouse budget and watch it in CI.
- **Pricing surface** — auth + AI quota points at a paid tier eventually. Doesn't need building now, but the data model should leave room (`users.plan`, `users.aiCreditsRemaining`).
