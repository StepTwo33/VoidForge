/**
 * Round 47 (Incarnon audit, wiki.warframe.com perk tables + notes, Jason-approved):
 * conditional perk toggles (default off), normal-form-only perks / mods, perk fire rate and reload
 * in the mod bucket, per-pellet status in form, Felarx flat crit, Burston Ready Retaliation,
 * Cannonade with Incarnon Genesis installed.
 */
import { describe, expect, it } from "vitest";
import { modsMap } from "@/data/mods";
import { allWeapons } from "@/data/weapons";
import { incarnonDataMap } from "@/data/incarnon";
import {
  INCARNON_BASE_ONLY_PERKS,
  INCARNON_CONDITIONAL_PERKS,
} from "@/data/incarnon-conditionals";
import {
  allIncarnonConditionalsOn,
  incarnonConditionalKey,
  mergeIncarnonStatChanges,
  selectedIncarnonConditionals,
} from "@/lib/calc/weapon-stat-merges";
import {
  incarnonGenesisFormTrigger,
  isIncarnonFormActive,
  resolveIncarnonActiveWeapon,
  resolveIncarnonGenesisInstalled,
} from "@/lib/calc/incarnon-active-weapon";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import { getWeaponModProfile, modCompatibleWithWeaponProfile } from "@/lib/mods/weapon-mod-tags";
import { decodeBuild, encodeBuild } from "@/lib/builds/build-url";
import type { ModSlot } from "@/lib/types";

const weapon = (id: string) => allWeapons.find((w) => w.id === id)!;
const data = (id: string) => incarnonDataMap.get(id)!;
const mods = (...ids: string[]): ModSlot[] =>
  ids.map((id, i) => ({ modId: id, rank: modsMap.get(id)!.maxRank, slotIndex: i }));

function build(id: string, sel: Record<number, number>, modIds: string[] = [], on?: Record<string, boolean>) {
  const d = data(id);
  const formActive = isIncarnonFormActive(sel, d);
  const active = resolveIncarnonActiveWeapon(weapon(id), d, sel, {});
  const inc = mergeIncarnonStatChanges(d, sel, id, { formActive, conditionalsOn: on });
  return calculateWeaponBuild(
    active,
    mods(...modIds),
    modsMap,
    inc,
    undefined,
    formActive ? { incarnonFormActive: true } : undefined,
  );
}

describe("round 47: conditional perk table", () => {
  it("every conditional / base-only key names a real evolution and real stat keys", () => {
    const evoByKey = new Map<string, { statChanges: Record<string, number>; formStatChanges?: Record<string, number> }>();
    for (const d of incarnonDataMap.values()) {
      for (const e of d.evolutions) evoByKey.set(incarnonConditionalKey(d, e), e);
    }
    for (const [key, cond] of Object.entries(INCARNON_CONDITIONAL_PERKS)) {
      const evo = evoByKey.get(key);
      expect(evo, key).toBeDefined();
      for (const k of cond.keys) expect(Object.keys(evo!.statChanges), `${key} ${k}`).toContain(k);
      for (const k of cond.formKeys ?? []) expect(Object.keys(evo!.formStatChanges ?? {}), `${key} ${k}`).toContain(k);
      expect(cond.keys.length > 0 || cond.keepFlatBaseDamage != null || (cond.formKeys?.length ?? 0) > 0, key).toBe(true);
    }
    for (const key of Object.keys(INCARNON_BASE_ONLY_PERKS)) expect(evoByKey.get(key), key).toBeDefined();
    expect(Object.keys(INCARNON_CONDITIONAL_PERKS)).toHaveLength(110);
  });

  it("conditional parts default OFF; the unconditional base damage stays (per-variant)", () => {
    const paris = data("paris");
    expect(mergeIncarnonStatChanges(paris, { 2: 1 }, "paris")?.flatBaseDamage).toBe(40);
    expect(mergeIncarnonStatChanges(paris, { 2: 1 }, "mk1_paris")?.flatBaseDamage).toBe(50);
    expect(mergeIncarnonStatChanges(paris, { 2: 1 }, "paris_prime")?.flatBaseDamage).toBe(20);
    const on = allIncarnonConditionalsOn(paris);
    expect(mergeIncarnonStatChanges(paris, { 2: 1 }, "paris", { conditionalsOn: on })?.flatBaseDamage).toBe(92);
    expect(mergeIncarnonStatChanges(paris, { 2: 1 }, "paris_prime", { conditionalsOn: on })?.flatBaseDamage).toBe(94);
  });

  it("toggle only drops the conditional keys (Vasto Lone Gun keeps +66 off, +40 / +14 mag on)", () => {
    const vasto = data("vasto");
    expect(mergeIncarnonStatChanges(vasto, { 2: 0 }, "vasto")).toEqual({ flatBaseDamage: 66 });
    const key = "vasto_incarnon|2|Lone Gun";
    expect(mergeIncarnonStatChanges(vasto, { 2: 0 }, "vasto", { conditionalsOn: { [key]: true } })).toEqual({
      flatBaseDamage: 106,
      flatMagazine: 14,
    });
  });

  it("selectedIncarnonConditionals lists only the picked perks that have a toggle", () => {
    const ruvox = data("ruvox");
    expect(selectedIncarnonConditionals(ruvox, { 2: 1, 3: 0 }).map((c) => c.key)).toEqual(["ruvox|2|Lethal Impetus"]);
    expect(selectedIncarnonConditionals(ruvox, { 2: 0 })).toEqual([]);
  });

  it("Jason's call over the wiki bug notes: perk text applies when toggled on", () => {
    // Obex / Destreza +50 base damage (wiki note says it may not apply): kept, unconditional.
    expect(mergeIncarnonStatChanges(data("obex"), { 2: 1 }, "obex")?.flatBaseDamage).toBe(50);
    expect(mergeIncarnonStatChanges(data("destreza"), { 2: 0 }, "destreza")?.flatBaseDamage).toBe(50);
    // Dual Toxocyst Ready Retaliation and Kunai / Vasto Deathtrap Trigger: as the perk describes.
    const tox = data("dual_toxocyst");
    expect(
      mergeIncarnonStatChanges(tox, { 3: 0 }, "dual_toxocyst", { conditionalsOn: allIncarnonConditionalsOn(tox) })?.reloadSpeed,
    ).toBe(1);
    const kunai = data("kunai");
    expect(
      mergeIncarnonStatChanges(kunai, { 4: 0 }, "kunai", { conditionalsOn: allIncarnonConditionalsOn(kunai) }),
    ).toMatchObject({ criticalChance: 0.4, criticalMultiplier: 1.4 });
    expect(mergeIncarnonStatChanges(data("vasto"), { 2: 1 }, "vasto")).toEqual({ flatBaseDamage: 66 });
  });
});

