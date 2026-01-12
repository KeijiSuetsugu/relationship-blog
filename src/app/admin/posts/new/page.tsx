'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import { supabase, auth } from '@/lib/supabase'
import { Save, Eye, Upload, X } from 'lucide-react'

export default function NewPostPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        media_type: 'text',
        media_url: '',
        thumb_url: '',
        is_draft: true,
    })

    const handleSubmit = async (e: FormEvent, isDraft: boolean) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // 現在のユーザーを取得
            const { user } = await auth.getCurrentUser()
            if (!user) {
                alert('ログインしてください')
                router.push('/admin/login')
                return
            }

            const { data, error } = await supabase
                .from('posts')
                .insert([
                    {
                        ...formData,
                        is_draft: isDraft,
                        user_id: user.id,
                    },
                ])
                .select()

            if (error) throw error

            alert(isDraft ? '下書きを保存しました' : '記事を公開しました')
            router.push('/admin/posts')
        } catch (error) {
            console.error('Error creating post:', error)
            alert('記事の作成に失敗しました')
        } finally {
            setIsLoading(false)
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `posts/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('media')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data } = supabase.storage
                .from('media')
                .getPublicUrl(filePath)

            setFormData({
                ...formData,
                media_url: data.publicUrl,
                thumb_url: data.publicUrl,
            })
        } catch (error) {
            console.error('Error uploading image:', error)
            alert('画像のアップロードに失敗しました')
        }
    }

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto">
                {/* ヘッダー */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">新規記事作成</h1>
                    <p className="text-slate-600">新しいブログ記事を作成します</p>
                </div>

                {/* フォーム */}
                <form className="space-y-6">
                    {/* タイトル */}
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                        <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
                            タイトル <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            placeholder="記事のタイトルを入力"
                        />
                    </div>

                    {/* 説明 */}
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                        <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                            説明文
                        </label>
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                            placeholder="記事の説明を入力"
                        />
                    </div>

                    {/* メディアタイプ */}
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                        <label htmlFor="media_type" className="block text-sm font-medium text-slate-700 mb-2">
                            メディアタイプ
                        </label>
                        <select
                            id="media_type"
                            value={formData.media_type}
                            onChange={(e) => setFormData({ ...formData, media_type: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        >
                            <option value="text">テキスト</option>
                            <option value="image">画像</option>
                            <option value="video">動画</option>
                            <option value="audio">音声</option>
                            <option value="web">ウェブ</option>
                        </select>
                    </div>

                    {/* 画像アップロード */}
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            メディア / サムネイル
                        </label>

                        {formData.media_url ? (
                            <div className="relative">
                                <img
                                    src={formData.media_url}
                                    alt="Preview"
                                    className="w-full h-64 object-cover rounded-xl"
                                />
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, media_url: '', thumb_url: '' })}
                                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="text-slate-400 mb-3" size={48} />
                                    <p className="mb-2 text-sm text-slate-500">
                                        <span className="font-semibold">クリックしてアップロード</span>
                                    </p>
                                    <p className="text-xs text-slate-500">PNG, JPG, GIF (最大 10MB)</p>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </label>
                        )}
                    </div>

                    {/* メディアURL（手動入力） */}
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                        <label htmlFor="media_url" className="block text-sm font-medium text-slate-700 mb-2">
                            メディアURL（手動入力）
                        </label>
                        <input
                            id="media_url"
                            type="url"
                            value={formData.media_url}
                            onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    {/* アクションボタン */}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={(e) => handleSubmit(e, true)}
                            disabled={isLoading || !formData.title}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save size={20} />
                            下書き保存
                        </button>
                        <button
                            type="button"
                            onClick={(e) => handleSubmit(e, false)}
                            disabled={isLoading || !formData.title}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Eye size={20} />
                            {isLoading ? '処理中...' : '公開する'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    )
}
