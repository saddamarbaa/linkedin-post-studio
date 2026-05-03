import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import type {
  StudioState,
  TemplateContent,
  TemplateKind,
  ThumbnailVariant,
} from '@/types/studio';

// Sample content shown on first load. Picked so a brand-new visitor sees a
// finished-looking design instead of empty fields. Persisted user edits
// (themeId/author) layer on top — see persist() config below.
// Sample content lifted from Old-code.ts — ML / cost-function themed so a
// brand-new visitor sees a finished design in the user's actual subject area.
const SAMPLE_CONTENT: { [K in TemplateKind]: Extract<TemplateContent, { kind: K }> } = {
  thumbnail: {
    kind: 'thumbnail',
    style: 'shock',
    hook: 'Stop using squared error',
    subline: 'For logistic regression',
    context: 'WHY IT FAILS',
  },
  concept: {
    kind: 'concept',
    name: 'Cost Function',
    category: 'LOGISTIC REGRESSION',
    definition:
      'Measures how wrong the model predictions are. Tells the algorithm what to minimize during training.',
    points: [
      'Lower cost = better fit',
      'Gives learning direction',
      'Drives gradient descent',
    ],
  },
  formula: {
    kind: 'formula',
    title: 'Cross-Entropy Loss',
    equation: 'J(θ) = -[y·log(h) + (1-y)·log(1-h)]',
    description:
      'Penalizes confident wrong predictions strongly. Standard loss for binary classification.',
  },
  compare: {
    kind: 'compare',
    leftTitle: 'Squared Error',
    leftBullets: [
      'Non-convex curve',
      'Hard for gradient descent',
      'Gets stuck locally',
      'Weak gradients',
    ],
    rightTitle: 'Cross-Entropy',
    rightBullets: [
      'Convex & smooth',
      'Fast convergence',
      'Strong gradients',
      'Probabilistic meaning',
    ],
  },
  dayLog: {
    kind: 'dayLog',
    day: 185,
    total: 365,
    focus: 'Cost Function for Logistic Regression',
    insight:
      'The wrong cost function can make learning fail completely. Small mathematical choices create big performance differences.',
    progressPct: 51,
  },
  curve: {
    kind: 'curve',
    title: 'The Sigmoid Function',
    curve: 'sigmoid',
    caption: 'Squashes any input into 0–1 probability.',
  },
  network: {
    kind: 'network',
    title: 'Neural Network Architecture',
    layers: [4, 6, 6, 3, 1],
    caption: 'How information flows through layers.',
  },
  code: {
    kind: 'code',
    title: '5 Python tricks every dev should know',
    language: 'python',
    code: `# Filter and transform in one line
nums = [x*2 for x in data if x > 0]

# Walrus for cleaner loops
while (line := f.readline()):
    process(line)`,
  },
  quote: {
    kind: 'quote',
    text: "The best AI engineers aren't the ones who write the most code. They're the ones who know which code not to write.",
    attribution: '',
  },
  tips: {
    kind: 'tips',
    title: '3 AI coding rules I live by',
    tips: [
      'Use AI for boilerplate, not architecture',
      'Review every line of generated code',
      'Write tests before letting AI refactor',
    ],
  },
  announce: {
    kind: 'announce',
    eyebrow: 'Shipped',
    headline: 'Just shipped my first AI app',
    cta: 'Built it in 48 hours using Claude and Next.js.',
  },
  explainer: {
    kind: 'explainer',
    code: `async def fetch_with_retry(url, max=3):
    for i in range(max):
        try:
            return await fetch(url)
        except:
            await sleep(2 ** i)`,
    points: [
      'Tries up to 3 times before giving up',
      'Waits 1s, 2s, 4s between retries',
      'Perfect for flaky API calls',
    ],
  },
  carousel: {
    kind: 'carousel',
    slides: [
      {
        type: 'cover',
        title: '5 Python tricks every dev should know',
        subtitle: 'Swipe to level up →',
      },
      {
        type: 'tip',
        number: 1,
        heading: 'List comprehensions',
        body: 'Replace 5-line loops with one elegant line.',
      },
      {
        type: 'tip',
        number: 2,
        heading: 'Walrus operator',
        body: 'Assign and check in one go. Cleaner while loops.',
      },
      {
        type: 'cta',
        title: 'Found this useful?',
        subtitle: 'Follow for more AI & coding tips',
      },
    ],
  },
  fullImage: {
    kind: 'fullImage',
    caption: '',
  },
};

