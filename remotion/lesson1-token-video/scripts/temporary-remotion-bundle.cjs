// For local, one-shot review scripts. Do not use for persistent bundle hosting.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {bundle: remotionBundle} = require('@remotion/bundler');

const temporaryDirectories = new Set();

function removeTemporaryDirectory(directory) {
  try {
    // rm removes the public symlink itself, never the original media directory.
    fs.rmSync(directory, {recursive: true, force: true});
    temporaryDirectories.delete(directory);
  } catch (error) {
    console.warn(`Could not remove temporary bundle ${directory}: ${error.message}`);
  }
}

process.once('exit', () => {
  for (const directory of temporaryDirectories) {
    removeTemporaryDirectory(directory);
  }
});

async function bundle(options) {
  // Explicit destinations belong to the caller and must never be auto-deleted.
  if (options.outDir != null) {
    return remotionBundle(options);
  }

  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'remotion-local-review-'));
  temporaryDirectories.add(directory);
  try {
    return await remotionBundle({
      ...options,
      // Local reviews can read the original media, without copying gigabytes.
      symlinkPublicDir: options.symlinkPublicDir ?? process.platform !== 'win32',
      outDir: directory,
    });
  } catch (error) {
    removeTemporaryDirectory(directory);
    throw error;
  }
}

module.exports = {bundle};
