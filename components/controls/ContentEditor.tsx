'use client';

import { useRef } from 'react';
import { toast } from 'sonner';
import { Image as ImageIcon, Plus, Trash2, Upload, X } from 'lucide-react';

import { QuickAIPanel } from '@/components/controls/QuickAIPanel';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { useAiEnabled } from '@/lib/ai-config-context';
import { useCarouselSlide } from '@/lib/carousel-context';
import { TEMPLATES } from '@/lib/constants/templates';
import { useStudioStore } from '@/lib/store/useStudioStore';
import { validateAndConvertToBase64 } from '@/lib/utils/file-upload';
import { cn } from '@/lib/utils';
import type {
  CarouselSlide,
  CurveKind,
  TemplateContent,
  TemplateKind,
  ThumbnailStyle,
} from '@/types/studio';

const FONT_MONO = 'font-mono text-sm';
const INPUT_BASE = 'bg-slate-50 border-slate-200';
const FIELD_LABEL = 'block text-xs font-semibold text-slate-600 mb-1.5';

export function ContentEditor() {
  const templateId = useStudioStore((s) => s.templateId);
  const content = useStudioStore((s) => s.contentByKind[templateId]);
  const aiEnabled = useAiEnabled();

  if (!content) return null;

  // For the Quick AI / thumbnail template, the Content card shows the AI
  // generation flow (banner + idea input + Generate 4 Designs button) instead
  // of the manual Hook/Subline/Context fields. When AI is disabled (no API
  // key) we fall back to the manual editor.
  const isQuickAi = content.kind === 'thumbnail' && aiEnabled;

  return (
    <Card>
      <CardContent className="space-y-4">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Content
        </h3>
        {isQuickAi ? <QuickAIPanel /> : <Editor content={content} />}
      </CardContent>
    </Card>
  );
}

function Editor({ content }: { content: TemplateContent }) {
  switch (content.kind) {
    case 'thumbnail':
      return <ThumbnailEditor content={content} />;
    case 'concept':
      return <ConceptEditor content={content} />;
    case 'formula':
      return <FormulaEditor content={content} />;
    case 'compare':
      return <CompareEditor content={content} />;
    case 'dayLog':
      return <DayLogEditor content={content} />;
    case 'curve':
      return <CurveEditor content={content} />;
    case 'network':
      return <NetworkEditor content={content} />;
    case 'code':
      return <CodeEditor content={content} />;
    case 'quote':
      return <QuoteEditor content={content} />;
    case 'tips':
      return <TipsEditor content={content} />;
    case 'announce':
      return <AnnounceEditor content={content} />;
    case 'explainer':
      return <ExplainerEditor content={content} />;
    case 'carousel':
      return <CarouselEditor content={content} />;
    case 'fullImage':
      return <FullImageEditor content={content} />;
  }
}

function usePatch<K extends TemplateKind>(kind: K) {
  const patch = useStudioStore((s) => s.patchContent);
  return (changes: Partial<Extract<TemplateContent, { kind: K }>>) =>
    patch(kind, changes);
}

// — thumbnail —

const STYLES: { id: ThumbnailStyle; label: string }[] = [
  { id: 'shock', label: 'Shock' },
  { id: 'question', label: 'Question' },
  { id: 'stat', label: 'Stat' },
  { id: 'reveal', label: 'Reveal' },
];

function ThumbnailEditor({
  content,
}: {
  content: Extract<TemplateContent, { kind: 'thumbnail' }>;
}) {
  const patch = usePatch('thumbnail');
  return (
    <>
      <div>
        <Label className={FIELD_LABEL}>Style</Label>
        <div className="grid grid-cols-2 gap-2">
          {STYLES.map((s) => (
            <Toggle
              key={s.id}
              active={content.style === s.id}
              onClick={() => patch({ style: s.id })}
            >
              {s.label}
            </Toggle>
          ))}
        </div>
      </div>
      <Field
        id="th-hook"
        label={`Hook (${content.hook.length}/35)`}
        value={content.hook}
        onChange={(hook) => patch({ hook })}
        maxLength={35}
        placeholder="STOP USING SQUARED ERROR"
      />
      <Field
        id="th-subline"
        label={`Subline (${content.subline.length}/30)`}
        value={content.subline}
        onChange={(subline) => patch({ subline })}
        maxLength={30}
        placeholder="For logistic regression"
      />
      <Field
        id="th-context"
        label={`Context (${content.context.length}/25)`}
        value={content.context}
        onChange={(context) => patch({ context })}
        maxLength={25}
        placeholder="WHY IT FAILS"
      />
    </>
  );
}

