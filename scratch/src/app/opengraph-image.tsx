import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Archon | Architect Orchestrator'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0a0a0f 0%, #0d0d1a 50%, #0a0a0f 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Grid overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(#ffffff08 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Purple glow orb top-left */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            left: -100,
            width: 500,
            height: 500,
            background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />

        {/* Cyan glow orb bottom-right */}
        <div
          style={{
            position: 'absolute',
            bottom: -100,
            right: -100,
            width: 400,
            height: 400,
            background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24,
            zIndex: 1,
          }}
        >
          {/* Logo mark */}
          <div
            style={{
              width: 80,
              height: 80,
              background: 'rgba(139,92,246,0.15)',
              border: '1px solid rgba(139,92,246,0.3)',
              borderRadius: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="48" height="48" viewBox="0 0 512 512" fill="none">
              <path d="M256 80 L80 430 H170 L256 200 L342 430 H432 Z" fill="#8b5cf6" />
              <path d="M256 160 L200 310 H312 Z" fill="#0a0a0f" />
            </svg>
          </div>

          {/* Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 16px',
              background: 'rgba(139,92,246,0.1)',
              border: '1px solid rgba(139,92,246,0.25)',
              borderRadius: 100,
            }}
          >
            <span style={{ color: '#8b5cf6', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Autonomous Architect Orchestrator
            </span>
          </div>

          {/* Headline */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <span
              style={{
                fontSize: 68,
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                lineHeight: 1.05,
              }}
            >
              From Intent to
            </span>
            <span
              style={{
                fontSize: 68,
                fontWeight: 800,
                letterSpacing: '-0.03em',
                background: 'linear-gradient(135deg, #ffffff 0%, #8b5cf6 100%)',
                // @ts-ignore
                '-webkit-background-clip': 'text',
                color: 'transparent',
                lineHeight: 1.05,
              }}
            >
              Infrastructure.
            </span>
          </div>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 20,
              color: 'rgba(255,255,255,0.45)',
              textAlign: 'center',
              maxWidth: 600,
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            5 psychographic questions. 4 autonomous agents. One production-grade specification.
          </p>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 48, marginTop: 16 }}>
            {[
              { v: '5', l: 'Golden Questions' },
              { v: '4', l: 'Archon Agents' },
              { v: '$29', l: 'One-time Export' },
            ].map(({ v, l }) => (
              <div key={l} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: '#8b5cf6' }}>{v}</span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: 32,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>archon.systems</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
