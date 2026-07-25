#!/usr/bin/env python3
"""Fetch aura mods from wiki Module:Mod/data and compare to FrameHub."""
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
UA = {"User-Agent": "FrameHub/1.0 (https://frame-hub.com)"}


def wiki_api(params: dict) -> dict:
    req = urllib.request.Request(WIKI + "?" + urllib.parse.urlencode(params), headers=UA)
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.load(resp)


def norm_id(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "_", name.lower()).strip("_")


def fetch_wiki_auras() -> dict[str, dict]:
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
        if not drain_m:
            continue
        drain = int(drain_m.group(1))
        if drain >= 0:
            continue
        rank_m = re.search(r"\['maxRank'\]\s*=\s*(\d+)", body)
        pol_m = re.search(r"\['polarity'\]\s*=\s*'([^']+)'", body)
        mods[norm_id(name)] = {
            "name": name,
            "drain": drain,
            "maxRank": int(rank_m.group(1)) if rank_m else 5,
            "polarity": pol_m.group(1) if pol_m else "",
        }
    return mods


def parse_local_aura_ids() -> dict[str, str]:
    text = AURA_TS.read_text(encoding="utf-8")
    ids = re.findall(r'"([^"]+)"', text.split("AURA_MOD_IDS")[1].split(");")[0])
    id_to_name: dict[str, str] = {}
    mods_text = MODS_TS.read_text(encoding="utf-8")
    for mid in ids:
        m = re.search(
            rf'"id":\s*"{re.escape(mid)}"[\s\S]*?"name":\s*"([^"]*)"',
            mods_text,
        )
        id_to_name[mid] = m.group(1) if m else mid
    return id_to_name


def main() -> None:
    wiki = fetch_wiki_auras()
    local = parse_local_aura_ids()
    print(f"Wiki aura mods (negative drain): {len(wiki)}")
    print(f"Local AURA_MOD_IDS: {len(local)}")

    wiki_by_name = {v["name"].lower(): (k, v) for k, v in wiki.items()}
    local_by_name = {v.lower(): k for k, v in local.items()}

    missing_local = []
    for key, entry in sorted(wiki.items(), key=lambda x: x[1]["name"].lower()):
        name_l = entry["name"].lower()
        if name_l not in local_by_name:
            missing_local.append((key, entry))

    extra_local = []
    for lid, lname in local.items():
        if lname.lower() not in wiki_by_name:
            extra_local.append((lid, lname))

    print(f"\nMissing from local ({len(missing_local)}):")
    for key, entry in missing_local:
        print(f"  {entry['name']} (wiki drain {entry['drain']}, id hint: {key})")

    print(f"\nExtra in local not on wiki ({len(extra_local)}):")
    for lid, lname in extra_local:
        print(f"  {lid}: {lname}")


if __name__ == "__main__":
    main()
