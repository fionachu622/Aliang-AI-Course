"""Check continuous timing and source alignment of the playback repair."""
import json, subprocess, wave
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
W = ROOT / 'work/presenter-case-edit-v2'
OLD = ROOT / 'work/presenter-case-edit-v1'
OUT = W / '口播精剪_完整课程_播放修正版_v2.mp4'
D = json.loads((OLD / 'edit-map.json').read_text())

def run(args):
    return subprocess.check_output(['ffmpeg', '-v', 'error'] + args)

def frame(path, n):
    return np.frombuffer(run(['-ss', f'{n/30:.9f}', '-i', str(path), '-frames:v', '1',
        '-vf', 'scale=320:180', '-pix_fmt', 'rgb24', '-f', 'rawvideo', '-']), np.uint8).astype(float)

def main():
    p = json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-show_streams',
        '-show_format', '-of', 'json', str(OUT)]))
    v, a = p['streams']
    assert (v['codec_name'], v['width'], v['height'], v['r_frame_rate'], int(v['nb_frames'])) == ('h264',2560,1440,'30/1',33600)
    assert float(v['duration']) == 1120 and abs(float(a['duration']) - 1120) < .001
    packets = json.loads(subprocess.check_output(['ffprobe','-v','error','-select_streams','v',
        '-show_packets','-show_entries','packet=pts_time,dts_time','-of','json',str(OUT)]))['packets']
    pts = np.array([float(x['pts_time']) for x in packets])
    assert np.max(np.abs(pts - np.arange(33600)/30)) < .000002
    assert all(x['pts_time'] == x['dts_time'] for x in packets)
    raw = run(['-i', str(OUT), '-vn','-ac','1','-ar','8000','-f','s16le','-'])
    actual = np.frombuffer(raw,np.int16).astype(float)
    expected = np.frombuffer(run(['-i',str(OLD/'edited-stereo.wav'),'-ac','1','-ar','8000','-f','s16le','-']),np.int16).astype(float)
    checks=[]
    for i,s in enumerate(D['segments']):
        n=s['b']-s['a']
        image=[]
        for offset in sorted(set([0, min(5,n-1), n-1])):
            original=frame(D['source'],s['a']+offset)
            edited=frame(OUT,s['outputStartFrame']+offset)
            err=float(np.abs(original-edited).mean())
            assert err < 4, (i,offset,err)
            image.append({'offsetFrames':offset,'meanPixelError':err})
        # Search +/- 20 ms around the segment center for audio lag.
        center=round((s['outputStartFrame']+n/2)/30*8000)
        length=min(8000, max(800,round(n/30*8000)-400))
        start=max(160,min(center-length//2,len(expected)-length-160))
        ref=expected[start:start+length]; ref=ref-ref.mean()
        window=actual[start-160:start+length+160]
        scores=np.correlate(window,ref,'valid')
        lag=int(np.argmax(scores))-160
        corr=float(np.corrcoef(ref,actual[start+lag:start+lag+length])[0,1])
        assert abs(lag)<=8 and corr>.98,(i,lag,corr)
        checks.append({'segment':i,'frames':image,'audioLagMs':lag/8,'audioCorrelation':corr})
        print('PASS segment',i,flush=True)
    result={'durationSeconds':1120,'frames':33600,'continuousPts':True,'noBFrames':True,
        'scopeUnchanged':True,'segmentChecks':checks,'video':v,'audio':a}
    (W/'qc.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
    print('PASS all timing and source alignment checks',flush=True)

if __name__ == '__main__': main()
