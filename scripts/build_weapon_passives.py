#!/usr/bin/env python3
"""Build weapon-passives.ts from wiki + preserved Kuva/Tenet block + hand-tuned overrides."""
from __future__ import annotations

import json
import re
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PASSIVES_PATH = ROOT / "src/data/weapon-passives.ts"
WEAPONS_PATH = ROOT / "src/data/weapons.ts"
WIKI_CACHE = ROOT / "scripts/_wiki_weapon_passives.wikitext"
UA = {"User-Agent": "Voidforge/1.0 (weapon passive build)"}

NAME_OVERRIDES: dict[str, str] = {
    "Ack & Brunt": "ack_&_brunt",
    "Argo & Vel": "argo_&_vel",
    "Sigma & Octantis": "sigma_&_octantis",
    "Silva & Aegis": "silva_&_aegis",
    "Silva & Aegis Prime": "silva_&_aegis_prime",
    "Tak & Lug": "tak_&_lug",
    "Tak & Lug Prime": "tak_&_lug_prime",
    "AX-52": "ax_52",
    "Mk1-Kunai": "mk1_kunai",
    "Mk1-Strun": "mk1_strun",
    "Mk1-Bo": "mk1_bo",
    "Mk1-Braton": "mk1_braton",
    "Mk1-Furis": "mk1_furis",
    "Mk1-Furax": "mk1_furax",
    "Mk1-Paris": "mk1_paris",
    "EFV-5 Jupiter": "efv_5_jupiter",
    "EFV-8 Mars": "efv_8_mars",
    "Riot-848": "riot_848",
    "Purgator 1": "purgator_1",
    "Vesper 77": "vesper_77",
    "Dual Coda Torxica": "dual_coda_torxica",
    "Balefire Charger": "balefire",
    "Balefire Charger Prime": "balefire_prime",
    "Artemis Bow": "artemis_bow",
    "Artemis Bow Prime": "artemis_bow_prime",
    "Regulators": "regulators",
    "Regulators Prime": "regulators_prime",
}