// — concept —

function ConceptEditor({
  content,
}: {
  content: Extract<TemplateContent, { kind: 'concept' }>;
}) {
  const patch = usePatch('concept');
  return (
    <>
      <Field
        id="c-cat"
        label="Category"
        value={content.category}
        onChange={(category) => patch({ category })}
        placeholder="Logistic regression"
      />
      <Field
        id="c-name"
        label="Concept Name"
        value={content.name}
        onChange={(name) => patch({ name })}
        placeholder="Cost Function"
      />
      <FieldArea
        id="c-def"
        label="Definition"
        value={content.definition}
        onChange={(definition) => patch({ definition })}
        rows={3}
      />
      {content.points.map((pt, i) => (
        <Field
          key={i}
          id={`c-pt-${i}`}
          label={`Key Point ${i + 1}`}
          value={pt}
          maxLength={60}
          onChange={(v) => {
            const next: [string, string, string] = [
              content.points[0],
              content.points[1],
              content.points[2],
            ];
            next[i] = v;
            patch({ points: next });
          }}
        />
      ))}
    </>
  );
}

// — formula —

function FormulaEditor({
  content,
}: {
  content: Extract<TemplateContent, { kind: 'formula' }>;
}) {
  const patch = usePatch('formula');
  return (
    <>
      <Field
        id="f-title"
        label="Formula Title"
        value={content.title}
        onChange={(title) => patch({ title })}
      />
      <FieldArea
        id="f-eq"
        label="Equation (use ·, ², θ, Σ, etc.)"
        value={content.equation}
        onChange={(equation) => patch({ equation })}
        rows={2}
        className={FONT_MONO}
        placeholder="J(θ) = -[y·log(h) + (1-y)·log(1-h)]"
      />
      <FieldArea
        id="f-desc"
        label="Explanation"
        value={content.description}
        onChange={(description) => patch({ description })}
        rows={3}
      />
    </>
  );
}

// — compare —

function CompareEditor({
  content,
}: {
  content: Extract<TemplateContent, { kind: 'compare' }>;
}) {
  const patch = usePatch('compare');
  return (
    <>
      <Field
        id="cmp-lt"
        label="Left Label (the worse option)"
        value={content.leftTitle}
        onChange={(leftTitle) => patch({ leftTitle })}
        placeholder="Squared Error"
      />
      <FieldArea
        id="cmp-lb"
        label="Left Points (one per line)"
        value={content.leftBullets.join('\n')}
        onChange={(v) => patch({ leftBullets: linesOf(v) })}
        rows={4}
      />
      <Field
        id="cmp-rt"
        label="Right Label (the better option)"
        value={content.rightTitle}
        onChange={(rightTitle) => patch({ rightTitle })}
        placeholder="Cross-Entropy"
      />
      <FieldArea
        id="cmp-rb"
        label="Right Points (one per line)"
        value={content.rightBullets.join('\n')}
        onChange={(v) => patch({ rightBullets: linesOf(v) })}
        rows={4}
      />
    </>
  );
}

// — dayLog —

function DayLogEditor({
  content,
}: {
  content: Extract<TemplateContent, { kind: 'dayLog' }>;
}) {
  const patch = usePatch('dayLog');
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <NumberField
          id="dl-day"
          label="Day Number"
          value={content.day}
          onChange={(day) => patch({ day })}
          min={1}
          max={9999}
        />
        <NumberField
          id="dl-total"
          label="Total"
          value={content.total}
          onChange={(total) => patch({ total })}
          min={1}
          max={9999}
        />
      </div>
      <FieldArea
        id="dl-focus"
        label="Today's Topic"
        value={content.focus}
        onChange={(focus) => patch({ focus })}
        rows={2}
      />
      <FieldArea
        id="dl-insight"
        label="Key Insight (in your own words)"
        value={content.insight}
        onChange={(insight) => patch({ insight })}
        rows={3}
      />
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <Label className={FIELD_LABEL}>Progress</Label>
          <span className="text-xs text-slate-500 tabular-nums">
            {content.progressPct}%
          </span>
        </div>
        <Slider
          value={[content.progressPct]}
          onValueChange={([v]) => patch({ progressPct: v })}
          min={0}
          max={100}
          step={1}
        />
      </div>
    </>
  );
}

