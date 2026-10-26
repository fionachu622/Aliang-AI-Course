from pathlib import Path
import json,subprocess
r=Path(__file__).resolve().parents[1]; b=r/'src/agent-teaching-v3';pub=r/'public';w=r/'work/orders-detail-sync';w.mkdir(parents=True,exist_ok=True)
# Current unedited master clock; recording-10 starts at (7691-43)/30.
beats=[
 ('request','任务要求与原始表保留',7648/30,262,20,26,1),
 ('submit','任务提交后进入执行（无独立授权画面）',262,263,27,28,None),
 ('inspect','Agent 查看三份表并说明处理步骤',263,265,29,31,None),
 ('process','重复记录、日期统一与金额计算说明',265,269.5,33,35.2,1),
 ('chart-first','按商品汇总并生成柱状图',269.5,271.5,42,44,None),
 ('autonomy','保留执行总结解释自主安排',271.5,275.6,35,35.2,1),
 ('open','打开结果工作簿',275.6,278,36,40,None),
 ('duplicates','核对两条重复记录已排除重复计额',278,279.6,34.4,34.6,1),
 ('total','核对商品汇总总额',279.6,281.5,41,42.5,1),
 ('chart-final','检查柱状图并保留最终结果',281.5,8567/30,42.5,44.6,1),
]
cs=[]
for ident,label,start,end,ss,se,rate in beats:
 n=round(end*30)-round(start*30);play=min(n,round((se-ss)*30)) if rate else n;rate=(se-ss)*30/play;cid='orders-detail-'+ident;hold=f'agent-course/media/{cid}-hold.jpg';src=pub/'agent-course/media/demo-03.mp4';proxy=pub/f'agent-course/preview-proxies/{cid}.mp4'
 c=dict(id=cid,label=label,from_=round(start*30)+43,durationInFrames=n,source='agent-course/media/demo-03.mp4',sourceStart=ss,sourceEnd=se,playbackRate=rate,playFrames=play,holdImage=hold);c['from']=c.pop('from_');cs.append(c)
 subprocess.run(['ffmpeg','-v','error','-y','-ss',str(ss),'-t',str(se-ss),'-i',str(src),'-an','-vf',f'setpts=(PTS-STARTPTS)/{rate},scale=1280:-2,fps=30,tpad=stop_mode=clone:stop_duration=1','-frames:v',str(play),'-c:v','libx264','-preset','veryfast','-crf','20',str(proxy)],check=True)
 subprocess.run(['ffmpeg','-v','error','-y','-ss',str(se-1/30),'-i',str(src),'-frames:v','1',str(pub/hold)],check=True)
 subprocess.run(['ffmpeg','-v','error','-y','-i',str(proxy),'-vf','scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:color=0x24272A,setsar=1,tpad=stop_mode=clone:stop_duration=20','-an','-frames:v',str(n),'-c:v','libx264','-preset','veryfast','-crf','20',str(w/(cid+'.mp4'))],check=True)
(w/'concat.txt').write_text(''.join(f"file '{c['id']}.mp4'\n" for c in cs))
preview='agent-course/preview-proxies/orders-detail-continuous-v1.mp4'
subprocess.run(['ffmpeg','-v','error','-y','-f','concat','-safe','0','-i',str(w/'concat.txt'),'-c','copy','-movflags','+faststart',str(pub/preview)],check=True)
p=b/'recordings.timeline.json';d=json.loads(p.read_text());d=[c for c in d if c['id'] not in ['recording-10','recording-11','recording-12'] and not c['id'].startswith('orders-detail-')];p.write_text(json.dumps(sorted(d+cs,key=lambda c:c['from']),ensure_ascii=False,indent=2)+'\n')
assert cs[-1]['from']+cs[-1]['durationInFrames']==8610
print('Orders detail cues corrected; case end unchanged.')

# Keep the whole-case preview intact when rebuilding introduction cues.
subprocess.run(["python3",str(r/"scripts/build-orders-full-preview.py")],check=True)
