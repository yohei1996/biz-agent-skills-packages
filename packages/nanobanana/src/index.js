const fs = require('fs');
const path = require('path');

const MODELS = {
  flash: 'gemini-2.0-flash-exp-image-generation',
  pro: 'gemini-3-pro-image-preview',
};

function getGeminiApiKey() {
  // 1. Check environment variables
  const envKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (envKey) return envKey;

  // 2. Try to read from VSCode/Cursor settings (for backward compatibility)
  const os = require('os');
  const settingsPaths = [
    path.join(os.homedir(), 'Library/Application Support/Code/User/settings.json'),
    path.join(os.homedir(), 'Library/Application Support/Cursor/User/settings.json'),
  ];

  for (const settingsPath of settingsPaths) {
    if (fs.existsSync(settingsPath)) {
      try {
        const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
        const apiKey = settings['bizAgent-task-kanban.geminiApiKey'];
        if (apiKey) return apiKey;
      } catch {
        // Ignore parsing errors
      }
    }
  }

  throw new Error(
    'Gemini API key not found. Set GEMINI_API_KEY environment variable or use --api-key option.'
  );
}

async function generateImage(options) {
  const { prompt, aspectRatio, outputPath, model = 'pro', resolution } = options;

  const apiKey = getGeminiApiKey();

  const modelId = MODELS[model] || MODELS.pro;
  const modelLabel = model === 'pro' ? '🚀 Pro' : '⚡ Flash';

  console.log(`${modelLabel} Generating: "${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}"`);
  if (aspectRatio) console.log(`📐 Aspect ratio: ${aspectRatio}`);
  if (resolution) console.log(`📏 Resolution: ${resolution}`);

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;

  // Enhance prompt for Pro model
  let enhancedPrompt = prompt;
  if (model === 'pro') {
    if (prompt.length < 50) {
      enhancedPrompt = `Create a high-quality, detailed image: ${prompt}. Pay attention to composition, lighting, and fine details.`;
    }
    if (resolution === '4k') {
      enhancedPrompt += ' Render at maximum 4K quality with exceptional detail.';
    }
  }

  const requestBody = {
    contents: [{ parts: [{ text: enhancedPrompt }] }],
    generationConfig: {
      responseModalities: ['TEXT', 'IMAGE'],
    },
  };

  // Configure aspect ratio and resolution
  if (aspectRatio || resolution) {
    requestBody.generationConfig.imageConfig = {};
    if (aspectRatio) {
      requestBody.generationConfig.imageConfig.aspectRatio = aspectRatio;
    }
    if (resolution) {
      const sizeMap = { '4k': '4K', '2k': '2K', '1k': '1K', high: '1K' };
      requestBody.generationConfig.imageConfig.imageSize = sizeMap[resolution.toLowerCase()] || '1K';
    }
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();

  if (!result.candidates || !result.candidates[0]?.content?.parts) {
    throw new Error('No image generated');
  }

  const images = [];
  for (const part of result.candidates[0].content.parts) {
    if (part.inlineData && part.inlineData.mimeType?.startsWith('image/')) {
      images.push({
        data: Buffer.from(part.inlineData.data, 'base64'),
        mimeType: part.inlineData.mimeType,
      });
    }
  }

  if (images.length === 0) {
    throw new Error('No image data in response');
  }

  // Determine output directory
  const outputDir =
    outputPath && fs.statSync(outputPath, { throwIfNoEntry: false })?.isDirectory()
      ? outputPath
      : outputPath
        ? path.dirname(outputPath)
        : path.join(process.env.HOME || process.cwd(), 'nanobanana-images');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const savedPaths = [];
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const prefix = model === 'pro' ? 'pro_' : '';

  for (let i = 0; i < images.length; i++) {
    const ext = images[i].mimeType === 'image/png' ? 'png' : 'jpg';
    const filename =
      outputPath && !fs.statSync(outputPath, { throwIfNoEntry: false })?.isDirectory()
        ? path.basename(outputPath)
        : `${prefix}image_${timestamp}_${i + 1}.${ext}`;
    const fullPath = path.join(outputDir, filename);

    fs.writeFileSync(fullPath, images[i].data);
    savedPaths.push(fullPath);
    console.log(`✅ Saved: ${fullPath}`);
  }

  return savedPaths;
}

/**
 * Install nanobanana skills to target directory
 * @param {string} targetDir - Target directory (default: current working directory)
 * @param {object} options - Installation options
 * @param {boolean} options.force - Overwrite existing files
 * @param {boolean} options.silent - Suppress output
 */
async function installSkills(targetDir = process.cwd(), options = {}) {
  const { force = false, silent = false } = options;

  const skillsSourceDir = path.join(__dirname, '..', 'skills', 'nanobanana');
  const skillsTargetDir = path.join(targetDir, '.claude', 'skills', 'nanobanana');

  // Check if source exists
  if (!fs.existsSync(skillsSourceDir)) {
    throw new Error(`Skills source not found: ${skillsSourceDir}`);
  }

  // Create target directory
  if (!fs.existsSync(skillsTargetDir)) {
    fs.mkdirSync(skillsTargetDir, { recursive: true });
  }

  // Copy files recursively
  const copyDir = (src, dest) => {
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        if (!fs.existsSync(destPath)) {
          fs.mkdirSync(destPath, { recursive: true });
        }
        copyDir(srcPath, destPath);
      } else {
        if (!force && fs.existsSync(destPath)) {
          if (!silent) console.log(`⏭️  Skipping (exists): ${destPath}`);
          continue;
        }
        fs.copyFileSync(srcPath, destPath);
        if (!silent) console.log(`✅ Installed: ${destPath}`);
      }
    }
  };

  copyDir(skillsSourceDir, skillsTargetDir);

  if (!silent) {
    console.log(`\n🍌 nanobanana skills installed to: ${skillsTargetDir}`);
  }

  return skillsTargetDir;
}

module.exports = { generateImage, getGeminiApiKey, MODELS, installSkills };
