from pathlib import Path
from bs4 import BeautifulSoup, NavigableString, Comment
import re,json,shutil
ROOT=Path(__file__).resolve().parent
# Project paths are deliberately explicit and local to the existing course project.
SOURCE=Path('/Users/sniper/work/0自媒体/自媒体项目/03课程/Aliang-AI-Course/outputs/agent-html-explainer')
PUBLIC=Path('/Users/sniper/work/0自媒体/自媒体项目/03课程/Aliang-AI-Course/remotion/lesson1-token-video/public/skill-tests/html-explainer')
tracks=json.loads((ROOT/'source-tracks.json').read_text())
layout=json.loads((SOURCE/'layout.json').read_text())
subs=json.loads((SOURCE/'subs.json').read_text())['segments']
order=json.loads((SOURCE/'project.json').read_text())['order']
css=(SOURCE/'theme.css').read_text()+(SOURCE/'assets/course.css').read_text()
def scoped(css):
    def rule(m):
        selectors=m[1].strip()
        result=[]
        for s in selectors.split(','):
            s=s.strip()
            result.append('.agent-html-scene' if s in ('html','body',':root') else '.agent-html-scene '+s)
        return ','.join(dict.fromkeys(result))+'{'+m[2]+'}'
    return re.sub(r'([^{}]+)\{([^{}]*)\}',rule,css)
imports=[];names=[]
for i,sid in enumerate(order):
    soup=BeautifulSoup((SOURCE/'frames'/f'{sid}.html').read_text(),'html.parser')
    localcss=''.join(s.get_text() for s in soup.find_all('style'))
    for el in soup.find_all(['script','style','link','meta','title']):el.decompose()
    nodes=[el for el in soup.find_all() if el.name not in ('html','head','body')]
    for n,el in enumerate(nodes): el['data-node']=str(n)
    animation={}
    for entry in tracks[sid]:
        method=entry['method'];args=entry['args'];selector=args[0]
        a=args[1];b=args[2] if method=='fromTo' else {}
        at=args[3] if method=='fromTo' else args[2] if len(args)>2 else 0
        duration=(b if method=='fromTo' else a).get('duration',0 if method=='set' else .5)
        for el in soup.select(selector):
            animation.setdefault(el['data-node'],[]).append({'kind':method,'from':a,'to':b,'at':at,'duration':duration,'ease':(b if method=='fromTo' else a).get('ease','power1.out')})
    def tree(el):
        if isinstance(el,Comment):return None
        if isinstance(el,NavigableString):return str(el)
        if el.name in ('html','head','body'):
            return [tree(c) for c in el.children if not isinstance(c,Comment)]
        attrs={k:(' '.join(v) if isinstance(v,list) else v) for k,v in el.attrs.items() if k!='data-node'}
        if 'src' in attrs:
            asset=Path(attrs['src']).name;shutil.copy2(SOURCE/'assets'/asset,PUBLIC/asset);attrs['src']=asset
        children=[]
        for c in el.children:
            v=tree(c)
            if isinstance(v,list):children.extend(v)
            elif v is not None:children.append(v)
        return {'tag':el.name,'attrs':attrs,'children':children,'tracks':animation.get(el.get('data-node'),[])}
    body=[]
    for c in (soup.body or soup.html or soup).children:
        if isinstance(c,Comment) or getattr(c,'name',None) in ('head','meta','link'):continue
        v=tree(c)
        if isinstance(v,list):body.extend(v)
        elif v is not None:body.append(v)
    start=round(layout[sid]['start_sec']*30)
    end=round(layout[order[i+1]]['start_sec']*30) if i+1<len(order) else round(490.42*30)
    sub=next(s for s in subs if s['id']==sid)
    scene={'id':sid,'start':start,'duration':end-start,'startSeconds':layout[sid]['start_sec'],'css':scoped(css+localcss),'nodes':body,'blocks':sub['blocks']}
    (ROOT/'scenes'/f'{sid}.json').write_text(json.dumps(scene,ensure_ascii=False,indent=2))
    imports.append(f"import {sid} from './scenes/{sid}.json';");names.append(sid)
(ROOT/'data.ts').write_text('\n'.join(imports)+'\nexport const scenes = ['+','.join(names)+'];\nexport const DURATION = 14713;\n')
shutil.copy2(SOURCE/'audio/narration-full.mp3',PUBLIC/'narration.mp3')
for ext in ('srt','vtt'):shutil.copy2(SOURCE/'out'/f'agent-chapters-01-02.{ext}',PUBLIC/f'captions.{ext}')
print(f'Migrated {len(order)} scene trees and their animation tracks; audio and screenshots copied.')
