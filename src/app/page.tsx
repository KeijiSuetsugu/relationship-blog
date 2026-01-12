import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Mail } from 'lucide-react'
import { PortableText } from '@portabletext/react'
import { client, isSanityConfigured } from '@/sanity/lib/client'
import { siteSettingsQuery, latestPostsQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import BlogCard from '@/components/BlogCard'
import type { SiteSettings, Post } from '@/sanity/lib/types'

async function getData() {
  if (!isSanityConfigured) {
    return { settings: null, posts: [] }
  }
  
  try {
    const [settings, posts] = await Promise.all([
      client.fetch<SiteSettings>(siteSettingsQuery),
      client.fetch<Post[]>(latestPostsQuery),
    ])
    return { settings, posts }
  } catch {
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
                {settings?.heroTagline || 'WELCOME!'}
              </h1>
              
              <div className="tag-badge animate-wiggle">
                ✨ {settings?.title || 'Ennek'} ✨
              </div>

              {settings?.heroSubtitle && (
                <p className="font-bold mt-6 text-lg md:text-xl">
                  {settings.heroSubtitle}
                </p>
              )}
            </header>

            {/* プロフィール画像 */}
            <div className="flex justify-center mb-8">
              <div className="relative w-48 h-48 md:w-64 md:h-64 border-4 border-[var(--black)] shadow-[8px_8px_0_var(--black)] overflow-hidden bg-[var(--accent-blue)]">
                  {settings?.heroImage ? (
                    <Image
                    src={urlFor(settings.heroImage).width(512).height(512).url()}
                      alt="プロフィール"
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-8xl">👋</span>
                    </div>
                  )}
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
              {settings?.aboutTitle || 'ABOUT ME'}
            </h2>

            <div className="grid md:grid-cols-3 gap-8 items-start">
            {/* プロフィール画像 */}
              <div className="flex justify-center">
                <div className="w-full max-w-[200px] aspect-square border-4 border-[var(--black)] shadow-[6px_6px_0_var(--black)] overflow-hidden bg-[var(--accent-pink)]">
                {settings?.profileImage ? (
                  <Image
                      src={urlFor(settings.profileImage).width(400).height(400).url()}
                    alt="プロフィール"
                      width={400}
                      height={400}
                      className="object-cover w-full h-full"
                  />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-6xl">😊</span>
                  </div>
                )}
              </div>
            </div>

            {/* 自己紹介文 */}
              <div className="md:col-span-2">
                <div className="text-lg leading-relaxed font-medium">
                {settings?.aboutContent ? (
                    <div className="space-y-4">
                    <PortableText value={settings.aboutContent} />
                  </div>
                ) : (
                    <p>
                      自己紹介文をSanity CMSで設定してください。<br/>
                      ここにあなたの紹介文が表示されます。
                  </p>
                )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 実績・経歴セクション */}
      {settings?.achievements && settings.achievements.length > 0 && (
        <section className="py-12 md:py-20">
          <div className="max-w-5xl mx-auto px-4">
            <div className="border-4 border-[var(--black)] bg-[var(--white)] shadow-[8px_8px_0_var(--black)] p-6 md:p-10">
              <h2 
                className="text-2xl md:text-3xl font-black uppercase mb-8 inline-block px-4 py-2 bg-[var(--accent-blue)] border-2 border-[var(--black)] shadow-[4px_4px_0_var(--black)]"
                style={{ fontFamily: 'var(--font-display)', transform: 'rotate(-1deg)' }}
              >
                TIMELINE
              </h2>

              <div className="space-y-6">
                {settings.achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="flex gap-4 items-start p-4 border-2 border-[var(--black)] hover:bg-[var(--bg-color)] transition-colors"
                  >
                    <div className="flex-shrink-0 w-20 h-10 bg-[var(--accent-pink)] border-2 border-[var(--black)] flex items-center justify-center font-black text-sm">
                          {achievement.year}
                    </div>
                    <div>
                      <h3 className="font-black text-lg">{achievement.title}</h3>
                        {achievement.description && (
                        <p className="text-sm mt-1">{achievement.description}</p>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

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
                <BlogCard key={post._id} post={post} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border-4 border-[var(--black)] bg-[var(--white)] shadow-[8px_8px_0_var(--black)]">
              <span className="text-6xl mb-4 block">📝</span>
              <p className="font-bold text-lg">
                まだ記事がありません。<br/>
                Sanity CMSで記事を作成してください。
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
              LET&apos;S CONNECT!
          </h2>
          
            <p className="font-bold text-lg mb-8 max-w-xl mx-auto">
            {settings?.contactInfo || 'お仕事のご依頼やご質問など、お気軽にお問い合わせください。'}
          </p>
          
            <div className="flex flex-wrap justify-center gap-4">
          {settings?.contactEmail && (
            <a
              href={`mailto:${settings.contactEmail}`}
                  className="btn-pop flex items-center gap-2"
            >
              <Mail className="w-5 h-5" />
                  CONTACT
                </a>
              )}
              
              {settings?.socialLinks?.twitter && (
                <a
                  href={settings.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pop"
                >
                  X (Twitter)
                </a>
              )}
              
              {settings?.socialLinks?.instagram && (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pop"
                >
                  Instagram
                </a>
              )}
              
              {settings?.socialLinks?.youtube && (
                <a
                  href={settings.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pop"
                >
                  YouTube
            </a>
          )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
