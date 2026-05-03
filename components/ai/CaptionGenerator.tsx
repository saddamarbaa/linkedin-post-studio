'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Check, Copy, Loader2, Wand2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useStudioStore } from '@/lib/store/useStudioStore';
import { cn } from '@/lib/utils';
import type { CaptionTone } from '@/types/studio';

const TONES: { id: CaptionTone; label: string }[] = [
  { id: 'professional', label: 'Professional' },
  { id: 'casual', label: 'Casual' },
  { id: 'bold', label: 'Bold' },
  { id: 'storytelling', label: 'Storytelling' },
];

export function CaptionGenerator() {
  const ai = useStudioStore((s) => s.ai.caption);
  const generate = useStudioStore((s) => s.generateCaption);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (ai.error) toast.error(ai.error);
  }, [ai.error]);

  const handleCopy = async () => {
    if (!ai.text) return;
    try {
      await navigator.clipboard.writeText(ai.text);
      setCopied(true);
      toast.success('Caption copied to clipboard.');
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error('Could not copy. Select the text and copy manually.');
    }
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 via-white to-pink-50 border-purple-200">
      <div className="p-5 space-y-3">
        <div>
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Wand2 className="size-4 text-purple-600" />
            AI Caption Generator
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Pick a tone — Claude writes a high-engagement LinkedIn caption that
            matches the current preview.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {TONES.map((t) => {
            const active = ai.tone === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => generate(t.id)}
                disabled={ai.loading}
                aria-pressed={active}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-semibold transition-all',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  active
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-400',
                )}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {ai.loading && (
          <div className="flex items-center gap-2 rounded-lg border border-purple-200 bg-white/70 p-3 text-sm text-slate-600">
            <Loader2 className="size-4 animate-spin text-purple-600" />
            Writing caption…
          </div>
        )}

        {ai.text && !ai.loading && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-500 tracking-wider">
                YOUR CAPTION
              </span>
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={handleCopy}
              >
                {copied ? <Check /> : <Copy />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
            <div className="p-4 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
              {ai.text}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
