#!/usr/bin/env python3
"""Generate src/data/weapon-radial-attacks.ts from wiki Module:Weapons/data/*."""

from __future__ import annotations

import json
import re
import urllib.parse
import urllib.request
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
OUT = REPO / "src" / "data" / "weapon-radial-attacks.ts"
WEAPONS_TS = REPO / "src" / "data" / "weapons.ts"
SLOTS = ("primary", "secondary", "melee", "archwing", "companion", "modular", "misc")
HEADERS = {"User-Agent": "FrameHub/1.0 (radial attack generator)"}
DAMAGE_KEYS = (
    "impact", "puncture", "slash", "heat", "cold", "toxin", "electricity",
    "radiation", "viral", "corrosive", "blast", "gas", "magnetic", "tau",
)

# Innate explosions not modeled as AoE child attacks in Module:Weapons/data.
MANUAL_RADIAL_ATTACKS: dict[str, list[dict]] = {
    "ignis": [
        {
            "name": "Spherical Blast",
            "heat": 33.0,
            "totalDamage": 33.0,
            "radius": 3.0,
        },
    ],
    "ignis_wraith": [
        {
            "name": "Spherical Blast",
            "heat": 35.0,
            "totalDamage": 35.0,
            "radius": 3.0,
        },
    ],
    "embolist": [
        {
            "name": "Spherical Blast",
            "toxin": 35.0,
            "totalDamage": 35.0,
            "radius": 1.0,
        },
    ],
    # Alt-fire / charged profiles not flagged as AoE in Module:Weapons/data (per-shot contact radius).
    "ballistica": [
        {
            "name": "Charged Shot",
            "impact": 10.0,
            "puncture": 80.0,
            "slash": 10.0,
            "totalDamage": 100.0,
            "radius": 1.0,
        },
    ],
    "ballistica_prime": [
        {
            "name": "Charged Shot",
            "impact": 3.8,
            "puncture": 41.8,
            "slash": 30.4,
            "totalDamage": 76.0,
            "radius": 1.0,
        },
    ],
    "rakta_ballistica": [
        {
            "name": "Charged Shot",
            "impact": 15.0,
            "puncture": 270.0,
            "slash": 15.0,
            "totalDamage": 300.0,
            "radius": 1.0,
        },
    ],
    "fusilai": [
        {
            "name": "Semi-Auto Mode",
            "puncture": 30.8,
            "slash": 46.2,
            "totalDamage": 77.0,
            "radius": 1.0,
        },
    ],
    "hystrix": [
        {
            "name": "Poison Quill",
            "impact": 2.16,
            "puncture": 30.96,
            "slash": 2.88,
            "totalDamage": 36.0,
            "radius": 1.0,
        },
    ],
    "hystrix_prime": [
        {
            "name": "Poison Quill",
            "impact": 2.76,
            "puncture": 39.56,
            "slash": 3.68,
            "totalDamage": 46.0,
            "radius": 1.0,
        },
    ],
    "pandero": [
        {
            "name": "Alt-Fire",
            "impact": 18.0,
            "puncture": 18.0,
            "slash": 36.0,
            "totalDamage": 72.0,
            "radius": 1.0,
        },
    ],
    "pandero_prime": [
        {
            "name": "Alt-Fire",
            "impact": 26.0,
            "puncture": 26.0,
            "slash": 52.0,
            "totalDamage": 104.0,
            "radius": 1.0,
        },
    ],
    "tenet_diplos": [
        {
            "name": "Lock-on Mode",
            "impact": 11.2,
            "puncture": 9.0,
            "slash": 7.8,
            "totalDamage": 28.0,
            "radius": 1.0,
        },
    ],
    # Uncharged explosion only — charged mode remains dual-mode deferred for DPS.
    "staticor": [
        {
            "name": "Uncharged Explosion",
            "radiation": 88.0,
            "totalDamage": 88.0,
            "radius": 2.4,
            "falloffReduction": 0.3,
        },
    ],
    # 1st-mode radial only; wiki Falloff EndRange is projectile distance, not AoE radius.
    "arbucep": [
        {
            "name": "1st Attack Radial Attack",
            "blast": 114.0,
            "totalDamage": 114.0,
            "radius": 6.0,
            "falloffReduction": 1.0,
        },
    ],
    # Primary-fire radial only — lock-on mode remains dual-mode deferred for DPS.
    "sepulcrum": [
        {
            "name": "Radial Attack",
            "heat": 46.0,
            "totalDamage": 46.0,
            "radius": 1.6,
            "falloffReduction": 0.2,
        },
    ],
}

