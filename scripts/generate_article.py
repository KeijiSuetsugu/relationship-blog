#!/usr/bin/env python3
"""
人間関係ブログ記事自動生成スクリプト
- 5000〜6000字の実用的な記事（2パート生成方式）
- Unsplash無料画像
- 重複防止機能（4層チェック）
- Discord通知機能
"""

import os
import sys
import json
import hashlib
import requests
import random
from datetime import datetime, timedelta
from pathlib import Path
from openai import OpenAI
from difflib import SequenceMatcher

# プロジェクトルート
PROJECT_ROOT = Path(__file__).parent.parent
POSTS_DIR = PROJECT_ROOT / "content" / "posts"
IMAGES_DIR = PROJECT_ROOT / "public" / "images"
HISTORY_FILE = PROJECT_ROOT / "scripts" / "post_history.json"

# ブログURL（本番サイト）
BLOG_URL = "https://ennekrelationship.netlify.app"


class ArticleGenerator:
    """人間関係に関する記事を生成するクラス"""
    
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.unsplash_access_key = os.getenv("UNSPLASH_ACCESS_KEY")
        
        # 人間関係のテーマリスト（50種類以上）
        self.themes = [
            "職場の人間関係を円滑にするコミュニケーション術",
            "苦手な人との上手な付き合い方",
            "信頼関係を築くための基本原則",
            "パートナーとの関係を深める秘訣",
            "友人関係を長続きさせる方法",
            "家族間のコミュニケーション改善法",
            "初対面での印象を良くするテクニック",
            "断り方の極意：相手を傷つけない伝え方",
            "怒りのコントロールと人間関係",
            "傾聴スキルで人間関係を改善する",
            "自己主張と協調性のバランス",
            "SNS時代の人間関係の築き方",
            "世代間ギャップを乗り越えるコツ",
            "嫉妬心との向き合い方",
            "人間関係のストレス解消法",
            "マインドフルネスで人間関係を改善",
            "境界線の引き方：健全な関係を保つ",
            "許す力：過去の傷を癒す方法",
            "共感力を高めるトレーニング",
            "非言語コミュニケーションの重要性",
            "価値観の違いを受け入れる心の持ち方",
            "人見知りを克服する実践テクニック",
            "リモートワーク時代の人間関係構築",
            "上司との良好な関係を築く方法",
            "部下のモチベーションを高める接し方",
            "ママ友・パパ友との付き合い方",
            "近所付き合いのコツと距離感",
            "義家族との関係を良好に保つ秘訣",
            "別れと新しい出会いへの向き合い方",
            "孤独感を和らげる人とのつながり方",
            "批判への上手な対処法",
            "謝罪と和解のテクニック",
            "感謝の気持ちを伝える効果",
            "相手の立場に立って考える力",
            "人間関係における自己肯定感の重要性",
            "グループ内での立ち位置の見つけ方",
            "競争と協力のバランス",
            "秘密を守る信頼の築き方",
            "噂話との向き合い方",
            "人間関係のリセット：新しいスタート",
            "内向的な人の強みを活かす人間関係",
            "外向的な人との上手な付き合い方",
            "完璧主義と人間関係の問題",
            "依存関係から抜け出す方法",
            "健全な距離感の保ち方",
            "対立を建設的に解決する方法",
            "チームワークを高めるコミュニケーション",
            "メンタルヘルスと人間関係",
            "自分らしさを保ちながら人と繋がる",
            "人間関係の疲れを癒す方法",
        ]
        
        # サブテーマ（バリエーション用）
        self.sub_themes = [
            "科学的根拠に基づいたアプローチ",
            "心理学の視点から解説",
            "具体的な会話例を交えて",
            "実践ワークシート付き",
            "ケーススタディで学ぶ",
            "専門家の意見を参考に",
            "最新研究から見る",
            "日常で使える簡単テクニック",
            "今日から始められる方法",
            "長期的な効果を生む習慣",
        ]
    
    def load_post_history(self) -> list:
        """投稿履歴を読み込む"""
        if HISTORY_FILE.exists():
            try:
                with open(HISTORY_FILE, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except:
                return []
        return []
    
    def save_post_history(self, history: list):
        """投稿履歴を保存"""
        with open(HISTORY_FILE, 'w', encoding='utf-8') as f:
            json.dump(history, f, ensure_ascii=False, indent=2)
    
    def is_duplicate(self, title: str, content: str, history: list) -> bool:
        """重複チェック（4層チェック）"""
        for item in history:
            # 1. 完全一致チェック
            if item.get('title') == title:
                print(f"⚠️ タイトル完全一致: {title}")
                return True
            
            # 2. タイトル類似度チェック（80%以上で重複）
            title_similarity = SequenceMatcher(
                None, title, item.get('title', '')
            ).ratio()
            if title_similarity > 0.8:
                print(f"⚠️ タイトル類似 ({title_similarity:.1%}): {item.get('title')}")
                return True
            
            # 3. 冒頭200文字チェック
            content_preview = content[:200]
            if item.get('preview', '')[:200] == content_preview:
                print(f"⚠️ 冒頭一致")
                return True
            
            # 4. コンテンツハッシュチェック
            content_hash = hashlib.md5(content.encode()).hexdigest()
            if item.get('hash') == content_hash:
                print(f"⚠️ コンテンツハッシュ一致")
                return True
        
        return False
    
    def generate_unique_theme(self, history: list) -> str:
        """使用していないテーマを選択"""
        used_themes = [item.get('theme', '') for item in history[-100:]]
        
        # 未使用のテーマを探す
        available_themes = [t for t in self.themes if t not in used_themes]
        
        if not available_themes:
            # 全て使用済みの場合、ランダムに選択してサブテーマで差別化
            theme = random.choice(self.themes)
            sub = random.choice(self.sub_themes)
            return f"{theme}（{sub}）"
        
        return random.choice(available_themes)
    
    def generate_image_from_unsplash(self, theme: str) -> tuple:
        """Unsplashから関連画像を取得"""
        if not self.unsplash_access_key:
            print("⚠️ UNSPLASH_ACCESS_KEYが設定されていません")
            return None, None
        
        try:
            # キーワードを英語で生成
            keywords = self._generate_image_keywords(theme)
            print(f"🔍 画像検索キーワード: {keywords}")
            
            # Unsplash APIで検索
            url = "https://api.unsplash.com/photos/random"
            params = {
                "query": keywords,
                "orientation": "landscape",
                "content_filter": "high"
            }
            headers = {
                "Authorization": f"Client-ID {self.unsplash_access_key}"
            }
            
            response = requests.get(url, params=params, headers=headers, timeout=30)
            response.raise_for_status()
            
            data = response.json()
            image_url = data.get('urls', {}).get('regular')
            photographer = data.get('user', {}).get('name', 'Unknown')
            photo_link = data.get('links', {}).get('html', '')
            
            if not image_url:
                print("⚠️ 画像URLが取得できませんでした")
                return None, None
            
            # 画像をダウンロード
            today = datetime.now().strftime("%Y-%m-%d")
            filename = f"{today}.jpg"
            filepath = IMAGES_DIR / filename
            
            img_response = requests.get(image_url, timeout=30)
            img_response.raise_for_status()
            
            IMAGES_DIR.mkdir(parents=True, exist_ok=True)
            with open(filepath, 'wb') as f:
                f.write(img_response.content)
            
            print(f"✓ 画像を保存しました: {filepath}")
            print(f"📷 Photo by {photographer} on Unsplash")
            
            return f"/images/{filename}", {
                "photographer": photographer,
                "link": photo_link
            }
            
        except Exception as e:
            print(f"⚠️ Unsplash画像取得エラー: {e}")
            return None, None
    
    def _generate_image_keywords(self, theme: str) -> str:
        """テーマから英語のキーワードを生成"""
        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "system",
                        "content": "Generate 2-3 English keywords for stock photo search based on the given Japanese theme about human relationships. Return only keywords separated by space. Focus on positive, warm imagery of people connecting."
                    },
                    {
                        "role": "user",
                        "content": theme
                    }
                ],
                max_tokens=50,
                temperature=0.7
            )
            return response.choices[0].message.content.strip()
        except:
            return "people connection communication"
    
    def _generate_part1(self, theme: str, today: datetime) -> tuple:
        """記事の前半部分を生成（タイトル〜解決策2）"""
        system_prompt = """あなたは人間関係の専門家であり、プロのブログライターです。
読者の心に響く、実用的で科学的根拠に基づいた記事を書いてください。

【文体】
- 親しみやすく、温かみのある「です・ます」調
- 読者に直接語りかける表現（「あなたは〜」「〜ですよね」）

【必須要素】
- 具体的な会話例を含める
- 「良い例」と「悪い例」の比較
- 心理学や研究の引用

見出しはMarkdown形式（## と ###）で書いてください。"""

        user_prompt = f"""以下のテーマで記事の【前半部分】を書いてください。

テーマ: {theme}

【書く内容】
1. 【タイトル】魅力的なタイトルを付ける
2. ## はじめに
   - 読者の悩みに深く共感する導入（600文字以上書く）
   - 「こんな経験はありませんか？」という問いかけ
   - この記事を読むメリット
3. ## なぜこの問題が起こるのか
   - 心理学的な背景の解説（700文字以上書く）
   - 具体的な失敗例
4. ## 解決策1：具体的な方法名を入れる
   - 具体的な方法の説明（800文字以上書く）
   - 会話例（良い例・悪い例）
5. ## 解決策2：具体的な方法名を入れる
   - 具体的な方法の説明（800文字以上書く）
   - 会話例（良い例・悪い例）

【重要】見出しには文字数を書かないでください。見出しは内容を表すものにしてください。
各セクションを詳しく書いて、合計3000文字以上になるようにしてください。"""

        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=5000,
            temperature=0.8
        )
        
        content = response.choices[0].message.content
        
        # タイトルを抽出
        lines = content.split('\n')
        title = ""
        content_lines = []
        
        for line in lines:
            if line.startswith("【タイトル】"):
                title = line.replace("【タイトル】", "").strip()
            elif line.startswith("# ") and not title:
                title = line.replace("# ", "").strip()
            else:
                content_lines.append(line)
        
        part1_content = '\n'.join(content_lines).strip()
        
        if not title:
            title = theme
        
        return title, part1_content
    
    def _generate_part2(self, theme: str, title: str, part1_summary: str) -> str:
        """記事の後半部分を生成（解決策3〜まとめ）"""
        system_prompt = """あなたは人間関係の専門家であり、プロのブログライターです。
記事の後半部分を書いてください。前半部分との一貫性を保ってください。

【文体】
- 親しみやすく、温かみのある「です・ます」調
- 読者に直接語りかける表現

【必須要素】
- 具体的な会話例
- 実践的なアドバイス
- 励ましのメッセージ

見出しはMarkdown形式（## と ###）で書いてください。"""

        user_prompt = f"""記事の【後半部分】を書いてください。

テーマ: {theme}
タイトル: {title}

前半で書いた内容の要約:
{part1_summary[:500]}

【書く内容】
1. ## 解決策3：具体的な方法名を入れる
   - 具体的な方法の説明（800文字以上書く）
   - 会話例（良い例・悪い例）
2. ## 解決策4：具体的な方法名を入れる
   - 具体的な方法の説明（600文字以上書く）
   - 実践のポイント
3. ## 今日からできる実践のコツ
   - 日常で使える簡単なテクニック3〜5つ（600文字以上書く）
   - ステップバイステップの説明
4. ## まとめ
   - 記事の要点のおさらい（500文字以上書く）
   - 読者への励ましのメッセージ
   - 次のアクションの提案

【重要】見出しには文字数を書かないでください。見出しは内容を表すものにしてください。
各セクションを詳しく書いて、合計2500文字以上になるようにしてください。"""

        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=5000,
            temperature=0.8
        )
        
        return response.choices[0].message.content.strip()
    
    def generate_article(self) -> dict:
        """記事を生成（2パート方式で5000-6000文字を確保）"""
        history = self.load_post_history()
        max_retries = 5
        
        for attempt in range(max_retries):
            print(f"\n📝 記事生成 試行 {attempt + 1}/{max_retries}")
            
            # ユニークなテーマを選択
            theme = self.generate_unique_theme(history)
            today = datetime.now()
            date_str = today.strftime("%Y-%m-%d")
            
            print(f"🎯 テーマ: {theme}")
            
            try:
                # パート1を生成
                print("📄 パート1（前半）を生成中...")
                title, part1 = self._generate_part1(theme, today)
                print(f"   パート1: {len(part1)}文字")
                
                # パート2を生成
                print("📄 パート2（後半）を生成中...")
                part2 = self._generate_part2(theme, title, part1)
                print(f"   パート2: {len(part2)}文字")
                
                # 結合
                content = part1 + "\n\n" + part2
                char_count = len(content)
                print(f"📊 合計文字数: {char_count}文字")
                
                # 文字数チェック（3000文字以上で許容）
                if char_count < 3000:
                    print(f"⚠️ 文字数不足 ({char_count}字)、再生成します...")
                    continue
                
                # 重複チェック
                if self.is_duplicate(title, content, history):
                    print(f"⚠️ 重複検出、再生成します...")
                    continue
                
                # 画像を取得
                image_path, photo_credit = self.generate_image_from_unsplash(theme)
                
                # スラッグを生成
                slug = date_str
                
                # 履歴に追加
                history.append({
                    "title": title,
                    "theme": theme,
                    "date": date_str,
                    "preview": content[:500],
                    "hash": hashlib.md5(content.encode()).hexdigest()
                })
                self.save_post_history(history)
                
                print(f"✅ 記事生成成功！")
                print(f"📌 タイトル: {title}")
                
                return {
                    "title": title,
                    "content": content,
                    "theme": theme,
                    "date": date_str,
                    "slug": slug,
                    "image": image_path,
                    "photo_credit": photo_credit,
                    "char_count": char_count
                }
                
            except Exception as e:
                print(f"⚠️ 生成エラー: {e}")
                import traceback
                traceback.print_exc()
                continue
        
        raise Exception("記事生成に失敗しました（最大試行回数超過）")
    
    def save_article(self, article: dict):
        """記事をMarkdownファイルとして保存"""
        POSTS_DIR.mkdir(parents=True, exist_ok=True)
        
        filename = f"{article['slug']}.md"
        filepath = POSTS_DIR / filename
        
        # フロントマター
        frontmatter = f"""---
title: "{article['title']}"
date: "{article['date']}"
theme: "{article['theme']}"
image: "{article.get('image', '')}"
photographer: "{article.get('photo_credit', {}).get('photographer', '') if article.get('photo_credit') else ''}"
photoLink: "{article.get('photo_credit', {}).get('link', '') if article.get('photo_credit') else ''}"
charCount: {article['char_count']}
---

"""
        
        full_content = frontmatter + article['content']
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(full_content)
        
        print(f"💾 記事を保存しました: {filepath}")
        return filepath


