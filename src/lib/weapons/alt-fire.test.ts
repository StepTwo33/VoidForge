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
        const sum = ["impact", "puncture", "slash", "heat", "cold", "toxin", "electricity", "radiation", "viral", "corrosive", "blast", "gas", "magnetic", "tau"]
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
    // Still a bow: one arrow then the 0.6 s reload -> 1 shot per (1/1 + 0.6) = 1.6 s, reload in the cycle.
    expect(s.effectiveFireRate).toBeCloseTo(1 / 1.6, 6);
    expect(prim.effectiveFireRate).toBeCloseTo(1 / (0.5 + 0.6), 6); // existing bow cycle, unchanged
    // 190 quantises to 195.9375 (29 + 2 + 2 steps of 190/32, the same rule as the charged shot);
    // x (1 + 0.36 x 1) / 1.6 s = 166.6 burst = sustained (as for the primary bow).
    expect(s.totalDamage).toBeCloseTo(195.9375, 6);
    near(s.burstDps, (195.9375 * 1.36) / 1.6);
    near(s.sustainedDps, s.burstDps);
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

describe("ALT FIRE: Batch 2 tap vs hold, hand-worked against wiki.warframe.com", () => {
  const prim = (id: string, mods: string[] = []) => calcWith(mods)(byId(id));
  const names = (rows?: { name: string }[]) => (rows ?? []).map((r) => r.name);

  // Paris family / Cernos family / Dread: the quick tap is half the charged hit, fired at the wiki fire rate with no charge wait.
  // Still bows: one arrow then the reload, so shots/s = 1 / (1 / FR + reload) and burst = sustained (as for the primary).
  it("bow quick taps: half the charged hit; DPS = dmg x (1 + cc x (cm - 1)) / (1 / FR + reload)", () => {
    const rows: [string, number, number, number, number, number][] = [
      // id, wiki dmg, cc, cm, fire rate, reload
      ["paris", 160, 0.3, 2, 1, 0.65],
      ["paris_prime", 180, 0.45, 2, 1, 0.7],
      ["mk1_paris", 115, 0.3, 2, 1, 0.55],
      ["dread", 168, 0.5, 2, 1, 0.7],
      ["mutalist_cernos", 205, 0.15, 2, 1, 0.6],
      ["rakta_cernos", 235, 0.35, 2, 1, 0.6],
      ["evensong", 325, 0.25, 2.2, 1, 0.6],
      ["cinta", 450, 0.2, 2, 0.667, 0.6],
    ];
    for (const [id, d, cc, cm, fr, reload] of rows) {
      const s = alt(id);
      near(s.totalDamage, d, 0.06); // engine quantises splits to 1/32 of the total
      expect(s.effectiveFireRate, id).toBeCloseTo(1 / (1 / fr + reload), 6);
      near(s.burstDps, (s.totalDamage * (1 + cc * (cm - 1))) / (1 / fr + reload));
      near(s.sustainedDps, s.burstDps);
    }
    // Paris 160 = 8 / 120 / 32 sits exactly on the grid: 160 x 1.3 = 208 per second of firing, / 1.65 s cycle = 126.06.
    near(alt("paris").burstDps, 208 / 1.65);
    near(alt("paris").sustainedDps, 208 / 1.65);
  });

  it("primary (charged) results for the bows are untouched", () => {
    expect(prim("paris").effectiveFireRate).toBeCloseTo(1 / (0.5 + 0.65), 6);
    expect(prim("paris").totalDamage).toBeCloseTo(330, 6);
  });

  // Ballistica: primary is the 4-round burst; the charged bolt is the alt. Fire Rate page: 1 / (1 + 1 / 3.33) = 0.769/s.
  it("Ballistica Charged Shot: 100 x 1.075 x 0.769 = 82.7 burst; 16 mag / 2 s reload -> 75.4 sustained", () => {
    const s = alt("ballistica");
    const eff = 1 / (1 + 1 / 3.33);
    expect(s.effectiveFireRate).toBeCloseTo(eff, 6);
    expect(s.totalDamage).toBe(100);
    near(s.burstDps, 100 * (1 + 0.15 * 0.5) * eff);
    near(s.sustainedDps, s.burstDps * (16 / eff) / (16 / eff + 2));
    expect(prim("ballistica").effectiveFireRate).toBeCloseTo(4 / (1 / 6.67 + 3 * 0.05), 6); // burst primary unchanged
  });

  it("Ballistica Prime Charged Shot: 4 bolts of 76 (78.375 on the grid), 4 ammo, 1 / (0.8 + 1 / 3.33)/s", () => {
    const s = alt("ballistica_prime");
    const eff = 1 / (0.8 + 1 / 3.33);
    expect(s.multishot).toBe(4);
    expect(s.ammoCost).toBe(4);
    expect(s.totalDamage).toBeCloseTo(78.375, 6);
    near(s.burstDps, 78.375 * 4 * 1.2 * eff); // 341.9 (wiki paper 76 x 4 x 1.2 x eff = 331.5)
  });

  it("Rakta Ballistica Charged Shot: 300 (309.375 on the grid) x 1.1 x 0.769 = 261.7", () => {
    near(alt("rakta_ballistica").burstDps, 309.375 * 1.1 * (1 / (1 + 1 / 3.33)));
  });

  it("the Ballistica 'Charged Shot' stand-in radial rows are gone (wiki: a projectile, not an explosion)", () => {
    for (const id of ["ballistica", "ballistica_prime", "rakta_ballistica"]) {
      expect(prim(id).radialAttacks ?? [], id).toEqual([]);
      expect(prim(id).radialBurstDps ?? 0, id).toBe(0);
      expect(alt(id).radialAttacks ?? [], id).toEqual([]);
    }
  });

  // Shotguns: 10 pellets, Fire Rate 3.33, no charge.
  it("Drakgoon / Kuva Drakgoon uncharged: 10 pellets of 40 / 23 at 3.33/s", () => {
    const d = alt("drakgoon");
    expect(d.multishot).toBe(10);
    expect(d.effectiveFireRate).toBeCloseTo(3.33, 6);
    near(d.burstDps, d.totalDamage * 10 * (1 + 0.05) * 3.33);
    near(d.totalDamage, 40, 0.04);
    const k = alt("kuva_drakgoon");
    near(k.burstDps, k.totalDamage * 10 * (1 + 0.19 * 1.1) * 3.33);
    near(k.totalDamage, 23, 0.04);
  });

  it("Miter uncharged: 100 per blade (96.875 on the grid) x 1.05 x 2.5 = 254.3; the Incarnon radial stays with the primary", () => {
    const s = alt("miter");
    near(s.burstDps, 96.875 * 1.05 * 2.5);
    expect(names(s.radialAttacks)).toEqual([]);
    expect(names(prim("miter").radialAttacks)).toEqual(["Incarnon Form Radial Attack"]);
  });

  // Perfect Shot and partial charges keep the bow's own cycle (charge + reload), same rule as the primary.
  it("Nataruk: Quick Shot 450 x 1.16 / (1 / 0.667 + 0.6); Perfect Shot 900 x 1.84 / (0.7 + 0.6)", () => {
    const [quick, perfect] = computeAltFire(byId("nataruk"), calcWith([]));
    expect(quick!.label).toBe("Quick Shot");
    expect(perfect!.label).toBe("Perfect Shot");
    near(quick!.stats.burstDps, (450 * (1 + 0.2 * 0.8)) / (1 / 0.667 + 0.6));
    expect(quick!.stats.forcedProcs).toContain("Impact");
    expect(perfect!.stats.effectiveFireRate).toBeCloseTo(1 / 1.3, 6);
    near(perfect!.stats.burstDps, 900 * (1 + 0.6 * 1.4) / 1.3);
  });

  it("Cinta Perfect Shot: 600 pure Heat, 600 x 1.2 / (1.05 + 0.6)", () => {
    const [, perfect] = computeAltFire(byId("cinta"), calcWith([]));
    expect(perfect!.stats.elements).toEqual([{ type: "heat", value: 600 }]);
    expect(perfect!.stats.puncture).toBe(0);
    near(perfect!.stats.burstDps, 600 * 1.2 / 1.65);
  });

  it("Daikyu Prime Quick Shot: 375 (386.7 on the grid) at 25% charge -> 1 / (0.25 + 0.6)/s", () => {
    const s = alt("daikyu_prime");
    expect(s.effectiveFireRate).toBeCloseTo(1 / 0.85, 6);
    near(s.burstDps, s.totalDamage * (1 + 0.4 * 1.4) / 0.85);
    near(s.totalDamage, 375, 0.04);
  });

  // Lanka: wiki fire rate is a 1e9 placeholder; like the full charge, timing comes from the charge alone.
  it("Lanka Partially Charged Shot: 200 Electricity x 1.2 / 0.33 s = 727.3", () => {
    const s = alt("lanka");
    expect(s.effectiveFireRate).toBeCloseTo(1 / 0.33, 6);
    near(s.burstDps, 200 * 1.2 / 0.33);
    expect(prim("lanka").effectiveFireRate).toBeCloseTo(1, 6);
  });

  // Real explosions: the quick / uncharged shot keeps only its own explosion row.
  it("Epitaph / Prime and Opticor / Vandal: the alt owns its explosion; the primary keeps only the charged one (Round 31)", () => {
    expect(names(alt("epitaph").radialAttacks)).toEqual(["Uncharged AoE"]);
    expect(names(alt("epitaph_prime").radialAttacks)).toEqual(["Uncharged AoE"]);
    expect(names(alt("opticor").radialAttacks)).toEqual(["Quick Shot AoE"]);
    expect(names(alt("opticor_vandal").radialAttacks)).toEqual(["Quick Shot AoE"]);
    expect(names(prim("opticor").radialAttacks)).toEqual(["Charged Shot AoE"]);
    expect(names(prim("epitaph").radialAttacks)).toEqual([]);
    expect(names(alt("evensong").radialAttacks)).toEqual([]);
    expect(names(prim("evensong").radialAttacks)).toEqual(["Charged Radial Attack"]);
    expect(names(alt("mutalist_cernos").radialAttacks)).toEqual([]);
    expect(names(prim("mutalist_cernos").radialAttacks)).toEqual(["Toxin Cloud"]);
  });

  it("Opticor Quick Shot direct hit: 500 x 1.3 x 1/s = 650 (explosion DPS added separately)", () => {
    const s = alt("opticor");
    expect(s.totalDamage).toBe(500);
    expect(s.effectiveFireRate).toBeCloseTo(1, 6);
    expect(s.burstDps).toBeGreaterThan(650);
    near(s.burstDps - (s.radialBurstDps ?? 0), 650, 0.01);
  });

  it("Sirocco has no ALT FIRE (wiki: it lacks an Alternate Fire function)", () => {
    expect(getAltFireModes(byId("sirocco"))).toEqual([]);
  });

  // Shred: +30% Fire Rate (x2 for Bows) -> +60% on a bow, quick tap included (same as the charged primary).
  it("bow quick taps keep the x2 for Bows fire-rate bonus: Paris + Shred -> 1 / (1 / 1.6 + 0.65)", () => {
    expect(modsMap.get("shred")!.description).toMatch(/x2 for Bows/);
    const q = alt("paris", ["shred"]);
    const p = prim("paris", ["shred"]);
    expect(q.effectiveFireRate).toBeCloseTo(1 / (1 / 1.6 + 0.65), 4);
    expect(p.effectiveFireRate).toBeCloseTo(1 / (0.5 / 1.6 + 0.65), 4);
    const c = alt("cernos", ["shred"]);
    expect(c.effectiveFireRate).toBeCloseTo(1 / (1 / 1.6 + 0.6), 4);
  });

  it("mods apply: Serration scales the Paris quick tap by the same factor as the charged shot", () => {
    const p = prim("paris", PRIMARY_MODS), q = alt("paris", PRIMARY_MODS);
    expect(q.totalDamage / 160).toBeCloseTo(p.totalDamage / 330, 2);
  });
});

