import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-20">
      <div className="text-center px-4">
        {/* 装飾 */}
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-[var(--color-primary)]/10 blur-3xl rounded-full" />
          <span className="relative text-[150px] md:text-[200px] font-bold gradient-text leading-none" style={{ fontFamily: 'var(--font-display)' }}>
            404
          </span>
        </div>
        
        <h1 
          className="text-2xl md:text-3xl font-semibold mb-4 text-[var(--color-light)]"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Page Not Found
        </h1>
        <p className="text-[var(--color-muted)] mb-10 max-w-md mx-auto">
          お探しのページは存在しないか、移動または削除された可能性があります。
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/" 
            className="btn-primary inline-flex items-center justify-center gap-3"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <Link 
            href="/blog" 
            className="px-8 py-3.5 border border-[var(--color-primary)]/30 text-[var(--color-light)] rounded-full font-medium hover:bg-[var(--color-primary)]/10 hover:border-[var(--color-primary)]/50 transition-all duration-300 inline-flex items-center justify-center gap-3"
          >
            <ArrowLeft className="w-4 h-4" />
            View Blog
          </Link>
        </div>
      </div>
    </div>
  )
}
