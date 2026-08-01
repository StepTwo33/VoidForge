#!/usr/bin/env python3
"""Audit arcane-effects.ts for hallucinations vs wiki Module:Arcane/data and arcanes.ts."""

from __future__ import annotations

import json
import re
import urllib.parse
import urllib.request
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
EFFECTS_TS = REPO / "src" / "data" / "arcane-effects.ts"
ARCANES_TS = REPO / "src" / "data" / "arcanes.ts"
MANUAL = REPO / "src" / "data" / "arcane-manual-overrides.json"
HEADERS = {"User-Agent": "Voidforge/1.0 (arcane audit)"}


def slugify(name: str) -> str:
    s = name.lower().replace("arcane ", "")
    s = re.sub(r"[^a-z0-9]+", "_", s)
    return s.strip("_")


def load_arcanes_ts() -> dict[str, dict]:
    text = ARCANES_TS.read_text(encoding="utf-8")
    blocks = re.split(r"\{\s*\n\s*id:", text)
    out: dict[str, dict] = {}
    for block in blocks[1:]:
        id_m = re.search(r'"([^"]+)"', block)
        if not id_m:
            continue
        aid = id_m.group(1)
        name_m = re.search(r'name:\s*"([^"]+)"', block)
        desc_m = re.search(r'description:\s*"((?:[^"\\]|\\.)*)"', block)
        max_m = re.search(r"maxRank:\s*(\d+)", block)
        sub_m = re.search(r'subCategory:\s*"([^"]+)"', block)
        stats_m = re.search(r"stats:\s*\{([^}]*)\}", block)
        out[aid] = {
            "name": name_m.group(1) if name_m else aid,
            "description": (desc_m.group(1) if desc_m else "").replace("\\ ", " ").replace("\\n", "\n"),
            "maxRank": int(max_m.group(1)) if max_m else 5,
            "subCategory": sub_m.group(1) if sub_m else "",
            "hasLegacyStats": bool(stats_m and stats_m.group(1).strip()),
        }
    return out


def load_effects_ts() -> dict[str, dict]:
    text = EFFECTS_TS.read_text(encoding="utf-8")
    out: dict[str, dict] = {}
    for m in re.finditer(r'"([^"]+)":\s*\{', text):
        aid = m.group(1)
        start = m.start()
        depth = 0
        i = m.end() - 1
        while i < len(text):
            if text[i] == "{":
                depth += 1
            elif text[i] == "}":
                depth -= 1
                if depth == 0:
                    block = text[start : i + 1]
                    break
            i += 1
        else:
            continue
        trigger = re.search(r'"trigger":\s*"([^"]+)"', block)
        max_rank = re.search(r'"maxRank":\s*(\d+)', block)
        stack_cap = re.search(r'"stackCap":\s*(null|\d+)', block)
        effects = re.findall(
            r'\{\s*"stat":\s*"([^"]+)",\s*"maxValue":\s*([\d.]+)',
            block,
        )
        out[aid] = {
            "trigger": trigger.group(1) if trigger else None,
            "maxRank": int(max_rank.group(1)) if max_rank else None,
            "stackCap": None if stack_cap and stack_cap.group(1) == "null" else int(stack_cap.group(1)) if stack_cap else None,
            "effects": [{"stat": s, "maxValue": float(v)} for s, v in effects],
        }
    return out


def fetch_wiki_arcanes() -> dict[str, dict]:
    params = {"action": "parse", "page": "Module:Arcane/data", "prop": "wikitext", "format": "json"}
    url = "https://wiki.warframe.com/api.php?" + urllib.parse.urlencode(params)
    with urllib.request.urlopen(urllib.request.Request(url, headers=HEADERS), timeout=120) as r:
        text = json.loads(r.read())["parse"]["wikitext"]["*"]

    arcanes: dict[str, dict] = {}
    for m in re.finditer(r'\["([^"]+)"\]\s*=\s*\{', text):
        name = m.group(1)
        start = m.end() - 1
        depth = 0
        i = start
        while i < len(text):
            if text[i] == "{":
                depth += 1
            elif text[i] == "}":
                depth -= 1
                if depth == 0:
                    block = text[start : i + 1]
                    break
            i += 1
        else:
            continue
        desc_m = re.search(r'Description\s*=\s*"((?:[^"\\]|\\.)*)"', block)
        max_rank_m = re.search(r"MaxRank\s*=\s*(\d+)", block)
        type_m = re.search(r'Type\s*=\s*"([^"]+)"', block)
        if not desc_m:
            continue
        desc = desc_m.group(1).replace("\\r\\n", "\n").replace("\\n", "\n")
        arcanes[slugify(name)] = {
            "wikiName": name,
            "description": desc,
            "maxRank": int(max_rank_m.group(1)) if max_rank_m else 5,
            "type": type_m.group(1) if type_m else "Warframe",
        }
    return arcanes


