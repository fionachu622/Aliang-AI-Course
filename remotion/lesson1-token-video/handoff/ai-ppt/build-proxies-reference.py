from pathlib import Path
import subprocess,json,concurrent.futures,time
source=Path('/Users/sniper/work/0自媒体/自媒体项目/03课程/Aliang-AI-Course/remotion/lesson1-token-video/public/ai-ppt')
out=Path('/Users/sniper/work/0自媒体/自媒体项目/03课程/Aliang-AI-Course/remotion/lesson1-token-video/work/ai-ppt/proxy-720p');out.mkdir(exist_ok=True)
def probe(p):return json.loads(subprocess.check_output(['ffprobe','-v','error','-count_packets','-show_entries','format=duration:stream=codec_type,codec_name,width,height,r_frame_rate,nb_read_packets','-of','json',str(p)]))
def build(p):
 q=out/p.name
 if not q.exists():
  subprocess.run(['ffmpeg','-v','error','-i',str(p),'-map','0:v:0','-map','0:a?','-vf','scale=-2:720','-c:v','libx264','-preset','veryfast','-crf','24','-pix_fmt','yuv420p','-g','30','-c:a','copy','-movflags','+faststart',str(q)],check=True)
 a,b=probe(p),probe(q);av=next(s for s in a['streams'] if s['codec_type']=='video');bv=next(s for s in b['streams'] if s['codec_type']=='video')
 assert av['nb_read_packets']==bv['nb_read_packets'],p.name
 assert av['r_frame_rate']==bv['r_frame_rate'],p.name
 assert abs(float(a['format']['duration'])-float(b['format']['duration']))<.05,p.name
 result={'file':p.name,'originalBytes':p.stat().st_size,'proxyBytes':q.stat().st_size,'original':a,'proxy':b};print(p.name,q.stat().st_size,'frames',bv['nb_read_packets'],'verified',flush=True);return result
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as e:results=list(e.map(build,sorted(source.glob('*.mp4'))))
(out/'proxy-verification.json').write_text(json.dumps(results,ensure_ascii=False,indent=2));print('TOTAL',sum(r['originalBytes'] for r in results),sum(r['proxyBytes'] for r in results),flush=True)