describe("ALT FIRE: Batch 3 fire-mode toggles, hand-worked against wiki.warframe.com", () => {
  const altOf = (id: string, label: string, mods: string[] = []) =>
    computeAltFire(byId(id), calcWith(mods)).find((r) => r.label === label)!;
  const primOf = (id: string) => calculateWeaponBuild(byId(id), [], modsMap);
  const radNames = (s: { radialAttacks?: { name: string }[] }) => (s.radialAttacks ?? []).map((r) => r.name);

  it("Kuva Zarr Barrage: 10 pellets x 50 x (1 + 0.37 x 1.5) x 2.17/s = 1,687", () => {
    const s = altOf("kuva_zarr", "Barrage Mode").stats;
    expect(s.multishot).toBeCloseTo(10, 6);
    near(s.burstDps, 500 * (1 + 0.37 * 1.5) * 2.17);
  });

  it("Ambassador Charge: 1 / (1 s + 1 / 1) = 0.5/s; 600 direct + 800 explosion; primary keeps no explosion", () => {
    const s = altOf("ambassador", "Charge Mode").stats;
    expect(s.effectiveFireRate).toBeCloseTo(0.5, 6);
    expect(s.ammoCost).toBe(16);
    expect(radNames(s)).toEqual(["Charged AoE"]);
    near(s.burstDps - (s.radialBurstDps ?? 0), 600 * (1 + 0.16 * 1.8) * 0.5);
    expect(radNames(primOf("ambassador"))).toEqual([]);
  });

  it("Argonak Full Auto: 57 x (1 + 0.09 x 0.5) x 6/s; semi-auto stays the primary", () => {
    const s = altOf("argonak", "Full Auto Mode").stats;
    expect(s.effectiveFireRate).toBeCloseTo(6, 6);
    expect(s.criticalChance).toBeCloseTo(0.09, 6);
    expect(primOf("argonak").fireRate).toBeCloseTo(4.33, 2);
  });

  it("Fulmin / Prime Semi-Auto: 500 / 550 x (1 + 0.3 x 1.2) x 2.17/s, 10 ammo, forced Impact", () => {
    const f = altOf("fulmin", "Semi-Auto Mode").stats;
    near(f.burstDps, 500 * 1.36 * 2.17);
    expect(f.ammoCost).toBe(10);
    expect(f.forcedProcs).toEqual(["Impact"]);
    near(altOf("fulmin_prime", "Semi-Auto Mode").stats.burstDps, 550 * 1.36 * 2.17);
  });

  it("Stradavar / Prime Semi-Auto: 50 x 1.28 x 5 = 320; 80 x 1.54 x 3.33 = 410.2", () => {
    near(altOf("stradavar", "Semi-Auto Mode").stats.burstDps, 320);
    const p = altOf("stradavar_prime", "Semi-Auto Mode").stats;
    near(p.burstDps, 80 * 1.54 * 3.33);
    expect(p.ammoCost).toBe(2);
  });

  it("Zenith Semi-Auto: 150 x (1 + 0.35 x 1.5) x 3 = 686.25, 3 ammo, 1.4 s reload", () => {
    const s = altOf("zenith", "Semi-Auto Mode").stats;
    near(s.burstDps, 686.25);
    expect(s.reloadTime).toBeCloseTo(1.4, 6);
    expect(s.ammoCost).toBe(3);
  });

  it("Fusilai Semi-Auto: 3 knives x 77 x (1 + 0.03 x 0.5) x 1.5/s = 351.7", () => {
    const s = altOf("fusilai", "Semi-Auto Mode").stats;
    expect(s.multishot).toBeCloseTo(3, 6);
    near(s.burstDps, 3 * 77 * 1.015 * 1.5);
    expect(radNames(primOf("fusilai"))).toEqual([]);
  });

  it("Hystrix / Prime: three alt quills, each forcing its own element; the primary loses its stand-in row", () => {
    for (const id of ["hystrix", "hystrix_prime"]) {
      const modes = computeAltFire(byId(id), calcWith([]));
      expect(modes.map((m) => m.label)).toEqual(["Fire Quill", "Electric Quill", "Ice Quill"]);
      expect(modes.map((m) => m.stats.forcedProcs)).toEqual([["Heat"], ["Electricity"], ["Cold"]]);
      expect(radNames(primOf(id))).toEqual([]);
    }
    // Fire Quill 40 (2.4 / 34.4 / 3.2) quantises to 41.25 (32nds of the total), like the primary's 36 -> 37.125.
    const fire = altOf("hystrix", "Fire Quill").stats;
    near(fire.totalDamage, 41.25);
    near(fire.burstDps, 41.25 * (1 + 0.24 * 1.2) * 7);
  });

  it("Sepulcrum Lock-On: stats shown, DPS hidden (kill gauge, no ammo); explosion listed with it", () => {
    const r = altOf("sepulcrum", "Lock-On Mode");
    expect(r.showDps).toBe(false);
    expect(r.stats.totalDamage).toBeCloseTo(96, 6);
    expect(radNames(r.stats)).toEqual(["Lock-On Radial Attack"]);
    expect(radNames(primOf("sepulcrum"))).toEqual(["Radial Attack"]);
  });

  it("Tenet Diplos Lock-on: 2-shot burst, 2 / (1 / 1 + 0.06) = 1.887 shots/s per target", () => {
    const s = altOf("tenet_diplos", "Lock-on Mode").stats;
    expect(s.effectiveFireRate).toBeCloseTo(2 / 1.06, 4);
    near(s.burstDps, 28 * (1 + 0.36 * 1.2) * (2 / 1.06));
    expect(radNames(primOf("tenet_diplos"))).toEqual([]);
  });

  it("Haalvu burst mode: Tau 34, 2 / (1 / 12 + 0.05) = 15 shots/s per target", () => {
    const s = altOf("haalvu", "Alt-Fire (burst mode)").stats;
    expect(s.effectiveFireRate).toBeCloseTo(15, 4);
    near(s.burstDps, 34 * (1 + 0.2 * 0.8) * 15);
  });

  it("mods apply: Serration-style damage mods scale the Stradavar semi mode like the primary", () => {
    const p = calcWith(PRIMARY_MODS)(byId("stradavar")), q = altOf("stradavar", "Semi-Auto Mode", PRIMARY_MODS).stats;
    expect(q.totalDamage / 50).toBeCloseTo(p.totalDamage / 28, 2);
  });
});

