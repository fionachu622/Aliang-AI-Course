"""Align calendar screen actions to the untouched current narration master."""
from pathlib import Path
import json, subprocess
root=Path(__file__).resolve().parents[1]
data=root/'src/agent-teaching-v3'; public=root/'public';work=root/'work/calendar-sync'
work.mkdir(parents=True,exist_ok=True)
# Master-video seconds, source-recording seconds. Visual cue sheets retain +43 frames.
beats=[
 ('input','展示两天安排并停留讲解',180+17/30,190.6,0,4,1),
 ('submit','提交安排',190.6,191.6,6,8.8,None),
 ('permission','点击允许',191.6,193.2,8.8,10.3,1),
 ('browser','打开浏览器进入日历',193.2,196,10.3,17,None),
 ('form','展示添加日程窗口与生活日历',196,199.5,17,17.6,1),
 ('time','填入日期和时间',199.5,201,17.6,19,None),
 ('reminder','设置提醒和备注',201,202.8,19,21.2,None),
 ('remaining','继续逐条添加日程',202.8,206,21.2,39.8,None),
]
source='agent-course/media/demo-02.mp4';cuts=[]
for ident,label,start,end,ss,se,rate in beats:
 duration=round(end*30)-round(start*30)
 play=min(duration,round((se-ss)*30)) if rate else duration
 rate=(se-ss)*30/play
 cid='calendar-sync-'+ident
 hold=f'agent-course/media/{cid}-hold.jpg'
 cut=dict(id=cid,label=label,from_=round(start*30)+43,durationInFrames=duration,source=source,sourceStart=ss,sourceEnd=se,playbackRate=rate,playFrames=play,holdImage=hold)
 cut['from']=cut.pop('from_');cuts.append(cut)
 proxy=public/f'agent-course/preview-proxies/{cid}.mp4'
 subprocess.run(['ffmpeg','-v','error','-y','-ss',str(ss),'-t',str(se-ss),'-i',str(public/source),'-an','-vf',f'setpts=(PTS-STARTPTS)/{rate},scale=1280:-2,fps=30,tpad=stop_mode=clone:stop_duration=1','-frames:v',str(play),'-c:v','libx264','-preset','veryfast','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart',str(proxy)],check=True)
 subprocess.run(['ffmpeg','-v','error','-y','-ss',str(se-1/30),'-i',str(public/source),'-frames:v','1',str(public/hold)],check=True)
 part=work/(cid+'.mp4')
 subprocess.run(['ffmpeg','-v','error','-y','-i',str(proxy),'-an','-vf','pad=1280:720:(ow-iw)/2:(oh-ih)/2:color=0x24272A,setsar=1,tpad=stop_mode=clone:stop_duration=20','-frames:v',str(duration),'-c:v','libx264','-preset','veryfast','-crf','20','-pix_fmt','yuv420p',str(part)],check=True)
(work/'concat.txt').write_text(''.join(f"file '{c['id']}.mp4'\n" for c in cuts))
preview='agent-course/preview-proxies/calendar-continuous-synced-v2.mp4'
subprocess.run(['ffmpeg','-v','error','-y','-f','concat','-safe','0','-i',str(work/'concat.txt'),'-c','copy','-movflags','+faststart',str(public/preview)],check=True)
p=data/'recordings.timeline.json';old=json.loads(p.read_text());old=[c for c in old if c['id'] not in ['recording-05','recording-06','recording-07','recording-08'] and not c['id'].startswith('calendar-sync-')]
p.write_text(json.dumps(sorted(old+cuts,key=lambda c:c['from']),ensure_ascii=False,indent=2)+'\n')
config=dict(source=preview,from_=cuts[0]['from'],durationInFrames=sum(c['durationInFrames'] for c in cuts),cutIds=[c['id'] for c in cuts],reviewHoldFrom=6180,reviewHoldEnd=6665,reviewHoldImage='agent-course/media/calendar-six-created.jpg',reviewHoldSource={'path':'/Users/sniper/work/0自媒体/自媒体项目/03课程/AI课程资料/02 Agent 专题课/案例准备/02 创建日程/创建日程.mp4','seconds':296,'evidence':'Six saved calendar events visible; add-event dialog closed.'},basis='Current original-video subtitles sampled every second, source recording sampled every 0.5 s. Eight action beats; hold input/form during explanation. No audio changes.',limitation='The review hold is extracted from the completed six-event view in the full original recording.')
config['from']=config.pop('from_');(data/'calendar-preview.json').write_text(json.dumps(config,ensure_ascii=False,indent=2)+'\n')
assert all(a['from']+a['durationInFrames']==b['from'] for a,b in zip(cuts,cuts[1:]))
assert cuts[-1]['from']+cuts[-1]['durationInFrames']-43==config['reviewHoldFrom']
print('Calendar synced:',len(cuts),'cuts;',config['durationInFrames'],'frames; original audio unchanged.')
