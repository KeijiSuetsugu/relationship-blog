import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
}

export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages: (number | 'ellipsis')[] = []
  
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, 'ellipsis', totalPages)
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
    } else {
      pages.push(1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages)
    }
  }

  const getPageUrl = (page: number) => {
    if (page === 1) return basePath
    return `${basePath}?page=${page}`
  }

  return (
    <nav aria-label="ページネーション" className="flex justify-center">
      <ul className="flex items-center gap-2">
        {/* 前へ */}
        <li>
          {currentPage > 1 ? (
            <Link
              href={getPageUrl(currentPage - 1)}
              className="flex items-center justify-center w-11 h-11 rounded-full border border-[var(--color-primary)]/20 text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-primary)]/5 transition-all duration-300"
              aria-label="前のページ"
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>
          ) : (
            <span className="flex items-center justify-center w-11 h-11 rounded-full border border-[var(--color-primary)]/10 text-[var(--color-muted)]/30 cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" />
            </span>
          )}
        </li>

        {/* ページ番号 */}
        {pages.map((page, index) => (
          <li key={index}>
            {page === 'ellipsis' ? (
              <span className="flex items-center justify-center w-11 h-11 text-[var(--color-muted)]/50">
                …
              </span>
            ) : (
              <Link
                href={getPageUrl(page)}
                className={`flex items-center justify-center w-11 h-11 rounded-full font-medium text-sm transition-all duration-300 ${
                  page === currentPage
                    ? 'bg-[var(--color-primary)] text-[var(--color-dark)]'
                    : 'border border-[var(--color-primary)]/20 text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-primary)]/5'
                }`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </Link>
            )}
          </li>
        ))}

        {/* 次へ */}
        <li>
          {currentPage < totalPages ? (
            <Link
              href={getPageUrl(currentPage + 1)}
              className="flex items-center justify-center w-11 h-11 rounded-full border border-[var(--color-primary)]/20 text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-primary)]/5 transition-all duration-300"
              aria-label="次のページ"
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <span className="flex items-center justify-center w-11 h-11 rounded-full border border-[var(--color-primary)]/10 text-[var(--color-muted)]/30 cursor-not-allowed">
              <ChevronRight className="w-4 h-4" />
            </span>
          )}
        </li>
      </ul>
    </nav>
  )
}
