#!/usr/bin/env python3
"""
Generate src/data/arcane-effects.ts from wiki Module:Arcane/data.
Does NOT modify arcanes.ts — calculator reads ARCANE_EFFECTS directly.
"""

from __future__ import annotations

import json
import re
import urllib.parse
import urllib.request
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
OUT = REPO / "src" / "data" / "arcane-effects.ts"
MANUAL = REPO / "src" / "data" / "arcane-manual-overrides.json"
ARCANES_TS = REPO / "src" / "data" / "arcanes.ts"
HEADERS = {"User-Agent": "Voidforge/1.0 (arcane stats generator)"}


def slugify(name: str) -> str:
    s = name.lower().replace("arcane ", "")
    s = re.sub(r"[^a-z0-9]+", "_", s)
    return s.strip("_")


def load_framehub_ids() -> dict[str, str]:
    content = ARCANES_TS.read_text(encoding="utf-8")
    ids = re.findall(r'id:\s*"([^"]+)"', content)
    by_slug: dict[str, str] = {}
    for i in ids:
        bare = i.replace("arcane_", "", 1) if i.startswith("arcane_") else i
        by_slug[bare] = i
        by_slug[i] = i
    return by_slug


def fetch_wiki_arcanes() -> dict[str, dict]:
    params = {"action": "parse", "page": "Module:Arcane/data", "prop": "wikitext", "format": "json"}
    url = "https://wiki.warframe.com/api.php?" + urllib.parse.urlencode(params)
    with urllib.request.urlopen(urllib.request.Request(url, headers=HEADERS), timeout=120) as r:
        text = json.loads(r.read())["parse"]["wikitext"]["*"]

    arcanes: dict[str, dict] = {}
    for m in re.finditer(r'\["([^"]+)"\]\s*=\s*\{', text):
        name = m.group(1)
        start = m.end() - 1
        depth = 0
        i = start
        while i < len(text):
            if text[i] == "{":
                depth += 1
            elif text[i] == "}":
                depth -= 1
                if depth == 0:
                    block = text[start : i + 1]
                    break
            i += 1
        else:
            continue

        desc_m = re.search(r'Description\s*=\s*"((?:[^"\\]|\\.)*)"', block)
        max_rank_m = re.search(r"MaxRank\s*=\s*(\d+)", block)
        type_m = re.search(r'Type\s*=\s*"([^"]+)"', block)
        if not desc_m:
            continue
        desc = desc_m.group(1).replace("\\r\\n", "\n").replace("\\n", "\n")
        arcanes[slugify(name)] = {
            "name": name,
            "description": desc,
            "maxRank": int(max_rank_m.group(1)) if max_rank_m else 5,
            "type": type_m.group(1) if type_m else "Warframe",
        }
    return arcanes


def normalize_desc(desc: str) -> str:
    d = re.sub(r"<[^>]+>", "", desc)
    d = d.replace("|", "\n")
    return d


def detect_trigger(desc: str) -> str:
    d = desc.lower()
    if "stacks up to" in d or "stack up to" in d or re.search(r"up to \d+x", d):
        return "stacks"
    if "on kill" in d:
        return "onKill"
    if "on headshot" in d or "on weak point" in d or "on weakpoint" in d:
        return "onHeadshot"
    if "on shield damaged" in d or "on damaged" in d or "on health damaged" in d:
        return "onDamaged"
    if "on reload" in d:
        return "onReload"
    if "on ability cast" in d or "on ability" in d:
        return "onAbilityCast"
    if "on melee kill" in d:
        return "onMeleeKill"
    if "on finisher" in d or "on heavy attack kill" in d:
        return "onFinisher"
    if "on status effect" in d or "on status" in d:
        return "onStatus"
    if "on energy pickup" in d or "on health pickup" in d or "on pickup" in d:
        return "onPickup"
    if "on void sling" in d or "on void dash" in d:
        return "onVoidSling"
    if "on roll" in d or "on dodge" in d or "on bullet jump" in d or "on slide" in d:
        return "onMovement"
    if "on hit" in d:
        return "onHit"
    if "on enemy frozen" in d:
        return "onFreeze"
    if "while " in d or d.strip().startswith("gain ") or d.strip().startswith("+"):
        return "passive"
    return "conditional"