# Shorter codex copy kept over wiki scrape when both exist.
MANUAL_OVERRIDES: dict[str, str] = {
    "acceltra": "Reloads 25% faster while sprinting.",
    "attica": "On kill, bodies follow the bolt, damaging enemies along the path and pinning corpses to walls.",
    "ax_52": "Hip-fire: +60% ammo efficiency. Aimed: headshots gain +400% critical chance.",
    "basmu": "Emptying the magazine emits three 10m pulses (True damage); each pulse heals you for 10× damage dealt to enemies per pulse.",
    "cedo": "Deals +60% additive damage for each distinct status effect on the target (additive with multiple procs).",
    "cernos_prime": "Deals +50% bonus damage on headshots.",
    "hema": "Headshots restore health equal to 10% of damage dealt. Reloading drains 3% of max health.",
    "lenz": "Innate Arrow Mutation: non Sniper/Bow ammo packs convert to 1 round each.",
    "perigale": "4 headshots in a burst or a headshot kill grants Gale Force: +100% ammo efficiency for 4s (refreshable).",
    "perigale_prime": "4 headshots in a burst or a headshot kill grants Gale Force: +100% ammo efficiency for 4s (refreshable).",
    "shedu": "Emptying the magazine emits a 20m pulse that staggers with guaranteed Impact and strips Sentient / Shadow Stalker adaptations. +30% movement speed while aiming.",
    "stahlta": "Primary fire has an independent extra chance to proc Radiation (separate from normal status chance).",
    "synapse": "Deals +20% bonus damage on headshots.",
    "fulmin": "Silent semi-auto; full-auto emits a close-range shockwave.",
    "phenmor": "Alternate fire charges a gauge that empowers primary fire.",
    "laetum": "Alternate fire charges shots that build Overcharge for explosive rounds.",
    "akarius": "Reloads 50% faster while sprinting.",
    "arca_scisco": "Target Analysis: each hit grants +4% critical and status chance, stacking to +20%; decays one stack at a time; 2s duration, refreshable.",
    "athodai": "Overdrive on headshot kill: +100% fire rate and unlimited ammo for 8s.",
    "afentis": "Thrown spear impales enemies or creates a Ballistarii Might field (+50% reload, +20% fire/attack speed, +100% reserve ammo, -50% recoil).",
    "ballistica_prime": "Charged shot kills within 50m spawn a scannable 7s ghost of the enemy.",
    "dual_toxocyst": "Frenzy on headshot (3s): +150% fire rate, +100% additive damage, less recoil, no ammo use while firing.",
    "knell": "Death Knell on headshot: stacking crit damage and status chance, unlimited ammo 3s; status bonus 20%/40%/60% by stacks.",
    "pyrana_prime": "3 kills in 3s summons a second ethereal Pyrana for 6s (larger magazine, +40% fire rate).",
    "velox": "First shot of each 5-shot burst costs no ammo. Reloads 50% faster from empty.",
    "zhuge_prime": "Reloads 50% faster from an empty magazine.",
    "ack_&_brunt": "Blocking elemental damage stores stacks (up to 4); each stack adds ~17.5% elemental damage.",
    "arca_titron": "Kills store charges (up to 5): each adds +200% slam attack damage.",
    "caustacyst": "Heavy attacks release a toxic stream (20m) with a ground trail; opens enemies to finishers.",
    "dex_nikana": "Gains combo every 11 hits (instead of 20); max combo multiplier capped at 11× (instead of 12×).",
    "heliocor": "Kills scan enemies if a Codex Scanner is equipped.",
    "hirudo": "Crits: 5% lifesteal and stacking max health (5 stacks). Heavy kill: Harmonic Resonance (+30% status duration to allies, 30s).",
    "lesion": "On status proc: +15% attack speed and +100% additive damage for 6s.",
    "mire": "Slam attacks have a forced Corrosive proc.",
    "pathocyst": "Attacks and throws spawn maggots that damage nearby enemies.",
    "pangolin_sword": "Slam radial damage has a guaranteed Impact proc in addition to other effects.",
    "pangolin_prime": "Slam radial damage has a guaranteed Impact proc in addition to other effects.",
    "tatsu": "On kill, stores up to 5 charges; slide attack releases seeking stunning projectiles.",
    "venato_prime": "Applying a status has 100% chance to also proc Slash.",
    "venka_prime": "Can reach 13.0× melee combo multiplier after 240 hits.",
    "wolf_sledge": "Hold melee to throw like a glaive (40m); bounces off enemies; recall anytime.",
    "xoris": "Infinite melee combo duration.",
    "war": "Every hit on enemies that are not ragdolled procs an Impact status effect.",
}


def load_weapon_catalog() -> dict[str, str]:
    text = WEAPONS_PATH.read_text(encoding="utf-8")
    catalog: dict[str, str] = {}
    for block in re.finditer(
        r'\{\s*"id": "([^"]+)"[\s\S]*?"name": "([^"]+)"', text
    ):
        catalog[block.group(1)] = block.group(2)
    return catalog


def normalize_name(name: str) -> str:
    return re.sub(r"\s+", " ", name.strip().lower().replace("'", ""))


def name_to_id(name: str, catalog: dict[str, str]) -> str | None:
    if name in NAME_OVERRIDES:
        wid = NAME_OVERRIDES[name]
        return wid if wid in catalog else None
    by_norm = {normalize_name(n): i for i, n in catalog.items()}
    norm = normalize_name(name)
    if norm in by_norm:
        return by_norm[norm]
    slug = (
        name.lower()
        .replace(" & ", "_&_")
        .replace(" ", "_")
        .replace("'", "")
        .replace("-", "_")
    )
    return slug if slug in catalog else None


def fetch_wiki_wikitext() -> str:
    if WIKI_CACHE.exists():
        return WIKI_CACHE.read_text(encoding="utf-8")
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
    text = data["parse"]["wikitext"]["*"]
    WIKI_CACHE.write_text(text, encoding="utf-8")
    return text


