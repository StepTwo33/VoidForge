#!/usr/bin/env python3
"""Fill empty stats on regular warframe mods (one-time catalog pass)."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MODS_TS = ROOT / "src/data/mods.ts"

# per-rank increments; total at max rank = value * (maxRank + 1)
STATS_BY_ID: dict[str, dict[str, float]] = {
    "adept_surge": {"parkourVelocity": 2.5, "health": -6.25},
    "aero_vantage": {"gravityReduction": -25.0},
    "anti_flak_plating": {"damageReduction": 5.0, "parkourVelocity": -2.5},
    "damage_decoy": {"damage": 87.5},
    "endless_lullaby": {"abilityDuration": 12.5},
    "gladiator_finesse": {"abilityEfficiency": 10.0},
    "kavats_grace": {"hardLandingReduction": 25.0},
    "motus_signal": {"bulletJump": 50.0},
    "natural_talent": {"castSpeed": 12.5},
    "no_current_leap": {"parkourVelocity": 2.5},
    "overcharged": {"overshieldConversion": 16.666667, "energyMax": 8.333333},
    "pain_threshold": {"knockdownRecovery": 40.0},
    "parry_r3": {"finisherChance": 16.0},
    "prismatic_companion": {"abilityDuration": 12.5},
    "quick_thinking": {"abilityEfficiency": 40.0},
    "reflection": {"blockStaggerChance": 12.216667, "blockStunChance": 3.05},
    "rising_skill": {"parkourVelocity": 2.5, "shield": -7.5},
    "tempered_bound": {"parkourVelocity": -2.5, "shield": 7.5},
    "undying_will": {"bleedoutReduction": 7.0},
    "vampiric_grasp": {"healthRegen": 6.25},
    "warriors_rest": {"abilityStrength": 3.75},
}


def main() -> None:
    text = MODS_TS.read_text(encoding="utf-8")
    m = re.search(r"export const allMods: Mod\[\] = (\[[\s\S]*?\n\]);", text)
    if not m:
        raise RuntimeError("allMods block not found")
    mods = json.loads(m.group(1))
    updated = 0
    for mod in mods:
        stats = STATS_BY_ID.get(mod["id"])
        if not stats:
            continue
        mod["stats"] = stats
        updated += 1
    prefix = 'import { Mod } from "@/lib/types";\n\nexport const allMods: Mod[] = '
    suffix_m = re.search(r";\s*\nexport const modsMap", text)
    if not suffix_m:
        raise RuntimeError("modsMap export not found")
    MODS_TS.write_text(prefix + json.dumps(mods, indent=2) + text[suffix_m.start():], encoding="utf-8")
    print(f"Updated stats on {updated} warframe mods")


if __name__ == "__main__":
    main()
