#!/usr/bin/env node
const { generateImage, installSkills } = require('../src/index.js');

const args = process.argv.slice(2);

// Handle install command
if (args[0] === 'install') {
  const targetDir = args[1] || process.cwd();
  const force = args.includes('--force') || args.includes('-f');

  installSkills(targetDir, { force })
    .then((installPath) => {
      console.log('\n使用方法: Claude Codeでスキルを発火してください');
      console.log('例: /nanobanana 猫がピアノを弾いている');
    })
    .catch((err) => {
      console.error('Error:', err.message);
      process.exit(1);
    });
  return;
}

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  console.log(`
🍌 Nano Banana - Gemini Pro Image Generator

Usage:
  nanobanana install [dir]     Install skills to .claude/skills/
  nanobanana <prompt>          Generate image directly

Install Options:
  install [dir]    Install to specified directory (default: current dir)
  --force, -f      Overwrite existing files

Generate Options:
  --aspect <ratio>   Aspect ratio (1:1, 16:9, 9:16, 4:3, 3:4, etc.)
  --resolution <r>   Resolution (4k, 2k, 1k)
  --output <path>    Output file path
  --api-key <key>    Gemini API key (or set GEMINI_API_KEY env var)
  --help, -h         Show this help message

Examples:
  # Install skills
  npx @yohei1996/nanobanana install

  # Generate image directly
  npx @yohei1996/nanobanana "A cat playing piano in watercolor style"
  npx @yohei1996/nanobanana "Landscape photo" --resolution 4k

Environment:
  GEMINI_API_KEY     Your Gemini API key
  GOOGLE_API_KEY     Alternative API key variable
`);
  process.exit(0);
}

const options = { prompt: '', model: 'pro' };

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--aspect' && args[i + 1]) {
    options.aspectRatio = args[++i];
  } else if (args[i] === '--resolution' && args[i + 1]) {
    options.resolution = args[++i];
  } else if (args[i] === '--output' && args[i + 1]) {
    options.outputPath = args[++i];
  } else if (args[i] === '--api-key' && args[i + 1]) {
    process.env.GEMINI_API_KEY = args[++i];
  } else if (!args[i].startsWith('--')) {
    options.prompt = args[i];
  }
}

if (!options.prompt) {
  console.error('Error: Please provide a prompt');
  process.exit(1);
}

generateImage(options)
  .then((paths) => console.log('\n✨ Generated:', paths.join(', ')))
  .catch((err) => {
    console.error('Error:', err.message);
    process.exit(1);
  });
