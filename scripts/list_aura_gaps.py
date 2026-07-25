#!/usr/bin/env python3
"""List negative-drain mods in mods.ts vs AURA_MOD_IDS."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
text = (ROOT / "src/data/mods.ts").read_text(encoding="utf-8")
aura_ts = (ROOT / "src/lib/aura-mods.ts").read_text(encoding="utf-8")
aura_ids = set(re.findall(r'"([^"]+)"', aura_ts.split("AURA_MOD_IDS")[1].split(");")[0]))

neg_drain = []
for block in re.finditer(r'\{\s*"id":\s*"([^"]+)"[\s\S]*?(?=\n  \},|\n  \{|\n\])', text):
    chunk = block.group(0)
    mid = re.search(r'"id":\s*"([^"]+)"', chunk).group(1)
    name_m = re.search(r'"name":\s*"([^"]*)"', chunk)
    drain_m = re.search(r'"drain":\s*(-?\d+)', chunk)
    cat_m = re.search(r'"category":\s*"([^"]*)"', chunk)
    if not drain_m or int(drain_m.group(1)) >= 0:
        continue
    neg_drain.append((mid, name_m.group(1) if name_m else mid, int(drain_m.group(1)), cat_m.group(1) if cat_m else ""))

print(f"Negative drain mods: {len(neg_drain)}")
print(f"AURA_MOD_IDS: {len(aura_ids)}")
missing = [x for x in neg_drain if x[0] not in aura_ids]
print(f"\nMissing from AURA_MOD_IDS ({len(missing)}):")
for mid, name, drain, cat in sorted(missing, key=lambda t: t[1].lower()):
    print(f"  {mid:30} {name:28} drain={drain:3} cat={cat}")

extra = [aid for aid in aura_ids if aid not in {x[0] for x in neg_drain}]
print(f"\nIn AURA_MOD_IDS but not negative drain ({len(extra)}):")
for aid in sorted(extra):
    m = re.search(rf'"id":\s*"{re.escape(aid)}"[\s\S]*?"name":\s*"([^"]*)"[\s\S]*?"drain":\s*(-?\d+)', text)
    if m:
        print(f"  {aid}: {m.group(1)} drain={m.group(2)}")
    else:
        print(f"  {aid}: NOT IN mods.ts")
