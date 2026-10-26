const {bundle}=require('./temporary-remotion-bundle.cjs');
const {getCompositions,renderStill,openBrowser}=require('@remotion/renderer');
const fs=require('fs'),path=require('path'),sharp=require('sharp');
const root=path.resolve(__dirname,'..'),out=path.join(root,'work/typography-review');
const source=path.join(root,'src/agent-teaching-v3');
const read=f=>JSON.parse(fs.readFileSync(path.join(source,f),'utf8'));
const edited=read('edited-butterfly-case.json'),narration=read('narration-edit.json');
const toFrame=t=>{const legacy=Math.round(t*30);return legacy-(legacy>=edited.originalEndFrame+narration.removedFrames?edited.removedFrames:0)-(legacy>=narration.cutAtFrame+narration.removedFrames?narration.removedFrames:0)};
const jobs=[];const add=(name,t)=>jobs.push({name,seconds:t,frame:toFrame(t)});
// Visible course pages, their first stable state and dense state; extra motion samples.
for(const [name,times] of Object.entries({opening:[20,23,32],identity:[42,43.5,47.45,48.3,54.8],entry:[113,126,148,162],computer:[167,168.7,172],continuous:[224.5,227.7,233.5,239],parallel:[287.8,290.4,295,304],mechanism:[375,380,399,416,438,452,463],practice:[479,495,504.7],safety:[835,851,863],chapterTools:[885.8],toolmap:[970,999,1030,1058]}))for(const t of times)add(`${name}-${t}`,t);
for(const s of read('script-screenshots.timeline.json')){
 add(`shot-${s.id}-entry`,s.start+1.3);add(`shot-${s.id}-dense`,s.end-.3);
 if(['mobile','desktop','terminal'].includes(s.id))add(`shot-${s.id}-move`,s.start+.4);
}
const audience=read('audience-scenes.json');
console.log('audience shape',Object.keys(audience));
for(const t of [1085,1093,1104,1116,1128])add(`audience-${t}`,t);
add('fee-first',1151.65);add('fee-complete',1159.3);
for(const s of read('closing-summary.json').sections){add(`closing-${s.id}-entry`,s.start+1.2);add(`closing-${s.id}-dense`,s.end-.5);}
// Presenter keyword overlays use the edited output clock directly.
const intro=read('practice-intro-presenter.json');
for(const g of intro.keywordOverlay.groups)jobs.push({name:`presenter-${g.id}`,frame:g.endFrame-15});
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 const url=await bundle({entryPoint:path.join(root,'src/index.ts')});
 const browser=await openBrowser('chrome');
 try{
  const comps=await getCompositions(url,{puppeteerInstance:browser});const comp=comps.find(c=>c.id==='AgentTeachingV3');
  fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(jobs,null,2));
  let cursor=0;
  await Promise.all(Array.from({length:2},async()=>{while(cursor<jobs.length){const j=jobs[cursor++];await renderStill({composition:comp,serveUrl:url,puppeteerInstance:browser,output:path.join(out,j.name+'.jpg'),frame:j.frame,imageFormat:'jpeg',jpegQuality:88,logLevel:'error'});console.log('Rendered',j.name,j.frame)}}));
  const ref=comps.find(c=>c.id==='Lesson1ChalkboardV3');
  for(const frame of [600,3000])await renderStill({composition:ref,serveUrl:url,puppeteerInstance:browser,output:path.join(out,`lesson1-reference-${frame}.jpg`),frame,imageFormat:'jpeg',logLevel:'error'});
  for(let start=0;start<jobs.length;start+=9){const group=jobs.slice(start,start+9),parts=[];for(let i=0;i<group.length;i++){const j=group[i];const input=await sharp(path.join(out,j.name+'.jpg')).resize(640,360).toBuffer();parts.push({input,left:i%3*640,top:Math.floor(i/3)*392});const label=Buffer.from(`<svg width="640" height="32"><rect width="640" height="32" fill="#111"/><text x="12" y="22" font-family="Arial" font-size="17" fill="white">${j.name} | frame ${j.frame}</text></svg>`);parts.push({input:label,left:i%3*640,top:Math.floor(i/3)*392+360});}await sharp({create:{width:1920,height:Math.ceil(group.length/3)*392,channels:3,background:'#111'}}).composite(parts).jpeg({quality:90}).toFile(path.join(out,`contact-${start/9+1}.jpg`));}
  console.log('DONE',jobs.length);
 }finally{await browser.close({silent:true});}
})().catch(e=>{console.error(e);process.exit(1)});
