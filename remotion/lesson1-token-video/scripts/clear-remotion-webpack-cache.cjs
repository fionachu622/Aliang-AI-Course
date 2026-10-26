const fs = require('node:fs');
const path = require('node:path');

const webpackCacheRoot = path.resolve(__dirname, '../node_modules/.cache/webpack');

if (fs.existsSync(webpackCacheRoot)) {
  for (const entry of fs.readdirSync(webpackCacheRoot)) {
    if (!entry.startsWith('remotion-')) {
      continue;
    }

    fs.rmSync(path.join(webpackCacheRoot, entry), {
      recursive: true,
      force: true,
    });
  }
}
