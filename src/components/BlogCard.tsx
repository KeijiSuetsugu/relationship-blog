import Link from 'next/link'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

export interface Post {
  id: string
  title: string
  description?: string
  slug?: string
  created_at: string
  thumb_url?: string
  media_type?: string
}

interface BlogCardProps {
  post: Post
  featured?: boolean
  index?: number
}

export default function BlogCard({ post, featured = false, index = 0 }: BlogCardProps) {
  const formattedDate = post.created_at
    ? format(new Date(post.created_at), 'yyyy.MM.dd', { locale: ja })
    : null

  // スラッグがない場合はIDを使用
  const postLink = `/posts/${post.id}`

  return (
    <article
      className="card animate-card-pop"
      style={{ animationDelay: `${0.1 + index * 0.1}s` }}
    >
      {/* サムネイル */}
      <Link
        href={postLink}
        className="block relative overflow-hidden border-b-4 border-[var(--black)]"
        style={{ height: featured ? '300px' : '220px' }}
      >
        {post.thumb_url ? (
          <img
            src={post.thumb_url}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-pink)] flex items-center justify-center">
            <span className="text-6xl">✦</span>
          </div>
        )}

        {/* メディアタイプバッジ（カテゴリーの代わり） */}
        {post.media_type && (
          <span className="category-label absolute top-4 left-4">
            {post.media_type.toUpperCase()}
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
          className={`font-black leading-tight mb-3 hover:text-[var(--accent-pink)] transition-colors ${featured ? 'text-xl md:text-2xl' : 'text-lg'
            }`}
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <Link href={postLink}>
            {post.title}
          </Link>
        </h3>

        {/* 抜粋 */}
        {post.description && (
          <p className={`text-sm leading-relaxed mb-4 ${featured ? 'line-clamp-3' : 'line-clamp-2'
            }`}>
            {post.description}
          </p>
        )}

        {/* 続きを読むボタン */}
        <Link
          href={postLink}
          className="inline-block mt-4 px-4 py-2 bg-[var(--black)] text-[var(--white)] font-bold text-sm uppercase tracking-wider hover:bg-[var(--accent-pink)] hover:text-[var(--black)] transition-all border-2 border-[var(--black)]"
        >
          READ MORE →
        </Link>
      </div>
    </article>
  )
}
