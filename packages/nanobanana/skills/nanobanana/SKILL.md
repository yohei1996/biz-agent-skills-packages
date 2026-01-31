---
name: nanobanana
description: Gemini Pro画像生成（高品質・4K対応）。「画像生成」「画像作成」「イラスト作成」「〜の絵」と言われたら使用。
argument-hint: [prompt]
---

# Nano Banana 画像生成

Gemini Proを使用して高品質な画像を生成する。

## 実行方法

```bash
node .claude/skills/nanobanana/scripts/generate-image.js "$ARGUMENTS"
```

APIキーはVSCode設定（`bizAgent-task-kanban.geminiApiKey`）または環境変数から自動取得。

## オプション

| オプション | 説明 | 例 |
|-----------|------|-----|
| --aspect | アスペクト比 | --aspect 16:9 |
| --resolution | 解像度（4k,2k,1k） | --resolution 4k |
| --output | 出力先パス | --output ./image.png |

## 使用例

```bash
# 基本（Proモデル）
node .claude/skills/nanobanana/scripts/generate-image.js "猫がピアノを弾いている水彩画"

# 4K高解像度
node .claude/skills/nanobanana/scripts/generate-image.js "風景写真" --resolution 4k

# アスペクト比指定
node .claude/skills/nanobanana/scripts/generate-image.js "ロゴデザイン" --aspect 1:1 --output ./logo.png
```

## 出力先

デフォルト: `~/nanobanana-images/`
