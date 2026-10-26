"""Keep the workbook closed until the narration invites result inspection."""
from pathlib import Path
import json, subprocess
r=Path(__file__).resolve().parents[1];b=r/'src/agent-teaching-v5';pub=r/'public';w=r/'work/orders-reveal-fix';w.mkdir(exist_ok=True,parents=True)
p=b/'recordings.timeline.json';data=json.loads(p.read_text())
# Output cue +43 legacy frames. All narration and the case end stay fixed.
changes={
 'orders-detail-chart-first':(8128,60,35+5/30,35+6/30,1,'讲述图表生成，保持Agent工作界面'),
 'orders-detail-autonomy':(8188,149,35+5/30,35+6/30,1,'自主安排讲解：保持Agent，尚未打开成果'),
 'orders-detail-open':(8337,46,37.8,37.8+46/30,46,'口播打开看看：点击并打开成果工作簿'),
 'orders-detail-duplicates':(8383,76,37.8+46/30,41,50,'在成果工作簿内核对合并去重，不返回Agent'),
 'orders-detail-total':(8459,40,41,41+40/30,40,'在工作簿内切至汇总，核对总额'),
 'orders-detail-chart-final':(8499,111,41+40/30,44.6,68,'保留成果图表，核对并完成任务'),
}
for c in data:
 if c['id'] not in changes:continue
 start,n,ss,se,play,label=changes[c['id']]
 c.update({'from':start,'durationInFrames':n,'sourceStart':ss,'sourceEnd':se,'playFrames':play,'playbackRate':(se-ss)*30/play,'label':label,'holdImage':f"agent-course/media/{c['id']}-v5-reveal-hold.jpg"})
 subprocess.run(['ffmpeg','-v','error','-y','-ss',str(se-1/30),'-i',str(pub/c['source']),'-frames:v','1',str(pub/c['holdImage'])],check=True)
cs=sorted([c for c in data if c['id'].startswith(('orders-intro-','orders-detail-'))],key=lambda c:c['from'])
assert cs[0]['from']==7240 and cs[-1]['from']+cs[-1]['durationInFrames']==8610
assert all(a['from']+a['durationInFrames']==z['from'] for a,z in zip(cs,cs[1:]))
for c in cs:
 vf=f"setpts=(PTS-STARTPTS)/{c['playbackRate']},scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,setsar=1,fps=30,tpad=stop_mode=clone:stop_duration=30"
 subprocess.run(['ffmpeg','-v','error','-y','-ss',str(c['sourceStart']),'-t',str(c['sourceEnd']-c['sourceStart']),'-i',str(pub/c['source']),'-an','-vf',vf,'-frames:v',str(c['durationInFrames']),'-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p',str(w/(c['id']+'.mp4'))],check=True)
(w/'concat.txt').write_text(''.join("file '"+c['id']+".mp4'\n" for c in cs))
source='agent-course/preview-proxies/orders-full-continuous-v5-reveal-v1.mp4'
subprocess.run(['ffmpeg','-v','error','-y','-f','concat','-safe','0','-i',str(w/'concat.txt'),'-c','copy','-movflags','+faststart',str(pub/source)],check=True)
p.write_text(json.dumps(sorted(data,key=lambda c:c['from']),ensure_ascii=False,indent=2)+'\n')
preview=json.loads((b/'orders-intro-preview.json').read_text());preview.update(source=source,basis='V5结果揭示修正：276.4667秒之前保持Agent；打开后留在成果工作簿；预览从与渲染相同的原片区间重建，画面等比铺满。')
(b/'orders-intro-preview.json').write_text(json.dumps(preview,ensure_ascii=False,indent=2)+'\n')
print('Rebuilt 1370 frames. Reveal cue: output 8294 / 276.4667 seconds. End unchanged.')
