"""Bake the entire orders preview and holds into one decoder; preserve render cuts."""
from pathlib import Path
import json,subprocess
r=Path(__file__).resolve().parents[1];w=r/'work/orders-full-preview';w.mkdir(parents=True,exist_ok=True);b=r/'src/agent-teaching-v3'
cs=[c for c in json.loads((b/'recordings.timeline.json').read_text()) if c['id'].startswith(('orders-intro-','orders-detail-')) or c['id'] in ['recording-10','recording-11','recording-12']]
for c in cs:
 proxy=r/'public/agent-course/preview-proxies'/(c['id']+'.mp4')
 subprocess.run(['ffmpeg','-v','error','-y','-i',str(proxy),'-an','-vf','scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:color=0x24272A,setsar=1,fps=30,tpad=stop_mode=clone:stop_duration=30','-frames:v',str(c['durationInFrames']),'-c:v','libx264','-preset','veryfast','-crf','20','-pix_fmt','yuv420p',str(w/(c['id']+'.mp4'))],check=True)
(w/'concat.txt').write_text(''.join("file '"+c['id']+".mp4'\n" for c in cs))
source='agent-course/preview-proxies/orders-full-continuous-v2.mp4'
subprocess.run(['ffmpeg','-v','error','-y','-f','concat','-safe','0','-i',str(w/'concat.txt'),'-c','copy','-movflags','+faststart',str(r/'public'/source)],check=True)
(b/'orders-intro-preview.json').write_text(json.dumps({'source':source,'from':cs[0]['from'],'durationInFrames':sum(c['durationInFrames'] for c in cs),'cutIds':[c['id'] for c in cs],'basis':'Whole orders case uses one continuous preview decoder including holds; original render sources and narration preserved.'},ensure_ascii=False,indent=2)+'\n')
