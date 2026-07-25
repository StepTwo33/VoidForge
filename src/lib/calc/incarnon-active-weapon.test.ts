import { describe, expect, it } from "vitest";
import { allWeapons } from "@/data/weapons";
import { incarnonDataMap } from "@/data/incarnon";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import { quantizeBaseCritMultiplier } from "@/lib/calc/crit-utils";
import {
  isIncarnonFormActive,
  resolveIncarnonActiveWeapon,
} from "@/lib/calc/incarnon-active-weapon";
import { mergeIncarnonStatChanges } from "@/lib/calc/weapon-stat-merges";
import { DEFAULT_SIM_PARAMS } from "@/lib/types";

const modsMap = () => new Map();

describe("Torid Incarnon Form", () => {
  const torid = allWeapons.find((w) => w.id === "torid")!;
  const data = incarnonDataMap.get("torid")!;

  it("detects form when tier-1 Incarnon Form is selected", () => {
    expect(isIncarnonFormActive({ 1: 0 }, data)).toBe(true);
    expect(isIncarnonFormActive({}, data)).toBe(false);
  });

  it("keeps grenade stats when form inactive", () => {
    const calc = resolveIncarnonActiveWeapon(torid, data, {});
    expect(calc.damage).toBe(torid.damage);
    expect(calc.fireRate).toBeCloseTo(torid.fireRate, 4);
    const stats = calculateWeaponBuild(calc, [], modsMap());
    expect(stats.fireRate).toBeCloseTo(torid.fireRate, 4);
    expect(stats.magazine).toBe(torid.magazine);
  });

  it("uses form beam stats when Incarnon Form selected", () => {
    const calc = resolveIncarnonActiveWeapon(torid, data, { 1: 0 });
    expect(calc.damage).toBe(51);
    expect(calc.toxin).toBe(51);
    expect(calc.fireRate).toBe(8);
    expect(calc.criticalChance).toBeCloseTo(0.29, 5);
    expect(calc.criticalMultiplier).toBeCloseTo(3.1, 5);
    expect(calc.statusChance).toBeCloseTo(0.39, 5);
    expect(calc.magazine).toBe(170);
    expect(calc.triggerType).toBe("Held");
    expect(calc.radialAttacks).toEqual([]);

    const stats = calculateWeaponBuild(calc, [], modsMap(), undefined, undefined, {
      incarnonFormActive: true,
    });
    expect(stats.fireRate).toBe(8);
    expect(stats.magazine).toBe(170);
    expect(stats.totalDamage).toBeCloseTo(51, 0);
  });

  it("Extended Volley adds +9 magazine", () => {
    const base = resolveIncarnonActiveWeapon(torid, data, { 1: 0 });
    const changes = mergeIncarnonStatChanges(data, { 1: 0, 3: 2 }, "torid");
    expect(changes?.flatMagazine).toBe(9);
    const stats = calculateWeaponBuild(base, [], modsMap(), changes, undefined, {
      incarnonFormActive: true,
    });
    expect(stats.magazine).toBe(179);
  });

  it("Plentiful Mayhem papers +31 flat + capacity-MS pellet % (form boosts MS bonuses)", () => {
    const changes = mergeIncarnonStatChanges(data, { 2: 1 }, "torid");
    expect(changes?.flatBaseDamage).toBe(31);
    expect(changes?.capacityMsDamageMult).toBeCloseTo(0.6, 5);
    const form = mergeIncarnonStatChanges(data, { 2: 1 }, "torid", { formActive: true });
    expect(form?.capacityMsDamageMult).toBe(0);
    expect(form?.capacityMsBonusMult).toBeCloseTo(0.6, 5);

    // Base: MS=2 → EV +60% × 1/2 → total ×1.3
    const bare = calculateWeaponBuild(torid, [], modsMap(), { flatBaseDamage: 31 });
    const withCap = calculateWeaponBuild(torid, [], modsMap(), {
      flatBaseDamage: 31,
      capacityMsDamageMult: 0.6,
      multishot: 1,
    });
    expect(withCap.multishot).toBeCloseTo(2, 5);
    expect(withCap.totalDamage).toBeCloseTo(bare.totalDamage * 1.3, 5);

    // Form: +20% MS from perk becomes +32% when capacityMsBonusMult 0.6
    const formMs = calculateWeaponBuild(torid, [], modsMap(), {
      multishot: 0.2,
      capacityMsBonusMult: 0.6,
    });
    expect(formMs.multishot).toBeCloseTo(1 * (1 + 0.2 * 1.6), 5);
  });

  it("Final Fusillade papers last-shot base MS EV (3/mag)", () => {
    const changes = mergeIncarnonStatChanges(data, { 2: 0 }, "torid");
    expect(changes?.flatBaseDamage).toBe(51);
    expect(changes?.lastShotBaseMultishot).toBe(3);
    const stats = calculateWeaponBuild(torid, [], modsMap(), changes);
    // Mag 5 → EV +3/5 base MS before % mods
    expect(stats.multishot).toBeCloseTo(1 + 3 / 5, 5);
  });

  it("flatBaseDamage scales against form base (51) when form active", () => {
    const formWeapon = resolveIncarnonActiveWeapon(torid, data, { 1: 0 });
    const formStats = calculateWeaponBuild(formWeapon, [], modsMap(), { flatBaseDamage: 51 });
    expect(formStats.totalDamage).toBeCloseTo(102, 0);

    const baseStats = calculateWeaponBuild(torid, [], modsMap(), { flatBaseDamage: 51 });
    // Wiki base Torid is 100 Toxin (direct); Incarnon cloud/radial is separate.
    expect(baseStats.totalDamage).toBeCloseTo(100 * (1 + 51 / 100), 0);
  });
});

describe("wiki-shaped Incarnon forms", () => {
  it("Paris form is Impact 95 + Heat 365 Charge / mag 20", () => {
    const paris = allWeapons.find((w) => w.id === "paris")!;
    const data = incarnonDataMap.get("paris")!;
    const form = resolveIncarnonActiveWeapon(paris, data, { 1: 0 });
    expect(form.impact).toBe(95);
    expect(form.heat).toBe(365);
    expect(form.damage).toBe(460);
    expect(form.magazine).toBe(20);
    expect(form.triggerType).toBe("Charge");
    expect(form.criticalChance).toBeCloseTo(0.4, 5);
    expect(form.criticalMultiplier).toBe(3);
    expect(form.statusChance).toBeCloseTo(0.2, 5);
  });

  it("Paris Prime form is Impact 100 + Heat 420 / 50%/3.4x/20%", () => {
    const prime = allWeapons.find((w) => w.id === "paris_prime")!;
    const data = incarnonDataMap.get("paris_prime")!;
    const form = resolveIncarnonActiveWeapon(prime, data, { 1: 0 });
    expect(form.impact).toBe(100);
    expect(form.heat).toBe(420);
    expect(form.damage).toBe(520);
    expect(form.magazine).toBe(20);
    expect(form.triggerType).toBe("Charge");
    expect(form.criticalChance).toBeCloseTo(0.5, 5);
    expect(form.criticalMultiplier).toBeCloseTo(3.4, 5);
    expect(form.statusChance).toBeCloseTo(0.2, 5);
  });

  it("Mk1-Paris form is Impact 50 + Heat 250 / 40%/3x/20%", () => {
    const mk1 = allWeapons.find((w) => w.id === "mk1_paris")!;
    const data = incarnonDataMap.get("mk1_paris")!;
    const form = resolveIncarnonActiveWeapon(mk1, data, { 1: 0 });
    expect(form.impact).toBe(50);
    expect(form.heat).toBe(250);
    expect(form.damage).toBe(300);
    expect(form.magazine).toBe(20);
    expect(form.triggerType).toBe("Charge");
    expect(form.criticalChance).toBeCloseTo(0.4, 5);
    expect(form.criticalMultiplier).toBe(3);
    expect(form.statusChance).toBeCloseTo(0.2, 5);
  });

  it("Lato form is IPS 64 Semi FR 3.5 / mag 24 with innate multishot 2", () => {
    const lato = allWeapons.find((w) => w.id === "lato")!;
    const data = incarnonDataMap.get("lato")!;
    const form = resolveIncarnonActiveWeapon(lato, data, { 1: 0 });
    expect(form.impact).toBe(16);
    expect(form.puncture).toBe(16);
    expect(form.slash).toBe(32);
    expect(form.damage).toBe(64);
    expect(form.fireRate).toBe(3.5);
    expect(form.magazine).toBe(24);
    expect(form.multishot).toBe(2);
    expect(form.triggerType).toBe("Semi");
    expect(form.criticalChance).toBeCloseTo(0.16, 5);
    expect(form.criticalMultiplier).toBeCloseTo(2.6, 5);
  });

  it("Lato Prime form is IPS 78 / FR 4 / 36%/3.2x/15% with MS 2", () => {
    const prime = allWeapons.find((w) => w.id === "lato_prime")!;
    const data = incarnonDataMap.get("lato_prime")!;
    const form = resolveIncarnonActiveWeapon(prime, data, { 1: 0 });
    expect(form.impact).toBeCloseTo(19.5, 5);
    expect(form.puncture).toBeCloseTo(19.5, 5);
    expect(form.slash).toBe(39);
    expect(form.damage).toBeCloseTo(78, 5);
    expect(form.fireRate).toBe(4);
    expect(form.multishot).toBe(2);
    expect(form.criticalChance).toBeCloseTo(0.36, 5);
    expect(form.criticalMultiplier).toBeCloseTo(3.2, 5);
    expect(form.statusChance).toBeCloseTo(0.15, 5);
  });

  it("Lato Vandal form is IPS 76 / FR 4 / 34%/3x/10% with MS 2", () => {
    const vandal = allWeapons.find((w) => w.id === "lato_vandal")!;
    const data = incarnonDataMap.get("lato_vandal")!;
    const form = resolveIncarnonActiveWeapon(vandal, data, { 1: 0 });
    expect(form.impact).toBe(19);
    expect(form.puncture).toBe(19);
    expect(form.slash).toBe(38);
    expect(form.damage).toBe(76);
    expect(form.fireRate).toBe(4);
    expect(form.multishot).toBe(2);
    expect(form.criticalChance).toBeCloseTo(0.34, 5);
    expect(form.criticalMultiplier).toBe(3);
    expect(form.statusChance).toBeCloseTo(0.1, 5);
  });

  it("Gorgon form is IPS 100 Auto FR 0.833 / mag 20 + delayed Heat 750 AoE", () => {
    const gorgon = allWeapons.find((w) => w.id === "gorgon")!;
    const data = incarnonDataMap.get("gorgon")!;
    const form = resolveIncarnonActiveWeapon(gorgon, data, { 1: 0 });
    expect(form.impact).toBe(20);
    expect(form.puncture).toBe(60);
    expect(form.slash).toBe(20);
    expect(form.damage).toBe(100);
    expect(form.fireRate).toBeCloseTo(0.833, 3);
    expect(form.magazine).toBe(20);
    expect(form.triggerType).toBe("Auto");
    expect(form.criticalChance).toBeCloseTo(0.21, 5);
    expect(form.criticalMultiplier).toBeCloseTo(1.9, 5);
    const aoe = form.radialAttacks?.find((a) => /incarnon form/i.test(a.name));
    expect(aoe?.heat).toBe(750);
    expect(aoe?.radius).toBe(5);
    expect(aoe?.explosionDelay).toBeCloseTo(1.1, 5);
  });

  it("Gorgon Wraith form is IPS 125 / FR 1 / 19%/2.1x/27% + Heat 750 delay 0.9", () => {
    const wraith = allWeapons.find((w) => w.id === "gorgon_wraith")!;
    const data = incarnonDataMap.get("gorgon_wraith")!;
    const form = resolveIncarnonActiveWeapon(wraith, data, { 1: 0 });
    expect(form.impact).toBe(25);
    expect(form.puncture).toBe(75);
    expect(form.slash).toBe(25);
    expect(form.damage).toBe(125);
    expect(form.fireRate).toBe(1);
    expect(form.criticalChance).toBeCloseTo(0.19, 5);
    expect(form.criticalMultiplier).toBeCloseTo(2.1, 5);
    expect(form.statusChance).toBeCloseTo(0.27, 5);
    const aoe = form.radialAttacks?.find((a) => /incarnon form/i.test(a.name));
    expect(aoe?.heat).toBe(750);
    expect(aoe?.explosionDelay).toBeCloseTo(0.9, 5);
  });

  it("Prisma Gorgon form is IPS 75 / FR 1.167 / 27%/2.3x/21% + Heat 700 delay 0.8", () => {
    const prisma = allWeapons.find((w) => w.id === "prisma_gorgon")!;
    const data = incarnonDataMap.get("prisma_gorgon")!;
    const form = resolveIncarnonActiveWeapon(prisma, data, { 1: 0 });
    expect(form.impact).toBe(15);
    expect(form.puncture).toBe(45);
    expect(form.slash).toBe(15);
    expect(form.damage).toBe(75);
    expect(form.fireRate).toBeCloseTo(1.167, 3);
    expect(form.criticalChance).toBeCloseTo(0.27, 5);
    expect(form.criticalMultiplier).toBeCloseTo(2.3, 5);
    expect(form.statusChance).toBeCloseTo(0.21, 5);
    const aoe = form.radialAttacks?.find((a) => /incarnon form/i.test(a.name));
    expect(aoe?.heat).toBe(700);
    expect(aoe?.explosionDelay).toBeCloseTo(0.8, 5);
  });

  it("Despair form is IPS 60 Auto FR 3 / mag 20 + Heat 160 radial", () => {
    const despair = allWeapons.find((w) => w.id === "despair")!;
    const data = incarnonDataMap.get("despair")!;
    const form = resolveIncarnonActiveWeapon(despair, data, { 1: 0 });
    expect(form.impact).toBe(3);
    expect(form.puncture).toBe(48);
    expect(form.slash).toBe(9);
    expect(form.damage).toBe(60);
    expect(form.fireRate).toBe(3);
    expect(form.magazine).toBe(20);
    expect(form.triggerType).toBe("Auto");
    expect(form.criticalChance).toBeCloseTo(0.3, 5);
    expect(form.criticalMultiplier).toBe(3);
    const radial = form.radialAttacks?.find((a) => /incarnon form/i.test(a.name));
    expect(radial?.heat).toBe(160);
    expect(radial?.radius).toBe(4);
  });

  it("Braton form is IPS 50 Auto FR 5 / mag 200 + Heat 50 AoE", () => {
    const braton = allWeapons.find((w) => w.id === "braton")!;
    const data = incarnonDataMap.get("braton")!;
    const form = resolveIncarnonActiveWeapon(braton, data, { 1: 0 });
    expect(form.impact).toBe(20);
    expect(form.puncture).toBe(2);
    expect(form.slash).toBe(28);
    expect(form.damage).toBe(50);
    expect(form.fireRate).toBe(5);
    expect(form.magazine).toBe(200);
    expect(form.triggerType).toBe("Auto");
    expect(form.criticalChance).toBeCloseTo(0.3, 5);
    expect(form.criticalMultiplier).toBe(3);
    expect(form.statusChance).toBeCloseTo(0.12, 5);
    const aoe = form.radialAttacks?.find((a) => /incarnon form/i.test(a.name));
    expect(aoe?.heat).toBe(50);
    expect(aoe?.radius).toBe(3);
  });

  it("Braton Prime form is IPS 70 / FR 5.67 / 30%/3x/30% + Heat 70 AoE", () => {
    const prime = allWeapons.find((w) => w.id === "braton_prime")!;
    const data = incarnonDataMap.get("braton_prime")!;
    const form = resolveIncarnonActiveWeapon(prime, data, { 1: 0 });
    expect(form.impact).toBe(28);
    expect(form.puncture).toBeCloseTo(2.8, 5);
    expect(form.slash).toBeCloseTo(39.2, 5);
    expect(form.damage).toBeCloseTo(70, 5);
    expect(form.fireRate).toBeCloseTo(5.67, 2);
    expect(form.criticalChance).toBeCloseTo(0.3, 5);
    expect(form.criticalMultiplier).toBe(3);
    expect(form.statusChance).toBeCloseTo(0.3, 5);
    const aoe = form.radialAttacks?.find((a) => /incarnon form/i.test(a.name));
    expect(aoe?.heat).toBe(70);
  });

  it("Braton Vandal form is IPS 65 / FR 4.67 / 38%/3.2x/22% + Heat 65 AoE", () => {
    const vandal = allWeapons.find((w) => w.id === "braton_vandal")!;
    const data = incarnonDataMap.get("braton_vandal")!;
    const form = resolveIncarnonActiveWeapon(vandal, data, { 1: 0 });
    expect(form.impact).toBe(26);
    expect(form.puncture).toBeCloseTo(2.6, 5);
    expect(form.slash).toBeCloseTo(36.4, 5);
    expect(form.damage).toBeCloseTo(65, 5);
    expect(form.fireRate).toBeCloseTo(4.67, 2);
    expect(form.criticalChance).toBeCloseTo(0.38, 5);
    expect(form.criticalMultiplier).toBeCloseTo(3.2, 5);
    expect(form.statusChance).toBeCloseTo(0.22, 5);
    const aoe = form.radialAttacks?.find((a) => /incarnon form/i.test(a.name));
    expect(aoe?.heat).toBe(65);
  });

  it("Mk1-Braton form is IPS 50 / 20%/2.4x/10% + Heat 50 AoE", () => {
    const mk1 = allWeapons.find((w) => w.id === "mk1_braton")!;
    const data = incarnonDataMap.get("mk1_braton")!;
    const form = resolveIncarnonActiveWeapon(mk1, data, { 1: 0 });
    expect(form.impact).toBe(20);
    expect(form.puncture).toBe(2);
    expect(form.slash).toBe(28);
    expect(form.damage).toBe(50);
    expect(form.fireRate).toBe(5);
    expect(form.criticalChance).toBeCloseTo(0.2, 5);
    expect(form.criticalMultiplier).toBeCloseTo(2.4, 5);
    expect(form.statusChance).toBeCloseTo(0.1, 5);
    const aoe = form.radialAttacks?.find((a) => /incarnon form/i.test(a.name));
    expect(aoe?.heat).toBe(50);
  });

  it("Latron form is Impact 50 Semi FR 3.33 / mag 40 + Puncture/Heat AoE", () => {
    const latron = allWeapons.find((w) => w.id === "latron")!;
    const data = incarnonDataMap.get("latron")!;
    const form = resolveIncarnonActiveWeapon(latron, data, { 1: 0 });
    expect(form.impact).toBe(50);
    expect(form.damage).toBe(50);
    expect(form.fireRate).toBeCloseTo(3.33, 2);
    expect(form.magazine).toBe(40);
    expect(form.triggerType).toBe("Semi");
    expect(form.criticalChance).toBeCloseTo(0.32, 5);
    expect(form.criticalMultiplier).toBe(3);
    expect(form.statusChance).toBeCloseTo(0.24, 5);
    const aoe = form.radialAttacks?.find((a) => /incarnon form/i.test(a.name));
    expect(aoe?.puncture).toBe(40);
    expect(aoe?.heat).toBe(40);
    expect(aoe?.totalDamage).toBe(80);
    expect(aoe?.radius).toBe(4);
  });

  it("Latron Prime form is 44%/3.4x/30%", () => {
    const prime = allWeapons.find((w) => w.id === "latron_prime")!;
    const data = incarnonDataMap.get("latron_prime")!;
    const form = resolveIncarnonActiveWeapon(prime, data, { 1: 0 });
    expect(form.impact).toBe(50);
    expect(form.fireRate).toBeCloseTo(3.33, 2);
    expect(form.criticalChance).toBeCloseTo(0.44, 5);
    expect(form.criticalMultiplier).toBeCloseTo(3.4, 5);
    expect(form.statusChance).toBeCloseTo(0.3, 5);
  });

  it("Latron Wraith form is FR 3.67 / 48%/3.4x/28%", () => {
    const wraith = allWeapons.find((w) => w.id === "latron_wraith")!;
    const data = incarnonDataMap.get("latron_wraith")!;
    const form = resolveIncarnonActiveWeapon(wraith, data, { 1: 0 });
    expect(form.impact).toBe(50);
    expect(form.fireRate).toBeCloseTo(3.67, 2);
    expect(form.criticalChance).toBeCloseTo(0.48, 5);
    expect(form.criticalMultiplier).toBeCloseTo(3.4, 5);
    expect(form.statusChance).toBeCloseTo(0.28, 5);
  });

  it("Onos form locks Held Radiation beam + charge Heat radial (wiki)", () => {
    const onos = allWeapons.find((w) => w.id === "onos")!;
    const data = incarnonDataMap.get("onos")!;
    const form = resolveIncarnonActiveWeapon(onos, data, { 1: 0 });
    // Default primary form attack is the Held Radiation beam.
    expect(form.radiation).toBe(30);
    expect(form.damage).toBe(30);
    expect(form.fireRate).toBe(2);
    expect(form.magazine).toBe(350);
    expect(form.triggerType).toBe("Held");
    expect(form.criticalChance).toBeCloseTo(0.14, 5);
    expect(form.criticalMultiplier).toBeCloseTo(1.6, 5);
    expect(form.statusChance).toBeCloseTo(0.18, 5);
    const radial = form.radialAttacks?.find((a) => /charge radial/i.test(a.name));
    expect(radial?.heat).toBe(1100);
    expect(radial?.radius).toBe(3);

    const off = calculateWeaponBuild(form, [], modsMap());
    const on = calculateWeaponBuild(form, [], modsMap(), undefined, undefined, {
      incarnonFormActive: true,
    });
    expect(on.radialBurstDps ?? 0).toBeGreaterThan(off.radialBurstDps ?? 0);
  });

  it("Onos charge mode locks Heat 2200 Charge FR 0.25 + radial (wiki)", () => {
    const onos = allWeapons.find((w) => w.id === "onos")!;
    const data = incarnonDataMap.get("onos")!;
    const form = resolveIncarnonActiveWeapon(onos, data, { 1: 0 }, { onosIncarnonMode: "charge" });
    expect(form.heat).toBe(2200);
    expect(form.damage).toBe(2200);
    expect(form.radiation).toBeUndefined();
    expect(form.fireRate).toBe(0.25);
    expect(form.magazine).toBe(350);
    expect(form.triggerType).toBe("Charge");
    expect(form.criticalChance).toBeCloseTo(0.38, 5);
    expect(form.criticalMultiplier).toBeCloseTo(3.2, 5);
    expect(form.statusChance).toBeCloseTo(0.26, 5);
    const radial = form.radialAttacks?.find((a) => /charge radial/i.test(a.name));
    expect(radial?.heat).toBe(1100);
  });

  it("Dread form is Impact/Slash/Heat 400 Charge FR 1.5 / mag 20", () => {
    const dread = allWeapons.find((w) => w.id === "dread")!;
    const data = incarnonDataMap.get("dread")!;
    const form = resolveIncarnonActiveWeapon(dread, data, { 1: 0 });
    expect(form.impact).toBe(100);
    expect(form.slash).toBe(100);
    expect(form.heat).toBe(200);
    expect(form.damage).toBe(400);
    expect(form.fireRate).toBe(1.5);
    expect(form.magazine).toBe(20);
    expect(form.triggerType).toBe("Charge");
    expect(form.criticalChance).toBeCloseTo(0.5, 5);
    expect(form.criticalMultiplier).toBe(3);
    expect(form.statusChance).toBeCloseTo(0.3, 5);
    expect(form.radialAttacks ?? []).toEqual([]);
  });

  it("Felarx form is Impact 200 + Radiation 400 Semi FR 1.5 / mag 60", () => {
    const felarx = allWeapons.find((w) => w.id === "felarx")!;
    const data = incarnonDataMap.get("felarx")!;
    const form = resolveIncarnonActiveWeapon(felarx, data, { 1: 0 });
    expect(form.impact).toBe(200);
    expect(form.radiation).toBe(400);
    expect(form.damage).toBe(600);
    expect(form.fireRate).toBe(1.5);
    expect(form.magazine).toBe(60);
    expect(form.triggerType).toBe("Semi");
    expect(form.criticalMultiplier).toBe(3);
    expect(form.statusChance).toBeCloseTo(0.2, 5);
    expect(form.multishot).toBe(1);
    expect(form.radialAttacks).toEqual([]);
  });

  it("Laetum form is Impact 100 Auto FR 6.67 / mag 216 + Radiation radial", () => {
    const laetum = allWeapons.find((w) => w.id === "laetum")!;
    const data = incarnonDataMap.get("laetum")!;
    const form = resolveIncarnonActiveWeapon(laetum, data, { 1: 0 });
    expect(form.impact).toBe(100);
    expect(form.slash).toBe(0);
    expect(form.damage).toBe(100);
    expect(form.fireRate).toBeCloseTo(6.67, 2);
    expect(form.magazine).toBe(216);
    expect(form.triggerType).toBe("Auto");
    expect(form.criticalChance).toBeCloseTo(0.22, 5);
    expect(form.criticalMultiplier).toBeCloseTo(2.2, 5);
    const radial = form.radialAttacks?.find((a) => /incarnon form/i.test(a.name));
    expect(radial).toBeDefined();
    expect(radial!.radiation).toBe(300);

    const off = calculateWeaponBuild(form, [], modsMap());
    const on = calculateWeaponBuild(form, [], modsMap(), undefined, undefined, {
      incarnonFormActive: true,
    });
    expect(on.radialBurstDps ?? 0).toBeGreaterThan(off.radialBurstDps ?? 0);
  });

  it("Burston form uses Auto Heat / FR 20 / mag 600", () => {
    const burston = allWeapons.find((w) => w.id === "burston")!;
    const data = incarnonDataMap.get("burston")!;
    const form = resolveIncarnonActiveWeapon(burston, data, { 1: 0 });
    expect(form.fireRate).toBe(20);
    expect(form.magazine).toBe(600);
    expect(form.triggerType).toBe("Auto");
    expect(form.heat).toBe(3);
    expect(form.radialAttacks?.some((a) => /incarnon form/i.test(a.name))).toBe(true);
  });

  it("Burston Prime syncs Heat 13 from form radial and uses 28% CC", () => {
    const prime = allWeapons.find((w) => w.id === "burston_prime")!;
    const data = incarnonDataMap.get("burston_prime")!;
    const form = resolveIncarnonActiveWeapon(prime, data, { 1: 0 });
    expect(form.heat).toBe(13);
    expect(form.damage).toBe(13);
    expect(form.criticalChance).toBeCloseTo(0.28, 5);
    expect(form.criticalMultiplier).toBe(3);
    expect(form.statusChance).toBeCloseTo(0.3, 5);
    expect(form.fireRate).toBe(20);
  });

  it("Soma form is 8-pellet shotgun", () => {
    const soma = allWeapons.find((w) => w.id === "soma")!;
    const data = incarnonDataMap.get("soma")!;
    const form = resolveIncarnonActiveWeapon(soma, data, { 1: 0 });
    expect(form.multishot).toBe(8);
    expect(form.fireRate).toBe(7);
    expect(form.magazine).toBe(200);
    expect(form.criticalChance).toBeCloseTo(0.1, 5);
    expect(form.criticalMultiplier).toBe(3);
    expect(form.statusChance).toBeCloseTo(0.025, 5);
    expect(form.slash).toBeCloseTo(5.28, 5);
  });

  it("Soma Prime form is 18 dmg/pellet / 10%/3.4x/3%", () => {
    const prime = allWeapons.find((w) => w.id === "soma_prime")!;
    const data = incarnonDataMap.get("soma_prime")!;
    const form = resolveIncarnonActiveWeapon(prime, data, { 1: 0 });
    expect(form.multishot).toBe(8);
    expect(form.fireRate).toBe(7);
    expect(form.magazine).toBe(200);
    expect(form.damage).toBeCloseTo(18, 5);
    expect(form.impact).toBeCloseTo(1.08, 5);
    expect(form.puncture).toBeCloseTo(5.04, 5);
    expect(form.slash).toBeCloseTo(11.88, 5);
    expect(form.criticalChance).toBeCloseTo(0.1, 5);
    expect(form.criticalMultiplier).toBeCloseTo(3.4, 5);
    expect(form.statusChance).toBeCloseTo(0.03, 5);
  });

  it("Phenmor form is Slash+Radiation Auto FR 13.33", () => {
    const phenmor = allWeapons.find((w) => w.id === "phenmor")!;
    const data = incarnonDataMap.get("phenmor")!;
    const form = resolveIncarnonActiveWeapon(phenmor, data, { 1: 0 });
    expect(form.slash).toBe(80);
    expect(form.radiation).toBe(60);
    expect(form.damage).toBe(140);
    expect(form.fireRate).toBeCloseTo(13.33, 2);
    expect(form.magazine).toBe(408);
  });

  it("melee Incarnon Form does not double base damage", () => {
    const hate = allWeapons.find((w) => w.id === "hate")!;
    const data = incarnonDataMap.get("hate")!;
    const form = resolveIncarnonActiveWeapon(hate, data, { 1: 0 });
    expect(form.damage).toBe(hate.damage);
  });

  it("Ruvox form converts Impact to Puncture and keeps total damage", () => {
    const ruvox = allWeapons.find((w) => w.id === "ruvox")!;
    const data = incarnonDataMap.get("ruvox")!;
    const off = resolveIncarnonActiveWeapon(ruvox, data, {});
    expect(off.impact).toBe(170);
    expect(off.puncture).toBe(0);
    const form = resolveIncarnonActiveWeapon(ruvox, data, { 1: 0 });
    expect(form.impact).toBe(0);
    expect(form.puncture).toBe(170);
    expect(form.damage).toBe(ruvox.damage);
  });

  it("form radials contribute only when incarnonFormActive", () => {
    const burston = allWeapons.find((w) => w.id === "burston")!;
    const data = incarnonDataMap.get("burston")!;
    const form = resolveIncarnonActiveWeapon(burston, data, { 1: 0 });
    const off = calculateWeaponBuild(form, [], modsMap());
    const on = calculateWeaponBuild(form, [], modsMap(), undefined, undefined, {
      incarnonFormActive: true,
    });
    expect(on.radialBurstDps ?? 0).toBeGreaterThan(off.radialBurstDps ?? 0);
  });
});

