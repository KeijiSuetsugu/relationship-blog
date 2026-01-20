import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey)

  // サイト設定（ベースURL）を取得
  const { data: settings } = await supabase
    .from('site_settings')
    .select('site_url')
    .single()

  const listUrl = settings?.site_url || 'https://example.com' // フォールバック

  // 公開済みの記事を取得
  const { data: posts } = await supabase
    .from('posts')
    .select('id, updated_at')
    .eq('is_draft', false)
    .order('created_at', { ascending: false })

  const postUrls = (posts || []).map((post) => ({
    url: `${listUrl}/posts/${post.id}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [
    {
      url: listUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...postUrls,
  ]
}
