#!/usr/bin/env python3
"""Download missing mod PNGs from wiki Focus/Mods modules via File API."""
from __future__ import annotations

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
MODS_DIR = ROOT / "public/images/mods"
MODS_TS = ROOT / "src/data/mods.ts"
UA = {"User-Agent": "Voidforge/1.0 (https://void-forge.org)"}

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
    "Lethal Torment": "Lethal Torrent",
    "Bowling Buzzkill": "Seeker",
    "Pistol Aptitude": "Galvanized Aptitude",
    "Melee Aptitude": "Galvanized Aptitude",
    "Shotgun Aptitude": "Galvanized Aptitude",
    "Gladiator Ailment": "Gladiator Resolve",
    "Aerial Assault": "Aerial Ace",
    "Crimson Orbit": "Crimson Dervish",
    "Rumbling Vault": "Iron Phoenix",
    "Frictional Strike": "Seismic Palm",
    "Buzzing Sting": "Shimmering Blight",
    "Fencing Stance": "Vulpine Mask",
    "Sprint Speed": "Sprint Boost",
    "Venom Claws": "Sepsis Claws",
    "Shock Claws": "Static Discharge",
    "Viral Claws": "Sepsis Claws",
    "Blessing Share": "Abating Link",
    "Blood Siphon": "Dread Ward",
    "Miasmic Siphon": "Mending Splinters",
    "Safe Switch": "Safeguard Switch",
    "Tempest Rush": "Tidal Impunity",
    "Thrall Toll": "Thrall Pact",
    "Vigorous Preparation": "Vigorous Swap",
    "Sarafans Weave": "Sundering Weave",
    "Target Acquisition": "Target Acquired",
    "Ocular Sentry": "Eagle Eye",
    "Meditation": "Medi-Ray",
    "Tease": "Loyal Companion",
    "Transcending Retribution": "Tranquil Cleave",
    "Wrathful Clarity": "Wrath of Ukko",
    "Grave Keeper": "Spectral Spirit",
    "Hunter's Syndrome": "Hunter's Bonesaw",
}

MIN_GOOD_BYTES = 3000
WHITE_PLACEHOLDER_BYTES = 1820
WIKI_API = "https://wiki.warframe.com/api.php"
FANDOM_API = "https://warframe.fandom.com/api.php"

SKIP_MOD_NAMES = {
    "Incarnon Melee Evolution",
    "Incarnon Pistol Evolution",
    "Incarnon Rifle Evolution",
}

EXTRA_WIKI_FILES_BY_MOD_NAME: dict[str, list[str]] = {
    "Chyrinka Pillar Augment": ["ChyrinkaPillarModx256.png", "ChyrinkaPillarMod.png"],
    "Lethal Progeny Augment": ["LethalProgenyModx256.png", "LethalProgenyMod.png"],
    "Wrathful Clarity": ["WrathofUkkoMod.png"],
}


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


def load_mod_names() -> list[str]:
    text = MODS_TS.read_text(encoding="utf-8")
    names: list[str] = []
    for block in re.finditer(r"\{[^{}]*\"name\":\s*\"([^\"]+)\"[^{}]*\"category\":\s*\"([^\"]+)\"[^{}]*\}", text):
        name, category = block.group(1), block.group(2)
        if category == "evolution":
            continue
        names.append(name)
    if not names:
        names = [m.group(1) for m in re.finditer(r'"name":\s*"([^"]+)"', text)]
    return names


def fetch_wiki_module(title: str) -> str:
    params = urllib.parse.urlencode(
        {
            "action": "query",
            "titles": title,
            "prop": "revisions",
            "rvprop": "content",
            "rvslots": "main",
            "format": "json",
        }
    )
    data = json.loads(
        urllib.request.urlopen(urllib.request.Request(f"{WIKI_API}?{params}", headers=UA), timeout=90).read()
    )
    page = next(iter(data["query"]["pages"].values()))
    return page["revisions"][0]["slots"]["main"]["*"]


def parse_lua_entries(text: str) -> dict[str, list[str]]:
    """Parse Name -> Image/Icon filenames from wiki lua tables."""
    out: dict[str, list[str]] = {}
    for m in re.finditer(r'\["([^"]+)"\]\s*=\s*\{([\s\S]*?)\n\t\t\},', text):
        name = m.group(1)
        body = m.group(2)
        files: list[str] = []
        for field in ("Image", "Icon"):
            im = re.search(rf'{field}\s*=\s*"([^"]+)"', body)
            if im and im.group(1) not in files:
                files.append(im.group(1))
        if not files:
            continue
        out.setdefault(name.lower(), [])
        for f in files:
            if f not in out[name.lower()]:
                out[name.lower()].append(f)
        link = re.search(r'Link\s*=\s*"([^"]+)"', body)
        if link:
            out.setdefault(link.group(1).lower(), [])
            for f in files:
                if f not in out[link.group(1).lower()]:
                    out[link.group(1).lower()].append(f)
    return out


