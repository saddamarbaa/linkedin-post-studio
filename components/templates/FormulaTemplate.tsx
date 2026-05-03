import type { Author, TemplateContent, Theme, HeroImage } from '@/types/studio';
import { wrapText } from '@/lib/utils/text-wrap';
import { PostBackground } from '@/components/shared/PostBackground';
import { PostFooter } from '@/components/shared/PostFooter';
import { HeroImageLayer } from '@/components/shared/HeroImage';

type FormulaContent = Extract<TemplateContent, { kind: 'formula' }>;

interface FormulaTemplateProps {
  theme: Theme;
  content: FormulaContent;
  author: Author;
  hero?: HeroImage;
}

const FONT_SANS = 'system-ui, -apple-system, sans-serif';
const FONT_MATH = "'Cambria Math', Georgia, serif";

export function FormulaTemplate({ theme, content, author, hero }: FormulaTemplateProps) {
  const titleLines = wrapText(content.title || '', 22).slice(0, 2);
  const descLines = wrapText(content.description || '', 40).slice(0, 4);

  return (
    <svg viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg" width="100%">
      <PostBackground theme={theme} />
      <HeroImageLayer hero={hero} theme={theme} />

      <g opacity="0.1" fontFamily={FONT_MATH}>
        <text x="100" y="220" fontSize="200" fill={theme.accent}>Σ</text>
        <text x="950" y="370" fontSize="160" fill={theme.accent2}>∂</text>
        <text x="50" y="900" fontSize="180" fill={theme.accent2}>∫</text>
        <text x="1000" y="1000" fontSize="140" fill={theme.accent}>θ</text>
      </g>

      <g transform="translate(80, 130)">
        <rect width="200" height="50" rx="25" fill={theme.accent} />
        <text
          x="100"
          y="33"
          fontSize="22"
          fontWeight="800"
          fill={theme.isDark ? '#000000' : '#ffffff'}
          textAnchor="middle"
          letterSpacing="2"
          fontFamily={FONT_SANS}
        >
          FORMULA
        </text>
      </g>

      {titleLines.map((line, i) => (
        <text
          key={i}
          x="80"
          y={270 + i * 80}
          fontSize="68"
          fontWeight="900"
          fill={theme.text}
          fontFamily={FONT_SANS}
          letterSpacing="-1"
        >
          {line}
        </text>
      ))}

      <g transform="translate(600, 620)">
        <rect
          x="-500"
          y="-110"
          width="1000"
          height="220"
          rx="24"
          fill={theme.cardBg}
          stroke={theme.accent}
          strokeOpacity="0.4"
          strokeWidth="3"
        />
        <line x1="-480" y1="-90" x2="-440" y2="-90" stroke={theme.accent} strokeWidth="3" />
        <line x1="-480" y1="-90" x2="-480" y2="-50" stroke={theme.accent} strokeWidth="3" />
        <line x1="480" y1="90" x2="440" y2="90" stroke={theme.accent} strokeWidth="3" />
        <line x1="480" y1="90" x2="480" y2="50" stroke={theme.accent} strokeWidth="3" />
        <text
          x="0"
          y="20"
          fontSize="56"
          fontWeight="500"
          fill={theme.text}
          textAnchor="middle"
          fontFamily={FONT_MATH}
          fontStyle="italic"
        >
          {content.equation || 'f(x) = …'}
        </text>
      </g>

      {descLines.length > 0 && (
        <g transform="translate(80, 800)">
          <rect width="6" height="180" fill={theme.accent} />
          {descLines.map((line, i) => (
            <text
              key={i}
              x="40"
              y={40 + i * 40}
              fontSize="26"
              fontWeight="500"
              fill={theme.text}
              fontFamily={FONT_SANS}
            >
              {line}
            </text>
          ))}
        </g>
      )}

      <PostFooter theme={theme} author={author} />
    </svg>
  );
}
