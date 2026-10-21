#!/usr/bin/env python3
"""
Generate src/data/innate-polarities.ts from WFCD warframe-items (npm @wfcd/items data/json).

Usage: python3 scripts/gen_innate_polarities.py <wfcd-items>/data/json <vf-items.json> [fandom.json] [wikigg.json]

<vf-items.json> is a dump of Voidforge ids/names ({warframes, weapons, companions, archwings,
necramechs}: [{id, name}]); items are matched by normalized display name. WFCD lists innate
polarities per item but not their slot positions; Voidforge places them on the first regular
slots in listed order (see src/lib/builds/innate-polarities.ts).
Optional [fandom.json] ({name: {slots, aura, exilus, stance}} extracted from the fandom wiki's
Module:Warframes/data, Module:Weapons/data/* and Module:Companions/data): any field where the two
sources disagree is dropped (and reported) unless the optional [wikigg.json] (same shape, read from
wiki.warframe.com item infoboxes) sides with one of them: 2 of 3 sources agreeing wins.
Fields missing on the wiki are kept from WFCD.
Weapon `exilusPolarity` in WFCD is not used: weapon Exilus slots have no innate polarity in game.
"""
import json, re, sys

src, vf_path = sys.argv[1], sys.argv[2]
vf = json.load(open(vf_path))
fandom = json.load(open(sys.argv[3])) if len(sys.argv) > 3 else {}
wikigg = json.load(open(sys.argv[4])) if len(sys.argv) > 4 else {}
checked = {"agree": 0, "unverified": 0, "dropped": 0}
VALID = {"madurai", "vazarin", "naramon", "zenurik", "unairu", "penjaga", "umbra", "universal"}

ALIASES = {"orion and sirius": "sirius and orion", "valkyr prime talons": "valkyr talons prime"}

def norm(n):
    k = re.sub(r"[^a-z0-9]+", " ", n.lower().replace("&", "and")).strip()
    return ALIASES.get(k, k)

def load(name):
    return json.load(open(f"{src}/{name}.json"))

def clean(pols):
    out = [p for p in (pols or []) if p in VALID]
    return out

entries = {}
unmatched = []
conflicts = []
ambiguous = set()
wiki_verified = set()

def add(group, vf_list, wfcd_items, fields):
    by_name = {}
    for it in vf_list:
        by_name.setdefault(norm(it["name"]), []).append(it["id"])
    for w in wfcd_items:
        rec = {}
        slots = clean(w.get("polarities"))
        if slots:
            rec["slots"] = slots
        aura = w.get("aura") if "aura" in fields else None
        auras = [a if a in VALID else None for a in (aura if isinstance(aura, list) else [aura])]
        if auras and auras[0]:
            rec["aura"] = auras[0]
        if len(auras) > 1 and auras[1]:
            rec["aura2"] = auras[1]  # Jade's second Aura slot
        if "exilus" in fields and w.get("exilusPolarity") in VALID:
            rec["exilus"] = w["exilusPolarity"]
        if "stance" in fields and w.get("stancePolarity") in VALID:
            rec["stance"] = w["stancePolarity"]
        f = fandom.get(w["name"])
        if f is not None:
            for key in list(rec):
                if key == "slots":
                    other = sorted(p for p in (f.get("slots") or []) if p)
                    mine = sorted(rec["slots"])
                    known = f.get("slots") is not None
                elif key == "aura2":
                    fa = f.get("aura") or []
                    known, other, mine = True, (fa[1] if len(fa) > 1 else None), rec[key]
                else:
                    fv = f.get(key)
                    known, other, mine = fv is not None, (fv[0] if fv else None), rec[key]
                if not known:
                    checked["unverified"] += 1
                elif other == mine:
                    checked["agree"] += 1
                else:
                    g = wikigg.get(w["name"], {})
                    if key == "slots":
                        gv = sorted(p for p in (g.get("slots") or []) if p) if "slots" in g else "?"
                    elif key == "aura2":
                        # wiki.gg's infobox lists only Jade's polarized aura slot.
                        gv = mine if mine in (g.get("aura") or []) else "?"
                    else:
                        gv = (g.get(key) or [None])[0] if key in g else "?"
                    if gv == mine:
                        checked["agree"] += 1
                        conflicts.append(f"{group}:{w['name']} {key}: WFCD {mine} vs fandom {other}; wiki.gg {gv} -> kept WFCD")
                    elif gv == other and key != "slots":
                        checked["agree"] += 1
                        conflicts.append(f"{group}:{w['name']} {key}: WFCD {mine} vs fandom {other}; wiki.gg {gv} -> fandom")
                        if other is None:
                            del rec[key]
                        else:
                            rec[key] = other
                    else:
                        checked["dropped"] += 1
                        conflicts.append(f"{group}:{w['name']} {key}: WFCD {mine} vs fandom {other}; wiki.gg {gv} (dropped)")
                        del rec[key]
        else:
            checked["unverified"] += len(rec)
        if not rec:
            continue
        ids = by_name.get(norm(w["name"]))
        if ids and f is not None:
            for vid in ids:
                wiki_verified.add(f"{group}:{vid}")
        if not ids:
            unmatched.append(f"{group}: {w['name']}")
            continue
        for vid in ids:
            key = f"{group}:{vid}"
            if key in entries and entries[key] != rec:
                conflicts.append(f"{key}: ambiguous WFCD entries {entries[key]} vs {rec} (item left out)")
                ambiguous.add(key)
                continue
            entries[key] = rec