describe("ALT FIRE: Batch 4a alt-fire shots, hand-worked against wiki.warframe.com", () => {
  const altOf = (id: string, label: string, mods: string[] = []) =>
    computeAltFire(byId(id), calcWith(mods)).find((r) => r.label === label)!;
  const primOf = (id: string) => calculateWeaponBuild(byId(id), [], modsMap);
  const radNames = (s: { radialAttacks?: { name: string }[] }) => (s.radialAttacks ?? []).map((r) => r.name);

  it("Stahlta: 600 x (1 + 0.4 x 2) / (1.6 s + 1 / 0.667) = 348.5; 20 ammo; the 1,200 explosion moves off the primary", () => {
    const s = altOf("stahlta", "Alt-Fire").stats;
    expect(s.effectiveFireRate).toBeCloseTo(1 / (1.6 + 1 / 0.667), 6);
    near(s.burstDps, 600 * 1.8 / (1.6 + 1 / 0.667));
    expect(s.ammoCost).toBe(20);
    expect(s.forcedProcs).toEqual(["Impact"]);
    expect(radNames(s)).toEqual(["Alt-Fire AoE"]);
    expect(radNames(primOf("stahlta"))).toEqual([]);
  });

  it("Kuva Hek: 28 pellets x 87 x (1 + 0.23 x 1.1) x 1.17/s; 4 ammo = one shot a magazine", () => {
    const s = altOf("kuva_hek", "Alt-Fire").stats;
    expect(s.multishot).toBeCloseTo(28, 6);
    near(s.burstDps, 28 * 87 * 1.253 * 1.17);
    near(s.sustainedDps, (28 * 87 * 1.253) / (1 / 1.17 + 1.9));
  });

  it("EFV-5 Jupiter Buckshot: 11 x 127 x 1.231 / (1 s + 1 / 7.8334), forced Corrosive; stand-in row gone", () => {
    const s = altOf("efv_5_jupiter", "Buckshot").stats;
    near(s.burstDps, 11 * 127 * 1.231 / (1 + 1 / 7.8334));
    expect(s.forcedProcs).toEqual(["Corrosive"]);
    expect(radNames(primOf("efv_5_jupiter"))).toEqual([]);
  });

  it("Harpak Harpoon: single shot (no burst), 100 x 1.325 x 1.5 = 198.75, forced Puncture", () => {
    const s = altOf("harpak", "Harpoon").stats;
    expect(s.effectiveFireRate).toBeCloseTo(1.5, 6);
    near(s.burstDps, 198.75);
    expect(s.forcedProcs).toEqual(["Puncture"]);
  });

  it("Panthera / Prime held blade: 100 x 1.25 x 2 = 250; 100 x 1.26 x 2 = 252; Prime ricochet stays on the primary", () => {
    near(altOf("panthera", "Alt-Fire").stats.burstDps, 250);
    const p = altOf("panthera_prime", "Alt-Fire").stats;
    near(p.burstDps, 252);
    expect(radNames(p)).toEqual([]);
    expect(radNames(primOf("panthera_prime"))).toEqual(["Radial Attack"]);
  });

  it("Alternox: 50 x 1.02 x 1.5 = 76.5 contact; pulse + explosion move to the alt", () => {
    const s = altOf("alternox", "Alt-Fire").stats;
    near(s.burstDps - (s.radialBurstDps ?? 0), 76.5);
    expect(radNames(s)).toEqual(["Alt-Fire Damage over Time", "Alt-Fire Explosion"]);
    expect(radNames(primOf("alternox"))).toEqual([]);
    expect(radNames(primOf("alternox_prime"))).toEqual([]);
  });

  it("EFV-8 Mars / Euphona Prime / Higasa: explosion moves or stand-in row goes", () => {
    expect(radNames(altOf("efv_8_mars", "Alt-Fire").stats)).toEqual(["Alt-Fire AoE"]);
    expect(radNames(primOf("efv_8_mars"))).toEqual([]);
    expect(altOf("euphona_prime", "Buckshot").stats.multishot).toBeCloseTo(10, 6);
    expect(radNames(primOf("euphona_prime"))).toEqual([]);
    expect(radNames(primOf("higasa"))).toEqual([]);
  });

  it("gauge-gated alts (Battacor, Higasa, Trumna / Prime): stats shown, DPS hidden", () => {
    for (const [id, label] of [["battacor", "Secondary Fire"], ["higasa", "Charged Shot"], ["trumna", "Alt-Fire Grenade"], ["trumna_prime", "Alt-Fire Grenade"]] as const) {
      const r = altOf(id, label);
      expect(r.showDps).toBe(false);
      expect(r.stats.ammoCost).toBe(0);
    }
    expect(radNames(primOf("battacor"))).toEqual([]);
    expect(radNames(altOf("battacor", "Secondary Fire").stats)).toEqual(["Secondary Fire AoE"]);
    for (const id of ["trumna", "trumna_prime"]) {
      expect(radNames(primOf(id))).toEqual(["Auto AoE"]);
      expect(radNames(altOf(id, "Alt-Fire Grenade").stats)).toEqual(["Grenade Bounce AoE"]);
    }
  });

  it("primary numbers unchanged: wiki attack 1 for every Batch 4a weapon", () => {
    const want: Record<string, [number, number]> = {
      alternox: [62, 4.33], alternox_prime: [75, 5.33], battacor: [66, 2.5], efv_5_jupiter: [61, 7.8334],
      efv_8_mars: [75, 6.5], euphona_prime: [325, 1.5], harpak: [50, 5], higasa: [26, 2.5], kuva_hek: [87, 2.17],
      panthera: [100, 3], panthera_prime: [100, 3.67], stahlta: [52, 6], trumna: [82, 4.67], trumna_prime: [85, 4.67],
    };
    for (const [id, [d, fr]] of Object.entries(want)) {
      const w = byId(id);
      expect(w.damage, id).toBeCloseTo(d, 2);
      expect(w.fireRate, id).toBeCloseTo(fr, 2);
    }
  });

  it("mods apply: Serration scales the Stahlta alt like the primary", () => {
    // Ratio to each mode's own unmodded total (the engine quantises the primary's 52 split).
    const p = calcWith(PRIMARY_MODS)(byId("stahlta")), p0 = primOf("stahlta");
    const q = altOf("stahlta", "Alt-Fire", PRIMARY_MODS).stats, q0 = altOf("stahlta", "Alt-Fire").stats;
    expect(q.totalDamage / q0.totalDamage).toBeCloseTo(p.totalDamage / p0.totalDamage, 2);
  });
});