def add_effect(effects: list[dict], stat: str, value: float, *, flat: bool = False, stacking: bool = False) -> None:
    for e in effects:
        if e["stat"] == stat and e.get("flat") == flat and e.get("stacking") == stacking:
            e["maxValue"] = max(e["maxValue"], value)
            return
    effects.append({"stat": stat, "maxValue": value, "flat": flat, "stacking": stacking})


def parse_effects(desc: str, arcane_type: str) -> tuple[str, list[dict], int | None]:
    effects: list[dict] = []
    clean = normalize_desc(desc)
    trigger = detect_trigger(clean)
    stack_cap: int | None = None

    cap_m = re.search(r"[Ss]tacks up to (\d+)", clean)
    if cap_m:
        stack_cap = int(cap_m.group(1))

    low = clean.lower()

    # Persistence
    if "cannot be hit for more than" in low:
        cap = re.search(r"more than (\d+(?:\.\d+)?)", clean, re.I)
        if cap:
            add_effect(effects, "persistenceDamageCapPerSecond", float(cap.group(1)), flat=True)
            add_effect(effects, "removeShields", 1, flat=True)
        return "passive", effects, stack_cap

    # Ability strength to shields
    if "ability strength modifiers are also applied to max shields" in low:
        add_effect(effects, "abilityStrengthToShield", 100.0)
        return "passive", effects, stack_cap

    # Energy per armor (Battery)
    if "energy per armor" in low:
        m = re.search(r"(\d+(?:\.\d+)?)\s*maximum energy per armor", low)
        if m:
            add_effect(effects, "energyPerArmor", float(m.group(1)), flat=True)
        return "passive", effects, stack_cap

    # Scaling: X% for every Y health/armor
    for m in re.finditer(
        r"(\d+(?:\.\d+)?)\s*%\s*ability strength for every (\d+(?:\.\d+)?)\s*max health",
        low,
    ):
        add_effect(effects, "abilityStrengthPerHealth", float(m.group(1)))
        add_effect(effects, "abilityStrengthPerHealthStep", float(m.group(2)), flat=True)

    for m in re.finditer(r"(\d+(?:\.\d+)?)\s*%\s*damage for each unit of armor past (\d+)", low):
        add_effect(effects, "damagePerArmorOver", float(m.group(1)))
        add_effect(effects, "damagePerArmorThreshold", float(m.group(2)), flat=True)

    # Proc resist
    for m in re.finditer(r"\+(\d+(?:\.\d+)?)\s*%\s*chance to resist a", clean, re.I):
        add_effect(effects, "statusResistance", float(m.group(1)))

    # Chance + percent effect
    for m in re.finditer(
        r"(\d+(?:\.\d+)?)\s*%\s*chance\s*(?:for|to)\s*\+(\d+(?:\.\d+)?)\s*%\s*([A-Za-z /]+)",
        clean,
        re.I,
    ):
        val = float(m.group(2))
        label = m.group(3).lower()
        chance = float(m.group(1))
        if "armor" in label:
            add_effect(effects, "armorBonusChance", chance)
            add_effect(effects, "armor", val)
        elif "health regen" in label:
            add_effect(effects, "healthRegenChance", chance)
            add_effect(effects, "healthRegen", val)
        elif "damage" in label and "primary" in label:
            add_effect(effects, "holsterDamage", val)
        elif "damage" in label and "secondary" in label:
            add_effect(effects, "holsterDamage", val)
        elif "reload speed" in label:
            add_effect(effects, "reloadSpeed", val)
        elif "fire rate" in label:
            add_effect(effects, "fireRate", val)
        elif "critical chance" in label:
            add_effect(effects, "criticalChance", val)
        elif "attack speed" in label:
            add_effect(effects, "attackSpeed", val)

    # Chance + flat armor
    for m in re.finditer(r"(\d+(?:\.\d+)?)\s*%\s*chance\s*for\s*\+(\d+(?:\.\d+)?)\s*Armor", clean, re.I):
        add_effect(effects, "armorBonusChance", float(m.group(1)))
        add_effect(effects, "flatArmorBonus", float(m.group(2)), flat=True)

    # Flat regen on kill
    for m in re.finditer(r"\+(\d+(?:\.\d+)?)\s*Health Regen/s", clean, re.I):
        add_effect(effects, "healthRegenPerSec", float(m.group(1)), flat=True)

    for m in re.finditer(r"\+(\d+(?:\.\d+)?)\s*Armor for", clean, re.I):
        add_effect(effects, "flatArmorBonus", float(m.group(1)), flat=True)

    # Percent lines
    for m in re.finditer(r"\+(\d+(?:\.\d+)?)\s*%\s*([A-Za-z0-9 /]+?)(?:\.|,|\n|$)", clean):
        val = float(m.group(1))
        label = m.group(2).strip().lower()
        stacking = "stack" in low and trigger == "stacks"
        if label == "damage" or label.endswith(" damage"):
            add_effect(effects, "damage", val, stacking=stacking)
        elif "primary weapon damage" in label or "primary damage" in label:
            add_effect(effects, "damage", val, stacking=stacking)
        elif "secondary weapon damage" in label or "secondary damage" in label:
            add_effect(effects, "holsterDamage", val)
        elif "melee damage" in label:
            add_effect(effects, "meleeDamageBonus", val, stacking=stacking)
        elif "reload speed" in label:
            add_effect(effects, "reloadSpeed", val, stacking="reload" in label and stacking)
        elif "fire rate" in label:
            add_effect(effects, "fireRate", val, stacking=stacking)
        elif "critical chance" in label:
            add_effect(effects, "criticalChance", val, stacking=stacking)
        elif "critical damage" in label or "crit damage" in label:
            add_effect(effects, "criticalMultiplier", val)
        elif "multishot" in label:
            add_effect(effects, "multishot", val, stacking=stacking)
        elif "status chance" in label:
            add_effect(effects, "statusChance", val, stacking=stacking)
        elif "ability strength" in label:
            add_effect(effects, "abilityStrength", val, stacking=stacking)
        elif "ability duration" in label:
            add_effect(effects, "abilityDuration", val)
        elif "ability efficiency" in label:
            add_effect(effects, "abilityEfficiency", val)
        elif "ability range" in label:
            add_effect(effects, "abilityRange", val)
        elif "parkour velocity" in label:
            add_effect(effects, "parkourVelocity", val)
        elif "sprint speed" in label or "movement speed" in label:
            add_effect(effects, "sprintSpeedBonus", val)
        elif "ammo efficiency" in label:
            add_effect(effects, "ammoEfficiency", val)
        elif "life steal" in label:
            add_effect(effects, "lifeSteal", val)
        elif "combo count" in label or "combo gain" in label or "additional combo" in label:
            add_effect(effects, "meleeComboGain", val)
        elif "energy regeneration" in label:
            add_effect(effects, "energyRegen", val)
        elif "amp ammo efficiency" in label:
            add_effect(effects, "ampAmmoEfficiency", val)
        elif "amp critical damage" in label:
            add_effect(effects, "ampCritDamage", val)
        elif "damage reduction" in label:
            add_effect(effects, "damageReduction", val)
        elif "max health" in label and "per" not in label:
            add_effect(effects, "healthFlat", float(m.group(1)), flat=True)

    # x mult crit
    for m in re.finditer(r"\+(\d+(?:\.\d+)?)x\s*final critical", clean, re.I):
        add_effect(effects, "criticalMultiplier", float(m.group(1)) * 100)

    # Flat operator
    for m in re.finditer(r"\+(\d+(?:\.\d+)?)\s*Operator\s*(Health|Armor)", clean, re.I):
        add_effect(effects, f"operator{m.group(2).title()}", float(m.group(1)), flat=True)

    # Energy orb flat
    for m in re.finditer(r"replenish\s*(\d+(?:\.\d+)?)\s*Energy", clean, re.I):
        add_effect(effects, "energyOrbBonus", float(m.group(1)), flat=True)

    for m in re.finditer(r"restore\s*(\d+(?:\.\d+)?)\s*Health", clean, re.I):
        add_effect(effects, "healthFromOrbs", float(m.group(1)), flat=True)

    # Weapon damage proc (Exodia Force style)
    for m in re.finditer(
        r"(\d+(?:\.\d+)?)\s*%\s*chance to deal (\d+(?:\.\d+)?)\s*%\s*Weapon Damage",
        clean,
        re.I,
    ):
        add_effect(effects, "procDamageMultiplier", float(m.group(2)))

    # Bonus damage on status (flat)
    for m in re.finditer(r"Deals \+(\d+(?:\.\d+)?)\s*Damage", clean, re.I):
        add_effect(effects, "bonusDamageOnStatus", float(m.group(1)), flat=True)

    # Type-specific passive amp stats from names in existing data
    if arcane_type == "Amp":
        for m in re.finditer(r"Converts (\d+(?:\.\d+)?)\s*%\s*Void", clean, re.I):
            add_effect(effects, "voidConversion", float(m.group(1)))

    # --- Voidforge / aggressive patterns (merged from build_arcane_manual_overrides) ---
    for m in re.finditer(r"x([\d.]+)\s*Melee Damage", clean, re.I):
        add_effect(effects, "meleeDamageBonus", (float(m.group(1)) - 1) * 100)

    for m in re.finditer(r"(\d+(?:\.\d+)?)\s*%\s*chance for \+(\d+(?:\.\d+)?)\s*%\s*([^.\n]+)", clean, re.I):
        val, label = float(m.group(2)), m.group(3).lower()
        if "primary" in label or "secondary" in label:
            add_effect(effects, "holsterDamage", val)
        elif "life steal" in label:
            add_effect(effects, "lifeSteal", val)
        elif "ammo efficiency" in label:
            add_effect(effects, "ammoEfficiency", val)
        elif "critical" in label or "crit" in label:
            add_effect(effects, "criticalChance", val)

    for m in re.finditer(r"\+(\d+(?:\.\d+)?)\s*%\s*([A-Za-z0-9 /]+?)\s*per rank", clean, re.I):
        val, label = float(m.group(1)), m.group(2).lower()
        if "holster" in label:
            add_effect(effects, "holsterDamage", val)
            add_effect(effects, "holsterSpeed", val)

    if "gain" in low and "ammo efficiency" in low:
        m = re.search(r"(\d+(?:\.\d+)?)\s*%\s*ammo efficiency", low)
        if m:
            add_effect(effects, "ammoEfficiency", float(m.group(1)))

    if "up to" in low and "ability strength" in low:
        m = re.search(r"(\d+(?:\.\d+)?)\s*%\s*ability strength", low)
        if m:
            add_effect(effects, "abilityStrength", float(m.group(1)), stacking=True)

    if "maximum of" in low and "ability duration" in low:
        m = re.search(r"maximum of (\d+(?:\.\d+)?)\s*%\s*ability duration", low)
        if m:
            add_effect(effects, "abilityDuration", float(m.group(1)))

    if "max health" in low and "stacks up to" in low:
        m = re.search(r"\+(\d+(?:\.\d+)?)\s*max health", low, re.I)
        cap = re.search(r"stacks up to (\d+)", low, re.I)
        if m:
            add_effect(effects, "healthFlat", float(m.group(1)), stacking=True)
            if cap:
                stack_cap = int(cap.group(1))

    if "damage resistance" in low and "stacks up to" in low:
        m = re.search(r"\+(\d+(?:\.\d+)?)\s*%\s*damage resistance", clean, re.I)
        if m:
            add_effect(effects, "damageReduction", float(m.group(1)), stacking=True)

    if "weapon critical chance" in low and "maximum" in low:
        m = re.search(r"(\d+(?:\.\d+)?)\s*%\s*weapon critical chance", low)
        if m:
            add_effect(effects, "criticalChance", float(m.group(1)), stacking=True)

    if "energy regen" in low:
        m = re.search(r"\+(\d+(?:\.\d+)?)\s*energy regen", low, re.I)
        if m:
            add_effect(effects, "energyRegen", float(m.group(1)), stacking=True)

    if "increase energy regeneration by" in low:
        m = re.search(r"by (\d+(?:\.\d+)?)\s*%\s*over", low)
        if m:
            add_effect(effects, "energyRegen", float(m.group(1)))

    if "gain +250 max health per" in low:
        add_effect(effects, "healthFlat", 250, flat=True)

    if "heal companion for" in low:
        m = re.search(r"for (\d+(?:\.\d+)?)\s", clean, re.I)
        if m:
            add_effect(effects, "companionHeal", float(m.group(1)), flat=True)

    if "steal" in low and "defenses" in low:
        m = re.search(r"steal (\d+(?:\.\d+)?)\s*%\s*of their defenses", low)
        if m:
            add_effect(effects, "armorSteal", float(m.group(1)))

    if "ability efficiency" in low:
        m = re.search(r"(\d+(?:\.\d+)?)\s*%\s*ability efficiency", low)
        if m:
            add_effect(effects, "abilityEfficiency", float(m.group(1)))

    if "damage on your next shot" in low or "damage on next shot" in low:
        m = re.search(r"\+(\d+(?:\.\d+)?)\s*%\s*damage", clean, re.I)
        if m:
            add_effect(effects, "damage", float(m.group(1)))

    if "melee damage on heavy attack" in low:
        m = re.search(r"\+(\d+(?:\.\d+)?)\s*%\s*melee damage on heavy", low)
        if m:
            add_effect(effects, "meleeHeavyDamage", float(m.group(1)))

    if "for every 200 current shields" in low:
        m = re.search(r"(\d+(?:\.\d+)?)\s*%\s*melee damage for every 200", low)
        if m:
            add_effect(effects, "meleeDamagePerShield", float(m.group(1)))

    if "damage to amps" in low:
        m = re.search(r"\+(\d+(?:\.\d+)?)\s*%\s*damage to amps", low)
        if m:
            add_effect(effects, "ampDamage", float(m.group(1)))

    if "critical chance for" in low and "depleted" in low:
        m = re.search(r"(\d+(?:\.\d+)?)\s*%\s*critical chance", low)
        if m:
            add_effect(effects, "criticalChance", float(m.group(1)))

    if "increases weapon damage by" in low and "stacking up to" in low:
        m = re.search(r"by (\d+(?:\.\d+)?)\s*%\s*/s stacking up to (\d+)", low)
        if m:
            add_effect(effects, "damage", float(m.group(1)) * float(m.group(2)), stacking=False)

    if "deal" in low and "of the hit" in low:
        m = re.search(r"deal (\d+(?:\.\d+)?)\s*%\s*of the hit", low)
        if m:
            add_effect(effects, "procDamageMultiplier", float(m.group(1)))

    if "take +" in low and "damage per" in low:
        m = re.search(r"take \+(\d+(?:\.\d+)?)\s*%\s*damage per", low)
        if m:
            add_effect(effects, "damageTakenBonus", float(m.group(1)))

    if "status chance for all warframe weapons" in low:
        m = re.search(r"(\d+(?:\.\d+)?)\s*%\s*status chance", low)
        if m:
            add_effect(effects, "statusChance", float(m.group(1)), stacking=True)

    if "amp critical damage" in low and "x" in low:
        m = re.search(r"\+(\d+(?:\.\d+)?)x\s*amp critical damage", low)
        if m:
            add_effect(effects, "ampCritDamage", (float(m.group(1))) * 100)

    if "kitgun recharges ammo" in low:
        add_effect(effects, "kitgunRecharge", 100, flat=True)
    if "tether enemies" in low:
        add_effect(effects, "kitgunTether", 100, flat=True)
    if "home to heads" in low:
        add_effect(effects, "kitgunHoming", 100, flat=True)
    if "initial combo" in low:
        m = re.search(r"(\d+(?:\.\d+)?)\s*initial combo", low, re.I)
        if m:
            add_effect(effects, "meleeComboInitial", float(m.group(1)), flat=True)
    if "strike a second time" in low:
        add_effect(effects, "duplicateAttackChance", 100)

    # Utility-only — tag so UI can show active effect without numeric DPS impact
    utility_markers = (
        "knockdown", "pull enemies", "jam within", "invulnerable", "avoid death",
        "projectile that explodes", "shockwave forwards", "dissipate the endpoint",
        "will not cost energy", "radial attack that applies",
    )
    if not effects and any(u in low for u in utility_markers):
        add_effect(effects, "utilityEffect", 1, flat=True)

    return trigger, effects, stack_cap