RADIAL_NAME_HINTS = (
    "explosion",
    "radial",
    "blast",
    "grenade",
    "detonation",
    "flak",
    "rocket",
    "napalm",
    "aoe",
    "orb",
    "cluster",
    "cryo",
    "embed",
    "air burst",
    "cube",
    "plasma",
    "spear throw",
    "glass",
    "concentrated",
    "initial blast",
    "buckshot",
    "bomblet",
    "detonate",
    "expiry",
    "turret",
)

# Small blast when wiki omits Range on pure Blast attacks (e.g. Azima turret expiry).
DEFAULT_BLAST_RADIUS = 3.0
# Per-shot alt-fire contact display when wiki has no AoE radius.
ALT_FIRE_CONTACT_RADIUS = 1.0


def is_radial_attack(shot_type: str | None, attack_name: str, dmg: dict | None = None) -> bool:
    an = attack_name.lower()
    # Direct-hit paper lives on the weapon row (Rocket/Slug/Projectile Impact, Blob Embed).
    if "impact" in an and shot_type != "AoE":
        return False
    if "embed" in an and "explosion" not in an and shot_type != "AoE":
        return False
    if shot_type == "AoE":
        return True
    if dmg and len(dmg) == 1 and dmg.get("blast"):
        return True
    if any(h in an for h in RADIAL_NAME_HINTS):
        return True
    return False


def slugify(name: str) -> str:
    s = name.lower()
    s = re.sub(r"[^a-z0-9]+", "_", s)
    return s.strip("_")


def fetch_slot(slot: str) -> str:
    page = f"Module:Weapons/data/{slot}"
    params = {"action": "parse", "page": page, "prop": "wikitext", "format": "json"}
    url = "https://wiki.warframe.com/api.php?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=180) as r:
        data = json.loads(r.read())
    return data["parse"]["wikitext"]["*"]


def extract_braced_block(text: str, start: int) -> str | None:
    """Return substring for balanced `{...}` starting at `start` (must point at `{`)."""
    if start >= len(text) or text[start] != "{":
        return None
    depth = 0
    i = start
    while i < len(text):
        ch = text[i]
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                return text[start : i + 1]
        i += 1
    return None


def weapon_name_from_block(block: str, fallback: str) -> str:
    link = re.search(r'Link\s*=\s*"([^"]+)"', block)
    if link:
        return link.group(1)
    name = re.search(r'Name\s*=\s*"([^"]+)"', block)
    if name:
        return name.group(1)
    return fallback


def parse_lua_table(text: str) -> dict[str, list[dict]]:
    """Extract weapons with AoE / radial attacks from Lua module text."""
    results: dict[str, list[dict]] = {}
    patterns = [
        re.compile(r'^\t\["([^"]+)"\]\s*=\s*\{', re.MULTILINE),
        re.compile(r"^\t([A-Za-z][A-Za-z0-9_]*)\s*=\s*\{", re.MULTILINE),
    ]

    for pattern in patterns:
        for m in pattern.finditer(text):
            fallback_name = m.group(1)
            block = extract_braced_block(text, m.end() - 1)
            if not block:
                continue
            attacks = extract_weapon_radial_attacks(block)
            if not attacks:
                continue
            name = weapon_name_from_block(block, fallback_name)
            wid = slugify(name)
            results[wid] = attacks
    return results


def extract_attacks_section(block: str) -> str:
    attacks_match = re.search(r"Attacks\s*=\s*\{", block)
    if not attacks_match:
        return ""
    braced = extract_braced_block(block, attacks_match.end() - 1)
    if not braced or len(braced) < 2:
        return ""
    return braced[1:-1]


def split_attack_blocks(section: str) -> list[str]:
    blocks: list[str] = []
    i = 0
    while i < len(section):
        while i < len(section) and section[i] != "{":
            i += 1
        if i >= len(section):
            break
        blk = extract_braced_block(section, i)
        if not blk:
            i += 1
            continue
        blocks.append(blk)
        i += len(blk)
    return blocks


def attack_radius(ab: str, dmg: dict) -> float | None:
    range_m = re.search(r"Range\s*=\s*([\d.]+)", ab)
    if range_m:
        return float(range_m.group(1))
    end_range = re.search(r"EndRange\s*=\s*([\d.]+)", ab)
    if end_range:
        return float(end_range.group(1))
    falloff_block = re.search(r"Falloff\s*=\s*\{([^}]+)\}", ab)
    if falloff_block:
        er = re.search(r"EndRange\s*=\s*([\d.]+)", falloff_block.group(1))
        if er:
            return float(er.group(1))
    if dmg and len(dmg) == 1 and dmg.get("blast"):
        return DEFAULT_BLAST_RADIUS
    return None


