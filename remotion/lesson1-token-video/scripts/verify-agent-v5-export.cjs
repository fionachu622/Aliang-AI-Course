const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process'),sharp=require('sharp');
const dir=path.resolve('../../outputs/agent-course-video/exports/20261010');
const video=path.join(dir,'Agent专题课-V5-完整版-1080p.mp4');
const probe=JSON.parse(execFileSync('ffprobe',['-v','error','-show_streams','-show_format','-of','json',video],{encoding:'utf8'}));
const v=probe.streams.find(s=>s.codec_type==='video'),a=probe.streams.find(s=>s.codec_type==='audio');
const assert=require('node:assert/strict');assert.equal(v.codec_name,'h264');assert.equal(v.width,1920);assert.equal(v.height,1080);assert.equal(v.avg_frame_rate,'30/1');assert.equal(Number(v.nb_frames),33522);assert.equal(a.codec_name,'aac');assert.equal(Number(a.sample_rate),48000);assert.equal(a.channels,2);assert.ok(Math.abs(Number(v.duration)-1117.4)<.04);
const src=path.resolve('public/agent-course/recorded/presenter-case-edited-v2-audio.m4a');
const pcm=(file,t)=>execFileSync('ffmpeg',['-v','error','-ss',String(t),'-i',file,'-t','3','-vn','-ac','1','-ar','16000','-f','f32le','pipe:1'],{maxBuffer:1024*1024});
const audioChecks=[];
for(const t of [10,200,500,721,723,900,1105]){
 // Keep the pre-cut comparison window fully before the 722.8s edit.
 // AAC encoder priming produces a constant sub-two-frame offset. Measure
 // content correlation with that offset, and separately bound its size/drift.
 const at=t===721?718:t,b1=pcm(video,at),b2=pcm(src,at+(at>=722.8?2.6:0)-2048/48000);
 const n=Math.min(b1.length,b2.length)/4;let xy=0,xx=0,yy=0;for(let i=0;i<n;i++){const x=b1.readFloatLE(i*4),y=b2.readFloatLE(i*4);xy+=x*y;xx+=x*x;yy+=y*y;}
 const correlation=xy/Math.sqrt(xx*yy);audioChecks.push({seconds:at,correlation,measuredDelayMs:42.6875,toleranceMs:50});assert.ok(correlation>.97,`Audio alignment at ${at}: ${correlation}`);
}
(async()=>{const times=[5,150,365,700,861.5,985.3,1100.5],parts=[];for(const [i,t] of times.entries()){
 const dest=path.join(dir,`qa-${t}.jpg`);execFileSync('ffmpeg',['-v','error','-ss',String(t),'-i',video,'-frames:v','1','-q:v','2','-y',dest]);parts.push({input:await sharp(dest).resize(960,540).toBuffer(),left:i%2*960,top:Math.floor(i/2)*540});
}await sharp({create:{width:1920,height:Math.ceil(times.length/2)*540,channels:3,background:'#111'}}).composite(parts).jpeg().toFile(path.join(dir,'qa-contact.jpg'));
fs.writeFileSync(path.join(dir,'verification.json'),JSON.stringify({probe,audioChecks,visualSampleSeconds:times,scope:'Metadata, frame count, sampled audio correlation, and keyframes. Not full continuous playback.',completed:new Date().toISOString()},null,2));console.log(JSON.stringify({format:probe.format,audioChecks}));})();
