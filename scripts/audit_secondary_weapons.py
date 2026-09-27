#!/usr/bin/env python3
"""Audit secondary weapons: base stats, passives, radial/AoE, alt-fire hints."""
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

SECONDARY_CATEGORIES = {"secondary", "pistol", "dual_pistols"}

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
)

ALT_AOE_HINTS = (
    "alt-fire",
    "alt fire",
    "alternate fire",
    "secondary fire",
    "explodes in",
    "explosion",
    "radius",
    "radial",
    "aoe",
    "grenade",
    "bomblet",
    "detonat",
    "airburst",
    "charged shot",
    "charged secondary",
)

PASSIVE_WIKI_ARTIFACTS = ("|}", "{|", "wikitable", "|-", "! style=")


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


def is_secondary(w: dict) -> bool:
    if w.get("category") not in SECONDARY_CATEGORIES:
        return False
    if w.get("isExalted") or w.get("warframeId"):
        return False
    return True


def passive_for(w: dict, passives: dict[str, str]) -> str | None:
    if w.get("passive"):
        return w["passive"]
    return passives.get(w["id"])


def hints_alt_aoe(passive: str) -> bool:
    low = passive.lower()
    return any(h in low for h in ALT_AOE_HINTS)


def passive_corrupted(passive: str) -> bool:
    return any(a in passive for a in PASSIVE_WIKI_ARTIFACTS)


def wiki_has_aoe_for_weapon(wid: str) -> bool:
    """Check wiki secondary module for parsed AoE attacks (cached per run)."""
    return wid in _WIKI_SECONDARY_AOE_IDS


_WIKI_SECONDARY_AOE_IDS: set[str] = set()


def load_wiki_secondary_aoe_ids() -> set[str]:
    try:
        import importlib.util

        spec = importlib.util.spec_from_file_location(
            "gen_radial",
            ROOT / "scripts/generate_radial_attacks.py",
        )
        gen = importlib.util.module_from_spec(spec)
        assert spec.loader is not None
        spec.loader.exec_module(gen)
        import urllib.parse
        import urllib.request

        params = {
            "action": "parse",
            "page": "Module:Weapons/data/secondary",
            "prop": "wikitext",
            "format": "json",
        }
        url = "https://wiki.warframe.com/api.php?" + urllib.parse.urlencode(params)
        req = urllib.request.Request(url, headers={"User-Agent": "Voidforge/1.0 (secondary audit)"})
        with urllib.request.urlopen(req, timeout=120) as resp:
            data = json.loads(resp.read())
        text = data["parse"]["wikitext"]["*"]
        return set(gen.parse_lua_table(text).keys())
    except Exception:
        return set()


def ips_mismatch(w: dict) -> bool:
    ips = (w.get("impact") or 0) + (w.get("puncture") or 0) + (w.get("slash") or 0)
    dmg = w.get("damage") or 0
    if dmg <= 0:
        return False
    if ips <= 0:
        return False
    return abs(ips - dmg) > max(1.0, dmg * 0.05)


INNATE_BLAST_HINTS = ("spherical blast", "explodes in", "blast radius", "explosion")


def innate_blast_passive(passive: str) -> bool:
    low = passive.lower()
    return any(h in low for h in INNATE_BLAST_HINTS)


