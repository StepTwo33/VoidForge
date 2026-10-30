import { describe, expect, it } from "vitest";
import { allWeapons } from "@/data/weapons";
import { modsMap } from "@/data/mods";
import { incarnonDataMap } from "@/data/incarnon";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import { enrichWeapon } from "@/lib/weapons/weapon-enrich";
import { isSituationalRadial } from "@/lib/calc/weapon-radial-dps";
import { applyIncarnonFormToWeapon, getIncarnonFormAttack } from "@/lib/calc/incarnon-active-weapon";
import { applyAlternateMode } from "@/lib/weapons/weapon-alternate-mode";

// Round 43: data-audit fixes, each checked against wiki.warframe.com Module:Weapons/data (fetched 2026-10-29).
const byId = (id: string) => enrichWeapon(allWeapons.find((x) => x.id === id)!);
const build = (id: string, mods: string[] = []) =>
  calculateWeaponBuild(
    byId(id),
    mods.map((m, i) => ({ modId: m, rank: modsMap.get(m)!.maxRank, slotIndex: i })),
    modsMap,
  );
/** wiki Damage/Calculation: sustained = burst x shots / (shots + EFR x reload). */
const sustained = (s: ReturnType<typeof build>, cost: number) => {
  const shots = s.magazine / cost;
  return s.burstDps * (shots / (shots + s.effectiveFireRate! * s.reloadTime));
};

describe("R43 item 1: ammo per shot from the wiki AmmoCost", () => {
  it("beams cost 0.5 per tick: Amprex, Glaxion, Ignis Wraith, Phage, Larkspur, Cortege", () => {
    for (const id of ["amprex", "glaxion", "ignis_wraith", "phage", "larkspur", "cortege", "spectra", "tenet_cycron"]) {
      const s = build(id);
      expect(s.ammoCost, id).toBe(0.5);
      expect(s.sustainedDps, id).toBeCloseTo(sustained(s, 0.5), 6);
    }
  });
  it("Ballistica Prime 4, Panthera / Prime 2, Twin Grakatas 2 (wiki Normal Attack/Shot)", () => {
    for (const [id, cost] of [["ballistica_prime", 4], ["panthera", 2], ["panthera_prime", 2], ["twin_grakatas", 2]] as const) {
      const s = build(id);
      expect(s.ammoCost, id).toBe(cost);
      expect(s.sustainedDps, id).toBeCloseTo(sustained(s, cost), 6);
    }
  });
  it("left alone: Regulators (mag 0, no reload) and Artemis Bow (15 energy per shot, magazine 1)", () => {
    for (const id of ["regulators", "regulators_prime", "artemis_bow", "artemis_bow_prime"]) {
      expect(byId(id).ammoCost, id).toBeUndefined();
    }
  });
  it("Incarnon Forms do not inherit the base cost (wiki Incarnon Form AmmoCost 1)", () => {
    for (const id of ["ballistica_prime", "gammacor", "synoid_gammacor"]) {
      const form = getIncarnonFormAttack(incarnonDataMap.get(id)!)!;
      expect(form, id).toBeDefined();
      expect(applyIncarnonFormToWeapon(byId(id), form).ammoCost, id).toBeUndefined();
    }
  });
});

describe("R43 item 2: exact situational-radial names (Staticor)", () => {
  it("Staticor's normal-fire Uncharged Explosion counts in DPS", () => {
    const s = build("staticor");
    expect(s.radialAttacks?.map((r) => r.name)).toEqual(["Uncharged Explosion"]);
    expect(s.radialBurstDps ?? 0).toBeGreaterThan(0);
    const avgCrit = 1 + s.criticalChance * (s.criticalMultiplier - 1);
    expect(s.radialBurstDps!).toBeCloseTo(s.radialAttacks![0]!.totalDamage * s.effectiveFireRate! * avgCrit, 6);
  });
  it("Staticor Charged keeps its Fully Charged Explosion as the primary of that mode", () => {
    const s = calculateWeaponBuild(applyAlternateMode(byId("staticor")), [], modsMap);
    expect(s.radialAttacks?.map((r) => r.name)).toEqual(["Fully Charged Explosion"]);
    expect(s.radialBurstDps ?? 0).toBeGreaterThan(0);
  });
  it("exact names, not substrings", () => {
    expect(isSituationalRadial("Uncharged Explosion", false)).toBe(false);
    expect(isSituationalRadial("Uncharged AoE", false)).toBe(false);
    expect(isSituationalRadial("Charged Shot Explosion", false)).toBe(true);
    expect(isSituationalRadial("Charged Shot Explosion", true)).toBe(false);
    expect(isSituationalRadial("Alt-Fire Explosion", true)).toBe(true);
    expect(isSituationalRadial("charged throw recall explosion", true)).toBe(true);
    expect(isSituationalRadial("3rd Attack Radial Attack", false)).toBe(true);
    expect(isSituationalRadial("Explosion", false)).toBe(false);
  });
});

