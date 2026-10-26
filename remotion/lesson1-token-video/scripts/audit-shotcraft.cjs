// QA artifacts only; no video encoding and no edits to lesson sources.
const fs = require('node:fs');
const path = require('node:path');
const {bundle} = require('./temporary-remotion-bundle.cjs');
const {openBrowser,selectComposition,renderStill} = require('@remotion/renderer');
const sharp = require('sharp');
const ts = require('typescript');
const assert = require('node:assert/strict');

require.extensions['.ts'] = require.extensions['.tsx'] = (module,filename) => {
  const {outputText} = ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2020}});
  module._compile(outputText,filename);
};
const {readingProgress,readingLayerStyle,focusHandoff} = require('../src/shotcraft/motion.ts');
const {SHOTCRAFT_SHOTS} = require('../src/shotcraft/Lesson1ChalkboardShotcraft.tsx');
const {PACING_V2_SCENE_BOUNDARIES} = require('../src/v18/reviewPacingV2Timing.ts');
const {REVIEW_VOICEOVER_TOTAL_FRAMES} = require('../src/v16/reviewVoiceoverTiming.ts');
assert.equal(SHOTCRAFT_SHOTS.length,12);
assert.equal(SHOTCRAFT_SHOTS.reduce((sum,s)=>sum+s.durationInFrames,0),REVIEW_VOICEOVER_TOTAL_FRAMES);
SHOTCRAFT_SHOTS.forEach((s,i)=>assert.equal(s.from,PACING_V2_SCENE_BOUNDARIES[i]));
assert.equal(readingProgress(0),0);
assert.equal(readingProgress(1),1);
let last = 0;
for(let i=0;i<=1000;i++) {const p=readingProgress(i/1000);assert(p>=last&&p<=1);last=p;}
assert.deepEqual(readingLayerStyle({amount:1,fromX:36,fromY:22,fromScale:.9}),{opacity:1,transform:'translate(0px, 0px)',filter:undefined});
for(const enter of [false,true]) for(const exit of [false,true]) {
  for(let f=0;f<324;f++) {
    const s=focusHandoff(f,300,enter,exit);
    assert(s.opacity>=0&&s.opacity<=1);
    assert(!s.transform.includes('NaN'));
  }
  assert.equal(focusHandoff(100,300,enter,exit).opacity,1);
}
console.log('PASS: 12 scenes, identical boundaries/total, monotonic motion, settled zero drift.');

const out=path.resolve('out/qa/shotcraft');
fs.mkdirSync(out,{recursive:true});
const baselineFrames=[150,740,1550,7900];
const sceneFrames=[40,150,330,520,530,550,740,1000,1350,1550,1900,2400,2700,3000,3400,3650,3800,4300,4680,4800,5300,5950,6100,6750,7230,7400,7900,8700,9000,9700,10500,10900,11700,12400,12900,14000,14800,15100,15450,15757];
const seamFrames=SHOTCRAFT_SHOTS.slice(1).filter(s=>!['generation-loop','streaming'].includes(s.id)).flatMap(s=>[s.from,s.from+8,s.from+18,s.from+30]);
// Each adjacent frame is separately rendered, not interpolated screenshots.
const motionFrames=[8,12,16,20,24,28,32,36,40,44,48,52];

async function main() {
  const serveUrl=await bundle({entryPoint:'src/index.ts'});
  const browser=await openBrowser('chrome');
  try {
    const old=await selectComposition({serveUrl,id:'Lesson1ChalkboardV3',puppeteerInstance:browser});
    const next=await selectComposition({serveUrl,id:'Lesson1ChalkboardShotcraft',puppeteerInstance:browser});
    assert.equal(old.durationInFrames,next.durationInFrames);
    assert.equal(old.fps,next.fps);
    const report={composition:next.id,frames:next.durationInFrames,fps:next.fps,oldVersionPixelDiff:[],rendered:[],scope:'PNG frame checks, not encoded video or full playback review'};
    for(const frame of baselineFrames) {
      const output=path.join(out,`regression-${frame}.png`);
      await renderStill({serveUrl,composition:old,puppeteerInstance:browser,output,frame});
      const baseline=path.join(out,`baseline-${frame}.png`);
      if(fs.existsSync(baseline)) {
        const a=await sharp(baseline).ensureAlpha().raw().toBuffer();
        const b=await sharp(output).ensureAlpha().raw().toBuffer();
        assert.equal(a.length,b.length);
        let changed=0;
        for(let i=0;i<a.length;i+=4) if(a[i]!==b[i]||a[i+1]!==b[i+1]||a[i+2]!==b[i+2]) changed++;
        report.oldVersionPixelDiff.push({frame,changedPixels:changed});
        console.log('old version',frame,'changed pixels',changed);
        assert.equal(changed,0,'Old version pixels changed');
      }
    }
    await renderStill({serveUrl,composition:old,puppeteerInstance:browser,output:path.join(out,'old-3400.png'),frame:3400});
    const queue=[...new Set([...sceneFrames,...seamFrames,...motionFrames])];
    const render=async()=>{
      while(queue.length) {
        const frame=queue.shift();
        await renderStill({serveUrl,composition:next,puppeteerInstance:browser,output:path.join(out,`new-${frame}.png`),frame});
        report.rendered.push(frame);
        console.log('new frame',frame);
      }
    };
    await Promise.all([render(),render()]);
    for(const [name,frames] of [['scenes',sceneFrames],['seams',seamFrames],['motion',motionFrames]]) {
      for(let first=0;first<frames.length;first+=12) {
        const items=frames.slice(first,first+12),layers=[];
        for(let i=0;i<items.length;i++) {
          const frame=items[i],left=(i%3)*640,top=Math.floor(i/3)*390;
          layers.push({input:await sharp(path.join(out,`new-${frame}.png`)).resize(640,360).toBuffer(),left,top});
          const svg=`<svg width="640" height="30"><rect width="640" height="30" fill="#14171a"/><text x="12" y="22" font-size="18" fill="white">${name} · frame ${frame} · ${(frame/30).toFixed(2)}s</text></svg>`;
          layers.push({input:Buffer.from(svg),left,top:top+360});
        }
        await sharp({create:{width:1920,height:Math.ceil(items.length/3)*390,channels:4,background:'#14171a'}}).composite(layers).png().toFile(path.join(out,`${name}-${first/12+1}.png`));
      }
    }
    fs.writeFileSync(path.join(out,'qa-report.json'),JSON.stringify(report,null,2));
    console.log('PASS: regression + rendered frames + contact sheets',out);
  } finally {await browser.close({silent:true});}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
