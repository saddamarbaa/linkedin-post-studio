import type { Author, TemplateContent, Theme, HeroImage } from '@/types/studio';
import { wrapText } from '@/lib/utils/text-wrap';
import { PostBackground } from '@/components/shared/PostBackground';
import { PostFooter } from '@/components/shared/PostFooter';
import { HeroImageLayer } from '@/components/shared/HeroImage';

type NetworkContent = Extract<TemplateContent, { kind: 'network' }>;

interface NetworkTemplateProps {
  theme: Theme;
  content: NetworkContent;
  author: Author;
  hero?: HeroImage;
}

const FONT_SANS = 'system-ui, -apple-system, sans-serif';

const PLOT = { x: 100, y: 470, w: 1000, h: 400 };
const NODE_R = 22;
const MAX_LAYERS = 8;
const MAX_NODES_PER_LAYER = 12;

export function NetworkTemplate({ theme, content, author, hero }: NetworkTemplateProps) {
  const layers = (content.layers.length > 0 ? content.layers : [1])
    .slice(0, MAX_LAYERS)
    .map((n) => Math.max(1, Math.min(n, MAX_NODES_PER_LAYER)));

  const titleLines = wrapText(content.title || '', 24).slice(0, 2);
  const captionLines = wrapText(content.caption || '', 60).slice(0, 1);
  const subtitleY = 290 + titleLines.length * 70;

  const layerSpacing = layers.length > 1 ? PLOT.w / (layers.length - 1) : 0;
  const totalNeurons = layers.reduce((a, b) => a + b, 0);
  const totalConnections = layers
    .slice(0, -1)
    .reduce((sum, n, i) => sum + n * layers[i + 1], 0);

  function nodePos(layerIdx: number, nodeIdx: number, totalInLayer: number) {
    const x = PLOT.x + layerIdx * layerSpacing;
    const y = PLOT.y + (PLOT.h / (totalInLayer + 1)) * (nodeIdx + 1);
    return { x, y };
  }

  function colorFor(layerIdx: number): string {
    if (layerIdx === 0) return theme.accent;
    if (layerIdx === layers.length - 1) return theme.accent2;
    return theme.muted;
  }

  function labelFor(layerIdx: number): string {
    if (layerIdx === 0) return 'INPUT';
    if (layerIdx === layers.length - 1) return 'OUTPUT';
    return `H${layerIdx}`;
  }

  return (
    <svg viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg" width="100%">
      <PostBackground theme={theme} />
      <HeroImageLayer hero={hero} theme={theme} />

      <g transform="translate(80, 130)">
        <rect
          width="220"
          height="44"
          rx="22"
          fill={theme.accent}
          fillOpacity="0.2"
          stroke={theme.accent}
          strokeWidth="2"
        />
        <text
          x="110"
          y="29"
          fontSize="20"
          fontWeight="800"
          fill={theme.accent}
          textAnchor="middle"
          letterSpacing="2"
          fontFamily={FONT_SANS}
        >
          NETWORK
        </text>
      </g>

      {titleLines.map((line, i) => (
        <text
          key={i}
          x="80"
          y={250 + i * 70}
          fontSize="52"
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

      {/* connections: every node in column N to every node in column N+1 */}
      <g opacity="0.35">
        {layers.slice(0, -1).flatMap((nodes, lIdx) => {
          const nextNodes = layers[lIdx + 1];
          const lines: React.ReactNode[] = [];
          for (let i = 0; i < nodes; i++) {
            for (let j = 0; j < nextNodes; j++) {
              const from = nodePos(lIdx, i, nodes);
              const to = nodePos(lIdx + 1, j, nextNodes);
              lines.push(
                <line
                  key={`${lIdx}-${i}-${j}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={theme.muted}
                  strokeWidth="1.5"
                />,
              );
            }
          }
          return lines;
        })}
      </g>

      {/* nodes + per-column labels */}
      {layers.map((nodeCount, lIdx) => {
        const color = colorFor(lIdx);
        const colX = PLOT.x + lIdx * layerSpacing;
        return (
          <g key={lIdx}>
            {Array.from({ length: nodeCount }, (_, nIdx) => {
              const pos = nodePos(lIdx, nIdx, nodeCount);
              return (
                <g key={nIdx}>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={NODE_R}
                    fill={theme.bgGradient[0]}
                    stroke={color}
                    strokeWidth="4"
                  />
                  <circle cx={pos.x} cy={pos.y} r={NODE_R - 12} fill={color} fillOpacity="0.7" />
                </g>
              );
            })}
            <text
              x={colX}
              y={PLOT.y - 24}
              fontSize="20"
              fontWeight="700"
              fill={color}
              textAnchor="middle"
              fontFamily={FONT_SANS}
              letterSpacing="2"
            >
              {labelFor(lIdx)}
            </text>
            <text
              x={colX}
              y={PLOT.y + PLOT.h + 44}
              fontSize="18"
              fill={theme.muted}
              textAnchor="middle"
              fontFamily={FONT_SANS}
            >
              {nodeCount} {nodeCount === 1 ? 'node' : 'nodes'}
            </text>
          </g>
        );
      })}

      {/* stats row */}
      <g transform="translate(80, 940)">
        <Stat x={0} label="LAYERS" value={layers.length} theme={theme} />
        <Stat x={360} label="NEURONS" value={totalNeurons} theme={theme} />
        <Stat x={720} label="CONNECTIONS" value={totalConnections} theme={theme} />
      </g>

      <PostFooter theme={theme} author={author} />
    </svg>
  );
}

function Stat({
  x,
  label,
  value,
  theme,
}: {
  x: number;
  label: string;
  value: number;
  theme: Theme;
}) {
  return (
    <g transform={`translate(${x}, 0)`}>
      <rect
        width="320"
        height="80"
        rx="16"
        fill={theme.cardBg}
        stroke={theme.text}
        strokeOpacity="0.1"
        strokeWidth="2"
      />
      <text
        x="20"
        y="32"
        fontSize="14"
        fill={theme.muted}
        letterSpacing="2"
        fontWeight="700"
        fontFamily={FONT_SANS}
      >
        {label}
      </text>
      <text
        x="20"
        y="68"
        fontSize="30"
        fontWeight="900"
        fill={theme.text}
        fontFamily={FONT_SANS}
      >
        {value}
      </text>
    </g>
  );
}