def load_framehub_descriptions() -> dict[str, tuple[str, int, str]]:
    content = ARCANES_TS.read_text(encoding="utf-8")
    out: dict[str, tuple[str, int, str]] = {}
    for m in re.finditer(
        r'id:\s*"([^"]+)".*?maxRank:\s*(\d+).*?subCategory:\s*"([^"]+)".*?description:\s*"((?:[^"\\]|\\.)*)"',
        content,
        re.S,
    ):
        desc = m.group(4).replace("\\ ", " ").replace("\\n", "\n")
        out[m.group(1)] = (desc, int(m.group(2)), m.group(3))
    return out


def merge_effects(base: list[dict], extra: list[dict], *, override: bool = False) -> list[dict]:
    by_stat = {e["stat"]: e for e in base}
    for e in extra:
        if override or e["stat"] not in by_stat:
            by_stat[e["stat"]] = e
    return list(by_stat.values())


def load_manual_overrides() -> dict[str, dict | list]:
    if not MANUAL.exists():
        return {}
    return json.loads(MANUAL.read_text(encoding="utf-8"))


def normalize_manual_entry(entry: dict | list) -> tuple[list[dict], bool, str | None, int | None]:
    """Return (effects, replace_all, trigger_override, stack_cap_override)."""
    if isinstance(entry, list):
        return entry, False, None, None
    effects = entry.get("effects", [])
    replace = bool(entry.get("replace"))
    trigger = entry.get("trigger")
    stack_cap = entry.get("stackCap")
    return effects, replace, trigger, stack_cap


