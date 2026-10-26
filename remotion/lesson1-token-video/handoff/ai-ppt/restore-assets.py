#!/usr/bin/env python3
"""Requires gh authenticated for the private repo and ffmpeg. No credentials are stored."""
import hashlib,json,shutil,subprocess,zipfile
from pathlib import Path
HERE=Path(__file__).resolve().parent
PROJECT=HERE.parents[1]
data=json.loads((HERE/'assets.json').read_text())
download=HERE/'downloads';download.mkdir(exist_ok=True)
public=PROJECT/'public/ai-ppt';public.mkdir(parents=True,exist_ok=True)
for a in data['assets']:
 p=download/a['asset']
 if not p.exists():subprocess.run(['gh','release','download',data['release'],'--repo',data['repository'],'--pattern',a['asset'],'--dir',str(download)],check=True)
 h=hashlib.sha256()
 with p.open('rb') as f:
  for b in iter(lambda:f.read(8*1024*1024),b''):h.update(b)
 if h.hexdigest()!=a['sha256']:raise RuntimeError('Checksum mismatch: '+a['asset'])
 if a['role']=='documents':
  with zipfile.ZipFile(p) as z:z.extractall(HERE/'originals')
 elif a['role']=='fonts':
  with zipfile.ZipFile(p) as z:z.extractall(PROJECT/'public/fonts')
 else:
  dest=public/a['public']
  if not dest.exists():shutil.copy2(p,dest)
print('All 720P proxy materials verified and restored. Local 2K originals are not modified.')
