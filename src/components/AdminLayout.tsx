'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/supabase'
import {
    LayoutDashboard,
    FileText,
    Settings,
    LogOut,
    Menu,
    X,
    Home
} from 'lucide-react'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const pathname = usePathname()
    const [isLoading, setIsLoading] = useState(true)
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [userEmail, setUserEmail] = useState<string | null>(null)

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        const { user, error } = await auth.getCurrentUser()

        if (error || !user) {
            router.push('/admin/login')
            return
        }

        setUserEmail(user.email || null)
        setIsLoading(false)
    }

    const handleLogout = async () => {
        await auth.signOut()
        router.push('/admin/login')
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        )
    }

    const navItems = [
        { href: '/admin', icon: LayoutDashboard, label: 'ダッシュボード' },
        { href: '/admin/posts', icon: FileText, label: '記事管理' },
        { href: '/admin/settings', icon: Settings, label: '設定' },
        { href: '/', icon: Home, label: 'サイトを見る' },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
            {/* サイドバー */}
            <aside
                className={`fixed top-0 left-0 z-40 h-screen transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 border-r border-purple-500/20 shadow-2xl`}
                style={{ width: '280px' }}
            >
                <div className="h-full px-4 py-6 overflow-y-auto">
                    {/* ロゴ */}
                    <div className="mb-8 px-4">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            管理画面
                        </h1>
                        <p className="text-sm text-slate-400 mt-1">{userEmail}</p>
                    </div>

                    {/* ナビゲーション */}
                    <nav className="space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                                            : 'text-slate-300 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    <Icon size={20} />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* ログアウトボタン */}
                    <div className="absolute bottom-6 left-4 right-4">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200"
                        >
                            <LogOut size={20} />
                            <span className="font-medium">ログアウト</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* メインコンテンツ */}
            <div
                className={`transition-all duration-300 ${isSidebarOpen ? 'ml-[280px]' : 'ml-0'
                    }`}
            >
                {/* ヘッダー */}
                <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                    <div className="px-6 py-4 flex items-center justify-between">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>

                        <div className="flex items-center gap-4">
                            <div className="text-sm text-slate-600">
                                {new Date().toLocaleDateString('ja-JP', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </div>
                        </div>
                    </div>
                </header>

                {/* コンテンツエリア */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
