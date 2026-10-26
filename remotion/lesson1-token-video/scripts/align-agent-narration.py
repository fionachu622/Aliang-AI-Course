"""Map source phrases to measured Whisper token timestamps, retaining audit evidence.
Run from the repository root after local transcription. No global time stretching.
"""
from pathlib import Path
import json,re,difflib,math,codecs
ROOT=Path(__file__).resolve().parents[3]
DATA=ROOT/'remotion/lesson1-token-video/src/agent-full'
OUT=ROOT/'output/第2课-Agent音画对齐'
def norm(s):return ''.join(c.lower() for c in s if c.isalnum())
def main():
 d=json.loads((DATA/'course.semantic.storyboard.json').read_text())
 tr=json.loads((OUT/'transcript.json').read_text(errors='surrogateescape'))
 chars=[]; stamps=[]; evidence=[]
 for segment in tr['transcription']:
  decoder=codecs.getincrementaldecoder('utf-8')('replace')
  # Token boundaries are ASR estimates, not a character-count duration allocation.
  for token in segment['tokens']:
   text=token['text']
   if text.startswith('[_') or text.startswith('<|') or text.startswith('['):continue
   start=token['offsets']['from']/1000;end=token['offsets']['to']/1000
   if start<0 or end<start:continue
   text=decoder.decode(text.encode('utf-8',errors='surrogateescape'))
   for c in norm(text):chars.append(c);stamps.append(start);evidence.append(text)
 heard=''.join(chars)
 sources=[norm(x['source_text']) for x in d['paragraph_semantics']]
 script=''.join(sources); starts=[];n=0
 for s in sources:starts.append(n);n+=len(s)
 matcher=difflib.SequenceMatcher(None,script,heard,autojunk=False)
 mapping={a+k:b+k for a,b,size in matcher.get_matching_blocks() for k in range(size)}
 matched=sorted(mapping)
 import bisect
 audit=[]
 def anchor(index,phrase,lo,hi):
  # Select a real recognized token near the corresponding source phrase.
  candidates=[j for j in range(index,min(hi,index+max(8,len(norm(phrase))))) if j in mapping]
  if not candidates:
   near=bisect.bisect_left(matched,index)
   candidates=[j for j in matched[max(0,near-2):near+3] if lo<=j<hi]
  if not candidates:raise ValueError(f'No acoustic anchor: {phrase}')
  j=min(candidates,key=lambda j:abs(index-j));k=mapping[j]
  return {'seconds':stamps[k],'sourceChar':index,'matchedSourceChar':j,'distance':abs(index-j),'tokenIndex':k,'recognizedToken':evidence[k],'recognizedContext':heard[max(0,k-12):k+35],'phrase':phrase,'method':'whisper-token + source sequence alignment'}
 scene_anchors=[]
 for i,s in enumerate(d['scenes']):
  lo=starts[i];hi=lo+len(sources[i]);a=anchor(lo,sources[i][:15],lo,hi);scene_anchors.append(a)
  cursor=0
  for node in s['nodes']:
   excerpt=norm(node['excerpt']);p=sources[i].find(excerpt,cursor)
   if p<0:p=sources[i].find(excerpt)
   if p<0:raise ValueError(f"Missing source phrase {s['id']} {excerpt}")
   cursor=p+len(excerpt)
   node['audioAnchor']=anchor(lo+p,node['excerpt'],lo,hi)
   audit.append({'id':node['id'],**node['audioAnchor']})
 boundaries=[max(0,math.ceil(s['nodes'][0]['audioAnchor']['seconds']*30)) for s in d['scenes']]
 boundaries.append(math.ceil(1293.026395*30))
 for i,s in enumerate(d['scenes']):
  if boundaries[i+1]<=boundaries[i]:raise ValueError(f"Nonmonotonic scene {s['id']}")
  s['startFrame']=boundaries[i];s['durationInFrames']=boundaries[i+1]-boundaries[i]
  s['audioAnchor']=scene_anchors[i]
  for j,node in enumerate(s['nodes']):
   node['at']=max(0,math.ceil(node['audioAnchor']['seconds']*30)-s['startFrame'])
   s['states'][j]['preview_frame']=s['startFrame']+min(s['durationInFrames']-1,node['at']+25)
  cue=d['cues'][i];cue['start']=s['startFrame']/30;cue['end']=boundaries[i+1]/30
  for beat,node in zip(cue['ordered_beats'],s['nodes']):beat['audio_anchor']=node['audioAnchor']
 d['durationInFrames']=boundaries[-1];d['sync_level']='timed'
 d['preview_timing_note']='Actual narration timeline. Local ASR token anchors matched to the source; editorial corrections and screen-recording cuts are retained in sync-overrides.json.'
 d['asset_status']='Five supplied screen recordings copied into public/agent-course/media. Original narration extracted without editing; screen recordings muted.'
 (DATA/'course.storyboard.json').write_text(json.dumps(d,ensure_ascii=False,indent=2))
 (OUT/'alignment-audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2))
 lines=[]
 for i,s in enumerate(d['scenes']):
  lines.append(f"\n{s['id']} {s['startFrame']/30:.2f}–{(s['startFrame']+s['durationInFrames'])/30:.2f} {s['title']} | {s['audioAnchor']['recognizedContext']}")
  for n in s['nodes']:
   a=n['audioAnchor'];lines.append(f"  {a['seconds']:.2f} d={a['distance']} {n['text'].replace(chr(10),' / ')} | {a['recognizedContext']}")
 (OUT/'alignment-audit.txt').write_text('\n'.join(lines))
 print('Matched source characters:',len(mapping),'/',len(script),'Duration:',boundaries[-1]/30)
if __name__=='__main__':main()
