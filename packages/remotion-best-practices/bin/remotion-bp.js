#!/usr/bin/env node
const { installSkills, showTopics, showTopic, getSkillsPath } = require('../src/index.js');

const args = process.argv.slice(2);
const command = args[0];

if (!command || command === '--help' || command === '-h') {
  console.log(`
📹 Remotion Best Practices - Claude Code Skill Package

Usage: remotion-bp <command> [options]

Commands:
  install [--force]    Install skills to .claude/skills/ directory
  topics               List all available topics
  show <topic>         Show a specific topic (e.g., animations, transitions)
  path                 Show the path to the skills directory

Examples:
  remotion-bp install              Install skills to current project
  remotion-bp install --force      Overwrite existing skills
  remotion-bp topics               List all topics
  remotion-bp show animations      Show animations topic
  remotion-bp path                 Show skills directory path
`);
  process.exit(0);
}

async function main() {
  try {
    switch (command) {
      case 'install':
        const force = args.includes('--force');
        await installSkills(process.cwd(), { force });
        break;

      case 'topics':
        await showTopics();
        break;

      case 'show':
        const topic = args[1];
        if (!topic) {
          console.error('Error: Please specify a topic. Run "remotion-bp topics" to see available topics.');
          process.exit(1);
        }
        await showTopic(topic);
        break;

      case 'path':
        console.log(getSkillsPath());
        break;

      default:
        console.error(`Unknown command: ${command}`);
        console.error('Run "remotion-bp --help" for usage information.');
        process.exit(1);
    }
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();