describe("R43 item 3: data fixes (wiki Module:Weapons/data)", () => {
  it("Artemis Bow / Prime reload 0.9", () => {
    expect(byId("artemis_bow").reloadTime).toBe(0.9);
    expect(byId("artemis_bow_prime").reloadTime).toBe(0.9);
  });
  it("standalone Rabvee strike fire rate 0.85 (Module:Weapons/data/modular Rabvee Strike)", () => {
    expect(byId("rabvee").fireRate).toBe(0.85);
  });
  it("Ballistica Prime trigger Charge; the base row is still the wiki Normal Shot (no charge wait)", () => {
    const w = byId("ballistica_prime");
    expect(w.triggerType).toBe("Charge");
    expect(w.defaultModeLabel).toBe("Normal Shot");
    expect(build("ballistica_prime").effectiveFireRate).toBeCloseTo(w.fireRate, 6);
  });
  it("Tiberon Prime trigger Auto (base stats are the Auto mode)", () => {
    expect(byId("tiberon_prime").triggerType).toBe("Auto");
    expect(build("tiberon_prime").effectiveFireRate).toBeCloseTo(8.33, 6);
  });
});

describe("R43 item 4: the directly hit enemy takes the full radial", () => {
  it("Acceltra: radial DPS uses full damage; the panel row keeps the area average", () => {
    const s = build("acceltra");
    const r = s.radialAttacks!.find((x) => (x.burstDps ?? 0) > 0)!;
    const avgCrit = 1 + s.criticalChance * (s.criticalMultiplier - 1);
    expect(r.burstDps).toBeCloseTo(r.totalDamage * s.effectiveFireRate! * s.multishot * avgCrit, 6);
    expect(r.avgDamage).toBeCloseTo(r.totalDamage * (1 - (r.falloffReduction ?? 0) / 2), 6);
  });
});

describe("R43 item 5 (final): bows keep the pre-R43 cycle, charge + reload per arrow (nock time)", () => {
  it("Paris: 1 / (0.5 + 0.65) = 0.87/s; sustained = burst (the nock is in the cycle)", () => {
    const s = build("paris");
    expect(s.effectiveFireRate).toBeCloseTo(1 / (0.5 + 0.65), 6);
    expect(s.sustainedDps).toBeCloseTo(s.burstDps, 6);
  });
  it("x2 for Bows: Speed Trigger (+60%) -> charge 0.5 / 2.2, reload unchanged", () => {
    expect(build("paris", ["speed_trigger_r3"]).effectiveFireRate).toBeCloseTo(1 / (0.5 / 2.2 + 0.65), 4);
  });
  it("multishot still multiplies bow damage per shot: Paris + Split Chamber (+90%) -> 1.9x burst, same rate", () => {
    // Split Flights is on-hit stacks (sim kill stacks), so the always-on multishot mod is Split Chamber.
    const bare = build("paris");
    const sc = build("paris", ["split_chamber_r3"]);
    expect(sc.multishot).toBeCloseTo(1.9, 4);
    expect(sc.effectiveFireRate).toBeCloseTo(bare.effectiveFireRate!, 6);
    expect(sc.burstDps).toBeCloseTo(bare.burstDps * 1.9, 4);
    expect(sc.sustainedDps).toBeCloseTo(sc.burstDps, 6);
  });
  it("Lenz 1 / (1.2 + 0.6), Prisma Lenz keeps 0.8 s: 1 / (0.8 + 0.6)", () => {
    expect(build("lenz").effectiveFireRate).toBeCloseTo(1 / 1.8, 6);
    expect(byId("prisma_lenz").chargeTime).toBe(0.8);
    expect(build("prisma_lenz").effectiveFireRate).toBeCloseTo(1 / 1.4, 6);
  });
  it("Artemis Bow takes the wiki 0.9 s reload in its cycle: 1 / (1 + 0.9)", () => {
    expect(build("artemis_bow").effectiveFireRate).toBeCloseTo(1 / 1.9, 6);
  });
});
