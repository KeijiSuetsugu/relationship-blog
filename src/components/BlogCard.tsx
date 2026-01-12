import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { urlFor } from '@/sanity/lib/image'
import type { Post } from '@/sanity/lib/types'

interface BlogCardProps {
  post: Post
  featured?: boolean
  index?: number
}

export default function BlogCard({ post, featured = false, index = 0 }: BlogCardProps) {
  const formattedDate = post.publishedAt
    ? format(new Date(post.publishedAt), 'yyyy.MM.dd', { locale: ja })
    : null

  return (
    <article
      className="card animate-card-pop"
      style={{ animationDelay: `${0.1 + index * 0.1}s` }}
    >
      {/* サムネイル */}
      <Link
        href={`/blog/${post.slug.current}`}
        className="block relative overflow-hidden border-b-4 border-[var(--black)]"
        style={{ height: featured ? '300px' : '220px' }}
      >
        {post.mainImage ? (
            <Image
              src={urlFor(post.mainImage).width(800).height(500).url()}
              alt={post.mainImage.alt || post.title}
              fill
            className="object-cover transition-transform duration-300 hover:scale-110"
              sizes={featured ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'}
            />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-pink)] flex items-center justify-center">
            <span className="text-6xl">✦</span>
          </div>
        )}
        
        {/* カテゴリーバッジ */}
        {post.category && (
          <span className="category-label absolute top-4 left-4">
            {post.category.title}
          </span>
        )}
      </Link>

      {/* コンテンツ */}
      <div className="p-5">
        {/* 日付 */}
        {formattedDate && (
          <div className="inline-block bg-[var(--bg-color)] px-3 py-1 border-2 border-[var(--black)] text-xs font-bold mb-3">
            📅 {formattedDate}
          </div>
        )}

        {/* タイトル */}
        <h3
          className={`font-black leading-tight mb-3 hover:text-[var(--accent-pink)] transition-colors ${
            featured ? 'text-xl md:text-2xl' : 'text-lg'
          }`}
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <Link href={`/blog/${post.slug.current}`}>
            {post.title}
          </Link>
        </h3>

        {/* 抜粋 */}
        {post.excerpt && (
          <p className={`text-sm leading-relaxed mb-4 ${
            featured ? 'line-clamp-3' : 'line-clamp-2'
          }`}>
            {post.excerpt}
          </p>
        )}

        {/* タグ */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <Link
                key={tag.slug.current}
                href={`/blog/tag/${tag.slug.current}`}
                className="text-xs font-bold px-2 py-1 bg-[var(--accent-blue)] border-2 border-[var(--black)] hover:bg-[var(--accent-pink)] transition-colors"
              >
                #{tag.title}
              </Link>
            ))}
          </div>
        )}

        {/* 続きを読むボタン */}
        <Link
          href={`/blog/${post.slug.current}`}
          className="inline-block mt-4 px-4 py-2 bg-[var(--black)] text-[var(--white)] font-bold text-sm uppercase tracking-wider hover:bg-[var(--accent-pink)] hover:text-[var(--black)] transition-all border-2 border-[var(--black)]"
        >
          READ MORE →
        </Link>
      </div>
    </article>
  )
}
