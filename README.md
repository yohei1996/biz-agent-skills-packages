# BizAgent Skills Packages

A monorepo containing CLI tools and Claude Code skills.

## Packages

| Package | Description | Install |
|---------|-------------|---------|
| [@yohei1996/nanobanana](./packages/nanobanana) | Gemini Pro image generation CLI | `npm i -g @yohei1996/nanobanana` |
| [@yohei1996/remotion-best-practices](./packages/remotion-best-practices) | Remotion best practices skill | `npm i @yohei1996/remotion-best-practices` |

## Usage

### Nanobanana - Image Generation

```bash
# Generate an image
npx @yohei1996/nanobanana "A beautiful sunset over mountains"

# With 4K resolution
npx @yohei1996/nanobanana "Landscape" --resolution 4k

# With custom aspect ratio
npx @yohei1996/nanobanana "Logo" --aspect 1:1 --output ./logo.png
```

### Remotion Best Practices - Claude Code Skill

```bash
# Install the skill to your project
npx @yohei1996/remotion-best-practices install

# List available topics
npx @yohei1996/remotion-best-practices topics

# Show a specific topic
npx @yohei1996/remotion-best-practices show animations
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
