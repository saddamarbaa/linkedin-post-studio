# TODO.md — Feature Roadmap

> Features to build, organized by impact, effort, and category. Check off as you ship!

**Legend:**
- 🔥 = High impact (users will love it)
- ⚡ = Quick win (under 1 day to build)
- 💰 = Monetization opportunity
- 🧠 = Technically interesting / learning opportunity
- 🚀 = Production essential

---

## 🎨 New Templates & Design Features

### Quick Wins (1-3 hours each)
- [ ] ⚡ **Confusion Matrix template** — 2×2 or 3×3 grid for ML classification results
- [ ] ⚡ **Decision Boundary** template — Scatter plot with boundary line, perfect for classifier posts
- [ ] ⚡ **Gradient Descent visualization** — Animated dots descending a 3D loss landscape
- [ ] ⚡ **Activation Function gallery** — Side-by-side mini-plots of common activations
- [ ] ⚡ **Stack/Architecture diagram** — Layered boxes (e.g., "Frontend → Backend → DB")
- [ ] ⚡ **Tier list template** — S, A, B, C, D rankings for tools/libraries/papers
- [ ] ⚡ **Twitter/X post embed** — Render as clean tweet card
- [ ] ⚡ **Quote card with author photo** — Big quote + circular author image

### Bigger Builds (1-3 days each)
- [ ] 🔥 **Tutorial/Walkthrough template** — Multi-step numbered cards with code at each step
- [ ] 🔥 **Before/After code split** — Show messy code → clean code with arrow between
- [ ] 🔥 **Timeline template** — Career milestones, project history, tech evolution
- [ ] 🔥 **Bento grid layout** — Multi-section dashboard-style design
- [ ] 🔥 **Stat dashboard** — 4-6 metric cards with charts (revenue, users, etc.)
- [ ] 🔥 **Prompt engineering template** — System prompt + user input + response display
- [ ] 🧠 **Animated GIF export** — Multi-frame templates that export as GIF
- [ ] 🧠 **Handwritten/sketch theme** — Excalidraw-style aesthetic for casual posts

---

## 🤖 AI-Powered Features

### Quick Wins
- [ ] 🔥⚡ **Improve my draft** — User pastes rough text, AI polishes it
- [ ] 🔥⚡ **Hashtag generator** — AI suggests relevant tags based on content
- [ ] 🔥⚡ **Hook rewriter** — Generate 5 alternative opening lines
- [ ] ⚡ **Title A/B tester** — Compare 2-3 title options side-by-side
- [ ] ⚡ **Tone shifter** — Convert "Professional" caption to "Casual" with one click

### Bigger Builds
- [ ] 🔥🧠 **AI-generated post ideas** — User describes their niche/role, AI suggests 10 post ideas with hooks
- [ ] 🔥🧠 **Full post → graphic generator** — Paste your full LinkedIn post, AI extracts the hook and creates the graphic
- [ ] 🔥🧠 **Image-to-post** — Upload a screenshot, AI analyzes it and writes the post
- [ ] 🔥🧠 **Trending topics** — AI scrapes trending AI/ML topics and suggests posts
- [ ] 🧠 **Code → diagram** — Paste code, AI generates an architecture diagram
- [ ] 🧠 **Paper summarizer** — Paste arXiv URL, get a LinkedIn-ready summary
- [ ] 🧠 **GitHub README generator** — From repo URL → beautiful README + post
- [ ] 🧠 **AI-generated background patterns** — DALL-E or Stable Diffusion for unique backgrounds

---

## 💾 Data & Persistence

### Foundation (Build first)
- [ ] 🚀 **Local storage save** — Auto-save current design to browser
- [ ] 🚀 **Multiple drafts** — Switch between in-progress designs
- [ ] 🚀 **Export/Import JSON** — Backup or share design files

### Cloud Features
- [ ] 🚀💰 **User authentication** — Clerk or NextAuth
- [ ] 🚀💰 **Database storage** — Postgres + Prisma to save designs
- [ ] 🚀💰 **Cloud image hosting** — Cloudinary or S3 for user uploads
- [ ] 🔥 **Design history gallery** — Browse all your past designs
- [ ] 🔥 **Favorites & tags** — Star designs, organize by topic
- [ ] 🔥 **Search past designs** — Find that one design from 3 months ago
- [ ] 🔥 **Version history** — Undo/redo, see previous versions of a design

---

## 👥 Collaboration & Sharing

- [ ] 🔥💰 **Team workspaces** — Multiple users share designs
- [ ] 🔥 **Public design URL** — Share work-in-progress via link
- [ ] 🔥 **Comments on drafts** — Get feedback before posting
- [ ] 🔥 **Templates marketplace** — Users share custom templates
- [ ] 💰 **Brand kit per workspace** — Saved colors, fonts, logos for teams
- [ ] 🧠 **Real-time collaboration** — Multiple users editing simultaneously (Liveblocks/Yjs)

---

## 📤 Export & Workflow