// — curve —

const CURVE_OPTIONS: { id: CurveKind; label: string }[] = [
  { id: 'sigmoid', label: 'Sigmoid' },
  { id: 'relu', label: 'ReLU' },
  { id: 'tanh', label: 'Tanh' },
  { id: 'gaussian', label: 'Gaussian' },
  { id: 'logloss', label: 'Log-loss' },
  { id: 'convex', label: 'Convex' },
];

function CurveEditor({
  content,
}: {
  content: Extract<TemplateContent, { kind: 'curve' }>;
}) {
  const patch = usePatch('curve');
  return (
    <>
      <Field
        id="cv-title"
        label="Title"
        value={content.title}
        onChange={(title) => patch({ title })}
      />
      <Field
        id="cv-cap"
        label="Subtitle"
        value={content.caption}
        onChange={(caption) => patch({ caption })}
        placeholder="Squashes any input into 0–1 probability"
      />
      <div>
        <Label className={FIELD_LABEL}>Curve Type</Label>
        <div className="grid grid-cols-3 gap-2">
          {CURVE_OPTIONS.map((c) => (
            <Toggle
              key={c.id}
              active={content.curve === c.id}
              onClick={() => patch({ curve: c.id })}
            >
              {c.label}
            </Toggle>
          ))}
        </div>
      </div>
    </>
  );
}

// — network —

function NetworkEditor({
  content,
}: {
  content: Extract<TemplateContent, { kind: 'network' }>;
}) {
  const patch = usePatch('network');
  return (
    <>
      <Field
        id="nw-title"
        label="Title"
        value={content.title}
        onChange={(title) => patch({ title })}
      />
      <Field
        id="nw-cap"
        label="Subtitle"
        value={content.caption}
        onChange={(caption) => patch({ caption })}
      />
      <Field
        id="nw-layers"
        label="Layer Sizes (comma-separated, e.g., 4,6,6,3,1)"
        value={content.layers.join(',')}
        onChange={(v) =>
          patch({
            layers: v
              .split(',')
              .map((s) => parseInt(s.trim(), 10))
              .filter((n) => Number.isFinite(n) && n > 0),
          })
        }
        placeholder="4,6,6,3,1"
        className={FONT_MONO}
      />
    </>
  );
}

// — code (with optional code-image upload) —

function CodeEditor({
  content,
}: {
  content: Extract<TemplateContent, { kind: 'code' }>;
}) {
  const patch = usePatch('code');
  return (
    <>
      <Field
        id="code-title"
        label="Title"
        value={content.title}
        onChange={(title) => patch({ title })}
      />
      <Field
        id="code-lang"
        label="Language"
        value={content.language}
        onChange={(language) => patch({ language })}
        placeholder="python"
      />
      <CodeImageBlock
        value={content.imageDataUrl}
        onChange={(imageDataUrl) => patch({ imageDataUrl })}
      />
      {!content.imageDataUrl && (
        <FieldArea
          id="code-body"
          label="Code"
          value={content.code}
          onChange={(code) => patch({ code })}
          rows={10}
          className={FONT_MONO}
        />
      )}
    </>
  );
}

// — quote —

function QuoteEditor({
  content,
}: {
  content: Extract<TemplateContent, { kind: 'quote' }>;
}) {
  const patch = usePatch('quote');
  return (
    <>
      <FieldArea
        id="q-text"
        label="Quote"
        value={content.text}
        onChange={(text) => patch({ text })}
        rows={5}
      />
      <Field
        id="q-attr"
        label="Attribution"
        value={content.attribution}
        onChange={(attribution) => patch({ attribution })}
        placeholder="Optional"
      />
    </>
  );
}

