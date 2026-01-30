# @nishitsujiyouhei/nanobanana

🍌 Nano Banana - Gemini Pro Image Generation CLI

High-quality image generation powered by Google's Gemini Pro with 4K support.

## Installation

```bash
npm install -g @nishitsujiyouhei/nanobanana
```

Or use directly with npx:

```bash
npx @nishitsujiyouhei/nanobanana "A cat playing piano"
```

## Setup

Set your Gemini API key:

```bash
export GEMINI_API_KEY=your-api-key
```

## Usage

```bash
# Basic usage
nanobanana "A cat playing piano in watercolor style"

# With 4K resolution
nanobanana "Landscape photo" --resolution 4k

# With aspect ratio
nanobanana "Logo design" --aspect 1:1 --output ./logo.png

# All options
nanobanana "prompt" --aspect 16:9 --resolution 4k --output ./image.png
```

## Options

| Option | Description | Example |
|--------|-------------|---------|
| `--aspect <ratio>` | Aspect ratio | `1:1`, `16:9`, `9:16`, `4:3` |
| `--resolution <r>` | Resolution | `4k`, `2k`, `1k` |
| `--output <path>` | Output file path | `./image.png` |
| `--api-key <key>` | Gemini API key | |

## Output

Images are saved to `~/nanobanana-images/` by default.

## License

MIT
