"""Copy the existing Show Me stage into editable, frame-driven Remotion data.

Run from any directory: python3 scripts/import-show-me.py
Only the generated source.ts is rewritten; the original HTML is never changed.
"""

from html.parser import HTMLParser
from pathlib import Path
import json
import re


class Document(HTMLParser):
    VOID = {"meta", "link", "input", "br", "hr", "img"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = {"tag": "document", "attrs": {}, "children": []}
        self.stack = [self.root]

    def handle_starttag(self, tag, attrs):
        node = {"tag": tag, "attrs": dict(attrs), "children": []}
        self.stack[-1]["children"].append(node)
        if tag not in self.VOID:
            self.stack.append(node)

    def handle_endtag(self, tag):
        if tag in self.VOID:
            return
        assert self.stack[-1]["tag"] == tag, (tag, self.stack[-1]["tag"])
        self.stack.pop()

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        self.handle_endtag(tag)

    def handle_data(self, data):
        if data.strip() or "\n" not in data:
            self.stack[-1]["children"].append(data)


def walk(node):
    if isinstance(node, dict):
        yield node
        for child in node["children"]:
            yield from walk(child)


def text_content(node):
    if isinstance(node, str):
        return node
    return "".join(text_content(child) for child in node["children"])


def build_source():
    project_dir = Path(__file__).resolve().parents[1]
    original = project_dir.parents[1] / "outputs/show-me-ai-product/show-me-ai-product.html"
    document = Document()
    document.feed(original.read_text())
    nodes = list(walk(document.root))
    stage = next(n for n in nodes if n["attrs"].get("id") == "stage")
    config = json.loads(text_content(next(n for n in nodes if n["attrs"].get("id") == "project-data")))
    css = text_content(next(n for n in nodes if n["tag"] == "style"))
    variables = re.search(r":root\{([^}]+)\}", css)[1].replace("--stage-scale:.6", "--stage-scale:1")
    body = re.search(r"body\{([^}]+)\}", css)[1]
    # Extract only stage rules, never the original editor, transport or global CSS.
    canvas_css = css[css.index(".stage{"):css.index(".editing [data-edit]")]
    assert "@" not in canvas_css and not re.search(r"(?:animation|transition)\s*:", canvas_css)
    scope = ".lesson1-show-me"
    scoped_rules = []
    for selector, declarations in re.findall(r"([^{}]+)\{([^{}]*)\}", canvas_css):
        selectors = ",".join(f"{scope} {s.strip()}" for s in selector.split(","))
        scoped_rules.append(f"{selectors}{{{declarations}}}")
    scoped_css = "\n".join([
        f"{scope}{{{variables};{body}}}",
        f"{scope},{scope} *{{box-sizing:border-box}}",
        *scoped_rules,
    ])
    scenes = [n for n in stage["children"] if isinstance(n, dict) and n["tag"] == "section"]
    icons = next(n for n in stage["children"] if isinstance(n, dict) and n["tag"] == "svg")
    assert len(scenes) == len(config["scenes"])
    texts = {n["attrs"]["data-edit"]: text_content(n) for n in walk(stage) if "data-edit" in n["attrs"]}
    texts.update(config["texts"])
    for index, (scene, timing) in enumerate(zip(scenes, config["scenes"])):
        assert int(scene["attrs"]["data-scene"]) == index
        assert timing["duration"] > 0
        assert all(0 <= b["at"] < timing["duration"] for b in timing["beats"])
        assert [b["at"] for b in timing["beats"]] == sorted(b["at"] for b in timing["beats"])
        for node in walk(scene):
            assert node["tag"] not in {"script", "iframe", "style"}
            assert not any(key.startswith("on") for key in node["attrs"])
            if "data-beat" in node["attrs"]:
                assert 0 <= int(node["attrs"]["data-beat"]) < len(timing["beats"])
    return {
        "css": scoped_css,
        "icons": icons,
        "texts": texts,
        "scenes": [dict(timing, tree=scene) for timing, scene in zip(config["scenes"], scenes)],
    }


HEADER = '''// Imported from outputs/show-me-ai-product/show-me-ai-product.html.
// Editable snapshot. Re-running scripts/import-show-me.py replaces this file.
// Timing is the original 84-second narration estimate, not audio alignment.
export type ShowMeNode = string | {
  tag: string;
  attrs: Record<string, string | null>;
  children: ShowMeNode[];
};
export type ShowMeScene = {
  name: string;
  duration: number;
  beats: {at: number; label: string}[];
  narration: string;
  direction: string;
  tree: ShowMeNode;
};
export type ShowMeSource = {
  css: string;
  icons: ShowMeNode;
  texts: Record<string, string>;
  scenes: ShowMeScene[];
};
export const showMeSource: ShowMeSource = '''


if __name__ == "__main__":
    result = build_source()
    output = Path(__file__).resolve().parents[1] / "src/show-me/source.ts"
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(HEADER + json.dumps(result, ensure_ascii=False, indent=2) + ";\n")
    print(f"Imported {len(result['scenes'])} scenes, {sum(s['duration'] for s in result['scenes'])} seconds, {len(result['texts'])} editable text fields.")
