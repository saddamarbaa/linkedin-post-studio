import {
  Zap,
  Brain,
  Sigma,
  GitCompare,
  Calendar,
  TrendingUp,
  Network,
  Code2,
  Quote,
  Lightbulb,
  Megaphone,
  BookOpen,
  Layers,
  Image as ImageIcon,
  type LucideIcon,
} from 'lucide-react';

import type { TemplateId, TemplateKind } from '@/types/studio';

export type TemplateGroup = 'quick' | 'ml' | 'basic';

export interface TemplateMeta {
  id: TemplateId;
  // The discriminant used to look up content in `contentByKind`.
  // Identical to `id` today; kept separate so renaming a TemplateId in the
  // picker UI doesn't have to renumber the store keys.
  kind: TemplateKind;
  name: string;
  group: TemplateGroup;
  description: string;
  Icon: LucideIcon;
}

export const TEMPLATES: Record<TemplateId, TemplateMeta> = {
  thumbnail: {
    id: 'thumbnail',
    kind: 'thumbnail',
    name: 'Quick AI',
    group: 'quick',
    description: 'One-line idea → 4 scroll-stopping thumbnail variants.',
    Icon: Zap,
  },
  concept: {
    id: 'concept',
    kind: 'concept',
    name: 'ML Concept',
    group: 'ml',
    description: 'Definition + 3 key points for a single ML/AI idea.',
    Icon: Brain,
  },
  formula: {
    id: 'formula',
    kind: 'formula',
    name: 'Formula',
    group: 'ml',
    description: 'Big equation card with explanation.',
    Icon: Sigma,
  },
  compare: {
    id: 'compare',
    kind: 'compare',
    name: 'VS',
    group: 'ml',
    description: 'Side-by-side comparison of two approaches.',
    Icon: GitCompare,
  },
  dayLog: {
    id: 'dayLog',
    kind: 'dayLog',
    name: 'Day Log',
    group: 'ml',
    description: 'Build-in-public day counter + insight.',
    Icon: Calendar,
  },
  curve: {
    id: 'curve',
    kind: 'curve',
    name: 'Curve',
    group: 'ml',
    description: 'Plot a math function (sigmoid, ReLU, tanh, …).',
    Icon: TrendingUp,
  },
  network: {
    id: 'network',
    kind: 'network',
    name: 'Network',
    group: 'ml',
    description: 'Neural network architecture diagram from a layer list.',
    Icon: Network,
  },
  code: {
    id: 'code',
    kind: 'code',
    name: 'Code',
    group: 'basic',
    description: 'Code snippet or screenshot in a macOS window frame.',
    Icon: Code2,
  },
  quote: {
    id: 'quote',
    kind: 'quote',
    name: 'Quote',
    group: 'basic',
    description: 'Pull-quote with attribution.',
    Icon: Quote,
  },
  tips: {
    id: 'tips',
    kind: 'tips',
    name: 'Tips',
    group: 'basic',
    description: 'Numbered list, up to 5 tips.',
    Icon: Lightbulb,
  },
  announce: {
    id: 'announce',
    kind: 'announce',
    name: 'Announce',
    group: 'basic',
    description: 'Eyebrow + headline + CTA for ship announcements.',
    Icon: Megaphone,
  },
  explainer: {
    id: 'explainer',
    kind: 'explainer',
    name: 'Explain',
    group: 'basic',
    description: 'Code window + bullet takeaways.',
    Icon: BookOpen,
  },
  carousel: {
    id: 'carousel',
    kind: 'carousel',
    name: 'Carousel',
    group: 'basic',
    description: 'Multi-slide swipe-through (cover, tips, CTA).',
    Icon: Layers,
  },
  fullImage: {
    id: 'fullImage',
    kind: 'fullImage',
    name: 'Full Image',
    group: 'basic',
    description: 'Big image fills the upper container, branded footer below.',
    Icon: ImageIcon,
  },
};

export const TEMPLATE_LIST: TemplateMeta[] = Object.values(TEMPLATES);

export const TEMPLATE_GROUPS: ReadonlyArray<{
  id: TemplateGroup;
  label: string;
}> = [
  { id: 'quick', label: 'Quick AI' },
  { id: 'ml', label: 'ML & AI' },
  { id: 'basic', label: 'Basic' },
];
