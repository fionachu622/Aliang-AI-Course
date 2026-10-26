"""Verify output frame mapping, copied GOP integrity, and A/V duration."""
from pathlib import Path
import hashlib,json,subprocess
from PIL import Image,ImageChops,ImageStat,ImageDraw

ROOT=Path(__file__).resolve().parents[1]
W=ROOT/'work/presenter-case-edit-v1'
D=json.loads((W/'edit-map.json').read_text())
SRC=Path(D['source']);OUT=Path(D['output'])

def probe(p):
    return json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(p)]))

def frame(p,n,out):
    subprocess.run(['ffmpeg','-v','error','-y','-ss',f'{n/30:.9f}','-i',str(p),'-frames:v','1',
                    '-vf','scale=640:360',str(out)],check=True)
    return Image.open(out).convert('RGB')

def pixelhash(p,n):
    result=subprocess.check_output(['ffmpeg','-v','error','-ss',f'{n/30:.9f}','-i',str(p),
                                  '-map','0:v','-frames:v','1','-f','framemd5','-']).decode()
    return [l.split(',')[-1].strip() for l in result.splitlines() if not l.startswith('#') and l.strip()][0]

def main():
    p=probe(OUT);v=next(s for s in p['streams'] if s['codec_type']=='video');a=next(s for s in p['streams'] if s['codec_type']=='audio')
    assert int(v['nb_frames'])==D['totalFrames'],v
    assert (v['width'],v['height'],v['r_frame_rate'],v['codec_name'])==(2560,1440,'30/1','h264')
    assert abs(float(v['duration'])-float(a['duration']))<.04
    checks=[];pairs=[]
    for i,s in enumerate(D['segments']):
        offset=min(15,(s['b']-s['a'])//2)
        nf=s['outputStartFrame']+offset;sf=s['a']+offset
        l=frame(SRC,sf,W/f'original-{i:02}.png');r=frame(OUT,nf,W/f'edited-{i:02}.png')
        error=sum(ImageStat.Stat(ImageChops.difference(l,r)).mean)/3
        assert error<3.0,(i,nf,sf,error)
        checks.append({'segment':i,'sourceFrame':sf,'outputFrame':nf,'meanPixelDifference':error})
        if i in [0,1,5,9,13,15,18,20,24,26]:pairs.append((i,l,r))
    # Undisturbed course images must decode to exactly the original pixels.
    copied=[]
    shift=5146
    for sf in [0,9000,15719,24593,30000,38745]:
        nf=sf if sf<15720 else sf-shift
        same=pixelhash(SRC,sf)==pixelhash(OUT,nf)
        assert same,(sf,nf,'untouched frame changed')
        copied.append({'sourceFrame':sf,'outputFrame':nf,'pixelIdentical':same})
    for page in range(0,len(pairs),4):
        img=Image.new('RGB',(1280,1600),'#eeeeee');draw=ImageDraw.Draw(img)
        for j,(i,l,r) in enumerate(pairs[page:page+4]):
            y=j*400;img.paste(l,(0,y));img.paste(r,(640,y));draw.text((8,y+365),f'Segment {i}: original / edited',fill='black')
        img.save(W/f'comparison-{page//4}.jpg')
    info={'durationSeconds':v['duration'],'audioDurationSeconds':a['duration'],'frames':v['nb_frames'],
          'resolution':[2560,1440],'fps':30,'format':'H.264 MP4','channels':a['channels'],
          'mappedSegments':checks,'untouchedPixelChecks':copied,'sizeBytes':OUT.stat().st_size}
    (W/'qc.json').write_text(json.dumps(info,ensure_ascii=False,indent=2))
    print('PASS',info['durationSeconds'],len(checks),'segments; copied pixels identical',flush=True)

if __name__=='__main__':main()
