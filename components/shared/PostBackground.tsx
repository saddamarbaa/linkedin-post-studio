import type { Theme } from '@/types/studio';

interface PostBackgroundProps {
  theme: Theme;
  // Suffix appended to gradient/pattern IDs so multiple previews can coexist
  // in the same DOM without collision. Defaults to theme.id.
  seed?: string;
}

// SPEC §5: linear bgGradient + 60x60 grid overlay + two radial accent glows.
export function PostBackground({ theme, seed }: PostBackgroundProps) {
  const id = seed ?? theme.id;
  const bgId = `bg-${id}`;
  const gridId = `grid-${id}`;
  const tlId = `glow-tl-${id}`;
  const brId = `glow-br-${id}`;
  const gridOpacity = theme.isDark ? 0.04 : 0.06;
  const gridStroke = theme.isDark ? '#ffffff' : '#000000';

  const stops = theme.bgGradient.map((color, i, arr) => {
    const offset = arr.length === 1 ? 0 : (i / (arr.length - 1)) * 100;
    return <stop key={i} offset={`${offset}%`} stopColor={color} />;
  });

  return (
    <g>
      <defs>
        <linearGradient id={bgId} x1="0" y1="0" x2="1200" y2="1200" gradientUnits="userSpaceOnUse">
          {stops}
        </linearGradient>

        <pattern id={gridId} width="60" height="60" patternUnits="userSpaceOnUse">
          <path
            d="M 60 0 L 0 0 0 60"
            fill="none"
            stroke={gridStroke}
            strokeOpacity={gridOpacity}
            strokeWidth="1"
          />
        </pattern>

        <radialGradient
          id={tlId}
          cx="0"
          cy="0"
          r="600"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={theme.accent} stopOpacity="0.35" />
          <stop offset="100%" stopColor={theme.accent} stopOpacity="0" />
        </radialGradient>

        <radialGradient
          id={brId}
          cx="1200"
          cy="1200"
          r="600"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={theme.accent2} stopOpacity="0.35" />
          <stop offset="100%" stopColor={theme.accent2} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1200" height="1200" fill={`url(#${bgId})`} />
      <rect width="1200" height="1200" fill={`url(#${gridId})`} />
      <rect width="1200" height="1200" fill={`url(#${tlId})`} />
      <rect width="1200" height="1200" fill={`url(#${brId})`} />
    </g>
  );
}
