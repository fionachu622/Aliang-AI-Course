const {bundle}=require('./temporary-remotion-bundle.cjs');
const {getCompositions,renderStill,openBrowser}=require('@remotion/renderer');
const path=require('path'),fs=require('fs');
(async()=>{
 const url=await bundle({entryPoint:path.resolve('src/index.ts')});
 const browser=await openBrowser('chrome');
 const comp=(await getCompositions(url,{puppeteerInstance:browser})).find(c=>c.id==='AgentOpening-First3');
 const data=require('../src/agent-full/course.storyboard.json');
 const recordings=require('../src/agent-full/recordings.timeline.json');
 const dir=path.resolve('../../output/第2课-Agent音画对齐/keyframes');fs.mkdirSync(dir,{recursive:true});
 const jobs=[{name:'hook',frame:60},{name:'opening-1',frame:360},{name:'opening-2',frame:930},{name:'opening-3',frame:1590}];
 for(const s of data.scenes.slice(3)) jobs.push({name:s.id,frame:s.startFrame+s.durationInFrames-18});
 for(const c of recordings) jobs.push({name:c.id,frame:c.from+Math.floor(c.durationInFrames*.6)});
 if(process.argv[2])for(let i=jobs.length-1;i>=0;i--)if(!new RegExp(process.argv[2]).test(jobs[i].name))jobs.splice(i,1);
 fs.writeFileSync(path.join(dir,process.argv[2]?'manifest-fixes.json':'manifest.json'),JSON.stringify(jobs,null,2));
 let cursor=0;
 await Promise.all(Array.from({length:2},async()=>{while(cursor<jobs.length){const j=jobs[cursor++];await renderStill({composition:comp,serveUrl:url,puppeteerInstance:browser,output:path.join(dir,j.name+'.jpg'),imageFormat:'jpeg',frame:j.frame,scale:.5});console.log(j.name)}}));
 await browser.close({silent:true});console.log('DONE',jobs.length,comp.durationInFrames);
})().catch(e=>{console.error(e);process.exit(1)});
