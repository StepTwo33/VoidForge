#!/usr/bin/env python3
import re, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from generate_arcane_stats import parse_effects, load_framehub_descriptions, load_existing_stats, existing_to_effects, load_manual_overrides
from build_arcane_manual_overrides import parse_aggressive

fh = load_framehub_descriptions()
existing = load_existing_stats()
manual = load_manual_overrides()
empty = []
for aid, (desc, rank, sub) in fh.items():
    _, e1, _ = parse_effects(desc, sub)
    e2 = existing_to_effects(existing.get(aid, {}), rank) if aid in existing else []
    e3 = parse_aggressive(desc, rank)
    e4 = manual.get(aid, [])
    all_stats = {x['stat'] for x in e1+e2+e3+e4}
    if not all_stats:
        empty.append((aid, desc[:100]))
print(f"Still empty after all parsers: {len(empty)}")
for a,d in empty:
    print(f"{a}: {d}")
