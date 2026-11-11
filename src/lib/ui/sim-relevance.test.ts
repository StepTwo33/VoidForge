import { describe, expect, it } from "vitest";
import { allWeapons } from "@/data/weapons";
import { allMods } from "@/data/mods";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import { DEFAULT_SIM_PARAMS, type Mod } from "@/lib/types";
import { relevantSimKeys } from "./sim-relevance";

const modsMap = new Map<string, Mod>(allMods.map((m) => [m.id, m]));
const weapon = (id: string) => allWeapons.find((w) => w.id === id)!;

describe("relevantSimKeys", () => {
  it("bare Soma: no event switch or stack slider changes a number", () => {
    const soma = weapon("soma");
    const keys = relevantSimKeys(DEFAULT_SIM_PARAMS, (sim) => calculateWeaponBuild(soma, [], modsMap, undefined, sim));
    expect([...keys]).toEqual([]);
  });
  it("Galvanized Scope makes Aiming and kill stacks matter", () => {
    const soma = weapon("soma");
    const mods = [{ modId: "galvanized_scope", rank: 10, slotIndex: 0 }];
    const keys = relevantSimKeys({ ...DEFAULT_SIM_PARAMS, applyHeadshots: true }, (sim) => calculateWeaponBuild(soma, mods, modsMap, undefined, sim));
    expect(keys.has("applyAiming")).toBe(true);
    expect(keys.has("killStacks")).toBe(true);
    expect(keys.has("applyCrouch")).toBe(false);
  });
});

describe("sim summary chips", () => {
  it("Max stacks on a bare Soma lists nothing that does not change a number", async () => {
    const { simSummaryChips } = await import("@/components/stats/weapon-sim-panel");
    const { maxStacksSimParams } = await import("@/lib/ui/sim-presets");
    const soma = weapon("soma");
    const sim = maxStacksSimParams(DEFAULT_SIM_PARAMS, { arcaneMax: 12 });
    const stats = calculateWeaponBuild(soma, [], modsMap, undefined, sim);
    const keys = relevantSimKeys(sim, (p) => calculateWeaponBuild(soma, [], modsMap, undefined, p));
    expect(simSummaryChips(sim, false, "soma", keys, stats.triggerBuckets)).toEqual([]);
    // Without relevance info every active switch is still listed.
    expect(simSummaryChips(sim, false, "soma").length).toBeGreaterThan(10);
  });
});
