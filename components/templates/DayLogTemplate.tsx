import type { Author, TemplateContent, Theme, HeroImage } from '@/types/studio';
import { wrapText } from '@/lib/utils/text-wrap';
import { PostBackground } from '@/components/shared/PostBackground';
import { PostFooter } from '@/components/shared/PostFooter';
import { HeroImageLayer } from '@/components/shared/HeroImage';

type DayLogContent = Extract<TemplateContent, { kind: 'dayLog' }>;

interface DayLogTemplateProps {
  theme: Theme;
  content: DayLogContent;
  author: Author;
  hero?: HeroImage;
}

const FONT_SANS = 'system-ui, -apple-system, sans-serif';

export function DayLogTemplate({ theme, content, author, hero }: DayLogTemplateProps) {
  const focusLines = wrapText(content.focus || '', 24).slice(0, 2);
  const insightLines = wrapText(content.insight || '', 38).slice(0, 4);

  const total = Math.max(content.total, 1);
  const ratio = Math.min(Math.max(content.day / total, 0), 1);
  const pct = Math.min(Math.max(content.progressPct, 0), 100);
  const barWidth = ratio * 1040;

  const focusBaseY = 540;
  const focusLineHeight = 70;
  const insightCardY = focusBaseY + focusLines.length * focusLineHeight + 40;
  const insightCardHeight = 80 + insightLines.length * 36;

  return (
    <svg viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg" width="100%">
      <PostBackground theme={theme} />
      <HeroImageLayer hero={hero} theme={theme} />

      <g transform="translate(80, 140)">
        <text
          x="0"
          y="40"
          fontSize="30"
          fontWeight="700"
          fill={theme.muted}
          letterSpacing="6"
          fontFamily={FONT_SANS}
        >
          DAY
        </text>
        <text
          x="0"
          y="220"
          fontSize="200"
          fontWeight="900"
          fill={theme.text}
          fontFamily={FONT_SANS}
          letterSpacing="-8"
        >
          {content.day}
        </text>
        <text
          x="0"
          y="280"
          fontSize="28"
          fontWeight="600"
          fill={theme.muted}
          fontFamily={FONT_SANS}
        >
          of {content.total}
        </text>
      </g>

      <g transform="translate(80, 440)">
        <rect width="1040" height="14" rx="7" fill={theme.cardBg} />
        <rect width={barWidth} height="14" rx="7" fill={theme.accent} />
        <text
          x="0"
          y="48"
          fontSize="18"
          fill={theme.muted}
          fontFamily={FONT_SANS}
        >
          {pct}% complete
        </text>
      </g>

      <g transform={`translate(80, ${focusBaseY - 40})`}>
        <text
          x="0"
          y="0"
          fontSize="22"
          fontWeight="700"
          fill={theme.accent}
          letterSpacing="4"
          fontFamily={FONT_SANS}
        >
          TODAY&apos;S FOCUS
        </text>
        {focusLines.map((line, i) => (
          <text
            key={i}
            x="0"
            y={50 + i * focusLineHeight}
            fontSize="56"
            fontWeight="900"
            fill={theme.text}
            fontFamily={FONT_SANS}
            letterSpacing="-1"
          >
            {line}
          </text>
        ))}
      </g>

      {content.insight && (
        <g transform={`translate(80, ${insightCardY})`}>
          <rect
            width="1040"
            height={insightCardHeight}
            rx="20"
            fill={theme.cardBg}
            stroke={theme.accent2}
            strokeOpacity="0.4"
            strokeWidth="2"
          />
          <text
            x="40"
            y="40"
            fontSize="18"
            fontWeight="700"
            fill={theme.accent2}
            letterSpacing="3"
            fontFamily={FONT_SANS}
          >
            KEY INSIGHT
          </text>
          {insightLines.map((line, i) => (
            <text
              key={i}
              x="40"
              y={80 + i * 36}
              fontSize="24"
              fontWeight="500"
              fill={theme.text}
              fontStyle="italic"
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
