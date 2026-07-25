/**
 * Modular weapons accuracy (B15) — kitgun chambers, zaw strikes, amp prisms.
 * Sources: Module:Modular/data (KitgunSecondary.Chamber Damage.Base, Zaw.Strike)
 * and Module:Weapons/data/modular (* Prism Normal/Direct Hit).
 */
import { describe, expect, it } from "vitest";
import {
  ampPrisms,
  buildKitgun,
  kitgunChambers,
  kitgunGrips,
  kitgunLoaders,
  zawStrikes,
} from "@/data/modular-weapons";

/** Wiki Module:Modular/data Zaw.Strike Normal paper. */
const ZAW_BARE_GOLDENS = [
  { id: "zaw_balla", damage: 224, impact: 11.2, puncture: 134.4, slash: 78.4, criticalChance: 0.18, criticalMultiplier: 2, statusChance: 0.18 },
  { id: "zaw_cyath", damage: 230, impact: 46, puncture: 11.5, slash: 172.5, criticalChance: 0.18, criticalMultiplier: 2, statusChance: 0.18 },
  { id: "zaw_dehtat", damage: 224, impact: 22.4, puncture: 112, slash: 89.6, criticalChance: 0.18, criticalMultiplier: 2, statusChance: 0.18 },
  { id: "zaw_dokrahm", damage: 309, impact: 46.4, puncture: 108.1, slash: 154.5, criticalChance: 0.18, criticalMultiplier: 2, statusChance: 0.18 },
  { id: "zaw_kronsh", damage: 234, impact: 163.8, puncture: 0, slash: 70.2, criticalChance: 0.18, criticalMultiplier: 2, statusChance: 0.18 },
  { id: "zaw_mewan", damage: 224, impact: 56, puncture: 78.4, slash: 89.6, criticalChance: 0.18, criticalMultiplier: 2, statusChance: 0.18 },
  { id: "zaw_ooltha", damage: 224, impact: 22.4, puncture: 89.6, slash: 112, criticalChance: 0.18, criticalMultiplier: 2, statusChance: 0.18 },
  { id: "zaw_rabvee", damage: 234, impact: 140.4, puncture: 11.7, slash: 81.9, criticalChance: 0.18, criticalMultiplier: 2, statusChance: 0.18 },
  { id: "zaw_sepfahn", damage: 226, impact: 22.6, puncture: 56.5, slash: 146.9, criticalChance: 0.2, criticalMultiplier: 2, statusChance: 0.2 },
  { id: "zaw_plague_kripath", damage: 213, impact: 30, puncture: 70, slash: 49, viral: 64, criticalChance: 0.22, criticalMultiplier: 2.2, statusChance: 0.18 },
  { id: "zaw_plague_keewar", damage: 306, impact: 88, puncture: 57, slash: 91, viral: 70, criticalChance: 0.18, criticalMultiplier: 2, statusChance: 0.22 },
] as const;

/** Wiki KitgunSecondary.Chamber Damage.Base + crit. */
const KITGUN_CHAMBER_GOLDENS = [
  { id: "catchmoon_chamber", baseDamage: 256, impact: 89, heat: 167, baseCritChance: 0.21, baseCritMultiplier: 2, baseStatusChance: 0.21 },
  { id: "sporelacer_chamber", baseDamage: 90, impact: 21, toxin: 69, baseCritChance: 0.21, baseCritMultiplier: 3, baseStatusChance: 0.21 },
  { id: "tombfinger_chamber", baseDamage: 84, impact: 16, puncture: 9, radiation: 59, baseCritChance: 0.24, baseCritMultiplier: 2, baseStatusChance: 0.24 },
  { id: "rattleguts_chamber", baseDamage: 33, impact: 2, puncture: 10, slash: 8, radiation: 13, baseCritChance: 0.19, baseCritMultiplier: 2, baseStatusChance: 0.19 },
  { id: "gaze_chamber", baseDamage: 18, puncture: 7, radiation: 11, baseCritChance: 0.25, baseCritMultiplier: 2, baseStatusChance: 0.25 },
  { id: "vermisplicer_chamber", baseDamage: 14, impact: 1.5, puncture: 3.5, slash: 4.5, toxin: 4.5, baseCritChance: 0.25, baseCritMultiplier: 2, baseStatusChance: 0.25 },
] as const;

/** Wiki * Prism Normal/Direct Hit Void paper (mag/reload brace-composed — not locked). */
const AMP_PRISM_GOLDENS = [
  { id: "amp_raplak", damage: 3000, fireRate: 2, criticalChance: 0.38, criticalMultiplier: 2.6, statusChance: 0.1 },
  { id: "amp_shwaak", damage: 3500, fireRate: 1.33, criticalChance: 0.1, criticalMultiplier: 1.6, statusChance: 0.2 },
  { id: "amp_granmu", damage: 1000, fireRate: 1, criticalChance: 0.26, criticalMultiplier: 2, statusChance: 0.12 },
  { id: "amp_rahn", damage: 1000, fireRate: 5.67, criticalChance: 0.3, criticalMultiplier: 2, statusChance: 0.04 },
  { id: "amp_cantic", damage: 1460, fireRate: 2.67, criticalChance: 0.34, criticalMultiplier: 2.2, statusChance: 0.1 },
  { id: "amp_lega", damage: 600, fireRate: 7.5, criticalChance: 0.08, criticalMultiplier: 1.6, statusChance: 0.34 },
  { id: "amp_klamora", damage: 600, fireRate: 12, criticalChance: 0.38, criticalMultiplier: 2.4, statusChance: 0.1 },
] as const;

