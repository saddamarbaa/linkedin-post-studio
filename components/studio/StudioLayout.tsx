'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import { AlertTriangle, ChevronLeft, ChevronRight, Sparkles, Square } from 'lucide-react';

import { CaptionGenerator } from '@/components/ai/CaptionGenerator';
import { ContentEditor } from '@/components/controls/ContentEditor';
import { ImageUploader } from '@/components/controls/ImageUploader';
import { TemplatePicker } from '@/components/controls/TemplatePicker';
import { ThemePicker } from '@/components/controls/ThemePicker';
import { YourInfo } from '@/components/controls/YourInfo';
import { DownloadButton } from '@/components/studio/DownloadButton';
import { AnnounceTemplate } from '@/components/templates/AnnounceTemplate';
import { CarouselTemplate } from '@/components/templates/CarouselTemplate';
import { CodeTemplate } from '@/components/templates/CodeTemplate';
import { CompareTemplate } from '@/components/templates/CompareTemplate';
import { ConceptTemplate } from '@/components/templates/ConceptTemplate';
import { DayLogTemplate } from '@/components/templates/DayLogTemplate';
import { ExplainerTemplate } from '@/components/templates/ExplainerTemplate';
import { FormulaTemplate } from '@/components/templates/FormulaTemplate';
import { QuoteTemplate } from '@/components/templates/QuoteTemplate';
import { ThumbnailTemplate } from '@/components/templates/ThumbnailTemplate';
import { TipsTemplate } from '@/components/templates/TipsTemplate';
import { Card } from '@/components/ui/card';
import { AiConfigProvider, useAiEnabled } from '@/lib/ai-config-context';
import { CarouselSlideProvider, useCarouselSlide } from '@/lib/carousel-context';
import { THEMES } from '@/lib/constants/themes';
import { TEMPLATES } from '@/lib/constants/templates';
import { useStudioStore } from '@/lib/store/useStudioStore';
import { cn } from '@/lib/utils';
import type { Author, HeroImage, TemplateContent, Theme } from '@/types/studio';

// Heaviest templates lazy-loaded so the initial bundle doesn't carry their math.
const CurveTemplate = dynamic(
  () => import('@/components/templates/CurveTemplate').then((m) => m.CurveTemplate),
  { ssr: false },
);
const NetworkTemplate = dynamic(
  () =>
    import('@/components/templates/NetworkTemplate').then((m) => m.NetworkTemplate),
  { ssr: false },
);

interface StudioLayoutProps {
  aiEnabled: boolean;
}

export function StudioLayout({ aiEnabled }: StudioLayoutProps) {
  return (
    <AiConfigProvider enabled={aiEnabled}>
      <CarouselSlideProvider>
        <StudioInner />
      </CarouselSlideProvider>
    </AiConfigProvider>
  );
}

function StudioInner() {
  const aiEnabled = useAiEnabled();
  const templateId = useStudioStore((s) => s.templateId);
  const themeId = useStudioStore((s) => s.themeId);
  const author = useStudioStore((s) => s.author);
  const hero = useStudioStore((s) => s.hero);
  const content = useStudioStore((s) => s.contentByKind[templateId]);
  const { index: slideIndex, setIndex: setSlideIndex } = useCarouselSlide();

  const containerRef = useRef<HTMLDivElement>(null);
  const theme = THEMES[themeId];
  const meta = TEMPLATES[templateId];

  const isCarousel = content?.kind === 'carousel';
  const carouselLen = isCarousel && content ? content.slides.length : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="mx-auto max-w-3xl px-4 md:px-6 py-6 space-y-5">
        <Card className="p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Sparkles className="size-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  Post Studio
                </h1>
                <p className="text-xs text-slate-500">
                  Beautiful ML/AI graphics for LinkedIn creators
                </p>
              </div>
            </div>
            <DownloadButton
              containerRef={containerRef}
              carouselSlides={isCarousel ? carouselLen : 0}
              onSlideChange={setSlideIndex}
              variant="header"
            />
          </div>
          <AiBanner />
        </Card>

        <TemplatePicker />
        <ThemePicker />
        <ContentEditor />
        <ImageUploader />
        <YourInfo />

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="size-2.5 rounded-full bg-red-400" />
                <div className="size-2.5 rounded-full bg-yellow-400" />
                <div className="size-2.5 rounded-full bg-green-400" />
              </div>
              <span className="text-xs font-semibold text-slate-500 ml-2">
                Preview · 1200×1200 · {meta.name} · {theme.name}
                {isCarousel && carouselLen > 0
                  ? ` · ${Math.min(slideIndex + 1, carouselLen)} / ${carouselLen}`
                  : ''}
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
              <Square className="size-3.5" aria-hidden />
              <span>1:1</span>
            </div>
          </div>

          <div className="relative">
            <div
              ref={containerRef}
              className="aspect-square w-full rounded-xl overflow-hidden shadow-2xl ring-1 ring-slate-200 bg-white"
              aria-live="polite"
              aria-atomic="false"
              aria-label={`Live preview of ${meta.name} template`}
            >
              {content && (
                <ActiveTemplate
                  theme={theme}
                  content={content}
                  author={author}
                  hero={hero}
                  slideIndex={slideIndex}
                />
              )}
            </div>

            {isCarousel && carouselLen > 1 && (
              <SlideChevrons
                count={carouselLen}
                index={slideIndex}
                onChange={setSlideIndex}
              />
            )}
          </div>

          <p className="text-[11px] text-slate-500 mt-3 text-center">
            <span className="font-semibold">Tip:</span> if download doesn&apos;t
            work, right-click the preview above and choose{' '}
            <span className="font-semibold">&ldquo;Save image as…&rdquo;</span>{' '}
            to save directly.
          </p>
        </Card>

        {aiEnabled && <CaptionGenerator />}
      </div>
    </div>
  );
}

