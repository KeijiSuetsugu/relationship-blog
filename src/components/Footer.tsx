import Link from 'next/link'
import { Twitter, Instagram, Youtube, Facebook } from 'lucide-react'
import type { SocialLinks } from '@/sanity/lib/types'

interface FooterProps {
  siteTitle?: string
  footerText?: string
  socialLinks?: SocialLinks
}

const ThreadsIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.182.408-2.256 1.332-3.023.88-.73 2.132-1.13 3.628-1.154 1.135-.018 2.17.084 3.098.305-.036-1.029-.235-1.812-.602-2.34-.464-.666-1.227-1.005-2.27-1.005h-.063c-.769.008-1.408.229-1.903.66l-1.39-1.612c.829-.714 1.907-1.096 3.212-1.137h.092c1.678 0 2.99.538 3.9 1.6.755.88 1.163 2.088 1.216 3.595.382.17.73.368 1.043.595 1.273.926 2.153 2.319 2.475 3.917.403 2.007.038 4.267-1.456 5.792-1.905 1.946-4.376 2.86-7.78 2.877zm-.893-5.977c.056.001.11.001.165.001 1.725 0 2.96-.967 2.96-2.313 0-1.072-.753-1.906-2.124-2.085-.283-.037-.586-.052-.909-.045-.985.017-1.752.232-2.28.642-.482.374-.718.861-.684 1.41.036.585.373 1.084.949 1.406.508.283 1.168.433 1.922.433v.551z" />
  </svg>
)

export default function Footer({ siteTitle = 'Ennek', footerText, socialLinks }: FooterProps) {
  const currentYear = new Date().getFullYear()

  const socialIcons = [
    { key: 'twitter', Icon: Twitter, label: 'X (Twitter)' },
    { key: 'instagram', Icon: Instagram, label: 'Instagram' },
    { key: 'youtube', Icon: Youtube, label: 'YouTube' },
    { key: 'threads', Icon: ThreadsIcon, label: 'Threads' },
    { key: 'facebook', Icon: Facebook, label: 'Facebook' },
  ]

  const footerLinks = [
    { href: '/', label: 'HOME' },
    { href: '/blog', label: 'BLOG' },
    { href: '/#about', label: 'ABOUT' },
    { href: '/#contact', label: 'CONTACT' },
  ]

  return (
    <footer className="bg-[var(--black)] text-[var(--white)] border-t-4 border-[var(--black)]">
      {/* リンクエリア（ピンク背景） */}
      <div className="bg-[var(--accent-pink)] border-b-4 border-[var(--black)] py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 
            className="text-2xl md:text-3xl font-black uppercase mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Let&apos;s Connect!
          </h2>
          
          {/* SNSリンク */}
          <div className="flex justify-center gap-3 flex-wrap">
            {socialIcons.map(({ key, Icon, label }) => {
              const url = socialLinks?.[key as keyof SocialLinks]
              if (!url) return null
              return (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pop flex items-center gap-2 text-sm"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{label}</span>
                </a>
              )
            })}
          </div>
        </div>
      </div>
      
      {/* メインフッター */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* ブランドセクション */}
          <div>
            <Link 
              href="/" 
              className="inline-block mb-4"
            >
              <span 
                className="text-3xl font-black uppercase"
                style={{ 
                  fontFamily: 'var(--font-display)',
                  textShadow: '3px 3px 0 var(--accent-pink)'
                }}
              >
                {siteTitle}
              </span>
            </Link>
            {footerText && (
              <p className="text-gray-400 text-sm leading-relaxed">
                {footerText}
              </p>
            )}
          </div>

          {/* ナビゲーション */}
          <div>
            <h3 
              className="text-lg font-black uppercase mb-4 inline-block px-3 py-1 bg-[var(--accent-blue)] text-[var(--black)] border-2 border-[var(--white)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Navigation
            </h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-[var(--accent-pink)] transition-colors font-bold text-sm"
                  >
                    → {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* お問い合わせ */}
          <div>
            <h3 
              className="text-lg font-black uppercase mb-4 inline-block px-3 py-1 bg-[var(--accent-pink)] text-[var(--black)] border-2 border-[var(--white)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Contact
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              お仕事のご依頼やご質問など、<br/>
              お気軽にお問い合わせください。
            </p>
          </div>
        </div>
      </div>

      {/* コピーライト */}
      <div className="border-t-2 border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <p className="text-center text-gray-500 text-sm font-bold">
            © {currentYear} {siteTitle}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
