#!/usr/bin/env python3
"""Audit Focus School amp mods (tektolyst amp upgrades + operator amp passives)."""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MODS_TS = ROOT / "src/data/mods.ts"
BEHAVIOR_DIR = ROOT / "src/data/mod-behaviors"
EXPECTED_AMP_BATCH = "tektolyst.ts"
EXPECTED_OPERATOR_BATCH = "operator.ts"

# Tektolyst mods that directly modify Operator Amps (Focus tree amp upgrades).
FOCUS_AMP_IDS = frozenset({
    "hayan_dabor",
    "hok_kaal",
    "omn_evi",
    "sil_tabol",
    "ubri_kaneph",
    "vik_anam",
    "vikla_safor",
})

# Operator focus passives that affect Amps / Void Beam energy (related, not amp stat mods).
OPERATOR_AMP_PASSIVE_IDS = frozenset({
    "amp_spike",
    "eternal_gaze",
    "inner_gaze",
    "power_transfer",
    "void_flow",
    "void_fuel",
    "void_siphon",
})


def load_mods() -> list[dict]:
    mods = []
    for chunk in re.split(r"\n  \},\n", MODS_TS.read_text(encoding="utf-8")):
        mid = re.search(r'"id":\s*"([^"]+)"', chunk)
        if not mid:
            continue

        def grab(key: str, default: str = "") -> str:
            m = re.search(rf'"{key}":\s*"([^"]*)"', chunk)
            return m.group(1) if m else default

        mr_m = re.search(r'"maxRank":\s*(\d+)', chunk)
        stats_block = re.search(r'"stats":\s*\{([^}]*)\}', chunk, re.S)
        stats: dict[str, float] = {}
        if stats_block and stats_block.group(1).strip():
            for sm in re.finditer(r'"([^"]+)":\s*(-?[\d.]+)', stats_block.group(1)):
                stats[sm.group(1)] = float(sm.group(2))
        mods.append({
            "id": mid.group(1),
            "name": grab("name"),
            "category": grab("category"),
            "maxRank": int(mr_m.group(1)) if mr_m else 0,
            "stats": stats,
            "description": grab("description"),
        })
    return mods


def load_behaviors() -> dict[str, dict]:
    out: dict[str, dict] = {}
    key_re = r'(?:"[^"]+"|\w+)'
    for path in BEHAVIOR_DIR.rglob("*.ts"):
        text = path.read_text(encoding="utf-8")
        for m in re.finditer(
            rf"({key_re}):\s*mod\(\"([^\"]+)\"\s*,\s*\[([\s\S]*?)\](?:\s*,\s*\"([^\"]*)\")?\)",
            text,
        ):
            lines_raw = m.group(3)
            out[m.group(2)] = {
                "statKeys": re.findall(r'line\("([^"]+)"', lines_raw),
                "targets": re.findall(r'line\("[^"]+",\s*"([^"]+)"', lines_raw),
                "descriptionOnly": bool(m.group(4)),
                "file": path.name,
            }
        for m in re.finditer(
            rf"({key_re}):\s*mod\(\"([^\"]+)\"\s*,\s*\[\s*\]\s*,\s*\"([^\"]*)\"\)",
            text,
        ):
            out[m.group(2)] = {
                "statKeys": [],
                "targets": [],
                "descriptionOnly": True,
                "file": path.name,
            }
    return out


# Wiki max-rank expectations (rank 5). Flat stats are constant at all ranks.
WIKI_MAX_RANK = {
    "hayan_dabor": {"ampMultishot": 60},
    "hok_kaal": {"ampBonusDamage": 3.0, "cooldown": 5},
    "omn_evi": {"ampCriticalChance": 60, "ampCritDamage": 10},
    "sil_tabol": {"ampStatusChance": 60, "ampStatusDamage": 15},
    "ubri_kaneph": {"ampDamage": 60, "ampSchoolDamage": 10},
    "vik_anam": {"ampEnergy": 30, "ampEnergyRegen": 5},
    "vikla_safor": {"ampFireRate": 30, "ampAmmoEfficiency": 30},
}
FLAT_AMP_STATS = frozenset({
    "cooldown", "ampCritDamage", "ampStatusDamage", "ampSchoolDamage", "ampEnergyRegen",
})
MULTIPLIER_AMP_STATS = frozenset({"ampBonusDamage"})


def stat_at_max_rank(stat_key: str, per_rank: float, max_rank: int) -> float:
    if stat_key in FLAT_AMP_STATS:
        return per_rank
    if stat_key in MULTIPLIER_AMP_STATS:
        return per_rank * (max_rank + 1)
    return per_rank * (max_rank + 1)


def audit_wiki_stats(pool: list[dict]) -> list[str]:
    issues: list[str] = []
    for m in pool:
        expected = WIKI_MAX_RANK.get(m["id"], {})
        for key, wiki_val in expected.items():
            if key not in m["stats"]:
                issues.append(f"{m['id']}: missing stat {key} (wiki max {wiki_val})")
                continue
            actual = stat_at_max_rank(key, m["stats"][key], m["maxRank"])
            if abs(actual - wiki_val) > 0.05:
                issues.append(
                    f"{m['id']}.{key}: catalog max={actual} wiki={wiki_val} (perRank={m['stats'][key]})"
                )
        extra = set(m["stats"]) - set(expected)
        if extra:
            issues.append(f"{m['id']}: unexpected stats {sorted(extra)}")
    return issues


