const {bundle}=require('./temporary-remotion-bundle.cjs');
const {getCompositions,renderStill,openBrowser}=require('@remotion/renderer');
const fs=require('fs'),path=require('path'),sharp=require('sharp');
const root=path.resolve(__dirname,'..'),out=path.join(root,'work/safety-redesign/formal');
const seconds=process.argv.length>2?process.argv.slice(2).map(Number):[365,374.5,382,389.5,408,422,438,452];
(async()=>{fs.mkdirSync(out,{recursive:true});const url=await bundle({entryPoint:path.join(root,'src/index.ts')});const browser=await openBrowser('chrome');try{
 const c=(await getCompositions(url,{puppeteerInstance:browser})).find(x=>x.id==='AgentTeachingV5');
 const parts=[];
 for(const [i,t] of seconds.entries()){
  const f=Math.round(t*30),dest=path.join(out,`frame-${f}.jpg`);
  await renderStill({composition:c,serveUrl:url,puppeteerInstance:browser,output:dest,frame:f,imageFormat:'jpeg',jpegQuality:90,logLevel:'error'});
  parts.push({input:await sharp(dest).resize(960,540).toBuffer(),left:i%2*960,top:Math.floor(i/2)*574});
  parts.push({input:Buffer.from(`<svg width="960" height="34"><rect width="960" height="34" fill="#111"/><text x="15" y="24" fill="white" font-family="Arial" font-size="20">${t}s | frame ${f}</text></svg>`),left:i%2*960,top:Math.floor(i/2)*574+540});
  console.log(t);
 }
 await sharp({create:{width:1920,height:Math.ceil(seconds.length/2)*574,channels:3,background:'#111'}}).composite(parts).jpeg().toFile(path.join(out,'contact.jpg'));
 console.log('DONE');
}finally{await browser.close({silent:true});}})().catch(e=>{console.error(e);process.exit(1)});
