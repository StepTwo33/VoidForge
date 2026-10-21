import { describe, expect, it } from "vitest";
import { allArcanes } from "@/data/arcanes";
import { allMods } from "@/data/mods";
import { allWeapons } from "@/data/weapons";
import { calculateWeaponBuild, calculateWeaponBuildWithArcanes } from "@/lib/calc/calculator";
import { DEFAULT_SIM_PARAMS, type ModSlot, type SimulationParams } from "@/lib/types";

// R11-S2/S5: per-arcane and per-source stack overrides. Each falls back to the shared slider.
const modsMap = new Map(allMods.map((m) => [m.id, m]));
const slot = (id: string, i = 0): ModSlot => ({ modId: id, rank: modsMap.get(id)!.maxRank, slotIndex: i });
const sim = (p: Partial<SimulationParams>): SimulationParams => ({ ...DEFAULT_SIM_PARAMS, ...p });

describe("per-arcane stack overrides", () => {
  const lex = allWeapons.find((w) => w.id === "lex")!;
  const flare = allArcanes.find((a) => a.id === "cascadia_flare")!;
  const bare = calculateWeaponBuild(lex, [], new Map());

  it("Cascadia Flare 40 stacks via arcaneStacksById while shared slider is 0: +12% × 40 = +480%", () => {
    const s = calculateWeaponBuildWithArcanes(lex, [], new Map(), [flare], undefined,
      sim({ arcaneStacks: 0, arcaneStacksById: { cascadia_flare: 40 } }));
    expect(s.totalDamage).toBeCloseTo(bare.totalDamage * 5.8, 4);
  });

  it("override 0 beats the shared slider", () => {
    const s = calculateWeaponBuildWithArcanes(lex, [], new Map(), [flare], undefined,
      sim({ arcaneStacks: 12, arcaneStacksById: { cascadia_flare: 0 } }));
    expect(s.totalDamage).toBeCloseTo(bare.totalDamage, 4);
  });

  it("override equal to the shared value gives identical stats", () => {
    const a = calculateWeaponBuildWithArcanes(lex, [], new Map(), [flare], undefined, sim({ arcaneStacks: 12 }));
    const b = calculateWeaponBuildWithArcanes(lex, [], new Map(), [flare], undefined,
      sim({ arcaneStacks: 3, arcaneStacksById: { cascadia_flare: 12 } }));
    expect(b.totalDamage).toBeCloseTo(a.totalDamage, 9);
    expect(b.burstDps).toBeCloseTo(a.burstDps, 9);
  });

  it("reports the equipped arcane's real cap (Cascadia Flare 40)", () => {
    const s = calculateWeaponBuildWithArcanes(lex, [], new Map(), [flare], undefined, sim({}));
    expect(s.arcaneStackSources).toEqual([{ id: "cascadia_flare", label: flare.name, cap: 40 }]);
    expect(calculateWeaponBuildWithArcanes(lex, [], new Map(), [], undefined, sim({})).arcaneStackSources).toBeUndefined();
  });
});

describe("per-source kill stack overrides", () => {
  const vectis = allWeapons.find((w) => w.id === "vectis")!;
  const ms = (p: Partial<SimulationParams>) =>
    calculateWeaponBuildWithArcanes(vectis, [slot("galvanized_chamber")], modsMap, [], undefined, sim(p)).multishot;

  it("Galvanized Chamber: base +80% MS, +30%/stack, cap 5 → 1 × (1 + 0.8 + 1.5) = 3.3", () => {
    expect(ms({ killStacks: 0 })).toBeCloseTo(vectis.multishot * 1.8, 6);
    expect(ms({ killStacks: 0, killStacksBySource: { galvMultishot: 5 } })).toBeCloseTo(vectis.multishot * 3.3, 6);
    expect(ms({ killStacks: 5, killStacksBySource: { galvMultishot: 2 } })).toBeCloseTo(vectis.multishot * 2.4, 6);
    expect(ms({ killStacks: 0, killStacksBySource: { galvMultishot: 9 } })).toBeCloseTo(vectis.multishot * 3.3, 6);
  });

  it("lists the source with its cap", () => {
    const s = calculateWeaponBuildWithArcanes(vectis, [slot("galvanized_chamber")], modsMap, [], undefined, sim({}));
    expect(s.killStackSources).toEqual([{ id: "galvMultishot", label: "Galvanized multishot", cap: 5 }]);
  });

  it("Berserker Fury: 2 stacks × 35% attack speed via override while shared kill stacks are 0", () => {
    const skana = allWeapons.find((w) => w.id === "skana")!;
    const fr = (p: Partial<SimulationParams>) =>
      calculateWeaponBuildWithArcanes(skana, [slot("berserker_fury")], modsMap, [], undefined, sim(p)).fireRate;
    expect(fr({ killStacks: 0 })).toBeCloseTo(skana.fireRate, 4);
    expect(fr({ killStacks: 0, killStacksBySource: { berserker: 2 } })).toBeCloseTo(skana.fireRate * 1.7, 4);
    expect(fr({ killStacks: 5 })).toBeCloseTo(skana.fireRate * 1.7, 4);
  });
});
