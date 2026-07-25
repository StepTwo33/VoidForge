#!/usr/bin/env python3
"""Generate src/lib/mods/companion-precept-eligibility.ts from companions + mod ids."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
COMPANIONS_TS = ROOT / "src/data/companions.ts"
MODS_TS = ROOT / "src/data/mods.ts"
OUT = ROOT / "src/lib/mods/companion-precept-eligibility.ts"

# Sentinel precepts equippable on any sentinel (true universals / shared robotic).
SENTINEL_UNIVERSAL = {
    "anti_grav_array",
    "auto_omni",
    "calculated_shot",
    "coolant_leak",
    "crowd_dispersion",
    "detect_vulnerability",
    "electro_pulse",
    "guardian",
    "looter",
    "martyr_symbiosis",
    "medi_ray",
    "melee_prowess_sentinel",
    "molecular_conversion",
    "negate",
    "odomedic",
    "primed_regen",
    "reawaken",
    "regen",
    "sacrifice",
    "shield_charger",
    "target_acquisition",
    "targeting_receptor",
    "tease",
    "thumper",
    "vacuum",
}

# Beast precepts equippable on kubrow, kavat, predasite, and vulpaphyla.
BEAST_UNIVERSAL = {
    "fetch",
}

# Precept mod id -> companion type (family). Non-sentinel families share all precepts within type.
FAMILY: dict[str, str] = {
    # Kubrow
    "dig": "kubrow",
    "ferocity": "kubrow",
    "howl": "kubrow",
    "hunt": "kubrow",
    "neutralize": "kubrow",
    "protect": "kubrow",
    "retrieve": "kubrow",
    "savagery": "kubrow",
    "stalk": "kubrow",
    "trample": "kubrow",
    "unleashed": "kubrow",
    "helminth_ferocity": "kubrow",
    "helminth_hunt": "kubrow",
    "scavenge": "kubrow",
    # Kavat
    "cats_eye": "kavat",
    "charm": "kavat",
    "draining_bite": "kavat",
    "fear_sense": "kavat",
    "reflect": "kavat",
    "transfusion": "kavat",
    "pounce": "kavat",
    "sense_danger": "kavat",
    "mischief": "kavat",
    "proboscis": "kavat",
    "territorial_aggression_r3": "kavat",
    # MOA
    "anti_grav_grenade": "moa",
    "blast_shield": "moa",
    "hard_engage": "moa",
    "security_override": "moa",
    "shockwave_actuators": "moa",
    "shockwave_actuators_r3": "moa",
    "stasis_field": "moa",
    "tractor_beam": "moa",
    "whiplash_mine": "moa",
    "whiplash_mine_r3": "moa",
    # Hound
    "aerial_prospectus": "hound",
    "diversified_denial": "hound",
    "equilibrium_audit": "hound",
    "evasive_denial": "hound",
    "focused_prospectus": "hound",
    "null_audit": "hound",
    "reflex_denial": "hound",
    "synergized_prospectus": "hound",
    "repo_audit": "hound",
    # Predasite
    "acidic_spittle": "predasite",
    "anabolic_pollination": "predasite",
    "endoparasitic_vector": "predasite",
    "iatric_mycelium": "predasite",
    "infectious_bite": "predasite",
    "paralytic_spores": "predasite",
    "volatile_parasite": "predasite",
    # Vulpaphyla
    "crescent_charge": "vulpaphyla",
    "crescent_devolution": "vulpaphyla",
    "panzer_devolution": "vulpaphyla",
    "sly_devolution": "vulpaphyla",
    "survival_instinct": "vulpaphyla",
    "viral_quills": "vulpaphyla",
}

# Breed-specific sentinel precepts (overrides companion-precept string parse).
MANUAL_SENTINEL_EXCLUSIVE: dict[str, list[str]] = {
    "ammo_case": ["carrier", "carrier_prime"],
    "arc_coil": ["diriga"],
    "botanist": ["oxylus"],
    "cordon": ["nautilus", "nautilus_prime"],
    "energy_generator": ["dethcube", "dethcube_prime"],
    "fatal_attraction": ["djinn"],
    "ghost": ["prisma_shade", "shade", "shade_prime"],
    "investigator": ["helios", "helios_prime"],
    "scan_aquatic": ["oxylus"],
    "scan_matter": ["oxylus"],
    "vaporize": ["dethcube", "dethcube_prime"],
}


def load_companions() -> list[dict]:
    text = COMPANIONS_TS.read_text(encoding="utf-8")
    return json.loads(re.search(r"export const allCompanions: Companion\[\] = (\[[\s\S]*?\n\]);", text).group(1))


def load_mods() -> list[dict]:
    text = MODS_TS.read_text(encoding="utf-8")
    match = re.search(r"(?:const RAW_MODS|export const allMods): Mod\[\] = (\[[\s\S]*?\n\]);", text)
    if not match:
        raise RuntimeError(f"Could not parse mod array from {MODS_TS}")
    raw = match.group(1)
    # Strip JS line comments that appear inside RAW_MODS.
    raw = re.sub(r"//.*?$", "", raw, flags=re.MULTILINE)
    raw = re.sub(r",\s*}", "}", raw)
    raw = re.sub(r",\s*]", "]", raw)
    return json.loads(raw)


def name_to_id(name: str, mods_by_name: dict[str, str]) -> str | None:
    key = name.strip().lower()
    if key in mods_by_name:
        return mods_by_name[key]
    for n, mid in mods_by_name.items():
        if n.startswith(key) or key.startswith(n):
            return mid
    return None


def main() -> None:
    mods = load_mods()
    companions = load_companions()
    mods_by_name = {m["name"].lower(): m["id"] for m in mods}
    precepts = [
        m for m in mods
        if m.get("category") == "companion"
        and m.get("polarity") == "penjaga"
        and m.get("subCategory") != "riven"
        and not m["id"].startswith("historic_")
    ]
    precept_ids = {m["id"] for m in precepts}

    ids_by_type: dict[str, list[str]] = {}
    for c in companions:
        ids_by_type.setdefault(c["type"], []).append(c["id"])

    # Sentinel breed-specific defaults from companion data.
    sentinel_exclusive: dict[str, set[str]] = {}
    for c in companions:
        if c["type"] != "sentinel":
            continue
        precept_str = c.get("precept") or ""
        for part in re.split(r"\s+and\s+|\s*,\s*", precept_str):
            name = part.split(" - ")[0].strip()
            if not name:
                continue
            mid = name_to_id(name, mods_by_name)
            if mid:
                sentinel_exclusive.setdefault(mid, set()).add(c["id"])

    for mid, ids in MANUAL_SENTINEL_EXCLUSIVE.items():
        if mid in precept_ids:
            sentinel_exclusive[mid] = set(ids)

    eligibility: dict[str, list[str]] = {}
    unmapped: list[str] = []

    for m in precepts:
        mid = m["id"]
        fam = FAMILY.get(mid)

        if mid in MANUAL_SENTINEL_EXCLUSIVE and mid in sentinel_exclusive:
            eligibility[mid] = sorted(sentinel_exclusive[mid])
            continue

        if fam and fam != "sentinel":
            type_ids = ids_by_type.get(fam, [])
            if type_ids:
                eligibility[mid] = sorted(type_ids)
            else:
                unmapped.append(mid)
            continue

        if mid in SENTINEL_UNIVERSAL:
            eligibility[mid] = sorted(ids_by_type.get("sentinel", []))
            continue

        if mid in BEAST_UNIVERSAL:
            beast_ids: list[str] = []
            for beast_type in ("kubrow", "kavat", "predasite", "vulpaphyla"):
                beast_ids.extend(ids_by_type.get(beast_type, []))
            eligibility[mid] = sorted(set(beast_ids))
            continue

        if mid in sentinel_exclusive:
            eligibility[mid] = sorted(sentinel_exclusive[mid])
            continue

        if m.get("subCategory") == "robotic":
            eligibility[mid] = sorted(ids_by_type.get("sentinel", []))
            continue

        unmapped.append(mid)

    lines = [
        "/**",
        " * Which companions can equip each penjaga precept in the builder.",
        " * Codex lists all precepts regardless — only the builder filters by this map.",
        " *",
        " * Regenerate: python scripts/generate_companion_precept_eligibility.py",
        " */",
        "",
        'import type { Companion, Mod } from "@/lib/types";',
        "import {",
        "  isCompanionPrecept,",
        '} from "@/lib/mods/companion-augment-mods";',
        "",
        "/** Companion ids that may equip each precept mod in the builder. */",
        "export const COMPANION_PRECEPT_COMPANION_IDS: Readonly<Record<string, readonly string[]>> = {",
    ]
    for mid in sorted(eligibility.keys()):
        ids = eligibility[mid]
        lines.append(f'  "{mid}": {json.dumps(ids)},')
    lines.append("} as const;")
    lines.extend([
        "",
        "/** Precept with per-companion eligibility data (companion builder). */",
        "export function isCataloguedCompanionPrecept(",
        '  mod: Pick<Mod, "id" | "category" | "polarity">,',
        "): boolean {",
        "  return isCompanionPrecept(mod) && mod.id in COMPANION_PRECEPT_COMPANION_IDS;",
        "}",
        "",
        "const preceptCompanionIdSet = new Map<string, ReadonlySet<string>>(",
        "  Object.entries(COMPANION_PRECEPT_COMPANION_IDS).map(([id, ids]) => [id, new Set(ids)]),",
        ");",
        "",
        "/** True when a penjaga precept can be equipped on this companion in the builder. */",
        "export function companionPreceptEligibleForCompanion(",
        '  companion: Pick<Companion, "id" | "type">,',
        '  mod: Pick<Mod, "id" | "category" | "polarity">,',
        "): boolean {",
        "  if (!isCataloguedCompanionPrecept(mod)) return true;",
        "  const allowed = preceptCompanionIdSet.get(mod.id);",
        "  if (!allowed) return false;",
        "  return allowed.has(companion.id);",
        "}",
        "",
        "/** Precept mods eligible for this companion (companion builder precept slots). */",
        "export function companionPreceptModsForBuilder(",
        '  companion: Pick<Companion, "id" | "type">,',
        "  mods: readonly Mod[],",
        "): Mod[] {",
        "  return mods.filter(",
        "    (m) =>",
        "      isCataloguedCompanionPrecept(m)",
        "      && companionPreceptEligibleForCompanion(companion, m),",
        "  );",
        "}",
        "",
        "/** Stat mods for companion builder (excludes catalogued precepts). */",
        "export function companionStatModsForBuilder(",
        '  companion: Pick<Companion, "id" | "type">,',
        "  mods: readonly Mod[],",
        "  subCategories: readonly string[],",
        "): Mod[] {",
        "  return mods.filter((m) => {",
        '    if (m.category !== "companion") return false;',
        "    if (isCataloguedCompanionPrecept(m)) return false;",
        "    if (isCompanionPrecept(m)) return false;",
        "    return !m.subCategory || subCategories.includes(m.subCategory);",
        "  });",
        "}",
        "",
        "/** Filter companion mods for the builder (excludes ineligible precepts). */",
        "export function companionModEligibleInBuilder(",
        '  companion: Pick<Companion, "id" | "type">,',
        "  mod: Mod,",
        "  subCategories: readonly string[],",
        "): boolean {",
        '  if (mod.category !== "companion") return false;',
        "  if (isCataloguedCompanionPrecept(mod)) {",
        "    return companionPreceptEligibleForCompanion(companion, mod);",
        "  }",
        "  if (isCompanionPrecept(mod)) return false;",
        "  return !mod.subCategory || subCategories.includes(mod.subCategory);",
        "}",
        "",
    ])

    OUT.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Wrote {OUT} ({len(eligibility)} precepts mapped)")
    if unmapped:
        print(f"UNMAPPED ({len(unmapped)}):")
        for mid in sorted(unmapped):
            m = next(x for x in precepts if x["id"] == mid)
            print(f"  {mid}: {m['name']}")


if __name__ == "__main__":
    main()