### Multi-Format Export
- [ ] ⚡ **Multiple sizes** — Square (1200x1200), Portrait (1080x1350), Banner (1584x396)
- [ ] ⚡ **PDF export** — For carousels, save all slides as one PDF
- [ ] ⚡ **GIF export** — For animated/multi-frame designs
- [ ] ⚡ **WebP/AVIF** — Smaller file sizes for faster uploads
- [ ] 🧠 **Video export** — Animated reveal as MP4 (Remotion library)

### Direct Publishing
- [ ] 🔥💰 **One-click LinkedIn post** — OAuth + post directly via LinkedIn API
- [ ] 🔥💰 **Scheduled posts** — Queue posts for optimal posting times
- [ ] 🔥💰 **Cross-post to X/Twitter** — Resize and post to Twitter too
- [ ] 💰 **Post analytics** — Track which designs performed best

### Download Options
- [ ] ⚡ **Bulk download** — Download all carousel slides as ZIP
- [ ] ⚡ **Custom watermark** — Add your handle/logo to every export
- [ ] ⚡ **Download with caption** — PNG + caption.txt in one ZIP

---

## 🎨 Design Customization

### Image Tools
- [ ] ⚡ **Image filters** — Blur, grayscale, brightness, saturation
- [ ] ⚡ **Background remover** — AI removes image backgrounds (use Replicate)
- [ ] ⚡ **Image cropping** — Built-in crop tool before applying
- [ ] 🔥 **Multiple images per design** — Not just one image, gallery layouts
- [ ] 🔥 **Stock photo search** — Unsplash/Pexels integration
- [ ] 🔥 **Logo library** — Common tech logos (React, Python, etc.) ready to drop in

### Typography
- [ ] ⚡ **Font picker** — Choose from 10-20 web fonts
- [ ] ⚡ **Font pairs** — Curated combinations (serif + mono, etc.)
- [ ] ⚡ **Text effects** — Stroke, shadow, gradient text
- [ ] 🔥 **Auto-resize text** — Long titles automatically scale to fit

### Colors & Themes
- [ ] ⚡ **Custom color picker** — Pick any color, not just preset themes
- [ ] ⚡ **Theme builder** — Save custom color palettes
- [ ] 🔥 **Color extract from image** — Upload photo, generate matching theme
- [ ] 🔥 **Brand colors** — Save your brand palette across all designs

### Layout & Composition
- [ ] 🔥 **Drag-to-position** — Move text/images by dragging
- [ ] 🔥 **Smart guides** — Snap to alignment guides like Figma
- [ ] 🔥 **Layers panel** — Show/hide/reorder elements
- [ ] 🧠 **Free-form canvas mode** — Full design freedom (no template constraints)

---

## 📊 Analytics & Insights

- [ ] 🔥 **Design dashboard** — How many you've created, top themes, etc.
- [ ] 💰 **A/B test results** — Track which variants got more engagement
- [ ] 💰 **LinkedIn analytics integration** — Pull real engagement data
- [ ] 🧠 **AI design suggestions** — "Posts with stat templates get 2x engagement, try one?"
- [ ] 🧠 **Best time to post** — AI suggests optimal posting times for your audience

---

## 💰 Monetization

### Free Tier Limits (set strategically)
- [ ] 💰 **Free tier:** 5 designs/month, basic templates only, watermark
- [ ] 💰 **Pro tier ($9/mo):** Unlimited designs, all templates, no watermark
- [ ] 💰 **Team tier ($29/mo):** 5 users, brand kit, priority support
- [ ] 💰 **Enterprise:** Custom pricing, SSO, API access

### Payment Integration
- [ ] 🚀💰 **Stripe integration** — Subscriptions
- [ ] 🚀💰 **Free trial** — 7 days, then convert
- [ ] 💰 **Annual discount** — Save 20% with yearly plan
- [ ] 💰 **Lifetime deal** — One-time payment option
- [ ] 💰 **Affiliate program** — 30% commission for referrals

### Smart Upsells
- [ ] 💰 **"Remove watermark" prompt** — On every download in free tier
- [ ] 💰 **Premium templates** — Lock fancy templates behind paywall
- [ ] 💰 **AI credits** — Free tier gets 10 AI generations/month
- [ ] 💰 **Brand kit upsell** — Free users see "Save your brand colors with Pro"

---

## 🌐 Distribution & Growth

### SEO & Marketing
- [ ] 🚀 **Public template gallery** — SEO landing pages for each template
- [ ] 🚀 **Blog** — "How I built this app", post-design tutorials
- [ ] 🚀 **Case studies** — Show real LinkedIn posts created with the tool
- [ ] 🔥 **Free chrome extension** — "Post Studio" button on LinkedIn
- [ ] 🔥 **Embed widget** — Let other sites use your templates

### Community
- [ ] 🔥 **Public design feed** — Browse/like designs by other users
- [ ] 🔥 **Featured designs** — Editorial picks on homepage
- [ ] 💰 **Creator program** — Top users get free Pro tier
- [ ] 🧠 **Discord/Slack community** — Power user channel

