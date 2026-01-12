import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Hash } from 'lucide-react'
import { client, isSanityConfigured } from '@/sanity/lib/client'
import { tagQuery, postsByTagQuery, allTagSlugsQuery } from '@/sanity/lib/queries'
import BlogCard from '@/components/BlogCard'
import type { Post, Tag } from '@/sanity/lib/types'
import type { Metadata } from 'next'

interface TagPageProps {
  params: Promise<{ tag: string }>
}

async function getTag(slug: string) {
  if (!isSanityConfigured) return null
  
  try {
    const tag = await client.fetch<Tag>(tagQuery, { tagSlug: slug })
    return tag
  } catch {
    return null
  }
}

async function getPostsByTag(tag: string) {
  if (!isSanityConfigured) return []
  
  try {
    const posts = await client.fetch<Post[]>(postsByTagQuery, { tagSlug: tag })
    return posts
  } catch {
    return []
  }
}

export async function generateStaticParams() {
  if (!isSanityConfigured) return []
  
  try {
    const slugs = await client.fetch<string[]>(allTagSlugsQuery)
    return slugs.map((tag) => ({ tag }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag: tagSlug } = await params
  const tag = await getTag(tagSlug)

  if (!tag) {
    return {
      title: 'Tag not found',
    }
  }

  return {
    title: `#${tag.title}`,
    description: `#${tag.title}タグが付いた記事の一覧です。`,
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag: tagSlug } = await params
  const [tag, posts] = await Promise.all([
    getTag(tagSlug),
    getPostsByTag(tagSlug),
  ])

  if (!tag) {
    notFound()
  }

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
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
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-medium tracking-wider uppercase rounded-full mb-6 border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 text-[var(--color-primary)]">
            <Hash className="w-3.5 h-3.5" />
            Tag
          </span>
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            #{tag.title}
          </h1>
          <p className="text-[var(--color-muted)]">
            {posts.length} articles
          </p>
          <div className="mt-8 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent" />
        </div>

        {/* 記事一覧 */}
        {posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <div 
                key={post._id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <BlogCard post={post} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <span className="text-6xl opacity-20">✦</span>
            <h3 className="text-xl font-semibold mt-6 mb-3 text-[var(--color-light)]">
              No articles yet
            </h3>
            <p className="text-[var(--color-muted)]">
              このタグにはまだ記事が投稿されていません。
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
