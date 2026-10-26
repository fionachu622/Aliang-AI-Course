"""One uninterrupted recording track for the complete narrated practice case."""
import json,subprocess
from pathlib import Path
r=Path(__file__).resolve().parents[1];b=r/'src/agent-teaching-v3';pub=r/'public';w=r/'work/practice-recording-only';w.mkdir(parents=True,exist_ok=True)
raw=Path('/Users/sniper/work/0自媒体/自媒体项目/03课程/AI课程资料/02 Agent 专题课/案例准备/05 youtube 内容制作');ch=raw/'创建频道 2.mp4';prod=raw/'制作视频 2.mp4';butter=pub/'agent-course/media/butterfly-preview-export.mp4'
start=round(480.88*30);end=round(820.92*30)
old=[c for c in json.loads((b/'recordings.timeline.json').read_text()) if start<=c['from']<end]
# New bridges show the current real work surface, not explanatory slides.
bridges=[
(480.88,511.5,ch,0,7,'创建频道：任务输入与需求'),
(525.8,542,prod,5,10,'讲解任务要求：保留实际输入内容'),
(556,596.1333333,prod,5,10,'风格、讲解和审核要求：停留实际任务输入'),
(600.8333333,635.7333333,prod,60,94.9,'放手执行：查看实际处理过程'),
(650.5333333,657.1666667,prod,540,546.633333,'检查与反馈：保留原预览和反馈'),
(684.1333333,700.2,butter,58,74.066667,'预览检查：继续查看动作'),
(700.2,713.64,butter,58,68.08,'具体反馈：以较慢动作供观察'),
(713.64,728.12,prod,1340,1354.48,'说明反馈：保留实际对话与预览'),
(728.12,742.8333333,prod,1354.48,1369.193333,'核对依据：查看实际任务记录'),
(798.3666667,820.92,prod,3080,3102.553333,'收束案例：保留已发布作品播放')]
segments=[]
for c in old:segments.append(dict(fromFrame=c['from'],frames=c['durationInFrames'],source=str(pub/c['source']),sourceStart=c['sourceStart'],sourceEnd=c['sourceEnd'],rate=c['playbackRate'],label=c['label']))
for a,z,src,u,v,label in bridges:
 rate=.75 if a==700.2 else 1
 segments.append(dict(fromFrame=round(a*30),frames=round(z*30)-round(a*30),source=str(src),sourceStart=u,sourceEnd=v,rate=rate,label=label))
segments.sort(key=lambda x:x['fromFrame']);cursor=start
for s in segments:
 assert s['fromFrame']==cursor,(cursor,s)
 cursor+=s['frames']
assert cursor==end,(cursor,end)
scale='scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=0x24272A,setsar=1'
for i,s in enumerate(segments):
 cmd=['ffmpeg','-v','error','-y','-ss',str(s['sourceStart']),'-t',str(s['sourceEnd']-s['sourceStart']),'-i',s['source'],'-vf',f"setpts=(PTS-STARTPTS)/{s['rate']},fps=30,{scale},tpad=stop_mode=clone:stop_duration=60",'-frames:v',str(s['frames']),'-an','-c:v','libx264','-preset','veryfast','-crf','17','-threads','4','-g','60','-pix_fmt','yuv420p',str(w/f'{i}.mp4')]
 subprocess.run(cmd,check=True);print(i,s['label'],flush=True)
(w/'concat.txt').write_text(''.join(f"file '{i}.mp4'\n" for i in range(len(segments))))
source='agent-course/preview-proxies/practice-recording-only-v1.mp4'
subprocess.run(['ffmpeg','-v','error','-y','-f','concat','-safe','0','-i',str(w/'concat.txt'),'-c','copy','-movflags','+faststart',str(pub/source)],check=True)
(b/'practice-recording-only.json').write_text(json.dumps(dict(source=source,fromFrame=start,durationInFrames=end-start,clock='legacy frames; original narration unchanged',policy='整个案例只展示实际录屏；正常速度，关键结果保留供讲解',segments=segments),ensure_ascii=False,indent=2)+'\n')
