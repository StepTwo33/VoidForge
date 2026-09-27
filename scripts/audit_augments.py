#!/usr/bin/env python3
"""Audit warframe augments and mod drain vs wiki."""
import json
import re
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MODS_TS = ROOT / "src/data/mods.ts"
WARFRAMES_TS = ROOT / "src/data/warframes.ts"
WIKI = "https://wiki.warframe.com/api.php"
UA = {"User-Agent": "Voidforge/1.0 (https://void-forge.org)"}


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
            if m.get("ns") == 0 and not m["title"].startswith("Category:"):
                members.append(m["title"])
        cmcontinue = data.get("continue", {}).get("cmcontinue")
        if not cmcontinue:
            break
    return members


def norm(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "_", s.lower()).strip("_")


def parse_mods(text: str) -> dict[str, dict]:
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

        def field(key: str, default=""):
            m = re.search(rf'"{key}":\s*"([^"]*)"', chunk)
            return m.group(1) if m else default

        def num(key: str, default=0):
            m = re.search(rf'"{key}":\s*(-?\d+)', chunk)
            return int(m.group(1)) if m else default

        mods[mod_id] = {
            "id": mod_id,
            "name": field("name"),
            "drain": num("drain"),
            "maxRank": num("maxRank"),
            "category": field("category"),
            "polarity": field("polarity"),
            "warframeId": field("warframeId") or None,
            "description": field("description"),
        }
    return mods


def load_warframe_ids() -> set[str]:
    text = WARFRAMES_TS.read_text(encoding="utf-8")
    return set(re.findall(r'"id":\s*"([^"]+)"', text))


def fetch_wiki_drain(title: str) -> int | None:
    params = {
        "action": "query",
        "titles": title,
        "prop": "revisions",
        "rvprop": "content",
        "rvslots": "main",
        "format": "json",
    }
    data = wiki_api(params)
    pages = data["query"]["pages"]
    page = next(iter(pages.values()))
    if "missing" in page:
        return None
    content = page["revisions"][0]["slots"]["main"]["*"]
    m = re.search(r"\|mod_drain\s*=\s*(\d+)", content, re.I)
    if m:
        return int(m.group(1))
    m = re.search(r"\|drain\s*=\s*(\d+)", content, re.I)
    return int(m.group(1)) if m else None


def main() -> None:
    text = MODS_TS.read_text(encoding="utf-8")
    mods = parse_mods(text)
    by_name = {norm(m["name"]): m for m in mods.values()}
    wf_ids = load_warframe_ids()

    wiki_aug = category_members("Augment_Mods")
    print(f"Wiki augments: {len(wiki_aug)}")
    print(f"Local augment category: {sum(1 for m in mods.values() if m['category'] == 'augment')}")

    missing = []
    wrong_cat = []
    for title in sorted(wiki_aug):
        loc = by_name.get(norm(title))
        if not loc:
            missing.append(title)
        elif loc["category"] != "augment":
            wrong_cat.append(loc)

    print(f"\nMissing: {len(missing)}")
    for t in missing:
        print(f"  {t}")

    print(f"\nWrong category (should be augment): {len(wrong_cat)}")
    for m in wrong_cat[:30]:
        print(f"  {m['name']} ({m['id']}) -> {m['category']}")
    if len(wrong_cat) > 30:
        print(f"  ... and {len(wrong_cat) - 30} more")

    # Sample drain check for augments with drain 6 maxRank 3
    print("\nAugments with drain=6 maxRank=3 (installed max cost 9):")
    for m in sorted(mods.values(), key=lambda x: x["name"]):
        if m["category"] == "augment" and m["drain"] == 6 and m["maxRank"] == 3:
            print(f"  {m['name']}")


if __name__ == "__main__":
    main()
