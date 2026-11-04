/**
 * Round 46 — warframe data audit fixes (data-audit/round-4-warframes.md), each value
 * checked against wiki.warframe.com (ability pages, Module:Ability/data, Module:Warframes/data,
 * Module:Mods/data, frame Patch History).
 */
import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { allWarframes, warframesMap } from "@/data/warframes";
import { allHelminthAbilities, subsumeMap } from "@/data/helminth";
import { modsMap } from "@/data/mods";
import { calculateWarframeBuild } from "@/lib/calc/calculator";
import { scaleAbilityMiscStats } from "@/lib/codex/ability-misc-stats";
import { getVerifiedMiscScaling, hasHelminthScalingEntry, isFixedAbilityField } from "@/lib/codex/ability-scaling-registry";
import { HELMINTH_LOTUS_SUFFIX_TO_ID } from "@/lib/warframe-arsenal/helminth-lotus-aliases";
import {
  abilityEfficiencyCapNote,
  displayAbilityEfficiency,
  formatAbilityEfficiencyPct,
} from "@/lib/display/ability-efficiency";
import { AbilityStatsBlock } from "@/components/ability-display";
import { WarframeDetailPanel } from "@/components/codex-entity-panels";
import type { Ability, WarframeCalculatedStats } from "@/lib/types";

const frame = (id: string) => allWarframes.find((w) => w.id === id)!;
const ability = (id: string, name: string) => frame(id).abilities.find((a) => a.name === name)!;
const helminth = (id: string) => allHelminthAbilities.find((h) => h.id === id)!;
const ctx = (o: Partial<{ strength: number; duration: number; range: number; efficiency: number }> = {}) => ({
  strength: 1, duration: 1, range: 1, efficiency: 1, ...o,
});
const line = (lines: ReturnType<typeof scaleAbilityMiscStats>, label: string) => lines.find((l) => l.label === label);

describe("Nidus (Update 43 patch notes)", () => {
  it.each(["nidus", "nidus_prime"])("%s Ravenous heals 75 HP/s; Parasitic Link costs 25 energy and no Mutation stacks", (id) => {
    expect(ability(id, "Ravenous").miscStats?.healthRegen).toBe(75);
    const link = ability(id, "Parasitic Link");
    expect(link.energyCost).toBe(25);
    expect(link.miscStats?.mutationStackCost).toBeUndefined();
    // Ravenous still spends 3 stacks
    expect(ability(id, "Ravenous").miscStats?.mutationStackCost).toBe(3);
  });
  it("Ravenous regen scales with Strength (75 × 150% = 113/s)", () => {
    const r = ability("nidus", "Ravenous");
    const l = scaleAbilityMiscStats(r.miscStats!, ctx({ strength: 1.5 }), { warframeId: "nidus", abilityName: "Ravenous" });
    expect(line(l, "Health Regen")?.scaled).toBe("113/s");
  });
});

describe("Narin", () => {
  it("rank-30 energy is 300 (Module:Warframes/data EnergyRank30)", () => {
    expect(calculateWarframeBuild(warframesMap.get("narin")!, [], modsMap).totalEnergy).toBe(300);
  });
  it("Nurinarim shows unmarked 20,000 / 10,000 and marked 40,000 / 20,000", () => {
    const n = ability("narin", "Nurinarim");
    expect(n.damage).toBe(20000);
    expect(n.miscStats).toMatchObject({
      markedSlashDamage: 40000, explosionDamage: 10000, markedExplosionDamage: 20000, markedDamageMultiplier: 2,
    });
    const l = scaleAbilityMiscStats(n.miscStats!, ctx({ strength: 2 }), { warframeId: "narin", abilityName: "Nurinarim" });
    expect(line(l, "Marked Slash Damage")?.scaled).toBe("80000");
    expect(line(l, "Explosion Damage")?.scaled).toBe("20000");
    expect(line(l, "Marked Explosion Damage")?.scaled).toBe("40000");
    expect(line(l, "Marked Target Damage Mult.")?.modified).toBe(false);
  });
});

