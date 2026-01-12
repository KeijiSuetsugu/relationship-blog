import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { client, isSanityConfigured } from '@/sanity/lib/client'
import { categoryQuery, postsByCategoryQuery, allCategorySlugsQuery } from '@/sanity/lib/queries'
import BlogCard from '@/components/BlogCard'
import type { Post, Category } from '@/sanity/lib/types'
import type { Metadata } from 'next'

interface CategoryPageProps {
  params: Promise<{ category: string }>
}

async function getCategory(slug: string) {
  if (!isSanityConfigured) return null
  
  try {
    const category = await client.fetch<Category>(categoryQuery, { categorySlug: slug })
    return category
  } catch {
    return null
  }
}

async function getPostsByCategory(category: string) {
  if (!isSanityConfigured) return []
  
  try {
    const posts = await client.fetch<Post[]>(postsByCategoryQuery, { categorySlug: category })
    return posts
  } catch {
    return []
  }
}

export async function generateStaticParams() {
  if (!isSanityConfigured) return []
  
  try {
    const slugs = await client.fetch<string[]>(allCategorySlugsQuery)
    return slugs.map((category) => ({ category }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params
  const category = await getCategory(categorySlug)

  if (!category) {
    return {
      title: 'Category not found',
    }
  }

  return {
    title: `${category.title}`,
    description: category.description || `${category.title}カテゴリーの記事一覧です。`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params
  const [category, posts] = await Promise.all([
    getCategory(categorySlug),
    getPostsByCategory(categorySlug),
  ])

  if (!category) {
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
          <span 
            className="inline-block px-4 py-1.5 text-xs font-medium tracking-wider uppercase rounded-full mb-6 border"
            style={{ 
              color: category.color || 'var(--color-primary)',
              borderColor: `${category.color || 'var(--color-primary)'}40`,
              backgroundColor: `${category.color || 'var(--color-primary)'}10`
            }}
          >
            Category
          </span>
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {category.title}
          </h1>
          {category.description && (
            <p className="text-[var(--color-muted)] max-w-2xl mx-auto">
              {category.description}
            </p>
          )}
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
              このカテゴリーにはまだ記事が投稿されていません。
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