def send_discord_notification(article: dict):
    """Discord Webhookで記事生成通知を送信"""
    webhook_url = os.getenv("DISCORD_WEBHOOK_URL")
    
    if not webhook_url:
        print("⚠️ DISCORD_WEBHOOK_URLが設定されていません。通知をスキップします。")
        return False
    
    try:
        # 記事のプレビュー（最初の200文字）
        preview = article['content'][:200].replace('\n', ' ').strip() + "..."
        
        # Discord Embed形式のメッセージ
        embed = {
            "title": "📝 新しい記事が生成されました！",
            "color": 5814783,  # 紫色
            "fields": [
                {
                    "name": "📌 タイトル",
                    "value": article['title'],
                    "inline": False
                },
                {
                    "name": "🎯 テーマ",
                    "value": article['theme'],
                    "inline": True
                },
                {
                    "name": "📊 文字数",
                    "value": f"{article['char_count']:,}字",
                    "inline": True
                },
                {
                    "name": "📅 日付",
                    "value": article['date'],
                    "inline": True
                },
                {
                    "name": "📖 プレビュー",
                    "value": preview,
                    "inline": False
                }
            ],
            "footer": {
                "text": "noteへの投稿をお忘れなく！"
            },
            "timestamp": datetime.utcnow().isoformat()
        }
        
        # ブログへのリンクを追加
        blog_post_url = f"{BLOG_URL}/posts/{article['slug']}"
        
        payload = {
            "content": f"🔗 **ブログ記事**: {blog_post_url}\n\n📋 **noteへコピー用**:\n下記の記事内容をnoteに投稿してください。",
            "embeds": [embed]
        }
        
        response = requests.post(
            webhook_url,
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        response.raise_for_status()
        
        print("✅ Discord通知を送信しました")
        return True
        
    except Exception as e:
        print(f"⚠️ Discord通知エラー: {e}")
        return False


def main():
    """メイン処理"""
    print("=" * 50)
    print("🌟 人間関係ブログ 記事自動生成")
    print("=" * 50)
    
    generator = ArticleGenerator()
    
    # 記事を生成
    article = generator.generate_article()
    
    # 記事を保存
    filepath = generator.save_article(article)
    
    # Discord通知を送信
    send_discord_notification(article)
    
    print("\n" + "=" * 50)
    print("✨ 完了！")
    print(f"📄 ファイル: {filepath}")
    print(f"📊 文字数: {article['char_count']}字")
    print("=" * 50)
    
    return article


if __name__ == "__main__":
    main()
