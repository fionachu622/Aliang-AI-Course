"""Standalone local review export. Never writes to src/ or public/.

All narration points refer to the old ASR clock; the master removed 43 frames
before this passage. Raw recording times are seconds in 制作视频 2.mp4.
"""
from pathlib import Path
import array, hashlib, json, math, subprocess, sys, wave

ROOT = Path(__file__).resolve().parents[1]
WORK = ROOT / 'work/youtube-local-review-v1'
WORK.mkdir(parents=True, exist_ok=True)
RAW = Path('/Users/sniper/work/0自媒体/自媒体项目/03课程/AI课程资料/02 Agent 专题课/案例准备/05 youtube 内容制作/制作视频 2.mp4')
MASTER = ROOT / 'public/agent-course/recorded/presenter.mp4'
FPS = 30
SHIFT = 43 / FPS
OUTPUT = WORK / '05 制作视频_口播对齐_本地审片_v1.mp4'

# One source of truth: retained narration, its teaching purpose, real footage.
# Crop coordinates are in the 1600-pixel-wide audit images, not invented UI.
EDITS = [
 ('说清结果', 525.8, 530.92, [(2.8, None)]),
 ('效果参考', 541.96, 545.12, [(3.2, [240,280,1056,594])]),
 ('时长、中文讲解与字幕', 551.04, 554.84, [(3.2, [240,280,1056,594])]),
 ('先预览、确认后成片和发布', 579.28, 585.96, [(11,[240,0,1056,594])]),
 ('中间放手、让 Agent 自主推进', 596.12, 607.32, [(85,None)]),
 ('开始制作动画', 622.04, 624.44, [(96.2,None)]),
 ('查看初版', 635.72, 639.56, [(474,None)]),
 ('普通模型与机械质感存在差距', 639.56, 645.00, [(525,None)]),
 ('真实反馈指令', 645.00, 650.52, [(793,None)]),
 ('放手不等于不检查', 650.52, 657.16, [(812,None)]),
 ('说清具体问题', 713.64, 717.08, [(819,None)]),
 ('说明期望效果、无需教代码', 722.12, 728.12, [(822.44,None)]),
 ('重做后的蓝金机械模型', 657.16, 664.28, [(1408,[640,90,950,534])]),
 ('第三步：关键把关', 684.12, 689.16, [(1415.12,[640,90,950,534])]),
 ('导出成片、准备讲解字幕和发布信息', 745.56, 753.48, [(1450,None,3.04),(2643,None)]),
 ('检查成片与化蛹过程', 667.72, 673.48, [(2689,[250,130,900,506])]),
 ('检查羽化', 673.48, 676.28, [(2731,[250,130,900,506])]),
 ('检查展翅', 676.28, 677.63, [(2748,[250,130,900,506])]),
 ('看过成片后同意发布', 742.84, 745.56, [(2800,None)]),
 ('开始操作发布网页', 756.76, 758.04, [(3019,None)]),
 ('从制作推进到发布', 764.92, 768.36, [(3020.28,None)]),
 ('发布回执、核对频道与标题', 775.16, 783.32, [(3051,None)]),
 ('打开观看链接', 783.32, 784.76, [(3060,None)]),
 ('确认正常播放', 784.76, 788.28, [(3075,None)]),
 ('收束三步方法与交付检查', 811.08, 820.92, [(3103,None)]),
]

def run(cmd):
    subprocess.run(cmd, check=True)

