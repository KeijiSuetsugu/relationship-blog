import { Suspense } from 'react'
import { createClient } from '@supabase/supabase-js'
import BlogCard from '@/components/BlogCard'
import Pagination from '@/components/Pagination'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Search } from 'lucide-react'

// Supabase初期化
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export const metadata: Metadata = {
  title: 'Blog',
  description: '最新の記事一覧をご覧いただけます。',
}

const POSTS_PER_PAGE = 9

interface BlogPageProps {
  searchParams: Promise<{ page?: string; q?: string }>
}

async function getPosts(page: number, searchQuery?: string) {
  const start = (page - 1) * POSTS_PER_PAGE
  const end = start + POSTS_PER_PAGE - 1 // Supabase range is inclusive

  try {
    let query = supabase
      .from('posts')
      .select('*', { count: 'exact' })
      .eq('is_draft', false)
      .order('created_at', { ascending: false })
      .range(start, end)

    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
    }

    const { data: posts, count, error } = await query

    if (error) throw error

    return { posts: posts || [], total: count || 0 }
  } catch (error) {
    console.error('Error fetching posts:', error)
    return { posts: [], total: 0 }
  }
}

function BlogSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="card animate-pulse">
          <div className="aspect-[16/10] bg-[var(--color-surface-light)]" />
          <div className="p-6">
            <div className="h-3 bg-[var(--color-surface-light)] rounded w-1/4 mb-4" />
            <div className="h-5 bg-[var(--color-surface-light)] rounded w-3/4 mb-3" />
            <div className="h-4 bg-[var(--color-surface-light)] rounded w-full mb-2" />
            <div className="h-4 bg-[var(--color-surface-light)] rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

async function BlogContent({ page, searchQuery }: { page: number; searchQuery?: string }) {
  const { posts, total } = await getPosts(page, searchQuery)
  const totalPages = Math.ceil(total / POSTS_PER_PAGE)

  if (posts.length === 0) {
    return (
      <div className="text-center py-24">
        <span className="text-6xl opacity-20">✦</span>
        <h3 className="text-xl font-semibold mt-6 mb-3 text-[var(--color-light)]">
          {searchQuery ? 'No results found' : 'No articles yet'}
        </h3>
        <p className="text-[var(--color-muted)]">
          {searchQuery
            ? '別のキーワードで検索してみてください。'
            : 'まだ記事が投稿されていません。'}
        </p>
      </div>
    )
  }

  return (
    <>
      {searchQuery && (
        <div className="mb-10 p-5 rounded-2xl border border-[var(--color-primary)]/20 bg-[var(--color-surface)]">
          <p className="text-[var(--color-muted)]">
            「<span className="font-semibold text-[var(--color-light)]">{searchQuery}</span>」の検索結果:
            <span className="font-semibold text-[var(--color-primary)] ml-2">{total}件</span>
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, index) => (
          <div
            key={post.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <BlogCard post={post} />
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-16">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath={searchQuery ? `/blog?q=${searchQuery}` : '/blog'}
          />
        </div>
      )}
    </>
  )
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { page: pageParam, q: searchQuery } = await searchParams
  const page = Math.max(1, parseInt(pageParam || '1', 10))

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* ヘッダー */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs tracking-[0.3em] uppercase text-[var(--color-primary)] mb-4">Blog</span>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Articles
          </h1>
          <div className="mx-auto w-24 h-px bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent mb-10" />

          {/* 検索フォーム */}
          <form action="/blog" method="GET" className="max-w-xl mx-auto">
            <div className="relative">
              <input
                type="search"
                name="q"
                defaultValue={searchQuery}
                placeholder="Search articles..."
                className="w-full px-6 py-4 pl-14 bg-[var(--color-surface)] border border-[var(--color-primary)]/20 rounded-2xl text-[var(--color-light)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-primary)]/50 focus:shadow-[0_0_30px_rgba(212,175,55,0.1)] transition-all"
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-muted)]" />
            </div>
          </form>
        </div>

        {/* メインコンテンツ */}
        <div className="grid lg:grid-cols-1 gap-12">
          {/* サイドバーは一時的に無効化（カテゴリー・タグ機能未実装のため） */}
          <div className="lg:col-span-1">
            <Suspense fallback={<BlogSkeleton />}>
              <BlogContent page={page} searchQuery={searchQuery} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
