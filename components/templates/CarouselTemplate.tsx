import type {
  Author,
  CarouselSlide,
  HeroImage,
  TemplateContent,
  Theme,
} from '@/types/studio';
import { wrapText } from '@/lib/utils/text-wrap';
import { PostBackground } from '@/components/shared/PostBackground';
import { PostFooter } from '@/components/shared/PostFooter';
import { HeroImageLayer } from '@/components/shared/HeroImage';

type CarouselContent = Extract<TemplateContent, { kind: 'carousel' }>;

interface CarouselTemplateProps {
  theme: Theme;
  content: CarouselContent;
  author: Author;
  hero?: HeroImage;
  // Index of the slide to render. Templates are pure SVG; navigation between
  // slides lives in the controls/UI layer.
  slideIndex?: number;
}

const FONT_SANS = 'system-ui, -apple-system, sans-serif';

export function CarouselTemplate({
  theme,
  content,
  author,
  hero,
  slideIndex = 0,
}: CarouselTemplateProps) {
  const slides = content.slides;
  const total = slides.length;
  const idx = total === 0 ? 0 : Math.min(Math.max(slideIndex, 0), total - 1);
  const slide: CarouselSlide | undefined = slides[idx];

  return (
    <svg viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg" width="100%">
      <PostBackground theme={theme} />
      <HeroImageLayer hero={hero} theme={theme} />

      {slide && <SlideBody theme={theme} slide={slide} index={idx} />}

      {total > 0 && (
        <text
          x="1120"
          y="1010"
          fontSize="20"
          fill={theme.muted}
          textAnchor="end"
          fontFamily={FONT_SANS}
        >
          {idx + 1} / {total}
        </text>
      )}

      <PostFooter theme={theme} author={author} />
    </svg>
  );
}

function SlideBody({
  theme,
  slide,
  index,
}: {
  theme: Theme;
  slide: CarouselSlide;
  index: number;
}) {
  if (slide.type === 'cover') {
    const titleLines = wrapText(slide.title || '', 18).slice(0, 4);
    return (
      <g>
        {titleLines.map((line, i) => (
          <text
            key={i}
            x="80"
            y={350 + i * 100}
            fontSize="86"
            fontWeight="900"
            fill={theme.text}
            fontFamily={FONT_SANS}
            letterSpacing="-2"
          >
            {line}
          </text>
        ))}
        {slide.subtitle && (
          <text
            x="80"
            y={400 + titleLines.length * 100}
            fontSize="34"
            fill={theme.muted}
            fontFamily={FONT_SANS}
          >
            {slide.subtitle}
          </text>
        )}
      </g>
    );
  }

  if (slide.type === 'tip') {
    const headLines = wrapText(slide.heading || '', 20).slice(0, 3);
    const bodyLines = wrapText(slide.body || '', 42).slice(0, 4);
    return (
      <g>
        <circle cx="140" cy="220" r="60" fill={theme.accent} />
        <text
          x="140"
          y="240"
          fontSize="64"
          fontWeight="900"
          fill={theme.isDark ? '#000000' : '#ffffff'}
          textAnchor="middle"
          fontFamily={FONT_SANS}
        >
          {slide.number || index + 1}
        </text>

        {headLines.map((line, i) => (
          <text
            key={i}
            x="80"
            y={400 + i * 90}
            fontSize="72"
            fontWeight="800"
            fill={theme.text}
            fontFamily={FONT_SANS}
            letterSpacing="-1"
          >
            {line}
          </text>
        ))}

        {bodyLines.map((line, i) => (
          <text
            key={i}
            x="80"
            y={500 + headLines.length * 90 + i * 44}
            fontSize="32"
            fill={theme.muted}
            fontFamily={FONT_SANS}
          >
            {line}
          </text>
        ))}
      </g>
    );
  }

  // cta
  const titleLines = wrapText(slide.title || '', 18).slice(0, 3);
  return (
    <g>
      {titleLines.map((line, i) => (
        <text
          key={i}
          x="600"
          y={460 + i * 90}
          fontSize="68"
          fontWeight="900"
          fill={theme.text}
          textAnchor="middle"
          fontFamily={FONT_SANS}
          letterSpacing="-2"
        >
          {line}
        </text>
      ))}
      {slide.subtitle && (
        <text
          x="600"
          y={500 + titleLines.length * 90}
          fontSize="30"
          fill={theme.muted}
          textAnchor="middle"
          fontFamily={FONT_SANS}
        >
          {slide.subtitle}
        </text>
      )}
    </g>
  );
}
