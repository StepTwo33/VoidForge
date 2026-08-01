# Voidforge architecture (for maintainers)

Short map of where things live. Prefer small, targeted changes over rewrites.

## App surface

| Area | Path | Notes |
|------|------|--------|
| Builders | `src/app/*-builder/` | Weapon, warframe, companion, modular, etc. |
| Codex | `src/app/codex/` | Browse items; detail UI in `codex-entity-panels.tsx` + `codex-item-panels.tsx` |
| Compare / damage sim | `src/app/compare/`, `src/app/damage-simulator/` | |
| Admin | `src/app/admin/` | Reports, data fixes, users, site updates, newsletter |
| Auth / profile | `src/app/api/auth/`, `src/app/profile/` | JWT cookie sessions (`src/lib/auth/auth.ts`) |
| Discord bot | `bot/` | Separate process; `npm run bot` |

UI shells and shared layout: `src/components/` (e.g. `stats/` barrel, mod picker, override editors).

### Data Fixes / override UI

Admin editor shell: `override-editor.tsx` (item picker + save). Field UIs are split by domain:

| Module | Role |
|--------|------|
| `override-field-editors.tsx` | Thin barrel — prefer specific modules for new code |
| `override-arcane-editors.tsx` | Arcane trigger + effect lines |
| `override-abilities-editor.tsx` | Warframe / companion abilities |
| `override-stat-rows-editor.tsx` | Nested mod/shard/stat maps |
| `override-radial-editors.tsx` | Weapon radial attack drafts |
| `override-editor-helpers.ts` | Catalog lookup + scalar parse/compare for the shell (`src/lib/overrides/`) |

Schemas / merge: `src/lib/overrides/override-schemas.ts`, `override-merge.ts`, `data-overrides*.ts`.

## Data vs behavior

**Catalogs** (`src/data/*.ts`) hold identity and base stats: mods, weapons, warframes, arcanes, companions, stances, etc. Files are large on purpose — that is fine.

**Behaviors** live beside catalogs when logic is more than a flat number:

| Kind | Where |
|------|--------|
| Mod effects | `src/data/mod-behaviors/` (batched by category; see `index.ts`) |
| Arcane effects | `src/data/arcane-behaviors.ts`, `arcane-effects.ts`, `arcane-manual-overrides.json` |
| Stance → melee class | `src/data/stances.ts` + wiki tags in `mod-weapon-tags.ts` |
| Weapon extras | `weapon-passives.ts`, `weapon-radial-attacks.ts`, `incarnon*.ts` |
| Runtime overrides | DB `DataOverride` + `src/lib/overrides/data-overrides*.ts` / admin Data Fixes UI |

### Editing item data

- **Edit one item at a time** (or a short, explicitly reviewed list). Do not blanket-transform catalogs.
- Changing how a mod *works* usually means `mod-behaviors/`, not only `mods.ts` `stats`.
- Stance eligibility: mod `category: "stance"` + entry in `STANCE_WEAPON_TYPE` + correct weapon `stanceType`.
- Prefer id-keyed maps over rewriting hundreds of rows.

Do not blanket-transform catalogs; edit one item (or a short reviewed list) at a time.

## Calculation stack

| Concern | Start here |
|---------|------------|
| Weapon DPS / stats | `src/lib/calc/calculator.ts` |
| Crit / fire rate / melee combo | `calc/crit-utils.ts`, `effective-fire-rate.ts`, `melee-combo.ts` |
| TTK / damage sim | `calc/ttk.ts`, `damage-sim.ts`, `ability-ttk.ts` |
| Arcanes | `calc/arcane-calculator.ts`, `arcane-handlers.ts`, `arcane-behavior-registry.ts` |
| Companions / archwing / railjack | `calc/companion-calculator.ts`, `archwing-calculator.ts`, `railjack-calculator.ts` |
| Mod eligibility | `mods/mod-weapon-eligibility.ts`, tags in `src/data/` |
| Capacity | `calc/mod-capacity.ts`, `compute-used-capacity.ts` |
| Weapon builder merges | `calc/weapon-stat-merges.ts` (Incarnon + riven deltas) |

Tests live next to modules as `*.test.ts` (Vitest: `npm test`).

## `src/lib` layout

Domain folders (prefer these for new files):

| Folder | Role |
|--------|------|
| `calc/` | DPS, TTK, sim, capacity, arcane/companion calculators |
| `builds/` | Save/share/loadouts, build URL hooks, dual-form helpers |
| `overrides/` | Data Fixes merge/schemas, runtime overrides |
| `display/` | Labels, images, badges, clipboard/avatars |
| `mods/` | Behavior registry, eligibility, augment catalogs |
| `weapons/` | Enrichment, radial utils, companion weapons, `use-data` |
| `auth/` | Sessions, admin, email, rate limits |
| `site/` | Site updates, metadata, nav, public origin |
| `codex/` | Codex catalog helpers, ability scaling registries |
| `bot/` | Discord bot helpers (existing) |
| `warframe-arsenal/` | Player Sync / Twitch arsenal (existing) |

Stay at lib root: `types.ts`, `utils.ts`, `prisma.ts`, `sqlite-path.ts`, `log-server-error.ts`, `read-json-body.ts`.

Catalogs remain in `src/data/` (not under lib).

When adding a helper, put it in the matching domain folder rather than dumping on the lib root.

Schemas / merge for Data Fixes: `src/lib/overrides/override-schemas.ts`, `override-merge.ts`, `data-overrides*.ts`.

## Database

- Schema: `prisma/schema.prisma`
- Migrations: `prisma/migrations/` — apply with `npm run db:migrate` (or `start.sh`)
- Client is generated into `src/generated/prisma` (gitignored)

## Ops scripts

Deploy and a few admin helpers live under `scripts/`. Most other files there are data-pipeline / audit tooling — see [`scripts/README.md`](../scripts/README.md).
