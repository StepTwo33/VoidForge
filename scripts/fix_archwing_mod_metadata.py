#!/usr/bin/env python3
"""Fix archwing mod catalog stats and augment archwing IDs."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MODS_TS = ROOT / "src/data/mods.ts"

# Per-rank values at max rank: +27.5% flight speed (rank 10).
HYPERION_FLIGHT_SPEED = 2.75
# Per-rank at max rank 3: +100% recharge, -50% delay.
SUPERIOR_SHIELD_RECHARGE = 33.3333
SUPERIOR_SHIELD_DELAY = -16.6667

STAT_FIXES: dict[str, dict[str, float]] = {
    "hyperion_thrusters": {"flightSpeed": HYPERION_FLIGHT_SPEED},
    "superior_defenses": {
        "shieldRecharge": SUPERIOR_SHIELD_RECHARGE,
        "shieldRechargeDelay": SUPERIOR_SHIELD_DELAY,
    },
}

WARFRAME_ID_FIXES = {
    "energy_field": "odonata",
}


def main() -> None:
    text = MODS_TS.read_text(encoding="utf-8")
    mods = json.loads(re.search(r"export const allMods: Mod\[\] = (\[[\s\S]*?\n\]);", text).group(1))
    stat_updates = 0
    id_updates = 0
    for mod in mods:
        stat_fix = STAT_FIXES.get(mod["id"])
        if stat_fix:
            mod["stats"] = stat_fix
            stat_updates += 1
        wid_fix = WARFRAME_ID_FIXES.get(mod["id"])
        if wid_fix and mod.get("warframeId") != wid_fix:
            mod["warframeId"] = wid_fix
            id_updates += 1
    prefix = 'import { Mod } from "@/lib/types";\n\nexport const allMods: Mod[] = '
    suffix_m = re.search(r";\s*\nexport const modsMap", text)
    MODS_TS.write_text(prefix + json.dumps(mods, indent=2) + text[suffix_m.start():], encoding="utf-8")
    print(f"Updated stats on {stat_updates} archwing mods")
    print(f"Updated warframeId on {id_updates} archwing augments")


if __name__ == "__main__":
    main()
