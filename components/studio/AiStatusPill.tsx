'use client';

import { toast } from 'sonner';

import { useAiEnabled } from '@/lib/ai-config-context';
import { cn } from '@/lib/utils';

export function AiStatusPill({ className }: { className?: string }) {
  const enabled = useAiEnabled();

  function explain() {
    if (enabled) {
      toast.success('AI is on', {
        description: 'Quick AI and the caption generator are ready to use.',
      });
    } else {
      toast.warning('AI is off', {
        description:
          'Add ANTHROPIC_API_KEY to .env.local and restart the dev server to enable Quick AI.',
      });
    }
  }

  return (
    <button
      type="button"
      onClick={explain}
      aria-label={enabled ? 'AI on — click for details' : 'AI off — click for details'}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900',
        enabled
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
          : 'border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100',
        className,
      )}
    >
      <span
        className={cn(
          'size-1.5 rounded-full',
          enabled ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse',
        )}
      />
      {enabled ? 'AI on' : 'AI off'}
    </button>
  );
}
