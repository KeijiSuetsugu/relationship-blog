import type { PortableTextBlock } from '@portabletext/types'

export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
  caption?: string
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
}

export interface Author {
  name: string
  slug: { current: string }
  image?: SanityImage
  bio?: string
  socialLinks?: SocialLinks
}

export interface Category {
  _id?: string
  title: string
  slug: { current: string }
  description?: string
  color?: string
  postCount?: number
}

export interface Tag {
  _id?: string
  title: string
  slug: { current: string }
  postCount?: number
}

export interface Post {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  mainImage?: SanityImage
  body?: PortableTextBlock[]
  publishedAt?: string
  updatedAt?: string
  author?: Author
  category?: Category
  tags?: Tag[]
  seo?: SEO
  featured?: boolean
}

export interface SEO {
  metaTitle?: string
  metaDescription?: string
  ogImage?: SanityImage
}

export interface SocialLinks {
  twitter?: string
  instagram?: string
  youtube?: string
  threads?: string
  facebook?: string
  tiktok?: string
}

export interface Achievement {
  year: string
  title: string
  description?: string
}

export interface SiteSettings {
  title: string
  description?: string
  logo?: SanityImage
  heroImage?: SanityImage
  heroTagline?: string
  heroSubtitle?: string
  aboutTitle?: string
  aboutContent?: PortableTextBlock[]
  profileImage?: SanityImage
  achievements?: Achievement[]
  socialLinks?: SocialLinks
  contactEmail?: string
  contactInfo?: string
  footerText?: string
  googleAnalyticsId?: string
}

