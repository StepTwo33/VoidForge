#!/usr/bin/env python3
import json
from pathlib import Path

data = json.loads(Path(__file__).resolve().parents[1].joinpath("src/data/arcane-effects.ts").read_text(encoding="utf-8").split("= ", 1)[1].rstrip().rstrip(";"))
empty = [k for k, v in data.items() if not v.get("effects")]
print(f"Empty effects: {len(empty)}")
for k in empty:
    print(f"  {k}: {data[k]['name']}")