### Launch Channels
- [ ] 🔥 **Product Hunt launch** — Aim for top 5
- [ ] 🔥 **Hacker News Show HN** — "Show HN: I built a..."
- [ ] 🔥 **Twitter/X build-in-public** — Daily progress posts
- [ ] 🔥 **YouTube tutorial** — "How I create LinkedIn posts in 30 seconds"
- [ ] 🔥 **Reddit posts** — r/sideproject, r/SaaS, r/entrepreneur
- [ ] 🔥 **Indie Hackers** — Build log posts

---

## 🛠️ Technical Improvements

### Performance
- [ ] ⚡ **Lazy load templates** — Don't load all on initial page load
- [ ] ⚡ **Image compression** — Compress uploads client-side before processing
- [ ] 🚀 **CDN for static assets** — Cloudflare or Vercel Edge
- [ ] 🧠 **Server-side rendering for SEO** — Make designs indexable
- [ ] 🧠 **Service worker / PWA** — Works offline, installable

### Developer Experience
- [ ] 🚀 **Storybook** — Component library documentation
- [ ] 🚀 **Unit tests** — Vitest for utilities (text-wrap, svg-export)
- [ ] 🚀 **E2E tests** — Playwright for critical flows
- [ ] 🚀 **CI/CD** — GitHub Actions auto-deploy
- [ ] 🚀 **Error tracking** — Sentry for production errors
- [ ] 🚀 **Analytics** — PostHog or Plausible
- [ ] 🚀 **Feature flags** — LaunchDarkly or Vercel Flags

### Accessibility
- [ ] 🚀 **Keyboard shortcuts** — Cmd+S to download, Cmd+K to switch templates
- [ ] 🚀 **Screen reader support** — Proper ARIA labels everywhere
- [ ] 🚀 **High contrast mode** — Accessibility theme variant
- [ ] 🚀 **Reduced motion** — Respect user's prefers-reduced-motion

### Internationalization
- [ ] 🌍 **Multi-language UI** — Spanish, French, Hindi, etc.
- [ ] 🌍 **RTL support** — Arabic, Hebrew layouts
- [ ] 🌍 **Localized templates** — Holiday themes per region

---

## 🎓 Education & Onboarding

- [ ] ⚡ **Welcome tour** — First-time user walkthrough
- [ ] ⚡ **Empty state examples** — Show example designs on first load
- [ ] ⚡ **Tooltip help** — Inline hints on hover
- [ ] 🔥 **Video tutorials** — 60-second clips per feature
- [ ] 🔥 **Templates with examples** — Each template has 3 example presets
- [ ] 🔥 **Design school** — Free email course on LinkedIn growth
- [ ] 💰 **Premium course** — "How to grow on LinkedIn with great visuals" ($99)

---

## 🔌 Integrations

- [ ] 🔥💰 **Notion** — Pull post content from Notion database
- [ ] 🔥💰 **Buffer/Hootsuite** — Schedule via existing tools
- [ ] 🔥💰 **Zapier/Make** — Trigger workflows
- [ ] 💰 **Slack notifications** — Get notified when scheduled post goes live
- [ ] 🧠 **API for developers** — Public API to generate designs programmatically
- [ ] 🧠 **Figma plugin** — Export Figma designs as posts
- [ ] 🧠 **VS Code extension** — Generate code post from selected code

---

## 🚀 Recommended Build Order (My Personal Picks)

If you only build 10 things, build these in order:

1. ✅ **Local storage save** — Don't lose work on refresh (CRITICAL)
2. ✅ **User auth (Clerk)** — Foundation for everything
3. ✅ **Database (Prisma + Postgres)** — Save designs to cloud
4. ✅ **Design history gallery** — See all your past designs
5. ✅ **More templates** — Confusion matrix, decision boundary, tutorial
6. ✅ **Stripe payments** — Free tier limits + Pro upgrade
7. ✅ **Public template gallery** — SEO + viral growth
8. ✅ **One-click LinkedIn post** — Killer feature, huge differentiator
9. ✅ **AI post idea generator** — Helps users who don't know what to post
10. ✅ **Chrome extension** — Always-available access

---

## 📈 Realistic Timeline

**Month 1:** Polish current app, add local storage, deploy to Vercel
**Month 2:** Add auth + database + 5 new templates
**Month 3:** Payments + free tier limits + launch on Product Hunt
**Month 4:** LinkedIn API integration + scheduling
**Month 5:** Chrome extension + Public gallery
**Month 6:** Scale based on user feedback

---

## 💡 Validation Checklist (Before Building Big Features)

Before spending 2+ weeks on any feature, ask:

- [ ] Have at least 5 users requested it?
- [ ] Will it move the key metric (designs created per session)?
- [ ] Could I launch a simpler MVP version in 1 day?
- [ ] Is there a paid alternative users currently use?
- [ ] Will it generate revenue or just be "nice to have"?

---

**Last updated:** Build started — ship something every day!
