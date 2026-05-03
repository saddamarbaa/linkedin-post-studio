import type { Author, TemplateContent, Theme } from '@/types/studio';
import { PostBackground } from '@/components/shared/PostBackground';
import { PostFooter } from '@/components/shared/PostFooter';

type FullImageContent = Extract<TemplateContent, { kind: 'fullImage' }>;

interface FullImageTemplateProps {
  theme: Theme;
  content: FullImageContent;
  author: Author;
}

const FONT_SANS = 'system-ui, -apple-system, sans-serif';

const IMAGE_X = 80;
const IMAGE_Y = 80;
const IMAGE_W = 1040;
const IMAGE_H_WITH_CAPTION = 900;
const IMAGE_H_NO_CAPTION = 960;

export function FullImageTemplate({ theme, content, author }: FullImageTemplateProps) {
  const hasCaption = content.caption.trim().length > 0;
  const imgH = hasCaption ? IMAGE_H_WITH_CAPTION : IMAGE_H_NO_CAPTION;
  const captionY = IMAGE_Y + imgH + 40;
  const clipId = `full-img-clip-${theme.id}`;

  return (
    <svg viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg" width="100%">
      <PostBackground theme={theme} />

      <defs>
        <clipPath id={clipId}>
          <rect x={IMAGE_X} y={IMAGE_Y} width={IMAGE_W} height={imgH} rx="24" />
        </clipPath>
      </defs>

      {content.imageDataUrl ? (
        <image
          href={content.imageDataUrl}
          x={IMAGE_X}
          y={IMAGE_Y}
          width={IMAGE_W}
          height={imgH}
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#${clipId})`}
        />
      ) : (
        <g>
          <rect
            x={IMAGE_X}
            y={IMAGE_Y}
            width={IMAGE_W}
            height={imgH}
            rx="24"
            fill={theme.cardBg}
            stroke={theme.muted}
            strokeOpacity="0.4"
            strokeWidth="2"
            strokeDasharray="12 8"
          />
          <text
            x={IMAGE_X + IMAGE_W / 2}
            y={IMAGE_Y + imgH / 2 + 8}
            fontSize="28"
            fontWeight="600"
            fill={theme.muted}
            textAnchor="middle"
            fontFamily={FONT_SANS}
          >
            Upload an image to fill this area
          </text>
        </g>
      )}

      {hasCaption && (
        <text
          x="600"
          y={captionY}
          fontSize="22"
          fontWeight="500"
          fill={theme.muted}
          textAnchor="middle"
          fontFamily={FONT_SANS}
        >
          {content.caption}
        </text>
      )}

      <PostFooter theme={theme} author={author} />
    </svg>
  );
}
