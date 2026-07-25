#!/usr/bin/env python3
"""Parse all arcanes.ts descriptions and report coverage."""
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from generate_arcane_stats import parse_effects, normalize_desc

content = Path(__file__).resolve().parents[1].joinpath("src/data/arcanes.ts").read_text(encoding="utf-8")
blocks = re.findall(
    r'id:\s*"([^"]+)".*?subCategory:\s*"([^"]+)".*?description:\s*"((?:[^"\\]|\\.)*)"',
    content,
    re.S,
)
ok = 0
fail = []
for aid, sub, desc in blocks:
    desc = desc.replace("\\ ", " ").replace("\\n", "\n")
    trigger, effects, cap = parse_effects(desc, sub)
    if effects:
        ok += 1
    else:
        fail.append((aid, desc[:90]))
print(f"Parsed from framehub descriptions: {ok}/{len(blocks)}")
for aid, d in fail[:40]:
    print(f"  {aid}: {d}")
