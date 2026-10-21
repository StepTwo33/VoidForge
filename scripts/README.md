# Scripts

This folder mixes **ops tools** (safe to run) with **data-pipeline / audit** scripts used when syncing wiki or catalog data. Most files are not part of the normal app runtime.

## Safe / everyday

| Script | Purpose |
|--------|---------|
| `deploy.sh` | On the server (Cockpit): fast-forward `design/ui-pass` onto `dev`, `npm ci`, build, restart `framehub` |
| `set-admin.ts` | **Local dev only** — promote emails to admin (`CONFIRM_SET_ADMIN=1`) |
| `repair-db.mjs` | SQLite repair helper if the DB is corrupted |
| `generate-pwa-icons.py` | Regenerates PWA icons (`npm run icons`) |

Never run `set-admin.ts` against a production database you do not fully control.

## Naming conventions

| Pattern | Meaning |
|---------|---------|
| `audit_*.py` | Read / report gaps (usually does not write catalogs) |
| `apply_*.py` | **Writes** into `src/data/` — review the diff before committing |
| `generate_*.py` / `fetch_*.py` / `convert_*.py` | Pipeline generators; treat outputs as reviewable |
| `_*.js` / `_*.py` / `_*.mjs` | Local scratch, probes, one-offs — prefer **not** committing new ones |
| `*.txt` / `*.wikitext` / `*_verify*` / logs | Scratch dumps — gitignored; do not commit |

If you need a new shared tool, give it a clear name **without** a leading `_` and document it here in one line.

## Before running data scripts

1. Work on a branch; commit or stash unrelated edits.
2. Prefer audit/report scripts first; only run `apply_*` when you intend to change catalogs.
3. Diff `src/data/` afterward — **per-item** review. Do not ship blanket transforms.
4. Regenerated images may land under `public/`; keep PRs focused.

## Python

Many scripts assume a recent Python 3 and packages already used in this repo (no separate requirements file for every one-off). Cache files go to `scripts/__pycache__/` (gitignored).