def guess_files(display_name: str) -> list[str]:
    compact = display_name.replace(" ", "").replace("'", "")
    unders = display_name.replace(" ", "_")
    focus = f"Focus{compact}.png"
    return list(
        dict.fromkeys(
            [
                f"{compact}Mod.png",
                f"{compact}.png",
                f"{unders}Mod.png",
                f"{unders}.png",
                focus,
            ]
        )
    )


_file_url_cache: dict[str, str | None] = {}


def wiki_file_url(file_name: str) -> str | None:
    if file_name in _file_url_cache:
        return _file_url_cache[file_name]
    for api in (WIKI_API, FANDOM_API):
        params = urllib.parse.urlencode(
            {
                "action": "query",
                "titles": f"File:{file_name}",
                "prop": "imageinfo",
                "iiprop": "url|size",
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
                info = page.get("imageinfo", [{}])[0]
                url = info.get("url")
                size = info.get("size", 0)
                if url and size and size >= MIN_GOOD_BYTES and size != WHITE_PLACEHOLDER_BYTES:
                    _file_url_cache[file_name] = url
                    return url
        except OSError:
            pass
    _file_url_cache[file_name] = None
    return None


def fetch_bytes(url: str) -> bytes | None:
    try:
        req = urllib.request.Request(url, headers=UA)
        with urllib.request.urlopen(req, timeout=25) as resp:
            data = resp.read()
            if len(data) < MIN_GOOD_BYTES:
                return None
            if len(data) == WHITE_PLACEHOLDER_BYTES and data[:3] == b"\xff\xd8\xff":
                return None
            return data
    except (urllib.error.URLError, OSError, TimeoutError):
        return None


def to_png_bytes(data: bytes) -> bytes | None:
    if data[:8] == b"\x89PNG\r\n\x1a\n":
        return data
    if Image is None:
        return None
    try:
        img = Image.open(io.BytesIO(data))
        buf = io.BytesIO()
        img.convert("RGBA").save(buf, format="PNG")
        return buf.getvalue()
    except OSError:
        return None


def candidate_files(mod_name: str, wiki_images: dict[str, list[str]]) -> list[str]:
    lookup = WIKI_NAME_BY_MOD_NAME.get(mod_name, mod_name)
    files: list[str] = []
    for f in [
        *EXTRA_WIKI_FILES_BY_MOD_NAME.get(mod_name, []),
        *wiki_images.get(lookup.lower(), []),
        *wiki_images.get(mod_name.lower(), []),
        *guess_files(lookup),
    ]:
        if f not in files:
            files.append(f)
    return files


def main() -> int:
    if Image is None:
        print("Pillow is required")
        return 1

    print("Fetching wiki Focus + Mods image index...")
    focus_images = parse_lua_entries(fetch_wiki_module("Module:Focus/data"))
    mod_images = parse_lua_entries(fetch_wiki_module("Module:Mods/data"))
    wiki_images = {**mod_images, **focus_images}
    print(f"Indexed images: {len(wiki_images)} entries")

    existing = {p.stem for p in MODS_DIR.glob("*.png")}
    missing = sorted(
        {
            name
            for name in load_mod_names()
            if name not in SKIP_MOD_NAMES and mod_png_stem(name) not in existing
        }
    )
    print(f"Missing mod PNGs: {len(missing)}\n")

    downloaded = 0
    failed: list[str] = []
    for name in missing:
        stem = mod_png_stem(name)
        dest = MODS_DIR / f"{stem}.png"
        ok = False
        for file_name in candidate_files(name, wiki_images):
            url = wiki_file_url(file_name)
            if not url:
                continue
            raw = fetch_bytes(url)
            if not raw:
                continue
            png = to_png_bytes(raw)
            if not png:
                continue
            dest.write_bytes(png)
            downloaded += 1
            print(f"  OK {name} -> {stem}.png ({file_name})")
            ok = True
            break
        if not ok:
            failed.append(name)

    print(f"\nDownloaded: {downloaded}")
    print(f"Still missing: {len(failed)}")
    for item in failed:
        print(f"  {item}")
    return len(failed)


if __name__ == "__main__":
    raise SystemExit(main())
