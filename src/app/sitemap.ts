import { MetadataRoute } from 'next'
import { client, isSanityConfigured } from '@/sanity/lib/client'
import { allPostSlugsQuery, allCategorySlugsQuery, allTagSlugsQuery } from '@/sanity/lib/queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

  // 静的ページ
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]

  // Sanityが設定されていない場合は静的ページのみ返す
  if (!isSanityConfigured) {
    return staticPages
  }

  try {
    // ブログ記事
    const postSlugs = await client.fetch<string[]>(allPostSlugsQuery)
    const postPages: MetadataRoute.Sitemap = postSlugs.map((slug) => ({
      url: `${siteUrl}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    // カテゴリー
    const categorySlugs = await client.fetch<string[]>(allCategorySlugsQuery)
    const categoryPages: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
      url: `${siteUrl}/blog/category/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    // タグ
    const tagSlugs = await client.fetch<string[]>(allTagSlugsQuery)
    const tagPages: MetadataRoute.Sitemap = tagSlugs.map((slug) => ({
      url: `${siteUrl}/blog/tag/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }))

    return [...staticPages, ...postPages, ...categoryPages, ...tagPages]
  } catch {
    // Sanityへの接続に失敗した場合は静的ページのみ返す
    return staticPages
  }
}
