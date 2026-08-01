#!/usr/bin/env python3
"""Audit primary/secondary mods, exilus tagging, and wiki coverage."""
from __future__ import annotations

import re
import urllib.parse
import urllib.request
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MODS_TS = ROOT / "src/data/mods.ts"
SLOT_TS = ROOT / "src/lib/mod-slot-categories.ts"
BEHAVIOR_DIR = ROOT / "src/data/mod-behaviors"
UA = {"User-Agent": "Voidforge/1.0 (weapon mod audit)"}

PRIMARY_CATS = {"primary", "rifle", "shotgun", "bow", "launcher"}
SECONDARY_CATS = {"secondary", "pistol", "dual_pistols"}
MELEE_CATS = {"melee"}


def load_set_from_ts(path: Path, const_name: str) -> set[str]:
    text = path.read_text(encoding="utf-8")
    m = re.search(rf"export const {const_name}[^=]*=\s*new Set\(\[([\s\S]*?)\]\)", text)
    if not m:
        return set()
    return set(re.findall(r'"([a-z0-9_]+)"', m.group(1)))


def load_mods() -> list[dict]:
    text = MODS_TS.read_text(encoding="utf-8")
    mods = []
    for block in re.split(r"\n  \},\n", text):
        mid = re.search(r'"id": "([^"]+)"', block)
        name = re.search(r'"name": "([^"]+)"', block)
        cat = re.search(r'"category": "([^"]+)"', block)
        if not mid or not cat:
            continue
        mods.append({"id": mid.group(1), "name": name.group(1) if name else "", "category": cat.group(1)})
    return mods


def load_behavior_ids() -> set[str]:
    ids: set[str] = set()
    for path in BEHAVIOR_DIR.rglob("*.ts"):
        ids.update(re.findall(r'mod\("([^"]+)"', path.read_text(encoding="utf-8")))
    return ids


def wiki_exilus_names() -> list[str]:
    cm = []
    cont = None
    while True:
        params = {
            "action": "query",
            "list": "categorymembers",
            "cmtitle": "Category:Exilus_Weapon_Mods",
            "cmlimit": "500",
            "format": "json",
        }
        if cont:
            params["cmcontinue"] = cont
        url = "https://wiki.warframe.com/api.php?" + urllib.parse.urlencode(params)
        d = json.load(urllib.request.urlopen(urllib.request.Request(url, headers=UA)))
        cm += [x["title"] for x in d["query"]["categorymembers"]]
        cont = d.get("continue", {}).get("cmcontinue")
        if not cont:
            break
    return cm


def name_to_id(name: str, by_name: dict[str, str]) -> str | None:
    aliases = {
        "condition's perfection": "conditions_perfection",
        "discipline's merit": "disciplines_merit",
        "trick mag": "trick_mag_r3",
        "suppress": "suppress_r3",
        "double-barrel drift": "double_barrel_drift",
        "truth's flame": "truths_flame",
        "parry": "parry_r3",
        "tactical reload": "tactical_reload_r3",
    }
    key = name.lower()
    if key in aliases:
        return aliases[key]
    return by_name.get(key)


def audit_pool(label: str, mods: list[dict], exilus_ids: set[str], behaviors: set[str]) -> None:
    if label == "primary":
        cats = PRIMARY_CATS
    elif label == "secondary":
        cats = SECONDARY_CATS
    else:
        cats = MELEE_CATS
    pool = [m for m in mods if m["category"] in cats]
    pool = [m for m in pool if m["id"] not in exilus_ids]
    missing_beh = [m for m in pool if m["id"] not in behaviors]
    print(f"\n=== {label.upper()} regular mods ===")
    print(f"Pool: {len(pool)} | behaviors: {len(pool) - len(missing_beh)} | missing: {len(missing_beh)}")
    for m in sorted(missing_beh, key=lambda x: x["name"])[:12]:
        print(f"  {m['id']}: {m['name']}")
    if len(missing_beh) > 12:
        print(f"  ... +{len(missing_beh) - 12}")


