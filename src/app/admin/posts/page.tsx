'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    Heart,
    MessageCircle,
    Calendar
} from 'lucide-react'

interface Post {
    id: string
    title: string
    description: string
    media_type: string
    media_url: string
    thumb_url: string
    like_count: number
    comment_count: number
    is_draft: boolean
    created_at: string
}

export default function AdminPostsPage() {
    const [posts, setPosts] = useState<Post[]>([])
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchPosts()
    }, [])

    useEffect(() => {
        filterPosts()
    }, [posts, searchQuery, filterStatus])

    const fetchPosts = async () => {
        try {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            if (data) setPosts(data)
        } catch (error) {
            console.error('Error fetching posts:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const filterPosts = () => {
        let filtered = posts

        // ステータスフィルター
        if (filterStatus === 'published') {
            filtered = filtered.filter(p => !p.is_draft)
        } else if (filterStatus === 'draft') {
            filtered = filtered.filter(p => p.is_draft)
        }

        // 検索フィルター
        if (searchQuery) {
            filtered = filtered.filter(p =>
                p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description?.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        setFilteredPosts(filtered)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('この記事を削除してもよろしいですか？')) return

        try {
            const { error } = await supabase
                .from('posts')
                .delete()
                .eq('id', id)

            if (error) throw error

            setPosts(posts.filter(p => p.id !== id))
            alert('記事を削除しました')
        } catch (error) {
            console.error('Error deleting post:', error)
            alert('記事の削除に失敗しました')
        }
    }

    const togglePublishStatus = async (post: Post) => {
        try {
            const { error } = await supabase
                .from('posts')
                .update({ is_draft: !post.is_draft })
                .eq('id', post.id)

            if (error) throw error

            setPosts(posts.map(p =>
                p.id === post.id ? { ...p, is_draft: !p.is_draft } : p
            ))
        } catch (error) {
            console.error('Error updating post:', error)
            alert('ステータスの更新に失敗しました')
        }
    }

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
            </AdminLayout>
        )
    }

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto space-y-6">
                {/* ヘッダー */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">記事管理</h1>
                        <p className="text-slate-600">全 {filteredPosts.length} 件の記事</p>
                    </div>
                    <Link
                        href="/admin/posts/new"
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 transition-all duration-200"
                    >
                        <Plus size={20} />
                        新規作成
                    </Link>
                </div>

                {/* フィルター */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* 検索 */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="text-slate-400" size={20} />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="記事を検索..."
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* ステータスフィルター */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilterStatus('all')}
                                className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${filterStatus === 'all'
                                        ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/50'
                                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                    }`}
                            >
                                すべて
                            </button>
                            <button
                                onClick={() => setFilterStatus('published')}
                                className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${filterStatus === 'published'
                                        ? 'bg-green-500 text-white shadow-lg shadow-green-500/50'
                                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                    }`}
                            >
                                公開中
                            </button>
                            <button
                                onClick={() => setFilterStatus('draft')}
                                className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${filterStatus === 'draft'
                                        ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/50'
                                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                    }`}
                            >
                                下書き
                            </button>
                        </div>
                    </div>
                </div>

                {/* 記事一覧 */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                    {filteredPosts.length === 0 ? (
                        <div className="px-6 py-12 text-center text-slate-500">
                            {searchQuery ? '検索結果がありません' : '記事がありません'}
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-200">
                            {filteredPosts.map((post) => (
                                <div
                                    key={post.id}
                                    className="px-6 py-5 hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-start gap-4">
                                        {/* サムネイル */}
                                        {post.thumb_url && (
                                            <div className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-slate-100">
                                                <img
                                                    src={post.thumb_url}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}

                                        {/* コンテンツ */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-slate-900 mb-1 truncate">
                                                {post.title}
                                            </h3>
                                            {post.description && (
                                                <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                                                    {post.description}
                                                </p>
                                            )}
                                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    {new Date(post.created_at).toLocaleDateString('ja-JP')}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Heart size={14} />
                                                    {post.like_count || 0}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MessageCircle size={14} />
                                                    {post.comment_count || 0}
                                                </span>
                                                <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                                                    {post.media_type}
                                                </span>
                                            </div>
                                        </div>

                                        {/* アクション */}
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => togglePublishStatus(post)}
                                                className={`p-2 rounded-lg transition-colors ${post.is_draft
                                                        ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                                                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                                                    }`}
                                                title={post.is_draft ? '公開する' : '下書きに戻す'}
                                            >
                                                {post.is_draft ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                            <Link
                                                href={`/admin/posts/${post.id}/edit`}
                                                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                                title="編集"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                                title="削除"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    )
}
