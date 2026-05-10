'use client';

import { ArrowRight, Download, Pencil, Sparkles, Wand2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useAiEnabled } from '@/lib/ai-config-context';
import { useStudioStore } from '@/lib/store/useStudioStore';

const STEPS = [
  { n: 1, label: 'Pick a template', Icon: Sparkles },
  { n: 2, label: 'Edit & theme', Icon: Pencil },
  { n: 3, label: 'Download PNG', Icon: Download },
] as const;

function scrollToTemplates() {
  const el = document.getElementById('templates');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function StudioHero() {
  const aiEnabled = useAiEnabled();
  const setTemplate = useStudioStore((s) => s.setTemplate);

  const onTryQuickAi = () => {
    setTemplate('thumbnail');
    scrollToTemplates();
  };

  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden border-b border-slate-200/70"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.10),transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(236,72,153,0.08),transparent_55%)]"
      />
      <div className="relative mx-auto max-w-3xl px-4 md:px-6 py-10 md:py-14">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-slate-600 backdrop-blur">
          <Sparkles className="size-3 text-purple-600" aria-hidden />
          For AI, ML &amp; coding creators
        </span>

        <h1
          id="hero-title"
          className="mt-4 text-3xl md:text-5xl font-bold tracking-tight text-slate-900"
        >
          Beautiful LinkedIn graphics in 60&nbsp;seconds.
        </h1>

        <p className="mt-3 max-w-xl text-[15px] md:text-base text-slate-600 leading-relaxed">
          Pick a template, edit the text, export a 1200×1200 PNG. Fourteen
          layouts, six themes, and optional AI for thumbnails and captions —
          no Canva, no watermarks.
        </p>

        <ol className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
          {STEPS.map(({ n, label, Icon }) => (
            <li
              key={n}
              className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white/70 px-3 py-2.5 backdrop-blur"
            >
              <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[11px] font-bold text-white">
                {n}
              </span>
              <Icon className="size-4 text-slate-500" aria-hidden />
              <span className="text-sm font-medium text-slate-800">
                {label}
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button
            type="button"
            size="lg"
            onClick={scrollToTemplates}
            className="bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/20 hover:opacity-95"
          >
            Choose a template
            <ArrowRight className="size-4" aria-hidden />
          </Button>

          {aiEnabled && (
            <Button
              type="button"
              size="lg"
              variant="outline"
              onClick={onTryQuickAi}
              className="border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
            >
              <Wand2 className="size-4" aria-hidden />
              Try Quick AI
            </Button>
          )}

          <span className="text-xs text-slate-500">
            Free · runs in your browser · no sign-up
          </span>
        </div>
      </div>
    </section>
  );
}
