"""Bake existing editorial cuts into lightweight preview-only clips; never change source timing."""
import json,pathlib,subprocess
root=pathlib.Path(__file__).resolve().parents[1]
cuts=json.loads((root/'src/agent-full/recordings.timeline.json').read_text())
out=root/'public/agent-course/preview-proxies';out.mkdir(exist_ok=True)
manifest=[]
for cut in cuts:
 target=out/(cut['id']+'.mp4')
 vf=f"setpts=(PTS-STARTPTS)/{cut['playbackRate']},scale=1280:720:force_original_aspect_ratio=decrease:force_divisible_by=2,fps=30,tpad=stop_mode=clone:stop_duration=1"
 subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-ss',str(round(cut['sourceStart']*30)/30),'-i',str(root/'public'/cut['source']),'-an','-vf',vf,'-frames:v',str(cut['playFrames']),'-c:v','libx264','-preset','veryfast','-crf','22','-pix_fmt','yuv420p','-g','30','-keyint_min','30','-sc_threshold','0','-movflags','+faststart',str(target)],check=True)
 probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-select_streams','v:0','-show_entries','stream=nb_frames','-of','json',str(target)]))
 assert int(probe['streams'][0]['nb_frames'])==cut['playFrames'],cut['id']
 manifest.append({'id':cut['id'],'frames':cut['playFrames'],'bytes':target.stat().st_size})
 print(cut['id'],cut['playFrames'],'frames verified',flush=True)
(out/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
