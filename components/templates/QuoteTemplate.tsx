import type { Author, TemplateContent, Theme, HeroImage } from '@/types/studio';
import { wrapText } from '@/lib/utils/text-wrap';
import { PostBackground } from '@/components/shared/PostBackground';
import { PostFooter } from '@/components/shared/PostFooter';
import { HeroImageLayer } from '@/components/shared/HeroImage';

type QuoteContent = Extract<TemplateContent, { kind: 'quote' }>;

interface QuoteTemplateProps {
  theme: Theme;
  content: QuoteContent;
  author: Author;
  hero?: HeroImage;
}

const FONT_SERIF = 'Georgia, serif';
const FONT_SANS = 'system-ui, -apple-system, sans-serif';

export function QuoteTemplate({ theme, content, author, hero }: QuoteTemplateProps) {
  const lines = wrapText(content.text || '', 28).slice(0, 6);
  const baseY = 400;
  const lineH = 88;
  const accentY = baseY + lines.length * lineH + 20;
  const attribY = accentY + 60;

  return (
    <svg viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg" width="100%">
      <PostBackground theme={theme} />
      <HeroImageLayer hero={hero} theme={theme} />

      <text
        x="80"
        y="260"
        fontSize="280"
        fontFamily={FONT_SERIF}
        fill={theme.accent}
        fillOpacity="0.4"
        fontWeight="700"
      >
        “
      </text>

      {lines.map((line, i) => (
        <text
          key={i}
          x="80"
          y={baseY + i * lineH}
          fontSize="64"
          fontWeight="400"
          fontStyle="italic"
          fill={theme.text}
          fontFamily={FONT_SERIF}
        >
          {line}
        </text>
      ))}

      <rect x="80" y={accentY} width="80" height="6" fill={theme.accent} />

      {content.attribution && (
        <text
          x="80"
          y={attribY + 40}
          fontSize="26"
          fontWeight="600"
          fill={theme.muted}
          fontFamily={FONT_SANS}
          letterSpacing="2"
        >
          — {content.attribution.toUpperCase()}
        </text>
      )}

      <PostFooter theme={theme} author={author} />
    </svg>
  );
}
