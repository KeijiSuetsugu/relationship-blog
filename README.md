# エンネク公式サイト & ブログ

Next.js + Sanity CMSを使用した公式サイト兼ブログサイト

## 特徴

- 🚀 **高速表示**: Next.js App Routerによる静的サイト生成（SSG）
- 📝 **柔軟なCMS**: Sanity CMSで簡単にコンテンツ管理
- 🎨 **モダンデザイン**: Tailwind CSSによるレスポンシブデザイン
- 🔍 **SEO最適化**: メタタグ、OGP、サイトマップ、構造化データ対応
- 📊 **アナリティクス**: Google Analytics 4対応
- ☁️ **簡単デプロイ**: Vercelでワンクリックデプロイ

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router)
- **スタイリング**: Tailwind CSS 4
- **CMS**: Sanity
- **ホスティング**: Vercel
- **言語**: TypeScript

## セットアップ

### 1. リポジトリをクローン

```bash
git clone https://github.com/yourusername/ennek-blog.git
cd ennek-blog
```

### 2. 依存関係をインストール

```bash
npm install
```

### 3. Sanityプロジェクトを作成

1. [Sanity.io](https://www.sanity.io/) でアカウントを作成
2. 新しいプロジェクトを作成
3. プロジェクトIDをコピー

### 4. 環境変数を設定

`.env.local` ファイルを作成:

```bash
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production

# サイトURL（本番環境）
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Google Analytics（オプション）
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 5. Sanity Studioをセットアップ

Sanity Studioを使用するには、別途Sanityプロジェクトを初期化してください:

```bash
npm create sanity@latest -- --template clean
```

スキーマファイルは `sanity/schemaTypes/` にあります。これらをSanity Studioプロジェクトにコピーしてください。

### 6. 開発サーバーを起動

```bash
npm run dev
```

http://localhost:3000 でサイトを確認できます。

## ディレクトリ構成

```
ennek-blog/
├── sanity/
│   ├── lib/
│   │   ├── client.ts     # Sanityクライアント
│   │   ├── image.ts      # 画像URL生成
│   │   ├── queries.ts    # GROQクエリ
│   │   └── types.ts      # 型定義
│   └── schemaTypes/
│       ├── author.ts     # 著者スキーマ
│       ├── category.ts   # カテゴリースキーマ
│       ├── post.ts       # 記事スキーマ
│       ├── siteSettings.ts # サイト設定スキーマ
│       └── tag.ts        # タグスキーマ
├── src/
│   ├── app/
│   │   ├── blog/
│   │   │   ├── [slug]/   # 個別記事ページ
│   │   │   ├── category/ # カテゴリーページ
│   │   │   ├── tag/      # タグページ
│   │   │   └── page.tsx  # ブログ一覧ページ
│   │   ├── globals.css   # グローバルスタイル
│   │   ├── layout.tsx    # レイアウト
│   │   ├── not-found.tsx # 404ページ
│   │   ├── page.tsx      # トップページ
│   │   ├── robots.ts     # robots.txt
│   │   └── sitemap.ts    # サイトマップ
│   └── components/
│       ├── BlogCard.tsx          # ブログカード
│       ├── Footer.tsx            # フッター
│       ├── Header.tsx            # ヘッダー
│       ├── Pagination.tsx        # ページネーション
│       ├── PortableTextRenderer.tsx # リッチテキストレンダラー
│       ├── ShareButtons.tsx      # シェアボタン
│       └── TableOfContents.tsx   # 目次
└── public/                       # 静的ファイル
```

## Sanity CMSでのコンテンツ管理

### サイト設定

Sanity Studioで「サイト設定」ドキュメントを作成し、以下を設定:

- サイトタイトル
- サイト説明
- ヒーロー画像・キャッチコピー
- 自己紹介セクション
- 実績・経歴
- SNSリンク
- お問い合わせ情報
- Google Analytics ID

### ブログ記事

記事を作成する際は以下を入力:

- タイトル
- スラッグ（URL）
- 抜粋
- メイン画像
- 著者
- カテゴリー
- タグ
- 本文（リッチテキスト）
- SEO設定
- 公開状態（下書き/公開）

## デプロイ

### Vercelへのデプロイ

1. [Vercel](https://vercel.com/) でアカウントを作成
2. GitHubリポジトリをインポート
3. 環境変数を設定
4. デプロイ

```bash
npm run build
```

## ライセンス

MIT
