#!/usr/bin/env python3
"""Debug arcane stat parsing gaps."""
import json
import re
import urllib.parse
import urllib.request
from pathlib import Path

from generate_arcane_stats import fetch_wiki_arcanes, parse_stats, slugify, load_framehub_ids

wiki = fetch_wiki_arcanes()
ids = load_framehub_ids()
no_stats = []
for slug, data in sorted(wiki.items()):
    fid = ids.get(slug) or ids.get(f"arcane_{slug}")
    stats = parse_stats(data["description"], data["type"])
    if not stats:
        no_stats.append((fid or slug, data["name"], data["description"][:120].replace("\n", " | ")))

print(f"No parsed stats: {len(no_stats)}")
for item in no_stats[:30]:
    print(f"\n{item[0]} ({item[1]})")
    print(f"  {item[2]}")