def clean_wiki_passive(raw: str) -> str:
    text = raw.strip()
    lines = []
    for line in text.splitlines():
        line = line.strip()
        if line.startswith("*"):
            line = line.lstrip("* ").strip()
        if not line or line == "|":
            continue
        lines.append(line)
    text = " ".join(lines)
    text = re.sub(r"\{\{D\|([^}|]+)\}\}", r"\1", text)
    text = re.sub(r"\{\{WF\|([^}|]+)\}\}", r"\1", text)
    text = re.sub(r"\{\{Weapon\|([^}|]+)\}\}", r"\1", text)
    text = re.sub(r"\[\[([^|\]]+)\|([^\]]+)\]\]", r"\2", text)
    text = re.sub(r"\[\[([^\]]+)\]\]", r"\1", text)
    text = re.sub(r"'''([^']+)'''", r"\1", text)
    text = re.sub(r"''([^']+)''", r"\1", text)
    text = re.sub(r"\s+", " ", text).strip()
    text = re.sub(r"\[Always Active\]\s*", "", text)
    text = re.sub(r"\[On Kill\]\s*", "On kill: ", text)
    text = re.sub(r"\[On Hit\]\s*", "On hit: ", text)
    text = re.sub(r"\[Headshot\]\s*", "Headshots: ", text)
    text = re.sub(r"\[Headshot Kill\]\s*", "Headshot kills: ", text)
    text = re.sub(r"\[Aiming\]\s*", "While aiming: ", text)
    text = re.sub(r"\[Alternate Fire\]\s*", "Alt-fire: ", text)
    text = re.sub(r"\[Magazine Empty\]\s*", "Empty magazine: ", text)
    text = re.sub(r"\[Sprint Reload\]\s*", "Sprint reload: ", text)
    text = re.sub(r"\[Empty Reload\]\s*", "Empty reload: ", text)
    text = re.sub(r"\[Warframe Synergy\]\s*", "", text)
    text = re.sub(r"\[Charged Shot\]\s*", "Charged shots: ", text)
    text = re.sub(r"\[Reload\]\s*", "Reload: ", text)
    text = re.sub(r"\[Adversary\]\s*", "", text)
    return text


def parse_wiki_passives(wikitext: str):
    rows = re.split(r"\n\|-\n", wikitext)
    for row in rows:
        weapon_match = re.search(r"^\|\s*(.+?)\s*\n\|\s*\n", row, re.M | re.S)
        if not weapon_match:
            weapon_match = re.search(r"^\|\s*(.+?)\s*\n\|", row, re.M | re.S)
        if not weapon_match:
            continue
        weapon_cell = weapon_match.group(1).strip()
        if not weapon_cell.startswith("{{Weapon|"):
            continue
        passive_raw = row[weapon_match.end() :].strip()
        if passive_raw.startswith("|"):
            passive_raw = passive_raw[1:].strip()
        passive = clean_wiki_passive(passive_raw)
        if not passive:
            continue
        for wname in re.findall(r"\{\{Weapon\|([^}|]+)", weapon_cell):
            yield wname.strip(), passive


def parse_wiki_passives_map(
    wikitext: str, catalog: dict[str, str]
) -> tuple[dict[str, str], list[str]]:
    result: dict[str, str] = {}
    unmapped: list[str] = []
    for wname, passive in parse_wiki_passives(wikitext):
        wid = name_to_id(wname, catalog)
        if not wid:
            unmapped.append(wname)
            continue
        if wid not in result or len(passive) > len(result[wid]):
            result[wid] = passive
    return result, sorted(set(unmapped))


