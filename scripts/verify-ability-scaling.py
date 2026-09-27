#!/usr/bin/env python3
"""
Fetch official wiki.warframe.com wikitext for abilities in the scaling registry.

Run from repo root:
  python scripts/verify-ability-scaling.py

Output: tmp-wiki-ability-verify.json (gitignored) — use to audit
src/lib/ability-scaling-registry.ts against wiki Ability templates.
"""
import json
import re
import time
import urllib.parse
import urllib.request

API = "https://wiki.warframe.com/api.php"
HEADERS = {"User-Agent": "Voidforge/1.0 (https://void-forge.org)"}

PAGES = [
    "Gravitic Slash", "Astral Shell", "Light's Sanctuary", "Event Horizon",
    "Shatter Shield", "Peacemaker", "Virulence", "Parasitic Link", "Ravenous",
    "Iron Skin", "Molt", "Toxic Lash", "Tharros Strike", "Rally Point", "Final Stand",
    "Speed", "Electric Shield", "Cloud Walker", "Defy", "Gloom", "Eclipse",
    "Self Portrait", "Plein Air", "Psychic Bolts",
]


def fetch_wikitext(title: str) -> str:
    params = urllib.parse.urlencode({
        "action": "parse",
        "page": title,
        "prop": "wikitext",
        "format": "json",
    })
    req = urllib.request.Request(f"{API}?{params}", headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = json.loads(resp.read().decode())
    if "error" in data:
        raise RuntimeError(data["error"].get("info", str(data["error"])))
    return data["parse"]["wikitext"]["*"]


def main():
    results = {}
    for page in PAGES:
        print(f"Fetching {page}...", flush=True)
        try:
            wt = fetch_wikitext(page)
            # Pull Ability template stat lines
            stat_lines = re.findall(
                r"\|([^|\n=]+?)\s*=\s*([^\n|]+)",
                wt,
            )
            relevant = [
                f"{k.strip()}: {v.strip()}"
                for k, v in stat_lines
                if re.search(
                    r"strength|duration|range|strip|reduction|radius|armor|shield|"
                    r"damage|slow|heal|regen|cap|bonus|multiplier|arc|width|javelin|"
                    r"maggot|energy|status|explosion|decoy|sanctuary|horizon",
                    k + v,
                    re.I,
                )
            ]
            results[page] = {
                "relevantStats": relevant[:60],
                "scalingNotes": [
                    m.group(0)
                    for m in re.finditer(
                        r"(?i)(ability strength|ability duration|ability range|"
                        r"scales with|does not scale|not affected by|cap(?:ped)? at \d+%|"
                        r"maximum of \d+%)",
                        wt,
                    )
                ][:30],
                "excerpt": wt[:3000],
            }
        except Exception as e:
            results[page] = {"error": str(e)}
        time.sleep(0.35)

    out = "tmp-wiki-ability-verify.json"
    with open(out, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    print(f"Wrote {out}")


if __name__ == "__main__":
    main()
