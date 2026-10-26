"""Select normal-speed evidence from the unedited parallel-agent recording."""
from pathlib import Path
import json,subprocess
r=Path(__file__).resolve().parents[1];b=r/'src/agent-teaching-v3'
raw=Path('/Users/sniper/work/0自媒体/自媒体项目/03课程/AI课程资料/02 Agent 专题课/案例准备/04 多 Agent 分工干活/多 Agent 分工.mp4')
specs=[('recording-14','输入并行任务',9349,241,40,45),('recording-15','三个任务同时执行',9590,113,84,84+113/30),('recording-16','打开汇报PPT',9703,87,370,372.9),('recording-17','打开团建海报',9790,45,414,415.5),('recording-18','查看会议纪要正文',9835,172,492,492+172/30),('recording-18-summary','核对行动事项',10007,120,504,508),('recording-18-confirm','核对待确认与边界',10127,72,510,512),('recording-18-result','三项交付结果汇总',10199,65,519,519.1)]
cs=[]
for id,label,start,duration,ss,se in specs:
 source=f'agent-course/media/{id}-original.mp4';hold=f'agent-course/media/{id}-original-hold.jpg';frames=round((se-ss)*30)
 subprocess.run(['ffmpeg','-v','error','-y','-ss',str(ss),'-i',str(raw),'-an','-vf','fps=30,scale=in_range=auto:out_range=tv,format=yuv420p','-frames:v',str(frames),'-c:v','libx264','-preset','veryfast','-crf','18','-color_range','tv','-movflags','+faststart',str(r/'public'/source)],check=True)
 subprocess.run(['ffmpeg','-v','error','-y','-ss',str((frames-1)/30),'-i',str(r/'public'/source),'-frames:v','1',str(r/'public'/hold)],check=True)
 cs.append(dict(id=id,label=label,from_=start,durationInFrames=duration,source=source,sourceStart=0,sourceEnd=frames/30,playbackRate=1,playFrames=frames,holdImage=hold))
 cs[-1]['from']=cs[-1].pop('from_')
p=b/'recordings.timeline.json';old=json.loads(p.read_text());ids={s[0] for s in specs};old=[c for c in old if c['id'] not in ids];old.extend(cs);old.sort(key=lambda c:c['from']);p.write_text(json.dumps(old,ensure_ascii=False,indent=2)+'\n')
(b/'parallel-original-sources.json').write_text(json.dumps({'original':str(raw),'basis':'Native-speed excerpts matched to existing narration cues; waiting omitted, final evidence held.','clips':[{'id':s[0],'rawStart':s[4],'rawEnd':s[5]} for s in specs]},ensure_ascii=False,indent=2)+'\n')
