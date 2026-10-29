import { describe, expect, it } from "vitest";
import { modsMap } from "@/data/mods";
import { WEAPON_ALT_FIRE } from "@/data/weapon-alt-fire";
import { getEffectiveWeapons } from "@/lib/weapons/effective-data";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import { computeAltFire, getAltFireModes } from "@/lib/weapons/alt-fire";
import { applyAlternateMode, getAlternateModes, weaponHasStanceFormMode } from "@/lib/weapons/weapon-alternate-mode";
import type { Weapon } from "@/lib/types";

const weapons = getEffectiveWeapons();
const byId = (id: string) => weapons.find((w) => w.id === id)!;
const slots = (ids: string[]) =>
  ids.map((id, i) => ({ modId: id, rank: modsMap.get(id)!.maxRank, slotIndex: i }));
const calcWith = (ids: string[]) => (w: Weapon) => calculateWeaponBuild(w, slots(ids), modsMap);
const PRIMARY_MODS = ["serration_r3", "split_chamber_r3", "point_strike_r3", "vital_sense_r3"];
const SECONDARY_MODS = ["hornet_strike_r3", "barrel_diffusion_r3", "pistol_gambit_r3", "target_cracker_r3"];
const PRIMARY_CATS = new Set(["rifle", "bow", "shotgun", "launcher", "primary", "sniper", "sentinel_weapon"]);
const SECONDARY_CATS = new Set(["pistol", "secondary"]);
const controlMods = (w: Weapon) => (PRIMARY_CATS.has(w.category) ? PRIMARY_MODS : SECONDARY_CATS.has(w.category) ? SECONDARY_MODS : []);
/** The wiki's own numbers are rounded; the engine quantises damage splits, so allow 0.2%. */
const near = (actual: number, expected: number, rel = 0.002) =>
  expect(Math.abs(actual - expected) / expected).toBeLessThan(rel);
const alt = (id: string, mods: string[] = [], index = 0) => computeAltFire(byId(id), calcWith(mods))[index]!.stats;

describe("ALT FIRE: structure", () => {
  it("never changes the primary result (additive only), for every weapon that has an alt mode", () => {
    const ids = new Set([...Object.keys(WEAPON_ALT_FIRE), ...weapons.filter((w) => getAlternateModes(w).length > 0).map((w) => w.id)]);
    expect(ids.size).toBeGreaterThanOrEqual(24);
    for (const id of ids) {
      const w = byId(id);
      for (const mods of [[], controlMods(w)]) {
        const calc = calcWith(mods);
        const before = JSON.stringify(calc(w));
        computeAltFire(w, calc);
        expect(JSON.stringify(calc(w))).toBe(before);
      }
    }
  });

  it("weapons without alt-fire data get nothing", () => {
    expect(computeAltFire(byId("braton"), calcWith([]))).toEqual([]);
    expect(computeAltFire(null, calcWith([]))).toEqual([]);
  });

  it("every legacy toggle mode (11 weapons, 13 modes) now shows under ALT FIRE with byte-identical numbers", () => {
    let modes = 0;
    for (const w of weapons) {
      const legacy = getAlternateModes(w).map((m, i) => ({ m, i })).filter(({ m }) => !m.stanceType);
      if (!legacy.length) continue;
      for (const mods of [[], controlMods(w)]) {
        const calc = calcWith(mods);
        const shown = computeAltFire(w, calc);
        expect(shown.map((s) => s.label)).toEqual(legacy.map(({ m }) => m.label));
        legacy.forEach(({ i }, k) => expect(JSON.stringify(shown[k]!.stats)).toBe(JSON.stringify(calc(applyAlternateMode(w, i)))));
      }
      modes += legacy.length;
    }
    expect(modes).toBe(13);
  });

  it("Dark Split-Sword's Heavy Blade is a stance-form swap: it stays a form switch and is not listed under ALT FIRE", () => {
    const dss = byId("dark_split_sword");
    expect(weaponHasStanceFormMode(dss)).toBe(true);
    expect(getAltFireModes(dss)).toEqual([]);
    expect(weapons.filter((w) => weaponHasStanceFormMode(w)).map((w) => w.id)).toEqual(["dark_split_sword"]);
  });

  it("table data is self-consistent: damage = sum of its types, every mode has a label and a wiki note", () => {
    for (const [id, modes] of Object.entries(WEAPON_ALT_FIRE)) {
      expect(byId(id), id).toBeDefined();
      for (const m of modes) {
        const sum = ["impact", "puncture", "slash", "heat", "cold", "toxin", "electricity", "radiation", "viral", "corrosive", "blast", "gas", "magnetic"]
          .reduce((a, k) => a + ((m as unknown as Record<string, number>)[k] ?? 0), 0);
        expect(sum, `${id} ${m.label}`).toBeCloseTo(m.damage!, 6);
        expect(m.label.length).toBeGreaterThan(0);
        expect(m.note).toMatch(/^Wiki /);
      }
    }
  });

  it("mods apply to alt fire: Serration & co. scale Zarr Barrage by the same factor as the Cannon shot", () => {
    const calc = calcWith(PRIMARY_MODS);
    const prim = calc(byId("zarr"));
    const [barrage] = computeAltFire(byId("zarr"), calc);
    expect(barrage!.stats.totalDamage / 80).toBeCloseTo(prim.totalDamage / 25, 6);
    expect(prim.multishot).toBeCloseTo(1.9, 6);
    expect(barrage!.stats.multishot).toBeCloseTo(19, 6); // 10 pellets x 1.9
    expect(barrage!.stats.statusChance).toBeCloseTo(0.087, 6); // keeps its own 8.7% base
  });
});

