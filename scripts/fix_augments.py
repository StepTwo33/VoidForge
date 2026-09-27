#!/usr/bin/env python3
"""
Fix warframe augment categorization, warframeId, exilus polarity, drains, and duplicates.
Sources wiki Category:Augment_Mods + per-page Mod infobox fields.
"""
from __future__ import annotations

import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MODS_TS = ROOT / "src/data/mods.ts"
WARFRAMES_TS = ROOT / "src/data/warframes.ts"
WIKI = "https://wiki.warframe.com/api.php"
UA = {"User-Agent": "Voidforge/1.0 (https://void-forge.org)"}

SKIP_WIKI_TITLES = {
    "Syndicate",
    "Warframe Augment Mods",
    "Warframe Augment Mods/PvE",
    "Warframe Augment Mods/PvP",
    "Weapon Augment Mods",
}

POLARITY_MAP = {
    "madurai": "madurai",
    "vazarin": "vazarin",
    "naramon": "naramon",
    "zenurik": "zenurik",
    "penjaga": "penjaga",
    "umbra": "umbra",
    "unairu": "unairu",
    "aura": "aura",
    "exilus": "exilus",
    "universal": "universal",
}

EXILUS_AUGMENT_IDS = {
    "anchored_glide",
    "augment_zephyr_anchored_glide",
}


def wiki_api(params: dict) -> dict:
    req = urllib.request.Request(WIKI + "?" + urllib.parse.urlencode(params), headers=UA)
    with urllib.request.urlopen(req) as resp:
        return json.load(resp)


def category_members(cat: str) -> list[str]:
    members: list[str] = []
    cmcontinue = None
    while True:
        params: dict[str, str] = {
            "action": "query",
            "list": "categorymembers",
            "cmtitle": f"Category:{cat}",
            "cmlimit": "500",
            "format": "json",
        }
        if cmcontinue:
            params["cmcontinue"] = cmcontinue
        data = wiki_api(params)
        for m in data["query"]["categorymembers"]:
            if m.get("ns") == 0:
                members.append(m["title"])
        cmcontinue = data.get("continue", {}).get("cmcontinue")
        if not cmcontinue:
            break
    return members


def norm(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "_", s.lower()).strip("_")


def load_mods() -> list[dict]:
    text = MODS_TS.read_text(encoding="utf-8")
    match = re.search(r"export const allMods: Mod\[\] = (\[[\s\S]*?\n\]);", text)
    if not match:
        raise RuntimeError("Could not parse allMods from mods.ts")
    return json.loads(match.group(1))


def load_warframe_ids() -> set[str]:
    text = WARFRAMES_TS.read_text(encoding="utf-8")
    return set(re.findall(r'"id":\s*"([^"]+)"', text))


def infer_warframe_from_id(mod_id: str, wf_ids: set[str]) -> str | None:
    if mod_id.startswith("augment_"):
        rest = mod_id[len("augment_") :]
        parts = rest.split("_")
        for length in range(1, len(parts)):
            prefix = "_".join(parts[:length])
            if prefix in wf_ids:
                return prefix
    return None


def fetch_wiki_mod_info(title: str) -> dict:
    params = {
        "action": "query",
        "titles": title,
        "prop": "revisions",
        "rvprop": "content",
        "rvslots": "main",
        "format": "json",
    }
    data = wiki_api(params)
    page = next(iter(data["query"]["pages"].values()))
    if "missing" in page:
        return {}
    content = page["revisions"][0]["slots"]["main"]["*"]

    def field(name: str) -> str | None:
        m = re.search(rf"\|{name}\s*=\s*(.+)", content, re.I)
        if not m:
            return None
        return m.group(1).strip()

    drain = field("mod_drain") or field("drain")
    max_rank = field("maxRank") or field("max_rank")
    polarity = field("polarity")
    mod_type = field("mod_type") or field("type")
    compatible = field("compatible") or field("warframe")

    wf_id = None
    if compatible:
        link = re.search(r"\[\[([^|\]]+)", compatible)
        if link:
            wf_id = norm(link.group(1)).replace("_prime", "")

    pol = None
    if polarity:
        pol = POLARITY_MAP.get(polarity.lower().strip(), polarity.lower().strip())

    if mod_type and "exilus" in mod_type.lower():
        pol = "exilus"

    return {
        "drain": int(float(drain)) if drain and drain[0].isdigit() else None,
        "maxRank": int(float(max_rank)) if max_rank and max_rank[0].isdigit() else None,
        "polarity": pol,
        "warframeId": wf_id,
    }


