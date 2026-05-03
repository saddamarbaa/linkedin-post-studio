import type { Author, CurveKind, TemplateContent, Theme, HeroImage } from '@/types/studio';
import { wrapText } from '@/lib/utils/text-wrap';
import { PostBackground } from '@/components/shared/PostBackground';
import { PostFooter } from '@/components/shared/PostFooter';
import { HeroImageLayer } from '@/components/shared/HeroImage';

type CurveContent = Extract<TemplateContent, { kind: 'curve' }>;

interface CurveTemplateProps {
  theme: Theme;
  content: CurveContent;
  author: Author;
  hero?: HeroImage;
}

const FONT_SANS = 'system-ui, -apple-system, sans-serif';
const FONT_MATH = "'Cambria Math', Georgia, serif";

// Pure math definitions for each curve. Each entry maps a sample t -> y, plus
// the input domain and output range used for normalization to plot space.
interface CurveSpec {
  fn: (t: number) => number;
  domain: [number, number];
  range: [number, number];
  formula: string;
}

const CURVES: Record<CurveKind, CurveSpec> = {
  sigmoid: {
    fn: (t) => 1 / (1 + Math.exp(-t)),
    domain: [-6, 6],
    range: [0, 1],
    formula: 'σ(x) = 1 / (1 + e^−x)',
  },
  relu: {
    fn: (t) => Math.max(0, t),
    domain: [-6, 6],
    range: [0, 6],
    formula: 'ReLU(x) = max(0, x)',
  },
  tanh: {
    fn: (t) => Math.tanh(t),
    domain: [-3, 3],
    range: [-1, 1],
    formula: 'tanh(x) = (eˣ − e⁻ˣ) / (eˣ + e⁻ˣ)',
  },
  gaussian: {
    fn: (t) => Math.exp(-(t * t) / 2),
    domain: [-3, 3],
    range: [0, 1],
    formula: 'φ(x) = e^(−x² / 2)',
  },
  logloss: {
    // -log(p) for p in (0, 1]; clamp very small p to keep the y-range bounded.
    fn: (p) => -Math.log(Math.max(p, 1e-3)),
    domain: [0.01, 1],
    range: [0, -Math.log(0.01)],
    formula: 'L(p) = − log(p)',
  },
  convex: {
    fn: (t) => t * t,
    domain: [-3, 3],
    range: [0, 9],
    formula: 'f(x) = x²',
  },
};

const PLOT = { x: 200, y: 480, w: 800, h: 380, samples: 120 };

export function CurveTemplate({ theme, content, author, hero }: CurveTemplateProps) {
  const titleLines = wrapText(content.title || '', 22).slice(0, 2);
  const captionLines = wrapText(content.caption || '', 60).slice(0, 1);
  const spec = CURVES[content.curve];
  const path = buildPath(spec);
  const subtitleY = 290 + titleLines.length * 70;

  return (
    <svg viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg" width="100%">
      <PostBackground theme={theme} />
      <HeroImageLayer hero={hero} theme={theme} />

      <g transform="translate(80, 130)">
        <rect
          width="180"
          height="44"
          rx="22"
          fill={theme.accent2}
          fillOpacity="0.2"
          stroke={theme.accent2}
          strokeWidth="2"
        />
        <text
          x="90"
          y="29"
          fontSize="20"
          fontWeight="800"
          fill={theme.accent2}
          textAnchor="middle"
          letterSpacing="2"
          fontFamily={FONT_SANS}
        >
          GRAPH
        </text>
      </g>

      {titleLines.map((line, i) => (
        <text
          key={i}
          x="80"
          y={250 + i * 70}
          fontSize="56"
          fontWeight="900"
          fill={theme.text}
          fontFamily={FONT_SANS}
          letterSpacing="-1"
        >
          {line}
        </text>
      ))}

      {captionLines.map((line, i) => (
        <text
          key={i}
          x="80"
          y={subtitleY + i * 32}
          fontSize="24"
          fill={theme.muted}
          fontFamily={FONT_SANS}
        >
          {line}
        </text>
      ))}

      <Plot theme={theme} path={path} curve={content.curve} />

      <g transform="translate(80, 920)">
        <rect
          width="1040"
          height="80"
          rx="16"
          fill={theme.cardBg}
          stroke={theme.accent}
          strokeOpacity="0.4"
          strokeWidth="2"
        />
        <text
          x="520"
          y="50"
          fontSize="30"
          fontWeight="500"
          fill={theme.text}
          textAnchor="middle"
          fontFamily={FONT_MATH}
          fontStyle="italic"
        >
          {spec.formula}
        </text>
      </g>

      <PostFooter theme={theme} author={author} />
    </svg>
  );
}

