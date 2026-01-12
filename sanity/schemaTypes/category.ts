import { defineField, defineType } from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'カテゴリー',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'カテゴリー名',
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
      name: 'description',
      title: '説明',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'color',
      title: 'カラー',
      type: 'string',
      description: 'カテゴリーの表示色（例: #6B4C8A）',
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
})



