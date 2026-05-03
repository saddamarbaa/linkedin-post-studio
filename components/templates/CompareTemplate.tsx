import type { Author, TemplateContent, Theme, HeroImage } from '@/types/studio';
import { PostBackground } from '@/components/shared/PostBackground';
import { PostFooter } from '@/components/shared/PostFooter';
import { HeroImageLayer } from '@/components/shared/HeroImage';

type CompareContent = Extract<TemplateContent, { kind: 'compare' }>;

interface CompareTemplateProps {
  theme: Theme;
  content: CompareContent;
  author: Author;
  hero?: HeroImage;
}

const FONT_SANS = 'system-ui, -apple-system, sans-serif';
const NEG = '#ef4444';
const MAX_BULLETS = 5;

export function CompareTemplate({ theme, content, author, hero }: CompareTemplateProps) {
  const leftBullets = content.leftBullets.slice(0, MAX_BULLETS);
  const rightBullets = content.rightBullets.slice(0, MAX_BULLETS);

  return (
    <svg viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg" width="100%">
      <PostBackground theme={theme} />
      <HeroImageLayer hero={hero} theme={theme} />

      <g transform="translate(600, 600)">
        <line
          x1="0"
          y1="-280"
          x2="0"
          y2="280"
          stroke={theme.text}
          strokeOpacity="0.2"
          strokeWidth="2"
          strokeDasharray="6 8"
        />
        <circle r="60" fill={theme.bgGradient[0]} stroke={theme.accent} strokeWidth="4" />
        <text
          y="18"
          fontSize="44"
          fontWeight="900"
          fill={theme.accent}
          textAnchor="middle"
          fontFamily={FONT_SANS}
        >
          VS
        </text>
      </g>

      <Column
        x={80}
        accent={NEG}
        title={content.leftTitle || 'Option A'}
        bullets={leftBullets}
        theme={theme}
        markGlyph="✗"
      />
      <Column
        x={660}
        accent={theme.accent}
        title={content.rightTitle || 'Option B'}
        bullets={rightBullets}
        theme={theme}
        markGlyph="✓"
      />

      <PostFooter theme={theme} author={author} />
    </svg>
  );
}

function Column({
  x,
  accent,
  title,
  bullets,
  theme,
  markGlyph,
}: {
  x: number;
  accent: string;
  title: string;
  bullets: string[];
  theme: Theme;
  markGlyph: string;
}) {
  return (
    <g transform={`translate(${x}, 200)`}>
      <rect
        width="460"
        height="80"
        rx="40"
        fill={accent}
        fillOpacity="0.18"
        stroke={accent}
        strokeWidth="3"
      />
      <text
        x="44"
        y="52"
        fontSize="30"
        fontWeight="900"
        fill={accent}
        fontFamily={FONT_SANS}
        textAnchor="middle"
      >
        {markGlyph}
      </text>
      <text
        x="86"
        y="52"
        fontSize="30"
        fontWeight="800"
        fill={theme.text}
        fontFamily={FONT_SANS}
      >
        {title}
      </text>

      {bullets.map((pt, i) => {
        const text = pt.length > 28 ? `${pt.slice(0, 28)}…` : pt;
        return (
          <g key={i} transform={`translate(0, ${130 + i * 90})`}>
            <rect width="460" height="70" rx="12" fill={theme.cardBg} />
            <line x1="0" y1="0" x2="0" y2="70" stroke={accent} strokeWidth="6" />
            <text
              x="30"
              y="45"
              fontSize="22"
              fontWeight="500"
              fill={theme.text}
              fontFamily={FONT_SANS}
            >
              {text}
            </text>
          </g>
        );
      })}
    </g>
  );
}
