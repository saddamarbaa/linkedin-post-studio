import type { Author, TemplateContent, Theme, HeroImage } from '@/types/studio';
import { wrapText } from '@/lib/utils/text-wrap';
import { PostBackground } from '@/components/shared/PostBackground';
import { PostFooter } from '@/components/shared/PostFooter';
import { HeroImageLayer } from '@/components/shared/HeroImage';

type AnnounceContent = Extract<TemplateContent, { kind: 'announce' }>;

interface AnnounceTemplateProps {
  theme: Theme;
  content: AnnounceContent;
  author: Author;
  hero?: HeroImage;
}

const FONT_SANS = 'system-ui, -apple-system, sans-serif';

export function AnnounceTemplate({ theme, content, author, hero }: AnnounceTemplateProps) {
  const headlineLines = wrapText(content.headline || '', 18).slice(0, 4);
  const ctaLines = wrapText(content.cta || '', 42).slice(0, 4);
  const eyebrowWidth = Math.max(160, (content.eyebrow || '').length * 14 + 60);

  const headlineBaseY = 320;
  const headlineH = 110;
  const underlineY = headlineBaseY + headlineLines.length * headlineH - 30;
  const ctaBaseY = underlineY + 60;

  return (
    <svg viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg" width="100%">
      <PostBackground theme={theme} />
      <HeroImageLayer hero={hero} theme={theme} />

      {content.eyebrow && (
        <g transform="translate(80, 140)">
          <rect width={eyebrowWidth} height="56" rx="28" fill={theme.accent} />
          <text
            x={eyebrowWidth / 2}
            y="38"
            fontSize="22"
            fontWeight="800"
            fill={theme.isDark ? '#000000' : '#ffffff'}
            textAnchor="middle"
            letterSpacing="3"
            fontFamily={FONT_SANS}
          >
            {content.eyebrow.toUpperCase()}
          </text>
        </g>
      )}

      {headlineLines.map((line, i) => (
        <text
          key={i}
          x="80"
          y={headlineBaseY + i * headlineH}
          fontSize="92"
          fontWeight="900"
          fill={theme.text}
          fontFamily={FONT_SANS}
          letterSpacing="-2"
        >
          {line}
        </text>
      ))}

      <rect x="80" y={underlineY} width="120" height="8" fill={theme.accent} />

      {ctaLines.map((line, i) => (
        <text
          key={i}
          x="80"
          y={ctaBaseY + i * 50}
          fontSize="32"
          fill={theme.muted}
          fontFamily={FONT_SANS}
        >
          {line}
        </text>
      ))}

      <PostFooter theme={theme} author={author} />
    </svg>
  );
}
