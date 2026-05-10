'use client';

import type { RefObject } from 'react';
import { Sparkles } from 'lucide-react';

import { AiStatusPill } from '@/components/studio/AiStatusPill';
import { CopyButton } from '@/components/studio/CopyButton';
import { DownloadButton } from '@/components/studio/DownloadButton';

interface StudioHeaderProps {
  containerRef: RefObject<HTMLDivElement | null>;
  carouselSlides: number;
  onSlideChange: (index: number) => void;
}

export function StudioHeader({
  containerRef,
  carouselSlides,
  onSlideChange,
}: StudioHeaderProps) {
  return (
    <header
      className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/70 backdrop-blur-md supports-[backdrop-filter]:bg-white/60"
      aria-label="Post Studio toolbar"
    >
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-3 px-4 md:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-sm shadow-purple-500/30"
            aria-hidden
          >
            <Sparkles className="size-4 text-white" />
          </span>
          <span className="truncate text-[15px] font-bold tracking-tight text-slate-900">
            Post Studio
          </span>
          <AiStatusPill className="ml-1" />
        </div>

        <div className="flex items-center gap-2">
          <CopyButton containerRef={containerRef} />
          <DownloadButton
            containerRef={containerRef}
            carouselSlides={carouselSlides}
            onSlideChange={onSlideChange}
            variant="header"
          />
        </div>
      </div>
    </header>
  );
}
