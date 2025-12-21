#!/usr/bin/env python3
"""
人間関係ブログ記事自動生成スクリプト
- 5000〜6000字の実用的な記事
- Unsplash無料画像
- 重複防止機能
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
    
    def generate_article(self) -> dict:
        """記事を生成"""
        history = self.load_post_history()
        max_retries = 5
        
        for attempt in range(max_retries):
            print(f"\n📝 記事生成 試行 {attempt + 1}/{max_retries}")
            
            # ユニークなテーマを選択
            theme = self.generate_unique_theme(history)
            today = datetime.now()
            date_str = today.strftime("%Y-%m-%d")
            
            print(f"🎯 テーマ: {theme}")
            
            # 記事を生成
            system_prompt = """あなたは人間関係の専門家であり、ブログライターです。
読者の心に響く、実用的で科学的根拠に基づいた記事を書いてください。

【記事の特徴】
- 5500〜6000文字（必ずこの範囲に収めてください）
- 読みやすい見出し構成（h2, h3を使用）
- 具体的な例や会話例を含める
- 実践的なアドバイスを提供
- 共感を得られる導入文
- 行動を促す結論

【文体】
- 親しみやすく、専門的すぎない
- 「です・ます」調
- 読者に語りかけるような温かみ

【構成】
1. 導入（読者の悩みに共感）
2. 問題の本質を解説
3. 解決策を具体的に提示（3〜5つ）
4. 実践例・会話例
5. まとめと励ましのメッセージ

【禁止事項】
- 抽象的すぎる表現
- ネガティブすぎる内容
- 過度な専門用語"""

            user_prompt = f"""以下のテーマで記事を書いてください：

テーマ: {theme}

【重要】
- 5500〜6000文字で書いてください
- 今日は{today.strftime('%Y年%m月%d日')}です
- このテーマについて、他の記事とは異なる独自の視点や新しい切り口を含めてください
- 具体的なシチュエーションや会話例を必ず入れてください

記事タイトルは【タイトル】で始め、本文をMarkdown形式で書いてください。"""

            try:
                response = self.client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    max_tokens=8000,
                    temperature=0.8
                )
                
                full_text = response.choices[0].message.content
                
                # タイトルと本文を分離
                lines = full_text.split('\n')
                title = ""
                content_lines = []
                
                for i, line in enumerate(lines):
                    if line.startswith("【タイトル】"):
                        title = line.replace("【タイトル】", "").strip()
                    elif line.startswith("# "):
                        title = line.replace("# ", "").strip()
                    else:
                        content_lines.append(line)
                
                content = '\n'.join(content_lines).strip()
                
                # タイトルが見つからない場合
                if not title:
                    title = theme
                
                # 文字数チェック
                char_count = len(content)
                print(f"📊 文字数: {char_count}文字")
                
                if char_count < 4500:
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
photographer: "{article.get('photo_credit', {}).get('photographer', '')}"
photoLink: "{article.get('photo_credit', {}).get('link', '')}"
charCount: {article['char_count']}
---

"""
        
        full_content = frontmatter + article['content']
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(full_content)
        
        print(f"💾 記事を保存しました: {filepath}")
        return filepath


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
    
    print("\n" + "=" * 50)
    print("✨ 完了！")
    print(f"📄 ファイル: {filepath}")
    print(f"📊 文字数: {article['char_count']}字")
    print("=" * 50)
    
    return article


if __name__ == "__main__":
    main()

