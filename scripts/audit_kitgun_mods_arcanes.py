#!/usr/bin/env python3
"""Audit Kitgun mods (riven) and Pax/Residual arcanes for stats, effects, and behaviors."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MODS_TS = ROOT / "src/data/mods.ts"
EFFECTS_TS = ROOT / "src/data/arcane-effects.ts"
BEHAVIORS_TS = ROOT / "src/data/arcane-behaviors.ts"
MOD_BEHAVIOR_DIR = ROOT / "src/data/mod-behaviors"

KITGUN_MOD_IDS = frozenset({"kitgun_riven_mod"})
PAX_IDS = frozenset({"pax_bolt", "pax_charge", "pax_seeker", "pax_soar"})
RESIDUAL_IDS = frozenset({
    "residual_boils",
    "residual_malodor",
    "residual_shock",
    "residual_viremia",
})
KITGUN_ARCANE_IDS = PAX_IDS | RESIDUAL_IDS

EXPECTED_TRIGGERS = {
    "pax_bolt": "onHeadshot",
    "pax_charge": "passive",
    "pax_seeker": "onHeadshot",
    "pax_soar": "passive",
    "residual_boils": "onKill",
    "residual_malodor": "onKill",
    "residual_shock": "onKill",
    "residual_viremia": "onKill",
}

# Wiki rank tables (R0, R3).
WIKI_RANKS = {
    "pax_bolt": {
        "abilityEfficiency": (7.5, 30),
        "abilityStrength": (7.5, 30),
        "buffDuration": (4, 4),
    },
    "pax_charge": {"kitgunRecharge": (12.5, 50)},
    "pax_seeker": {"kitgunHoming": (1, 4)},
    "pax_soar": {
        "airborneAccuracy": (12.5, 50),
        "airborneRecoilReduction": (12.5, 50),
        "aimGlideDuration": (1.25, 5),
    },
    "residual_boils": {
        "killProcChance": (20, 20),
        "zoneDuration": (3, 12),
        "zoneDamage": (80, 80),
        "zoneRadius": (10, 10),
        "zoneBuffRadius": (9, 9),
    },
    "residual_malodor": {
        "killProcChance": (20, 20),
        "zoneDuration": (3, 12),
        "zoneDamagePerSec": (40, 40),
        "zoneRadius": (9, 9),
        "zoneBuffRadius": (9, 9),
    },
    "residual_shock": {
        "killProcChance": (20, 20),
        "zoneDuration": (3, 12),
        "zoneDamage": (200, 200),
        "zoneRadius": (10, 10),
        "zoneBuffRadius": (9, 9),
    },
    "residual_viremia": {
        "killProcChance": (20, 20),
        "zoneDuration": (3, 12),
        "zoneDamagePerSec": (40, 40),
        "zoneRadius": (9, 9),
        "zoneBuffRadius": (9, 9),
    },
}

FORBIDDEN_STAT_KEYS = frozenset({
    "healthRegenChance",  # misused for kill proc on residuals
    "electricZoneDuration",  # unified to zoneDuration
    "kitgunTether",  # legacy wrong stat on pax_bolt
    "kitgunProjectileSpeed",  # legacy wrong stat on pax_soar
})


def load_mods() -> dict[str, dict]:
    out: dict[str, dict] = {}
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
        out[mid.group(1)] = {
            "name": grab("name"),
            "maxRank": int(mr_m.group(1)) if mr_m else 0,
            "stats": stats,
        }
    return out


def load_effects() -> dict[str, dict]:
    text = EFFECTS_TS.read_text(encoding="utf-8")
    start = text.index("{", text.index("ARCANE_EFFECTS"))
    end = text.rindex(";")
    raw = json.loads(text[start:end])
    out: dict[str, dict] = {}
    for aid, entry in raw.items():
        effects = entry.get("effects", [])
        out[aid] = {
            "trigger": entry.get("trigger"),
            "maxRank": entry.get("maxRank"),
            "effects": {e["stat"]: e for e in effects},
        }
    return out


def load_arcane_behaviors() -> dict[str, dict]:
    text = BEHAVIORS_TS.read_text(encoding="utf-8")
    out: dict[str, dict] = {}
    for m in re.finditer(r'"([^"]+)":\s*\{\s*arcaneId:', text):
        aid = m.group(1)
        block_start = m.start()
        depth = 0
        i = text.index("{", block_start)
        while i < len(text):
            if text[i] == "{":
                depth += 1
            elif text[i] == "}":
                depth -= 1
                if depth == 0:
                    block = text[block_start : i + 1]
                    break
            i += 1
        else:
            continue
        stat_keys = re.findall(r'"statKey":\s*"([^"]+)"', block)
        out[aid] = {"statKeys": stat_keys}
    return out


def load_mod_behaviors() -> dict[str, dict]:
    out: dict[str, dict] = {}
    key_re = r'(?:"[^"]+"|\w+)'
    for path in MOD_BEHAVIOR_DIR.rglob("*.ts"):
        text = path.read_text(encoding="utf-8")
        for m in re.finditer(
            rf"({key_re}):\s*mod\(\"([^\"]+)\"\s*,\s*\[([\s\S]*?)\](?:\s*,\s*\"([^\"]*)\")?\)",
            text,
        ):
            out[m.group(2)] = {"descriptionOnly": bool(m.group(4))}
        for m in re.finditer(
            rf"({key_re}):\s*mod\(\"([^\"]+)\"\s*,\s*\[\s*\]\s*,\s*\"([^\"]*)\"\)",
            text,
        ):
            out[m.group(2)] = {"descriptionOnly": True}
    return out


def scale_value(line: dict, rank: int, max_rank: int) -> float:
    if line.get("valuesByRank"):
        arr = line["valuesByRank"]
        return float(arr[min(rank, len(arr) - 1)])
    max_val = float(line["maxValue"])
    if line.get("constantAtAllRanks"):
        return max_val
    base = line.get("baseValue")
    if base is not None and max_rank > 0:
        return float(base) + (max_val - float(base)) * (rank / max_rank)
    return max_val * ((rank + 1) / (max_rank + 1))


def audit_arcanes(
    pool: frozenset[str],
    effects: dict[str, dict],
    behaviors: dict[str, dict],
) -> list[str]:
    issues: list[str] = []
    for aid in sorted(pool):
        eff = effects.get(aid)
        if not eff:
            issues.append(f"{aid}: missing from arcane-effects.ts")
            continue
        beh = behaviors.get(aid)
        if not beh:
            issues.append(f"{aid}: missing arcane behavior entry")
            continue

        expected_trigger = EXPECTED_TRIGGERS.get(aid)
        if expected_trigger and eff.get("trigger") != expected_trigger:
            issues.append(f"{aid}: trigger={eff.get('trigger')} expected {expected_trigger}")

        effect_stats = set(eff["effects"])
        behavior_stats = set(beh.get("statKeys", []))
        if effect_stats != behavior_stats:
            issues.append(
                f"{aid}: effect/behavior mismatch effects={sorted(effect_stats)} behavior={sorted(behavior_stats)}"
            )

        bad_keys = effect_stats & FORBIDDEN_STAT_KEYS
        if bad_keys:
            issues.append(f"{aid}: forbidden stat keys {sorted(bad_keys)}")

        wiki = WIKI_RANKS.get(aid, {})
        max_rank = int(eff.get("maxRank") or 3)
        for stat, (r0, r3) in wiki.items():
            line = eff["effects"].get(stat)
            if not line:
                issues.append(f"{aid}: missing wiki stat {stat}")
                continue
            got0 = round(scale_value(line, 0, max_rank), 4)
            got3 = round(scale_value(line, 3, max_rank), 4)
            if abs(got0 - r0) > 0.05:
                issues.append(f"{aid}.{stat}: R0={got0} wiki={r0}")
            if abs(got3 - r3) > 0.05:
                issues.append(f"{aid}.{stat}: R3={got3} wiki={r3}")

        extra = effect_stats - set(wiki)
        if extra:
            issues.append(f"{aid}: stats without wiki table: {sorted(extra)}")

    return issues


def audit_kitgun_mod(mods: dict[str, dict], mod_behaviors: dict[str, dict]) -> list[str]:
    issues: list[str] = []
    for mid in sorted(KITGUN_MOD_IDS):
        m = mods.get(mid)
        if not m:
            issues.append(f"{mid}: missing from mods.ts")
            continue
        beh = mod_behaviors.get(mid)
        if not beh:
            issues.append(f"{mid}: missing mod behavior")
        elif not beh.get("descriptionOnly"):
            issues.append(f"{mid}: expected description-only behavior")
        if m["stats"]:
            issues.append(f"{mid}: riven should have empty stats")
        if m["maxRank"] != 0:
            issues.append(f"{mid}: riven maxRank should be 0")
    return issues


def main() -> int:
    mods = load_mods()
    effects = load_effects()
    arcane_behaviors = load_arcane_behaviors()
    mod_behaviors = load_mod_behaviors()

    print("=== Kitgun mod + arcane audit ===\n")

    print("--- Kitgun mods ---")
    mod_issues = audit_kitgun_mod(mods, mod_behaviors)
    print(f"Pool: {len(KITGUN_MOD_IDS)}")
    if mod_issues:
        for line in mod_issues:
            print(f"  {line}")
    else:
        print("  OK — kitgun_riven_mod is description-only (expected)")

    print("\n--- Pax arcanes ---")
    pax_issues = audit_arcanes(PAX_IDS, effects, arcane_behaviors)
    print(f"Pool: {len(PAX_IDS)}")
    if pax_issues:
        for line in pax_issues:
            print(f"  {line}")
    else:
        print("  OK — all Pax arcanes match wiki ranks and behaviors")

    print("\n--- Residual arcanes ---")
    residual_issues = audit_arcanes(RESIDUAL_IDS, effects, arcane_behaviors)
    print(f"Pool: {len(RESIDUAL_IDS)}")
    if residual_issues:
        for line in residual_issues:
            print(f"  {line}")
    else:
        print("  OK — all Residual arcanes match wiki ranks and behaviors")

    total = len(mod_issues) + len(pax_issues) + len(residual_issues)
    print("\n--- Summary ---")
    print(f"  Kitgun mod issues: {len(mod_issues)}")
    print(f"  Pax arcane issues: {len(pax_issues)}")
    print(f"  Residual arcane issues: {len(residual_issues)}")
    print(f"  Total actionable: {total}")
    return total


if __name__ == "__main__":
    sys.exit(1 if main() else 0)
