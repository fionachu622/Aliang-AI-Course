const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const assert = require('node:assert/strict');
const ts = require('typescript');
async function main() {
const media = await import('@remotion/media');
const {Video} = media;
const file = path.resolve(__dirname, '../src/agent-full/PreviewMedia.tsx');
const compiled = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
  compilerOptions: {jsx: ts.JsxEmit.React, module: ts.ModuleKind.CommonJS, esModuleInterop: true},
}).outputText;
const loaded = new Module(file, module);
loaded.paths = Module._nodeModulePaths(path.dirname(file));
const originalRequire = loaded.require.bind(loaded);
loaded.require = (id) => id === '@remotion/media' ? media : originalRequire(id);
loaded._compile(compiled, file);
const {CourseVideo} = loaded.exports;
const cuts = require('../src/agent-full/recordings.timeline.json');
for (const cut of cuts) {
  const props = {src: cut.source, trimBefore: Math.round(cut.sourceStart * 30), trimAfter: Math.round(cut.sourceEnd * 30), playbackRate: cut.playbackRate, muted: true, objectFit: 'contain'};
  const element = CourseVideo(props);
  assert.equal(element.type, Video, `${cut.id}: source-frame trim requires @remotion/media Video`);
  for (const key of Object.keys(props)) assert.equal(element.props[key], props[key], `${cut.id}: ${key}`);
}
console.log(`Passed: all ${cuts.length} preview clips retain the correct Video implementation, source trim and playback rate.`);

}
main().catch(error => {console.error(error);process.exitCode = 1;});