function summarizeContent(content?: TemplateContent): string {
  if (!content) return '';
  switch (content.kind) {
    case 'thumbnail':
      return `Thumbnail · ${content.hook} — ${content.subline} (${content.context})`;
    case 'concept':
      return `Concept "${content.name}" (${content.category}): ${content.definition}\n${content.points.join('\n')}`;
    case 'formula':
      return `Formula: ${content.title}\n${content.equation}\n${content.description}`;
    case 'compare':
      return `${content.leftTitle} vs ${content.rightTitle}\nLeft:\n${content.leftBullets.join('\n')}\nRight:\n${content.rightBullets.join('\n')}`;
    case 'dayLog':
      return `Day ${content.day}/${content.total} — ${content.focus}: ${content.insight}`;
    case 'curve':
      return `Curve (${content.curve}): ${content.title} — ${content.caption}`;
    case 'network':
      return `Network ${content.layers.join('-')}: ${content.title} — ${content.caption}`;
    case 'code':
      return `${content.language} code · ${content.title}\n${content.code}`;
    case 'quote':
      return `"${content.text}" — ${content.attribution}`;
    case 'tips':
      return `${content.title}\n${content.tips.join('\n')}`;
    case 'announce':
      return `${content.eyebrow} | ${content.headline} | ${content.cta}`;
    case 'explainer':
      return `${content.code}\nKey points:\n${content.points.join('\n')}`;
    case 'carousel':
      return content.slides
        .map((s) =>
          s.type === 'tip'
            ? `${s.number}. ${s.heading} — ${s.body}`
            : `${s.title}: ${s.subtitle}`,
        )
        .join('\n');
    case 'fullImage':
      return content.caption
        ? `Full-image post — caption: ${content.caption}`
        : 'Full-image post (image only, no caption)';
  }
}

export const useStudioStore = create<StudioState>()(
  persist(
    (set, get) => ({
      templateId: 'thumbnail',
      themeId: 'cosmic',

      contentByKind: { ...SAMPLE_CONTENT },

      author: {
        name: 'Your Name',
        tagline: 'AI Engineer · Learning in Public',
      },

      ai: {
        thumbnails: { loading: false },
        caption: { loading: false, tone: 'professional' },
      },

      setTemplate: (id) => set({ templateId: id }),
      setTheme: (id) => set({ themeId: id }),

      patchContent: (kind, patch) =>
        set((state) => {
          const current = state.contentByKind[kind] ?? SAMPLE_CONTENT[kind];
          return {
            contentByKind: {
              ...state.contentByKind,
              [kind]: { ...current, ...patch } as TemplateContent,
            },
          };
        }),

      setAuthor: (patch) =>
        set((state) => ({ author: { ...state.author, ...patch } })),

      setHero: (hero) => set({ hero }),

      setProfileImage: (dataUrl) =>
        set((state) => ({
          author: { ...state.author, profileImageDataUrl: dataUrl },
        })),

      generateThumbnails: async (idea) => {
        set((state) => ({
          ai: { ...state.ai, thumbnails: { loading: true } },
        }));
        try {
          const res = await fetch('/api/generate-thumbnails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idea }),
          });
          if (!res.ok) {
            const body = (await res.json().catch(() => ({}))) as {
              error?: string;
            };
            throw new Error(body.error ?? `HTTP ${res.status}`);
          }
          const { variants } = (await res.json()) as {
            variants: ThumbnailVariant[];
          };
          set((state) => ({
            ai: { ...state.ai, thumbnails: { loading: false, variants } },
          }));
        } catch (err) {
          set((state) => ({
            ai: {
              ...state.ai,
              thumbnails: { loading: false, error: (err as Error).message },
            },
          }));
        }
      },

      pickThumbnailVariant: (index) => {
        const variants = get().ai.thumbnails.variants;
        const v = variants?.[index];
        if (!v) return;
        set((state) => ({
          contentByKind: {
            ...state.contentByKind,
            thumbnail: {
              kind: 'thumbnail',
              style: v.style,
              hook: v.hook,
              subline: v.subline,
              context: v.context,
            },
          },
        }));
      },

      generateCaption: async (tone) => {
        set((state) => ({
          ai: {
            ...state.ai,
            caption: { ...state.ai.caption, loading: true, tone },
          },
        }));
        try {
          const state = get();
          const content = state.contentByKind[state.templateId];
          const res = await fetch('/api/generate-caption', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              tone,
              authorHandle: state.author.name,
              graphicSummary: summarizeContent(content),
            }),
          });
          if (!res.ok) {
            const body = (await res.json().catch(() => ({}))) as {
              error?: string;
            };
            throw new Error(body.error ?? `HTTP ${res.status}`);
          }
          const { caption } = (await res.json()) as { caption: string };
          set((s) => ({
            ai: { ...s.ai, caption: { loading: false, text: caption, tone } },
          }));
        } catch (err) {
          set((s) => ({
            ai: {
              ...s.ai,
              caption: {
                ...s.ai.caption,
                loading: false,
                error: (err as Error).message,
              },
            },
          }));
        }
      },
    }),
    {
      // SPEC §18 open Q: persist Author? → yes. Cheap UX win, low blast radius.
      // Also persist themeId so users keep their preferred palette across visits.
      // Content edits stay in-memory by design — large data-URLs in localStorage
      // hit quota fast and refresh-as-reset is the expected behaviour for
      // free design tools.
      name: 'lps-studio-v1',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        author: state.author,
        themeId: state.themeId,
      }),
    },
  ),
);
