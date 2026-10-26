import json,subprocess
from pathlib import Path
root=Path(__file__).resolve().parents[1]; work=root/'work/case01-sync'
work.mkdir(parents=True,exist_ok=True)
(root/'out').mkdir(exist_ok=True)
cuts=[c for c in json.loads((root/'src/agent-teaching-v3/recordings.timeline.json').read_text()) if c['id'].startswith('case01-sync-')]
for cut in cuts:
 src=root/'public/agent-course/preview-proxies'/f"{cut['id']}.mp4"
 dest=work/f"{cut['id']}-review.mp4"
 subprocess.run(['ffmpeg','-v','error','-y','-i',str(src),'-an','-vf','pad=1280:720:(ow-iw)/2:(oh-ih)/2:color=0x24272A,setsar=1,tpad=stop_mode=clone:stop_duration=20','-frames:v',str(cut['durationInFrames']),'-c:v','libx264','-preset','veryfast','-crf','20','-pix_fmt','yuv420p',str(dest)],check=True)
(work/'concat.txt').write_text(''.join(f"file '{c['id']}-review.mp4'\n" for c in cuts))
duration=sum(c['durationInFrames'] for c in cuts)/30
subprocess.run(['ffmpeg','-v','error','-y','-f','concat','-safe','0','-i',str(work/'concat.txt'),'-ss',str((cuts[0]['from']-43)/30),'-i',str(root/'public/agent-course/media/narration-title-cut.m4a'),'-map','0:v','-map','1:a','-t',str(duration),'-c:v','copy','-c:a','aac','-b:a','192k','-movflags','+faststart',str(root/'out/AgentTeachingV3-case01-synced.mp4')],check=True)
print('Review exported',duration,'seconds')

# Reuse the same frame-accurate picture as one continuous Studio-only proxy.
# No audio: AgentFullCourse owns the uninterrupted narration track.
import hashlib
version=hashlib.sha256(json.dumps(cuts,sort_keys=True).encode()).hexdigest()[:12]
proxy=f'agent-course/preview-proxies/case01-continuous-{version}.mp4'
subprocess.run(['ffmpeg','-v','error','-y','-i',str(root/'out/AgentTeachingV3-case01-synced.mp4'),'-map','0:v:0','-an','-c:v','copy','-movflags','+faststart',str(root/'public'/proxy)],check=True)
(root/'src/agent-teaching-v3/case01-preview.json').write_text(json.dumps(dict(source=proxy,from_=cuts[0]['from'],durationInFrames=sum(c['durationInFrames'] for c in cuts),cutIds=[c['id'] for c in cuts]),indent=2).replace('"from_":','"from":')+'\n')
