import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'サイト設定',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'サイトタイトル',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'サイト説明',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'logo',
      title: 'ロゴ画像',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'heroImage',
      title: 'ヒーロー画像',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'heroTagline',
      title: 'キャッチコピー',
      type: 'string',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'サブタイトル',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'aboutTitle',
      title: '自己紹介タイトル',
      type: 'string',
    }),
    defineField({
      name: 'aboutContent',
      title: '自己紹介文',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'profileImage',
      title: 'プロフィール画像',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'achievements',
      title: '実績・経歴',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'year', title: '年', type: 'string' },
            { name: 'title', title: 'タイトル', type: 'string' },
            { name: 'description', title: '説明', type: 'text', rows: 2 },
          ],
        },
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'SNSリンク',
      type: 'object',
      fields: [
        { name: 'twitter', title: 'X (Twitter)', type: 'url' },
        { name: 'instagram', title: 'Instagram', type: 'url' },
        { name: 'youtube', title: 'YouTube', type: 'url' },
        { name: 'threads', title: 'Threads', type: 'url' },
        { name: 'facebook', title: 'Facebook', type: 'url' },
        { name: 'tiktok', title: 'TikTok', type: 'url' },
      ],
    }),
    defineField({
      name: 'contactEmail',
      title: 'お問い合わせメール',
      type: 'string',
    }),
    defineField({
      name: 'contactInfo',
      title: 'お問い合わせ情報',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'footerText',
      title: 'フッターテキスト',
      type: 'string',
    }),
    defineField({
      name: 'googleAnalyticsId',
      title: 'Google Analytics ID',
      type: 'string',
      description: '例: G-XXXXXXXXXX',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'logo',
    },
  },
})



