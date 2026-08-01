#!/usr/bin/env python3
"""Verify augment drain/maxRank against wiki ModBox Cost column."""
from __future__ import annotations

import json
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
from wiki_modbox_parser import parse_modbox  # noqa: E402

MODS_TS = ROOT / "src/data/mods.ts"
WIKI = "https://wiki.warframe.com/api.php"
UA = {"User-Agent": "Voidforge/1.0 (https://void-forge.org)"}


def wiki_api(params: dict) -> dict:
    req = urllib.request.Request(WIKI + "?" + urllib.parse.urlencode(params), headers=UA)
    with urllib.request.urlopen(req) as resp:
        return json.load(resp)


def load_mods() -> list[dict]:
    text = MODS_TS.read_text(encoding="utf-8")
    match = re.search(r"export const allMods: Mod\[\] = (\[[\s\S]*?\n\]);", text)
    return json.loads(match.group(1))


def fetch_batch(titles: list[str]) -> dict[str, dict]:
    out: dict[str, dict] = {}
    for i in range(0, len(titles), 40):
        batch = titles[i : i + 40]
        params = {
            "action": "query",
            "titles": "|".join(batch),
            "prop": "revisions",
            "rvprop": "content",
            "rvslots": "main",
            "format": "json",
        }
        data = wiki_api(params)
        for page in data["query"]["pages"].values():
            if "missing" in page:
                continue
            title = page["title"]
            content = page["revisions"][0]["slots"]["main"]["*"]
            out[title] = parse_modbox(content)
        time.sleep(0.25)
    return out


def main() -> None:
    mods = load_mods()
    augments = [m for m in mods if m.get("category") == "augment"]
    wiki = fetch_batch([m["name"] for m in augments])

    mismatches: list[str] = []
    no_wiki: list[str] = []
    suspicious: list[str] = []
    ok = 0
    drain_dist: dict[int, int] = {}

    for mod in augments:
        d = mod.get("drain")
        if d is not None:
            drain_dist[int(d)] = drain_dist.get(int(d), 0) + 1

        info = wiki.get(mod["name"], {})
        if not info.get("drain"):
            no_wiki.append(mod["name"])
            # Heuristic: warframe augments without wiki shouldn't have stat-scale drain
            if (
                mod.get("subCategory") != "weapon"
                and d is not None
                and d > 14
                and mod.get("maxRank") == 3
            ):
                suspicious.append(f"{mod['name']}: drain={d} (no wiki table, likely stat leak)")
            continue

        issues = []
        if info["drain"] != mod.get("drain"):
            issues.append(f"drain local={mod.get('drain')} wiki={info['drain']}")
        if info.get("maxRank") is not None and info["maxRank"] != mod.get("maxRank"):
            issues.append(f"maxRank local={mod.get('maxRank')} wiki={info['maxRank']}")
        if issues:
            mismatches.append(f"{mod['name']} ({mod['id']}): " + "; ".join(issues))
        else:
            ok += 1

    print(f"Augments checked: {len(augments)}")
    print(f"Wiki match: {ok}")
    print(f"Mismatches: {len(mismatches)}")
    print(f"No wiki Cost table: {len(no_wiki)}")
    print(f"Suspicious (no wiki, drain>14): {len(suspicious)}")
    print("\nDrain distribution (R0):")
    for drain_val in sorted(drain_dist):
        print(f"  {drain_val:3}: {drain_dist[drain_val]}")

    if mismatches:
        print("\nMismatches:")
        for line in mismatches[:30]:
            print(f"  ! {line}")

    if suspicious:
        print("\nSuspicious (no wiki):")
        for line in suspicious[:20]:
            print(f"  ? {line}")

    if mismatches or suspicious:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