def extract_kuva_block(text: str) -> str:
    m = re.search(
        r"/\*\* Kuva / Tenet / Coda[\s\S]*?const KUVA_TENET_CODA[^=]*=\s*\{",
        text,
    )
    if not m:
        raise RuntimeError("KUVA_TENET_CODA block not found")
    start = m.start()
    depth = 0
    i = m.end() - 1
    while i < len(text):
        if text[i] == "{":
            depth += 1
        elif text[i] == "}":
            depth -= 1
            if depth == 0:
                return text[start : i + 2]
        i += 1
    raise RuntimeError("Unclosed KUVA_TENET_CODA block")


def ts_key(key: str) -> str:
    if re.match(r"^[a-z_][a-z0-9_]*$", key):
        return key
    return json.dumps(key)


def ts_string(value: str) -> str:
    return json.dumps(value, ensure_ascii=False)


def render_file(kuva_block: str, wiki_passives: dict[str, str]) -> str:
    lines = [
        "/**",
        " * Weapon passive descriptions (codex-style), merged onto weapons in use-data.",
        " *",
        " * Primary source: https://wiki.warframe.com/w/Weapons/Passives",
        " * Regenerate wiki bulk: python scripts/build_weapon_passives.py",
        " * Kuva/Tenet/Coda: progenitor bonus + variant mechanics in KUVA_TENET_CODA.",
        " */",
        "",
        "const PROGENITOR_LINE =",
        '  "Progenitor bonus: extra elemental damage (typically 25–60% of base damage; set element and % in the builder).";',
        "",
        kuva_block,
        "",
        "/** Wiki passives (auto-synced + hand-tuned overrides). */",
        "const WIKI_PASSIVES: Record<string, string> = {",
    ]
    for key in sorted(wiki_passives.keys()):
        lines.append(f"  {ts_key(key)}: {ts_string(wiki_passives[key])},")
    lines.append("};")
    lines.append("")
    lines.append("export const WEAPON_PASSIVES: Record<string, string> = {")
    lines.append("  ...KUVA_TENET_CODA,")
    lines.append("  ...WIKI_PASSIVES,")
    lines.append("};")
    lines.append("")
    return "\n".join(lines)


def main() -> None:
    catalog = load_weapon_catalog()
    catalog_ids = set(catalog)

    # Restore Kuva block from git if current file has broken ${PROGENITOR_LINE} literals
    current = PASSIVES_PATH.read_text(encoding="utf-8")
    if "${PROGENITOR_LINE}" in current and "`${PROGENITOR_LINE}" not in current:
        import subprocess

        current = subprocess.check_output(
            ["git", "show", "HEAD:src/data/weapon-passives.ts"],
            cwd=ROOT,
            text=True,
        )
    kuva_block = extract_kuva_block(current)

    wikitext = fetch_wiki_wikitext()
    wiki_generated, unmapped = parse_wiki_passives_map(wikitext, catalog)

  # Drop kuva/tenet/coda — covered by KUVA_TENET_CODA
    kuva_prefixes = ("kuva_", "tenet_", "coda_")
    wiki_generated = {
        k: v
        for k, v in wiki_generated.items()
        if not k.startswith(kuva_prefixes)
    }

    merged = {**wiki_generated, **MANUAL_OVERRIDES}
    merged = {k: v for k, v in merged.items() if k in catalog_ids}

    content = render_file(kuva_block, merged)
    PASSIVES_PATH.write_text(content, encoding="utf-8")

    kuva_ids = set(re.findall(r"^\s+([a-z0-9_]+):", kuva_block, re.M))
    covered = len({wid for wid in catalog_ids if wid in merged or wid in kuva_ids})

    print("=== build_weapon_passives ===")
    print(f"Wiki mapped (non-kuva): {len(wiki_generated)}")
    print(f"Manual overrides: {len(MANUAL_OVERRIDES)}")
    print(f"Final WIKI_PASSIVES entries: {len(merged)}")
    print(f"Kuva/Tenet/Coda entries: {len(kuva_ids)}")
    print(f"Catalog weapons with passive: {covered} / {len(catalog)}")
    print(f"Unmapped wiki names: {unmapped}")


if __name__ == "__main__":
    main()
