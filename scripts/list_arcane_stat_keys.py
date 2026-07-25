#!/usr/bin/env python3
import re
from collections import Counter
from pathlib import Path

text = Path(__file__).resolve().parents[1] / "src" / "data" / "arcanes.ts"
content = text.read_text(encoding="utf-8")
blocks = re.findall(r'id:\s*"([^"]+)".*?stats:\s*(\{[^}]*\})', content, re.S)
keys: Counter[str] = Counter()
empty = 0
for aid, stats in blocks:
    if stats.strip() in ("{}", "{ }"):
        empty += 1
    for k in re.findall(r'"([^"]+)":', stats):
        keys[k] += 1
print(f"Total arcanes: {len(blocks)}, empty stats: {empty}")
print("Stat keys:")
for k, n in keys.most_common():
    print(f"  {k}: {n}")