describe("ALT FIRE: Batch 0, hand-worked against wiki.warframe.com", () => {
  // Zarr Barrage: 80/pellet x10, 3/s, 17% / 2.5x. Wiki page: burst 3012, sustained 926.76.
  it("Zarr Barrage: burst = 80 x (1 + 0.17 x 1.5) x 10 x 3 = 3012; sustained 926.76; cannon rows do not leak in", () => {
    const s = alt("zarr");
    expect(s.totalDamage).toBe(80);
    expect(s.multishot).toBe(10);
    near(s.burstDps, 3012);
    near(s.sustainedDps, 926.76);
    expect(s.radialAttacks ?? []).toEqual([]);
  });

  // Cernos Uncharged: 190, 1.0/s, no charge. Charged = 380.
  it("Cernos Uncharged Shot is half the charged hit with no charge wait", () => {
    const calc = calcWith([]);
    const prim = calc(byId("cernos"));
    const s = alt("cernos");
    expect(s.totalDamage / prim.totalDamage).toBeCloseTo(0.5, 6);
    expect(s.effectiveFireRate).toBeCloseTo(1, 6);
    expect(prim.effectiveFireRate).toBeCloseTo(1 / (0.5 + 0.6), 6); // existing bow cycle, unchanged
    // 190 quantises to 195.9375 (29 + 2 + 2 steps of 190/32, the same rule as the charged shot);
    // x (1 + 0.36 x 1) x 1/s = 266.5. Mag 1 + 0.6 s reload -> 1 shot per 1.6 s.
    expect(s.totalDamage).toBeCloseTo(195.9375, 6);
    near(s.burstDps, 195.9375 * 1.36);
    near(s.sustainedDps / s.burstDps, 1 / 1.6);
  });

  // Quellor Alt-Fire: 1,400, 40% / 2.2x, 50 ammo, 1.20 s charge, FR 1.0. Fire Rate page: 1/(1.2 + 1/1) = 0.4545/s.
  it("Quellor charged beam: 1,400 x 1.48 = 2,072 per shot, 1/2.2 shots/s, 50 ammo, 6 shots per 300 mag", () => {
    const s = alt("quellor");
    const eff = s.effectiveFireRate!;
    expect(eff).toBeCloseTo(1 / 2.2, 6);
    expect(s.ammoCost).toBe(50);
    near(s.burstDps / eff, 2072, 0.003);
    near(s.burstDps, 942.7, 0.003);
    near(s.sustainedDps, (6 * (s.burstDps / eff)) / (6 * 2.2 + 4), 1e-6); // 6 shots x 2.2 s + 4 s reload
  });

  // Glaive Prime Throw 180 (24% / 2.2x, 1.25/s), Charged Throw 360 (26% / 2.4x, 0.833/s) + their explosions.
  it("Glaive Prime throws: direct-hit DPS per row, explosions kept separate and only the matching ones", () => {
    const [thrown, charged] = computeAltFire(byId("glaive_prime"), calcWith([]));
    expect(thrown!.label).toBe("Throw");
    expect(charged!.label).toBe("Charged Throw");
    near(thrown!.stats.burstDps, 180 * (1 + 0.24 * 1.2) * 1.25); // 289.8
    near(charged!.stats.burstDps, 360 * (1 + 0.26 * 1.4) * 0.833); // 409.0
    const rows = (r: typeof thrown) => (r!.stats.radialAttacks ?? []).map((x) => [x.name, Math.round(x.totalDamage), x.radius]);
    expect(rows(thrown)).toEqual([["Throw Bounce Explosion", 296, 4.8], ["Throw Recall Explosion", 592, 4.8]]);
    expect(rows(charged)).toEqual([["Charged Throw Bounce Explosion", 592, 4.8], ["Charged Throw Recall Explosion", 1184, 4.8]]);
  });
});

