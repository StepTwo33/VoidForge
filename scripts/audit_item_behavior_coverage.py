#!/usr/bin/env python3
"""Report per-item behavior coverage for mods and arcanes."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

mods_text = (ROOT / "src/data/mods.ts").read_text(encoding="utf-8")
all_mod_ids = set(re.findall(r'"id":\s*"([^"]+)"', mods_text))

verified_ids: set[str] = set()
# Keys may be bare ids (serration_r3) or quoted (\"push_&_pull\") when they contain &.
_mod_key = re.compile(r'^\s+(?:\"([^\"]+)\"|([\w]+)):\s*mod\(', re.M)
for batch in (ROOT / "src/data/mod-behaviors/batches").glob("*.ts"):
    for m in _mod_key.finditer(batch.read_text(encoding="utf-8")):
        verified_ids.add(m.group(1) or m.group(2))
manual = (ROOT / "src/data/mod-behaviors/verified-mods.ts").read_text(encoding="utf-8")
for m in _mod_key.finditer(manual):
    verified_ids.add(m.group(1) or m.group(2))

arcane_text = (ROOT / "src/data/arcane-behaviors.ts").read_text(encoding="utf-8")
arcane_ids = re.findall(r'^\s+"([a-z0-9_]+)":\s*\{', arcane_text, re.M)
weapon_build = len(re.findall(r'"target":\s*"weapon_dps"', arcane_text))
wf_build = len(re.findall(r'"target":\s*"warframe_totals"', arcane_text))
panel = len(re.findall(r'"target":\s*"arcane_panel"', arcane_text))
custom = len(re.findall(r'"mode":\s*"custom"', arcane_text))
pending = len(re.findall(r'"target":\s*"pending"', arcane_text))
migrated = len(re.findall(r"migrated", arcane_text))

mod_weapon = sum(1 for f in (ROOT / "src/data/mod-behaviors/batches").glob("*.ts") for _ in re.finditer(r'"weapon_dps"', f.read_text(encoding="utf-8")))
mod_wf = sum(1 for f in (ROOT / "src/data/mod-behaviors/batches").glob("*.ts") for _ in re.finditer(r'"warframe_totals"', f.read_text(encoding="utf-8")))
mod_panel = sum(1 for f in (ROOT / "src/data/mod-behaviors/batches").glob("*.ts") for _ in re.finditer(r'"mod_panel"', f.read_text(encoding="utf-8")))

print(f"Mods in data: {len(all_mod_ids)}")
print(f"Mods with per-item behavior entries: {len(verified_ids)}")
print(f"Mods still missing entries: {len(all_mod_ids - verified_ids)}")
print(f"  mod stat lines -> weapon_dps: {mod_weapon}")
print(f"  mod stat lines -> warframe_totals: {mod_wf}")
print(f"  mod stat lines -> mod_panel: {mod_panel}")
print()
print(f"Arcanes with per-item behavior entries: {len(arcane_ids)}")
print(f"  effect lines -> weapon_dps: {weapon_build}")
print(f"  effect lines -> warframe_totals: {wf_build}")
print(f"  effect lines -> arcane_panel: {panel}")
print(f"  effect lines -> custom handler: {custom}")
print(f"  pending/migrated leftovers: {pending + migrated}")