function AiBanner() {
  const enabled = useAiEnabled();
  if (enabled) return null;
  return (
    <div className="mt-3 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs text-amber-900">
      <AlertTriangle className="size-3.5" />
      <span>
        AI off — add{' '}
        <code className="font-mono text-[11px] bg-amber-100 px-1 rounded">
          ANTHROPIC_API_KEY
        </code>{' '}
        to <code className="font-mono text-[11px]">.env.local</code>.
      </span>
    </div>
  );
}

function SlideChevrons({
  count,
  index,
  onChange,
}: {
  count: number;
  index: number;
  onChange: (i: number) => void;
}) {
  const atStart = index === 0;
  const atEnd = index === count - 1;
  return (
    <>
      <button
        type="button"
        onClick={() => onChange(Math.max(0, index - 1))}
        disabled={atStart}
        aria-label="Previous slide"
        className={cn(
          'absolute left-3 top-1/2 -translate-y-1/2 size-12 rounded-full bg-white/95 shadow-lg flex items-center justify-center',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900',
          'disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white',
        )}
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        onClick={() => onChange(Math.min(count - 1, index + 1))}
        disabled={atEnd}
        aria-label="Next slide"
        className={cn(
          'absolute right-3 top-1/2 -translate-y-1/2 size-12 rounded-full bg-white/95 shadow-lg flex items-center justify-center',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900',
          'disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white',
        )}
      >
        <ChevronRight className="size-5" />
      </button>
    </>
  );
}

function ActiveTemplate({
  theme,
  content,
  author,
  hero,
  slideIndex,
}: {
  theme: Theme;
  content: TemplateContent;
  author: Author;
  hero?: HeroImage;
  slideIndex: number;
}) {
  switch (content.kind) {
    case 'thumbnail':
      return <ThumbnailTemplate theme={theme} content={content} author={author} hero={hero} />;
    case 'concept':
      return <ConceptTemplate theme={theme} content={content} author={author} hero={hero} />;
    case 'formula':
      return <FormulaTemplate theme={theme} content={content} author={author} hero={hero} />;
    case 'compare':
      return <CompareTemplate theme={theme} content={content} author={author} hero={hero} />;
    case 'dayLog':
      return <DayLogTemplate theme={theme} content={content} author={author} hero={hero} />;
    case 'curve':
      return <CurveTemplate theme={theme} content={content} author={author} hero={hero} />;
    case 'network':
      return <NetworkTemplate theme={theme} content={content} author={author} hero={hero} />;
    case 'code':
      return <CodeTemplate theme={theme} content={content} author={author} hero={hero} />;
    case 'quote':
      return <QuoteTemplate theme={theme} content={content} author={author} hero={hero} />;
    case 'tips':
      return <TipsTemplate theme={theme} content={content} author={author} hero={hero} />;
    case 'announce':
      return <AnnounceTemplate theme={theme} content={content} author={author} hero={hero} />;
    case 'explainer':
      return <ExplainerTemplate theme={theme} content={content} author={author} hero={hero} />;
    case 'carousel':
      return (
        <CarouselTemplate
          theme={theme}
          content={content}
          author={author}
          hero={hero}
          slideIndex={slideIndex}
        />
      );
  }
}
