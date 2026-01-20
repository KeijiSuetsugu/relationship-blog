import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com' // 環境変数から取得するのが理想

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/private/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

