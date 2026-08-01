#!/usr/bin/env python3
"""Audit aura mod base drain vs wiki Module:Mod/data."""
from __future__ import annotations

import json
import re
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MODS_TS = ROOT / "src/data/mods.ts"
AURA_TS = ROOT / "src/lib/aura-mods.ts"
WIKI = "https://wiki.warframe.com/api.php"
UA = {"User-Agent": "Voidforge/1.0 (https://void-forge.org)"}


def load_aura_ids() -> set[str]:
    text = AURA_TS.read_text(encoding="utf-8")
    return set(re.findall(r'"([^"]+)"', text.split("AURA_MOD_IDS")[1].split(");")[0]))


AURA_IDS = load_aura_ids()


def wiki_api(params: dict) -> dict:
    req = urllib.request.Request(WIKI + "?" + urllib.parse.urlencode(params), headers=UA)
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.load(resp)


def fetch_mod_data() -> dict[str, dict]:
    data = wiki_api({
        "action": "parse",
        "page": "Module:Mod/data",
        "prop": "wikitext",
        "format": "json",
    })
    text = data["parse"]["wikitext"]["*"]
    mods: dict[str, dict] = {}
    for block in re.finditer(r"\['([^']+)'\]\s*=\s*\{([^}]+)\}", text):
        name = block.group(1)
        body = block.group(2)
        drain_m = re.search(r"\['drain'\]\s*=\s*(-?\d+)", body)
        rank_m = re.search(r"\['maxRank'\]\s*=\s*(\d+)", body)
        if drain_m:
            mods[name.lower().replace(" ", "_")] = {
                "name": name,
                "drain": int(drain_m.group(1)),
                "maxRank": int(rank_m.group(1)) if rank_m else None,
            }
    return mods


def parse_local_mods() -> dict[str, dict]:
    text = MODS_TS.read_text(encoding="utf-8")
    mods: dict[str, dict] = {}
    for block in re.finditer(
        r'\{\s*"id":\s*"([^"]+)"[\s\S]*?(?=\n  \},|\n  \{|\n\])',
        text,
        re.DOTALL,
    ):
        chunk = block.group(0)
        mid = re.search(r'"id":\s*"([^"]+)"', chunk)
        if not mid:
            continue
        mod_id = mid.group(1)
        if mod_id not in AURA_IDS:
            continue
        name = re.search(r'"name":\s*"([^"]*)"', chunk)
        drain = re.search(r'"drain":\s*(-?\d+)', chunk)
        max_rank = re.search(r'"maxRank":\s*(\d+)', chunk)
        mods[mod_id] = {
            "name": name.group(1) if name else mod_id,
            "drain": int(drain.group(1)) if drain else None,
            "maxRank": int(max_rank.group(1)) if max_rank else None,
        }
    return mods


def norm_id(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "_", name.lower()).strip("_")


def main() -> None:
    local = parse_local_mods()
    print(f"Local aura mods: {len(local)}")
    try:
        wiki = fetch_mod_data()
    except Exception as exc:
        print(f"Wiki fetch failed: {exc}")
        wiki = {}

    missing_wiki = []
    mismatches = []
    ok = []

    for mod_id, mod in sorted(local.items(), key=lambda x: x[1]["name"]):
        wiki_key = norm_id(mod["name"])
        wiki_entry = wiki.get(wiki_key)
        if not wiki_entry:
            for k, v in wiki.items():
                if v["name"].lower() == mod["name"].lower():
                    wiki_entry = v
                    break
        if not wiki_entry:
            missing_wiki.append(mod_id)
            continue
        if wiki_entry["drain"] != mod["drain"]:
            mismatches.append((mod_id, mod["name"], mod["drain"], wiki_entry["drain"]))
        else:
            ok.append(mod_id)

    print(f"OK drain: {len(ok)}")
    if missing_wiki:
        print(f"Missing wiki match ({len(missing_wiki)}): {missing_wiki}")
    if mismatches:
        print(f"Drain mismatches ({len(mismatches)}):")
        for mid, name, local_d, wiki_d in mismatches:
            print(f"  {mid} ({name}): local={local_d} wiki={wiki_d}")
    else:
        print("All matched auras have correct base drain.")


if __name__ == "__main__":
    main()
