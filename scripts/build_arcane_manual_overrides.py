#!/usr/bin/env python3
"""Aggressive description parser to fill remaining arcane effect gaps."""
from __future__ import annotations

import json
import re
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
ARCANES_TS = REPO / "src" / "data" / "arcanes.ts"
EFFECTS_TS = REPO / "src" / "data" / "arcane-effects.ts"
OUT = REPO / "src" / "data" / "arcane-manual-overrides.json"


def load_arcanes() -> dict[str, dict]:
    content = ARCANES_TS.read_text(encoding="utf-8")
    out = {}
    for m in re.finditer(
        r'id:\s*"([^"]+)".*?maxRank:\s*(\d+).*?subCategory:\s*"([^"]+)".*?description:\s*"((?:[^"\\]|\\.)*)"',
        content,
        re.S,
    ):
        desc = m.group(4).replace("\\ ", " ").replace("\\n", "\n")
        out[m.group(1)] = {
            "maxRank": int(m.group(2)),
            "subCategory": m.group(3),
            "description": desc,
        }
    return out


def parse_aggressive(desc: str, max_rank: int) -> list[dict]:
    effects: list[dict] = []
    d = re.sub(r"<[^>]+>", "", desc)
    per_rank_mult = max_rank + 1

    def add(stat, val, flat=False, stacking=False):
        for e in effects:
            if e["stat"] == stat:
                e["maxValue"] = max(e["maxValue"], val)
                return
        effects.append({"stat": stat, "maxValue": val, "flat": flat, "stacking": stacking})

    # xN multiplier
    for m in re.finditer(r"x([\d.]+)\s*Melee Damage", d, re.I):
        add("meleeDamageBonus", (float(m.group(1)) - 1) * 100)

    # chance for +X%
    for m in re.finditer(r"(\d+(?:\.\d+)?)\s*%\s*chance for \+(\d+(?:\.\d+)?)\s*%\s*([^.\n]+)", d, re.I):
        val = float(m.group(2))
        label = m.group(3).lower()
        if "primary" in label:
            add("holsterDamage", val)
        elif "secondary" in label:
            add("holsterDamage", val)
        elif "life steal" in label:
            add("lifeSteal", val)
        elif "reload" in label:
            add("reloadSpeed", val)
        elif "critical" in label or "crit" in label:
            add("criticalChance", val)
        elif "damage" in label:
            add("damage", val)

    # +X% per rank
    for m in re.finditer(r"\+(\d+(?:\.\d+)?)\s*%\s*([^.\n+]+?)\s*per rank", d, re.I):
        val = float(m.group(1)) * per_rank_mult
        label = m.group(2).lower()
        if "amp heat" in label:
            add("ampHeatDamage", val)
        elif "amp range" in label:
            add("ampRange", val)
        elif "amp damage" in label:
            add("ampDamage", val)
        elif "holster damage" in label or "holster speed" in label:
            add("holsterDamage", val)
            add("holsterSpeed", val)
        elif "operator health regen" in label:
            add("operatorHealthRegen", val)
        elif "operator energy" in label:
            add("operatorEnergyToWarframe", val)
        elif "void pull" in label:
            add("voidPullRadius", val)
        elif "kitgun projectile" in label:
            add("kitgunProjectileSpeed", val)

    # Gain +X%
    for m in re.finditer(r"Gain \+?(\d+(?:\.\d+)?)\s*%\s*([^.\n]+)", d, re.I):
        val = float(m.group(1))
        label = m.group(2).lower()
        if "ammo efficiency" in label:
            add("ammoEfficiency", val)
        elif "ability strength" in label:
            add("abilityStrength", val)
        elif "corrosive damage" in label:
            add("meleeDamageBonus", val, stacking=True)
        elif "critical damage" in label:
            add("criticalMultiplier", val)

    # +X% holster
    if "holster damage/speed" in d.lower():
        m = re.search(r"\+(\d+(?:\.\d+)?)\s*%\s*Holster", d, re.I)
        if m:
            v = float(m.group(1)) * per_rank_mult
            add("holsterDamage", v)
            add("holsterSpeed", v)

    # Flat / special
    if "kitgun recharges ammo" in d.lower():
        add("kitgunRecharge", 100, flat=True)
    if "tether enemies" in d.lower():
        add("kitgunTether", 100, flat=True)
    if "home to heads" in d.lower():
        add("kitgunHoming", 100, flat=True)
    if "initial combo" in d.lower():
        m = re.search(r"(\d+(?:\.\d+)?)\s*Initial Combo", d, re.I)
        if m:
            add("meleeComboInitial", float(m.group(1)), flat=True)
    if "strike a second time" in d.lower():
        add("duplicateAttackChance", 100)
    if "energy rate" in d.lower():
        m = re.search(r"\+(\d+(?:\.\d+)?)\s*Energy Rate", d, re.I)
        if m:
            add("energyRegen", float(m.group(1)), stacking=True)
    if "weapon damage" in d.lower() and "chance to deal" in d.lower():
        m = re.search(r"deal (\d+(?:\.\d+)?)\s*%\s*Weapon Damage", d, re.I)
        if m:
            add("procDamageMultiplier", float(m.group(1)))
    if "additional combo" in d.lower():
        m = re.search(r"\+(\d+(?:\.\d+)?)\s*%\s*Additional Combo", d, re.I)
        if m:
            add("meleeComboGain", float(m.group(1)))
    if "multishot" in d.lower() and "max energy" in d.lower():
        m = re.search(r"Gain (\d+(?:\.\d+)?)\s*%\s*of Max Energy as Multishot", d, re.I)
        if m:
            add("multishot", float(m.group(1)))
    if "toxic pools" in d.lower() or "gas clouds" in d.lower() or "shock zones" in d.lower():
        add("toxinPoolDuration", 5, flat=True)
    if "heal warframes" in d.lower():
        m = re.search(r"(\d+(?:\.\d+)?)\s*%\s*Health/s", d, re.I)
        if m:
            add("operatorToWarframeHeal", float(m.group(1)))
    if "reduce enemy resistance" in d.lower():
        m = re.search(r"by (\d+(?:\.\d+)?)\s*%\.", d, re.I)
        if m:
            add("enemyResistanceReduction", float(m.group(1)))
    if "negate transference static" in d.lower():
        add("transferenceStaticNegate", 100)
    if "traps enemies for" in d.lower():
        m = re.search(r"for \+?(\d+(?:\.\d+)?)s", d, re.I)
        if m:
            add("voidTrapDuration", float(m.group(1)), flat=True)

    return effects


def main():
    arcanes = load_arcanes()
    # find empty in effects file
    effects_text = EFFECTS_TS.read_text(encoding="utf-8")
    empty_ids = re.findall(r'"([^"]+)":\s*\{[^}]*"effects": \[\]', effects_text)
    overrides = {}
    for aid in empty_ids:
        if aid not in arcanes:
            continue
        fx = parse_aggressive(arcanes[aid]["description"], arcanes[aid]["maxRank"])
        if fx:
            overrides[aid] = fx
    OUT.write_text(json.dumps(overrides, indent=2), encoding="utf-8")
    print(f"Manual overrides for {len(overrides)}/{len(empty_ids)} empty arcanes")


if __name__ == "__main__":
    main()
