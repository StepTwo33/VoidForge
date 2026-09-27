#!/usr/bin/env python3
import json, re, urllib.parse, urllib.request

params = {"action": "parse", "page": "Module:Arcane/data", "prop": "wikitext", "format": "json"}
url = "https://wiki.warframe.com/api.php?" + urllib.parse.urlencode(params)
with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "Voidforge/1.0"}), timeout=120) as r:
    text = json.loads(r.read())["parse"]["wikitext"]["*"]

for name in [
    "Exodia Brave", "Exodia Force", "Exodia Hunt", "Exodia Might",
    "Exodia Triumph", "Exodia Valor", "Exodia Contagion", "Exodia Epidemic",
]:
    m = re.search(r'\["' + re.escape(name) + r'"\]\s*=\s*\{', text)
    if not m:
        print(name, "NOT FOUND")
        continue
    start = m.end() - 1
    depth = 0
    for i in range(start, len(text)):
        if text[i] == "{":
            depth += 1
        elif text[i] == "}":
            depth -= 1
            if depth == 0:
                block = text[start : i + 1]
                break
    desc = re.search(r'Description\s*=\s*"((?:[^"\\]|\\.)*)"', block)
    mr = re.search(r"MaxRank\s*=\s*(\d+)", block)
    print("===", name, "maxRank", mr.group(1) if mr else "?")
    if desc:
        print(desc.group(1).replace("\\r\\n", "\n").replace("\\n", "\n"))
    print()
