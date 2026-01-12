'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

interface HeaderProps {
  siteTitle?: string
}

export default function Header({ siteTitle = 'Ennek' }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { href: '/', label: 'HOME' },
    { href: '/blog', label: 'BLOG' },
    { href: '/#about', label: 'ABOUT' },
    { href: '/#contact', label: 'CONTACT' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--white)] border-b-4 border-[var(--black)]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* ロゴ */}
          <Link 
            href="/" 
            className="group"
          >
            <span 
              className="text-2xl md:text-3xl font-black uppercase tracking-tight"
              style={{ 
                fontFamily: 'var(--font-display)',
                textShadow: '3px 3px 0 var(--accent-pink)'
              }}
            >
              {siteTitle}
            </span>
          </Link>

          {/* デスクトップナビゲーション */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 font-bold text-sm tracking-wider border-2 border-transparent hover:border-[var(--black)] hover:bg-[var(--accent-blue)] transition-all duration-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* モバイルメニューボタン */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 border-2 border-[var(--black)] hover:bg-[var(--accent-pink)] transition-colors"
              aria-label={isMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
            >
              {isMenuOpen ? (
              <X className="w-6 h-6" />
              ) : (
              <Menu className="w-6 h-6" />
              )}
            </button>
        </div>

        {/* モバイルメニュー */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4">
            <div className="border-2 border-[var(--black)] bg-[var(--white)] shadow-[4px_4px_0_var(--black)]">
              {navItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-6 py-4 font-bold text-sm tracking-wider hover:bg-[var(--accent-blue)] transition-colors ${
                    index !== navItems.length - 1 ? 'border-b-2 border-[var(--black)]' : ''
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
