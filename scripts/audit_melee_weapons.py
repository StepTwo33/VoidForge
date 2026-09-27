#!/usr/bin/env python3
"""Audit melee weapons: base stats, passives, radial/slam AoE, stance metadata."""
from __future__ import annotations

import json
import re
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WEAPONS_TS = ROOT / "src/data/weapons.ts"
PASSIVES_TS = ROOT / "src/data/weapon-passives.ts"
RADIAL_TS = ROOT / "src/data/weapon-radial-attacks.ts"

MELEE_CATEGORIES = {"melee"}

REQUIRED_STATS = (
    "damage",
    "impact",
    "puncture",
    "slash",
    "fireRate",
    "criticalChance",
    "criticalMultiplier",
    "statusChance",
    "magazine",
    "reloadTime",
    "multishot",
    "triggerType",
    "modSlots",
    "stanceType",
)

SLAM_AOE_HINTS = (
    "slam attack",
    "ground slam",
    "slam radial",
    "radial damage",
    "aoe",
    "explosion",
    "explodes",
    " blast",
    "shockwave",
    "heavy slam",
    "m radius",
    "meter radius",
)

# Heavy-attack passives that are not radial/slam profiles.
SLAM_AOE_FALSE_POSITIVES = (
    "heavy attack multiplier",
    "starting combo",
    "throws a glaive",
    "throws the shield",
)

PASSIVE_WIKI_ARTIFACTS = ("|}", "{|", "wikitable", "|-", "! style=")

_WIKI_MELEE_AOE_IDS: set[str] = set()


def load_weapons() -> list[dict]:
    text = WEAPONS_TS.read_text(encoding="utf-8")
    return json.loads(re.search(r"export const allWeapons: Weapon\[\] = (\[[\s\S]*?\n\]);", text).group(1))


def load_passives() -> dict[str, str]:
    text = PASSIVES_TS.read_text(encoding="utf-8")
    out: dict[str, str] = {}

    def store(key: str, raw: str) -> None:
        val = raw.replace("\\n", "\n")
        val = val.replace(
            "${PROGENITOR_LINE}",
            "Progenitor bonus: extra elemental damage (typically 25–60% of base damage).",
        )
        out[key] = val.strip()

    for m in re.finditer(r'^\s+([a-z0-9_&]+):\s*"((?:[^"\\]|\\.)*)"', text, re.M):
        store(m.group(1), m.group(2))
    for m in re.finditer(r"^\s+([a-z0-9_&]+):\s*`([^`]*)`", text, re.M):
        store(m.group(1), m.group(2))
    progenitor = "Progenitor bonus: extra elemental damage (typically 25–60% of base damage)."
    for m in re.finditer(r"^\s+([a-z0-9_&]+):\s*PROGENITOR_LINE\s*,?", text, re.M):
        store(m.group(1), progenitor)
    ktc = re.search(
        r"const KUVA_TENET_CODA: Record<string, string> = \{([\s\S]*?)\n\};",
        text,
    )
    if ktc:
        for m in re.finditer(
            r"^\s+([a-z0-9_&]+):\s*(?:`\$\{PROGENITOR_LINE\}([^`]*)`|PROGENITOR_LINE)\s*,?",
            ktc.group(1),
            re.M,
        ):
            extra = m.group(2) or ""
            store(m.group(1), progenitor + extra)
    return out


def load_radial_ids() -> dict[str, int]:
    text = RADIAL_TS.read_text(encoding="utf-8")
    out: dict[str, int] = {}
    for m in re.finditer(r'"([a-z0-9_&]+)":\s*\[', text):
        wid = m.group(1)
        block = text[m.start() : text.find("]", m.end()) + 1]
        out[wid] = block.count('"name"')
    return out


