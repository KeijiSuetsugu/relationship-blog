# 管理画面の使い方

## 概要
このサイトには管理画面が実装されており、記事の作成・編集・削除、サイト設定の変更が可能です。

## アクセス方法

### 管理画面URL
```
http://localhost:3000/admin
```

本番環境では:
```
https://your-domain.com/admin
```

## 初期セットアップ

### 1. Supabaseプロジェクトの設定

1. [Supabase](https://supabase.com/) にログイン
2. 新しいプロジェクトを作成
3. SQL Editorで `supabase/schema.sql` の内容を実行
4. Authentication > Providers で Email を有効化

### 2. 環境変数の設定

`.env.local` ファイルを作成し、以下を設定:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. 管理者アカウントの作成

Supabase Dashboard > Authentication > Users から新しいユーザーを作成:

- Email: admin@example.com
- Password: 任意の安全なパスワード

または、Supabase SQL Editorで以下を実行:

```sql
-- 管理者ユーザーを作成（Supabase Authを使用）
-- Dashboard > Authentication > Users から手動で作成することを推奨
```

### 4. ストレージの設定（画像アップロード用）

1. Supabase Dashboard > Storage
2. 新しいバケット `media` を作成
3. Public アクセスを有効化
4. Policies で以下を設定:
   - SELECT: 全員に許可
   - INSERT: 認証済みユーザーのみ
   - UPDATE: 認証済みユーザーのみ
   - DELETE: 認証済みユーザーのみ

## 機能一覧

### 🔐 ログイン機能
- `/admin/login` - 管理者ログインページ
- メールアドレスとパスワードで認証
- セッション管理

### 📊 ダッシュボード
- `/admin` - 管理画面トップ
- 記事の統計情報表示
- 最近の記事一覧
- クイックアクション

### 📝 記事管理
- `/admin/posts` - 記事一覧
  - 記事の検索
  - ステータスフィルター（全て/公開中/下書き）
  - 公開/下書き切り替え
  - 記事削除
  
- `/admin/posts/new` - 新規記事作成
  - タイトル、説明文の入力
  - メディアタイプ選択（テキスト/画像/動画/音声/ウェブ）
  - 画像アップロード
  - 下書き保存/公開

- `/admin/posts/[id]/edit` - 記事編集（今後実装予定）

### ⚙️ サイト設定
- `/admin/settings` - サイト設定
  - サイト名、説明の変更
  - 連絡先メールアドレス
  - SNS連携（Twitter, GitHub, Instagram）

## セキュリティ

### Row Level Security (RLS)
Supabaseのポリシーにより、以下のセキュリティが確保されています:

- **記事 (posts)**
  - 公開記事は全員が閲覧可能
  - 下書きは認証済みユーザーのみ閲覧可能
  - 作成・更新・削除は認証済みユーザーのみ

- **ユーザー (users)**
  - 全員が閲覧可能
  - 自分のプロフィールのみ更新可能

- **サイト設定 (site_settings)**
  - 認証済みユーザーのみ閲覧・更新可能

### 認証フロー
1. ログインページでメールアドレスとパスワードを入力
2. Supabase Authで認証
3. セッショントークンを取得
4. 管理画面の各ページで認証状態をチェック
5. 未認証の場合は自動的にログインページへリダイレクト

## トラブルシューティング

### ログインできない
- Supabaseプロジェクトの環境変数が正しく設定されているか確認
- Supabase Dashboard > Authentication でユーザーが作成されているか確認
- ブラウザのコンソールでエラーメッセージを確認

### 画像がアップロードできない
- Supabase Storage で `media` バケットが作成されているか確認
- バケットのポリシーが正しく設定されているか確認
- ファイルサイズが大きすぎないか確認（推奨: 10MB以下）

### 記事が表示されない
- Supabase SQL Editor で `posts` テーブルにデータがあるか確認
- RLSポリシーが正しく設定されているか確認
- ブラウザのコンソールでエラーメッセージを確認

## 開発

### ローカル開発サーバー起動
```bash
npm run dev
```

### ビルド
```bash
npm run build
```

### 本番環境へのデプロイ
Vercelなどのホスティングサービスで環境変数を設定してデプロイしてください。

## 今後の拡張予定

- [ ] 記事編集機能
- [ ] カテゴリー・タグ管理
- [ ] ユーザー管理
- [ ] アクセス解析
- [ ] メディアライブラリ
- [ ] 一括操作機能
- [ ] エクスポート/インポート機能
