#!/usr/bin/env python3
"""Fetch per-rank arcane stats from wiki Module:Arcane/data."""
import json
import re
import sys
import urllib.parse
import urllib.request
from pathlib import Path

HEADERS = {"User-Agent": "FrameHub/1.0"}


def fetch_module() -> str:
    params = {"action": "parse", "page": "Module:Arcane/data", "prop": "wikitext", "format": "json"}
    url = "https://wiki.warframe.com/api.php?" + urllib.parse.urlencode(params)
    with urllib.request.urlopen(urllib.request.Request(url, headers=HEADERS), timeout=120) as r:
        return json.loads(r.read())["parse"]["wikitext"]["*"]


def extract_block(text: str, name: str) -> str | None:
    m = re.search(r'\["' + re.escape(name) + r'"\]\s*=\s*\{', text)
    if not m:
        return None
    start = m.end() - 1
    depth = 0
    for i in range(start, len(text)):
        if text[i] == "{":
            depth += 1
        elif text[i] == "}":
            depth -= 1
            if depth == 0:
                return text[start : i + 1]
    return None


def parse_ranks(block: str) -> dict:
    out: dict = {}
    for key in ("MaxRank", "Type", "Description"):
        m = re.search(rf"{key}\s*=\s*\"?([^\",\n]+)\"?", block)
        if m:
            out[key] = m.group(1).strip('"')
    # Rank0..Rank5 or Stats table
    for m in re.finditer(r"Rank(\d+)\s*=\s*\"((?:[^\"\\]|\\.)*)\"", block):
        out[f"Rank{m.group(1)}"] = m.group(2).replace("\\n", "\n")
    for m in re.finditer(r"Rank(\d+)\s*=\s*\{", block):
        rank = m.group(1)
        start = m.end() - 1
        depth = 0
        for i in range(start, len(block)):
            if block[i] == "{":
                depth += 1
            elif block[i] == "}":
                depth -= 1
                if depth == 0:
                    sub = block[start : i + 1]
                    out[f"Rank{rank}_block"] = sub[:500]
                    break
    # Percent arrays
    for m in re.finditer(r"(\w+)\s*=\s*\{([^}]+)\}", block):
        if "Rank" in m.group(1) or "rank" in m.group(1).lower():
            out[m.group(1)] = "{" + m.group(2) + "}"
    return out


def main() -> None:
    names = sys.argv[1:] or ["Arcane Fury", "Arcane Aegis", "Virtuos Forge", "Primary Merciless"]
    text = fetch_module()
    for name in names:
        block = extract_block(text, name)
        print("=" * 60, name)
        if not block:
            print("NOT FOUND")
            continue
        info = parse_ranks(block)
        for k, v in info.items():
            print(f"  {k}: {v[:200] if isinstance(v, str) else v}")
        keys = re.findall(r"\n\s*(\w+)\s*=", block)
        print("  keys:", keys[:30])
        for field in ("UpgradeTypes", "Dissolution", "Link"):
            idx = block.find(f"{field} =")
            if idx >= 0:
                print(f"  --- {field} (from idx {idx}) ---")
                print(block[idx : idx + 1500])


if __name__ == "__main__":
    main()