// — tips —

function TipsEditor({
  content,
}: {
  content: Extract<TemplateContent, { kind: 'tips' }>;
}) {
  const patch = usePatch('tips');
  return (
    <>
      <Field
        id="tips-title"
        label="Title"
        value={content.title}
        onChange={(title) => patch({ title })}
      />
      <FieldArea
        id="tips-list"
        label="Tips (one per line, max 5)"
        value={content.tips.join('\n')}
        onChange={(v) => patch({ tips: linesOf(v).slice(0, 5) })}
        rows={5}
      />
    </>
  );
}

// — announce —

function AnnounceEditor({
  content,
}: {
  content: Extract<TemplateContent, { kind: 'announce' }>;
}) {
  const patch = usePatch('announce');
  return (
    <>
      <Field
        id="ann-eyebrow"
        label="Eyebrow"
        value={content.eyebrow}
        onChange={(eyebrow) => patch({ eyebrow })}
        placeholder="SHIPPED"
      />
      <FieldArea
        id="ann-headline"
        label="Headline"
        value={content.headline}
        onChange={(headline) => patch({ headline })}
        rows={2}
      />
      <FieldArea
        id="ann-cta"
        label="Description"
        value={content.cta}
        onChange={(cta) => patch({ cta })}
        rows={3}
      />
    </>
  );
}

// — explainer (with optional code-image) —

function ExplainerEditor({
  content,
}: {
  content: Extract<TemplateContent, { kind: 'explainer' }>;
}) {
  const patch = usePatch('explainer');
  // Reuse Code's imageDataUrl slot via the Code template's content. Since the
  // Explainer's content type doesn't carry an image, we keep the upload
  // affordance visible but disabled in that path — flagged as a future spec
  // extension if you want screenshots in explainers too.
  return (
    <>
      <FieldArea
        id="ex-code"
        label="Code"
        value={content.code}
        onChange={(code) => patch({ code })}
        rows={6}
        className={FONT_MONO}
      />
      <FieldArea
        id="ex-points"
        label="Takeaways (one per line)"
        value={content.points.join('\n')}
        onChange={(v) => patch({ points: linesOf(v).slice(0, 5) })}
        rows={5}
      />
    </>
  );
}

// — carousel: slide-tabs at top + active-slide editor below —