def audit() -> int:
    global _WIKI_SECONDARY_AOE_IDS
    _WIKI_SECONDARY_AOE_IDS = load_wiki_secondary_aoe_ids()

    weapons = load_weapons()
    passives = load_passives()
    radial = load_radial_ids()
    pool = [w for w in weapons if is_secondary(w)]

    print("=== Secondary weapon audit ===\n")
    print(f"Pool size: {len(pool)}")
    print(f"By category: {dict(Counter(w['category'] for w in pool))}")

    missing_stats: list[str] = []
    zero_damage: list[str] = []
    for w in pool:
        wid = w["id"]
        missing = [k for k in REQUIRED_STATS if k not in w or w[k] is None]
        if missing:
            missing_stats.append(f"{wid}: missing {missing}")
        if w.get("damage", 0) <= 0:
            zero_damage.append(wid)

    print(f"\nMissing required stat fields: {len(missing_stats)}")
    for line in sorted(missing_stats)[:25]:
        print(f"  {line}")
    if len(missing_stats) > 25:
        print(f"  ... +{len(missing_stats) - 25}")

    if zero_damage:
        print(f"\nZero damage: {len(zero_damage)}")
        for wid in sorted(zero_damage):
            print(f"  {wid}")

    no_passive = [w for w in pool if not passive_for(w, passives)]
    print(f"\nMissing passive: {len(no_passive)} (vanilla secondaries — no wiki passive entry)")
    for w in sorted(no_passive, key=lambda x: x["name"]):
        print(f"  {w['id']}: {w['name']}")

    corrupted = [
        w for w in pool
        if (p := passive_for(w, passives)) and passive_corrupted(p)
    ]
    print(f"\nCorrupted passive text (wiki markup): {len(corrupted)}")
    for w in sorted(corrupted, key=lambda x: x["name"]):
        print(f"  {w['id']}")

    with_radial = [w for w in pool if w["id"] in radial or w.get("radialAttacks")]
    print(f"\nRadial/AoE profiles: {len(with_radial)}/{len(pool)}")
    print(f"Wiki AoE weapons parsed: {len(_WIKI_SECONDARY_AOE_IDS & {w['id'] for w in pool})}")

    ips_bad = [w for w in pool if ips_mismatch(w)]
    print(f"\nIPS sum != damage (>5%): {len(ips_bad)}")
    for w in sorted(ips_bad, key=lambda x: x["name"])[:20]:
        ips = (w.get("impact") or 0) + (w.get("puncture") or 0) + (w.get("slash") or 0)
        print(f"  {w['id']}: damage={w['damage']} ips={ips}")
    if len(ips_bad) > 20:
        print(f"  ... +{len(ips_bad) - 20}")

    innate_blast_no_radial = []
    for w in pool:
        p = passive_for(w, passives)
        if not p or not innate_blast_passive(p):
            continue
        if w["id"] not in radial and not w.get("radialAttacks"):
            innate_blast_no_radial.append(w)

    if innate_blast_no_radial:
        print(f"\nInnate blast passive but no radial ({len(innate_blast_no_radial)}):")
        for w in sorted(innate_blast_no_radial, key=lambda x: x["name"]):
            print(f"  {w['id']}: {passive_for(w, passives)[:80]}...")

    alt_hint_no_radial = []
    alt_fire_non_aoe = []
    for w in pool:
        p = passive_for(w, passives)
        if not p or not hints_alt_aoe(p):
            continue
        if w["id"] in radial or w.get("radialAttacks"):
            continue
        alt_hint_no_radial.append(w)
        if w["id"] not in _WIKI_SECONDARY_AOE_IDS:
            alt_fire_non_aoe.append(w)

    print(f"\nPassive hints alt-fire/AoE but no radial profile: {len(alt_hint_no_radial)}")
    for w in sorted(alt_hint_no_radial, key=lambda x: x["name"]):
        tag = "alt-fire only" if w["id"] not in _WIKI_SECONDARY_AOE_IDS else "wiki AoE — needs sync"
        print(f"  {w['id']}: {w['name']} ({tag})")

    radial_only = [
        w for w in pool
        if w["id"] in radial
        and not ((p := passive_for(w, passives)) and hints_alt_aoe(p))
    ]
    print(f"\nRadial profile without alt/AoE passive mention: {len(radial_only)} (may be innate/explosion)")

    needs_sync = [w for w in alt_hint_no_radial if w["id"] in _WIKI_SECONDARY_AOE_IDS]
    issues = (
        len(missing_stats)
        + len(zero_damage)
        + len(corrupted)
        + len(needs_sync)
        + len(innate_blast_no_radial)
    )
    print(f"\n--- Summary ---")
    print(f"  With passive: {len(pool) - len(no_passive)}/{len(pool)}")
    print(f"  With radial/AoE data: {len(with_radial)}/{len(pool)}")
    print(f"  Alt-fire passives without radial: {len(alt_hint_no_radial)} ({len(alt_fire_non_aoe)} alt-fire-only, {len(needs_sync)} wiki AoE gaps)")
    print(f"  Innate blast passives without radial: {len(innate_blast_no_radial)}")
    print(f"  Actionable issues (stats/corruption/wiki AoE sync/innate blast): {issues}")
    return issues


if __name__ == "__main__":
    sys.exit(1 if audit() else 0)
