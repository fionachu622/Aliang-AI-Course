const fs = require('node:fs');
const path = require('node:path');
const {EventEmitter} = require('node:events');

// Resolve the current checkout before Remotion derives absolute cache/media paths.
process.chdir(fs.realpathSync(path.join(__dirname, '..')));

// The managed Codex macOS sandbox reports support for recursive fs.watch(),
// but creating a directory watcher fails asynchronously with EMFILE. Remotion
// uses one for public/, so disable that asset hot-reload watcher in the sandbox.
if (process.env.CODEX_SANDBOX) {
  const originalWatch = fs.watch;

  fs.watch = function watchWithoutUnsupportedDirectoryWatch(
    filename,
    options,
    listener,
  ) {
    if (options && typeof options === 'object' && options.recursive) {
      const watcher = new EventEmitter();
      watcher.close = () => watcher.emit('close');
      watcher.ref = () => watcher;
      watcher.unref = () => watcher;
      return watcher;
    }

    return originalWatch.call(fs, filename, options, listener);
  };
}

// The Agent course editor is part of this project and shares its editable data.
const {spawn} = require('node:child_process');
const http = require('node:http');
function startAgentEditor() {
  return new Promise((resolve) => {
    const req = http.get('http://127.0.0.1:3175/', (res) => {
      res.destroy(); resolve();
    });
    req.on('error', () => {
      const child = spawn(process.execPath, [path.join(__dirname, 'agent-whiteboard-server.cjs')], {stdio: 'inherit'});
      process.once('exit', () => child.kill());
      process.once('SIGINT', () => {child.kill(); process.exit(0);});
      process.once('SIGTERM', () => {child.kill(); process.exit(0);});
      resolve();
    });
    req.setTimeout(2000, () => req.destroy());
  });
}

process.argv.splice(2, 0, 'studio', 'src/index.ts');

const cliPackage = require.resolve('@remotion/cli/package.json');
startAgentEditor().then(() => require(path.join(path.dirname(cliPackage), 'remotion-cli.js')));
