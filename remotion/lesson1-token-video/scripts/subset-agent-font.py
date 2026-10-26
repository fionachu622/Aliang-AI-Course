from pathlib import Path
from fontTools import subset
root=Path(__file__).resolve().parents[1]
text=''.join(p.read_text() for folder in ['agent-full','agent-course'] for p in (root/'src'/folder).rglob('*') if p.suffix in ['.tsx','.ts','.json'])
options=subset.Options();options.flavor='woff2'
font=subset.load_font(str(root/'public/fonts/HanziPenSC-Regular.otf'),options)
subsetter=subset.Subsetter(options=options);subsetter.populate(text=text);subsetter.subset(font)
subset.save_font(font,str(root/'public/fonts/AgentFullHanzi.woff2'),options)
