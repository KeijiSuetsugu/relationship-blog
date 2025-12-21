# 人間関係ブログ - Ennek Lab

毎日自動で人間関係に関する実用的な記事を投稿する静的ブログサイト

## 特徴

- 🤖 **毎日自動投稿**: GitHub Actionsで毎朝7時に新しい記事を自動生成
- 📝 **5000〜6000字の実用的な記事**: 科学的根拠に基づいた人間関係のアドバイス
- 🖼️ **無料の高品質画像**: Unsplashから自動取得
- 🚫 **重複防止**: 4層のチェックで同じ記事は絶対に投稿されない
- ⚡ **高速表示**: Next.jsによる静的サイト生成
- 💰 **無料ホスティング**: GitHub Pagesでホスティング

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router)
- **スタイリング**: Tailwind CSS
- **記事生成**: OpenAI GPT-4o-mini
- **画像取得**: Unsplash API
- **ホスティング**: GitHub Pages
- **自動化**: GitHub Actions

## セットアップ

### 1. リポジトリをクローン

```bash
git clone https://github.com/yourusername/relationship-blog.git
cd relationship-blog
```

### 2. 依存関係をインストール

```bash
npm install
```

### 3. 開発サーバーを起動

```bash
npm run dev
```

### 4. GitHub Secretsを設定

リポジトリの Settings > Secrets and variables > Actions で以下を設定:

| Secret名 | 説明 |
|---------|------|
| `OPENAI_API_KEY` | OpenAI APIキー（必須） |
| `UNSPLASH_ACCESS_KEY` | Unsplash APIキー（必須） |

### 5. GitHub Pagesを有効化

1. Settings > Pages
2. Source: `Deploy from a branch`
3. Branch: `gh-pages`

## ファイル構成

```
relationship-blog/
├── content/
│   └── posts/           # 記事のMarkdownファイル
├── public/
│   └── images/          # 記事の画像
├── scripts/
│   ├── generate_article.py  # 記事生成スクリプト
│   └── post_history.json    # 投稿履歴（重複防止用）
├── src/
│   ├── app/             # Next.js App Router
│   └── lib/             # ユーティリティ
└── .github/
    └── workflows/       # GitHub Actions
```

## 記事の手動生成

```bash
# 環境変数を設定
export OPENAI_API_KEY="your-api-key"
export UNSPLASH_ACCESS_KEY="your-unsplash-key"

# 記事を生成
python scripts/generate_article.py
```

## ライセンス

MIT
