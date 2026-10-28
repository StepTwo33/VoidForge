#!/usr/bin/env python3
"""Generate src/data/mod-weapon-tags.ts from wiki Module:Mods/data."""
from __future__ import annotations

import importlib.util
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MODS_TS = ROOT / "src/data/mods.ts"
WEAPONS_TS = ROOT / "src/data/weapons.ts"
OUT = ROOT / "src/data/mod-weapon-tags.ts"

# Wiki Type values that are categories, not a single weapon.
GENERIC_WIKI_TYPES = {
    "rifle", "shotgun", "pistol", "sniper", "bow", "launcher", "primary", "secondary", "melee",
    "arch-gun", "archgun", "arch-melee", "archmelee", "kitgun", "zaw", "companion weapon",
    "beast", "robotic", "sentinel", "modular", "throwing", "exalted", "claws", "thrown melee",
    "warframe", "aura", "parazon", "k-drive", "necramech", "archwing", "operator", "amp",
    "assault rifle", "sniper rifle", "dual daggers", "polearms", "swords", "daggers", "nikanas",
    "rifle", "shotgun", "pistol", "sniper", "bow", "launcher", "primary", "secondary", "melee",
    "companion", "plexus", "antique", "hound", "moa", "tome", "mod", "mag", "kavat",
    "railjack aura", "railjack (tactical, slot 1)", "railjack (tactical, slot 3)",
}

# Profile-level tags (beam, aoe, etc.) — not weapon-identity tags.
PROFILE_INCOMPAT_TAGS = {
    "POWER_WEAPON", "AOE", "SINGLESHOT", "PROJECTILE", "BEAM", "SEMI_AUTO", "IMPACTEXPLODE",
    "DEPLOYABLE", "SECONDARYSHOTGUN", "SENTINEL_WEAPON", "HOUND_WEAPON", "SENTINEL_MOD",
    "MOA_MOD", "HELMINTH_MOD", "POWER_WEAPON_LITE", "NO_HEAVY_ATTACK", "SANDMAN", "VENARI_MOD",
    "MODULAR_GUN", "SYNDICATEMODBLOCKED",
}

# Catalog mod id -> wiki mod name when they diverge.
MOD_WIKI_NAME_ALIASES: dict[str, str] = {}

# Manual exclusive-weapon overrides when wiki match fails.
MOD_EXCLUSIVE_WEAPON_OVERRIDES: dict[str, list[str]] = {
    "overpressured_rounds": ["efv_5_jupiter"],
    "prototype_shock_coils": ["efv_8_mars"],
}

# Stances mis-parsed as weapon-exclusive when wiki Type is a weapon name.
MOD_EXCLUSIVE_WEAPON_BLOCKLIST = frozenset({"atlantis_vulcan", "mafic_rain"})


def load_mods() -> list[dict]:
    text = MODS_TS.read_text(encoding="utf-8")
    mods = []
    for chunk in re.split(r"\n  \},\n", text):
        mid = re.search(r'"id":\s*"([^"]+)"', chunk)
        name = re.search(r'"name":\s*"([^"]+)"', chunk)
        if mid and name:
            mods.append({"id": mid.group(1), "name": name.group(1)})
    return mods


def load_weapons() -> list[dict]:
    text = WEAPONS_TS.read_text(encoding="utf-8")
    weapons = []
    for chunk in re.split(r"\n  \},\n", text):
        mid = re.search(r'"id":\s*"([^"]+)"', chunk)
        name = re.search(r'"name":\s*"([^"]+)"', chunk)
        cat = re.search(r'"category":\s*"([^"]+)"', chunk)
        trigger = re.search(r'"triggerType":\s*"([^"]+)"', chunk)
        if mid and name and cat:
            weapons.append({
                "id": mid.group(1),
                "name": name.group(1),
                "category": cat.group(1),
                "triggerType": trigger.group(1) if trigger else "",
            })
    return weapons


def slug(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "_", s.lower()).strip("_")


def resolve_weapon_ids(wiki_type: str, weapons: list[dict]) -> list[str]:
    key = wiki_type.lower().strip()
    ids: set[str] = set()
    for w in weapons:
        if w["name"].lower() == key:
            ids.add(w["id"])
    base = slug(wiki_type)
    for w in weapons:
        wid = w["id"]
        if wid == base or wid.startswith(base + "_"):
            ids.add(wid)
    return sorted(ids)


def find_wiki_entry(wiki: dict, mod: dict) -> dict | None:
    keys = [
        MOD_WIKI_NAME_ALIASES.get(mod["id"], ""),
        mod["name"].lower(),
        re.sub(r"_r\d+$", "", mod["id"]).replace("_", " "),
        slug(mod["name"]),
    ]
    for key in keys:
        if key and key in wiki:
            return wiki[key]
    return None


def infer_weapon_wiki_tags(weapon: dict) -> list[str]:
    """Map catalog weapon id/name to wiki weapon-specific IncompatibilityTags."""
    wid = weapon["id"].lower()
    tags: set[str] = set()

    if "vectis" in wid:
        tags.add("Vectis")
    if "miter" in wid:
        tags.add("MITER")
    if wid == "attica":
        tags.add("ATTICA")
    if "zhuge" in wid:
        tags.add("ZHUGE")
    if "daikyu" in wid:
        tags.add("DAIKYU")
    if wid in {"cernos", "cernos_prime", "rakta_cernos", "proboscis_cernos"}:
        tags.add("CRPBOW")
    if wid == "mutalist_cernos":
        tags.add("INFCERNOS")
        tags.add("INFBOW")
    if wid in {"paris", "paris_prime", "mk1_paris", "dread"}:
        tags.add("GRNBOW")
    if wid in {"ballistica", "ballistica_prime"}:
        tags.add("CROSSBOW")
    if "larkspur" in wid:
        tags.add("OMICRUS")
    if wid in {"lenz", "prisma_lenz", "kuva_bramma"}:
        tags.add("AOE")  # innate explosive — already covered by radial; tag for mod rules

    return sorted(tags)


