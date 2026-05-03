'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Info, Loader2, Sparkles, Zap } from 'lucide-react';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useStudioStore } from '@/lib/store/useStudioStore';
import { cn } from '@/lib/utils';
import type { ThumbnailVariant } from '@/types/studio';

const STYLE_LABELS: Record<ThumbnailVariant['style'], string> = {
  shock: 'Shock',
  question: 'Question',
  stat: 'Stat',
  reveal: 'Reveal',
};

// Inlined inside the Content card when the Thumbnail (Quick AI) template is
// active. The yellow banner + idea input + orange "Generate 4 Designs" button
// match the screenshot's Quick AI Mode treatment.
export function QuickAIPanel() {
  const [idea, setIdea] = useState('');
  const ai = useStudioStore((s) => s.ai.thumbnails);
  const generate = useStudioStore((s) => s.generateThumbnails);
  const pick = useStudioStore((s) => s.pickThumbnailVariant);
  const setTemplate = useStudioStore((s) => s.setTemplate);

  useEffect(() => {
    if (ai.error) toast.error(ai.error);
  }, [ai.error]);

  const onGenerate = async () => {
    if (idea.trim().length < 5) {
      toast.error('Idea must be at least 5 characters.');
      return;
    }
    setTemplate('thumbnail');
    await generate(idea.trim());
  };

  const handlePick = (i: number) => {
    pick(i);
    setTemplate('thumbnail');
    toast.success(`Picked variant ${i + 1}.`);
  };

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-3 flex items-start gap-2.5">
        <div className="size-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shrink-0 shadow-sm">
          <Zap className="size-4 text-white" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-bold text-amber-900">Quick AI Mode</div>
          <div className="text-[11px] text-amber-800/80">
            No typing, no design — just one idea
          </div>
        </div>
      </div>

      <div>
        <Label
          htmlFor="qa-idea"
          className="block text-xs font-semibold text-slate-600 mb-1.5"
        >
          What&apos;s your post about?
        </Label>
        <Textarea
          id="qa-idea"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          rows={2}
          placeholder="Why squared error fails for logistic regression"
          className="bg-slate-50 border-slate-200 resize-none"
        />
      </div>

      <button
        type="button"
        onClick={onGenerate}
        disabled={ai.loading}
        className={cn(
          'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm text-white transition-all',
          'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700',
          'shadow-md shadow-orange-500/30',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500',
          'disabled:opacity-60 disabled:cursor-not-allowed',
        )}
      >
        {ai.loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Sparkles className="size-4" />
        )}
        {ai.loading ? 'Generating…' : 'Generate 4 Designs'}
      </button>

      <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 flex gap-2 text-[11px] leading-snug text-blue-900">
        <Info className="size-3.5 shrink-0 mt-0.5 text-blue-600" />
        <span>
          <span className="font-bold">How it works:</span> Just describe your
          post idea above and click generate. AI will create 4 different
          scroll-stopping designs (Shock, Question, Stat, Story) — pick your
          favorite and post it!
        </span>
      </div>

      {ai.loading && <SkeletonGrid />}

      {!ai.loading && ai.variants && ai.variants.length > 0 && (
        <div className="grid grid-cols-2 gap-2 pt-1">
          {ai.variants.map((v, i) => (
            <VariantCard
              key={i}
              index={i}
              variant={v}
              onClick={() => handlePick(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function VariantCard({
  index,
  variant,
  onClick,
}: {
  index: number;
  variant: ThumbnailVariant;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-lg border-2 border-slate-200 bg-white p-3 text-left transition-all',
        'hover:border-slate-900 hover:shadow-sm',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900',
      )}
    >
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
        {index + 1}. {STYLE_LABELS[variant.style]}
      </div>
      <div className="text-sm font-bold text-slate-900 leading-tight line-clamp-2">
        {variant.hook || '—'}
      </div>
      {variant.subline && (
        <div className="text-xs text-slate-600 mt-1 line-clamp-1">
          {variant.subline}
        </div>
      )}
      {variant.context && (
        <div className="text-[10px] text-slate-500 mt-1 line-clamp-1">
          {variant.context}
        </div>
      )}
    </button>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 gap-2 pt-1">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-24 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 animate-pulse"
        />
      ))}
    </div>
  );
}
