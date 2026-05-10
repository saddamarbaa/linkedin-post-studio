'use client';

import { useState } from 'react';
import type { RefObject } from 'react';
import { toast } from 'sonner';
import { Check, Copy, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { SvgExporter } from '@/lib/utils/svg-export';

type Status = 'idle' | 'busy' | 'done';

function dataUrlToBlob(dataUrl: string): Blob {
  const [meta, b64] = dataUrl.split(',');
  const mime = /data:([^;]+)/.exec(meta ?? '')?.[1] ?? 'image/png';
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

interface CopyButtonProps {
  containerRef: RefObject<HTMLDivElement | null>;
}

export function CopyButton({ containerRef }: CopyButtonProps) {
  const [status, setStatus] = useState<Status>('idle');

  async function handleCopy() {
    const svg = containerRef.current?.querySelector('svg');
    if (!svg) {
      toast.error('No preview to copy yet.');
      return;
    }
    if (typeof window === 'undefined' || !navigator.clipboard?.write) {
      toast.error('Clipboard not supported in this browser.', {
        description: 'Use Download PNG instead.',
      });
      return;
    }

    setStatus('busy');
    try {
      const exporter = new SvgExporter(svg as SVGSVGElement);
      // Safari requires a Promise<Blob> in ClipboardItem to satisfy the
      // user-activation check, so we kick off the export *inside* the Promise.
      const blobPromise = exporter
        .toPng()
        .then((dataUrl) => dataUrlToBlob(dataUrl));

      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blobPromise }),
      ]);

      setStatus('done');
      toast.success('Copied PNG to clipboard', {
        description: 'Paste it into LinkedIn’s composer with ⌘/Ctrl + V.',
      });
      setTimeout(() => setStatus('idle'), 1500);
    } catch (err) {
      setStatus('idle');
      const msg = err instanceof Error ? err.message : 'Could not copy.';
      toast.error(`Copy failed: ${msg}`);
    }
  }

  return (
    <Button
      type="button"
      onClick={handleCopy}
      disabled={status === 'busy'}
      size="sm"
      variant="outline"
      className="h-9 border-slate-200 bg-white/60 text-slate-700 hover:bg-white hover:text-slate-900"
    >
      {status === 'busy' ? (
        <Loader2 className="animate-spin" />
      ) : status === 'done' ? (
        <Check className="text-emerald-600" />
      ) : (
        <Copy />
      )}
      <span className="hidden sm:inline">
        {status === 'busy' ? 'Copying…' : status === 'done' ? 'Copied' : 'Copy'}
      </span>
    </Button>
  );
}
