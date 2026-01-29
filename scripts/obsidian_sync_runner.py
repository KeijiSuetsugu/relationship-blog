#!/usr/bin/env python3
"""
Obsidian同期ランナー
LaunchAgentから直接呼び出されるエントリーポイント
Git pull + Obsidian同期を実行
"""

import os
import sys
import subprocess
from datetime import datetime
from pathlib import Path

# ログ設定
LOG_DIR = Path.home() / ".logs" / "relationship-blog"
LOG_DIR.mkdir(parents=True, exist_ok=True)
LOG_FILE = LOG_DIR / f"sync_{datetime.now().strftime('%Y-%m-%d')}.log"

def log(message: str):
    """ログ出力"""
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    log_message = f"[{timestamp}] {message}"
    print(log_message)
    with open(LOG_FILE, 'a', encoding='utf-8') as f:
        f.write(log_message + '\n')

def main():
    log("=" * 50)
    log("🚀 Obsidian同期開始")
    log("=" * 50)
    
    project_dir = Path(__file__).parent.parent
    os.chdir(project_dir)
    
    # Git pull
    log("📥 Git pull実行中...")
    try:
        result = subprocess.run(
            ['git', 'pull', 'origin', 'main'],
            capture_output=True,
            text=True,
            cwd=project_dir
        )
        log(f"Git pull: {result.stdout.strip()}")
        if result.returncode != 0:
            log(f"⚠️ Git pullエラー: {result.stderr}")
    except Exception as e:
        log(f"❌ Git pullエラー: {e}")
    
    # Obsidian同期
    log("📚 Obsidianに同期中...")
    try:
        # sync_to_obsidian.pyをインポートして実行
        sys.path.insert(0, str(project_dir / 'scripts'))
        from sync_to_obsidian import sync_articles
        sync_articles()
    except Exception as e:
        log(f"❌ 同期エラー: {e}")
        import traceback
        log(traceback.format_exc())
    
    log("✅ 完了")
    log("")
    
    # 古いログを削除（30日以上）
    for old_log in LOG_DIR.glob("sync_*.log"):
        if (datetime.now() - datetime.fromtimestamp(old_log.stat().st_mtime)).days > 30:
            old_log.unlink()

if __name__ == "__main__":
    main()