def audit_exilus(label: str, ids: set[str], mods_by_id: dict[str, dict], wiki_names: set[str], by_name: dict[str, str]) -> None:
    print(f"\n=== {label.upper()} exilus ===")
    missing_catalog = sorted(i for i in ids if i not in mods_by_id)
    print(f"Tagged: {len(ids)} | missing from catalog: {len(missing_catalog)}")
    for i in missing_catalog:
        print(f"  MISSING ID: {i}")
    mapped_wiki = {name_to_id(n, by_name) for n in wiki_names}
    mapped_wiki.discard(None)
    extra = sorted(ids - mapped_wiki)
    wiki_missing = sorted(mapped_wiki - ids)
    if extra:
        print(f"Extra vs wiki ({len(extra)}): {', '.join(extra[:8])}{'...' if len(extra)>8 else ''}")
    if wiki_missing:
        print(f"Wiki not tagged ({len(wiki_missing)}): {', '.join(wiki_missing[:8])}{'...' if len(wiki_missing)>8 else ''}")


def main() -> None:
    mods = load_mods()
    mods_by_id = {m["id"]: m for m in mods}
    by_name = {m["name"].lower(): m["id"] for m in mods}
    behaviors = load_behavior_ids()

    primary_ex = load_set_from_ts(SLOT_TS, "PRIMARY_WEAPON_EXILUS_MOD_IDS")
    secondary_ex = load_set_from_ts(SLOT_TS, "SECONDARY_WEAPON_EXILUS_MOD_IDS")
    melee_ex = load_set_from_ts(SLOT_TS, "MELEE_WEAPON_EXILUS_MOD_IDS")

    wiki = wiki_exilus_names()
    SECONDARY = {
        "Agile Aim", "Air Recon", "Bhisaj-Bal", "Double-Barrel Drift", "Eject Magazine",
        "Energizing Shot", "Fatal Acceleration", "Hawk Eye", "Hush", "Lethal Momentum",
        "Pistol Ammo Mutation", "Primed Pistol Ammo Mutation", "Primed Steady Hands",
        "Reflex Draw", "Spry Sights", "Steady Hands", "Strafing Slide", "Suppress",
        "Targeting Subsystem", "Trick Mag", "Vigilante Supplies", "Vile Precision",
    }
    MELEE = {
        "Condition's Perfection", "Directed Convergence", "Discipline's Merit",
        "Dispatch Overdrive", "Dreamer's Wrath", "Master's Edge", "Mentor's Legacy",
        "Opportunity's Reach", "Snap Shot", "Soft Hands", "Tactical Reload", "Twitch",
        "Truth's Flame", "Focused Acceleration",
    }
    MELEE_EXTRA = {
        "Parry", "Focused Defense", "Guardian Derision",
        "Electromagnetic Shielding", "Whirlwind",
    }
    TOME = {
        "Fass Canticle", "Jahu Canticle", "Khra Canticle", "Lohk Canticle",
        "Netra Invocation", "Ris Invocation", "Vome Invocation", "Xata Invocation",
    }
    primary_wiki = {n for n in wiki if n not in SECONDARY and n not in MELEE and n not in TOME}
    secondary_wiki = SECONDARY & set(wiki)

    audit_pool("primary", mods, primary_ex, behaviors)
    audit_pool("secondary", mods, secondary_ex, behaviors)
    audit_pool("melee", mods, melee_ex, behaviors)
    audit_exilus("primary", primary_ex, mods_by_id, primary_wiki, by_name)
    audit_exilus("secondary", secondary_ex, mods_by_id, secondary_wiki, by_name)
    melee_wiki = (MELEE & set(wiki)) | MELEE_EXTRA
    audit_exilus("melee", melee_ex, mods_by_id, melee_wiki, by_name)

    cross = sorted(
        i
        for i in melee_ex
        if i in primary_ex or i in secondary_ex
    )
    if cross:
        print(f"\nMelee exilus also primary/secondary exilus ({len(cross)}): {', '.join(cross)}")


if __name__ == "__main__":
    main()
