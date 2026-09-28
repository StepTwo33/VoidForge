# Wiki enemy module dumps

Raw Lua from [Module:Enemies/data](https://wiki.warframe.com/w/Module:Enemies/data).

Regenerate `src/data/enemies.ts`:

```bash
python scripts/generate_enemies_catalog.py
```

Refresh a dump (when the wiki isn’t Cloudflare-blocking your IP):

```bash
# Prefer WebFetch / browser save of:
#   https://wiki.warframe.com/w/Module:Enemies/data/<partition>?action=raw
# into scripts/wiki-enemies/<partition>.lua
```

`extra.json` holds paper-only targets the wiki modules omit (Liches/Sisters/Coda, sample Eximus).
