"""Narration stays intact. Re-extract semantic evidence at <=1x and bake each continuous run."""
from pathlib import Path
import json,subprocess
r=Path(__file__).resolve().parents[1];b=r/'src/agent-teaching-v3';pub=r/'public';work=r/'work/remaining-original';work.mkdir(parents=True,exist_ok=True)
raw=Path('/Users/sniper/work/0自媒体/自媒体项目/03课程/AI课程资料/02 Agent 专题课/案例准备/05 youtube 内容制作')
channel=raw/'创建频道 2.mp4';production=raw/'制作视频 2.mp4';butterfly=pub/'agent-course/media/butterfly-preview-export.mp4'
# start/end are verified original source seconds; short excerpts hold their last clean frame.
specs={
'recording-19':(channel,4,7,1), 'recording-20':(channel,24,27.6,1),
'recording-21':(channel,30,33,1), 'recording-21-result':(channel,249,252,1),
'recording-22':(production,5,11,1), 'recording-23':(production,12,16.5,1),
'recording-23-preview':(production,530,535,1), 'recording-24':(production,540,545,1),
'recording-25':(butterfly,2,12,1), 'recording-25-pupation':(butterfly,25,28.9,1),
'recording-26':(butterfly,58,60.8,1), 'recording-26-wings':(butterfly,76,78.8,1),
'recording-26-replay':(butterfly,58,61.8,.75),
'recording-27':(production,2797,2802,1), 'recording-28':(production,2690,2697,1),
'recording-29':(production,2992,3003,1), 'recording-30':(production,3008,3014,1),
'recording-31':(production,3055,3063,1), 'recording-32':(production,3080,3093.6,1)}
cs=json.loads((b/'recordings.timeline.json').read_text());lookup={c['id']:c for c in cs}
# Separate choosing a name from the completed channel result at the spoken cue.
c=lookup['recording-21'];old=lookup.get('recording-21-result',c);end=old['from']+old['durationInFrames'];cs=[c for c in cs if c['id']!='recording-21-result'];c['durationInFrames']=round(521.24*30)-c['from']
result={**c,'id':'recording-21-result','label':'确认万物说频道创建成功','from':round(521.24*30),'durationInFrames':end-round(521.24*30)}
cs.append(result);lookup[result['id']]=result
# Return to the presenter for the interpretation, instead of holding the input box.
lookup['recording-24']['durationInFrames']=round(650.52*30)-lookup['recording-24']['from']
c=lookup['recording-25'];end=c['from']+c['durationInFrames'];c['from']=round(657.16*30);c['durationInFrames']=end-c['from']
enc=['-an','-c:v','libx264','-preset','veryfast','-crf','16','-pix_fmt','yuv420p','-movflags','+faststart']
scale='scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=0x24272A,setsar=1'
def run(a):subprocess.run(['ffmpeg','-v','error','-y',*a],check=True)
provenance=[]
for id,(source,start,end,rate) in specs.items():
 c=lookup[id];frames=min(round((end-start)/rate*30),c['durationInFrames']);end=start+frames/30*rate
 target=f'agent-course/media/{id}-original-v1.mp4';hold=f'agent-course/media/{id}-original-v1.jpg'
 run(['-ss',str(start),'-t',str(end-start),'-i',str(source),'-vf','fps=30','-frames:v',str(round((end-start)*30)),*enc,str(pub/target)])
 run(['-ss',str(max(0,end-start-1/30)),'-i',str(pub/target),'-frames:v','1','-q:v','2',str(pub/hold)])
 c.update(source=target,sourceStart=0,sourceEnd=end-start,playbackRate=rate,playFrames=frames,holdImage=hold)
 c.pop('caption',None)
 provenance.append(dict(id=id,source=str(source),start=start,end=end,rate=rate,masterStart=(c['from']-43)/30,masterEnd=(c['from']+c['durationInFrames']-43)/30))
 # Same decoded source and end frame; one continuous video even for a long hold.
 run(['-i',str(pub/target),'-vf',f'setpts=(PTS-STARTPTS)/{rate},fps=30,{scale},tpad=stop_mode=clone:stop_duration=20','-frames:v',str(c['durationInFrames']),*enc,str(work/f'{id}.mp4')])
 print(id,flush=True)
cs.sort(key=lambda c:c['from'])
# Group adjacent cuts to avoid decoder teardown between normal-speed excerpts.
groups=[]
for c in [c for c in cs if c['id'] in specs]:
 if groups and groups[-1][-1]['from']+groups[-1][-1]['durationInFrames']==c['from']:groups[-1].append(c)
 else:groups.append([c])
previews=[]
for i,g in enumerate(groups):
 f=work/f'concat-{i}.txt';f.write_text(''.join("file '"+c['id']+".mp4'\n" for c in g))
 source=f'agent-course/preview-proxies/remaining-original-{i}-v1.mp4'
 run(['-f','concat','-safe','0','-i',str(f),'-c','copy','-movflags','+faststart',str(pub/source)])
 previews.append(dict(source=source,from_=g[0]['from'],durationInFrames=sum(c['durationInFrames'] for c in g),cutIds=[c['id'] for c in g]))
for p in previews:p['from']=p.pop('from_')
(b/'remaining-original-sources.json').write_text(json.dumps(provenance,ensure_ascii=False,indent=2)+'\n')
(b/'remaining-preview.json').write_text(json.dumps(previews,indent=2)+'\n')
(b/'recordings.timeline.json').write_text(json.dumps(cs,ensure_ascii=False,indent=2)+'\n')