# Stats stored in arcanes.ts as per-rank increment (multiply by maxRank+1 for max-rank value).
PER_RANK_INCREMENT_STATS = frozenset({
    "ampCritChance", "ampCritDamage", "ampFireRate", "ampReload", "ampMultishot",
    "ampStatusChance", "ampDamage", "ampHeatDamage", "ampRange",
    "healthRegenChance", "healthRegenAmount",
    "voidSprintSpeed", "voidModeSpeed", "coldResistance", "headshotHealthRegen",
    "reloadSpeedChance", "reloadSpeedBonus",
})

# Per-stack at max rank — do not multiply by rank.
STACKING_WEAPON_STATS = frozenset({"damage", "reloadSpeed", "holsterDamage", "holsterSpeed"})


def existing_to_effects(existing: dict[str, float], max_rank: int, fid: str) -> list[dict]:
    """Convert arcanes.ts legacy stats to effect lines at max rank."""
    mult = max_rank + 1
    lines: list[dict] = []
    is_stack_arcane = any(x in fid for x in ("merciless", "deadhead", "dexterity", "blight", "frostbite", "crux"))
    for stat, val in existing.items():
        if stat in ("removeShields",):
            lines.append({"stat": stat, "maxValue": val, "flat": True, "stacking": False})
        elif stat in (
            "persistenceDamageCapPerSecond", "energyOrbBonus", "operatorHealth", "operatorArmor",
            "flatArmorBonus", "kitgunTether", "kitgunRecharge", "kitgunHoming", "ampRange",
        ):
            lines.append({"stat": stat, "maxValue": val, "flat": True, "stacking": False})
        elif stat.startswith("amp") or stat in PER_RANK_INCREMENT_STATS:
            lines.append({"stat": stat, "maxValue": val * mult, "flat": False, "stacking": False})
        elif stat in STACKING_WEAPON_STATS and is_stack_arcane:
            lines.append({"stat": stat, "maxValue": val, "flat": False, "stacking": True})
        else:
            lines.append({"stat": stat, "maxValue": val, "flat": False, "stacking": False})
    return lines