def load_wiki_melee_aoe_ids() -> set[str]:
    try:
        import importlib.util
        import urllib.parse
        import urllib.request

        spec = importlib.util.spec_from_file_location(
            "gen_radial",
            ROOT / "scripts/generate_radial_attacks.py",
        )
        gen = importlib.util.module_from_spec(spec)
        assert spec.loader is not None
        spec.loader.exec_module(gen)

        params = {
            "action": "parse",
            "page": "Module:Weapons/data/melee",
            "prop": "wikitext",
            "format": "json",
        }
        url = "https://wiki.warframe.com/api.php?" + urllib.parse.urlencode(params)
        req = urllib.request.Request(url, headers={"User-Agent": "Voidforge/1.0 (melee audit)"})
        with urllib.request.urlopen(req, timeout=120) as resp:
            data = json.loads(resp.read())
        text = data["parse"]["wikitext"]["*"]
        return set(gen.parse_lua_table(text).keys())
    except Exception:
        return set()


def is_melee(w: dict) -> bool:
    if w.get("category") not in MELEE_CATEGORIES:
        return False
    if w.get("isExalted") or w.get("warframeId"):
        return False
    # Zaw strike placeholders have no standalone stats.
    if w.get("triggerType") == "Zaw Component":
        return False
    return True


def passive_for(w: dict, passives: dict[str, str]) -> str | None:
    if w.get("passive"):
        return w["passive"]
    return passives.get(w["id"])


def hints_slam_aoe(passive: str) -> bool:
    low = passive.lower()
    if any(fp in low for fp in SLAM_AOE_FALSE_POSITIVES):
        return False
    return any(h in low for h in SLAM_AOE_HINTS)


def passive_corrupted(passive: str) -> bool:
    return any(a in passive for a in PASSIVE_WIKI_ARTIFACTS)


def ips_mismatch(w: dict) -> bool:
    ips = (w.get("impact") or 0) + (w.get("puncture") or 0) + (w.get("slash") or 0)
    dmg = w.get("damage") or 0
    if dmg <= 0:
        return False
    if ips <= 0:
        return False
    return abs(ips - dmg) > max(1.0, dmg * 0.05)


