import Link from 'next/link';
import Image from 'next/image';
import { getSortedPostsData, PostData } from '@/lib/posts';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

function PostCard({ post, index }: { post: PostData; index: number }) {
  return (
    <article 
      className={`card opacity-0 animate-fade-in-up`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <Link href={`/posts/${post.slug}`}>
        {post.image ? (
          <div className="relative h-52 overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        ) : (
          <div className="h-52 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center">
            <svg className="w-16 h-16 text-white/30" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
        )}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <time className="text-sm text-[var(--color-muted)]">
              {format(new Date(post.date), 'yyyy年M月d日', { locale: ja })}
            </time>
            <span className="tag">{post.theme.slice(0, 15)}...</span>
          </div>
          <h2 className="text-xl font-bold mb-3 line-clamp-2 hover:text-[var(--color-primary)] transition-colors">
            {post.title}
          </h2>
          <p className="text-[var(--color-muted)] text-sm line-clamp-3">
            {post.excerpt}
          </p>
          <div className="mt-4 flex items-center text-[var(--color-primary)] font-medium">
            <span>続きを読む</span>
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default function Home() {
  const posts = getSortedPostsData();

  return (
    <div className="min-h-screen">
      {/* ヒーローセクション */}
      <header className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 via-transparent to-[var(--color-accent)]/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 opacity-0 animate-fade-in-up">
              <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent">
                人間関係の
              </span>
              <br />
              <span className="text-[var(--color-dark)]">ヒントを見つける</span>
            </h1>
            <p className="text-lg md:text-xl text-[var(--color-muted)] mb-8 opacity-0 animate-fade-in-up animate-delay-100">
              毎日更新される、科学的根拠に基づいた<br className="hidden md:block" />
              人間関係改善のためのアドバイス
            </p>
            <div className="flex flex-wrap justify-center gap-4 opacity-0 animate-fade-in-up animate-delay-200">
              <span className="tag">コミュニケーション</span>
              <span className="tag">ストレス対処</span>
              <span className="tag">マインドフルネス</span>
              <span className="tag">自己肯定感</span>
            </div>
          </div>
        </div>
        
        {/* 装飾要素 */}
        <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-[var(--color-primary)]/5 blur-xl" />
        <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-[var(--color-accent)]/5 blur-xl" />
      </header>

      {/* 記事一覧 */}
      <main className="container mx-auto px-4 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-accent)]/10 flex items-center justify-center">
              <svg className="w-12 h-12 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-[var(--color-dark)]">まもなく記事が追加されます</h2>
            <p className="text-[var(--color-muted)]">毎日自動で新しい記事が投稿されます。<br />お楽しみに！</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              <span className="relative">
                最新の記事
                <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent" />
              </span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <PostCard key={post.slug} post={post} index={index} />
              ))}
            </div>
          </>
        )}
      </main>

      {/* フッター */}
      <footer className="border-t border-[var(--color-secondary)] mt-20 py-12 bg-white/50">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6">
            <span className="text-2xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent">
              Ennek Lab
            </span>
          </div>
          <p className="text-sm text-[var(--color-muted)] mb-4">
            あなたの「毎日」が、少しずつ良い方に変わっていく
          </p>
          <p className="text-xs text-[var(--color-muted)]">
            © {new Date().getFullYear()} Ennek Lab. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
