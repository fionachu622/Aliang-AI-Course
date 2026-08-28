import {readFileSync} from 'node:fs';
import {basename, dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const samplePath = resolve(
  projectRoot,
  'public/voice-samples/voice-reference-2min.mp3',
);

if (!process.argv.includes('--confirm-owner')) {
  throw new Error(
    'Refusing to upload. Re-run with --confirm-owner only if this recording is your own voice.',
  );
}

const apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey) {
  throw new Error('Missing ELEVENLABS_API_KEY in .env');
}

const form = new FormData();
const audio = readFileSync(samplePath);
form.append(
  'files',
  new Blob([audio], {type: 'audio/mpeg'}),
  basename(samplePath),
);
form.append('name', process.env.ELEVENLABS_VOICE_NAME || 'Aliang Course Voice');
form.append('description', 'Course narration voice created from an owner-provided sample.');
form.append('remove_background_noise', 'false');

console.log('Uploading the 2-minute owner-provided voice sample...');
const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
  method: 'POST',
  headers: {'xi-api-key': apiKey},
  body: form,
});

if (!response.ok) {
  throw new Error(`ElevenLabs voice creation failed (${response.status}): ${await response.text()}`);
}

const result = await response.json();
console.log(`Voice created: ${result.voice_id}`);
console.log(`Verification required: ${Boolean(result.requires_verification)}`);
console.log('Add this line to .env:');
console.log(`ELEVENLABS_VOICE_ID=${result.voice_id}`);