def build_plan():
    # Snapshot active webpage configuration: this review must not change it.
    paths = [ROOT/'src/agent-teaching-v3/AgentFullCourse.tsx',
             ROOT/'src/agent-teaching-v3/practice-recording-only.json',
             ROOT/'src/agent-teaching-v3/narration-edit.json']
    hashes = {str(p): hashlib.sha256(p.read_bytes()).hexdigest() for p in paths if p.exists()}
    segments=[]; cursor=0
    for index,(label,a,b,visuals) in enumerate(EDITS):
        start=round((a-SHIFT)*FPS); end=round((b-SHIFT)*FPS)
        frames=end-start
        used=0; shots=[]
        for j,v in enumerate(visuals):
            sf=round(v[2]*FPS) if len(v)>2 else frames-used
            shots.append({'sourceStart':v[0],'frames':sf,'crop':v[1], 'rate':1})
            used+=sf
        assert used==frames
        segments.append(dict(id=index,label=label,sourceStartFrame=start,
            sourceEndFrame=end,outputStartFrame=cursor,frames=frames,shots=shots))
        cursor+=frames
    plan=dict(scope='创建频道后的制作视频案例；独立审片，不替换网页',
        core_question='怎样把一条视频从需求交给 Agent 推进到发布并验收？',
        teaching_path=['说清结果和确认边界','放手执行','具体反馈与修改','检查成片后确认发布','验收可播放交付'],
        narration=str(MASTER), recording=str(RAW), fps=FPS,width=2560,height=1440,
        encoding='H.264 / high quality VBR 20 Mbps target, 30 Mbps max / AAC 320 kbps',
        audio_policy='原声剪切与重排，不改速、不合成；录屏静音',
        visual_policy='真实录屏正常速度跳剪；不补帧，不循环，不用长定格填充；仅裁切聚焦',
        removed=['蝴蝶阶段的需求展开','成长感悟展开','生物细节展开','放慢羽化和删减结尾的假设修改','重复检查说明','重复发布确认','重复总结'],
        reordered=['具体反馈原则移到实际机械效果反馈之后','导出成片移至发布确认之前','发布确认移至成片检查之后'],
        durationInFrames=cursor, duration=cursor/FPS,segments=segments,webpageHashes=hashes)
    (WORK/'edit-plan.json').write_text(json.dumps(plan,ensure_ascii=False,indent=2))
    return plan

def audio(plan):
    wav=WORK/'master.wav'
    if not wav.exists():
        run(['ffmpeg','-v','error','-y','-i',str(MASTER),'-vn','-ac','1','-ar','48000','-c:a','pcm_s16le',str(wav)])
    with wave.open(str(wav),'rb') as f:
        sr=f.getframerate(); data=array.array('h',f.readframes(f.getnframes()))
    out=array.array('h')
    for s in plan['segments']:
        a=s['sourceStartFrame']*1600; n=s['frames']*1600
        part=data[a:a+n]
        # 4 ms edge ramps suppress edit clicks without stretching or overlap.
        fade=192
        for j in range(fade):
            part[j]=round(part[j]*j/fade)
            part[-1-j]=round(part[-1-j]*j/fade)
        out.extend(part)
    with wave.open(str(WORK/'edited-narration.wav'),'wb') as f:
        f.setparams((1,2,48000,0,'NONE','not compressed'));f.writeframes(out.tobytes())

def render(plan):
    files=[]
    for s in plan['segments']:
        for j,shot in enumerate(s['shots']):
            p=WORK/f"shot-{s['id']:02}-{j}.mp4";files.append(p)
            signature=hashlib.sha256(json.dumps(shot,sort_keys=True).encode()).hexdigest()
            stamp=p.with_suffix('.sha256')
            if p.exists() and stamp.exists() and stamp.read_text()==signature: continue
            vf=''
            if shot['crop']:
                x,y,w,h=shot['crop']; ratio=2596/1600
                x,y,w,h=[round(v*ratio/2)*2 for v in (x,y,w,h)]
                vf=f'crop={w}:{h}:{x}:{y},'
            vf+='setpts=PTS-STARTPTS,fps=30,scale=2560:1440:force_original_aspect_ratio=decrease:flags=lanczos,pad=2560:1440:(ow-iw)/2:(oh-ih)/2:color=0x202426,setsar=1'
            run(['ffmpeg','-v','error','-y','-ss',str(shot['sourceStart']),'-i',str(RAW),
                 '-vf',vf,'-frames:v',str(shot['frames']),'-an','-c:v','libx264','-preset','fast',
                 '-b:v','20M','-maxrate','30M','-bufsize','40M','-threads','4','-pix_fmt','yuv420p',
                 '-g','60','-color_primaries','bt709','-color_trc','bt709','-colorspace','bt709',str(p)])
            stamp.write_text(signature)
            print(s['id'],j,s['label'],flush=True)
    concat=WORK/'concat.txt'
    concat.write_text(''.join(f"file '{p.name}'\n" for p in files))
    run(['ffmpeg','-v','error','-y','-f','concat','-safe','0','-i',str(concat),
         '-i',str(WORK/'edited-narration.wav'),'-map','0:v','-map','1:a',
         '-c:v','copy','-c:a','aac','-b:a','320k','-ar','48000','-movflags','+faststart',str(OUTPUT)])
    for p,h in plan['webpageHashes'].items():
        assert hashlib.sha256(Path(p).read_bytes()).hexdigest()==h, f'Webpage changed: {p}'
    print('COMPLETE',str(OUTPUT),plan['duration'],flush=True)

if __name__=='__main__':
    plan=build_plan()
    audio(plan)
    if '--audio-only' not in sys.argv: render(plan)