def load_existing_stats() -> dict[str, dict[str, float]]:
    content = ARCANES_TS.read_text(encoding="utf-8")
    out: dict[str, dict[str, float]] = {}
    for m in re.finditer(r'id:\s*"([^"]+)".*?stats:\s*(\{[^}]*\})', content, re.S):
        aid, stats_raw = m.group(1), m.group(2)
        stats = {}
        for k, v in re.findall(r'"([^"]+)":\s*([\d.]+)', stats_raw):
            stats[k] = float(v)
        if stats:
            out[aid] = stats
    return out


def main() -> None:
    wiki = fetch_wiki_arcanes()
    id_map = load_framehub_ids()
    existing_all = load_existing_stats()
    fh_descs = load_framehub_descriptions()
    manual = load_manual_overrides()
    out: dict[str, dict] = {}

    for slug, data in wiki.items():
        fid = id_map.get(slug) or id_map.get(f"arcane_{slug}")
        if not fid:
            continue
        trigger, effects, stack_cap = parse_effects(data["description"], data["type"])

        if fid in fh_descs:
            fh_desc, fh_rank, fh_sub = fh_descs[fid]
            t2, e2, c2 = parse_effects(fh_desc, fh_sub)
            if not trigger or trigger == "conditional":
                trigger = t2
            if c2 and not stack_cap:
                stack_cap = c2
            effects = merge_effects(effects, e2)

        if fid in existing_all:
            effects = merge_effects(
                effects,
                existing_to_effects(existing_all[fid], data["maxRank"], fid),
                override=True,
            )

        if fid in manual:
            manual_effects, replace_all, trigger_override, stack_cap_override = normalize_manual_entry(manual[fid])
            if replace_all:
                effects = manual_effects
            else:
                effects = merge_effects(effects, manual_effects, override=True)
            if trigger_override:
                trigger = trigger_override
            if stack_cap_override is not None:
                stack_cap = stack_cap_override

        if fid == "arcane_persistence":
            trigger = "passive"
            effects = [
                {"stat": "persistenceDamageCapPerSecond", "maxValue": 500, "flat": True, "stacking": False},
                {"stat": "removeShields", "maxValue": 1, "flat": True, "stacking": False},
            ]

        entry: dict = {
            "name": data["name"],
            "trigger": trigger,
            "maxRank": data["maxRank"],
            "effects": effects,
        }
        if stack_cap is not None:
            entry["stackCap"] = stack_cap
        out[fid] = entry

    lines = [
        "/**",
        " * Arcane effect definitions — generated from wiki Module:Arcane/data.",
        " * Regenerate: python scripts/generate_arcane_stats.py",
        " */",
        "",
        "export type ArcaneTrigger =",
        '  | "passive"',
        '  | "stacks"',
        '  | "onKill"',
        '  | "onHeadshot"',
        '  | "onDamaged"',
        '  | "onReload"',
        '  | "onAbilityCast"',
        '  | "onMeleeKill"',
        '  | "onFinisher"',
        '  | "onStatus"',
        '  | "onPickup"',
        '  | "onVoidSling"',
        '  | "onMovement"',
        '  | "onHit"',
        '  | "onFreeze"',
        '  | "conditional";',
        "",
        "export interface ArcaneEffectLine {",
        "  stat: string;",
        "  maxValue: number;",
        "  flat?: boolean;",
        "  stacking?: boolean;",
        "  constantAtAllRanks?: boolean;",
        "}",
        "",
        "export interface ArcaneEffectDef {",
        "  name: string;",
        "  trigger: ArcaneTrigger;",
        "  maxRank: number;",
        "  stackCap?: number;",
        "  effects: ArcaneEffectLine[];",
        "}",
        "",
        "export const ARCANE_EFFECTS: Record<string, ArcaneEffectDef> = ",
        json.dumps(out, indent=2),
        ";",
        "",
    ]
    OUT.write_text("\n".join(lines), encoding="utf-8")

    with_effects = sum(1 for v in out.values() if v["effects"])
    print(f"Generated {len(out)} arcane effects ({with_effects} with stat lines)")


if __name__ == "__main__":
    main()
