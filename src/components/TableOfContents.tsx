'use client'

import { useEffect, useState } from 'react'
import { List } from 'lucide-react'
import type { PortableTextBlock } from '@portabletext/types'

interface TOCItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: PortableTextBlock[]
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')

  // 見出しを抽出
  const headings: TOCItem[] = content
    .filter(
      (block) =>
        block._type === 'block' &&
        (block.style === 'h2' || block.style === 'h3')
    )
    .map((block) => {
      const textBlock = block as PortableTextBlock & { children?: { text?: string }[] }
      const text = textBlock.children
        ?.map((child) => child.text)
        .join('') || ''
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]+/g, '-')
        .replace(/(^-|-$)/g, '')
      return {
        id,
        text,
        level: block.style === 'h2' ? 2 : 3,
      }
    })

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-100px 0px -80% 0px' }
    )

    headings.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) {
    return null
  }

  return (
    <nav className="card p-6 md:p-8">
      <h2 
        className="text-sm font-semibold tracking-widest uppercase text-[var(--color-primary)] mb-6 flex items-center gap-3"
      >
        <List className="w-4 h-4" />
        Contents
      </h2>
      <ul className="space-y-1">
        {headings.map(({ id, text, level }) => (
          <li
            key={id}
            className={level === 3 ? 'ml-4' : ''}
          >
            <a
              href={`#${id}`}
              className={`block py-2 px-4 text-sm rounded-lg transition-all duration-300 ${
                activeId === id
                  ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-l-2 border-[var(--color-primary)]'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-light)] hover:bg-[var(--color-surface-light)]'
              }`}
              onClick={(e) => {
                e.preventDefault()
                const element = document.getElementById(id)
                if (element) {
                  const headerOffset = 120
                  const elementPosition = element.getBoundingClientRect().top
                  const offsetPosition = elementPosition + window.scrollY - headerOffset
                  window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth',
                  })
                }
              }}
            >
              {level === 3 && <span className="mr-2 text-[var(--color-primary)]/50">—</span>}
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
