# Player Sync fixtures

Real `getActiveLoadout.php` (Warframe Arsenal Twitch extension) payloads used for end-to-end
importer tests.

- `wfcd-example7-wisp-prime.json` — `test/data/exampleData7.json` from
  [WFCD/arsenal-parser](https://github.com/WFCD/arsenal-parser) (MIT, © 2020 NicksWorld).
  Already anonymized upstream (`playerName: "Warframe PlayerName"`). Unmodified.

The Twitch payload carries per-item `features` (bitfield) and `polarized` (Forma count) but no
per-slot polarity array, so these fixtures cannot assert imported slot polarities.

## Live captures (2026-10-20, PC account supplied by the maintainer)

Only Voidforge's **production** `/api/warframe/arsenal` output was reachable (the raw DE endpoint
needs the Twitch-extension JWT, which only the deployed server holds). These files are that
mapped output from the *pre-fix* importer, sanitized (player / pet names removed):

- `live-prod-mapped-gyre-prime.json` — Gyre Prime, nothing subsumed (no Helminth fields).
- `live-prod-mapped-sevagoth-prime-roar.json` — Sevagoth Prime with Roar infused over the 4th
  ability in game. The old importer turned raw index N into N - 1 (for 1–4), and it reported
  `helminthSlot: 2`; the only raw index that maps to 2 is 3, i.e. raw `index` is 0-based.
