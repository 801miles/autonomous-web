import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/sign-in/', '/sign-up/'],
      },
    ],
    sitemap: 'https://archon.systems/sitemap.xml',
    host: 'https://archon.systems',
  }
}
