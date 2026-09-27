#!/usr/bin/env python3
"""Repair only blank white mod placeholders and missing codex images."""
from __future__ import annotations

import hashlib
import io
import json
import re
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    Image = None  # type: ignore[misc, assignment]

ROOT = Path(__file__).resolve().parents[1]
UA = {"User-Agent": "Voidforge/1.0 (https://void-forge.org)"}
MODS_DIR = ROOT / "public/images/mods"
WEAPONS_DIR = ROOT / "public/images/weapons"
ARCANES_DIR = ROOT / "public/images/arcanes"

MOD_IMAGE_STEM_BY_NAME = {
    "Endless Lull": "Endless_Lullaby",
    "Flame Claws": "Heated_Charge",
    "Frost Claws": "Chilling_Claws",
    "Looters": "Looter",
    "ReactivStorm": "Reactive_Storm",
    "Berserker": "Berserker_Fury",
    "Aero Set Bonus": "Hawksetmod",
    "Carnis Set Bonus": "Ashensetmod",
    "Jugulus Set Bonus": "Bonebladesetmod",
    "Motus Set Bonus": "Raptorsetmod",
    "Proton Set Bonus": "Spidersetmod",
    "Saxum Set Bonus": "Femursetmod",
    "Vigilante Offensive": "Vigilante_Offense",
    "Lethal Torment": "Lethal_Torrent",
    "Bowling Buzzkill": "Seeker",
    "Pistol Aptitude": "Galvanized_Aptitude",
    "Melee Aptitude": "Galvanized_Aptitude",
    "Shotgun Aptitude": "Galvanized_Aptitude",
    "Gladiator Ailment": "Gladiator_Resolve",
    "Aerial Assault": "Aerial_Ace",
    "Crimson Orbit": "Crimson_Dervish",
    "Rumbling Vault": "Iron_Phoenix",
    "Frictional Strike": "Seismic_Palm",
    "Buzzing Sting": "Shimmering_Blight",
    "Fencing Stance": "Vulpine_Mask",
    "Sprint Speed": "Sprint_Boost",
    "Venom Claws": "Sepsis_Claws",
    "Shock Claws": "Static_Discharge",
    "Viral Claws": "Sepsis_Claws",
    "Scan Organic Lifeforms": "Scan_Aquatic_Lifeforms",
    "Blessing Share": "Abating_Link",
    "Blood Siphon": "Dread_Ward",
    "Miasmic Siphon": "Mending_Splinters",
    "Safe Switch": "Safeguard_Switch",
    "Tempest Rush": "Tidal_Impunity",
    "Thrall Toll": "Thrall_Pact",
    "Vigorous Preparation": "Vigorous_Swap",
    "Sarafans Weave": "Sundering_Weave",
    "Target Acquisition": "Target_Acquired",
    "Ocular Sentry": "Eagle_Eye",
    "Meditation": "Medi-Ray",
    "Tease": "Loyal_Companion",
    "Transcending Retribution": "Tranquil_Cleave",
    "Chyrinka Pillar Augment": "Chyrinka_Pillar",
    "Lethal Progeny Augment": "Lethal_Progeny",
    "Wrathful Clarity": "Wrath_Of_Ukko",
    "Grave Keeper": "Spectral_Spirit",
    "Hunter's Syndrome": "Hunters_Bonesaw",
}
MOD_STEM_SMALL_WORDS = {"of", "the", "and"}
WIKI_NAME_BY_MOD_NAME = {
    "Warding Halo Augment": "Warding Thurible",
    "Mesmer Skin Augment": "Mesmer Shield",
    "Dispensary Augment": "Repair Dispensary",
    "Gloom Augment": "Draining Gloom",
    "Prismatic Shield Augment": "Prismatic Companion",
    "Lethal Progeny Augment": "Lethal Progeny",
    "Chyrinka Pillar Augment": "Chyrinka Pillar",
    "Scan Organic Lifeforms": "Scan Aquatic Lifeforms",
    "Vigilante Offensive": "Vigilante Offense",
    "Wrathful Clarity": "Wrath of Ukko",
}
WEAPON_IMAGE_STEM_BY_NAME = {
    "Coda Bubonico": "Bubonico",
    "Kuva Ghoulsaw": "Ghoulsaw",
    "Tenet Quanta": "Quanta",
    "Perigale Prime": "Perigale",
    "Afentis Prime": "Afentis",
    "Athodai Prime": "Athodai",
    "Sarofang Prime": "Sarofang",
    "Ax-52": "Ax-52",
    "Efv-5 Jupiter": "Efv-5_Jupiter",
    "Efv-8 Mars": "Efv-8_Mars",
}

MIN_GOOD_BYTES = 3000
WHITE_PLACEHOLDER_BYTES = 1820


