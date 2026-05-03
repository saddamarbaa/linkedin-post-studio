'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Check, Download, Loader2 } from 'lucide-react';
import type { RefObject } from 'react';

import { Button } from '@/components/ui/button';
import { SvgExporter } from '@/lib/utils/svg-export';
import { useStudioStore } from '@/lib/store/useStudioStore';

interface DownloadButtonProps {
  /** Container that has the live <svg> as a descendant. */
  containerRef: RefObject<HTMLDivElement | null>;
  /** When > 0 the active template is a carousel and a "Download all" affordance is shown. */
  carouselSlides?: number;
  /** Lets us drive the parent's slideIndex while exporting each slide. */
  onSlideChange?: (index: number) => void;
  /** "header" renders a compact dark pill that fits in the header bar. */
  variant?: 'header' | 'panel';
}

type Status = 'idle' | 'busy' | 'done';

// Two animation frames is enough for React to commit + the browser to lay out
// the new SVG before we capture it.
function nextPaint(): Promise<void> {
  return new Promise((r) =>
    requestAnimationFrame(() => requestAnimationFrame(() => r())),
  );
}

export function DownloadButton({
  containerRef,
  carouselSlides = 0,
  onSlideChange,
  variant = 'panel',
}: DownloadButtonProps) {
  const templateId = useStudioStore((s) => s.templateId);
  const [status, setStatus] = useState<Status>('idle');

  const isCarousel = carouselSlides > 1;
  const isHeader = variant === 'header';

  async function captureCurrent(filename: string) {
    const svg = containerRef.current?.querySelector('svg');
    if (!svg) throw new Error('Could not find the preview SVG.');
    const exporter = new SvgExporter(svg as SVGSVGElement);
    await exporter.download(filename);
  }

  async function handleSingle() {
    setStatus('busy');
    try {
      await captureCurrent(`linkedin-${templateId}-${Date.now()}.png`);
      setStatus('done');
      toast.success('Downloaded.');
      setTimeout(() => setStatus('idle'), 1500);
    } catch (err) {
      setStatus('idle');
      toast.error(messageOf(err));
    }
  }

  async function handleAllSlides() {
    if (!onSlideChange) return handleSingle();
    setStatus('busy');
    const ts = Date.now();
    try {
      for (let i = 0; i < carouselSlides; i++) {
        onSlideChange(i);
        // Wait for the new slide to paint before reading the SVG.
        await nextPaint();
        await captureCurrent(`linkedin-carousel-${ts}-slide-${i + 1}.png`);
        // Brief gap so browsers don't suppress rapid same-tab downloads.
        await new Promise((r) => setTimeout(r, 250));
      }
      setStatus('done');
      toast.success(`Downloaded ${carouselSlides} slides.`);
      setTimeout(() => setStatus('idle'), 1500);
    } catch (err) {
      setStatus('idle');
      toast.error(messageOf(err));
    }
  }

  if (isCarousel) {
    if (isHeader) {
      return (
        <Button
          type="button"
          onClick={handleAllSlides}
          disabled={status === 'busy'}
          size="sm"
          className="bg-slate-900 hover:bg-slate-800 text-white shadow-md"
        >
          {iconFor(status)}
          {labelFor(status, `Download ${carouselSlides} PNGs`)}
        </Button>
      );
    }
    return (
      <div className="space-y-2">
        <Button
          type="button"
          onClick={handleAllSlides}
          disabled={status === 'busy'}
          size="lg"
          className="w-full"
        >
          {iconFor(status)}
          {labelFor(status, `Download all ${carouselSlides} slides`)}
        </Button>
        <Button
          type="button"
          onClick={handleSingle}
          disabled={status === 'busy'}
          variant="outline"
          size="sm"
          className="w-full"
        >
          Download just this slide
        </Button>
      </div>
    );
  }

  if (isHeader) {
    return (
      <Button
        type="button"
        onClick={handleSingle}
        disabled={status === 'busy'}
        size="sm"
        className="bg-slate-900 hover:bg-slate-800 text-white shadow-md"
      >
        {iconFor(status)}
        {labelFor(status, 'Download PNG')}
      </Button>
    );
  }

  return (
    <Button
      type="button"
      onClick={handleSingle}
      disabled={status === 'busy'}
      size="lg"
      className="w-full"
    >
      {iconFor(status)}
      {labelFor(status, 'Download PNG')}
    </Button>
  );
}

function iconFor(status: Status) {
  if (status === 'busy') return <Loader2 className="animate-spin" />;
  if (status === 'done') return <Check />;
  return <Download />;
}

function labelFor(status: Status, idleLabel: string): string {
  if (status === 'busy') return 'Exporting…';
  if (status === 'done') return 'Downloaded';
  return idleLabel;
}

function messageOf(err: unknown): string {
  if (err instanceof Error) return `Download failed: ${err.message}`;
  return 'Download failed. Try right-click → Save image as…';
}
