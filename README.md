# BizAgent Skills Packages

A monorepo containing CLI tools and Claude Code skills.

## Packages

| Package | Description | Install |
|---------|-------------|---------|
| [@nishitsujiyouhei/nanobanana](./packages/nanobanana) | Gemini Pro image generation CLI | `npm i -g @nishitsujiyouhei/nanobanana` |
| [@nishitsujiyouhei/remotion-best-practices](./packages/remotion-best-practices) | Remotion best practices skill | `npm i @nishitsujiyouhei/remotion-best-practices` |

## Usage

### Nanobanana - Image Generation

```bash
# Generate an image
npx @nishitsujiyouhei/nanobanana "A beautiful sunset over mountains"

# With 4K resolution
npx @nishitsujiyouhei/nanobanana "Landscape" --resolution 4k

# With custom aspect ratio
npx @nishitsujiyouhei/nanobanana "Logo" --aspect 1:1 --output ./logo.png
```

### Remotion Best Practices - Claude Code Skill

```bash
# Install the skill to your project
npx @nishitsujiyouhei/remotion-best-practices install

# List available topics
npx @nishitsujiyouhei/remotion-best-practices topics

# Show a specific topic
npx @nishitsujiyouhei/remotion-best-practices show animations
```

## Development

```bash
# Install dependencies
npm install

# Run build for all packages
npm run build
```

## License

MIT
