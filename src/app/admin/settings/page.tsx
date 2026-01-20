'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { supabase } from '@/lib/supabase'
import { Save, Globe, Mail, Twitter, Github, Instagram } from 'lucide-react'

interface SiteSettings {
    id?: string
    site_name: string
    site_description: string
    site_url: string
    contact_email: string
    twitter: string
    github: string
    instagram: string
}

export default function AdminSettingsPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)
    const [settings, setSettings] = useState<SiteSettings>({
        site_name: '',
        site_description: '',
        site_url: '',
        contact_email: '',
        twitter: '',
        github: '',
        instagram: '',
    })

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('site_settings')
                .select('*')
                .single()

            if (error && error.code !== 'PGRST116') { // PGRST116 is "The result contains 0 rows"
                throw error
            }

            if (data) {
                setSettings(data)
            }
        } catch (error) {
            console.error('Error fetching settings:', error)
            // エラー表示等は必要に応じて追加
        } finally {
            setIsFetching(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            let result

            // IDがある場合は更新、なければ新規作成（通常はschema.sqlで初期データが入るはずだが念のため）
            if (settings.id) {
                result = await supabase
                    .from('site_settings')
                    .update({
                        site_name: settings.site_name,
                        site_description: settings.site_description,
                        site_url: settings.site_url,
                        contact_email: settings.contact_email,
                        twitter: settings.twitter,
                        github: settings.github,
                        instagram: settings.instagram,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('id', settings.id)
            } else {
                result = await supabase
                    .from('site_settings')
                    .insert([{
                        site_name: settings.site_name,
                        site_description: settings.site_description,
                        site_url: settings.site_url,
                        contact_email: settings.contact_email,
                        twitter: settings.twitter,
                        github: settings.github,
                        instagram: settings.instagram,
                    }])
            }

            if (result.error) throw result.error

            alert('設定を保存しました')

            // 新規作成の場合はIDを再取得するためにフェッチし直す
            if (!settings.id) {
                fetchSettings()
            }
        } catch (error) {
            console.error('Error saving settings:', error)
            alert('設定の保存に失敗しました')
        } finally {
            setIsLoading(false)
        }
    }

    if (isFetching) {
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
            <div className="max-w-4xl mx-auto">
                {/* ヘッダー */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">サイト設定</h1>
                    <p className="text-slate-600">サイトの基本情報とSNS連携を設定します</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/*基本情報*/}
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
                                        value={settings.site_name}
                                        onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        placeholder="サイト名を入力"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="siteDescription" className="block text-sm font-medium text-slate-700 mb-2">
                                    サイト説明
                                </label>
                                <textarea
                                    id="siteDescription"
                                    value={settings.site_description || ''}
                                    onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                                    placeholder="サイトの説明を入力"
                                />
                            </div>

                            <div>
                                <label htmlFor="siteUrl" className="block text-sm font-medium text-slate-700 mb-2">
                                    サイトURL
                                </label>
                                <input
                                    id="siteUrl"
                                    type="url"
                                    value={settings.site_url || ''}
                                    onChange={(e) => setSettings({ ...settings, site_url: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    placeholder="https://example.com"
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
                                    value={settings.contact_email || ''}
                                    onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    placeholder="contact@example.com"
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
                                        value={settings.twitter || ''}
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
                                        value={settings.github || ''}
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
                                        value={settings.instagram || ''}
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
