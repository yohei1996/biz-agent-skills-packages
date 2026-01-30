#!/usr/bin/env node
const { generateImage } = require('../src/index.js');

const args = process.argv.slice(2);

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  console.log(`
🍌 Nano Banana - Gemini Pro Image Generator

Usage: nanobanana <prompt> [options]

Options:
  --aspect <ratio>   Aspect ratio (1:1, 16:9, 9:16, 4:3, 3:4, etc.)
  --resolution <r>   Resolution (4k, 2k, 1k)
  --output <path>    Output file path
  --api-key <key>    Gemini API key (or set GEMINI_API_KEY env var)
  --help, -h         Show this help message

Examples:
  nanobanana "A cat playing piano in watercolor style"
  nanobanana "Landscape photo" --resolution 4k
  nanobanana "Logo design" --aspect 1:1 --output ./logo.png

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
