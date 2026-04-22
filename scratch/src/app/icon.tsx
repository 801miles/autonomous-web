import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 512,
  height: 512,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '128px',
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none" width="300" height="300">
          <path d="M256 120 L110 390 H175 L256 210 L337 390 H402 Z" fill="#22d3ee" />
          <path d="M256 170 L212 280 H300 Z" fill="#0a0a0a" />
        </svg>
      </div>
    ),
    { ...size }
  )
}
