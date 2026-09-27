#!/usr/bin/env python3
"""Print wiki vs generated effect summary for every arcane — for manual verification."""

from __future__ import annotations

import json
import re
import urllib.parse
import urllib.request
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
EFFECTS = REPO / "src" / "data" / "arcane-effects.ts"
ARCANES = REPO / "src" / "data" / "arcanes.ts"
HEADERS = {"User-Agent": "Voidforge/1.0"}


def slugify(name: str) -> str:
    s = name.lower().replace("arcane ", "")
    return re.sub(r"[^a-z0-9]+", "_", s).strip("_")


def load_fh() -> dict[str, str]:
    text = ARCANES.read_text(encoding="utf-8")
    out = {}
    for m in re.finditer(r'id:\s*"([^"]+)".*?description:\s*"((?:[^"\\]|\\.)*)"', text, re.S):
        out[m.group(1)] = m.group(2).replace("\\ ", " ").replace("\\n", " ")
    return out


def load_effects() -> dict[str, dict]:
    text = EFFECTS.read_text(encoding="utf-8")
    out = {}
    for m in re.finditer(r'"([^"]+)":\s*\{', text):
        aid = m.group(1)
        start = m.start()
        depth = 0
        i = m.end() - 1
        while i < len(text):
            if text[i] == "{":
                depth += 1
            elif text[i] == "}":
                depth -= 1
                if depth == 0:
                    block = text[start : i + 1]
                    break
            i += 1
        else:
            continue
        trigger = re.search(r'"trigger":\s*"([^"]+)"', block)
        effects = re.findall(r'"stat":\s*"([^"]+)",\s*"maxValue":\s*([\d.]+)', block)
        out[aid] = {"trigger": trigger.group(1) if trigger else "?", "effects": effects}
    return out


def fetch_wiki() -> dict[str, str]:
    params = {"action": "parse", "page": "Module:Arcane/data", "prop": "wikitext", "format": "json"}
    url = "https://wiki.warframe.com/api.php?" + urllib.parse.urlencode(params)
    with urllib.request.urlopen(urllib.request.Request(url, headers=HEADERS), timeout=120) as r:
        text = json.loads(r.read())["parse"]["wikitext"]["*"]
    out = {}
    for m in re.finditer(r'\["([^"]+)"\]\s*=\s*\{', text):
        name = m.group(1)
        start = m.end() - 1
        depth = 0
        for i in range(start, len(text)):
            if text[i] == "{":
                depth += 1
            elif text[i] == "}":
                depth -= 1
                if depth == 0:
                    block = text[start : i + 1]
                    break
        desc_m = re.search(r'Description\s*=\s*"((?:[^"\\]|\\.)*)"', block)
        if desc_m:
            out[slugify(name)] = desc_m.group(1).replace("\\r\\n", "\n").replace("\\n", "\n")
    return out


def main() -> None:
    fh = load_fh()
    eff = load_effects()
    wiki = fetch_wiki()
    lines = []
    for aid in sorted(fh.keys()):
        bare = aid.replace("arcane_", "", 1) if aid.startswith("arcane_") else aid
        w = wiki.get(bare, wiki.get(aid, ""))
        e = eff.get(aid, {})
        fx = ", ".join(f"{s}={v}" for s, v in e.get("effects", []))
        lines.append(f"{aid}\n  wiki: {w[:120].replace(chr(10),' | ')}\n  trigger: {e.get('trigger','?')}  effects: {fx}\n")
    out = REPO / "scripts" / "arcane_wiki_verify.txt"
    out.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {len(lines)} arcanes to {out}")


if __name__ == "__main__":
    main()
