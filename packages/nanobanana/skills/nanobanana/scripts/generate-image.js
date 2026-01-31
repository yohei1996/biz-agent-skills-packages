#!/usr/bin/env node
/**
 * Gemini画像生成スクリプト
 * - Flash: gemini-2.0-flash-exp-image-generation（高速）
 * - Pro: gemini-2.0-flash-preview-image-generation（高品質・4K）
 *
 * 使用例:
 *   node generate-image.js "猫" --output ./cat.png
 *   node generate-image.js "風景" --pro --resolution 4k
 */

const fs = require("fs");
const path = require("path");

const MODELS = {
  flash: "gemini-2.0-flash-exp-image-generation",
  pro: "gemini-3-pro-image-preview",
};

function getGeminiApiKey() {
  // 1. VSCode/Cursor設定から取得
  const os = require("os");
  const settingsPaths = [
    path.join(os.homedir(), "Library/Application Support/Code/User/settings.json"),
    path.join(os.homedir(), "Library/Application Support/Cursor/User/settings.json"),
  ];

  for (const settingsPath of settingsPaths) {
    if (fs.existsSync(settingsPath)) {
      try {
        const settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
        const apiKey = settings["bizAgent-task-kanban.geminiApiKey"];
        if (apiKey) return apiKey;
      } catch {}
    }
  }

  // 2. 環境変数から取得
  const envKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (envKey) return envKey;

  throw new Error("Gemini APIキーが見つかりません。VSCode設定またはGEMINI_API_KEY環境変数を設定してください。");
}

async function generateImage(options) {
  const { prompt, aspectRatio, outputPath, model = "flash", resolution } = options;

  const apiKey = getGeminiApiKey();

  const modelId = MODELS[model] || MODELS.flash;
  const modelLabel = model === "pro" ? "🚀 Pro" : "⚡ Flash";

  console.log(`${modelLabel} 画像生成中: "${prompt.substring(0, 50)}..."`);
  if (aspectRatio) console.log(`📐 アスペクト比: ${aspectRatio}`);
  if (resolution) console.log(`📏 解像度: ${resolution}`);

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;

  // プロンプトの強化（Proモデル用）
  let enhancedPrompt = prompt;
  if (model === "pro") {
    if (prompt.length < 50) {
      enhancedPrompt = `Create a high-quality, detailed image: ${prompt}. Pay attention to composition, lighting, and fine details.`;
    }
    if (resolution === "4k") {
      enhancedPrompt += " Render at maximum 4K quality with exceptional detail.";
    }
  }

  const requestBody = {
    contents: [{ parts: [{ text: enhancedPrompt }] }],
    generationConfig: {
      responseModalities: ["TEXT", "IMAGE"],
    },
  };

  // アスペクト比とimageConfigの設定
  if (aspectRatio || resolution) {
    requestBody.generationConfig.imageConfig = {};
    if (aspectRatio) {
      requestBody.generationConfig.imageConfig.aspectRatio = aspectRatio;
    }
    if (resolution) {
      const sizeMap = { "4k": "4K", "2k": "2K", "1k": "1K", high: "1K" };
      requestBody.generationConfig.imageConfig.imageSize = sizeMap[resolution.toLowerCase()] || "1K";
    }
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();

  if (!result.candidates || !result.candidates[0]?.content?.parts) {
    console.error("APIレスポンス:", JSON.stringify(result, null, 2));
    throw new Error("画像が生成されませんでした");
  }

  const images = [];
  for (const part of result.candidates[0].content.parts) {
    if (part.inlineData && part.inlineData.mimeType?.startsWith("image/")) {
      images.push({
        data: Buffer.from(part.inlineData.data, "base64"),
        mimeType: part.inlineData.mimeType,
      });
    }
  }

  if (images.length === 0) {
    console.error("パーツ:", JSON.stringify(result.candidates[0].content.parts, null, 2));
    throw new Error("画像が生成されませんでした（画像パーツなし）");
  }

  // 出力先ディレクトリの決定
  const outputDir =
    outputPath && fs.statSync(outputPath, { throwIfNoEntry: false })?.isDirectory()
      ? outputPath
      : outputPath
        ? path.dirname(outputPath)
        : path.join(process.env.HOME, "nanobanana-images");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const savedPaths = [];
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const prefix = model === "pro" ? "pro_" : "";

  for (let i = 0; i < images.length; i++) {
    const ext = images[i].mimeType === "image/png" ? "png" : "jpg";
    const filename =
      outputPath && !fs.statSync(outputPath, { throwIfNoEntry: false })?.isDirectory()
        ? path.basename(outputPath)
        : `${prefix}image_${timestamp}_${i + 1}.${ext}`;
    const fullPath = path.join(outputDir, filename);

    fs.writeFileSync(fullPath, images[i].data);
    savedPaths.push(fullPath);
    console.log(`✅ 保存: ${fullPath}`);
  }

  return savedPaths;
}

// CLI実行
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log(`使用法: node generate-image.js <prompt> [options]

オプション:
  --pro            Proモデル使用（高品質・4K対応）
  --aspect <ratio> アスペクト比（1:1, 16:9, 9:16, 4:3, 3:4など）
  --resolution <r> 解像度（4k, 2k, 1k, high）※Proモデル推奨
  --output <path>  出力先パス

例:
  node generate-image.js "猫がピアノを弾いている"
  node generate-image.js "風景写真" --pro --resolution 4k
  node generate-image.js "ロゴ" --aspect 1:1 --output ./logo.png
`);
    process.exit(1);
  }

  const options = { prompt: "", model: "pro" }; // デフォルトでProモデルを使用
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--pro") {
      options.model = "pro";
    } else if (args[i] === "--aspect" && args[i + 1]) {
      options.aspectRatio = args[++i];
    } else if (args[i] === "--resolution" && args[i + 1]) {
      options.resolution = args[++i];
    } else if (args[i] === "--output" && args[i + 1]) {
      options.outputPath = args[++i];
    } else if (!args[i].startsWith("--")) {
      options.prompt = args[i];
    }
  }

  generateImage(options)
    .then((paths) => console.log("\n生成完了:", paths.join(", ")))
    .catch((err) => {
      console.error("エラー:", err.message);
      process.exit(1);
    });
}

module.exports = { generateImage };