def normalize(s: str) -> str:
    s = re.sub(r"<[^>]+>", "", s.lower())
    s = re.sub(r"[^a-z0-9%+.\s]", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def extract_pct_values(desc: str) -> list[float]:
    return [float(x) for x in re.findall(r"\+(\d+(?:\.\d+)?)\s*%", desc)]


def main() -> None:
    fh = load_arcanes_ts()
    effects = load_effects_ts()
    wiki = fetch_wiki_arcanes()
    manual = json.loads(MANUAL.read_text(encoding="utf-8")) if MANUAL.exists() else {}

    print("=== COVERAGE ===")
    print(f"arcanes.ts:        {len(fh)}")
    print(f"arcane-effects.ts: {len(effects)}")
    print(f"wiki Module/data:  {len(wiki)}")

    missing_effects = sorted(set(fh) - set(effects))
    extra_effects = sorted(set(effects) - set(fh))
    if missing_effects:
        print(f"\nMISSING from arcane-effects ({len(missing_effects)}):")
        for a in missing_effects:
            print(f"  - {a}")
    if extra_effects:
        print(f"\nEXTRA in arcane-effects ({len(extra_effects)}):")
        for a in extra_effects:
            print(f"  - {a}")

    empty = [a for a, e in effects.items() if not e["effects"]]
    utility = [a for a, e in effects.items() if any(x["stat"] == "utilityEffect" for x in e["effects"])]

    print(f"\nEmpty effects: {len(empty)}")
    print(f"utilityEffect placeholders: {len(utility)}")

    issues: list[str] = []

    # Map fh id -> wiki slug
    id_to_wiki: dict[str, dict] = {}
    for aid, data in fh.items():
        bare = aid.replace("arcane_", "", 1) if aid.startswith("arcane_") else aid
        w = wiki.get(bare) or wiki.get(aid)
        if w:
            id_to_wiki[aid] = w

    print(f"\nWiki matched: {len(id_to_wiki)}/{len(fh)}")

    for aid, fh_data in sorted(fh.items()):
        eff = effects.get(aid)
        if not eff:
            issues.append(f"{aid}: no effect definition")
            continue

        if eff["maxRank"] != fh_data["maxRank"]:
            issues.append(f"{aid}: maxRank mismatch effects={eff['maxRank']} arcanes.ts={fh_data['maxRank']}")

        w = id_to_wiki.get(aid)
        if w and eff["maxRank"] != w["maxRank"]:
            issues.append(f"{aid}: maxRank mismatch effects={eff['maxRank']} wiki={w['maxRank']}")

        if not eff["effects"]:
            issues.append(f"{aid}: zero effect lines")

        if any(x["stat"] == "utilityEffect" for x in eff["effects"]):
            issues.append(f"{aid}: utilityEffect placeholder — needs manual override or parser fix")

        # Sanity: effect maxValues should appear in description (for % stats)
        desc = normalize(fh_data["description"])
        for line in eff["effects"]:
            stat, val = line["stat"], line["maxValue"]
            if stat in ("utilityEffect", "removeShields", "abilityStrengthPerHealthStep"):
                continue
            if stat == "persistenceDamageCapPerSecond":
                if val not in (500, 550, 600, 650, 700, 750):
                    issues.append(f"{aid}: persistence cap {val} looks wrong")
                continue
            if val <= 0:
                issues.append(f"{aid}: {stat} maxValue={val} is non-positive")
            # Flag implausible weapon damage (>600% unless stacking cap is high)
            if stat == "damage" and val > 600 and eff.get("stackCap", 1) and val / max(eff.get("stackCap") or 1, 1) > 100:
                pass  # ok for cascadia flare style
            elif stat == "damage" and val > 200 and eff["trigger"] != "stacks":
                if str(int(val)) not in desc and str(val) not in desc:
                    issues.append(f"{aid}: damage {val}% not found in description")

        # Cross-check: wiki description pct values vs our max effect pct (loose)
        if w:
            wiki_pcts = extract_pct_values(w["description"])
            our_pcts = [
                x["maxValue"]
                for x in eff["effects"]
                if x["stat"] not in ("utilityEffect", "removeShields", "abilityStrengthPerHealthStep", "energyPerArmor")
                and x["maxValue"] <= 500
            ]
            for op in our_pcts:
                if op > 5 and wiki_pcts and not any(abs(op - wp) < 0.6 or abs(op - wp * 2) < 0.6 for wp in wiki_pcts):
                    # Allow manual overrides
                    if aid not in manual:
                        issues.append(f"{aid}: effect value {op}% not in wiki desc pcts {wiki_pcts[:8]}")

    print(f"\n=== ISSUES ({len(issues)}) ===")
    for i in issues:
        print(f"  ! {i}")

    # Rank mismatch summary
    rank_mism = [i for i in issues if "maxRank mismatch" in i]
    utility_issues = [i for i in issues if "utilityEffect" in i]

    print(f"\n=== SUMMARY ===")
    print(f"Total issues: {len(issues)}")
    print(f"  maxRank mismatches: {len(rank_mism)}")
    print(f"  utilityEffect placeholders: {len(utility_issues)}")
    print(f"  manual overrides on file: {len(manual)}")

    if issues:
        Path(REPO / "scripts" / "arcane_audit_report.txt").write_text("\n".join(issues), encoding="utf-8")
        print("\nFull report written to scripts/arcane_audit_report.txt")


if __name__ == "__main__":
    main()
