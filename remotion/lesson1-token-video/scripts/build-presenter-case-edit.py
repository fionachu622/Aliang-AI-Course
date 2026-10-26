"""Edit the user's full talking-head master, preserving the rest of the course.

No webpage changes. Smart render the edited passage; copy untouched H.264 GOPs.
The source's closed GOP boundaries are verified at frame 15720 and 24593.
"""
import array, hashlib, json, subprocess, wave
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
WORK=ROOT/'work/presenter-case-edit-v1'
WORK.mkdir(parents=True,exist_ok=True)
SRC=Path('/Users/sniper/work/0自媒体/自媒体项目/03课程/AI课程资料/02 Agent 专题课/口播精剪.mp4')
PLAN=json.loads((ROOT/'work/youtube-local-review-v1/edit-plan.json').read_text())
FPS=30
TOTAL=38746
BEGIN=15731
END=24585
KEY_BEFORE=15720
KEY_AFTER=24593
OUTPUT=WORK/'口播精剪_完整课程_案例删减审片_v1.mp4'

def run(cmd): subprocess.run(cmd,check=True)

def main():
    cuts=[{'label':'此前课程及创建频道（完整保留）','a':0,'b':BEGIN}]
    cuts += [{'label':s['label'],'a':s['sourceStartFrame'],'b':s['sourceEndFrame']} for s in PLAN['segments']]
    cuts += [{'label':'后续课程（完整保留）','a':END,'b':TOTAL}]
    cursor=0
    for c in cuts:
        c['outputStartFrame']=cursor;cursor+=c['b']-c['a'];c['outputEndFrame']=cursor
    mapping={'source':str(SRC),'output':str(OUTPUT),'fps':30,'width':2560,'height':1440,
             'totalFrames':cursor,'durationSeconds':cursor/30,'removedSeconds':(TOTAL-cursor)/30,
             'scope':'完整真人口播；创建频道及案例外内容保留，仅剪制作视频对应口播；无录屏覆盖',
             'webpageChanged':False,'segments':cuts}
    (WORK/'edit-map.json').write_text(json.dumps(mapping,ensure_ascii=False,indent=2))
    # PCM is cut on exactly the same frame grid as the image. Keep stereo.
    with wave.open(str(WORK/'source-stereo.wav'),'rb') as f:
        assert (f.getframerate(),f.getnchannels(),f.getsampwidth())==(48000,2,2)
        pcm=array.array('h',f.readframes(f.getnframes()))
    with wave.open(str(WORK/'edited-stereo.wav'),'wb') as f:
        f.setparams((2,2,48000,0,'NONE','not compressed'))
        for i,c in enumerate(cuts):
            p=pcm[c['a']*3200:c['b']*3200]
            # Four-millisecond edge ramps only at actual noncontiguous edits.
            for n in range(192):
                for ch in range(2):
                    if i>0 and cuts[i-1]['b']!=c['a']:
                        p[n*2+ch]=round(p[n*2+ch]*n/192)
                    if i+1<len(cuts) and c['b']!=cuts[i+1]['a']:
                        pos=len(p)-2-n*2+ch;p[pos]=round(p[pos]*n/192)
            f.writeframes(p.tobytes())
    paths=[]
    prefix=WORK/'prefix.mp4'
    run(['ffmpeg','-v','error','-y','-i',str(SRC),'-map','0:v:0','-an','-frames:v',str(KEY_BEFORE),
         '-c:v','copy','-video_track_timescale','19200',str(prefix)])
    paths.append(prefix)
    # Add original edge frames so the rest can remain bit-for-bit stream copies.
    inner=[{'label':'前边界原帧','a':KEY_BEFORE,'b':BEGIN}]+cuts[1:-1]+[{'label':'后边界原帧','a':END,'b':KEY_AFTER}]
    for i,c in enumerate(inner):
        p=WORK/f'edit-{i:02}.mp4';paths.append(p)
        run(['ffmpeg','-v','error','-y','-ss',str(c['a']/30),'-i',str(SRC),'-map','0:v:0','-an',
             '-frames:v',str(c['b']-c['a']),'-vf','setpts=PTS-STARTPTS,setsar=1','-r','30',
             '-c:v','libx264','-profile:v','high','-level:v','5.0','-preset','fast','-b:v','20M',
             '-maxrate','30M','-bufsize','40M','-g','30','-bf','1','-threads','4',
             '-pix_fmt','yuv420p','-video_track_timescale','19200',str(p)])
        print(i,c['label'],flush=True)
    suffix=WORK/'suffix.mp4'
    run(['ffmpeg','-v','error','-y','-ss',str(KEY_AFTER/30),'-i',str(SRC),'-map','0:v:0','-an',
         '-frames:v',str(TOTAL-KEY_AFTER),'-c:v','copy','-video_track_timescale','19200',str(suffix)])
    paths.append(suffix)
    # Explicit duration makes B-frame DTS preroll irrelevant to concat offsets.
    expected=[KEY_BEFORE]+[c['b']-c['a'] for c in inner]+[TOTAL-KEY_AFTER]
    for p,n in zip(paths,expected):
        info=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-of','json',str(p)]))['streams'][0]
        assert int(info['nb_frames'])==n,(p,info['nb_frames'],n)
    (WORK/'concat.txt').write_text(''.join(f"file '{p.name}'\nduration {n/30:.9f}\n" for p,n in zip(paths,expected)))
    run(['ffmpeg','-v','warning','-y','-f','concat','-safe','0','-i',str(WORK/'concat.txt'),
         '-i',str(WORK/'edited-stereo.wav'),'-map','0:v:0','-map','1:a:0',
         '-c:v','copy','-c:a','aac','-b:a','320k','-ar','48000','-video_track_timescale','19200',
         '-movflags','+faststart',str(OUTPUT)])
    for p,h in PLAN['webpageHashes'].items():
        assert hashlib.sha256(Path(p).read_bytes()).hexdigest()==h,'Webpage changed: '+p
    print('COMPLETE',OUTPUT,'seconds',cursor/30,flush=True)

if __name__=='__main__': main()