function CarouselEditor({
  content,
}: {
  content: Extract<TemplateContent, { kind: 'carousel' }>;
}) {
  const patch = usePatch('carousel');
  const { index, setIndex } = useCarouselSlide();
  const slides = content.slides;
  const safeIndex = Math.min(Math.max(index, 0), Math.max(slides.length - 1, 0));
  const active = slides[safeIndex];

  const setSlide = (i: number, slide: CarouselSlide) => {
    patch({ slides: slides.map((s, idx) => (idx === i ? slide : s)) });
  };

  const removeSlide = (i: number) => {
    if (slides.length <= 2) return;
    const nextSlides = slides.filter((_, idx) => idx !== i);
    patch({ slides: nextSlides });
    setIndex(Math.min(safeIndex, nextSlides.length - 1));
  };

  const addSlide = (type: CarouselSlide['type']) => {
    if (slides.length >= 10) return;
    const tipNum = slides.filter((s) => s.type === 'tip').length + 1;
    const newSlide: CarouselSlide =
      type === 'cover'
        ? { type: 'cover', title: '', subtitle: '' }
        : type === 'tip'
          ? { type: 'tip', number: tipNum, heading: '', body: '' }
          : { type: 'cta', title: '', subtitle: '' };
    patch({ slides: [...slides, newSlide] });
    setIndex(slides.length);
  };

  return (
    <>
      <div>
        <Label className="block text-xs font-semibold text-slate-600 mb-2">
          Slides ({slides.length}/10)
        </Label>
        <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1">
          {slides.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-pressed={safeIndex === i}
              title={s.type}
              className={cn(
                'flex-shrink-0 size-10 rounded-lg text-xs font-bold transition-all',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900',
                safeIndex === i
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
              )}
            >
              {i + 1}
            </button>
          ))}
          {slides.length < 10 && (
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => addSlide('cover')}
                title="Add cover slide"
                className="flex-shrink-0 size-10 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 flex items-center justify-center border-2 border-dashed border-slate-300"
              >
                <Plus className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => addSlide('tip')}
                title="Add tip slide"
                className="flex-shrink-0 px-2 h-10 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 text-[10px] font-bold border border-slate-200"
              >
                +Tip
              </button>
              <button
                type="button"
                onClick={() => addSlide('cta')}
                title="Add CTA slide"
                className="flex-shrink-0 px-2 h-10 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 text-[10px] font-bold border border-slate-200"
              >
                +CTA
              </button>
            </div>
          )}
        </div>
      </div>

      {active && (
        <div className="bg-slate-50 rounded-lg p-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">
              Slide {safeIndex + 1} ({active.type})
            </span>
            {slides.length > 2 && (
              <button
                type="button"
                onClick={() => removeSlide(safeIndex)}
                className="text-red-500 hover:text-red-700"
                aria-label="Delete slide"
              >
                <Trash2 className="size-3.5" />
              </button>
            )}
          </div>

          {active.type === 'tip' ? (
            <>
              <Field
                id={`sl-num-${safeIndex}`}
                label="Number"
                value={String(active.number)}
                onChange={(v) =>
                  setSlide(safeIndex, {
                    ...active,
                    number: parseInt(v, 10) || 1,
                  })
                }
              />
              <Field
                id={`sl-head-${safeIndex}`}
                label="Heading"
                value={active.heading}
                onChange={(v) => setSlide(safeIndex, { ...active, heading: v })}
              />
              <FieldArea
                id={`sl-body-${safeIndex}`}
                label="Body"
                value={active.body}
                onChange={(v) => setSlide(safeIndex, { ...active, body: v })}
                rows={3}
              />
            </>
          ) : (
            <>
              <FieldArea
                id={`sl-title-${safeIndex}`}
                label="Title"
                value={active.title}
                onChange={(v) => setSlide(safeIndex, { ...active, title: v })}
                rows={2}
              />
              <FieldArea
                id={`sl-sub-${safeIndex}`}
                label="Subtitle"
                value={active.subtitle}
                onChange={(v) =>
                  setSlide(safeIndex, { ...active, subtitle: v })
                }
                rows={2}
              />
            </>
          )}
        </div>
      )}
    </>
  );
}

// — fullImage —

function readImageDimensions(
  dataUrl: string,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () =>
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: 0, height: 0 });
    img.src = dataUrl;
  });
}

function FullImageEditor({
  content,
}: {
  content: Extract<TemplateContent, { kind: 'fullImage' }>;
}) {
  const patch = usePatch('fullImage');
  const fit = content.imageFit ?? 'fit';
  return (
    <>
      <FullImageBlock
        value={content.imageDataUrl}
        onChange={(imageDataUrl, imageWidth, imageHeight) =>
          patch({ imageDataUrl, imageWidth, imageHeight })
        }
      />
      {content.imageDataUrl && (
        <div className="flex items-center justify-between gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg">
          <div>
            <Label className="text-xs font-bold text-slate-700">Image fit</Label>
            <p className="text-[11px] text-slate-500 leading-snug">
              {fit === 'fill'
                ? 'Fills the area — wide images get cropped on the sides.'
                : 'Shows the whole image — leaves space above/below if not square.'}
            </p>
          </div>
          <div className="flex rounded-md overflow-hidden border border-slate-300">
            <button
              type="button"
              onClick={() => patch({ imageFit: 'fit' })}
              className={cn(
                'px-3 py-1 text-xs font-semibold transition-colors',
                fit === 'fit'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-100',
              )}
            >
              Fit
            </button>
            <button
              type="button"
              onClick={() => patch({ imageFit: 'fill' })}
              className={cn(
                'px-3 py-1 text-xs font-semibold transition-colors border-l border-slate-300',
                fit === 'fill'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-100',
              )}
            >
              Fill
            </button>
          </div>
        </div>
      )}
      <Field
        id="fi-caption"
        label={`Caption (optional, ${content.caption.length}/80)`}
        value={content.caption}
        onChange={(caption) => patch({ caption })}
        maxLength={80}
        placeholder="Optional one-liner under the image"
      />
    </>
  );
}

