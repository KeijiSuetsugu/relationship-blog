import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, Clock, ArrowLeft, Tag, User } from 'lucide-react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { client, isSanityConfigured } from '@/sanity/lib/client'
import { postQuery, relatedPostsQuery, allPostSlugsQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import PortableTextRenderer from '@/components/PortableTextRenderer'
import TableOfContents from '@/components/TableOfContents'
import ShareButtons from '@/components/ShareButtons'
import BlogCard from '@/components/BlogCard'
import type { Post } from '@/sanity/lib/types'
import type { Metadata } from 'next'

interface PostPageProps {
  params: Promise<{ slug: string }>
}

async function getPost(slug: string) {
  if (!isSanityConfigured) return null
  
  try {
    const post = await client.fetch<Post>(postQuery, { postSlug: slug })
    return post
  } catch {
    return null
  }
}

async function getRelatedPosts(slug: string, categoryId?: string, tagIds?: string[]) {
  if (!isSanityConfigured) return []
  if (!categoryId && (!tagIds || tagIds.length === 0)) return []
  
  try {
    const posts = await client.fetch<Post[]>(relatedPostsQuery, {
      postSlug: slug,
      catId: categoryId || '',
      tagIdList: tagIds || [],
    })
    return posts
  } catch {
    return []
  }
}

export async function generateStaticParams() {
  if (!isSanityConfigured) return []
  
  try {
    const slugs = await client.fetch<string[]>(allPostSlugsQuery)
    return slugs.map((slug) => ({ slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    return {
      title: '記事が見つかりません',
    }
  }

  const title = post.seo?.metaTitle || post.title
  const description = post.seo?.metaDescription || post.excerpt || ''
  const imageUrl = post.seo?.ogImage 
    ? urlFor(post.seo.ogImage).width(1200).height(630).url()
    : post.mainImage 
    ? urlFor(post.mainImage).width(1200).height(630).url()
    : undefined

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  const categoryId = post.category?._id
  const tagIds = post.tags?.map(tag => tag._id).filter((id): id is string => !!id)
  const relatedPosts = await getRelatedPosts(slug, categoryId, tagIds)

  const publishedDate = post.publishedAt
    ? format(new Date(post.publishedAt), 'yyyy.MM.dd', { locale: ja })
    : null
  const updatedDate = post.updatedAt
    ? format(new Date(post.updatedAt), 'yyyy.MM.dd', { locale: ja })
    : null

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  const postUrl = `${siteUrl}/blog/${post.slug.current}`

  // 構造化データ
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.mainImage ? urlFor(post.mainImage).width(1200).height(630).url() : undefined,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: post.author ? {
      '@type': 'Person',
      name: post.author.name,
    } : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'Ennek',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* パンくずリスト */}
          <nav className="mb-12">
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-2 text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Blog</span>
            </Link>
          </nav>

          {/* ヘッダー */}
          <header className="mb-12">
            {/* カテゴリー */}
            {post.category && (
              <Link
                href={`/blog/category/${post.category.slug.current}`}
                className="inline-block px-4 py-1.5 text-xs font-medium tracking-wider uppercase rounded-full mb-6 border"
                style={{ 
                  color: post.category.color || 'var(--color-primary)',
                  borderColor: `${post.category.color || 'var(--color-primary)'}40`,
                  backgroundColor: `${post.category.color || 'var(--color-primary)'}10`
                }}
              >
                {post.category.title}
              </Link>
            )}

            {/* タイトル */}
            <h1 
              className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-8 leading-tight text-[var(--color-light)]"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {post.title}
            </h1>

            {/* メタ情報 */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-[var(--color-muted)]">
              {publishedDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[var(--color-primary)]" />
                  <time dateTime={post.publishedAt}>{publishedDate}</time>
                </div>
              )}
              {updatedDate && updatedDate !== publishedDate && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[var(--color-primary)]" />
                  <span>Updated {updatedDate}</span>
                </div>
              )}
              {post.author && (
                <div className="flex items-center gap-2">
                  {post.author.image ? (
                    <Image
                      src={urlFor(post.author.image).width(32).height(32).url()}
                      alt={post.author.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  ) : (
                    <User className="w-4 h-4 text-[var(--color-primary)]" />
                  )}
                  <span>{post.author.name}</span>
                </div>
              )}
            </div>
          </header>

          {/* メイン画像 */}
          {post.mainImage && (
            <figure className="mb-12">
              <div className="relative aspect-video rounded-3xl overflow-hidden border border-[var(--color-primary)]/10">
                <Image
                  src={urlFor(post.mainImage).width(1200).height(675).url()}
                  alt={post.mainImage.alt || post.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 800px"
                />
                {/* オーバーレイ */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark)]/20 to-transparent" />
              </div>
            </figure>
          )}

          {/* 目次 */}
          {post.body && (
            <div className="mb-12">
              <TableOfContents content={post.body} />
            </div>
          )}

          {/* 本文 */}
          {post.body && (
            <div className="mb-16">
              <PortableTextRenderer content={post.body} />
            </div>
          )}

          {/* タグ */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-4 mb-10 pb-10 border-b border-[var(--color-primary)]/10">
              <Tag className="w-4 h-4 text-[var(--color-muted)]" />
              {post.tags.map((tag) => (
                <Link
                  key={tag.slug.current}
                  href={`/blog/tag/${tag.slug.current}`}
                  className="tag"
                >
                  #{tag.title}
                </Link>
              ))}
            </div>
          )}

          {/* シェアボタン */}
          <div className="mb-16">
            <ShareButtons url={postUrl} title={post.title} />
          </div>

          {/* 著者情報 */}
          {post.author && (
            <div className="card p-8 md:p-10">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {post.author.image && (
                  <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border-2 border-[var(--color-primary)]/20">
                    <Image
                      src={urlFor(post.author.image).width(160).height(160).url()}
                      alt={post.author.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="text-center sm:text-left">
                  <span className="text-xs text-[var(--color-primary)] tracking-widest uppercase">Author</span>
                  <h3 
                    className="text-xl font-semibold mt-1 mb-3 text-[var(--color-light)]"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {post.author.name}
                  </h3>
                  {post.author.bio && (
                    <p className="text-[var(--color-muted)] text-sm leading-relaxed">
                      {post.author.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </article>

      {/* 関連記事 */}
      {relatedPosts.length > 0 && (
        <section className="py-20 md:py-28 border-t border-[var(--color-primary)]/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <span className="inline-block text-xs tracking-[0.3em] uppercase text-[var(--color-primary)] mb-4">Related</span>
              <h2 
                className="text-2xl md:text-3xl font-semibold"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                More Articles
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedPosts.map((relatedPost) => (
                <BlogCard key={relatedPost._id} post={relatedPost} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
