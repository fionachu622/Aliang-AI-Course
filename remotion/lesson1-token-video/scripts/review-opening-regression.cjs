const {bundle}=require('./temporary-remotion-bundle.cjs');
const {getCompositions,renderStill,openBrowser}=require('@remotion/renderer');
const fs=require('fs'),path=require('path'),sharp=require('sharp');
const root=path.resolve(__dirname,'..'),out=path.join(root,'work/opening-regression');
const frames=process.argv.length>2?process.argv.slice(2).map(Number):[282,283,300,495,507,513,519,523,532,541,576,585,594,603,615,639,663];
(async()=>{fs.mkdirSync(out,{recursive:true});const url=await bundle({entryPoint:path.join(root,'src/index.ts')});const browser=await openBrowser('chrome');try{
 const c=(await getCompositions(url,{puppeteerInstance:browser})).find(x=>x.id==='AgentTeachingV3');
 for(const f of frames){await renderStill({composition:c,serveUrl:url,puppeteerInstance:browser,output:path.join(out,`frame-${f}.jpg`),frame:f,imageFormat:'jpeg',jpegQuality:90,logLevel:'error'});console.log(f);}
 for(let n=0;n<frames.length;n+=6){const group=frames.slice(n,n+6);const parts=[];for(let i=0;i<group.length;i++){parts.push({input:await sharp(path.join(out,`frame-${group[i]}.jpg`)).resize(640,360).toBuffer(),left:i%3*640,top:Math.floor(i/3)*392});parts.push({input:Buffer.from(`<svg width="640" height="32"><rect width="640" height="32" fill="#111"/><text x="12" y="22" fill="white" font-family="Arial" font-size="18">${(group[i]/30).toFixed(2)}s | frame ${group[i]}</text></svg>`),left:i%3*640,top:Math.floor(i/3)*392+360});}await sharp({create:{width:1920,height:Math.ceil(group.length/3)*392,channels:3,background:'#111'}}).composite(parts).jpeg().toFile(path.join(out,`contact-${n/6+1}.jpg`));}
 console.log('DONE');
}finally{await browser.close({silent:true});}})().catch(e=>{console.error(e);process.exit(1)});