function buildPath({ fn, domain, range }: CurveSpec): string {
  const [tMin, tMax] = domain;
  const [yMin, yMax] = range;
  const yPad = 0.04 * (yMax - yMin);

  const points: string[] = [];
  for (let i = 0; i <= PLOT.samples; i++) {
    const u = i / PLOT.samples;
    const t = tMin + u * (tMax - tMin);
    const yRaw = fn(t);
    const yClamped = Math.min(Math.max(yRaw, yMin - yPad), yMax + yPad);
    const yNorm = (yClamped - yMin) / (yMax - yMin); // 0..1, with y up
    const x = PLOT.x + u * PLOT.w;
    const y = PLOT.y + PLOT.h - yNorm * PLOT.h;
    points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return `M ${points.join(' L ')}`;
}

function Plot({
  theme,
  path,
  curve,
}: {
  theme: Theme;
  path: string;
  curve: CurveKind;
}) {
  const xCenter = PLOT.x + PLOT.w / 2;
  const yCenter = PLOT.y + PLOT.h / 2;

  return (
    <g>
      <rect
        x={PLOT.x}
        y={PLOT.y}
        width={PLOT.w}
        height={PLOT.h}
        rx="8"
        fill={theme.cardBg}
      />

      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={`hg-${i}`}
          x1={PLOT.x}
          y1={PLOT.y + (i * PLOT.h) / 4}
          x2={PLOT.x + PLOT.w}
          y2={PLOT.y + (i * PLOT.h) / 4}
          stroke={theme.text}
          strokeOpacity="0.08"
          strokeWidth="1"
        />
      ))}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <line
          key={`vg-${i}`}
          x1={PLOT.x + (i * PLOT.w) / 8}
          y1={PLOT.y}
          x2={PLOT.x + (i * PLOT.w) / 8}
          y2={PLOT.y + PLOT.h}
          stroke={theme.text}
          strokeOpacity="0.08"
          strokeWidth="1"
        />
      ))}

      <line
        x1={PLOT.x}
        y1={PLOT.y + PLOT.h}
        x2={PLOT.x + PLOT.w}
        y2={PLOT.y + PLOT.h}
        stroke={theme.text}
        strokeOpacity="0.6"
        strokeWidth="2"
      />
      <line
        x1={PLOT.x}
        y1={PLOT.y}
        x2={PLOT.x}
        y2={PLOT.y + PLOT.h}
        stroke={theme.text}
        strokeOpacity="0.6"
        strokeWidth="2"
      />

      <text
        x={xCenter}
        y={PLOT.y + PLOT.h + 38}
        fontSize="20"
        fill={theme.muted}
        textAnchor="middle"
        fontStyle="italic"
        fontFamily={FONT_SANS}
      >
        x
      </text>
      <text
        x={PLOT.x - 28}
        y={yCenter}
        fontSize="20"
        fill={theme.muted}
        textAnchor="middle"
        fontStyle="italic"
        fontFamily={FONT_SANS}
      >
        y
      </text>

      {/* glow + crisp stroke */}
      <path
        d={path}
        fill="none"
        stroke={theme.accent}
        strokeWidth="10"
        strokeOpacity="0.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={path}
        fill="none"
        stroke={theme.accent}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {curve === 'sigmoid' && (
        <g>
          <line
            x1={PLOT.x}
            y1={PLOT.y}
            x2={PLOT.x + PLOT.w}
            y2={PLOT.y}
            stroke={theme.accent2}
            strokeOpacity="0.5"
            strokeDasharray="4 4"
            strokeWidth="1.5"
          />
          <text
            x={PLOT.x + PLOT.w + 10}
            y={PLOT.y + 6}
            fontSize="18"
            fill={theme.accent2}
            fontFamily={FONT_SANS}
          >
            y=1
          </text>
          <text
            x={PLOT.x + PLOT.w + 10}
            y={PLOT.y + PLOT.h + 6}
            fontSize="18"
            fill={theme.accent2}
            fontFamily={FONT_SANS}
          >
            y=0
          </text>
        </g>
      )}
    </g>
  );
}
