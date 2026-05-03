import type { Author, TemplateContent, Theme, HeroImage } from '@/types/studio';
import { wrapText } from '@/lib/utils/text-wrap';
import { PostBackground } from '@/components/shared/PostBackground';
import { PostFooter } from '@/components/shared/PostFooter';
import { HeroImageLayer } from '@/components/shared/HeroImage';

type TipsContent = Extract<TemplateContent, { kind: 'tips' }>;

interface TipsTemplateProps {
  theme: Theme;
  content: TipsContent;
  author: Author;
  hero?: HeroImage;
}

const FONT_SANS = 'system-ui, -apple-system, sans-serif';
const MAX_TIPS = 5;

export function TipsTemplate({ theme, content, author, hero }: TipsTemplateProps) {
  const titleLines = wrapText(content.title || '', 28).slice(0, 2);
  const tipsList = content.tips.filter((t) => t.trim()).slice(0, MAX_TIPS);

  return (
    <svg viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg" width="100%">
      <PostBackground theme={theme} />
      <HeroImageLayer hero={hero} theme={theme} />

      <g transform="translate(80, 130)">
        <rect
          width="180"
          height="50"
          rx="25"
          fill={theme.accent}
          fillOpacity="0.2"
          stroke={theme.accent}
          strokeWidth="2"
        />
        <text
          x="90"
          y="33"
          fontSize="22"
          fontWeight="700"
          fill={theme.accent}
          textAnchor="middle"
          letterSpacing="3"
          fontFamily={FONT_SANS}
        >
          TIPS
        </text>
      </g>

      {titleLines.map((line, i) => (
        <text
          key={i}
          x="80"
          y={260 + i * 70}
          fontSize="54"
          fontWeight="800"
          fill={theme.text}
          fontFamily={FONT_SANS}
        >
          {line}
        </text>
      ))}

      {tipsList.map((tip, i) => {
        const tipLines = wrapText(tip, 38).slice(0, 2);
        const yBase = 460 + i * 110;
        return (
          <g key={i}>
            <circle cx="115" cy={yBase} r="28" fill={theme.accent} />
            <text
              x="115"
              y={yBase + 10}
              fontSize="26"
              fontWeight="800"
              fill={theme.isDark ? '#000000' : '#ffffff'}
              textAnchor="middle"
              fontFamily={FONT_SANS}
            >
              {i + 1}
            </text>
            {tipLines.map((line, j) => (
              <text
                key={j}
                x="170"
                y={yBase + 10 + j * 36}
                fontSize="30"
                fontWeight="500"
                fill={theme.text}
                fontFamily={FONT_SANS}
              >
                {line}
              </text>
            ))}
          </g>
        );
      })}

      <PostFooter theme={theme} author={author} />
    </svg>
  );
}