describe("round 47: normal-form-only perks and mods", () => {
  it("'does not affect the Incarnon Form' perks are skipped in form (Torid Extended Volley)", () => {
    const torid = data("torid");
    expect(mergeIncarnonStatChanges(torid, { 1: 0, 3: 2 }, "torid", { formActive: true })?.flatMagazine).toBeUndefined();
    expect(mergeIncarnonStatChanges(torid, { 3: 2 }, "torid")?.flatMagazine).toBe(9);
  });

  it("Incarnon Form magazine ignores magazine mods (wiki); the normal form still gets them", () => {
    const formNoMods = build("braton", { 1: 0 });
    const formMags = build("braton", { 1: 0 }, ["magazine_warp_r3"]);
    expect(formMags.magazine).toBe(formNoMods.magazine);
    const baseNoMods = build("braton", { 2: 0 });
    const baseMags = build("braton", { 2: 0 }, ["magazine_warp_r3"]);
    expect(baseMags.magazine).toBeGreaterThan(baseNoMods.magazine);
  });
});

describe("round 47: perk fire rate / reload in the mod bucket", () => {
  it("Innodem +40% attack speed adds with Fury instead of multiplying", () => {
    const w = weapon("innodem");
    const s = build("innodem", { 1: 0 }, ["fury_r3"]);
    const furyOnly = build("innodem", {}, ["fury_r3"]);
    const furyBonus = furyOnly.fireRate / w.fireRate - 1;
    expect(furyBonus).toBeCloseTo(0.3, 3);
    expect(s.fireRate).toBeCloseTo(w.fireRate * (1 + 0.4 + furyBonus), 3);
  });

  it("Ruvox -35% attack speed stays multiplicative", () => {
    const w = weapon("ruvox");
    const s = build("ruvox", { 1: 0 }, ["fury_r3"]);
    const plain = build("ruvox", { 2: 0 }, ["fury_r3"]);
    expect(s.fireRate).toBeCloseTo(plain.fireRate * 0.65, 3);
    expect(plain.fireRate).toBeGreaterThan(w.fireRate);
  });

  it("perk reload speed adds with reload mods (Burston Ready Retaliation + Fast Hands)", () => {
    const burston = data("burston");
    const rr = burston.evolutions.find((e) => e.name === "Ready Retaliation")!;
    expect(rr).toMatchObject({ tier: 3, slot: 1, statChanges: { reloadSpeed: 1 } });
    const on = { "burston_incarnon|3|Ready Retaliation": true };
    const w = weapon("burston");
    const off = build("burston", { 3: 1 }, ["fast_hands_r3"]);
    const s = build("burston", { 3: 1 }, ["fast_hands_r3"], on);
    const fastHands = w.reloadTime / off.reloadTime - 1;
    expect(s.reloadTime).toBeCloseTo(w.reloadTime / (1 + 1 + fastHands), 3);
  });
});

