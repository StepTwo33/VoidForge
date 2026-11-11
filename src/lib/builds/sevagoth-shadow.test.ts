/**
 * Terkeon report: "Sevagoth / Sevagoth Prime is missing his Shadow when creating a build."
 * wiki.warframe.com/w/Sevagoth/Abilities/Passive: the Shadow has "separate Upgrade loadouts
 * ... a different Aura, Arcane Enhancements, and Mods", a pre-installed Orokin Reactor,
 * abilities Helminth can't replace, and Archon Shards from Sevagoth apply.
 * Stats: Module:Warframes/data "Sevagoth's Shadow" / "Sevagoth Prime's Shadow".
 */
import { describe, expect, it } from "vitest";
import { allWarframes } from "@/data/warframes";
import { allMods } from "@/data/mods";
import {
  dualFormHasOwnAbilities,
  dualFormStatesFromBuild,
  getDualFormAbilities,
  getDualFormConfig,
  buildAbilityDisplayEntries,
  serializeDualFormBuilds,
  warframeForDualForm,
} from "@/lib/builds/dual-form-warframes";
import { calculateWarframeBuild } from "@/lib/calc/calculator";
import { innateSlotPolarities } from "@/lib/builds/innate-polarities";
import { getVerifiedMiscScaling } from "@/lib/codex/ability-scaling-registry";
import { calcLoadoutStats } from "@/lib/builds/loadout-stats";
import type { Loadout } from "@/lib/types";
import type { WarframeBuildData } from "@/lib/builds/build-storage";

const modsMap = new Map(allMods.map((m) => [m.id, m]));
const wf = (id: string) => allWarframes.find((w) => w.id === id)!;

