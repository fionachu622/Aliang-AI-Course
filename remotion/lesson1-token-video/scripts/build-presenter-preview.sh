#!/bin/sh
# Preview only: unchanged timeline, audio stream copied; exports retain the original master.
set -eu
cd "$(dirname "$0")/.."
ffmpeg -v error -y -threads 4 -i public/agent-course/recorded/presenter.mp4 \
  -vf scale=1280:720 -c:v libx264 -preset ultrafast -crf 24 -threads 4 \
  -g 60 -pix_fmt yuv420p -c:a copy -movflags +faststart \
  public/agent-course/preview-proxies/presenter-preview-v1.mp4
