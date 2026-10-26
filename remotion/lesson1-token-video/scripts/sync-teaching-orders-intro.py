from pathlib import Path
import json,subprocess
r=Path(__file__).resolve().parents[1]; b=r/'src/agent-teaching-v3';pub=r/'public';w=r/'work/orders-intro-sync';w.mkdir(parents=True,exist_ok=True)
# Current unedited master clock; recording-10 starts at (7691-43)/30.
beats=[('files','展示三份订单文件',7197/30,242,0,2,None),('dates','日期列：混合日期格式',242,243.7,10,12,None),('overlap','切换订单表查看交叉数据',243.7,245.3,12,14,None),('work','保留原始表格解释手工处理',245.3,252.6,14,18,1),('task','转入任务输入',252.6,7648/30,18,20,None)]
cs=[]
for ident,label,start,end,ss,se,rate in beats:
 n=round(end*30)-round(start*30);play=min(n,round((se-ss)*30)) if rate else n;rate=(se-ss)*30/play;cid='orders-intro-'+ident;hold=f'agent-course/media/{cid}-hold.jpg';src=pub/'agent-course/media/demo-03.mp4';proxy=pub/f'agent-course/preview-proxies/{cid}.mp4'
 c=dict(id=cid,label=label,from_=round(start*30)+43,durationInFrames=n,source='agent-course/media/demo-03.mp4',sourceStart=ss,sourceEnd=se,playbackRate=rate,playFrames=play,holdImage=hold);c['from']=c.pop('from_');cs.append(c)
 subprocess.run(['ffmpeg','-v','error','-y','-ss',str(ss),'-t',str(se-ss),'-i',str(src),'-an','-vf',f'setpts=(PTS-STARTPTS)/{rate},scale=1280:-2,fps=30,tpad=stop_mode=clone:stop_duration=1','-frames:v',str(play),'-c:v','libx264','-preset','veryfast','-crf','20',str(proxy)],check=True)
 subprocess.run(['ffmpeg','-v','error','-y','-ss',str(se-1/30),'-i',str(src),'-frames:v','1',str(pub/hold)],check=True)
 subprocess.run(['ffmpeg','-v','error','-y','-i',str(proxy),'-vf','scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:color=0x24272A,setsar=1,tpad=stop_mode=clone:stop_duration=20','-an','-frames:v',str(n),'-c:v','libx264','-preset','veryfast','-crf','20',str(w/(cid+'.mp4'))],check=True)
(w/'concat.txt').write_text(''.join(f"file '{c['id']}.mp4'\n" for c in cs))
preview='agent-course/preview-proxies/orders-intro-continuous-v1.mp4'
subprocess.run(['ffmpeg','-v','error','-y','-f','concat','-safe','0','-i',str(w/'concat.txt'),'-c','copy','-movflags','+faststart',str(pub/preview)],check=True)
p=b/'recordings.timeline.json';d=json.loads(p.read_text());d=[c for c in d if c['id']!='recording-09' and not c['id'].startswith('orders-intro-')];p.write_text(json.dumps(sorted(d+cs,key=lambda c:c['from']),ensure_ascii=False,indent=2)+'\n')
cfg=dict(source=preview,durationInFrames=sum(c['durationInFrames'] for c in cs),cutIds=[c['id'] for c in cs],basis='Original master subtitle frames sampled at one second; source date-column view at 10–12s moved to master 242s. Audio unchanged.');cfg['from']=cs[0]['from'];(b/'orders-intro-preview.json').write_text(json.dumps(cfg,ensure_ascii=False,indent=2)+'\n')
assert cs[-1]['from']+cs[-1]['durationInFrames']==7691
print('Orders introduction rebuilt; dates at master 242 seconds; next segment unchanged.')

# Keep the whole-case preview intact when rebuilding introduction cues.
subprocess.run(["python3",str(r/"scripts/build-orders-full-preview.py")],check=True)
