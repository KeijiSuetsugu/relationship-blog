'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { supabase } from '@/lib/supabase'
import { FileText, Eye, Heart, TrendingUp, Calendar } from 'lucide-react'
import Link from 'next/link'

interface Stats {
    totalPosts: number
    publishedPosts: number
    draftPosts: number
    totalViews: number
    totalLikes: number
}

interface RecentPost {
    id: string
    title: string
    created_at: string
    is_draft: boolean
    like_count: number
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({
        totalPosts: 0,
        publishedPosts: 0,
        draftPosts: 0,
        totalViews: 0,
        totalLikes: 0,
    })
    const [recentPosts, setRecentPosts] = useState<RecentPost[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            // 記事の統計を取得
            const { data: posts, error } = await supabase
                .from('posts')
                .select('id, title, created_at, is_draft, like_count')
                .order('created_at', { ascending: false })

            if (error) throw error

            if (posts) {
                const published = posts.filter(p => !p.is_draft)
                const drafts = posts.filter(p => p.is_draft)
                const totalLikes = posts.reduce((sum, p) => sum + (p.like_count || 0), 0)

                setStats({
                    totalPosts: posts.length,
                    publishedPosts: published.length,
                    draftPosts: drafts.length,
                    totalViews: 0, // 今後実装
                    totalLikes,
                })

                setRecentPosts(posts.slice(0, 5))
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const statCards = [
        {
            title: '総記事数',
            value: stats.totalPosts,
            icon: FileText,
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-500/10',
            iconColor: 'text-blue-500',
        },
        {
            title: '公開済み',
            value: stats.publishedPosts,
            icon: Eye,
            color: 'from-green-500 to-emerald-500',
            bgColor: 'bg-green-500/10',
            iconColor: 'text-green-500',
        },
        {
            title: '下書き',
            value: stats.draftPosts,
            icon: Calendar,
            color: 'from-yellow-500 to-orange-500',
            bgColor: 'bg-yellow-500/10',
            iconColor: 'text-yellow-500',
        },
        {
            title: '総いいね数',
            value: stats.totalLikes,
            icon: Heart,
            color: 'from-pink-500 to-rose-500',
            bgColor: 'bg-pink-500/10',
            iconColor: 'text-pink-500',
        },
    ]

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
            <div className="max-w-7xl mx-auto space-y-8">
                {/* ヘッダー */}
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">ダッシュボード</h1>
                    <p className="text-slate-600">サイトの概要と最近の活動</p>
                </div>

                {/* 統計カード */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((card) => {
                        const Icon = card.icon
                        return (
                            <div
                                key={card.title}
                                className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-200"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-xl ${card.bgColor}`}>
                                        <Icon className={card.iconColor} size={24} />
                                    </div>
                                    <TrendingUp className="text-green-500" size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600 mb-1">{card.title}</p>
                                    <p className="text-3xl font-bold text-slate-900">{card.value}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* 最近の記事 */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900">最近の記事</h2>
                        <Link
                            href="/admin/posts"
                            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                        >
                            すべて見る →
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-200">
                        {recentPosts.length === 0 ? (
                            <div className="px-6 py-12 text-center text-slate-500">
                                まだ記事がありません
                            </div>
                        ) : (
                            recentPosts.map((post) => (
                                <div
                                    key={post.id}
                                    className="px-6 py-4 hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-medium text-slate-900 mb-1">
                                                {post.title}
                                            </h3>
                                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                                <span>
                                                    {new Date(post.created_at).toLocaleDateString('ja-JP')}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Heart size={14} />
                                                    {post.like_count || 0}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${post.is_draft
                                                        ? 'bg-yellow-100 text-yellow-700'
                                                        : 'bg-green-100 text-green-700'
                                                    }`}
                                            >
                                                {post.is_draft ? '下書き' : '公開中'}
                                            </span>
                                            <Link
                                                href={`/admin/posts/${post.id}/edit`}
                                                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                                            >
                                                編集
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* クイックアクション */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link
                        href="/admin/posts/new"
                        className="group bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
                                <FileText className="text-white" size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">新規記事を作成</h3>
                                <p className="text-purple-100">新しいブログ記事を書く</p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href="/admin/settings"
                        className="group bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
                                <TrendingUp className="text-white" size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">サイト設定</h3>
                                <p className="text-blue-100">サイトの設定を変更する</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </AdminLayout>
    )
}