describe("ALT FIRE: Batch 1 magazine dump, hand-worked against wiki.warframe.com", () => {
  // Fire rate is the wiki's listed figure (4.17/s = 1 / 0.24 s burst reload delay); the wiki page DPS uses it as-is.
  it("Pandero Prime: 104 x 1.54 x 4.17 = 667.9 burst, 439.0 sustained (wiki 667.86 / 439.02)", () => {
    const s = alt("pandero_prime");
    near(s.burstDps, 104 * (1 + 0.3 * 1.8) * 4.17);
    near(s.burstDps, 667.86);
    near(s.sustainedDps, 439.02);
    expect(s.effectiveFireRate).toBeCloseTo(4.17, 6);
  });

  it("Pandero: 72 x 1.54 x 4.17 = 462.4 burst; the old 'Alt-Fire' stand-in radial row is gone from the primary Radial Attack list too", () => {
    near(alt("pandero").burstDps, 72 * (1 + 0.3 * 1.8) * 4.17);
    for (const id of ["pandero", "pandero_prime"]) {
      expect(calculateWeaponBuild(byId(id), [], modsMap).radialAttacks ?? []).toEqual([]);
      expect(alt(id).radialAttacks ?? []).toEqual([]);
    }
  });

  // Nagantaka: wiki lists no charge time; the primary's bow-style charge is switched off for the dump.
  it("Nagantaka / Prime: 5/s dump, burst = dmg x (1 + cc x 1.3) x 5; sustained uses the 9 / 11 round magazine and 2.3 s reload", () => {
    near(alt("nagantaka").burstDps, 159 * (1 + 0.15 * 1.3) * 5);
    near(alt("nagantaka").sustainedDps, (9 * 159 * (1 + 0.15 * 1.3)) / (9 / 5 + 2.3));
    near(alt("nagantaka_prime").burstDps, 173 * (1 + 0.25 * 1.3) * 5);
    near(alt("nagantaka_prime").sustainedDps, (11 * 173 * (1 + 0.25 * 1.3)) / (11 / 5 + 2.3));
    expect(alt("nagantaka").effectiveFireRate).toBeCloseTo(5, 6);
  });

  // Athodai: a different shot, pure Heat at 12/s. Wiki page: burst 1246.08, sustained 623.04.
  it("Athodai / Prime: 88 (100) Heat, 12/s: burst 1246.08 / 1560; sustained 623.04 / 780", () => {
    const a = alt("athodai");
    near(a.burstDps, 88 * (1 + 0.18) * 12);
    near(a.burstDps, 1246.08);
    near(a.sustainedDps, 623.04);
    expect(a.puncture).toBe(0);
    near(alt("athodai_prime").burstDps, 100 * (1 + 0.2 * 1.5) * 12);
    near(alt("athodai_prime").sustainedDps, (24 * 100 * 1.3) / (24 / 12 + 2));
  });

  // Cyanex Burst Mode: 72 (2.88 / 30.24 / 38.88), 8% / 1.4x, 4.67/s, no explosion. The primary's real explosion stays.
  it("Cyanex Burst Mode: 72 x 1.032 x 4.67 = 347 on paper; the engine's damage quantisation gives 69.75 per shot (336)", () => {
    const s = alt("cyanex");
    expect(s.totalDamage).toBeCloseTo(69.75, 6); // 2.25 / 29.25 / 38.25 on the 72/32 grid
    near(s.burstDps, 69.75 * 1.032 * 4.67);
    near(s.burstDps, 346.99, 0.04); // wiki page figure, within the quantisation gap
    expect(s.radialAttacks ?? []).toEqual([]);
    const prim = calculateWeaponBuild(byId("cyanex"), [], modsMap);
    expect((prim.radialAttacks ?? []).map((r) => r.name)).toEqual(["Projectile Explosion"]); // real wiki explosion, untouched
  });

  // Kuva Kraken: primary is a 3-round burst (effective ~7.26/s); the alt dumps the magazine at 4.17/s with no burst timing.
  it("Kuva Kraken: 43 x (1 + 0.21 x 1.3) x 4.17 = 228.3 (wiki 365.21 includes its +60% progenitor bonus: 228.26 x 1.6)", () => {
    const calc = calcWith([]);
    const prim = calc(byId("kuva_kraken"));
    const s = alt("kuva_kraken");
    expect(s.effectiveFireRate).toBeCloseTo(4.17, 6);
    expect(prim.effectiveFireRate).toBeCloseTo(3 / (1 / 2.83 + 2 * 0.03), 6); // primary burst unchanged
    near(s.burstDps, 43 * (1 + 0.21 * 1.3) * 4.17);
    near(s.burstDps * 1.6, 365.21);
  });

  // Tenet Detron: 10 pellets of 26 Radiation, 2.0/s. Wiki sustained 727.22 includes the +60% progenitor bonus.
  it("Tenet Detron burst: 260 x 1.18 x 2 = 613.6 burst; sustained 6 shots / (3 s + 1.05 s) = 454.5 (wiki 727.22 / 1.6)", () => {
    const s = alt("tenet_detron");
    expect(s.multishot).toBe(10);
    expect(s.totalDamage).toBe(26);
    near(s.burstDps, 26 * 10 * 1.18 * 2);
    near(s.sustainedDps, (6 * 26 * 10 * 1.18) / (6 / 2 + 1.05));
    near(s.sustainedDps * 1.6, 727.22);
  });
});

describe("ALT FIRE: radial stand-in verdicts", () => {
  it("real wiki explosions on the primary stay (Cyanex, Glaive Prime, Staticor, Zarr)", () => {
    const names = (id: string) => (calculateWeaponBuild(byId(id), [], modsMap).radialAttacks ?? []).map((r) => r.name);
    expect(names("cyanex")).toContain("Projectile Explosion");
    expect(names("glaive_prime")).toContain("Throw Bounce Explosion");
    expect(names("staticor")).toContain("Uncharged Explosion");
    expect(names("zarr")).toContain("Cannon Mode Explosion");
  });
});

describe("ALT FIRE: wiki corrections to existing alt modes", () => {
  // wiki Corufell Prime attack 2 (Charged Projectile): status chance 14%, not the 20% the overlay inherited.
  it("Corufell Prime Heavy Projectile status chance is 14%", () => {
    const [heavy] = computeAltFire(byId("corufell_prime"), calcWith([]));
    expect(heavy!.stats.statusChance).toBeCloseTo(0.14, 6);
  });
});
