#!/usr/bin/env python3
"""Compare Voidforge arcanes against wiki Category:Arcane Enhancements."""

import json
import re
import urllib.parse
import urllib.request
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
ARCANES_TS = REPO / "src" / "data" / "arcanes.ts"
HEADERS = {"User-Agent": "Voidforge/1.0 (arcane audit)"}


def slugify(name: str) -> str:
    s = name.lower()
    s = re.sub(r"[^a-z0-9]+", "_", s)
    return s.strip("_")


def load_ours() -> dict[str, str]:
    text = ARCANES_TS.read_text(encoding="utf-8")
    ids = re.findall(r'id:\s*"([^"]+)"', text)
    names = re.findall(r'name:\s*"([^"]+)"', text)
    return dict(zip(ids, names))


def fetch_category_members() -> list[str]:
    members: list[str] = []
    cmcontinue = None
    while True:
        params = {
            "action": "query",
            "list": "categorymembers",
            "cmtitle": "Category:Arcane Enhancements",
            "cmlimit": "500",
            "format": "json",
        }
        if cmcontinue:
            params["cmcontinue"] = cmcontinue
        url = "https://wiki.warframe.com/api.php?" + urllib.parse.urlencode(params)
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=120) as r:
            data = json.loads(r.read())
        batch = data.get("query", {}).get("categorymembers", [])
        members.extend(m["title"] for m in batch)
        cmcontinue = data.get("continue", {}).get("cmcontinue")
        if not cmcontinue:
            break
    return members


def main() -> None:
    ours = load_ours()
    print(f"Voidforge arcanes: {len(ours)}")

    wiki_titles = fetch_category_members()
    # Drop category subpages / non-arcane entries
    skip_prefixes = ("Category:", "Template:", "Module:")
    wiki_names = [
        t for t in wiki_titles
        if not any(t.startswith(p) for p in skip_prefixes)
    ]
    print(f"Wiki category members: {len(wiki_names)}")

    wiki_slugs = {slugify(n): n for n in wiki_names}
    our_ids = set(ours.keys())

    missing = sorted(
        (wiki_slugs[s], s)
        for s in wiki_slugs
        if s not in our_ids
    )
    extra = sorted(
        (ours[i], i)
        for i in our_ids
        if i not in wiki_slugs
    )

    print(f"\nLikely missing from Voidforge ({len(missing)}):")
    for name, slug in missing:
        print(f"  - {name}  (expected id: {slug})")

    print(f"\nIn Voidforge but not in wiki category ({len(extra)}):")
    for name, id_ in extra:
        print(f"  + {name}  ({id_})")

    matched = len(our_ids & set(wiki_slugs.keys()))
    print(f"\nMatched by slug: {matched}/{len(wiki_slugs)}")


if __name__ == "__main__":
    main()
