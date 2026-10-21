/**
 * Sirius & Orion is one Voidforge warframe (`sirius_orion`) with two forms. Player Sync puts
 * the equipped suit's mods in the default form (Sirius, top-level build) and Orion's own item
 * (/Lotus/Powersuits/SiriusOrion/OrionSuit) into `dualFormBuilds.orion`.
 *
 * No real Sirius & Orion capture exists yet, so these use the WFCD exampleData7 payload with the
 * suit unique names swapped in; Orion's entry is looked up by unique name wherever it appears.
 */
import { describe, expect, it } from "vitest";
import { buildArsenalData } from "@/lib/warframe-arsenal/normalize-payload";
import { findRawOrionEntry, mapArsenalToImportPayload } from "@/lib/warframe-arsenal/map-import";
import { findWarframeByLotusPath } from "@/lib/warframe-arsenal/lotus-resolve";
import fixture from "./__fixtures__/wfcd-example7-wisp-prime.json";

const SIRIUS = "/Lotus/Powersuits/SiriusOrion/SiriusSuit";
const ORION = "/Lotus/Powersuits/SiriusOrion/OrionSuit";

type Raw = typeof fixture & { loadOuts: Record<string, Record<string, unknown>> };
const clone = (): Raw => JSON.parse(JSON.stringify(fixture)) as Raw;
const run = (raw: Raw) => mapArsenalToImportPayload(buildArsenalData(raw as never), { loadOuts: raw.loadOuts as never });
const ids = (mods: { slotIndex: number; modId: string }[] = []) => mods.map((m) => `${m.slotIndex}:${m.modId}`).sort();

describe("Sirius & Orion Player Sync", { timeout: 60_000 }, () => {
  it("both suit unique names resolve to the one warframe", () => {
    expect(findWarframeByLotusPath(SIRIUS)?.id).toBe("sirius_orion");
    expect(findWarframeByLotusPath(ORION)?.id).toBe("sirius_orion");
  });

  it("Sirius equipped: mods stay top-level; no Orion entry means no Orion slice", () => {
    const raw = clone();
    (raw.loadOuts.NORMAL.warframe as { uniqueName: string }).uniqueName = SIRIUS;
    const wb = run(raw).loadout.warframeBuild!;
    expect(wb.warframeId).toBe("sirius_orion");
    expect(wb.mods.length).toBeGreaterThan(0);
    expect(wb.dualFormBuilds).toBeUndefined();
  });

  it("Orion's own entry (any loadout key) maps into dualFormBuilds.orion", () => {
    const raw = clone();
    const sirius = raw.loadOuts.NORMAL.warframe as { uniqueName: string; upgrades: unknown[] };
    sirius.uniqueName = SIRIUS;
    const orion = JSON.parse(JSON.stringify(sirius)) as { uniqueName: string; upgrades: unknown[] };
    orion.uniqueName = ORION;
    orion.upgrades = orion.upgrades.slice(0, -1); // drop Orion's last regular mod so the forms differ
    raw.loadOuts.NORMAL.orionSuit = orion;
    expect(findRawOrionEntry(raw.loadOuts as never)).toBe(orion);

    const wb = run(raw).loadout.warframeBuild!;
    const slice = wb.dualFormBuilds?.orion;
    expect(slice).toBeDefined();
    expect(ids(slice!.mods)).not.toEqual(ids(wb.mods));
    expect(slice!.mods.length).toBe(wb.mods.length - 1);
    expect(slice!.slotPolarities).toEqual({});
    expect(slice!.arcaneIds).toEqual(wb.arcaneIds);
  });

  it("Orion equipped as the warframe: mods go to the Orion form, Sirius stays empty", () => {
    const raw = clone();
    (raw.loadOuts.NORMAL.warframe as { uniqueName: string }).uniqueName = ORION;
    const wb = run(raw).loadout.warframeBuild!;
    expect(wb.warframeId).toBe("sirius_orion");
    expect(wb.mods).toEqual([]);
    expect(wb.arcaneIds).toEqual([null, null]);
    expect(wb.dualFormBuilds?.orion.mods.length).toBeGreaterThan(0);
    expect(wb.dualFormBuilds?.orion.arcaneIds).toEqual(["molt_augmented", "arcane_energize"]);
  });
});
