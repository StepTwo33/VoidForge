#!/usr/bin/env python3
"""
Generate src/data/enemies.ts from wiki Module:Enemies/data/*.lua dumps.

Source: https://wiki.warframe.com/w/Module:Enemies/data
Dumps live in scripts/wiki-enemies/ (refresh via wiki ?action=raw when unblocked).

Skips wildlife (Prey/Predator) and entries with Health <= 0 / missing Health.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DUMP_DIR = Path(__file__).resolve().parent / "wiki-enemies"
OUT = ROOT / "src" / "data" / "enemies.ts"

# Factions we treat as non-combat wildlife / decoration
SKIP_FACTIONS = {
    "prey",
    "predator",
    "tenno",  # friendly / quest doubles
}

# Name patterns that are never useful TTK targets
SKIP_NAME_RE = re.compile(
    r"\b(sawgaw|kondroc|condroc|pobber|virmink|kubrodon|merulina|"
    r"kuaka|coastal|common|rare|uncommon|desert|forest)\b.*\b(sawgaw|condroc|pobber|virmink)\b|"
    r"^(Alpine|Coastal|Common|Rare|Uncommon|Emperor|White-|Red-|Spotted)",
    re.I,
)

FACTION_DISPLAY = {
    "grineer": "Grineer",
    "kuva grineer": "Grineer",
    "corpus": "Corpus",
    "corpus amalgam": "Corpus",
    "infestation": "Infested",
    "infested": "Infested",
    "infested deimos": "Infested",
    "orokin": "Corrupted",
    "corrupted": "Corrupted",
    "sentient": "Sentient",
    "stalker": "Stalker",
    "narmer": "Narmer",
    "the murmur": "Murmur",
    "murmur": "Murmur",
    "scaldra": "Scaldra",
    "techrot": "Techrot",
    "unknown": "Zariman",
    "duviri": "Duviri",
    "anarch": "Anarch",
    "anarchs": "Anarch",
    "objects": "Special",
    "neutral": "Special",
    "crossfire": "Special",
    "wild": "Special",
}


def slug(name: str) -> str:
    s = name.lower().strip()
    s = re.sub(r"\(.*?\)", "", s)
    s = re.sub(r"[^a-z0-9]+", "_", s).strip("_")
    return s or "enemy"


def normalize_faction(raw: str | None, name: str, faction_override: str | None) -> str:
    if faction_override:
        fo = faction_override.strip().strip('"').strip("'")
        # FactionDamageOverride sometimes is an InternalName path — ignore those
        if "/" not in fo and fo:
            key = fo.lower()
            if key in ("zariman",):
                return "Zariman"
            if key in FACTION_DISPLAY:
                return FACTION_DISPLAY[key]
            return fo.title() if fo.islower() else fo

    f = (raw or "").strip().strip('"').strip("'")
    fl = f.lower()
    if fl in SKIP_FACTIONS:
        return ""
    if fl in FACTION_DISPLAY:
        return FACTION_DISPLAY[fl]
    if "murmur" in fl:
        return "Murmur"
    if not f:
        # Infer from name
        nl = name.lower()
        if "thrax" in nl or "void angel" in nl:
            return "Zariman"
        if "hollow thrax" in nl:
            return "Duviri"
        if "arbitration" in nl:
            return "Arbitration"
        return "Special"
    return f


def health_types(faction: str, name: str, armor: int, shield: int) -> tuple[str, str, str]:
    """Pre-U36 class approximation used by TTK elemental tables."""
    fl = faction.lower()
    nl = name.lower()

    if fl in ("infested",) or "infested" in nl or "techrot" in fl:
        ht = "fossilized" if any(x in nl for x in ("ancient", "obsolyte", "lephantis", "saxum")) else "infested"
        at = "ferrite" if armor > 0 else "none"
        st = "shield" if shield > 0 else "none"
        if "techrot" in fl and shield > 0:
            st = "shield"
        return ht, at, st

    if fl in ("corpus",) or "moa" in nl or "osprey" in nl or "bursa" in nl:
        ht = "robotic" if any(x in nl for x in ("moa", "osprey", "bursa", "jackal", "hyena", "raptor", "ambulas", "orb", "drone")) else "flesh"
        at = "none" if armor <= 0 else ("alloy" if armor >= 200 else "ferrite")
        st = "proto_shield" if any(x in nl for x in ("nullifier", "bursa", "jackal", "profit", "exploiter", "proto")) else ("shield" if shield > 0 else "none")
        return ht, at, st

    if fl in ("grineer", "scaldra", "narmer", "stalker"):
        ht = "cloned_flesh"
        if any(x in nl for x in ("tank", "bolkor", "thumper", "crewship", "ogma", "firbolg", "harbinger", "ti-92", "ti_92")):
            ht = "robotic"
        at = "none" if armor <= 0 else ("alloy" if (armor >= 200 or any(x in nl for x in ("bombard", "napalm", "elite", "bailiff", "nox", "dedicant"))) else "ferrite")
        st = "shield" if shield > 0 else "none"
        return ht, at, st

    if fl in ("corrupted", "orokin"):
        if any(x in nl for x in ("crewman", "nullifier", "moa", "drone", "jackal")):
            ht = "robotic" if any(x in nl for x in ("moa", "drone", "jackal", "orb")) else "flesh"
            st = "proto_shield" if "nullifier" in nl or "jackal" in nl else ("shield" if shield > 0 else "none")
            at = "none" if armor <= 0 else "ferrite"
            return ht, at, st
        ht = "fossilized" if "ancient" in nl else "cloned_flesh"
        at = "none" if armor <= 0 else ("alloy" if armor >= 200 else "ferrite")
        return ht, at, ("shield" if shield > 0 else "none")

    if fl in ("sentient",):
        return "robotic", ("none" if armor <= 0 else "none"), ("shield" if shield > 0 else "none")

    if fl in ("murmur",):
        if any(x in nl for x in ("voidrig", "bonewidow", "culverin", "arcocanid", "necramech")):
            return "robotic", ("alloy" if armor > 0 else "none"), "none"
        return "flesh", ("ferrite" if armor > 0 else "none"), ("shield" if shield > 0 else "none")

    if fl in ("zariman", "duviri"):
        return "flesh", ("alloy" if armor >= 300 else "ferrite" if armor > 0 else "none"), ("shield" if shield > 0 else "none")

    if fl in ("techrot",):
        ht = "fossilized" if "obsolyte" in nl else "infested"
        return ht, ("alloy" if armor >= 500 else "ferrite" if armor > 0 else "none"), ("shield" if shield > 0 else "none")

    # Special / Arbitration / Unknown
    return "flesh", ("ferrite" if armor > 0 else "none"), ("shield" if shield > 0 else "none")


def classify_kind(name: str, wiki_type: str, health: int, armor: int, shield: int) -> str:
    t = (wiki_type or "").lower()
    n = name.lower()
    if "eximus" in n or "eximus" in t:
        return "eximus"
    if any(x in t for x in ("boss", "assassin", "grand boss", "secret boss", "field boss")):
        return "boss"
    if any(
        x in n
        for x in (
            "archon",
            "eidolon teralyst",
            "eidolon gantulyst",
            "eidolon hydrolyst",
            "stalker",
            "acolyte",
            "angst",
            "malice",
            "mania",
            "misery",
            "torment",
            "violence",
            "lich",
            "sister of parvos",
            "technocyte coda",
            "void angel",
            "fragmented",
            "whisper",
            "auditor",
            "executioner",
            "captain vor",
            "lech kril",
            "sargas ruk",
            "vay hek",
            "kela",
            "tyl regor",
            "phorid",
            "lephantis",
            "ambulas",
            "jackal",
            "raptor",
            "profit-taker",
            "exploiter",
            "ropalolyst",
        )
    ):
        # named bosses / field bosses; avoid classifying every \"Jackal\" variant as boss if Type says otherwise
        if any(x in t for x in ("boss", "assassin", "field boss", "grand boss", "secret boss")) or health >= 2000:
            return "boss"
    if any(x in t for x in ("heavy", "demolisher", "deployer")):
        return "heavy"
    if any(
        x in n
        for x in (
            "heavy",
            "bombard",
            "napalm",
            "gunner",
            "bailiff",
            "nox",
            "juggernaut",
            "ancient",
            "bursa",
            "demolisher",
            "thumper",
            "dedicant",
            "eradicator",
            "obsolyte",
            "babau",
        )
    ):
        return "heavy"
    if health >= 800 or armor >= 400:
        return "heavy"
    return "unit"


ENTRY_START_RE = re.compile(
    r'(?:^|\n)\s*(?:\["([^"]+)"\]|([A-Za-z][A-Za-z0-9_\-\' ]*))\s*=\s*\{',
    re.M,
)


def extract_entries(text: str) -> list[dict]:
    """Pull Name/Faction/Type/Health/Armor/Shield from loosely structured Lua."""
    entries: list[dict] = []
    # Find Stats blocks with preceding General context
    for m in re.finditer(r"Stats\s*=\s*\{", text):
        stats_start = m.end()
        # Walk braces to find stats end (simple depth)
        depth = 1
        i = stats_start
        while i < len(text) and depth > 0:
            c = text[i]
            if c == "{":
                depth += 1
            elif c == "}":
                depth -= 1
            i += 1
        stats_body = text[stats_start : i - 1]

        # Look backward for General block / Name
        lookback = text[max(0, m.start() - 3500) : m.start()]
        name_m = re.search(r'Name\s*=\s*"([^"]+)"', lookback)
        # Prefer the last Name before Stats
        names = re.findall(r'Name\s*=\s*"([^"]+)"', lookback)
        name = names[-1] if names else None
        if not name:
            # fallback to table key
            key_m = list(ENTRY_START_RE.finditer(lookback))
            if key_m:
                name = key_m[-1].group(1) or key_m[-1].group(2)
            else:
                continue
        name = name.strip()

        faction_m = re.findall(r'Faction\s*=\s*"([^"]*)"', lookback)
        faction = faction_m[-1] if faction_m else ""
        override_m = re.findall(r'FactionDamageOverride\s*=\s*"([^"]*)"', lookback)
        faction_override = override_m[-1] if override_m else None
        type_m = re.findall(r'Type\s*=\s*"([^"]*)"', lookback)
        wiki_type = type_m[-1] if type_m else ""

        def num(key: str) -> int | None:
            sm = re.search(rf"\b{key}\s*=\s*(-?\d+(?:\.\d+)?)", stats_body)
            if not sm:
                return None
            return int(float(sm.group(1)))

        health = num("Health")
        if health is None or health <= 0:
            continue
        armor = num("Armor") or 0
        shield = num("Shield") or 0
        if armor < 0:
            armor = 0
        if shield < 0:
            shield = 0

        entries.append(
            {
                "name": name,
                "faction_raw": faction,
                "faction_override": faction_override,
                "wiki_type": wiki_type,
                "health": health,
                "armor": armor,
                "shield": shield,
            }
        )
    return entries


def paper_suffix(name: str, wiki_type: str, health: int) -> str:
    t = (wiki_type or "").lower()
    if any(x in t for x in ("boss", "grand boss", "secret boss", "field boss", "assassin")) and health >= 3000:
        if "(paper)" not in name.lower():
            return f"{name} (paper)"
    return name


def build_catalog() -> list[dict]:
    lua_files = sorted(DUMP_DIR.glob("*.lua"))
    if not lua_files:
        raise SystemExit(f"No .lua dumps in {DUMP_DIR}")

    raw_entries: list[dict] = []
    for path in lua_files:
        text = path.read_text(encoding="utf-8", errors="ignore")
        if not text.lstrip().startswith("return"):
            print(f"skip non-lua: {path.name}")
            continue
        got = extract_entries(text)
        print(f"{path.name}: {len(got)} entries with Health>0")
        raw_entries.extend(got)

    # Optional extras JSON (for modules that couldn't be dumped locally)
    extra = DUMP_DIR / "extra.json"
    if extra.exists():
        extra_list = json.loads(extra.read_text(encoding="utf-8"))
        print(f"extra.json: {len(extra_list)} entries")
        raw_entries.extend(extra_list)

    by_id: dict[str, dict] = {}
    skipped = 0
    for e in raw_entries:
        name = e["name"]
        if SKIP_NAME_RE.search(name) and e.get("faction_raw", "").lower() in ("prey", "predator", ""):
            skipped += 1
            continue
        faction = normalize_faction(e.get("faction_raw"), name, e.get("faction_override"))
        if not faction:
            skipped += 1
            continue
        if faction.lower() in ("prey", "predator"):
            skipped += 1
            continue

        health = int(e["health"])
        armor = int(e.get("armor") or 0)
        shield = int(e.get("shield") or 0)
        wiki_type = e.get("wiki_type") or ""
        display = paper_suffix(name, wiki_type, health)
        eid = slug(name)
        # Disambiguate collisions by faction
        if eid in by_id and by_id[eid]["name"] != display:
            eid = slug(f"{faction}_{name}")
        # Prefer higher health if duplicate id same name
        if eid in by_id:
            if health <= by_id[eid]["baseHealth"]:
                continue

        ht, at, st = health_types(faction, name, armor, shield)
        kind = classify_kind(name, wiki_type, health, armor, shield)
        by_id[eid] = {
            "id": eid,
            "name": display,
            "faction": faction,
            "baseHealth": health,
            "baseArmor": armor,
            "baseShield": shield,
            "healthType": ht,
            "armorType": at,
            "shieldType": st,
            "kind": kind,
        }

    # Stable sort: faction then name
    items = sorted(by_id.values(), key=lambda x: (x["faction"].lower(), x["name"].lower()))
    print(f"catalog: {len(items)} unique (skipped {skipped})")
    return items


FACTION_ORDER = [
    "Grineer",
    "Corpus",
    "Infested",
    "Corrupted",
    "Sentient",
    "Narmer",
    "Murmur",
    "Scaldra",
    "Techrot",
    "Zariman",
    "Duviri",
    "Stalker",
    "Anarch",
    "Arbitration",
    "Special",
]


def emit_ts(items: list[dict]) -> str:
    # Re-sort with preferred faction order
    def fkey(it: dict) -> tuple:
        f = it["faction"]
        try:
            fi = FACTION_ORDER.index(f)
        except ValueError:
            fi = 999
        return (fi, it["name"].lower())

    items = sorted(items, key=fkey)
    lines = [
        "/**",
        " * Enemy catalog for TTK / Damage Simulator.",
        " * Auto-generated from wiki Module:Enemies/data (scripts/generate_enemies_catalog.py).",
        " * Base Health/Armor/Shield are wiki BaseLevel stats.",
        " * Health/armor/shield *types* are pre-U36 class approximations for elemental matchups.",
        " * Boss / eidolon / eximus entries are paper targets — phases & gates not modeled.",
        " *",
        " * Do not hand-edit bulk rows; re-run the generator after refreshing scripts/wiki-enemies/.",
        " */",
        "",
        'export type EnemyKind = "unit" | "heavy" | "eximus" | "boss";',
        "",
        "export interface EnemyType {",
        "  id: string;",
        "  name: string;",
        "  faction: string;",
        "  baseHealth: number;",
        "  baseArmor: number;",
        "  baseShield: number;",
        "  healthType: string;",
        "  armorType: string;",
        "  shieldType: string;",
        "  /** UI / filter bucket */",
        "  kind?: EnemyKind;",
        "}",
        "",
        "export const ENEMY_TYPES: EnemyType[] = [",
    ]

    current_faction = None
    for it in items:
        if it["faction"] != current_faction:
            current_faction = it["faction"]
            lines.append(f"  // ── {current_faction} ──")
        lines.append(
            "  {"
            f' id: "{it["id"]}",'
            f' name: {json.dumps(it["name"])},'
            f' faction: "{it["faction"]}",'
            f' baseHealth: {it["baseHealth"]},'
            f' baseArmor: {it["baseArmor"]},'
            f' baseShield: {it["baseShield"]},'
            f' healthType: "{it["healthType"]}",'
            f' armorType: "{it["armorType"]}",'
            f' shieldType: "{it["shieldType"]}",'
            f' kind: "{it["kind"]}"'
            " },"
        )

    lines += [
        "];",
        "",
        "export function getEnemyById(id: string): EnemyType | undefined {",
        "  return ENEMY_TYPES.find((e) => e.id === id);",
        "}",
        "",
    ]
    return "\n".join(lines)


def main() -> None:
    items = build_catalog()
    OUT.write_text(emit_ts(items), encoding="utf-8")
    print(f"wrote {OUT} ({len(items)} enemies)")


if __name__ == "__main__":
    main()