describe("modular inventory (B15)", () => {
  it("has kitgun chambers, zaw strikes, and amp prisms", () => {
    expect(kitgunChambers.length).toBe(6);
    expect(zawStrikes.length).toBe(11);
    expect(ampPrisms.length).toBe(7);
  });
});

describe("zaw strike wiki goldens", () => {
  it.each(ZAW_BARE_GOLDENS)("$id strike paper", (g) => {
    const s = zawStrikes.find((x) => x.id === g.id);
    expect(s, g.id).toBeDefined();
    expect(s!.damage).toBeCloseTo(g.damage, 4);
    expect(s!.impact).toBeCloseTo(g.impact, 4);
    expect(s!.puncture).toBeCloseTo(g.puncture, 4);
    expect(s!.slash).toBeCloseTo(g.slash, 4);
    expect(s!.criticalChance).toBeCloseTo(g.criticalChance, 4);
    expect(s!.criticalMultiplier).toBeCloseTo(g.criticalMultiplier, 4);
    expect(s!.statusChance).toBeCloseTo(g.statusChance, 4);
    if ("viral" in g && g.viral != null) {
      expect(s!.viral ?? 0).toBeCloseTo(g.viral, 4);
    }
  });
});

describe("kitgun chamber wiki goldens", () => {
  it.each(KITGUN_CHAMBER_GOLDENS)("$id Damage.Base paper", (g) => {
    const c = kitgunChambers.find((x) => x.id === g.id);
    expect(c, g.id).toBeDefined();
    expect(c!.baseDamage).toBeCloseTo(g.baseDamage, 4);
    expect(c!.baseCritChance).toBeCloseTo(g.baseCritChance, 4);
    expect(c!.baseCritMultiplier).toBeCloseTo(g.baseCritMultiplier, 4);
    expect(c!.baseStatusChance).toBeCloseTo(g.baseStatusChance, 4);
    for (const key of ["impact", "heat", "toxin", "puncture", "slash", "radiation"] as const) {
      const part = (g as Record<string, number | undefined>)[key];
      if (part == null) continue;
      const ratio = c!.damageRatios[key];
      expect(ratio, `${g.id}.${key}`).toBeDefined();
      expect(c!.baseDamage * (ratio ?? 0)).toBeCloseTo(part, 3);
    }
  });

  it("Catchmoon + Haymaker matches wiki composed secondary damage", () => {
    const chamber = kitgunChambers.find((c) => c.id === "catchmoon_chamber")!;
    const grip = kitgunGrips.find((g) => g.id === "grip_haymaker")!;
    const loader = kitgunLoaders.find((l) => l.id === "loader_splat")!;
    const w = buildKitgun(chamber, grip, loader);
    expect(w.damage).toBe(460);
  });

  it("Tombfinger + Haymaker matches wiki composed secondary damage", () => {
    const chamber = kitgunChambers.find((c) => c.id === "tombfinger_chamber")!;
    const grip = kitgunGrips.find((g) => g.id === "grip_haymaker")!;
    const loader = kitgunLoaders.find((l) => l.id === "loader_splat")!;
    const w = buildKitgun(chamber, grip, loader);
    expect(w.damage).toBe(180);
  });
});

describe("amp prism wiki goldens", () => {
  it.each(AMP_PRISM_GOLDENS)("$id prism Direct/Normal paper", (g) => {
    const a = ampPrisms.find((x) => x.id === g.id);
    expect(a, g.id).toBeDefined();
    expect(a!.damage).toBeCloseTo(g.damage, 4);
    expect(a!.fireRate).toBeCloseTo(g.fireRate, 4);
    expect(a!.criticalChance).toBeCloseTo(g.criticalChance, 4);
    expect(a!.criticalMultiplier).toBeCloseTo(g.criticalMultiplier, 4);
    expect(a!.statusChance).toBeCloseTo(g.statusChance, 4);
  });
});

describe("legacy weapons.ts modular stubs (B16)", () => {
  it("builder-hidden categories still exist in allWeapons for arcane/codex paths", async () => {
    const { allWeapons } = await import("@/data/weapons");
    const stubs = allWeapons.filter((w) =>
      ["kitgun_chamber", "zaw_strike", "amp_prism"].includes(w.category),
    );
    expect(stubs.length).toBeGreaterThan(0);
    // Modular builder source of truth — stubs are not goldens.
    expect(kitgunChambers.every((c) => stubs.some((s) => s.id === c.id))).toBe(true);
    expect(ampPrisms.every((a) => stubs.some((s) => s.id === a.id))).toBe(true);
  });
});
