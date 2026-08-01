#!/usr/bin/env python3
"""Compare wiki mod category pages against src/data/mods.ts."""
import json
import re
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MODS_TS = ROOT / "src/data/mods.ts"
WIKI = "https://wiki.warframe.com/api.php"
UA = {"User-Agent": "Voidforge/1.0 (https://void-forge.org)"}

CATEGORIES = {
    "K-Drive_Mods": "kdrive",
    "Archgun_Mods": "archgun",
    "Necramech_Mods": "necramech",
    "Archwing_Mods": "archwing",
}


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
        req = urllib.request.Request(WIKI + "?" + urllib.parse.urlencode(params), headers=UA)
        with urllib.request.urlopen(req) as resp:
            data = json.load(resp)
        for m in data["query"]["categorymembers"]:
            title = m["title"]
            if not title.startswith("Category:"):
                members.append(title)
        cmcontinue = data.get("continue", {}).get("cmcontinue")
        if not cmcontinue:
            break
    return members


def norm(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "_", s.lower()).strip("_")


def load_local_mods() -> tuple[set[str], dict[str, str], dict[str, dict]]:
    text = MODS_TS.read_text(encoding="utf-8")
    names = set(re.findall(r'"name":\s*"([^"]+)"', text))
    # Parse mod blocks crudely
    blocks = re.findall(r"\{[^{}]*\"id\":\s*\"([^\"]+)\"[^{}]*\}", text, re.DOTALL)
    by_name: dict[str, str] = {}
    by_id: dict[str, dict] = {}
    for block in re.finditer(
        r"\{\s*\"id\":\s*\"([^\"]+)\".*?(?=\n  \},|\n  \{|\n\])",
        text,
        re.DOTALL,
    ):
        chunk = block.group(0)
        mid = re.search(r'"id":\s*"([^"]+)"', chunk)
        mname = re.search(r'"name":\s*"([^"]+)"', chunk)
        mcat = re.search(r'"category":\s*"([^"]+)"', chunk)
        if not mid or not mname:
            continue
        mod_id = mid.group(1)
        name = mname.group(1)
        by_name[name] = mod_id
        by_id[mod_id] = {
            "name": name,
            "category": mcat.group(1) if mcat else "",
        }
    return names, by_name, by_id


def find_local(title: str, names: set[str], by_name: dict[str, str], by_id: dict[str, dict]) -> str | None:
    variants = [title, title.replace(" Mod", ""), title + " Mod"]
    for v in variants:
        if v in names:
            return v
    for mod in by_id.values():
        if norm(mod["name"]) == norm(title) or norm(mod["name"]) == norm(title.replace(" Mod", "")):
            return mod["name"]
    return None


def main() -> None:
    names, by_name, by_id = load_local_mods()
    print(f"Local mods parsed: {len(by_id)}")

    for cat, label in CATEGORIES.items():
        wiki = category_members(cat)
        print(f"\n=== {label} ({cat}): {len(wiki)} wiki pages ===")
        missing: list[str] = []
        wrong_cat: list[tuple[str, str, str]] = []
        for title in sorted(wiki):
            hit = find_local(title, names, by_name, by_id)
            if not hit:
                missing.append(title)
                continue
            mod_id = by_name.get(hit)
            if not mod_id:
                for i, m in by_id.items():
                    if m["name"] == hit:
                        mod_id = i
                        break
            if mod_id:
                actual = by_id[mod_id]["category"]
                if label == "kdrive" and actual != "kdrive":
                    wrong_cat.append((hit, actual, "kdrive"))
                elif label != "kdrive" and actual != label:
                    wrong_cat.append((hit, actual, label))

        print(f"  Found locally: {len(wiki) - len(missing)}")
        print(f"  Missing: {len(missing)}")
        for m in missing:
            print(f"    MISSING: {m}")
        if wrong_cat:
            print(f"  Wrong category: {len(wrong_cat)}")
            for name, actual, expected in wrong_cat:
                print(f"    {name}: category={actual!r} expected={expected!r}")

    # Local counts by category
    print("\n=== Local category counts ===")
    counts: dict[str, int] = {}
    for mod in by_id.values():
        counts[mod["category"]] = counts.get(mod["category"], 0) + 1
    for k in sorted(counts, key=lambda x: (-counts[x], x)):
        if k in ("archgun", "necramech", "archwing", "kdrive", "general", "melee"):
            print(f"  {k}: {counts[k]}")


if __name__ == "__main__":
    main()
