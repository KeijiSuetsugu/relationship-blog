import { getPostData, getAllPostSlugs } from '@/lib/posts';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const paths = getAllPostSlugs();
  return paths.map((path) => path.params);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostData(slug);
  return {
    title: `${post.title} | Ennek Lab`,
    description: post.title,
  };
}

export default async function Post({ params }: Props) {
  const { slug } = await params;
  const post = await getPostData(slug);

  return (
    <div className="min-h-screen">
      {/* ヘッダー */}
      <header className="border-b border-[var(--color-secondary)] bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent">
            Ennek Lab
          </Link>
          <Link href="/" className="flex items-center text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            記事一覧に戻る
          </Link>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <article className="max-w-3xl mx-auto">
          {/* アイキャッチ画像 */}
          {post.image && (
            <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8 shadow-lg opacity-0 animate-fade-in-up">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          )}

          {/* 記事ヘッダー */}
          <header className="mb-12 opacity-0 animate-fade-in-up animate-delay-100">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <time className="text-[var(--color-muted)]">
                {format(new Date(post.date), 'yyyy年M月d日（E）', { locale: ja })}
              </time>
              <span className="tag">{post.theme}</span>
              <span className="text-sm text-[var(--color-muted)]">
                {post.charCount.toLocaleString()}文字
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-6">
              {post.title}
            </h1>
            
            {/* 写真クレジット */}
            {post.photographer && (
              <p className="text-sm text-[var(--color-muted)]">
                📷 Photo by{' '}
                <a 
                  href={post.photoLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:text-[var(--color-primary)]"
                >
                  {post.photographer}
                </a>
                {' '}on Unsplash
              </p>
            )}
          </header>

          {/* 記事本文 */}
          <div 
            className="article-content opacity-0 animate-fade-in-up animate-delay-200"
            dangerouslySetInnerHTML={{ __html: post.contentHtml || '' }} 
          />

          {/* シェアボタン */}
          <div className="mt-16 pt-8 border-t border-[var(--color-secondary)]">
            <p className="text-center text-[var(--color-muted)] mb-4">この記事が役に立ったら、シェアしてください</p>
            <div className="flex justify-center gap-4">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://yourdomain.com/posts/${slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://yourdomain.com/posts/${slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href={`https://line.me/R/msg/text/?${encodeURIComponent(post.title + ' https://yourdomain.com/posts/' + slug)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-[#00B900] text-white flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                </svg>
              </a>
            </div>
          </div>

          {/* 戻るボタン */}
          <div className="mt-12 text-center">
            <Link href="/" className="btn-primary">
              記事一覧に戻る
            </Link>
          </div>
        </article>
      </main>

      {/* フッター */}
      <footer className="border-t border-[var(--color-secondary)] mt-20 py-12 bg-white/50">
        <div className="container mx-auto px-4 text-center">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent">
            Ennek Lab
          </Link>
          <p className="text-sm text-[var(--color-muted)] mt-4">
            あなたの「毎日」が、少しずつ良い方に変わっていく
          </p>
          <p className="text-xs text-[var(--color-muted)] mt-4">
            © {new Date().getFullYear()} Ennek Lab. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

