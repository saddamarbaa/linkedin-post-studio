import type { Author, TemplateContent, Theme, HeroImage } from '@/types/studio';
import { wrapText } from '@/lib/utils/text-wrap';
import { PostBackground } from '@/components/shared/PostBackground';
import { PostFooter } from '@/components/shared/PostFooter';
import { HeroImageLayer } from '@/components/shared/HeroImage';

type ExplainerContent = Extract<TemplateContent, { kind: 'explainer' }>;

interface ExplainerTemplateProps {
  theme: Theme;
  content: ExplainerContent;
  author: Author;
  hero?: HeroImage;
}

const FONT_SANS = 'system-ui, -apple-system, sans-serif';
const FONT_MONO = "ui-monospace, 'SF Mono', Monaco, monospace";

const WINDOW = { x: 80, y: 200, w: 1040, h: 380, headerH: 44 };
const MAX_CODE_LINES = 8;
const MAX_POINTS = 5;

export function ExplainerTemplate({ theme, content, author, hero }: ExplainerTemplateProps) {
  const codeLines = (content.code || '').split('\n').slice(0, MAX_CODE_LINES);
  const points = content.points.filter((p) => p.trim()).slice(0, MAX_POINTS);

  return (
    <svg viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg" width="100%">
      <PostBackground theme={theme} />
      <HeroImageLayer hero={hero} theme={theme} />

      <g transform="translate(80, 130)">
        <rect
          width="240"
          height="50"
          rx="25"
          fill={theme.accent2}
          fillOpacity="0.2"
          stroke={theme.accent2}
          strokeWidth="2"
        />
        <text
          x="120"
          y="33"
          fontSize="22"
          fontWeight="700"
          fill={theme.accent2}
          textAnchor="middle"
          letterSpacing="3"
          fontFamily={FONT_SANS}
        >
          EXPLAINED
        </text>
      </g>

      {/* macOS-style code window */}
      <g>
        <rect
          x={WINDOW.x}
          y={WINDOW.y}
          width={WINDOW.w}
          height={WINDOW.h}
          rx="16"
          fill={theme.cardBg}
          stroke={theme.text}
          strokeOpacity="0.1"
          strokeWidth="2"
        />
        <rect
          x={WINDOW.x}
          y={WINDOW.y}
          width={WINDOW.w}
          height={WINDOW.headerH}
          rx="16"
          fill={theme.text}
          fillOpacity="0.05"
        />
        <circle cx={WINDOW.x + 30} cy={WINDOW.y + 22} r="7" fill="#ff5f57" />
        <circle cx={WINDOW.x + 55} cy={WINDOW.y + 22} r="7" fill="#febc2e" />
        <circle cx={WINDOW.x + 80} cy={WINDOW.y + 22} r="7" fill="#28c840" />

        {codeLines.map((line, i) => {
          const trimmed = line.trim();
          const isComment =
            trimmed.startsWith('#') ||
            trimmed.startsWith('//') ||
            trimmed.startsWith('--');
          return (
            <text
              key={i}
              x={WINDOW.x + 25}
              y={WINDOW.y + WINDOW.headerH + 50 + i * 36}
              fontFamily={FONT_MONO}
              fontSize="22"
              fill={isComment ? theme.muted : theme.text}
              fontStyle={isComment ? 'italic' : 'normal'}
            >
              {line || ' '}
            </text>
          );
        })}
      </g>

      <text
        x="80"
        y="640"
        fontSize="22"
        fontWeight="700"
        fill={theme.accent}
        letterSpacing="3"
        fontFamily={FONT_SANS}
      >
        KEY TAKEAWAYS
      </text>

      {points.map((point, i) => {
        const lines = wrapText(point, 56).slice(0, 2);
        const yBase = 690 + i * 70;
        return (
          <g key={i}>
            <rect x="80" y={yBase - 22} width="6" height="44" fill={theme.accent} />
            {lines.map((line, j) => (
              <text
                key={j}
                x="110"
                y={yBase + 8 + j * 30}
                fontSize="24"
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
