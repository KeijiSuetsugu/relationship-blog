'use client'

import { PortableText, PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

interface ImageBlock {
  _type: 'image'
  _key: string
  asset: { _ref: string }
  alt?: string
  caption?: string
}

interface CodeBlock {
  _type: 'code'
  _key: string
  code: string
  language?: string
  filename?: string
}

// 見出しIDの生成
const generateId = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// テキストを抽出するヘルパー関数
const extractText = (children: unknown): string => {
  if (!children || !Array.isArray(children)) return ''
  return children
    .filter((child): child is { text?: string } => typeof child === 'object' && child !== null)
    .map((child) => child.text || '')
    .join('')
}

const components: PortableTextComponents = {
  block: {
    h2: ({ children, value }) => {
      const text = extractText(value?.children)
      const id = generateId(text)
      return (
        <h2 id={id} className="scroll-mt-24">
          {children}
        </h2>
      )
    },
    h3: ({ children, value }) => {
      const text = extractText(value?.children)
      const id = generateId(text)
      return (
        <h3 id={id} className="scroll-mt-24">
          {children}
        </h3>
      )
    },
    h4: ({ children }) => (
      <h4 className="text-lg font-bold mt-6 mb-3 text-[var(--color-dark)]">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote>{children}</blockquote>
    ),
    normal: ({ children }) => (
      <p>{children}</p>
    ),
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="px-1.5 py-0.5 bg-[var(--color-secondary)] rounded text-sm font-mono">
        {children}
      </code>
    ),
    underline: ({ children }) => (
      <span className="underline decoration-[var(--color-accent)] decoration-2 underline-offset-2">
        {children}
      </span>
    ),
    link: ({ value, children }) => {
      const href = value?.href || '#'
      const target = value?.blank ? '_blank' : undefined
      const rel = value?.blank ? 'noopener noreferrer' : undefined
      return (
        <a
          href={href}
          target={target}
          rel={rel}
          className="text-[var(--color-primary)] underline decoration-[var(--color-primary)]/30 hover:decoration-[var(--color-primary)] transition-colors"
        >
          {children}
        </a>
      )
    },
  },
  types: {
    image: ({ value }: { value: ImageBlock }) => {
      if (!value?.asset) return null
      return (
        <figure className="my-8">
          <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
            <Image
              src={urlFor(value.asset).width(1200).height(675).url()}
              alt={value.alt || ''}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
          {value.caption && (
            <figcaption className="text-center text-sm text-[var(--color-muted)] mt-3">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
    code: ({ value }: { value: CodeBlock }) => {
      return (
        <div className="my-6">
          {value.filename && (
            <div className="bg-[var(--color-dark)] text-white px-4 py-2 text-sm rounded-t-lg font-mono">
              {value.filename}
            </div>
          )}
          <pre className={`bg-[#1e1e1e] text-white p-4 overflow-x-auto ${value.filename ? 'rounded-b-lg' : 'rounded-lg'}`}>
            <code className="font-mono text-sm">{value.code}</code>
          </pre>
        </div>
      )
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-outside ml-6 mb-4 space-y-2">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-outside ml-6 mb-4 space-y-2">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="pl-1">{children}</li>,
    number: ({ children }) => <li className="pl-1">{children}</li>,
  },
}

interface PortableTextRendererProps {
  content: PortableTextBlock[]
}

export default function PortableTextRenderer({ content }: PortableTextRendererProps) {
  return (
    <div className="article-content">
      <PortableText value={content} components={components} />
    </div>
  )
}
