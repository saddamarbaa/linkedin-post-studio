import { ImageResponse } from 'next/og';

export const alt = 'Post Studio — Beautiful LinkedIn graphics in 60 seconds';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          background:
            'linear-gradient(135deg, #0f172a 0%, #1e1b4b 55%, #4c1d95 100%)',
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg, #9333EA 0%, #DB2777 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 12px 40px rgba(147,51,234,0.45)',
            }}
          >
            <svg width="40" height="40" viewBox="0 0 32 32">
              <path
                d="M16 4 L18 14 L28 16 L18 18 L16 28 L14 18 L4 16 L14 14 Z"
                fill="#ffffff"
              />
            </svg>
          </div>
          <span
            style={{
              fontSize: '34px',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.02em',
            }}
          >
            Post Studio
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div
            style={{
              fontSize: '76px',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              maxWidth: '950px',
            }}
          >
            Beautiful LinkedIn graphics in 60 seconds.
          </div>
          <div
            style={{
              fontSize: '30px',
              color: '#cbd5e1',
              lineHeight: 1.4,
              maxWidth: '900px',
            }}
          >
            Pick a template, edit the text, export a 1200×1200 PNG. Built
            for AI, ML &amp; coding creators.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            fontSize: '22px',
            color: '#94a3b8',
            fontWeight: 500,
          }}
        >
          <span>14 templates</span>
          <span style={{ color: '#475569' }}>·</span>
          <span>6 themes</span>
          <span style={{ color: '#475569' }}>·</span>
          <span>Optional Claude AI</span>
          <span style={{ color: '#475569' }}>·</span>
          <span>No sign-up</span>
        </div>
      </div>
    ),
    size,
  );
}
