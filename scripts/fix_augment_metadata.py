#!/usr/bin/env python3
"""Set warframeId, drain, maxRank, polarity on augments from wiki ModBox tables (Cost column)."""
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
WARFRAMES_TS = ROOT / "src/data/warframes.ts"
WIKI = "https://wiki.warframe.com/api.php"
UA = {"User-Agent": "Voidforge/1.0 (https://void-forge.org)"}

WEAPON_AUGMENT_PREFIXES = ("amalgam ", "syndicate ")


def wiki_api(params: dict) -> dict:
    req = urllib.request.Request(WIKI + "?" + urllib.parse.urlencode(params), headers=UA)
    with urllib.request.urlopen(req) as resp:
        return json.load(resp)


def load_mods() -> list[dict]:
    text = MODS_TS.read_text(encoding="utf-8")
    match = re.search(r"export const allMods: Mod\[\] = (\[[\s\S]*?\n\]);", text)
    return json.loads(match.group(1))


def load_warframe_ids() -> set[str]:
    text = WARFRAMES_TS.read_text(encoding="utf-8")
    return set(re.findall(r'"id":\s*"([^"]+)"', text))


def infer_warframe_from_id(mod_id: str, wf_ids: set[str]) -> str | None:
    if not mod_id.startswith("augment_"):
        return None
    rest = mod_id[len("augment_") :]
    parts = rest.split("_")
    for length in range(1, len(parts)):
        prefix = "_".join(parts[:length])
        if prefix in wf_ids:
            return prefix
    return None


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


def is_weapon_augment(mod: dict) -> bool:
    name = mod["name"].lower()
    if mod.get("subCategory") == "weapon":
        return True
    if mod["id"].startswith("stance_"):
        return True
    if name.startswith(WEAPON_AUGMENT_PREFIXES):
        return True
    if mod["id"].startswith("amalgam_"):
        return True
    return False


def write_mods(mods: list[dict]) -> None:
    text = MODS_TS.read_text(encoding="utf-8")
    prefix = 'import { Mod } from "@/lib/types";\n\nexport const allMods: Mod[] = '
    suffix_match = re.search(r";\s*\nexport const modsMap", text)
    suffix = text[suffix_match.start() :]
    MODS_TS.write_text(prefix + json.dumps(mods, indent=2) + suffix, encoding="utf-8")


def main() -> None:
    wf_ids = load_warframe_ids()
    mods = load_mods()
    augments = [m for m in mods if m.get("category") == "augment"]
    wiki = fetch_batch([m["name"] for m in augments])

    drain_fixed = wf_fixed = maxrank_fixed = no_wiki = 0
    changes: list[str] = []

    for mod in augments:
        info = wiki.get(mod["name"], {})
        if not info.get("drain"):
            no_wiki += 1
        elif mod.get("drain") != info["drain"]:
            changes.append(f"  {mod['name']}: {mod.get('drain')} -> {info['drain']}")
            mod["drain"] = info["drain"]
            drain_fixed += 1

        if info.get("maxRank") is not None and mod.get("maxRank") != info["maxRank"]:
            mod["maxRank"] = info["maxRank"]
            maxrank_fixed += 1

        if info.get("polarity") == "exilus":
            mod["polarity"] = "exilus"

        if is_weapon_augment(mod) or info.get("kind") == "weapon":
            mod["subCategory"] = "weapon"
            mod.pop("warframeId", None)
            continue

        wf = info.get("warframeId") or infer_warframe_from_id(mod["id"], wf_ids)
        if wf:
            wf = wf.replace("_prime", "")
            if wf in wf_ids and mod.get("warframeId") != wf:
                mod["warframeId"] = wf
                wf_fixed += 1

    write_mods(mods)
    print(f"Drain fixed from wiki Cost column: {drain_fixed}")
    print(f"maxRank fixed: {maxrank_fixed}")
    print(f"warframeId fixed: {wf_fixed}")
    print(f"No wiki Cost table: {no_wiki}")
    if changes:
        print("\nSample changes:")
        for line in changes[:25]:
            print(line)
        if len(changes) > 25:
            print(f"  ... and {len(changes) - 25} more")


if __name__ == "__main__":
    main()
