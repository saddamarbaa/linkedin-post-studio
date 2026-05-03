import type { Author, TemplateContent, Theme, HeroImage } from '@/types/studio';
import { wrapText } from '@/lib/utils/text-wrap';
import { PostBackground } from '@/components/shared/PostBackground';
import { PostFooter } from '@/components/shared/PostFooter';
import { HeroImageLayer } from '@/components/shared/HeroImage';

type ConceptContent = Extract<TemplateContent, { kind: 'concept' }>;

interface ConceptTemplateProps {
  theme: Theme;
  content: ConceptContent;
  author: Author;
  hero?: HeroImage;
}

const FONT_SANS = 'system-ui, -apple-system, sans-serif';

export function ConceptTemplate({ theme, content, author, hero }: ConceptTemplateProps) {
  const nameLines = wrapText(content.name || '', 16).slice(0, 2);
  const defLines = wrapText(content.definition || '', 36).slice(0, 3);
  const categoryWidth = Math.max(140, (content.category || '').length * 14 + 60);

  const nameBaseY = 280;
  const nameLineHeight = 110;
  const underlineY = nameBaseY + nameLines.length * nameLineHeight - 60;
  const defCardY = underlineY + 60;

  return (
    <svg viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg" width="100%">
      <PostBackground theme={theme} />
      <HeroImageLayer hero={hero} theme={theme} />

      <g opacity="0.18">
        <circle cx="1050" cy="180" r="20" fill={theme.accent} />
        <circle cx="1100" cy="240" r="14" fill={theme.accent2} />
        <circle cx="1020" cy="280" r="10" fill={theme.accent} />
        <line x1="1050" y1="180" x2="1100" y2="240" stroke={theme.accent} strokeWidth="2" />
        <line x1="1050" y1="180" x2="1020" y2="280" stroke={theme.accent} strokeWidth="2" />
        <line x1="1100" y1="240" x2="1020" y2="280" stroke={theme.accent} strokeWidth="2" />
      </g>

      {content.category && (
        <g transform="translate(80, 130)">
          <rect
            width={categoryWidth}
            height="44"
            rx="22"
            fill={theme.accent}
            fillOpacity="0.15"
            stroke={theme.accent}
            strokeWidth="2"
          />
          <circle cx="28" cy="22" r="6" fill={theme.accent} />
          <text
            x="50"
            y="29"
            fontSize="20"
            fontWeight="800"
            fill={theme.accent}
            letterSpacing="2"
            fontFamily={FONT_SANS}
          >
            {content.category.toUpperCase()}
          </text>
        </g>
      )}

      {nameLines.map((line, i) => (
        <text
          key={i}
          x="80"
          y={nameBaseY + i * nameLineHeight}
          fontSize="110"
          fontWeight="900"
          fill={theme.text}
          fontFamily={FONT_SANS}
          letterSpacing="-3"
        >
          {line}
        </text>
      ))}

      <g transform={`translate(80, ${underlineY})`}>
        <rect width="100" height="8" fill={theme.accent} />
        <rect x="120" width="40" height="8" fill={theme.accent2} />
      </g>

      <g transform={`translate(80, ${defCardY})`}>
        <rect
          width="1040"
          height="180"
          rx="20"
          fill={theme.cardBg}
          stroke={theme.text}
          strokeOpacity="0.1"
          strokeWidth="2"
        />
        <text
          x="40"
          y="50"
          fontSize="18"
          fontWeight="700"
          fill={theme.accent}
          letterSpacing="3"
          fontFamily={FONT_SANS}
        >
          DEFINITION
        </text>
        {defLines.map((line, i) => (
          <text
            key={i}
            x="40"
            y={90 + i * 36}
            fontSize="26"
            fontWeight="500"
            fill={theme.text}
            fontFamily={FONT_SANS}
          >
            {line}
          </text>
        ))}
      </g>

      <g transform="translate(80, 850)">
        <text
          x="0"
          y="0"
          fontSize="20"
          fontWeight="700"
          fill={theme.accent}
          letterSpacing="3"
          fontFamily={FONT_SANS}
        >
          KEY POINTS
        </text>
        {content.points.map((pt, i) => (
          <g key={i} transform={`translate(${i * 350}, 30)`}>
            <rect
              width="320"
              height="120"
              rx="16"
              fill={theme.cardBg}
              stroke={theme.accent}
              strokeOpacity="0.3"
              strokeWidth="2"
            />
            <circle cx="40" cy="60" r="22" fill={theme.accent} />
            <text
              x="40"
              y="68"
              fontSize="22"
              fontWeight="800"
              fill={theme.isDark ? '#000000' : '#ffffff'}
              textAnchor="middle"
              fontFamily={FONT_SANS}
            >
              {i + 1}
            </text>
            {wrapText(pt, 22).slice(0, 2).map((line, j) => (
              <text
                key={j}
                x="80"
                y={56 + j * 28}
                fontSize="20"
                fontWeight="600"
                fill={theme.text}
                fontFamily={FONT_SANS}
              >
                {line}
              </text>
            ))}
          </g>
        ))}
      </g>

      <PostFooter theme={theme} author={author} />
    </svg>
  );
}
