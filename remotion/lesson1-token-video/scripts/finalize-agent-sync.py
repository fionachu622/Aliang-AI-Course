from pathlib import Path
import json,math
ROOT=Path(__file__).resolve().parents[3];DATA=ROOT/'remotion/lesson1-token-video/src/agent-full'
p=DATA/'course.storyboard.json';d=json.loads(p.read_text())
lead={
 's06':(166.52,'操作电脑','第一个，是直接操作电脑'),
 's07':(223.60,'连续执行','围绕一个目标连续干活'),
 's09':(344.0,'工具 + 权限','各自的工具和权限支持下的能力'),
 's10':(364.0,'Agent 怎么办事？','Agent 到底是怎么做到的'),
 's11':(438.4,'核心工作循环','Agent 最核心的工作循环'),
 's26':(820.96,'关键把关','Agent 有多能干，闯祸就有多快'),
 's27':(844.72,'删除与覆盖','第二个，删除和覆盖'),
 's29':(883.4,'到哪里用 Agent？','日常想用 Agent，去哪找'),
}
review=json.loads((DATA/'sync-overrides.json').read_text())
overrides=review['nodeSeconds']
for sid,entry in review.get('sceneLeadIns',{}).items():
 lead[sid]=(entry['seconds'],entry['text'],entry['excerpt'])
for s in d['scenes']:
 for n in s['nodes']:
  if n['id'] in overrides:
   n['audioAnchor'].setdefault('originalSeconds',n['audioAnchor']['seconds'])
   n['audioAnchor']['seconds']=overrides[n['id']]
   n['audioAnchor']['method']='ASR token context editorial correction'
  if n['id'] in review.get('nodeText',{}):n['text']=review['nodeText'][n['id']]
  if n['id'] in review.get('nodeExcerpts',{}):
   n['excerpt']=review['nodeExcerpts'][n['id']]
   n['audioAnchor']['phrase']=n['excerpt']
 s['leadIn']=None
 if s['id']=='s01':s['startFrame']=0
 if s['id'] in lead:
  sec,text,excerpt=lead[s['id']];s['startFrame']=math.ceil(sec*30);s['leadIn']={'text':text,'source_excerpt':excerpt,'source':'口播精剪.mp4','seconds':sec}
 if s['id']=='s04':s['startFrame']=round(61.76*30)
 if s['id'] in review.get('sceneStartSeconds',{}):s['startFrame']=round(review['sceneStartSeconds'][s['id']]*30)
for i,s in enumerate(d['scenes']):
 end=d['scenes'][i+1]['startFrame'] if i+1<len(d['scenes']) else d['durationInFrames']
 s['durationInFrames']=end-s['startFrame'];cue=d['cues'][i];cue['start']=s['startFrame']/30;cue['end']=end/30
 for j,n in enumerate(s['nodes']):
  n['at']=max(0,math.ceil(n['audioAnchor']['seconds']*30)-s['startFrame'])
  cue['ordered_beats'][j]['audio_anchor']=n['audioAnchor']
  cue['ordered_beats'][j]['source_excerpt']=n['excerpt']
  cue['ordered_beats'][j]['understanding']=n['text'].replace('\n',' / ')
  s['states'][j]['preview_frame']=min(end-1,s['startFrame']+n['at']+25)
d['timing_source']='口播精剪.mp4 → narration.m4a; local Whisper token timestamps, source phrase matching, contextual corrections. Recordings individually cut against narration.'
d['recorded_opening']={**json.loads((DATA/'opening.timeline.json').read_text()),'source':'口播精剪.mp4 00:00–01:01.76'}
d['recording_cuts']=json.loads((DATA/'recordings.timeline.json').read_text())
d['version']='1.10'
d['review_20260929']={'source':'outputs/agent-course-video/review-20260929/审片报告.md','line_seconds':review.get('lineSeconds',{}),'tool_map':'Persistent seven-row layout, items revealed individually at narration cues; completed items retained through s38.'}
d['no_early_review']={'opening_text_cues':'opening-text.timeline.json','tool_map_cues':'tool-map.timeline.json','text_parts':review.get('textParts',{}),'lead_in_seconds':review.get('leadInSeconds',{}),'scope':'53 scene timing audit + 38 recording interval audit; not a full rendered playback review'}
p.write_text(json.dumps(d,ensure_ascii=False,indent=2))