def is_weapon_exclusive_type(wiki_type: str, is_augment: bool) -> bool:
    if not wiki_type:
        return False
    if wiki_type.lower() in GENERIC_WIKI_TYPES:
        return False
    if wiki_type in {
        "Rifle", "Shotgun", "Pistol", "Sniper", "Bow", "Launcher", "Primary", "Secondary",
        "Melee", "Warframe", "Aura", "Sniper Rifle", "Assault Rifle",
    }:
        return is_augment
    # Warframe names are not weapon-exclusive weapon mods.
    if wiki_type in {
        "Volt", "Excalibur", "Nezha", "Loki", "Atlas", "Zephyr", "Ash", "Nidus", "Chroma",
        "Nova", "Nyx", "Frost", "Equinox", "Ivara", "Hydroid", "Nekros", "Oberon", "Valkyr",
        "Ember", "Trinity", "Mesa", "Titania",
    }:
        return False
    return True


def main() -> None:
    path = ROOT / "scripts/_parse_wiki_mod_tags.py"
    spec = importlib.util.spec_from_file_location("parse_wiki_mod_tags", path)
    parser = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(parser)
    wiki = parser.load_wiki_mod_tags()
    mods = load_mods()
    weapons = load_weapons()

    profile_incompat: dict[str, list[str]] = {}
    weapon_incompat: dict[str, list[str]] = {}
    compat: dict[str, list[str]] = {}
    exclusive: dict[str, list[str]] = dict(MOD_EXCLUSIVE_WEAPON_OVERRIDES)
    weapon_wiki_tags: dict[str, list[str]] = {}

    for w in weapons:
        tags = infer_weapon_wiki_tags(w)
        if tags:
            weapon_wiki_tags[w["id"]] = tags

    for mod in mods:
        entry = find_wiki_entry(wiki, mod)
        if not entry:
            continue
        inc = entry.get("incompatibilityTags") or []
        comp = entry.get("compatibilityTags") or []
        profile_tags = sorted(t for t in inc if t in PROFILE_INCOMPAT_TAGS)
        weapon_tags = sorted(t for t in inc if t not in PROFILE_INCOMPAT_TAGS)
        if profile_tags:
            profile_incompat[mod["id"]] = profile_tags
        if weapon_tags:
            weapon_incompat[mod["id"]] = weapon_tags
        if comp:
            compat[mod["id"]] = sorted(set(comp))

        wiki_type = (entry.get("wikiType") or "").strip()
        if (
            mod["id"] not in MOD_EXCLUSIVE_WEAPON_BLOCKLIST
            and is_weapon_exclusive_type(wiki_type, entry.get("isWeaponAugment", False))
        ):
            ids = resolve_weapon_ids(wiki_type, weapons)
            if ids:
                exclusive[mod["id"]] = ids

    lines = [
        "/**",
        " * Wiki mod compatibility: profile tags, weapon-specific tags, exclusive weapons.",
        " * Regenerate: python scripts/generate_mod_weapon_tags.py",
        " */",
        "",
        "/** Beam / AoE / single-shot / etc. — checked against inferred weapon profile. */",
        "export const MOD_INCOMPATIBILITY_TAGS: Record<string, readonly string[]> = {",
    ]
    for mid, tags in sorted(profile_incompat.items()):
        lines.append(f'  "{mid}": {json.dumps(tags)},')
    lines.append("};")
    lines.append("")
    lines.append("/** Requires beam, projectile, semi-auto, etc. */")
    lines.append("export const MOD_COMPATIBILITY_TAGS: Record<string, readonly string[]> = {")
    for mid, tags in sorted(compat.items()):
        lines.append(f'  "{mid}": {json.dumps(tags)},')
    lines.append("};")
    lines.append("")
    lines.append("/** Mod only equips on these weapon ids (wiki Type = weapon name). */")
    lines.append("export const MOD_EXCLUSIVE_WEAPON_IDS: Record<string, readonly string[]> = {")
    for mid, ids in sorted(exclusive.items()):
        lines.append(f'  "{mid}": {json.dumps(ids)},')
    lines.append("};")
    lines.append("")
    lines.append("/** Mod blocked on weapons carrying these wiki identity tags (Vectis, CRPBOW, …). */")
    lines.append("export const MOD_WEAPON_SPECIFIC_INCOMPAT_TAGS: Record<string, readonly string[]> = {")
    for mid, tags in sorted(weapon_incompat.items()):
        lines.append(f'  "{mid}": {json.dumps(tags)},')
    lines.append("};")
    lines.append("")
    lines.append("/** Per-weapon wiki identity tags for mod compatibility. */")
    lines.append("export const WEAPON_WIKI_SPECIFIC_TAGS: Record<string, readonly string[]> = {")
    for wid, tags in sorted(weapon_wiki_tags.items()):
        lines.append(f'  "{wid}": {json.dumps(tags)},')
    lines.append("};")
    lines.append("")

    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(
        f"Wrote {OUT.name}: "
        f"{len(profile_incompat)} profile-incompat, {len(compat)} compat-required, "
        f"{len(exclusive)} exclusive-weapon, {len(weapon_incompat)} weapon-tag-incompat, "
        f"{len(weapon_wiki_tags)} weapons tagged"
    )


if __name__ == "__main__":
    main()
