"""Import the existing 16-page Wanghong deck without rewriting its content.

Run from the Remotion project: python3 scripts/import-wanghong.py
The source HTML/CSS stay untouched. Animation groups mirror assets/timeline.js.
"""

import json
import subprocess
from html.parser import HTMLParser
from pathlib import Path

PROJECT = Path(__file__).resolve().parents[1]
SOURCE = PROJECT.parents[1] / "output/第1课-大模型与Token-handwritten-ppt"
DEST = PROJECT / "src/wanghong/source.ts"
SCOPE = ".lesson1-wanghong"
VOID = set("area base br col embed hr img input link meta param source track wbr".split())
BLOCK = set("div p ul ol li table tr td section code h1 h2 h3 h4 h5 figure blockquote hr pre svg".split())


class Parser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = {"tag": "root", "attrs": {}, "children": []}
        self.stack = [self.root]

    def handle_starttag(self, tag, attrs):
        node = {"tag": tag, "attrs": dict(attrs), "children": []}
        self.stack[-1]["children"].append(node)
        if tag not in VOID:
            self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID:
            self.stack.pop()

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i]["tag"] == tag:
                del self.stack[i:]
                return

    def handle_data(self, data):
        self.stack[-1]["children"].append(data)


def walk(node):
    if isinstance(node, dict):
        yield node
        for child in node["children"]:
            yield from walk(child)


def classes(node):
    return (node["attrs"].get("class") or "").split()


def text(node):
    return node if isinstance(node, str) else "".join(map(text, node["children"]))


def children(node):
    return [c for c in node["children"] if isinstance(c, dict)
            and not {"notes", "speaker-notes"}.intersection(classes(c))
            and c["tag"] != "script"]


def flatten(node, depth=0):
    items = children(node)
    if depth >= 2 or node["tag"] == "svg" or len(items) < 2:
        return [node]
    svgs = [c for c in items if c["tag"] == "svg"]
    rest = [c for c in items if c["tag"] != "svg"]
    if svgs or sum(c["tag"] in BLOCK for c in rest) >= 2:
        return svgs + [s for c in rest for s in flatten(c, depth + 1)]
    return [node]


parser = Parser()
parser.feed((SOURCE / "index.html").read_text())
slides = [n for n in walk(parser.root) if "slide" in classes(n)]
assert len(slides) == 16, "This importer is only for the selected 16-page deck."
texts, scenes = {}, []
for page, slide in enumerate(slides, 1):
    notes = [text(n).strip() for n in walk(slide) if "notes" in classes(n)]
    slide["children"] = [c for c in slide["children"] if not
                         (isinstance(c, dict) and "notes" in classes(c))]
    direct = children(slide)
    title = next((c for c in direct if "page-heading" in classes(c)), None)
    if title is None:
        title = next((c for c in direct if any(n["tag"] in {"h1", "h2"}
                                              for n in walk(c))), None)
    steps = ([title] if title else []) + [s for c in direct if c is not title
                                        for s in flatten(c)]
    for step, node in enumerate(steps):
        node["step"] = step
        def effects(current, inherited_stroke="none"):
            # Counters live in a dict to keep recursion independent of globals.
            stroke = current["attrs"].get("stroke", inherited_stroke)
            if current["tag"] in {"path", "line", "polyline", "rect", "circle", "ellipse"}:
                current["draw"] = {
                    "kind": "stroke" if stroke != "none" else "fill",
                    "at": step * 1.3 + .12 + counters["stroke"] * .07,
                }
                counters["stroke"] += 1
            if any(c == "marker" or c.startswith("marker-") for c in classes(current)):
                current["draw"] = {"kind": "clip", "at": step * 1.3 + .42 + counters["marker"] * .08}
                counters["marker"] += 1
            if "title-line" in classes(current):
                current["draw"] = {"kind": "line", "at": .06}
            for child in children(current):
                effects(child, stroke)

        counters = {"stroke": 0, "marker": 0}
        effects(node)
    for i, node in enumerate(walk(slide)):
        if node["children"] and all(isinstance(c, str) for c in node["children"]) and text(node).strip():
            key = f"p{page:02d}-t{i:03d}"
            node["textKey"] = key
            texts[key] = text(node)
    # Original auto mode: 1.3 seconds between steps, 2.2 seconds to read the end
    # state, then a .33 second paper wipe. No recorded narration is attached.
    duration = round((len(steps) - 1) * 1.3 + 2.2 + .33, 2)
    scenes.append({"name": slide["attrs"]["data-title"], "steps": len(steps),
                   "duration": duration, "notes": "\n".join(notes), "tree": slide})

css = "\n".join((SOURCE / p).read_text() for p in
                ["assets/base.css", "assets/neat-annotations.css", "style.css"])
# Parse selectors, including :not(...) and embedded SVG data URLs, with PostCSS.
# Scope every selector; remove browser-clock animation/print/UI-only at-rules.
css = subprocess.run(["node", "-e", r'''
const fs = require('fs');
const postcss = require('postcss');
const root = postcss.parse(fs.readFileSync(0, 'utf8'));
root.walkAtRules(rule => rule.remove());
root.walkDecls(/^(animation|transition)(-|$)/, decl => decl.remove());
root.walkRules(rule => {
  rule.selectors = rule.selectors.map(selector => {
    if (/^(:root|html|body)$/.test(selector)) return '.lesson1-wanghong';
    if (/^body\b/.test(selector)) return selector.replace(/^body/, '.lesson1-wanghong');
    return '.lesson1-wanghong ' + selector;
  });
});
process.stdout.write(root.toString());
'''], input=css, text=True, capture_output=True, check=True, cwd=PROJECT).stdout
css += """
.lesson1-wanghong { color-scheme: light; }
.lesson1-wanghong .deck { position: absolute; inset: 0; width: 1920px; height: 1080px; }
.lesson1-wanghong .slide { opacity: 1; transform: none; pointer-events: auto; }
.lesson1-wanghong .ann::after { font-size: 15.2px; }
"""

payload = {"source": str(SOURCE.relative_to(PROJECT.parents[1])), "css": css,
           "texts": texts, "scenes": scenes}
header = """// Generated by scripts/import-wanghong.py from the existing 16-page HTML.
// Edit this snapshot for local changes; rerunning the importer restores the original.
export type WanghongNode = string | {
  tag: string;
  attrs: Record<string, string | null>;
  children: WanghongNode[];
  step?: number;
  textKey?: string;
  draw?: {kind: 'stroke' | 'fill' | 'clip' | 'line'; at: number};
};
export type WanghongScene = {
  name: string;
  steps: number;
  duration: number;
  notes: string;
  tree: WanghongNode;
};
export const wanghongSource: {
  source: string;
  css: string;
  texts: Record<string, string>;
  scenes: WanghongScene[];
} = """
DEST.parent.mkdir(parents=True, exist_ok=True)
DEST.write_text(header + json.dumps(payload, ensure_ascii=False, indent=2) + ";\n")
print(json.dumps([{"page": i + 1, "name": s["name"], "steps": s["steps"],
                   "duration": s["duration"]} for i, s in enumerate(scenes)], ensure_ascii=False))