describe("Helminth caps", () => {
  it("Fire Blast strip: 75% base, capped at 75% (no Immolation heat on Helminth)", () => {
    const fb = helminth("subsume_ember");
    expect(fb.miscStats?.armorStrip).toBe(0.75);
    const l = scaleAbilityMiscStats(fb.miscStats!, ctx({ strength: 3 }), { warframeId: "ember", abilityName: "Fire Blast", helminth: true });
    expect(line(l, "Armor Strip")?.scaled).toBe("75%");
    const low = scaleAbilityMiscStats(fb.miscStats!, ctx({ strength: 0.5 }), { warframeId: "ember", abilityName: "Fire Blast", helminth: true });
    expect(line(low, "Armor Strip")?.scaled).toBe("38%");
    // native Ember keeps the 100% cap
    expect(getVerifiedMiscScaling("ember", "Fire Blast", "armorStrip")).toEqual({ scale: "strength", cap: 1 });
  });
  it("Wyrd Scythes slow: 26% × STR capped at 71% (wiki: reached at 272% Strength)", () => {
    const ws = helminth("subsume_dagath");
    expect(ws.miscStats?.slowCap).toBe(0.71);
    const l = scaleAbilityMiscStats(ws.miscStats!, ctx({ strength: 3 }), { warframeId: "dagath", abilityName: "Wyrd Scythes", helminth: true });
    expect(line(l, "Slow")?.scaled).toBe("71%");
  });
  it("Marked For Death: 10 m explosion, 30 m cast, no fixed duration, 75% × STR capped at 150%", () => {
    const m = helminth("helminth_marked_for_death");
    expect(m.radius).toBe(10);
    expect(m.range).toBe(30);
    expect(m.duration).toBeUndefined();
    const at = (strength: number) =>
      line(scaleAbilityMiscStats(m.miscStats!, ctx({ strength }), { warframeId: "helminth", abilityName: "Marked For Death", helminth: true }), "Damage Spread")?.scaled;
    expect(at(1)).toBe("75%");
    expect(at(1.5)).toBe("113%");
    expect(at(3)).toBe("150%");
  });
});

describe("New Helminth abilities (wiki max rank, Module:Ability/data Cost 50)", () => {
  const ids = [
    "helminth_expedite_suffering", "helminth_parasitic_armor", "helminth_hideous_resistance",
    "helminth_voracious_metastasis", "helminth_sickening_pulse", "subsume_sirius_orion_astral_shell",
  ];
  it.each(ids)("%s exists, costs 50 and has a helminth:: scaling row", (id) => {
    const h = helminth(id);
    expect(h.energyCost).toBe(50);
    expect(hasHelminthScalingEntry(h.name)).toBe(true);
  });
  it("max-rank values", () => {
    expect(helminth("helminth_expedite_suffering")).toMatchObject({ range: 12, miscStats: { damageMultiplier: 1, coneAngle: 45 } });
    expect(helminth("helminth_parasitic_armor")).toMatchObject({ duration: 25, miscStats: { shieldToArmor: 1 } });
    expect(helminth("helminth_hideous_resistance").miscStats?.statusImmunityCharges).toBe(10);
    expect(helminth("helminth_voracious_metastasis")).toMatchObject({ duration: 10, miscStats: { healthRestored: 500, allyEnergy: 50 } });
    expect(helminth("helminth_sickening_pulse")).toMatchObject({ radius: 8, duration: 2, miscStats: { expansionSpeed: 20, statusStacksAdded: 10, dotStatusStacksAdded: 1 } });
    expect(helminth("subsume_sirius_orion_astral_shell")).toMatchObject({
      source: "sirius_orion", abilitySlot: 2, duration: 35,
      miscStats: { decoyDuration: 5, decoyDamage: 200, decoyRadius: 5, decoyCooldown: 5, tauntRadius: 30 },
    });
  });
  it("scaling: STR on charges/heal/armor share; Efficiency lowers ally energy; expansion speed fixed", () => {
    const s = (id: string, o: Parameters<typeof ctx>[0]) => {
      const h = helminth(id);
      return scaleAbilityMiscStats(h.miscStats!, ctx(o), { warframeId: h.source, abilityName: h.name, helminth: true });
    };
    expect(line(s("helminth_hideous_resistance", { strength: 2 }), "Status Immunity Charges")?.scaled).toBe("20");
    expect(line(s("helminth_parasitic_armor", { strength: 2 }), "Shields → Armor")?.scaled).toBe("200%");
    expect(line(s("helminth_voracious_metastasis", { strength: 2 }), "Health Restored")?.scaled).toBe("1000");
    expect(line(s("helminth_voracious_metastasis", { efficiency: 1.5 }), "Ally Energy (total)")?.scaled).toBe("25");
    expect(line(s("helminth_sickening_pulse", { strength: 3, range: 3, duration: 3 }), "Expansion Speed (m/s)")?.modified).toBe(false);
    expect(line(s("subsume_sirius_orion_astral_shell", { strength: 2 }), "Decoy Damage")?.scaled).toBe("400");
  });
  it("Arsenal imports map the DE internal names", () => {
    expect(HELMINTH_LOTUS_SUFFIX_TO_ID).toMatchObject({
      HelminthStatusAbility: "helminth_expedite_suffering",
      HelminthShieldArmorAbility: "helminth_parasitic_armor",
      HelminthProcBlockAbility: "helminth_hideous_resistance",
      HelminthEnergyShareAbility: "helminth_voracious_metastasis",
      HelminthMaxStatusAbility: "helminth_sickening_pulse",
      OrionBuffAbility: "subsume_sirius_orion_astral_shell",
      SiriusBuffAbility: "subsume_sirius_orion",
    });
  });
  it("subsumeMap keeps Jade Stars as the Sirius & Orion entry", () => {
    expect(subsumeMap.get("sirius_orion")?.name).toBe("Jade Stars");
  });
});

