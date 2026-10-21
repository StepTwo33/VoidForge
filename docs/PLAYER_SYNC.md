# Player Sync: how it fetches, what it imports, how it is tested

## Fetch path

1. The `/player-sync` UI (also the "Player Sync" button on `/loadouts`) calls
   `GET /api/warframe/arsenal?platform=pc|ps4|xb1|swi&account=<in-game name>`
   (`src/app/api/warframe/arsenal/route.ts`).
2. `fetchAndMapWarframeArsenal` (`src/lib/warframe-arsenal/fetch.ts`) requests
   `https://api.warframe.com/cdn/twitch/getActiveLoadout.php?account=<lowercased>` (pc). Console
   platforms use their own hosts (`platforms.ts`).
3. DE requires `Authorization: Bearer <JWT>` for the Warframe Arsenal Twitch extension
   (`twitch-auth.ts`, extension `ud1zj704c0eb1s553jbkayvqxjft97`). The JWT comes from
   `WARFRAME_ARSENAL_JWT`, or is fetched through gql.twitch.tv `ExtensionsForChannel` for
   `TWITCH_ARSENAL_CHANNEL_ID`. Without it DE answers `401 {"errors":"No Auth Header"}`.
4. `normalize-payload.ts` converts the raw JSON, then `map-import.ts` builds a VF `Loadout` plus warnings.
   The route returns `{ account, loadout, warnings }` and never the raw payload. Nothing is written to a
   database; the client saves the loadout to localStorage.

## Import audit checklist

| Field | Raw source (Twitch payload) | VF destination | Verified by |
|---|---|---|---|
| Warframe | `NormalLoadout.warframe.uniqueName` | `warframeBuild.warframeId` | e2e-fixture, live-capture |
| Warframe mods, aura, exilus | `upgrades` positional `[arcane, arcane, exilus, aura, r1..r8]` | aura 0, r1–r8 → 1–8, exilus 9, Jade 2nd aura 10 | map-import-positional, e2e-fixture |
| Mod ranks | upgrade `rank` | `mods[].rank` | e2e-fixture |
| Arcanes | arcane entries in `upgrades` | `arcaneIds` / `arcaneRanks` | e2e-fixture |
| Helminth | `abilityOverride {Ability, Index}` (0-based) | `helminthSlot` = Index (0–3, else warning), `helminthAbilityId` | helminth-import (all frames × 4 slots), live-capture (Sevagoth Prime index 3) |
| Reactor / catalyst | `features` bit 1 (DOUBLE_CAPACITY) | `hasOrokinReactor` / `hasOrokinCatalyst` / `hasReactor` / `hasCatalyst` | import-features |
| Forma count | `polarized` (count only) | not mapped; there are no positions | — |
| Per-slot polarity | **not in the payload** (only inventory `Polarity[]` has it) | innate defaults (`src/data/innate-polarities.ts`) | innate-polarities.test |
| Archon shards | **not in the payload** | `shards: [null×5]` | — |
| Primary / secondary / melee | `uniqueName`, `upgrades` `[arcane?, exilus?, (stance), r1..r8]` | weapon builds; exilus 8; stance → `stanceModId` | map-import-slots, e2e-fixture |
| Rivens | riven upgrade `fingerprint` buffs/curses | `riven_*` mod + `rivenStats` (unmapped tags → warning) | riven-tags |
| Kuva / Tenet progenitor | weapon `progenitor` fields | `progenitorElement` / bonus | normalize/map tests |
| Adversary forma | — | not separable from `polarized` | open |
| Incarnon | `features` bit 512 (genesis) only, no evolution choices | not imported | open |
| Modular (zaw/kitgun/amp) | `parts` / `modularParts` | modular build data; kitgun exilus 8 | map-import tests |
| Companion | `companion.uniqueName`, `upgrades` (10) | `companionBuild.mods` 0–9 | companion tests |
| Companion weapon | claws `[posture, r1..r8]`, robotic/hound `[r1..r8]` | posture → slot 8, mods 0–7 | companion tests, e2e-fixture (Huras) |
| Archwing / necramech | `ARCHWING` / `MECH` + their weapon | `archwingBuild` frame/weapon mods, necramech 12 slots | e2e-fixture (necramech 0–11) |

## Innate (default) polarities

The data comes from WFCD `@wfcd/items` (`scripts/gen_innate_polarities.py`), cross-checked against the
fandom wiki data modules (`scripts/extract_fandom_polarities.py`). When the two disagree the field is
left out. Builders show these defaults under any user or imported forma. `"none"` stores a cleared innate
slot. Neither source records slot positions, so defaults go on the first regular slots in listed order.

## Testing

- **Fixture e2e:** `src/lib/warframe-arsenal/e2e-fixture.test.ts` runs WFCD arsenal-parser example 7 (raw, MIT,
  anonymized) through normalize + map.
- **Live:** `live-capture.test.ts` uses sanitized production output for Step-Bro_Prime (Gyre Prime with no
  subsume; Sevagoth Prime with Roar over ability 4). A raw live capture needs the JWT env above.
