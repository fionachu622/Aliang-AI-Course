"""Bake parallel demo cuts and still holds into one continuous preview decoder."""
from pathlib import Path
import json, subprocess
r=Path(__file__).resolve().parents[1]; b=r/'src/agent-teaching-v3'; w=r/'work/parallel-preview'; w.mkdir(parents=True,exist_ok=True)
ids=['recording-14','recording-15','recording-16','recording-17','recording-18','recording-18-summary','recording-18-confirm','recording-18-result']
cs=[c for c in json.loads((b/'recordings.timeline.json').read_text()) if c['id'] in ids]
parts=[]
def run(args): subprocess.run(['ffmpeg','-v','error','-y',*args],check=True)
enc=['-an','-c:v','libx264','-preset','veryfast','-crf','16','-pix_fmt','yuv420p']
scale='scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=0x24272A,setsar=1'
for i,c in enumerate(cs):
 if i: assert cs[i-1]['from']+cs[i-1]['durationInFrames']==c['from']
 name=c['id']+'.mp4';parts.append(name)
 run(['-ss',str(c['sourceStart']),'-t',str(c['sourceEnd']-c['sourceStart']),'-i',str(r/'public'/c['source']),'-vf',f"setpts=(PTS-STARTPTS)/{c['playbackRate']},fps=30,{scale},tpad=stop_mode=clone:stop_duration=2",'-frames:v',str(c['playFrames']),*enc,str(w/name)])
 hold=c['durationInFrames']-c['playFrames']
 if hold:
  name=c['id']+'-hold.mp4';parts.append(name)
  run(['-loop','1','-framerate','30','-i',str(r/'public'/c['holdImage']),'-vf',scale,'-frames:v',str(hold),*enc,str(w/name)])
(w/'concat.txt').write_text(''.join(f"file '{p}'\n" for p in parts))
source='agent-course/preview-proxies/parallel-original-continuous-v5.mp4'
run(['-f','concat','-safe','0','-i',str(w/'concat.txt'),'-vf','scale=in_range=auto:out_range=tv,format=yuv420p','-c:v','libx264','-preset','veryfast','-crf','16','-color_range','tv','-movflags','+faststart',str(r/'public'/source)])
(b/'parallel-preview.json').write_text(json.dumps({'source':source,'from':cs[0]['from'],'durationInFrames':sum(c['durationInFrames'] for c in cs),'cutIds':ids},indent=2)+'\n')
