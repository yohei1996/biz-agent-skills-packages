#!/usr/bin/env node
/**
 * Postinstall script - automatically installs skills to .claude/skills/
 * This only runs if REMOTION_BP_AUTO_INSTALL=1 is set
 */
const { installSkills } = require('../src/index.js');

if (process.env.REMOTION_BP_AUTO_INSTALL === '1') {
  const targetDir = process.env.INIT_CWD || process.cwd();

  installSkills(targetDir, { force: false, silent: true })
    .then(() => {
      console.log('✅ remotion-best-practices skills installed to .claude/skills/');
    })
    .catch((err) => {
      // Silent fail on postinstall
      if (process.env.DEBUG) {
        console.error('Postinstall error:', err.message);
      }
    });
}
