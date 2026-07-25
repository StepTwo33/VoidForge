# Frame Hub

Open-source verification source for [frame-hub.com](https://frame-hub.com) — Warframe build planner calculations and item catalogs (mods, weapons, warframes, arcanes, and more).

**Use the planner at:** [frame-hub.com](https://frame-hub.com)

This repository is **not intended for self-hosting**. Clone it to inspect or correct damage math and catalog data, or to contribute fixes. Run the product on the live site.

> **Fan project disclaimer:** Frame Hub is not affiliated with, endorsed by, or sponsored by Digital Extremes. *Warframe* and related logos are trademarks of Digital Extremes Ltd. All game data is used for informational purposes under community fan-site conventions.

## What lives here

| Area | Path |
|------|------|
| Item catalogs | [`src/data/`](src/data/) |
| Damage / build math | [`src/lib/calc/`](src/lib/calc/) |
| Architecture map | [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) |
| Accuracy / golden status | [`docs/ACCURACY_CHECKLIST.md`](docs/ACCURACY_CHECKLIST.md) |

## Verify calculations and catalogs

Node.js 20+ and npm:

```bash
git clone https://github.com/StepTwo33/FrameHub.git
cd FrameHub
npm install
npm test
```

No `.env` or app server is required for calc/unit tests.

```bash
npm test          # Vitest unit tests (calc + catalog checks)
npm run lint      # ESLint
```

## Contributing

Issues and pull requests are welcome. Please do not commit secrets, database files, or user uploads.

**Before changing code or data, read:**

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — where builders, calc, catalogs, and behaviors live
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — workflow for data/calc changes
- [`scripts/README.md`](scripts/README.md) — which scripts are safe vs data-pipeline scratch
- Prefer **one item at a time** when editing mods/weapons/warframes/arcanes (no blanket catalog transforms)

## Security

- Do **not** commit `.env`, `*.db`, or `public/uploads/` — they are gitignored.
- See [`SECURITY.md`](SECURITY.md) for vulnerability reporting.

## License

[MIT](LICENSE)
