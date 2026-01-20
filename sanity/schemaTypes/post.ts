import { defineField, defineType } from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'ブログ記事',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'タイトル',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'スラッグ',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: '抜粋',
      type: 'text',
      rows: 3,
      description: '記事の要約（一覧ページで表示されます）',
    }),
    defineField({
      name: 'mainImage',
      title: 'メイン画像',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: '代替テキスト',
          type: 'string',
        },
      ],
    }),
    defineField({
      name: 'author',
      title: '著者',
      type: 'reference',
      to: { type: 'author' },
    }),
    defineField({
      name: 'category',
      title: 'カテゴリー',
      type: 'reference',
      to: { type: 'category' },
    }),
    defineField({
      name: 'tags',
      title: 'タグ',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'tag' } }],
    }),
    defineField({
      name: 'publishedAt',
      title: '公開日',
      type: 'datetime',
    }),
    defineField({
      name: 'updatedAt',
      title: '更新日',
      type: 'datetime',
    }),
    defineField({
      name: 'body',
      title: '本文',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: '通常', value: 'normal' },
            { title: '見出し2', value: 'h2' },
            { title: '見出し3', value: 'h3' },
            { title: '見出し4', value: 'h4' },
            { title: '引用', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: '太字', value: 'strong' },
              { title: '斜体', value: 'em' },
              { title: 'コード', value: 'code' },
              { title: '下線', value: 'underline' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'リンク',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                  },
                  {
                    name: 'blank',
                    type: 'boolean',
                    title: '新しいタブで開く',
                    initialValue: true,
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: '代替テキスト',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'キャプション',
            },
          ],
        },
        {
          type: 'code',
          title: 'コードブロック',
          options: {
            withFilename: true,
          },
        },
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO設定',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          title: 'メタタイトル',
          type: 'string',
          description: 'SEO用のタイトル（空の場合は記事タイトルを使用）',
        },
        {
          name: 'metaDescription',
          title: 'メタディスクリプション',
          type: 'text',
          rows: 3,
          description: 'SEO用の説明文（空の場合は抜粋を使用）',
        },
        {
          name: 'ogImage',
          title: 'OGP画像',
          type: 'image',
          description: 'SNS共有用の画像（空の場合はメイン画像を使用）',
        },
      ],
    }),
    defineField({
      name: 'featured',
      title: '注目記事',
      type: 'boolean',
      description: 'トップページに表示する注目記事として設定',
      initialValue: false,
    }),
    defineField({
      name: 'status',
      title: '公開状態',
      type: 'string',
      options: {
        list: [
          { title: '下書き', value: 'draft' },
          { title: '公開', value: 'published' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
      status: 'status',
    },
    prepare(selection) {
      const { author, status, title } = selection
      const statusEmoji = status === 'published' ? '🟢' : '⚪'
      return {
        ...selection,
        title: `${statusEmoji} ${title}`,
        subtitle: author && `by ${author}`,
      }
    },
  },
  orderings: [
    {
      title: '公開日（新しい順）',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: '公開日（古い順）',
      name: 'publishedAtAsc',
      by: [{ field: 'publishedAt', direction: 'asc' }],
    },
  ],
})