function FullImageBlock({
  value,
  onChange,
}: {
  value?: string;
  onChange: (
    dataUrl: string | undefined,
    width?: number,
    height?: number,
  ) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    const result = await validateAndConvertToBase64(file);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    const { width, height } = await readImageDimensions(result.dataUrl);
    onChange(result.dataUrl, width, height);
  };

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
          <ImageIcon className="size-3.5" />
          Full Image
        </Label>
        {value && (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-semibold"
          >
            <X className="size-3" /> Remove
          </button>
        )}
      </div>
      <p className="text-[11px] text-purple-800 leading-snug">
        Fills the upper container — screenshots, charts, photos. Aspect ratio is preserved.
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleFile(f);
          e.target.value = '';
        }}
      />
      {!value ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-purple-100 border border-purple-300 rounded-lg text-xs font-semibold text-purple-900 transition-all"
        >
          <Upload className="size-3.5" /> Upload image
        </button>
      ) : (
        <div className="relative rounded-lg overflow-hidden border-2 border-purple-300 bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Full image preview"
            className="w-full max-h-48 object-contain mx-auto"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-1 right-1 px-2 py-0.5 bg-white/95 rounded text-[10px] font-semibold shadow"
          >
            Change
          </button>
        </div>
      )}
    </div>
  );
}

// — code-image upload sub-card —

function CodeImageBlock({
  value,
  onChange,
}: {
  value?: string;
  onChange: (dataUrl: string | undefined) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    const result = await validateAndConvertToBase64(file);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    onChange(result.dataUrl);
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
          <ImageIcon className="size-3.5" />
          Code Block Image
        </Label>
        {value && (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-semibold"
          >
            <X className="size-3" /> Use code instead
          </button>
        )}
      </div>
      <p className="text-[11px] text-blue-800 leading-snug">
        Upload a screenshot of your code or IDE — replaces the code block below.
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleFile(f);
          e.target.value = '';
        }}
      />
      {!value ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-blue-100 border border-blue-300 rounded-lg text-xs font-semibold text-blue-900 transition-all"
        >
          <Upload className="size-3.5" /> Upload screenshot
        </button>
      ) : (
        // object-contain so big code screenshots show their actual content,
        // not a cropped horizontal band of it.
        <div className="relative rounded-lg overflow-hidden border-2 border-blue-300 bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Code preview"
            className="w-full max-h-48 object-contain mx-auto"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-1 right-1 px-2 py-0.5 bg-white/95 rounded text-[10px] font-semibold shadow"
          >
            Change
          </button>
        </div>
      )}
    </div>
  );
}

// — primitives (slate-50 inputs to match Old-code's Field component) —

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  maxLength,
  className,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
}) {
  return (
    <div>
      <Label htmlFor={id} className={FIELD_LABEL}>
        {label}
      </Label>
      <Input
        id={id}
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        className={cn(INPUT_BASE, className)}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function FieldArea({
  id,
  label,
  value,
  onChange,
  rows,
  placeholder,
  className,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div>
      <Label htmlFor={id} className={FIELD_LABEL}>
        {label}
      </Label>
      <Textarea
        id={id}
        value={value}
        rows={rows}
        placeholder={placeholder}
        className={cn(INPUT_BASE, 'resize-none', className)}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function NumberField({
  id,
  label,
  value,
  onChange,
  min,
  max,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div>
      <Label htmlFor={id} className={FIELD_LABEL}>
        {label}
      </Label>
      <Input
        id={id}
        type="number"
        value={value}
        min={min}
        max={max}
        className={INPUT_BASE}
        onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
      />
    </div>
  );
}

function Toggle({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-lg px-3 py-2 text-xs font-semibold transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900',
        active
          ? 'bg-slate-900 text-white shadow-sm'
          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200',
      )}
    >
      {children}
    </button>
  );
}

function linesOf(s: string): string[] {
  return s.split('\n').filter((line, i, arr) => i <= lastNonEmpty(arr));
}

function lastNonEmpty(arr: string[]): number {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i].trim()) return i;
  }
  return -1;
}
