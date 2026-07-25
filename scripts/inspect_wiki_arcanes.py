#!/usr/bin/env python3
import json
import re
import urllib.parse
import urllib.request

HEADERS = {"User-Agent": "FrameHub/1.0"}
params = {"action": "parse", "page": "Module:Arcane/data", "prop": "wikitext", "format": "json"}
url = "https://wiki.warframe.com/api.php?" + urllib.parse.urlencode(params)
with urllib.request.urlopen(urllib.request.Request(url, headers=HEADERS), timeout=120) as r:
    text = json.loads(r.read())["parse"]["wikitext"]["*"]

for name in ["Primary Merciless", "Arcane Guardian", "Arcane Grace", "Virtuos Null", "Exodia Force", "Arcane Primary Charger"]:
    key = f'["{name}"]'
    idx = text.find(key)
    print(f"\n=== {name} ({idx}) ===")
    if idx >= 0:
        snippet = text[idx : idx + 4000]
        print(snippet[:4000])

# Count arcane entries
entries = re.findall(r'\["([^"]+)"\]\s*=\s*\{', text)
print(f"\nTotal wiki arcanes: {len(entries)}")