add("warframe", vf["warframes"], load("Warframes"), {"aura", "exilus"})
# Misc.json holds exalted weapons (Valkyr Talons, Exalted Blade, ...); only name matches are used.
weapons = load("Primary") + load("Secondary") + load("Melee") + load("Arch-Gun") + load("Arch-Melee") + load("SentinelWeapons")
_vf_weapon_names = {norm(w["name"]) for w in vf["weapons"]}
weapons += [w for w in load("Misc") if w.get("name") and norm(w["name"]) in _vf_weapon_names]
add("weapon", vf["weapons"], weapons, {"stance"})
add("companion", vf["companions"], load("Sentinels") + load("Pets"), set())
add("archwing", vf["archwings"], load("Archwing"), set())

for key in ambiguous:
    entries.pop(key, None)

# Necramechs live in WFCD Warframes.json; key them by the necramech builder's kind.
for n in vf.get("necramechs", []):
    rec = entries.pop(f"warframe:{n['id']}", None)
    if rec and rec.get("slots"):
        entries[f"necramech:{n['id']}"] = {"slots": rec["slots"]}

custom_skipped = []  # custom-items.ts entries are real items; sourced like everything else.

lines = [
    "/**",
    " * Innate (pre-Forma) slot polarities, generated by scripts/gen_innate_polarities.py from",
    " * WFCD warframe-items (@wfcd/items 1.1276.27, data/json), cross-checked against the fandom wiki",
    " * data modules (fields where the two disagree are left out). Do not edit by hand.",
    " * Keys are `<kind>:<voidforge id>`; `slots` are the regular-slot polarities in WFCD order",
    " * (WFCD does not record slot positions), `aura` / `exilus` / `stance` are the special slots.",
    " */",
    "export interface InnatePolarityEntry {",
    "  slots?: readonly string[];",
    "  aura?: string;",
    "  /** Second Aura slot (Jade). */",
    "  aura2?: string;",
    "  exilus?: string;",
    "  stance?: string;",
    "}",
    "",
    "export const INNATE_POLARITIES: Readonly<Record<string, InnatePolarityEntry>> = {",
]
for k in sorted(entries):
    lines.append(f"  {json.dumps(k)}: {json.dumps(entries[k], separators=(', ', ': '))},")
lines.append("};")
open("src/data/innate-polarities.ts", "w").write("\n".join(lines) + "\n")
report = {"entries": len(entries), "by_kind": {}, "fields": checked, "unmatched": unmatched, "conflicts": conflicts, "custom_items_skipped": custom_skipped}
for k in entries:
    g = k.split(":")[0]
    report["by_kind"][g] = report["by_kind"].get(g, 0) + 1
json.dump(report, open("/tmp/fb/innate-report.json", "w"), indent=1)
print(json.dumps({k: v for k, v in report.items() if k != "unmatched"}, indent=1), "unmatched:", len(unmatched))
