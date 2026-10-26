"""Build the course's embedded HanziPen bold face from its local source font."""
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont

root = Path(__file__).resolve().parents[1]
text = ''.join(
    path.read_text()
    for path in (root / 'src/agent-teaching-v3').iterdir()
    if path.suffix in {'.tsx', '.ts', '.json'}
)
text += ''.join(chr(codepoint) for codepoint in TTFont(
    root / 'public/fonts/AgentFullHanzi.woff2'
).getBestCmap())
options = subset.Options()
options.flavor = 'woff2'
font = subset.load_font(str(root / 'public/fonts/HanziPenSC-Bold.otf'), options)
subsetter = subset.Subsetter(options=options)
subsetter.populate(text=text)
subsetter.subset(font)
subset.save_font(font, str(root / 'public/fonts/AgentTeachingHanzi-Bold.woff2'), options)
