# @yohei1996/remotion-best-practices

📹 Remotion Best Practices - Claude Code Skill Package

A comprehensive collection of best practices, patterns, and examples for Remotion video creation in React.

## Installation

```bash
npm install @yohei1996/remotion-best-practices
```

Or install globally:

```bash
npm install -g @yohei1996/remotion-best-practices
```

## Usage

### Install skills to your project

```bash
# Install skills to .claude/skills/
npx remotion-bp install

# Force overwrite existing skills
npx remotion-bp install --force
```

After installation, the skill will be available in Claude Code as `/remotion-best-practices`.

### Browse topics

```bash
# List all topics
npx remotion-bp topics

# Show specific topic
npx remotion-bp show animations
npx remotion-bp show transitions
```

## Available Topics

- **3d** - 3D content with Three.js and React Three Fiber
- **animations** - Fundamental animation techniques
- **assets** - Importing images, videos, audio, and fonts
- **audio** - Audio handling, volume, speed, pitch
- **charts** - Chart and data visualization patterns
- **compositions** - Defining compositions and stills
- **fonts** - Loading Google Fonts and local fonts
- **transitions** - Scene transition patterns
- **text-animations** - Typography and text animation
- **timing** - Interpolation curves, easing, spring
- **videos** - Video embedding, trimming, looping
- And many more...

## As a Claude Code Skill

Once installed, you can use the skill in Claude Code:

```
/remotion-best-practices
```

Claude will have access to all the best practices and can help you with:
- Animation patterns and techniques
- Component composition
- Performance optimization
- Scene transitions
- Text and chart animations

## License

MIT
