#!/usr/bin/env python3
"""Audit Incarnon weapons: forms, evolutions, statChanges, and weapon linkage."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INCARNON_TS = ROOT / "src/data/incarnon.ts"
WEAPONS_TS = ROOT / "src/data/weapons.ts"
EVOLUTION_BEHAVIORS = ROOT / "src/data/mod-behaviors/batches/evolution.ts"

WEAPON_SPECIFIC_IDS = {
    "felarx", "laetum",
    "vectis_incarnon", "stug_incarnon", "ballistica_incarnon", "destreza_incarnon", "obex_incarnon",
}

MELEE_INCARNON_IDS = {
    "innodem", "praedos", "ruvox",
    "ack_brunt_incarnon", "ack_&_brunt",
    "anku_incarnon", "anku",
    "bo_incarnon", "bo", "bo_prime", "mk1_bo",
    "ceramic_dagger_incarnon", "ceramic_dagger",
    "destreza_incarnon", "destreza", "destreza_prime",
    "dual_ichor_incarnon", "dual_ichor",
    "furax_incarnon", "furax", "furax_wraith", "mk1_furax",
    "hate_incarnon", "hate",
    "magistar_incarnon", "magistar", "sancti_magistar",
    "nami_solo_incarnon", "nami_solo",
    "okina_incarnon", "okina", "okina_prime",
    "obex_incarnon", "obex", "prisma_obex",
    "sibear_incarnon", "sibear",
    "skana_incarnon", "skana", "skana_prime", "prisma_skana",
}

STANDARD_RANGED_T5_DEVOURING = {
    "name": "Devouring Attrition",
    "criticalChance": -0.3,
    "criticalMultiplier": 2.5,
    "desc_contains": "+250%",
}

# Perks that are conditional / proc-based — must not have calc statChanges.
CONDITIONAL_PERK_NAMES = frozenset({
    "Ready Retaliation",
    "Lone Gun",
    "Elemental Excess",
    "Swift Transformation",
    "Metabolic Recharge",
    "Long Shot",
    "Hound's Flare",
    "Extended Strike",
    "Finishing Touch",
    "Combo Fury",
    "Elemental Flow",
    "Inciting Incident",
    "Marksman's Hand",
    "Silent Running",
    "Deadhead",
    "Headcracker",
    "Prolific Perforation",
    "Void's Guidance",
    "Elemental Balance",
    "Weighted Impetus",
    "Piercing Stature",
    "Orokin Reach",
    "Overhand",
    "Adept Reflexes",
    "Balanced Stagger",
    "Armored Finisher",
    "Rapid Conclusion",
    "Standoff",
    "Attuned Accuracy",
    "Kinetic Baffle",
    "Frictionless Flight",
    "Dual-Mode Chamber",
    "Evolved Autoloader",
    "Mounting Momentum",
    "Incarnon Catalyst",
    "Devastating Attrition",
    "Ruptured Plenitude",
    "Agile Executor",
    "Lethal Rearmament",
    "Awakened Readiness",
    "Feather of Justice",
    "Caput Mortuum",
    "Incarnon Efficiency",
    "Reaper's Plenty",
    "Overwhelming Attrition",
    "Blazing Barrel",
    "Overcharge Blast",
    "Resonant Restore",
})

VALID_STAT_KEYS = frozenset({
    "damage", "criticalChance", "criticalMultiplier", "statusChance",
    "fireRate", "multishot", "magazine", "reloadSpeed",
    "heat", "cold", "toxin", "electricity",
    "impact", "puncture", "slash", "range", "comboDuration",
})


def load_weapons() -> dict[str, dict]:
    out: dict[str, dict] = {}
    for chunk in re.split(r"\n  \},\n", WEAPONS_TS.read_text(encoding="utf-8")):
        mid = re.search(r'"id":\s*"([^"]+)"', chunk)
        if not mid:
            continue
        wid = mid.group(1)

        def num(key: str) -> float | None:
            m = re.search(rf'"{key}":\s*(-?[\d.]+)', chunk)
            return float(m.group(1)) if m else None

        def flag(key: str) -> bool:
            m = re.search(rf'"{key}":\s*(true|false)', chunk)
            return m.group(1) == "true" if m else False

        out[wid] = {
            "name": re.search(r'"name":\s*"([^"]*)"', chunk).group(1) if re.search(r'"name":', chunk) else "",
            "damage": num("damage"),
            "fireRate": num("fireRate"),
            "criticalChance": num("criticalChance"),
            "criticalMultiplier": num("criticalMultiplier"),
            "statusChance": num("statusChance"),
            "magazine": num("magazine"),
            "reloadTime": num("reloadTime"),
            "multishot": num("multishot") or 1,
            "triggerType": re.search(r'"triggerType":\s*"([^"]*)"', chunk).group(1) if re.search(r'"triggerType":', chunk) else "",
            "isIncarnon": flag("isIncarnon"),
        }
    return out


def parse_incarnon_weapons() -> list[dict]:
    text = INCARNON_TS.read_text(encoding="utf-8")
    start = text.index("export const incarnonWeaponData")
    chunk = text[start:]
    end_idx = chunk.index("];")
    chunk = chunk[:end_idx]

    weapons: list[dict] = []
    # Each entry contains weaponId:
    parts = re.split(r"\n  \{\n    weaponId:", chunk)
    for part in parts[1:]:
        block = "weaponId:" + part
        # Trim at closing of this object
        close = block.find("\n  },")
        if close == -1:
            close = block.find("\n  }")
        if close != -1:
            block = block[:close]

        wid_m = re.search(r'weaponId:\s*"([^"]+)"', block)
        if not wid_m:
            continue
        wid = wid_m.group(1)
        cat_m = re.search(r'category:\s*"([^"]+)"', block)
        category = cat_m.group(1) if cat_m else ""

        variants: list[str] = []
        var_m = re.search(r'variants:\s*\[([^\]]*)\]', block)
        if var_m:
            variants = [v.strip().strip('"') for v in var_m.group(1).split(",") if v.strip()]

        forms: list[dict] = []
        for fm in re.finditer(
            r'\{\s*name:\s*"([^"]+)",\s*damage:\s*([\d.]+),\s*fireRate:\s*([\d.]+),'
            r'\s*criticalChance:\s*([\d.]+),\s*criticalMultiplier:\s*([\d.]+),\s*statusChance:\s*([\d.]+),'
            r'\s*triggerType:\s*"([^"]+)"',
            block,
        ):
            forms.append({
                "name": fm.group(1),
                "damage": float(fm.group(2)),
                "fireRate": float(fm.group(3)),
                "criticalChance": float(fm.group(4)),
                "criticalMultiplier": float(fm.group(5)),
                "statusChance": float(fm.group(6)),
                "triggerType": fm.group(7),
            })

        evolutions: list[dict] = []
        for em in re.finditer(
            r'\{\s*tier:\s*(\d+),\s*slot:\s*(\d+),\s*name:\s*"([^"]+)",\s*description:\s*"([^"]*)",\s*statChanges:\s*(\{[^}]*\})\s*\}',
            block,
        ):
            stats_raw = em.group(5)
            stats: dict[str, float] = {}
            for sm in re.finditer(r'(\w+):\s*(-?[\d.]+)', stats_raw):
                stats[sm.group(1)] = float(sm.group(2))
            evolutions.append({
                "tier": int(em.group(1)),
                "slot": int(em.group(2)),
                "name": em.group(3),
                "description": em.group(4),
                "statChanges": stats,
            })

        weapons.append({
            "weaponId": wid,
            "category": category,
            "variants": variants,
            "forms": forms,
            "evolutions": evolutions,
        })
    return weapons


def resolve_evolutions(entry: dict) -> list[dict]:
    wid = entry["weaponId"]
    text = INCARNON_TS.read_text(encoding="utf-8")

    helpers = {
        "vectis_incarnon": "getVectisIncarnonEvolutions",
        "stug_incarnon": "getStugIncarnonEvolutions",
        "ballistica_incarnon": "getBallisticaIncarnonEvolutions",
        "destreza_incarnon": "getDestrezaIncarnonEvolutions",
        "obex_incarnon": "getObexIncarnonEvolutions",
    }

    def parse_evo_block(body: str) -> list[dict]:
        evos: list[dict] = []
        for em in re.finditer(
            r'\{\s*tier:\s*(\d+),\s*slot:\s*(\d+),\s*name:\s*"([^"]+)",\s*description:\s*"([^"]*)",\s*statChanges:\s*(\{[^}]*\})\s*\}',
            body,
        ):
            stats: dict[str, float] = {}
            for sm in re.finditer(r'(\w+):\s*(-?[\d.]+)', em.group(5)):
                stats[sm.group(1)] = float(sm.group(2))
            evos.append({
                "tier": int(em.group(1)),
                "slot": int(em.group(2)),
                "name": em.group(3),
                "description": em.group(4),
                "statChanges": stats,
            })
        return evos

    if wid in helpers:
        hm = re.search(rf"function {helpers[wid]}\(\): IncarnonEvolution\[\] \{{(.*?)^\}}", text, re.S | re.M)
        if hm:
            return parse_evo_block(hm.group(1))

    if wid in WEAPON_SPECIFIC_IDS and entry["evolutions"]:
        return entry["evolutions"]

    is_melee = (
        wid in MELEE_INCARNON_IDS
        or any(f.get("triggerType") == "Melee" for f in entry["forms"])
    )
    pool_name = "getMeleeEvolutions" if is_melee else "getRangedEvolutions"
    m = re.search(rf"function {pool_name}\(\): IncarnonEvolution\[\] \{{(.*?)^\}}", text, re.S | re.M)
    if m:
        return parse_evo_block(m.group(1))
    return entry["evolutions"]


def main() -> int:
    weapons = load_weapons()
    entries = parse_incarnon_weapons()
    issues: list[str] = []

    print(f"Incarnon data entries: {len(entries)}")

    # INCARNON_WEAPON_IDS count
    ids_m = re.search(r"export const INCARNON_WEAPON_IDS = new Set\(\[(.*?)\]\);", INCARNON_TS.read_text(encoding="utf-8"), re.S)
    incarnon_ids: set[str] = set()
    if ids_m:
        incarnon_ids = {x.strip().strip('"') for x in ids_m.group(1).split(",") if x.strip()}

    primary_ids = {e["weaponId"] for e in entries}

    for e in entries:
        wid = e["weaponId"]
        resolved = resolve_evolutions(e)

        # Tier structure: tiers 1-5, tier 1 has 1 slot, tiers 2-5 have 3 slots (except some natives)
        tiers: dict[int, set[int]] = {}
        for ev in resolved:
            tiers.setdefault(ev["tier"], set()).add(ev["slot"])

        for tier in range(1, 6):
            if tier not in tiers:
                issues.append(f"{wid}: missing evolution tier {tier}")
            elif tier == 1 and tiers[1] != {0}:
                issues.append(f"{wid}: tier 1 should only be slot 0, got {sorted(tiers[1])}")
            elif tier >= 2 and len(tiers.get(tier, set())) < 2:
                issues.append(f"{wid}: tier {tier} has {len(tiers.get(tier, set()))} choices (expected at least 2)")

        # Forms
        if len(e["forms"]) < 2:
            issues.append(f"{wid}: expected 2 forms (normal + incarnon), got {len(e['forms'])}")

        # Weapon linkage — primary id or any variant must exist in weapons.ts
        linked = wid in weapons
        if not linked and e.get("variants"):
            linked = any(v in weapons for v in e["variants"])
        if not linked:
            issues.append(f"{wid}: not found in weapons.ts (id or variants)")
        elif wid in weapons and not weapons[wid].get("isIncarnon"):
            issues.append(f"{wid}: weapons.ts isIncarnon=false")

        for v in e.get("variants", []):
            if v not in weapons:
                issues.append(f"{wid}: variant {v} not in weapons.ts")
            elif not weapons[v].get("isIncarnon"):
                issues.append(f"{wid}: variant {v} isIncarnon=false")

        # Devouring Attrition wrong scaling
        for ev in resolved:
            if ev["name"] == "Devouring Attrition":
                cm = ev["statChanges"].get("criticalMultiplier")
                if cm is not None and abs(cm - 2.5) > 0.01:
                    issues.append(f"{wid} tier {ev['tier']}: Devouring Attrition criticalMultiplier={cm} (expected 2.5)")
                if "+2500%" in ev["description"]:
                    issues.append(f"{wid} tier {ev['tier']}: Devouring Attrition description says +2500% (expected +250%)")

        # Conditional perks with statChanges
        for ev in resolved:
            if ev["statChanges"] and ev["name"] in CONDITIONAL_PERK_NAMES:
                # Laetum uses "Elemental Excess" label for a flat +status perk
                if ev["name"] == "Elemental Excess" and "per unique" not in ev["description"].lower():
                    continue
                # Survivor's Edge with flat crit/status is passive (Stug); conversion variant is conditional
                if ev["name"] == "Survivor's Edge" and "of Critical Chance as" not in ev["description"]:
                    continue
                issues.append(f"{wid} tier {ev['tier']} slot {ev['slot']} ({ev['name']}): conditional perk has statChanges {ev['statChanges']}")

        # Invalid stat keys
        for ev in resolved:
            for key in ev["statChanges"]:
                if key not in VALID_STAT_KEYS:
                    issues.append(f"{wid} ({ev['name']}): unknown stat key '{key}'")

        # Rapid Wrath (standard pool on-kill version)
        for ev in resolved:
            if ev["name"] == "Rapid Wrath" and "on kill" in ev["description"].lower() and ev["statChanges"]:
                issues.append(f"{wid}: on-kill Rapid Wrath should not have statChanges {ev['statChanges']}")

        # Stub native weapons still in WEAPON_SPECIFIC (removed — skip)

    # weapons.ts incarnons missing from data map
    ws_incarnon = [wid for wid, w in weapons.items() if w.get("isIncarnon")]
    map_keys = set()
    for e in entries:
        map_keys.add(e["weaponId"])
        map_keys.update(e.get("variants", []))

    missing_data = [wid for wid in ws_incarnon if wid not in map_keys and wid not in incarnon_ids]
    # Only flag _incarnon ids and native incarnons
    for wid in ws_incarnon:
        if wid not in map_keys:
            if wid.endswith("_incarnon") or wid in primary_ids:
                issues.append(f"weapons.ts {wid}: isIncarnon but no incarnonDataMap entry")

    # Evolution mod behaviors
    beh_text = EVOLUTION_BEHAVIORS.read_text(encoding="utf-8")
    for mod_id in ("evolution_incarnon_rifle", "evolution_incarnon_pistol", "evolution_incarnon_melee"):
        if mod_id not in beh_text:
            issues.append(f"missing behavior for {mod_id}")

    print(f"\nIssues: {len(issues)}")
    for issue in issues:
        print(f"  - {issue}")

    return 1 if issues else 0


if __name__ == "__main__":
    sys.exit(main())