describe("round 47: per-pellet status in form, Felarx flat crit", () => {
  it("Vasto Survivor's Edge: +10% status split over the 6-pellet form", () => {
    const base = build("vasto", { 4: 1 });
    const plainBase = build("vasto", {});
    expect(base.statusChance - plainBase.statusChance).toBeCloseTo(0.1, 4);
    const form = build("vasto", { 1: 0, 4: 1 });
    const plainForm = build("vasto", { 1: 0 });
    expect(form.statusChance - plainForm.statusChance).toBeCloseTo(0.1 / 6, 4);
  });

  it("Kunai Survivor's Edge: +12% status, +6% per projectile in form", () => {
    const form = build("kunai", { 1: 0, 4: 2 });
    const plainForm = build("kunai", { 1: 0 });
    expect(form.statusChance - plainForm.statusChance).toBeCloseTo(0.06, 4);
  });

  it("Felarx Brutal Edge: +10% CC flat after mods, +10% status split over 4 pellets", () => {
    const plain = build("felarx", {}, ["point_blank_r3"]);
    const s = build("felarx", { 4: 0 }, ["point_blank_r3"]);
    expect(s.criticalChance - plain.criticalChance).toBeCloseTo(0.1, 4);
    expect(s.statusChance - plain.statusChance).toBeCloseTo(0.025, 4);
    const formPlain = build("felarx", { 1: 0 });
    const form = build("felarx", { 1: 0, 4: 0 });
    expect(form.statusChance - formPlain.statusChance).toBeCloseTo(0.1, 4);
  });
});

describe("round 47: Cannonade with Incarnon Genesis installed", () => {
  const fits = (wid: string, modId: string, installed: boolean) => {
    const d = data(wid);
    const profile = getWeaponModProfile(weapon(wid), {
      incarnonFormTriggerType: incarnonGenesisFormTrigger(d, installed),
    });
    return modCompatibleWithWeaponProfile(modId, profile);
  };

  it("installed: both forms must be semi-auto (Torid, Dual Toxocyst, Vasto, Vasto Prime blocked)", () => {
    expect(fits("torid", "semi_rifle_cannonade", true)).toBe(false);
    expect(fits("dual_toxocyst", "semi_pistol_cannonade", true)).toBe(false);
    expect(fits("vasto", "semi_pistol_cannonade", true)).toBe(false);
    expect(fits("vasto_prime", "semi_pistol_cannonade", true)).toBe(false);
    expect(fits("latron", "semi_rifle_cannonade", true)).toBe(true);
    expect(fits("bronco", "semi_shotgun_cannonade", true) || fits("bronco", "semi_pistol_cannonade", true)).toBe(true);
  });

  it("not installed: normal-form rule only", () => {
    expect(fits("torid", "semi_rifle_cannonade", false)).toBe(true);
    expect(fits("vasto", "semi_pistol_cannonade", false)).toBe(true);
  });

  it("default: installed once any evolution is picked; an explicit choice wins; natives never", () => {
    const torid = data("torid");
    expect(resolveIncarnonGenesisInstalled(torid, {})).toBe(false);
    expect(resolveIncarnonGenesisInstalled(torid, { 2: 0 })).toBe(true);
    expect(resolveIncarnonGenesisInstalled(torid, { 2: 0 }, false)).toBe(false);
    expect(resolveIncarnonGenesisInstalled(torid, {}, true)).toBe(true);
    expect(resolveIncarnonGenesisInstalled(data("felarx"), { 2: 0 })).toBe(false);
  });
});

describe("round 47: share codes keep the toggles", () => {
  it("round-trips conditionals and the Genesis choice", () => {
    const code = encodeBuild({
      type: "weapon",
      itemId: "vasto",
      mods: [],
      incarnonEvolutions: { 2: 0 },
      incarnonConditionals: { "vasto_incarnon|2|Lone Gun": true, "x|1|y": false },
      incarnonGenesisInstalled: false,
    });
    const back = decodeBuild(code)!;
    expect(back.incarnonConditionals).toEqual({ "vasto_incarnon|2|Lone Gun": true });
    expect(back.incarnonGenesisInstalled).toBe(false);
  });
});

describe("round 47: description fixes", () => {
  it("Braton Mercenary Chamber shows per-variant ammo, no 'X'", () => {
    const evo = data("braton").evolutions.find((e) => e.name === "Mercenary Chamber")!;
    expect(evo.description).not.toMatch(/\bX\b/);
    expect(evo.description).toContain("1125");
  });
});
