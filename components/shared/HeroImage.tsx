import type { HeroImage, Theme } from '@/types/studio';

interface HeroImageLayerProps {
  hero?: HeroImage;
  theme: Theme;
  // Suffix appended to clipPath ids so multiple posts can render side-by-side.
  seed?: string;
}

// SPEC §8.3 — four hero layouts. Renders behind body content (caller decides
// where to place this in the SVG). For `background` that's the natural read.
// For `hero` / `split` / `inline` the user picks a layout that doesn't fight
// the active template's content area.
export function HeroImageLayer({ hero, theme, seed }: HeroImageLayerProps) {
  if (!hero) return null;
  const id = seed ?? theme.id;
  const clipId = `hero-clip-${id}`;

  switch (hero.layout) {
    case 'hero':
      return (
        <g>
          <defs>
            <clipPath id={clipId}>
              <rect x="80" y="120" width="1040" height="260" rx="24" />
            </clipPath>
          </defs>
          <image
            href={hero.dataUrl}
            x="80"
            y="120"
            width="1040"
            height="260"
            preserveAspectRatio="xMidYMid slice"
            opacity={hero.opacity}
            clipPath={`url(#${clipId})`}
          />
        </g>
      );

    case 'split':
      return (
        <g>
          <defs>
            <clipPath id={clipId}>
              <rect x="600" y="120" width="520" height="800" rx="24" />
            </clipPath>
          </defs>
          <image
            href={hero.dataUrl}
            x="600"
            y="120"
            width="520"
            height="800"
            preserveAspectRatio="xMidYMid slice"
            opacity={hero.opacity}
            clipPath={`url(#${clipId})`}
          />
        </g>
      );

    case 'background':
      // `meet` = object-contain: show the whole image, letterboxed inside the
      // 1040×920 frame, so big uploads aren't cropped. Hero / split / inline
      // still use `slice` because those zones are fixed-aspect crops.
      return (
        <g>
          <defs>
            <clipPath id={clipId}>
              <rect x="80" y="80" width="1040" height="920" rx="24" />
            </clipPath>
          </defs>
          <image
            href={hero.dataUrl}
            x="80"
            y="80"
            width="1040"
            height="920"
            preserveAspectRatio="xMidYMid meet"
            opacity={hero.opacity}
            clipPath={`url(#${clipId})`}
          />
        </g>
      );

    case 'inline':
      return (
        <g>
          <defs>
            <clipPath id={clipId}>
              <circle cx="600" cy="540" r="160" />
            </clipPath>
          </defs>
          <image
            href={hero.dataUrl}
            x="440"
            y="380"
            width="320"
            height="320"
            preserveAspectRatio="xMidYMid slice"
            opacity={hero.opacity}
            clipPath={`url(#${clipId})`}
          />
        </g>
      );
  }
}
