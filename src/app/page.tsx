import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Mail } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import BlogCard from '@/components/BlogCard'

// Supabaseクライアントの作成
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function getData() {
  try {
    const [settingsRes, postsRes] = await Promise.all([
      supabase.from('site_settings').select('*').single(),
      supabase
        .from('posts')
        .select('*')
        .eq('is_draft', false)
        .order('created_at', { ascending: false })
        .limit(6),
    ])

    return {
      settings: settingsRes.data,
      posts: postsRes.data || [],
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return { settings: null, posts: [] }
  }
}

export default async function HomePage() {
  const { settings, posts } = await getData()

  return (
    <div className="min-h-screen">
      {/* ヒーローセクション */}
      <section className="relative py-12 md:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="container-pop animate-pop">
            {/* ヘッダー部分 */}
            <header className="text-center border-b-4 border-[var(--black)] pb-8 mb-8">
              <h1
                className="text-4xl md:text-6xl lg:text-7xl font-black uppercase mb-4"
                style={{
                  fontFamily: 'var(--font-display)',
                  transform: 'rotate(-2deg)'
                }}
              >
                {/* SupabaseにheroTaglineがないので、site_descriptionやデフォルト値を使用 */}
                {settings?.site_name || 'WELCOME!'}
              </h1>

              <div className="tag-badge animate-wiggle">
                ✨ {settings?.site_name || 'Ennek'} ✨
              </div>

              {settings?.site_description && (
                <p className="font-bold mt-6 text-lg md:text-xl">
                  {settings.site_description}
                </p>
              )}
            </header>

            {/* プロフィール画像 */}
            {/* Supabaseにまだ画像カラムがないので一時的に固定または非表示 */}
            <div className="flex justify-center mb-8">
              <div className="relative w-48 h-48 md:w-64 md:h-64 border-4 border-[var(--black)] shadow-[8px_8px_0_var(--black)] overflow-hidden bg-[var(--accent-blue)]">
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-8xl">👋</span>
                </div>
              </div>
            </div>

            {/* CTAボタン */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/blog" className="btn-pop flex items-center justify-center gap-2">
                BLOG を見る
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="#about" className="btn-pop btn-pop-pink flex items-center justify-center gap-2">
                ABOUT
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 自己紹介セクション */}
      <section id="about" className="py-12 md:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-section">
            <h2
              className="text-2xl md:text-3xl font-black uppercase mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              ABOUT ME
            </h2>

            <div className="grid md:grid-cols-3 gap-8 items-start">
              {/* プロフィール画像 */}
              <div className="flex justify-center">
                <div className="w-full max-w-[200px] aspect-square border-4 border-[var(--black)] shadow-[6px_6px_0_var(--black)] overflow-hidden bg-[var(--accent-pink)]">
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-6xl">😊</span>
                  </div>
                </div>
              </div>

              {/* 自己紹介文 */}
              <div className="md:col-span-2">
                <div className="text-lg leading-relaxed font-medium">
                  <p>
                    {/* SupabaseにaboutContentがないので、一時的にsite_descriptionを使用 */}
                    {settings?.site_description || 'こんにちは！'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 実績・経歴セクション - スキップ（Supabaseに未実装） */}

      {/* 最新ブログ記事セクション */}
      <section className="py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
            <h2
              className="text-3xl md:text-4xl font-black uppercase inline-block px-4 py-2 bg-[var(--accent-blue)] border-4 border-[var(--black)] shadow-[6px_6px_0_var(--black)]"
              style={{ fontFamily: 'var(--font-display)', transform: 'rotate(-1deg)' }}
            >
              LATEST POSTS
            </h2>
            <Link
              href="/blog"
              className="btn-pop inline-flex items-center gap-2"
            >
              VIEW ALL →
            </Link>
          </div>

          {posts && posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, index) => (
                <div key={post.id}>
                  {/* BlogCardのpropsがSupabaseの型と一致しない可能性があるため、簡易表示またはアダプターが必要 */}
                  {/* ここでは一旦BlogCardを使わず簡易表示にするか、BlogCardを修正する必要があるが、 */}
                  {/* 既存のBlogCardがSanity型に依存しているため、Linkのみにする */}
                  <Link href={`/posts/${post.id}`} className="block border-4 border-[var(--black)] bg-[var(--white)] shadow-[8px_8px_0_var(--black)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0_var(--black)] transition-all p-4">
                    <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{post.description}</p>
                    <time className="text-xs text-gray-400 mt-2 block">{new Date(post.created_at).toLocaleDateString()}</time>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border-4 border-[var(--black)] bg-[var(--white)] shadow-[8px_8px_0_var(--black)]">
              <span className="text-6xl mb-4 block">📝</span>
              <p className="font-bold text-lg">
                まだ記事がありません。<br />
                管理画面から記事を作成してください。
              </p>
            </div>
          )}
        </div>
      </section>

      {/* お問い合わせセクション */}
      <section id="contact" className="py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="links-area shadow-[8px_8px_0_var(--black)]">
            <h2
              className="text-3xl md:text-4xl font-black uppercase mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              LET&apos;s CONNECT!
            </h2>

            <p className="font-bold text-lg mb-8 max-w-xl mx-auto">
              {settings?.contact_email ? `お仕事のご依頼は ${settings.contact_email} までお気軽にどうぞ！` : 'お仕事のご依頼やご質問など、お気軽にお問い合わせください。'}
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              {settings?.contact_email && (
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="btn-pop flex items-center gap-2"
                >
                  <Mail className="w-5 h-5" />
                  CONTACT
                </a>
              )}

              {settings?.twitter && (
                <a
                  href={`https://twitter.com/${settings.twitter.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pop"
                >
                  X (Twitter)
                </a>
              )}

              {settings?.instagram && (
                <a
                  href={`https://instagram.com/${settings.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pop"
                >
                  Instagram
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
