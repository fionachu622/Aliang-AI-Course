import {existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, resolve} from 'node:path';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sample = resolve(
  projectRoot,
  'public/voice-samples/voice-reference-2min.mp3',
);
const transcriptDir = resolve(projectRoot, '../../build/lesson1_video');

const rows = [
  ['voice sample', existsSync(sample)],
  ['10 transcripts', Array.from({length: 10}, (_, i) =>
    existsSync(resolve(transcriptDir, `narration_${String(i + 1).padStart(2, '0')}.txt`)),
  ).every(Boolean)],
  ['ELEVENLABS_API_KEY', Boolean(process.env.ELEVENLABS_API_KEY)],
  ['ELEVENLABS_VOICE_ID', Boolean(process.env.ELEVENLABS_VOICE_ID)],
];

for (const [label, ok] of rows) {
  console.log(`${ok ? '✓' : '○'} ${label}`);
}

if (!existsSync(sample)) process.exitCode = 1;
