#!/usr/bin/env python3
"""Recategorize K-Drive and Archgun mods in src/data/mods.ts from wiki category lists."""
import json
import re
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MODS_TS = ROOT / "src/data/mods.ts"
WIKI = "https://wiki.warframe.com/api.php"
UA = {"User-Agent": "Voidforge/1.0 (https://void-forge.org)"}


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
            if not m["title"].startswith("Category:"):
                members.append(m["title"])
        cmcontinue = data.get("continue", {}).get("cmcontinue")
        if not cmcontinue:
            break
    return members


def norm(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "_", s.lower()).strip("_")


def load_name_to_id(text: str) -> dict[str, str]:
    name_to_id: dict[str, str] = {}
    for block in re.finditer(
        r'\{\s*"id":\s*"([^"]+)"[\s\S]*?"name":\s*"([^"]+)"',
        text,
    ):
        name_to_id[norm(block.group(2))] = block.group(1)
    return name_to_id


def main() -> None:
    raw = MODS_TS.read_bytes()
    newline = b"\r\n" if b"\r\n" in raw[:8000] else b"\n"
    text = raw.decode("utf-8")

    name_to_id = load_name_to_id(text)
    fixes: list[tuple[str, str]] = []

    for title in category_members("K-Drive_Mods"):
        mod_id = name_to_id.get(norm(title.replace(" Mod", "")))
        if mod_id:
            fixes.append((mod_id, "kdrive"))

    for title in category_members("Archgun_Mods"):
        mod_id = name_to_id.get(norm(title.replace(" Mod", "")))
        if mod_id:
            fixes.append((mod_id, "archgun"))

    updated = 0
    for mod_id, new_cat in fixes:
        pattern = (
            rf'("id": "{re.escape(mod_id)}"[\s\S]*?"category": )"[^"]+"'
        )
        new_text, n = re.subn(pattern, rf'\1"{new_cat}"', text, count=1)
        if n:
            text = new_text
            updated += 1

    if updated:
        MODS_TS.write_bytes(text.encode("utf-8"))
    print(f"Updated {updated} mod categories (newline preserved)")


if __name__ == "__main__":
    main()
