const {bundle}=require('./temporary-remotion-bundle.cjs');
const {getCompositions,renderStill,openBrowser}=require('@remotion/renderer');
const path=require('path'),fs=require('fs');
(async()=>{
 const url=await bundle({entryPoint:path.resolve('src/index.ts')});
 const browser=await openBrowser('chrome');
 const comps=await getCompositions(url,{puppeteerInstance:browser});
 const comp=comps.find(c=>c.id==='AgentOpening-First3');
 const d=require('../src/agent-full/course.storyboard.json');
 const dir=path.resolve('../../output/第2课-Agent黑板动画完整版/keyframes');fs.mkdirSync(dir,{recursive:true});
 const jobs=[];
 for(const s of d.scenes.filter(s=>!process.argv[2]||process.argv[2].split(',').includes(s.id))){
  jobs.push({name:s.id+'-final',frame:s.startFrame+s.durationInFrames-25});
  if(Number(s.id.slice(1))>3)for(let k=0;k<s.nodes.length-1;k++)jobs.push({name:s.id+'-state'+k,frame:s.startFrame+Math.min(s.durationInFrames-25,s.nodes[k].at+26)});
 }
 fs.writeFileSync(path.join(dir,process.argv[2]?'manifest-fixes.json':'manifest.json'),JSON.stringify(jobs,null,2));
 let cursor=0;
 await Promise.all(Array.from({length:3},async()=>{while(cursor<jobs.length){const j=jobs[cursor++];await renderStill({composition:comp,serveUrl:url,puppeteerInstance:browser,output:path.join(dir,j.name+'.png'),frame:j.frame,scale:.5});if(j.name.endsWith('final'))console.log(j.name)}}));
 await browser.close({silent:true});console.log('DONE',jobs.length);
})().catch(e=>{console.error(e);process.exit(1)});