def attack_entry_from_block(ab: str, name: str) -> dict | None:
    entry: dict = {"name": name}
    dmg = parse_damage(ab)
    if not dmg:
        return None
    entry.update(dmg)
    entry["totalDamage"] = round(sum(dmg.values()), 4)
    radius = attack_radius(ab, dmg)
    if radius is not None:
        entry["radius"] = radius
    falloff = re.search(
        r"Falloff\s*=\s*\{[^}]*Reduction\s*=\s*([\d.]+)", ab, re.DOTALL
    )
    if falloff:
        entry["falloffReduction"] = float(falloff.group(1))
    delay = re.search(r"ExplosionDelay\s*=\s*([\d.]+)", ab)
    if delay:
        entry["explosionDelay"] = float(delay.group(1))
    embed = re.search(r"EmbedDelay\s*=\s*([\d.]+)", ab)
    if embed:
        entry["explosionDelay"] = float(embed.group(1))
    if entry.get("totalDamage", 0) <= 0 or entry.get("radius") is None:
        return None
    return entry


def extract_aoe_attacks(block: str) -> list[dict]:
    section = extract_attacks_section(block)
    if not section:
        return []

    attacks: list[dict] = []
    for ab in split_attack_blocks(section):
        shot_type = re.search(r'ShotType\s*=\s*"([^"]+)"', ab)
        attack_name = re.search(r'AttackName\s*=\s*"([^"]+)"', ab)
        st = shot_type.group(1) if shot_type else None
        an = attack_name.group(1) if attack_name else "Radial Attack"
        dmg = parse_damage(ab)
        if not is_radial_attack(st, an, dmg):
            continue
        entry = attack_entry_from_block(ab, an)
        if entry:
            attacks.append(entry)
    return attacks


def extract_weapon_radial_attacks(block: str) -> list[dict]:
    return extract_aoe_attacks(block)


def parse_damage(block: str) -> dict[str, float]:
    dmg_match = re.search(r"Damage\s*=\s*\{([^}]+)\}", block)
    if not dmg_match:
        return {}
    out: dict[str, float] = {}
    for key, val in re.findall(r"(\w+)\s*=\s*([\d.]+)", dmg_match.group(1)):
        lk = key.lower()
        if lk in DAMAGE_KEYS or lk == "impact":
            out[lk] = float(val)
    return out


def load_weapon_ids() -> set[str]:
    text = WEAPONS_TS.read_text(encoding="utf-8")
    return set(re.findall(r'"id":\s*"([^"]+)"', text))


def to_ts(data: dict[str, list[dict]]) -> str:
    lines = [
        "/**",
        " * Radial / AoE attack profiles sourced from https://wiki.warframe.com Module:Weapons/data.",
        " * Merged onto weapons in use-data.ts and loadout-stats.ts.",
        " * Regenerate: python scripts/generate_radial_attacks.py",
        " * Manual overrides: MANUAL_RADIAL_ATTACKS in generate_radial_attacks.py",
        " */",
        "",
        "import type { WeaponRadialAttack } from \"@/lib/types\";",
        "",
        "export const WEAPON_RADIAL_ATTACKS: Record<string, WeaponRadialAttack[]> = ",
        json.dumps(data, indent=2),
        ";",
        "",
    ]
    return "\n".join(lines)


def main() -> None:
    known_ids = load_weapon_ids()
    merged: dict[str, list[dict]] = {}
    unmatched: list[str] = []

    for slot in SLOTS:
        print(f"Fetching {slot}...")
        text = fetch_slot(slot)
        slot_data = parse_lua_table(text)
        for wid, attacks in slot_data.items():
            if wid in known_ids:
                merged[wid] = attacks
            else:
                unmatched.append(wid)

    for wid, attacks in MANUAL_RADIAL_ATTACKS.items():
        if wid in known_ids:
            # Manual always wins (e.g. Staticor uncharged-only; Ignis spherical blast).
            merged[wid] = attacks

    OUT.write_text(to_ts(merged), encoding="utf-8")
    print(f"Wrote {len(merged)} weapons with radial attacks to {OUT}")
    if unmatched:
        sample = sorted(set(unmatched))[:20]
        print(f"Skipped {len(set(unmatched))} wiki weapons not in weapons.ts (sample: {sample})")


if __name__ == "__main__":
    main()
