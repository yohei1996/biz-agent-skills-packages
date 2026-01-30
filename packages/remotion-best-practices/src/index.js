const fs = require('fs');
const path = require('path');

/**
 * Get the path to the bundled skills directory
 */
function getSkillsPath() {
  return path.join(__dirname, '..', 'skills', 'remotion-best-practices');
}

/**
 * Get list of available topics
 */
function getTopics() {
  const rulesDir = path.join(getSkillsPath(), 'rules');
  if (!fs.existsSync(rulesDir)) {
    throw new Error('Skills directory not found');
  }

  return fs
    .readdirSync(rulesDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace('.md', ''));
}

/**
 * Show all available topics
 */
async function showTopics() {
  const topics = getTopics();
  console.log('📚 Available Topics:\n');
  topics.forEach((topic) => {
    console.log(`  - ${topic}`);
  });
  console.log(`\nUse "remotion-bp show <topic>" to view a specific topic.`);
}

/**
 * Show a specific topic
 */
async function showTopic(topic) {
  const topicPath = path.join(getSkillsPath(), 'rules', `${topic}.md`);
  if (!fs.existsSync(topicPath)) {
    const topics = getTopics();
    console.error(`Topic "${topic}" not found.`);
    console.error(`Available topics: ${topics.join(', ')}`);
    throw new Error(`Topic not found: ${topic}`);
  }

  const content = fs.readFileSync(topicPath, 'utf-8');
  console.log(content);
}

/**
 * Recursively copy a directory
 */
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Install skills to target directory's .claude/skills/
 */
async function installSkills(targetDir, options = {}) {
  const { force = false, silent = false } = options;

  const skillsSource = getSkillsPath();
  const skillsTarget = path.join(targetDir, '.claude', 'skills', 'remotion-best-practices');

  if (!fs.existsSync(skillsSource)) {
    throw new Error('Skills source directory not found');
  }

  if (fs.existsSync(skillsTarget)) {
    if (!force) {
      if (!silent) {
        console.log('⚠️  Skills already exist at', skillsTarget);
        console.log('   Use --force to overwrite.');
      }
      return;
    }
    fs.rmSync(skillsTarget, { recursive: true });
  }

  copyDir(skillsSource, skillsTarget);

  if (!silent) {
    console.log('✅ Skills installed to:', skillsTarget);
    console.log('\n📝 The skill is now available in Claude Code.');
    console.log('   Use "/remotion-best-practices" to activate it.');
  }
}

module.exports = {
  getSkillsPath,
  getTopics,
  showTopics,
  showTopic,
  installSkills,
};
