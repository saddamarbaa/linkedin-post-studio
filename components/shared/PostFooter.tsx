import type { Author, Theme } from '@/types/studio';

interface PostFooterProps {
  theme: Theme;
  author: Author;
  // Suffix for the avatar clipPath id, in case multiple posts render together.
  seed?: string;
}

// SPEC §5.2:
// - divider: 1px line at y=1060, theme.muted at 40% opacity, x: 80 -> 1120
// - avatar: 80px circle at left (clipPath for image, accent fill + initial letter as fallback)
// - name: 24px / 700, theme.text
// - tagline: 18px / 400, theme.muted
// - LinkedIn badge: 80px rounded square at right, #0A66C2 fill, white italic 800 "in"
export function PostFooter({ theme, author, seed }: PostFooterProps) {
  const id = seed ?? theme.id;
  const clipId = `avatar-clip-${id}`;

  // Footer area y=1060..1200; avatar/badge centered around y=1130.
  const avatarCx = 120;
  const avatarCy = 1130;
  const avatarR = 40;

  const nameX = avatarCx + avatarR + 20; // 180
  const initial = (author.name?.[0] ?? '?').toUpperCase();

  return (
    <g>
      <line
        x1="80"
        y1="1060"
        x2="1120"
        y2="1060"
        stroke={theme.muted}
        strokeOpacity="0.4"
        strokeWidth="1"
      />

      {author.profileImageDataUrl ? (
        <g>
          <defs>
            <clipPath id={clipId}>
              <circle cx={avatarCx} cy={avatarCy} r={avatarR} />
            </clipPath>
          </defs>
          <circle cx={avatarCx} cy={avatarCy} r={avatarR} fill={theme.accent} />
          <image
            href={author.profileImageDataUrl}
            x={avatarCx - avatarR}
            y={avatarCy - avatarR}
            width={avatarR * 2}
            height={avatarR * 2}
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#${clipId})`}
          />
        </g>
      ) : (
        <g>
          <circle cx={avatarCx} cy={avatarCy} r={avatarR} fill={theme.accent} />
          <text
            x={avatarCx}
            y={avatarCy + 12}
            fontSize="36"
            fontWeight="800"
            fill={theme.isDark ? '#000000' : '#ffffff'}
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            {initial}
          </text>
        </g>
      )}

      <text
        x={nameX}
        y={avatarCy - 4}
        fontSize="24"
        fontWeight="700"
        fill={theme.text}
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        {author.name}
      </text>
      <text
        x={nameX}
        y={avatarCy + 26}
        fontSize="18"
        fontWeight="400"
        fill={theme.muted}
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        {author.tagline}
      </text>

      <g transform={`translate(${1120 - 80}, ${avatarCy - 40})`}>
        <rect width="80" height="80" rx="16" fill="#0A66C2" />
        <text
          x="40"
          y="58"
          fontSize="44"
          fontWeight="800"
          fontStyle="italic"
          fill="#ffffff"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          in
        </text>
      </g>
    </g>
  );
}