def write_mods(mods: list[dict]) -> None:
    raw = MODS_TS.read_bytes()
    text = raw.decode("utf-8")
    prefix = 'import { Mod } from "@/lib/types";\n\nexport const allMods: Mod[] = '
    suffix_match = re.search(r";\s*\nexport const modsMap", text)
    if not suffix_match:
        raise RuntimeError("Could not find modsMap export")
    suffix = text[suffix_match.start() :]
    new_text = prefix + json.dumps(mods, indent=2) + suffix
    MODS_TS.write_bytes(new_text.encode("utf-8"))


def main() -> None:
    wf_ids = load_warframe_ids()
    wiki_augments = [
        t for t in category_members("Augment_Mods") if t not in SKIP_WIKI_TITLES
    ]
    wiki_by_name = {norm(t): t for t in wiki_augments}

    mods = load_mods()
    by_name: dict[str, list[dict]] = {}
    for mod in mods:
        by_name.setdefault(norm(mod["name"]), []).append(mod)

    removed_ids: set[str] = set()
    recategorized = 0
    drain_fixed = 0
    wf_mapped = 0
    exilus_fixed = 0

    # Drop duplicate entries when an augment_* record exists for the same name.
    for name_key, group in by_name.items():
        if len(group) < 2:
            continue
        augment_ids = [m for m in group if m["id"].startswith("augment_")]
        if not augment_ids:
            continue
        keep = augment_ids[0]
        for mod in group:
            if mod["id"] != keep["id"]:
                removed_ids.add(mod["id"])

    kept = [m for m in mods if m["id"] not in removed_ids]

    wiki_cache: dict[str, dict] = {}
    for i, title in enumerate(wiki_augments):
        if i and i % 20 == 0:
            time.sleep(0.3)
        wiki_cache[title] = fetch_wiki_mod_info(title)

    for mod in kept:
        wiki_title = wiki_by_name.get(norm(mod["name"]))
        if not wiki_title:
            continue

        info = wiki_cache.get(wiki_title, {})
        if mod["category"] != "augment":
            mod["category"] = "augment"
            recategorized += 1

        if info.get("drain") is not None and mod.get("drain") != info["drain"]:
            mod["drain"] = info["drain"]
            drain_fixed += 1

        if info.get("maxRank") is not None and mod.get("maxRank") != info["maxRank"]:
            mod["maxRank"] = info["maxRank"]

        if info.get("polarity"):
            mod["polarity"] = info["polarity"]
            if info["polarity"] == "exilus":
                exilus_fixed += 1

        wf = info.get("warframeId") or infer_warframe_from_id(mod["id"], wf_ids)
        if wf and wf in wf_ids and mod.get("warframeId") != wf:
            mod["warframeId"] = wf
            wf_mapped += 1

        if mod["id"] in EXILUS_AUGMENT_IDS or norm(mod["name"]) == norm("Anchored Glide"):
            if mod.get("polarity") != "exilus":
                mod["polarity"] = "exilus"
                exilus_fixed += 1

    # Add missing wiki augments (minimal stub — full stats can be filled later).
    existing_names = {norm(m["name"]) for m in kept}
    added = 0
    for title in wiki_augments:
        if norm(title) in existing_names:
            continue
        info = wiki_cache.get(title, {})
        mod_id = norm(title)
        kept.append(
            {
                "id": mod_id,
                "name": title,
                "polarity": info.get("polarity") or "zenurik",
                "drain": info.get("drain") or 6,
                "maxRank": info.get("maxRank") or 3,
                "category": "augment",
                "subCategory": "",
                "stats": {},
                "description": f"{title} augment.",
                "rarity": "rare",
                **({"warframeId": info["warframeId"]} if info.get("warframeId") in wf_ids else {}),
            }
        )
        added += 1

    write_mods(kept)
    print(f"Removed duplicate mods: {len(removed_ids)}")
    print(f"Recategorized to augment: {recategorized}")
    print(f"Drain values updated from wiki: {drain_fixed}")
    print(f"warframeId mapped: {wf_mapped}")
    print(f"Exilus polarity fixes: {exilus_fixed}")
    print(f"Added missing augments: {added}")
    print(f"Total mods: {len(kept)}")


if __name__ == "__main__":
    main()
