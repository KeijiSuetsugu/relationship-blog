#!/bin/bash
# Obsidian自動同期スクリプト
# GitHubから最新の記事を取得してObsidianに同期

LOG_DIR="$HOME/.logs/relationship-blog"
LOG_FILE="$LOG_DIR/sync_$(date +%Y-%m-%d).log"
PROJECT_DIR="/Users/keiji/Desktop/開発/relationship-blog"

# ログディレクトリ作成
mkdir -p "$LOG_DIR"

echo "======================================" >> "$LOG_FILE"
echo "📅 $(date '+%Y-%m-%d %H:%M:%S')" >> "$LOG_FILE"
echo "======================================" >> "$LOG_FILE"

# プロジェクトディレクトリに移動
cd "$PROJECT_DIR" || exit 1

# 最新の変更を取得
echo "📥 Git pull実行中..." >> "$LOG_FILE"
git pull origin main >> "$LOG_FILE" 2>&1

# Obsidianに同期
echo "📚 Obsidianに同期中..." >> "$LOG_FILE"
/usr/bin/python3 scripts/sync_to_obsidian.py >> "$LOG_FILE" 2>&1

echo "✅ 完了" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

# 古いログを削除（30日以上）
find "$LOG_DIR" -name "sync_*.log" -mtime +30 -delete
