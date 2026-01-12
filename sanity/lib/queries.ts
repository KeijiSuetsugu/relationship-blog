import { groq } from 'next-sanity'

// サイト設定
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    title,
    description,
    logo,
    heroImage,
    heroTagline,
    heroSubtitle,
    aboutTitle,
    aboutContent,
    profileImage,
    achievements,
    socialLinks,
    contactEmail,
    contactInfo,
    footerText,
    googleAnalyticsId
  }
`

// 全記事取得（一覧用）
export const postsQuery = groq`
  *[_type == "post" && status == "published"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    "category": category->{
      title,
      slug,
      color
    },
    "tags": tags[]->{
      title,
      slug
    }
  }
`

// ページネーション付き記事取得
export const paginatedPostsQuery = groq`
  *[_type == "post" && status == "published"] | order(publishedAt desc) [$start...$end] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    "category": category->{
      title,
      slug,
      color
    },
    "tags": tags[]->{
      title,
      slug
    }
  }
`

// 記事総数取得
export const postsCountQuery = groq`
  count(*[_type == "post" && status == "published"])
`

// 個別記事取得
export const postQuery = groq`
  *[_type == "post" && slug.current == $postSlug && status == "published"][0] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    body,
    publishedAt,
    updatedAt,
    "author": author->{
      name,
      slug,
      image,
      bio,
      socialLinks
    },
    "category": category->{
      _id,
      title,
      slug,
      color
    },
    "tags": tags[]->{
      _id,
      title,
      slug
    },
    seo
  }
`

// 関連記事取得
export const relatedPostsQuery = groq`
  *[_type == "post" && status == "published" && slug.current != $postSlug && (
    category._ref == $catId || 
    count((tags[]._ref)[@ in $tagIdList]) > 0
  )] | order(publishedAt desc) [0...4] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    "category": category->{
      title,
      slug,
      color
    }
  }
`

// 最新記事取得（トップページ用）
export const latestPostsQuery = groq`
  *[_type == "post" && status == "published"] | order(publishedAt desc) [0...5] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    "category": category->{
      title,
      slug,
      color
    },
    "tags": tags[]->{
      title,
      slug
    }
  }
`

// 注目記事取得
export const featuredPostsQuery = groq`
  *[_type == "post" && status == "published" && featured == true] | order(publishedAt desc) [0...3] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    "category": category->{
      title,
      slug,
      color
    }
  }
`

// カテゴリー別記事取得
export const postsByCategoryQuery = groq`
  *[_type == "post" && status == "published" && category->slug.current == $categorySlug] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    "category": category->{
      title,
      slug,
      color
    },
    "tags": tags[]->{
      title,
      slug
    }
  }
`

// タグ別記事取得
export const postsByTagQuery = groq`
  *[_type == "post" && status == "published" && $tagSlug in tags[]->slug.current] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    "category": category->{
      title,
      slug,
      color
    },
    "tags": tags[]->{
      title,
      slug
    }
  }
`

// カテゴリー取得
export const categoryQuery = groq`
  *[_type == "category" && slug.current == $categorySlug][0] {
    _id,
    title,
    slug,
    description,
    color
  }
`

// 全カテゴリー取得
export const categoriesQuery = groq`
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    color,
    "postCount": count(*[_type == "post" && status == "published" && references(^._id)])
  }
`

// タグ取得
export const tagQuery = groq`
  *[_type == "tag" && slug.current == $tagSlug][0] {
    _id,
    title,
    slug
  }
`

// 全タグ取得
export const tagsQuery = groq`
  *[_type == "tag"] | order(title asc) {
    _id,
    title,
    slug,
    "postCount": count(*[_type == "post" && status == "published" && references(^._id)])
  }
`

// 検索クエリ
export const searchPostsQuery = groq`
  *[_type == "post" && status == "published" && (
    title match $searchTerm + "*" ||
    excerpt match $searchTerm + "*" ||
    pt::text(body) match $searchTerm + "*"
  )] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    "category": category->{
      title,
      slug,
      color
    }
  }
`

// 全記事スラッグ取得（SSG用）
export const allPostSlugsQuery = groq`
  *[_type == "post" && status == "published"].slug.current
`

// 全カテゴリースラッグ取得（SSG用）
export const allCategorySlugsQuery = groq`
  *[_type == "category"].slug.current
`

// 全タグスラッグ取得（SSG用）
export const allTagSlugsQuery = groq`
  *[_type == "tag"].slug.current
`
