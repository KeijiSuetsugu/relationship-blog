import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID

// Sanityクライアントの作成（projectIdがない場合はダミークライアント）
export const client = createClient({
  projectId: projectId || 'dummy-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
})

// Sanityが設定されているかどうかのフラグ
export const isSanityConfigured = Boolean(projectId)

