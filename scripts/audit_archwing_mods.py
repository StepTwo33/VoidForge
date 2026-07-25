#!/usr/bin/env python3
"""Audit archwing frame mods: stat mods + archwing ability augments."""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MODS_TS = ROOT / "src/data/mods.ts"
BEHAVIOR_DIR = ROOT / "src/data/mod-behaviors"
ARCHWING_IDS = {"odonata", "odonata_prime", "elytron", "itzal", "amesha"}

BEHAVIOR_FILES = {"archwing": "archwing.ts", "augment": "augment.ts"}


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
            "subCategory": grab("subCategory"),
            "warframeId": grab("warframeId"),
            "maxRank": int(mr_m.group(1)) if mr_m else 0,
            "stats": stats,
            "description": grab("description"),
        })
    return mods


def is_archwing_augment(m: dict) -> bool:
    return m["category"] == "augment" and m.get("subCategory") == "archwing"


def archwing_pool(mods: list[dict]) -> list[dict]:
    return [
        m for m in mods
        if m["category"] == "archwing" or is_archwing_augment(m)
    ]


def load_behavior_map() -> dict[str, dict]:
    out: dict[str, dict] = {}
    for path in BEHAVIOR_DIR.rglob("*.ts"):
        text = path.read_text(encoding="utf-8")
        for m in re.finditer(
            r'(\w+):\s*mod\("([^"]+)"\s*,\s*\[([\s\S]*?)\](?:\s*,\s*"([^"]*)")?\)',
            text,
        ):
            out[m.group(2)] = {
                "statKeys": re.findall(r'line\("([^"]+)"', m.group(3)),
                "descriptionOnly": bool(m.group(4)),
                "file": path.name,
            }
        for m in re.finditer(r'(\w+):\s*mod\("([^"]+)"\s*,\s*\[\s*\]\s*,\s*"([^"]*)"\)', text):
            out[m.group(2)] = {"statKeys": [], "descriptionOnly": True, "file": path.name}
    return out


def expected_behavior_file(m: dict) -> str:
    if is_archwing_augment(m):
        return BEHAVIOR_FILES["augment"]
    return BEHAVIOR_FILES["archwing"]


def main() -> None:
    mods = load_mods()
    behaviors = load_behavior_map()
    pool = archwing_pool(mods)

    print("=== Archwing mod audit ===\n")
    print(f"Pool size: {len(pool)} ({sum(1 for m in pool if m['category'] == 'archwing')} stat, "
          f"{sum(1 for m in pool if is_archwing_augment(m))} augments)")

    missing_behavior = [m for m in pool if m["id"] not in behaviors]
    print(f"\nBehavior coverage: {len(pool) - len(missing_behavior)}/{len(pool)}")
    for m in sorted(missing_behavior, key=lambda x: x["name"]):
        print(f"  MISSING: {m['id']} ({m['name']})")

    no_stats = [
        m for m in pool
        if not m["stats"]
        and m.get("maxRank", 0) > 0
        and not behaviors.get(m["id"], {}).get("descriptionOnly")
    ]
    print(f"\nEmpty stats (ranked, not description-only): {len(no_stats)}")
    for m in sorted(no_stats, key=lambda x: x["name"]):
        print(f"  {m['id']}: {m['name']}")

    desc_only = [m for m in pool if behaviors.get(m["id"], {}).get("descriptionOnly")]
    print(f"\nDescription-only behaviors: {len(desc_only)}")
    for m in sorted(desc_only, key=lambda x: x["name"]):
        print(f"  {m['id']}: stats={list(m['stats'].keys()) or 'none'}")

    desc_only_with_stats: list[str] = []
    stats_no_behavior_line: list[str] = []
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

    print(f"\nDescription-only behaviors with catalog stats: {len(desc_only_with_stats)}")
    for line in sorted(desc_only_with_stats):
        print(f"  {line}")

    print(f"\nCatalog stats missing behavior lines: {len(stats_no_behavior_line)}")
    for line in sorted(stats_no_behavior_line):
        print(f"  {line}")

    wrong_file = [
        f"{m['id']}: {behaviors[m['id']]['file']} (expected {expected_behavior_file(m)})"
        for m in pool
        if m["id"] in behaviors and behaviors[m["id"]]["file"] != expected_behavior_file(m)
    ]
    if wrong_file:
        print(f"\nBehaviors in unexpected batch file: {len(wrong_file)}")
        for line in sorted(wrong_file):
            print(f"  {line}")

    augment_meta: list[str] = []
    for m in pool:
        if not is_archwing_augment(m):
            continue
        wid = m.get("warframeId", "")
        if not wid:
            augment_meta.append(f"{m['id']}: missing warframeId")
        elif wid not in ARCHWING_IDS:
            augment_meta.append(f"{m['id']}: warframeId '{wid}' not in archwing catalog")

    print(f"\nArchwing augment metadata issues: {len(augment_meta)}")
    for line in sorted(augment_meta):
        print(f"  {line}")

    category_mismatch = [
        f"{m['id']}: category={m['category']} subCategory={m.get('subCategory') or '(none)'}"
        for m in pool
        if is_archwing_augment(m) and m["category"] != "augment"
    ]
    if category_mismatch:
        print(f"\nAugments with wrong category: {len(category_mismatch)}")
        for line in sorted(category_mismatch):
            print(f"  {line}")

    print()
    issues = (
        len(missing_behavior)
        + len(no_stats)
        + len(stats_no_behavior_line)
        + len(desc_only_with_stats)
        + len(augment_meta)
    )
    sys.exit(1 if issues else 0)


if __name__ == "__main__":
    main()