describe("Fixed (wiki-underlined) distances do not scale with Range", () => {
  const stats = { abilityStrength: 1, abilityDuration: 1, abilityRange: 2, abilityEfficiency: 1 } as unknown as WarframeCalculatedStats;
  const render = (a: Ability, warframeId: string, helminthFlag = false) =>
    renderToStaticMarkup(createElement(AbilityStatsBlock, { ability: a, stats, display: { warframeId, abilityName: a.name, helminth: helminthFlag } }));
  it.each([
    ["ash", "Shuriken", "range", "60.0m"],
    ["ash_prime", "Shuriken", "range", "60.0m"],
    ["follie", "Forced Perspective", "range", "100.0m"],
    ["follie", "Shadowgraph", "range", "50.0m"],
    ["follie", "Self Portrait", "range", "50.0m"],
    ["temple", "Pyrotechnics", "radius", "20.0m"],
  ] as const)("%s %s %s stays %s at 200%% Range", (id, name, field, shown) => {
    expect(isFixedAbilityField(id, name, field)).toBe(true);
    const html = render(ability(id, name), id);
    expect(html).toContain(shown);
    const doubled = `${(parseFloat(shown) * 2).toFixed(1)}m`;
    expect(html).not.toContain(doubled);
  });
  it("Range-scaled fields still scale (Self Portrait radius 8 m → 16 m, Temple Pyrotechnics range 25 → 50 m)", () => {
    expect(render(ability("follie", "Self Portrait"), "follie")).toContain("16.0m");
    expect(render(ability("temple", "Pyrotechnics"), "temple")).toContain("50.0m");
    expect(isFixedAbilityField("ash", "Fireball", "range")).toBe(false);
  });
  it("Helminth Self Portrait 50 m stays fixed", () => {
    const sp = helminth("subsume_follie") as unknown as Ability;
    expect(render(sp, "follie", true)).toContain("50.0m");
    expect(render(sp, "follie", true)).not.toContain("100.0m");
  });
});

describe("Codex strips <DT_…> tags", () => {
  it("Ash passive and abilities render without raw tags", () => {
    const ash = frame("ash");
    expect(ash.passive).toContain("<DT_");
    const html = renderToStaticMarkup(createElement(WarframeDetailPanel, { warframe: ash }));
    expect(html).not.toMatch(/&lt;DT_|<DT_/);
  });
  it("no warframe in the Codex shows a DT tag", () => {
    for (const wf of allWarframes) {
      const html = renderToStaticMarkup(createElement(WarframeDetailPanel, { warframe: wf }));
      expect(html, wf.id).not.toMatch(/&lt;DT_|<DT_/);
    }
  });
});

describe("Gaseous Quake text", () => {
  it("mentions the 2.75x Damage Multiplier (Module:Mods/data)", () => {
    expect(modsMap.get("augment_banshee_resonating_quake")?.description).toContain("2.75x Damage Multiplier");
  });
});

describe("Ability Efficiency display (Arsenal shows 25%–175%)", () => {
  it("clamps the displayed value only", () => {
    expect(displayAbilityEfficiency(2.3)).toBe(1.75);
    expect(displayAbilityEfficiency(0.1)).toBe(0.25);
    expect(displayAbilityEfficiency(1.3)).toBe(1.3);
    expect(formatAbilityEfficiencyPct(2.3)).toBe("175%");
    expect(formatAbilityEfficiencyPct(1.45)).toBe("145%");
    expect(abilityEfficiencyCapNote(2.3)).toContain("230%");
    expect(abilityEfficiencyCapNote(1.5)).toBeUndefined();
  });
  it("the calculation keeps the raw stat", () => {
    const wf = warframesMap.get("excalibur")!;
    const slots = ["streamline_r3", "fleeting_expertise_r5", "primed_flow"]
      .filter((id) => modsMap.has(id))
      .map((id, i) => ({ modId: id, rank: modsMap.get(id)!.maxRank, slotIndex: i }));
    const s = calculateWarframeBuild(wf, slots, modsMap);
    expect(s.abilityEfficiency).toBeGreaterThan(1);
    expect(displayAbilityEfficiency(s.abilityEfficiency)).toBeLessThanOrEqual(1.75);
  });
});