describe("evolution numeric fixes", () => {
  it("Despair Fatal Affliction / Elemental Balance / Survivor's Edge", () => {
    const data = incarnonDataMap.get("despair")!;
    expect(mergeIncarnonStatChanges(data, { 2: 0 }, "despair")?.flatBaseDamage).toBe(50);
    expect(mergeIncarnonStatChanges(data, { 2: 0 }, "despair")?.fatalAfflictionPerStatus).toBe(0.4);
    expect(mergeIncarnonStatChanges(data, { 4: 0 }, "despair")?.statusChance).toBe(0.24);
    expect(mergeIncarnonStatChanges(data, { 4: 1 }, "despair")?.criticalChance).toBe(0.12);
  });

  it("Vasto Lone Gun papers no-primary +40 flat / +14 mag", () => {
    const data = incarnonDataMap.get("vasto")!;
    expect(mergeIncarnonStatChanges(data, { 2: 0 }, "vasto")?.flatBaseDamage).toBe(106);
    expect(mergeIncarnonStatChanges(data, { 2: 0 }, "vasto")?.flatMagazine).toBe(14);
    expect(mergeIncarnonStatChanges(data, { 2: 0 }, "vasto_prime")?.flatBaseDamage).toBe(64);
    expect(mergeIncarnonStatChanges(data, { 2: 0 }, "vasto_prime")?.flatMagazine).toBe(14);
  });

  it("Vasto Prime Deathtrap papers +0.8× CM (not Vasto +2.2×)", () => {
    const data = incarnonDataMap.get("vasto")!;
    expect(mergeIncarnonStatChanges(data, { 2: 1 }, "vasto")?.criticalMultiplier).toBe(2.2);
    expect(mergeIncarnonStatChanges(data, { 2: 1 }, "vasto_prime")?.criticalMultiplier).toBe(0.8);
    expect(mergeIncarnonStatChanges(data, { 2: 1 }, "vasto_prime")?.flatBaseDamage).toBe(24);
  });

  it("Sybaris Extended Volley +8 / Well Rehearsed max stacks", () => {
    const data = incarnonDataMap.get("sybaris")!;
    expect(mergeIncarnonStatChanges(data, { 3: 0 }, "sybaris")?.flatMagazine).toBe(8);
    // Base X + (+5 × 3) consecutive weakpoint stacks
    expect(mergeIncarnonStatChanges(data, { 2: 0 }, "sybaris")?.flatBaseDamage).toBe(35);
    expect(mergeIncarnonStatChanges(data, { 2: 0 }, "dex_sybaris")?.flatBaseDamage).toBe(30);
  });

  it("Despair Vendetta papers +60 flat +30% MS +100% capacity-MS pellet mult (Dread+Hate set)", () => {
    const data = incarnonDataMap.get("despair")!;
    const changes = mergeIncarnonStatChanges(data, { 2: 1 }, "despair");
    expect(changes?.flatBaseDamage).toBe(60);
    expect(changes?.multishot).toBeCloseTo(0.3, 5);
    expect(changes?.capacityMsDamageMult).toBeCloseTo(1, 5);
  });

  it("Paris Vicious Promise papers undamaged +40% CC / +2× CM", () => {
    const data = incarnonDataMap.get("paris")!;
    expect(mergeIncarnonStatChanges(data, { 4: 0 }, "paris")).toMatchObject({
      criticalChance: 0.4,
      criticalMultiplier: 2,
    });
  });

  it("Paris Striking Succession assumes max stacks (+60)", () => {
    const data = incarnonDataMap.get("paris")!;
    expect(mergeIncarnonStatChanges(data, { 4: 2 }, "paris")?.flatBaseDamage).toBe(60);
  });

  it("Soma Fresh Havoc assumes max stacks (+12)", () => {
    const data = incarnonDataMap.get("soma")!;
    expect(mergeIncarnonStatChanges(data, { 4: 0 }, "soma")?.flatBaseDamage).toBe(12);
  });

  it("Orokin Reach / Mercenary Chamber / Hitman's Hoard encode range and ammo", () => {
    const ack = incarnonDataMap.get("ack_&_brunt") ?? incarnonDataMap.get("ack_brunt")!;
    expect(mergeIncarnonStatChanges(ack, { 3: 0 }, "ack_brunt")?.range).toBe(0.7);
    const atomos = incarnonDataMap.get("atomos")!;
    expect(mergeIncarnonStatChanges(atomos, { 3: 1 }, "atomos")?.ammoMaxSet).toBe(560);
    const angstrum = incarnonDataMap.get("angstrum")!;
    expect(mergeIncarnonStatChanges(angstrum, { 3: 2 }, "angstrum")?.flatAmmoMax).toBe(9);
    const braton = incarnonDataMap.get("braton")!;
    expect(mergeIncarnonStatChanges(braton, { 3: 0 }, "braton_prime")?.ammoMaxSet).toBe(1125);
  });

  it("Sybaris Elemental Dominance doubles status in form (Prime wiki +23%)", () => {
    const data = incarnonDataMap.get("sybaris")!;
    expect(mergeIncarnonStatChanges(data, { 4: 0 }, "sybaris")?.statusChance).toBe(0.15);
    expect(
      mergeIncarnonStatChanges(data, { 4: 0 }, "sybaris", { formActive: true })?.statusChance,
    ).toBeCloseTo(0.3, 5);
    expect(mergeIncarnonStatChanges(data, { 4: 0 }, "sybaris_prime")?.statusChance).toBe(0.08);
    expect(
      mergeIncarnonStatChanges(data, { 4: 0 }, "sybaris_prime", { formActive: true })?.statusChance,
    ).toBeCloseTo(0.23, 5);
  });

  it("Strun Elemental Balance uses form SC total ~132%", () => {
    const data = incarnonDataMap.get("strun")!;
    expect(mergeIncarnonStatChanges(data, { 4: 0 }, "strun")?.statusChance).toBeCloseTo(0.11, 5);
    expect(
      mergeIncarnonStatChanges(data, { 4: 0 }, "strun", { formActive: true })?.statusChance,
    ).toBeCloseTo(1.32, 5);
  });

  it("range and ammoMax appear on CalculatedStats", () => {
    const atomos = allWeapons.find((w) => w.id === "atomos")!;
    const ammo = mergeIncarnonStatChanges(incarnonDataMap.get("atomos")!, { 3: 1 }, "atomos");
    expect(calculateWeaponBuild(atomos, [], modsMap(), ammo).ammoMax).toBe(560);

    const gammacor = allWeapons.find((w) => w.id === "gammacor")!;
    const range = mergeIncarnonStatChanges(incarnonDataMap.get("gammacor")!, { 3: 1 }, "gammacor");
    expect(calculateWeaponBuild(gammacor, [], modsMap(), range).range).toBe(8);
  });

  it("punchThrough and projectileSpeed appear on CalculatedStats", () => {
    const despair = allWeapons.find((w) => w.id === "despair")!;
    const despairSpeed = mergeIncarnonStatChanges(
      incarnonDataMap.get("despair")!,
      { 3: 1 },
      "despair",
    );
    expect(despairSpeed?.projectileSpeed).toBe(0.5);
    expect(calculateWeaponBuild(despair, [], modsMap(), despairSpeed).projectileSpeed).toBe(0.5);

    const phenmor = allWeapons.find((w) => w.id === "phenmor")!;
    const phenmorSpeed = mergeIncarnonStatChanges(
      incarnonDataMap.get("phenmor")!,
      { 2: 2 },
      "phenmor",
    );
    expect(phenmorSpeed?.projectileSpeed).toBe(0.8);
    expect(calculateWeaponBuild(phenmor, [], modsMap(), phenmorSpeed).projectileSpeed).toBe(0.8);

    const boar = allWeapons.find((w) => w.id === "boar")!;
    const fortress = mergeIncarnonStatChanges(incarnonDataMap.get("boar")!, { 2: 1 }, "boar");
    expect(fortress?.flatBaseDamage).toBe(16);
    expect(fortress?.punchThrough).toBe(4);
    expect(calculateWeaponBuild(boar, [], modsMap(), fortress).punchThrough).toBe(4);

    const boltor = allWeapons.find((w) => w.id === "boltor")!;
    expect(mergeIncarnonStatChanges(incarnonDataMap.get("boltor")!, { 2: 0 }, "boltor")?.punchThrough).toBe(4);
    expect(
      mergeIncarnonStatChanges(incarnonDataMap.get("boltor")!, { 2: 0 }, "boltor_prime")?.punchThrough,
    ).toBe(4);

    const strun = allWeapons.find((w) => w.id === "strun")!;
    expect(mergeIncarnonStatChanges(incarnonDataMap.get("strun")!, { 2: 0 }, "strun")?.punchThrough).toBe(4);
    expect(calculateWeaponBuild(strun, [], modsMap(), mergeIncarnonStatChanges(incarnonDataMap.get("strun")!, { 2: 0 }, "strun")).punchThrough).toBe(4);

    const vectis = allWeapons.find((w) => w.id === "vectis")!;
    expect(mergeIncarnonStatChanges(incarnonDataMap.get("vectis")!, { 2: 0 }, "vectis")?.punchThrough).toBe(2);

    const bronco = allWeapons.find((w) => w.id === "bronco")!;
    expect(
      mergeIncarnonStatChanges(incarnonDataMap.get("bronco")!, { 2: 0 }, "bronco")?.projectileSpeed,
    ).toBe(0.6);
    expect(
      calculateWeaponBuild(
        bronco,
        [],
        modsMap(),
        mergeIncarnonStatChanges(incarnonDataMap.get("bronco")!, { 2: 0 }, "bronco"),
      ).projectileSpeed,
    ).toBe(0.6);
  });

  it("holster reload and instant-reload chances appear on CalculatedStats", () => {
    const dera = allWeapons.find((w) => w.id === "dera")!;
    const auto = mergeIncarnonStatChanges(incarnonDataMap.get("dera")!, { 3: 2 }, "dera");
    expect(auto?.holsterReloadPerSec).toBe(0.5);
    expect(calculateWeaponBuild(dera, [], modsMap(), auto).holsterReloadPerSec).toBe(0.5);

    const laetum = allWeapons.find((w) => w.id === "laetum")!;
    const ready = mergeIncarnonStatChanges(incarnonDataMap.get("laetum")!, { 3: 1 }, "laetum");
    expect(ready?.holsterReloadPerSec).toBe(0.3);
    expect(calculateWeaponBuild(laetum, [], modsMap(), ready).holsterReloadPerSec).toBe(0.3);

    const lato = allWeapons.find((w) => w.id === "lato")!;
    const penance = mergeIncarnonStatChanges(incarnonDataMap.get("lato")!, { 3: 2 }, "lato");
    expect(penance?.instantReloadOnKillChance).toBe(0.5);
    expect(calculateWeaponBuild(lato, [], modsMap(), penance).instantReloadOnKillChance).toBe(0.5);

    const furis = allWeapons.find((w) => w.id === "furis")!;
    const fortune = mergeIncarnonStatChanges(incarnonDataMap.get("furis")!, { 3: 2 }, "furis");
    expect(fortune?.instantReloadOnHeadshotChance).toBe(0.1);
    expect(calculateWeaponBuild(furis, [], modsMap(), fortune).instantReloadOnHeadshotChance).toBe(0.1);

    const phenmor = allWeapons.find((w) => w.id === "phenmor")!;
    const hsKill = mergeIncarnonStatChanges(incarnonDataMap.get("phenmor")!, { 3: 2 }, "phenmor");
    expect(hsKill?.instantReloadOnHeadshotChance).toBe(0.2);
    expect(calculateWeaponBuild(phenmor, [], modsMap(), hsKill).instantReloadOnHeadshotChance).toBe(0.2);

    const vasto = allWeapons.find((w) => w.id === "vasto")!;
    expect(
      mergeIncarnonStatChanges(incarnonDataMap.get("vasto")!, { 3: 2 }, "vasto")?.holsterReloadPerSec,
    ).toBe(0.2);
  });

  it("accuracy and recoil appear on CalculatedStats (aim-feel Genesis)", () => {
    const boltor = allWeapons.find((w) => w.id === "boltor")!;
    const mantra = mergeIncarnonStatChanges(incarnonDataMap.get("boltor")!, { 2: 0 }, "boltor");
    expect(mantra?.punchThrough).toBe(4);
    expect(mantra?.accuracy).toBe(0.4);
    expect(calculateWeaponBuild(boltor, [], modsMap(), mantra).accuracy).toBe(0.4);

    const ballistica = allWeapons.find((w) => w.id === "ballistica")!;
    const voids = mergeIncarnonStatChanges(incarnonDataMap.get("ballistica")!, { 3: 2 }, "ballistica");
    expect(voids).toMatchObject({ accuracy: 0.4, recoil: -0.4 });
    const voidsStats = calculateWeaponBuild(ballistica, [], modsMap(), voids);
    expect(voidsStats.accuracy).toBe(0.4);
    expect(voidsStats.recoil).toBe(-0.4);

    const bronco = allWeapons.find((w) => w.id === "bronco")!;
    const kinetic = mergeIncarnonStatChanges(incarnonDataMap.get("bronco")!, { 3: 0 }, "bronco");
    expect(kinetic?.recoil).toBe(-0.5);
    expect(calculateWeaponBuild(bronco, [], modsMap(), kinetic).recoil).toBe(-0.5);

    const boar = allWeapons.find((w) => w.id === "boar")!;
    const grip = mergeIncarnonStatChanges(incarnonDataMap.get("boar")!, { 3: 2 }, "boar");
    expect(grip?.accuracy).toBe(0.5);
    expect(calculateWeaponBuild(boar, [], modsMap(), grip).accuracy).toBe(0.5);

    const felarx = allWeapons.find((w) => w.id === "felarx")!;
    const baffle = mergeIncarnonStatChanges(incarnonDataMap.get("felarx")!, { 2: 1 }, "felarx");
    expect(baffle?.recoil).toBe(-0.5);
    expect(calculateWeaponBuild(felarx, [], modsMap(), baffle).recoil).toBe(-0.5);

    // Max-stack paper: Slayer's Nerve 10× / Lex Talionis 4×
    const cestra = allWeapons.find((w) => w.id === "cestra")!;
    const nerve = mergeIncarnonStatChanges(incarnonDataMap.get("cestra")!, { 3: 1 }, "cestra");
    expect(nerve).toMatchObject({ accuracy: 0.6, recoil: -0.6 });
    expect(calculateWeaponBuild(cestra, [], modsMap(), nerve)).toMatchObject({
      accuracy: 0.6,
      recoil: -0.6,
    });

    const lex = allWeapons.find((w) => w.id === "lex")!;
    const talionis = mergeIncarnonStatChanges(incarnonDataMap.get("lex")!, { 3: 0 }, "lex");
    expect(talionis).toMatchObject({ accuracy: 0.8, recoil: -0.8 });
    expect(calculateWeaponBuild(lex, [], modsMap(), talionis)).toMatchObject({
      accuracy: 0.8,
      recoil: -0.8,
    });
  });

  it("kill punch-through and Vicious Promise undamaged paper", () => {
    const dual = allWeapons.find((w) => w.id === "dual_toxocyst")!;
    const ripper = mergeIncarnonStatChanges(incarnonDataMap.get("dual_toxocyst")!, { 4: 2 }, "dual_toxocyst");
    expect(ripper?.punchThrough).toBe(3);
    expect(calculateWeaponBuild(dual, [], modsMap(), ripper).punchThrough).toBe(3);

    const onos = allWeapons.find((w) => w.id === "onos")!;
    const lance = mergeIncarnonStatChanges(incarnonDataMap.get("onos")!, { 4: 0 }, "onos");
    expect(lance?.punchThrough).toBe(2.5);
    expect(calculateWeaponBuild(onos, [], modsMap(), lance).punchThrough).toBe(2.5);

    const paris = allWeapons.find((w) => w.id === "paris")!;
    const promise = mergeIncarnonStatChanges(incarnonDataMap.get("paris")!, { 4: 0 }, "paris");
    expect(promise).toMatchObject({ criticalChance: 0.4, criticalMultiplier: 2 });
    const bare = calculateWeaponBuild(paris, [], modsMap());
    const withPromise = calculateWeaponBuild(paris, [], modsMap(), promise);
    expect(withPromise.criticalChance).toBeCloseTo(bare.criticalChance + 0.4, 5);
    expect(withPromise.criticalMultiplier).toBeCloseTo(
      quantizeBaseCritMultiplier(paris.criticalMultiplier + 2),
      5,
    );
  });

  it("combo generators / shard / Renewed Horror panel leftovers", () => {
    const innodem = allWeapons.find((w) => w.id === "innodem")!;
    const hawk = mergeIncarnonStatChanges(incarnonDataMap.get("innodem")!, { 3: 0 }, "innodem");
    expect(hawk).toMatchObject({ comboPerSlideMeters: 5, comboSlideMeterInterval: 10 });
    expect(calculateWeaponBuild(innodem, [], modsMap(), hawk).comboPerSlideMeters).toBe(5);
    expect(
      mergeIncarnonStatChanges(incarnonDataMap.get("innodem")!, { 4: 2 }, "innodem")?.comboOnFinisher,
    ).toBe(20);
    expect(
      mergeIncarnonStatChanges(incarnonDataMap.get("innodem")!, { 5: 1 }, "innodem")
        ?.stunRadiusOnFinisher,
    ).toBe(10);

    expect(
      mergeIncarnonStatChanges(incarnonDataMap.get("praedos")!, { 3: 0 }, "praedos")?.comboPerSlamHit,
    ).toBe(4);
    expect(
      mergeIncarnonStatChanges(incarnonDataMap.get("ruvox")!, { 3: 0 }, "ruvox")?.comboPerSlamHit,
    ).toBe(4);

    const thalys = allWeapons.find((w) => w.id === "thalys")!;
    const scythe = mergeIncarnonStatChanges(incarnonDataMap.get("thalys")!, { 3: 0 }, "thalys");
    expect(scythe?.comboPerSlideHit).toBe(5);
    expect(calculateWeaponBuild(thalys, [], modsMap(), scythe).comboPerSlideHit).toBe(5);
    expect(
      mergeIncarnonStatChanges(incarnonDataMap.get("thalys")!, { 3: 1 }, "thalys")?.comboOnShardDamage,
    ).toBe(1);
    expect(
      mergeIncarnonStatChanges(incarnonDataMap.get("thalys")!, { 4: 2 }, "thalys")
        ?.knockdownRadiusOnFinisher,
    ).toBe(6);
    const splinters = mergeIncarnonStatChanges(incarnonDataMap.get("thalys")!, { 5: 2 }, "thalys");
    expect(splinters).toMatchObject({
      shardDuration: 30,
      shardWeakSpotCritBonus: 1,
      shardDamageMult: -0.5,
    });
    expect(
      mergeIncarnonStatChanges(incarnonDataMap.get("thalys")!, { 5: 0 }, "thalys")
        ?.shardFullyGrownDamageMult,
    ).toBe(2);

    const torid = allWeapons.find((w) => w.id === "torid")!;
    const horror = mergeIncarnonStatChanges(incarnonDataMap.get("torid")!, { 3: 1 }, "torid");
    expect(horror?.lingeringFieldDurationMult).toBe(2);
    expect(calculateWeaponBuild(torid, [], modsMap(), horror).lingeringFieldDurationMult).toBe(2);
  });

  it("ruvox / praedos / ichor leftover utility panel + SC vulnerability", () => {
    const ruvox = allWeapons.find((w) => w.id === "ruvox")!;
    const gather = mergeIncarnonStatChanges(incarnonDataMap.get("ruvox")!, { 2: 2 }, "ruvox");
    expect(gather?.movementSpeed).toBe(0.6);
    expect(calculateWeaponBuild(ruvox, [], modsMap(), gather).movementSpeedBonus).toBe(0.6);

    expect(mergeIncarnonStatChanges(incarnonDataMap.get("ruvox")!, { 4: 1 }, "ruvox")?.extraJumps).toBe(
      1,
    );
    expect(
      mergeIncarnonStatChanges(incarnonDataMap.get("ruvox")!, { 4: 2 }, "ruvox")
        ?.finisherComboCountChance,
    ).toBe(0.3);
    expect(
      mergeIncarnonStatChanges(incarnonDataMap.get("ruvox")!, { 5: 2 }, "ruvox")
        ?.punctureStatusOnImpale,
    ).toBe(5);

    const serum = mergeIncarnonStatChanges(incarnonDataMap.get("ruvox")!, { 5: 1 }, "ruvox");
    expect(serum?.statusChanceVulnerability).toBe(0.35);
    const bare = calculateWeaponBuild(ruvox, [], modsMap());
    const withSerum = calculateWeaponBuild(ruvox, [], modsMap(), serum);
    expect(withSerum.statusChance).toBeCloseTo(bare.statusChance * 1.35, 5);

    const praedos = allWeapons.find((w) => w.id === "praedos")!;
    const leap = mergeIncarnonStatChanges(incarnonDataMap.get("praedos")!, { 4: 2 }, "praedos");
    expect(leap?.jumpStrength).toBe(1);
    expect(calculateWeaponBuild(praedos, [], modsMap(), leap).jumpStrength).toBe(1);
    expect(
      mergeIncarnonStatChanges(incarnonDataMap.get("praedos")!, { 5: 2 }, "praedos")
        ?.comboOnAmmoPickup,
    ).toBe(5);

    const ichor = allWeapons.find((w) => w.id === "dual_ichor")!;
    const parasite = mergeIncarnonStatChanges(
      incarnonDataMap.get("dual_ichor")!,
      { 4: 1 },
      "dual_ichor",
    );
    expect(parasite?.healRegenPerSec).toBe(33);
    expect(calculateWeaponBuild(ichor, [], modsMap(), parasite).healRegenPerSec).toBe(33);
  });

  it("melee utility / ammo restore / charge / silent Genesis panel", () => {
    const innodem = allWeapons.find((w) => w.id === "innodem")!;
    const twister = mergeIncarnonStatChanges(incarnonDataMap.get("innodem")!, { 3: 2 }, "innodem");
    expect(twister?.finisherDamage).toBe(0.6);
    expect(calculateWeaponBuild(innodem, [], modsMap(), twister).finisherDamage).toBe(0.6);

    const magistar = allWeapons.find((w) => w.id === "magistar")!;
    const slam = mergeIncarnonStatChanges(incarnonDataMap.get("magistar")!, { 3: 0 }, "magistar");
    expect(slam?.slamRadius).toBe(1);
    expect(calculateWeaponBuild(magistar, [], modsMap(), slam).slamRadius).toBe(1);
    expect(mergeIncarnonStatChanges(incarnonDataMap.get("praedos")!, { 2: 0 }, "praedos")?.slamRadius).toBe(
      0.5,
    );
    expect(mergeIncarnonStatChanges(incarnonDataMap.get("ruvox")!, { 3: 1 }, "ruvox")?.slamRadius).toBe(
      0.6,
    );

    const anku = allWeapons.find((w) => w.id === "anku")!;
    const celerity = mergeIncarnonStatChanges(incarnonDataMap.get("anku")!, { 3: 1 }, "anku");
    expect(celerity?.movementSpeed).toBe(0.2);
    expect(calculateWeaponBuild(anku, [], modsMap(), celerity).movementSpeedBonus).toBe(0.2);
    expect(
      mergeIncarnonStatChanges(incarnonDataMap.get("okina")!, { 3: 2 }, "okina")?.movementSpeed,
    ).toBe(0.3);
    expect(
      mergeIncarnonStatChanges(incarnonDataMap.get("laetum")!, { 2: 2 }, "laetum")?.movementSpeed,
    ).toBe(0.5);

    const standoff = mergeIncarnonStatChanges(incarnonDataMap.get("anku")!, { 3: 0 }, "anku");
    expect(standoff?.comboTimerPauseWhenHolstered).toBe(1);
    expect(calculateWeaponBuild(anku, [], modsMap(), standoff).comboTimerPauseWhenHolstered).toBe(
      true,
    );
    const ack =
      incarnonDataMap.get("ack_&_brunt") ?? incarnonDataMap.get("ack_brunt")!;
    expect(mergeIncarnonStatChanges(ack, { 3: 1 }, "ack_brunt")?.comboTimerPauseWhenHolstered).toBe(
      1,
    );

    const obex = allWeapons.find((w) => w.id === "obex")!;
    const rapid = mergeIncarnonStatChanges(incarnonDataMap.get("obex")!, { 3: 0 }, "obex");
    expect(rapid?.parkourVelocity).toBe(0.4);
    expect(calculateWeaponBuild(obex, [], modsMap(), rapid).parkourVelocityBonus).toBe(0.4);

    const braton = allWeapons.find((w) => w.id === "braton")!;
    const gunsmoke = mergeIncarnonStatChanges(incarnonDataMap.get("braton")!, { 3: 2 }, "braton");
    expect(gunsmoke).toMatchObject({ ammoRestoreChance: 0.2, ammoRestoreMagFraction: 0.1 });
    expect(calculateWeaponBuild(braton, [], modsMap(), gunsmoke)).toMatchObject({
      ammoRestoreChance: 0.2,
      ammoRestoreMagFraction: 0.1,
    });

    const onos = allWeapons.find((w) => w.id === "onos")!;
    const rearm = mergeIncarnonStatChanges(incarnonDataMap.get("onos")!, { 3: 2 }, "onos");
    expect(rearm).toMatchObject({ ammoRestoreChance: 0.1, ammoRestoreFlat: 10 });
    expect(calculateWeaponBuild(onos, [], modsMap(), rearm).ammoRestoreFlat).toBe(10);

    const strun = allWeapons.find((w) => w.id === "strun")!;
    const galvanic = mergeIncarnonStatChanges(incarnonDataMap.get("strun")!, { 3: 1 }, "strun");
    expect(galvanic).toMatchObject({ ammoRestoreChance: 0.4, ammoRestoreFlat: 1 });
    expect(calculateWeaponBuild(strun, [], modsMap(), galvanic).ammoRestoreChance).toBe(0.4);

    const felarx = allWeapons.find((w) => w.id === "felarx")!;
    const catalyst = mergeIncarnonStatChanges(incarnonDataMap.get("felarx")!, { 4: 1 }, "felarx");
    expect(catalyst?.incarnonHeadshotChargeBonus).toBe(0.5);
    expect(calculateWeaponBuild(felarx, [], modsMap(), catalyst).incarnonHeadshotChargeBonus).toBe(
      0.5,
    );

    const vectis = allWeapons.find((w) => w.id === "vectis")!;
    const silent = mergeIncarnonStatChanges(incarnonDataMap.get("vectis")!, { 3: 2 }, "vectis");
    expect(silent?.silentWeapon).toBe(1);
    expect(calculateWeaponBuild(vectis, [], modsMap(), silent).silentWeapon).toBe(true);
  });

  it("zoom and movement Genesis appear on CalculatedStats", () => {
    const despair = allWeapons.find((w) => w.id === "despair")!;
    const focus = mergeIncarnonStatChanges(incarnonDataMap.get("despair")!, { 3: 0 }, "despair");
    expect(focus?.zoom).toBe(-0.3);
    expect(calculateWeaponBuild(despair, [], modsMap(), focus).zoom).toBe(-0.3);
    expect(mergeIncarnonStatChanges(incarnonDataMap.get("dread")!, { 3: 1 }, "dread")?.zoom).toBe(
      -0.3,
    );
    expect(mergeIncarnonStatChanges(incarnonDataMap.get("latron")!, { 3: 2 }, "latron")?.zoom).toBe(
      -0.3,
    );
    expect(mergeIncarnonStatChanges(incarnonDataMap.get("paris")!, { 3: 1 }, "paris")?.zoom).toBe(
      -0.3,
    );

    const innodem = allWeapons.find((w) => w.id === "innodem")!;
    const swift = mergeIncarnonStatChanges(incarnonDataMap.get("innodem")!, { 2: 2 }, "innodem");
    expect(swift?.sprintSpeed).toBe(0.3);
    expect(calculateWeaponBuild(innodem, [], modsMap(), swift).sprintSpeedBonus).toBe(0.3);

    const praedos = allWeapons.find((w) => w.id === "praedos")!;
    const grace = mergeIncarnonStatChanges(incarnonDataMap.get("praedos")!, { 2: 2 }, "praedos");
    expect(grace).toMatchObject({ sprintSpeed: 0.2, slideSpeed: 0.2 });
    expect(calculateWeaponBuild(praedos, [], modsMap(), grace)).toMatchObject({
      sprintSpeedBonus: 0.2,
      slideSpeedBonus: 0.2,
    });
    const ascension = mergeIncarnonStatChanges(incarnonDataMap.get("praedos")!, { 4: 1 }, "praedos");
    expect(ascension?.parkourVelocity).toBe(0.3);
    expect(calculateWeaponBuild(praedos, [], modsMap(), ascension).parkourVelocityBonus).toBe(0.3);

    const thalys = allWeapons.find((w) => w.id === "thalys")!;
    const drift = mergeIncarnonStatChanges(incarnonDataMap.get("thalys")!, { 2: 2 }, "thalys");
    expect(drift).toMatchObject({ fireRate: 0.8, slideSpeed: 0.2 });
    expect(calculateWeaponBuild(thalys, [], modsMap(), drift).slideSpeedBonus).toBe(0.2);
  });

  it("melee followThrough panel: Crushing Verdict / Lone Blade", () => {
    const magistar = allWeapons.find((w) => w.id === "magistar")!;
    const verdict = mergeIncarnonStatChanges(incarnonDataMap.get("magistar")!, { 2: 0 }, "magistar");
    expect(verdict?.followThrough).toBe(0.4);
    expect(calculateWeaponBuild(magistar, [], modsMap(), verdict).followThrough).toBe(0.4);
    expect(
      mergeIncarnonStatChanges(incarnonDataMap.get("magistar")!, { 2: 0 }, "sancti_magistar")
        ?.followThrough,
    ).toBe(0.4);

    const nami = allWeapons.find((w) => w.id === "nami_solo")!;
    const lone = mergeIncarnonStatChanges(incarnonDataMap.get("nami_solo")!, { 3: 0 }, "nami_solo");
    expect(lone?.followThrough).toBe(0.6);
    expect(calculateWeaponBuild(nami, [], modsMap(), lone).followThrough).toBe(0.6);
  });

  it("Braton Daring Reverie / Munitions Grit variant flats", () => {
    const data = incarnonDataMap.get("braton")!;
    // Channel-active paper: X+Y (24+30)
    expect(mergeIncarnonStatChanges(data, { 2: 0 }, "braton")?.flatBaseDamage).toBe(54);
    expect(mergeIncarnonStatChanges(data, { 2: 0 }, "braton_prime")?.flatBaseDamage).toBe(42);
    expect(mergeIncarnonStatChanges(data, { 2: 1 }, "braton_prime")?.flatBaseDamage).toBe(2);
    expect(mergeIncarnonStatChanges(data, { 2: 1 }, "braton")?.multishot).toBe(0.2);
    // Capacity-MS pellet unique mult Y% (paper assumes clause up)
    expect(mergeIncarnonStatChanges(data, { 2: 1 }, "braton")?.capacityMsDamageMult).toBeCloseTo(0.6, 5);
    expect(mergeIncarnonStatChanges(data, { 2: 1 }, "mk1_braton")?.capacityMsDamageMult).toBeCloseTo(
      0.48,
      5,
    );
    expect(mergeIncarnonStatChanges(data, { 2: 1 }, "braton_vandal")?.capacityMsDamageMult).toBeCloseTo(
      0.58,
      5,
    );
    expect(mergeIncarnonStatChanges(data, { 2: 1 }, "braton_prime")?.capacityMsDamageMult).toBeCloseTo(
      0.54,
      5,
    );
  });

  it("Overwhelming Attrition / King's Gambit / Swift form / Seeing Red family", () => {
    const laetumData = incarnonDataMap.get("laetum")!;
    expect(mergeIncarnonStatChanges(laetumData, { 5: 2 }, "laetum")?.additiveBaseDamage).toBe(12);
    const laetum = allWeapons.find((w) => w.id === "laetum")!;
    const bareLaetum = calculateWeaponBuild(laetum, [], modsMap());
    const attrition = calculateWeaponBuild(laetum, [], modsMap(), { additiveBaseDamage: 12 });
    expect(attrition.totalDamage).toBeCloseTo(bareLaetum.totalDamage * 13, 5);

    const sicarus = allWeapons.find((w) => w.id === "sicarus")!;
    const gambit = mergeIncarnonStatChanges(incarnonDataMap.get("sicarus")!, { 2: 1 }, "sicarus");
    const body = calculateWeaponBuild(
      sicarus,
      [],
      modsMap(),
      gambit,
      { ...DEFAULT_SIM_PARAMS, applyHeadshots: false },
    );
    expect(body.criticalChance).toBe(0);
    const weakpoint = calculateWeaponBuild(
      sicarus,
      [],
      modsMap(),
      gambit,
      { ...DEFAULT_SIM_PARAMS, applyHeadshots: true },
    );
    expect(weakpoint.criticalChance).toBeCloseTo(sicarus.criticalChance * 2.5, 5);

    const kunaiData = incarnonDataMap.get("kunai")!;
    expect(mergeIncarnonStatChanges(kunaiData, { 2: 0 }, "kunai")?.halfHealthAdditiveDamage).toBe(2);
    const formSwift = mergeIncarnonStatChanges(kunaiData, { 2: 0 }, "kunai", { formActive: true });
    expect(formSwift?.halfHealthAdditiveDamage).toBe(0);
    expect(formSwift?.damage).toBe(2);

    expect(mergeIncarnonStatChanges(incarnonDataMap.get("okina")!, { 2: 0 }, "okina")?.comboOnSlashStatus).toBe(5);
    expect(
      mergeIncarnonStatChanges(incarnonDataMap.get("dual_ichor")!, { 2: 0 }, "dual_ichor")
        ?.comboOnToxinStatus,
    ).toBe(5);
    expect(
      mergeIncarnonStatChanges(incarnonDataMap.get("sibear")!, { 2: 0 }, "sibear")?.comboOnColdStatus,
    ).toBe(10);
    expect(mergeIncarnonStatChanges(incarnonDataMap.get("skana")!, { 2: 1 }, "skana")?.comboOnUndamaged).toBe(
      9,
    );
    const okina = allWeapons.find((w) => w.id === "okina")!;
    expect(
      calculateWeaponBuild(okina, [], modsMap(), { comboOnSlashStatus: 5 }).comboOnSlashStatus,
    ).toBe(5);
  });

  it("Miter Sawblade Storm papers 1400 Blast / 5m radial (base form only)", () => {
    const data = incarnonDataMap.get("miter")!;
    const storm = mergeIncarnonStatChanges(data, { 4: 0 }, "miter");
    expect(storm?.sawbladeStormBlast).toBe(1400);
    expect(storm?.sawbladeStormRadius).toBe(5);

    const miter = allWeapons.find((w) => w.id === "miter")!;
    const bare = calculateWeaponBuild(miter, [], modsMap());
    const withStorm = calculateWeaponBuild(miter, [], modsMap(), storm);
    const aoe = (withStorm.radialAttacks ?? []).find((a) => /sawblade storm/i.test(a.name));
    expect(aoe).toBeDefined();
    // Radial scales with modded total / catalog base (same as other radials)
    expect(aoe!.blast).toBeCloseTo(1400 * (withStorm.totalDamage / miter.damage), 5);
    expect(aoe!.radius).toBe(5);
    expect(aoe!.falloffReduction).toBeUndefined();
    expect(withStorm.radialBurstDps ?? 0).toBeGreaterThan(bare.radialBurstDps ?? 0);
    expect(withStorm.burstDps).toBeGreaterThan(bare.burstDps);

    // Wiki: does not affect Incarnon form
    const formOff = calculateWeaponBuild(miter, [], modsMap(), storm, undefined, {
      incarnonFormActive: true,
    });
    expect((formOff.radialAttacks ?? []).some((a) => /sawblade storm/i.test(a.name))).toBe(false);
  });

  it("half-HP Feigned/Hitman/Swift ignore own flat; Impaler is Serration-additive", () => {
    const sicarusData = incarnonDataMap.get("sicarus")!;
    const feigned = mergeIncarnonStatChanges(sicarusData, { 2: 0 }, "sicarus");
    expect(feigned?.flatBaseDamage).toBe(50);
    expect(feigned?.halfHealthAdditiveDamage).toBeCloseTo(0.4, 5);
    expect(feigned?.damage).toBeUndefined();

    const sicarus = allWeapons.find((w) => w.id === "sicarus")!;
    const withHalf = calculateWeaponBuild(sicarus, [], modsMap(), feigned);
    const flatOnly = calculateWeaponBuild(sicarus, [], modsMap(), { flatBaseDamage: 50 });
    // Wiki: +40% on arsenal base only → add arsenal×0.4 (not (arsenal+flat)×0.4)
    expect(withHalf.totalDamage).toBeCloseTo(flatOnly.totalDamage + sicarus.damage * 0.4, 5);

    const dreadData = incarnonDataMap.get("dread")!;
    expect(mergeIncarnonStatChanges(dreadData, { 2: 0 }, "dread")?.halfHealthAdditiveDamage).toBe(1);
    expect(mergeIncarnonStatChanges(dreadData, { 2: 0 }, "dread")?.damage).toBeUndefined();

    const onos = allWeapons.find((w) => w.id === "onos")!;
    const bare = calculateWeaponBuild(onos, [], modsMap());
    const impaler = calculateWeaponBuild(onos, [], modsMap(), { additiveBaseDamage: 2 });
    expect(impaler.totalDamage).toBeCloseTo(bare.totalDamage * 3, 5);
  });

  it("Forceful Finality / Miter Plentiful / Reaver Rapture paper correctly", () => {
    const burstonData = incarnonDataMap.get("burston")!;
    const forceful = mergeIncarnonStatChanges(burstonData, { 2: 0 }, "burston");
    expect(forceful?.flatBaseDamage).toBe(42);
    expect(forceful?.lastShotBaseMultishot).toBe(5);
    const burston = allWeapons.find((w) => w.id === "burston")!;
    // Mag 45 / burst 3 → EV +5×3/45 base MS before % mods
    const forcefulStats = calculateWeaponBuild(burston, [], modsMap(), forceful);
    expect(forcefulStats.multishot).toBeCloseTo(1 + (5 * 3) / 45, 5);
    // Form excludes last-shot MS EV
    const formStats = calculateWeaponBuild(burston, [], modsMap(), forceful, undefined, {
      incarnonFormActive: true,
    });
    expect(formStats.multishot).toBeCloseTo(1, 5);

    const miterData = incarnonDataMap.get("miter")!;
    const plentiful = mergeIncarnonStatChanges(miterData, { 2: 1 }, "miter");
    expect(plentiful?.flatBaseDamage).toBe(57);
    expect(plentiful?.flatMsPelletDamage).toBe(20);
    const miter = allWeapons.find((w) => w.id === "miter")!;
    const bareMiter = calculateWeaponBuild(miter, [], modsMap(), { flatBaseDamage: 57 });
    // No multishot → capacity-MS flat contributes 0
    const noMs = calculateWeaponBuild(miter, [], modsMap(), plentiful);
    expect(noMs.totalDamage).toBeCloseTo(bareMiter.totalDamage, 5);
    // With +100% MS (MS=2): EV add = 20 × 1/2 = 10 (unmodded scale)
    const withMs = calculateWeaponBuild(miter, [], modsMap(), {
      ...plentiful!,
      multishot: 1,
    });
    expect(withMs.multishot).toBeCloseTo(2, 5);
    expect(withMs.totalDamage).toBeCloseTo(bareMiter.totalDamage + 10, 5);

    expect(mergeIncarnonStatChanges(burstonData, { 4: 0 }, "burston")?.additiveBaseDamage).toBe(1);
    const sybarisData = incarnonDataMap.get("sybaris")!;
    expect(mergeIncarnonStatChanges(sybarisData, { 4: 1 }, "sybaris")?.additiveBaseDamage).toBe(0.8);
    const rapture = calculateWeaponBuild(burston, [], modsMap(), { additiveBaseDamage: 1 });
    const bareBurston = calculateWeaponBuild(burston, [], modsMap());
    expect(rapture.totalDamage).toBeCloseTo(bareBurston.totalDamage * 2, 5);
  });

  it("Latron Riddled Target / Critical Parallel", () => {
    const data = incarnonDataMap.get("latron")!;
    expect(mergeIncarnonStatChanges(data, { 2: 0 }, "latron")?.flatBaseDamage).toBe(48);
    expect(mergeIncarnonStatChanges(data, { 2: 0 }, "latron")?.multishot).toBe(1);
    expect(mergeIncarnonStatChanges(data, { 2: 0 }, "latron_prime")?.flatBaseDamage).toBe(6);
    expect(mergeIncarnonStatChanges(data, { 2: 1 }, "latron")?.fatalAfflictionPerStatus).toBe(0.3);
    expect(mergeIncarnonStatChanges(data, { 4: 2 }, "latron")?.criticalChance).toBe(0.3);
    expect(mergeIncarnonStatChanges(data, { 4: 2 }, "latron")?.criticalMultiplier).toBe(0.6);
  });

  it("Furis Haven Foray overshield paper +58 / Mk1 +64", () => {
    const data = incarnonDataMap.get("furis")!;
    expect(mergeIncarnonStatChanges(data, { 2: 0 }, "furis")?.flatBaseDamage).toBe(58);
    expect(mergeIncarnonStatChanges(data, { 2: 0 }, "mk1_furis")?.flatBaseDamage).toBe(64);
  });

  it("melee T1 +100% Melee Damage encodes as additiveBaseDamage (PP-additive)", () => {
    const data = incarnonDataMap.get("hate")!;
    expect(mergeIncarnonStatChanges(data, { 1: 0 }, "hate")?.additiveBaseDamage).toBe(1);
    const hate = allWeapons.find((w) => w.id === "hate")!;
    const bare = calculateWeaponBuild(hate, [], modsMap());
    const form = calculateWeaponBuild(
      hate,
      [],
      modsMap(),
      { additiveBaseDamage: 1 },
    );
    expect(form.totalDamage).toBeCloseTo(bare.totalDamage * 2, 5);
  });

  it("Bo T1 form encodes +100% Melee Damage, +4 Range, +50% HAE", () => {
    const data = incarnonDataMap.get("bo")!;
    expect(mergeIncarnonStatChanges(data, { 1: 0 }, "bo")?.additiveBaseDamage).toBe(1);
    expect(mergeIncarnonStatChanges(data, { 1: 0 }, "bo")?.range).toBe(4);
    expect(mergeIncarnonStatChanges(data, { 1: 0 }, "bo")?.heavyAttackEfficiency).toBe(0.5);
  });

  it("Nami Solo T1 form encodes +100% Melee Damage and +3 Range", () => {
    const data = incarnonDataMap.get("nami_solo")!;
    expect(mergeIncarnonStatChanges(data, { 1: 0 }, "nami_solo")?.additiveBaseDamage).toBe(1);
    expect(mergeIncarnonStatChanges(data, { 1: 0 }, "nami_solo")?.range).toBe(3);
  });

  it("Innodem / Praedos T1 encode +3 Range with +40% Attack Speed", () => {
    const innodem = incarnonDataMap.get("innodem")!;
    expect(mergeIncarnonStatChanges(innodem, { 1: 0 }, "innodem")?.range).toBe(3);
    expect(mergeIncarnonStatChanges(innodem, { 1: 0 }, "innodem")?.fireRate).toBe(0.4);
    const praedos = incarnonDataMap.get("praedos")!;
    expect(mergeIncarnonStatChanges(praedos, { 1: 0 }, "praedos")?.range).toBe(3);
    expect(mergeIncarnonStatChanges(praedos, { 1: 0 }, "praedos")?.fireRate).toBe(0.4);
  });

  it("Ruvox T1 encodes +3 Range and -35% Attack Speed", () => {
    const data = incarnonDataMap.get("ruvox")!;
    expect(mergeIncarnonStatChanges(data, { 1: 0 }, "ruvox")?.range).toBe(3);
    expect(mergeIncarnonStatChanges(data, { 1: 0 }, "ruvox")?.fireRate).toBeCloseTo(-0.35, 5);
  });

  it("Thalys T1 encodes +3 Range +40% AS without swapping arsenal damage", () => {
    const thalys = allWeapons.find((w) => w.id === "thalys")!;
    const data = incarnonDataMap.get("thalys")!;
    const form = resolveIncarnonActiveWeapon(thalys, data, { 1: 0 });
    expect(form.damage).toBe(thalys.damage);
    expect(form.triggerType).toBe(thalys.triggerType);
    expect(mergeIncarnonStatChanges(data, { 1: 0 }, "thalys")?.range).toBe(3);
    expect(mergeIncarnonStatChanges(data, { 1: 0 }, "thalys")?.fireRate).toBe(0.4);
    expect(mergeIncarnonStatChanges(data, { 1: 0 }, "thalys")?.shardTriggerMult).toBeCloseTo(0.75, 5);
    expect(mergeIncarnonStatChanges(data, { 2: 1 }, "thalys")?.fireRate).toBe(0.2);
  });

  it("Thalys Chain Shatter + form shard triggers paper sim-gated DPS", () => {
    const thalys = allWeapons.find((w) => w.id === "thalys")!;
    const data = incarnonDataMap.get("thalys")!;
    const changes = mergeIncarnonStatChanges(data, { 1: 0, 5: 1 }, "thalys");
    expect(changes?.chainShatterDetonateMult).toBe(2);
    expect(changes?.shardTriggerMult).toBeCloseTo(0.75, 5);

    const off = calculateWeaponBuild(thalys, [], modsMap(), changes, DEFAULT_SIM_PARAMS, {
      incarnonFormActive: true,
    });
    expect(off.shardChainDps ?? 0).toBe(0);

    const on = calculateWeaponBuild(
      thalys,
      [],
      modsMap(),
      changes,
      { ...DEFAULT_SIM_PARAMS, shardHosts: 5, applyStanceMultiplier: false },
      { incarnonFormActive: true },
    );
    expect(on.shardChainDps ?? 0).toBeGreaterThan(0);
    // Detonate: host×2×combo + 4×chain×2, / windUp; plus embed triggers
    const windUp = on.heavyAttackWindUp;
    const detonate = (on.totalDamage * 2 * on.comboMultiplier + on.totalDamage * 2 * 4) / windUp;
    const trigger =
      (on.moddedBaseDamage ?? thalys.damage) * 0.75 * 4 * (on.effectiveFireRate ?? on.fireRate);
    expect(on.shardChainDps).toBeCloseTo(detonate + trigger, 0);
  });

  it("Thalys Explosive Growth papers fully-grown hosts at ×2 trigger", () => {
    const thalys = allWeapons.find((w) => w.id === "thalys")!;
    const data = incarnonDataMap.get("thalys")!;
    const changes = mergeIncarnonStatChanges(data, { 1: 0, 5: 0 }, "thalys");
    expect(changes?.shardFullyGrownDamageMult).toBe(2);
    expect(changes?.chainShatterDetonateMult).toBeUndefined();

    const base = calculateWeaponBuild(
      thalys,
      [],
      modsMap(),
      changes,
      { ...DEFAULT_SIM_PARAMS, shardHosts: 5, applyStanceMultiplier: false },
      { incarnonFormActive: true },
    );
    const grown = calculateWeaponBuild(
      thalys,
      [],
      modsMap(),
      changes,
      {
        ...DEFAULT_SIM_PARAMS,
        shardHosts: 5,
        shardFullyGrownHosts: 2,
        applyStanceMultiplier: false,
      },
      { incarnonFormActive: true },
    );
    // 4 others: 2 normal + 2×2 grown → 6 unit-triggers vs 4 → 1.5× trigger DPS
    expect(grown.shardChainDps ?? 0).toBeCloseTo((base.shardChainDps ?? 0) * 1.5, 0);
  });

  it("Swooping Lunge is PP-additive per airborne stack; Destreza puncture is sim-gated", () => {
    const innodem = allWeapons.find((w) => w.id === "innodem")!;
    const swoop = mergeIncarnonStatChanges(incarnonDataMap.get("innodem")!, { 4: 1 }, "innodem");
    expect(swoop?.airborneKillAdditivePerStack).toBeCloseTo(0.5, 5);
    const bare = calculateWeaponBuild(innodem, [], modsMap());
    const max = calculateWeaponBuild(innodem, [], modsMap(), swoop, {
      ...DEFAULT_SIM_PARAMS,
      airborneKillStacks: 3,
    });
    const zero = calculateWeaponBuild(innodem, [], modsMap(), swoop, {
      ...DEFAULT_SIM_PARAMS,
      airborneKillStacks: 0,
    });
    expect(max.totalDamage).toBeCloseTo(bare.totalDamage * 2.5, 5);
    expect(zero.totalDamage).toBeCloseTo(bare.totalDamage, 5);

    const destreza = allWeapons.find((w) => w.id === "destreza")!;
    const form = mergeIncarnonStatChanges(incarnonDataMap.get("destreza")!, { 1: 0 }, "destreza");
    expect(form?.heavyKillPuncturePerStack).toBeCloseTo(0.1, 5);
    const noStacks = calculateWeaponBuild(destreza, [], modsMap(), form);
    const stacked = calculateWeaponBuild(destreza, [], modsMap(), form, {
      ...DEFAULT_SIM_PARAMS,
      heavyKillStacks: 10,
    });
    expect(stacked.puncture).toBeCloseTo(noStacks.puncture * 2, 5);
  });

  it("Destreza Piercing Stature / Weighted Impetus and Dual Ichor Ronin paper", () => {
    const destreza = incarnonDataMap.get("destreza")!;
    expect(mergeIncarnonStatChanges(destreza, { 2: 1 }, "destreza")?.statusChance).toBe(1);
    expect(mergeIncarnonStatChanges(destreza, { 2: 0 }, "destreza")?.heavyAttackWindUp).toBe(1);
    expect(mergeIncarnonStatChanges(destreza, { 2: 0 }, "destreza_prime")?.flatBaseDamage).toBe(40);
    const dualIchor = incarnonDataMap.get("dual_ichor")!;
    expect(mergeIncarnonStatChanges(dualIchor, { 2: 1 }, "dual_ichor")?.fireRate).toBeCloseTo(0.3, 5);
  });

  it("Adept Reflexes / Resolute Force / Magistar T1 encode combo stats", () => {
    const ceramic = incarnonDataMap.get("ceramic_dagger")!;
    expect(mergeIncarnonStatChanges(ceramic, { 3: 1 }, "ceramic_dagger")?.initialCombo).toBe(20);
    const dualIchor = incarnonDataMap.get("dual_ichor")!;
    expect(mergeIncarnonStatChanges(dualIchor, { 3: 1 }, "dual_ichor")?.comboDuration).toBe(7);
    const magistar = incarnonDataMap.get("magistar")!;
    expect(mergeIncarnonStatChanges(magistar, { 1: 0 }, "magistar")?.initialCombo).toBe(30);
    const thalys = incarnonDataMap.get("thalys")!;
    expect(mergeIncarnonStatChanges(thalys, { 3: 2 }, "thalys")?.initialCombo).toBe(20);

    const skana = allWeapons.find((w) => w.id === "skana")!;
    const withCombo = calculateWeaponBuild(skana, [], modsMap(), { initialCombo: 20 }, {
      ...DEFAULT_SIM_PARAMS,
      comboCount: 0,
    });
    expect(withCombo.comboCount).toBe(20);
    expect(withCombo.comboDuration).toBe(5);
    const withDur = calculateWeaponBuild(skana, [], modsMap(), { comboDuration: 7 });
    expect(withDur.comboDuration).toBe(12);
  });

  it("Sicarus Survivor's Edge / Extended Volley / Edge of Justice / Avalanche encode", () => {
    const sicarus = incarnonDataMap.get("sicarus")!;
    expect(mergeIncarnonStatChanges(sicarus, { 4: 1 }, "sicarus")?.criticalChance).toBe(0.12);
    expect(mergeIncarnonStatChanges(sicarus, { 4: 1 }, "sicarus")?.statusChance).toBe(0.12);
    expect(mergeIncarnonStatChanges(sicarus, { 4: 1 }, "sicarus_prime")?.criticalChance).toBe(0.09);
    expect(mergeIncarnonStatChanges(sicarus, { 3: 2 }, "sicarus")?.flatMagazine).toBe(9);
    expect(mergeIncarnonStatChanges(sicarus, { 3: 2 }, "sicarus_prime")?.flatMagazine).toBe(12);

    const anku = incarnonDataMap.get("anku")!;
    expect(mergeIncarnonStatChanges(anku, { 2: 0 }, "anku")?.fireRate).toBe(0.4);
    const magistar = incarnonDataMap.get("magistar")!;
    expect(mergeIncarnonStatChanges(magistar, { 2: 1 }, "magistar")?.fireRate).toBe(0.4);
    expect(mergeIncarnonStatChanges(magistar, { 2: 1 }, "sancti_magistar")?.flatBaseDamage).toBe(20);

    const sibear = incarnonDataMap.get("sibear")!;
    expect(mergeIncarnonStatChanges(sibear, { 4: 0 }, "sibear")?.initialCombo).toBe(60);

    const kunai = incarnonDataMap.get("kunai")!;
    expect(mergeIncarnonStatChanges(kunai, { 4: 1 }, "kunai")?.fireRate).toBe(1);
    const furis = incarnonDataMap.get("furis")!;
    expect(mergeIncarnonStatChanges(furis, { 4: 0 }, "furis")?.fireRate).toBe(0.5);
    const atomos = incarnonDataMap.get("atomos")!;
    expect(mergeIncarnonStatChanges(atomos, { 3: 2 }, "atomos")?.flatMagazine).toBe(35);
    const gorgon = incarnonDataMap.get("gorgon")!;
    expect(mergeIncarnonStatChanges(gorgon, { 3: 0 }, "gorgon")?.flatMagazine).toBe(45);
    const stug = incarnonDataMap.get("stug")!;
    expect(mergeIncarnonStatChanges(stug, { 3: 2 }, "stug")?.flatMagazine).toBe(30);
  });

  it("Obex Armored Finisher / Overhand / Swift Break / Ready Retaliation encode", () => {
    const obex = incarnonDataMap.get("obex")!;
    expect(mergeIncarnonStatChanges(obex, { 2: 1 }, "obex")).toMatchObject({
      flatBaseDamage: 50,
      finisherDamage: 0.8,
    });
    expect(mergeIncarnonStatChanges(obex, { 2: 1 }, "prisma_obex")).toMatchObject({
      flatBaseDamage: 10,
      finisherDamage: 0.8,
    });

    const bo = incarnonDataMap.get("bo")!;
    expect(mergeIncarnonStatChanges(bo, { 3: 1 }, "bo")?.heavyAttackEfficiencySet).toBe(0.2);
    const destreza = incarnonDataMap.get("destreza")!;
    expect(mergeIncarnonStatChanges(destreza, { 3: 1 }, "destreza")?.heavyAttackEfficiencySet).toBe(
      0.3,
    );

    const ack = incarnonDataMap.get("ack_&_brunt") ?? incarnonDataMap.get("ack_brunt")!;
    expect(mergeIncarnonStatChanges(ack, { 3: 2 }, "ack_brunt")?.heavyAttackWindUp).toBe(0.7);
    const magistar = incarnonDataMap.get("magistar")!;
    expect(mergeIncarnonStatChanges(magistar, { 1: 0 }, "magistar")?.heavyAttackWindUp).toBe(0.5);

    const lex = incarnonDataMap.get("lex")!;
    expect(mergeIncarnonStatChanges(lex, { 3: 2 }, "lex")?.reloadSpeed).toBe(1);
    const sybaris = incarnonDataMap.get("sybaris")!;
    expect(mergeIncarnonStatChanges(sybaris, { 3: 1 }, "sybaris")?.reloadSpeed).toBe(0.6);

    const skana = allWeapons.find((w) => w.id === "skana")!;
    const wind = calculateWeaponBuild(skana, [], modsMap(), { heavyAttackWindUp: 1 });
    expect(wind.heavyAttackWindUp).toBeCloseTo(0.3, 5); // 0.6 / (1+1)
    const hae = calculateWeaponBuild(skana, [], modsMap(), { heavyAttackEfficiencySet: 0.2 });
    expect(hae.heavyAttackEfficiency).toBeCloseTo(0.2, 5);

    const braton = allWeapons.find((w) => w.id === "braton")!;
    const reload = calculateWeaponBuild(braton, [], modsMap(), { reloadSpeed: 1 });
    expect(reload.reloadTime).toBeCloseTo(braton.reloadTime / 2, 5);
  });

  it("Gorgon / Strun flat base damage tables", () => {
    const gorgon = incarnonDataMap.get("gorgon")!;
    expect(mergeIncarnonStatChanges(gorgon, { 2: 0 }, "gorgon")?.flatBaseDamage).toBe(10);
    const strun = incarnonDataMap.get("strun")!;
    expect(mergeIncarnonStatChanges(strun, { 2: 0 }, "strun")?.flatBaseDamage).toBe(54);
    expect(mergeIncarnonStatChanges(strun, { 2: 0 }, "strun_prime")?.flatBaseDamage).toBe(2);
  });

  it("conditional uptime paper: Haven / Paladin / Deathtrap / Red Right / Dawn / half-HP", () => {
    const angstrum = incarnonDataMap.get("angstrum")!;
    expect(mergeIncarnonStatChanges(angstrum, { 2: 0 }, "angstrum")?.flatBaseDamage).toBe(100);
    expect(mergeIncarnonStatChanges(angstrum, { 2: 1 }, "angstrum")?.criticalMultiplier).toBe(0.5);

    const anku = incarnonDataMap.get("anku")!;
    expect(mergeIncarnonStatChanges(anku, { 2: 1 }, "anku")?.heavyAttackEfficiency).toBe(0.8);

    const kunai = incarnonDataMap.get("kunai")!;
    expect(mergeIncarnonStatChanges(kunai, { 4: 0 }, "kunai")?.criticalChance).toBe(0.4);
    expect(mergeIncarnonStatChanges(kunai, { 4: 0 }, "kunai")?.criticalMultiplier).toBe(1.4);
    expect(mergeIncarnonStatChanges(kunai, { 4: 0 }, "mk1_kunai")?.criticalChance).toBe(0.42);
    expect(mergeIncarnonStatChanges(kunai, { 4: 0 }, "mk1_kunai")?.criticalMultiplier).toBe(1);
    expect(mergeIncarnonStatChanges(kunai, { 2: 0 }, "kunai")?.flatBaseDamage).toBe(70);
    expect(mergeIncarnonStatChanges(kunai, { 2: 0 }, "mk1_kunai")?.flatBaseDamage).toBe(80);
    expect(mergeIncarnonStatChanges(kunai, { 2: 0 }, "kunai")?.halfHealthAdditiveDamage).toBe(2);
    expect(mergeIncarnonStatChanges(kunai, { 2: 1 }, "kunai")?.multishot).toBe(1);

    const lato = incarnonDataMap.get("lato")!;
    expect(mergeIncarnonStatChanges(lato, { 2: 0 }, "lato")?.flatBaseDamage).toBe(80);
    expect(mergeIncarnonStatChanges(lato, { 4: 1 }, "lato")?.criticalMultiplier).toBe(3.2);

    const lex = incarnonDataMap.get("lex")!;
    expect(mergeIncarnonStatChanges(lex, { 2: 0 }, "lex")?.flatBaseDamage).toBe(160);
    expect(mergeIncarnonStatChanges(lex, { 4: 0 }, "lex")?.headshotDamageBonus).toBe(1);

    const ceramic = incarnonDataMap.get("ceramic_dagger")!;
    expect(mergeIncarnonStatChanges(ceramic, { 4: 0 }, "ceramic_dagger")?.criticalMultiplier).toBe(2);
    expect(mergeIncarnonStatChanges(ceramic, { 2: 1 }, "ceramic_dagger")?.flatBaseDamage).toBe(200);

    const innodem = incarnonDataMap.get("innodem")!;
    expect(mergeIncarnonStatChanges(innodem, { 4: 1 }, "innodem")?.airborneKillAdditivePerStack).toBe(
      0.5,
    );
    expect(mergeIncarnonStatChanges(innodem, { 5: 0 }, "innodem")?.heavyAttackEfficiency).toBe(0.4);

    const onos = incarnonDataMap.get("onos")!;
    expect(mergeIncarnonStatChanges(onos, { 5: 1 }, "onos")?.additiveBaseDamage).toBe(2);

    const paris = incarnonDataMap.get("paris")!;
    expect(mergeIncarnonStatChanges(paris, { 2: 1 }, "paris")?.flatBaseDamage).toBe(92);

    const zylok = incarnonDataMap.get("zylok")!;
    expect(mergeIncarnonStatChanges(zylok, { 2: 0 }, "zylok")?.flatBaseDamage).toBe(136);
    expect(mergeIncarnonStatChanges(zylok, { 2: 1 }, "zylok")?.criticalMultiplier).toBe(2);

    const skana = allWeapons.find((w) => w.id === "skana")!;
    const hae = calculateWeaponBuild(skana, [], modsMap(), { heavyAttackEfficiency: 0.8 });
    expect(hae.heavyAttackEfficiency).toBeCloseTo(0.8, 5);
  });

  it("max-stack Genesis paper: Kill Joy / Stormburst / Infused / Crimson / Blazing / Synergist", () => {
    const furax = incarnonDataMap.get("furax_incarnon") ?? incarnonDataMap.get("furia")!;
    expect(mergeIncarnonStatChanges(furax, { 2: 1 }, "furia")?.fireRate).toBe(0.5);

    const furis = incarnonDataMap.get("furis")!;
    expect(mergeIncarnonStatChanges(furis, { 2: 1 }, "furis")?.multishot).toBe(1.2);

    const bronco = incarnonDataMap.get("bronco")!;
    expect(mergeIncarnonStatChanges(bronco, { 2: 1 }, "bronco")?.flatBaseDamage).toBe(60);
    expect(mergeIncarnonStatChanges(bronco, { 2: 1 }, "bronco_prime")?.flatBaseDamage).toBe(56);

    const gammacor = incarnonDataMap.get("gammacor")!;
    expect(mergeIncarnonStatChanges(gammacor, { 2: 1 }, "gammacor")?.flatBaseDamage).toBe(26);

    const boltor = incarnonDataMap.get("boltor")!;
    expect(mergeIncarnonStatChanges(boltor, { 2: 1 }, "boltor")?.flatBaseDamage).toBe(20);
    expect(mergeIncarnonStatChanges(boltor, { 2: 1 }, "boltor")?.ammoEfficiency).toBe(0.8);
    expect(mergeIncarnonStatChanges(boltor, { 2: 1 }, "boltor_prime")?.flatBaseDamage).toBe(6);
    expect(mergeIncarnonStatChanges(boltor, { 2: 1 }, "boltor_prime")?.ammoEfficiency).toBe(0.6);
    expect(mergeIncarnonStatChanges(boltor, { 2: 1 }, "telos_boltor")?.ammoEfficiency).toBe(0.6);

    const dera = incarnonDataMap.get("dera")!;
    expect(mergeIncarnonStatChanges(dera, { 2: 0 }, "dera")?.ammoEfficiency).toBe(0.8);
    expect(mergeIncarnonStatChanges(dera, { 2: 1 }, "dera")?.fireRate).toBe(0.3);

    const ceramic = incarnonDataMap.get("ceramic_dagger")!;
    expect(mergeIncarnonStatChanges(ceramic, { 2: 0 }, "ceramic_dagger")?.initialCombo).toBe(100);

    const strun = incarnonDataMap.get("strun")!;
    expect(mergeIncarnonStatChanges(strun, { 2: 1 }, "strun")?.multishot).toBe(0.25);
    const stug = incarnonDataMap.get("stug")!;
    expect(mergeIncarnonStatChanges(stug, { 2: 0 }, "stug")?.multishot).toBe(0.5);
    const sybaris = incarnonDataMap.get("sybaris")!;
    expect(mergeIncarnonStatChanges(sybaris, { 2: 1 }, "sybaris")?.multishot).toBe(0.5);

    const okina = incarnonDataMap.get("okina")!;
    expect(mergeIncarnonStatChanges(okina, { 2: 1 }, "okina")?.statusDamageBonus).toBe(0.4);

    const onos = incarnonDataMap.get("onos")!;
    expect(mergeIncarnonStatChanges(onos, { 5: 0 }, "onos")?.headshotDamageBonus).toBe(1.2);

    const paris = incarnonDataMap.get("paris")!;
    expect(mergeIncarnonStatChanges(paris, { 2: 0 }, "paris")?.fireRate).toBe(0.8);
    expect(mergeIncarnonStatChanges(paris, { 3: 0 }, "paris")?.fireRate).toBe(0.4);

    const braton = allWeapons.find((w) => w.id === "braton")!;
    const statusDmg = calculateWeaponBuild(braton, [], modsMap(), { statusDamageBonus: 0.4 });
    expect(statusDmg.statusDamageBonus).toBeCloseTo(0.4, 5);
  });

  it("Genesis P0 paper: Bo HAE / Ballistica stacks / Ruvox / Phenmor / Praedos / Templar", () => {
    const bo = incarnonDataMap.get("bo")!;
    expect(mergeIncarnonStatChanges(bo, { 1: 0 }, "bo")?.heavyAttackEfficiency).toBe(0.5);

    const ack = incarnonDataMap.get("ack_brunt") ?? incarnonDataMap.get("ack_brunt_incarnon")!;
    expect(mergeIncarnonStatChanges(ack, { 2: 0 }, "ack_brunt")?.heavyAttackEfficiency).toBe(0.7);

    const ballistica = incarnonDataMap.get("ballistica")!;
    expect(mergeIncarnonStatChanges(ballistica, { 2: 0 }, "ballistica")?.fireRate).toBe(0.75);
    expect(mergeIncarnonStatChanges(ballistica, { 2: 1 }, "ballistica")?.critChanceBonus).toBe(0.8);

    const ruvox = incarnonDataMap.get("ruvox")!;
    expect(mergeIncarnonStatChanges(ruvox, { 2: 1 }, "ruvox")?.fireRate).toBe(0.45);
    expect(mergeIncarnonStatChanges(ruvox, { 5: 0 }, "ruvox")?.heavyAttackEfficiency).toBe(0.4);

    const phenmor = incarnonDataMap.get("phenmor")!;
    expect(mergeIncarnonStatChanges(phenmor, { 5: 1 }, "phenmor")?.critMultFlat).toBe(1);
    expect(mergeIncarnonStatChanges(phenmor, { 5: 2 }, "phenmor")?.headshotDamageBonus).toBe(0.5);

    const praedos = incarnonDataMap.get("praedos")!;
    expect(mergeIncarnonStatChanges(praedos, { 5: 0 }, "praedos")?.heavyAttackEfficiency).toBe(0.5);

    const phenmorWpn = allWeapons.find((w) => w.id === "phenmor")!;
    const spite = calculateWeaponBuild(phenmorWpn, [], modsMap(), { critMultFlat: 1 });
    expect(spite.criticalMultiplier).toBeCloseTo(
      quantizeBaseCritMultiplier(phenmorWpn.criticalMultiplier) + 1,
      5,
    );
  });

  it("Onos Cascade / Thalys Reach-Drift / Skyborne / Brigand / Reaching Lunge encode", () => {
    const onos = incarnonDataMap.get("onos")!;
    // Cascade is charge-blast only — absent on held / default merge
    expect(mergeIncarnonStatChanges(onos, { 5: 2 }, "onos")?.criticalChance).toBeUndefined();
    expect(
      mergeIncarnonStatChanges(onos, { 5: 2 }, "onos", { chargeMode: true })?.criticalChance,
    ).toBe(2.5);
    expect(
      mergeIncarnonStatChanges(onos, { 5: 2 }, "onos", { chargeMode: true })?.criticalMultiplier,
    ).toBe(2.5);

    const thalys = incarnonDataMap.get("thalys")!;
    expect(mergeIncarnonStatChanges(thalys, { 2: 0 }, "thalys")?.range).toBe(2);
    expect(mergeIncarnonStatChanges(thalys, { 2: 2 }, "thalys")?.fireRate).toBe(0.8);

    const innodem = incarnonDataMap.get("innodem")!;
    expect(mergeIncarnonStatChanges(innodem, { 3: 1 }, "innodem")?.range).toBe(0.5);

    const nami = incarnonDataMap.get("nami_solo")!;
    expect(mergeIncarnonStatChanges(nami, { 2: 0 }, "nami_solo")?.fireRate).toBe(0.3);

    const praedos = incarnonDataMap.get("praedos")!;
    expect(mergeIncarnonStatChanges(praedos, { 3: 1 }, "praedos")?.range).toBe(1.5);
  });

  it("Flensing Spikes / Ruptured Plentitude / Marksman's Gain encode", () => {
    const latron = incarnonDataMap.get("latron")!;
    expect(mergeIncarnonStatChanges(latron, { 4: 0 }, "latron")?.punctureArmorStripPerStack).toBe(
      0.2,
    );
    const latronWpn = allWeapons.find((w) => w.id === "latron")!;
    const strip = calculateWeaponBuild(latronWpn, [], modsMap(), {
      punctureArmorStripPerStack: 0.2,
    });
    expect(strip.punctureArmorStripPerStack).toBeCloseTo(0.2, 5);

    const felarx = incarnonDataMap.get("felarx")!;
    expect(mergeIncarnonStatChanges(felarx, { 5: 1 }, "felarx")?.ammoEfficiency).toBe(0.7);
    const lato = incarnonDataMap.get("lato")!;
    expect(mergeIncarnonStatChanges(lato, { 3: 1 }, "lato")?.ammoEfficiency).toBe(0.5);
  });

  it("ammoEfficiency extends sustained mag cycle (50% AE doubles shots before reload)", () => {
    const braton = allWeapons.find((w) => w.id === "braton")!;
    const base = calculateWeaponBuild(braton, [], modsMap());
    const withAe = calculateWeaponBuild(braton, [], modsMap(), { ammoEfficiency: 0.5 });
    expect(withAe.ammoEfficiency).toBeCloseTo(0.5, 5);
    // Same burst; sustained rises because mag lasts longer relative to reload.
    expect(withAe.burstDps).toBeCloseTo(base.burstDps, 5);
    expect(withAe.sustainedDps).toBeGreaterThan(base.sustainedDps);

    const full = calculateWeaponBuild(braton, [], modsMap(), { ammoEfficiency: 1 });
    expect(full.sustainedDps).toBeCloseTo(full.burstDps, 5);

    const bratonInc = incarnonDataMap.get("braton")!;
    expect(mergeIncarnonStatChanges(bratonInc, { 2: 0 }, "braton")?.ammoEfficiency).toBe(0.5);
    const lex = incarnonDataMap.get("lex")!;
    expect(mergeIncarnonStatChanges(lex, { 2: 1 }, "lex")?.ammoEfficiency).toBe(0.6);
    const bronco = incarnonDataMap.get("bronco")!;
    expect(mergeIncarnonStatChanges(bronco, { 4: 0 }, "bronco")?.ammoEfficiency).toBe(0.8);
  });

  it("ammo restore folds into sustained DPS (one proc per mag)", () => {
    const onos = allWeapons.find((w) => w.id === "onos")!;
    const base = calculateWeaponBuild(onos, [], modsMap());
    const rearm = mergeIncarnonStatChanges(incarnonDataMap.get("onos")!, { 3: 2 }, "onos");
    expect(rearm).toMatchObject({ ammoRestoreChance: 0.1, ammoRestoreFlat: 10 });
    const withRestore = calculateWeaponBuild(onos, [], modsMap(), rearm);
    expect(withRestore.burstDps).toBeCloseTo(base.burstDps, 5);
    expect(withRestore.sustainedDps).toBeGreaterThan(base.sustainedDps);
    // E[extra] = 0.1×10 = 1 → magTime uses magazine+1
    const efr = base.fireRate;
    const magTime = (base.magazine + 1) / efr;
    const expected = base.burstDps * (magTime / (magTime + base.reloadTime));
    expect(withRestore.sustainedDps).toBeCloseTo(expected, 4);

    const braton = allWeapons.find((w) => w.id === "braton")!;
    const gunsmoke = mergeIncarnonStatChanges(incarnonDataMap.get("braton")!, { 3: 2 }, "braton");
    const bareBraton = calculateWeaponBuild(braton, [], modsMap());
    const withGunsmoke = calculateWeaponBuild(braton, [], modsMap(), gunsmoke);
    expect(withGunsmoke.sustainedDps).toBeGreaterThan(bareBraton.sustainedDps);
  });

  it("instant reload chance folds into sustained DPS (one proc per mag)", () => {
    const lato = allWeapons.find((w) => w.id === "lato")!;
    const base = calculateWeaponBuild(lato, [], modsMap());
    const penance = mergeIncarnonStatChanges(incarnonDataMap.get("lato")!, { 3: 2 }, "lato");
    expect(penance?.instantReloadOnKillChance).toBe(0.5);
    const withKill = calculateWeaponBuild(lato, [], modsMap(), penance);
    expect(withKill.burstDps).toBeCloseTo(base.burstDps, 5);
    expect(withKill.sustainedDps).toBeGreaterThan(base.sustainedDps);
    // Mag uptime: magTime / (magTime + reload×0.5) vs magTime / (magTime + reload)
    const efr = base.fireRate;
    const magTime = base.magazine / efr;
    const expected =
      base.burstDps * (magTime / (magTime + base.reloadTime * 0.5));
    expect(withKill.sustainedDps).toBeCloseTo(expected, 4);

    const phenmor = allWeapons.find((w) => w.id === "phenmor")!;
    const fortune = mergeIncarnonStatChanges(incarnonDataMap.get("phenmor")!, { 3: 2 }, "phenmor");
    expect(fortune?.instantReloadOnHeadshotChance).toBe(0.2);
    const withHs = calculateWeaponBuild(phenmor, [], modsMap(), fortune);
    const barePhen = calculateWeaponBuild(phenmor, [], modsMap());
    expect(withHs.sustainedDps).toBeGreaterThan(barePhen.sustainedDps);
  });

  it("Genesis leftovers paper: Reified / Steadfast / MM / Kinetic / Lethal / OA / Sawblades / Gambit", () => {
    const boar = incarnonDataMap.get("boar")!;
    expect(mergeIncarnonStatChanges(boar, { 2: 0 }, "boar")?.flatBaseDamage).toBe(24);

    const cestra = incarnonDataMap.get("cestra")!;
    expect(mergeIncarnonStatChanges(cestra, { 2: 0 }, "cestra")?.critMultMultiply).toBe(3);

    const felarx = incarnonDataMap.get("felarx")!;
    expect(mergeIncarnonStatChanges(felarx, { 3: 1 }, "felarx")?.fireRate).toBe(0.6);

    const furax = incarnonDataMap.get("furax_incarnon") ?? incarnonDataMap.get("furia")!;
    expect(mergeIncarnonStatChanges(furax, { 4: 1 }, "furia")?.criticalMultiplierSet).toBe(4);

    const laetum = incarnonDataMap.get("laetum")!;
    expect(mergeIncarnonStatChanges(laetum, { 3: 0 }, "laetum")?.reloadSpeed).toBe(0.9);
    expect(mergeIncarnonStatChanges(laetum, { 5: 2 }, "laetum")?.additiveBaseDamage).toBe(12);

    const miter = incarnonDataMap.get("miter")!;
    expect(mergeIncarnonStatChanges(miter, { 2: 0 }, "miter")?.fireRate).toBe(0.7);

    const sicarus = incarnonDataMap.get("sicarus")!;
    expect(mergeIncarnonStatChanges(sicarus, { 2: 1 }, "sicarus")?.critChanceBonus).toBe(1.5);
    expect(mergeIncarnonStatChanges(sicarus, { 2: 1 }, "sicarus")?.bodyshotCritChanceMult).toBe(0);
    expect(mergeIncarnonStatChanges(sicarus, { 2: 1 }, "sicarus_prime")?.flatBaseDamage).toBe(40);

    const cestraWpn = allWeapons.find((w) => w.id === "cestra")!;
    const grit = calculateWeaponBuild(cestraWpn, [], modsMap(), {
      flatBaseDamage: 10,
      critMultMultiply: 3,
    });
    expect(grit.criticalMultiplier).toBeCloseTo(
      quantizeBaseCritMultiplier(cestraWpn.criticalMultiplier) * 3,
      5,
    );

    const furaxWpn = allWeapons.find((w) => w.id === "furia" || w.id === "mk1_furax")!;
    const kinetic = calculateWeaponBuild(furaxWpn, [], modsMap(), { criticalMultiplierSet: 4 });
    expect(kinetic.criticalMultiplier).toBeCloseTo(quantizeBaseCritMultiplier(4), 5);

    const sicarusWpn = allWeapons.find((w) => w.id === "sicarus")!;
    const gambit = calculateWeaponBuild(sicarusWpn, [], modsMap(), { critChanceBonus: 1.5 });
    expect(gambit.criticalChance).toBeCloseTo(sicarusWpn.criticalChance * 2.5, 5);
  });

  it("Flashing Bleed / Caput / Carnage / Alchemy / Fevered / Reaver / Neurotoxin", () => {
    const bo = incarnonDataMap.get("bo")!;
    expect(mergeIncarnonStatChanges(bo, { 4: 0 }, "bo")?.slashOnImpactProcChance).toBe(0.4);
    const furax = incarnonDataMap.get("furax_incarnon") ?? incarnonDataMap.get("furia")!;
    expect(mergeIncarnonStatChanges(furax, { 4: 0 }, "furia")?.slashOnImpactProcChance).toBe(0.4);
    const magistar = incarnonDataMap.get("magistar")!;
    expect(mergeIncarnonStatChanges(magistar, { 4: 0 }, "magistar")?.slashOnImpactProcChance).toBe(
      0.5,
    );

    const laetum = incarnonDataMap.get("laetum")!;
    expect(mergeIncarnonStatChanges(laetum, { 4: 0 }, "laetum")?.headshotDamageBonus).toBe(0.5);
    const latron = incarnonDataMap.get("latron")!;
    expect(mergeIncarnonStatChanges(latron, { 4: 1 }, "latron")?.headshotDamageBonus).toBe(1);
    const vectis = incarnonDataMap.get("vectis")!;
    expect(mergeIncarnonStatChanges(vectis, { 4: 0 }, "vectis")?.headshotDamageBonus).toBe(0.25);

    const tox = incarnonDataMap.get("dual_toxocyst")!;
    expect(mergeIncarnonStatChanges(tox, { 2: 0 }, "dual_toxocyst")?.fatalAfflictionPerStatus).toBe(
      0.33,
    );
    expect(mergeIncarnonStatChanges(tox, { 2: 1 }, "dual_toxocyst")?.multishot).toBe(1);
    expect(mergeIncarnonStatChanges(tox, { 4: 1 }, "dual_toxocyst")?.neurotoxinToxinOnHeadshot).toBe(
      0.7,
    );
    const lato = incarnonDataMap.get("lato")!;
    expect(mergeIncarnonStatChanges(lato, { 4: 2 }, "lato")?.fatalAfflictionPerStatus).toBe(0.4);

    const okina = incarnonDataMap.get("okina")!;
    expect(mergeIncarnonStatChanges(okina, { 4: 1 }, "okina")?.statusDuration).toBe(0.25);
    expect(mergeIncarnonStatChanges(okina, { 4: 1 }, "okina_prime")?.statusDuration).toBe(0.25);

    const burston = incarnonDataMap.get("burston")!;
    expect(mergeIncarnonStatChanges(burston, { 4: 0 }, "burston")?.additiveBaseDamage).toBe(1);
    const sybaris = incarnonDataMap.get("sybaris")!;
    expect(mergeIncarnonStatChanges(sybaris, { 4: 1 }, "sybaris")?.additiveBaseDamage).toBe(0.8);

    const braton = allWeapons.find((w) => w.id === "braton")!;
    const bleed = calculateWeaponBuild(braton, [], modsMap(), { slashOnImpactProcChance: 0.4 });
    expect(bleed.slashOnImpactProcChance).toBeCloseTo(0.4, 5);

    const head = calculateWeaponBuild(braton, [], modsMap(), { headshotDamageBonus: 0.5 });
    expect(head.headshotDamageBonus).toBeCloseTo(0.5, 5);

    const alchemy = calculateWeaponBuild(braton, [], modsMap(), { statusDuration: 0.25 });
    expect(alchemy.statusDurationBonus).toBeCloseTo(0.25, 5);

    const reaver = calculateWeaponBuild(braton, [], modsMap(), { additiveBaseDamage: 1 });
    const bare = calculateWeaponBuild(braton, [], modsMap());
    // Serration-additive: bare × (1 + 1.0), same as +100% damageBonus
    expect(reaver.totalDamage).toBeCloseTo(bare.totalDamage * 2, 5);

    const neuroOff = calculateWeaponBuild(
      braton,
      [],
      modsMap(),
      { neurotoxinToxinOnHeadshot: 0.7 },
      { ...DEFAULT_SIM_PARAMS, applyHeadshots: false },
    );
    expect(neuroOff.elements.some((e) => e.type === "toxin")).toBe(false);
    const neuroOn = calculateWeaponBuild(
      braton,
      [],
      modsMap(),
      { neurotoxinToxinOnHeadshot: 0.7 },
      { ...DEFAULT_SIM_PARAMS, applyHeadshots: true },
    );
    const toxin = neuroOn.elements.find((e) => e.type === "toxin");
    expect(toxin).toBeDefined();
    // Quantized to 1/32 of modded base after incarnon apply.
    expect(toxin!.value).toBeCloseTo(braton.damage * 0.7, 0);
    expect(neuroOn.totalDamage).toBeGreaterThan(bare.totalDamage);
  });

  it("Fatal Affliction / Wiseman / High Ground / Prelude encode + calc", () => {
    const angstrum = incarnonDataMap.get("angstrum")!;
    expect(mergeIncarnonStatChanges(angstrum, { 4: 2 }, "angstrum")?.fatalAfflictionPerStatus).toBe(
      0.4,
    );
    const burston = incarnonDataMap.get("burston")!;
    expect(mergeIncarnonStatChanges(burston, { 4: 2 }, "burston")?.fatalAfflictionPerStatus).toBe(
      0.4,
    );
    const soma = incarnonDataMap.get("soma")!;
    expect(mergeIncarnonStatChanges(soma, { 4: 1 }, "soma")?.fatalAfflictionPerStatus).toBe(0.4);
    const zylok = incarnonDataMap.get("zylok")!;
    expect(mergeIncarnonStatChanges(zylok, { 4: 2 }, "zylok")?.fatalAfflictionPerStatus).toBe(0.4);

    const cestra = incarnonDataMap.get("cestra")!;
    expect(mergeIncarnonStatChanges(cestra, { 4: 2 }, "cestra")?.statusFromCritFraction).toBe(0.3);
    expect(mergeIncarnonStatChanges(cestra, { 4: 2 }, "cestra")?.statusFromCritCap).toBe(0.4);
    const sicarus = incarnonDataMap.get("sicarus")!;
    expect(mergeIncarnonStatChanges(sicarus, { 4: 2 }, "sicarus")?.statusFromCritFraction).toBe(0.3);
    const vectis = incarnonDataMap.get("vectis")!;
    expect(mergeIncarnonStatChanges(vectis, { 4: 2 }, "vectis")?.statusFromCritFraction).toBe(0.3);

    const dera = incarnonDataMap.get("dera")!;
    expect(mergeIncarnonStatChanges(dera, { 4: 1 }, "dera")?.critFromStatusFraction).toBe(0.25);
    expect(mergeIncarnonStatChanges(dera, { 4: 1 }, "dera")?.critFromStatusCap).toBe(0.35);
    const destreza = incarnonDataMap.get("destreza")!;
    expect(mergeIncarnonStatChanges(destreza, { 4: 2 }, "destreza")?.critFromStatusFraction).toBe(
      0.25,
    );

    const bratonEvo = incarnonDataMap.get("braton")!;
    expect(mergeIncarnonStatChanges(bratonEvo, { 4: 1 }, "braton")?.preludeMightBaseCm).toBe(3.4);
    expect(mergeIncarnonStatChanges(bratonEvo, { 4: 1 }, "braton")?.preludeMightMaxCc).toBe(0.5);
    const furis = incarnonDataMap.get("furis")!;
    expect(mergeIncarnonStatChanges(furis, { 4: 1 }, "furis")?.preludeMightBaseCm).toBe(3);
    expect(mergeIncarnonStatChanges(furis, { 4: 1 }, "furis")?.preludeMightMaxCc).toBe(0.4);

    const braton = allWeapons.find((w) => w.id === "braton")!;
    const bare = calculateWeaponBuild(braton, [], modsMap());
    const fa0 = calculateWeaponBuild(
      braton,
      [],
      modsMap(),
      { fatalAfflictionPerStatus: 0.4 },
      { ...DEFAULT_SIM_PARAMS, statusTypesOnTarget: 0 },
    );
    const fa5 = calculateWeaponBuild(
      braton,
      [],
      modsMap(),
      { fatalAfflictionPerStatus: 0.4 },
      { ...DEFAULT_SIM_PARAMS, statusTypesOnTarget: 5 },
    );
    expect(fa0.totalDamage).toBeCloseTo(bare.totalDamage, 5);
    expect(fa5.totalDamage).toBeCloseTo(bare.totalDamage * (1 + 0.4 * 5), 5);

    const wiseman = calculateWeaponBuild(braton, [], modsMap(), {
      statusFromCritFraction: 0.3,
      statusFromCritCap: 0.4,
    });
    const wisemanAdd = Math.min(0.4, 0.3 * braton.criticalChance);
    expect(wiseman.statusChance).toBeCloseTo(braton.statusChance + wisemanAdd, 5);

    const highGround = calculateWeaponBuild(braton, [], modsMap(), {
      critFromStatusFraction: 0.25,
      critFromStatusCap: 0.35,
    });
    const hgAdd = Math.min(0.35, 0.25 * braton.statusChance);
    expect(highGround.criticalChance).toBeCloseTo(braton.criticalChance + hgAdd, 5);

    expect(braton.criticalChance).toBeLessThan(0.5);
    const preludeOn = calculateWeaponBuild(braton, [], modsMap(), {
      preludeMightBaseCm: 3.4,
      preludeMightMaxCc: 0.5,
    });
    expect(preludeOn.criticalMultiplier).toBeCloseTo(
      quantizeBaseCritMultiplier(braton.criticalMultiplier + 3.4),
      5,
    );
    const preludeOff = calculateWeaponBuild(braton, [], modsMap(), {
      criticalChance: 0.5,
      preludeMightBaseCm: 3.4,
      preludeMightMaxCc: 0.5,
    });
    expect(braton.criticalChance + 0.5).toBeGreaterThanOrEqual(0.5);
    expect(preludeOff.criticalMultiplier).toBeCloseTo(
      quantizeBaseCritMultiplier(braton.criticalMultiplier),
      5,
    );
  });
});

