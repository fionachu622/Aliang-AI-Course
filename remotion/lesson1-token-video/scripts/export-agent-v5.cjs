const fs=require('node:fs'),path=require('node:path');
const {bundle}=require('./temporary-remotion-bundle.cjs');
const {selectComposition,renderMedia,openBrowser}=require('@remotion/renderer');
const out=path.resolve('../../outputs/agent-course-video/exports/20261010');
const dest=path.join(out,'Agent专题课-V5-完整版-1080p.mp4');
const statusFile=path.join(out,'render-status.json');
const settings={codec:'h264',crf:18,x264Preset:'medium',pixelFormat:'yuv420p',audioCodec:'aac',audioBitrate:'320k',sampleRate:48000,imageFormat:'jpeg',concurrency:2,timeoutInMilliseconds:120000};
const started=new Date().toISOString();
const save=x=>fs.writeFileSync(statusFile,JSON.stringify({started,output:dest,...x},null,2));
(async()=>{fs.mkdirSync(out,{recursive:true});save({state:'bundling'});console.log('Bundling current V5');
 const serveUrl=await bundle({entryPoint:path.resolve('src/index.ts')});
 const browser=await openBrowser('chrome');
 try{
  const inputProps={fastExport:true};
  const composition=await selectComposition({serveUrl,id:'AgentTeachingV5',puppeteerInstance:browser,inputProps});
  fs.writeFileSync(path.join(out,'export-settings.json'),JSON.stringify({reference:path.resolve('out/第1课-黑板手绘审片版-Apple动效试验V5.mp4'),composition:{id:composition.id,width:composition.width,height:composition.height,fps:composition.fps,durationInFrames:composition.durationInFrames},settings,inputProps,started},null,2));
  let last=0;save({state:'rendering',renderedFrames:0,totalFrames:composition.durationInFrames});
  await renderMedia({serveUrl,composition,inputProps,puppeteerInstance:browser,outputLocation:dest,...settings,overwrite:false,logLevel:'warn',onProgress:p=>{
   const now=Date.now();if(now-last>15000||p.progress===1){last=now;const status={state:'rendering',...p,totalFrames:composition.durationInFrames,updated:new Date().toISOString()};save(status);console.log(JSON.stringify(status));}
  }});
  save({state:'complete',completed:new Date().toISOString(),bytes:fs.statSync(dest).size,totalFrames:composition.durationInFrames});console.log('EXPORT_COMPLETE '+dest);
 }finally{await browser.close({silent:true});}
})().catch(e=>{save({state:'failed',error:String(e.stack||e),updated:new Date().toISOString()});console.error(e);process.exitCode=1});
