// Theme

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
  swatch: string;
  bgGradient: string[];
  text: string;
  muted: string;
  accent: string;
  accent2: string;
  cardBg: string;
  isDark: boolean;
}

// Templates

export type TemplateId =
  // Quick AI
  | 'thumbnail'
  // ML/AI
  | 'concept'
  | 'formula'
  | 'compare'
  | 'dayLog'
  | 'curve'
  | 'network'
  // Basic
  | 'code'
  | 'quote'
  | 'tips'
  | 'announce'
  | 'explainer'
  | 'carousel'
  | 'fullImage';

export type ThumbnailStyle = 'shock' | 'question' | 'stat' | 'reveal';

export type CurveKind =
  | 'sigmoid'
  | 'relu'
  | 'tanh'
  | 'gaussian'
  | 'logloss'
  | 'convex';

export type CarouselSlide =
  | { type: 'cover'; title: string; subtitle: string }
  | { type: 'tip'; number: number; heading: string; body: string }
  | { type: 'cta'; title: string; subtitle: string };

export type TemplateContent =
  | {
      kind: 'thumbnail';
      hook: string;
      subline: string;
      context: string;
      style: ThumbnailStyle;
    }
  | {
      kind: 'concept';
      name: string;
      category: string;
      definition: string;
      points: [string, string, string];
    }
  | {
      kind: 'formula';
      title: string;
      equation: string;
      description: string;
    }
  | {
      kind: 'compare';
      leftTitle: string;
      leftBullets: string[];
      rightTitle: string;
      rightBullets: string[];
    }
  | {
      kind: 'dayLog';
      day: number;
      total: number;
      focus: string;
      insight: string;
      progressPct: number;
    }
  | {
      kind: 'curve';
      title: string;
      curve: CurveKind;
      caption: string;
    }
  | {
      kind: 'network';
      title: string;
      layers: number[];
      caption: string;
    }
  | {
      kind: 'code';
      title: string;
      language: string;
      code: string;
      imageDataUrl?: string;
    }
  | {
      kind: 'quote';
      text: string;
      attribution: string;
    }
  | {
      kind: 'tips';
      title: string;
      tips: string[];
    }
  | {
      kind: 'announce';
      eyebrow: string;
      headline: string;
      cta: string;
    }
  | {
      kind: 'explainer';
      code: string;
      points: string[];
    }
  | {
      kind: 'carousel';
      slides: CarouselSlide[];
    }
  | {
      kind: 'fullImage';
      caption: string;
      imageDataUrl?: string;
      imageWidth?: number;
      imageHeight?: number;
      imageFit?: 'fit' | 'fill';
    };

export type TemplateKind = TemplateContent['kind'];

// Author / footer

export interface Author {
  name: string;
  tagline: string;
  profileImageDataUrl?: string;
}

// Hero image

export type HeroLayout = 'hero' | 'split' | 'background' | 'inline';

export interface HeroImage {
  dataUrl: string;
  layout: HeroLayout;
  opacity: number;
}

// AI

export type CaptionTone =
  | 'professional'
  | 'casual'
  | 'bold'
  | 'storytelling';

export interface ThumbnailVariant {
  style: ThumbnailStyle;
  hook: string;
  subline: string;
  context: string;
}

// Store

export interface StudioState {
  templateId: TemplateId;
  themeId: ThemeId;

  contentByKind: Partial<Record<TemplateKind, TemplateContent>>;

  author: Author;
  hero?: HeroImage;

  ai: {
    thumbnails: {
      loading: boolean;
      error?: string;
      variants?: ThumbnailVariant[];
    };
    caption: {
      loading: boolean;
      error?: string;
      text?: string;
      tone: CaptionTone;
    };
  };

  setTemplate: (id: TemplateId) => void;
  setTheme: (id: ThemeId) => void;
  patchContent: <K extends TemplateKind>(
    kind: K,
    patch: Partial<Extract<TemplateContent, { kind: K }>>,
  ) => void;
  setAuthor: (patch: Partial<Author>) => void;
  setHero: (hero?: HeroImage) => void;
  setProfileImage: (dataUrl?: string) => void;

  generateThumbnails: (idea: string) => Promise<void>;
  pickThumbnailVariant: (index: number) => void;
  generateCaption: (tone: CaptionTone) => Promise<void>;
}
