'use client'

import { useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { Save, Globe, Mail, Twitter, Github, Instagram } from 'lucide-react'

export default function AdminSettingsPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [settings, setSettings] = useState({
        siteName: 'エンネク公式サイト',
        siteDescription: 'AI技術とデジタルマーケティングの最新情報をお届けします',
        siteUrl: 'https://example.com',
        contactEmail: 'contact@example.com',
        twitter: '',
        github: '',
        instagram: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // TODO: Supabaseに設定を保存
        setTimeout(() => {
            alert('設定を保存しました')
            setIsLoading(false)
        }, 1000)
    }

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto">
                {/* ヘッダー */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">サイト設定</h1>
                    <p className="text-slate-600">サイトの基本情報とSNS連携を設定します</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 基本情報 */}
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                        <h2 className="text-xl font-bold text-slate-900 mb-6">基本情報</h2>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="siteName" className="block text-sm font-medium text-slate-700 mb-2">
                                    サイト名
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Globe className="text-slate-400" size={20} />
                                    </div>
                                    <input
                                        id="siteName"
                                        type="text"
                                        value={settings.siteName}
                                        onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="siteDescription" className="block text-sm font-medium text-slate-700 mb-2">
                                    サイト説明
                                </label>
                                <textarea
                                    id="siteDescription"
                                    value={settings.siteDescription}
                                    onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                                />
                            </div>

                            <div>
                                <label htmlFor="siteUrl" className="block text-sm font-medium text-slate-700 mb-2">
                                    サイトURL
                                </label>
                                <input
                                    id="siteUrl"
                                    type="url"
                                    value={settings.siteUrl}
                                    onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 連絡先 */}
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                        <h2 className="text-xl font-bold text-slate-900 mb-6">連絡先</h2>

                        <div>
                            <label htmlFor="contactEmail" className="block text-sm font-medium text-slate-700 mb-2">
                                お問い合わせメールアドレス
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="text-slate-400" size={20} />
                                </div>
                                <input
                                    id="contactEmail"
                                    type="email"
                                    value={settings.contactEmail}
                                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* SNS連携 */}
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                        <h2 className="text-xl font-bold text-slate-900 mb-6">SNS連携</h2>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="twitter" className="block text-sm font-medium text-slate-700 mb-2">
                                    Twitter / X
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Twitter className="text-slate-400" size={20} />
                                    </div>
                                    <input
                                        id="twitter"
                                        type="text"
                                        value={settings.twitter}
                                        onChange={(e) => setSettings({ ...settings, twitter: e.target.value })}
                                        placeholder="@username"
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="github" className="block text-sm font-medium text-slate-700 mb-2">
                                    GitHub
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Github className="text-slate-400" size={20} />
                                    </div>
                                    <input
                                        id="github"
                                        type="text"
                                        value={settings.github}
                                        onChange={(e) => setSettings({ ...settings, github: e.target.value })}
                                        placeholder="username"
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="instagram" className="block text-sm font-medium text-slate-700 mb-2">
                                    Instagram
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Instagram className="text-slate-400" size={20} />
                                    </div>
                                    <input
                                        id="instagram"
                                        type="text"
                                        value={settings.instagram}
                                        onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                                        placeholder="username"
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 保存ボタン */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save size={20} />
                            {isLoading ? '保存中...' : '設定を保存'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    )
}
