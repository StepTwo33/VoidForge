#!/usr/bin/env python3
"""Extract id + description from arcanes.ts for manual review."""
import re
from pathlib import Path

content = Path(__file__).resolve().parents[1].joinpath("src/data/arcanes.ts").read_text(encoding="utf-8")
for m in re.finditer(
    r'id:\s*"([^"]+)".*?description:\s*"((?:[^"\\]|\\.)*)"',
    content,
    re.S,
):
    print(f"{m.group(1)}\t{m.group(2)[:100].replace(chr(10), ' ')}")
