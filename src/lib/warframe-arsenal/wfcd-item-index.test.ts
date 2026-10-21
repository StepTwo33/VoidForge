import { describe, expect, it } from "vitest";
import OriginalArsenalData from "@wfcd/arsenal-parser";
import { find as originalFind } from "@wfcd/items/utilities";
import { buildArsenalData, prepareArsenalParserPayload } from "@/lib/warframe-arsenal/normalize-payload";
import { findItem, loadMods } from "@/lib/warframe-arsenal/wfcd-item-index";
import fixture from "./__fixtures__/wfcd-example7-wisp-prime.json";

const clone = () => JSON.parse(JSON.stringify(fixture)) as Record<string, unknown>;

describe("cached WFCD item index (R10-E)", { timeout: 120_000 }, () => {
  it("parses the WFCD example payload exactly like the published parser", () => {
    // Same fallbacks as buildArsenalData (drop RAILJACK, then MECH, when the parser throws).
    const prepared = prepareArsenalParserPayload(clone()) as unknown as { loadOuts: Record<string, unknown> };
    let original: unknown;
    for (const drop of [[], ["RAILJACK"], ["RAILJACK", "MECH"]]) {
      const loadOuts = { ...prepared.loadOuts };
      for (const k of drop) delete loadOuts[k];
      try {
        original = new OriginalArsenalData({ ...prepared, loadOuts } as never);
        break;
      } catch {
        /* next attempt */
      }
    }
    expect(original).toBeTruthy();
    const cached = buildArsenalData(clone());
    expect(JSON.parse(JSON.stringify(cached))).toEqual(JSON.parse(JSON.stringify(original)));
  });

  it("findItem / loadMods match the originals and hand out independent copies", () => {
    const wisp = "/Lotus/Powersuits/Wisp/WispPrime";
    expect(findItem(wisp)).toEqual(originalFind.findItem(wisp));
    const a = findItem(wisp)!;
    delete a.name;
    expect(findItem(wisp)!.name).toBe("Wisp Prime");
    const ups = [{ uniqueName: "/Lotus/Upgrades/Mods/Warframe/AvatarShieldMaxMod", rank: 5 }];
    expect(loadMods(ups)).toEqual(originalFind.loadMods(ups));
    expect(findItem("/Lotus/Nope")).toBeUndefined();
  });

  it("repeat imports are fast once the index exists", () => {
    buildArsenalData(clone());
    const t0 = performance.now();
    buildArsenalData(clone());
    expect(performance.now() - t0).toBeLessThan(2_000);
  });
});
