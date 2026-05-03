'use client';

import { useRef } from 'react';
import { toast } from 'sonner';
import { Image as ImageIcon, Upload, X } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useStudioStore } from '@/lib/store/useStudioStore';
import { validateAndConvertToBase64 } from '@/lib/utils/file-upload';
import { cn } from '@/lib/utils';
import type { HeroLayout } from '@/types/studio';

// Old-code.ts:1948-1986 — dashed-border empty state, image preview with a
// floating "Change" pill, emoji layout chips, and a native range slider.
const LAYOUTS: { id: HeroLayout; label: string }[] = [
  { id: 'hero', label: '🖼️ Hero' },
  { id: 'split', label: '📐 Split' },
  { id: 'background', label: '🌫️ Background' },
  { id: 'inline', label: '⭕ Circle' },
];

export function ImageUploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const hero = useStudioStore((s) => s.hero);
  const setHero = useStudioStore((s) => s.setHero);

  const handleFile = async (file: File) => {
    const result = await validateAndConvertToBase64(file);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setHero({
      dataUrl: result.dataUrl,
      layout: hero?.layout ?? 'hero',
      opacity: hero?.opacity ?? 1,
    });
  };

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <ImageIcon className="size-3.5" />
            Image
          </h3>
          {hero && (
            <button
              type="button"
              onClick={() => setHero(undefined)}
              className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-semibold"
            >
              <X className="size-3" /> Remove
            </button>
          )}
        </div>

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

        {!hero ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={cn(
              'w-full flex flex-col items-center gap-2 p-6 rounded-xl',
              'bg-slate-50 hover:bg-slate-100 border-2 border-dashed border-slate-300 transition-all',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900',
            )}
          >
            <Upload className="size-6 text-slate-400" />
            <span className="text-sm font-semibold text-slate-700">
              Upload an image
            </span>
            <span className="text-xs text-slate-500">
              Photo, screenshot, diagram · Max 5 MB
            </span>
          </button>
        ) : (
          <>
            {/* Slate backdrop + object-contain so users see the WHOLE upload,
                not a 128px-tall middle slice. Wide and tall images both fit
                naturally; letterboxing reads as intentional. */}
            <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={hero.dataUrl}
                alt="Hero preview"
                className="w-full max-h-64 object-contain mx-auto"
              />
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="absolute bottom-2 right-2 px-2.5 py-1 bg-white/95 rounded-md text-xs font-semibold shadow-md hover:bg-white"
              >
                Change
              </button>
            </div>

            <div>
              <Label className="block text-xs font-semibold text-slate-600 mb-2">
                Layout
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {LAYOUTS.map((opt) => {
                  const active = opt.id === hero.layout;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setHero({ ...hero, layout: opt.id })}
                      aria-pressed={active}
                      className={cn(
                        'px-3 py-2 rounded-lg text-xs font-semibold transition-all',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900',
                        active
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-50 hover:bg-slate-100 border border-slate-200',
                      )}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label className="text-xs font-semibold text-slate-600">
                  Opacity
                </Label>
                <span className="text-xs text-slate-500 tabular-nums">
                  {Math.round(hero.opacity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0.2}
                max={1}
                step={0.05}
                value={hero.opacity}
                onChange={(e) =>
                  setHero({ ...hero, opacity: parseFloat(e.target.value) })
                }
                className="w-full accent-slate-900"
                aria-label="Image opacity"
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
