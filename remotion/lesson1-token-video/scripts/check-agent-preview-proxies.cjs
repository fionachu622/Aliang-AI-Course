const fs=require('fs'),path=require('path'),assert=require('assert/strict'),Module=require('module'),ts=require('typescript');
const React=require('react');const cuts=require('../src/agent-full/recordings.timeline.json');
let rendering=false;const Native=()=>null,Source=()=>null;
const file=path.resolve(__dirname,'../src/agent-full/RecordingSequence.tsx');const m=new Module(file,module);m.filename=file;m.paths=Module._nodeModulePaths(path.dirname(file));const req=Module.createRequire(file);
m.require=id=>id==='remotion'?{AbsoluteFill:'main',Sequence:'section',Img:'img',Html5Video:Native,staticFile:p=>p,useCurrentFrame:()=>0,getRemotionEnvironment:()=>({isRendering:rendering})}:id==='./PreviewMedia'?{CourseVideo:Source}:req(id);
m._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.React,module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText,file);
const manifest=require('../public/agent-course/preview-proxies/manifest.json');
for(const c of cuts){const getVideo=()=>m.exports.RecordingSequence({cut:c}).props.children[0].props.children;
 rendering=false;let v=getVideo();assert.equal(v.type,Native);assert.equal(v.props.trimBefore,undefined);assert.equal(v.props.trimAfter,undefined);assert.equal(v.props.playbackRate,undefined);assert(fs.existsSync(path.resolve(__dirname,'../public',v.props.src)));assert.equal(manifest.find(r=>r.id===c.id).frames,c.playFrames);
 rendering=true;v=getVideo();assert.equal(v.type,Source);assert.equal(v.props.trimBefore,Math.round(c.sourceStart*30));assert.equal(v.props.trimAfter,Math.round(c.sourceEnd*30));assert.equal(v.props.playbackRate,c.playbackRate);
}
console.log('Passed: 38 native preview proxies have exact output frames, no native trim/rate; export preserves source trims and speed.');
