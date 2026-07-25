#!/usr/bin/env python3
"""Audit Zaw mods (riven) and Exodia arcanes for stats, effects, and behaviors."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MODS_TS = ROOT / "src/data/mods.ts"
ARCANES_TS = ROOT / "src/data/arcanes.ts"
EFFECTS_TS = ROOT / "src/data/arcane-effects.ts"
BEHAVIORS_TS = ROOT / "src/data/arcane-behaviors.ts"
MOD_BEHAVIOR_DIR = ROOT / "src/data/mod-behaviors"
HANDLERS_TS = ROOT / "src/lib/arcane-handlers.ts"

ZAW_MOD_IDS = frozenset({"zaw_riven_mod"})
EXODIA_IDS = frozenset({
    "exodia_brave",
    "exodia_contagion",
    "exodia_epidemic",
    "exodia_force",
    "exodia_hunt",
    "exodia_might",
    "exodia_triumph",
    "exodia_valor",
})

# Wiki rank tables (R0, R3) for scaling verification.
WIKI_RANKS = {
    "exodia_brave": {"energyRegen": (1.25, 5.0), "buffDuration": (4, 4)},
    "exodia_contagion": {"contagionProjectileDamage": (100, 400), "contagionExplosionRadius": (8, 8)},
    "exodia_epidemic": {"epidemicSuspendDuration": (1, 4)},
    "exodia_force": {
        "statusProcChance": (50, 50),
        "procDamageMultiplier": (50, 200),
        "procAuraRadius": (6, 6),
    },
    "exodia_hunt": {"pullChance": (50, 50), "pullRadius": (6, 12)},
    "exodia_might": {"lifeStealChance": (50, 50), "lifeSteal": (7.5, 30), "buffDuration": (8, 8)},
    "exodia_triumph": {"meleeComboChance": (12.5, 50)},
    "exodia_valor": {"meleeComboChance": (50, 200)},
}


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
            "category": grab("category"),
            "maxRank": int(mr_m.group(1)) if mr_m else 0,
            "stats": stats,
            "description": grab("description"),
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
            "stackCap": entry.get("stackCap"),
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
        custom = re.search(r'customHandler:\s*"([^"]+)"', block)
        stat_keys = re.findall(r'"statKey":\s*"([^"]+)"', block)
        out[aid] = {
            "customHandler": custom.group(1) if custom else None,
            "statKeys": stat_keys,
        }
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
            out[m.group(2)] = {
                "statKeys": re.findall(r'line\("([^"]+)"', m.group(3)),
                "descriptionOnly": bool(m.group(4)),
                "file": path.name,
            }
        for m in re.finditer(
            rf"({key_re}):\s*mod\(\"([^\"]+)\"\s*,\s*\[\s*\]\s*,\s*\"([^\"]*)\"\)",
            text,
        ):
            out[m.group(2)] = {"statKeys": [], "descriptionOnly": True, "file": path.name}
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


def audit_exodia(effects: dict[str, dict], behaviors: dict[str, dict], handlers_text: str) -> list[str]:
    issues: list[str] = []
    for aid in sorted(EXODIA_IDS):
        eff = effects.get(aid)
        if not eff:
            issues.append(f"{aid}: missing from arcane-effects.ts")
            continue
        beh = behaviors.get(aid)
        if not beh:
            issues.append(f"{aid}: missing arcane behavior entry")
            continue
        if not beh.get("customHandler"):
            issues.append(f"{aid}: missing customHandler in arcane-behaviors.ts")
        elif beh["customHandler"] not in handlers_text:
            issues.append(f"{aid}: customHandler {beh['customHandler']} not in arcane-handlers.ts")

        effect_stats = set(eff["effects"])
        behavior_stats = set(beh.get("statKeys", []))
        if effect_stats != behavior_stats:
            issues.append(
                f"{aid}: effect/behavior stat mismatch effects={sorted(effect_stats)} behavior={sorted(behavior_stats)}"
            )

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
            issues.append(f"{aid}: stats without wiki rank table: {sorted(extra)}")

    return issues


def audit_zaw_mod(mods: dict[str, dict], mod_behaviors: dict[str, dict]) -> list[str]:
    issues: list[str] = []
    for mid in sorted(ZAW_MOD_IDS):
        m = mods.get(mid)
        if not m:
            issues.append(f"{mid}: missing from mods.ts")
            continue
        beh = mod_behaviors.get(mid)
        if not beh:
            issues.append(f"{mid}: missing mod behavior")
        elif not beh.get("descriptionOnly"):
            issues.append(f"{mid}: expected description-only behavior (riven has no fixed stats)")
        if m["stats"]:
            issues.append(f"{mid}: riven should have empty stats, got {m['stats']}")
        if m["maxRank"] != 0:
            issues.append(f"{mid}: riven maxRank should be 0, got {m['maxRank']}")
    return issues


def main() -> int:
    mods = load_mods()
    effects = load_effects()
    arcane_behaviors = load_arcane_behaviors()
    mod_behaviors = load_mod_behaviors()
    handlers_text = HANDLERS_TS.read_text(encoding="utf-8")

    print("=== Zaw mod + Exodia arcane audit ===\n")

    print("--- Zaw mods ---")
    zaw_issues = audit_zaw_mod(mods, mod_behaviors)
    print(f"Pool: {len(ZAW_MOD_IDS)}")
    print(f"Behavior coverage: {len(ZAW_MOD_IDS) - sum(1 for i in zaw_issues if 'missing mod behavior' in i)}/{len(ZAW_MOD_IDS)}")
    for line in zaw_issues:
        print(f"  {line}")
    if not zaw_issues:
        print("  OK — zaw_riven_mod is description-only (expected)")

    print("\n--- Exodia arcanes ---")
    exodia_issues = audit_exodia(effects, arcane_behaviors, handlers_text)
    print(f"Pool: {len(EXODIA_IDS)}")
    covered = len(EXODIA_IDS) - sum(1 for i in exodia_issues if "missing arcane behavior" in i or "missing from arcane-effects" in i)
    print(f"Effect + behavior coverage: {covered}/{len(EXODIA_IDS)}")
    for line in exodia_issues:
        print(f"  {line}")
    if not exodia_issues:
        print("  OK — all Exodia arcanes match wiki ranks and behaviors")

    print("\n--- Summary ---")
    total = len(zaw_issues) + len(exodia_issues)
    print(f"  Zaw mod issues: {len(zaw_issues)}")
    print(f"  Exodia arcane issues: {len(exodia_issues)}")
    print(f"  Total actionable: {total}")
    return total


if __name__ == "__main__":
    sys.exit(1 if main() else 0)