describe("Sevagoth's Shadow form", () => {
  it.each(["sevagoth", "sevagoth_prime"])("%s has Sevagoth + Shadow tabs", (id) => {
    const config = getDualFormConfig(id)!;
    expect(config.defaultFormId).toBe("sevagoth");
    expect(config.forms.map((f) => f.label)).toEqual(["Sevagoth", "Shadow"]);
    expect(config.exaltedStrengthFormId).toBe("sevagoth");
  });

  it("Shadow uses its own stat block (rank 30: 370 HP, 185 SH, 475 AR, 150 EN, 1.1 sprint)", () => {
    for (const id of ["sevagoth", "sevagoth_prime"]) {
      const shadow = warframeForDualForm(wf(id), "shadow");
      expect(shadow.statFormId).toBe("shadow");
      const s = calculateWarframeBuild(shadow, [], modsMap);
      expect(s.totalHealth).toBe(370);
      expect(s.totalShield).toBe(185);
      expect(s.totalArmor).toBe(475);
      expect(s.totalEnergy).toBe(150);
      expect(s.totalSprint).toBeCloseTo(1.1, 6);
    }
    // Sevagoth himself is unchanged.
    const host = calculateWarframeBuild(warframeForDualForm(wf("sevagoth"), "sevagoth"), [], modsMap);
    expect(host.totalArmor).toBe(160);
    expect(host.totalHealth).toBe(370);
  });

  it("Shadow mods scale the Shadow's stats, not Sevagoth's", () => {
    const shadow = warframeForDualForm(wf("sevagoth_prime"), "shadow");
    const s = calculateWarframeBuild(
      shadow,
      [
        { modId: "intensify_r3", rank: 5, slotIndex: 1 },
        { modId: "vitality_r3", rank: 10, slotIndex: 2 },
      ],
      modsMap,
    );
    expect(s.abilityStrength).toBeCloseTo(1.3, 6);
    expect(s.totalHealth).toBeCloseTo(740, 3);
  });

  it("Shadow tab shows Embrace / Consume / Death's Harvest / Reunite with no Helminth", () => {
    const entries = getDualFormAbilities("sevagoth", "shadow", wf("sevagoth").abilities)!;
    expect(entries.map((e) => e.ability.name)).toEqual(["Embrace", "Consume", "Death's Harvest", "Reunite"]);
    expect(entries.every((e) => e.formOwned && e.formLabel === "Shadow")).toBe(true);
    expect(dualFormHasOwnAbilities("sevagoth", "shadow")).toBe(true);
    expect(dualFormHasOwnAbilities("sevagoth", "sevagoth")).toBe(false);
    const host = buildAbilityDisplayEntries(wf("sevagoth_prime"), true, "sevagoth");
    expect(host.map((e) => e.ability.name)).toEqual(["Reap", "Sow", "Gloom", "Exalted Shadow"]);
    expect(host.some((e) => e.formOwned)).toBe(false);
    expect(warframeForDualForm(wf("sevagoth"), "shadow").abilities.map((a) => a.name)).toContain("Consume");
  });

  it("Shadow ability numbers follow the wiki (rank 3)", () => {
    const [embrace, consume, harvest, reunite] = warframeForDualForm(wf("sevagoth"), "shadow").abilities;
    expect([embrace.energyCost, embrace.range, embrace.duration]).toEqual([25, 20, 8]);
    expect([consume.energyCost, consume.damage, consume.range, consume.damageType]).toEqual([25, 2500, 14, "Radiation"]);
    expect(consume.miscStats?.healthHealPercent).toBe(0.25);
    expect([harvest.energyCost, harvest.radius, harvest.duration]).toEqual([75, 12, 10]);
    expect(harvest.miscStats?.damageVulnerability).toBe(0.5);
    expect(reunite.energyCost).toBe(0);
    expect(getVerifiedMiscScaling("sevagoth_prime", "Death's Harvest", "damageVulnerability")?.scale).toBe("strength");
    expect(getVerifiedMiscScaling("sevagoth", "Consume", "healthHealPercent")?.scale).toBe("strength");
  });

  it("Shadow innate polarities: Madurai aura; Prime adds Vazarin + Naramon", () => {
    expect(innateSlotPolarities("warframe", "sevagoth", "shadow")).toEqual({ 0: "madurai", 1: "madurai", 2: "madurai" });
    expect(innateSlotPolarities("warframe", "sevagoth_prime", "shadow")).toEqual({
      0: "madurai",
      1: "vazarin",
      2: "naramon",
      3: "madurai",
      4: "madurai",
    });
    // Sevagoth's own tab keeps his polarities.
    expect(innateSlotPolarities("warframe", "sevagoth_prime", "sevagoth")).toEqual({ 1: "vazarin", 2: "naramon", 3: "madurai" });
  });

  it("Shadow mods and arcanes save separately and old Sevagoth builds load with an empty Shadow", () => {
    const saved = serializeDualFormBuilds("sevagoth", {
      sevagoth: { mods: [{ modId: "intensify_r3", rank: 5, slotIndex: 1 }], slotPolarities: {}, arcaneIds: ["arcane_energize", null], arcaneRanks: [5, 5] },
      shadow: { mods: [{ modId: "vitality_r3", rank: 10, slotIndex: 1 }], slotPolarities: { 3: "naramon" }, arcaneIds: ["arcane_grace", null], arcaneRanks: [3, 5] },
    });
    expect(saved.mods.map((m) => m.modId)).toEqual(["intensify_r3"]);
    expect(saved.dualFormBuilds?.shadow.mods.map((m) => m.modId)).toEqual(["vitality_r3"]);
    expect(saved.dualFormBuilds?.shadow.arcaneIds).toEqual(["arcane_grace", null]);

    const legacy = { warframeId: "sevagoth", mods: [], shards: [], arcaneIds: [null, null], hasOrokinReactor: true, isMR30: false } as unknown as WarframeBuildData;
    const states = dualFormStatesFromBuild(legacy)!;
    expect(states.shadow.mods).toEqual([]);
  });

  it("loadout stats list the Shadow next to Sevagoth", () => {
    const loadout: Loadout = {
      id: "l1",
      name: "Sevagoth",
      createdAt: 0,
      updatedAt: 0,
      warframeBuild: {
        warframeId: "sevagoth_prime",
        mods: [],
        shards: [null, null, null, null, null],
        arcaneIds: [null, null],
        hasOrokinReactor: true,
        isMR30: false,
        slotPolarities: {},
        dualFormBuilds: {
          shadow: { mods: [{ modId: "vitality_r3", rank: 10, slotIndex: 1 }], slotPolarities: {}, arcaneIds: [null, null], arcaneRanks: [5, 5] },
        },
      },
    } as unknown as Loadout;
    const stats = calcLoadoutStats(loadout);
    const forms = stats.warframe?.forms ?? [];
    expect(forms.map((f) => f.label)).toEqual(["Sevagoth", "Shadow"]);
    expect(forms[1].stats.totalHealth).toBeCloseTo(740, 3);
    expect(forms[1].stats.totalArmor).toBe(475);
    expect(forms[0].stats.totalArmor).toBe(185);
  });
});
