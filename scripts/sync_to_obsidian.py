#!/usr/bin/env python3
"""
ブログ記事をObsidian Vaultに同期するスクリプト
GitHubリポジトリの記事をローカルのObsidian Vaultにコピーします
"""

import os
import re
import shutil
from pathlib import Path
from datetime import datetime

# パス設定
PROJECT_ROOT = Path(__file__).parent.parent
POSTS_DIR = PROJECT_ROOT / "content" / "posts"
OBSIDIAN_VAULT_PATH = Path("/Users/keiji/Desktop/Obsidian/06_blog")
BLOG_URL = "https://ennekrelationship.netlify.app"


def parse_frontmatter(content: str) -> tuple:
    """フロントマターを解析してメタデータと本文を分離"""
    if not content.startswith('---'):
        return {}, content
    
    # フロントマターの終了位置を見つける
    end_match = re.search(r'\n---\n', content[3:])
    if not end_match:
        return {}, content
    
    frontmatter_text = content[3:end_match.start() + 3]
    body = content[end_match.end() + 3 + 1:]
    
    # フロントマターを解析
    metadata = {}
    for line in frontmatter_text.split('\n'):
        if ':' in line:
            key, value = line.split(':', 1)
            value = value.strip().strip('"').strip("'")
            metadata[key.strip()] = value
    
    return metadata, body


def convert_to_obsidian_format(filepath: Path) -> tuple:
    """ブログ記事をObsidian形式に変換"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    metadata, body = parse_frontmatter(content)
    
    title = metadata.get('title', filepath.stem)
    date = metadata.get('date', '')
    theme = metadata.get('theme', '')
    char_count = metadata.get('charCount', '0')
    category = metadata.get('category', 'relationship')
    category_name = metadata.get('categoryName', '人間関係')
    slug = filepath.stem
    
    # カテゴリに応じたタグを設定
    category_tags = {
        'relationship': '人間関係',
        'health': '健康',
        'exercise': '運動'
    }
    tag = category_tags.get(category, '人間関係')
    
    # Obsidian用フロントマター
    obsidian_frontmatter = f"""---
title: "{title}"
date: {date}
theme: "{theme}"
category: "{category_name}"
charCount: {char_count}
tags:
  - ブログ
  - {tag}
  - 自動生成
blogUrl: "{BLOG_URL}/blog/{slug}"
synced: "{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
---

"""
    
    # コンテンツを組み立て
    full_content = obsidian_frontmatter + f"# {title}\n\n" + body
    
    return title, date, full_content


def sync_articles():
    """記事をObsidian Vaultに同期"""
    print("=" * 50)
    print("📚 ブログ記事をObsidian Vaultに同期")
    print("=" * 50)
    
    # ディレクトリ確認
    if not POSTS_DIR.exists():
        print(f"❌ 記事ディレクトリが見つかりません: {POSTS_DIR}")
        return
    
    OBSIDIAN_VAULT_PATH.mkdir(parents=True, exist_ok=True)
    
    # 既存のObsidian記事を確認
    existing_files = set()
    for f in OBSIDIAN_VAULT_PATH.glob("*.md"):
        existing_files.add(f.stem)
    
    # 記事を同期
    synced_count = 0
    skipped_count = 0
    
    for post_file in sorted(POSTS_DIR.glob("*.md")):
        try:
            title, date, content = convert_to_obsidian_format(post_file)
            
            # ファイル名を生成
            safe_title = title.replace('/', '').replace('\\', '').replace(':', '').replace('*', '').replace('?', '').replace('"', '').replace('<', '').replace('>', '').replace('|', '')
            filename = f"{date}_{safe_title[:50]}.md"
            dest_path = OBSIDIAN_VAULT_PATH / filename
            
            # 既に存在する場合はスキップ（上書きしない）
            if dest_path.exists():
                skipped_count += 1
                continue
            
            # ファイルを保存
            with open(dest_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print(f"✅ 同期: {filename}")
            synced_count += 1
            
        except Exception as e:
            print(f"⚠️ エラー ({post_file.name}): {e}")
    
    print()
    print("=" * 50)
    print(f"✨ 同期完了！")
    print(f"   新規同期: {synced_count}件")
    print(f"   スキップ: {skipped_count}件")
    print(f"   保存先: {OBSIDIAN_VAULT_PATH}")
    print("=" * 50)


if __name__ == "__main__":
    sync_articles()