describe("pass-3 wiki forms", () => {
  it("Lex form is Radiation+Impact 1000", () => {
    const lex = allWeapons.find((w) => w.id === "lex")!;
    const data = incarnonDataMap.get("lex")!;
    const form = resolveIncarnonActiveWeapon(lex, data, { 1: 0 });
    expect(form.radiation).toBe(700);
    expect(form.impact).toBe(300);
    expect(form.damage).toBe(1000);
    expect(form.magazine).toBe(20);
    expect(form.criticalChance).toBeCloseTo(0.3, 5);
    expect(form.statusChance).toBeCloseTo(0.22, 5);
  });

  it("Lex Prime form is Radiation+Impact 1200 / 35%/3x/44%", () => {
    const prime = allWeapons.find((w) => w.id === "lex_prime")!;
    const data = incarnonDataMap.get("lex_prime")!;
    const form = resolveIncarnonActiveWeapon(prime, data, { 1: 0 });
    expect(form.radiation).toBe(800);
    expect(form.impact).toBe(400);
    expect(form.damage).toBe(1200);
    expect(form.magazine).toBe(20);
    expect(form.fireRate).toBeCloseTo(0.67, 2);
    expect(form.criticalChance).toBeCloseTo(0.35, 5);
    expect(form.criticalMultiplier).toBe(3);
    expect(form.statusChance).toBeCloseTo(0.44, 5);
  });

  it("Atomos form is Impact 100 Semi grenades", () => {
    const atomos = allWeapons.find((w) => w.id === "atomos")!;
    const data = incarnonDataMap.get("atomos")!;
    const form = resolveIncarnonActiveWeapon(atomos, data, { 1: 0 });
    expect(form.impact).toBe(100);
    expect(form.triggerType).toBe("Semi");
    expect(form.fireRate).toBe(1.5);
    expect(form.magazine).toBe(21);
  });

  it("Furis form is Heat 100 Held / 26%/3.4x/24%", () => {
    const furis = allWeapons.find((w) => w.id === "furis")!;
    const data = incarnonDataMap.get("furis")!;
    const form = resolveIncarnonActiveWeapon(furis, data, { 1: 0 });
    expect(form.heat).toBe(100);
    expect(form.damage).toBe(100);
    expect(form.triggerType).toBe("Held");
    expect(form.fireRate).toBe(12);
    expect(form.magazine).toBe(280);
    expect(form.criticalChance).toBeCloseTo(0.26, 5);
    expect(form.criticalMultiplier).toBeCloseTo(3.4, 5);
    expect(form.statusChance).toBeCloseTo(0.24, 5);
  });

  it("Mk1-Furis form is Heat 60 Held / 20%/3x/8%", () => {
    const mk1 = allWeapons.find((w) => w.id === "mk1_furis")!;
    const data = incarnonDataMap.get("mk1_furis")!;
    const form = resolveIncarnonActiveWeapon(mk1, data, { 1: 0 });
    expect(form.heat).toBe(60);
    expect(form.damage).toBe(60);
    expect(form.triggerType).toBe("Held");
    expect(form.fireRate).toBe(12);
    expect(form.magazine).toBe(280);
    expect(form.criticalChance).toBeCloseTo(0.2, 5);
    expect(form.criticalMultiplier).toBe(3);
    expect(form.statusChance).toBeCloseTo(0.08, 5);
  });

  it("Sybaris form is 90 IPS / mag 200", () => {
    const sybaris = allWeapons.find((w) => w.id === "sybaris")!;
    const data = incarnonDataMap.get("sybaris")!;
    const form = resolveIncarnonActiveWeapon(sybaris, data, { 1: 0 });
    expect(form.damage).toBe(90);
    expect(form.magazine).toBe(200);
    expect(form.criticalChance).toBeCloseTo(0.2, 5);
  });

  it("Sybaris Prime form is IPS 110 / 25%/3x/30%", () => {
    const prime = allWeapons.find((w) => w.id === "sybaris_prime")!;
    const data = incarnonDataMap.get("sybaris_prime")!;
    const form = resolveIncarnonActiveWeapon(prime, data, { 1: 0 });
    expect(form.impact).toBeCloseTo(36.3, 5);
    expect(form.puncture).toBeCloseTo(36.3, 5);
    expect(form.slash).toBeCloseTo(37.4, 5);
    expect(form.damage).toBeCloseTo(110, 5);
    expect(form.magazine).toBe(200);
    expect(form.criticalChance).toBeCloseTo(0.25, 5);
    expect(form.criticalMultiplier).toBe(3);
    expect(form.statusChance).toBeCloseTo(0.3, 5);
  });

  it("Dex Sybaris form is IPS 96 / 30%/3x/20%", () => {
    const dex = allWeapons.find((w) => w.id === "dex_sybaris")!;
    const data = incarnonDataMap.get("dex_sybaris")!;
    const form = resolveIncarnonActiveWeapon(dex, data, { 1: 0 });
    expect(form.impact).toBeCloseTo(28.8, 5);
    expect(form.puncture).toBe(24);
    expect(form.slash).toBeCloseTo(43.2, 5);
    expect(form.damage).toBeCloseTo(96, 5);
    expect(form.magazine).toBe(200);
    expect(form.criticalChance).toBeCloseTo(0.3, 5);
    expect(form.criticalMultiplier).toBe(3);
    expect(form.statusChance).toBeCloseTo(0.2, 5);
  });

  it("Boltor form is 4×3 multishot slash bias", () => {
    const boltor = allWeapons.find((w) => w.id === "boltor")!;
    const data = incarnonDataMap.get("boltor")!;
    const form = resolveIncarnonActiveWeapon(boltor, data, { 1: 0 });
    expect(form.multishot).toBe(3);
    expect(form.slash).toBe(2.4);
    expect(form.damage).toBe(4);
    expect(form.magazine).toBe(160);
    expect(form.fireRate).toBe(10);
    expect(form.criticalChance).toBeCloseTo(0.22, 5);
  });

  it("Boltor Prime form is IPS 24 / FR 11.33 / 24%/3x/20%", () => {
    const prime = allWeapons.find((w) => w.id === "boltor_prime")!;
    const data = incarnonDataMap.get("boltor_prime")!;
    const form = resolveIncarnonActiveWeapon(prime, data, { 1: 0 });
    expect(form.multishot).toBe(3);
    expect(form.impact).toBeCloseTo(2.4, 5);
    expect(form.puncture).toBeCloseTo(7.2, 5);
    expect(form.slash).toBeCloseTo(14.4, 5);
    expect(form.damage).toBeCloseTo(24, 5);
    expect(form.fireRate).toBeCloseTo(11.33, 2);
    expect(form.criticalChance).toBeCloseTo(0.24, 5);
    expect(form.criticalMultiplier).toBe(3);
    expect(form.statusChance).toBeCloseTo(0.2, 5);
    expect(form.magazine).toBe(160);
  });

  it("Telos Boltor form is IPS 20 / FR 10.33 / 36%/3.2x/10.67%", () => {
    const telos = allWeapons.find((w) => w.id === "telos_boltor")!;
    const data = incarnonDataMap.get("telos_boltor")!;
    const form = resolveIncarnonActiveWeapon(telos, data, { 1: 0 });
    expect(form.multishot).toBe(3);
    expect(form.impact).toBe(2);
    expect(form.puncture).toBe(6);
    expect(form.slash).toBe(12);
    expect(form.damage).toBe(20);
    expect(form.fireRate).toBeCloseTo(10.33, 2);
    expect(form.criticalChance).toBeCloseTo(0.36, 5);
    expect(form.criticalMultiplier).toBeCloseTo(3.2, 5);
    expect(form.statusChance).toBeCloseTo(0.1067, 4);
    expect(form.magazine).toBe(160);
  });

  it("Angstrum form strips rocket radials for Heat Auto", () => {
    const angstrum = allWeapons.find((w) => w.id === "angstrum")!;
    const data = incarnonDataMap.get("angstrum")!;
    const form = resolveIncarnonActiveWeapon(angstrum, data, { 1: 0 });
    expect(form.heat).toBe(30);
    expect(form.triggerType).toBe("Auto");
    expect(form.magazine).toBe(120);
    expect(form.radialAttacks).toEqual([]);
  });

  it("Prisma Angstrum form is Heat 50 / 26%/2.2x/20% and strips rocket radials", () => {
    const prisma = allWeapons.find((w) => w.id === "prisma_angstrum")!;
    const data = incarnonDataMap.get("prisma_angstrum")!;
    const form = resolveIncarnonActiveWeapon(prisma, data, { 1: 0 });
    expect(form.heat).toBe(50);
    expect(form.damage).toBe(50);
    expect(form.fireRate).toBe(6);
    expect(form.magazine).toBe(120);
    expect(form.triggerType).toBe("Auto");
    expect(form.criticalChance).toBeCloseTo(0.26, 5);
    expect(form.criticalMultiplier).toBeCloseTo(2.2, 5);
    expect(form.statusChance).toBeCloseTo(0.2, 5);
    expect(form.radialAttacks).toEqual([]);
  });

  it("Vectis form is Cold 5 / mag 45 / 30%/2.5x", () => {
    const vectis = allWeapons.find((w) => w.id === "vectis")!;
    const data = incarnonDataMap.get("vectis")!;
    const form = resolveIncarnonActiveWeapon(vectis, data, { 1: 0 });
    expect(form.cold).toBe(5);
    expect(form.damage).toBe(5);
    expect(form.magazine).toBe(45);
    expect(form.fireRate).toBeCloseTo(1.333, 3);
    expect(form.criticalChance).toBeCloseTo(0.3, 5);
    expect(form.criticalMultiplier).toBeCloseTo(2.5, 5);
  });

  it("Vectis Prime form is Cold 150 / 35%/3x + Cold 150 headshot AoE", () => {
    const prime = allWeapons.find((w) => w.id === "vectis_prime")!;
    const data = incarnonDataMap.get("vectis_prime")!;
    const form = resolveIncarnonActiveWeapon(prime, data, { 1: 0 });
    expect(form.cold).toBe(150);
    expect(form.damage).toBe(150);
    expect(form.magazine).toBe(45);
    expect(form.fireRate).toBeCloseTo(1.333, 3);
    expect(form.criticalChance).toBeCloseTo(0.35, 5);
    expect(form.criticalMultiplier).toBe(3);
    expect(form.statusChance).toBeCloseTo(0.3, 5);
    const aoe = form.radialAttacks?.find((a) => /headshot/i.test(a.name));
    expect(aoe?.cold).toBe(150);
  });

  it("Boar form is Heat 20 Held beam FR 7.5 / MS 1", () => {
    const boar = allWeapons.find((w) => w.id === "boar")!;
    const data = incarnonDataMap.get("boar")!;
    const form = resolveIncarnonActiveWeapon(boar, data, { 1: 0 });
    expect(form.heat).toBe(20);
    expect(form.fireRate).toBe(7.5);
    expect(form.multishot).toBe(1);
    expect(form.triggerType).toBe("Held");
    expect(form.magazine).toBe(150);
    expect(form.criticalChance).toBeCloseTo(0.18, 5);
    expect(form.criticalMultiplier).toBeCloseTo(1.8, 5);
  });

  it("Boar Prime form is Heat 30 Held FR 8 / 20%/2.2x/24%", () => {
    const prime = allWeapons.find((w) => w.id === "boar_prime")!;
    const data = incarnonDataMap.get("boar_prime")!;
    const form = resolveIncarnonActiveWeapon(prime, data, { 1: 0 });
    expect(form.heat).toBe(30);
    expect(form.damage).toBe(30);
    expect(form.fireRate).toBe(8);
    expect(form.multishot).toBe(1);
    expect(form.triggerType).toBe("Held");
    expect(form.magazine).toBe(150);
    expect(form.criticalChance).toBeCloseTo(0.2, 5);
    expect(form.criticalMultiplier).toBeCloseTo(2.2, 5);
    expect(form.statusChance).toBeCloseTo(0.24, 5);
  });

  it("Dera form is Magnetic hybrid Semi", () => {
    const dera = allWeapons.find((w) => w.id === "dera")!;
    const data = incarnonDataMap.get("dera")!;
    const form = resolveIncarnonActiveWeapon(dera, data, { 1: 0 });
    expect(form.magnetic).toBe(80);
    expect(form.damage).toBe(330);
    expect(form.magazine).toBe(50);
  });

  it("Dera Vandal form is IPS+Mag 370 / 30%/3x/22%", () => {
    const vandal = allWeapons.find((w) => w.id === "dera_vandal")!;
    const data = incarnonDataMap.get("dera_vandal")!;
    const form = resolveIncarnonActiveWeapon(vandal, data, { 1: 0 });
    expect(form.impact).toBe(50);
    expect(form.puncture).toBe(140);
    expect(form.slash).toBe(90);
    expect(form.magnetic).toBe(90);
    expect(form.damage).toBe(370);
    expect(form.fireRate).toBe(2);
    expect(form.criticalChance).toBeCloseTo(0.3, 5);
    expect(form.criticalMultiplier).toBe(3);
    expect(form.statusChance).toBeCloseTo(0.22, 5);
  });

  it("Vasto form is 6-pellet Burst IPS 30 / 30%/2.8x/2.67%", () => {
    const vasto = allWeapons.find((w) => w.id === "vasto")!;
    const data = incarnonDataMap.get("vasto")!;
    const form = resolveIncarnonActiveWeapon(vasto, data, { 1: 0 });
    expect(form.impact).toBeCloseTo(7.5, 5);
    expect(form.puncture).toBeCloseTo(7.5, 5);
    expect(form.slash).toBe(15);
    expect(form.multishot).toBe(6);
    expect(form.triggerType).toBe("Burst");
    expect(form.damage).toBe(30);
    expect(form.magazine).toBe(24);
    expect(form.criticalChance).toBeCloseTo(0.3, 5);
    expect(form.criticalMultiplier).toBeCloseTo(2.8, 5);
    expect(form.statusChance).toBeCloseTo(0.0267, 4);
  });

  it("Vasto Prime form is IPS 70 × MS 6 Burst / 30%/3.2x/6.67%", () => {
    const prime = allWeapons.find((w) => w.id === "vasto_prime")!;
    const data = incarnonDataMap.get("vasto_prime")!;
    const form = resolveIncarnonActiveWeapon(prime, data, { 1: 0 });
    expect(form.impact).toBeCloseTo(10.5, 5);
    expect(form.puncture).toBeCloseTo(10.5, 5);
    expect(form.slash).toBe(49);
    expect(form.damage).toBe(70);
    expect(form.multishot).toBe(6);
    expect(form.triggerType).toBe("Burst");
    expect(form.magazine).toBe(24);
    expect(form.criticalChance).toBeCloseTo(0.3, 5);
    expect(form.criticalMultiplier).toBeCloseTo(3.2, 5);
    expect(form.statusChance).toBeCloseTo(0.0667, 4);
  });

  it("Ballistica form is Slash 640 Charge MS 1", () => {
    const ballistica = allWeapons.find((w) => w.id === "ballistica")!;
    const data = incarnonDataMap.get("ballistica")!;
    const form = resolveIncarnonActiveWeapon(ballistica, data, { 1: 0 });
    expect(form.slash).toBe(640);
    expect(form.damage).toBe(640);
    expect(form.multishot).toBe(1);
    expect(form.triggerType).toBe("Charge");
    expect(form.magazine).toBe(18);
  });

  it("Ballistica Prime form is Slash 830 / 30%/2.5x/30% MS 1", () => {
    const prime = allWeapons.find((w) => w.id === "ballistica_prime")!;
    const data = incarnonDataMap.get("ballistica_prime")!;
    const form = resolveIncarnonActiveWeapon(prime, data, { 1: 0 });
    expect(form.slash).toBe(830);
    expect(form.damage).toBe(830);
    expect(form.multishot).toBe(1);
    expect(form.triggerType).toBe("Charge");
    expect(form.magazine).toBe(18);
    expect(form.criticalChance).toBeCloseTo(0.3, 5);
    expect(form.criticalMultiplier).toBeCloseTo(2.5, 5);
    expect(form.statusChance).toBeCloseTo(0.3, 5);
  });

  it("Rakta Ballistica form is Slash 734 / 25%/2.2x/25% MS 1", () => {
    const rakta = allWeapons.find((w) => w.id === "rakta_ballistica")!;
    const data = incarnonDataMap.get("rakta_ballistica")!;
    const form = resolveIncarnonActiveWeapon(rakta, data, { 1: 0 });
    expect(form.slash).toBe(734);
    expect(form.damage).toBe(734);
    expect(form.multishot).toBe(1);
    expect(form.triggerType).toBe("Charge");
    expect(form.magazine).toBe(18);
    expect(form.criticalChance).toBeCloseTo(0.25, 5);
    expect(form.criticalMultiplier).toBeCloseTo(2.2, 5);
    expect(form.statusChance).toBeCloseTo(0.25, 5);
  });

  it("Stug form keeps Incarnon blob radials only", () => {
    const stug = allWeapons.find((w) => w.id === "stug")!;
    const data = incarnonDataMap.get("stug")!;
    const form = resolveIncarnonActiveWeapon(stug, data, { 1: 0 });
    expect(form.corrosive).toBe(50);
    expect(form.magazine).toBe(120);
    expect(form.radialAttacks?.every((a) => /incarnon form/i.test(a.name))).toBe(true);
    expect(form.radialAttacks?.length).toBeGreaterThan(0);
  });

  it("Dual Toxocyst form is Auto IPS 75 / mag 270", () => {
    const w = allWeapons.find((x) => x.id === "dual_toxocyst")!;
    const data = incarnonDataMap.get("dual_toxocyst")!;
    const form = resolveIncarnonActiveWeapon(w, data, { 1: 0 });
    expect(form.damage).toBe(75);
    expect(form.triggerType).toBe("Auto");
    expect(form.fireRate).toBe(4.5);
    expect(form.magazine).toBe(270);
  });

  it("Bronco form is 22 IPS × MS 7 Semi FR 2.5 / mag 20", () => {
    const bronco = allWeapons.find((w) => w.id === "bronco")!;
    const data = incarnonDataMap.get("bronco")!;
    const form = resolveIncarnonActiveWeapon(bronco, data, { 1: 0 });
    expect(form.impact).toBeCloseTo(13.2, 5);
    expect(form.puncture).toBeCloseTo(2.2, 5);
    expect(form.slash).toBeCloseTo(6.6, 5);
    expect(form.damage).toBe(22);
    expect(form.multishot).toBe(7);
    expect(form.fireRate).toBe(2.5);
    expect(form.magazine).toBe(20);
    expect(form.triggerType).toBe("Semi");
    expect(form.criticalChance).toBeCloseTo(0.2, 5);
    expect(form.criticalMultiplier).toBe(3);
  });

  it("Bronco Prime form is 34 IPS × MS 7 Semi FR 3 / 24%/3.2x/25.71%", () => {
    const prime = allWeapons.find((w) => w.id === "bronco_prime")!;
    const data = incarnonDataMap.get("bronco_prime")!;
    const form = resolveIncarnonActiveWeapon(prime, data, { 1: 0 });
    expect(form.impact).toBeCloseTo(27.2, 5);
    expect(form.puncture).toBeCloseTo(3.4, 5);
    expect(form.slash).toBeCloseTo(3.4, 5);
    expect(form.damage).toBe(34);
    expect(form.multishot).toBe(7);
    expect(form.fireRate).toBe(3);
    expect(form.magazine).toBe(20);
    expect(form.triggerType).toBe("Semi");
    expect(form.criticalChance).toBeCloseTo(0.24, 5);
    expect(form.criticalMultiplier).toBeCloseTo(3.2, 5);
    expect(form.statusChance).toBeCloseTo(0.2571, 4);
  });

  it("Cestra form is Impact 10 + Puncture 40 Auto FR 6.67 / mag 150", () => {
    const cestra = allWeapons.find((w) => w.id === "cestra")!;
    const data = incarnonDataMap.get("cestra")!;
    const form = resolveIncarnonActiveWeapon(cestra, data, { 1: 0 });
    expect(form.impact).toBe(10);
    expect(form.puncture).toBe(40);
    expect(form.damage).toBe(50);
    expect(form.fireRate).toBeCloseTo(6.67, 2);
    expect(form.magazine).toBe(150);
    expect(form.triggerType).toBe("Auto");
    expect(form.criticalChance).toBeCloseTo(0.5, 5);
    expect(form.criticalMultiplier).toBe(3);
  });

  it("Sicarus form is IPS 40 Burst FR 3.5 / mag 120", () => {
    const sicarus = allWeapons.find((w) => w.id === "sicarus")!;
    const data = incarnonDataMap.get("sicarus")!;
    const form = resolveIncarnonActiveWeapon(sicarus, data, { 1: 0 });
    expect(form.impact).toBe(28);
    expect(form.puncture).toBe(6);
    expect(form.slash).toBe(6);
    expect(form.damage).toBe(40);
    expect(form.fireRate).toBe(3.5);
    expect(form.magazine).toBe(120);
    expect(form.triggerType).toBe("Burst");
    expect(form.criticalChance).toBeCloseTo(0.2, 5);
    expect(form.criticalMultiplier).toBe(3);
  });

  it("Sicarus Prime form is IPS 60 Burst FR 5 / 30%/3x/20%", () => {
    const prime = allWeapons.find((w) => w.id === "sicarus_prime")!;
    const data = incarnonDataMap.get("sicarus_prime")!;
    const form = resolveIncarnonActiveWeapon(prime, data, { 1: 0 });
    expect(form.impact).toBe(24);
    expect(form.puncture).toBe(18);
    expect(form.slash).toBe(18);
    expect(form.damage).toBe(60);
    expect(form.fireRate).toBe(5);
    expect(form.magazine).toBe(120);
    expect(form.triggerType).toBe("Burst");
    expect(form.criticalChance).toBeCloseTo(0.3, 5);
    expect(form.criticalMultiplier).toBe(3);
    expect(form.statusChance).toBeCloseTo(0.2, 5);
  });

  it("Kunai form is IPS 40 × MS 2 Auto FR 3.33 / mag 20", () => {
    const kunai = allWeapons.find((w) => w.id === "kunai")!;
    const data = incarnonDataMap.get("kunai")!;
    const form = resolveIncarnonActiveWeapon(kunai, data, { 1: 0 });
    expect(form.impact).toBe(8);
    expect(form.puncture).toBe(14);
    expect(form.slash).toBe(18);
    expect(form.damage).toBe(40);
    expect(form.multishot).toBe(2);
    expect(form.fireRate).toBeCloseTo(3.33, 2);
    expect(form.magazine).toBe(20);
    expect(form.triggerType).toBe("Auto");
    expect(form.criticalChance).toBeCloseTo(0.18, 5);
    expect(form.criticalMultiplier).toBe(2);
    expect(form.statusChance).toBeCloseTo(0.16, 5);
  });

  it("Mk1-Kunai form is IPS 24 × MS 2 / 14%/2x/5%", () => {
    const mk1 = allWeapons.find((w) => w.id === "mk1_kunai")!;
    const data = incarnonDataMap.get("mk1_kunai")!;
    const form = resolveIncarnonActiveWeapon(mk1, data, { 1: 0 });
    expect(form.impact).toBeCloseTo(4.8, 5);
    expect(form.puncture).toBeCloseTo(8.4, 5);
    expect(form.slash).toBeCloseTo(10.8, 5);
    expect(form.damage).toBeCloseTo(24, 5);
    expect(form.multishot).toBe(2);
    expect(form.fireRate).toBeCloseTo(3.33, 2);
    expect(form.magazine).toBe(20);
    expect(form.triggerType).toBe("Auto");
    expect(form.criticalChance).toBeCloseTo(0.14, 5);
    expect(form.criticalMultiplier).toBe(2);
    expect(form.statusChance).toBeCloseTo(0.05, 5);
  });

  it("Zylok form is Charge Impact/Puncture 400 / mag 12 + Heat 600 radial", () => {
    const zylok = allWeapons.find((w) => w.id === "zylok")!;
    const data = incarnonDataMap.get("zylok")!;
    const form = resolveIncarnonActiveWeapon(zylok, data, { 1: 0 });
    expect(form.impact).toBe(160);
    expect(form.puncture).toBe(240);
    expect(form.damage).toBe(400);
    expect(form.fireRate).toBe(1);
    expect(form.magazine).toBe(12);
    expect(form.triggerType).toBe("Charge");
    expect(form.criticalChance).toBeCloseTo(0.2, 5);
    expect(form.statusChance).toBeCloseTo(0.4, 5);
    const radial = form.radialAttacks?.find((a) => /incarnon form/i.test(a.name));
    expect(radial?.heat).toBe(600);
    expect(radial?.radius).toBe(6);
  });

  it("Gammacor form is Impact 80 Semi FR 1 / mag 15 + Cold radial", () => {
    const gammacor = allWeapons.find((w) => w.id === "gammacor")!;
    const data = incarnonDataMap.get("gammacor")!;
    const form = resolveIncarnonActiveWeapon(gammacor, data, { 1: 0 });
    expect(form.impact).toBe(80);
    expect(form.damage).toBe(80);
    expect(form.fireRate).toBe(1);
    expect(form.magazine).toBe(15);
    expect(form.triggerType).toBe("Semi");
    expect(form.criticalChance).toBeCloseTo(0.14, 5);
    expect(form.criticalMultiplier).toBeCloseTo(1.8, 5);
    const radial = form.radialAttacks?.find((a) => /incarnon form/i.test(a.name));
    expect(radial?.cold).toBe(660);
  });

  it("Synoid Gammacor form is Impact 100 / 20%/2x/28% + Cold 800 radial", () => {
    const synoid = allWeapons.find((w) => w.id === "synoid_gammacor")!;
    const data = incarnonDataMap.get("synoid_gammacor")!;
    const form = resolveIncarnonActiveWeapon(synoid, data, { 1: 0 });
    expect(form.impact).toBe(100);
    expect(form.damage).toBe(100);
    expect(form.fireRate).toBe(1);
    expect(form.magazine).toBe(15);
    expect(form.triggerType).toBe("Semi");
    expect(form.criticalChance).toBeCloseTo(0.2, 5);
    expect(form.criticalMultiplier).toBe(2);
    expect(form.statusChance).toBeCloseTo(0.28, 5);
    const radial = form.radialAttacks?.find((a) => /incarnon form/i.test(a.name));
    expect(radial?.cold).toBe(800);
  });

  it("Zylok Prime form is Charge Impact/Puncture 500 / 26%/2.4x + Heat 700 radial", () => {
    const zylokPrime = allWeapons.find((w) => w.id === "zylok_prime")!;
    const data = incarnonDataMap.get("zylok_prime")!;
    const form = resolveIncarnonActiveWeapon(zylokPrime, data, { 1: 0 });
    expect(form.impact).toBe(200);
    expect(form.puncture).toBe(300);
    expect(form.damage).toBe(500);
    expect(form.triggerType).toBe("Charge");
    expect(form.criticalChance).toBeCloseTo(0.26, 5);
    expect(form.criticalMultiplier).toBeCloseTo(2.4, 5);
    expect(form.statusChance).toBeCloseTo(0.4, 5);
    const radial = form.radialAttacks?.find((a) => /incarnon form/i.test(a.name));
    expect(radial?.heat).toBe(700);
  });

  it("Miter form is IPS 60 Auto FR 3.33 / mag 20 + Heat radial 80", () => {
    const miter = allWeapons.find((w) => w.id === "miter")!;
    const data = incarnonDataMap.get("miter")!;
    const form = resolveIncarnonActiveWeapon(miter, data, { 1: 0 });
    expect(form.impact).toBe(12);
    expect(form.puncture).toBe(6);
    expect(form.slash).toBe(42);
    expect(form.damage).toBe(60);
    expect(form.fireRate).toBeCloseTo(3.33, 2);
    expect(form.magazine).toBe(20);
    expect(form.triggerType).toBe("Auto");
    expect(form.criticalChance).toBeCloseTo(0.2, 5);
    expect(form.criticalMultiplier).toBeCloseTo(3.3, 5);
    expect(form.statusChance).toBeCloseTo(0.56, 5);
    const radial = form.radialAttacks?.find((a) => /incarnon form/i.test(a.name));
    expect(radial?.heat).toBe(80);
  });

  it("Strun form is Impact 100 Semi FR 2 / mag 40 (drops shotgun MS) + AoE", () => {
    const strun = allWeapons.find((w) => w.id === "strun")!;
    const data = incarnonDataMap.get("strun")!;
    const form = resolveIncarnonActiveWeapon(strun, data, { 1: 0 });
    expect(form.impact).toBe(100);
    expect(form.damage).toBe(100);
    expect(form.fireRate).toBe(2);
    expect(form.magazine).toBe(40);
    expect(form.multishot).toBe(1);
    expect(form.triggerType).toBe("Semi");
    expect(form.criticalChance).toBeCloseTo(0.44, 5);
    expect(form.criticalMultiplier).toBeCloseTo(2.8, 5);
    expect(form.statusChance).toBeCloseTo(0.4, 5);
    const aoe = form.radialAttacks?.find((a) => /incarnon form/i.test(a.name));
    expect(aoe?.blast).toBe(60);
    expect(aoe?.puncture).toBe(30);
    expect(aoe?.slash).toBe(80);
  });

  it("Strun Prime form is FR 2.5 / 48%/3.4x/46%", () => {
    const prime = allWeapons.find((w) => w.id === "strun_prime")!;
    const data = incarnonDataMap.get("strun_prime")!;
    const form = resolveIncarnonActiveWeapon(prime, data, { 1: 0 });
    expect(form.impact).toBe(100);
    expect(form.multishot).toBe(1);
    expect(form.fireRate).toBeCloseTo(2.5, 5);
    expect(form.criticalChance).toBeCloseTo(0.48, 5);
    expect(form.criticalMultiplier).toBeCloseTo(3.4, 5);
    expect(form.statusChance).toBeCloseTo(0.46, 5);
  });

  it("Strun Wraith form is 56%/3.4x/44%", () => {
    const wraith = allWeapons.find((w) => w.id === "strun_wraith")!;
    const data = incarnonDataMap.get("strun_wraith")!;
    const form = resolveIncarnonActiveWeapon(wraith, data, { 1: 0 });
    expect(form.impact).toBe(100);
    expect(form.fireRate).toBe(2);
    expect(form.criticalChance).toBeCloseTo(0.56, 5);
    expect(form.criticalMultiplier).toBeCloseTo(3.4, 5);
    expect(form.statusChance).toBeCloseTo(0.44, 5);
  });

  it("Mk1-Strun form is FR 1.5 / 44%/3x/40% + Blast 45 AoE", () => {
    const mk1 = allWeapons.find((w) => w.id === "mk1_strun")!;
    const data = incarnonDataMap.get("mk1_strun")!;
    const form = resolveIncarnonActiveWeapon(mk1, data, { 1: 0 });
    expect(form.impact).toBe(100);
    expect(form.damage).toBe(100);
    expect(form.fireRate).toBe(1.5);
    expect(form.multishot).toBe(1);
    expect(form.criticalChance).toBeCloseTo(0.44, 5);
    expect(form.criticalMultiplier).toBe(3);
    expect(form.statusChance).toBeCloseTo(0.4, 5);
    const aoe = form.radialAttacks?.find((a) => /incarnon form/i.test(a.name));
    expect(aoe?.blast).toBe(45);
    expect(aoe?.puncture).toBe(25);
    expect(aoe?.slash).toBe(60);
  });
});
