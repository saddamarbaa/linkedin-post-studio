import type { Author, TemplateContent, Theme, HeroImage } from '@/types/studio';
import { wrapText } from '@/lib/utils/text-wrap';
import { PostBackground } from '@/components/shared/PostBackground';
import { PostFooter } from '@/components/shared/PostFooter';
import { HeroImageLayer } from '@/components/shared/HeroImage';

type ThumbnailContent = Extract<TemplateContent, { kind: 'thumbnail' }>;

interface ThumbnailTemplateProps {
  theme: Theme;
  content: ThumbnailContent;
  author: Author;
  hero?: HeroImage;
}

const FONT_SANS = 'system-ui, -apple-system, sans-serif';

export function ThumbnailTemplate({ theme, content, author, hero }: ThumbnailTemplateProps) {
  return (
    <svg viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg" width="100%">
      <PostBackground theme={theme} />
      <HeroImageLayer hero={hero} theme={theme} />
      <Body theme={theme} content={content} />
      <PostFooter theme={theme} author={author} />
    </svg>
  );
}

function Body({ theme, content }: { theme: Theme; content: ThumbnailContent }) {
  switch (content.style) {
    case 'shock':
      return <ShockBody theme={theme} content={content} />;
    case 'question':
      return <QuestionBody theme={theme} content={content} />;
    case 'stat':
      return <StatBody theme={theme} content={content} />;
    case 'reveal':
      return <RevealBody theme={theme} content={content} />;
  }
}

// SHOCK: ALL CAPS, massive, urgent. Red WAIT chip + huge hook.
function ShockBody({ theme, content }: { theme: Theme; content: ThumbnailContent }) {
  const hookLines = wrapText(content.hook || '', 18).slice(0, 4);
  const hookBaseY = 380;
  const hookLineHeight = 130;
  const underlineY = hookBaseY + hookLines.length * hookLineHeight - 60;
  const sublineY = underlineY + 70;

  return (
    <g>
      <g opacity="0.15">
        <text x="100" y="220" fontSize="180" fill={theme.accent} fontFamily={FONT_SANS}>
          ⚠
        </text>
        <text x="950" y="1020" fontSize="160" fill={theme.accent2} fontFamily={FONT_SANS}>
          !
        </text>
      </g>

      <g transform="translate(80, 200)">
        <rect width="240" height="56" rx="28" fill="#ef4444" />
        <text
          x="120"
          y="38"
          fontSize="22"
          fontWeight="900"
          fill="#ffffff"
          textAnchor="middle"
          letterSpacing="3"
          fontFamily={FONT_SANS}
        >
          WAIT
        </text>
      </g>

      {hookLines.map((line, i) => (
        <text
          key={i}
          x="80"
          y={hookBaseY + i * hookLineHeight}
          fontSize="120"
          fontWeight="900"
          fill={theme.text}
          fontFamily={FONT_SANS}
          letterSpacing="-3"
        >
          {line.toUpperCase()}
        </text>
      ))}

      <rect x="80" y={underlineY} width="200" height="10" fill={theme.accent} />

      {content.subline && (
        <text
          x="80"
          y={sublineY}
          fontSize="38"
          fontWeight="600"
          fill={theme.muted}
          fontFamily={FONT_SANS}
        >
          {content.subline}
        </text>
      )}

      {content.context && (
        <g transform="translate(80, 970)">
          <rect width="540" height="56" rx="28" fill={theme.accent} />
          <text
            x="270"
            y="38"
            fontSize="24"
            fontWeight="800"
            fill={theme.isDark ? '#000000' : '#ffffff'}
            textAnchor="middle"
            letterSpacing="2"
            fontFamily={FONT_SANS}
          >
            {content.context}
          </text>
        </g>
      )}
    </g>
  );
}

// QUESTION: huge translucent "?", italic subline, accent-bar context.
function QuestionBody({ theme, content }: { theme: Theme; content: ThumbnailContent }) {
  const hookLines = wrapText(content.hook || '', 18).slice(0, 4);
  const hookBaseY = 480;
  const hookLineHeight = 110;
  const cardY = hookBaseY + hookLines.length * hookLineHeight + 30;

  return (
    <g>
      <text
        x="80"
        y="340"
        fontSize="320"
        fontFamily="Georgia, serif"
        fill={theme.accent}
        fillOpacity="0.45"
        fontWeight="900"
      >
        ?
      </text>

      <g transform="translate(80, 200)">
        <rect
          width="220"
          height="50"
          rx="25"
          fill={theme.accent2}
          fillOpacity="0.2"
          stroke={theme.accent2}
          strokeWidth="2"
        />
        <text
          x="110"
          y="33"
          fontSize="20"
          fontWeight="800"
          fill={theme.accent2}
          textAnchor="middle"
          letterSpacing="3"
          fontFamily={FONT_SANS}
        >
          THINK
        </text>
      </g>

      {hookLines.map((line, i) => (
        <text
          key={i}
          x="80"
          y={hookBaseY + i * hookLineHeight}
          fontSize="92"
          fontWeight="900"
          fill={theme.text}
          fontFamily={FONT_SANS}
          letterSpacing="-2"
        >
          {line}
        </text>
      ))}

      <g transform={`translate(80, ${cardY})`}>
        <rect width="6" height="130" fill={theme.accent} />
        {content.subline && (
          <text
            x="30"
            y="50"
            fontSize="36"
            fontWeight="600"
            fill={theme.muted}
            fontStyle="italic"
            fontFamily={FONT_SANS}
          >
            {content.subline}
          </text>
        )}
        {content.context && (
          <text
            x="30"
            y="100"
            fontSize="26"
            fontWeight="500"
            fill={theme.accent2}
            fontFamily={FONT_SANS}
          >
            → {content.context}
          </text>
        )}
      </g>
    </g>
  );
}

