import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 192,
  height: 192,
}
export const contentType = 'image/png'

export default function Icon192() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0f',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '48px',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '48px',
            background: 'radial-gradient(circle at 50% 40%, rgba(139,92,246,0.3) 0%, transparent 70%)',
          }}
        />
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192" fill="none" width="130" height="130">
          <path d="M96 20 L20 172 H52 L96 64 L140 172 H172 Z" fill="#8b5cf6" />
          <path d="M96 60 L72 120 H120 Z" fill="#0a0a0f" />
        </svg>
      </div>
    ),
    { ...size }
  )
}
