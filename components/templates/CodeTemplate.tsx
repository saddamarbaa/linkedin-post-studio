import type { Author, TemplateContent, Theme, HeroImage } from '@/types/studio';
import { wrapText } from '@/lib/utils/text-wrap';
import { PostBackground } from '@/components/shared/PostBackground';
import { PostFooter } from '@/components/shared/PostFooter';
import { HeroImageLayer } from '@/components/shared/HeroImage';

type CodeContent = Extract<TemplateContent, { kind: 'code' }>;

interface CodeTemplateProps {
  theme: Theme;
  content: CodeContent;
  author: Author;
  hero?: HeroImage;
}

const FONT_SANS = 'system-ui, -apple-system, sans-serif';
const FONT_MONO = "ui-monospace, 'SF Mono', Monaco, monospace";

const TRAFFIC = { red: '#ff5f57', yellow: '#febc2e', green: '#28c840' };

const WINDOW = { x: 80, y: 340, w: 1040, h: 640, headerH: 60 };
const MAX_CODE_LINES = 14;

export function CodeTemplate({ theme, content, author, hero }: CodeTemplateProps) {
  const titleLines = wrapText(content.title || '', 32).slice(0, 2);
  const codeLines = (content.code || '').split('\n').slice(0, MAX_CODE_LINES);
  const clipId = `code-img-${theme.id}`;

  return (
    <svg viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg" width="100%">
      <PostBackground theme={theme} />
      <HeroImageLayer hero={hero} theme={theme} />

      {titleLines.map((line, i) => (
        <text
          key={i}
          x="80"
          y={170 + i * 70}
          fontSize="56"
          fontWeight="800"
          fill={theme.text}
          fontFamily={FONT_SANS}
        >
          {line}
        </text>
      ))}

      {content.language && (
        <g transform={`translate(80, ${230 + titleLines.length * 60})`}>
          <rect
            width="160"
            height="40"
            rx="20"
            fill={theme.accent}
            fillOpacity="0.18"
            stroke={theme.accent}
            strokeWidth="2"
          />
          <text
            x="80"
            y="27"
            fontSize="18"
            fontWeight="700"
            fill={theme.accent}
            textAnchor="middle"
            letterSpacing="2"
            fontFamily={FONT_SANS}
          >
            {content.language.toUpperCase()}
          </text>
        </g>
      )}

      <g>
        {/* macOS-style window frame (SPEC §8.4) */}
        <rect
          x={WINDOW.x}
          y={WINDOW.y}
          width={WINDOW.w}
          height={WINDOW.h}
          rx="20"
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
          rx="20"
          fill={theme.text}
          fillOpacity="0.05"
        />
        <circle cx={WINDOW.x + 35} cy={WINDOW.y + 30} r="9" fill={TRAFFIC.red} />
        <circle cx={WINDOW.x + 65} cy={WINDOW.y + 30} r="9" fill={TRAFFIC.yellow} />
        <circle cx={WINDOW.x + 95} cy={WINDOW.y + 30} r="9" fill={TRAFFIC.green} />

        {content.imageDataUrl ? (
          <g>
            <defs>
              <clipPath id={clipId}>
                <rect
                  x={WINDOW.x + 20}
                  y={WINDOW.y + WINDOW.headerH + 20}
                  width={WINDOW.w - 40}
                  height={WINDOW.h - WINDOW.headerH - 40}
                  rx="8"
                />
              </clipPath>
            </defs>
            <image
              href={content.imageDataUrl}
              x={WINDOW.x + 20}
              y={WINDOW.y + WINDOW.headerH + 20}
              width={WINDOW.w - 40}
              height={WINDOW.h - WINDOW.headerH - 40}
              preserveAspectRatio="xMidYMid meet"
              clipPath={`url(#${clipId})`}
            />
          </g>
        ) : (
          codeLines.map((line, i) => {
            const trimmed = line.trim();
            const isComment =
              trimmed.startsWith('#') ||
              trimmed.startsWith('//') ||
              trimmed.startsWith('--');
            return (
              <text
                key={i}
                x={WINDOW.x + 35}
                y={WINDOW.y + WINDOW.headerH + 50 + i * 38}
                fontFamily={FONT_MONO}
                fontSize="24"
                fill={isComment ? theme.muted : theme.text}
                fontStyle={isComment ? 'italic' : 'normal'}
              >
                {line || ' '}
              </text>
            );
          })
        )}
      </g>

      <PostFooter theme={theme} author={author} />
    </svg>
  );
}