def audit_pool(name: str, pool: list[dict], behaviors: dict[str, dict], expected_batch: str) -> int:
    print(f"=== {name} ===\n")
    print(f"Pool size: {len(pool)}")
    issues = 0

    missing_behavior = [m for m in pool if m["id"] not in behaviors]
    print(f"Behavior coverage: {len(pool) - len(missing_behavior)}/{len(pool)}")
    for m in sorted(missing_behavior, key=lambda x: x["name"]):
        print(f"  MISSING: {m['id']} ({m['name']})")
    issues += len(missing_behavior)

    no_stats = [
        m for m in pool
        if not m["stats"]
        and m.get("maxRank", 0) > 0
        and not behaviors.get(m["id"], {}).get("descriptionOnly")
    ]
    print(f"\nEmpty stats (ranked, not description-only): {len(no_stats)}")
    for m in sorted(no_stats, key=lambda x: x["name"]):
        print(f"  {m['id']}: {m['name']}")
    issues += len(no_stats)

    desc_only = [m for m in pool if behaviors.get(m["id"], {}).get("descriptionOnly")]
    print(f"\nDescription-only behaviors: {len(desc_only)}")
    for m in sorted(desc_only, key=lambda x: x["name"]):
        print(f"  {m['id']}: stats={list(m['stats'].keys()) or 'none'}")

    desc_only_with_stats: list[str] = []
    stats_no_behavior_line: list[str] = []
    behavior_extra: list[str] = []
    weapon_dps_on_amp: list[str] = []

    for m in pool:
        beh = behaviors.get(m["id"])
        if not beh:
            continue
        catalog_stats = set(m["stats"].keys())
        beh_stats = set(beh["statKeys"])
        if beh["descriptionOnly"] and catalog_stats:
            desc_only_with_stats.append(f"{m['id']}: {sorted(catalog_stats)}")
        missing_lines = catalog_stats - beh_stats
        if missing_lines and not beh["descriptionOnly"]:
            stats_no_behavior_line.append(f"{m['id']}: missing {sorted(missing_lines)}")
        extra_lines = beh_stats - catalog_stats
        if extra_lines and not beh["descriptionOnly"]:
            behavior_extra.append(f"{m['id']}: behavior-only {sorted(extra_lines)}")
        if m["id"] in FOCUS_AMP_IDS and "weapon_dps" in beh.get("targets", []):
            weapon_dps_on_amp.append(
                f"{m['id']}: weapon_dps lines for {sorted(beh_stats)} (amp mods are mod_panel-only)"
            )

    print(f"\nDescription-only with catalog stats: {len(desc_only_with_stats)}")
    for line in sorted(desc_only_with_stats):
        print(f"  {line}")

    print(f"\nCatalog stats missing behavior lines: {len(stats_no_behavior_line)}")
    for line in sorted(stats_no_behavior_line):
        print(f"  {line}")

    print(f"\nBehavior lines without catalog stats: {len(behavior_extra)}")
    for line in sorted(behavior_extra):
        print(f"  {line}")

    if weapon_dps_on_amp:
        print(f"\nAmp mods using weapon_dps target (should be mod_panel only): {len(weapon_dps_on_amp)}")
        for line in sorted(weapon_dps_on_amp):
            print(f"  {line}")
        issues += len(weapon_dps_on_amp)

    wiki_issues = audit_wiki_stats(pool) if pool and pool[0]["id"] in FOCUS_AMP_IDS else []
    if wiki_issues:
        print(f"\nWiki stat mismatches at max rank: {len(wiki_issues)}")
        for line in sorted(wiki_issues):
            print(f"  {line}")
        issues += len(wiki_issues)

    wrong_file = [
        f"{m['id']}: {behaviors[m['id']]['file']} (expected {expected_batch})"
        for m in pool
        if m["id"] in behaviors and behaviors[m["id"]]["file"] != expected_batch
    ]
    if wrong_file:
        print(f"\nBehaviors in unexpected batch: {len(wrong_file)}")
        for line in sorted(wrong_file):
            print(f"  {line}")
        issues += len(wrong_file)

    print(f"\nCatalog detail:")
    for m in sorted(pool, key=lambda x: x["name"]):
        beh = behaviors.get(m["id"], {})
        print(f"  {m['id']}: stats={m['stats']} | behavior keys={beh.get('statKeys', [])}")
    print()
    return issues


def main() -> int:
    mods = load_mods()
    by_id = {m["id"]: m for m in mods}
    behaviors = load_behaviors()

    amp_pool = [by_id[mid] for mid in sorted(FOCUS_AMP_IDS) if mid in by_id]
    op_pool = [by_id[mid] for mid in sorted(OPERATOR_AMP_PASSIVE_IDS) if mid in by_id]

    print("=== Focus School amp mod audit ===\n")
    issues = 0
    issues += audit_pool("Focus amp upgrades (tektolyst)", amp_pool, behaviors, EXPECTED_AMP_BATCH)
    issues += audit_pool("Operator amp passives (operator)", op_pool, behaviors, EXPECTED_OPERATOR_BATCH)

    print(f"--- Summary ---")
    print(f"  Focus amp upgrades: {len(amp_pool)}")
    print(f"  Operator amp passives: {len(op_pool)}")
    print(f"  Actionable issues: {issues}")
    return issues


if __name__ == "__main__":
    sys.exit(1 if main() else 0)
