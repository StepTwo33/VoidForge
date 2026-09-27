# Contributing

Thanks for helping with Voidforge.

Use the planner at [void-forge.org](https://void-forge.org). This repo is for verifying and fixing calculations and item catalogs.

## Quick start

1. `npm install` then `npm test` (and `npm run lint` when touching logic).
2. Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) before large changes.
3. Prefer editing data/calc under `src/data/` and `src/lib/calc/`; see [docs/ACCURACY_CHECKLIST.md](docs/ACCURACY_CHECKLIST.md) for accuracy status.

No app server or `.env` is required for calc/catalog verification.

## Data changes

- Edit **one item at a time** in `src/data/` (mods, weapons, warframes, arcanes, …).
- Mod *behavior* usually belongs in `src/data/mod-behaviors/`, not only flat `stats`.
- Do not commit blanket catalog transforms or script dumps.

See [scripts/README.md](scripts/README.md) before running audit/apply tooling.

## Pull requests

- Keep PRs focused (one concern when possible).
- Do not commit `.env`, `*.db`, `public/uploads/`, or `scripts/` scratch dumps.
- Prefer clear commit messages that say *why*.
