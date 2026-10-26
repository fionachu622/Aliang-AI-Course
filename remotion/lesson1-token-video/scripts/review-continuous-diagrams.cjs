const fs = require('fs'),
  path = require('path'),
  React = require('react'),
  {renderToStaticMarkup} = require('react-dom/server'),
  esbuild = require('esbuild'),
  sharp = require('sharp');
const root = path.resolve(__dirname, '..'),
  out = process.env.AGENT_REVIEW_OUT || path.resolve(
    root,
    '../../outputs/agent-course-video/visual-refinement-20260930',
  );
fs.mkdirSync(out, {recursive: true});
esbuild.buildSync({
  entryPoints: [root + '/src/agent-teaching-v3/VisualStageArtwork.tsx'],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  external: ['react'],
  outfile: root + '/work/continuous-review.cjs',
});
const {VisualStageArtwork} = require(root + '/work/continuous-review.cjs');
const stages = require(root + '/src/agent-teaching-v3/visual-stages.json'),
  design = require(
    root + '/src/agent-teaching-v3/continuous-diagrams.storyboard.json',
  );
const dataUrl = (f) =>
  `data:image/${f.endsWith('.jpg') ? 'jpeg' : 'png'};base64,` +
  fs.readFileSync(f).toString('base64');
const bg = dataUrl(
    root + '/public/shared-visual/backgrounds/chalkboard/chalkboard.png',
  ),
  pet = dataUrl(root + '/public/agent-course/agent-pet-cream-v8.png');
const reviewStill = dataUrl(
  root + '/public/agent-course/media/butterfly-review-still.jpg',
);
const manifest = [];
(async () => {
  for (const s of stages.filter((s) => design.stage_layouts[s.id])) {
    const t = Math.min(
      s.end - 0.1,
      Math.max(
        ...s.nodes
          .filter((n) => !n.hidden)
          .map((n) => Math.max(n.at, n.sub ? n.subAt : 0)),
      ) + 2,
    );
    const svg = renderToStaticMarkup(
      React.createElement(VisualStageArtwork, {
        seconds: t,
        stageId: s.id,
        still: true,
        assetUrl: pet,
        reviewStillUrl: reviewStill,
        backgroundUrl: bg,
      }),
    );
    const dest = out + '/' + s.id + '-final.png';
    await sharp(Buffer.from(svg)).resize(960, 540).png().toFile(dest);
    manifest.push({id: s.id, time: t, path: dest});
  }
  fs.writeFileSync(
    out + '/final-frames.json',
    JSON.stringify(manifest, null, 2),
  );
  console.log('Rendered', manifest.length, 'final frames');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
