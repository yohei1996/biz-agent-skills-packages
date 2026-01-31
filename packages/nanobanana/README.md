# @yohei1996/nanobanana

🍌 Nano Banana - Gemini Pro画像生成 CLI & Claude Codeスキル

Gemini Proを使用した高品質画像生成（4K対応）

## インストール

### スキルとしてインストール（推奨）

```bash
# プロジェクトディレクトリで実行
npx @yohei1996/nanobanana install
```

これで `.claude/skills/nanobanana/` にスキルがインストールされます。

### グローバルインストール

```bash
npm install -g @yohei1996/nanobanana
```

## セットアップ

Gemini APIキーを設定:

```bash
export GEMINI_API_KEY=your-api-key
```

または VSCode/Cursor設定で `bizAgent-task-kanban.geminiApiKey` を設定。

## 使い方

### Claude Codeスキルとして使用

```
/nanobanana 猫がピアノを弾いている水彩画
```

### CLIから直接実行

```bash
# 基本
npx @yohei1996/nanobanana "A cat playing piano in watercolor style"

# 4K解像度
npx @yohei1996/nanobanana "Landscape photo" --resolution 4k

# アスペクト比指定
npx @yohei1996/nanobanana "Logo design" --aspect 1:1 --output ./logo.png
```

## オプション

| オプション | 説明 | 例 |
|-----------|------|-----|
| `install [dir]` | スキルをインストール | `install .` |
| `--aspect <ratio>` | アスペクト比 | `1:1`, `16:9`, `9:16`, `4:3` |
| `--resolution <r>` | 解像度 | `4k`, `2k`, `1k` |
| `--output <path>` | 出力先パス | `./image.png` |
| `--api-key <key>` | Gemini APIキー | |

## 出力先

デフォルト: `~/nanobanana-images/`

## License

MIT