def mod_png_stem(name: str) -> str:
    if name in MOD_IMAGE_STEM_BY_NAME:
        return MOD_IMAGE_STEM_BY_NAME[name]
    set_bonus = re.match(r"^(\w+) Set Bonus$", name)
    if set_bonus:
        return f"{set_bonus.group(1)}setmod"
    riven = re.match(r"^Riven Mod \((.+)\)$", name)
    if riven:
        return f"{riven.group(1).replace(' ', '_')}_Riven_Mod"
    claw = re.match(r"^(.+) \(Claws\)$", name)
    if claw:
        return claw.group(1).replace(" ", "_")
    parts = name.replace(" ", "_").split("_")
    out: list[str] = []
    for index, word in enumerate(parts):
        if not word:
            out.append(word)
            continue
        if index > 0 and word.lower() in MOD_STEM_SMALL_WORDS:
            out.append(word[0].upper() + word[1].lower())
        elif word == word.upper() and len(word) <= 4:
            out.append(word[0] + word[1].lower() if len(word) > 1 else word)
        else:
            out.append(word)
    return "_".join(out)


def weapon_stem(name: str) -> str:
    return (WEAPON_IMAGE_STEM_BY_NAME.get(name) or name).replace(" ", "_")


def arcane_stem(name: str) -> str:
    return name.replace(" ", "_")


def load_mod_names() -> list[str]:
    text = (ROOT / "src/data/mods.ts").read_text(encoding="utf-8")
    return [m.group(1) for m in re.finditer(r'"name":\s*"([^"]+)"', text)]


def extract_names(file: str) -> list[str]:
    data = (ROOT / file).read_text(encoding="utf-8")
    return [m.group(1) for m in re.finditer(r'(?:name|"name"):\s*"([^"]+)"', data)]


def is_white_placeholder(path: Path) -> bool:
    if not path.is_file():
        return False
    data = path.read_bytes()
    return len(data) == WHITE_PLACEHOLDER_BYTES and data[:3] == b"\xff\xd8\xff"


def needs_repair(path: Path) -> bool:
    if not path.is_file():
        return True
    return is_white_placeholder(path)


def parse_wiki_images(text: str) -> dict[str, str]:
    out: dict[str, str] = {}
    for m in re.finditer(r'\["([^"]+)"\]\s*=\s*\{([\s\S]*?)\n\t\t\},', text):
        body = m.group(2)
        name = m.group(1)
        im = re.search(r'Image\s*=\s*"([^"]+)"', body)
        if im:
            out[name.lower()] = im.group(1)
        link = re.search(r'Link\s*=\s*"([^"]+)"', body)
        if link and im:
            out.setdefault(link.group(1).lower(), im.group(1))
    return out


def download_wiki_mods() -> str:
    params = urllib.parse.urlencode(
        {
            "action": "query",
            "titles": "Module:Mods/data",
            "prop": "revisions",
            "rvprop": "content",
            "rvslots": "main",
            "format": "json",
        }
    )
    data = json.loads(
        urllib.request.urlopen(urllib.request.Request(f"https://wiki.warframe.com/api.php?{params}", headers=UA), timeout=60).read()
    )
    page = next(iter(data["query"]["pages"].values()))
    return page["revisions"][0]["slots"]["main"]["*"]


def fetch_bytes(url: str) -> bytes | None:
    try:
        req = urllib.request.Request(url, headers=UA)
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = resp.read()
            if len(data) < MIN_GOOD_BYTES:
                return None
            if len(data) == WHITE_PLACEHOLDER_BYTES and data[:3] == b"\xff\xd8\xff":
                return None
            return data
    except (urllib.error.URLError, OSError, TimeoutError):
        return None


def to_png_bytes(data: bytes) -> bytes | None:
    if data[:8] == b"\x89PNG\r\n\x1a\n" and len(data) >= MIN_GOOD_BYTES:
        return data
    if Image is None:
        return None
    try:
        img = Image.open(io.BytesIO(data))
        buf = io.BytesIO()
        img.convert("RGBA").save(buf, format="PNG")
        out = buf.getvalue()
        return out if len(out) >= MIN_GOOD_BYTES else None
    except OSError:
        return None


def wiki_image_url(image_name: str) -> str:
    return f"https://wiki.warframe.com/images/{urllib.parse.quote(image_name)}"


def wiki_file_url(file_name: str) -> str | None:
    for api in ("https://wiki.warframe.com/api.php", "https://warframe.fandom.com/api.php"):
        params = urllib.parse.urlencode(
            {
                "action": "query",
                "titles": f"File:{file_name}",
                "prop": "imageinfo",
                "iiprop": "url",
                "format": "json",
            }
        )
        try:
            data = json.loads(
                urllib.request.urlopen(urllib.request.Request(f"{api}?{params}", headers=UA), timeout=20).read()
            )
            for page in data["query"]["pages"].values():
                if page.get("missing") is not None:
                    continue
                url = page.get("imageinfo", [{}])[0].get("url")
                if url:
                    return url
        except OSError:
            pass
    return None


def guess_wiki_image_names(display_name: str) -> list[str]:
    compact = display_name.replace(" ", "").replace("'", "")
    unders = display_name.replace(" ", "_")
    hyphen = display_name.replace(" ", "-")
    return list(
        dict.fromkeys(
            [
                f"{compact}Mod.png",
                f"{compact}.png",
                f"{unders}Mod.png",
                f"{unders}.png",
                f"{hyphen}Mod.png",
                f"{hyphen}.png",
            ]
        )
    )