describe("ALT FIRE: Batch 4b alt-fire shots, hand-worked against wiki.warframe.com", () => {
  const altOf = (id: string, label: string, mods: string[] = []) =>
    computeAltFire(byId(id), calcWith(mods)).find((r) => r.label === label)!;
  const primOf = (id: string) => calculateWeaponBuild(byId(id), [], modsMap);
  const radNames = (s: { radialAttacks?: { name: string }[] }) => (s.radialAttacks ?? []).map((r) => r.name);

  it("Tenora / Prime charged shot: 240 / 280 shown, 10 ammo, 1 / (0.8 s + 1 / FR)", () => {
    const t = altOf("tenora", "Charged Shot").stats;
    expect(t.arsenalDamage?.totalDamage ?? t.totalDamage).toBeCloseTo(240, 6);
    expect(t.effectiveFireRate).toBeCloseTo(1 / (0.8 + 1 / 10), 6);
    // engine quantises 48 / 144 / 48 to 1/32 of 240: 45 + 142.5 + 45 = 232.5
    near(t.burstDps, 232.5 * (1 + 0.34 * 2) / 0.9);
    expect(t.ammoCost).toBe(10);
    const p = altOf("tenora_prime", "Charged Shot").stats;
    expect(p.effectiveFireRate).toBeCloseTo(1 / (0.8 + 1 / 2), 6);
    expect(p.arsenalDamage?.totalDamage ?? p.totalDamage).toBeCloseTo(280, 6);
  });

  it("Corinth / Prime air burst: 100 Impact x 1.024 x FR, forced Impact; the explosion moves off the primary", () => {
    const c = altOf("corinth", "Air Burst").stats;
    expect(c.multishot).toBeCloseTo(1, 6);
    near(c.burstDps, 100 * 1.024 * 1.17);
    expect(c.forcedProcs).toEqual(["Impact"]);
    expect(radNames(c)).toEqual(["Air Burst Explosion"]);
    const p = altOf("corinth_prime", "Air Burst").stats;
    expect(p.ammoCost).toBe(4);
    near(p.burstDps, 100 * 1.024 * 0.667);
    expect(p.radialAttacks?.[0]?.totalDamage).toBeCloseTo(2200, 6);
    for (const id of ["corinth", "corinth_prime"]) expect(radNames(primOf(id))).toEqual(["Buckshot"]);
  });

  it("Basmu twin beams: 2 x 12 x (1 + 0.02 x 3.8) x 12/s = 309.9; heat radial stays on the primary", () => {
    const s = altOf("basmu", "Twin Beams").stats;
    expect(s.multishot).toBeCloseTo(2, 6);
    near(s.burstDps, 2 * 12 * 1.076 * 12);
    expect(radNames(s)).toEqual([]);
    expect(radNames(primOf("basmu"))).toEqual(["Radial Attack"]);
  });

  it("Paracyst harpoon: charge, not burst: 1 / (0.25 s + 1 / 5) = 2.22/s, 15 x 2.22 = 33.3", () => {
    const s = altOf("paracyst", "Infested Harpoon").stats;
    expect(s.effectiveFireRate).toBeCloseTo(1 / 0.45, 6);
    near(s.burstDps, 15 / 0.45);
  });

  it("Scyotid snare / Buzlok beacon / Enkaus ink shot: single shots at the wiki fire rate", () => {
    const sc = altOf("scyotid", "Snare").stats;
    expect(sc.multishot).toBeCloseTo(1, 6);
    expect(sc.ammoCost).toBe(4);
    near(sc.burstDps, 40 * (1 + 0.08 * 1.4) * 1.6);
    near(altOf("buzlok", "Tracking Beacon").stats.burstDps, 3 * 1.67);
    const e = altOf("enkaus", "Ink Shot").stats;
    near(e.burstDps, 16 * (1 + 0.16 * 0.8) * 2);
    expect(radNames(e)).toEqual(["Alt-Fire Radial Attack"]);
    expect(radNames(primOf("enkaus"))).toEqual([]);
  });

  it("Phantasma / Prime plasma bomb: 15 x 1.015 / (1 s + 1 / 2), forced Impact; explosions move off the primary", () => {
    for (const id of ["phantasma", "phantasma_prime"]) {
      const s = altOf(id, "Plasma Bomb").stats;
      expect(s.multishot, id).toBeCloseTo(1, 6);
      near(s.burstDps, 15 * 1.015 / 1.5);
      expect(s.forcedProcs).toEqual(["Impact"]);
      expect(radNames(s)).toEqual(["Plasma Bomb Explosion", "Cluster Bombs Explosion"]);
      expect(radNames(primOf(id))).toEqual([]);
    }
  });

  it("Quanta family cube: one cube (beams' innate 2 does not leak), both explosions listed, DPS hidden", () => {
    for (const [id, d] of [["quanta", 100], ["quanta_vandal", 100], ["tenet_quanta", 180]] as const) {
      const r = altOf(id, "Cube");
      expect(r.showDps, id).toBe(false);
      expect(r.stats.multishot, id).toBeCloseTo(1, 6);
      expect(r.stats.totalDamage, id).toBeCloseTo(d, 6);
      expect(r.stats.ammoCost, id).toBe(10);
      expect(radNames(r.stats)).toEqual(["Cube Explosion", "Cube (shot by player)"]);
      expect(radNames(primOf(id))).toEqual([]);
    }
  });

  it("utility alts show stats with DPS hidden: Cedo / Prime glaive, Azima turret, Mutalist Quanta orb", () => {
    for (const [id, label] of [["cedo", "Glaive"], ["cedo_prime", "Glaive"], ["azima", "Turret"], ["mutalist_quanta", "Infested Orb"]] as const) {
      expect(altOf(id, label).showDps, id).toBe(false);
      expect(radNames(primOf(id)), id).toEqual([]);
    }
    expect(altOf("azima", "Turret").stats.ammoCost).toBe(75);
    expect(altOf("cedo", "Glaive").stats.ammoCost).toBe(0);
    expect(radNames(altOf("cedo_prime", "Glaive").stats)).toEqual(["Glaive Radial Attack"]);
    expect(radNames(altOf("mutalist_quanta", "Infested Orb").stats)).toEqual(["Orb Explosion"]);
  });

  it("primary numbers unchanged: wiki attack 1 for every Batch 4b weapon", () => {
    const want: Record<string, [number, number]> = {
      tenora: [24, 11.67], tenora_prime: [28, 12.67], corinth: [90, 1.17], corinth_prime: [90, 1.42], basmu: [39, 12],
      buzlok: [60, 6.25], cedo: [30, 3.83], cedo_prime: [32, 4.5], paracyst: [33, 8.33], azima: [20, 10], scyotid: [40, 2.4],
      enkaus: [28, 12], quanta: [10, 12], quanta_vandal: [13, 12], mutalist_quanta: [25, 10], tenet_quanta: [18, 10],
      phantasma: [15, 12], phantasma_prime: [15, 12],
    };
    for (const [id, [d, fr]] of Object.entries(want)) {
      const w = byId(id);
      expect(w.damage, id).toBeCloseTo(d, 1);
      expect(w.fireRate, id).toBeCloseTo(fr, 1);
    }
  });

  it("mods apply: Serration scales the Corinth Prime alt like the primary", () => {
    const p = calcWith(PRIMARY_MODS)(byId("corinth_prime")), p0 = primOf("corinth_prime");
    const q = altOf("corinth_prime", "Air Burst", PRIMARY_MODS).stats, q0 = altOf("corinth_prime", "Air Burst").stats;
    expect(q.totalDamage / q0.totalDamage).toBeCloseTo(p.totalDamage / p0.totalDamage, 2);
  });

  it("held back for a decision: Stug, Aeolak, Tenet Plinx, Tenet Tetra, Coda Bassocyst have no alt section yet", () => {
    for (const id of ["stug", "aeolak", "tenet_plinx", "tenet_tetra", "coda_bassocyst"]) {
      if (weapons.some((w) => w.id === id)) expect(getAltFireModes(byId(id)), id).toEqual([]);
    }
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
