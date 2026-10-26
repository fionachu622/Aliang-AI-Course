import json,re
from pathlib import Path
r=Path(__file__).resolve().parent
tr=json.loads((r/'transcript.json').read_text())
fix={23:'很多人用 AI 做的 PPT 是这个样子的',39:'我手上现在有三份产品资料',58:'这样的 PPT 用来做新品宣传',61:'不是一句话丢给 AI',81:'让 AI 出大纲',87:'要在新品体验会上讲五分钟',101:'心里就有底了',111:'我把模板传上去',114:'都按模板来',116:'生成好了',131:'AI 调用 Skill',136:'前面的对话框里的更多',138:'就是豆包自带的 PPT Skill',145:'叫这个 guizang PPT Skill',147:'我们在输入框里输入',149:'guizang PPT Skill',159:'用这个 guizang PPT Skill 就行',174:'生成好了',177:'我们解压之后',179:'就能在浏览器里翻页看了',187:'那版能更有设计感',189:'深浅页交替',200:'那这就到了第三步',230:'它再动手做',233:'光线平 显得廉价',235:'换成纯黑背景',239:'生成好了',241:'跟刚才手机拍的原图比',259:'只适合拿来当整页的大图',273:'放在痛点页',275:'这副耳机用在哪',278:'我们先另存一版',283:'生成好了',287:'字少了 一页就讲一件事',299:'刚才那几处都对了',310:'当作附录',311:'到这图和排版都调好了',328:'三色耳机那页',329:'叠着的三个盒子慢慢滑开',331:'其他页就简单地淡入淡出',349:'生成好了',359:'看着也不怎么花哨',360:'最后我们把开头一句话做出来的',361:'那版也打开',362:'和这一版放在一起',363:'同一份资料',364:'那版是手机随手拍的照片',366:'这一版做出来的图有质感',367:'图大了',371:'应该是拿得出手',374:'一条条提的要求',380:'把这些要求存下来',395:'Skill 存好了',397:'新开一个对话',399:'磁吸充电宝',410:'我们再把开头那版拿出来',414:'AI 不知道我们要什么',420:'一出来图大字少',423:'到这里这节课就讲完了',443:'这套方法除了做新品宣传',447:'也可以用国外的 Claude 或 Codex 来做',448:'然后关于 Claude Codex 的使用方法',454:'好了 这节课我们就到这里',456:'我们下节课再见'}
replacements={'确诊':'宣传','新面':'新品','大杠':'大纲','板式':'版式','Scale':'Skill','SQL':'Skill','思调':'Skill','BBT':'PPT','那一板':'那一版','整封':'整份','电子杂质':'电子杂志','杂质感':'杂志感','圆图':'原图','推到重来':'推倒重来','排板':'排版','自少':'字少'}
rows=[]
for i,s in enumerate(tr):
 text=fix.get(i,s['text'])
 for a,b in replacements.items():text=text.replace(a,b)
 # Refers to the software rather than a person.
 text=text.replace('发给他','发给它').replace('告诉他','告诉它').replace('他没有','它没有').replace('他都会','它都会').replace('他就能','它就能').replace('让他把','让它把')
 rows.append({'text':text.strip(),'startMs':round(s['start']*1000),'endMs':round(s['end']*1000),'timestampMs':round(s['start']*1000),'confidence':None})
(r.parents[1]/'src/ai-ppt/captions.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2))
(r/'caption-corrections.json').write_text(json.dumps({str(i):{'recognized':tr[i]['text'],'corrected':t} for i,t in fix.items()},ensure_ascii=False,indent=2))