// STAT: concentric rings + massive number, BY THE NUMBERS chip.
function StatBody({ theme, content }: { theme: Theme; content: ThumbnailContent }) {
  const statValue = content.hook || '10x';
  const isShortStat = statValue.length <= 6;

  return (
    <g>
      <g opacity="0.08" fill="none" stroke={theme.accent} strokeWidth="2">
        <circle cx="600" cy="600" r="500" />
        <circle cx="600" cy="600" r="400" />
        <circle cx="600" cy="600" r="300" />
      </g>

      <g transform="translate(80, 200)">
        <rect width="280" height="50" rx="25" fill={theme.accent} />
        <text
          x="140"
          y="33"
          fontSize="20"
          fontWeight="900"
          fill={theme.isDark ? '#000000' : '#ffffff'}
          textAnchor="middle"
          letterSpacing="3"
          fontFamily={FONT_SANS}
        >
          BY THE NUMBERS
        </text>
      </g>

      <text
        x="600"
        y={isShortStat ? 660 : 620}
        fontSize={isShortStat ? 380 : 240}
        fontWeight="900"
        fill={theme.accent}
        textAnchor="middle"
        fontFamily={FONT_SANS}
        letterSpacing="-10"
      >
        {statValue}
      </text>

      {content.subline && (
        <text
          x="600"
          y="800"
          fontSize="52"
          fontWeight="800"
          fill={theme.text}
          textAnchor="middle"
          fontFamily={FONT_SANS}
          letterSpacing="-1"
        >
          {content.subline}
        </text>
      )}

      {content.context && (
        <text
          x="600"
          y="870"
          fontSize="28"
          fontWeight="500"
          fill={theme.muted}
          textAnchor="middle"
          fontFamily={FONT_SANS}
        >
          {content.context}
        </text>
      )}

      <line x1="540" y1="930" x2="660" y2="930" stroke={theme.accent} strokeWidth="4" />
    </g>
  );
}

// REVEAL: curved path, STORY chip, hook + subline card with bullet.
function RevealBody({ theme, content }: { theme: Theme; content: ThumbnailContent }) {
  const hookLines = wrapText(content.hook || '', 20).slice(0, 3);
  const hookBaseY = 380;
  const hookLineHeight = 110;
  const cardY = hookBaseY + hookLines.length * hookLineHeight + 30;

  return (
    <g>
      <g opacity="0.12">
        <path
          d="M 100 1100 Q 300 900 500 950 T 900 850 T 1100 700"
          fill="none"
          stroke={theme.accent}
          strokeWidth="6"
          strokeLinecap="round"
        />
        <circle cx="1100" cy="700" r="20" fill={theme.accent} />
      </g>

      <g transform="translate(80, 200)">
        <rect width="220" height="50" rx="25" fill={theme.accent2} />
        <text
          x="110"
          y="33"
          fontSize="22"
          fontWeight="900"
          fill={theme.isDark ? '#000000' : '#ffffff'}
          textAnchor="middle"
          letterSpacing="3"
          fontFamily={FONT_SANS}
        >
          STORY
        </text>
      </g>

      {hookLines.map((line, i) => (
        <text
          key={i}
          x="80"
          y={hookBaseY + i * hookLineHeight}
          fontSize="88"
          fontWeight="900"
          fill={theme.text}
          fontFamily={FONT_SANS}
          letterSpacing="-2"
        >
          {line}
        </text>
      ))}

      <g transform={`translate(80, ${cardY})`}>
        <rect
          width="1040"
          height="180"
          rx="20"
          fill={theme.cardBg}
          stroke={theme.accent2}
          strokeOpacity="0.4"
          strokeWidth="3"
        />
        {content.subline && (
          <text
            x="40"
            y="70"
            fontSize="42"
            fontWeight="800"
            fill={theme.accent}
            fontFamily={FONT_SANS}
          >
            {content.subline}
          </text>
        )}
        {content.context && (
          <g transform="translate(40, 110)">
            <circle cx="14" cy="20" r="8" fill={theme.accent2} />
            <text
              x="40"
              y="28"
              fontSize="26"
              fontWeight="500"
              fill={theme.muted}
              fontStyle="italic"
              fontFamily={FONT_SANS}
            >
              {content.context}
            </text>
          </g>
        )}
      </g>
    </g>
  );
}
