#!/usr/bin/env python3
"""Compare Voidforge weapon passives against wiki.warframe.com/w/Weapons/Passives."""
from __future__ import annotations

import json
import re
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PASSIVES_PATH = ROOT / "src/data/weapon-passives.ts"
WEAPONS_PATH = ROOT / "src/data/weapons.ts"
UA = {"User-Agent": "Voidforge/1.0 (weapon passive audit)"}

# Wiki display name -> framehub id (manual fixes for punctuation / primes)
NAME_OVERRIDES: dict[str, str] = {
    "Ack & Brunt": "ack_&_brunt",
    "Argo & Vel": "argo_&_vel",
    "Sigma & Octantis": "sigma_&_octantis",
    "Silva & Aegis": "silva_&_aegis",
    "Silva & Aegis Prime": "silva_&_aegis_prime",
    "Tak & Lug": "tak_&_lug",
    "Tak & Lug Prime": "tak_&_lug_prime",
    "Balefire Charger": "balefire",
    "Balefire Charger Prime": "balefire_prime",
}


def wiki_name_to_id(name: str) -> str:
    if name in NAME_OVERRIDES:
        return NAME_OVERRIDES[name]
    return (
        name.lower()
        .replace(" & ", "_&_")
        .replace(" ", "_")
        .replace("'", "")
        .replace("-", "_")
    )


def load_our_passive_keys() -> set[str]:
    text = PASSIVES_PATH.read_text(encoding="utf-8")
    keys: set[str] = set()
    keys.update(re.findall(r"^\s+([a-z0-9_&]+):\s", text, re.M))
    keys.update(re.findall(r'^\s+"([^"]+)":\s', text, re.M))
    return keys


def load_weapon_catalog() -> dict[str, str]:
    text = WEAPONS_PATH.read_text(encoding="utf-8")
    ids = re.findall(r'"id": "([^"]+)"', text)
    names = re.findall(r'"name": "([^"]+)"', text)
    # Pair by order within each weapon object — safer: regex per block
    catalog: dict[str, str] = {}
    for block in re.finditer(
        r'\{\s*"id": "([^"]+)"[\s\S]*?"name": "([^"]+)"', text
    ):
        catalog[block.group(1)] = block.group(2)
    return catalog


def fetch_wiki_wikitext() -> str:
    url = "https://wiki.warframe.com/api.php?" + urllib.parse.urlencode(
        {
            "action": "parse",
            "page": "Weapons/Passives",
            "prop": "wikitext",
            "format": "json",
        }
    )
    with urllib.request.urlopen(
        urllib.request.Request(url, headers=UA), timeout=90
    ) as resp:
        data = json.load(resp)
    return data["parse"]["wikitext"]["*"]


def parse_wiki_weapon_names(wikitext: str) -> list[tuple[str, str]]:
    """Extract (section, weapon_name) from wiki wikitext tables."""
    entries: list[tuple[str, str]] = []
    section = "unknown"
    for line in wikitext.splitlines():
        if line.startswith("==="):
            section = line.strip("= ").lower()
            continue
        # {{Weapon|Name}} or | {{Weapon|Name}} table rows
        for m in re.finditer(r"\{\{Weapon\|([^}|]+)", line):
            name = m.group(1).strip()
            if name and name not in ("Weapon", "Weapons"):
                entries.append((section, name))
        # Some rows use | [[Weapon Name]] or | [[Weapon Name|...]]
        if "|" in line and "{{Weapon|" not in line:
            for m in re.finditer(r"\[\[([^\]|]+)(?:\|[^\]]+)?\]\]", line):
                candidate = m.group(1).strip()
                if candidate.endswith("(Weapon)"):
                    candidate = candidate[: -len("(Weapon)")].strip()
                if any(
                    skip in candidate.lower()
                    for skip in (
                        "category:",
                        "file:",
                        "template:",
                        "warframe",
                        "mod:",
                        "arcane",
                        "research",
                    )
                ):
                    continue
                if re.match(r"^[A-Z0-9][\w '&-]+$", candidate) and len(candidate) > 2:
                    entries.append((section, candidate))
    return entries


def main() -> None:
    our_keys = load_our_passive_keys()
    catalog = load_weapon_catalog()
    name_to_id = {v.lower(): k for k, v in catalog.items()}
    wikitext = fetch_wiki_wikitext()
    (ROOT / "scripts/_wiki_weapon_passives.wikitext").write_text(
        wikitext, encoding="utf-8"
    )

    wiki_entries = parse_wiki_weapon_names(wikitext)
    seen: set[str] = set()
    wiki_weapons: list[tuple[str, str, str]] = []
    for section, name in wiki_entries:
        wid = wiki_name_to_id(name)
        if wid in seen:
            continue
        # Prefer exact catalog match by name
        if name.lower() in name_to_id:
            wid = name_to_id[name.lower()]
        elif wid not in catalog:
            # try without Prime suffix variants
            alt = wiki_name_to_id(name.replace(" Prime", ""))
            if alt in catalog and name.endswith("Prime"):
                wid = alt + "_prime" if not alt.endswith("_prime") else alt
        seen.add(wid)
        wiki_weapons.append((section, name, wid))

    missing_passive: list[tuple[str, str, str]] = []
    missing_weapon: list[tuple[str, str, str]] = []
    has_passive: list[str] = []

    for section, name, wid in wiki_weapons:
        if wid not in catalog:
            missing_weapon.append((section, name, wid))
            continue
        if wid in our_keys or catalog.get(wid) and wid in our_keys:
            has_passive.append(wid)
        elif wid in our_keys:
            has_passive.append(wid)
        else:
            # check inline passive on weapon record
            if re.search(rf'"id": "{re.escape(wid)}"[\s\S]*?"passive": "', WEAPONS_PATH.read_text()):
                has_passive.append(wid)
            else:
                missing_passive.append((section, name, wid))

    extra_passives = sorted(k for k in our_keys if k not in catalog)

    print("=== Weapon passive audit ===")
    print(f"Our passive entries: {len(our_keys)}")
    print(f"Weapons in catalog: {len(catalog)}")
    print(f"Wiki weapon rows parsed: {len(wiki_weapons)}")
    print(f"Covered (wiki weapon in catalog + passive): {len(has_passive)}")
    print(f"Missing passive ({len(missing_passive)}):")
    for section, name, wid in sorted(missing_passive, key=lambda x: x[2]):
        print(f"  [{section}] {name} -> {wid}")
    print(f"Wiki names not in catalog ({len(missing_weapon)}):")
    for section, name, wid in sorted(missing_weapon, key=lambda x: x[1])[:40]:
        print(f"  [{section}] {name} -> {wid}")
    if len(missing_weapon) > 40:
        print(f"  ... and {len(missing_weapon) - 40} more")
    print(f"Passive keys with no weapon id ({len(extra_passives)}):")
    for k in extra_passives[:30]:
        print(f"  {k}")
    if len(extra_passives) > 30:
        print(f"  ... and {len(extra_passives) - 30} more")


if __name__ == "__main__":
    main()
