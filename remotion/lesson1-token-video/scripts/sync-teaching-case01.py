"""Retiming for Teaching V3 case 1; original narration and recordings stay intact."""
import json, subprocess, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
TIMELINE = ROOT / 'src/agent-teaching-v3/recordings.timeline.json'
PUBLIC = ROOT / 'public'
# Original editorial seconds. AgentFullCourse applies the existing -43 frame cut.
# label, narration in/out, source in/out. Play actions at >=1x, then hold last frame.
BEATS = [
 ('打开混杂文件，停留解释手动整理',1853/30,75.16,0,5.2),
 ('交代任务并提交',75.16,81.64,5.2,11.3),
 ('Agent 查看文件',81.64,83.96,11.3,13.5),
 ('Agent 判断文件归属',83.96,86,13.5,15),
 ('创建文件夹并归类',86,89.64,18,22.7),
 ('等待执行，不用逐步指挥',89.64,92.48,22.7,23.3),
 ('整理完成，打开结果',92.48,94.27,26,28.3),
 ('展示项目文件夹总览',94.27,99.69,28.3,34),
 ('打开活动项目',99.69,101.23,34,35.5),
 ('核对海报背景与报名名单',101.23,106.8,39,44.6),
 ('打开财务项目并确认完成',106.8,3335/30,45.1,49.4),
]
def run(args):
 subprocess.run(args,check=True)
def main():
 cuts=[]; cues=[]
 for i,(label,start,end,si,so) in enumerate(BEATS):
  first,last=round(start*30),round(end*30)
  source_first,source_last=round(si*30),round(so*30)
  duration=last-first
  play=min(duration,source_last-source_first)
  rate=(source_last-source_first)/play
  name=f'case01-sync-{i:02}'
  source='agent-course/media/demo-01.mp4'
  hold=f'agent-course/media/{name}-hold.jpg'
  # Last actually displayed source frame, also used as the hold image.
  hold_frame=source_first+round((play-1)*rate)
  run(['ffmpeg','-v','error','-y','-ss',str(hold_frame/30),'-i',str(PUBLIC/source),'-frames:v','1','-q:v','2',str(PUBLIC/hold)])
  target=PUBLIC/'agent-course/preview-proxies'/f'{name}.mp4'
  run(['ffmpeg','-v','error','-y','-ss',str(source_first/30),'-i',str(PUBLIC/source),'-an','-vf',f'setpts=(PTS-STARTPTS)/{rate},scale=1280:720:force_original_aspect_ratio=decrease:force_divisible_by=2,fps=30,tpad=stop_mode=clone:stop_duration=1','-frames:v',str(play),'-c:v','libx264','-preset','veryfast','-crf','20','-pix_fmt','yuv420p','-g','30','-movflags','+faststart',str(target)])
  probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-select_streams','v:0','-show_entries','stream=nb_frames','-of','json',str(target)]))
  assert int(probe['streams'][0]['nb_frames'])==play
  cuts.append(dict(id=name,label=label,from_=first,durationInFrames=duration,source=source,sourceStart=source_first/30,sourceEnd=source_last/30,playbackRate=rate,playFrames=play,holdImage=hold))
  cuts[-1]['from']=cuts[-1].pop('from_')
  cues.append(dict(label=label,courseStart=(first-43)/30,courseEnd=(last-43)/30,sourceStart=source_first/30,sourceEnd=source_last/30,holdSeconds=(duration-play)/30,playbackRate=rate))
  print(name,label,flush=True)
 old=json.loads(TIMELINE.read_text())
 others=[c for c in old if c['source']!='agent-course/media/demo-01.mp4']
 assert cuts[0]['from']==1853 and cuts[-1]['from']+cuts[-1]['durationInFrames']==3335
 assert all(a['from']+a['durationInFrames']==b['from'] for a,b in zip(cuts,cuts[1:]))
 TIMELINE.write_text(json.dumps(cuts+others,ensure_ascii=False,indent=2)+'\n')
 (ROOT/'work/case01-sync/cues.json').write_text(json.dumps(cues,ensure_ascii=False,indent=2)+'\n')
if __name__=='__main__':
 main()
 run([sys.executable,str(ROOT/'scripts/build-teaching-case01-preview.py')])
