"""Build individually timed recording excerpts; keep original narration untouched."""
from pathlib import Path
import json,math,subprocess
ROOT=Path(__file__).resolve().parents[3]
DATA=ROOT/'remotion/lesson1-token-video/src/agent-full'
MEDIA=ROOT/'remotion/lesson1-token-video/public/agent-course/media'
# times: narration start/end, recording in/out, playback (None = fit this action)
CUTS=[
 (1,'打开混杂文件',61.76,75.16,0,11,None),
 (1,'交代整理任务',75.16,81.64,11,18,None),
 (1,'查看并分类文件',81.64,93.5,18,34,None),
 (1,'查看整理后的项目',93.5,101,34,43,None),
 (1,'核对活动和财务文件',101,111.16,43,53.6,None),
 (2,'输入两天安排',182,193.68,0,12,None),
 (2,'允许操作日历',193.68,200.56,12,18,None),
 (2,'设置时间和提醒',200.56,207.92,18,26,None),
 (2,'核对六条日程',207.92,223.6,26,39.8,1),
 (3,'查看三份订单',241.32,256.36,0,20,None),
 (3,'输入合并任务',256.36,264.08,20,25,None),
 (3,'合并去重与汇总',264.08,271.88,25,36,None),
 (3,'核对汇总表与柱状图',271.88,287,36,44.6,1),
 (4,'展示三份材料',297.68,311.64,0,7,1),
 (4,'输入并行任务',311.64,319.68,7,12,None),
 (4,'三个任务同时执行',319.68,322.88,12,17,None),
 (4,'打开汇报PPT',322.88,325,30,34,None),
 (4,'打开团建海报',325,327.6,18,23,None),
 (4,'查看会议纪要正文',327.6,333.56,25.5,27.8,1),
 (5,'提出频道命名任务',511.5,515.16,0,9,None),
 (5,'查看候选名称',515.16,518.8,9,14,None),
 (5,'选定万物说并创建',518.8,525.8,14,22,None),
 (5,'发送视频要求与参考链接',542,556,22,31,1),
 (5,'提交任务让Agent继续执行',596.12,600.84,31,33,None),
 (5,'反馈机械3D效果',645,659.4,40,51,None),
 (5,'查看重做后的模型',659.4,669.56,51,56,None),
 (6,'查看羽化动作细节',673.48,676.28,58,64,None),
 (5,'确认效果后继续制作',742.84,748.6,63,75,None),
 (5,'导出中文讲解与字幕',748.6,756.76,75,88,None),
 (5,'上传与填写发布信息',756.76,768.36,195,224,None),
 (5,'发布前最后确认',768.36,775.16,224,244,None),
 (5,'检查发布结果与观看链接',775.16,784.76,244,263,None),
 (5,'播放频道内的成片',784.76,798.36,263,282,None),
]
REVIEW_CUTS=[
 ('recording-18-summary',(4,'核对行动事项与待确认',333.56,342.12,28.5,29.6,1)),
 ('recording-23-preview',(5,'查看第一版普通蛹预览',635.72,645,37,38.5,1)),
 ('recording-25-pupation',(6,'查看化蛹动作细节',669.56,673.48,25,31.5,None)),
 ('recording-26-wings',(6,'查看翅膀展开',676.28,679.08,76,83,None)),
 ('recording-26-replay',(6,'放慢回看羽化过程',679.08,684.12,58,64,None)),
]
CAPTIONS={
 'recording-23':'中间放手',
 'recording-25-pupation':'动作细节 · 化蛹',
 'recording-26':'动作细节 · 羽化',
 'recording-26-wings':'动作细节 · 展翅',
 'recording-26-replay':'放慢，再看一次',
}
def build(cuts):
 result=[]
 jobs=[(f'recording-{j:02}',cut) for j,cut in enumerate(cuts)]+REVIEW_CUTS
 for cut_id,(num,label,start,end,si,so,rate) in jobs:
  from_frame=round(start*30);length=round(end*30)-from_frame
  rate=rate if rate else (so-si)/(length/30)
  play=min(length,max(1,round((so-si)/rate*30)))
  hold=f'hold-{cut_id.removeprefix("recording-")}.jpg'
  src='butterfly-preview-export.mp4' if num==6 else f'demo-{num:02}.mp4'
  if play<length:
   subprocess.run(['ffmpeg','-v','error','-y','-ss',str(so-.06),'-i',str(MEDIA/src),'-frames:v','1','-q:v','2',str(MEDIA/hold)],check=True)
  item={'id':cut_id,'label':label,'from':from_frame,'durationInFrames':length,'source':f'agent-course/media/{src}','sourceStart':si,'sourceEnd':so,'playbackRate':rate,'playFrames':play,'holdImage':f'agent-course/media/{hold}'}
  if cut_id in CAPTIONS:item['caption']=CAPTIONS[cut_id]
  result.append(item)
 result.sort(key=lambda cut:cut['from'])
 (DATA/'recordings.timeline.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
 print('Recording excerpts:',len(result))
if __name__=='__main__':build(CUTS)
