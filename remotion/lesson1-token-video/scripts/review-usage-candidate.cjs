const {bundle}=require('./temporary-remotion-bundle.cjs');
const {getCompositions,renderStill,openBrowser}=require('@remotion/renderer');
const path=require('path');
(async()=>{const url=await bundle({entryPoint:path.resolve('work/usage-redesign/index.tsx')});const browser=await openBrowser('chrome');try{const c=(await getCompositions(url,{puppeteerInstance:browser}))[0];await renderStill({composition:c,serveUrl:url,puppeteerInstance:browser,output:path.resolve('work/usage-redesign/candidate.png'),frame:0});}finally{await browser.close({silent:true})}})();
