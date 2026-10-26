const fs=require('fs'),vm=require('vm');
const root='/Users/sniper/work/0自媒体/自媒体项目/03课程/Aliang-AI-Course/outputs/agent-html-explainer';
const order=JSON.parse(fs.readFileSync(root+'/project.json')).order;
const result={};
for(const id of order){
 const tracks=[];const tl={};
 for(const method of ['from','to','fromTo','set'])tl[method]=(...args)=>{tracks.push({method,args});return tl};
 tl.play=()=>tl;const ctx={console,Math,gsap:{timeline:()=>tl},__MG_RENDER__:true};ctx.window=ctx;vm.createContext(ctx);
 vm.runInContext(fs.readFileSync(root+'/frames/'+id+'.beats.js','utf8'),ctx);
 const html=fs.readFileSync(root+'/frames/'+id+'.html','utf8');
 for(const m of html.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/g))vm.runInContext(m[1],ctx);
 result[id]=tracks;
}
fs.writeFileSync(require('path').join(__dirname,'source-tracks.json'),JSON.stringify(result));
console.log([...new Set(Object.values(result).flat().flatMap(t=>Object.keys(t.args[1]).concat(t.method==='fromTo'?Object.keys(t.args[2]):[])))]);