def audit() -> int:
    global _WIKI_MELEE_AOE_IDS
    _WIKI_MELEE_AOE_IDS = load_wiki_melee_aoe_ids()

    weapons = load_weapons()
    passives = load_passives()
    radial = load_radial_ids()
    pool = [w for w in weapons if is_melee(w)]
    pool_ids = {w["id"] for w in pool}

    print("=== Melee weapon audit ===\n")
    print(f"Pool size: {len(pool)}")
    print(f"Stance types: {dict(Counter(w.get('stanceType') for w in pool))}")

    missing_stats: list[str] = []
    zero_damage: list[str] = []
    wrong_trigger: list[str] = []
    bad_mag_reload: list[str] = []
    for w in pool:
        wid = w["id"]
        missing = [k for k in REQUIRED_STATS if k not in w or w[k] is None]
        if missing:
            missing_stats.append(f"{wid}: missing {missing}")
        if w.get("damage", 0) <= 0:
            zero_damage.append(wid)
        if w.get("triggerType") != "Melee":
            wrong_trigger.append(f"{wid}: triggerType={w.get('triggerType')!r}")
        if w.get("magazine", 0) != 0 or w.get("reloadTime", 0) != 0:
            bad_mag_reload.append(
                f"{wid}: magazine={w.get('magazine')} reloadTime={w.get('reloadTime')}"
            )

    print(f"\nMissing required stat fields: {len(missing_stats)}")
    for line in sorted(missing_stats)[:25]:
        print(f"  {line}")
    if len(missing_stats) > 25:
        print(f"  ... +{len(missing_stats) - 25}")

    if zero_damage:
        print(f"\nZero damage: {len(zero_damage)}")
        for wid in sorted(zero_damage):
            print(f"  {wid}")

    if wrong_trigger:
        print(f"\nNon-Melee triggerType: {len(wrong_trigger)}")
        for line in sorted(wrong_trigger):
            print(f"  {line}")

    if bad_mag_reload:
        print(f"\nNon-zero magazine/reload (expected 0 for melee): {len(bad_mag_reload)}")
        for line in sorted(bad_mag_reload)[:20]:
            print(f"  {line}")
        if len(bad_mag_reload) > 20:
            print(f"  ... +{len(bad_mag_reload) - 20}")

    no_passive = [w for w in pool if not passive_for(w, passives)]
    print(f"\nMissing passive: {len(no_passive)}")
    for w in sorted(no_passive, key=lambda x: x["name"])[:40]:
        print(f"  {w['id']}: {w['name']}")
    if len(no_passive) > 40:
        print(f"  ... +{len(no_passive) - 40}")

    corrupted = [
        w for w in pool
        if (p := passive_for(w, passives)) and passive_corrupted(p)
    ]
    print(f"\nCorrupted passive text (wiki markup): {len(corrupted)}")
    for w in sorted(corrupted, key=lambda x: x["name"]):
        print(f"  {w['id']}")

    with_radial = [w for w in pool if w["id"] in radial or w.get("radialAttacks")]
    wiki_in_pool = _WIKI_MELEE_AOE_IDS & pool_ids
    print(f"\nRadial/slam AoE profiles: {len(with_radial)}/{len(pool)}")
    print(f"Wiki AoE weapons parsed: {len(wiki_in_pool)}")

    ips_bad = [w for w in pool if ips_mismatch(w)]
    print(f"\nIPS sum != damage (>5%): {len(ips_bad)}")
    for w in sorted(ips_bad, key=lambda x: x["name"])[:20]:
        ips = (w.get("impact") or 0) + (w.get("puncture") or 0) + (w.get("slash") or 0)
        print(f"  {w['id']}: damage={w['damage']} ips={ips}")
    if len(ips_bad) > 20:
        print(f"  ... +{len(ips_bad) - 20}")

    slam_hint_no_radial = []
    wiki_sync_gaps = []
    for w in pool:
        p = passive_for(w, passives)
        if not p or not hints_slam_aoe(p):
            continue
        if w["id"] in radial or w.get("radialAttacks"):
            continue
        slam_hint_no_radial.append(w)
        if w["id"] in _WIKI_MELEE_AOE_IDS:
            wiki_sync_gaps.append(w)

    print(f"\nPassive hints slam/AoE but no radial profile: {len(slam_hint_no_radial)}")
    for w in sorted(slam_hint_no_radial, key=lambda x: x["name"])[:40]:
        tag = "wiki AoE — needs sync" if w["id"] in _WIKI_MELEE_AOE_IDS else "passive-only"
        print(f"  {w['id']}: {w['name']} ({tag})")
    if len(slam_hint_no_radial) > 40:
        print(f"  ... +{len(slam_hint_no_radial) - 40}")

    radial_no_passive_hint = [
        w for w in pool
        if w["id"] in radial
        and not ((p := passive_for(w, passives)) and hints_slam_aoe(p))
    ]
    print(f"\nRadial profile without slam/AoE passive mention: {len(radial_no_passive_hint)} (innate slam profiles)")

    wiki_not_synced = sorted(wiki_in_pool - radial.keys())
    if wiki_not_synced:
        print(f"\nWiki AoE parsed but missing from weapon-radial-attacks.ts: {len(wiki_not_synced)}")
        for wid in wiki_not_synced[:30]:
            print(f"  {wid}")
        if len(wiki_not_synced) > 30:
            print(f"  ... +{len(wiki_not_synced) - 30}")

    incarnon = [w for w in pool if w.get("isIncarnon")]
    print(f"\nIncarnon melee: {len(incarnon)}")

    issues = (
        len(missing_stats)
        + len(zero_damage)
        + len(corrupted)
        + len(wiki_sync_gaps)
        + len(wiki_not_synced)
    )
    print(f"\n--- Summary ---")
    print(f"  With passive: {len(pool) - len(no_passive)}/{len(pool)}")
    print(f"  With radial/slam data: {len(with_radial)}/{len(pool)}")
    print(f"  Slam/AoE passives without radial: {len(slam_hint_no_radial)} ({len(wiki_sync_gaps)} wiki sync gaps)")
    print(f"  Actionable issues (stats/corruption/wiki AoE sync): {issues}")
    return issues


if __name__ == "__main__":
    sys.exit(1 if audit() else 0)