def resolve_mod_source(mod_name: str, wiki_images: dict[str, str]) -> tuple[str, str] | None:
    lookup = WIKI_NAME_BY_MOD_NAME.get(mod_name, mod_name)
    wiki_img = wiki_images.get(lookup.lower())
    if wiki_img:
        return ("wiki_module", wiki_image_url(wiki_img))
    for guess in guess_wiki_image_names(lookup):
        url = wiki_file_url(guess)
        if url:
            return ("wiki_file", url)
    return None


def weapon_patterns(name: str) -> list[str]:
    clean = name.replace("(", "").replace(")", "").replace(" ", "").replace("&", "And").replace("-", "")
    underscored = name.replace(" ", "_")
    return list(
        dict.fromkeys(
            [
                f"{clean}.png",
                f"{underscored}.png",
                f"{clean}DEIcon.png",
                f"{clean}Icon.png",
                f"DEWeapon{clean}.png",
                f"{name.replace(' ', '')}.png",
            ]
        )
    )


def arcane_patterns(name: str) -> list[str]:
    compact = name.replace(" ", "")
    unders = name.replace(" ", "_")
    no_hyphen = name.replace(" ", "").replace("-", "")
    return list(
        dict.fromkeys(
            [
                f"{compact}.png",
                f"{unders}.png",
                f"{no_hyphen}.png",
                f"{compact}Mod.png",
                f"{unders}Mod.png",
            ]
        )
    )


def weapon_resolve(name: str) -> tuple[str, str] | None:
    extras: dict[str, list[str]] = {
        "Landslide Fists": ["Landslide130(xWhite).png", "Landslide130%28xWhite%29.png"],
        "Landslide Fists Prime": ["Landslide130Prime(xWhite).png"],
    }
    for pat in [*extras.get(name, []), *weapon_patterns(name)]:
        url = wiki_file_url(pat)
        if url:
            return (f"wiki_file_{pat}", url)
    return None


def download_to(path: Path, kind: str, url: str) -> bool:
    raw = fetch_bytes(url)
    if not raw:
        return False
    png = to_png_bytes(raw)
    if not png:
        return False
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(png)
    print(f"  OK {path.relative_to(ROOT)} ({kind})")
    return True


def main() -> int:
    if Image is None:
        print("Pillow is required: pip install Pillow")
        return 1

    print("Scanning for white placeholder mods...")
    white_paths = [p for p in MODS_DIR.glob("*.png") if is_white_placeholder(p)]
    print(f"Found {len(white_paths)} white placeholder mod images")

    deleted = 0
    for path in white_paths:
        path.unlink()
        deleted += 1
    if deleted:
        print(f"Deleted {deleted} white placeholder files (no public art available yet)")

    mod_repaired = 0
    mod_failed: list[str] = []

    weapon_names = sorted(set([*extract_names("src/data/weapons.ts"), *extract_names("src/data/custom-items.ts")]))
    weapon_repaired = 0
    weapon_failed: list[str] = []
    print("\nRepairing missing weapon images...")
    for name in weapon_names:
        dest = WEAPONS_DIR / f"{weapon_stem(name)}.png"
        if not needs_repair(dest):
            continue
        source = weapon_resolve(name)
        if not source:
            weapon_failed.append(name)
            print(f"  -- {name} (no source)")
            continue
        kind, url = source
        if download_to(dest, kind, url):
            weapon_repaired += 1
        else:
            weapon_failed.append(name)
            print(f"  -- {name} (download failed)")
        time.sleep(0.05)

    arcane_names = extract_names("src/data/arcanes.ts")
    arcane_repaired = 0
    arcane_failed: list[str] = []
    print("\nRepairing missing arcane images...")
    for name in arcane_names:
        dest = ARCANES_DIR / f"{arcane_stem(name)}.png"
        if not needs_repair(dest):
            continue
        source = next(
            ((f"wiki_file_{pat}", url) for pat in arcane_patterns(name) if (url := wiki_file_url(pat))),
            None,
        )
        if not source:
            arcane_failed.append(name)
            print(f"  -- {name} (no source)")
            continue
        kind, url = source
        if download_to(dest, kind, url):
            arcane_repaired += 1
        else:
            arcane_failed.append(name)
            print(f"  -- {name} (download failed)")
        time.sleep(0.05)

    remaining_white = sum(1 for p in MODS_DIR.glob("*.png") if is_white_placeholder(p))
    print(f"\nRepaired: {mod_repaired} mods, {weapon_repaired} weapons, {arcane_repaired} arcanes")
    print(f"Remaining white placeholders: {remaining_white}")
    print(f"Still failed: {len(mod_failed)} mods, {len(weapon_failed)} weapons, {len(arcane_failed)} arcanes")
    for label, failed in (("mods", mod_failed), ("weapons", weapon_failed), ("arcanes", arcane_failed)):
        if failed:
            print(f"\nFailed {label}:")
            for item in failed:
                print(f"  {item!r}")

    return remaining_white + len(weapon_failed) + len(arcane_failed)


if __name__ == "__main__":
    raise SystemExit(main())
